# IMPLEMENTATION_PLAN

## Constraints applied
- No product app code changes in planning/audit/guardrail phases.
- No route/component/schema changes outside unlocked implementation scope.
- No production infrastructure changes without explicit approval.

## Agent Command Center Status

The Agent Command Center currently defines the operating model, agents, phase gates, prompt packs, and review workflow.

Runtime implementation remains future work.

Current persistent status:

- Agent definitions: documented
- Prompt packs: documented
- Phase gates: documented
- GitHub tool policy: documented
- Gemini review workflow: documented
- MCP server runtime: not implemented
- OpenAI Agents SDK runner: not implemented
- GitHub API tooling: not implemented
- Supabase tooling: not implemented
- Product feature implementation: begins only after required audit/planning phases are complete

## Phase 6 Scope

Phase 6 is not product implementation.

Phase 6 mode:

`command_center_tooling`

Phase 6 may modify command-center tooling only, such as:

- `packages/hwh-mcp-server/**`
- `packages/hwh-agent-runner/**`
- `agents/**`
- `prompt-packs/**`
- `AGENT_OPERATING_MODEL.md`
- `AGENT_PHASE_GATES.md`
- `CODEX_TASK_DISPATCH_RULES.md`
- `GITHUB_AGENT_TOOLS.md`
- `GEMINI_REVIEW_WORKFLOW.md`
- `MCP_SETUP.md`
- `AGENT_COMMAND_CENTER_README.md`
- `AGENT_COMMAND_CENTER_CHANGELOG.md`

Phase 6 must not modify:

- product app routes
- product app UI components
- product feature logic
- product database schema
- production infrastructure
- production secrets

Product/app implementation begins at Phase 7.

## Next phase guidance
1. Complete or refresh bootstrap documentation quality gates.
2. Confirm target monorepo audit evidence is current.
3. Proceed with phase dispatch strictly by canonical phase IDs in `CROSS_REPO_PHASES.md`.
