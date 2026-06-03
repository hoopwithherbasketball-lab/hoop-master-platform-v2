# PRD — Phase 7 Public MVP Shell Refinement

## Original Problem Statement
Continue the Phase 7 public MVP shell build-out in `hoop-master-platform-v2` on branch `phase-7-shell-refinement-20260602`, replacing remaining local shell/CTA patterns with shared Phase 7 UI primitives under approved paths.

## Architecture Decisions
- Kept implementation scoped to public pages and shared UI shell layer.
- Standardized CTA behavior through `@hoop-master/ui` `CTABanner` + `LinkComponent` for internal routing.
- Added `testId` support in shared `CTABanner` to improve deterministic UI automation.
- Preserved existing app routing; no migrations or auth/billing/deploy config changes.

## What Was Implemented
- Updated public page CTA consistency:
  - `ServicesPage`: shared `PageSection` structure, improved Team Package CTA contrast, shared `CTABanner` usage.
  - `WorkshopsPage`: shared `PageSection` structure, shared `CTABanner` usage, cleaned CTA/link semantics.
- Added deterministic CTA test IDs on key public CTAs:
  - `HomePage`, `BrowsePage`, `PlayerDetailPage`, `ServicesPage`, `WorkshopsPage`.
- Shared UI enhancement:
  - `packages/ui/src/layouts/CTABanner.tsx` now supports optional `testId` per action and emits `data-testid` on rendered links/buttons.

## Prioritized Backlog
### P0
- Resolve runtime environment wiring for supervisor/default runtime so `VITE_SUPABASE_*` are consistently present without manual export.

### P1
- Complete remaining public-page shell harmonization pass (non-CTA structural consistency checks across all `apps/web/src/pages/public/*`).
- Expand deterministic `data-testid` coverage to all critical public-page interactive elements.

### P2
- Add visual regression snapshots for key public routes in CI.
- Add accessibility contrast audit to prevent future CTA contrast regressions.

## Next Tasks
1. Re-run full frontend e2e against default runtime once env wiring is fixed.
2. Apply final consistency pass to remaining public routes and verify no local CTA variants remain.
3. Ship PR update with validation outputs and known blocker note.
