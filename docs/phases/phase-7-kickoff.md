# Phase 7: Public MVP Shell — Kickoff

## Status
**Started:** 2026-05-22
**Phase:** 7
**Runtime Mode:** `restricted_enabled`
**Agent:** `phase_7_public_mvp`

## Authorized Paths
- `apps/web/src/App.tsx`
- `apps/web/src/pages/public/*`
- `packages/ui/src/components/*`
- `packages/ui/src/layouts/*`

## Deliverables
| # | Deliverable | Status |
|---|---|---|
| D1 | Replace runtime placeholder assets (`/api/placeholder/...`) with local/static assets or valid remote URLs | Done |
| D2 | Add CI checks: `turbo build`, lint, typecheck | Done (branch `codex/phase-7-public-mvp`) |
| D3 | Stabilize public routes | Done — all 32 imports resolve |
| D4 | Replace placeholder runtime dependencies | N/A — no placeholder deps exist |
| D5 | Confirm auth edge flow | Done — `LoginPage` → `@hoop-master/features/crm` → supabase client, all components exist |

## Restrictions
- No runtime dependency additions
- No secrets or external service invocation
- No auto-merge or destructive repo changes
- All protected actions require human approval + PR + review + rollback plan
- All changes scoped to authorized paths above

## Rollback
If guardrails are violated, Overseer can revoke Phase 7 access by setting `transitionStatus` to `"revoked"` in `config/agent-runtime.json`.
