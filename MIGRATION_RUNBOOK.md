# Migration Runbook — Hoop With Her Platform

Step-by-step guide to run all database migrations in Supabase.

## Prerequisites

1. Supabase project created at [supabase.com](https://supabase.com)
2. SQL Editor access (Dashboard → SQL Editor)
3. Storage access (Dashboard → Storage)

## Step 1: Run Migrations

Go to **Dashboard → SQL Editor** and run each migration as a separate query, in order:

1. `20260409031506_fix_unused_indexes.sql`
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
16. `20260601000000_seed_demo_data.sql`
17. `20260602000000_create_media_platform_tables.sql`

**How to run each:**
1. Open the migration file in a text editor
2. Copy the entire contents
3. Paste into the SQL Editor
4. Click "Run" (or press Ctrl+Enter)
5. Verify "Success" message — if error, stop and report

## Step 2: Create Storage Buckets

Go to **Dashboard → Storage → New Bucket** and create:

| Bucket Name | Public | Purpose |
|-------------|--------|---------|
| `training-thumbnails` | Yes | Training video thumbnails |
| `training-videos` | Yes | Training video files |
| `media-assets` | Yes | Channel media assets |

## Step 3: Create Environment File

Copy `.env.example` to `.env` in the repo root:

```bash
cp .env.example .env
```

Fill in your Supabase credentials:

```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

Find these in **Dashboard → Settings → API**.

## Step 4: Verify

```bash
npm install
npx turbo dev --filter=web
```

Open http://localhost:5173 and verify:
- [ ] `/watch` shows 4 channels with thumbnails
- [ ] `/watch/hoop-with-her-live` loads the player
- [ ] `/admin/channels` shows channel list
- [ ] `/admin/assets` shows asset list
- [ ] `/admin/schedules` shows schedule entries
- [ ] `/admin/analytics` shows empty analytics (no views yet)

## Troubleshooting

| Error | Fix |
|-------|-----|
| "relation does not exist" | Migration not run — check order |
| "permission denied" | RLS policy missing — check migration 10 |
| "new row violates row-level security" | Not logged in as admin — check user_roles |
| Storage upload fails | Bucket not created — Step 2 |
| Blank pages | Check .env file — Step 3 |
