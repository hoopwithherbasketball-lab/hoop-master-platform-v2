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
- **Phase:** Phase 2: Audit Target Monorepo
- **Status:** COMPLETE

### Completed
- Agent instruction files under `agents/*.md`
- Prompt packs under `prompt-packs/*.prompt.md`
- Phase gates in `AGENT_PHASE_GATES.md`
- Dispatch rules in `CODEX_TASK_DISPATCH_RULES.md`
- GitHub agent tool policy in `GITHUB_AGENT_TOOLS.md`
- Gemini review workflow in `GEMINI_REVIEW_WORKFLOW.md`
- Operating model docs in `AGENT_OPERATING_MODEL.md` and `AGENTS.md`
- Phase 1 expansion of Target Docs (`BRAND_CONTEXT.md`, `MVP_SPEC.md`, `FEATURE_REGISTRY.md`, `CROSS_REPO_MAP.md`, `CROSS_REPO_PHASES.md`)
- **Phase 2 audit of target monorepo (`REPO_AUDIT.md`, `GAP_ANALYSIS.md`, `FEATURE_REGISTRY.md`)**

### Not completed
- Executable MCP server
- Executable OpenAI Agents SDK runner
- GitHub API tool implementation
- Supabase tool implementation
- Pica MCP integration
- Production automation
- App/product feature changes

### Next recommended phase
**Phase 3: Audit Legacy Repo**. The target monorepo gaps have been audited. Agents must now audit `lrevell8-arch/elitegbb` to identify the legacy codebase elements required to fill the gaps.

## Phase 1: Bootstrap target docs
- Create/complete target bootstrap docs and acceptance templates. **(COMPLETED)**

## Phase 2: Audit target monorepo
- Verify actual codebase state against the feature registry. **(COMPLETED)**

## Phase 3: Audit legacy repo
- Identify code to migrate from `lrevell8-arch/elitegbb` and other legacy repositories.

## Phase 4: Cross repo migration plan
- Decide which surfaces remain in this monorepo vs. stay external (`partner-portal`, `player-advantage`).
- Add cross-repo contract docs for shared auth roles, Supabase schema ownership, and deployment responsibilities.

## Phase 5: Agent guardrails
- Define and implement strict agent policies for privacy and security.

## Phase 6: MCP agent command center
- Set up automated tool execution and command center policies.

## Phase 7: Public MVP
- Replace runtime placeholder assets (`/api/placeholder/...`) with local/static assets or valid remote URLs.
- Add CI checks: `turbo build`, lint, and typecheck where available.

## Phase 8: Page builder
- Implement block schemas and rendering logic for the admin dashboard.

## Phase 9: ConnectGBB migration
- Wire `packages/features/src/connectgbb` into routed screens in `apps/web`.

## Phase 10: Data forms
- **Events registration completion**: Define event registration data model in Supabase migrations, implement form persistence and confirmation flow.

## Phase 11: Evaluations
- **Player recruiting workflows**: Expand recruiting package from placeholder exports into concrete flows (search/filter/messaging/readiness signals).

## Future Phases (Post-MVP)
### Revenue + communications
1. Implement Stripe checkout/session creation and webhook fulfillment using secure server endpoint(s).
2. Add transactional notifications (email + in-app) tied to events/orders/profile milestones.
3. Define audit logs for admin actions.

### Deployment readiness
1. Add explicit deployment manifests/workflows per app target.
2. Document environment variable matrix for each app.
3. Set bundle budgets and code-splitting goals to address current large web chunk warning.

## Consistency Fixes Applied
- Removed duplicate misspelled partner portal mapping.
- Standardized execution mode naming on implementation.
- Standardized phase IDs across registry, prompt packs, phase gates, and dispatcher docs.
- Confirmed `CROSS_REPO_PHASES.md` is the canonical source for phase numbering.
