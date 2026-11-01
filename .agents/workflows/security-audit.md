# Security Audit Workflow (Portfolio)

Executes a client-side and static asset audit on the portfolio.

## Steps
1. **Source Inspection**:
   - Run `security-audit` skill across `index.html`, `js/`, and `css/`.
   - Scan for dangerous DOM sinks (`innerHTML`, `eval`).
2. **Secrets & Hygiene**:
   - Verify no private keys, tokens, or untracked sensitive files exist in the repository.
   - Audit external CDN links in `index.html` for SRI integrity hashes.
3. **Report**:
   - Output summary findings to `audit/security-audit.md` if any issues are discovered.
