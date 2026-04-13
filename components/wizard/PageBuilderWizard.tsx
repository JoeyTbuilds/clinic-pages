'use client'

import { useState } from 'react'
import { CheckCircle2, Loader2 } from 'lucide-react'
import Step1Treatment from './Step1Treatment'
import Step2Content from './Step2Content'
import Step3Config from './Step3Config'
import Step4Generate from './Step4Generate'
import Step5Preview from './Step5Preview'
import { cn } from '@/lib/utils'

export type WizardData = {
  // Step 1: Treatment + Brand
  treatmentName: string
  treatmentCategory: string
  description: string
  benefits: string[]
  procedureSteps: string[]
  duration: string
  recovery: string
  anesthesia: string
  startingPrice: string
  priceBreakdown: Array<{ label: string; price: number; type: 'addon' | 'package' }>
  clinicName: string
  primaryColor: string
  logoUrl?: string
  doctorName?: string
  
  // Step 2: Content
  beforeAfterPhotos: Array<{ beforeFile?: File; afterFile?: File; beforeUrl?: string; afterUrl?: string; label: string; timeframe: string }>
  reviews: Array<{ name: string; rating: number; text: string; isAI?: boolean }>
  generateAIReviews: boolean
  doctorPhotoFile?: File
  doctorPhotoUrl?: string
  
  // Step 3: Config
  themes: Array<'dark' | 'light'>
  languages: Array<'en' | 'de'>
  ctaUrl: string
  sections: {
    hero: boolean
    reasons: boolean
    procedure: boolean
    gallery: boolean
    pricing: boolean
    reviews: boolean
    advantages: boolean
    faq: boolean
    contact: boolean
  }
  
  // Step 4: Generated
  pageId?: string
  generatedContent?: Record<string, unknown>
  aiReviews?: Array<{ name: string; rating: number; text: string; treatment: string }>
  generatedImages?: {
    hero: string | null
    beforeAfter: Array<{ before: string; after: string; label: string }>
  }
}

const STEPS = [
  { id: 1, label: 'Treatment' },
  { id: 2, label: 'Content' },
  { id: 3, label: 'Configure' },
  { id: 4, label: 'Generate' },
  { id: 5, label: 'Preview' },
]

const defaultData: WizardData = {
  treatmentName: '',
  treatmentCategory: 'Face',
  description: '',
  benefits: ['', '', ''],
  procedureSteps: ['', '', ''],
  duration: '',
  recovery: '',
  anesthesia: 'Local',
  startingPrice: '',
  priceBreakdown: [],
  clinicName: '',
  primaryColor: '#e50036',
  logoUrl: undefined,
  doctorName: undefined,
  beforeAfterPhotos: [],
  reviews: [],
  generateAIReviews: false,
  themes: ['dark'],
  languages: ['en', 'de'],
  ctaUrl: '#contact',
  sections: {
    hero: true,
    reasons: true,
    procedure: true,
    gallery: true,
    pricing: true,
    reviews: true,
    advantages: true,
    faq: true,
    contact: true,
  },
}

export default function PageBuilderWizard() {
  const [step, setStep] = useState(1)
  const [data, setData] = useState<WizardData>(defaultData)

  const updateData = (updates: Partial<WizardData>) => {
    setData(prev => ({ ...prev, ...updates }))
  }

  const next = () => setStep(s => Math.min(s + 1, 5))
  const prev = () => setStep(s => Math.max(s - 1, 1))
  const goTo = (s: number) => { if (s <= step) setStep(s) }

  return (
    <div>
      {/* Progress steps */}
      <div className="flex items-center gap-0 mb-8 overflow-x-auto pb-2">
        {STEPS.map((s, i) => (
          <div key={s.id} className="flex items-center flex-shrink-0">
            <button
              onClick={() => goTo(s.id)}
              className={cn(
                'flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                step === s.id && 'bg-blue-600/15 text-blue-400 border border-blue-500/30',
                step > s.id && 'text-emerald-400 cursor-pointer',
                step < s.id && 'text-gray-600 cursor-default',
              )}
            >
              <div className={cn(
                'w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0',
                step === s.id && 'bg-blue-600 text-white',
                step > s.id && 'bg-emerald-500/20 text-emerald-400',
                step < s.id && 'bg-white/5 text-gray-600',
              )}>
                {step > s.id ? <CheckCircle2 size={14} /> : s.id}
              </div>
              {s.label}
            </button>
            {i < STEPS.length - 1 && (
              <div className={cn('w-6 h-px mx-1 flex-shrink-0', step > s.id ? 'bg-emerald-500/40' : 'bg-white/8')} />
            )}
          </div>
        ))}
      </div>

      {/* Step content */}
      <div className="bg-white/[0.03] border border-white/8 rounded-2xl p-6">
        {step === 1 && <Step1Treatment data={data} onUpdate={updateData} onNext={next} />}
        {step === 2 && <Step2Content data={data} onUpdate={updateData} onNext={next} onPrev={prev} />}
        {step === 3 && <Step3Config data={data} onUpdate={updateData} onNext={next} onPrev={prev} />}
        {step === 4 && <Step4Generate data={data} onUpdate={updateData} onNext={next} onPrev={prev} />}
        {step === 5 && <Step5Preview data={data} onUpdate={updateData} onPrev={prev} />}
      </div>
    </div>
  )
}
