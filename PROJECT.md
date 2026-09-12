# Project: Advance Orthopedic & Sports Injury Hospital (AOSIH) Web Platform — 550 Sitemap URL Expansion

## Architecture
- Static Multi-Page Architecture (MPA) serving all 550 live sitemap URLs from `https://jointsurgeon.in/sitemap.xml`.
- Hierarchy:
  - 8 Core Existing Pages + Aliases (`index.html`, `about.html`, `knee-arthroscopy.html`, `hip-replacement.html`, `shoulder-surgery.html`, `testimonials.html`, `fellowship.html`, `contact.html`, and legacy sitemap aliases `aboutus.html`, `knee-treatment.html`, `hip-treatment.html`, `shoulder-pain-treatment.html`, `invitation-for-fellowship.html`, `contactus.html`).
  - 4 Secondary Core Pages: `/blogs/`, `/arthoscopy-in-jaipur/`, `/challanging-cases/`, `/joint-care-services/`.
  - 395 Programmatic City & Regional Landing Pages:
    * 375 City Landing Pages (`/best-{specialty}-in-{city}/` across 15 specialties and 40 Indian cities).
    * 20 Regional State Landing Pages (`/{procedure}-jaipur-for-patients-from-{state}/` across 4 procedures and 5 states: Bihar, Haryana, Madhya Pradesh, Punjab, Uttar Pradesh).
  - 143 Educational Blog Articles & Site Pages:
    * 90 Clinical & Rehabilitation Blog Articles (`/blog-details/{slug}.html`).
    * 1 Blog Details Hub (`/blog-details/index.html`).
    * 23 Clinical & Procedural Guides (`/Anatomy-of-the-Knee.html`, `/Meniscal-Tears.html`, `/acl.html`, etc.).
    * 5 National & Regional Authority Pages.
    * 6 Media, Research & Hospital Info Pages.
    * 4 Gallery & Global FAQ Pages.
    * 14 Utility & Patient Portal Pages.
- Unified AOSIH Modern Design System:
  - Styling: `css/style.css` (primary design system) + `css/liquid-motion.css` (liquid animation layer, glassmorphism, mobile layout enhancements).
  - Animation & Motion: Vendored GSAP 3.12.5, ScrollTrigger 3.12.5, Lenis 1.1.18 in `js/vendor/` + `js/liquid-motion.js` (modular liquid controller: RAF synchronization, 2D/WebGL fluid shader canvas, SVG wave morphing, magnetic links, ripple buttons, 3D card tilt, specular sheen, batch scroll reveals, 60fps performance).
  - Navigation: Sticky frosted-glass header (`.sh2`) with 8 navigation items and CTA button; full mobile navigation drawer (`.mm`) with backdrop blur and smooth toggle; floating WhatsApp and Call consultation badges.
  - Content & SEO: Semantic HTML5, 100% authentic extracted content from live URLs, root-relative asset paths, verified Dr. Naveen Sharma authority credentials, Jaipur geo-citations (Sodala Metro Pillar 95, New Sanganer Road), OPD hours 11 AM - 7 PM, 4.9 rating / 3,340+ reviews, 20,000+ surgeries.
  - Structured Data: 100% valid Schema.org JSON-LD (`Hospital`, `Physician`, `MedicalWebPage`, `BlogPosting`, `MedicalProcedure`, `FAQPage`, `BreadcrumbList`) with 1:1 question matching in visible HTML accordions.
  - Hosting & Delivery: Vercel deployment via `vercel.json` with `cleanUrls: true`, `trailingSlash: false`, security headers, and Git version control.

## Feature Inventory
| # | Feature | Description | Milestone | Source |
|---|---------|-------------|-----------|--------|
| 1 | Complete 550 Sitemap Ingestion | Fetch, extract, and cache authentic content from all 550 URLs in https://jointsurgeon.in/sitemap.xml | M1 | R1 |
| 2 | Authentic Content Extraction | Extract real title tags, meta descriptions, H1–H3 headings, body text, FAQs, clinical case images, and author bylines | M1 | R1 |
| 3 | 100% URL Slug Compatibility | Support exact slugs, PascalCase slugs, legacy typos, and core aliases with zero broken links or 404s | M1 | R1 |
| 4 | Secondary Core Pages Generation | Build /blogs/, /arthoscopy-in-jaipur/, /challanging-cases/, and /joint-care-services/ | M2 | R1 |
| 5 | Programmatic City Landing Pages (395) | Generate 375 city and 20 regional state landing pages with dynamic tokens, doctor badges, and travel info | M2 | R1 |
| 6 | Educational Blog Articles (143) | Generate 90 /blog-details/ articles, 23 clinical guides, and site pages with table of contents and doctor quotes | M2 | R1 |
| 7 | Sticky Frosted-Glass Header (.sh2) | Embed canonical header with 8 navigation items and CTA button across all 550 pages | M2 | R2 |
| 8 | Mobile Navigation Drawer (.mm) | Embed full mobile drawer with backdrop blur and smooth toggle across all 550 pages | M2 | R2 |
| 9 | Global Liquid Animation Layer | Link /css/style.css, /css/liquid-motion.css, and /js/liquid-motion.js via root-relative paths | M2 | R2 |
| 10 | Universal 3D Tilt & Specular Sheen | Apply .card-tilt-3d and .card-sheen to procedure cards, doctor profile cards, and review containers | M2 | R2 |
| 11 | Liquid Ripple Buttons & FAQs | Liquid button ripples (.btn, .nb) and smooth expanding FAQ accordions (.faq-item-card) | M2 | R2 |
| 12 | Floating WhatsApp & Call Badges | Floating consultation badges (.float-cta, .fw2, .fc3) on every generated page | M2 | R2 |
| 13 | Asset Fallback & Branding Integrity | verified hospital branding and onerror fallback handlers on all image elements | M2 | R2, R3 |
| 14 | Tailored Schema.org JSON-LD | 100% valid JSON-LD tailored to MedicalWebPage, BlogPosting, MedicalProcedure, FAQPage, BreadcrumbList | M3 | R3 |
| 15 | 1:1 Schema-to-DOM FAQ Sync | Every FAQ question in JSON-LD FAQPage exists verbatim in visible DOM accordions | M3 | R3 |
| 16 | E2E Opaque-Box Test Suite (Tiers 1-4) | Automated test suite validating 550 slugs, schema validity, liquid motion assets, and mobile layout | E2E | R4 |
| 17 | Headless Browser Validation (Playwright) | Desktop (1440px) & Mobile (375px) browser tests with 0 console errors and zero horizontal scroll spill | M4 | R4 |
| 18 | Tier 5 Adversarial Coverage Hardening | White-box edge-case tests, broken link scanners, and payload boundary checks | M4 | R4 |
| 19 | Forensic Integrity Audit | Systematic audit for authentic data extraction, real DOM rendering, and zero cheating/facades | M4 | Protocol |
| 20 | Git Commit & Live Vercel Deployment | Commit all generated HTML pages and assets to Git and deploy to production on Vercel | M4 | R4 |

## Milestones
| # | Name | Scope | Dependencies | Status |
|---|------|-------|-------------|--------|
| E2E | E2E Testing Track | Requirement-driven test suite (Tiers 1-4), TEST_INFRA.md, publish TEST_READY.md | none | DONE |
| M1 | Authentic Content Ingestion & Manifest Pipeline | Fetch, extract, and cache real content from all 550 URLs into structured cache | none | DONE |
| M2 | Programmatic HTML Generation & Design Integration | Generate all 550 static HTML pages with unified AOSIH design, liquid motion, header/drawer/badges | M1 | IN_PROGRESS |
| M3 | Schema.org JSON-LD & SEO/Branding Enrichment | Embed tailored Schema.org JSON-LD, 1:1 FAQ sync, verified hospital branding on all pages | M2 | PLANNED |
| M4 | Final Integration, Verification & Live Vercel Deployment | E2E test pass (Tiers 1-4), Playwright browser verification, Tier 5 hardening, Forensic Audit, Git & Vercel | M3, E2E | PLANNED |

## Interface Contracts
### M1 (Ingestion) ↔ M2 (Generator)
- Ingestion pipeline completed: `output/ingestion_manifest.json` (6.54 MB, 550 structured page records) and `output/crawl_cache/` (550 HTML files).

### M2 (Generator) ↔ M3 (Schema)
- All generated HTML pages have standard `<head>` placeholder or direct injection points for Schema.org JSON-LD:
  - `<script type="application/ld+json" id="schema-graph">...</script>`
- Visible FAQ accordions render inside `.faq-list-card` with `<details class="faq-item-card"><summary class="faq-question-text">...</summary><div class="faq-answer-body">...</div></details>`.

### M2 (Generator) ↔ Layout & Design System
- Root-relative asset paths on all pages:
  - `/css/style.css?v=1.6`
  - `/css/liquid-motion.css?v=1.6`
  - `/js/liquid-motion.js?v=1.6`
  - `/images/...`
- Header `.sh2` sticky positioning with `top: 0; z-index: 1000`.
- Mobile drawer `.mm` included before `</body>`.
- Floating consultation badges `.float-cta` with WhatsApp (`.fw2`) and Call (`.fc3`) buttons.

### M3 (Content & Schema) ↔ Search & AEO
- Schema.org JSON-LD `@graph` syntax: 100% valid JSON with zero syntax or property errors.
- Google FAQPage policy: Every question in `FAQPage.mainEntity` MUST exist verbatim in visible HTML accordions.
- Consistent hospital branding: Advance Orthopedic & Sports Injury Hospital, Dr. Naveen Sharma, MS KEM Mumbai, AIIMS, Sodala Pillar 95, Jaipur.

### M4 (Verification & Deployment) ↔ Vercel
- `vercel.json` configured with `cleanUrls: true`, `trailingSlash: false`.
- 100% of sitemap slugs resolve cleanly with 200 OK.
- Zero console errors in Playwright tests on desktop (1440px) and mobile (375px).

## Code Layout
- `output/crawl_cache/` — Raw HTML and extracted page cache (owned by M1) [DONE: 550 files]
- `output/ingestion_manifest.json` — Authoritative structured catalog for 550 pages (owned by M1) [DONE: 6.54 MB]
- `scripts/crawl_550.py` — High-concurrency crawler and content extractor (owned by M1) [DONE]
- `scripts/generate_550.py` — High-performance HTML generator engine (owned by M2) [IN_PROGRESS]
- `scripts/enrich_schema_550.py` — Schema.org JSON-LD enrichment & FAQ sync (owned by M3)
- `scripts/validate_pipeline_550.py` — Multi-gate validation script (owned by M4 / E2E)
- `tests/` — Opaque-box E2E test suite & Playwright browser test harness (owned by E2E Testing Track) [DONE: test_550_sitemap_suite.py, playwright_audit_runner.mjs]
- `*.html` (root) & `blog-details/*.html` — Generated 550 static HTML pages (owned by M2, enriched by M3)
- `css/style.css`, `css/liquid-motion.css`, `js/liquid-motion.js` — Modern design system & animation layer
- `vercel.json` — Deployment routing, clean URLs, and security headers (owned by M4)
