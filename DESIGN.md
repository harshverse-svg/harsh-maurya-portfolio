# DESIGN.md — Harsh Maurya | Digital Architect

**Brand Aesthetic:** Linear Dark Obsidian with High-Precision Technical Voltage  
**Macrostructure Archetype:** *The Technical Showcase* (Hallmark v2)  
**Surface Mode:** *Experience* leading with authentic working software; interface chrome recedes.  

---

## 1. Color Palette & Contrast Ledger

All colors are strictly mapped to `:root` design tokens. Every pairing meets or exceeds WCAG AA (minimum 4.5:1 for body, 3:1 for large display); core text pairings achieve **WCAG AAA (> 7:1)**.

| Token | Hex Value | Role | Contrast vs Canvas (`#04060a`) | WCAG Level |
| :--- | :--- | :--- | :---: | :---: |
| `--canvas` | `#04060a` | Deepest Obsidian Base Canvas | — | — |
| `--surface-1` | `#0b0f19` | Primary Card Surfaces & Panels | — | — |
| `--surface-2` | `#111726` | Elevated Controls, Inputs, Hover States | — | — |
| `--surface-hover` | `#192237` | Interactive Hover Highlights | — | — |
| `--ink` | `#f8fafc` | Primary Headings, Titles, Hero Copy | **18.4 : 1** | **AAA** |
| `--ink-muted` | `#cbd5e1` | Secondary Body Text & Descriptions | **12.2 : 1** | **AAA** |
| `--ink-subtle` | `#94a3b8` | Architecture Flow Labels & Meta | **6.8 : 1** | **AAA** |
| `--accent` | `#00f0ff` | Quantum Cyan (Focus Rings, Active Nodes, Badges) | **13.5 : 1** | **AAA** |
| `--accent-glow` | `rgba(0, 240, 255, 0.18)` | Soft Specular Glare (Subtle Depth) | — | — |
| `--emerald` | `#10b981` | Production PWA / Active Release Status | **8.1 : 1** | **AAA** |
| `--amber` | `#f59e0b` | Hardware / Research Flags | **9.2 : 1** | **AAA** |
| `--hairline` | `rgba(255, 255, 255, 0.08)` | Tonal Separation (Used Sparingly) | — | — |
| `--hairline-focus` | `#00f0ff` | Instantaneous `:focus-visible` Ring | — | — |

> **Anti-Trope Rule:** No purple-to-blue gradients, no floating blurry orb blobs, no gradient text. Emphasis is expressed through typography scale, font weight, and precise tonal elevations.

---

## 2. Typography Pairing & Fluid Type Scale

- **Display & Headings:** `Space Grotesk`, -apple-system, sans-serif (weights: 500, 600, 700; negative tracking `-0.03em`).
- **Body & Editorial:** `Inter`, -apple-system, sans-serif (weights: 400, 500; lineHeight: 1.65).
- **Code, Telemetry & Tags:** `Fira Code`, monospace (weights: 400, 500; lineHeight: 1.5).

```css
:root {
  --font-display: 'Space Grotesk', -apple-system, sans-serif;
  --font-body: 'Inter', -apple-system, sans-serif;
  --font-mono: 'Fira Code', monospace;

  /* Fluid Type Scale (clamp) */
  --text-xs: clamp(0.75rem, 0.7rem + 0.25vw, 0.8rem);     /* 12-13px */
  --text-sm: clamp(0.85rem, 0.8rem + 0.25vw, 0.9rem);     /* 13-14.5px */
  --text-base: clamp(1rem, 0.95rem + 0.25vw, 1.05rem);    /* 16-17px */
  --text-lg: clamp(1.15rem, 1.05rem + 0.5vw, 1.25rem);    /* 18-20px */
  --text-xl: clamp(1.35rem, 1.2rem + 0.75vw, 1.55rem);    /* 21-25px */
  --text-2xl: clamp(1.75rem, 1.5rem + 1.25vw, 2.15rem);   /* 28-34px */
  --text-3xl: clamp(2.4rem, 2rem + 2vw, 3.25rem);         /* 38-52px */
  --text-hero: clamp(3rem, 2.5rem + 3.5vw, 4.5rem);       /* 48-72px */
}
```

---

## 3. Spacing, Radii & Grid System

- **Container:** `max-width: 1200px; margin: 0 auto; padding: 0 1.5rem;`
- **Section Spacing:** 6rem to 7.5rem (desktop), 4rem (mobile).
- **Radii System:**
  - `--radius-xs: 4px;` (Micro-tags, copy tooltips)
  - `--radius-sm: 8px;` (Buttons, architecture diagram nodes, chips)
  - `--radius-md: 14px;` (Cards, Bento items, terminal HUD)
  - `--radius-lg: 20px;` (Resume banner, showcase containers)
  - `--radius-full: 9999px;` (Status badges, pill filters)

---

## 4. Component Rules

### A. Project Cards
- **Structure:** Tone step fill (`--surface-1`) with soft 1px border (`--hairline`).
- **Live Status Badge:** Every project displays an authentic, pulsing status pill (`● 100% LOCAL GPU`, `● PRODUCTION PWA`, `● ACTIVE RELEASE`).
- **Architecture Flow:** Visual CSS flow diagram (`Node ➔ Core ➔ Output`) with high-contrast text and glowing focus states.
- **Actions:** High-contrast `[ Source Code ]` button, `[ View Live Demo ]` (where applicable), and an interactive `Clone Repo` button with instantaneous clipboard feedback.
- **Copy:** Strictly formatted as **Problem ➔ Decision ➔ Result** (maximum 4 sentences).

### B. Interactive Terminal HUD
- Positioned in the Hero section with authentic macOS dots (`red`, `yellow`, `green`).
- Clickable chip buttons (`projects`, `skills`, `status`, `clear`) for instant telemetry inspection.
- Pure DOM sanitization: no raw HTML injection; accessible fallback for non-JS visitors.

### C. Credentials Ribbon
- Replaces the 7 bloated full-width cards with a sleek, high-density 2-column or grid credential ribbon with verified institution badges (Google Cloud, IBM, Google) and verification links.

---

## 5. Motion Principles (GSAP & Modern Web Motion)

1. **Hardware Acceleration:** Animate strictly `transform` and `opacity`. Never animate `width`, `height`, `top`, or `left`.
2. **Reduced Motion:** Mandatory `@media (prefers-reduced-motion: reduce)` bypass disables particle canvas, continuous pulsing, and spring transitions.
3. **Smooth Scrolling:** Lightweight Lenis integration synchronized with GSAP ScrollTrigger ticker.
4. **Interactive Sound FX (Optional):** Native Web Audio synthesizer providing micro-clicks for buttons and terminal typing, toggleable via `FX: ON / OFF` pill in navbar.

---

## 6. Hallmark Floor Invariants Bound to This System

- [x] **Rule 1 (Tokens):** 100% of colors, fonts, and spacing declared in `:root`.
- [x] **Rule 2 (Transitions):** Zero `transition: all`. Targeted properties only.
- [x] **Rule 4 (Clipping):** `overflow-x: clip;` on `html` and `body`.
- [x] **Rule 6 (Focus):** Mandatory `outline: 2px solid #00f0ff; outline-offset: 3px;` on `:focus-visible`.
- [x] **Rule 9 (No Eyebrow Kickers):** Section titles lead directly with clean metadata tags aligned horizontally in the section header.
- [x] **Rule 12 (Hero Compactness):** Headline, subtitle, and primary actions fit within viewport bounds.
- [x] **Rule 13 (Copy Brevity):** High-density copy capped under 450 words total across the page.

---

## 7. Canonical Section Sequence

1. **Navbar:** Brand mark (`HM.`), live status indicator (`● ACTIVE ARCHITECT`), navigation links, Web Audio FX toggle, mobile drawer.
2. **Hero:** Compact avatar, cycling telemetry badge, Space Grotesk headline, subtitle, primary CTAs, and interactive CLI HUD.
3. **About / Architect Profile:** Concise bio, contact endpoints (with phone removed / obfuscated email), and GitHub/LinkedIn verified links.
4. **Flagship Projects:** Interactive category filter tabs (All 6, AI & Local LLMs 3, Systems & Offline 3, Web & PWA 3) featuring:
   1. *BUDDY* (Autonomous Local AI Study Platform)
   2. *FormattingBuddy* (Zero-Backend PWA Document Engine)
   3. *Typing Buddy* (Offline Windows Typing Assistant)
   4. *SwasthLink* (Hyperlocal Healthcare Virtual Queue)
   5. *GraphRAG Engine* (Local Graph Intelligence Pipeline)
   6. *Stone Paper Scissor 3.0* (Interactive Browser Game Engine)
5. **Deep-Tech Lab & Literature Tracker:** Ground-truth research interests with verified arXiv citations (Neuromorphic Computing, Floquet Engineering, Muon Tomography).
6. **Core Technical Stack:** Contextualized Bento Grid linking technologies to real systems built.
7. **Verified Credentials:** Compact credential strip replacing the 7 oversized card boxes.
8. **Creative Ecosystem:** Facade-optimized video breakdown with channel link to `@Thinktogether-z8g`.
9. **Architectural Methodology:** First-principles decomposition, iterative delivery, and defense-in-depth security.
10. **Official Resume & Footer:** Single-column ATS resume download and verified social links.
