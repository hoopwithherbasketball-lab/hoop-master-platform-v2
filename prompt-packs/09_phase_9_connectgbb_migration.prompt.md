# Phase 9: Migrate ConnectGBB

## Objective
Execute **Phase 9: Migrate ConnectGBB** for the correct repository context.

## Required behavior
1. Confirm repo context (target vs legacy).
2. Collect evidence with exact file paths.
3. Modify only the files and areas explicitly authorized by this phase prompt.
4. Report blockers, risks, and next handoff.

## Phase-Authorized Paths

During Phase 9, implementation agents may modify only the following areas:

### ConnectGBB feature package

- `packages/features/src/connectgbb/**`

Allowed purpose:
- migrated ConnectGBB domain models
- player/profile/evaluation feature logic
- pure utilities
- feature constants
- non-UI business logic
- safe adapters

### Shared types

- `packages/types/**`

Allowed purpose:
- ConnectGBB player/profile/evaluation types
- shared migration-safe interfaces

### Shared UI, only if migration slice requires reusable presentation components

- `packages/ui/**`

Allowed purpose:
- reusable ConnectGBB cards, badges, profile display components, and empty states

### Shared Supabase layer, only if already planned and safe

- `packages/supabase/**`

Allowed purpose:
- read/query helpers
- generated types references
- schema gap documentation
- no production migrations without explicit approval

### App integration surfaces, only when explicitly required by the migration slice

- `apps/web/**`
- `apps/player-advantage/**`
- `apps/player-advantage-app/**`

Allowed purpose:
- consume migrated ConnectGBB feature modules
- route-safe placeholder integration
- public-safe profile/ranking views

### Legacy evidence docs

- `LEGACY_REPO_AUDIT.md`
- `LEGACY_FEATURE_EXPORT.md`
- `LEGACY_TO_MONOREPO_MAP.md`
- `LEGACY_RISK_REGISTER.md`
- `CONNECTGBB_MIGRATION_PLAN.md`
- `CONNECTGBB_PACKAGE_AUDIT.md`
- `MIGRATION_BACKLOG.md`
- `GAP_ANALYSIS.md`
- `IMPLEMENTATION_PLAN.md`

### Tests

- existing test folders/files related to modified ConnectGBB, types, UI, Supabase, or app integration code

## Not Authorized In Phase 9

- dumping the entire legacy repo into the monorepo
- copying legacy secrets
- unrelated app rewrites
- production Supabase migrations without explicit approval
- public exposure of parent contact data
- public exposure of private evaluation notes
- full social network implementation
- coach marketplace implementation
- unrelated payment/auth rewrites

## Prohibited

- No hardcoded secrets
- No parent email/phone exposed publicly
- No private evaluation notes exposed publicly
- No private recruiting notes exposed publicly
- No production Supabase migrations without explicit approval
- No real email/SMS sending without explicit approval
- No unrelated app/package changes
- No runtime dependency additions unless explicitly authorized by the active phase prompt
- Secrets or external service invocation
- No auto-merge or destructive repo changes
