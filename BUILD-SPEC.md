# ClinicPages — MVP Build Spec

## What It Is
A SaaS landing page builder for aesthetic/medical clinics. Input: clinic info + photos + reviews → Output: production-ready, multi-language, conversion-optimized treatment landing pages.

Based on the proven Dr. Kish Aesthetic Center template that generated CHF 2M+ in revenue.

## Core Architecture

### Tech Stack
- **Frontend**: Next.js 14 (App Router) + TypeScript + Tailwind CSS
- **Auth**: NextAuth.js (email + Google OAuth)
- **Database**: Supabase (Postgres + Auth + Storage)
- **File Storage**: Supabase Storage (photos, logos)
- **AI**: Claude API (content generation, translations)
- **Payments**: Stripe (subscriptions + credit packs)
- **Deployment**: Netlify (for the SaaS app itself)
- **Generated Pages**: Static HTML/CSS export (clinic hosts on their own domain/Cloudflare)

### Pages in the SaaS App

1. **/** — Marketing landing page (sell the product)
2. **/login** — Auth (email magic link + Google)
3. **/dashboard** — Overview: pages created, credits remaining, recent activity
4. **/dashboard/new** — Create new landing page wizard
5. **/dashboard/pages** — List of created pages
6. **/dashboard/pages/[id]** — Edit/preview a page
7. **/dashboard/brand** — Upload logo, set brand colors, fonts
8. **/dashboard/settings** — Account, billing, domain setup guide
9. **/pricing** — Plans + credit packs

### The Page Builder Wizard (Core Product)

**Step 1: Clinic Profile** (one-time setup, saved to account)
- Clinic name
- Logo upload
- Brand colors (primary, secondary, accent) — color picker
- Brand fonts (select from curated list or upload)
- Contact info (phone, email, address)
- Google Maps embed URL
- Social links
- Languages supported (checkboxes: EN, DE, FR, IT, ES, PT, RU, AR, TR, ZH)

**Step 2: Treatment Details**
- Treatment name (e.g., "Penisvergrösserung", "Breast Augmentation", "Botox")
- Treatment category (Face / Body / Intimate / Skin / Hair — dropdown)
- Description (optional — AI generates if blank)
- Key benefits (bullet points, optional)
- Procedure steps (optional — AI generates if blank)
- Duration, recovery time, anesthesia type
- Starting price (e.g., "ab CHF 2,500")
- Price breakdown options (for pricing calculator)

**Step 3: Upload Content**
- Before/After photos (upload pairs, drag to reorder)
  - For each pair: treatment name, timeframe ("6 weeks post-op")
  - AI auto-detects treatment area from photo (face/body/etc.)
- Patient reviews (upload or paste)
  - Name (or anonymous), rating (1-5 stars), text
  - Option: "Generate AI reviews based on treatment" (clearly marked as AI-generated)
- Provider/doctor photo
- Clinic interior photos (optional)
- Certifications/awards (optional upload)

**Step 4: Page Configuration**
- Theme: Dark mode / Light mode / Both (generates A/B variants)
- Languages: Select which languages to generate (uses credits per language)
- Sections to include (all on by default, can toggle off):
  - [ ] Hero with CTA
  - [ ] Treatment overview (Reasons/Benefits)
  - [ ] Procedure steps (How It Works)
  - [ ] Before/After gallery
  - [ ] Pricing calculator
  - [ ] Reviews/testimonials
  - [ ] Doctor/team profile
  - [ ] FAQ (AI-generated from treatment info)
  - [ ] Contact form / booking CTA
  - [ ] Trust signals (certifications, years of experience, procedures count)
- CTA button text + destination URL (booking link, WhatsApp, phone)

**Step 5: Generate & Preview**
- Live preview (desktop + mobile toggle)
- Switch between languages
- Switch between dark/light mode
- Edit any section inline
- Regenerate specific sections

**Step 6: Export & Deploy**
- Download as ZIP (static HTML/CSS/JS + images)
- One-click Cloudflare Pages deploy (OAuth integration — Phase 2)
- Custom domain setup guide
- Embed code for existing websites (iframe option)

### Pricing Calculator Component
For each treatment, the clinic can define:
- Base price
- Add-on options (e.g., "+1 zone: CHF 350", "Stem cell enrichment: CHF 500")
- Package deals (e.g., "3 sessions: CHF 5,000 instead of CHF 6,000")
- The calculator renders as an interactive widget on the page

### Before/After Gallery Component
- Side-by-side slider (drag handle)
- Swipeable on mobile
- Treatment label + timeframe
- HIPAA-compliant: no auto-tagging of patient identity
- Watermark option with clinic logo

### Reviews Component
- Star rating visual
- Review text
- Reviewer name (or "Anonymous")
- Treatment type tag
- Option for Google reviews embed
- AI-generated reviews clearly labeled with small disclaimer

### Multi-Language
- One content set → Claude translates to selected languages
- Each language is a separate static page (e.g., /en/, /de/, /fr/)
- Language switcher in the header
- SEO meta tags per language (hreflang)
- RTL support for Arabic

### Dark/Light Mode
- Both variants generated simultaneously
- System preference detection by default
- Manual toggle in header
- Each variant is a complete page (not just CSS swap — different image treatments, contrast adjustments)

### A/B Testing
- When "Both" theme selected: generates variant A (dark) and variant B (light)
- Different hero headlines can be generated for each variant
- Clinic can deploy both and track which converts better
- Future: built-in analytics to auto-pick winner

---

## Credit System

| Action | Credits |
|--------|---------|
| Generate 1 treatment page (1 language, 1 theme) | 1 credit |
| Additional language for same page | 1 credit |
| Additional theme variant (dark/light) | 1 credit |
| AI review generation (set of 5) | 1 credit |
| Regenerate/edit section | 0 credits (free) |
| Before/after photo processing | 0 credits (free) |

### Plans

| Plan | Price | Credits/mo | Features |
|------|-------|------------|----------|
| Starter | $49/mo | 5 credits | 1 clinic, basic templates, email support |
| Pro | $149/mo | 20 credits | 3 clinics, all templates, priority support, custom domain guide |
| Agency | $349/mo | 60 credits | Unlimited clinics, white-label, API access, dedicated support |
| Credits Pack | $29 | 10 credits | One-time purchase, never expires |

---

## Landing Page Template Structure (Dr. Kish Pattern)

This is the structure of every generated treatment page:

```
[HEADER]
- Logo (left)
- Navigation: Treatments | About | Testimonials | Prices | Contact
- Language switcher (right)
- Dark/light toggle
- CTA button ("Book Appointment")

[HERO SECTION]
- Full-width image or gradient background
- H1: Treatment name + location ("Penisvergrösserung in Zürich")
- Subheading: Key benefit / USP
- CTA button
- Trust bar: "20+ years experience" | "5,000+ patients" | "4.9★ Google rating"

[ANCHOR NAVIGATION]
- Sticky tabs: Reasons | Procedure | Advantages | Costs | Safety | FAQ
- Smooth scroll to each section

[REASONS / BENEFITS]
- Why patients choose this treatment
- 3-4 key benefits with icons
- Empathetic copy (understanding the patient's concern)

[PROCEDURE / HOW IT WORKS]
- Step-by-step timeline
- Duration, anesthesia, recovery
- What to expect

[BEFORE & AFTER GALLERY]
- Slider component
- Treatment labels
- Timeframes

[PRICING CALCULATOR]
- Interactive: select options, see total
- Starting price prominently displayed
- "Price includes: Consultation, Anesthesia, Follow-up" list

[REVIEWS / TESTIMONIALS]
- Star ratings
- Patient stories
- Treatment type tags

[ADVANTAGES / WHY US]
- Doctor profile with photo
- Experience stats
- Clinic photos
- Certifications

[FAQ]
- Expandable accordion
- AI-generated from treatment info
- Common questions per treatment type

[CONTACT / CTA SECTION]
- Contact form OR booking widget
- Phone, email, WhatsApp
- Google Maps embed
- Address
- "Discreet consultation" messaging

[FOOTER]
- Logo
- Navigation links
- Legal: Privacy Policy, Impressum, Terms
- Social links
- Copyright
```

---

## MVP Scope (What to Build NOW)

### Phase 1 — Ship in 1 week:
1. Auth (NextAuth email + Google)
2. Dashboard with "Create New Page" wizard
3. Brand settings (logo, colors)
4. Treatment page generator (the core feature)
5. Before/after photo upload + gallery
6. Reviews: upload OR AI-generate
7. Pricing calculator builder
8. Multi-language generation (EN + DE minimum)
9. Dark/light mode generation
10. Live preview
11. Download as ZIP (static HTML)
12. Stripe integration (subscriptions + credits)
13. Marketing landing page

### Phase 2 — Week 2-3:
- More languages (FR, IT, ES, PT, RU, AR, TR, ZH)
- Cloudflare Pages one-click deploy
- Custom domain setup automation
- A/B variant generation with different headlines
- Analytics integration (track which pages convert)
- Template library (pre-built for common treatments)
- Inline editing of generated pages

### Phase 3 — Month 2:
- Video section support
- Google Reviews import
- SEO audit per page
- White-label for agencies
- API for programmatic page generation
- WordPress plugin for embedding

---

## Design Direction

Premium, medical, trustworthy. Think:
- Clean sans-serif typography (Inter or similar)
- Subtle animations (fade-in on scroll, smooth transitions)
- Medical-grade feel — not "startup fun", but "trusted professional"
- Mobile-first (70%+ of medspa traffic is mobile)
- Fast: target <2s First Contentful Paint
- Accessibility: WCAG 2.1 AA compliant

The SaaS dashboard should feel premium too — dark sidebar, clean cards, progress indicators during generation.

---

## File Structure

```
clinic-pages/
├── app/
│   ├── (auth)/
│   │   ├── login/page.tsx
│   │   └── register/page.tsx
│   ├── (marketing)/
│   │   ├── page.tsx          # Landing page
│   │   └── pricing/page.tsx
│   ├── dashboard/
│   │   ├── page.tsx          # Overview
│   │   ├── new/page.tsx      # Wizard
│   │   ├── pages/page.tsx    # List
│   │   ├── pages/[id]/page.tsx # Edit/preview
│   │   ├── brand/page.tsx    # Brand settings
│   │   └── settings/page.tsx # Account/billing
│   ├── api/
│   │   ├── auth/[...nextauth]/route.ts
│   │   ├── generate/route.ts     # AI page generation
│   │   ├── translate/route.ts    # Language generation
│   │   ├── upload/route.ts       # File uploads
│   │   ├── stripe/
│   │   │   ├── checkout/route.ts
│   │   │   └── webhook/route.ts
│   │   └── export/route.ts       # ZIP export
│   ├── layout.tsx
│   └── globals.css
├── components/
│   ├── wizard/              # Multi-step form components
│   ├── preview/             # Live preview components
│   ├── dashboard/           # Dashboard UI
│   └── ui/                  # Shared UI components
├── lib/
│   ├── supabase.ts
│   ├── stripe.ts
│   ├── ai.ts                # Claude integration
│   ├── export.ts            # Static HTML generation
│   └── templates/           # Page templates
│       └── kish-v1/         # Dr. Kish-based template
├── templates/
│   └── treatment-page/      # The actual HTML template used for export
│       ├── index.html
│       ├── styles.css
│       └── script.js
├── public/
├── package.json
├── tailwind.config.ts
└── next.config.js
```
