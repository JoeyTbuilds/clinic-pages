# ClinicPages v2 — Full Architecture

## The Vision

Turn the Dr. Kish page builder into a SaaS product where aesthetic clinics can:
1. **Generate** a full, production-quality landing page (hero, B&A photos, pricing calculator, reviews, AI visualizer — everything)
2. **Deploy** it to a live URL instantly (custom domain or subdomain)
3. **Pay** via credits (we markup the underlying API costs and pocket the margin)

**Revenue model:** Credits-based SaaS. Clinics buy credit packs, each page generation burns credits. We use Claude, Gemini, and other APIs underneath and charge 5-10x the actual cost.

---

## Current State (What Dr. Kish Pages Have)

Each Dr. Kish page is a single-file HTML with:

| Feature | Description |
|---------|-------------|
| **Hero section** | AI-generated moody silhouette background (Gemini), clinic logo, headline, price badge |
| **Reasons section** | 6 benefit cards with icons |
| **Procedure section** | Step-by-step with icons, duration, recovery, anesthesia info |
| **Before/After gallery** | 6 AI-generated photo pairs (Gemini side-by-side technique, split with PIL) |
| **Pricing calculator** | Interactive treatment selector with base price, add-ons, packages — real-time total |
| **AI Visualizer** | Upload your photo → Gemini generates what you'd look like after treatment |
| **Reviews** | Mix of real + AI-generated reviews with star ratings |
| **Advantages section** | Why this clinic vs competitors |
| **FAQ** | Accordion with treatment-specific questions |
| **Contact/CTA** | Booking form or link, phone, location |
| **Dark/Light modes** | Two complete design systems (dark = luxury, light = warm aesthetic) |
| **4 languages** | DE, EN, FR, IT — 8 files per procedure |

**What ClinicPages currently generates:** Just the text JSON. No images, no calculator, no visualizer, no dark/light variants. That's why the pages look empty.

---

## Architecture: ClinicPages v2

### Tech Stack

| Layer | Technology | Why |
|-------|-----------|-----|
| **Frontend** | Next.js 15 (App Router) | Already built, SSR + API routes |
| **Database** | Supabase (PostgreSQL) | Free tier generous, auth built-in, realtime |
| **Auth** | Supabase Auth | Email/password + Google OAuth |
| **Payments** | Stripe | Credit packs, subscriptions, usage billing |
| **AI — Text** | Anthropic Claude (Sonnet) | Page content, reviews, FAQ generation |
| **AI — Images** | Google Gemini (3.1 Flash Image) | Hero backgrounds, B&A photos, AI visualizer |
| **Deployment** | Netlify API | Programmatic site creation, custom domains, SSL |
| **Domain Purchase** | Namecheap API (affiliate) | Domain registration with markup |
| **Storage** | Supabase Storage or Cloudflare R2 | Generated images, exported HTML |
| **CDN** | Netlify (built-in) | Free CDN for deployed sites |

### System Diagram

```
┌─────────────────────────────────────────────────────────┐
│                    CLINICPAGES APP                        │
│                   (Next.js on Vercel)                     │
│                                                          │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌─────────┐ │
│  │ Wizard   │  │ Dashboard│  │ Domain   │  │ Account │ │
│  │ (Build)  │  │ (Manage) │  │ Manager  │  │ Credits │ │
│  └────┬─────┘  └────┬─────┘  └────┬─────┘  └────┬────┘ │
│       │              │              │              │      │
│  ┌────┴──────────────┴──────────────┴──────────────┴───┐ │
│  │                  API Routes                          │ │
│  │  /api/generate  /api/deploy  /api/domains  /api/pay │ │
│  └──┬───────────┬───────────┬───────────┬──────────────┘ │
└─────┼───────────┼───────────┼───────────┼────────────────┘
      │           │           │           │
      ▼           ▼           ▼           ▼
┌──────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐
│ Claude   │ │ Gemini  │ │ Netlify │ │ Stripe  │
│ (Text)   │ │ (Images)│ │ (Deploy)│ │ (Pay)   │
└──────────┘ └─────────┘ └─────────┘ └─────────┘
                              │
                              ▼
                    ┌──────────────────┐
                    │ Client's Domain  │
                    │ clinic.com       │
                    └──────────────────┘
```

---

## Feature 1: Full Page Generation

### What Gets Generated

When a clinic clicks "Generate", we produce ALL of this:

**Text Content (Claude — ~$0.03 per language):**
- Hero headline + subheadline
- 6 benefit reasons with descriptions
- Procedure steps (3-5 steps)
- FAQ (5-8 questions)
- Reviews (5 AI-generated reviews)
- Advantages section
- Contact section copy
- Meta title + description
- All repeated for each selected language (DE, EN, FR, IT)

**Images (Gemini — ~$0.05 per image):**
- 1 hero background silhouette
- 6 before/after photo pairs (side-by-side technique, split into halves)
- SVG illustrations for CTA section background (or pulled from a library)

**Interactive Components (templated, no AI cost):**
- Pricing calculator with base price, add-ons, packages
- AI Visualizer (upload photo → shows treatment result) — this calls Gemini at VIEW time, billed separately
- Booking modal / contact form
- Cookie consent
- Mobile navigation

**Output:** Complete single-file HTML with all CSS inlined, images as base64 or stored on CDN. Works offline, loads fast, SEO-ready.

### Generation Cost Per Page

| Component | API | Cost per page |
|-----------|-----|---------------|
| Text content (1 language) | Claude Sonnet | ~$0.03 |
| Text content (4 languages) | Claude Sonnet | ~$0.12 |
| Hero image | Gemini Flash Image | ~$0.01 |
| 6 B&A pairs | Gemini Flash Image | ~$0.06 |
| Reviews (5) | Claude Sonnet | ~$0.01 |
| **Total (1 language)** | | **~$0.11** |
| **Total (4 languages, dark+light)** | | **~$0.25** |

**What we charge:** 1 credit = 1 full page generation (all variants). Credit price: **$29-49 per credit**. That's 100-200x markup on API costs. The value isn't the API call — it's the Dr. Kish-quality template, the prompt engineering, the design system.

---

## Feature 2: Credits System

### Credit Packs (Stripe)

| Pack | Credits | Price | Per Credit | Margin |
|------|---------|-------|-----------|--------|
| Starter | 1 | $49 | $49 | 99.5% |
| Pro | 5 | $199 | $39.80 | 99.4% |
| Agency | 20 | $599 | $29.95 | 99.2% |
| Enterprise | 100 | $1,999 | $19.99 | 98.7% |

**Subscription option:** $99/mo for 3 credits/month + hosting included.

### What 1 Credit Gets You

- Full page generation (text + images + all interactive components)
- Up to 4 languages (DE, EN, FR, IT — or EN, ES, PT, etc.)
- Dark + Light mode variants (8 total files)
- Unlimited revisions via the "Customize" prompt (text changes only, no re-generation)
- Hosting on clinicpages.com subdomain (e.g., `your-clinic.clinicpages.com`)

### Additional Credit Burns

| Action | Credits |
|--------|---------|
| Generate new page | 1 |
| Regenerate images only | 0.5 |
| Add a language | 0.25 |
| AI Visualizer (per month, per page) | 0.5 |

### Stripe Integration

```
Products:
  - clinic-pages-starter: $49 (one-time, 1 credit)
  - clinic-pages-pro: $199 (one-time, 5 credits)
  - clinic-pages-agency: $599 (one-time, 20 credits)
  - clinic-pages-monthly: $99/mo (subscription, 3 credits/mo)
  
Webhooks:
  - checkout.session.completed → add credits to user account
  - invoice.paid → add monthly credits
  - customer.subscription.deleted → stop monthly credits
```

### Database Schema (Supabase)

```sql
-- Users (extends Supabase auth.users)
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  email TEXT NOT NULL,
  clinic_name TEXT,
  credits_balance DECIMAL(10,2) DEFAULT 0,
  stripe_customer_id TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Credit transactions
CREATE TABLE credit_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id),
  amount DECIMAL(10,2) NOT NULL, -- positive = purchase, negative = usage
  type TEXT NOT NULL, -- 'purchase', 'generate', 'deploy', 'visualizer', 'refund'
  description TEXT,
  stripe_payment_id TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Generated pages
CREATE TABLE pages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id),
  treatment_name TEXT NOT NULL,
  treatment_category TEXT,
  clinic_name TEXT,
  content JSONB, -- generated text content
  images JSONB, -- { hero: url, beforeAfter: [{before, after}] }
  config JSONB, -- { languages, themes, sections, brand }
  netlify_site_id TEXT,
  custom_domain TEXT,
  subdomain TEXT, -- e.g., "your-clinic" for your-clinic.clinicpages.com
  status TEXT DEFAULT 'draft', -- draft, deployed, archived
  deployed_url TEXT,
  credits_used DECIMAL(10,2),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Domains
CREATE TABLE domains (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id),
  page_id UUID REFERENCES pages(id),
  domain TEXT NOT NULL,
  type TEXT NOT NULL, -- 'subdomain' (free), 'custom', 'purchased'
  dns_verified BOOLEAN DEFAULT FALSE,
  ssl_provisioned BOOLEAN DEFAULT FALSE,
  namecheap_order_id TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

---

## Feature 3: Deployment (One-Click)

### How It Works

1. **Client generates page** → stored in `pages` table
2. **Client clicks "Deploy"** → we:
   a. Create a new Netlify site via API (`POST /api/v1/sites`)
   b. Deploy the generated HTML as a zip (`POST /api/v1/sites/{site_id}/deploys`)
   c. Assign either:
      - Free subdomain: `clinic-name.clinicpages.com` (via Netlify custom domain)
      - Custom domain: client's own domain (requires DNS pointing)
3. **Site is live in ~10 seconds** with SSL

### Netlify API Integration

```typescript
// Create site
const site = await fetch('https://api.netlify.com/api/v1/sites', {
  method: 'POST',
  headers: { Authorization: `Bearer ${NETLIFY_TOKEN}` },
  body: JSON.stringify({
    name: `cp-${userId}-${pageId}`, // Internal name
    custom_domain: subdomain ? `${subdomain}.clinicpages.com` : undefined
  })
});

// Deploy HTML
const zip = await createDeployZip(pageHtml, assets);
await fetch(`https://api.netlify.com/api/v1/sites/${siteId}/deploys`, {
  method: 'POST',
  headers: {
    Authorization: `Bearer ${NETLIFY_TOKEN}`,
    'Content-Type': 'application/zip'
  },
  body: zip
});

// Add custom domain
await fetch(`https://api.netlify.com/api/v1/sites/${siteId}/domains`, {
  method: 'POST',
  headers: { Authorization: `Bearer ${NETLIFY_TOKEN}` },
  body: JSON.stringify({ hostname: 'client-domain.com' })
});
```

### Subdomain Strategy

- **Free tier:** `clinic-name.clinicpages.com` — requires clinicpages.com domain with wildcard DNS pointing to Netlify
- **Pro tier:** Connect your own domain (CNAME → Netlify)
- **Enterprise:** We manage DNS entirely

### Cost

- Netlify free tier: 100 sites, 100GB bandwidth/mo
- Netlify Pro ($19/mo): 500 sites
- At scale (1000+ sites): Cloudflare Pages (unlimited sites, free)

**We charge: $0 for subdomain hosting, $9.99/mo for custom domain hosting (pure profit).**

---

## Feature 4: Domain Purchase (Affiliate Revenue)

### Option A: Namecheap Affiliate

- **Affiliate commission:** Up to 35% on domain registrations
- **API:** Full domain registration API available
- **Flow:** Client searches for domain → we check availability via Namecheap API → client pays us → we register via API → we pocket the markup + affiliate commission
- **Pricing:** We charge $19.99/yr for .com (Namecheap cost: ~$8.88/yr, affiliate commission: ~$3). Net profit: ~$14/domain/yr

### Option B: Porkbun (Cheapest)

- No official affiliate program but cheapest wholesale pricing
- .com at $8.56/yr
- Reseller program available for volume

### Option C: Cloudflare Registrar (At-Cost)

- Domains at wholesale price (no markup possible)
- But: great DNS/CDN integration
- Better for the "connect your domain" flow, not for selling domains

**Recommendation:** Namecheap API for domain sales (affiliate + markup), Cloudflare for DNS management.

### Domain Flow

```
1. Client enters desired domain in ClinicPages dashboard
2. We check availability: GET /namecheap/api/domain-check?domain=X
3. Client sees price ($19.99/yr for .com)
4. Client pays via Stripe
5. We register via Namecheap API
6. We auto-configure DNS to point to their Netlify site
7. SSL auto-provisions via Let's Encrypt (Netlify handles this)
8. Site live on custom domain in ~5 minutes
```

---

## Feature 5: AI Visualizer (Revenue Per View)

The Dr. Kish pages have an "AI Visualizer" where visitors can upload their photo and see what they'd look like after treatment. This is a differentiator and a credit burner.

### How It Works

1. Visitor uploads selfie on the landing page
2. JavaScript sends to our API: `/api/visualize`
3. We call Gemini with the photo + treatment-specific prompt
4. Gemini returns modified image showing treatment results
5. Visitor sees before/after of THEIR face/body

### Cost & Pricing

- Gemini API cost per visualization: ~$0.01-0.02
- We charge clinic: 0.5 credits/month for AI Visualizer access (baked into subscription)
- Or: $4.99/mo add-on per page

### Implementation

The visualizer is already built in the Dr. Kish template. It's a JavaScript module that:
1. Opens a modal with file upload
2. Sends the image to an API endpoint
3. Displays the AI-generated result
4. Includes a CTA to book

We just need to:
1. Add the `/api/visualize` route in ClinicPages
2. Track usage per clinic per month
3. Rate limit to prevent abuse

---

## Pricing Summary

| What | Price | Our Cost | Margin |
|------|-------|----------|--------|
| 1 page credit (all variants) | $49 | ~$0.25 | 99.5% |
| 5 credit pack | $199 | ~$1.25 | 99.4% |
| Monthly sub (3 credits + hosting) | $99/mo | ~$1/mo | 99% |
| Custom domain hosting | $9.99/mo | $0 (Netlify free) | 100% |
| Domain purchase | $19.99/yr | ~$5.88/yr | 70% |
| AI Visualizer | $4.99/mo | ~$5/mo at 500 uses | Break-even at scale, upsell at low volume |

### Revenue Projections

| Scenario | Monthly Revenue | Annual |
|----------|----------------|--------|
| 10 clinics × $99/mo sub | $990 | $11,880 |
| 50 clinics × $99/mo sub | $4,950 | $59,400 |
| 50 clinics + domains + visualizer | $7,500 | $90,000 |
| 200 clinics (agency sales) | $25,000+ | $300,000+ |

---

## Implementation Priority

### Phase 1 — Make Generation Dr. Kish Quality (THIS WEEK)
1. ✅ Wire in Gemini for hero + B&A images (done, needs new API key)
2. Port the FULL Dr. Kish HTML template into export.ts (dark + light modes)
3. Add pricing calculator component
4. Add AI Visualizer component
5. Generate all 8 variants (4 languages × 2 themes)

### Phase 2 — Deploy Infrastructure (NEXT WEEK)
1. Set up Supabase (auth + database)
2. Add Stripe credits system
3. Add one-click deploy via Netlify API
4. Add subdomain assignment (clinic-name.clinicpages.com)
5. Dashboard: manage pages, view analytics

### Phase 3 — Domain Sales (WEEK 3)
1. Namecheap API integration
2. Domain search + purchase flow
3. Auto DNS configuration
4. Custom domain connection for existing domains

### Phase 4 — Scale (MONTH 2)
1. AI Visualizer as add-on
2. Agency accounts (white-label)
3. Template marketplace (clinics customize further)
4. Analytics dashboard (page views, conversions)

---

## Key Insight: Why This Works

**Claude Code takes 24 minutes to build ONE page.** Our system does it in 2-3 minutes — and the clinic owner doesn't need to touch code, a terminal, or understand anything technical.

The value isn't the API calls. It's:
1. **The Dr. Kish template** — proven to convert, battle-tested across 5 live sites
2. **The prompt engineering** — years of iteration on what makes aesthetic clinic copy convert
3. **The design system** — dark/light modes, mobile-first, pricing calculators, trust elements
4. **The deployment** — one click to live site with custom domain and SSL
5. **The time savings** — 24 minutes of Claude Code → 2 minutes of clicking through a wizard

We're not selling API access. We're selling a finished product that happens to use APIs under the hood.

---

## Open Questions for Ben

1. **Netlify account:** Should we use your existing Netlify account or create a dedicated one for ClinicPages?
2. **clinicpages.com domain:** Do we own this? Need to buy it for subdomain hosting.
3. **New Gemini API key:** Need this to re-enable image generation.
4. **Stripe:** Want to create dedicated Stripe products for ClinicPages, or use existing?
5. **Supabase:** Create free project under your account or mine?
6. **Template scope:** Start with aesthetic clinics only, or make it generic for any medical practice?
