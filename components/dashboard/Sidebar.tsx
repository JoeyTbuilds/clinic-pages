'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, Plus, FileText, Palette, Settings, Zap } from 'lucide-react'
import { cn } from '@/lib/utils'

const navItems = [
  { href: '/dashboard', label: 'Overview', icon: LayoutDashboard },
  { href: '/dashboard/new', label: 'New Page', icon: Plus },
  { href: '/dashboard/pages', label: 'My Pages', icon: FileText },
  { href: '/dashboard/brand', label: 'Brand', icon: Palette },
  { href: '/dashboard/settings', label: 'Settings', icon: Settings },
]

export default function DashboardSidebar() {
  const pathname = usePathname()

  return (
    <aside className="w-64 flex-shrink-0 bg-[#0a0a14] border-r border-white/5 flex flex-col">
      {/* Logo */}
      <div className="px-6 py-5 border-b border-white/5">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-7 h-7 bg-blue-600 rounded-lg flex items-center justify-center">
            <Zap size={14} className="text-white" />
          </div>
          <span className="font-bold text-white">
            Clinic<span className="text-blue-500">Pages</span>
          </span>
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4">
        <div className="space-y-1">
          {navItems.map(item => {
            const isActive = item.href === '/dashboard' 
              ? pathname === '/dashboard'
              : pathname.startsWith(item.href)
            
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-blue-600/15 text-blue-400 border border-blue-500/20'
                    : 'text-gray-500 hover:text-gray-300 hover:bg-white/5'
                )}
              >
                <item.icon size={16} />
                {item.label}
                {item.label === 'New Page' && (
                  <span className="ml-auto text-xs bg-blue-600 text-white px-1.5 py-0.5 rounded font-medium">
                    +
                  </span>
                )}
              </Link>
            )
          })}
        </div>
      </nav>

      {/* Bottom */}
      <div className="px-3 py-4 border-t border-white/5">
        <div className="bg-gradient-to-r from-blue-600/10 to-purple-600/10 border border-blue-500/20 rounded-xl p-4">
          <div className="text-xs font-medium text-blue-400 mb-1">Need more credits?</div>
          <div className="text-xs text-gray-500 mb-3">10 credits for $29. Never expire.</div>
          <Link
            href="/dashboard/settings#billing"
            className="block text-center bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold py-2 rounded-lg transition-colors"
          >
            Buy Credits
          </Link>
        </div>
      </div>
    </aside>
  )
}
