# GAP_ANALYSIS

Legend: `BUILT` / `PARTIAL` / `MISSING` / `BROKEN` / `BELONGS_IN_OTHER_REPO` / `LATER`

| MVP Feature | Status | Evidence |
|---|---|---|
| Public marketing site | BUILT | Public routes and marketing pages in `apps/web/src/App.tsx` + `apps/web/src/pages/public/*`. |
| Events listing and registration | PARTIAL | Event pages exist (`/dashboard/events`, `/coach/events`) but no payment/registration backend/API route implementation found. |
| Player profiles / recruiting | PARTIAL | Profile pages and `ProfileCard` CRUD hooks exist, plus recruiting readiness page; full recruiting workflow package exports appear minimal. |
| ConnectGBB member platform | PARTIAL | `packages/features/src/connectgbb/index.ts` exists, but no visible connected route surface in `apps/web` for a full member platform. |
| HoopWithHer TV / media section | MISSING | No dedicated TV/media routes/pages located. |
| Admin dashboard | BUILT | `/admin`, `/admin/leads`, `/admin/orders`, `/admin/audits`, `/admin/players` routes with admin role-gated `ProtectedRoute`. |
| Supabase auth and RLS | PARTIAL | Supabase auth integrated; RLS appears in SQL migration set but migration coverage is scoped to current SQL files and not fully validated end-to-end here. |
| Stripe or payment integration | PARTIAL | Checkout route/page exists, DB type includes `stripe_checkout_session_id`, but no Stripe SDK/webhook/server integration files found. |
| Email/notifications | PARTIAL | Notifications appear in SQL policy/index migration references, but no email provider/service integration found. |
| HWH Elite arm | LATER | Brand/feature references exist in copy, but no isolated product area named HWH Elite in route/app structure. |
| Agent command center (`AGENTS.md`, `CROSS_REPO_MAP.md`, `MVP_SPEC.md`) | PARTIAL | `CROSS_REPO_MAP.md` now exists; `AGENTS.md` + `MVP_SPEC.md` are currently missing in this repo. |

## Broken / risk hotspots
1. Placeholder image API paths in browse cards (`/api/placeholder/150/150`) with no matching API route in Vite app -> likely broken images at runtime.
2. `apps/procoach` is mostly placeholder links (`href: '#'`) and not feature-complete for MVP areas.
3. No unified server API layer; apps rely on direct client Supabase calls or separate Python backends.
