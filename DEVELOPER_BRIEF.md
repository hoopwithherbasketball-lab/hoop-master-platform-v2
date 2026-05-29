# Hoop With Her — Developer Brief for emergent.sh

## Repository

**URL**: `https://github.com/hoopwithherbasketball-lab/hoop-master-platform-v2`
**Branch**: `main`
**Stack**: Next.js-style monorepo (Vite + React), Supabase/Postgres, Turborepo, Tailwind CSS
**Apps**: `apps/web` (main app), `apps/procoach` (coach portal), `apps/partner-portal` (partner portal)
**Packages**: `packages/features` (shared hooks + contexts), `packages/types` (DB types), `packages/supabase` (migrations + client), `packages/ui` (shared components)

---

## Current State (What's Already Built)

### Authentication & Authorization
- Supabase auth with custom `AuthProvider` context
- Roles loaded from `user_roles` table (player, coach, admin)
- Role-based route protection via `ProtectedRoute` component

### Public Pages
- Landing page, Services, Audit/Browse, Checkout, Contact, FAQ, Events
- **EliteGBB Intake Form** (`/elitegbb`): 9-step wizard that creates auth user + player profile + intake submission + Stripe service order

### Player Dashboard (11 pages, all wired to Supabase)
- Overview, Profile, Profile Optimizer, Readiness Score, Services & Order Detail, Player Portal, One-Pager, Class Tracking, Film Index (full inline CRUD), Analytics (from `player_game_stats`), Resources, Parent Center

### ConnectGBB Community (social features)
- Feed with posts + likes (now correctly queries `community_likes` table, uses real `member_profiles.role` instead of hardcoded `'player'`)
- Training hub, Connections, Messages (N+1 query fixed, unread counts working), Member profiles (real connection/post counts)

### Coach Portal
- Dashboard, Prospect Search (now fetches real `coach_profile_id`), Shortlist, Events, Player Evaluation (referral notes persisted to `coach_referral_notes`), Prospect Comparison

### Admin Pages (all with full CRUD modals)
- Overview, Leads, Orders, Evaluations, Players, Player Detail, Training Content (with file upload to Supabase Storage), Intake Submissions, Community Feed moderation
- **NIL sub-section**: Companies, Opportunities, Athlete Profiles, Outreach, Compliance, Tasks — each with add/edit/delete modals

### Backend Quality Improvements (already applied)
- All hooks have proper error handling, loading states, AbortControllers for race conditions
- Hardcoded email fallback removed from AuthContext
- 16 hooks fixed across loading-on-error, data-loss, N+1 query, hardcoded-mock issues
- Comprehensive audit migration created (`20260531000000_audit_fixes.sql`): adds FK ON DELETE actions, 30+ indexes, missing CHECK constraints, missing RLS policies, fixes column types (followers → integer, dob → date), fixes coach_saved_players RLS

---

## Phase 1: Immediate Requirements (Do First)

### 1.1 Run All Database Migrations
Run every migration file in `packages/supabase/migrations/procoach/migrations/` **in timestamp order** in the Supabase SQL Editor. Run each one individually. If any fail, report the error — the fix migration (`20260531`) assumes earlier ones ran.

The full sorted list is in `HANDOFF.md` at the repo root. Approximately 15 migration files total.

### 1.2 Verify CRUD Works End-to-End
After migrations, click through every admin and NIL page in the browser:
- Create a record → does it appear in the table and in Supabase dashboard?
- Edit a record → do changes persist after page reload?
- Delete a record → does it disappear from table and database?
- Check browser console for 404 errors on `supabase.from('table_name')` — those mean the table doesn't exist yet.

### 1.3 Create Supabase Storage Buckets
In Supabase dashboard → Storage → Create two public buckets:
- `training-thumbnails`
- `training-videos`

Without these, the admin training page's file upload buttons will silently fail.

### 1.4 Remaining Low-Priority Pages
- `AdminAuditsPage.tsx` — currently read-only; add CRUD modals or document as intentionally read-only
- `AdminReportsPage.tsx` — currently a "Coming Soon" placeholder; either build or remove

### 1.5 Seed Meaningful Demo Data
The app feels empty without data. Create seed SQL files for:
- A few sample community posts (linked to a real auth user)
- Training videos in each category
- A sample player profile that's "complete" (all fields filled)
- Sample NIL companies, opportunities, compliance items

---

## Phase 2: Architecture — Hoop With Her Media Platform

After the immediate cleanup above, build the white-label sports media platform. This is the primary product vision.

### Required Capabilities (in priority order)
1. **Live channels** for events, games, showcases
2. **Linear 24/7 channels** from scheduled playlists (VOD assets playing on a schedule)
3. **VOD library** with on-demand content
4. **FAST-style channels** with SCTE-35 ad markers
5. **EPG/program guide** generation and delivery (JSON feed for Roku, etc.)
6. **White-label embeddable video player** with per-site/channel branding
7. **Custom domain CNAME mapping** for many websites (no hard cap)
8. **HLS/M3U8 output** for live and linear channels
9. **Ads monetization** via VAST/VMAP ad tag URLs
10. **Analytics**: views, watch time, concurrency, per-channel and per-asset stats
11. **Roku channel integration** consuming HLS + EPG feeds
12. **CloudFront CDN** distribution

### What Your Architecture Must Include

**Do NOT punt to a third-party SaaS (Mux, JW Player, Viloud) as the primary architecture.** External services can supplement, but the core scheduling, playlist composition, manifest generation, EPG output, and ad-marker handling must be under our control in this repo.

#### New Database Tables (Supabase/Postgres)
Design and create tables for:
- `media_channels` — id, slug, name, type (live/linear/vod), status, branding config (logo, colors), custom domain, CNAME target
- `media_assets` — id, title, description, duration_seconds, storage_path (S3/CloudFront URL), thumbnail_url, status, category, tags
- `channel_schedules` — id, channel_id, asset_id, scheduled_start, scheduled_end, position, repeat (daily/weekly/none)
- `ad_slots` — id, channel_id, position (pre/mid/post), duration_seconds, ad_tag_url (VAST/VMAP), scte35_cue
- `epg_programs` — id, channel_id, asset_id, start_time, end_time, title, description, metadata (JSON)
- `analytics_events` — id, channel_id, asset_id, viewer_id, event_type (play/pause/stop/heartbeat), timestamp, watch_seconds
- `white_label_tenants` — id, name, slug, custom_domain, cname_target, player_branding (JSON), status

#### New Services (in-repo, under `/services/`)
- **`/services/playlist-engine`** — Composes 24/7 linear playlists from VOD assets based on `channel_schedules` table. Outputs HLS/M3U8 manifests. Handles catch-up and restart logic.
- **`/services/epg-generator`** — Reads channel schedules, outputs JSON EPG feed consumable by Roku and other clients. URL pattern: `/api/epg/channels`, `/api/epg/programs?channel_id=X&date=YYYY-MM-DD`.
- **`/services/ad-insertion`** — Injects SCTE-35 markers into HLS manifests at ad_slot positions. Resolves VAST/VMAP ad tags.
- **`/services/analytics-ingester`** — Accepts analytics events from players, aggregates per-channel/per-asset stats, exposes via API.

#### New API Routes (in `apps/web`)
- `GET /api/channels` — list all channels
- `GET /api/channels/[id]/manifest` — returns HLS M3U8 playlist
- `POST /api/channels/[id]/schedule` — upsert schedule
- `GET /api/epg/programs?channel_id=X&date=YYYY-MM-DD` — EPG feed JSON
- `GET /api/player/config/[channel_slug]` — returns player branding config + ad tags
- `POST /api/analytics/ingest` — accepts analytics heartbeat events
- `POST /api/analytics/query` — returns aggregated stats

#### Roku Integration
- Roku app consumes HLS/M3U8 from CloudFront URL pattern: `https://cdn.hoopwithher.com/channels/{channel_id}/live.m3u8`
- Roku app consumes EPG feed JSON from: `https://api.hoopwithher.com/api/epg/programs?channel_id=X&date=YYYY-MM-DD`
- Implementing the Roku app itself is out of scope, but the feed contract must be documented (JSON schema, URL conventions, caching headers)

#### SCTE-35 / FAST Requirements
- SCTE-35 cues must be surfaced in HLS manifests as `#EXT-X-DATERANGE` tags with `SCTE-35-CMD` or `SCTE-35-OUT`/`SCTE-35-IN` attributes
- EPG generator must produce schedules that mark ad breaks with program boundaries
- Ad decisioning happens at the playlist-engine layer (server-side) — not in the player

### Phased Roadmap

**Phase 1 (Weeks 1-2): Foundation**
- Run all migrations, verify CRUD, create storage buckets
- Seed demo data
- Create `media_channels`, `media_assets`, `channel_schedules` tables
- Build `/services/playlist-engine` — basic linear schedule → HLS output
- Build `GET /api/channels` and `GET /api/channels/[id]/manifest`

**Phase 2 (Weeks 3-4): EPG & Ads**
- Create `ad_slots`, `epg_programs` tables
- Build `/services/epg-generator` — JSON EPG feed
- Build `/services/ad-insertion` — VAST/VMAP tag resolution + SCTE-35 manifest markers
- Build Roku feed endpoints

**Phase 3 (Weeks 5-6): Analytics & White-Label**
- Create `analytics_events`, `white_label_tenants` tables
- Build `/services/analytics-ingester`
- Build white-label player config endpoint
- Implement custom domain CNAME mapping

**Phase 4 (Weeks 7-8): Polish & Migration**
- Admin UI for channel/schedule/asset management
- Dashboard for analytics
- Migrate any existing TVBossFire channels to our own scheduler
- Load testing and CDN optimization

### Guardrails & Tradeoffs

| Decision | Recommendation | Why |
|----------|---------------|-----|
| Transcoding | Use Cloudflare Stream or AWS Elemental MediaConvert initially | Build custom transcoder only if volume justifies it |
| Playout engine | **Build in-repo** (`/services/playlist-engine`) | Core differentiator; must control scheduling logic |
| CDN | CloudFront (existing) | Already integrated; supports HLS, SCTE-35 passthrough |
| Player | Use HLS.js (open source) wrapped in white-label React component | Full control over branding, ad integration, analytics |
| Analytics | **Build in-repo** (Postgres-based, aggregated periodically) | Avoid per-event SaaS costs at scale |
| EPG | **Build in-repo** | Simple JSON generator from DB schedules |
| Roku | Feed contract only (no Roku app code) | Roku app is a separate concern |
| TVBossFire migration | Phase 4, after playlist-engine is validated | De-risk by running in parallel initially |

### Key Technical Decisions

1. **HLS manifest composition** happens in `/services/playlist-engine` — not at the encoder. The encoder outputs segmented HLS (TS or fMP4). The playlist engine arranges segments into linear schedules.
2. **SCTE-35 markers** are stored as metadata on `ad_slots` and injected into manifests as `#EXT-X-DATERANGE` tags — not spliced at the encoder.
3. **EPG output** is static JSON generated on schedule changes and cached. It does not require a live query per request.
4. **Analytics** are ingested as raw events into Postgres, then aggregated hourly into summary tables. The raw events table is partitioned by month and periodically archived.

---

## Communication Expectations

- All work must be committed to the `main` branch with clear commit messages
- `turbo build` must pass before any push
- Supabase dashboard changes (migrations, storage buckets, RLS) must be documented in migration files, not done ad-hoc
- If a migration fails, stop and report — do not modify migration SQL without approval
- Before building new features, verify the existing tests/build still pass
- Prefer in-repo implementation over external SaaS unless explicitly approved

---

## Reference Files

- `HANDOFF.md` — Full session history, known issues, commit log
- `packages/supabase/migrations/procoach/migrations/` — All DB migrations
- `apps/web/src/pages/admin/` — Admin page CRUD patterns
- `packages/features/src/` — Shared hooks and contexts

Start with Phase 1 (migrations → verify → seed), then move to the media platform architecture.
