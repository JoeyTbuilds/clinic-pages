import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { createAdminSupabaseClient } from '@/lib/supabase'

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const supabase = createAdminSupabaseClient()
  const { data } = await supabase
    .from('brand_settings')
    .select('*')
    .eq('user_id', session.user.id)
    .single()

  return NextResponse.json(data || null)
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()
  const supabase = createAdminSupabaseClient()

  const { data, error } = await supabase
    .from('brand_settings')
    .upsert({
      user_id: session.user.id,
      clinic_name: body.clinic_name,
      logo_url: body.logo_url || null,
      primary_color: body.primary_color || '#2563eb',
      secondary_color: body.secondary_color || '#7c3aed',
      accent_color: body.accent_color || '#10b981',
      phone: body.phone || null,
      email: body.email || null,
      address: body.address || null,
      maps_url: body.maps_url || null,
      updated_at: new Date().toISOString(),
    }, { onConflict: 'user_id' })
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}
