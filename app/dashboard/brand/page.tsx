'use client'

import { useState, useEffect, useRef } from 'react'
import { Loader2, Save, Upload, CheckCircle2 } from 'lucide-react'

interface BrandSettings {
  clinic_name: string
  logo_url: string
  primary_color: string
  secondary_color: string
  accent_color: string
  phone: string
  email: string
  address: string
  maps_url: string
}

const defaultSettings: BrandSettings = {
  clinic_name: '',
  logo_url: '',
  primary_color: '#2563eb',
  secondary_color: '#7c3aed',
  accent_color: '#10b981',
  phone: '',
  email: '',
  address: '',
  maps_url: '',
}

export default function BrandPage() {
  const [settings, setSettings] = useState<BrandSettings>(defaultSettings)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [logoPreview, setLogoPreview] = useState('')
  const logoRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    fetch('/api/brand').then(r => r.json()).then(data => {
      if (data) setSettings({ ...defaultSettings, ...data })
      setLoading(false)
    }).catch(() => setLoading(false))
  }, [])

  const update = (key: keyof BrandSettings, value: string) => {
    setSettings(prev => ({ ...prev, [key]: value }))
  }

  async function handleLogoUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    
    setLogoPreview(URL.createObjectURL(file))
    
    const formData = new FormData()
    formData.append('file', file)
    formData.append('path', `logos/${Date.now()}.${file.name.split('.').pop()}`)
    
    const res = await fetch('/api/upload', { method: 'POST', body: formData })
    if (res.ok) {
      const { url } = await res.json()
      update('logo_url', url)
    }
  }

  async function handleSave() {
    setSaving(true)
    try {
      await fetch('/api/brand', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      })
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 size={24} className="animate-spin text-blue-400" />
      </div>
    )
  }

  return (
    <div className="max-w-2xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white mb-1">Brand Settings</h1>
        <p className="text-gray-500">Your brand settings are applied to all generated pages.</p>
      </div>

      <div className="space-y-8">
        {/* Logo */}
        <div className="bg-white/[0.03] border border-white/8 rounded-2xl p-6">
          <h2 className="text-base font-semibold text-white mb-4">Logo</h2>
          <div className="flex items-center gap-6">
            <div className="w-20 h-20 rounded-xl border border-white/10 flex items-center justify-center bg-white/5 overflow-hidden">
              {logoPreview || settings.logo_url ? (
                <img src={logoPreview || settings.logo_url} alt="Logo" className="w-full h-full object-contain p-2" />
              ) : (
                <span className="text-3xl">🏥</span>
              )}
            </div>
            <div>
              <input ref={logoRef} type="file" accept="image/*" onChange={handleLogoUpload} className="hidden" />
              <button
                onClick={() => logoRef.current?.click()}
                className="flex items-center gap-2 border border-white/15 hover:border-white/30 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
              >
                <Upload size={14} /> Upload Logo
              </button>
              <p className="text-xs text-gray-600 mt-2">PNG, SVG recommended. Max 5MB.</p>
            </div>
          </div>
        </div>

        {/* Clinic Info */}
        <div className="bg-white/[0.03] border border-white/8 rounded-2xl p-6 space-y-4">
          <h2 className="text-base font-semibold text-white">Clinic Information</h2>
          
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-gray-300">Clinic Name *</label>
            <input
              type="text"
              value={settings.clinic_name}
              onChange={e => update('clinic_name', e.target.value)}
              placeholder="Dr. Smith Aesthetic Center"
              className="w-full bg-white/[0.05] border border-white/10 text-white rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500/50 placeholder-gray-600"
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-gray-300">Phone</label>
              <input type="tel" value={settings.phone} onChange={e => update('phone', e.target.value)} placeholder="+41 44 000 00 00" className="w-full bg-white/[0.05] border border-white/10 text-white rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500/50 placeholder-gray-600" />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-gray-300">Email</label>
              <input type="email" value={settings.email} onChange={e => update('email', e.target.value)} placeholder="info@clinic.com" className="w-full bg-white/[0.05] border border-white/10 text-white rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500/50 placeholder-gray-600" />
            </div>
          </div>
          
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-gray-300">Address</label>
            <input type="text" value={settings.address} onChange={e => update('address', e.target.value)} placeholder="Bahnhofstrasse 1, 8001 Zürich" className="w-full bg-white/[0.05] border border-white/10 text-white rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500/50 placeholder-gray-600" />
          </div>
          
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-gray-300">Google Maps Embed URL</label>
            <input type="url" value={settings.maps_url} onChange={e => update('maps_url', e.target.value)} placeholder="https://www.google.com/maps/embed?pb=..." className="w-full bg-white/[0.05] border border-white/10 text-white rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500/50 placeholder-gray-600" />
            <p className="text-xs text-gray-600">Google Maps → Share → Embed a map → Copy the src URL</p>
          </div>
        </div>

        {/* Brand Colors */}
        <div className="bg-white/[0.03] border border-white/8 rounded-2xl p-6">
          <h2 className="text-base font-semibold text-white mb-4">Brand Colors</h2>
          <div className="grid grid-cols-3 gap-4">
            {[
              { key: 'primary_color', label: 'Primary', desc: 'Buttons, links, accents' },
              { key: 'secondary_color', label: 'Secondary', desc: 'Section backgrounds' },
              { key: 'accent_color', label: 'Accent', desc: 'Success, highlights' },
            ].map(({ key, label, desc }) => (
              <div key={key} className="space-y-2">
                <label className="text-sm font-medium text-gray-300">{label}</label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={settings[key as keyof BrandSettings]}
                    onChange={e => update(key as keyof BrandSettings, e.target.value)}
                    className="w-10 h-10 rounded-lg cursor-pointer border border-white/10 bg-transparent"
                  />
                  <input
                    type="text"
                    value={settings[key as keyof BrandSettings]}
                    onChange={e => update(key as keyof BrandSettings, e.target.value)}
                    className="flex-1 bg-white/[0.05] border border-white/10 text-white rounded-lg px-3 py-2 text-xs font-mono focus:outline-none focus:border-blue-500/50"
                  />
                </div>
                <p className="text-xs text-gray-600">{desc}</p>
              </div>
            ))}
          </div>
          
          {/* Preview */}
          <div className="mt-6 p-4 rounded-xl border border-white/8 flex items-center gap-3">
            <button className="px-4 py-2 rounded-lg text-white text-sm font-medium" style={{ backgroundColor: settings.primary_color }}>
              Primary Button
            </button>
            <button className="px-4 py-2 rounded-lg text-white text-sm font-medium" style={{ backgroundColor: settings.accent_color }}>
              Accent Button
            </button>
            <div className="text-sm font-medium" style={{ color: settings.primary_color }}>Link color</div>
          </div>
        </div>

        {/* Save */}
        <div className="flex justify-end">
          <button
            onClick={handleSave}
            disabled={saving || !settings.clinic_name}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white px-8 py-3 rounded-xl font-semibold transition-colors"
          >
            {saving ? <Loader2 size={16} className="animate-spin" /> : saved ? <CheckCircle2 size={16} /> : <Save size={16} />}
            {saving ? 'Saving...' : saved ? 'Saved!' : 'Save Brand Settings'}
          </button>
        </div>
      </div>
    </div>
  )
}
