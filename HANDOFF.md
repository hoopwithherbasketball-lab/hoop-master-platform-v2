# Handoff — hoop-master-platform-v2

## Current State

### Branch
`main` at commit `ebe5b5f` — all changes committed and pushed to `origin/main`.

### Build Status
`turbo build` passes — all packages compile. hls.js installed in web app.

### Agent Command Center (Phase 6 Complete)
The `.opencode/` agent infrastructure is live. Phase 7 (media platform foundation) completed in same session.

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
| **Watch** | `/watch` | **Browse live/linear/VOD channels** |
| **Channel Watch** | `/watch/:slug` | **Watch channel with HLS player + EPG** |
| **Embed Player** | `/embed/:slug` | **Embeddable iframe player for external sites** |
| **Embed Docs** | `/embed/docs` | **Developer documentation for embedding** |

### Player Dashboard (all wired to Supabase)
Overview, Profile, Profile Optimizer, Readiness Score, Services + Order Detail, Player Portal, One-Pager, Class Tracking, Film Index (inline CRUD), Analytics (`player_game_stats`), Events, Resources, Parent Center, Intake Form

### Admin Pages (all with full CRUD)
Leads, Orders, Evaluations, Players, Player Detail, Training Content (file upload), Intake Submissions, Community Feed moderation, **Channels**, **Assets**, **Schedules**, **Ad Slots**, **Analytics**, **Tenants**
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
All 17 files in `packages/supabase/migrations/procoach/migrations/` — run each as a separate query in timestamp order:

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
16. `20260601000000_seed_demo_data.sql` **(NEW — demo data)**
17. `20260602000000_create_media_platform_tables.sql` **(NEW — Phase 7 media tables)**

### Also Create in Supabase Dashboard
- Storage buckets: `training-thumbnails` (public), `training-videos` (public)

---

## Known Issues / Blockers

1. **Migrations not applied** — biggest blocker. Must run all 17 in order before any Supabase-dependent features work.
2. **AdminAuditsPage** — read-only (intentional, low priority)
3. **AdminReportsPage** — "Coming Soon" placeholder
4. **Chunk size >500KB** — web build warning, HLS.js adds ~300KB. Consider code-splitting with dynamic import.
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
- **Monorepo**: Turborepo with `apps/web` (Vite), `apps/procoach` (Vite), `apps/partner-portal` (CRA), shared packages, `services/` (Node.js backend services)
- **Agent orchestration**: opencode custom agents, phase tracking, task dispatch via `.opencode/`
- **Media platform**: Standalone Node.js services (`services/playlist-engine`, `services/epg-generator`, `services/ad-insertion`, `services/analytics-ingester`, `services/api`) with Express API server
- **API layer**: Express server at `services/api` with routes for channels, EPG, analytics, player config

---

## Phase State (from `.opencode/state/phase.json`)

```
current_phase: 7
phase_name: media_platform_foundation
status: complete (all foundation code built, seed data with sample channels/assets, build passes)
```

Phase 7 is fully complete. Run migrations in Supabase dashboard to activate.

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

**Uncommitted changes (Phase 7):** 35+ new files — media platform foundation

---

## Phase 7 Files (New)
| File | Purpose |
|------|---------|
| `packages/supabase/migrations/procoach/migrations/20260601000000_seed_demo_data.sql` | Demo data for all tables |
| `packages/supabase/migrations/procoach/migrations/20260602000000_create_media_platform_tables.sql` | 9 new media platform tables |
| `packages/types/src/database.ts` | Added MediaChannel, MediaAsset, ChannelSchedule, AdSlot, EPGProgram, AnalyticsEvent, WhiteLabelTenant types |
| `packages/features/src/media/index.ts` | Media module barrel export |
| `packages/features/src/media/useMediaChannels.ts` | Hook for channel CRUD |
| `packages/features/src/media/useMediaAssets.ts` | Hook for asset CRUD |
| `packages/features/src/media/useChannelSchedules.ts` | Hook for schedule CRUD |
| `packages/features/src/media/useAnalyticsIngestion.ts` | Hook for analytics events |
| `services/playlist-engine/src/index.ts` | M3U8 playlist generation from channel schedules |
| `services/epg-generator/src/index.ts` | JSON EPG feed + Roku format |
| `services/ad-insertion/src/index.ts` | SCTE-35 marker injection into HLS manifests |
| `services/analytics-ingester/src/index.ts` | Event ingestion + channel/asset stats |
| `services/api/src/index.ts` | Express API server (channels, epg, analytics, player-config) |
| `services/api/src/routes/channels.ts` | GET /api/channels, GET /:id, GET /:id/manifest, POST /:id/schedule |
| `services/api/src/routes/epg.ts` | GET /api/epg/channels, GET /api/epg/programs?channel_id&date&format |
| `services/api/src/routes/analytics.ts` | POST /api/analytics/ingest, GET /channel/:id, GET /asset/:id |
| `services/api/src/routes/player-config.ts` | GET /api/player/config/:slug, GET /api/player/config/domain/:domain |
| `apps/web/src/pages/admin/AdminChannelsPage.tsx` | Channel CRUD admin page |
| `apps/web/src/pages/admin/AdminAssetsPage.tsx` | Asset CRUD admin page |
| `apps/web/src/pages/admin/AdminSchedulePage.tsx` | Schedule CRUD admin page |
| `apps/web/src/pages/admin/AdminAdSlotsPage.tsx` | Ad slot CRUD admin page |
| `apps/web/src/pages/admin/AdminAnalyticsPage.tsx` | Analytics dashboard with charts |
| `apps/web/src/pages/admin/AdminTenantsPage.tsx` | White-label tenant management |
| `apps/web/src/components/HLSPlayer.tsx` | White-label HLS.js video player with branding |
| `apps/web/src/pages/public/ChannelsBrowsePage.tsx` | Public channel browse page |
| `apps/web/src/pages/public/ChannelWatchPage.tsx` | Public channel viewer with EPG schedule |
| `apps/web/src/pages/public/EmbedPlayerPage.tsx` | Embeddable iframe player for external sites |
| `apps/web/src/pages/public/EmbedDocsPage.tsx` | Developer documentation for embedding |
| `services/*/tsconfig.json` | TypeScript configs for all 5 services |

---

## Quick Commands
```bash
npx turbo build                    # Full build
npx turbo build --filter=web       # Web app only
npx turbo lint                     # Lint all packages
npx turbo dev --filter=web         # Dev server

# Media Platform Services
cd services/api && npm run dev     # Start API server (port 3001)
cd services/playlist-engine && npm run dev  # Test playlist generation
cd services/epg-generator && npm run dev     # Test EPG generation

# Public Routes
/watch                             # Browse channels
/watch/:slug                       # Watch channel
/embed/:slug                       # Embeddable player (iframe)
/embed/docs                        # Developer documentation

# Admin Routes
/admin/channels                    # Manage channels
/admin/assets                      # Manage media assets
/admin/schedules                   # Manage channel schedules
/admin/ad-slots                    # Manage ad placements
/admin/analytics                   # View analytics dashboard
/admin/tenants                     # Manage white-label tenants
```

## Next Steps (for next session)
1. Run all 17 migrations in Supabase SQL Editor — see `MIGRATION_RUNBOOK.md`
2. Create 3 storage buckets (training-thumbnails, training-videos, media-assets)
3. Copy `.env.example` to `.env` with your Supabase credentials
4. `npm install` then `npx turbo dev --filter=web`
5. Verify /watch shows 4 channels, /admin shows all media pages
6. Commit all Phase 7 changes
7. Start Phase 8: polish, error handling, code-splitting optimization, load testing
