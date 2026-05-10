# AGENT_OPERATING_MODEL

## Runtime maturity
- Agents are currently defined as operating-policy and documentation artifacts.
- Executable MCP server/runtime orchestration is planned for the command-center tooling phase.

## Execution Modes

Agents may declare one or more execution modes in `agents/registry.json`.

| Mode | Purpose |
|---|---|
| `planning` | Documentation, audits, mapping, prompt preparation, and phase planning |
| `command_center_tooling` | Phase 6 command-center tooling work, including MCP server scaffolding, agent runner scaffolding, agent registry updates, prompt-pack updates, and command-center docs |
| `implementation` | Scoped product/app implementation work explicitly authorized by an unlocked implementation phase prompt |
| `implementation_review` | Review remediation, Gemini feedback handling, QA/security follow-up, and closure validation within the already-approved phase scope |
| `release` | Final release readiness, release notes, closure summaries, deployment checklist preparation, and post-approval release coordination |

`command_center_tooling` does not authorize product app routes, product UI components, product database schema changes, product feature implementation, production infrastructure changes, or production secrets changes.

## Phase Scope
- Phase 6 uses `command_center_tooling`.
- Phase 6 is not a product implementation phase. It is a Command-Center Tooling phase.
- Phase 6 may create/modify command-center tooling under paths such as `packages/hwh-mcp-server/**`, `packages/hwh-agent-runner/**`, `agents/**`, `prompt-packs/**`, and command-center docs.
- Product/app implementation begins at Phase 7.

## Replacement model (no browser assistant)
- GitHub Repo Navigator replaces browser repo inspection.
- Codex Task Dispatcher replaces manual prompt guessing.
- PR Review Coordinator replaces manual PR review coordination.
- CI/Workflow Agent handles workflow job and step inspection.
