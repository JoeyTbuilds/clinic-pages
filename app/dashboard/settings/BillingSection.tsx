'use client'

import { useState } from 'react'
import { Loader2, Zap } from 'lucide-react'
import { PLANS, CREDIT_PACK } from '@/lib/stripe'

interface Props {
  user: {
    plan: string
    credits: number
  } | null
}

export default function BillingSection({ user }: Props) {
  const [loading, setLoading] = useState<string | null>(null)

  async function startCheckout(plan: string, type: 'subscription' | 'credits') {
    setLoading(plan)
    try {
      const res = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan, type }),
      })
      const { url } = await res.json()
      if (url) window.location.href = url
    } finally {
      setLoading(null)
    }
  }

  const currentPlan = user?.plan || 'free'

  return (
    <div className="bg-white/[0.03] border border-white/8 rounded-2xl p-6">
      <h2 className="text-base font-semibold text-white mb-4">Billing & Plans</h2>
      
      <div className="space-y-3 mb-6">
        {Object.entries(PLANS).map(([key, plan]) => (
          <div 
            key={key}
            className={`flex items-center justify-between p-4 rounded-xl border transition-colors ${
              currentPlan === key 
                ? 'border-blue-500/30 bg-blue-600/5' 
                : 'border-white/8 hover:border-white/15'
            }`}
          >
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-white">{plan.name}</span>
                {currentPlan === key && (
                  <span className="text-xs bg-blue-500/20 text-blue-400 px-2 py-0.5 rounded-full">Current</span>
                )}
              </div>
              <div className="text-xs text-gray-600 mt-0.5">
                ${plan.price / 100}/month · {plan.credits} credits/month
              </div>
            </div>
            {currentPlan !== key && (
              <button
                onClick={() => startCheckout(key, 'subscription')}
                disabled={loading === key}
                className="flex items-center gap-1.5 text-xs bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white px-3 py-1.5 rounded-lg font-medium transition-colors"
              >
                {loading === key ? <Loader2 size={12} className="animate-spin" /> : null}
                {currentPlan === 'free' ? 'Upgrade' : 'Switch'}
              </button>
            )}
          </div>
        ))}
      </div>

      {/* Credit pack */}
      <div className="border-t border-white/5 pt-5">
        <h3 className="text-sm font-medium text-gray-400 mb-3">Need extra credits?</h3>
        <div className="flex items-center justify-between p-4 border border-white/8 rounded-xl hover:border-emerald-500/30 transition-colors">
          <div>
            <div className="flex items-center gap-2">
              <Zap size={16} className="text-emerald-400" />
              <span className="text-sm font-medium text-white">10 Credit Pack</span>
            </div>
            <div className="text-xs text-gray-600 mt-0.5">$29 one-time · never expires · add to existing plan</div>
          </div>
          <button
            onClick={() => startCheckout('credits', 'credits')}
            disabled={loading === 'credits'}
            className="flex items-center gap-1.5 text-xs bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white px-3 py-1.5 rounded-lg font-medium transition-colors"
          >
            {loading === 'credits' ? <Loader2 size={12} className="animate-spin" /> : null}
            Buy $29
          </button>
        </div>
      </div>
    </div>
  )
}
