# Phase 6: Build MCP + agent command center

## Objective
Execute **Phase 6: Build MCP + agent command center** for the correct repository context.

## Required behavior
1. Confirm repo context (target vs legacy).
2. Collect evidence with exact file paths.
3. Modify only command-center tooling and documentation paths authorized for this phase.
4. Report blockers, risks, and next handoff.

## Phase-Authorized Paths

During Phase 6, agents may modify only command-center tooling and documentation areas such as:

- `packages/hwh-mcp-server/**`
- `packages/hwh-agent-runner/**`
- `agents/**`
- `prompt-packs/**`
- command-center documentation files
- MCP/agent setup documentation

## Not Authorized In Phase 6

- product app code changes
- product app routes
- product UI component changes
- product database schema changes
- production infrastructure changes

## Prohibited

- No hardcoded secrets
- No parent email/phone exposed publicly
- No private evaluation notes exposed publicly
- No private recruiting notes exposed publicly
- No production Supabase migrations without explicit approval
- No real email/SMS sending without explicit approval
- No unrelated app/package changes
- No auto-merge or destructive repo changes
- No runtime dependency additions unless explicitly authorized by the active phase prompt
- No secrets or external service invocation
