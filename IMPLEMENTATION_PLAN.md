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

Phase 6 builds the MCP + Agent Command Center tooling.

Allowed Phase 6 work:

- command-center MCP server scaffolding
- agent runner scaffolding
- agent registry updates
- prompt-pack updates
- command-center documentation
- non-product runtime setup

Not allowed in Phase 6:

- product app routes
- product app components
- product database schema
- product feature implementation
- production infrastructure changes

Product/app implementation begins at Phase 7.

## Next phase guidance
1. Complete or refresh bootstrap documentation quality gates.
2. Confirm target monorepo audit evidence is current.
3. Proceed with phase dispatch strictly by canonical phase IDs in `CROSS_REPO_PHASES.md`.
