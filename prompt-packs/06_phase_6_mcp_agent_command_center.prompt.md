# Phase 6: Build MCP + agent command center

## Objective
Execute **Phase 6: Build MCP + agent command center** for the correct repository context.

## Phase Mode

Mode: `command_center_tooling`

## Required behavior
1. Confirm repo context (target vs legacy).
2. Collect evidence with exact file paths.
3. Modify only command-center tooling and documentation paths authorized for this phase.
4. Report blockers, risks, and next handoff.

## Phase-Authorized Paths

During Phase 6, agents may modify only command-center tooling and documentation areas such as:

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
- related command-center docs

## Not Authorized In Phase 6

- product feature logic
- product app routes
- product UI component changes
- product database schema changes
- production infrastructure
- production secrets

## Restrictions

- Hardcoded secrets
- Parent email/phone exposed publicly
- Private evaluation notes exposed publicly
- Private recruiting notes exposed publicly
- Production Supabase migrations without explicit approval
- Real email/SMS sending without explicit approval
- Unrelated app/package changes
- Auto-merge or destructive repo changes
- Runtime dependency additions unless explicitly authorized by the active phase prompt
- Secrets or external service invocation
