import Link from 'next/link'
import { Plus, FileText, ExternalLink, Calendar } from 'lucide-react'
import { formatDate } from '@/lib/utils'

// DEMO MODE: No Supabase
export default async function PagesPage() {
  // eslint-disable-next-line
  const pages: any[] = []

  const categoryEmoji: Record<string, string> = {
    Face: '😊', Body: '💪', Intimate: '💙', Skin: '✨', Hair: '💇', Dental: '🦷', Eye: '👁️', Other: '🏥',
  }

  return (
    <div className="max-w-4xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white mb-1">My Pages</h1>
          <p className="text-gray-500">All your generated treatment landing pages.</p>
        </div>
        <Link
          href="/dashboard/new"
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-5 py-2.5 rounded-lg font-semibold text-sm transition-colors"
        >
          <Plus size={16} /> New Page
        </Link>
      </div>

      {pages && pages.length > 0 ? (
        <div className="space-y-3">
          {pages.map(page => {
            const config = page.config as Record<string, unknown>
            const langs = (config?.languages as string[]) || ['en']
            const themes = (config?.themes as string[]) || ['dark']
            
            return (
              <div key={page.id} className="bg-white/[0.03] border border-white/8 rounded-2xl p-5 hover:border-white/15 transition-colors">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3 flex-1 min-w-0">
                    <div className="text-2xl flex-shrink-0 mt-0.5">
                      {categoryEmoji[page.treatment_category] || '🏥'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-white">{page.treatment_name}</h3>
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                          page.status === 'ready' ? 'bg-emerald-500/15 text-emerald-400' :
                          page.status === 'generating' ? 'bg-yellow-500/15 text-yellow-400' :
                          page.status === 'error' ? 'bg-red-500/15 text-red-400' :
                          'bg-gray-500/15 text-gray-500'
                        }`}>
                          {page.status}
                        </span>
                      </div>
                      <div className="flex items-center gap-4 text-xs text-gray-600">
                        <span className="flex items-center gap-1">
                          <Calendar size={11} /> {formatDate(page.created_at)}
                        </span>
                        <span>{page.treatment_category}</span>
                        <span>{langs.map((l: string) => l.toUpperCase()).join(' + ')}</span>
                        <span>{themes.map((t: string) => t.charAt(0).toUpperCase() + t.slice(1)).join(' + ')}</span>
                        {page.credits_used > 0 && <span>{page.credits_used} credits used</span>}
                      </div>
                    </div>
                  </div>
                  
                  <Link
                    href={`/dashboard/pages/${page.id}`}
                    className="flex-shrink-0 flex items-center gap-1.5 text-sm text-blue-400 hover:text-blue-300 transition-colors"
                  >
                    <ExternalLink size={14} /> Open
                  </Link>
                </div>
              </div>
            )
          })}
        </div>
      ) : (
        <div className="text-center py-20 border border-white/5 rounded-2xl bg-white/[0.02]">
          <FileText size={40} className="text-gray-700 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-white mb-2">No pages yet</h3>
          <p className="text-gray-600 text-sm mb-6">Create your first treatment landing page to get started.</p>
          <Link
            href="/dashboard/new"
            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-6 py-2.5 rounded-lg font-semibold text-sm transition-colors"
          >
            <Plus size={16} /> Create First Page
          </Link>
        </div>
      )}
    </div>
  )
}
