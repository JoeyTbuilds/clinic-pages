import Link from 'next/link'
import { CheckCircle2, ArrowLeft } from 'lucide-react'

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-[#070710] text-gray-100 py-16 px-6">
      <div className="max-w-5xl mx-auto">
        <Link href="/" className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-white mb-8 transition-colors">
          <ArrowLeft size={14} /> Back
        </Link>
        
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold mb-4">Simple credit-based pricing</h1>
          <p className="text-gray-400 text-lg">1 credit = 1 treatment page, 1 language, 1 theme. Credits reset monthly.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {[
            { name: 'Starter', price: '$49', credits: 5, monthly: true, highlight: false, features: ['5 credits/month', 'EN + DE languages', 'Dark + Light modes', 'Before/After gallery', 'Pricing calculator', 'ZIP export', 'Email support'] },
            { name: 'Pro', price: '$149', credits: 20, monthly: true, highlight: true, features: ['20 credits/month', 'EN + DE languages', 'A/B theme variants', 'AI review generation', 'Before/After watermark', '3 clinic profiles', 'Priority support', 'Custom domain guide'] },
            { name: 'Agency', price: '$349', credits: 60, monthly: true, highlight: false, features: ['60 credits/month', 'Unlimited clinics', 'White-label export', 'All languages', 'API access', 'Dedicated support', 'Custom templates'] },
          ].map(plan => (
            <div key={plan.name} className={`rounded-2xl p-8 border relative ${plan.highlight ? 'bg-blue-600/10 border-blue-500/40' : 'bg-white/[0.03] border-white/8'}`}>
              {plan.highlight && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-xs font-bold px-4 py-1 rounded-full">MOST POPULAR</div>
              )}
              <div className="mb-6">
                <div className="text-sm text-gray-500">{plan.name}</div>
                <div className="text-4xl font-bold mt-1">{plan.price}<span className="text-lg font-normal text-gray-500">/mo</span></div>
                <div className="text-sm text-blue-400 mt-1">{plan.credits} credits/month</div>
              </div>
              <ul className="space-y-2.5 mb-8">
                {plan.features.map(f => (
                  <li key={f} className="flex items-center gap-2 text-sm">
                    <CheckCircle2 size={15} className="text-emerald-400 flex-shrink-0" />
                    <span className="text-gray-300">{f}</span>
                  </li>
                ))}
              </ul>
              <Link href="/login" className={`block text-center py-3 rounded-lg font-semibold transition-all ${plan.highlight ? 'bg-blue-600 hover:bg-blue-500 text-white' : 'border border-white/15 hover:border-white/30 text-white'}`}>
                Get Started
              </Link>
            </div>
          ))}
        </div>

        {/* Credits pack */}
        <div className="max-w-md mx-auto bg-emerald-500/[0.06] border border-emerald-500/20 rounded-2xl p-6 text-center">
          <div className="text-2xl mb-2">⚡</div>
          <h3 className="text-lg font-bold text-white mb-1">10 Credit Pack — $29</h3>
          <p className="text-gray-400 text-sm mb-4">One-time purchase. Never expires. Stack with any plan.</p>
          <Link href="/login" className="inline-block bg-emerald-600 hover:bg-emerald-500 text-white px-6 py-2.5 rounded-lg font-semibold text-sm transition-colors">
            Buy Credits →
          </Link>
        </div>

        {/* Credit usage table */}
        <div className="mt-16 max-w-lg mx-auto">
          <h2 className="text-xl font-bold text-center mb-6">How credits are used</h2>
          <div className="bg-white/[0.03] border border-white/8 rounded-2xl overflow-hidden">
            {[
              ['1 page, 1 language, 1 theme', '1 credit'],
              ['Additional language (same page)', '1 credit'],
              ['Additional theme variant', '1 credit'],
              ['AI review generation (5 reviews)', '1 credit'],
              ['Edit / regenerate section', 'Free'],
              ['Before/After photo processing', 'Free'],
            ].map(([action, cost]) => (
              <div key={action} className="flex justify-between items-center px-5 py-3.5 border-b border-white/5 last:border-0">
                <span className="text-sm text-gray-400">{action}</span>
                <span className={`text-sm font-semibold ${cost === 'Free' ? 'text-emerald-400' : 'text-blue-400'}`}>{cost}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
