# Parallel Feature Build Workflow

This workflow decomposes a complex product feature into isolated domain folders, coordinates parallel execution between frontend and backend agents, executes testing and security gates, and synthesizes the final implementation.

## Steps

### 1. Specification & Domain Partitioning
- Analyze the user's feature requirement.
- Deconstruct the feature into isolated domain components:
  - **Frontend tasks**: UI components, pages, forms, hooks, layout, state (`/src/app`, `/src/components`, `/src/lib`).
  - **Backend tasks**: API routes, schema validation, persistence, auth logic (`/api`, `/src/app/api`).
- Verify that neither agent writes to the other's directory.

### 2. Git Checkpoint
- Verify git working tree is clean.
- Create an intermediate checkpoint commit before launching subagents.

### 3. Parallel Execution
- Launch **`frontend-agent`** and **`backend-agent`** concurrently:
  - **`frontend-agent`**: Implements screens and components adhering to `.agents/rules/ui-quality.md`.
  - **`backend-agent`**: Implements endpoint handlers, data schemas, and validation adhering to `.agents/rules/security-privacy.md`.
- Monitor task completion and wait for both agents to report readiness.

### 4. Integration & QA Verification
- Invoke **`qa-agent`** in `/tests`:
  - Run unit tests and integration tests against the new endpoints and UI components.
  - Fix any regressions in coordination with the respective agent.

### 5. Security & Privacy Audit Gate
- Invoke **`security-agent`** to review all changed files.
- Run `security-audit` skill and `semgrep` on newly created code paths.
- Ensure no hardcoded secrets, injection vectors, or unvalidated inputs are present.

### 6. Review & Delivery Summary
- Produce a structured markdown summary showing:
  - Files created / edited by each agent.
  - Test suite outcome.
  - Security review sign-off.
