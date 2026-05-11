# CROSS_REPO_IMPLEMENTATION_PLAN

## Phase 4 Objective
Define the cross-repo migration strategy from `lrevell8-arch/elitegbb` into `hoopwithherbasketball-lab/hoop-master-platform-v2` using:
- Phase 2 target monorepo audit outputs
- Phase 3 legacy audit outputs (or explicit dependency note if artifacts are not yet copied)

This is a planning artifact only. No product app code is changed in this phase.

## 1) Repo role decision

- **Target repo (canonical destination):** hoopwithherbasketball-lab/hoop-master-platform-v2
- **Legacy repo (migration source):** lrevell8-arch/elitegbb
- **Migration direction:** one-way migration from legacy feature implementations into target monorepo packages/apps, followed by staged deprecation of legacy runtime surfaces after parity and data validation.
- **Internalized apps:** apps/partner-portal and apps/player-advantage will remain within the target monorepo to maintain a consolidated platform architecture.

## Phase 3 artifact availability check
The following Phase 3 artifacts were not found in this repository at planning time:
- `LEGACY_REPO_AUDIT.md`
- `LEGACY_FEATURE_EXPORT.md`
- `LEGACY_TO_MONOREPO_MAP.md`
- `LEGACY_RISK_REGISTER.md`

### Required action before implementation begins
Copy or link the approved Phase 3 audit artifacts from the `lrevell8-arch/elitegbb` Phase 3 PR into this repository (or attach exact immutable references in a handoff note). Phase 7+ implementation should not begin until those artifacts are available for source-path-level validation.

## 2) Ownership table

| Feature | Target app/package | Source repo/path | Status | Priority |
|---|---|---|---|---|
| Public MVP shell (marketing + nav + auth entry) | `apps/web` | Existing target implementation + selective legacy content assets from `elitegbb` | PARTIAL | P0 |
| ConnectGBB member platform | `packages/features/src/connectgbb` + routed surfaces in `apps/web/src/pages/connectgbb/*` | `lrevell8-arch/elitegbb` (exact paths pending Phase 3 artifacts) | MISSING | P0 |
| Player profiles | `packages/features/src/recruiting` + `packages/features/src/crm` + `apps/web` profile routes | `lrevell8-arch/elitegbb` profile/evaluation paths (pending artifacts) | PARTIAL | P0 |
| Rankings/watchlists | `packages/features/src/recruiting` | `lrevell8-arch/elitegbb` ranking/watchlist modules (pending artifacts) | MISSING | P1 |
| CRM/forms workflows | `packages/features/src/crm` + `apps/web/src/pages/dashboard` + `packages/supabase` | `lrevell8-arch/elitegbb` forms/intake modules (pending artifacts) | PARTIAL | P0 |
| Evaluation builder/workflow | `packages/features/src/coaching` + `apps/web/src/pages/coach` + `apps/web/src/pages/admin` | `lrevell8-arch/elitegbb` evaluations modules (pending artifacts) | MISSING | P0 |
| Admin dashboard hardening | `apps/web/src/pages/admin` + feature packages | Shared target + legacy admin capabilities (pending artifacts) | BUILT/PARTIAL | P1 |
| Page Builder MVP | `apps/web/src/pages/admin/builder/*` (+ optional `packages/page-builder` if introduced later) | Net-new in target; may borrow UX patterns from legacy | MISSING | P1 |
| Payments (Stripe) | Server-side payment module in target runtime (path finalized Phase 7/10) | Legacy payment/webhook patterns (pending artifacts) | PARTIAL | P0 |
| Media/TV section | `apps/web/src/pages/public` + media feature package (if added) | Legacy media content integration paths (pending artifacts) | MISSING | P2 |

## 3) Recommended implementation sequence

1. **Phase 5: Agent/Codex/Gemini guardrail refinement**
   - Lock privacy and evaluation-note handling policy checks before feature migration.
2. **Phase 6: MCP + Agent Command Center runtime**
   - Implement automation for repeatable migration, validation, and artifact traceability.
3. **Phase 7: Public MVP shell**
   - Stabilize public routes, replace placeholder runtime dependencies, confirm auth edge flow.
4. **Phase 8: Page Builder MVP**
   - Ship admin-managed content schema + rendering baseline.
5. **Phase 9: ConnectGBB migration**
   - Migrate community/member features from legacy into `packages/features/src/connectgbb` and route surfaces.
6. **Phase 10: Data/forms workflows**
   - Complete intake, registration, CRM, and workflow persistence contracts.
7. **Phase 11: Evaluation/scouting workflow**
   - Migrate or rewrite evaluation/scouting pipeline with strict RBAC and privacy-by-default.

## Legacy feature disposition policy (to validate with Phase 3 artifacts)
- **Migrate as-is (low rewrite):** modules already aligned to target data contracts and UX.
- **Rewrite in target architecture:** features tightly coupled to legacy runtime assumptions.
- **Deprecate:** obsolete flows, duplicated UX, or patterns conflicting with privacy/security standards.

## Risk summary for handoff
- Privacy risk: minors’ PII and private evaluation notes must never leak to public surfaces.
- Auth risk: role mapping drift between legacy and target may create over-permission.
- Payment risk: incomplete webhook/idempotency can cause failed or duplicate order states.
- Deployment risk: mixed runtime assumptions (Vite-only frontends vs required server endpoints).
