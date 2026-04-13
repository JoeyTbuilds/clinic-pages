import Link from 'next/link'
import { ArrowRight, CheckCircle2, Zap, Globe, Moon, Download, BarChart3, Star } from 'lucide-react'

const features = [
  {
    icon: Zap,
    title: 'Generate in 5 Minutes',
    desc: 'Fill in your treatment details. Claude AI writes the copy, structures the page, and generates both languages. Done.',
  },
  {
    icon: Globe,
    title: 'German + English',
    desc: 'Every page generated in both languages simultaneously. Native-quality, medically accurate translations — not Google Translate.',
  },
  {
    icon: Moon,
    title: 'Dark & Light Modes',
    desc: 'Both theme variants generated automatically. A/B test which one converts better for your specific treatment.',
  },
  {
    icon: BarChart3,
    title: 'Proven Structure',
    desc: 'Built on the Dr. Kish Aesthetic Center template that generated CHF 2M+. Every section placed for maximum conversion.',
  },
  {
    icon: Download,
    title: 'Export as ZIP',
    desc: 'Download self-contained static HTML. Host on Cloudflare Pages, Netlify, or your own server. No dependencies, no vendor lock-in.',
  },
  {
    icon: Star,
    title: 'Before/After Gallery',
    desc: 'Interactive slider gallery that works flawlessly on mobile. Drag handle, swipe gestures, treatment labels. Professional.',
  },
]

const plans = [
  {
    name: 'Starter',
    price: '$49',
    period: '/month',
    credits: '5 credits',
    description: 'Perfect for single-location clinics launching their first treatment pages.',
    features: [
      '5 pages per month',
      'EN + DE languages',
      'Dark & Light themes',
      'Before/After gallery',
      'Pricing calculator',
      'ZIP export',
      'Email support',
    ],
    cta: 'Start Free Trial',
    href: '/login',
    highlight: false,
  },
  {
    name: 'Pro',
    price: '$149',
    period: '/month',
    credits: '20 credits',
    description: 'For growing clinics with multiple treatments and serious patient acquisition goals.',
    features: [
      '20 pages per month',
      'EN + DE languages',
      'Dark & Light + A/B variants',
      'AI review generation',
      'Priority support',
      'Custom domain guide',
      'Before/After watermarking',
      '3 clinic profiles',
    ],
    cta: 'Start Free Trial',
    href: '/login',
    highlight: true,
  },
  {
    name: 'Agency',
    price: '$349',
    period: '/month',
    credits: '60 credits',
    description: 'For agencies running patient acquisition for multiple clinics across markets.',
    features: [
      '60 pages per month',
      'Unlimited clinic profiles',
      'White-label export',
      'API access',
      'All languages',
      'Dedicated support',
      'Custom templates',
      'Priority generation',
    ],
    cta: 'Contact Sales',
    href: '/login',
    highlight: false,
  },
]

const testimonials = [
  {
    text: "We went from zero online presence to 40 consultation bookings per month in 6 weeks. The pages look better than anything our web agency ever built for us.",
    author: "Dr. M. Kellner",
    role: "Aesthetic Center Munich",
    rating: 5,
  },
  {
    text: "Our Botox page generates 3x more leads than our old website. The pricing calculator alone reduced price-shopping inquiries by half.",
    author: "Clinic Director",
    role: "MedSpa Vienna",
    rating: 5,
  },
  {
    text: "I built pages for 8 treatments in one afternoon. The German copy is flawless — patients tell us it sounds more professional than the big clinic chains.",
    author: "Sarah L.",
    role: "Aesthetic Surgery Zurich",
    rating: 5,
  },
]

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#070710] text-gray-100">
      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-[#070710]/90 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="text-xl font-bold">
            Clinic<span className="text-blue-500">Pages</span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm text-gray-400">
            <a href="#features" className="hover:text-white transition-colors">Features</a>
            <a href="#how-it-works" className="hover:text-white transition-colors">How it works</a>
            <a href="#pricing" className="hover:text-white transition-colors">Pricing</a>
            <Link href="/login" className="text-white">Sign in</Link>
          </div>
          <Link 
            href="/login" 
            className="bg-blue-600 hover:bg-blue-500 text-white px-5 py-2 rounded-lg text-sm font-semibold transition-colors flex items-center gap-2"
          >
            Start Free Trial <ArrowRight size={14} />
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-24 px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_20%_50%,rgba(37,99,235,0.12),transparent_60%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_80%_50%,rgba(16,185,129,0.06),transparent_60%)]" />
        
        <div className="max-w-4xl mx-auto text-center relative">
          <div className="inline-flex items-center gap-2 bg-blue-500/10 text-blue-400 border border-blue-500/20 px-4 py-2 rounded-full text-sm font-medium mb-8">
            <span className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" />
            Used by aesthetic clinics across Switzerland, Germany & Austria
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold leading-tight mb-6">
            The Landing Page Builder That Generated{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">
              CHF 2M+
            </span>{' '}
            for Aesthetic Clinics
          </h1>
          
          <p className="text-xl text-gray-400 mb-10 max-w-2xl mx-auto">
            Input your treatment. Get a production-ready, multi-language treatment page — 
            with before/after gallery, pricing calculator, FAQ, and dark/light modes. 
            In 5 minutes. Not 5 weeks.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Link 
              href="/login" 
              className="bg-blue-600 hover:bg-blue-500 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all flex items-center justify-center gap-2 hover:-translate-y-0.5"
            >
              Build Your First Page Free <ArrowRight size={20} />
            </Link>
            <a 
              href="#how-it-works"
              className="border border-white/10 text-gray-300 hover:text-white hover:border-white/20 px-8 py-4 rounded-xl font-semibold text-lg transition-all flex items-center justify-center gap-2"
            >
              See how it works ↓
            </a>
          </div>

          {/* Trust bar */}
          <div className="flex flex-wrap justify-center gap-6 text-sm text-gray-500">
            {['✦ No credit card for trial', '✦ EN + DE in one click', '✦ Export as static HTML', '✦ Dr. Kish template included'].map(item => (
              <span key={item}>{item}</span>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 border-y border-white/5 bg-white/[0.02]">
        <div className="max-w-5xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8">
          {[
            { value: 'CHF 2M+', label: 'Revenue generated for clinics' },
            { value: '< 5min', label: 'Average page build time' },
            { value: 'EN + DE', label: 'Languages per generation' },
            { value: '100%', label: 'Mobile-optimized output' },
          ].map(stat => (
            <div key={stat.label} className="text-center">
              <div className="text-3xl font-bold text-white mb-2">{stat.value}</div>
              <div className="text-sm text-gray-500">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">From zero to live page in 5 minutes</h2>
            <p className="text-gray-400 text-lg">No designers. No copywriters. No waiting.</p>
          </div>
          
          <div className="space-y-12">
            {[
              {
                step: '01',
                title: 'Enter your treatment details',
                desc: 'Name, category, benefits, procedure steps, pricing. The more you give, the better the output. Takes 2 minutes.',
              },
              {
                step: '02',
                title: 'Upload your photos',
                desc: 'Before/after pairs, doctor photo, clinic photos. We build the gallery automatically with mobile-swipe support.',
              },
              {
                step: '03',
                title: 'Choose languages & theme',
                desc: 'EN + DE, dark or light (or both), which sections to include. Each language costs 1 credit.',
              },
              {
                step: '04',
                title: 'Generate & preview',
                desc: 'Claude writes all the copy, translates, and assembles the page. Preview in desktop/mobile, dark/light, EN/DE.',
              },
              {
                step: '05',
                title: 'Download & deploy',
                desc: 'Export as a self-contained ZIP. Upload to Netlify, Cloudflare Pages, or your own server. Done.',
              },
            ].map((item, i) => (
              <div key={item.step} className="flex gap-8 items-start">
                <div className="text-5xl font-bold text-blue-500/20 leading-none w-16 flex-shrink-0">{item.step}</div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                  <p className="text-gray-400">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-24 px-6 bg-white/[0.02] border-y border-white/5">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Everything your clinic page needs</h2>
            <p className="text-gray-400 text-lg">Every component that converts browsers into patients.</p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map(feature => (
              <div 
                key={feature.title}
                className="bg-white/[0.03] border border-white/8 rounded-2xl p-6 hover:border-blue-500/30 hover:-translate-y-1 transition-all"
              >
                <feature.icon className="text-blue-400 mb-4" size={28} />
                <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-16">Clinics using this exact template</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map(t => (
              <div key={t.author} className="bg-white/[0.03] border border-white/8 rounded-2xl p-6">
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: t.rating }).map((_, i) => (
                    <span key={i} className="text-yellow-400">★</span>
                  ))}
                </div>
                <p className="text-gray-300 text-sm leading-relaxed mb-6 italic">"{t.text}"</p>
                <div>
                  <div className="font-semibold text-sm">{t.author}</div>
                  <div className="text-gray-500 text-xs">{t.role}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-24 px-6 bg-white/[0.02] border-y border-white/5">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Simple, credit-based pricing</h2>
            <p className="text-gray-400 text-lg">1 credit = 1 page in 1 language in 1 theme. Credits roll over. Never wasted.</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6">
            {plans.map(plan => (
              <div 
                key={plan.name}
                className={`rounded-2xl p-8 border transition-all ${
                  plan.highlight 
                    ? 'bg-blue-600/10 border-blue-500/40 relative'
                    : 'bg-white/[0.03] border-white/8'
                }`}
              >
                {plan.highlight && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-xs font-bold px-4 py-1 rounded-full">
                    MOST POPULAR
                  </div>
                )}
                <div className="mb-6">
                  <div className="text-sm text-gray-400 mb-1">{plan.name}</div>
                  <div className="text-4xl font-bold mb-1">
                    {plan.price}<span className="text-lg font-normal text-gray-400">{plan.period}</span>
                  </div>
                  <div className="text-sm text-blue-400 font-medium">{plan.credits}</div>
                </div>
                <p className="text-gray-400 text-sm mb-6">{plan.description}</p>
                <ul className="space-y-3 mb-8">
                  {plan.features.map(f => (
                    <li key={f} className="flex items-center gap-2 text-sm">
                      <CheckCircle2 size={16} className="text-emerald-400 flex-shrink-0" />
                      <span className="text-gray-300">{f}</span>
                    </li>
                  ))}
                </ul>
                <Link 
                  href={plan.href}
                  className={`block text-center py-3 rounded-lg font-semibold transition-all ${
                    plan.highlight
                      ? 'bg-blue-600 hover:bg-blue-500 text-white'
                      : 'border border-white/15 hover:border-white/30 text-white'
                  }`}
                >
                  {plan.cta}
                </Link>
              </div>
            ))}
          </div>
          
          <div className="text-center mt-8">
            <div className="inline-flex items-center gap-2 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-4 py-2 rounded-full text-sm">
              💳 Need more credits? Add 10 for $29 anytime. Never expire.
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-6 text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-4xl font-bold mb-4">Your first page is free</h2>
          <p className="text-gray-400 text-lg mb-8">
            Sign up. Get 3 trial credits. Build your first treatment page. 
            If you don't love it, you owe us nothing.
          </p>
          <Link 
            href="/login"
            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-10 py-5 rounded-xl font-semibold text-xl transition-all hover:-translate-y-0.5"
          >
            Start Building Free <ArrowRight size={22} />
          </Link>
          <p className="text-gray-600 text-sm mt-4">No credit card required · 3 free credits · Cancel anytime</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 py-12 px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div>
            <div className="text-lg font-bold mb-1">Clinic<span className="text-blue-500">Pages</span></div>
            <div className="text-sm text-gray-600">The landing page builder for serious aesthetic clinics.</div>
          </div>
          <div className="flex gap-6 text-sm text-gray-500">
            <Link href="/pricing" className="hover:text-white">Pricing</Link>
            <Link href="/login" className="hover:text-white">Login</Link>
            <a href="mailto:hello@clinicpages.io" className="hover:text-white">Contact</a>
            <a href="#" className="hover:text-white">Privacy</a>
          </div>
          <div className="text-sm text-gray-700">© 2025 ClinicPages. All rights reserved.</div>
        </div>
      </footer>
    </div>
  )
}
