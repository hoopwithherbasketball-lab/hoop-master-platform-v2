# Handoff — hoop-master-platform-v2

## Current State

### Branch
`main` at commit `e153893` — all changes committed and pushed to `origin/main`.

### Build Status
`turbo build` passes — all packages compile. HLS.js loaded via CDN.

### Migrations Status
**Applied in Supabase:** Tables 1–15 partially applied. `REMAINING_MIGRATIONS.sql` ran successfully after fixes:
- Fixed `CREATE POLICY IF NOT EXISTS` syntax (PostgreSQL doesn't support it)
- Fixed `site_content.updated_by` → `updated_at` in audit index
- Fixed `training_videos` CHECK constraint categories (`post_play` → `skill`, `basketball_iq` → `film`, `fundamentals` → `skill`)
- Skipped `20260531000000_audit_fixes.sql` (broken index on non-existent column)

### Dev Server
Running via `start-dev.bat` or manually:
```cmd
cd apps\web
node ..\..\node_modules\vite\bin\vite.js --host
```
Note: `turbo` binary is broken (Linux shell script on Windows). Use direct `node` commands.

---

## What Was Built

### Database (19 migrations applied)
- Core tables: profiles, user_roles, player_profiles, service_offers, service_orders
- Feature tables: nil_companies, nil_opportunities, community_posts, training_videos, events, tournaments
- Media tables: media_channels, media_assets, channel_schedules, ad_slots, epg_programs, analytics_events, analytics_aggregates, white_label_tenants, tenant_channels
- Seed data: 6 service offers, 8 leads, 6 NIL companies, 6 opportunities, 8 training videos, 4 media channels, 8 media assets, 5 schedules

### Backend Services (5)
| Service | Port | Purpose |
|---------|------|---------|
| `services/playlist-engine` | — | M3U8 playlist generation |
| `services/epg-generator` | — | JSON EPG feed + Roku format |
| `services/ad-insertion` | — | SCTE-35 marker injection |
| `services/analytics-ingester` | — | Event ingestion + stats |
| `services/api` | 3001 | Express API (channels, epg, analytics, player-config) |

### Frontend Pages (40+ files)
| Section | Pages |
|---------|-------|
| Public | Home, Services, Audit, Browse, Checkout, EliteGBB Intake, **Watch**, **Channel Watch**, **Embed Player**, **Embed Docs** |
| Player Dashboard | Overview, Profile, Optimizer, Readiness, Services, Portal, One-Pager, Class Tracking, Film Index, Analytics, Events, Resources, Parent Center |
| Admin | Overview, Leads, Orders, Evaluations, Players, Training, Intake, Community Feed, **Channels**, **Assets**, **Schedules**, **Ad Slots**, **Analytics**, **Tenants** |
| Coach | Dashboard, Search, Shortlist, Events, Evaluation, Compare |
| ConnectGBB | Feed, Training, Connections, Messages, Profiles, Settings |
| NIL | Overview, Companies, Opportunities, Athletes, Outreach, Compliance, Tasks |

### Key Files
| File | Purpose |
|------|---------|
| `ALL_MIGRATIONS.sql` | All 19 migrations concatenated (run first) |
| `REMAINING_MIGRATIONS.sql` | Migrations 16–19 (nil, stats, seed, media) |
| `MIGRATION_RUNBOOK.md` | Step-by-step migration guide |
| `services/README.md` | Architecture documentation |
| `start-dev.bat` | Dev server launcher |
| `.env` | Supabase credentials (in repo root AND apps/web/) |

---

## Known Issues

1. **`turbo` binary broken** — installed as Linux shell script, not Windows .exe. Use `node` directly.
2. **`.env` must be in `apps/web/`** — Vite looks for `.env` relative to the app, not repo root. `start-dev.bat` handles this.
3. **Supabase source map warning** — `@supabase/realtime-js` has a corrupt source map. Harmless, just noisy.
4. **AdminAuditsPage** — read-only (intentional)
5. **AdminReportsPage** — "Coming Soon" placeholder
6. **No rate limiting** on public intake form
7. **Admin pages use `window.location.reload()`** — not optimistic UI

---

## Quick Commands
```cmd
:: Dev server
cd apps\web
node ..\..\node_modules\vite\bin\vite.js --host

:: Or use the bat file from repo root
start-dev.bat

:: Build (if turbo is fixed)
npx turbo build --filter=web

:: Public Routes
http://localhost:5173/watch          # Browse channels
http://localhost:5173/watch/:slug    # Watch channel
http://localhost:5173/embed/:slug    # Embeddable player
http://localhost:5173/embed/docs     # Developer docs

:: Admin Routes
http://localhost:5173/admin/channels
http://localhost:5173/admin/assets
http://localhost:5173/admin/schedules
http://localhost:5173/admin/ad-slots
http://localhost:5173/admin/analytics
http://localhost:5173/admin/tenants
```

---

## Next Steps
1. Verify /watch shows 4 channels in browser
2. Verify /admin pages load with data
3. Test CRUD on admin channels/assets/schedules
4. Fix turbo binary for Windows (or switch to package manager scripts)
5. Create storage buckets if not done (training-thumbnails, training-videos, media-assets)
6. Start Phase 8: polish, error handling, load testing

---

## Commit History
```
e153893 update-start-dev-bat
3d1032c fix-hls-cdn-loading
6c5cff5 fix-training-video-categories
87c3530 skip-audit-fixes-in-remaining
cb7dcc9 add-remaining-migrations-sql
0ef598c fix-create-policy-syntax
5885a91 add-all-migrations-sql
27ec41b feat-phase7-media-platform
81df44d handoff: update session state before restart
ebe5b5f feat: build agent command center (Phase 6)
```
