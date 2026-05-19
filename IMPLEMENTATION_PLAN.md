# IMPLEMENTATION_PLAN

## Constraints applied
- No new application features implemented in this pass.
- Documentation/audit only.

## Operating mode for this PR
- Planning / Documentation Mode only for this PR.
- Implementation Mode activates only when Overseer unlocks phases 7-11 with approved target paths.

## Guardrail Update
The Agent Command Center is currently documentation/instruction-only. Future implementation phases are explicitly allowed to modify scoped code areas once phase gates are unlocked.

Phase implementation permissions are now controlled by:
- `AGENT_PHASE_GATES.md`
- `CODEX_TASK_DISPATCH_RULES.md`
- individual agent instruction files
- Security/Privacy Agent rules
- QA/Test Agent checks

## Foundation Context Docs
This PR includes the expanded foundation docs required by the Agent Command Center:
- `BRAND_CONTEXT.md`
- `MVP_SPEC.md`
- `FEATURE_REGISTRY.md`
- `CROSS_REPO_MAP.md`
- `CROSS_REPO_PHASES.md`

## Current Phase Status
- **Phase:** Phase 4: Cross-Repo Migration Plan
- **Status:** COMPLETE

### Completed
- Agent instruction files under `agents/*.md`
- Prompt packs under `prompt-packs/*.prompt.md`
- Phase gates in `AGENT_PHASE_GATES.md`
- Dispatch rules in `CODEX_TASK_DISPATCH_RULES.md`
- GitHub agent tool policy in `GITHUB_AGENT_TOOLS.md`
- Gemini review workflow in `GEMINI_REVIEW_WORKFLOW.md`
- Operating model docs in `AGENT_OPERATING_MODEL.md` and `AGENTS.md`
- **Phase 1 expansion of Target Docs (`BRAND_CONTEXT.md`, `MVP_SPEC.md`, `FEATURE_REGISTRY.md`, `CROSS_REPO_MAP.md`, `CROSS_REPO_PHASES.md`)**
- **Phase 2 audit of target monorepo (`REPO_AUDIT.md`, `GAP_ANALYSIS.md`, `FEATURE_REGISTRY.md`)**

### Completed in this phase
- `CROSS_REPO_IMPLEMENTATION_PLAN.md` created with repo-role decision, ownership table, implementation sequencing, and risk framing.
- `CROSS_REPO_DEPENDENCIES.md` created with cross-repo dependency matrix.
- `MIGRATION_BACKLOG.md` created with epic-level backlog and PR sizing guidance.
- `GAP_ANALYSIS.md` updated with explicit Phase 4 blocker note for missing Phase 3 artifacts.

### Not completed
- Executable MCP server
- Executable OpenAI Agents SDK runner
- GitHub API tool implementation
- Supabase tool implementation
- Pica MCP integration
- Production automation
- App/product feature changes

### Next recommended phase
**Phase 5: Agent/Codex/Gemini guardrail refinement**. Phase 4 planning is complete; guardrail hardening is next before Phase 6 tooling and Phase 7+ implementation.

## Phase 1: Bootstrap target docs
- Create/complete target bootstrap docs and acceptance templates. **(COMPLETED)**

## Phase 2: Audit target monorepo
- Verify actual codebase state against the feature registry. **(COMPLETED)**

## Phase 3: Audit legacy repo
- Identify code to migrate from `lrevell8-arch/elitegbb` and other legacy repositories.

## Phase 4: Cross repo migration plan
- ✅ Decided external-surface status: `partner-portal` and `player-advantage` remain external/adjacent to the core MVP migration track (with integration contracts only during Phases 7-11).
- ✅ Added cross-repo contract planning docs for shared auth roles, Supabase schema ownership, and deployment responsibilities.

## Phase 5: Agent guardrails
- Define and implement strict agent policies for privacy and security.

## Phase 6: MCP agent command center
- Set up automated tool execution and command center policies.
- Implement custom CI validation scripts (e.g., `scripts/ci/validate-agent-runtime.sh`) to verify artifact presence, filename pairing, and internal structure.

## Phase 7: Public MVP
- Replace runtime placeholder assets (`/api/placeholder/...`) with local/static assets or valid remote URLs.
- Add CI checks: `turbo build`, lint, and typecheck where available.

## Phase 8: Page builder
- Implement block schemas and rendering logic for the admin dashboard.

## Phase 9: ConnectGBB migration
- Wire `packages/features/src/connectgbb` into routed screens in `apps/web`.

## Phase 10: Data forms + payments
- **Events registration completion**: Define event registration data model in Supabase migrations, implement form persistence and confirmation flow.
- **Stripe integration (MVP scope)**: Implement secure checkout session creation, webhook fulfillment, and idempotent order/event reconciliation in target-owned runtime services.

## Phase 11: Evaluations + Media/TV
- **Player recruiting workflows**: Expand recruiting package from placeholder exports into concrete flows (search/filter/messaging/readiness signals).
- **Media/TV section**: Implement route group, content model, and playback integration.

## Future Phases (Post-MVP)
### Revenue + communications
1. Add transactional notifications (email + in-app) tied to events/orders/profile milestones.
2. Define audit logs for admin actions.

### Deployment readiness
1. Add explicit deployment manifests/workflows per app target.
2. Document environment variable matrix for each app.
3. Set bundle budgets and code-splitting goals to address current large web chunk warning.

## Consistency Fixes Applied
- Removed duplicate misspelled partner portal mapping.
- Standardized execution mode naming on implementation.
- Standardized phase IDs across registry, prompt packs, phase gates, and dispatcher docs.
- Confirmed `CROSS_REPO_PHASES.md` is the canonical source for phase numbering.

## Conflict-resolution update (Phase 4 branch consolidation)
- Resolved planning conflicts in `CROSS_REPO_DEPENDENCIES.md` and `MIGRATION_BACKLOG.md` using `run-phase-4-cross-repo-migration-plan-prhg6p` as canonical source.
- Retained admin and media migration epics in the Phase 4 backlog.
- Confirmed this remains documentation/planning-only work with no product code modifications.
