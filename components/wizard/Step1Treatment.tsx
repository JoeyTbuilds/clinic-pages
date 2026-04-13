'use client'

import { Plus, Trash2, ArrowRight } from 'lucide-react'
import type { WizardData } from './PageBuilderWizard'

const CATEGORIES = ['Face', 'Body', 'Intimate', 'Skin', 'Hair', 'Dental', 'Eye', 'Other']
const ANESTHESIA = ['Local', 'General', 'Twilight sedation', 'None required', 'Local + sedation']

interface Props {
  data: WizardData
  onUpdate: (updates: Partial<WizardData>) => void
  onNext: () => void
}

export default function Step1Treatment({ data, onUpdate, onNext }: Props) {
  const addBenefit = () => onUpdate({ benefits: [...data.benefits, ''] })
  const updateBenefit = (i: number, val: string) => {
    const benefits = [...data.benefits]
    benefits[i] = val
    onUpdate({ benefits })
  }
  const removeBenefit = (i: number) => onUpdate({ benefits: data.benefits.filter((_, idx) => idx !== i) })

  const addStep = () => onUpdate({ procedureSteps: [...data.procedureSteps, ''] })
  const updateStep = (i: number, val: string) => {
    const steps = [...data.procedureSteps]
    steps[i] = val
    onUpdate({ procedureSteps: steps })
  }
  const removeStep = (i: number) => onUpdate({ procedureSteps: data.procedureSteps.filter((_, idx) => idx !== i) })

  const canContinue = data.treatmentName.trim().length > 0

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-white mb-1">Treatment Details</h2>
        <p className="text-gray-500 text-sm">The more detail you provide, the better the generated copy.</p>
      </div>

      {/* Treatment name */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-gray-300">Treatment Name <span className="text-red-400">*</span></label>
          <input
            type="text"
            value={data.treatmentName}
            onChange={e => onUpdate({ treatmentName: e.target.value })}
            placeholder="e.g. Breast Augmentation, Botox, Hair Transplant"
            className="w-full bg-white/[0.05] border border-white/10 text-white rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500/50 placeholder-gray-600"
          />
        </div>
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-gray-300">Category</label>
          <select
            value={data.treatmentCategory}
            onChange={e => onUpdate({ treatmentCategory: e.target.value })}
            className="w-full bg-white/[0.05] border border-white/10 text-white rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500/50"
          >
            {CATEGORIES.map(c => <option key={c} value={c} className="bg-[#12121f]">{c}</option>)}
          </select>
        </div>
      </div>

      {/* Description */}
      <div className="space-y-1.5">
        <label className="text-sm font-medium text-gray-300">
          Description <span className="text-gray-600">(optional — AI writes if blank)</span>
        </label>
        <textarea
          value={data.description}
          onChange={e => onUpdate({ description: e.target.value })}
          rows={3}
          placeholder="Brief description of the treatment, what it addresses, who it's for..."
          className="w-full bg-white/[0.05] border border-white/10 text-white rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500/50 placeholder-gray-600 resize-none"
        />
      </div>

      {/* Benefits */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium text-gray-300">
            Key Benefits <span className="text-gray-600">(optional)</span>
          </label>
          <button onClick={addBenefit} className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1">
            <Plus size={12} /> Add
          </button>
        </div>
        {data.benefits.map((b, i) => (
          <div key={i} className="flex gap-2">
            <input
              type="text"
              value={b}
              onChange={e => updateBenefit(i, e.target.value)}
              placeholder={`Benefit ${i + 1}...`}
              className="flex-1 bg-white/[0.05] border border-white/10 text-white rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-blue-500/50 placeholder-gray-600"
            />
            <button onClick={() => removeBenefit(i)} className="text-gray-600 hover:text-red-400 transition-colors">
              <Trash2 size={14} />
            </button>
          </div>
        ))}
      </div>

      {/* Procedure steps */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium text-gray-300">
            Procedure Steps <span className="text-gray-600">(optional)</span>
          </label>
          <button onClick={addStep} className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1">
            <Plus size={12} /> Add
          </button>
        </div>
        {data.procedureSteps.map((s, i) => (
          <div key={i} className="flex gap-2 items-center">
            <span className="text-xs text-gray-600 w-4 flex-shrink-0">{i + 1}.</span>
            <input
              type="text"
              value={s}
              onChange={e => updateStep(i, e.target.value)}
              placeholder={`Step ${i + 1}...`}
              className="flex-1 bg-white/[0.05] border border-white/10 text-white rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-blue-500/50 placeholder-gray-600"
            />
            <button onClick={() => removeStep(i)} className="text-gray-600 hover:text-red-400 transition-colors">
              <Trash2 size={14} />
            </button>
          </div>
        ))}
      </div>

      {/* Duration, recovery, anesthesia, price */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-gray-300">Duration</label>
          <input
            type="text"
            value={data.duration}
            onChange={e => onUpdate({ duration: e.target.value })}
            placeholder="e.g. 1-2 hours"
            className="w-full bg-white/[0.05] border border-white/10 text-white rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500/50 placeholder-gray-600"
          />
        </div>
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-gray-300">Recovery Time</label>
          <input
            type="text"
            value={data.recovery}
            onChange={e => onUpdate({ recovery: e.target.value })}
            placeholder="e.g. 1-2 weeks"
            className="w-full bg-white/[0.05] border border-white/10 text-white rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500/50 placeholder-gray-600"
          />
        </div>
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-gray-300">Anesthesia</label>
          <select
            value={data.anesthesia}
            onChange={e => onUpdate({ anesthesia: e.target.value })}
            className="w-full bg-white/[0.05] border border-white/10 text-white rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500/50"
          >
            {ANESTHESIA.map(a => <option key={a} value={a} className="bg-[#12121f]">{a}</option>)}
          </select>
        </div>
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-gray-300">Starting Price</label>
          <input
            type="text"
            value={data.startingPrice}
            onChange={e => onUpdate({ startingPrice: e.target.value })}
            placeholder="e.g. ab CHF 2,500 or from $3,000"
            className="w-full bg-white/[0.05] border border-white/10 text-white rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500/50 placeholder-gray-600"
          />
        </div>
      </div>

      {/* Pricing add-ons */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium text-gray-300">
            Pricing Options <span className="text-gray-600">(for interactive calculator)</span>
          </label>
          <button
            onClick={() => onUpdate({ priceBreakdown: [...data.priceBreakdown, { label: '', price: 0, type: 'addon' }] })}
            className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1"
          >
            <Plus size={12} /> Add option
          </button>
        </div>
        {data.priceBreakdown.map((item, i) => (
          <div key={i} className="flex gap-2">
            <input
              type="text"
              value={item.label}
              onChange={e => {
                const updated = [...data.priceBreakdown]
                updated[i] = { ...item, label: e.target.value }
                onUpdate({ priceBreakdown: updated })
              }}
              placeholder="Option label..."
              className="flex-1 bg-white/[0.05] border border-white/10 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500/50 placeholder-gray-600"
            />
            <input
              type="number"
              value={item.price || ''}
              onChange={e => {
                const updated = [...data.priceBreakdown]
                updated[i] = { ...item, price: Number(e.target.value) }
                onUpdate({ priceBreakdown: updated })
              }}
              placeholder="Price"
              className="w-24 bg-white/[0.05] border border-white/10 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500/50 placeholder-gray-600"
            />
            <button
              onClick={() => onUpdate({ priceBreakdown: data.priceBreakdown.filter((_, idx) => idx !== i) })}
              className="text-gray-600 hover:text-red-400 transition-colors"
            >
              <Trash2 size={14} />
            </button>
          </div>
        ))}
      </div>

      {/* Next */}
      <div className="flex justify-end pt-4 border-t border-white/5">
        <button
          onClick={onNext}
          disabled={!canContinue}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-40 disabled:cursor-not-allowed text-white px-6 py-2.5 rounded-lg font-semibold text-sm transition-colors"
        >
          Continue <ArrowRight size={16} />
        </button>
      </div>
    </div>
  )
}
