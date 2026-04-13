# Dr. Kish Template — Integration Notes for ClinicPages

## KEY INSIGHT
The generated pages should NOT be Next.js rendered pages. They should be **single-file HTML with Tailwind CDN and vanilla JS** — exactly like the Dr. Kish system. This is what's proven to convert.

## Template Architecture (from the proven system)
- Single-file HTML per variation
- Tailwind CSS via CDN (NOT compiled)
- Vanilla JavaScript (zero dependencies)
- 8 variations: 4 languages × 2 modes (dark/light)
- Self-contained — no external JS, no build step needed

## The SaaS app (Next.js) generates these static HTML files
- User fills wizard → Claude generates content → system assembles HTML
- Export as ZIP with the exact Dr. Kish folder structure
- The output IS the product — not the SaaS dashboard

## What needs updating in the current MVP:
1. Export system must generate single-file HTML (not React components)
2. Generated pages must use the exact section order from Dr. Kish
3. Design tokens must match (kish-red #e50036 for dark, cream #EDE8E0 for light)
4. Before/after slider must use the proven 3×2 grid with aspect-[11/12]
5. Pricing calculator must include lead gating with email verification
6. All 8 variations generated from one content set
7. Python translation approach → but for the SaaS, Claude handles translation

## Template from Dr. Kish knowledge files is at:
- /Users/joey/openclaw/workspace/knowledge/drkish-skill/
- /Users/joey/openclaw/workspace/knowledge/drkish-system.md
