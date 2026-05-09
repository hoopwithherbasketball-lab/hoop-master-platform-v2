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
- Additional backend code exists as Python stubs/services under `apps/partner-portal/backend` and `apps/player-advantage/backend`.

## 2) All routes and pages
- `apps/web` routes are explicitly defined in `apps/web/src/App.tsx`.
  - Public: `/`, `/services`, `/recruiting-readiness`, `/nil-readiness`, `/audit`, `/browse`, `/workshops`, `/ui-test`, `/checkout/:slug`, `/login`, `/signup`.
  - Authenticated dashboard: `/dashboard`, `/dashboard/profile`, `/dashboard/profile/optimizer`, `/dashboard/readiness`, `/dashboard/events`, `/dashboard/services`, `/dashboard/services/:orderId`, `/dashboard/services/:orderId/intake`, `/dashboard/resources`, `/dashboard/parent`.
  - Coach: `/coach`, `/coach/search`, `/coach/shortlist`, `/coach/events`.
  - Admin + NIL: `/admin`, `/admin/leads`, `/admin/orders`, `/admin/audits`, `/admin/players`, `/nil`, `/nil/companies`, `/nil/opportunities`, `/nil/athletes`, `/nil/outreach`, `/nil/compliance`, `/nil/tasks`.
- `apps/procoach`: currently single-page marketing shell, no route table beyond BrowserRouter wrapper.
- `apps/partner-portal`: single-page auth shell, no route table.

## 3) Components
- Web app layout/UI components under `apps/web/src/components/*`.
- Most auth/profile domain components are shared from `packages/features/src/crm/components/*`.
- Shared presentational UI in `packages/ui/src/components/*`.

## 4) API routes / server actions
- No Next.js-style API routes or server actions detected.
- Frontend calls Supabase directly from client-side contexts/hooks.
- Separate Python backend entrypoint present: `apps/partner-portal/backend/server.py`.

## 5) Supabase / database setup
- Supabase client is centralized in `packages/supabase/src/index.ts` and re-exported in `apps/web/src/lib/supabase.ts`.
- Env vars required: `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`; missing vars throw at startup.
- SQL migrations currently present under `packages/supabase/migrations/procoach/migrations/*`.

## 6) Auth system
- Auth provider/context from `packages/features/src/crm/contexts/AuthContext.tsx`.
- Uses Supabase auth session + `user_roles` table lookup.
- Route protection via `ProtectedRoute` component with optional role (`admin`) checks.

## 7) Forms
- Login/Signup forms in `packages/features/src/crm/components/LoginForm.tsx` and `SignupForm.tsx`.
- Editable player profile form in `ProfileCard.tsx`.
- Service intake flow page exists in `apps/web/src/pages/dashboard/ServiceIntakePage.tsx`.

## 8) Admin/dashboard features
- Admin pages exist and are role-gated (`/admin/*`).
- Dashboard pages exist for profile, readiness, services, resources, parent center.
- NIL admin workflow pages exist (`/nil/*`).

## 9) Deployment config
- Build orchestration via `turbo build`.
- App-level builds:
  - `web`: `tsc && vite build`
  - `procoach`: `vite build`
  - `partner-portal`: `craco build`
- No explicit IaC/deployment manifests (e.g., Vercel/Netlify/GHA deploy workflow) identified in repo root.

## 10) Broken imports or build issues
- `npm run build` succeeds across workspaces.
- Warning in `web` build: bundle chunk exceeds 500 kB threshold (optimization warning, not hard failure).
- Potential runtime placeholder issue: `/api/placeholder/150/150` image paths in browse cards without corresponding API route in Vite app.

## 11) Placeholder/stub pages
- `apps/procoach/src/App.tsx` contains `href: '#'` CTA links and feature cards only (marketing stub).
- `apps/web/src/pages/public/BrowsePage.tsx` uses placeholder image paths.
- `apps/partner-portal/src/App.js` is a basic auth shell with limited feature surface.
