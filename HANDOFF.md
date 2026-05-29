# Handoff — hoop-master-platform-v2

## Current State

### Branch
`main` at commit `dfa7c41` — all changes committed and pushed to `origin/main`.

### Build Status
`turbo build` passes — all 8 packages compile (features, types, ui, supabase, web, procoach, partner-portal, config).

---

## What's Been Built (Full Session Summary)

### Public-Facing Pages
| Page | Route | Description |
|------|-------|-------------|
| EliteGBB Intake | `/elitegbb` | 9-step form: creates auth user + player_profile + intake_submission + service_order |
| Home | `/` | Landing page |
| Services | `/services` | Service listing |
| Audit | `/audit` | Recruiting readiness audit |
| Browse | `/browse` | Public player directory |
| Checkout | `/checkout/:slug` | Stripe checkout |

### Player Dashboard Pages (all wired to Supabase)
| Page | Route | Data Source |
|------|-------|-------------|
| Overview | `/dashboard` | DashboardOverview |
| Profile | `/dashboard/profile` | `player_profiles` via `useCurrentUserProfile` |
| Profile Optimizer | `/dashboard/profile/optimizer` | `player_profiles` |
| Readiness Score | `/dashboard/readiness` | `profile_completion_percent` |
| Services | `/dashboard/services` | `service_orders` |
| Service Detail | `/dashboard/services/:orderId` | `service_orders` + `service_offers` join |
| Player Portal | `/dashboard/portal` | `player_profiles`, `player_game_stats`, `service_orders` |
| One-Pager | `/dashboard/onepager` | `player_profiles` |
| Class Tracking | `/dashboard/class-tracking` | `class_year`-derived milestones |
| Film Index | `/dashboard/film-index` | `film_entries` — full inline CRUD |
| Analytics | `/dashboard/analytics` | `player_game_stats` |
| Events | `/dashboard/events` | Events (hardcoded MOCK_EVENTS — **not yet fixed**) |
| Resources | `/dashboard/resources` | Static content with links |
| Parent Center | `/dashboard/parent` | Parent center |
| Intake Form | `/dashboard/intake` | Intake form (now saves to DB) |

### Admin Pages (all with full CRUD)
| Page | Route | Notes |
|------|-------|-------|
| Overview | `/admin` | Dashboard with counts |
| Leads | `/admin/leads` | Full CRUD |
| Orders | `/admin/orders` | Edit status, delete |
| Audits | `/admin/audits` | Read-only list |
| Evaluations | `/admin/evaluations` | Edit scores/strengths/gaps, delete |
| Players | `/admin/players` | Full CRUD |
| Player Detail | `/admin/players/:id` | Inline field editing |
| Reports | `/admin/reports` | Placeholder "Coming Soon" |
| Training Content | `/admin/training` | Full CRUD + file upload to Storage |
| Intake Submissions | `/admin/intake` | Expandable cards, delete |
| Community Feed | `/admin/feed` | Moderate posts (delete only) |

### NIL Pages (all with full CRUD)
| Page | Route | Description |
|------|-------|-------------|
| Overview | `/nil` | Dashboard |
| Companies | `/nil/companies` | `nil_companies` |
| Opportunities | `/nil/opportunities` | `nil_opportunities` |
| Athlete Profiles | `/nil/athletes` | `nil_athlete_profiles` |
| Outreach Inbox | `/nil/outreach` | `nil_outreach` |
| Compliance | `/nil/compliance` | `nil_compliance_items` |
| Tasks | `/nil/tasks` | `nil_tasks` |

### ConnectGBB Pages
| Page | Route | Description |
|------|-------|-------------|
| Hub | `/connectgbb` | Navigation hub |
| Feed | `/connectgbb/feed` | Community posts with likes (now correctly checks `community_likes`) |
| Training | `/connectgbb/training` | Training videos from `training_videos` |
| Connections | `/connectgbb/connections` | Member connections |
| Messages | `/connectgbb/messages` | In-app messaging (N+1 fixed, unread counts fixed) |
| Member Profile | `/connectgbb/member/:id` | Member public profile (now shows real counts) |
| Settings | `/connectgbb/settings` | Profile settings |

### Coach Pages
| Page | Route | Description |
|------|-------|-------------|
| Dashboard | `/coach` | Coach overview |
| Search Players | `/coach/search` | Prospect search (now fetches real coach_profile_id) |
| My Shortlist | `/coach/shortlist` | Saved players |
| Events | `/coach/events` | Coach events |
| Player Evaluation | `/coach/evaluation/:id` | Evaluation + referral notes (now persisted to `coach_referral_notes`) |
| Prospect Comparison | `/coach/compare` | Compare prospects |

---

## Migration Status

### Applied (run in Supabase dashboard — confirmed by user)
- `20260528000000_create_intake_submissions.sql`
- `20260529000000_create_game_stats_and_film_entries.sql`

### Not Yet Applied (user tried, but some failed)
All remaining migrations must be run **in order**:
1. `20260409031506_fix_unused_indexes_permissive_policies_and_search_path.sql`
2. `20260409033012_player_development_assistant_tables.sql`
3. `20260409035031_update_profiles_role_constraint_add_admin.sql`
4. `20260409035259_site_content_table.sql`
5. `20260428204820_create_tournaments_events_programs_tables.sql`
6. `20260505194401_create_user_roles_table.sql`
7. `20260505200000_create_core_tables_fix_rls.sql`
8. `20260506000000_create_event_registrations.sql`
9. `20260524200000_fix_user_roles_rls_recursion.sql`
10. `20260525180000_add_user_roles_select_policy.sql`
11. `20260525200000_create_get_my_roles_rpc.sql`
12. `20260526000000_ensure_missing_tables.sql`
13. `20260527000000_create_nil_and_connectgbb_tables.sql`
14. `20260530000000_create_coach_referral_notes.sql`
15. `20260531000000_audit_fixes.sql`

**Note**: The user reported "some succeeded, some failed" when running migrations. This needs to be debugged by running each migration individually in order and fixing any errors.

### Migration File Locations
All in `packages/supabase/migrations/procoach/migrations/`

---

## Backend Audit Issues Fixed (Commit `dfa7c41`)

### Migration Fixes (`20260531000000_audit_fixes.sql`)
- Duplicate RLS policy on `events` — dropped before re-creating
- `event_registrations` CONSOLIDATED — missing CHECK + UNIQUE constraints added
- 8 FK constraints missing ON DELETE — CASCADE/SET NULL added
- 30+ indexes on FK columns for JOIN performance
- Missing CHECK constraints on `notifications.type`, `service_offers.category`, `intake_submissions.gender`/`package_selected`
- `nil_athlete_profiles.followers` type fixed (text → integer)
- `intake_submissions.dob` type fixed (text → date)
- `coach_saved_players` RLS type-cast hack replaced with proper subquery
- Missing DELETE policy on `community_posts`
- Missing UPDATE policy on `coach_referral_notes`
- Missing SELECT policies on `nil_compliance_items`, `nil_tasks`

### Hook Fixes (16 files)
| Issue | Files |
|-------|-------|
| Loading stuck on error | `useAdminPlayerDetail`, `useAdminEvaluations`, `useParentApproval` |
| Data loss: intake fields not saved | `useIntakeForm` — now saves all fields + creates service_orders |
| Hardcoded `likedByUser: false` | `useCommunityFeed` — now queries `community_likes` |
| Hardcoded `author_role: 'player'` | `useCommunityFeed` — now fetches from `member_profiles` |
| Hardcoded `author_name` from email | `useCommunityFeed` — now uses `display_name` |
| N+1 query in messages | `useMessages` — single `in` query, grouped in JS |
| Unread count never incremented | `useMessages` — now increments other participant's counter |
| Loading stuck when !user | `useMessages` — early return now sets loading false |
| Connections role hardcoded | `useConnections` — now selects `role` from `member_profiles` |
| Member connections/posts always 0 | `useMemberProfile` — now counts from real tables |
| Events hardcoded | `useEventRegistration` — now queries `events` table |
| Empty catch blocks | `useEventRegistration` — now logs errors |
| No error handling | 8 hooks — try/catch added |
| Race conditions | 6 hooks — AbortController added |
| Type safety | `useCoachShortlist`, `useProspectSearch` — proper types |
| FK constraint violation | `useProspectSearch` — now fetches real `coach_profile_id` |
| Hardcoded email fallback | `AuthContext.tsx` — removed `email.startsWith('lamont')` bypass |

---

## Known Issues / Blockers

### 1. Migrations Not Fully Applied
The biggest blocker. `20260531000000_audit_fixes.sql` references tables (`coach_referral_notes`, `tournaments`, etc.) that don't exist because earlier migrations haven't been run. **Solution**: Run all migrations in timestamp order in Supabase SQL Editor, one at a time.

The `20260531000000_audit_fixes.sql` references `tournaments` (line 147) which is created in `20260428204820_create_tournaments_events_programs_tables.sql`. Skipping earlier migrations causes cascade failures.

### 2. AdminAuditsPage Read-Only
Still read-only — no CRUD modals added. Low priority since audits are typically view-only.

### 3. AdminReportsPage Placeholder
Still shows "Coming Soon". Low priority.

### 4. Chunk Size Warning
Web build shows "Some chunks are larger than 500 kB" — suggests code-splitting via dynamic `import()`. Not blocking.

### 5. No Realtime Subscriptions on Admin Pages
Admin pages use `window.location.reload()` after mutations instead of optimistic UI + Supabase realtime. Works but UX could be better.

### 6. `usePlayerAnalytics` uses `_playerId` parameter
Unused parameter exposed in the hook API. Confusing but not breaking.

### 7. No Rate Limiting on Public Intake Form
`intake_submissions` has `INSERT TO anon WITH CHECK (true)` — any unauthenticated user can submit. Consider rate limiting at the app layer or via Supabase.

---

## Architecture Decisions

- **Supabase client**: `@hoop-master/supabase` package with centralized instance
- **Auth**: Custom `AuthProvider` with role loading from `user_roles` table + localStorage cache
- **File uploads**: Supabase Storage buckets `training-thumbnails` and `training-videos` (must be created in dashboard manually)
- **Styling**: Tailwind with custom navy theme (`bg-navy-800`, `border-white/10`, `#0134BD` primary)
- **Package layout**: `apps/web` (Vite+React), `apps/procoach` (Vite+React), `apps/partner-portal` (Create React App), `packages/features` (shared hooks), `packages/types` (shared TS types), `packages/ui` (shared components)
- **Build system**: Turborepo with remote caching

---

## Commit History (Recent)
```
dfa7c41 fix: production-grade backend audit - fix migrations, hooks, RLS, and data layer issues
25f6a8c feat: add admin community feed moderation, coach referral notes table + persistence, remove hardcoded email fallback
9dad29a add full CRUD modals to all admin and NIL pages
f2bad1f feat: wire analytics, film index, class tracking, portal, resources to Supabase + create game stats and film entries tables
e17dfbd add NIL/Connect seed data with demo records
```

---

## Quick Commands

```bash
# Build everything
npx turbo build

# Build specific app
npx turbo build --filter=web

# Lint
npx turbo lint

# Dev servers
npx turbo dev --filter=web
npx turbo dev --filter=procoach
```
