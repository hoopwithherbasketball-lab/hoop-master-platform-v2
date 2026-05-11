# MIGRATION_BACKLOG

## Phase 4 migration backlog (planning only)

| Epic | Description | Source paths | Target paths | Risk | Dependencies | Suggested PR size |
|---|---|---|---|---|---|---|
| Public MVP shell stabilization | Finalize public shell, remove placeholder dependencies, normalize nav/auth entry points | elitegbb public shell/content paths (pending Phase 3 artifacts) | apps/web/src/App.tsx, apps/web/src/pages/public/* | Medium | Phase 5 guardrails, Phase 6 tooling | M |
| Page Builder MVP foundation | Define block schema, authoring controls, renderer baseline for admin-managed pages | Legacy references optional; target-owned implementation | apps/web/src/pages/admin/builder/* (and optional packages/page-builder/*) | Medium | Phase 5 policy checks, Phase 6 runtime | M-L |
| ConnectGBB core migration | Port member/community workflows into target feature package and routes | elitegbb connect/community modules (pending artifacts) | packages/features/src/connectgbb/*, apps/web/src/pages/connectgbb/* | High | Supabase/auth mapping, Phase 6 runtime | L |
| Player profiles completion | Map legacy profile models and features to target recruiting/CRM packages | elitegbb profile/evaluation paths (pending artifacts) | packages/features/src/recruiting/*, packages/features/src/crm/*, apps/web routes | High | Phase 9 ConnectGBB, Phase 11 Evaluations | M |
| Rankings/watchlists migration | Port legacy ranking and watchlist logic into the recruiting package | elitegbb ranking/watchlist modules (pending artifacts) | packages/features/src/recruiting/* | Medium | Player profiles completion | M |
| CRM + forms workflow completion | Migrate or rewrite registration/intake/form workflows with persistence + auditability | elitegbb forms/CRM modules (pending artifacts) | packages/features/src/crm/*, apps/web/src/pages/dashboard/*, packages/supabase/* | High | Supabase contracts, role guardrails | M-L |
| Evaluation/scouting workflow migration | Implement role-gated evaluation pipeline, note privacy enforcement, and coach/admin flows | elitegbb evaluation/scouting modules (pending artifacts) | packages/features/src/coaching/*, apps/web/src/pages/coach/*, apps/web/src/pages/admin/* | High | Phase 5 privacy policy, auth/RBAC mapping | L |
| Admin dashboard hardening | Consolidate legacy admin tools and flows into the target admin dashboard | Legacy admin tools/flows (pending artifacts) | apps/web/src/pages/admin/* | Medium | Phase 7-11 feature migrations | S-M |
| Payments hardening | Add secure checkout session creation, webhook fulfillment, and idempotency handling | Legacy payment hooks/patterns (pending artifacts) | Target server/payment runtime (to be defined), checkout integration in apps/web | High | Deployment/runtime strategy, secrets management | M |
| Media/TV section integration | Integrate legacy media content paths into the public web app | Legacy media content paths (pending artifacts) | apps/web/src/pages/public/*, media feature package | Low | Public MVP shell stabilization | S |
| Deployment contract convergence | Consolidate environment matrix and deployment responsibilities across apps | Legacy deployment/env docs (pending artifacts) | Root deployment docs + CI/CD configs (Phase 6/7 scope) | Medium | Phase 6 command center tooling | S-M |

## Planning constraints
- No code migration performed in Phase 4.
- No app routes/components/schema changes performed in Phase 4.
- Backlog items are intentionally structured for Phase 7+ execution only.
