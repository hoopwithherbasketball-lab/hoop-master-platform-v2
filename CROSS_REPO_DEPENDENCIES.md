# CROSS_REPO_DEPENDENCIES

## Purpose
Track cross-repo/platform dependencies that must be reconciled before and during Phases 7-11 implementation.

## Dependency matrix

| Domain | Current State | Cross-Repo Dependency | Risk | Owner Phase |
|---|---|---|---|---|
| Supabase | Client and migrations exist in target, but feature-table/RLS coverage is incomplete | Legacy schema expectations from `elitegbb` must be mapped to target ownership and migration plan | Data divergence, broken policies | Phase 9-11 |
| Auth | Target has auth context + protected routes | Legacy role semantics and permissions must map to target `user_roles`/RBAC conventions | Over-permission or user lockout | Phase 7-11 |
| Stripe/payments | Checkout UI exists; server/webhook pipeline incomplete | Legacy payment workflows (if any) must be normalized to one target flow | Payment failures, duplicate charges, audit gaps | Phase 10 |
| Cloudflare/deployment | No explicit deployment manifests consolidated at root | Legacy deployment assumptions and env contracts must be documented and replaced | Environment drift, broken releases | Phase 6-7 |
| ConnectGBB | Target package placeholder only | Core feature logic currently assumed to reside in legacy repo | Largest migration surface; unclear coupling until artifacts land | Phase 9 |
| Admin dashboard | Routes/pages exist in target | Legacy admin tools/flows may still hold operational logic | Split-brain operations during transition | Phase 7-11 |
| Evaluation builder | Placeholder package in target (`coaching`) | Legacy evaluation engine expected as upstream source | Privacy/compliance exposure for notes | Phase 11 |
| CRM/forms | Basic forms in target | Legacy forms/workflows likely contain missing business logic | Data loss and incomplete pipeline states | Phase 10 |
| Player profiles | Partial target implementation | Legacy profile model/features likely richer and must be mapped | PII leakage, inconsistent profile outputs | Phase 9-11 |
| Rankings/watchlists | Missing in target | Likely legacy-owned logic/features | Incorrect public/private visibility | Phase 11 |
| Page Builder | Missing in target | May reuse patterns, but implementation is target-owned | Scope creep and schema instability | Phase 8 |
| Media/TV section | Missing in target | Legacy media content integration paths must be mapped | Content delivery gaps, playback issues | Phase 11 |

## Phase 3 artifact dependency notice
The required Phase 3 files are not present in this repo:
- `LEGACY_REPO_AUDIT.md`
- `LEGACY_FEATURE_EXPORT.md`
- `LEGACY_TO_MONOREPO_MAP.md`
- `LEGACY_RISK_REGISTER.md`

Implementation teams must import/reference these files before finalizing module-level dependency contracts.
