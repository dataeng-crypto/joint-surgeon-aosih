# TEST_READY.md: E2E Test Suite Readiness & Execution Matrix
## Advance Orthopedic & Sports Injury Hospital (AOSIH) — 550 Sitemap URL Expansion

---

### 1. Test Suite Status & Architecture Overview

The opaque-box E2E test suite for the **550 Sitemap URL Expansion** (`https://jointsurgeon.in/sitemap.xml`) has been designed, implemented, and verified on the live workspace.

- **Primary Test Runner**: `tests/test_550_sitemap_suite.py`
- **Headless Browser Runner**: `tests/playwright_audit_runner.mjs` (Playwright 1.60.0 / Chromium)
- **Test Infrastructure Documentation**: `TEST_INFRA.md`
- **Authoritative Dataset**: `tests/sitemap_manifest.json` (550 URLs)
- **Total Test Methods**: 19 tests across 4 tiers (+ 571 parameterized subtests)

---

### 2. Execution Commands Matrix

#### 2.1 Complete Test Suite Execution
```powershell
# Run the complete 4-tier E2E test suite (generates ASCII summary table & metrics)
python tests/test_550_sitemap_suite.py

# Run via standard Python unittest runner
python -m unittest tests/test_550_sitemap_suite.py
```

#### 2.2 Tier-Specific Execution Commands
```powershell
# Tier 1: Feature Coverage (550 Slugs Existence, Size >2KB, HTML5 Structure)
python tests/test_550_sitemap_suite.py --tier 1

# Tier 2: Boundary & Corner Cases (10 PascalCase, 4 Typos, 7 Aliases, Assets, Onerror)
python tests/test_550_sitemap_suite.py --tier 2

# Tier 3: Cross-Feature Combinations (Sticky Header .sh2, Drawer .mm, Badges, 3D Tilt, FAQs)
python tests/test_550_sitemap_suite.py --tier 3

# Tier 4: Search Standards & Browser Audit (JSON-LD, FAQ 1:1 Match, Playwright Headless)
python tests/test_550_sitemap_suite.py --tier 4
```

#### 2.3 Standalone Playwright Browser Automation
```powershell
# Run headless browser audit on all available pages across Desktop (1440px) & Mobile (375px)
node tests/playwright_audit_runner.mjs

# Audit specific generated pages
node tests/playwright_audit_runner.mjs --pages index.html,about.html,testimonials.html

# Run existing smoke test
node tests/smoke_test.mjs
```

---

### 3. Tier Breakdown & Test Inventory

| Tier | Test Class | Test Method | Scope & Assertion | Test Type |
|---|---|---|---|---|
| **Tier 1** | `Tier1FeatureCoverageTests` | `test_01_manifest_contains_550_entries` | Asserts exact 550 entries in `sitemap_manifest.json` | Integrity |
| **Tier 1** | `Tier1FeatureCoverageTests` | `test_02_all_550_slugs_physical_existence` | 550 subtests verifying physical file existence on disk | Coverage |
| **Tier 1** | `Tier1FeatureCoverageTests` | `test_03_existing_pages_minimum_payload_size` | Asserts file size > 2,048 bytes (non-empty substantive pages) | Content |
| **Tier 1** | `Tier1FeatureCoverageTests` | `test_04_existing_pages_html5_structure` | Asserts `<!doctype html>`, `<html>`, `<head>`, `<body>` | Syntax |
| **Tier 2** | `Tier2BoundaryAndCornerCaseTests` | `test_01_ten_pascal_case_slugs_casing_integrity` | 10 subtests: exact disk casing matching on Linux/Vercel | Edge Case |
| **Tier 2** | `Tier2BoundaryAndCornerCaseTests` | `test_02_four_legacy_typo_slugs_verbatim` | 4 subtests: `/challanging-cases/`, `/arthoscopy-in-jaipur/` etc. | Edge Case |
| **Tier 2** | `Tier2BoundaryAndCornerCaseTests` | `test_03_core_sitemap_aliases_existence` | 7 subtests: `aboutus.html`, `knee-treatment.html`, `contactus.html`.. | Routing |
| **Tier 2** | `Tier2BoundaryAndCornerCaseTests` | `test_04_root_relative_asset_paths` | Verifies root-relative paths (`/css/...`, `/js/...`) across pages | Asset |
| **Tier 2** | `Tier2BoundaryAndCornerCaseTests` | `test_05_image_onerror_fallback_handlers` | Verifies 100% of `<img>` tags have `onerror` fallback handlers | Resilience |
| **Tier 3** | `Tier3CrossFeatureCombinationTests` | `test_01_sticky_header_sh2_and_canonical_nav_items` | Sticky header `.sh2`, 8 canonical nav items, Consultation CTA | Layout |
| **Tier 3** | `Tier3CrossFeatureCombinationTests` | `test_02_mobile_navigation_drawer_mm` | Mobile drawer `.mm` present before `</body>` | Mobile |
| **Tier 3** | `Tier3CrossFeatureCombinationTests` | `test_03_floating_consultation_badges` | Floating WhatsApp (`.fw2`) and Call (`.fc3`) badges present | Conversion |
| **Tier 3** | `Tier3CrossFeatureCombinationTests` | `test_04_universal_3d_tilt_and_liquid_button_classes` | `.card-tilt-3d`, `.card-sheen`, liquid ripple button classes | Animation |
| **Tier 3** | `Tier3CrossFeatureCombinationTests` | `test_05_expanding_faq_accordions` | `.faq-item-card` accordions with triggers (<details> / .faq-btn) | UX |
| **Tier 4** | `Tier4RealWorldWorkloadsAndSearchTests` | `test_01_schema_org_json_ld_validity` | 100% valid JSON parse, valid `@context`, structured `@graph` | SEO / AEO |
| **Tier 4** | `Tier4RealWorldWorkloadsAndSearchTests` | `test_02_schema_org_types_presence` | Hospital, Physician, FAQPage, BreadcrumbList type coverage | SEO |
| **Tier 4** | `Tier4RealWorldWorkloadsAndSearchTests` | `test_03_google_faq_policy_one_to_one_match` | Verbatim 1:1 match between JSON-LD FAQ and visible DOM accordions | Search Policy |
| **Tier 4** | `Tier4RealWorldWorkloadsAndSearchTests` | `test_04_hospital_branding_and_trust_signals` | Dr. Naveen Sharma, AIIMS/KEM, Sodala Pillar 95 Jaipur | Trust / GEO |
| **Tier 4** | `Tier4RealWorldWorkloadsAndSearchTests` | `test_05_playwright_headless_responsive_audit` | Desktop (1440px) & Mobile (375px): 0 console errors, 0 overflow | Responsive |

---

### 4. Baseline Metrics Summary (Pre-Generation State)

An initial baseline run was executed on 2026-09-11 against the current repository state:

```
==============================================================================
 ADVANCE ORTHOPEDIC & SPORTS INJURY HOSPITAL (AOSIH) — E2E TEST RUNNER
 Target Directory: C:\Users\Abhisar Sharma\Documents\Joint Surgeon
 Manifest Total URLs: 550 | Total HTML Files on Disk: 8
==============================================================================
 E2E METRICS SUMMARY TABLE
==============================================================================
 Metric / Invariant                            | Value / Ratio   | Status    
------------------------------------------------------------------------------
 Tier 1: Sitemap Slug Coverage (550 Target)    | 2/550 (0.4%)    | BASELINE  
 Tier 2: PascalCase Slug Exact Casing          | 0/10            | BASELINE  
 Tier 2: Legacy Typo Verbatim Slugs            | 0/4             | BASELINE  
 Tier 2: Core Sitemap Aliases (aboutus.html..) | 0/7             | BASELINE  
 Tier 3: AOSIH Modern Design & Liquid Motion   | 8 pages         | PASS      
 Tier 4: Schema.org & Playwright Browser Audit | 16 viewports    | PASS      
------------------------------------------------------------------------------
```

#### Key Baseline Findings:
1. **Existing Pages Health**: All 8 existing core pages (`index.html`, `about.html`, `knee-arthroscopy.html`, `hip-replacement.html`, `shoulder-surgery.html`, `testimonials.html`, `fellowship.html`, `contact.html`) pass **100% of Tier 3 and Tier 4 requirements** (0 console errors across 16 Playwright viewports, 0 horizontal overflow, 100% valid Schema.org, 100% 1:1 FAQ accordion match, 100% image onerror handlers).
2. **Sitemap Verbatim File Baseline**: Exactly 2 files on disk currently match the raw URLs in `sitemap.xml` verbatim: `index.html` (`/`) and `testimonials.html` (`/testimonials/`). The remaining 6 core pages are named with canonical paths (`about.html` instead of `aboutus.html`, etc.).
3. **Downstream Targets**:
   - Milestone M2 will generate the remaining 542 pages (including the 7 core aliases, 4 secondary core pages, 395 city pages, and 143 blog/clinical articles).
   - Once M2 completes, re-running `python tests/test_550_sitemap_suite.py` is expected to transition Tier 1 and Tier 2 from `BASELINE` to `PASS` with 19/19 passing tests.
