import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { createAdminSupabaseClient } from '@/lib/supabase'
import Link from 'next/link'
import { Plus, FileText, Coins, TrendingUp, ArrowRight } from 'lucide-react'
import { formatDate } from '@/lib/utils'

export default async function DashboardPage() {
  const session = await getServerSession(authOptions)
  const supabase = createAdminSupabaseClient()

  const [{ data: user }, { data: pages }] = await Promise.all([
    supabase.from('users').select('*').eq('email', session!.user.email).single(),
    supabase.from('pages').select('*').eq('user_id', session!.user.id).order('created_at', { ascending: false }).limit(5),
  ])

  const pageCount = pages?.length || 0
  const credits = user?.credits || 0
  const plan = user?.plan || 'free'

  return (
    <div className="max-w-5xl">
      {/* Welcome */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white mb-1">
          Good to have you back{session?.user.name ? `, ${session.user.name.split(' ')[0]}` : ''} 👋
        </h1>
        <p className="text-gray-500">Build landing pages that convert browsers into patients.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="bg-white/[0.03] border border-white/8 rounded-2xl p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-9 h-9 bg-blue-500/15 rounded-xl flex items-center justify-center">
              <FileText size={16} className="text-blue-400" />
            </div>
            <span className="text-sm text-gray-500">Pages Created</span>
          </div>
          <div className="text-3xl font-bold text-white">{pageCount}</div>
        </div>
        
        <div className="bg-white/[0.03] border border-white/8 rounded-2xl p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-9 h-9 bg-yellow-500/15 rounded-xl flex items-center justify-center">
              <Coins size={16} className="text-yellow-400" />
            </div>
            <span className="text-sm text-gray-500">Credits Left</span>
          </div>
          <div className="text-3xl font-bold text-white">{credits}</div>
        </div>
        
        <div className="bg-white/[0.03] border border-white/8 rounded-2xl p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-9 h-9 bg-purple-500/15 rounded-xl flex items-center justify-center">
              <TrendingUp size={16} className="text-purple-400" />
            </div>
            <span className="text-sm text-gray-500">Current Plan</span>
          </div>
          <div className="text-3xl font-bold text-white capitalize">{plan}</div>
        </div>
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <Link
          href="/dashboard/new"
          className="group bg-blue-600/10 hover:bg-blue-600/15 border border-blue-500/20 hover:border-blue-500/40 rounded-2xl p-6 transition-all"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 bg-blue-600/20 rounded-xl flex items-center justify-center">
              <Plus size={20} className="text-blue-400" />
            </div>
            <ArrowRight size={16} className="text-blue-500 opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
          <h3 className="font-semibold text-white mb-1">Create New Page</h3>
          <p className="text-sm text-gray-500">Build a conversion-optimized treatment page in 5 minutes.</p>
          <div className="mt-3 text-xs text-blue-400">Uses 1 credit per language →</div>
        </Link>
        
        <Link
          href="/dashboard/brand"
          className="group bg-white/[0.03] hover:bg-white/[0.05] border border-white/8 hover:border-white/15 rounded-2xl p-6 transition-all"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 bg-white/8 rounded-xl flex items-center justify-center text-xl">
              🎨
            </div>
            <ArrowRight size={16} className="text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
          <h3 className="font-semibold text-white mb-1">Set Up Brand</h3>
          <p className="text-sm text-gray-500">Upload logo, set colors, and save clinic contact info.</p>
          <div className="mt-3 text-xs text-gray-600">Applied to all your pages →</div>
        </Link>
      </div>

      {/* Recent pages */}
      {pages && pages.length > 0 ? (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-white">Recent Pages</h2>
            <Link href="/dashboard/pages" className="text-sm text-blue-400 hover:text-blue-300 transition-colors">
              View all →
            </Link>
          </div>
          <div className="space-y-3">
            {pages.map(page => (
              <Link
                key={page.id}
                href={`/dashboard/pages/${page.id}`}
                className="flex items-center justify-between bg-white/[0.03] hover:bg-white/[0.05] border border-white/8 rounded-xl p-4 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className={`w-2 h-2 rounded-full flex-shrink-0 ${
                    page.status === 'ready' ? 'bg-emerald-400' :
                    page.status === 'generating' ? 'bg-yellow-400 animate-pulse' :
                    page.status === 'error' ? 'bg-red-400' :
                    'bg-gray-600'
                  }`} />
                  <div>
                    <div className="font-medium text-white text-sm">{page.treatment_name}</div>
                    <div className="text-xs text-gray-600">{page.treatment_category} · {formatDate(page.created_at)}</div>
                  </div>
                </div>
                <ArrowRight size={14} className="text-gray-600" />
              </Link>
            ))}
          </div>
        </div>
      ) : (
        <div className="text-center py-16 border border-white/5 rounded-2xl bg-white/[0.02]">
          <div className="text-4xl mb-4">🚀</div>
          <h3 className="text-lg font-semibold text-white mb-2">Build your first page</h3>
          <p className="text-gray-500 text-sm mb-6 max-w-sm mx-auto">
            You have {credits} credits. Each page in each language costs 1 credit.
          </p>
          <Link
            href="/dashboard/new"
            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-6 py-2.5 rounded-lg font-semibold text-sm transition-colors"
          >
            <Plus size={16} /> Create Page
          </Link>
        </div>
      )}
    </div>
  )
}
