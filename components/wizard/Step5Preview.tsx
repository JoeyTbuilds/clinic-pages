'use client'

import { useState, useRef } from 'react'
import { Download, Monitor, Smartphone, ArrowLeft, Loader2, Sun, Moon, Globe, Sparkles, Send } from 'lucide-react'
import type { WizardData } from './PageBuilderWizard'
import { generateHTML } from '@/lib/export'

interface Props {
  data: WizardData
  onUpdate: (updates: Partial<WizardData>) => void
  onPrev: () => void
}

export default function Step5Preview({ data, onUpdate, onPrev }: Props) {
  const [viewport, setViewport] = useState<'desktop' | 'mobile'>('desktop')
  const [theme, setTheme] = useState<'dark' | 'light'>(data.themes[0] || 'dark')
  const [lang, setLang] = useState<'en' | 'de'>(data.languages[0] || 'en')
  const [exporting, setExporting] = useState(false)
  const [customPrompt, setCustomPrompt] = useState('')
  const [customizing, setCustomizing] = useState(false)
  const [customHistory, setCustomHistory] = useState<string[]>([])
  const promptRef = useRef<HTMLTextAreaElement>(null)

  const content = data.generatedContent?.[lang]
  
  const clinicName = data.clinicName?.trim() || 'Your Clinic'
  const primaryColor = data.primaryColor || '#e50036'

  // Generate preview HTML
  const previewHtml = content ? generateHTML({
    content: content as Parameters<typeof generateHTML>[0]['content'],
    input: {
      treatmentName: data.treatmentName,
      treatmentCategory: data.treatmentCategory,
      clinicName,
      language: lang,
      startingPrice: data.startingPrice,
      anesthesia: data.anesthesia,
      duration: data.duration,
      recovery: data.recovery,
    },
    theme,
    language: lang,
    brand: {
      clinicName,
      logoUrl: data.logoUrl,
      primaryColor,
      secondaryColor: primaryColor,
      accentColor: primaryColor,
    },
    reviews: [
      ...(data.reviews.map(r => ({ ...r, treatment: data.treatmentName }))),
      ...(data.aiReviews || []).map(r => ({ ...r, isAI: true })),
    ],
    beforeAfterPhotos: [
      // User-uploaded photos first
      ...data.beforeAfterPhotos.filter(p => p.beforeUrl && p.afterUrl).map(p => ({
        beforeUrl: p.beforeUrl!,
        afterUrl: p.afterUrl!,
        label: p.label,
        timeframe: p.timeframe,
      })),
      // Then AI-generated photos
      ...(data.generatedImages?.beforeAfter || []).map((pair, i) => ({
        beforeUrl: pair.before,
        afterUrl: pair.after,
        label: pair.label || `Patient ${i + 1}`,
        timeframe: '3 months',
      })),
    ],
    heroImageUrl: data.generatedImages?.hero || undefined,
    doctorPhotoUrl: data.doctorPhotoUrl,
    ctaUrl: data.ctaUrl,
    pricingOptions: data.priceBreakdown,
  }) : null

  async function handleCustomize() {
    if (!customPrompt.trim() || customizing) return
    setCustomizing(true)
    try {
      const res = await fetch('/api/generate', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          pageId: data.pageId,
          prompt: customPrompt,
          currentContent: data.generatedContent,
          language: lang,
        }),
      })
      if (res.ok) {
        const updated = await res.json()
        onUpdate({ generatedContent: { ...data.generatedContent, ...updated.content } })
        setCustomHistory(prev => [...prev, customPrompt])
        setCustomPrompt('')
      }
    } catch (err) {
      alert('Customization failed: ' + String(err))
    } finally {
      setCustomizing(false)
    }
  }

  async function handleExport() {
    if (!data.pageId) return
    setExporting(true)
    
    try {
      const res = await fetch('/api/export', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pageId: data.pageId }),
      })
      
      if (!res.ok) throw new Error('Export failed')
      
      const blob = await res.blob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `${data.treatmentName.replace(/\s+/g, '-').toLowerCase()}-landing-page.zip`
      a.click()
      URL.revokeObjectURL(url)
    } catch (err) {
      alert('Export failed: ' + String(err))
    } finally {
      setExporting(false)
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-white mb-0.5">Preview & Export</h2>
          <p className="text-gray-500 text-sm">Your landing page is ready. Preview it and download the ZIP.</p>
        </div>
        
        <button
          onClick={handleExport}
          disabled={exporting || !data.pageId}
          className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white px-5 py-2.5 rounded-lg font-semibold text-sm transition-colors"
        >
          {exporting ? <Loader2 size={16} className="animate-spin" /> : <Download size={16} />}
          {exporting ? 'Exporting...' : 'Download ZIP'}
        </button>
      </div>

      {/* Controls */}
      <div className="flex items-center gap-3 flex-wrap">
        {/* Viewport */}
        <div className="flex bg-white/[0.04] border border-white/8 rounded-lg p-0.5">
          <button
            onClick={() => setViewport('desktop')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${viewport === 'desktop' ? 'bg-white/10 text-white' : 'text-gray-500 hover:text-gray-300'}`}
          >
            <Monitor size={13} /> Desktop
          </button>
          <button
            onClick={() => setViewport('mobile')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${viewport === 'mobile' ? 'bg-white/10 text-white' : 'text-gray-500 hover:text-gray-300'}`}
          >
            <Smartphone size={13} /> Mobile
          </button>
        </div>

        {/* Theme */}
        {data.themes.length > 1 && (
          <div className="flex bg-white/[0.04] border border-white/8 rounded-lg p-0.5">
            <button
              onClick={() => setTheme('dark')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${theme === 'dark' ? 'bg-white/10 text-white' : 'text-gray-500 hover:text-gray-300'}`}
            >
              <Moon size={13} /> Dark
            </button>
            <button
              onClick={() => setTheme('light')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${theme === 'light' ? 'bg-white/10 text-white' : 'text-gray-500 hover:text-gray-300'}`}
            >
              <Sun size={13} /> Light
            </button>
          </div>
        )}

        {/* Language */}
        {data.languages.length > 1 && (
          <div className="flex bg-white/[0.04] border border-white/8 rounded-lg p-0.5">
            {data.languages.map(l => (
              <button
                key={l}
                onClick={() => setLang(l)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${lang === l ? 'bg-white/10 text-white' : 'text-gray-500 hover:text-gray-300'}`}
              >
                <Globe size={13} /> {l.toUpperCase()}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Preview iframe */}
      <div className={`border border-white/8 rounded-xl overflow-hidden bg-white ${viewport === 'mobile' ? 'max-w-[390px] mx-auto' : 'w-full'}`}>
        {previewHtml ? (
          <iframe
            srcDoc={previewHtml}
            className="w-full border-0"
            style={{ height: viewport === 'mobile' ? '800px' : '700px' }}
            title="Page Preview"
          />
        ) : (
          <div className="flex items-center justify-center h-64 bg-[#0a0a14]">
            <div className="text-center text-gray-600">
              <Loader2 size={24} className="animate-spin mx-auto mb-2" />
              <div className="text-sm">Loading preview...</div>
            </div>
          </div>
        )}
      </div>

      {/* Customize with AI Prompt */}
      <div className="bg-purple-500/[0.06] border border-purple-500/20 rounded-xl p-5">
        <div className="flex items-center gap-2 mb-3">
          <Sparkles size={16} className="text-purple-400" />
          <h3 className="text-sm font-semibold text-purple-400">Customize with AI</h3>
        </div>
        <p className="text-xs text-gray-500 mb-3">
          Tell the AI what to change — tone, sections, content, layout. Examples:
        </p>
        <div className="flex flex-wrap gap-2 mb-3">
          {[
            'Make the hero more empathetic and warm',
            'Add a financing section with monthly payments',
            'Change the FAQ to focus on recovery time',
            'Make it sound more luxurious and premium',
            'Add more trust signals and certifications',
            'Translate everything to French',
          ].map(suggestion => (
            <button
              key={suggestion}
              onClick={() => setCustomPrompt(suggestion)}
              className="text-[11px] px-2.5 py-1 rounded-lg border border-white/8 text-gray-400 hover:text-white hover:border-purple-500/40 transition-colors"
            >
              {suggestion}
            </button>
          ))}
        </div>
        <div className="flex gap-2">
          <textarea
            ref={promptRef}
            value={customPrompt}
            onChange={e => setCustomPrompt(e.target.value)}
            placeholder="Describe what you'd like to change..."
            className="flex-1 bg-white/[0.05] border border-white/10 text-white rounded-lg px-4 py-2.5 text-sm resize-none focus:outline-none focus:border-purple-500/50 placeholder-gray-600 min-h-[44px]"
            rows={2}
            onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleCustomize(); } }}
          />
          <button
            onClick={handleCustomize}
            disabled={customizing || !customPrompt.trim()}
            className="flex items-center gap-2 bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white px-5 rounded-lg font-semibold text-sm transition-colors self-end"
          >
            {customizing ? <Loader2 size={14} className="animate-spin" /> : <Send size={14} />}
            {customizing ? 'Updating...' : 'Apply'}
          </button>
        </div>
        {customHistory.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1">
            {customHistory.map((h, i) => (
              <span key={i} className="text-[10px] px-2 py-0.5 rounded bg-purple-500/10 text-purple-300 border border-purple-500/20">
                ✓ {h.length > 40 ? h.slice(0, 40) + '…' : h}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Export info */}
      <div className="bg-emerald-500/[0.06] border border-emerald-500/20 rounded-xl p-4">
        <h3 className="text-sm font-semibold text-emerald-400 mb-2">📦 What's in the ZIP?</h3>
        <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs text-gray-500">
          {[
            'dark/en/index.html', 
            'dark/de/index.html',
            'light/en/index.html',
            'light/de/index.html',
            'index.html (auto-redirect)',
            'README.md (deploy guide)',
          ].map(f => (
            <div key={f} className="flex items-center gap-1">
              <span className="text-emerald-500">✓</span> {f}
            </div>
          ))}
        </div>
      </div>

      {/* Nav */}
      <div className="flex justify-between pt-4 border-t border-white/5">
        <button onClick={onPrev} className="flex items-center gap-2 text-gray-500 hover:text-white text-sm transition-colors">
          <ArrowLeft size={14} /> Back
        </button>
        <a href="/dashboard/pages" className="text-sm text-blue-400 hover:text-blue-300 transition-colors">
          View all pages →
        </a>
      </div>
    </div>
  )
}
