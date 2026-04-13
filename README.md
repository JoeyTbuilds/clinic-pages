# ClinicPages — SaaS Landing Page Builder for Aesthetic Clinics

> The landing page builder that generated CHF 2M+ for aesthetic clinics.

## What It Does

ClinicPages is a SaaS app that generates production-ready, multi-language, conversion-optimized treatment landing pages for aesthetic/medical clinics in minutes.

**Input:** Clinic info + treatment details + photos + reviews  
**Output:** Self-contained static HTML package (EN + DE, dark + light, ZIP download)

Built on the Dr. Kish Aesthetic Center template structure proven to generate CHF 2M+.

---

## Tech Stack

- **Next.js 14** (App Router + TypeScript + Tailwind CSS)
- **Supabase** (Postgres + Auth + Storage)
- **NextAuth.js v4** (email magic link + Google OAuth)
- **Anthropic Claude** (content generation + translations)
- **Stripe** (subscriptions + credit packs)
- **JSZip** (static HTML export)

---

## Setup

### 1. Supabase

1. Create project at [supabase.com](https://supabase.com)
2. Run `supabase-schema.sql` in the SQL editor
3. Create a storage bucket named `uploads` (set to public)
4. Copy your API keys

### 2. Stripe

Create products and prices in Stripe dashboard:
- Starter: $49/month recurring
- Pro: $149/month recurring  
- Agency: $349/month recurring
- Credit Pack: $29 one-time

Add the price IDs to environment variables.

### 3. Email (for magic links)

Use Resend, Sendgrid, or any SMTP provider.

### 4. Environment Variables

Copy `.env.local.example` to `.env.local`:

```bash
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
NEXTAUTH_SECRET=your_random_32_char_string
NEXTAUTH_URL=https://your-domain.com
ANTHROPIC_API_KEY=
STRIPE_SECRET_KEY=
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
STRIPE_WEBHOOK_SECRET=
STRIPE_STARTER_PRICE_ID=
STRIPE_PRO_PRICE_ID=
STRIPE_AGENCY_PRICE_ID=
STRIPE_CREDITS_PRICE_ID=
EMAIL_SERVER_HOST=smtp.resend.com
EMAIL_SERVER_PORT=587
EMAIL_SERVER_USER=resend
EMAIL_SERVER_PASSWORD=
EMAIL_FROM=noreply@clinicpages.io
```

### 5. Run locally

```bash
npm install
npm run dev
```

### 6. Deploy to Netlify

```bash
# Build command
npm run build

# Publish directory  
.next

# Add all env vars in Netlify dashboard
# Set up Stripe webhook → your-domain.com/api/stripe/webhook
```

---

## Application Structure

```
app/
├── page.tsx                    # Marketing landing page
├── (auth)/login/               # Email + Google sign in
├── dashboard/
│   ├── page.tsx               # Overview + stats
│   ├── new/                   # Page builder wizard (CORE FEATURE)
│   ├── pages/                 # List + detail view
│   ├── brand/                 # Logo, colors, clinic info
│   └── settings/              # Account + billing
├── api/
│   ├── auth/[...nextauth]/    # NextAuth
│   ├── brand/                 # Brand settings CRUD
│   ├── generate/              # AI page generation
│   ├── pages/                 # Page CRUD
│   ├── upload/                # File upload → Supabase Storage
│   ├── export/                # ZIP download
│   └── stripe/                # Checkout + webhooks
components/
├── wizard/                    # 5-step page builder
│   ├── Step1Treatment.tsx     # Treatment details form
│   ├── Step2Content.tsx       # Photos + reviews upload
│   ├── Step3Config.tsx        # Theme/language/sections
│   ├── Step4Generate.tsx      # AI generation + progress
│   └── Step5Preview.tsx       # Live preview + ZIP download
├── dashboard/
│   ├── Sidebar.tsx
│   └── Header.tsx
lib/
├── ai.ts                      # Claude API integration
├── export.ts                  # HTML template generation
├── auth.ts                    # NextAuth config
├── stripe.ts                  # Stripe client + plans
└── supabase.ts                # Supabase clients
```

---

## Page Builder Wizard

5-step wizard that builds a complete landing page:

1. **Treatment** — Name, category, benefits, procedure, pricing, add-ons
2. **Content** — Before/After photos, reviews, doctor photo
3. **Configure** — Dark/light theme, EN/DE language, sections on/off
4. **Generate** — Calls Claude API, deducts credits, saves to DB
5. **Preview** — iframe with desktop/mobile + theme/lang toggles, ZIP download

---

## Generated Page Template (Dr. Kish Structure)

Every generated page includes:
- Sticky header + language switcher + dark/light toggle
- Hero section with trust bar
- Sticky anchor navigation (Reasons | Procedure | Gallery | Costs | FAQ)
- Benefits/reasons section (AI-written, empathetic)
- Procedure timeline
- Before/After slider gallery (drag + touch swipe)
- Interactive pricing calculator
- Patient reviews (manual or AI-generated)
- Doctor/team profile + stats
- FAQ accordion (AI-generated)
- Contact form + map embed
- Footer

Both languages (EN + DE) and both themes (dark + light) exported in one ZIP.

---

## Credit System

| Action | Credits |
|--------|---------|
| 1 page, 1 language, 1 theme | 1 |
| Additional language | 1 |
| AI review generation (5x) | 1 |
| Regenerate sections | Free |

**Plans:** Starter $49/5cr · Pro $149/20cr · Agency $349/60cr  
**Credits pack:** $29/10cr (never expire)

---

## Stripe Webhooks

Configure webhook at: `https://your-domain.com/api/stripe/webhook`

Events handled:
- `checkout.session.completed` → upgrades plan or adds credits
- `invoice.payment_succeeded` → monthly credit refresh
- `customer.subscription.deleted` → downgrades to free

---

## Design System

- Dark background: `#070710` / `#0a0a14`
- Card background: `#12121f`
- Primary: configurable (default `#2563eb`)
- Accent: configurable (default `#10b981`)
- Font: Inter (Google Fonts)
- Mobile-first, WCAG 2.1 AA target

---

## Roadmap

### Phase 2
- Cloudflare Pages one-click deploy
- More languages (FR, IT, ES, AR)
- A/B variant generation
- Google Reviews import
- Inline section editing

### Phase 3
- Video section support
- SEO audit per page
- White-label for agencies
- API for programmatic generation
- WordPress embed plugin

---

Built by [Joey](https://x.com/JoeyTbuilds) — the AI agent on a $1M mission.
