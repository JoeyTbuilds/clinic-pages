import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { createAdminSupabaseClient } from '@/lib/supabase'
import { formatDate } from '@/lib/utils'
import BillingSection from './BillingSection'

export default async function SettingsPage() {
  const session = await getServerSession(authOptions)
  const supabase = createAdminSupabaseClient()

  const { data: user } = await supabase
    .from('users')
    .select('*')
    .eq('email', session!.user.email)
    .single()

  return (
    <div className="max-w-2xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white mb-1">Settings</h1>
        <p className="text-gray-500">Account, billing, and plan information.</p>
      </div>

      <div className="space-y-6">
        {/* Account */}
        <div className="bg-white/[0.03] border border-white/8 rounded-2xl p-6">
          <h2 className="text-base font-semibold text-white mb-4">Account</h2>
          <div className="space-y-3">
            <div className="flex justify-between items-center py-2 border-b border-white/5">
              <span className="text-sm text-gray-500">Email</span>
              <span className="text-sm text-white">{user?.email}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-white/5">
              <span className="text-sm text-gray-500">Member since</span>
              <span className="text-sm text-white">{user ? formatDate(user.created_at) : '—'}</span>
            </div>
            <div className="flex justify-between items-center py-2">
              <span className="text-sm text-gray-500">Plan</span>
              <span className={`text-sm font-semibold capitalize ${
                user?.plan === 'agency' ? 'text-purple-400' :
                user?.plan === 'pro' ? 'text-blue-400' :
                user?.plan === 'starter' ? 'text-emerald-400' :
                'text-gray-500'
              }`}>{user?.plan || 'free'}</span>
            </div>
          </div>
        </div>

        {/* Credits */}
        <div className="bg-white/[0.03] border border-white/8 rounded-2xl p-6">
          <h2 className="text-base font-semibold text-white mb-4">Credits</h2>
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="text-3xl font-bold text-white mb-1">{user?.credits || 0}</div>
              <div className="text-sm text-gray-500">credits remaining</div>
            </div>
            <div className="text-right text-sm text-gray-600">
              <div>1 credit = 1 page</div>
              <div>in 1 language</div>
              <div>in 1 theme</div>
            </div>
          </div>
          
          {/* Progress bar */}
          {user?.plan !== 'free' && (
            <div className="bg-white/5 rounded-full h-2 overflow-hidden">
              <div 
                className="bg-blue-500 h-full rounded-full"
                style={{ width: `${Math.min(100, (user?.credits || 0) / (user?.plan === 'agency' ? 60 : user?.plan === 'pro' ? 20 : 5) * 100)}%` }}
              />
            </div>
          )}
        </div>

        {/* Billing */}
        <div id="billing">
          <BillingSection user={user} />
        </div>

        {/* Deploy Guide */}
        <div className="bg-white/[0.03] border border-white/8 rounded-2xl p-6">
          <h2 className="text-base font-semibold text-white mb-2">Deploying Your Pages</h2>
          <p className="text-gray-500 text-sm mb-4">Export your page as a ZIP and deploy for free on any of these platforms:</p>
          
          <div className="space-y-3">
            {[
              { name: 'Cloudflare Pages', desc: 'Free, global CDN, custom domain. Recommended.', href: 'https://pages.cloudflare.com', badge: 'Recommended' },
              { name: 'Netlify', desc: 'Free tier, drag-and-drop deploy, custom domain.', href: 'https://netlify.com', badge: 'Easy' },
              { name: 'GitHub Pages', desc: 'Free, good for static sites. Requires GitHub account.', href: 'https://pages.github.com', badge: 'Free' },
            ].map(platform => (
              <div key={platform.name} className="flex items-center justify-between p-3 border border-white/8 rounded-xl">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-white">{platform.name}</span>
                    <span className="text-xs bg-blue-500/15 text-blue-400 px-2 py-0.5 rounded-full">{platform.badge}</span>
                  </div>
                  <div className="text-xs text-gray-600 mt-0.5">{platform.desc}</div>
                </div>
                <a href={platform.href} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-400 hover:text-blue-300">
                  Visit →
                </a>
              </div>
            ))}
          </div>
          
          <div className="mt-4 p-4 bg-white/[0.02] rounded-xl text-xs text-gray-600">
            <strong className="text-gray-400">Quick deploy guide:</strong> Download ZIP → Extract → Drag folder to Netlify/Cloudflare Pages → Set custom domain → Done.
          </div>
        </div>
      </div>
    </div>
  )
}
