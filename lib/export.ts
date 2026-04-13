import JSZip from 'jszip'
import type { TreatmentPageContent, GeneratePageInput } from './ai'

export interface PageBuildConfig {
  content: TreatmentPageContent
  input: GeneratePageInput
  theme: 'dark' | 'light'
  language: 'en' | 'de'
  brand: {
    clinicName: string
    logoUrl?: string
    primaryColor: string
    secondaryColor: string
    accentColor: string
    phone?: string
    email?: string
    address?: string
    mapsUrl?: string
  }
  reviews?: Array<{ name: string; rating: number; text: string; treatment: string; isAI?: boolean }>
  beforeAfterPhotos?: Array<{ beforeUrl: string; afterUrl: string; label: string; timeframe: string }>
  doctorPhotoUrl?: string
  ctaUrl?: string
  pricingOptions?: Array<{ label: string; price: number; type: 'addon' | 'package' }>
}

export function generateHTML(config: PageBuildConfig): string {
  const { content, input, theme, brand, reviews = [], beforeAfterPhotos = [], pricingOptions = [] } = config

  const isDark = theme === 'dark'
  const lang = config.language
  const accent = brand.primaryColor || '#e50036'

  // ─── Colors ────────────────────────────────────────────────────────────────
  const bgBody       = isDark ? '#000000' : '#EDE8E0'
  const bgCard       = isDark ? '#1A1A1A' : '#FFFFFF'
  const textPrimary  = isDark ? '#FFFFFF' : '#2C2824'
  const textSecondary = isDark ? '#999999' : '#6B6560'
  const textMuted    = isDark ? '#666666' : '#8A8480'
  const borderColor  = isDark ? 'rgba(255,255,255,0.08)' : 'rgba(44,40,36,0.1)'

  // Button styles
  const btnBg        = isDark ? accent : '#2C2824'
  const btnRadius    = isDark ? '100px' : '8px'
  const btnText      = '#FFFFFF'

  // ─── Labels ────────────────────────────────────────────────────────────────
  const t = {
    bookBtn:       lang === 'de' ? 'Termin buchen' : 'Book Appointment',
    countdownMsg:  lang === 'de' ? 'Limitiertes Angebot — Nur noch wenige Plätze' : 'Limited Offer — Only a few spots remaining',
    days:          lang === 'de' ? 'Tage' : 'Days',
    hours:         lang === 'de' ? 'Std' : 'Hrs',
    mins:          lang === 'de' ? 'Min' : 'Min',
    secs:          lang === 'de' ? 'Sek' : 'Sec',
    topReviewsNone: lang === 'de' ? 'Bewertungen folgen bald.' : 'Reviews coming soon.',
    benefitsTitle: lang === 'de' ? 'Ihre Vorteile' : 'Your Benefits',
    financingTitle: lang === 'de' ? 'Flexible Finanzierung' : 'Flexible Financing',
    financingDesc:  lang === 'de'
      ? 'Investieren Sie in sich — bequem in monatlichen Raten. Keine Anzahlung erforderlich.'
      : 'Invest in yourself — comfortably in monthly installments. No down payment required.',
    financingFrom:  lang === 'de' ? 'Ab' : 'From',
    financingPerMonth: lang === 'de' ? '/ Monat' : '/ month',
    financingRange: lang === 'de' ? 'CHF 1\'000 bis CHF 14\'900, zahlbar innerhalb von 12 Monaten' : 'CHF 1,000 to CHF 14,900, payable within 12 months',
    financingCta:   lang === 'de' ? 'Finanzierungsdetails anfragen' : 'Request Financing Details',
    howTitle:      content.procedureTitle,
    baTitle:       lang === 'de' ? 'Vorher & Nachher' : 'Before & After',
    baSubtitle:    lang === 'de' ? 'Echte Ergebnisse unserer Patienten' : 'Real results from our patients',
    vorher:        lang === 'de' ? 'Vorher' : 'Before',
    nachher:       lang === 'de' ? 'Nachher' : 'After',
    pricingTitle:  content.pricingTitle,
    docTitle:      lang === 'de' ? 'Ihr Spezialist' : 'Your Specialist',
    detailsTitle:  lang === 'de' ? 'Behandlungsdetails' : 'Treatment Details',
    reviewsTitle:  lang === 'de' ? 'Das sagen unsere Patienten' : 'What Our Patients Say',
    faqTitle:      content.faqTitle,
    ctaSectionTitle: lang === 'de' ? 'Starten Sie Ihre Reise' : 'Start Your Journey',
    ctaSectionSub:   lang === 'de' ? 'Vereinbaren Sie noch heute ein unverbindliches Beratungsgespräch.' : 'Schedule your no-obligation consultation today.',
    footerPrivacy: lang === 'de' ? 'Datenschutz' : 'Privacy Policy',
    footerImprint: lang === 'de' ? 'Impressum' : 'Imprint',
    footerTerms:   lang === 'de' ? 'AGB' : 'Terms',
    formFirstName: lang === 'de' ? 'Vorname' : 'First Name',
    formLastName:  lang === 'de' ? 'Nachname' : 'Last Name',
    formPhone:     lang === 'de' ? 'Telefon' : 'Phone',
    formEmail:     lang === 'de' ? 'E-Mail' : 'Email',
    formMessage:   lang === 'de' ? 'Ihre Nachricht (optional)' : 'Your message (optional)',
    formSubmit:    lang === 'de' ? 'Beratungsgespräch anfragen' : 'Request Consultation',
    formDiscrete:  lang === 'de' ? 'Diskrete & vertrauliche Beratung' : 'Discreet & confidential consultation',
    modalTitle:    lang === 'de' ? 'Termin anfragen' : 'Request Appointment',
    quizStep1Title: lang === 'de' ? 'Was ist Ihr Hauptanliegen?' : 'What is your main concern?',
    quizStep2Title: lang === 'de' ? 'Haben Sie diese Behandlung bereits erhalten?' : 'Have you had this treatment before?',
    quizStep3Title: lang === 'de' ? 'Wann möchten Sie beginnen?' : 'When would you like to start?',
    quizStep4Title: lang === 'de' ? 'Wie haben Sie von uns erfahren?' : 'How did you hear about us?',
    quizStep5Title: lang === 'de' ? 'Ihre Kontaktdaten' : 'Your Contact Details',
    quizNext:      lang === 'de' ? 'Weiter' : 'Next',
    quizBack:      lang === 'de' ? 'Zurück' : 'Back',
    quizSubmit:    lang === 'de' ? 'Termin anfragen →' : 'Request Appointment →',
    quizThanks:    lang === 'de' ? 'Vielen Dank! Wir melden uns innerhalb von 24 Stunden.' : 'Thank you! We\'ll be in touch within 24 hours.',
    statt:         lang === 'de' ? 'statt' : 'instead of',
    financing:     lang === 'de' ? 'Finanzierung möglich' : 'Financing available',
  }

  // ─── Stats ────────────────────────────────────────────────────────────────
  const patientCount = input.patientCount || "15'000+"
  const yearsExp     = input.yearsExperience || '20+'
  const location     = input.location || 'Zürich'

  // ─── Pricing ──────────────────────────────────────────────────────────────
  const startingPriceRaw = input.startingPrice || 'CHF 2\'800'
  const currency = startingPriceRaw.includes('CHF') ? 'CHF' : '$'
  // Try to extract numeric value for financing calc
  const priceMatch = startingPriceRaw.match(/[\d'.,]+/)
  const priceNum   = priceMatch ? parseInt(priceMatch[0].replace(/[',]/g, '')) : 2800
  const monthlyMin = Math.ceil(priceNum / 12)

  // ─── Reviews ─────────────────────────────────────────────────────────────
  const topReviews  = reviews.slice(0, 3)
  const mainReviews = reviews.slice(3, 9)

  // ─── B&A pairs ────────────────────────────────────────────────────────────
  // Pad to 6 if fewer provided
  const baPairs = [...beforeAfterPhotos]
  while (baPairs.length < 6) baPairs.push({ beforeUrl: '', afterUrl: '', label: input.treatmentName, timeframe: '3 Monate' })

  // ─── Countdown localStorage key ──────────────────────────────────────────
  const cdKey = `clinic_countdown_${input.treatmentName.toLowerCase().replace(/\s+/g, '_')}_${theme}`

  // ─── Logo HTML ────────────────────────────────────────────────────────────
  const logoHtml = brand.logoUrl
    ? `<img src="${brand.logoUrl}" alt="${brand.clinicName}" style="height:36px;width:auto;display:block">`
    : `<span style="font-family:'DM Sans',sans-serif;font-weight:700;font-size:1.1rem;color:${textPrimary}">${brand.clinicName}</span>`

  // ─── B&A Section ─────────────────────────────────────────────────────────
  const renderBAPair = (pair: { beforeUrl: string; afterUrl: string; label: string; timeframe: string }, _i: number) => {
    const vorherBg = isDark ? 'rgba(0,0,0,0.70)' : 'rgba(44,40,36,0.80)'
    const nachherBg = isDark ? `${accent}cc` : 'rgba(44,40,36,1)'
    const placeholder = `background:${isDark ? '#1A1A1A' : '#D5CFC8'};display:flex;align-items:center;justify-content:center;color:${textMuted};font-size:0.8rem`
    return `
    <div style="border-radius:16px;overflow:hidden;background:${bgCard};border:1px solid ${borderColor}">
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:2px">
        <!-- Vorher -->
        <div style="position:relative;overflow:hidden;aspect-ratio:11/12">
          ${pair.beforeUrl
            ? `<img src="${pair.beforeUrl}" alt="${t.vorher} ${pair.label}" loading="lazy" style="width:100%;height:100%;object-fit:cover;display:block">`
            : `<div style="${placeholder};width:100%;height:100%">${t.vorher}</div>`
          }
          <span style="position:absolute;bottom:8px;left:8px;font-size:11px;padding:3px 8px;border-radius:4px;background:${vorherBg};color:#fff;font-family:'Lato',sans-serif;font-weight:700;letter-spacing:0.04em">${t.vorher}</span>
        </div>
        <!-- Nachher -->
        <div style="position:relative;overflow:hidden;aspect-ratio:11/12">
          ${pair.afterUrl
            ? `<img src="${pair.afterUrl}" alt="${t.nachher} ${pair.label}" loading="lazy" style="width:100%;height:100%;object-fit:cover;display:block">`
            : `<div style="${placeholder};width:100%;height:100%">${t.nachher}</div>`
          }
          <span style="position:absolute;bottom:8px;right:8px;font-size:11px;padding:3px 8px;border-radius:4px;background:${nachherBg};color:#fff;font-family:'Lato',sans-serif;font-weight:700;letter-spacing:0.04em">${t.nachher}</span>
        </div>
      </div>
      <div style="background:${bgCard};padding:14px 16px;display:flex;justify-content:space-between;align-items:center">
        <span style="font-family:'DM Sans',sans-serif;font-weight:600;font-size:0.9rem;color:${textPrimary}">${pair.label}</span>
        <span style="font-size:0.8rem;color:${textMuted}">${pair.timeframe}</span>
      </div>
    </div>`
  }

  // ─── Review card ─────────────────────────────────────────────────────────
  const renderReview = (r: { name: string; rating: number; text: string; treatment: string; isAI?: boolean }) => `
    <div style="background:${bgCard};border:1px solid ${borderColor};border-radius:16px;padding:24px">
      <div style="color:#FBBF24;font-size:1rem;margin-bottom:10px;letter-spacing:2px">${'★'.repeat(Math.max(0, Math.min(5, r.rating || 5)))}</div>
      <p style="color:${textSecondary};font-style:italic;margin-bottom:16px;line-height:1.65;font-size:0.95rem">"${r.text}"</p>
      <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:8px">
        <span style="font-weight:700;font-size:0.9rem;color:${textPrimary}">${r.name}</span>
        <span style="font-size:0.75rem;color:${isDark ? accent : '#2C2824'};background:${isDark ? accent + '20' : 'rgba(44,40,36,0.08)'};padding:3px 10px;border-radius:100px">${r.treatment}</span>
      </div>
    </div>`

  // ─── HTML ─────────────────────────────────────────────────────────────────
  return `<!DOCTYPE html>
<html lang="${lang}" style="background:${bgBody}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${content.title}</title>
  <meta name="description" content="${content.metaDescription}">
  <meta name="keywords" content="${content.metaKeywords}">
  <meta property="og:title" content="${content.title}">
  <meta property="og:description" content="${content.metaDescription}">
  <meta name="robots" content="index, follow">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;1,9..40,400&family=Lato:wght@300;400;700&display=swap" rel="stylesheet">
  <style>
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    html, body {
      background-color: ${bgBody} !important;
      color: ${textPrimary};
      font-family: 'Lato', -apple-system, sans-serif;
      line-height: 1.7;
      overflow-x: hidden;
      scroll-behavior: smooth;
    }
    h1,h2,h3,h4,h5 { font-family: 'DM Sans', sans-serif; line-height: 1.2; }
    img { max-width: 100%; display: block; }
    a { text-decoration: none; }

    /* ── Container ── */
    .cp-container { max-width: 1200px; margin: 0 auto; padding: 0 24px; }
    .cp-section { padding: 80px 0; }

    /* ── Countdown bar ── */
    #cp-countdown-bar {
      background: ${isDark ? accent : '#2C2824'};
      color: #fff;
      text-align: center;
      padding: 10px 16px;
      font-family: 'DM Sans', sans-serif;
      font-size: 0.85rem;
      font-weight: 500;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 16px;
      flex-wrap: wrap;
      position: sticky;
      top: 0;
      z-index: 1100;
    }
    .cp-cd-group {
      display: inline-flex;
      align-items: center;
      gap: 12px;
    }
    .cp-cd-unit {
      text-align: center;
      min-width: 36px;
    }
    .cp-cd-num {
      display: block;
      font-size: 1.3rem;
      font-weight: 700;
      line-height: 1;
    }
    .cp-cd-label {
      display: block;
      font-size: 0.65rem;
      opacity: 0.8;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }
    .cp-cd-sep { font-size: 1.2rem; font-weight: 700; opacity: 0.6; margin-bottom: 12px; }

    /* ── Navigation ── */
    #cp-nav {
      position: sticky;
      top: ${/* approx countdown height */ '48px'};
      z-index: 1000;
      background: ${isDark ? 'rgba(0,0,0,0.95)' : 'rgba(237,232,224,0.97)'};
      backdrop-filter: blur(12px);
      -webkit-backdrop-filter: blur(12px);
      border-bottom: 1px solid ${borderColor};
    }
    .cp-nav-inner {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 16px;
      padding: 14px 0;
    }
    .cp-nav-logo { flex-shrink: 0; }
    .cp-nav-right {
      display: flex;
      align-items: center;
      gap: 12px;
      flex-shrink: 0;
    }
    /* Language switcher */
    .cp-lang-switcher { display: flex; gap: 4px; }
    .cp-lang-btn {
      padding: 5px 10px;
      border-radius: 6px;
      border: 1px solid ${borderColor};
      background: transparent;
      color: ${textSecondary};
      cursor: pointer;
      font-size: 0.8rem;
      font-family: 'DM Sans', sans-serif;
      font-weight: 500;
      transition: all 0.2s;
    }
    .cp-lang-btn:hover,
    .cp-lang-btn.active {
      background: ${isDark ? accent : '#2C2824'};
      color: #fff;
      border-color: ${isDark ? accent : '#2C2824'};
    }
    /* CTA button */
    .cp-btn {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      padding: 13px 28px;
      border-radius: ${btnRadius};
      background: ${btnBg};
      color: ${btnText};
      font-family: 'DM Sans', sans-serif;
      font-weight: 600;
      font-size: 0.95rem;
      cursor: pointer;
      border: none;
      transition: opacity 0.2s, transform 0.2s;
      white-space: nowrap;
    }
    .cp-btn:hover { opacity: 0.88; transform: translateY(-1px); }
    .cp-btn-lg { padding: 16px 36px; font-size: 1.05rem; }
    .cp-btn-outline {
      background: transparent;
      color: ${isDark ? '#fff' : '#2C2824'};
      border: 2px solid ${isDark ? 'rgba(255,255,255,0.3)' : '#2C2824'};
    }
    .cp-btn-outline:hover {
      background: ${isDark ? 'rgba(255,255,255,0.08)' : 'rgba(44,40,36,0.08)'};
    }

    /* ── Hero ── */
    #cp-hero {
      position: relative;
      min-height: 88vh;
      display: flex;
      align-items: center;
      overflow: hidden;
      padding: 120px 0 80px;
    }
    .cp-hero-bg {
      position: absolute;
      inset: 0;
      background: ${isDark
        ? 'linear-gradient(135deg, #0a0a0a 0%, #0f0f14 60%, #000 100%)'
        : 'linear-gradient(180deg, rgba(237,232,224,0.92) 0%, rgba(237,232,224,0.78) 40%, rgba(237,232,224,0.96) 100%)'};
      z-index: 0;
    }
    .cp-hero-bg-img {
      position: absolute;
      inset: 0;
      background-size: cover;
      background-position: center 30%;
      z-index: -1;
      opacity: ${isDark ? '0.4' : '0.25'};
    }
    .cp-hero-content {
      position: relative;
      z-index: 1;
      max-width: 680px;
    }
    .cp-hero-badge {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      background: ${isDark ? accent + '22' : 'rgba(44,40,36,0.08)'};
      color: ${isDark ? accent : '#2C2824'};
      border: 1px solid ${isDark ? accent + '44' : 'rgba(44,40,36,0.2)'};
      padding: 6px 14px;
      border-radius: 100px;
      font-size: 0.82rem;
      font-weight: 600;
      font-family: 'DM Sans', sans-serif;
      margin-bottom: 24px;
    }
    .cp-hero-h1 {
      font-size: clamp(2rem, 5vw, 3.4rem);
      font-weight: 700;
      color: ${textPrimary};
      margin-bottom: 20px;
    }
    .cp-hero-price {
      margin-bottom: 16px;
    }
    .cp-hero-price-special {
      font-family: 'DM Sans', sans-serif;
      font-size: clamp(2rem, 4vw, 2.8rem);
      font-weight: 700;
      color: ${isDark ? accent : '#2C2824'};
    }
    .cp-hero-price-statt {
      font-size: 0.9rem;
      color: ${textSecondary};
      margin: 0 8px;
    }
    .cp-hero-price-original {
      font-size: 1.4rem;
      color: ${textMuted};
      text-decoration: line-through;
      text-decoration-color: ${isDark ? accent : '#2C2824'};
      text-decoration-thickness: 2px;
      opacity: 0.7;
    }
    .cp-hero-financing {
      font-size: 0.9rem;
      color: ${textSecondary};
      margin-bottom: 28px;
    }
    .cp-hero-cta-group {
      display: flex;
      gap: 12px;
      flex-wrap: wrap;
      margin-bottom: 36px;
    }
    .cp-trust-bar {
      display: flex;
      flex-wrap: wrap;
      gap: 20px;
      padding-top: 28px;
      border-top: 1px solid ${borderColor};
    }
    .cp-trust-item {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 0.88rem;
      color: ${textSecondary};
    }

    /* ── Stats bar ── */
    #cp-stats {
      background: ${isDark ? '#0D0D0D' : '#EDE8E0'};
      border-top: 1px solid ${borderColor};
      border-bottom: 1px solid ${borderColor};
      padding: 48px 0;
    }
    .cp-stats-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 24px;
    }
    .cp-stat-item { text-align: center; }
    .cp-stat-num {
      font-family: 'DM Sans', sans-serif;
      font-size: clamp(1.8rem, 3vw, 2.8rem);
      font-weight: 700;
      color: ${isDark ? accent : '#2C2824'};
      display: block;
      line-height: 1.1;
    }
    .cp-stat-label {
      font-size: 0.88rem;
      color: ${textMuted};
      margin-top: 4px;
    }

    /* ── Top reviews (no header) ── */
    #cp-top-reviews {
      background: ${bgBody};
      padding: 56px 0;
    }
    .cp-reviews-grid-3 {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 20px;
    }

    /* ── Section styles ── */
    .cp-section-label {
      font-size: 0.78rem;
      font-weight: 700;
      letter-spacing: 0.1em;
      text-transform: uppercase;
      color: ${textMuted};
      margin-bottom: 12px;
    }
    .cp-section-h2 {
      font-size: clamp(1.6rem, 3.5vw, 2.4rem);
      font-weight: 700;
      color: ${textPrimary};
      margin-bottom: 16px;
    }
    .cp-section-sub {
      font-size: 1rem;
      color: ${textSecondary};
      max-width: 580px;
      margin-bottom: 48px;
    }
    .cp-section-center { text-align: center; }
    .cp-section-center .cp-section-sub { margin-left: auto; margin-right: auto; }

    /* ── Benefits ── */
    #cp-benefits {
      background: ${isDark ? '#0D0D0D' : '#EDE8E0'};
      padding: 80px 0;
    }
    .cp-benefits-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 20px;
    }
    .cp-benefit-card {
      background: ${bgCard};
      border: 1px solid ${borderColor};
      border-radius: 16px;
      padding: 28px;
      transition: transform 0.2s;
    }
    .cp-benefit-card:hover { transform: translateY(-3px); }
    .cp-benefit-icon { font-size: 2rem; margin-bottom: 14px; }
    .cp-benefit-title {
      font-family: 'DM Sans', sans-serif;
      font-size: 1.05rem;
      font-weight: 700;
      color: ${textPrimary};
      margin-bottom: 8px;
    }
    .cp-benefit-desc { font-size: 0.9rem; color: ${textSecondary}; line-height: 1.6; }

    /* ── Financing ── */
    #cp-financing {
      background: ${bgBody};
      padding: 80px 0;
    }
    .cp-financing-box {
      background: ${bgCard};
      border: 1px solid ${borderColor};
      border-radius: 20px;
      padding: 48px;
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 40px;
      align-items: center;
    }
    .cp-financing-monthly {
      font-family: 'DM Sans', sans-serif;
      font-size: clamp(2.5rem, 5vw, 4rem);
      font-weight: 700;
      color: ${isDark ? accent : '#2C2824'};
    }
    .cp-financing-from {
      font-size: 0.9rem;
      color: ${textMuted};
      text-transform: uppercase;
      letter-spacing: 0.08em;
      margin-bottom: 4px;
    }
    .cp-financing-period {
      font-size: 1rem;
      color: ${textSecondary};
      margin-top: 4px;
    }
    .cp-financing-note {
      font-size: 0.85rem;
      color: ${textMuted};
      margin-top: 8px;
    }

    /* ── How it works ── */
    #cp-how {
      background: ${isDark ? '#0D0D0D' : '#EDE8E0'};
      padding: 80px 0;
    }
    .cp-how-list { list-style: none; position: relative; max-width: 760px; margin: 0 auto; }
    .cp-how-list::before {
      content: '';
      position: absolute;
      left: 28px;
      top: 0; bottom: 0;
      width: 2px;
      background: ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(44,40,36,0.15)'};
    }
    .cp-how-item {
      display: flex;
      gap: 24px;
      padding: 28px 0;
      position: relative;
    }
    .cp-how-step {
      width: 56px; height: 56px;
      border-radius: 50%;
      background: ${isDark ? accent : '#2C2824'};
      color: #fff;
      display: flex;
      align-items: center;
      justify-content: center;
      font-family: 'DM Sans', sans-serif;
      font-weight: 700;
      font-size: 1.1rem;
      flex-shrink: 0;
      position: relative;
      z-index: 1;
    }
    .cp-how-content { flex: 1; padding-top: 10px; }
    .cp-how-title {
      font-family: 'DM Sans', sans-serif;
      font-size: 1.1rem;
      font-weight: 700;
      color: ${textPrimary};
      margin-bottom: 6px;
    }
    .cp-how-desc { font-size: 0.9rem; color: ${textSecondary}; line-height: 1.6; }
    .cp-how-duration {
      display: inline-block;
      margin-top: 6px;
      font-size: 0.8rem;
      color: ${isDark ? accent : '#2C2824'};
      background: ${isDark ? accent + '20' : 'rgba(44,40,36,0.08)'};
      padding: 2px 10px;
      border-radius: 100px;
      font-weight: 600;
    }

    /* ── Before/After ── */
    #cp-ba {
      background: ${bgBody};
      padding: 80px 0;
    }
    .cp-ba-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 24px;
    }

    /* ── Pricing calculator ── */
    #cp-pricing {
      background: ${isDark ? '#0D0D0D' : '#EDE8E0'};
      padding: 80px 0;
    }
    .cp-quiz-wrap {
      max-width: 640px;
      margin: 0 auto;
      background: ${bgCard};
      border: 1px solid ${borderColor};
      border-radius: 24px;
      overflow: hidden;
    }
    .cp-quiz-progress {
      height: 4px;
      background: ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(44,40,36,0.1)'};
    }
    .cp-quiz-progress-fill {
      height: 100%;
      background: ${isDark ? accent : '#2C2824'};
      transition: width 0.4s;
    }
    .cp-quiz-step { display: none; padding: 40px; }
    .cp-quiz-step.active { display: block; }
    .cp-quiz-step-title {
      font-family: 'DM Sans', sans-serif;
      font-size: 1.25rem;
      font-weight: 700;
      color: ${textPrimary};
      margin-bottom: 24px;
    }
    .cp-quiz-options { display: flex; flex-direction: column; gap: 10px; }
    .cp-quiz-option {
      padding: 14px 18px;
      border-radius: 10px;
      border: 1.5px solid ${borderColor};
      cursor: pointer;
      font-size: 0.95rem;
      color: ${textPrimary};
      background: ${isDark ? 'rgba(255,255,255,0.03)' : '#fff'};
      transition: all 0.15s;
      text-align: left;
    }
    .cp-quiz-option:hover, .cp-quiz-option.selected {
      border-color: ${isDark ? accent : '#2C2824'};
      background: ${isDark ? accent + '15' : 'rgba(44,40,36,0.05)'};
    }
    .cp-quiz-nav {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-top: 28px;
    }
    .cp-quiz-back {
      font-size: 0.9rem;
      color: ${textSecondary};
      background: none;
      border: none;
      cursor: pointer;
      font-family: 'Lato', sans-serif;
    }
    .cp-quiz-step-indicator {
      font-size: 0.8rem;
      color: ${textMuted};
    }
    /* Step 5: contact form */
    .cp-quiz-form-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 12px;
    }
    .cp-quiz-input {
      width: 100%;
      padding: 12px 14px;
      border-radius: 8px;
      border: 1.5px solid ${borderColor};
      background: ${isDark ? 'rgba(255,255,255,0.04)' : '#F5F2EE'};
      color: ${isDark ? '#fff' : '#2C2824'};
      font-size: 0.95rem;
      font-family: 'Lato', sans-serif;
      outline: none;
      transition: border-color 0.2s;
    }
    .cp-quiz-input:focus { border-color: ${isDark ? accent : '#2C2824'}; }
    .cp-quiz-input::placeholder { color: ${textMuted}; }
    .cp-quiz-full { grid-column: 1 / -1; }
    .cp-quiz-thanks {
      display: none;
      padding: 48px 40px;
      text-align: center;
    }
    .cp-quiz-thanks-icon { font-size: 3rem; margin-bottom: 16px; }
    .cp-quiz-thanks-title {
      font-family: 'DM Sans', sans-serif;
      font-size: 1.4rem;
      font-weight: 700;
      color: ${textPrimary};
    }

    /* ── Doctor bio ── */
    #cp-doctor {
      background: ${bgBody};
      padding: 80px 0;
    }
    .cp-doctor-wrap {
      display: grid;
      grid-template-columns: auto 1fr;
      gap: 40px;
      align-items: start;
      max-width: 860px;
      margin: 0 auto;
    }
    .cp-doctor-photo-wrap {
      width: 180px; height: 220px;
      border-radius: 16px;
      overflow: hidden;
      flex-shrink: 0;
      background: ${isDark ? '#1A1A1A' : '#D5CFC8'};
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 4rem;
    }
    .cp-doctor-photo-wrap img { width: 100%; height: 100%; object-fit: cover; }
    .cp-doctor-name {
      font-family: 'DM Sans', sans-serif;
      font-size: 1.6rem;
      font-weight: 700;
      color: ${textPrimary};
      margin-bottom: 4px;
    }
    .cp-doctor-title {
      font-size: 0.9rem;
      color: ${isDark ? accent : textMuted};
      margin-bottom: 16px;
    }
    .cp-doctor-bio {
      font-size: 0.95rem;
      color: ${textSecondary};
      line-height: 1.75;
      margin-bottom: 24px;
    }
    .cp-doctor-creds {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
    }
    .cp-doctor-cred {
      font-size: 0.82rem;
      padding: 4px 12px;
      border-radius: 100px;
      background: ${isDark ? 'rgba(255,255,255,0.07)' : 'rgba(44,40,36,0.07)'};
      color: ${textSecondary};
    }

    /* ── Treatment details ── */
    #cp-details {
      background: ${isDark ? '#0D0D0D' : '#EDE8E0'};
      padding: 80px 0;
    }
    .cp-details-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 16px;
    }
    .cp-detail-card {
      background: ${bgCard};
      border: 1px solid ${borderColor};
      border-radius: 14px;
      padding: 24px;
    }
    .cp-detail-label {
      font-size: 0.78rem;
      font-weight: 700;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      color: ${textMuted};
      margin-bottom: 6px;
    }
    .cp-detail-value {
      font-family: 'DM Sans', sans-serif;
      font-size: 1.05rem;
      font-weight: 600;
      color: ${textPrimary};
    }

    /* ── Main reviews ── */
    #cp-reviews {
      background: ${bgBody};
      padding: 80px 0;
    }
    .cp-reviews-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 20px;
    }

    /* ── FAQ ── */
    #cp-faq {
      background: ${isDark ? '#0D0D0D' : '#EDE8E0'};
      padding: 80px 0;
    }
    .cp-faq-list { max-width: 800px; margin: 0 auto; }
    .cp-faq-item {
      border: 1px solid ${borderColor};
      border-radius: 12px;
      margin-bottom: 10px;
      overflow: hidden;
    }
    .cp-faq-q {
      padding: 20px 24px;
      cursor: pointer;
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 16px;
      font-family: 'DM Sans', sans-serif;
      font-weight: 600;
      font-size: 0.97rem;
      color: ${textPrimary};
      background: ${bgCard};
      border: none;
      width: 100%;
      text-align: left;
      transition: background 0.15s;
    }
    .cp-faq-q:hover { background: ${isDark ? '#222' : '#f0ece5'}; }
    .cp-faq-arrow {
      font-size: 0.7rem;
      color: ${isDark ? accent : '#2C2824'};
      transition: transform 0.3s;
      flex-shrink: 0;
    }
    .cp-faq-item.open .cp-faq-arrow { transform: rotate(180deg); }
    .cp-faq-a {
      max-height: 0;
      overflow: hidden;
      transition: max-height 0.35s ease, padding 0.3s;
      color: ${textSecondary};
      font-size: 0.92rem;
      line-height: 1.7;
      padding: 0 24px;
      background: ${bgCard};
    }
    .cp-faq-item.open .cp-faq-a { max-height: 400px; padding: 16px 24px 24px; }

    /* ── CTA section ── */
    #cp-cta {
      background: ${isDark ? '#0D0D0D' : '#EDE8E0'};
      padding: 100px 0;
      position: relative;
      overflow: hidden;
    }
    .cp-cta-illustration {
      position: absolute;
      inset: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      pointer-events: none;
      overflow: hidden;
    }
    .cp-cta-illustration svg {
      width: 500px;
      height: auto;
      opacity: ${isDark ? '0.15' : '0.12'};
    }
    .cp-cta-content { position: relative; z-index: 1; text-align: center; max-width: 600px; margin: 0 auto; }
    .cp-cta-h2 {
      font-size: clamp(1.8rem, 4vw, 2.8rem);
      font-weight: 700;
      color: ${textPrimary};
      margin-bottom: 16px;
    }
    .cp-cta-sub {
      font-size: 1.05rem;
      color: ${textSecondary};
      margin-bottom: 36px;
    }

    /* ── Footer ── */
    #cp-footer {
      background: ${isDark ? '#000' : '#EDE8E0'};
      border-top: 1px solid ${borderColor};
      padding: 56px 0 28px;
      color: ${textSecondary};
    }
    .cp-footer-grid {
      display: grid;
      grid-template-columns: 2fr 1fr 1fr;
      gap: 40px;
      margin-bottom: 40px;
    }
    .cp-footer-brand-name {
      font-family: 'DM Sans', sans-serif;
      font-size: 1rem;
      font-weight: 700;
      color: ${textPrimary};
      margin-bottom: 10px;
    }
    .cp-footer-tagline { font-size: 0.88rem; max-width: 280px; line-height: 1.6; }
    .cp-footer-col-title {
      font-family: 'DM Sans', sans-serif;
      font-size: 0.88rem;
      font-weight: 700;
      color: ${textPrimary};
      margin-bottom: 14px;
      text-transform: uppercase;
      letter-spacing: 0.06em;
    }
    .cp-footer-col ul { list-style: none; display: flex; flex-direction: column; gap: 8px; }
    .cp-footer-col a { color: ${textSecondary}; font-size: 0.88rem; transition: color 0.2s; }
    .cp-footer-col a:hover { color: ${textPrimary}; }
    .cp-footer-bottom {
      padding-top: 24px;
      border-top: 1px solid ${borderColor};
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-wrap: wrap;
      gap: 12px;
      font-size: 0.82rem;
    }
    .cp-footer-bottom a { color: ${isDark ? accent : '#2C2824'}; }

    /* ── Booking Modal ── */
    #cp-modal {
      display: none;
      position: fixed;
      inset: 0;
      z-index: 9999;
      align-items: center;
      justify-content: center;
      padding: 24px;
    }
    #cp-modal.open { display: flex; }
    .cp-modal-backdrop {
      position: absolute;
      inset: 0;
      background: rgba(0,0,0,0.72);
      backdrop-filter: blur(6px);
    }
    .cp-modal-box {
      position: relative;
      z-index: 1;
      background: ${isDark ? '#111' : '#fff'};
      border-radius: 20px;
      width: 100%;
      max-width: 520px;
      max-height: 90vh;
      overflow-y: auto;
      padding: 40px;
      border: 1px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(44,40,36,0.12)'};
    }
    .cp-modal-close {
      position: absolute;
      top: 16px; right: 16px;
      background: none;
      border: none;
      color: ${isDark ? '#888' : '#8A8480'};
      cursor: pointer;
      font-size: 1.4rem;
      line-height: 1;
    }
    .cp-modal-title {
      font-family: 'DM Sans', sans-serif;
      font-size: 1.4rem;
      font-weight: 700;
      color: ${isDark ? '#fff' : '#2C2824'};
      margin-bottom: 24px;
    }
    .cp-modal-form { display: flex; flex-direction: column; gap: 14px; }
    .cp-modal-row { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
    .cp-modal-input {
      width: 100%;
      padding: 12px 14px;
      border-radius: 8px;
      border: 1.5px solid ${isDark ? 'rgba(255,255,255,0.12)' : 'rgba(44,40,36,0.15)'};
      background: ${isDark ? 'rgba(255,255,255,0.05)' : '#F5F2EE'};
      color: ${isDark ? '#fff' : '#2C2824'};
      font-size: 0.95rem;
      font-family: 'Lato', sans-serif;
      outline: none;
      transition: border-color 0.2s;
    }
    .cp-modal-input:focus { border-color: ${isDark ? accent : '#2C2824'}; }
    .cp-modal-input::placeholder { color: ${isDark ? '#555' : '#8A8480'}; }
    .cp-modal-label {
      display: block;
      font-size: 0.85rem;
      font-weight: 600;
      color: ${isDark ? '#ccc' : '#2C2824'};
      margin-bottom: 5px;
    }
    .cp-modal-field { display: flex; flex-direction: column; }
    .cp-modal-discrete {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 0.82rem;
      color: ${isDark ? '#666' : '#8A8480'};
      margin-top: 4px;
    }

    /* ── Scroll reveal ── */
    .cp-reveal { opacity: 0; transform: translateY(18px); transition: opacity 0.55s ease, transform 0.55s ease; }
    .cp-reveal.visible { opacity: 1; transform: none; }

    /* ── Responsive ── */
    @media (max-width: 900px) {
      .cp-stats-grid { grid-template-columns: repeat(2, 1fr); }
      .cp-reviews-grid-3,
      .cp-reviews-grid,
      .cp-benefits-grid,
      .cp-ba-grid,
      .cp-details-grid { grid-template-columns: repeat(2, 1fr); }
      .cp-financing-box { grid-template-columns: 1fr; }
      .cp-doctor-wrap { grid-template-columns: 1fr; }
      .cp-footer-grid { grid-template-columns: 1fr 1fr; }
    }
    @media (max-width: 600px) {
      .cp-stats-grid { grid-template-columns: repeat(2, 1fr); }
      .cp-reviews-grid-3,
      .cp-reviews-grid,
      .cp-benefits-grid,
      .cp-ba-grid,
      .cp-details-grid { grid-template-columns: 1fr; }
      .cp-hero-cta-group { flex-direction: column; }
      .cp-quiz-form-grid { grid-template-columns: 1fr; }
      .cp-modal-row { grid-template-columns: 1fr; }
      .cp-footer-grid { grid-template-columns: 1fr; }
      .cp-how-list::before { left: 20px; }
    }
  </style>
</head>
<body>

<!-- ═══════════════════════════════════════════════════════ -->
<!-- 1. COUNTDOWN TIMER BAR -->
<!-- ═══════════════════════════════════════════════════════ -->
<div id="cp-countdown-bar">
  <span>${t.countdownMsg}</span>
  <div class="cp-cd-group">
    <div class="cp-cd-unit">
      <span class="cp-cd-num" id="cd-days">14</span>
      <span class="cp-cd-label">${t.days}</span>
    </div>
    <span class="cp-cd-sep">:</span>
    <div class="cp-cd-unit">
      <span class="cp-cd-num" id="cd-hours">00</span>
      <span class="cp-cd-label">${t.hours}</span>
    </div>
    <span class="cp-cd-sep">:</span>
    <div class="cp-cd-unit">
      <span class="cp-cd-num" id="cd-mins">00</span>
      <span class="cp-cd-label">${t.mins}</span>
    </div>
    <span class="cp-cd-sep">:</span>
    <div class="cp-cd-unit">
      <span class="cp-cd-num" id="cd-secs">00</span>
      <span class="cp-cd-label">${t.secs}</span>
    </div>
  </div>
</div>

<!-- ═══════════════════════════════════════════════════════ -->
<!-- 2. NAVIGATION -->
<!-- ═══════════════════════════════════════════════════════ -->
<header id="cp-nav">
  <div class="cp-container cp-nav-inner">
    <a href="#" class="cp-nav-logo">${logoHtml}</a>
    <div class="cp-nav-right">
      <div class="cp-lang-switcher">
        <button class="cp-lang-btn${lang === 'de' ? ' active' : ''}" onclick="switchLang('de')">DE</button>
        <button class="cp-lang-btn${lang === 'en' ? ' active' : ''}" onclick="switchLang('en')">EN</button>
      </div>
      <button class="cp-btn" onclick="openModal()">${t.bookBtn}</button>
    </div>
  </div>
</header>

<!-- ═══════════════════════════════════════════════════════ -->
<!-- 3. HERO -->
<!-- ═══════════════════════════════════════════════════════ -->
<section id="cp-hero">
  <div class="cp-hero-bg"></div>
  <div class="cp-hero-bg-img" id="cp-hero-bg-img" style="background-image:url('')"></div>
  <div class="cp-container">
    <div class="cp-hero-content">
      <div class="cp-hero-badge">✦ ${brand.clinicName}</div>
      <h1 class="cp-hero-h1">${content.heroHeadline}</h1>
      <div class="cp-hero-price">
        <span class="cp-hero-price-special">${startingPriceRaw}</span>
        ${pricingOptions.length > 0 ? `<span class="cp-hero-price-statt">${t.statt}</span><span class="cp-hero-price-original">${currency} ${(priceNum * 1.15).toLocaleString()}</span>` : ''}
      </div>
      <p class="cp-hero-financing">💳 ${t.financing} — ${t.financingFrom} ${currency} ${monthlyMin.toLocaleString()}${t.financingPerMonth}</p>
      <div class="cp-hero-cta-group">
        <button class="cp-btn cp-btn-lg" onclick="openModal()">${content.heroCTA}</button>
        <button class="cp-btn cp-btn-lg cp-btn-outline" onclick="document.getElementById('cp-reviews-anchor').scrollIntoView({behavior:'smooth'})">
          ${lang === 'de' ? 'Bewertungen lesen' : 'Read Reviews'} ↓
        </button>
      </div>
      <div class="cp-trust-bar">
        ${content.trustBarItems.map(item => `
          <div class="cp-trust-item">
            <span>${item.icon}</span>
            <span>${item.text}</span>
          </div>`).join('')}
      </div>
    </div>
  </div>
</section>

<!-- ═══════════════════════════════════════════════════════ -->
<!-- 4. STATS BAR -->
<!-- ═══════════════════════════════════════════════════════ -->
<section id="cp-stats">
  <div class="cp-container">
    <div class="cp-stats-grid">
      <div class="cp-stat-item">
        <span class="cp-stat-num" data-count="${patientCount.replace(/[^0-9]/g, '')}" data-suffix="${patientCount.replace(/[0-9]/g, '').trim()}">${patientCount}</span>
        <div class="cp-stat-label">${lang === 'de' ? 'Behandlungen' : 'Treatments'}</div>
      </div>
      <div class="cp-stat-item">
        <span class="cp-stat-num" data-count="98" data-suffix="%">98%</span>
        <div class="cp-stat-label">${lang === 'de' ? 'Zufriedenheitsrate' : 'Satisfaction Rate'}</div>
      </div>
      <div class="cp-stat-item">
        <span class="cp-stat-num" data-count="${yearsExp.replace(/[^0-9]/g, '')}" data-suffix="${yearsExp.replace(/[0-9]/g, '').trim()}">${yearsExp}</span>
        <div class="cp-stat-label">${lang === 'de' ? 'Jahre Erfahrung' : 'Years Experience'}</div>
      </div>
      <div class="cp-stat-item">
        <span class="cp-stat-num" style="font-size:clamp(1.1rem,2vw,1.5rem)">${location}</span>
        <div class="cp-stat-label">${lang === 'de' ? 'Standort' : 'Location'}</div>
      </div>
    </div>
  </div>
</section>

<!-- ═══════════════════════════════════════════════════════ -->
<!-- 5. TOP 3 REVIEWS (no header) -->
<!-- ═══════════════════════════════════════════════════════ -->
<section id="cp-top-reviews">
  <div id="cp-reviews-anchor"></div>
  <div class="cp-container">
    ${topReviews.length > 0
      ? `<div class="cp-reviews-grid-3 cp-reveal">
          ${topReviews.map(r => renderReview(r)).join('')}
        </div>`
      : `<p style="text-align:center;color:${textMuted}">${t.topReviewsNone}</p>`
    }
  </div>
</section>

<!-- ═══════════════════════════════════════════════════════ -->
<!-- 6. BENEFITS -->
<!-- ═══════════════════════════════════════════════════════ -->
<section id="cp-benefits" class="cp-section">
  <div class="cp-container">
    <div class="cp-section-center cp-reveal">
      <div class="cp-section-label">${t.benefitsTitle}</div>
      <h2 class="cp-section-h2">${content.reasonsTitle}</h2>
      <p class="cp-section-sub">${content.reasonsIntro}</p>
    </div>
    <div class="cp-benefits-grid cp-reveal">
      ${content.reasons.map(r => `
        <div class="cp-benefit-card">
          <div class="cp-benefit-icon">${r.icon}</div>
          <div class="cp-benefit-title">${r.title}</div>
          <div class="cp-benefit-desc">${r.description}</div>
        </div>`).join('')}
    </div>
  </div>
</section>

<!-- ═══════════════════════════════════════════════════════ -->
<!-- 7. FINANCING -->
<!-- ═══════════════════════════════════════════════════════ -->
<section id="cp-financing" class="cp-section">
  <div class="cp-container">
    <div class="cp-section-center cp-reveal" style="margin-bottom:36px">
      <h2 class="cp-section-h2">${t.financingTitle}</h2>
      <p class="cp-section-sub">${t.financingDesc}</p>
    </div>
    <div class="cp-financing-box cp-reveal">
      <div>
        <div class="cp-financing-from">${t.financingFrom}</div>
        <div class="cp-financing-monthly">${currency} ${monthlyMin.toLocaleString()}</div>
        <div class="cp-financing-period">${t.financingPerMonth}</div>
        <div class="cp-financing-note">${t.financingRange}</div>
      </div>
      <div>
        <p style="color:${textSecondary};font-size:0.95rem;line-height:1.75;margin-bottom:24px">
          ${lang === 'de'
            ? 'Wir bieten flexible Zahlungspläne an, damit der Preis kein Hindernis ist. Sprechen Sie uns an — wir finden gemeinsam eine Lösung.'
            : 'We offer flexible payment plans so price is never a barrier. Talk to us — we\'ll find a solution together.'}
        </p>
        <button class="cp-btn" onclick="openModal()">${t.financingCta}</button>
      </div>
    </div>
  </div>
</section>

<!-- ═══════════════════════════════════════════════════════ -->
<!-- 8. HOW IT WORKS -->
<!-- ═══════════════════════════════════════════════════════ -->
<section id="cp-how" class="cp-section">
  <div class="cp-container">
    <div class="cp-section-center cp-reveal" style="margin-bottom:48px">
      <h2 class="cp-section-h2">${t.howTitle}</h2>
    </div>
    <ul class="cp-how-list cp-reveal">
      ${content.procedureSteps.map(step => `
        <li class="cp-how-item">
          <div class="cp-how-step">${step.step}</div>
          <div class="cp-how-content">
            <div class="cp-how-title">${step.title}</div>
            <div class="cp-how-desc">${step.description}</div>
            ${step.duration ? `<span class="cp-how-duration">⏱ ${step.duration}</span>` : ''}
          </div>
        </li>`).join('')}
    </ul>
    <div style="text-align:center;margin-top:48px" class="cp-reveal">
      <button class="cp-btn cp-btn-lg" onclick="openModal()">${content.heroCTA}</button>
    </div>
  </div>
</section>

<!-- ═══════════════════════════════════════════════════════ -->
<!-- 9. BEFORE / AFTER -->
<!-- ═══════════════════════════════════════════════════════ -->
<section id="cp-ba" class="cp-section">
  <div class="cp-container">
    <div class="cp-section-center cp-reveal" style="margin-bottom:40px">
      <h2 class="cp-section-h2">${t.baTitle}</h2>
      <p class="cp-section-sub">${t.baSubtitle}</p>
    </div>
    <div class="cp-ba-grid cp-reveal">
      ${baPairs.slice(0, 6).map((pair, i) => renderBAPair(pair, i)).join('')}
    </div>
  </div>
</section>

<!-- ═══════════════════════════════════════════════════════ -->
<!-- 10. PRICING CALCULATOR (multi-step quiz) -->
<!-- ═══════════════════════════════════════════════════════ -->
<section id="cp-pricing" class="cp-section">
  <div class="cp-container">
    <div class="cp-section-center cp-reveal" style="margin-bottom:40px">
      <h2 class="cp-section-h2">${t.pricingTitle}</h2>
      <p class="cp-section-sub">${content.pricingSubtitle}</p>
    </div>
    <div class="cp-quiz-wrap cp-reveal" id="cp-quiz">
      <div class="cp-quiz-progress">
        <div class="cp-quiz-progress-fill" id="cp-quiz-progress" style="width:20%"></div>
      </div>

      <!-- Step 1 -->
      <div class="cp-quiz-step active" id="cp-quiz-step-1">
        <div class="cp-quiz-step-title">${t.quizStep1Title}</div>
        <div class="cp-quiz-options">
          ${(content.reasons.slice(0, 4).length > 0
            ? content.reasons.slice(0, 4).map(r => `<button class="cp-quiz-option" onclick="selectOption(this, 1)">${r.icon} ${r.title}</button>`)
            : [
                `<button class="cp-quiz-option" onclick="selectOption(this, 1)">🔍 ${lang === 'de' ? 'Ästhetische Verbesserung' : 'Aesthetic improvement'}</button>`,
                `<button class="cp-quiz-option" onclick="selectOption(this, 1)">💪 ${lang === 'de' ? 'Selbstvertrauen stärken' : 'Boost confidence'}</button>`,
                `<button class="cp-quiz-option" onclick="selectOption(this, 1)">⏰ ${lang === 'de' ? 'Natürliche Verjüngung' : 'Natural rejuvenation'}</button>`,
                `<button class="cp-quiz-option" onclick="selectOption(this, 1)">✨ ${lang === 'de' ? 'Medizinische Notwendigkeit' : 'Medical necessity'}</button>`,
              ]
          ).join('')}
        </div>
        <div class="cp-quiz-nav">
          <span></span>
          <span class="cp-quiz-step-indicator">1 / 5</span>
        </div>
      </div>

      <!-- Step 2 -->
      <div class="cp-quiz-step" id="cp-quiz-step-2">
        <div class="cp-quiz-step-title">${t.quizStep2Title}</div>
        <div class="cp-quiz-options">
          <button class="cp-quiz-option" onclick="selectOption(this, 2)">${lang === 'de' ? '✅ Ja, ich habe Erfahrung damit' : '✅ Yes, I have experience'}</button>
          <button class="cp-quiz-option" onclick="selectOption(this, 2)">${lang === 'de' ? '❌ Nein, das erste Mal' : '❌ No, this would be my first time'}</button>
          <button class="cp-quiz-option" onclick="selectOption(this, 2)">${lang === 'de' ? '🤔 Ich bin mir nicht sicher' : '🤔 I\'m not sure yet'}</button>
        </div>
        <div class="cp-quiz-nav">
          <button class="cp-quiz-back" onclick="quizBack(2)">${t.quizBack} ←</button>
          <span class="cp-quiz-step-indicator">2 / 5</span>
        </div>
      </div>

      <!-- Step 3 -->
      <div class="cp-quiz-step" id="cp-quiz-step-3">
        <div class="cp-quiz-step-title">${t.quizStep3Title}</div>
        <div class="cp-quiz-options">
          <button class="cp-quiz-option" onclick="selectOption(this, 3)">${lang === 'de' ? '🚀 So schnell wie möglich' : '🚀 As soon as possible'}</button>
          <button class="cp-quiz-option" onclick="selectOption(this, 3)">${lang === 'de' ? '📅 In den nächsten 1–3 Monaten' : '📅 Within 1–3 months'}</button>
          <button class="cp-quiz-option" onclick="selectOption(this, 3)">${lang === 'de' ? '🗓️ In 3–6 Monaten' : '🗓️ In 3–6 months'}</button>
          <button class="cp-quiz-option" onclick="selectOption(this, 3)">${lang === 'de' ? '🔍 Ich informiere mich nur' : '🔍 Just researching for now'}</button>
        </div>
        <div class="cp-quiz-nav">
          <button class="cp-quiz-back" onclick="quizBack(3)">${t.quizBack} ←</button>
          <span class="cp-quiz-step-indicator">3 / 5</span>
        </div>
      </div>

      <!-- Step 4 -->
      <div class="cp-quiz-step" id="cp-quiz-step-4">
        <div class="cp-quiz-step-title">${t.quizStep4Title}</div>
        <div class="cp-quiz-options">
          <button class="cp-quiz-option" onclick="selectOption(this, 4)">${lang === 'de' ? '🔍 Google / Suchmaschine' : '🔍 Google / Search engine'}</button>
          <button class="cp-quiz-option" onclick="selectOption(this, 4)">${lang === 'de' ? '📱 Social Media (Instagram, Facebook)' : '📱 Social Media (Instagram, Facebook)'}</button>
          <button class="cp-quiz-option" onclick="selectOption(this, 4)">${lang === 'de' ? '👥 Empfehlung von Freunden/Familie' : '👥 Friends / Family recommendation'}</button>
          <button class="cp-quiz-option" onclick="selectOption(this, 4)">${lang === 'de' ? '📰 Artikel / Bewertungsportal' : '📰 Article / Review platform'}</button>
        </div>
        <div class="cp-quiz-nav">
          <button class="cp-quiz-back" onclick="quizBack(4)">${t.quizBack} ←</button>
          <span class="cp-quiz-step-indicator">4 / 5</span>
        </div>
      </div>

      <!-- Step 5: Contact form -->
      <div class="cp-quiz-step" id="cp-quiz-step-5">
        <div class="cp-quiz-step-title">${t.quizStep5Title}</div>
        <div class="cp-quiz-form-grid">
          <div>
            <input class="cp-quiz-input" type="text" id="cp-quiz-vorname" placeholder="${t.formFirstName}" required>
          </div>
          <div>
            <input class="cp-quiz-input" type="text" id="cp-quiz-nachname" placeholder="${t.formLastName}" required>
          </div>
          <div>
            <input class="cp-quiz-input cp-quiz-full" type="email" id="cp-quiz-email" placeholder="${t.formEmail}" required>
          </div>
          <div>
            <input class="cp-quiz-input cp-quiz-full" type="tel" id="cp-quiz-phone" placeholder="${t.formPhone}" required>
          </div>
        </div>
        <div style="margin-top:20px">
          <button class="cp-btn cp-btn-lg" style="width:100%" onclick="submitQuiz()">${t.quizSubmit}</button>
        </div>
        <div class="cp-quiz-nav" style="margin-top:16px">
          <button class="cp-quiz-back" onclick="quizBack(5)">${t.quizBack} ←</button>
          <span class="cp-quiz-step-indicator">5 / 5</span>
        </div>
      </div>

      <!-- Thank you -->
      <div class="cp-quiz-thanks" id="cp-quiz-thanks">
        <div class="cp-quiz-thanks-icon">✅</div>
        <div class="cp-quiz-thanks-title">${t.quizThanks}</div>
      </div>
    </div>
  </div>
</section>

<!-- ═══════════════════════════════════════════════════════ -->
<!-- 11. DOCTOR BIO -->
<!-- ═══════════════════════════════════════════════════════ -->
<section id="cp-doctor" class="cp-section">
  <div class="cp-container">
    <div class="cp-section-label cp-section-center cp-reveal" style="margin-bottom:32px">${t.docTitle}</div>
    <div class="cp-doctor-wrap cp-reveal">
      <div class="cp-doctor-photo-wrap">
        ${config.doctorPhotoUrl
          ? `<img src="${config.doctorPhotoUrl}" alt="Doctor">`
          : `<span>👨‍⚕️</span>`}
      </div>
      <div>
        <div class="cp-doctor-name">${lang === 'de' ? 'Dr. med.' : 'Dr.'} ${brand.clinicName.replace(/Clinic|Klinik|Center|Zentrum/gi, '').trim()}</div>
        <div class="cp-doctor-title">${brand.clinicName} · ${input.location || 'Zürich'}</div>
        <p class="cp-doctor-bio">
          ${lang === 'de'
            ? `Als erfahrener Spezialist für ästhetische Medizin widmet sich unser Experte ausschließlich dem Bereich ${input.treatmentName}. Mit ${yearsExp} Jahren Erfahrung und mehr als ${patientCount} zufriedenen Patienten gehört unsere Klinik zu den führenden Adressen in ${input.location || 'der Schweiz'}.`
            : `As an experienced specialist in aesthetic medicine, our expert focuses exclusively on ${input.treatmentName}. With ${yearsExp} years of experience and more than ${patientCount} satisfied patients, our clinic is one of the leading addresses in ${input.location || 'Switzerland'}.`}
        </p>
        <div class="cp-doctor-creds">
          <span class="cp-doctor-cred">🎓 ${lang === 'de' ? 'Facharzt ästhetische Medizin' : 'Specialist Aesthetic Medicine'}</span>
          <span class="cp-doctor-cred">🏥 ${yearsExp} ${lang === 'de' ? 'Jahre Erfahrung' : 'Years Experience'}</span>
          <span class="cp-doctor-cred">⭐ ${patientCount} ${lang === 'de' ? 'Patienten' : 'Patients'}</span>
        </div>
      </div>
    </div>
  </div>
</section>

<!-- ═══════════════════════════════════════════════════════ -->
<!-- 12. TREATMENT DETAILS -->
<!-- ═══════════════════════════════════════════════════════ -->
<section id="cp-details" class="cp-section">
  <div class="cp-container">
    <div class="cp-section-center cp-reveal" style="margin-bottom:40px">
      <h2 class="cp-section-h2">${t.detailsTitle}</h2>
    </div>
    <div class="cp-details-grid cp-reveal">
      <div class="cp-detail-card">
        <div class="cp-detail-label">${lang === 'de' ? 'Behandlung' : 'Treatment'}</div>
        <div class="cp-detail-value">${input.treatmentName}</div>
      </div>
      <div class="cp-detail-card">
        <div class="cp-detail-label">${lang === 'de' ? 'Dauer' : 'Duration'}</div>
        <div class="cp-detail-value">${input.duration || (lang === 'de' ? 'Je nach Fall' : 'Varies by case')}</div>
      </div>
      <div class="cp-detail-card">
        <div class="cp-detail-label">${lang === 'de' ? 'Narkose' : 'Anesthesia'}</div>
        <div class="cp-detail-value">${input.anesthesia || (lang === 'de' ? 'Lokal / Vollnarkose' : 'Local / General')}</div>
      </div>
      <div class="cp-detail-card">
        <div class="cp-detail-label">${lang === 'de' ? 'Erholung' : 'Recovery'}</div>
        <div class="cp-detail-value">${input.recovery || (lang === 'de' ? 'Minimal' : 'Minimal downtime')}</div>
      </div>
      <div class="cp-detail-card">
        <div class="cp-detail-label">${lang === 'de' ? 'Preis ab' : 'Price from'}</div>
        <div class="cp-detail-value">${startingPriceRaw}</div>
      </div>
      <div class="cp-detail-card">
        <div class="cp-detail-label">${lang === 'de' ? 'Standort' : 'Location'}</div>
        <div class="cp-detail-value">${brand.address || input.location || 'Zürich'}</div>
      </div>
      ${content.procedureSteps.slice(0, 3).map(step => `
      <div class="cp-detail-card">
        <div class="cp-detail-label">${lang === 'de' ? 'Schritt' : 'Step'} ${step.step}</div>
        <div class="cp-detail-value">${step.title}</div>
      </div>`).join('')}
    </div>
  </div>
</section>

<!-- ═══════════════════════════════════════════════════════ -->
<!-- 13. 6 MAIN REVIEWS (3×2 grid) -->
<!-- ═══════════════════════════════════════════════════════ -->
<section id="cp-reviews" class="cp-section">
  <div class="cp-container">
    <div class="cp-section-center cp-reveal" style="margin-bottom:40px">
      <h2 class="cp-section-h2" id="bewertungen">${t.reviewsTitle}</h2>
    </div>
    ${mainReviews.length > 0
      ? `<div class="cp-reviews-grid cp-reveal">${mainReviews.map(r => renderReview(r)).join('')}</div>`
      : topReviews.length > 0
        ? `<div class="cp-reviews-grid cp-reveal">${reviews.slice(0, 6).map(r => renderReview(r)).join('')}</div>`
        : `<p style="text-align:center;color:${textMuted}">${t.topReviewsNone}</p>`}
  </div>
</section>

<!-- ═══════════════════════════════════════════════════════ -->
<!-- 14. FAQ -->
<!-- ═══════════════════════════════════════════════════════ -->
<section id="cp-faq" class="cp-section">
  <div class="cp-container">
    <div class="cp-section-center cp-reveal" style="margin-bottom:40px">
      <h2 class="cp-section-h2">${t.faqTitle}</h2>
    </div>
    <div class="cp-faq-list cp-reveal">
      ${content.faqItems.map((item, i) => `
        <div class="cp-faq-item" id="faq-${i}">
          <button class="cp-faq-q" onclick="toggleFaq(${i})">
            <span>${item.question}</span>
            <span class="cp-faq-arrow">▼</span>
          </button>
          <div class="cp-faq-a">${item.answer}</div>
        </div>`).join('')}
    </div>
  </div>
</section>

<!-- ═══════════════════════════════════════════════════════ -->
<!-- 15. CTA SECTION (with SVG illustration) -->
<!-- ═══════════════════════════════════════════════════════ -->
<section id="cp-cta">
  <!-- SVG illustration placeholder at 15% opacity -->
  <div class="cp-cta-illustration">
    <svg viewBox="0 0 400 500" fill="none" xmlns="http://www.w3.org/2000/svg">
      <!-- Generic anatomical/medical illustration placeholder -->
      <ellipse cx="200" cy="120" rx="60" ry="80" stroke="${isDark ? '#fff' : '#2C2824'}" stroke-width="2" fill="none"/>
      <line x1="200" y1="200" x2="200" y2="340" stroke="${isDark ? '#fff' : '#2C2824'}" stroke-width="2"/>
      <line x1="200" y1="240" x2="130" y2="300" stroke="${isDark ? '#fff' : '#2C2824'}" stroke-width="2"/>
      <line x1="200" y1="240" x2="270" y2="300" stroke="${isDark ? '#fff' : '#2C2824'}" stroke-width="2"/>
      <line x1="200" y1="340" x2="160" y2="440" stroke="${isDark ? '#fff' : '#2C2824'}" stroke-width="2"/>
      <line x1="200" y1="340" x2="240" y2="440" stroke="${isDark ? '#fff' : '#2C2824'}" stroke-width="2"/>
      <circle cx="200" cy="120" r="8" fill="${isDark ? '#fff' : '#2C2824'}"/>
      <circle cx="130" cy="300" r="5" fill="${isDark ? '#fff' : '#2C2824'}"/>
      <circle cx="270" cy="300" r="5" fill="${isDark ? '#fff' : '#2C2824'}"/>
      <circle cx="160" cy="440" r="5" fill="${isDark ? '#fff' : '#2C2824'}"/>
      <circle cx="240" cy="440" r="5" fill="${isDark ? '#fff' : '#2C2824'}"/>
    </svg>
  </div>
  <div class="cp-container">
    <div class="cp-cta-content cp-reveal">
      <h2 class="cp-cta-h2">${t.ctaSectionTitle}</h2>
      <p class="cp-cta-sub">${t.ctaSectionSub}</p>
      <button class="cp-btn cp-btn-lg" onclick="openModal()">${t.bookBtn}</button>
    </div>
  </div>
</section>

<!-- ═══════════════════════════════════════════════════════ -->
<!-- 16. BOOKING MODAL -->
<!-- ═══════════════════════════════════════════════════════ -->
<div id="cp-modal">
  <div class="cp-modal-backdrop" onclick="closeModal()"></div>
  <div class="cp-modal-box">
    <button class="cp-modal-close" onclick="closeModal()">✕</button>
    <div class="cp-modal-title">${t.modalTitle}</div>
    <form class="cp-modal-form" onsubmit="handleModalSubmit(event)">
      <div class="cp-modal-row">
        <div class="cp-modal-field">
          <label class="cp-modal-label">${t.formFirstName}</label>
          <input id="cp-modal-vorname" class="cp-modal-input" type="text" placeholder="${lang === 'de' ? 'Max' : 'John'}" required>
        </div>
        <div class="cp-modal-field">
          <label class="cp-modal-label">${t.formLastName}</label>
          <input id="cp-modal-nachname" class="cp-modal-input" type="text" placeholder="${lang === 'de' ? 'Müller' : 'Smith'}" required>
        </div>
      </div>
      <div class="cp-modal-field">
        <label class="cp-modal-label">${t.formEmail}</label>
        <input id="cp-modal-email" class="cp-modal-input" type="email" placeholder="you@example.com" required>
      </div>
      <div class="cp-modal-field">
        <label class="cp-modal-label">${t.formPhone}</label>
        <input id="cp-modal-phone" class="cp-modal-input" type="tel" placeholder="${lang === 'de' ? '+41 79 000 00 00' : '+1 234 567 8900'}" required>
      </div>
      <div class="cp-modal-field">
        <label class="cp-modal-label">${t.formMessage}</label>
        <textarea class="cp-modal-input" rows="3" placeholder="${lang === 'de' ? 'Ihre Frage oder Anmerkung...' : 'Your question or note...'}"></textarea>
      </div>
      <button type="submit" class="cp-btn cp-btn-lg" style="width:100%">${t.formSubmit} →</button>
      <div class="cp-modal-discrete">🔒 ${t.formDiscrete}</div>
    </form>
  </div>
</div>

<!-- ═══════════════════════════════════════════════════════ -->
<!-- 17. FOOTER -->
<!-- ═══════════════════════════════════════════════════════ -->
<footer id="cp-footer">
  <div class="cp-container">
    <div class="cp-footer-grid">
      <div>
        ${brand.logoUrl
          ? `<img src="${brand.logoUrl}" alt="${brand.clinicName}" style="height:32px;width:auto;margin-bottom:12px">`
          : `<div class="cp-footer-brand-name">${brand.clinicName}</div>`}
        <div class="cp-footer-tagline">${content.footerTagline}</div>
        ${brand.phone ? `<div style="margin-top:12px;font-size:0.88rem"><a href="tel:${brand.phone}" style="color:${textSecondary}">${brand.phone}</a></div>` : ''}
        ${brand.email ? `<div style="margin-top:4px;font-size:0.88rem"><a href="mailto:${brand.email}" style="color:${textSecondary}">${brand.email}</a></div>` : ''}
        ${brand.address ? `<div style="margin-top:4px;font-size:0.88rem;color:${textSecondary}">${brand.address}</div>` : ''}
      </div>
      <div class="cp-footer-col">
        <div class="cp-footer-col-title">${lang === 'de' ? 'Navigation' : 'Navigation'}</div>
        <ul>
          <li><a href="#cp-benefits">${lang === 'de' ? 'Vorteile' : 'Benefits'}</a></li>
          <li><a href="#cp-how">${lang === 'de' ? 'Ablauf' : 'How it works'}</a></li>
          <li><a href="#cp-ba">${lang === 'de' ? 'Vorher / Nachher' : 'Before & After'}</a></li>
          <li><a href="#cp-pricing">${lang === 'de' ? 'Kosten' : 'Pricing'}</a></li>
          <li><a href="#bewertungen">${lang === 'de' ? 'Bewertungen' : 'Reviews'}</a></li>
          <li><a href="#cp-faq">FAQ</a></li>
        </ul>
      </div>
      <div class="cp-footer-col">
        <div class="cp-footer-col-title">${lang === 'de' ? 'Rechtliches' : 'Legal'}</div>
        <ul>
          <li><a href="#">${t.footerPrivacy}</a></li>
          <li><a href="#">${t.footerImprint}</a></li>
          <li><a href="#">${t.footerTerms}</a></li>
        </ul>
      </div>
    </div>
    <div class="cp-footer-bottom">
      <span>© ${new Date().getFullYear()} ${brand.clinicName}. ${lang === 'de' ? 'Alle Rechte vorbehalten.' : 'All rights reserved.'}</span>
      <span>${lang === 'de' ? 'Erstellt mit' : 'Built with'} <a href="https://clinicpages.io">ClinicPages</a></span>
    </div>
  </div>
</footer>

<!-- ═══════════════════════════════════════════════════════ -->
<!-- JAVASCRIPT -->
<!-- ═══════════════════════════════════════════════════════ -->
<script>
(function() {
  'use strict';

  // ── Countdown timer ──
  var CD_KEY = '${cdKey}';
  var FOURTEEN_DAYS = 14 * 24 * 60 * 60 * 1000;
  function initCountdown() {
    var end = localStorage.getItem(CD_KEY);
    if (!end) {
      end = Date.now() + FOURTEEN_DAYS;
      localStorage.setItem(CD_KEY, end);
    }
    end = parseInt(end);
    function tick() {
      var now = Date.now();
      var diff = Math.max(0, end - now);
      var d = Math.floor(diff / 86400000);
      var h = Math.floor((diff % 86400000) / 3600000);
      var m = Math.floor((diff % 3600000) / 60000);
      var s = Math.floor((diff % 60000) / 1000);
      var pad = function(n) { return n < 10 ? '0' + n : '' + n; };
      var el = function(id) { return document.getElementById(id); };
      if (el('cd-days')) el('cd-days').textContent = pad(d);
      if (el('cd-hours')) el('cd-hours').textContent = pad(h);
      if (el('cd-mins')) el('cd-mins').textContent = pad(m);
      if (el('cd-secs')) el('cd-secs').textContent = pad(s);
    }
    tick();
    setInterval(tick, 1000);
  }

  // ── Animated stat counters ──
  function initStats() {
    var observer = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (!entry.isIntersecting) return;
        var el = entry.target;
        var target = parseInt(el.getAttribute('data-count') || '0');
        var suffix = el.getAttribute('data-suffix') || '';
        if (!target) return;
        var start = 0;
        var duration = 1400;
        var step = target / (duration / 16);
        var timer = setInterval(function() {
          start += step;
          if (start >= target) {
            start = target;
            clearInterval(timer);
          }
          el.textContent = Math.round(start).toLocaleString('de-CH') + suffix;
        }, 16);
        observer.unobserve(el);
      });
    }, { threshold: 0.5 });
    document.querySelectorAll('[data-count]').forEach(function(el) { observer.observe(el); });
  }

  // ── Scroll reveal ──
  function initReveal() {
    var observer = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08 });
    document.querySelectorAll('.cp-reveal').forEach(function(el) { observer.observe(el); });
  }

  // ── Modal ──
  window.openModal = function() {
    var m = document.getElementById('cp-modal');
    if (m) m.classList.add('open');
    document.body.style.overflow = 'hidden';
    // Pre-fill from sessionStorage
    var fields = [
      ['cp-modal-vorname', 'lead_vorname'],
      ['cp-modal-nachname', 'lead_nachname'],
      ['cp-modal-email', 'lead_email'],
      ['cp-modal-phone', 'lead_phone'],
    ];
    fields.forEach(function(pair) {
      var el = document.getElementById(pair[0]);
      var val = sessionStorage.getItem(pair[1]);
      if (el && val) el.value = val;
    });
  };
  window.closeModal = function() {
    var m = document.getElementById('cp-modal');
    if (m) m.classList.remove('open');
    document.body.style.overflow = '';
  };
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') window.closeModal();
  });

  // ── Modal form submit ──
  window.handleModalSubmit = function(e) {
    e.preventDefault();
    var vorname = document.getElementById('cp-modal-vorname');
    var nachname = document.getElementById('cp-modal-nachname');
    var email = document.getElementById('cp-modal-email');
    var phone = document.getElementById('cp-modal-phone');
    if (vorname) sessionStorage.setItem('lead_vorname', vorname.value);
    if (nachname) sessionStorage.setItem('lead_nachname', nachname.value);
    if (email) sessionStorage.setItem('lead_email', email.value);
    if (phone) sessionStorage.setItem('lead_phone', phone.value);
    var btn = e.target.querySelector('button[type=submit]');
    if (btn) {
      btn.textContent = '${lang === 'de' ? '✓ Anfrage gesendet!' : '✓ Request sent!'}';
      btn.disabled = true;
    }
    setTimeout(window.closeModal, 1800);
  };

  // ── FAQ accordion ──
  window.toggleFaq = function(i) {
    var item = document.getElementById('faq-' + i);
    if (!item) return;
    var isOpen = item.classList.contains('open');
    document.querySelectorAll('.cp-faq-item.open').forEach(function(el) { el.classList.remove('open'); });
    if (!isOpen) item.classList.add('open');
  };

  // ── Pricing quiz ──
  var currentStep = 1;
  var totalSteps = 5;
  var quizAnswers = {};

  function showStep(n) {
    for (var i = 1; i <= totalSteps; i++) {
      var el = document.getElementById('cp-quiz-step-' + i);
      if (el) el.classList.toggle('active', i === n);
    }
    var prog = document.getElementById('cp-quiz-progress');
    if (prog) prog.style.width = (n / totalSteps * 100) + '%';
    currentStep = n;
  }

  window.selectOption = function(btn, step) {
    // Mark selected
    btn.closest('.cp-quiz-options').querySelectorAll('.cp-quiz-option').forEach(function(b) { b.classList.remove('selected'); });
    btn.classList.add('selected');
    quizAnswers['step' + step] = btn.textContent.trim();
    // Advance after short delay
    setTimeout(function() {
      if (step < totalSteps) showStep(step + 1);
    }, 300);
  };

  window.quizBack = function(step) {
    if (step > 1) showStep(step - 1);
  };

  window.submitQuiz = function() {
    var vorname = document.getElementById('cp-quiz-vorname');
    var nachname = document.getElementById('cp-quiz-nachname');
    var email = document.getElementById('cp-quiz-email');
    var phone = document.getElementById('cp-quiz-phone');
    if (!vorname || !email || !phone || !vorname.value || !email.value || !phone.value) {
      alert('${lang === 'de' ? 'Bitte alle Pflichtfelder ausfüllen.' : 'Please fill in all required fields.'}');
      return;
    }
    // Store in sessionStorage
    if (vorname) sessionStorage.setItem('lead_vorname', vorname.value);
    if (nachname) sessionStorage.setItem('lead_nachname', nachname.value);
    if (email) sessionStorage.setItem('lead_email', email.value);
    if (phone) sessionStorage.setItem('lead_phone', phone.value);
    // Show thank you
    var quizEl = document.getElementById('cp-quiz');
    if (quizEl) {
      quizEl.querySelector('.cp-quiz-progress').style.display = 'none';
      for (var i = 1; i <= totalSteps; i++) {
        var s = document.getElementById('cp-quiz-step-' + i);
        if (s) s.style.display = 'none';
      }
      var thanks = document.getElementById('cp-quiz-thanks');
      if (thanks) thanks.style.display = 'block';
    }
  };

  // ── Lang switcher ──
  window.switchLang = function(l) {
    // Simple: replace last path segment
    window.location.href = window.location.href.replace(/\/(en|de)(\/|$)/, '/' + l + '/');
  };

  // ── Init ──
  document.addEventListener('DOMContentLoaded', function() {
    initCountdown();
    initStats();
    initReveal();
  });
})();
</script>

</body>
</html>`
}

export async function buildZipExport(config: PageBuildConfig): Promise<Uint8Array> {
  const zip = new JSZip()

  const themes: Array<'dark' | 'light'> = ['dark', 'light']
  const langs: Array<'en' | 'de'> = ['en', 'de']

  for (let ti = 0; ti < themes.length; ti++) {
    for (let li = 0; li < langs.length; li++) {
      const theme = themes[ti]
      const lang = langs[li]
      const html = generateHTML({ ...config, theme, language: lang })
      zip.file(`${theme}/${lang}/index.html`, html)
    }
  }

  // Root redirect — auto-detects browser preference
  zip.file('index.html', `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${config.brand.clinicName}</title>
  <script>
    var theme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    var lang = (navigator.language || navigator.userLanguage || 'en').startsWith('de') ? 'de' : 'en';
    window.location.replace('./' + theme + '/' + lang + '/index.html');
  <\/script>
</head>
<body></body>
</html>`)

  // README
  zip.file('README.md', `# ${config.brand.clinicName} — Generated by ClinicPages

## Files

| Path | Description |
|------|-------------|
| \`dark/de/index.html\` | Dark theme, German |
| \`dark/en/index.html\` | Dark theme, English |
| \`light/de/index.html\` | Light theme, German |
| \`light/en/index.html\` | Light theme, English |
| \`index.html\` | Auto-redirects based on browser |

## Deployment

Upload all files to Netlify, Cloudflare Pages, or any static host.
Set \`index.html\` as the entry point. No server required.

## Customization

Replace the hero background image by setting the \`background-image\` CSS of \`#cp-hero .cp-hero-bg-img\`.

Built with [ClinicPages](https://clinicpages.io)
`)

  return zip.generateAsync({ type: 'uint8array', compression: 'DEFLATE' })
}
