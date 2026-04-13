'use client'

import { signOut } from 'next-auth/react'
import { LogOut, Coins, ChevronDown } from 'lucide-react'
import { useState } from 'react'

interface HeaderProps {
  user: {
    name?: string | null
    email: string
    credits: number
    plan: string
  }
}

export default function DashboardHeader({ user }: HeaderProps) {
  const [open, setOpen] = useState(false)
  
  return (
    <header className="h-14 border-b border-white/5 bg-[#0a0a14]/80 backdrop-blur-sm flex items-center justify-between px-6">
      <div />
      
      <div className="flex items-center gap-4">
        {/* Credits */}
        <div className="flex items-center gap-2 bg-white/[0.04] border border-white/8 rounded-lg px-3 py-1.5 text-sm">
          <Coins size={14} className="text-yellow-400" />
          <span className="text-white font-medium">{user.credits}</span>
          <span className="text-gray-600">credits</span>
        </div>
        
        {/* Plan badge */}
        <div className={`text-xs font-bold px-2 py-1 rounded uppercase tracking-wide ${
          user.plan === 'agency' ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30' :
          user.plan === 'pro' ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' :
          user.plan === 'starter' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' :
          'bg-white/5 text-gray-500 border border-white/10'
        }`}>
          {user.plan}
        </div>
        
        {/* User menu */}
        <div className="relative">
          <button
            onClick={() => setOpen(!open)}
            className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors"
          >
            <div className="w-7 h-7 rounded-full bg-blue-600/30 border border-blue-500/30 flex items-center justify-center text-xs font-bold text-blue-400">
              {(user.name || user.email)[0].toUpperCase()}
            </div>
            <span className="max-w-24 truncate">{user.name || user.email.split('@')[0]}</span>
            <ChevronDown size={14} />
          </button>
          
          {open && (
            <div className="absolute right-0 top-full mt-2 w-48 bg-[#12121f] border border-white/10 rounded-xl shadow-2xl z-50">
              <div className="px-4 py-3 border-b border-white/5">
                <div className="text-xs text-gray-500 truncate">{user.email}</div>
              </div>
              <button
                onClick={() => signOut({ callbackUrl: '/' })}
                className="flex items-center gap-2 w-full px-4 py-2.5 text-sm text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
              >
                <LogOut size={14} />
                Sign out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
