import { NextRequest, NextResponse } from 'next/server'
import { generatePageContent, generateAIReviews } from '@/lib/ai'
import { generatePageImages } from '@/lib/images'

export const maxDuration = 300 // Allow longer for image generation

// Use streaming to prevent timeout on Netlify
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const {
      treatmentName, treatmentCategory, description, benefits, procedureSteps,
      duration, recovery, anesthesia, startingPrice,
      languages, includeAIReviews, clinicName
    } = body

    const encoder = new TextEncoder()
    const stream = new ReadableStream({
      async start(controller) {
        try {
          const send = (data: Record<string, unknown>) => {
            controller.enqueue(encoder.encode(`data: ${JSON.stringify(data)}\n\n`))
          }

          send({ type: 'progress', step: 'starting', message: 'Analyzing treatment data...' })

          const results: Record<string, unknown> = {}
          const langs = (languages || ['en']) as Array<'en' | 'de'>

          for (let i = 0; i < langs.length; i++) {
            const lang = langs[i]
            send({ type: 'progress', step: 'generating', message: `Generating ${lang.toUpperCase()} content...`, progress: Math.round((i / (langs.length + 1)) * 100) })

            const content = await generatePageContent({
              treatmentName,
              treatmentCategory,
              description,
              benefits,
              procedureSteps,
              duration,
              recovery,
              anesthesia,
              startingPrice,
              clinicName: clinicName || 'Demo Clinic',
              language: lang,
            })
            results[lang] = content
          }

          let aiReviews = null
          if (includeAIReviews) {
            send({ type: 'progress', step: 'reviews', message: 'Generating reviews...', progress: 60 })
            aiReviews = await generateAIReviews(
              treatmentName,
              clinicName || 'Demo Clinic',
              (languages?.[0] || 'en') as 'en' | 'de',
              5
            )
          }

          // Generate images via Gemini
          send({ type: 'progress', step: 'images', message: 'Generating hero image...', progress: 70 })
          let images = { hero: null as string | null, beforeAfter: [] as Array<{before: string, after: string, label: string}> }
          try {
            const heroResult = await generatePageImages(treatmentName, treatmentCategory || 'Body')
            images = heroResult
            if (images.hero) {
              send({ type: 'progress', step: 'images', message: `Hero image done. Generating before/after photos...`, progress: 85 })
            }
          } catch (imgErr) {
            console.error('Image generation error:', imgErr)
            send({ type: 'progress', step: 'images', message: 'Image generation skipped (will use placeholders)', progress: 90 })
          }

          send({
            type: 'done',
            success: true,
            content: results,
            aiReviews,
            images,
            creditsUsed: 0,
          })

          controller.close()
        } catch (err) {
          controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: 'error', error: String(err) })}\n\n`))
          controller.close()
        }
      }
    })

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    })
  } catch (error) {
    console.error('Generate error:', error)
    return NextResponse.json(
      { error: 'Generation failed', details: String(error) },
      { status: 500 }
    )
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json()
    const { prompt, currentContent, language } = body

    if (!prompt || !currentContent) {
      return NextResponse.json({ error: 'Missing prompt or content' }, { status: 400 })
    }

    const lang = language || 'en'
    const existing = currentContent[lang]
    if (!existing) {
      return NextResponse.json({ error: 'No content for this language' }, { status: 400 })
    }

    const Anthropic = (await import('@anthropic-ai/sdk')).default
    const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 4096,
      messages: [{
        role: 'user',
        content: `You are editing an existing aesthetic clinic landing page. Here is the current content as JSON:\n\n${JSON.stringify(existing, null, 2)}\n\nThe clinic wants this change: "${prompt}"\n\nApply the requested change to the content. Keep the same JSON structure. Only modify what's needed for the request. Return ONLY the updated JSON, no commentary.`
      }],
    })

    const text = message.content[0].type === 'text' ? message.content[0].text : ''
    const jsonText = text.replace(/^```(?:json)?\n?/m, '').replace(/\n?```$/m, '').trim()
    const updated = JSON.parse(jsonText)

    return NextResponse.json({
      success: true,
      content: { [lang]: updated },
    })
  } catch (error) {
    console.error('Customize error:', error)
    return NextResponse.json(
      { error: 'Customization failed', details: String(error) },
      { status: 500 }
    )
  }
}
