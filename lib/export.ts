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

  const bgMain = isDark ? '#0a0a0f' : '#ffffff'
  const bgCard = isDark ? '#12121a' : '#f8f9fa'
  const bgCardHover = isDark ? '#1a1a28' : '#f0f1f3'
  const textPrimary = isDark ? '#f0f0f0' : '#111111'
  const textSecondary = isDark ? '#9ca3af' : '#6b7280'
  const borderColor = isDark ? '#1f2937' : '#e5e7eb'
  const primary = brand.primaryColor || '#2563eb'
  const accent = brand.accentColor || '#10b981'

  const navLabels = lang === 'de' 
    ? { reasons: 'Gründe', procedure: 'Ablauf', advantages: 'Vorteile', costs: 'Kosten', faq: 'FAQ', book: 'Termin buchen' }
    : { reasons: 'Reasons', procedure: 'Procedure', advantages: 'Advantages', costs: 'Costs', faq: 'FAQ', book: 'Book Appointment' }

  const beforeAfterSection = beforeAfterPhotos.length > 0 ? `
    <section id="gallery" class="section">
      <div class="container">
        <h2 class="section-title">${lang === 'de' ? 'Vorher / Nachher' : 'Before & After'}</h2>
        <p class="section-subtitle">${lang === 'de' ? 'Echte Ergebnisse unserer Patienten' : 'Real results from our patients'}</p>
        <div class="ba-gallery">
          ${beforeAfterPhotos.map((pair, i) => `
            <div class="ba-item" data-index="${i}">
              <div class="ba-slider" id="slider-${i}">
                <div class="ba-before">
                  <img src="${pair.beforeUrl}" alt="Before ${pair.label}" loading="lazy">
                  <span class="ba-label before-label">${lang === 'de' ? 'Vorher' : 'Before'}</span>
                </div>
                <div class="ba-after" style="clip-path: inset(0 50% 0 0)">
                  <img src="${pair.afterUrl}" alt="After ${pair.label}" loading="lazy">
                  <span class="ba-label after-label">${lang === 'de' ? 'Nachher' : 'After'}</span>
                </div>
                <div class="ba-handle" id="handle-${i}">
                  <div class="ba-handle-line"></div>
                  <div class="ba-handle-circle">
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                      <path d="M7 5L2 10L7 15M13 5L18 10L13 15" stroke="white" stroke-width="2" stroke-linecap="round"/>
                    </svg>
                  </div>
                  <div class="ba-handle-line"></div>
                </div>
              </div>
              <div class="ba-meta">
                <span class="ba-treatment">${pair.label}</span>
                <span class="ba-timeframe">${pair.timeframe}</span>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    </section>` : ''

  const reviewsSection = reviews.length > 0 ? `
    <section id="reviews" class="section" style="background: ${bgCard}">
      <div class="container">
        <h2 class="section-title">${lang === 'de' ? 'Patientenstimmen' : 'Patient Reviews'}</h2>
        <div class="reviews-grid">
          ${reviews.slice(0, 6).map(r => `
            <div class="review-card">
              <div class="review-stars">${'★'.repeat(r.rating)}${'☆'.repeat(5 - r.rating)}</div>
              <p class="review-text">"${r.text}"</p>
              <div class="review-author">
                <span class="review-name">${r.name}</span>
                <span class="review-treatment">${r.treatment}</span>
              </div>
              ${r.isAI ? '<small class="ai-label">AI-generated review</small>' : ''}
            </div>
          `).join('')}
        </div>
      </div>
    </section>` : ''

  const pricingCalc = `
    <section id="costs" class="section">
      <div class="container">
        <h2 class="section-title">${content.pricingTitle}</h2>
        <p class="section-subtitle">${content.pricingSubtitle}</p>
        <div class="pricing-calculator">
          <div class="pricing-base">
            <div class="pricing-base-label">${lang === 'de' ? 'Grundpreis' : 'Starting Price'}</div>
            <div class="pricing-base-price">${input.startingPrice || 'ab CHF 2,500'}</div>
          </div>
          ${pricingOptions.length > 0 ? `
          <div class="pricing-addons">
            <h3>${lang === 'de' ? 'Optionen & Erweiterungen' : 'Options & Add-ons'}</h3>
            ${pricingOptions.map((opt, i) => `
              <label class="pricing-option ${opt.type}">
                <input type="checkbox" id="opt-${i}" data-price="${opt.price}" onchange="updateTotal()">
                <span class="pricing-option-label">${opt.label}</span>
                <span class="pricing-option-price">+ ${input.startingPrice?.includes('CHF') ? 'CHF' : '$'} ${opt.price.toLocaleString()}</span>
              </label>
            `).join('')}
          </div>
          <div class="pricing-total">
            <span>${lang === 'de' ? 'Gesamtpreis' : 'Total'}</span>
            <span id="total-price">${input.startingPrice || 'On consultation'}</span>
          </div>
          ` : ''}
          <div class="pricing-includes">
            <h4>${lang === 'de' ? 'Im Preis enthalten' : 'Price includes'}</h4>
            <ul>
              <li>✓ ${lang === 'de' ? 'Beratungsgespräch' : 'Consultation'}</li>
              <li>✓ ${lang === 'de' ? 'Präoperative Untersuchungen' : 'Pre-operative assessments'}</li>
              <li>✓ ${lang === 'de' ? 'Narkose' : 'Anesthesia'}: ${input.anesthesia || 'Local/General'}</li>
              <li>✓ ${lang === 'de' ? 'Nachsorgetermine' : 'Follow-up appointments'}</li>
            </ul>
          </div>
          <a href="${config.ctaUrl || '#contact'}" class="btn btn-primary btn-large">
            ${lang === 'de' ? 'Persönliche Kostenschätzung anfragen' : 'Request Personal Quote'}
          </a>
        </div>
      </div>
    </section>`

  return `<!DOCTYPE html>
<html lang="${lang}" data-theme="${theme}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${content.title}</title>
  <meta name="description" content="${content.metaDescription}">
  <meta name="keywords" content="${content.metaKeywords}">
  <meta property="og:title" content="${content.title}">
  <meta property="og:description" content="${content.metaDescription}">
  <meta name="robots" content="index, follow">
  <link rel="alternate" hreflang="en" href="./en/">
  <link rel="alternate" hreflang="de" href="./de/">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Lato:wght@300;400;700&family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
  <style>
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    
    :root {
      --primary: ${primary};
      --accent: ${accent};
      --bg-main: ${bgMain};
      --bg-card: ${bgCard};
      --bg-card-hover: ${bgCardHover};
      --text-primary: ${textPrimary};
      --text-secondary: ${textSecondary};
      --border: ${borderColor};
      --radius: 12px;
      --radius-lg: 20px;
    }

    html { scroll-behavior: smooth; }
    body { 
      font-family: 'Lato', 'Inter', -apple-system, sans-serif; 
      background: var(--bg-main); 
      color: var(--text-primary);
      line-height: 1.7;
      overflow-x: hidden;
    }

    /* Typography */
    h1 { font-family: 'DM Sans', sans-serif; font-size: clamp(2rem, 5vw, 3.5rem); font-weight: 700; line-height: 1.15; }
    h2 { font-family: 'DM Sans', sans-serif; font-size: clamp(1.5rem, 3vw, 2.5rem); font-weight: 700; line-height: 1.2; }
    h3 { font-family: 'DM Sans', sans-serif; font-size: clamp(1.1rem, 2vw, 1.5rem); font-weight: 600; }

    /* Layout */
    .container { max-width: 1200px; margin: 0 auto; padding: 0 24px; }
    .section { padding: 80px 0; }
    .section-title { text-align: center; margin-bottom: 16px; }
    .section-subtitle { text-align: center; color: var(--text-secondary); max-width: 600px; margin: 0 auto 48px; font-size: 1.1rem; }

    /* Buttons */
    .btn { 
      display: inline-flex; align-items: center; gap: 8px;
      padding: 14px 28px; border-radius: 8px; font-weight: 600; font-size: 1rem;
      cursor: pointer; text-decoration: none; transition: all 0.2s; border: none;
    }
    .btn-primary { background: var(--primary); color: white; }
    .btn-primary:hover { opacity: 0.9; transform: translateY(-1px); }
    .btn-outline { background: transparent; color: var(--text-primary); border: 2px solid var(--border); }
    .btn-outline:hover { border-color: var(--primary); color: var(--primary); }
    .btn-large { padding: 18px 36px; font-size: 1.1rem; border-radius: 10px; }

    /* Header */
    header {
      position: sticky; top: 0; z-index: 1000;
      background: ${isDark ? 'rgba(10,10,15,0.95)' : 'rgba(255,255,255,0.95)'};
      backdrop-filter: blur(12px);
      border-bottom: 1px solid var(--border);
      padding: 16px 0;
    }
    .header-inner { display: flex; align-items: center; justify-content: space-between; gap: 24px; }
    .logo { font-size: 1.25rem; font-weight: 700; color: var(--text-primary); text-decoration: none; }
    .logo span { color: var(--primary); }
    nav { display: flex; gap: 8px; }
    nav a { color: var(--text-secondary); text-decoration: none; font-size: 0.9rem; padding: 6px 12px; border-radius: 6px; transition: color 0.2s; }
    nav a:hover { color: var(--text-primary); }
    .header-actions { display: flex; align-items: center; gap: 12px; }
    .lang-switcher { display: flex; gap: 4px; }
    .lang-btn { padding: 4px 10px; border-radius: 4px; border: 1px solid var(--border); background: transparent; color: var(--text-secondary); cursor: pointer; font-size: 0.8rem; transition: all 0.2s; }
    .lang-btn.active { background: var(--primary); color: white; border-color: var(--primary); }
    .theme-toggle { 
      width: 36px; height: 36px; border-radius: 8px; border: 1px solid var(--border);
      background: transparent; color: var(--text-secondary); cursor: pointer;
      display: flex; align-items: center; justify-content: center; font-size: 1rem;
    }
    .hamburger { display: none; background: none; border: none; color: var(--text-primary); cursor: pointer; }
    @media (max-width: 768px) {
      nav { display: none; }
      .hamburger { display: flex; }
      .mobile-menu { 
        display: none; position: fixed; inset: 0; top: 65px; background: var(--bg-main);
        z-index: 999; padding: 24px; flex-direction: column; gap: 8px;
      }
      .mobile-menu.open { display: flex; }
      .mobile-menu a { 
        color: var(--text-primary); text-decoration: none; font-size: 1.1rem;
        padding: 16px; border-bottom: 1px solid var(--border);
      }
    }

    /* Hero */
    .hero { 
      min-height: 85vh; display: flex; align-items: center;
      background: ${isDark 
        ? `linear-gradient(135deg, #0a0a0f 0%, #0f1929 50%, #0a0a0f 100%)` 
        : `linear-gradient(135deg, #f8f9fa 0%, #e8f0fe 50%, #f8f9fa 100%)`};
      position: relative; overflow: hidden;
      padding: 80px 0;
    }
    .hero::before {
      content: ''; position: absolute; inset: 0;
      background: radial-gradient(ellipse at 20% 50%, ${primary}20 0%, transparent 60%);
      pointer-events: none;
    }
    .hero-content { max-width: 700px; position: relative; }
    .hero-badge { 
      display: inline-flex; align-items: center; gap: 8px;
      background: ${isDark ? `${primary}20` : `${primary}15`}; 
      color: ${primary}; padding: 6px 14px; border-radius: 100px;
      font-size: 0.85rem; font-weight: 500; margin-bottom: 24px;
      border: 1px solid ${primary}30;
    }
    .hero h1 { margin-bottom: 20px; }
    .hero-sub { font-size: 1.2rem; color: var(--text-secondary); margin-bottom: 36px; max-width: 540px; }
    .hero-cta-group { display: flex; gap: 16px; flex-wrap: wrap; margin-bottom: 48px; }
    .trust-bar { 
      display: flex; gap: 24px; flex-wrap: wrap;
      padding-top: 32px; border-top: 1px solid var(--border);
    }
    .trust-item { display: flex; align-items: center; gap: 8px; font-size: 0.9rem; color: var(--text-secondary); }
    .trust-item .icon { font-size: 1.2rem; }

    /* Anchor nav */
    .anchor-nav {
      position: sticky; top: 65px; z-index: 900;
      background: ${isDark ? '#12121a' : '#f8f9fa'};
      border-bottom: 1px solid var(--border);
      overflow-x: auto; -webkit-overflow-scrolling: touch;
    }
    .anchor-nav-inner { display: flex; gap: 0; }
    .anchor-nav a { 
      padding: 16px 24px; text-decoration: none; font-size: 0.9rem; font-weight: 500;
      color: var(--text-secondary); white-space: nowrap; border-bottom: 2px solid transparent;
      transition: all 0.2s; flex-shrink: 0;
    }
    .anchor-nav a:hover, .anchor-nav a.active { color: var(--primary); border-bottom-color: var(--primary); }
    .anchor-nav a.cta-link { 
      margin-left: auto; background: var(--primary); color: white; border-radius: 0;
    }

    /* Grid layouts */
    .grid-2 { display: grid; grid-template-columns: repeat(2, 1fr); gap: 24px; }
    .grid-3 { display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px; }
    .grid-4 { display: grid; grid-template-columns: repeat(4, 1fr); gap: 20px; }
    @media (max-width: 900px) { .grid-3, .grid-4 { grid-template-columns: repeat(2, 1fr); } }
    @media (max-width: 600px) { .grid-2, .grid-3, .grid-4 { grid-template-columns: 1fr; } }

    /* Cards */
    .card { 
      background: var(--bg-card); border-radius: var(--radius); 
      padding: 28px; border: 1px solid var(--border);
      transition: transform 0.2s, border-color 0.2s;
    }
    .card:hover { transform: translateY(-2px); border-color: ${primary}40; }
    .card-icon { font-size: 2rem; margin-bottom: 16px; }
    .card h3 { margin-bottom: 10px; }
    .card p { color: var(--text-secondary); font-size: 0.95rem; }

    /* Procedure timeline */
    .procedure-list { list-style: none; position: relative; }
    .procedure-list::before { 
      content: ''; position: absolute; left: 24px; top: 0; bottom: 0;
      width: 2px; background: var(--border);
    }
    .procedure-item { 
      display: flex; gap: 24px; padding: 24px 0; position: relative;
    }
    .procedure-step-num { 
      width: 48px; height: 48px; border-radius: 50%; background: var(--primary);
      color: white; display: flex; align-items: center; justify-content: center;
      font-weight: 700; font-size: 1.1rem; flex-shrink: 0; position: relative; z-index: 1;
    }
    .procedure-content { flex: 1; padding-top: 8px; }
    .procedure-content h3 { margin-bottom: 8px; }
    .procedure-content p { color: var(--text-secondary); }
    .procedure-duration { 
      font-size: 0.8rem; color: var(--primary); font-weight: 500; margin-top: 6px;
      background: ${primary}15; padding: 2px 8px; border-radius: 100px; display: inline-block;
    }

    /* Before/After */
    .ba-gallery { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 24px; }
    .ba-item { border-radius: var(--radius); overflow: hidden; }
    .ba-slider { 
      position: relative; cursor: col-resize; overflow: hidden;
      user-select: none; touch-action: none;
      aspect-ratio: 3/4;
    }
    .ba-before, .ba-after { 
      position: absolute; inset: 0;
    }
    .ba-before img, .ba-after img { 
      width: 100%; height: 100%; object-fit: cover;
    }
    .ba-label { 
      position: absolute; top: 12px; padding: 4px 12px;
      background: rgba(0,0,0,0.7); color: white; font-size: 0.8rem;
      font-weight: 600; border-radius: 100px; letter-spacing: 0.05em;
    }
    .before-label { left: 12px; }
    .after-label { right: 12px; }
    .ba-handle { 
      position: absolute; top: 0; bottom: 0; width: 4px;
      left: 50%; transform: translateX(-50%);
      display: flex; flex-direction: column; align-items: center;
      pointer-events: none;
    }
    .ba-handle-line { flex: 1; width: 2px; background: white; opacity: 0.8; }
    .ba-handle-circle { 
      width: 40px; height: 40px; border-radius: 50%;
      background: white; display: flex; align-items: center; justify-content: center;
      box-shadow: 0 2px 12px rgba(0,0,0,0.3); flex-shrink: 0;
    }
    .ba-meta { 
      padding: 12px 16px; background: var(--bg-card);
      display: flex; justify-content: space-between; align-items: center;
    }
    .ba-treatment { font-weight: 600; font-size: 0.9rem; }
    .ba-timeframe { font-size: 0.8rem; color: var(--text-secondary); }

    /* Reviews */
    .reviews-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 20px; }
    .review-card { 
      background: var(--bg-main); border: 1px solid var(--border);
      border-radius: var(--radius); padding: 24px;
    }
    .review-stars { color: #f59e0b; font-size: 1.1rem; margin-bottom: 12px; }
    .review-text { color: var(--text-secondary); font-style: italic; margin-bottom: 16px; line-height: 1.6; }
    .review-author { display: flex; justify-content: space-between; align-items: center; }
    .review-name { font-weight: 600; font-size: 0.9rem; }
    .review-treatment { 
      font-size: 0.75rem; color: var(--primary); 
      background: ${primary}15; padding: 2px 8px; border-radius: 100px;
    }
    .ai-label { display: block; font-size: 0.7rem; color: var(--text-secondary); margin-top: 8px; opacity: 0.6; }

    /* Pricing Calculator */
    .pricing-calculator { 
      max-width: 600px; margin: 0 auto;
      background: var(--bg-card); border-radius: var(--radius-lg);
      padding: 40px; border: 1px solid var(--border);
    }
    .pricing-base { 
      display: flex; justify-content: space-between; align-items: center;
      padding-bottom: 24px; border-bottom: 1px solid var(--border); margin-bottom: 24px;
    }
    .pricing-base-label { color: var(--text-secondary); font-size: 0.95rem; }
    .pricing-base-price { font-size: 2rem; font-weight: 700; color: var(--primary); }
    .pricing-addons { margin-bottom: 24px; }
    .pricing-addons h3 { margin-bottom: 16px; font-size: 1rem; color: var(--text-secondary); }
    .pricing-option { 
      display: flex; align-items: center; gap: 12px;
      padding: 14px 16px; border-radius: 8px; border: 1px solid var(--border);
      cursor: pointer; margin-bottom: 8px; transition: border-color 0.2s;
    }
    .pricing-option:hover { border-color: var(--primary); }
    .pricing-option input { width: 18px; height: 18px; cursor: pointer; accent-color: var(--primary); }
    .pricing-option-label { flex: 1; font-size: 0.95rem; }
    .pricing-option-price { color: var(--primary); font-weight: 600; font-size: 0.9rem; }
    .pricing-total { 
      display: flex; justify-content: space-between; align-items: center;
      padding: 16px; background: ${isDark ? '#1a1a28' : '#f0f1f3'};
      border-radius: 8px; margin-bottom: 16px;
      font-weight: 700; font-size: 1.1rem;
    }
    #total-price { color: var(--primary); font-size: 1.5rem; }
    .pricing-includes { margin-bottom: 28px; }
    .pricing-includes h4 { font-size: 0.9rem; color: var(--text-secondary); margin-bottom: 12px; }
    .pricing-includes ul { list-style: none; display: flex; flex-direction: column; gap: 8px; }
    .pricing-includes li { font-size: 0.9rem; color: var(--text-secondary); }

    /* FAQ */
    .faq-list { max-width: 800px; margin: 0 auto; }
    .faq-item { 
      border: 1px solid var(--border); border-radius: 10px; margin-bottom: 12px;
      overflow: hidden;
    }
    .faq-question { 
      padding: 20px 24px; cursor: pointer; 
      display: flex; justify-content: space-between; align-items: center; gap: 16px;
      font-weight: 600; background: var(--bg-card);
      transition: background 0.2s;
    }
    .faq-question:hover { background: var(--bg-card-hover); }
    .faq-arrow { 
      font-size: 0.8rem; transition: transform 0.3s; flex-shrink: 0;
      color: var(--primary);
    }
    .faq-item.open .faq-arrow { transform: rotate(180deg); }
    .faq-answer { 
      padding: 0 24px; max-height: 0; overflow: hidden;
      transition: max-height 0.3s ease, padding 0.3s;
      color: var(--text-secondary);
    }
    .faq-item.open .faq-answer { max-height: 300px; padding: 16px 24px; }

    /* Doctor / Advantages */
    .advantages-section { display: grid; grid-template-columns: 1fr 1fr; gap: 48px; align-items: center; }
    .doctor-profile { display: flex; gap: 24px; margin-bottom: 32px; }
    .doctor-photo { 
      width: 120px; height: 120px; border-radius: 50%; object-fit: cover;
      border: 3px solid var(--primary);
    }
    .doctor-photo-placeholder { 
      width: 120px; height: 120px; border-radius: 50%;
      background: ${isDark ? '#1a1a28' : '#e8f0fe'};
      display: flex; align-items: center; justify-content: center;
      font-size: 3rem; border: 3px solid var(--primary);
    }
    .doctor-info h3 { margin-bottom: 6px; }
    .doctor-title { color: var(--primary); font-size: 0.9rem; margin-bottom: 8px; }
    .doctor-bio { color: var(--text-secondary); font-size: 0.9rem; }
    .stats-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 16px; }
    .stat-card { 
      background: var(--bg-card); border-radius: 10px; padding: 20px;
      text-align: center; border: 1px solid var(--border);
    }
    .stat-value { font-size: 1.8rem; font-weight: 700; color: var(--primary); display: block; }
    .stat-label { font-size: 0.8rem; color: var(--text-secondary); }

    /* Contact */
    .contact-section { 
      background: ${isDark ? `linear-gradient(135deg, #0f1929, #12121a)` : `linear-gradient(135deg, #e8f0fe, #f8f9fa)`};
      border-top: 1px solid var(--border);
    }
    .contact-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 48px; align-items: start; }
    .contact-form { display: flex; flex-direction: column; gap: 16px; }
    .form-group { display: flex; flex-direction: column; gap: 6px; }
    .form-group label { font-size: 0.9rem; font-weight: 500; }
    .form-input { 
      padding: 12px 16px; border-radius: 8px; border: 1px solid var(--border);
      background: var(--bg-main); color: var(--text-primary); font-size: 1rem;
      transition: border-color 0.2s;
    }
    .form-input:focus { outline: none; border-color: var(--primary); }
    textarea.form-input { resize: vertical; min-height: 120px; }
    .contact-info { display: flex; flex-direction: column; gap: 20px; }
    .contact-info-item { display: flex; gap: 12px; align-items: flex-start; }
    .contact-info-icon { font-size: 1.3rem; margin-top: 2px; }
    .contact-info-text h4 { font-size: 0.9rem; margin-bottom: 2px; }
    .contact-info-text p { color: var(--text-secondary); font-size: 0.95rem; }
    .discreet-badge { 
      display: inline-flex; align-items: center; gap: 8px;
      background: ${accent}15; color: ${accent};
      border: 1px solid ${accent}30; padding: 8px 16px; border-radius: 8px;
      font-size: 0.9rem; font-weight: 500; margin-top: 16px;
    }
    @media (max-width: 768px) { 
      .contact-grid, .advantages-section { grid-template-columns: 1fr; } 
    }

    /* Footer */
    footer { 
      background: ${isDark ? '#06060a' : '#111827'};
      color: #9ca3af; padding: 48px 0 24px;
    }
    .footer-grid { display: grid; grid-template-columns: 2fr 1fr 1fr; gap: 40px; margin-bottom: 40px; }
    .footer-brand .logo { color: white; }
    .footer-tagline { margin-top: 12px; font-size: 0.9rem; max-width: 280px; }
    .footer-col h4 { color: white; margin-bottom: 16px; font-size: 0.9rem; }
    .footer-col ul { list-style: none; display: flex; flex-direction: column; gap: 8px; }
    .footer-col a { color: #9ca3af; text-decoration: none; font-size: 0.9rem; transition: color 0.2s; }
    .footer-col a:hover { color: white; }
    .footer-bottom { 
      padding-top: 24px; border-top: 1px solid #1f2937;
      display: flex; justify-content: space-between; align-items: center;
      flex-wrap: wrap; gap: 12px; font-size: 0.85rem;
    }
    @media (max-width: 768px) { .footer-grid { grid-template-columns: 1fr; } }

    /* Animations */
    @keyframes fadeInUp { from { opacity: 0; transform: translateY(24px); } to { opacity: 1; transform: translateY(0); } }
    .fade-in { animation: fadeInUp 0.6s ease forwards; opacity: 0; }
    .fade-in-delay-1 { animation-delay: 0.1s; }
    .fade-in-delay-2 { animation-delay: 0.2s; }
    .fade-in-delay-3 { animation-delay: 0.3s; }

    /* Intersection observer for scroll animations */
    .reveal { opacity: 0; transform: translateY(20px); transition: opacity 0.6s ease, transform 0.6s ease; }
    .reveal.visible { opacity: 1; transform: translateY(0); }
  </style>
</head>
<body>

<!-- Header -->
<header>
  <div class="container header-inner">
    <a href="#" class="logo">${brand.logoUrl ? `<img src="${brand.logoUrl}" alt="${brand.clinicName}" style="height:36px;width:auto">` : brand.clinicName}</a>
    <nav>
      <a href="#reasons">${navLabels.reasons}</a>
      <a href="#procedure">${navLabels.procedure}</a>
      <a href="#advantages">${navLabels.advantages}</a>
      <a href="#costs">${navLabels.costs}</a>
      <a href="#faq">${navLabels.faq}</a>
    </nav>
    <div class="header-actions">
      <div class="lang-switcher">
        <button class="lang-btn ${lang === 'en' ? 'active' : ''}" onclick="switchLang('en')">EN</button>
        <button class="lang-btn ${lang === 'de' ? 'active' : ''}" onclick="switchLang('de')">DE</button>
      </div>
      <button class="theme-toggle" onclick="toggleTheme()" title="Toggle theme">
        ${isDark ? '☀️' : '🌙'}
      </button>
      <a href="${config.ctaUrl || '#contact'}" class="btn btn-primary" style="display:none" id="header-cta">
        ${navLabels.book}
      </a>
      <button class="hamburger" onclick="toggleMobileMenu()">
        <svg width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
          <path d="M3 12h18M3 6h18M3 18h18"/>
        </svg>
      </button>
    </div>
  </div>
</header>

<!-- Mobile Menu -->
<div class="mobile-menu" id="mobile-menu">
  <a href="#reasons" onclick="closeMobileMenu()">${navLabels.reasons}</a>
  <a href="#procedure" onclick="closeMobileMenu()">${navLabels.procedure}</a>
  <a href="#advantages" onclick="closeMobileMenu()">${navLabels.advantages}</a>
  <a href="#costs" onclick="closeMobileMenu()">${navLabels.costs}</a>
  <a href="#faq" onclick="closeMobileMenu()">${navLabels.faq}</a>
  <a href="${config.ctaUrl || '#contact'}" class="btn btn-primary" style="margin-top:16px">${navLabels.book}</a>
</div>

<!-- Hero -->
<section class="hero">
  <div class="container">
    <div class="hero-content">
      <div class="hero-badge fade-in">
        <span>✦</span> ${brand.clinicName}
      </div>
      <h1 class="fade-in fade-in-delay-1">${content.heroHeadline}</h1>
      <p class="hero-sub fade-in fade-in-delay-2">${content.heroSubheadline}</p>
      <div class="hero-cta-group fade-in fade-in-delay-3">
        <a href="${config.ctaUrl || '#contact'}" class="btn btn-primary btn-large">${content.heroCTA}</a>
        <a href="#reasons" class="btn btn-outline btn-large">
          ${lang === 'de' ? 'Mehr erfahren' : 'Learn more'} ↓
        </a>
      </div>
      <div class="trust-bar fade-in fade-in-delay-3">
        ${content.trustBarItems.map(item => `
          <div class="trust-item">
            <span class="icon">${item.icon}</span>
            <span>${item.text}</span>
          </div>
        `).join('')}
      </div>
    </div>
  </div>
</section>

<!-- Anchor Navigation -->
<nav class="anchor-nav">
  <div class="container anchor-nav-inner">
    <a href="#reasons">${navLabels.reasons}</a>
    <a href="#procedure">${navLabels.procedure}</a>
    <a href="#gallery">${lang === 'de' ? 'Vorher/Nachher' : 'Gallery'}</a>
    <a href="#advantages">${navLabels.advantages}</a>
    <a href="#costs">${navLabels.costs}</a>
    <a href="#faq">${navLabels.faq}</a>
    <a href="${config.ctaUrl || '#contact'}" class="cta-link">${navLabels.book}</a>
  </div>
</nav>

<!-- Reasons / Benefits -->
<section id="reasons" class="section">
  <div class="container">
    <h2 class="section-title reveal">${content.reasonsTitle}</h2>
    <p class="section-subtitle reveal">${content.reasonsIntro}</p>
    <div class="grid-${content.reasons.length <= 3 ? content.reasons.length : '4'} reveal">
      ${content.reasons.map(reason => `
        <div class="card">
          <div class="card-icon">${reason.icon}</div>
          <h3>${reason.title}</h3>
          <p>${reason.description}</p>
        </div>
      `).join('')}
    </div>
  </div>
</section>

<!-- Procedure -->
<section id="procedure" class="section" style="background: ${bgCard}">
  <div class="container">
    <h2 class="section-title reveal">${content.procedureTitle}</h2>
    <ul class="procedure-list reveal">
      ${content.procedureSteps.map(step => `
        <li class="procedure-item">
          <div class="procedure-step-num">${step.step}</div>
          <div class="procedure-content">
            <h3>${step.title}</h3>
            <p>${step.description}</p>
            ${step.duration ? `<span class="procedure-duration">⏱ ${step.duration}</span>` : ''}
          </div>
        </li>
      `).join('')}
    </ul>
    <div style="text-align:center; margin-top:48px">
      <a href="${config.ctaUrl || '#contact'}" class="btn btn-primary btn-large">${content.heroCTA}</a>
    </div>
  </div>
</section>

<!-- Before/After Gallery -->
${beforeAfterSection}

<!-- Pricing Calculator -->
${pricingCalc}

<!-- Reviews -->
${reviewsSection}

<!-- Advantages / Why Us -->
<section id="advantages" class="section" style="background: ${bgCard}">
  <div class="container">
    <h2 class="section-title reveal">${content.advantagesTitle}</h2>
    <div class="advantages-section">
      <div class="reveal">
        ${config.doctorPhotoUrl 
          ? `<div class="doctor-profile">
              <img src="${config.doctorPhotoUrl}" alt="Doctor" class="doctor-photo">
              <div class="doctor-info">
                <h3>${lang === 'de' ? 'Ihr Spezialist' : 'Your Specialist'}</h3>
                <div class="doctor-title">${brand.clinicName}</div>
                <p class="doctor-bio">${lang === 'de' ? 'Erfahrener Spezialist für ästhetische Medizin.' : 'Experienced specialist in aesthetic medicine.'}</p>
              </div>
            </div>`
          : `<div class="doctor-profile">
              <div class="doctor-photo-placeholder">👨‍⚕️</div>
              <div class="doctor-info">
                <h3>${lang === 'de' ? 'Ihr Spezialist' : 'Your Specialist'}</h3>
                <div class="doctor-title">${brand.clinicName}</div>
              </div>
            </div>`
        }
        <div class="stats-grid">
          ${content.trustBarItems.slice(0,4).map(item => `
            <div class="stat-card">
              <span class="stat-value">${item.icon}</span>
              <span class="stat-label">${item.text}</span>
            </div>
          `).join('')}
        </div>
      </div>
      <div class="reveal">
        ${content.advantages.map(adv => `
          <div class="card" style="margin-bottom: 16px">
            <div style="display:flex; gap:16px; align-items:flex-start">
              <span style="font-size:1.8rem">${adv.icon}</span>
              <div>
                <h3>${adv.title}</h3>
                <p>${adv.description}</p>
              </div>
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  </div>
</section>

<!-- FAQ -->
<section id="faq" class="section">
  <div class="container">
    <h2 class="section-title reveal">${content.faqTitle}</h2>
    <div class="faq-list reveal">
      ${content.faqItems.map((item, i) => `
        <div class="faq-item" id="faq-${i}">
          <div class="faq-question" onclick="toggleFaq(${i})">
            <span>${item.question}</span>
            <span class="faq-arrow">▼</span>
          </div>
          <div class="faq-answer">${item.answer}</div>
        </div>
      `).join('')}
    </div>
  </div>
</section>

<!-- Contact / CTA -->
<section id="contact" class="section contact-section">
  <div class="container">
    <h2 class="section-title reveal">${content.contactTitle}</h2>
    <p class="section-subtitle reveal">${content.contactSubtitle}</p>
    <div class="contact-grid reveal">
      <form class="contact-form" onsubmit="handleSubmit(event)">
        <div class="grid-2">
          <div class="form-group">
            <label>${lang === 'de' ? 'Vorname' : 'First Name'}</label>
            <input type="text" class="form-input" required placeholder="${lang === 'de' ? 'Max' : 'John'}">
          </div>
          <div class="form-group">
            <label>${lang === 'de' ? 'Nachname' : 'Last Name'}</label>
            <input type="text" class="form-input" required placeholder="${lang === 'de' ? 'Müller' : 'Smith'}">
          </div>
        </div>
        <div class="form-group">
          <label>${lang === 'de' ? 'E-Mail' : 'Email'}</label>
          <input type="email" class="form-input" required placeholder="you@example.com">
        </div>
        <div class="form-group">
          <label>${lang === 'de' ? 'Telefon' : 'Phone'}</label>
          <input type="tel" class="form-input" placeholder="${lang === 'de' ? '+41 79 000 00 00' : '+1 234 567 8900'}">
        </div>
        <div class="form-group">
          <label>${lang === 'de' ? 'Nachricht (optional)' : 'Message (optional)'}</label>
          <textarea class="form-input">${lang === 'de' ? 'Meine Frage...' : 'My question...'}</textarea>
        </div>
        <button type="submit" class="btn btn-primary btn-large" style="width:100%">
          ${lang === 'de' ? 'Beratung anfragen →' : 'Request Consultation →'}
        </button>
        <div class="discreet-badge">
          🔒 ${lang === 'de' ? 'Diskrete & vertrauliche Beratung' : 'Discreet & confidential consultation'}
        </div>
      </form>
      <div class="contact-info">
        ${brand.phone ? `<div class="contact-info-item">
          <span class="contact-info-icon">📞</span>
          <div class="contact-info-text">
            <h4>${lang === 'de' ? 'Telefon' : 'Phone'}</h4>
            <p><a href="tel:${brand.phone}" style="color:var(--text-secondary);text-decoration:none">${brand.phone}</a></p>
          </div>
        </div>` : ''}
        ${brand.email ? `<div class="contact-info-item">
          <span class="contact-info-icon">✉️</span>
          <div class="contact-info-text">
            <h4>${lang === 'de' ? 'E-Mail' : 'Email'}</h4>
            <p><a href="mailto:${brand.email}" style="color:var(--text-secondary);text-decoration:none">${brand.email}</a></p>
          </div>
        </div>` : ''}
        ${brand.address ? `<div class="contact-info-item">
          <span class="contact-info-icon">📍</span>
          <div class="contact-info-text">
            <h4>${lang === 'de' ? 'Adresse' : 'Address'}</h4>
            <p>${brand.address}</p>
          </div>
        </div>` : ''}
        ${brand.mapsUrl ? `
          <div style="border-radius:12px;overflow:hidden;border:1px solid var(--border)">
            <iframe src="${brand.mapsUrl}" width="100%" height="250" style="border:0;display:block" loading="lazy"></iframe>
          </div>
        ` : ''}
      </div>
    </div>
  </div>
</section>

<!-- Footer -->
<footer>
  <div class="container">
    <div class="footer-grid">
      <div class="footer-brand">
        <a href="#" class="logo">${brand.logoUrl ? `<img src="${brand.logoUrl}" alt="${brand.clinicName}" style="height:32px;width:auto;filter:${isDark ? 'brightness(10)' : 'none'}">` : brand.clinicName}</a>
        <p class="footer-tagline">${content.footerTagline}</p>
      </div>
      <div class="footer-col">
        <h4>${lang === 'de' ? 'Links' : 'Links'}</h4>
        <ul>
          <li><a href="#reasons">${navLabels.reasons}</a></li>
          <li><a href="#procedure">${navLabels.procedure}</a></li>
          <li><a href="#costs">${navLabels.costs}</a></li>
          <li><a href="#faq">${navLabels.faq}</a></li>
          <li><a href="#contact">${lang === 'de' ? 'Kontakt' : 'Contact'}</a></li>
        </ul>
      </div>
      <div class="footer-col">
        <h4>${lang === 'de' ? 'Rechtliches' : 'Legal'}</h4>
        <ul>
          <li><a href="#">${lang === 'de' ? 'Datenschutz' : 'Privacy Policy'}</a></li>
          <li><a href="#">${lang === 'de' ? 'Impressum' : 'Imprint'}</a></li>
          <li><a href="#">${lang === 'de' ? 'AGB' : 'Terms'}</a></li>
        </ul>
      </div>
    </div>
    <div class="footer-bottom">
      <span>© ${new Date().getFullYear()} ${brand.clinicName}. All rights reserved.</span>
      <span>${lang === 'de' ? 'Erstellt mit' : 'Built with'} <a href="https://clinicpages.io" style="color:${primary}">ClinicPages</a></span>
    </div>
  </div>
</footer>

<script>
  // Theme toggle
  function toggleTheme() {
    const html = document.documentElement;
    const current = html.getAttribute('data-theme');
    const next = current === 'dark' ? 'light' : 'dark';
    window.location.href = window.location.pathname.includes('/en/') 
      ? '../' + next + '/en/index.html'
      : '../' + next + '/de/index.html';
  }

  // Language switch
  function switchLang(lang) {
    const theme = document.documentElement.getAttribute('data-theme');
    window.location.href = '../' + theme + '/' + lang + '/index.html';
  }

  // Mobile menu
  function toggleMobileMenu() {
    document.getElementById('mobile-menu').classList.toggle('open');
  }
  function closeMobileMenu() {
    document.getElementById('mobile-menu').classList.remove('open');
  }

  // FAQ accordion
  function toggleFaq(index) {
    const item = document.getElementById('faq-' + index);
    item.classList.toggle('open');
  }

  // Pricing calculator
  function updateTotal() {
    const checkboxes = document.querySelectorAll('.pricing-option input[type="checkbox"]');
    let total = 0;
    checkboxes.forEach(cb => {
      if (cb.checked) total += parseInt(cb.dataset.price || 0);
    });
    const totalEl = document.getElementById('total-price');
    if (totalEl) {
      const currency = '${input.startingPrice?.includes('CHF') ? 'CHF' : '$'}';
      const base = ${input.startingPrice ? `'${input.startingPrice}'` : 'null'};
      if (total > 0 && base) {
        totalEl.textContent = currency + ' ' + total.toLocaleString() + ' (+ base)';
      }
    }
  }

  // Before/After slider
  function initSliders() {
    document.querySelectorAll('.ba-slider').forEach((slider, i) => {
      const after = slider.querySelector('.ba-after');
      const handle = slider.querySelector('.ba-handle');
      if (!after || !handle) return;
      
      let dragging = false;
      
      function setPosition(clientX) {
        const rect = slider.getBoundingClientRect();
        let x = (clientX - rect.left) / rect.width;
        x = Math.max(0.05, Math.min(0.95, x));
        after.style.clipPath = 'inset(0 ' + ((1 - x) * 100) + '% 0 0)';
        handle.style.left = (x * 100) + '%';
      }
      
      slider.addEventListener('mousedown', e => { dragging = true; setPosition(e.clientX); });
      window.addEventListener('mousemove', e => { if (dragging) setPosition(e.clientX); });
      window.addEventListener('mouseup', () => { dragging = false; });
      
      slider.addEventListener('touchstart', e => { dragging = true; setPosition(e.touches[0].clientX); }, { passive: true });
      window.addEventListener('touchmove', e => { if (dragging) setPosition(e.touches[0].clientX); }, { passive: true });
      window.addEventListener('touchend', () => { dragging = false; });
    });
  }

  // Scroll reveal
  function initReveal() {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });
    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
  }

  // Anchor nav active state
  function initAnchorNav() {
    const sections = ['reasons', 'procedure', 'gallery', 'advantages', 'costs', 'faq'];
    const links = document.querySelectorAll('.anchor-nav a');
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          links.forEach(l => l.classList.remove('active'));
          const active = document.querySelector('.anchor-nav a[href="#' + entry.target.id + '"]');
          if (active) active.classList.add('active');
        }
      });
    }, { threshold: 0.4 });
    sections.forEach(id => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
  }

  // Show header CTA on scroll
  window.addEventListener('scroll', () => {
    const cta = document.getElementById('header-cta');
    if (cta) cta.style.display = window.scrollY > 300 ? 'flex' : 'none';
  });

  // Contact form
  function handleSubmit(e) {
    e.preventDefault();
    const btn = e.target.querySelector('button[type="submit"]');
    btn.textContent = '${lang === 'de' ? '✓ Anfrage gesendet!' : '✓ Request sent!'}';
    btn.style.background = '${accent}';
    btn.disabled = true;
  }

  // Init
  document.addEventListener('DOMContentLoaded', () => {
    initSliders();
    initReveal();
    initAnchorNav();
  });
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
  
  // Root redirect
  zip.file('index.html', `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Redirecting...</title>
  <script>
    const theme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    const lang = navigator.language.startsWith('de') ? 'de' : 'en';
    window.location.replace('./' + theme + '/' + lang + '/index.html');
  </script>
</head>
<body></body>
</html>`)

  // README
  zip.file('README.md', `# ${config.brand.clinicName} — Generated by ClinicPages

## Files
- \`dark/en/index.html\` — Dark theme, English
- \`dark/de/index.html\` — Dark theme, German
- \`light/en/index.html\` — Light theme, English  
- \`light/de/index.html\` — Light theme, German
- \`index.html\` — Auto-redirects based on browser settings

## Deployment
Upload all files to your hosting (Netlify, Cloudflare Pages, etc.).
Set the root \`index.html\` as the entry point.

Built with [ClinicPages](https://clinicpages.io)
`)
  
  return zip.generateAsync({ type: 'uint8array', compression: 'DEFLATE' })
}
