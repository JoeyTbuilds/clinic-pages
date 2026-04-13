import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { generatePageContent, generateAIReviews } from '@/lib/ai'
import { createAdminSupabaseClient } from '@/lib/supabase'

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await req.json()
    const { 
      treatmentName, treatmentCategory, description, benefits, procedureSteps,
      duration, recovery, anesthesia, startingPrice,
      languages, includeAIReviews, pageId
    } = body

    const supabase = createAdminSupabaseClient()
    
    // Check credits
    const { data: user } = await supabase
      .from('users')
      .select('credits')
      .eq('email', session.user.email)
      .single()

    const creditsNeeded = languages.length + (includeAIReviews ? 1 : 0)
    
    if (!user || user.credits < creditsNeeded) {
      return NextResponse.json({ error: 'Insufficient credits' }, { status: 402 })
    }

    // Get brand settings
    const { data: brand } = await supabase
      .from('brand_settings')
      .select('*')
      .eq('user_id', session.user.id)
      .single()

    // Update page status to generating
    if (pageId) {
      await supabase.from('pages').update({ status: 'generating' }).eq('id', pageId)
    }

    const results: Record<string, unknown> = {}
    
    // Generate content for each language
    for (const lang of languages as Array<'en' | 'de'>) {
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
        clinicName: brand?.clinic_name || session.user.name || 'Clinic',
        language: lang,
      })
      results[lang] = content
    }

    // Generate AI reviews if requested
    let aiReviews = null
    if (includeAIReviews) {
      aiReviews = await generateAIReviews(
        treatmentName,
        brand?.clinic_name || 'Clinic',
        languages[0] as 'en' | 'de',
        5
      )
    }

    // Deduct credits
    await supabase
      .from('users')
      .update({ credits: user.credits - creditsNeeded, updated_at: new Date().toISOString() })
      .eq('email', session.user.email)

    // Update page with generated content
    if (pageId) {
      await supabase.from('pages').update({
        status: 'ready',
        content_json: { ...results, aiReviews },
        credits_used: creditsNeeded,
        updated_at: new Date().toISOString(),
      }).eq('id', pageId)
    }

    return NextResponse.json({ 
      success: true, 
      content: results,
      aiReviews,
      creditsUsed: creditsNeeded,
    })

  } catch (error) {
    console.error('Generate error:', error)
    return NextResponse.json(
      { error: 'Generation failed', details: String(error) },
      { status: 500 }
    )
  }
}
