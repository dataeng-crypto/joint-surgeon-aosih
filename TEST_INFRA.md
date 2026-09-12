# TEST_INFRA.md: E2E Test Infrastructure & Quality Assurance Architecture
## Advance Orthopedic & Sports Injury Hospital (AOSIH) — 550 Sitemap URL Expansion

---

### 1. Executive Summary & Test Philosophy

This document defines the quality assurance philosophy, architecture, execution protocols, and pass/fail semantics for the **550 Sitemap URL Expansion** of the Advance Orthopedic & Sports Injury Hospital (AOSIH) web platform (`https://jointsurgeon.in/sitemap.xml`).

#### 1.1 Opaque-Box E2E Testing Philosophy
Our testing methodology follows strict **opaque-box principles**:
1. **Observable Contract Over Implementation Details**: The test suite evaluates only the external, observable properties of the web application—actual HTML files on disk, HTTP status codes, fully rendered DOM structures, valid JSON-LD schemas, asset resolution paths, and real browser layout metrics. It does not couple to internal crawling scripts or template generator mechanics.
2. **Zero Facade / Zero Cheating**: Facade tests that always pass, mock real network responses without validation, or bypass physical asset checks are strictly prohibited. Every test asserts real file sizes, real DOM elements, real JSON parsing, and real headless browser telemetry.
3. **Progressive Testability & Defect Escalation**: The test suite functions as a rigid verification oracle across project milestones (M1 Ingestion, M2 Generation, M3 Schema Enrichment, M4 Verification & Vercel Deployment). When run against pre-generation baselines, the suite precisely flags ungenerated artifacts without crashing. As downstream generator agents write pages, the suite progressively turns green without requiring test modification. Implementation defects are immediately surfaced for agent remediation.

---

### 2. 4-Tier Test Suite Architecture

The comprehensive test suite is implemented in `tests/test_550_sitemap_suite.py` and supported by Playwright browser automation in `tests/adversarial_playwright_e2e.mjs`. It is partitioned into four distinct tiers:

```
┌────────────────────────────────────────────────────────────────────────┐
│                   TIER 1: FEATURE COVERAGE (550 URLs)                 │
│  - Enumerate 100% of sitemap URLs from tests/sitemap_manifest.json     │
│  - Physical file existence (<slug>.html or blog-details/<slug>.html)   │
│  - File payload threshold (> 2,048 bytes non-empty content)            │
│  - HTML5 structural validity (<!DOCTYPE html>, <html>, <head>, <body>) │
└──────────────────────────────────┬─────────────────────────────────────┘
                                   │
┌──────────────────────────────────▼─────────────────────────────────────┐
│                 TIER 2: BOUNDARY & CORNER CASES                        │
│  - 10 PascalCase / Uppercase slugs (/Anatomy-of-the-Knee/, etc.)       │
│  - 4 Legacy typo slugs (/challanging-cases/, /arthoscopy-in-jaipur/..) │
│  - Core sitemap aliases (aboutus.html, knee-treatment.html, etc.)      │
│  - Root-relative asset paths (/css/..., /js/...) across root & nested  │
│  - Image fallback onerror attributes on 100% of <img> tags             │
└──────────────────────────────────┬─────────────────────────────────────┘
                                   │
┌──────────────────────────────────▼─────────────────────────────────────┐
│             TIER 3: CROSS-FEATURE COMBINATIONS (AOSIH DESIGN)          │
│  - Sticky Header (.sh2) with 8 canonical navigation links + CTA        │
│  - Mobile Navigation Drawer (.mm) presence                             │
│  - Floating Consultation Badges (.fw2 WhatsApp, .fc3 Call, .float-cta) │
│  - Modern interactive classes (.card-tilt-3d, .card-sheen, ripple btn)│
│  - Accessible expanding FAQ accordions (.faq-item-card, <details>)     │
└──────────────────────────────────┬─────────────────────────────────────┘
                                   │
┌──────────────────────────────────▼─────────────────────────────────────┐
│             TIER 4: REAL-WORLD WORKLOADS & SEARCH STANDARDS            │
│  - Schema.org JSON-LD syntax & @graph integrity across all pages       │
│  - Required schema types: MedicalWebPage, BlogPosting, FAQPage, etc.   │
│  - Google FAQPage 1:1 Policy: Synchronous match between JSON-LD & DOM  │
│  - Verified hospital branding (Dr. Naveen Sharma, AIIMS, Sodala P95)   │
│  - Headless Playwright audit: 1440px / 375px, 0 errors, 0 overflow     │
└────────────────────────────────────────────────────────────────────────┘
```

---

### 3. Detailed Tier Specifications & Verification Invariants

#### Tier 1: Feature Coverage (Slug Existence & Payload Integrity)
- **Authoritative Dataset**: `tests/sitemap_manifest.json` containing all 550 URLs.
- **Path Resolution Matrix**:
  - Root: `/` -> `index.html`
  - Blog Details: `/blog-details/<slug>/` -> `blog-details/<slug>.html` (or `blog-details/<slug>/index.html`)
  - Secondary Core & Aliases: `/aboutus/` -> `aboutus.html`, `/blogs/` -> `blogs.html` (or `blogs/index.html`), `/knee-treatment/` -> `knee-treatment.html`
  - City & Regional Pages: `/<slug>/` -> `<slug>.html` (or `<slug>/index.html`)
- **Thresholds**:
  - File Size: Must be strictly > 2,048 bytes (guarantees substantive medical content, not empty shells).
  - HTML5 Document Integrity: Must contain case-insensitive `<!doctype html>`, `<html`, `<head`, and `<body`.

#### Tier 2: Boundary & Corner Cases (Slug Compatibility & Assets)
1. **PascalCase / Uppercase Slugs (10 Slugs)**:
   - `/Anatomy-of-the-Knee/` -> `Anatomy-of-the-Knee.html`
   - `/Indications-for-Knee-Arthroscopy/` -> `Indications-for-Knee-Arthroscopy.html`
   - `/Meniscal-Tears/` -> `Meniscal-Tears.html`
   - `/Cartilage-Injuries/` -> `Cartilage-Injuries.html`
   - `/Anterior-Cruciate-Ligament-Tears/` -> `Anterior-Cruciate-Ligament-Tears.html`
   - `/Shoulder-arthoscopy-in-jaipur/` -> `Shoulder-arthoscopy-in-jaipur.html`
   - `/Sitemap/` -> `Sitemap.html`
   - `/Press-Release/` -> `Press-Release.html`
   - `/Know-your-surgeon/` -> `Know-your-surgeon.html`
   - `/Arthroscopic-bankart-repair/` -> `Arthroscopic-bankart-repair.html`
   - *Requirement*: Files must match the exact case on disk to prevent case-sensitive Linux/Vercel edge 404s.
2. **Legacy Typo Slugs (4 Slugs)**:
   - `/challanging-cases/` (spelled with 'a' in challanging)
   - `/arthoscopy-in-jaipur/` (missing 'r' in arthoscopy)
   - `/rutator-cuff/` (spelled with 'u' in rutator)
   - `/lattarjet-link/` (spelled with double 't' in lattarjet)
   - *Requirement*: Preserved verbatim to avoid breaking existing backlinks and indexed search traffic.
3. **Core Sitemap Aliases (7 Slugs)**:
   - `aboutus.html` (for `/aboutus/`)
   - `knee-treatment.html` (for `/knee-treatment/`)
   - `hip-treatment.html` (for `/hip-treatment/`)
   - `shoulder-pain-treatment.html` (for `/shoulder-pain-treatment/`)
   - `invitation-for-fellowship.html` (for `/invitation-for-fellowship/`)
   - `contactus.html` (for `/contactus/`)
   - `404.html` (for `/404/`)
4. **Root-Relative Asset Paths**:
   - Every `<link rel="stylesheet">` and `<script src="...">` must use root-relative paths starting with `/` (e.g., `/css/style.css`, `/css/liquid-motion.css`, `/js/liquid-motion.js`).
   - Relative paths such as `href="css/style.css"` are forbidden because they fail in nested directories like `/blog-details/<slug>.html`.
5. **Image Error Handling**:
   - 100% of `<img>` tags must include an `onerror` attribute providing an authentic fallback image (e.g. `this.onerror=null;this.src='/images/hospital_facade_modern.jpg';`).

#### Tier 3: Cross-Feature Combinations (AOSIH Design System)
1. **Canonical Header (`.sh2`)**:
   - Must be present with sticky positioning.
   - Must contain the 8 canonical navigation links (`Home`, `About`, `Knee`, `Hip`, `Shoulder`, `Testimonials`, `Fellowship`, `Contact`).
   - Must contain a prominent Consultation CTA button.
2. **Mobile Navigation Drawer (`.mm`)**:
   - Must be present in the DOM before `</body>` to ensure mobile accessibility.
3. **Floating Consultation Badges**:
   - WhatsApp badge (`.fw2` or `.float-cta`) with `https://wa.me/918290688810` or direct messaging handler.
   - Call badge (`.fc3` or `.float-cta`) with `tel:+918290688810`.
4. **Liquid Motion & 3D Tilt Integration**:
   - Cards and content sections must incorporate `.card-tilt-3d` or `.card-sheen` classes.
   - Buttons must include `.btn`, `.btn-liquid`, or `.nb` ripple classes.
5. **Accessible FAQ Accordions**:
   - FAQ containers must provide structured expandable cards (`.faq-item-card`) using native `<details>`/`<summary>` or interactive accessible button triggers (`.faq-btn`).

#### Tier 4: Real-World Workloads & Search Standards
1. **Schema.org JSON-LD Syntactic & Graph Integrity**:
   - Must contain at least one `<script type="application/ld+json">` block.
   - 100% valid JSON parseable by `json.loads` without exception.
   - `@context` must be `https://schema.org` or `http://schema.org`.
   - Appropriate schema types present: `MedicalWebPage`, `BlogPosting`, `MedicalProcedure`, `FAQPage`, `BreadcrumbList`, `Hospital`, `Physician`, `MedicalClinic`.
2. **Google FAQPage 1:1 Synchronous Verification**:
   - Every question declared in `FAQPage.mainEntity` must have an exact verbatim string match in a visible HTML accordion question (`summary` or `.faq-btn span`).
   - Prevents Google Search Console manual actions or rich-snippet disqualification.
3. **Hospital Authority Branding**:
   - Every page must cite core institutional signals:
     * Dr. Naveen Sharma (MS Ortho KEM Mumbai, Ex-AIIMS New Delhi)
     * Advance Orthopedic & Sports Injury Hospital (AOSIH)
     * Sodala Metro Pillar 95, New Sanganer Road, Jaipur
     * Contact: +91 82906 88810 / OPD 11 AM - 7 PM
4. **Headless Browser Responsive Verification (Playwright)**:
   - Desktop audit at 1440x900 viewport.
   - Mobile audit at 375x667 viewport.
   - Zero uncaught JavaScript runtime exceptions (`page.on('pageerror')`).
   - Zero horizontal document overflow (`document.documentElement.scrollWidth <= window.innerWidth`).

---

### 4. Pass / Fail Semantics & Thresholds

| Metric | Target / Threshold | Pass Condition | Fail Condition |
|---|---|---|---|
| **Sitemap URL Coverage** | 550 / 550 (100%) | All 550 manifest entries resolve to valid HTML files | Any missing slug (404) |
| **Minimum Page Size** | > 2,048 Bytes | 100% of files exceed 2KB | File size <= 2,048 Bytes |
| **HTML5 Document Structure** | 100% | Contains `<!doctype html>`, `<html>`, `<head>`, `<body>` | Missing core tags |
| **PascalCase Slug Matching** | 10 / 10 (100%) | Slugs match exact casing on disk | Casing mismatch / missing |
| **Legacy Typo Slugs** | 4 / 4 (100%) | Typo slugs exist verbatim | Typo slug missing |
| **Core Sitemap Aliases** | 7 / 7 (100%) | All 7 core aliases exist | Missing alias |
| **Root-Relative Assets** | 100% | All stylesheet & script links begin with `/` | Any relative path like `css/style.css` in subfolder |
| **Image Fallback Handlers** | 100% of `<img>` | Every `<img>` has `onerror` attribute | Any `<img>` missing `onerror` |
| **Header Navigation Items** | 8 items + CTA | Header has all 8 links and CTA | Header missing or links clipped |
| **Mobile Drawer** | 100% of pages | `.mm` drawer present | Missing `.mm` drawer |
| **Floating Badges** | 100% of pages | Floating WhatsApp & Call badges present | Missing badges |
| **JSON-LD Validity** | 100% | 0 JSON syntax errors | JSON parse exception |
| **Google FAQ 1:1 Match** | 100% | Every JSON-LD FAQ question matches visible DOM text | Unmatched or phantom question |
| **Playwright Console Errors** | 0 | Zero uncaught runtime errors in browser | >= 1 console error |
| **Horizontal Overflow** | 0 px | `scrollWidth <= clientWidth` on 1440px & 375px | Horizontal scrollbar detected |

---

### 5. Test Suite Execution Guide

The test runner supports both standard Python `unittest` execution and a specialized CLI mode with formatted reports and tier filtering.

#### 5.1 Quick Commands

```powershell
# 1. Run full 4-tier E2E test suite
python tests/test_550_sitemap_suite.py

# 2. Run via Python unittest module
python -m unittest tests/test_550_sitemap_suite.py

# 3. Run individual tiers
python tests/test_550_sitemap_suite.py --tier 1   # Tier 1: Feature Coverage (550 Slugs)
python tests/test_550_sitemap_suite.py --tier 2   # Tier 2: Boundary & Corner Cases
python tests/test_550_sitemap_suite.py --tier 3   # Tier 3: Cross-Feature Design System
python tests/test_550_sitemap_suite.py --tier 4   # Tier 4: Search & Real-World Standards

# 4. Run Playwright Browser Automation
node tests/smoke_test.mjs
node tests/adversarial_playwright_e2e.mjs
```

#### 5.2 CI/CD Quality Gates
Before deployment to Vercel, the release pipeline must verify:
1. `python tests/test_550_sitemap_suite.py` exits with status `0`.
2. `node tests/smoke_test.mjs` exits with status `0`.
3. Zero unresolved implementation defects.
