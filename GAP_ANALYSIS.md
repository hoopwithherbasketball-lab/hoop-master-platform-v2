# GAP_ANALYSIS

Legend: `BUILT` / `PARTIAL` / `MISSING` / `BROKEN` / `BELONGS_IN_OTHER_REPO` / `LATER`

| MVP Feature | Status | Evidence |
|---|---|---|
| Public marketing site | BUILT | Public routes defined in `apps/web/src/App.tsx` (`/`, `/services`, `/workshops`); UI implemented in `apps/web/src/pages/public/*`. |
| Events listing and registration | PARTIAL | UI routes exist at `/dashboard/events` (`apps/web/src/pages/dashboard/EventsPage.tsx`); missing dedicated backend registration logic in `packages/supabase/migrations/*`. |
| Player profiles / recruiting | PARTIAL | Profile UI exists in `packages/features/src/crm/components/ProfileCard.tsx`; recruiting package is a placeholder `packages/features/src/recruiting/index.ts`. |
| ConnectGBB member platform | MISSING | Package is a placeholder packages/features/src/connectgbb/index.ts; no explicit connectgbb route appears in apps/web/src/App.tsx. |
| HoopWithHer TV / media section | MISSING | No TV/media route entry in `apps/web/src/App.tsx`; no matching pages under `apps/web/src/pages/`. |
| Admin dashboard | BUILT | Admin routes (`/admin`, `/admin/leads`, `/admin/orders`) defined in `apps/web/src/App.tsx` and implemented in `apps/web/src/pages/admin/*`. |
| Supabase auth and RLS | PARTIAL | Client setup in `packages/supabase/src/index.ts`; Auth context in `packages/features/src/crm/contexts/AuthContext.tsx`; incomplete RLS policy coverage across feature tables. |
| Stripe or payment integration | PARTIAL | Checkout UI exists (`apps/web/src/pages/public/CheckoutPage.tsx`); `stripe_checkout_session_id` in `packages/types/src/database.ts`; missing webhook logic. |
| Email/notifications | PARTIAL | Notification DB schema referenced; missing email provider integration components or trigger functions. |
| HWH Elite arm | LATER | Deferred. No feature module in `packages/features/src/*` or route group in `apps/web/src/App.tsx`. |
| Agent command center (`AGENTS.md`, `CROSS_REPO_MAP.md`, `MVP_SPEC.md`) | BUILT | Foundation command-center docs present at repo root (`AGENTS.md`, `CROSS_REPO_MAP.md`, `MVP_SPEC.md`). |

## Agent Command Center Gap Status

| Area | Status | Files Added | Remaining Gap | Next Phase |
|---|---|---|---|---|
| Agent registry | BUILT | `agents/registry.json` | Keep entries synchronized with future agent files | Phase 6 |
| Agent definitions | BUILT | agents/overseer.md .. agents/release-manager.md (20 files) | Convert instruction agents into executable runtimes later | Phase 6+ |
| Prompt packs | BUILT | `prompt-packs/01_phase_1_bootstrap_target_docs.prompt.md` .. `prompt-packs/11_phase_11_evaluations.prompt.md` | Add per-phase acceptance test templates | Phase 3+ execution |
| Phase gates | BUILT | `AGENT_PHASE_GATES.md` | Add gate evidence checklist templates | Phase 3 |
| Codex dispatch rules | BUILT | `CODEX_TASK_DISPATCH_RULES.md` | Automate rule validation in CI later | Phase 5 |
| GitHub agent tools | BUILT | `GITHUB_AGENT_TOOLS.md` | Implement runtime API tooling later | Phase 6+ |
| Gemini review workflow | BUILT | `GEMINI_REVIEW_WORKFLOW.md` | Add standardized rubric templates | Phase 5 |
| Operating model | BUILT | `AGENT_OPERATING_MODEL.md`, `AGENTS.md` | Add runbook examples for each handoff | Phase 5 |
| Target repo audit | BUILT | `REPO_AUDIT.md`, `FEATURE_REGISTRY.md` | Map identified gaps to legacy code retrieval. | Phase 3 |
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
