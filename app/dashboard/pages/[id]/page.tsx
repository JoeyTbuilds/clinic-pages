import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { createAdminSupabaseClient } from '@/lib/supabase'
import { notFound } from 'next/navigation'
import PageDetailClient from './PageDetailClient'

export default async function PageDetailPage({ params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)
  const supabase = createAdminSupabaseClient()

  const { data: page } = await supabase
    .from('pages')
    .select('*')
    .eq('id', params.id)
    .eq('user_id', session!.user.id)
    .single()

  if (!page) notFound()

  const { data: brand } = await supabase
    .from('brand_settings')
    .select('*')
    .eq('user_id', session!.user.id)
    .single()

  return <PageDetailClient page={page} brand={brand} />
}
