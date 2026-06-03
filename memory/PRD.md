# PRD — Members-Only ConnectGBB + Premium Backend Hardening

## Original Problem Statement
User request: ensure the product incorporates a **members-only community aspect** in the overall design, and ensure backend features/functionality are **premium, high quality, and well structured**.

## Architecture Decisions
- Introduced a **members-only backend model** for ConnectGBB via new Supabase migration assets (membership, comments, reports, audit logs, and stricter RLS/policies).
- Implemented a **stabilized membership access hook** (`useCommunityMembership`) with cache, inflight dedupe, cooldown/backoff, and deterministic role-based fallback when migration objects are not yet provisioned.
- Shifted ConnectGBB pages to **membership-aware UI states** (locked vs accessible) for consistent community gating.
- Added admin controls for memberships (`/admin/community-memberships`) to support premium governance workflows.
- Added testability and regression hardening (`data-testid`s on auth + community controls, host allowlist updates in Vite config).

## What Was Implemented
- **Database/backend foundation (migration file added):**
  - `community_memberships` (status + tier)
  - `community_comments`
  - `community_post_reports`
  - `community_audit_logs`
  - Helper functions/triggers for membership checks, event logging, and count syncing
  - RLS hardening for members-only behavior across ConnectGBB data domains
- **Feature-layer backend logic:**
  - New hooks: `useCommunityMembership`, `useCommunityModeration`
  - Upgraded hooks: `useCommunityFeed`, `useMessages`, `useConnections`, `useTrainingTracks`, `useMemberProfile`
  - Feed now supports structured post validation, comments, reporting, and safer fallback behavior
- **Members-only UX/design integration:**
  - ConnectGBB hub now reflects membership status and locked-state messaging
  - Feed/messages/connections/training pages render deterministic locked states when inactive
  - Profile settings now persist data to backend via upsert
- **Admin governance:**
  - Added `AdminCommunityMembershipsPage` with status/tier management and dashboard access link
- **Role E2E credential seeding:**
  - Created and validated pending + admin Supabase test accounts and stored credentials in `/app/memory/test_credentials.md`
- **Moderation queue workflows:**
  - Extended `AdminCommunityFeedPage` with moderation queue backed by `analytics_events` (community report events)
  - Added report resolution action in admin queue
- **Lock-state CTA analytics:**
  - Added `trackCommunityEvent` utility and wired lock-state CTA + report tracking to analytics event ingestion
- **Auth stability hardening:**
  - Added retry/backoff logic for transient 429/network failures in `AuthContext.signIn`
- **Reliability + testing updates:**
  - Login form now includes required `data-testid` attributes
  - Vite host allowlist settings updated for public preview stability
  - Removed noisy ProtectedRoute debug logs
  - Added/updated test credentials memory file with current created account

## Prioritized Backlog
### P0
- Apply the new Supabase migration to target environments so role-based fallback is no longer required.
  - Blocker in current workspace: Supabase CLI is available, but project is not linked and `SUPABASE_ACCESS_TOKEN` is not available for `supabase link/db push`.
- Replace legacy `user_roles`-derived memberships fallback with persisted `community_memberships` table operations once migration is applied.
- Create and store full role-coverage test credentials (pending member + admin) for complete authenticated E2E.

### P1
- Add admin moderation queue UI for `community_post_reports` (reviewing/resolved workflow).
- Add retry telemetry + health indicator for membership resolution failures.

### P2
- Add CI E2E suite for membership-gated route consistency on public preview URL.
- Add analytics events for membership lock CTA and profile-completion conversion.

## Next Tasks
1. Link Supabase project and run migration push (`supabase link` + `supabase db push`) once access token is provided.
2. Re-run full authenticated E2E on public endpoint after migration is live (membership table mode replacing legacy fallback mode).
3. Expand moderation queue with report states (open/reviewing/resolved) on persistent schema once migration is applied.
