'use client'

import { ArrowRight, ArrowLeft, Coins } from 'lucide-react'
import type { WizardData } from './PageBuilderWizard'
import { cn } from '@/lib/utils'

interface Props {
  data: WizardData
  onUpdate: (updates: Partial<WizardData>) => void
  onNext: () => void
  onPrev: () => void
}

const SECTIONS = [
  { key: 'hero', label: 'Hero Section', desc: 'H1, subheading, CTA, trust bar' },
  { key: 'reasons', label: 'Reasons / Benefits', desc: 'Why patients choose this treatment' },
  { key: 'procedure', label: 'Procedure Steps', desc: 'How it works, step by step' },
  { key: 'gallery', label: 'Before/After Gallery', desc: 'Photo slider component' },
  { key: 'pricing', label: 'Pricing Calculator', desc: 'Interactive price estimator' },
  { key: 'reviews', label: 'Reviews', desc: 'Patient testimonials' },
  { key: 'advantages', label: 'Why Choose Us', desc: 'Doctor profile, clinic stats' },
  { key: 'faq', label: 'FAQ', desc: 'AI-generated common questions' },
  { key: 'contact', label: 'Contact / CTA', desc: 'Booking form, phone, map' },
] as const

export default function Step3Config({ data, onUpdate, onNext, onPrev }: Props) {
  const toggleTheme = (t: 'dark' | 'light') => {
    const current = data.themes
    if (current.includes(t)) {
      if (current.length > 1) onUpdate({ themes: current.filter(x => x !== t) })
    } else {
      onUpdate({ themes: [...current, t] })
    }
  }

  const toggleLang = (l: 'en' | 'de') => {
    const current = data.languages
    if (current.includes(l)) {
      if (current.length > 1) onUpdate({ languages: current.filter(x => x !== l) })
    } else {
      onUpdate({ languages: [...current, l] })
    }
  }

  const toggleSection = (key: string) => {
    onUpdate({ sections: { ...data.sections, [key]: !data.sections[key as keyof typeof data.sections] } })
  }

  // Calculate credits
  const creditsNeeded = data.languages.length + (data.generateAIReviews ? 1 : 0)

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-bold text-white mb-1">Configure Your Page</h2>
        <p className="text-gray-500 text-sm">Choose themes, languages, and sections to include.</p>
      </div>

      {/* Themes */}
      <div>
        <h3 className="text-base font-semibold text-white mb-3">Theme</h3>
        <div className="grid grid-cols-2 gap-3">
          {(['dark', 'light'] as const).map(t => (
            <button
              key={t}
              onClick={() => toggleTheme(t)}
              className={cn(
                'flex items-center gap-3 p-4 rounded-xl border transition-all',
                data.themes.includes(t)
                  ? 'border-blue-500/40 bg-blue-600/10'
                  : 'border-white/8 hover:border-white/15'
              )}
            >
              <span className="text-2xl">{t === 'dark' ? '🌙' : '☀️'}</span>
              <div className="text-left">
                <div className="text-sm font-medium text-white capitalize">{t} Mode</div>
                <div className="text-xs text-gray-600">
                  {t === 'dark' ? 'Premium, modern look' : 'Clean, clinical look'}
                </div>
              </div>
              <div className={cn(
                'ml-auto w-5 h-5 rounded-full border-2 flex items-center justify-center',
                data.themes.includes(t) ? 'border-blue-500 bg-blue-500' : 'border-gray-600'
              )}>
                {data.themes.includes(t) && <div className="w-2 h-2 rounded-full bg-white" />}
              </div>
            </button>
          ))}
        </div>
        {data.themes.length === 2 && (
          <p className="text-xs text-emerald-400 mt-2">✓ Both themes — A/B test which converts better</p>
        )}
      </div>

      {/* Languages */}
      <div>
        <h3 className="text-base font-semibold text-white mb-3">Languages</h3>
        <div className="grid grid-cols-2 gap-3">
          {([
            { code: 'en', flag: '🇬🇧', name: 'English' },
            { code: 'de', flag: '🇩🇪', name: 'German (Deutsch)' },
          ] as const).map(l => (
            <button
              key={l.code}
              onClick={() => toggleLang(l.code)}
              className={cn(
                'flex items-center gap-3 p-4 rounded-xl border transition-all',
                data.languages.includes(l.code)
                  ? 'border-blue-500/40 bg-blue-600/10'
                  : 'border-white/8 hover:border-white/15'
              )}
            >
              <span className="text-2xl">{l.flag}</span>
              <div className="text-left">
                <div className="text-sm font-medium text-white">{l.name}</div>
                <div className="text-xs text-gray-600">1 credit</div>
              </div>
              <div className={cn(
                'ml-auto w-5 h-5 rounded-full border-2 flex items-center justify-center',
                data.languages.includes(l.code) ? 'border-blue-500 bg-blue-500' : 'border-gray-600'
              )}>
                {data.languages.includes(l.code) && <div className="w-2 h-2 rounded-full bg-white" />}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* CTA URL */}
      <div className="space-y-1.5">
        <label className="text-sm font-medium text-gray-300">CTA Destination URL</label>
        <input
          type="text"
          value={data.ctaUrl}
          onChange={e => onUpdate({ ctaUrl: e.target.value })}
          placeholder="#contact or https://booking.clinicname.com"
          className="w-full bg-white/[0.05] border border-white/10 text-white rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500/50 placeholder-gray-600"
        />
        <p className="text-xs text-gray-600">Where "Book Appointment" buttons will link to</p>
      </div>

      {/* Sections */}
      <div>
        <h3 className="text-base font-semibold text-white mb-3">Sections to Include</h3>
        <div className="space-y-2">
          {SECTIONS.map(section => (
            <label
              key={section.key}
              className={cn(
                'flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors',
                data.sections[section.key] ? 'border-white/10 bg-white/[0.03]' : 'border-white/5 opacity-50'
              )}
            >
              <input
                type="checkbox"
                checked={data.sections[section.key]}
                onChange={() => toggleSection(section.key)}
                className="w-4 h-4 accent-blue-500"
              />
              <div>
                <div className="text-sm font-medium text-white">{section.label}</div>
                <div className="text-xs text-gray-600">{section.desc}</div>
              </div>
            </label>
          ))}
        </div>
      </div>

      {/* Credit summary */}
      <div className="flex items-center justify-between bg-blue-600/10 border border-blue-500/20 rounded-xl px-4 py-3">
        <div className="flex items-center gap-2 text-sm text-blue-300">
          <Coins size={16} />
          This generation will use <strong>{creditsNeeded} credit{creditsNeeded !== 1 ? 's' : ''}</strong>
        </div>
        <span className="text-xs text-gray-500">
          {data.languages.length} language{data.languages.length !== 1 ? 's' : ''}
          {data.generateAIReviews ? ' + AI reviews' : ''}
        </span>
      </div>

      {/* Nav */}
      <div className="flex justify-between pt-4 border-t border-white/5">
        <button onClick={onPrev} className="flex items-center gap-2 text-gray-500 hover:text-white text-sm transition-colors">
          <ArrowLeft size={14} /> Back
        </button>
        <button onClick={onNext} className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-6 py-2.5 rounded-lg font-semibold text-sm transition-colors">
          Generate Page <ArrowRight size={16} />
        </button>
      </div>
    </div>
  )
}
