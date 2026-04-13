'use client'

import { useState, useEffect } from 'react'
import { Loader2, CheckCircle2, XCircle, ArrowLeft, ArrowRight, Zap } from 'lucide-react'
import type { WizardData } from './PageBuilderWizard'

interface Props {
  data: WizardData
  onUpdate: (updates: Partial<WizardData>) => void
  onNext: () => void
  onPrev: () => void
}

type GenStatus = 'idle' | 'uploading' | 'generating' | 'done' | 'error'

const STEPS_MESSAGES = [
  'Uploading photos...',
  'Analyzing treatment data...',
  'Generating copy with Claude...',
  'Translating content...',
  'Assembling page structure...',
  'Finalizing...',
]

export default function Step4Generate({ data, onUpdate, onNext, onPrev }: Props) {
  const [status, setStatus] = useState<GenStatus>('idle')
  const [error, setError] = useState('')
  const [progress, setProgress] = useState(0)
  const [progressMsg, setProgressMsg] = useState('')

  async function uploadFile(file: File, path: string): Promise<string> {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('path', path)
    
    const res = await fetch('/api/upload', { method: 'POST', body: formData })
    if (!res.ok) throw new Error('Upload failed')
    const { url } = await res.json()
    return url
  }

  async function generate() {
    setStatus('generating')
    setError('')
    setProgress(0)
    
    try {
      // Upload photos if any
      setProgressMsg(STEPS_MESSAGES[0])
      setProgress(10)
      
      const uploadedPhotos = []
      for (let i = 0; i < data.beforeAfterPhotos.length; i++) {
        const pair = data.beforeAfterPhotos[i]
        if (pair.beforeFile || pair.afterFile) {
          const [beforeUrl, afterUrl] = await Promise.all([
            pair.beforeFile ? uploadFile(pair.beforeFile, `before-after/${Date.now()}-${i}-before.${pair.beforeFile.name.split('.').pop()}`) : Promise.resolve(pair.beforeUrl || ''),
            pair.afterFile ? uploadFile(pair.afterFile, `before-after/${Date.now()}-${i}-after.${pair.afterFile.name.split('.').pop()}`) : Promise.resolve(pair.afterUrl || ''),
          ])
          uploadedPhotos.push({ ...pair, beforeUrl, afterUrl })
        } else {
          uploadedPhotos.push(pair)
        }
      }
      
      let doctorPhotoUrl = data.doctorPhotoUrl
      if (data.doctorPhotoFile) {
        setProgressMsg('Uploading doctor photo...')
        doctorPhotoUrl = await uploadFile(data.doctorPhotoFile, `doctor/${Date.now()}.${data.doctorPhotoFile.name.split('.').pop()}`)
      }
      
      setProgress(25)
      setProgressMsg(STEPS_MESSAGES[1])
      
      // Create page record first
      const createRes = await fetch('/api/pages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          treatmentName: data.treatmentName,
          treatmentCategory: data.treatmentCategory,
          config: {
            themes: data.themes,
            languages: data.languages,
            ctaUrl: data.ctaUrl,
            sections: data.sections,
            startingPrice: data.startingPrice,
            anesthesia: data.anesthesia,
          },
        }),
      })
      
      let pageId = data.pageId
      if (createRes.ok) {
        const { id } = await createRes.json()
        pageId = id
        onUpdate({ pageId: id })
      }
      
      setProgress(40)
      setProgressMsg(STEPS_MESSAGES[2])
      
      // Generate content via SSE stream (prevents timeout)
      const genRes = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          treatmentName: data.treatmentName,
          treatmentCategory: data.treatmentCategory,
          description: data.description,
          benefits: data.benefits.filter(Boolean),
          procedureSteps: data.procedureSteps.filter(Boolean),
          duration: data.duration,
          recovery: data.recovery,
          anesthesia: data.anesthesia,
          startingPrice: data.startingPrice,
          languages: data.languages,
          includeAIReviews: data.generateAIReviews,
          clinicName: data.clinicName || 'Demo Clinic',
        }),
      })

      if (!genRes.ok) {
        throw new Error(`Server error: ${genRes.status}`)
      }

      // Parse SSE stream
      const reader = genRes.body!.getReader()
      const decoder = new TextDecoder()
      let content: Record<string, unknown> = {}
      let aiReviews = null
      let buffer = ''

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        buffer += decoder.decode(value, { stream: true })
        const lines = buffer.split('\n\n')
        buffer = lines.pop() || ''

        for (const line of lines) {
          if (!line.startsWith('data: ')) continue
          try {
            const event = JSON.parse(line.slice(6))
            if (event.type === 'progress') {
              setProgressMsg(event.message || 'Generating...')
              if (event.progress) setProgress(event.progress)
            } else if (event.type === 'done') {
              content = event.content
              aiReviews = event.aiReviews
              // Store generated images
              if (event.images) {
                onUpdate({ generatedImages: event.images })
              }
            } else if (event.type === 'error') {
              throw new Error(event.error || 'Generation failed')
            }
          } catch (parseErr) {
            // Skip malformed SSE events
            if (parseErr instanceof Error && parseErr.message !== 'Generation failed') continue
            throw parseErr
          }
        }
      }
      
      setProgress(95)
      setProgressMsg(STEPS_MESSAGES[5])
      
      // Update wizard data
      onUpdate({ 
        generatedContent: content,
        aiReviews: aiReviews || [],
        beforeAfterPhotos: uploadedPhotos,
        doctorPhotoUrl,
      })
      
      setProgress(100)
      setProgressMsg('Done!')
      setStatus('done')
      
      // Auto-advance after short delay
      setTimeout(onNext, 800)
      
    } catch (err) {
      setStatus('error')
      setError(String(err))
    }
  }

  const creditsNeeded = data.languages.length + (data.generateAIReviews ? 1 : 0)

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-white mb-1">Generate Your Page</h2>
        <p className="text-gray-500 text-sm">Claude will write all the copy, translate, and assemble your landing page.</p>
      </div>

      {/* Summary */}
      {status === 'idle' && (
        <div className="space-y-4">
          <div className="bg-white/[0.03] border border-white/8 rounded-xl p-5 space-y-3">
            <h3 className="text-sm font-medium text-gray-300 mb-4">Generation Summary</h3>
            
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Treatment</span>
              <span className="text-white font-medium">{data.treatmentName}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Languages</span>
              <span className="text-white">{data.languages.map(l => l.toUpperCase()).join(' + ')}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Themes</span>
              <span className="text-white">{data.themes.map(t => t.charAt(0).toUpperCase() + t.slice(1)).join(' + ')}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Before/After Pairs</span>
              <span className="text-white">{data.beforeAfterPhotos.length}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Reviews</span>
              <span className="text-white">
                {data.reviews.length} manual{data.generateAIReviews ? ' + 5 AI-generated' : ''}
              </span>
            </div>
            <div className="flex justify-between text-sm border-t border-white/5 pt-3 mt-3">
              <span className="text-gray-300 font-medium">Credits to use</span>
              <span className="text-blue-400 font-bold">{creditsNeeded} credit{creditsNeeded !== 1 ? 's' : ''}</span>
            </div>
          </div>

          <button
            onClick={generate}
            className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 text-white py-4 rounded-xl font-bold text-base transition-colors"
          >
            <Zap size={20} />
            Generate Page Now
          </button>
          
          <p className="text-xs text-center text-gray-600">
            Takes about 30-60 seconds. Do not close this window.
          </p>
        </div>
      )}

      {/* Progress */}
      {(status === 'generating' || status === 'uploading') && (
        <div className="text-center py-8">
          <div className="w-16 h-16 rounded-full bg-blue-600/15 border border-blue-500/30 flex items-center justify-center mx-auto mb-6">
            <Loader2 size={32} className="text-blue-400 animate-spin" />
          </div>
          
          <div className="text-white font-semibold mb-2">{progressMsg}</div>
          <div className="text-sm text-gray-500 mb-6">Generating your clinic landing page...</div>
          
          {/* Progress bar */}
          <div className="max-w-sm mx-auto">
            <div className="bg-white/5 rounded-full h-2 overflow-hidden">
              <div 
                className="bg-blue-500 h-full rounded-full transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
            <div className="text-xs text-gray-600 mt-2">{progress}%</div>
          </div>
          
          <div className="mt-8 space-y-2">
            {['Analyzing treatment data', 'Writing hero copy', 'Generating FAQ', 'Translating content'].map((msg, i) => (
              <div key={msg} className={`text-xs flex items-center justify-center gap-2 ${progress > (i + 1) * 20 ? 'text-emerald-400' : 'text-gray-700'}`}>
                {progress > (i + 1) * 20 ? <CheckCircle2 size={12} /> : <div className="w-3 h-3 rounded-full border border-gray-700" />}
                {msg}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Done */}
      {status === 'done' && (
        <div className="text-center py-8">
          <div className="w-16 h-16 rounded-full bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 size={32} className="text-emerald-400" />
          </div>
          <div className="text-white font-bold text-xl mb-2">Page Generated! 🎉</div>
          <div className="text-gray-500 text-sm">Loading preview...</div>
        </div>
      )}

      {/* Error */}
      {status === 'error' && (
        <div className="space-y-4">
          <div className="text-center py-6">
            <div className="w-16 h-16 rounded-full bg-red-500/15 border border-red-500/30 flex items-center justify-center mx-auto mb-4">
              <XCircle size={32} className="text-red-400" />
            </div>
            <div className="text-white font-bold text-lg mb-2">Generation Failed</div>
            <div className="text-red-400 text-sm mb-4">{error}</div>
          </div>
          <button
            onClick={generate}
            className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 text-white py-3 rounded-xl font-semibold transition-colors"
          >
            Try Again
          </button>
        </div>
      )}

      {/* Nav */}
      {status === 'idle' || status === 'error' ? (
        <div className="flex justify-between pt-4 border-t border-white/5">
          <button onClick={onPrev} className="flex items-center gap-2 text-gray-500 hover:text-white text-sm transition-colors">
            <ArrowLeft size={14} /> Back
          </button>
        </div>
      ) : null}
    </div>
  )
}
