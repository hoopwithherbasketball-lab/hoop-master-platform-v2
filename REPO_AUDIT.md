# REPO_AUDIT

## Scope audited
- Monorepo root with primary product surfaces in `apps/web`, `apps/procoach`, `apps/partner-portal`, `apps/player-advantage`, and shared packages in `packages/*`.

## 1) Framework and package manager
- **Root files**: `package.json`, `turbo.json`.
- **Package manager**: npm workspaces (`packageManager: npm@10.0.0`).
- **Turbo config**: `turbo.json` configures build, lint, dev pipelines.
- **Frontend frameworks**:
  - `apps/web`: React + TypeScript + Vite.
  - `apps/procoach`: React + TypeScript + Vite.
  - `apps/partner-portal`: React (CRA via CRACO, JS).
- **Backend frameworks**:
  - Python backend at `apps/partner-portal/backend/server.py`.
  - Python models at `apps/player-advantage/backend/models.py`.
- **Missing components**:
  - `apps/player-advantage-app` (Not found).

## 2) All routes and pages
- **apps/web** routes are defined in `apps/web/src/App.tsx`:
  - Public: `/`, `/services`, `/recruiting-readiness`, `/nil-readiness`, `/audit`, `/browse`, `/workshops`, `/ui-test`, `/checkout/:slug`, `/login`, `/signup`.
  - Dashboard: `/dashboard`, `/dashboard/profile`, `/dashboard/profile/optimizer`, `/dashboard/readiness`, `/dashboard/events`, `/dashboard/services`, `/dashboard/services/:orderId`, `/dashboard/services/:orderId/intake`, `/dashboard/resources`, `/dashboard/parent`.
  - Coach: `/coach`, `/coach/search`, `/coach/shortlist`, `/coach/events`.
  - Admin + NIL: `/admin`, `/admin/leads`, `/admin/orders`, `/admin/audits`, `/admin/players`, `/nil`, `/nil/companies`, `/nil/opportunities`, `/nil/athletes`, `/nil/outreach`, `/nil/compliance`, `/nil/tasks`.
- **apps/procoach**: BrowserRouter-wrapped single screen in `apps/procoach/src/App.tsx`.
- **apps/partner-portal**: single-screen auth shell in `apps/partner-portal/src/App.js`.

## 3) Packages / Components
- **packages/features/src/crm**: Active auth and profile UI module (`packages/features/src/crm/components/*`).
- **packages/ui**: Shared UI package components (`packages/ui/src/components/*`).
- **packages/features/src/connectgbb**: Placeholder export only (`packages/features/src/connectgbb/index.ts`).
- **packages/features/src/coaching**: Placeholder export only (`packages/features/src/coaching/index.ts`).
- **packages/features/src/nil**: Placeholder export only (`packages/features/src/nil/index.ts`).
- **packages/features/src/recruiting**: Placeholder export only (`packages/features/src/recruiting/index.ts`).
- **packages/page-builder**: Not found.
- **packages/types**: Shared type definitions including DB models (`packages/types/src/database.ts`).

## 4) API routes / server actions
- **Not found**: No Next.js API routes or server action directories exist. Frontends call Supabase directly from client-side hooks.
- Python backend entrypoint exists in partner-portal; player-advantage contains data models.

## 5) Supabase / database setup
- **Client setup**: `packages/supabase/src/index.ts`. Web client re-export in `apps/web/src/lib/supabase.ts`.
- **Migrations**: SQL migrations present under `packages/supabase/migrations/procoach/migrations/*`.
- **Generated types**: Database types are housed in `packages/types/src/database.ts`.

## 6) Auth setup
- **Context**: `packages/features/src/crm/contexts/AuthContext.tsx`.
- **RBAC**: Route protection via `packages/features/src/crm/components/ProtectedRoute.tsx` used throughout `apps/web/src/App.tsx`. Role lookup via `user_roles` table.

## 7) Forms
- **Auth**: `packages/features/src/crm/components/LoginForm.tsx`, `SignupForm.tsx`.
- **Profile**: `packages/features/src/crm/components/ProfileCard.tsx`.
- **Intake**: `apps/web/src/pages/dashboard/ServiceIntakePage.tsx`.

## 8) Admin/dashboard features
- **Admin**: `apps/web/src/pages/admin/*`.
- **Dashboard**: `apps/web/src/pages/dashboard/*`.
- **NIL**: `apps/web/src/pages/nil/*`.
- **Events**: `apps/web/src/pages/dashboard/EventsPage.tsx` and `apps/web/src/pages/coach/CoachEventsPage.tsx`.

## 9) Deployment config & Env Vars
- **Build scripts**: Orchestrated via `turbo.json` and `package.json` scripts (`tsc && vite build`, `craco build`).
- **Env Vars**: `.env.example` in `apps/web` requires `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`.
- **Deploy Configs**: No explicit deployment manifests (e.g., Dockerfiles, Vercel configs) detected at repo root.

## 10) Placeholder/stub pages and modules
- **`apps/procoach/src/App.tsx`**: Uses `href: '#'` links and functions as a shell.
- **`apps/partner-portal/src/App.js`**: Minimal auth shell UI.
- **API routes**: `apps/web/src/pages/public/BrowsePage.tsx` uses `/api/placeholder/150/150` without a matching Vite API route.

## 11) Agent command center docs
- Present at repo root: `AGENTS.md`, `CROSS_REPO_MAP.md`, `MVP_SPEC.md`, `REPO_AUDIT.md`, `GAP_ANALYSIS.md`, `IMPLEMENTATION_PLAN.md`, `FEATURE_REGISTRY.md`.
