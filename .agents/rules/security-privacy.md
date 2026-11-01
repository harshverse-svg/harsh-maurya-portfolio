# Security & Privacy Guidelines (Portfolio)

Security guidelines for client-side JavaScript, GitHub Pages hosting, and user privacy on this static portfolio.

## 1. Client-Side Security & DOM Integrity
- **No Unsafe DOM Sinks**: Never insert untrusted strings into `innerHTML`, `outerHTML`, `document.write`, or `eval()`. Use `textContent` or sanitized DOM node creation.
- **Dependency & Script Auditing**: Vendor libraries in `js/vendor/` must be pinned, validated, and loaded with proper SRI hashes if fetched from external CDNs.
- **GitHub Actions & CI/CD**: Workflow files in `.github/workflows/` must have scoped permissions (`contents: read`, `pages: write`, `id-token: write`) and no dynamic command interpolation.
- **Secrets Prevention**: Never commit API keys, personal tokens, or private credentials into repository code or documentation.

## 2. Privacy & Telemetry
- **Zero Ingestion of PII**: The portfolio collects no user passwords, phone numbers, or private identities.
- **Cookieless Analytics**: If web analytics are added, use privacy-friendly, zero-cookie solutions (e.g. Cloudflare Web Analytics, Plausible) without invasive tracking or third-party ad networks.

## 3. Security Verification
- Before publishing changes to `master` or GitHub Pages, run the `security-audit` skill to verify DOM integrity and check for lingering credentials.
