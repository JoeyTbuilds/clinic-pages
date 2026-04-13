'use client'

import { useState } from 'react'
import { Download, Monitor, Smartphone, Moon, Sun, Globe, ArrowLeft, Loader2 } from 'lucide-react'
import Link from 'next/link'
import { generateHTML } from '@/lib/export'
import { formatDate } from '@/lib/utils'

interface Props {
  page: {
    id: string
    treatment_name: string
    treatment_category: string
    status: string
    content_json: Record<string, unknown> | null
    config: Record<string, unknown>
    credits_used: number
    created_at: string
  }
  brand: {
    clinic_name: string
    logo_url?: string
    primary_color: string
    secondary_color: string
    accent_color: string
    phone?: string
    email?: string
    address?: string
    maps_url?: string
  } | null
}

export default function PageDetailClient({ page, brand }: Props) {
  const config = page.config as Record<string, unknown>
  const langs = (config?.languages as string[]) || ['en']
  const themes = (config?.themes as string[]) || ['dark']

  const [viewport, setViewport] = useState<'desktop' | 'mobile'>('desktop')
  const [theme, setTheme] = useState<'dark' | 'light'>(themes[0] as 'dark' | 'light')
  const [lang, setLang] = useState<'en' | 'de'>(langs[0] as 'en' | 'de')
  const [exporting, setExporting] = useState(false)

  const content = page.content_json?.[lang]

  const previewHtml = content ? generateHTML({
    content: content as Parameters<typeof generateHTML>[0]['content'],
    input: {
      treatmentName: page.treatment_name,
      treatmentCategory: page.treatment_category,
      clinicName: brand?.clinic_name || 'Your Clinic',
      language: lang,
      startingPrice: config?.startingPrice as string,
      anesthesia: config?.anesthesia as string,
    },
    theme,
    language: lang,
    brand: {
      clinicName: brand?.clinic_name || 'Your Clinic',
      logoUrl: brand?.logo_url,
      primaryColor: brand?.primary_color || '#2563eb',
      secondaryColor: brand?.secondary_color || '#7c3aed',
      accentColor: brand?.accent_color || '#10b981',
      phone: brand?.phone,
      email: brand?.email,
      address: brand?.address,
      mapsUrl: brand?.maps_url,
    },
    reviews: (page.content_json?.aiReviews as Array<{ name: string; rating: number; text: string; treatment: string }>) || [],
    ctaUrl: config?.ctaUrl as string,
  }) : null

  async function handleExport() {
    setExporting(true)
    try {
      const res = await fetch('/api/export', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pageId: page.id }),
      })
      if (!res.ok) throw new Error('Export failed')
      const blob = await res.blob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `${page.treatment_name.replace(/\s+/g, '-').toLowerCase()}-landing-page.zip`
      a.click()
      URL.revokeObjectURL(url)
    } catch (err) {
      alert('Export failed: ' + String(err))
    } finally {
      setExporting(false)
    }
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <Link href="/dashboard/pages" className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-white mb-2 transition-colors">
            <ArrowLeft size={14} /> Back to pages
          </Link>
          <h1 className="text-2xl font-bold text-white mb-1">{page.treatment_name}</h1>
          <div className="flex items-center gap-3 text-sm text-gray-600">
            <span>{page.treatment_category}</span>
            <span>·</span>
            <span>{formatDate(page.created_at)}</span>
            <span>·</span>
            <span className={`font-medium ${
              page.status === 'ready' ? 'text-emerald-400' :
              page.status === 'generating' ? 'text-yellow-400' :
              'text-red-400'
            }`}>{page.status}</span>
          </div>
        </div>
        
        <button
          onClick={handleExport}
          disabled={exporting || page.status !== 'ready'}
          className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white px-5 py-2.5 rounded-lg font-semibold text-sm transition-colors"
        >
          {exporting ? <Loader2 size={14} className="animate-spin" /> : <Download size={14} />}
          Download ZIP
        </button>
      </div>

      {/* Preview controls */}
      <div className="flex items-center gap-3 flex-wrap mb-4">
        <div className="flex bg-white/[0.04] border border-white/8 rounded-lg p-0.5">
          <button onClick={() => setViewport('desktop')} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${viewport === 'desktop' ? 'bg-white/10 text-white' : 'text-gray-500'}`}>
            <Monitor size={12} /> Desktop
          </button>
          <button onClick={() => setViewport('mobile')} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${viewport === 'mobile' ? 'bg-white/10 text-white' : 'text-gray-500'}`}>
            <Smartphone size={12} /> Mobile
          </button>
        </div>

        {themes.length > 1 && (
          <div className="flex bg-white/[0.04] border border-white/8 rounded-lg p-0.5">
            {themes.map(t => (
              <button key={t} onClick={() => setTheme(t as 'dark' | 'light')} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${theme === t ? 'bg-white/10 text-white' : 'text-gray-500'}`}>
                {t === 'dark' ? <Moon size={12} /> : <Sun size={12} />} {t.charAt(0).toUpperCase() + t.slice(1)}
              </button>
            ))}
          </div>
        )}

        {langs.length > 1 && (
          <div className="flex bg-white/[0.04] border border-white/8 rounded-lg p-0.5">
            {langs.map(l => (
              <button key={l} onClick={() => setLang(l as 'en' | 'de')} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${lang === l ? 'bg-white/10 text-white' : 'text-gray-500'}`}>
                <Globe size={12} /> {l.toUpperCase()}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Preview */}
      <div className={`border border-white/8 rounded-2xl overflow-hidden ${viewport === 'mobile' ? 'max-w-[390px] mx-auto' : 'w-full'}`}>
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
              {page.status === 'generating' ? (
                <>
                  <Loader2 size={24} className="animate-spin mx-auto mb-2 text-blue-400" />
                  <div className="text-sm">Generating...</div>
                </>
              ) : (
                <div className="text-sm">No preview available</div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
