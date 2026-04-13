# ClinicPages Launch Brief

## What We Built

A **5-minute landing page generator** for aesthetic clinics that:
- Takes clinic details (treatment, before/after photos, pricing)
- Runs Claude to write conversion copy (hero, FAQ, benefits, reviews)
- Generates dark + light mode variants in EN + DE simultaneously
- Exports static HTML/CSS/JS as a ZIP file
- Can be deployed on any hosting (no backend required)

## Why It Matters

Aesthetic clinics spend **€2K–€5K** on landing pages that don't convert. They get:
- Generic templates that look like 500 other clinics
- Hiring an agency (3+ weeks, €5K+)
- Freelancer copy that doesn't sell

**ClinicPages sells them** a page that **actually converts** in 5 minutes for $49/month (or $149 for agencies).

## The Proof

Dr. Kish Aesthetic Center (our template source):
- **CHF 2M+** total revenue from landing pages
- Consistent 300+ bookings/month from cold ads
- Private clinic, intimate niche, unmatched conversion

The system works. We're just packaging it.

## Business Model

**Subscription (monthly credits):**
- Starter: $49/mo = 5 credits = 5 pages (EN only) or 2-3 bilingual pages
- Pro: $149/mo = 20 credits
- Agency: $349/mo = 60 credits + white-label + API

**Pay-as-you-go:**
- 10-credit pack = $29 (clinics who want to test once)

**Unit Economics:**
- Stripe processing: $0.30 + 2.9% = ~$1.50 per $50 subscription
- Anthropic API (Claude): ~$0.15 per page (generation + reviews)
- Netlify/hosting: $0/mo (free tier)
- Support: ~$0 (docs + FAQ, no onboarding needed)

**Margin:** $50 sub - $2 = 96% gross margin at scale

## Target Market

1. **Aesthetic clinic owners** (Botox, liposuction, hair transplants, tattoo removal)
2. **Marketing agencies** serving clinics (white-label export)
3. **Freelance web designers** (clone pages for clients fast)

## Competitive Advantage

1. **Proven template** — Not generic. Built on Dr. Kish's €60M system.
2. **AI customization** — "Make it warmer" → Claude regenerates. Competitors can't do this.
3. **Dark + Light A/B ready** — Automatic variant generation.
4. **Multi-language in one click** — All 4 languages from single English input.
5. **Zero deployment complexity** — Static export = paste into any host.

## Go-to-Market

### Phase 1 (This week)
- Launch post on X (@JoeyTbuilds)
- DM existing clinic network (Dr. Kish, Edi, Nela, Shaya, etc.)
- Offer free credits to first 20 testers

### Phase 2 (Week 2)
- Blog post: "How we reverse-engineered Dr. Kish's $2M landing page system"
- Dev.to: "Building an AI landing page generator with Claude + Next.js"
- Reddit: r/entrepreneurs, r/SaaS, r/aestheticsurgery

### Phase 3 (Ongoing)
- Content: "Before/after case studies" (ClinicPages → bookings)
- SEO: "Best landing page builders for clinics" keyword (low competition)
- Partnerships: Reach out to WordPress/Webflow plugin communities

## Blockers

- ⏳ Supabase credentials (auth + database) — waiting 5-6 hours
- 🔴 @JoeyTbuilds account suspended — can't post until restored
- ⏳ Stripe live key (we have test key, need live)

## Deployment Timeline

**With Supabase creds:**
- 10 min: Set env vars + deploy to Vercel/Netlify
- 5 min: Configure Stripe webhook
- 🎯 LIVE

**Full feature:**
- Dashboard persists pages (not live yet)
- Email export link (not live yet)
- Team collaboration (v2)

---

## Next Immediate Actions

1. Ben tests wizard fully
2. Supabase creds arrive → full deployment
3. First beta customer email goes out
4. Launch post drafted for X
