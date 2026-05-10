# Phase 7: Build public MVP shell

## Objective
Execute **Phase 7: Build public MVP shell** for the correct repository context.

## Required behavior
1. Confirm repo context (target vs legacy).
2. Collect evidence with exact file paths.
3. Modify only the files and areas explicitly authorized by this phase prompt.
4. Report blockers, risks, and next handoff.

## Phase-Authorized Paths

During Phase 7, implementation agents may modify only the following areas:

### Public web app

- `apps/web/**`

Allowed purpose:
- public home page
- events page
- player directory page
- individual player profile route if consistent with architecture
- HoopWithHer Elite page
- Elite GBB evaluation page
- Academy landing page
- rankings/watchlist page
- merch/store CTA
- navigation and CTA structure
- typed placeholder data when live data is not connected

### Shared UI

- `packages/ui/**`

Allowed purpose:
- reusable public MVP components
- hero sections
- cards
- CTAs
- badges
- layout components
- empty states

### Shared types

- `packages/types/**`

Allowed purpose:
- public profile card types
- event card types
- ranking/watchlist display types
- CTA/config types

### Feature packages, read-only or display-only integration

- `packages/features/src/connectgbb/**`
- `packages/features/src/recruiting/**`

Allowed purpose:
- display-safe placeholder data structures
- public-safe feature exports if already present

### Documentation

- `GAP_ANALYSIS.md`
- `IMPLEMENTATION_PLAN.md`
- `FEATURE_REGISTRY.md`

### Tests

- existing test folders/files related to modified public web, UI, types, or display-safe feature code

## Not Authorized In Phase 7

- legacy code migration
- production Supabase schema changes
- full Page Builder implementation
- full ConnectGBB migration
- CRM/webhook workflows
- evaluation/scouting workflow implementation
- full social network/messaging
- coach marketplace
- public parent email/phone exposure
- public private evaluation note exposure

## Prohibited
- No hardcoded secrets
- No parent email/phone exposed publicly
- No private evaluation notes exposed publicly
- No private recruiting notes exposed publicly
- No production Supabase migrations without explicit approval
- No real email/SMS sending without explicit approval
- No unrelated app/package changes
- No merging PRs automatically
- Runtime dependency additions
- Secrets or external service invocation
- Auto-merge or destructive repo changes
