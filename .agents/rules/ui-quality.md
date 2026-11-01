# UI Quality & Craft Standards (Portfolio)

Guidelines for maintaining visual excellence, craft floor standards, and performance on this static portfolio.

## 1. Signature Motion Exception & Restraint
- **Signature GPU Intro Exemption**: The existing procedural 3D GPU unfolding animation (`intro3d.js` powered by Three.js and GSAP) **is the signature motion of this portfolio**. It is permanently authorized and must NOT be modified, simplified, or flagged as a motion budget violation.
- **Secondary Motion Restraint**: All other transitions (navigation, hover, card reveals) must remain subtle, crisp, and functional (150ms–250ms).
- **GPU-Only Rule**: Outside of the Three.js WebGL canvas, animate only `transform` and `opacity`. Never animate layout-triggering properties (`width`, `height`, `margin`, `top`).
- **Reduced Motion Parity**: Strictly honor `@media (prefers-reduced-motion: reduce)`. When active, bypass the 3D unfolding intro smoothly and present content immediately with zero spatial displacement.

## 2. Code-First Visual Assets (Zero AI Image Generation)
- **Strict Prohibition on AI Images**: No external AI-generated images, synthetic illustrations, or stock placeholders.
- **Code-Only Graphics**: All visual artifacts, heroes, diagrams, and decorative elements must be constructed procedurally in code using Three.js, HTML5 Canvas 2D, SVG, or pure CSS.

## 3. Anti-Slop Visual Discipline
- **Palette & Typography**: Maintain disciplined design tokens (`css/style.css`, `css/intro.css`). No default purple/indigo gradients, no unstyled default Inter, and no generic card-in-card nesting.
- **Tonal Elevation**: Structure surfaces using intentional tone steps and spacing rather than heavy diffuse drop shadows or hairline outlines everywhere.

## 4. Web Accessibility & Performance Gates
- **WCAG 2.1/2.2 AA Contrast**: Minimum 4.5:1 for body and secondary text; minimum 3:1 for large headlines and interactive controls.
- **Keyboard Navigation**: All interactive elements (`<a>`, `<button>`) must be accessible via keyboard with instantaneous `:focus-visible` indicators.
- **Lighthouse Performance Budget**: Maintain desktop (100) and mobile (99+) performance scores, keeping LCP ≤ 1.5s and zero layout shift (CLS = 0).
