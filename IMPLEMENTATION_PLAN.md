# IMPLEMENTATION_PLAN

## Constraints applied
- No new application features implemented in this pass.
- Documentation/audit only.

## Phase 1: Stabilize repository operations (short-term)
1. Create `AGENTS.md` and `MVP_SPEC.md` at root to formalize agent workflow and MVP acceptance criteria.
2. Replace runtime placeholder assets (`/api/placeholder/...`) with local/static assets or valid remote URLs.
3. Add CI checks: `turbo build`, lint, and typecheck where available.

## Phase 2: Close core MVP gaps
1. **Events registration completion**
   - Define event registration data model in Supabase migrations.
   - Implement registration form persistence and confirmation flow.
2. **Player recruiting workflows**
   - Expand recruiting package from placeholder exports into concrete flows (search/filter/messaging/readiness signals).
3. **ConnectGBB member platform hardening**
   - Wire `packages/features/src/connectgbb` into routed screens in `apps/web`.

## Phase 3: Revenue + communications
1. Implement Stripe checkout/session creation and webhook fulfillment using secure server endpoint(s).
2. Add transactional notifications (email + in-app) tied to events/orders/profile milestones.
3. Define audit logs for admin actions.

## Phase 4: Product-line alignment across repos
1. Decide which surfaces remain in this monorepo vs. stay external (`partner-portal`, `player-advantage`), then label each MVP feature as in-repo vs cross-repo.
2. Add cross-repo contract docs for shared auth roles, Supabase schema ownership, and deployment responsibilities.

## Phase 5: Deployment readiness
1. Add explicit deployment manifests/workflows per app target.
2. Document environment variable matrix for each app.
3. Set bundle budgets and code-splitting goals to address current large web chunk warning.
