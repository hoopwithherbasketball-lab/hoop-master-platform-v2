# REPO_AUDIT

## Scope audited
- Monorepo root with primary product surfaces in `apps/web`, `apps/procoach`, `apps/partner-portal`, shared packages in `packages/*`.

## 1) Framework and package manager
- Monorepo tool: Turborepo (`turbo.json`, root scripts).
- Workspace package manager: npm workspaces (`packageManager: npm@10.0.0`).
- Frontend frameworks:
  - `apps/web`: React + TypeScript + Vite.
  - `apps/procoach`: React + TypeScript + Vite.
  - `apps/partner-portal`: React (CRA via CRACO, JS).
- Additional backend code exists under `apps/partner-portal/backend` and `apps/player-advantage/backend`.

## 2) All routes and pages
- `apps/web` routes are defined in `apps/web/src/App.tsx`:
  - Public: `/`, `/services`, `/recruiting-readiness`, `/nil-readiness`, `/audit`, `/browse`, `/workshops`, `/ui-test`, `/checkout/:slug`, `/login`, `/signup`.
  - Dashboard: `/dashboard`, `/dashboard/profile`, `/dashboard/profile/optimizer`, `/dashboard/readiness`, `/dashboard/events`, `/dashboard/services`, `/dashboard/services/:orderId`, `/dashboard/services/:orderId/intake`, `/dashboard/resources`, `/dashboard/parent`.
  - Coach: `/coach`, `/coach/search`, `/coach/shortlist`, `/coach/events`.
  - Admin + NIL: `/admin`, `/admin/leads`, `/admin/orders`, `/admin/audits`, `/admin/players`, `/nil`, `/nil/companies`, `/nil/opportunities`, `/nil/athletes`, `/nil/outreach`, `/nil/compliance`, `/nil/tasks`.
- `apps/procoach`: BrowserRouter-wrapped single screen in `apps/procoach/src/App.tsx`.
- `apps/partner-portal`: single-screen auth shell in `apps/partner-portal/src/App.js`.

## 3) Components
- Web layout/UI components: `apps/web/src/components/layout/*`, `apps/web/src/components/ui/*`.
- Shared CRM components: `packages/features/src/crm/components/*`.
- Shared UI package components: `packages/ui/src/components/*`.

## 4) API routes / server actions
- No Next.js API routes/server actions found.
- Frontends call Supabase from client-side context/hooks.
- Python backend entrypoint exists at `apps/partner-portal/backend/server.py`.

## 5) Supabase / database setup
- Shared Supabase client: `packages/supabase/src/index.ts`.
- Web client re-export: `apps/web/src/lib/supabase.ts`.
- Required env vars: `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY` (throws if missing).
- SQL migrations present under `packages/supabase/migrations/procoach/migrations/*`.

## 6) Auth system
- Auth context/provider in `packages/features/src/crm/contexts/AuthContext.tsx`.
- Role lookup via `user_roles` table.
- Route protection via `packages/features/src/crm/components/ProtectedRoute.tsx` (used throughout `apps/web/src/App.tsx`).

## 7) Forms
- Auth forms: `packages/features/src/crm/components/LoginForm.tsx`, `SignupForm.tsx`.
- Profile form/edit flow: `packages/features/src/crm/components/ProfileCard.tsx`.
- Intake page: `apps/web/src/pages/dashboard/ServiceIntakePage.tsx`.

## 8) Admin/dashboard features
- Admin routes/pages: `apps/web/src/pages/admin/*` + corresponding route bindings in `apps/web/src/App.tsx`.
- Dashboard routes/pages: `apps/web/src/pages/dashboard/*`.
- NIL admin routes/pages: `apps/web/src/pages/nil/*`.

## 9) Deployment config
- Top-level build orchestration: `turbo.json` and root `package.json` scripts.
- App builds:
  - `apps/web/package.json`: `tsc && vite build`.
  - `apps/procoach/package.json`: `vite build`.
  - `apps/partner-portal/package.json`: `craco build`.
- No explicit deploy workflow/manifests detected in repository root.

## 10) Broken imports or build issues
- `npm run build` succeeds across workspaces.
- Web build emits a non-failing chunk-size warning (>500kB minified).
- Potential runtime image issue: `apps/web/src/pages/public/BrowsePage.tsx` uses `/api/placeholder/150/150` without a matching Vite API route.

## 11) Placeholder/stub pages and modules
- `apps/procoach/src/App.tsx` uses `href: '#'` links and functions as a shell.
- `apps/partner-portal/src/App.js` is minimal auth shell UI.
- Placeholder feature modules:
  - `packages/features/src/connectgbb/index.ts`
  - `packages/features/src/recruiting/index.ts`
  - `packages/features/src/nil/index.ts`
  - `packages/features/src/coaching/index.ts`

## 12) Agent command center docs
- Present at repo root: `AGENTS.md`, `CROSS_REPO_MAP.md`, `MVP_SPEC.md`, `REPO_AUDIT.md`, `GAP_ANALYSIS.md`, `IMPLEMENTATION_PLAN.md`.
