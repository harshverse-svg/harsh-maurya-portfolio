# Multi-Agent Coordination & Boundaries (Portfolio)

Rules governing subagents and collaborative tasks across portfolio folders.

## 1. Domain Folder Ownership
- **`design-agent`**: Assigned to `/css` and visual layout (`css/style.css`, `css/intro.css`, design tokens).
- **`motion-agent`**: Assigned to procedural 3D graphics and animations (`intro3d.js`, `js/intro3d.js`, `js/animations.js`). Responsible for GPU intro protection and GSAP timing.
- **`content-agent`**: Assigned to markup and case studies (`index.html`, `/content`, `*.html` project deep-dives).
- **`audit-agent`**: Read-only performance and accessibility auditor (`/audit`, Lighthouse reports, axe-core scans).

## 2. Collision Avoidance & Invariants
- An agent must never modify files outside its assigned domain.
- Two agents must never edit `index.html` or `intro3d.js` concurrently. Sequential execution is required when cross-domain integration touches shared HTML anchors.
- Always commit a git checkpoint before launching multi-agent batches.
