import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { buildZipExport } from '@/lib/export'
import { createAdminSupabaseClient } from '@/lib/supabase'

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await req.json()
    const { pageId } = body

    const supabase = createAdminSupabaseClient()
    
    const { data: page } = await supabase
      .from('pages')
      .select('*, brand_settings(*)')
      .eq('id', pageId)
      .eq('user_id', session.user.id)
      .single()

    if (!page) {
      return NextResponse.json({ error: 'Page not found' }, { status: 404 })
    }

    const { data: brand } = await supabase
      .from('brand_settings')
      .select('*')
      .eq('user_id', session.user.id)
      .single()

    const content = (page.content_json as Record<string, unknown>) || {}
    const enContent = content.en as Parameters<typeof buildZipExport>[0]['content']
    
    if (!enContent) {
      return NextResponse.json({ error: 'Page content not generated yet' }, { status: 400 })
    }

    const config = page.config as Record<string, unknown>
    
    const zipBuffer = await buildZipExport({
      content: enContent,
      input: {
        treatmentName: page.treatment_name,
        treatmentCategory: page.treatment_category,
        clinicName: brand?.clinic_name || 'Clinic',
        language: 'en',
        startingPrice: (config?.startingPrice as string) || undefined,
        anesthesia: (config?.anesthesia as string) || undefined,
      },
      theme: 'dark',
      language: 'en',
      brand: {
        clinicName: brand?.clinic_name || 'Clinic',
        logoUrl: brand?.logo_url || undefined,
        primaryColor: brand?.primary_color || '#2563eb',
        secondaryColor: brand?.secondary_color || '#7c3aed',
        accentColor: brand?.accent_color || '#10b981',
        phone: brand?.phone || undefined,
        email: brand?.email || undefined,
        address: brand?.address || undefined,
        mapsUrl: brand?.maps_url || undefined,
      },
      reviews: (content.aiReviews as Array<{ name: string; rating: number; text: string; treatment: string }>) || [],
      ctaUrl: (config?.ctaUrl as string) || '#contact',
    })

    return new NextResponse(zipBuffer as unknown as BodyInit, {
      headers: {
        'Content-Type': 'application/zip',
        'Content-Disposition': `attachment; filename="${page.treatment_name.replace(/\s+/g, '-').toLowerCase()}-landing-page.zip"`,
      },
    })

  } catch (error) {
    console.error('Export error:', error)
    return NextResponse.json({ error: 'Export failed' }, { status: 500 })
  }
}
