# UI Polish & Anti-Slop Workflow (Portfolio)

Review and refine portfolio sections against `.agents/rules/ui-quality.md`.

## Steps
1. **Slop & AI Tells Scan**:
   - Check typography hierarchy, color tokens, and layout density.
   - Confirm no AI-generated images or generic filler elements are present.
2. **Motion Verification**:
   - Verify the procedural 3D GPU intro (`intro3d.js`) is intact and running smoothly.
   - Verify secondary animations stay within 150ms–250ms and animate only `transform` and `opacity`.
   - Test `@media (prefers-reduced-motion: reduce)` to ensure immediate, clean fallback.
3. **Accessibility & Contrast**:
   - Audit text-to-background contrast (≥ 4.5:1 body, ≥ 3:1 display).
   - Ensure keyboard `:focus-visible` rings are visible on all interactive cards and links.
4. **Lighthouse Verification**:
   - Run mobile and desktop performance checks to maintain 99+ mobile and 100 desktop scores.
