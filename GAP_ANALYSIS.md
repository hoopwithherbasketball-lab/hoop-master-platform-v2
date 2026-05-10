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

## Agent Command Center Gap Status

| Area | Status | Files Added | Remaining Gap | Next Phase |
|---|---|---|---|---|
| Agent registry | BUILT | `agents/registry.json` | Keep entries synchronized with future agent files | Phase 6 |
| Agent definitions | BUILT | `agents/overseer.md`, `agents/prompt-pack.md`, `agents/github-repo-navigator.md`, `agents/github-code-search.md`, `agents/codex-task-dispatcher.md`, `agents/pr-review-coordinator.md`, `agents/ci-workflow.md`, `agents/target-repo-auditor.md`, `agents/legacy-repo-auditor.md`, `agents/cross-repo-migration-architect.md`, `agents/documentation-agent.md`, `agents/frontend-ui.md`, `agents/page-builder.md`, `agents/supabase-data.md`, `agents/forms-crm.md`, `agents/content-brand.md`, `agents/evaluation-scouting.md`, `agents/qa-test.md`, `agents/security-privacy.md`, `agents/release-manager.md` | Convert instruction agents into executable runtimes later | Phase 6+ |
| Prompt packs | BUILT | `prompt-packs/01_bootstrap_target_docs.prompt.md` .. `prompt-packs/11_phase_11_evaluations.prompt.md` | Add per-phase acceptance test templates | Phase 1-11 execution |
| Phase gates | BUILT | `AGENT_PHASE_GATES.md` | Add gate evidence checklist templates | Phase 1 |
| Codex dispatch rules | BUILT | `CODEX_TASK_DISPATCH_RULES.md` | Automate rule validation in CI later | Phase 5 |
| GitHub agent tools | BUILT | `GITHUB_AGENT_TOOLS.md` | Implement runtime API tooling later | Phase 6+ |
| Gemini review workflow | BUILT | `GEMINI_REVIEW_WORKFLOW.md` | Add standardized rubric templates | Phase 5 |
| Operating model | BUILT | `AGENT_OPERATING_MODEL.md`, `AGENTS.md` | Add runbook examples for each handoff | Phase 5 |
| Security/privacy guardrails | PARTIAL | `agents/security-privacy.md`, `AGENTS.md` | Runtime policy enforcement tooling not implemented | Phase 6+ |
| Page Builder Agent planning | PARTIAL | `agents/page-builder.md`, `prompt-packs/08_phase_8_page_builder.prompt.md` | No executable page-builder runtime yet | Phase 8 |
| MCP runtime | NOT_STARTED | None (documentation-only) | Build executable MCP server | Phase 6 |
| Agent runner runtime | NOT_STARTED | None (documentation-only) | Build executable agent orchestrator/runner | Phase 6 |
| GitHub API/MCP integration | NOT_STARTED | Policy docs only | Implement GitHub tool integrations | Phase 6 |
| Supabase MCP integration | NOT_STARTED | Policy docs only | Implement Supabase MCP tooling | Phase 10 |
| Pica MCP integration | NOT_STARTED | Policy docs only | Implement Pica MCP integrations | Later phase |

## Broken / risk hotspots
1. `apps/web/src/pages/public/BrowsePage.tsx` references `/api/placeholder/150/150` images, but no matching API endpoint exists in this Vite app.
2. `apps/procoach/src/App.tsx` uses `href: '#'` feature links and currently acts as a stub shell.
3. Feature packages `connectgbb`, `recruiting`, `nil`, and `coaching` are placeholder descriptors only (`packages/features/src/*/index.ts`).


Guardrails are phase-scoped: docs-only restrictions apply to planning/audit/guardrail/command-center setup phases, not to unlocked implementation phases.


## Guardrail Scope Gap
- **Status:** PARTIAL before this fix, RESOLVED after this fix.
- **Finding:** Initial agent docs made docs-only restrictions appear permanent.
- **Resolution:** Guardrails are now phase-scoped. This PR is documentation-only, while future unlocked implementation phases allow scoped code/schema/UI changes by the correct agents.


## Missing Referenced Docs Gap

Status:
RESOLVED

Finding:
Several required context files were referenced by agent instructions but were not present in the repo or PR.

Resolution:
Added foundation placeholder versions of:
- BRAND_CONTEXT.md
- FEATURE_REGISTRY.md
- CROSS_REPO_PHASES.md

These files will be expanded in later audit/planning phases.


## Phase Naming Consistency Gap

Status: RESOLVED

Finding:
Some docs and registry entries used local implementation phase IDs while `CROSS_REPO_PHASES.md` used global phase numbers 1–11.

Resolution:
All phase IDs, prompt-pack filenames, dispatcher rules, and registry references now follow the canonical 1–11 phase sequence defined in `CROSS_REPO_PHASES.md`.

## Execution Mode Naming Gap

Status: RESOLVED

Finding:
Some registry entries used `review` while others used `implementation_review`.

Resolution:
All review-oriented execution modes now use `implementation_review`.

## Partner Portal Mapping Gap

Status: RESOLVED

Finding:
A misspelled partner-portal source entry duplicated the correctly spelled `HWH-PARTNER-PORTAL` mapping to `apps/partner-portal`.

Resolution:
The misspelled duplicate was removed. Only `HWH-PARTNER-PORTAL` remains.
