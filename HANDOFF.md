# Handoff — hoop-master-platform-v2

## Current State

### Branch
`main` — all latest changes, including the EliteGBB dashboard and new components, are committed and pushed to `origin/main`.

### Build Status
`turbo build` passes (note: use direct node scripts on Windows as turbo binary is broken) — all packages compile. HLS.js loaded via CDN.

### Migrations Status
**Applied in Supabase:** Tables 1–15 partially applied. `REMAINING_MIGRATIONS.sql` ran successfully after fixes.
*Note on local DB:* Local Supabase docker container is currently experiencing connection issues on Windows (`failed to inspect container health`). Ensure Docker Desktop is running as Administrator if you need local DB access, or continue using mock data / static schema analysis.

### Dev Server
Running via `start-dev.bat` or manually:
```cmd
cd apps\web
node ..\..\node_modules\vite\bin\vite.js --host
```

---

## What Was Built (Latest Session)

### EliteGBB Operations & Dashboard
- **Admin Dashboard:** Built `apps/web/src/pages/admin/EliteGBBDashboard.tsx`, a searchable table interface for reviewing coach evaluations, game stats, and intake submissions. Includes real-time fuzzy filtering and recommendation badges.
- **Data Audit:** Generated `EliteGBB_Data_Audit.md` containing structural schema analysis and highlighting the need for `enums` and weighted score validation.
- **SOPs:** Created `docs/sops/EliteGBB_Evaluation_SOP.md` to standardize evaluation metrics (0-10 scoring) and position definitions for scouts and coaches.
- **Marketing Assets:** Drafted `docs/marketing/EliteGBB_Campaign_Assets.md` containing athlete-first email sequences for Intake and Post-Evaluation delivery.
- **New Components:** Added `AcademicPathwaySelector.tsx` and `ProposalBuilder.tsx` directly into the existing React architecture to support new frontend pathways.

### Previous Builds
- **Database (19 migrations applied):** Core tables (profiles, player_profiles), Feature tables (nil, community, events), Media tables (channels, assets, ad_slots). Seed data injected.
- **Backend Services:** `playlist-engine`, `epg-generator`, `ad-insertion`, `analytics-ingester`, `api` (Express).
- **Frontend Pages:** Extensive public and authenticated routes spanning Player Dashboard, Admin, Coach, ConnectGBB, and NIL spaces.

---

## Known Issues

1. **Local Supabase/Docker:** The local database daemon might fail to connect on Windows without elevated privileges.
2. **`turbo` binary broken:** installed as Linux shell script, not Windows .exe. Use `node` directly.
3. **`.env` must be in `apps/web/`:** Vite looks for `.env` relative to the app. `start-dev.bat` handles this.
4. **Data Typing in DB:** Free-text fields in `intake_submissions` need refactoring to `enums` (per the latest data audit) once DB access is restored.

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
```

---

## Next Steps for New Agent
1. **Database Connection:** Troubleshoot local Supabase Docker connection if live data querying is required.
2. **Implement DB Refactors:** Apply the suggestions from `EliteGBB_Data_Audit.md` (convert text fields to `enums`, add weighted formulas) via a new Supabase migration.
3. **Dashboard Integration:** Hook up `EliteGBBDashboard.tsx` to the live Supabase API endpoints instead of using mock data.
4. **Routing:** Ensure `AcademicPathwaySelector.tsx`, `ProposalBuilder.tsx`, and `EliteGBBDashboard.tsx` are properly wired into the `react-router` configuration.
