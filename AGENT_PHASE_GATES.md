# AGENT_PHASE_GATES

1. Bootstrap target docs
2. Audit target monorepo
3. Audit legacy repo
4. Create cross-repo migration plan
5. Add agent/Codex/Gemini guardrails
6. Build MCP + agent command center
7. Build public MVP shell
8. Build Page Builder MVP
9. Migrate ConnectGBB
10. Build data/forms workflows
11. Build evaluation/scouting workflow

Only Overseer can advance phase after evidence + checklist signoff.

## Guardrail Scope

The docs-only restriction applies to planning/audit/guardrail phases.

Unlocked implementation phases allow scoped changes only within phase-authorized paths and with QA/Test + Security/Privacy review.

## Phase 6 Scope
- Phase 6: Build MCP + agent command center
- Mode: command_center_tooling
- Phase 6 may create or update command-center tooling/runtime scaffolding and docs.
- Phase 6 must not modify product app code, routes, UI components, schema, or production infrastructure.
- Product/app implementation begins at Phase 7.

## Authorized Path Requirement
Implementation prompt packs for Phases 7-11 must define explicit `Phase-Authorized Paths`; otherwise dispatch must be blocked until corrected.


## Phase 6 Gate

Phase 6 unlocks command-center tooling only.

Allowed:
- MCP server scaffolding
- agent runner scaffolding
- registry updates
- prompt-pack updates
- command-center docs
- command-center test/build checks if added by the Phase 6 prompt

Not allowed:
- product app implementation
- product routes
- product UI components
- product database schema
- production infrastructure
- production secrets
