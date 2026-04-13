'use client'

import { useState, useRef } from 'react'
import { Upload, Plus, Trash2, Star, ArrowRight, ArrowLeft } from 'lucide-react'
import type { WizardData } from './PageBuilderWizard'

interface Props {
  data: WizardData
  onUpdate: (updates: Partial<WizardData>) => void
  onNext: () => void
  onPrev: () => void
}

function PhotoPairUpload({ 
  pair, index, onUpdate, onRemove 
}: { 
  pair: WizardData['beforeAfterPhotos'][0]
  index: number
  onUpdate: (updates: Partial<typeof pair>) => void
  onRemove: () => void
}) {
  return (
    <div className="bg-white/[0.03] border border-white/8 rounded-xl p-4">
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm font-medium text-gray-300">Pair {index + 1}</span>
        <button onClick={onRemove} className="text-gray-600 hover:text-red-400 transition-colors">
          <Trash2 size={14} />
        </button>
      </div>
      
      <div className="grid grid-cols-2 gap-3 mb-3">
        <FileUploadBox 
          label="Before" 
          file={pair.beforeFile}
          preview={pair.beforeUrl}
          onChange={f => onUpdate({ beforeFile: f })}
        />
        <FileUploadBox 
          label="After" 
          file={pair.afterFile}
          preview={pair.afterUrl}
          onChange={f => onUpdate({ afterFile: f })}
        />
      </div>
      
      <div className="grid grid-cols-2 gap-2">
        <input
          type="text"
          value={pair.label}
          onChange={e => onUpdate({ label: e.target.value })}
          placeholder="Treatment label"
          className="bg-white/[0.05] border border-white/10 text-white rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-blue-500/50 placeholder-gray-600"
        />
        <input
          type="text"
          value={pair.timeframe}
          onChange={e => onUpdate({ timeframe: e.target.value })}
          placeholder="e.g. 6 weeks post-op"
          className="bg-white/[0.05] border border-white/10 text-white rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-blue-500/50 placeholder-gray-600"
        />
      </div>
    </div>
  )
}

function FileUploadBox({ 
  label, file, preview, onChange 
}: { 
  label: string; file?: File; preview?: string; onChange: (f: File) => void 
}) {
  const ref = useRef<HTMLInputElement>(null)
  const [localPreview, setLocalPreview] = useState<string>('')
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0]
    if (f) {
      onChange(f)
      setLocalPreview(URL.createObjectURL(f))
    }
  }
  
  const displayPreview = localPreview || preview
  
  return (
    <div>
      <input ref={ref} type="file" accept="image/*" onChange={handleChange} className="hidden" />
      <button
        onClick={() => ref.current?.click()}
        className="w-full aspect-square border border-dashed border-white/15 hover:border-blue-500/40 rounded-lg flex flex-col items-center justify-center gap-2 transition-colors overflow-hidden"
      >
        {displayPreview ? (
          <img src={displayPreview} alt={label} className="w-full h-full object-cover" />
        ) : (
          <>
            <Upload size={20} className="text-gray-600" />
            <span className="text-xs text-gray-600">{label}</span>
          </>
        )}
      </button>
    </div>
  )
}

function ReviewRow({ 
  review, onUpdate, onRemove 
}: {
  review: WizardData['reviews'][0]
  onUpdate: (updates: Partial<typeof review>) => void
  onRemove: () => void
}) {
  return (
    <div className="bg-white/[0.03] border border-white/8 rounded-xl p-4">
      <div className="flex items-center gap-3 mb-3">
        <input
          type="text"
          value={review.name}
          onChange={e => onUpdate({ name: e.target.value })}
          placeholder="Patient name (or Anonymous)"
          className="flex-1 bg-white/[0.05] border border-white/10 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500/50 placeholder-gray-600"
        />
        <div className="flex gap-1">
          {[1,2,3,4,5].map(n => (
            <button
              key={n}
              onClick={() => onUpdate({ rating: n })}
              className={`text-lg ${n <= review.rating ? 'text-yellow-400' : 'text-gray-700'} hover:text-yellow-400 transition-colors`}
            >
              ★
            </button>
          ))}
        </div>
        <button onClick={onRemove} className="text-gray-600 hover:text-red-400 transition-colors">
          <Trash2 size={14} />
        </button>
      </div>
      <textarea
        value={review.text}
        onChange={e => onUpdate({ text: e.target.value })}
        rows={2}
        placeholder="Review text..."
        className="w-full bg-white/[0.05] border border-white/10 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500/50 placeholder-gray-600 resize-none"
      />
    </div>
  )
}

export default function Step2Content({ data, onUpdate, onNext, onPrev }: Props) {
  const addPhotosPair = () => onUpdate({ 
    beforeAfterPhotos: [...data.beforeAfterPhotos, { label: data.treatmentName, timeframe: '', beforeUrl: '', afterUrl: '' }]
  })
  
  const updatePair = (i: number, updates: Partial<WizardData['beforeAfterPhotos'][0]>) => {
    const photos = [...data.beforeAfterPhotos]
    photos[i] = { ...photos[i], ...updates }
    onUpdate({ beforeAfterPhotos: photos })
  }
  
  const removePair = (i: number) => onUpdate({ 
    beforeAfterPhotos: data.beforeAfterPhotos.filter((_, idx) => idx !== i) 
  })

  const addReview = () => onUpdate({ 
    reviews: [...data.reviews, { name: '', rating: 5, text: '' }] 
  })
  
  const updateReview = (i: number, updates: Partial<WizardData['reviews'][0]>) => {
    const reviews = [...data.reviews]
    reviews[i] = { ...reviews[i], ...updates }
    onUpdate({ reviews })
  }
  
  const removeReview = (i: number) => onUpdate({ reviews: data.reviews.filter((_, idx) => idx !== i) })

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-bold text-white mb-1">Upload Content</h2>
        <p className="text-gray-500 text-sm">Photos and reviews make your page 3x more trustworthy. All optional.</p>
      </div>

      {/* Before/After */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-base font-semibold text-white">Before / After Photos</h3>
          <button onClick={addPhotosPair} className="text-sm text-blue-400 hover:text-blue-300 flex items-center gap-1">
            <Plus size={14} /> Add pair
          </button>
        </div>
        {data.beforeAfterPhotos.length === 0 ? (
          <button
            onClick={addPhotosPair}
            className="w-full border border-dashed border-white/10 hover:border-blue-500/30 rounded-xl py-8 text-center text-gray-600 hover:text-gray-400 transition-colors"
          >
            <Upload size={24} className="mx-auto mb-2" />
            <div className="text-sm">Click to add before/after photo pairs</div>
          </button>
        ) : (
          <div className="space-y-3">
            {data.beforeAfterPhotos.map((pair, i) => (
              <PhotoPairUpload key={i} pair={pair} index={i} onUpdate={u => updatePair(i, u)} onRemove={() => removePair(i)} />
            ))}
          </div>
        )}
      </div>

      {/* Doctor photo */}
      <div>
        <h3 className="text-base font-semibold text-white mb-3">Doctor / Team Photo</h3>
        <div className="flex items-center gap-4">
          <div className="w-20 h-20 rounded-xl border border-dashed border-white/15 flex items-center justify-center text-3xl overflow-hidden">
            {data.doctorPhotoUrl ? (
              <img src={data.doctorPhotoUrl} alt="Doctor" className="w-full h-full object-cover" />
            ) : '👨‍⚕️'}
          </div>
          <div>
            <input
              type="file"
              id="doctor-photo"
              accept="image/*"
              onChange={e => {
                const f = e.target.files?.[0]
                if (f) {
                  onUpdate({ 
                    doctorPhotoFile: f,
                    doctorPhotoUrl: URL.createObjectURL(f)
                  })
                }
              }}
              className="hidden"
            />
            <label htmlFor="doctor-photo" className="cursor-pointer text-sm text-blue-400 hover:text-blue-300 transition-colors">
              Upload photo →
            </label>
            <p className="text-xs text-gray-600 mt-1">Shown in the "Why Choose Us" section</p>
          </div>
        </div>
      </div>

      {/* Reviews */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-base font-semibold text-white">Patient Reviews</h3>
          <button onClick={addReview} className="text-sm text-blue-400 hover:text-blue-300 flex items-center gap-1">
            <Plus size={14} /> Add review
          </button>
        </div>
        
        {/* AI Reviews toggle */}
        <label className="flex items-center gap-3 p-4 border border-white/8 rounded-xl mb-3 cursor-pointer hover:border-white/15 transition-colors">
          <input
            type="checkbox"
            checked={data.generateAIReviews}
            onChange={e => onUpdate({ generateAIReviews: e.target.checked })}
            className="w-4 h-4 accent-blue-500"
          />
          <div>
            <div className="text-sm font-medium text-white">Generate AI Reviews (1 credit)</div>
            <div className="text-xs text-gray-600">5 realistic patient reviews based on your treatment. Clearly labeled as AI-generated.</div>
          </div>
        </label>
        
        {data.reviews.length > 0 && (
          <div className="space-y-3">
            {data.reviews.map((r, i) => (
              <ReviewRow key={i} review={r} onUpdate={u => updateReview(i, u)} onRemove={() => removeReview(i)} />
            ))}
          </div>
        )}
      </div>

      {/* Nav */}
      <div className="flex justify-between pt-4 border-t border-white/5">
        <button onClick={onPrev} className="flex items-center gap-2 text-gray-500 hover:text-white text-sm transition-colors">
          <ArrowLeft size={14} /> Back
        </button>
        <button onClick={onNext} className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-6 py-2.5 rounded-lg font-semibold text-sm transition-colors">
          Continue <ArrowRight size={16} />
        </button>
      </div>
    </div>
  )
}
