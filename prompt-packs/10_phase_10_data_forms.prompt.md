# Phase 10: Build data/forms workflows

## Objective
Execute **Phase 10: Build data/forms workflows** for the correct repository context.

## Required behavior
1. Confirm repo context (target vs legacy).
2. Collect evidence with exact file paths.
3. Modify only the files and areas explicitly authorized by this phase prompt.
4. Report blockers, risks, and next handoff.

## Phase-Authorized Paths

During Phase 10, implementation agents may modify only the following areas:

### Form components and app surfaces

- `apps/web/**`
- `apps/player-advantage/**`
- `apps/player-advantage-app/**`
- `apps/partner-portal/**`

Allowed purpose:
- Submit Player Profile form
- HoopWithHer Elite Interest form
- Elite GBB Evaluation Request form
- Event Interest/Register form
- Sponsor/Partner Interest form
- success/error states
- safe placeholder or existing API wiring

### Feature packages

- `packages/features/src/connectgbb/**`
- `packages/features/src/crm/**`
- `packages/features/src/recruiting/**`

Allowed purpose:
- form workflows
- CRM lead abstractions
- player submission workflows
- evaluation request workflows
- event registration workflows
- sponsor/partner lead workflows

### Shared UI

- `packages/ui/**`

Allowed purpose:
- form fields
- validation display
- CTA components
- cards
- empty/success/error states

### Shared types

- `packages/types/**`

Allowed purpose:
- form payload types
- player submission types
- evaluation request types
- event registration types
- sponsor lead types

### Supabase layer

- `packages/supabase/**`
- `supabase/**`

Allowed purpose:
- schema gap docs
- local migrations only if phase explicitly authorizes and repo patterns support it
- type-safe insert/query helpers
- no production migration execution without explicit approval

### API/routes/actions

- existing API/action folders inside approved apps only

Allowed purpose:
- validated form submission handlers
- optional webhook placeholders using env vars only
- safe server-side form handling

### Documentation

- `DATA_FORMS_PLAN.md`
- `SUPABASE_SCHEMA_GAP.md`
- `FORM_WORKFLOW_MAP.md`
- `GAP_ANALYSIS.md`
- `IMPLEMENTATION_PLAN.md`

### Tests

- existing test folders/files related to modified forms, API/actions, feature packages, Supabase helpers, or app routes

## Not Authorized In Phase 10

- hardcoded webhook URLs
- hardcoded API keys
- sending real emails/SMS without explicit approval
- production Supabase migration execution without explicit approval
- public reads of private submissions
- exposing parent email/phone publicly
- exposing private evaluation notes publicly
- unrelated UI rewrites
- unrelated auth/payment changes

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
