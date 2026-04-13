import { NextRequest, NextResponse } from 'next/server'
import { generatePageContent, generateAIReviews } from '@/lib/ai'

// DEMO MODE: Auth + Supabase bypassed until connected

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { 
      treatmentName, treatmentCategory, description, benefits, procedureSteps,
      duration, recovery, anesthesia, startingPrice,
      languages, includeAIReviews, clinicName
    } = body

    const results: Record<string, unknown> = {}
    
    // Generate content for each language
    for (const lang of (languages || ['en']) as Array<'en' | 'de'>) {
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

    // Generate AI reviews if requested
    let aiReviews = null
    if (includeAIReviews) {
      aiReviews = await generateAIReviews(
        treatmentName,
        clinicName || 'Demo Clinic',
        (languages?.[0] || 'en') as 'en' | 'de',
        5
      )
    }

    return NextResponse.json({ 
      success: true, 
      content: results,
      aiReviews,
      creditsUsed: 0, // Demo mode: free
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

    // Use Claude to modify the existing content based on the prompt
    const Anthropic = (await import('@anthropic-ai/sdk')).default
    const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 4096,
      messages: [{
        role: 'user',
        content: `You are editing an existing aesthetic clinic landing page. Here is the current content as JSON:

${JSON.stringify(existing, null, 2)}

The clinic wants this change: "${prompt}"

Apply the requested change to the content. Keep the same JSON structure. Only modify what's needed for the request. Return ONLY the updated JSON, no commentary.`
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
