# GAP_ANALYSIS

Legend: `BUILT` / `PARTIAL` / `MISSING` / `BROKEN` / `BELONGS_IN_OTHER_REPO` / `LATER`

| MVP Feature | Status | Evidence |
|---|---|---|
| Public marketing site | BUILT | Public routes are defined in `apps/web/src/App.tsx` (`/`, `/services`, `/workshops`, etc.) and implemented in `apps/web/src/pages/public/*`. |
| Events listing and registration | PARTIAL | Events UI routes exist at `/dashboard/events` and `/coach/events` in `apps/web/src/App.tsx`, with page files `apps/web/src/pages/dashboard/EventsPage.tsx` and `apps/web/src/pages/coach/CoachEventsPage.tsx`; no dedicated registration API route/server action files found. |
| Player profiles / recruiting | PARTIAL | Profile UI + updates exist via `packages/features/src/crm/components/ProfileCard.tsx` and hooks (`packages/features/src/crm/hooks/*`), while recruiting package is placeholder-only (`packages/features/src/recruiting/index.ts`). |
| ConnectGBB member platform | PARTIAL | `packages/features/src/connectgbb/index.ts` exists but is placeholder-only and no explicit `connectgbb` route appears in `apps/web/src/App.tsx`. |
| HoopWithHer TV / media section | MISSING | No TV/media route entry in `apps/web/src/App.tsx`; no matching page directory/file under `apps/web/src/pages/` for TV/media. |
| Admin dashboard | BUILT | Admin routes (`/admin`, `/admin/leads`, `/admin/orders`, `/admin/audits`, `/admin/players`) are defined in `apps/web/src/App.tsx` and use `ProtectedRoute role="admin"`. |
| Supabase auth and RLS | PARTIAL | Supabase auth is active in `packages/features/src/crm/contexts/AuthContext.tsx`; client setup is in `packages/supabase/src/index.ts`; RLS policy SQL appears in `packages/supabase/migrations/procoach/migrations/20260409031506_fix_unused_indexes_permissive_policies_and_search_path.sql`. |
| Stripe or payment integration | PARTIAL | Checkout UI route exists (`/checkout/:slug` in `apps/web/src/App.tsx`) and page exists (`apps/web/src/pages/public/CheckoutPage.tsx`); DB type contains `stripe_checkout_session_id` in `packages/types/src/database.ts`; no Stripe SDK/webhook implementation files detected. |
| Email/notifications | PARTIAL | Notification policy/index references exist in Supabase migration `packages/supabase/migrations/procoach/migrations/20260409031506_fix_unused_indexes_permissive_policies_and_search_path.sql`; no email provider integration files found. |
| HWH Elite arm | LATER | No dedicated route group or feature module named `elite`/`hwh-elite` in `apps/web/src/App.tsx` or `packages/features/src/*`. |
| Agent command center (`AGENTS.md`, `CROSS_REPO_MAP.md`, `MVP_SPEC.md`) | BUILT | Command-center definition docs are now present at repo root: `AGENTS.md`, `CROSS_REPO_MAP.md`, `MVP_SPEC.md`. |

## Broken / risk hotspots
1. `apps/web/src/pages/public/BrowsePage.tsx` references `/api/placeholder/150/150` images, but no matching API endpoint exists in this Vite app.
2. `apps/procoach/src/App.tsx` uses `href: '#'` feature links and currently acts as a stub shell.
3. Feature packages `connectgbb`, `recruiting`, `nil`, and `coaching` are placeholder descriptors only (`packages/features/src/*/index.ts`).
