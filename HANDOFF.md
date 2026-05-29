# Handoff — hoop-master-platform-v2

## Current State

### Branch
`main` at commit `ebe5b5f` — all changes committed and pushed to `origin/main`.

### Build Status
`turbo build` passes — all 8 packages compile (features, types, ui, supabase, web, procoach, partner-portal, config).

### Agent Command Center (Phase 6 Complete)
The `.opencode/` agent infrastructure is live. Next session: say `proceed` to continue.

---

## What Was Built (Full Session Summary)

### Agent Command Center (Phase 6)
| File | Purpose |
|------|---------|
| `.opencode/opencode.json` | Wires all agents, skills, commands — Overseer is default agent |
| `.opencode/agents/hwh-overseer.md` | Primary agent — reads phase state, dispatches work, advances phases |
| `.opencode/agents/codex-dispatcher.md` | Routes tasks to specialist agents |
| `.opencode/agents/frontend-ui-agent.md` | Builds React pages and components |
| `.opencode/agents/supabase-data-agent.md` | Designs schemas, writes migrations, builds hooks |
| `.opencode/agents/qa-test-agent.md` | Runs builds, lint, verification |
| `.opencode/agents/security-privacy-agent.md` | Reviews RLS, PII exposure, auth |
| `.opencode/agents/release-manager.md` | Updates HANDOFF.md, release summaries |
| `.opencode/skills/phase-tracker/SKILL.md` | Tracks phase state |
| `.opencode/skills/handoff/SKILL.md` | Generates session handoff docs |
| `.opencode/state/phase.json` | Phase 6 complete, pending tasks listed |
| `DEVELOPER_BRIEF.md` | Full roadmap for emergent.sh or agent |

### Public-Facing Pages
| Page | Route | Description |
|------|-------|-------------|
| EliteGBB Intake | `/elitegbb` | 9-step form: creates auth + profile + intake + order |
| Home | `/` | Landing page |
| Services | `/services` | Service listing |
| Audit | `/audit` | Recruiting readiness audit |
| Browse | `/browse` | Public player directory |
| Checkout | `/checkout/:slug` | Stripe checkout |

### Player Dashboard (all wired to Supabase)
Overview, Profile, Profile Optimizer, Readiness Score, Services + Order Detail, Player Portal, One-Pager, Class Tracking, Film Index (inline CRUD), Analytics (`player_game_stats`), Events, Resources, Parent Center, Intake Form

### Admin Pages (all with full CRUD)
Leads, Orders, Evaluations, Players, Player Detail, Training Content (file upload), Intake Submissions, Community Feed moderation
- Read-only: Audits (intentionally), Reports (placeholder)

### NIL Pages (all with full CRUD)
Overview, Companies, Opportunities, Athlete Profiles, Outreach, Compliance, Tasks

### ConnectGBB Pages
Feed (likes/roles now query real tables), Training, Connections, Messages (N+1 fixed), Member Profiles (real counts), Settings

### Coach Pages
Dashboard, Search (real coach_profile_id), Shortlist, Events, Player Evaluation (referral notes persisted), Compare

### Backend Fixes (Commit `dfa7c41`)
- 30+ FK indexes added, ON DELETE actions on 8 tables
- Missing CHECK constraints, RLS policies, column type fixes
- 16 hooks fixed: loading states, error handling, AbortControllers, N+1 queries
- Hardcoded email auth bypass removed

---

## Migration Status

### Must Be Run (in order, in Supabase SQL Editor)
All 15 files in `packages/supabase/migrations/procoach/migrations/` — run each as a separate query in timestamp order:

1. `20260409031506_fix_unused_indexes...`
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

### Also Create in Supabase Dashboard
- Storage buckets: `training-thumbnails` (public), `training-videos` (public)

---

## Known Issues / Blockers

1. **Migrations not applied** — biggest blocker. Must run all 15 in order before any Supabase-dependent features work.
2. **AdminAuditsPage** — read-only (intentional, low priority)
3. **AdminReportsPage** — "Coming Soon" placeholder
4. **Chunk size >500KB** — web build warning, suggests code-splitting
5. **No rate limiting** on public intake form (anon insert is wide open)
6. **Admin pages reload** — use `window.location.reload()` after mutations instead of optimistic UI
7. **`usePlayerAnalytics`** — `playerId` parameter is redundant with auth context
8. **`useEventRegistration`** — new fix queries real `events` table, but events table may not exist if migrations haven't run

---

## Architecture Decisions

- **Supabase client**: `@hoop-master/supabase` package with centralized instance
- **Auth**: Custom `AuthProvider` with role loading from `user_roles` + localStorage cache (no hardcoded bypass)
- **File uploads**: Supabase Storage buckets (must create in dashboard)
- **Styling**: Tailwind + custom navy theme (`bg-navy-800`, `#0134BD`)
- **Monorepo**: Turborepo with `apps/web` (Vite), `apps/procoach` (Vite), `apps/partner-portal` (CRA), shared packages
- **Agent orchestration**: opencode custom agents, phase tracking, task dispatch via `.opencode/`

---

## Phase State (from `.opencode/state/phase.json`)

```
current_phase: 6
phase_name: mcp_agent_command_center
status: complete (infrastructure built, committed)
```

Phase 6 is done. Next: Phase 7+ implementation. Pending tasks are in phase.json and listed above under Migration Status.

---

## Commit History (Recent)
```
ebe5b5f feat: build agent command center (Phase 6)
0b25aec add handoff document for developer onboarding
dfa7c41 fix: production-grade backend audit
25f6a8c feat: add admin community feed moderation, coach referral notes
9dad29a add full CRUD modals to all admin and NIL pages
f2bad1f feat: wire analytics, film index, etc. to Supabase
```

---

## Quick Commands
```bash
npx turbo build                    # Full build
npx turbo build --filter=web       # Web app only
npx turbo lint                     # Lint all packages
npx turbo dev --filter=web         # Dev server
```

## Next Steps (for next session)
1. Run all 15 migrations in Supabase dashboard (in order)
2. Create storage buckets (training-thumbnails, training-videos)
3. Verify CRUD works on all admin/NIL pages
4. Seed demo data
5. Start Phase 7: media platform architecture (playlist engine, EPG, etc.)
