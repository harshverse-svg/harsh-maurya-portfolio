# Design & Architectural Critique: Baseline Audit

**Target:** `https://harshverse-svg.github.io/harsh-maurya-portfolio/`  
**Date:** 2026-11-01  
**Auditor Frameworks:** Hallmark UI Craft (16 Invariants), Impeccable Design Standard, TasteSkill v2  

---

## 1. Executive Summary

The current portfolio establishes an ambitious "architecture-first" aesthetic with dark backgrounds and cyan accents. However, it suffers from several pervasive **"AI template tells"**, technical accessibility failures, missing landmarks, unverified buzzwords, and structural layout bloat (such as 7 full-width certificate cards dominating the viewport). 

Resolving these issues in Phase 3 while elevating typography, contrast, authentic proof, and motion will transform this from a generic developer template into a world-class, human-crafted engineering showcase.

---

## 2. Hallmark 16 Floor Invariants Audit

| Invariant | Status | Findings & Exact Line Citations |
| :--- | :---: | :--- |
| **1. Strict Token Isolation** | ❌ FAIL | Hardcoded colors throughout `css/style.css`: `#111` (line 352), `#ff0000` (line 361), `#f0f0f0` (line 664), `rgba(0,0,0,0.5)` (line 633). Must route 100% through `:root`. |
| **2. Transition Discipline** | ❌ FAIL | Frequent use of `transition: all` in `css/style.css` (lines 193, 402, 608). Transitions must target only `transform` and `opacity`. |
| **3. No Mixed Headings** | ⚠️ PASS | Headings currently avoid mixed italic/roman styles. |
| **4. Clean Viewport Clipping** | ❌ FAIL | Uses `overflow-x: hidden;` on `body` (line 32) instead of `overflow-x: clip;` on both `html` and `body`. |
| **5. Robust Grid Tracks** | ⚠️ WARN | `.cert-grid` and `.bento-grid` do not consistently use `minmax(0, 1fr)`, leading to horizontal spill risk on narrow viewports. |
| **6. Accessible Focus** | ❌ FAIL | Page declares `cursor: none;` on body and `a { cursor: none; }` without visible `:focus-visible` styling. Completely unusable for keyboard navigation. |
| **7. Reduced Motion** | ❌ FAIL | Zero `@media (prefers-reduced-motion: reduce)` rules exist in `animations.css` or `style.css`. VanillaTilt and scroll transforms fire unconditionally. |
| **8. No Fabricated / Unproven Proof** | ❌ FAIL | GraphRAG claims *"significant reduction in hallucinations"* and *"higher accuracy"* with zero benchmark datasets, measurements, or citations. |
| **9. No Eyebrow Kickers** | ❌ FAIL | Pervasive across all sections: `<p class="section-mono">// Architecture & Infrastructure</p>`, `<p class="section-mono">// Research & Explorations</p>`, `<p class="section-mono">// Verified Skills & Training</p>`. Hallmark rule 9 strictly forbids eyebrow kicker labels. |
| **10. Clean Metadata Formatting** | ⚠️ WARN | Vertical bars and middle characters in headings (`HM.`, `Swast-.link- \| Virtual Queue`). |
| **11. Anti-Trope Palette** | ❌ FAIL | Generic gray-900 `#121212` with neon `#00f0ff` glow. Stereotypical "AI cyberpunk" aesthetic without authentic editorial depth. |
| **12. Hero Compactness** | ❌ FAIL | Hero elements (avatar, typewriter, subtitle, actions) push content past standard laptop viewports (1280×800) and cause Cumulative Layout Shift (CLS 0.113). |
| **13. Strict Copy Brevity** | ⚠️ WARN | Project pitch copy is moderately verbose without clear Problem ➔ Decision ➔ Result punchiness. |
| **14. Centered & Capped Measure**| ⚠️ PASS | Container is capped at `max-width: 1200px`. |
| **15. Signature Element** | ❌ FAIL | First screen has no live interactive or domain-specific signature element—only static text and an image. |
| **16. Live Data Fidelity** | ❌ FAIL | GraphRAG button shows *"Not Available (Local Hardware)"*, leaving the visitor with an empty dead-end. |

---

## 3. Impeccable Design Review & Heuristics

1. **Hierarchy & Typesetting**:
   - Skips heading levels (e.g. `<h2>` jumping straight to `<h4>` in certificates and media gallery), triggering accessibility failures in Lighthouse.
   - Type scale lacks fluid typography (`clamp()`), making mobile typography appear disjointed.
2. **Card Nesting & Outlines**:
   - Heavy reliance on 1px translucent borders (`1px solid var(--glass-border)`) on virtually every container. Hallmark and Impeccable require structure through tone steps, spacing, and surface fills rather than endless hairline boxes.
3. **Interactive & Operational States**:
   - Missing `:focus-visible` states across navigation, buttons, and links.
   - Disabled button (`.btn-disabled`) provides no actionable fallback or video demo.
4. **UX Copy & Content Integrity**:
   - Typo in project name: `"Swast-.link-"` should be `"SwasthLink"`.
   - Navigation item `"Skills"` links to anchor `#lab`, but the target section is titled `"Advanced Skills"`.
   - Contact grid exposes a personal phone number in plain text (scraping/spam risk).

---

## 4. TasteSkill Visual Critique: Generic AI Tells

1. **Predictable Cliché Palette**:
   - The dark charcoal surface (`#121212`) combined with glowing electric cyan (`#00f0ff`) is one of the most common default palettes produced by LLMs.
2. **Generic Bento Grid & Vague Lab Tiles**:
   - Standard Bento grid with generic icons (Python, C, HTML logos in rounded rectangles).
   - "Intelligence Basics" and "Intelligence Systems" cards use vague filler descriptions rather than concrete domain achievements.
3. **Certificate Overload**:
   - 7 introductory certificates from Coursera/Google occupy a massive section of the page, signaling a junior profile rather than a confident "Digital Architect". These should be condensed into a compact verified credential ribbon.
4. **Third-Party Bloat**:
   - The raw YouTube iframe injects third-party cookies, tracking scripts, and triggers configuration errors when viewed from local contexts. It needs a lightweight facade or custom video player.
5. **Footer Dead Links**:
   - Footer social links (`GitHub`, `LinkedIn`) point to placeholder `href="#"`.

---

## 5. Prioritized Fix List for Phase 3

- [ ] **Fix 1:** Implement strict `:root` design token architecture in `DESIGN.md` (no raw hex/rgb in selectors).
- [ ] **Fix 2:** Fix typography hierarchy (`<h1>` ➔ `<h2>` ➔ `<h3>`), add `<main>` landmark, and remove eyebrow kickers.
- [ ] **Fix 3:** Add instantaneous, high-contrast `:focus-visible` styling and restore native keyboard navigation.
- [ ] **Fix 4:** Enforce `@media (prefers-reduced-motion: reduce)` across all animations and transitions.
- [ ] **Fix 5:** Replace plain-text phone number with an obfuscated/contact endpoint.
- [ ] **Fix 6:** Fix `"Swast-.link-"` typo to `"SwasthLink"` and align nav labels (`#lab` ➔ "Skills").
- [ ] **Fix 7:** Replace dead GraphRAG button with an interactive results dashboard or video walkthrough.
- [ ] **Fix 8:** Condense the 7 certificates into a compact credentials strip.
- [ ] **Fix 9:** Provide real GitHub, LinkedIn, and YouTube URLs in the footer.
- [ ] **Fix 10:** Add meta description, OG tags, and valid structured data.
