# PRD — Phase 7 Public MVP Shell Refinement

## Original Problem Statement
Continue the Phase 7 public MVP shell build-out in `hoop-master-platform-v2` on branch `phase-7-shell-refinement-20260602`, replacing remaining local shell/CTA patterns with shared Phase 7 UI primitives under approved paths.

## Architecture Decisions
- Expanded scope (per user approval) to include web runtime env wiring for reliable local startup.
- Standardized CTA behavior through `@hoop-master/ui` `CTABanner` + `LinkComponent` for internal routing.
- Added `testId` support in shared `CTABanner` to improve deterministic UI automation.
- Preserved existing app routing; no migrations or auth/billing/deploy config changes.

## What Was Implemented
- Updated public page shell/CTA consistency:
  - `ServicesPage`, `WorkshopsPage`, `NILReadinessPage`, `RecruitingReadinessPage` standardized around shared shell primitives.
  - `ContactPage`, `EventsPage`, `FAQPage` now include shared section/CTA treatment for Phase 7 consistency.
- Added deterministic `data-testid` coverage for critical public interactions:
  - Home/Browse/PlayerDetail/Contact/Events/FAQ/Checkout/Watch/Embed docs public flows.
- Shared UI enhancement:
  - `packages/ui/src/layouts/CTABanner.tsx` supports optional `testId` and generates stable fallback IDs.
- Runtime env wiring fix:
  - `apps/web/vite.config.ts` now falls back to root `.env.txt` for `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` when missing in shell env.

## Prioritized Backlog
### P0
- Add explicit `/events` empty-state registration CTA if product wants guaranteed visible registration action with no seeded events.

### P1
- Complete final non-critical visual harmonization across remaining public pages (spacing/heading rhythm).
- Extend `data-testid` coverage from critical interactions to all public-page form controls and status blocks.

### P2
- Add visual regression snapshots for key public routes in CI.
- Add automated accessibility contrast checks in CI for CTA/button variants.

## Next Tasks
1. Add optional no-events empty state CTA on `/events` (if desired by product team).
2. Add CI snapshot + a11y contrast gate for major public routes.
3. Final review pass for copy consistency in CTA labels across public routes.
