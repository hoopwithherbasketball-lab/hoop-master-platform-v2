# Phase 11: Build evaluation/scouting workflow

## Objective
Execute **Phase 11: Build evaluation/scouting workflow** for the correct repository context.

## Required behavior
1. Confirm repo context (target vs legacy).
2. Collect evidence with exact file paths.
3. Modify only the files and areas explicitly authorized by this phase prompt.
4. Report blockers, risks, and next handoff.

## Phase-Authorized Paths

During Phase 11, implementation agents may modify only the following areas:

### Evaluation/scouting feature packages

- `packages/features/src/connectgbb/**`
- `packages/features/src/recruiting/**`
- `packages/features/src/coaching/**`

Allowed purpose:
- evaluation domain models
- quick scout sheet logic
- scouting report structures
- development recommendation structures
- public/private evaluation summary rules

### Shared types

- `packages/types/**`

Allowed purpose:
- evaluation score types
- scouting report types
- player badge types
- public/private evaluation visibility types

### Shared UI

- `packages/ui/**`

Allowed purpose:
- quick scout sheet components
- evaluation summary components
- player badge components
- public-safe scouting display components
- evaluator/admin form components if existing architecture supports it

### App surfaces

- `apps/web/**`
- `apps/player-advantage/**`
- `apps/player-advantage-app/**`
- `apps/partner-portal/**`

Allowed purpose:
- public-safe evaluation badge/summary rendering
- evaluator/admin workflow surface if existing architecture supports it
- player development recommendation display
- approved placeholder integration

### Supabase layer

- `packages/supabase/**`
- `supabase/**`

Allowed purpose:
- evaluation schema gap docs
- type-safe access helpers
- migrations only if explicitly approved by the phase and consistent with repo patterns
- no production migration execution without explicit approval

### Documentation

- `EVALUATION_WORKFLOW_PLAN.md`
- `SCOUTING_MODEL.md`
- `EVALUATION_PRIVACY_RULES.md`
- `GAP_ANALYSIS.md`
- `IMPLEMENTATION_PLAN.md`

### Tests

- existing test folders/files related to modified evaluation, scouting, UI, types, Supabase, or app code

## Not Authorized In Phase 11

- public rendering of private evaluator notes
- public rendering of parent email/phone
- public rendering of private recruiting notes
- advanced ranking algorithms
- coach marketplace
- full social network/messaging
- production Supabase migrations without explicit approval
- real email/SMS sending without explicit approval
- unrelated app/package rewrites

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
