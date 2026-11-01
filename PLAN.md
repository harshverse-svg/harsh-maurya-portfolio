# Portfolio Redesign Plan: Harsh Maurya | Digital Architect

**Site:** https://harshverse-svg.github.io/harsh-maurya-portfolio/
**Stack:** Static HTML/CSS/JS on GitHub Pages (no framework migration unless stated)

## Ground Rules for the Agent

1. Work on a branch named `redesign`. Never commit directly to `main`.
2. Complete phases in order. After each phase, **stop** and show: before/after screenshots (mobile 390px, tablet 768px, desktop 1440px), Lighthouse scores, and a short summary of changes.
3. Preserve existing anchors, links, and wiring. Redesign must be non-destructive.
4. Performance budget (hard limits):
   - LCP < 2.5s on simulated mid-range mobile over 4G
   - CLS < 0.1
   - Total JS < 200 KB gzipped (excluding lazy-loaded 3D)
   - Hero image/video < 300 KB
   - Heavy visuals (3D, video) load only when visible, with static fallbacks
5. Respect `prefers-reduced-motion` everywhere.
6. Keep the terminal/"sys" identity (`sys.init`, `// Section` labels). Refine it, do not replace it.
7. Do not invent facts, metrics, or credentials. Every number published must come from a real measurement.
8. If a skill is missing or fails, report it instead of improvising. See "Missing Skills" at the end.

---

## Known Issues (fix in Phase 3)

- [ ] Project title typo: "Swast-.link-" should be "SwasthLink" (also consider renaming the repo and updating links)
- [ ] Footer social icons link to `#`; replace with real GitHub, LinkedIn, YouTube links or remove
- [ ] Email and phone shown in plain text; remove the phone, obfuscate the email or use a contact link
- [ ] Nav label "Skills" points to `#lab`, whose section is titled "Advanced Skills"; make them consistent
- [ ] GraphRAG claims ("significant reduction in hallucinations") have no numbers
- [ ] GraphRAG demo shows "Not Available (Local Hardware)"
- [ ] Seven intro-level certificates occupy a full section
- [ ] "Intelligence Basics" and "Intelligence Systems" cards are vague
- [ ] "Floquet Engineering" and "Muon Tomography" are listed with no supporting evidence
- [ ] Core Technical Stack tiles have no context (what was built with each)

---

## Phase 0: Baseline and Safety

**Skills:** `hallmark`, `impeccable`, `taste-skill`

- [ ] Create `redesign` branch
- [ ] Screenshot every section at 390px, 768px, 1440px into `/audit/before/`
- [ ] Run Lighthouse (mobile and desktop) and save scores to `/audit/baseline.json`
- [ ] Run `hallmark` and `impeccable` critique on the current page; save findings to `/audit/critique.md`
- [ ] Run `taste-skill` real-browser visual critique; list what looks generic or templated

**Done when:** baseline scores and critique files exist and the list of problems is confirmed with the owner.

---

## Phase 1: Positioning and Content

**Skills:** `ai-job-search`, `literature-search-arxiv`, `literature-search-openalex`

- [ ] Ask the owner for target roles (internships, research labs, startups, freelance)
- [ ] Use `ai-job-search` JD evaluation on 5 to 10 real postings; extract recurring keywords and proof points into `/content/target-roles.md`
- [ ] Rewrite hero headline and subheading to match the target (keep "Study. Code. Architect. Deploy." only if it still fits)
- [ ] Rewrite each project as: **Problem, Decision, Result** (3 to 4 sentences, no filler)
- [ ] Rewrite "Advanced Skills" cards with concrete content: what was learned, built, or measured
- [ ] Use arXiv/OpenAlex to find 2 to 3 real papers or surveys per research interest (neuromorphic computing, Floquet engineering, muon tomography); write a short honest "Currently reading and why" section with links
- [ ] Align the resume PDF (use `ai-job-search` ATS/LaTeX CV tailoring) so site and resume say the same thing

**Done when:** all copy is in `/content/` as markdown, reviewed by the owner, with no unverifiable claims.

---

## Phase 2: Design Direction

**Skills:** `taste-skill`, `awesome-design-md`, `hallmark`, `impeccable`

- [ ] Use `taste-skill` to shortlist 3 design directions suited to a dark, technical, terminal-flavored portfolio; present them to the owner and get one chosen
- [ ] Use `awesome-design-md` to study 2 to 3 reference systems (for example Linear, Vercel, Cursor) for spacing, hierarchy, and card patterns
- [ ] Write `DESIGN.md`: palette (with contrast ratios), type pairing and scale, spacing scale, radii, elevation, component rules, motion principles
- [ ] Choose a `hallmark` macrostructure archetype for page flow and list which Floor invariants apply
- [ ] Define the section order (suggested): Hero, Proof (key metrics or featured result), Projects, Research and Learning, Stack, Credentials (compact), Creative/Media, How I Work, Contact

**Done when:** `DESIGN.md` is approved by the owner. All later phases follow it.

---

## Phase 3: Non-Destructive Rebuild

**Skills:** `hallmark` (redesign), `impeccable` (`typeset`, `polish`, `harden`, `quieter`/`bolder`)

- [ ] Implement design tokens as CSS variables from `DESIGN.md`
- [ ] Redesign each section, preserving anchors and links
- [ ] Apply `typeset` for the type scale and `polish` for spacing and alignment
- [ ] Apply `harden`: long text, missing images, very small screens, slow connections, no-JS fallback
- [ ] Fix every item in "Known Issues" above
- [ ] Collapse certificates into a compact credentials strip with a verification link for each
- [ ] Order projects: SwasthLink, GraphRAG, then Stone Paper Scissor (demoted)
- [ ] Add alt text to every image and a visible keyboard focus style to every interactive element

**Done when:** the site matches `DESIGN.md` at all three breakpoints and all Known Issues are checked off.

---

## Phase 4: Motion

**Skills:** `modern-web-motion`

- [ ] Add Lenis smooth scroll with the unified GSAP ScrollTrigger ticker
- [ ] Hero reveal (staggered text, under 1.2s total)
- [ ] Section entrance transitions (subtle, once per section)
- [ ] Project card hover and focus states
- [ ] Scroll progress indicator (optional)
- [ ] Disable or reduce all motion under `prefers-reduced-motion`
- [ ] Verify no layout shift and that scroll stays smooth on a throttled CPU (4x slowdown)

**Do not:** migrate to React just for Framer Motion. Stay with GSAP and CSS.

**Done when:** motion feels intentional, performance budget still holds, reduced-motion mode works.

---

## Phase 5: Signature Visuals (Optional, Use Sparingly)

**Skills:** `img2threejs`, `open-higgsfield-ai`

- [ ] `img2threejs`: build one lightweight procedural 3D hero element tied to the identity (for example a neural-graph motif for GraphRAG, or a stylized "HM" mark). Lazy-load it, cap pixel ratio, pause when off-screen, and provide a static SVG/PNG fallback for low-end devices
- [ ] `open-higgsfield-ai`: generate at most 1 to 2 short loops or project thumbnails; compress to WebM/MP4 under budget with a poster image
- [ ] Reject any visual that looks like generic AI stock art

**Done when:** visuals add meaning, load lazily, and the page still meets the performance budget with them disabled and enabled.

---

## Phase 6: Make the Projects Prove Themselves

**Skills:** `ml-best-practices`, `notebook-guidance`, `building-data-apps`, `generative_ui`, `reverse-engineering-interoperability` (OpenAPI only), `managing-python-dependencies`

### GraphRAG
- [ ] Define a fixed evaluation set (for example 30 to 50 questions over a fixed document set) with ground-truth answers
- [ ] Compare plain RAG versus GraphRAG across Qwen2.5 and Gemma on: answer accuracy, hallucination rate (define it precisely), and latency
- [ ] Record methodology, hardware, and limitations honestly in a notebook (`notebook-guidance`)
- [ ] Build a static interactive results dashboard from the saved results (`building-data-apps` / `generative_ui`)
- [ ] Record a 60 to 90 second screen walkthrough to replace "Demo Not Available"
- [ ] Update the case study with the real numbers

### SwasthLink
- [ ] Write an OpenAPI spec for the main flows (registration, profile fetch, queue, payment simulation)
- [ ] Add a clear note that ABDM and UPI integrations are simulated
- [ ] Add architecture diagram to the case study

### All repos
- [ ] Clean README: what it is, screenshot, how to run, tech used, limitations
- [ ] `requirements.txt` or lockfile, virtual-environment setup instructions

**Done when:** every claim on the site links to evidence, and each project has a README, a visual, and a way to see it working.

---

## Phase 7: Security Hygiene

**Skills:** `secure-code-engineering`, `security-audit`

- [ ] Harden GitHub Actions workflows: pin actions to commit SHAs, minimal `permissions`, no secrets in logs
- [ ] Run `secure-code-engineering` checks on the Python repos (input handling, dependency issues)
- [ ] Run `security-audit` on SwasthLink; document findings and fixes
- [ ] Add a Content Security Policy via meta tag where feasible, and `rel="noopener noreferrer"` on external links
- [ ] Confirm no personal data, tokens, or keys exist in any repo history

**Done when:** audit findings are resolved or documented, and no sensitive data is exposed.

---

## Phase 8: Automation

**Skills:** `automation`, `plugin`, `skill-repair` (only if needed)

- [ ] Schedule a weekly job: broken-link check plus Lighthouse run, with results saved to `/audit/weekly/`
- [ ] Optional: package the workflow as a reusable plugin via `plugin`

**Done when:** the scheduled job runs successfully once and produces a report.

---

## Phase 9: Ship

- [ ] Open Graph and Twitter card images (1200x630)
- [ ] Title, meta description, canonical URL, favicon set
- [ ] `Person` JSON-LD structured data
- [ ] `sitemap.xml` and `robots.txt`
- [ ] Cross-browser test: Chrome, Safari (iOS), Firefox, Edge
- [ ] Final Lighthouse: **Performance 95+ (mobile), Accessibility 100, Best Practices 100, SEO 100**
- [ ] Keyboard-only walkthrough and screen-reader spot check
- [ ] Compare against baseline and produce `/audit/final-report.md` with before/after screenshots and scores
- [ ] Merge `redesign` to `main` only after owner approval

---

## Skills You Should Not Use for This Project

Firebase suite (unless a contact-form backend is added later), life-sciences and chemistry suite, GCP data-engineering suite, `predictingthepast`. They do not serve this goal.

---

## Missing Skills (Add or Substitute)

| Need | Why | Substitute if unavailable |
|---|---|---|
| Performance / Core Web Vitals auditing | Enforce the performance budget | Lighthouse CLI, Chrome DevTools |
| Accessibility auditing | WCAG compliance, contrast, keyboard navigation | axe-core, Lighthouse accessibility |
| SEO and social metadata | OG images, JSON-LD, sitemap | Manual implementation |
| Browser automation and visual regression | Consistent screenshots across breakpoints | Playwright script |
| Asset optimization | WebP/AVIF images, compressed video | `sharp`, `cwebp`, `ffmpeg` |
| GitHub Pages deployment and CI | Authoring deploy workflows (existing skills only harden them) | Hand-written GitHub Actions |
| Technical case-study writing | Problem, Decision, Result narratives | Owner edits agent drafts |
| Privacy-friendly analytics (optional) | See which sections visitors reach | GoatCounter or Plausible |

---

## Master Kickoff Prompt

> Read PLAN.md and my live portfolio at https://harshverse-svg.github.io/harsh-maurya-portfolio/. Work on a `redesign` branch. Start with Phase 0 only. When finished, show me before screenshots, Lighthouse baselines, and your critique findings, then wait for my approval before starting Phase 1. Follow the Ground Rules strictly, and tell me if any required skill is missing instead of working around it.
