# Phase 8: Build Page Builder MVP

## Objective
Execute **Phase 8: Build Page Builder MVP** for the correct repository context.

## Required behavior
1. Confirm repo context (target vs legacy).
2. Collect evidence with exact file paths.
3. Modify only the files and areas explicitly authorized by this phase prompt.
4. Report blockers, risks, and next handoff.

## Phase-Authorized Paths

During Phase 8, implementation agents may modify only the following areas, if they exist or are created according to the monorepo architecture:

### Page Builder package

- `packages/page-builder/**`

Allowed purpose:
- page builder types
- block schemas
- block registry
- renderer
- preview utilities
- validation
- draft page JSON examples
- safe rendering logic

### Shared UI blocks

- `packages/ui/**`

Allowed purpose:
- reusable page-builder block components
- block previews
- shared CTA, card, hero, FAQ, gallery, form, and section components

### Shared types

- `packages/types/**`

Allowed purpose:
- page builder types
- block prop types
- page status types
- page metadata types

### Supabase/shared data layer planning only unless explicitly authorized

- `packages/supabase/**`

Allowed purpose:
- type references or read-only planning docs only unless this phase explicitly authorizes schema work

### Web app preview/rendering surface

- `apps/web/**`

Allowed purpose:
- preview route
- public page renderer route
- page-builder admin stub only if consistent with existing routing
- demo rendering using safe placeholder data

### Documentation

- `PAGE_BUILDER_SPEC.md`
- `PAGE_BUILDER_BLOCK_REGISTRY.md`
- `PAGE_BUILDER_DATA_MODEL.md`
- `PAGE_BUILDER_PRIVACY_RULES.md`
- `GAP_ANALYSIS.md`
- `IMPLEMENTATION_PLAN.md`
- `AGENT_COMMAND_CENTER_CHANGELOG.md`

### Tests

- existing test folders/files related to modified page-builder, UI, types, or web code
- only add/update tests needed for this phase

## Not Authorized In Phase 8

- unrelated apps/packages
- production Supabase migrations unless explicitly approved
- real email/SMS sending
- payment logic
- full drag-and-drop editor
- arbitrary JavaScript blocks
- unsafe raw HTML
- public rendering of parent email/phone
- public rendering of private evaluation notes
- social network/messaging features
- coach marketplace features

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
