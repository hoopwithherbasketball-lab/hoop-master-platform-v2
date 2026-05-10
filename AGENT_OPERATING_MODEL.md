# AGENT_OPERATING_MODEL

## Runtime maturity
- Agents are currently defined as operating-policy and documentation artifacts.
- Executable MCP server/runtime orchestration is planned for the command-center tooling phase.

## Execution Modes

Agents may declare one or more execution modes in `agents/registry.json`.

Allowed execution modes:

| Mode | Purpose |
|---|---|
| `planning` | Documentation, audits, mapping, prompt preparation, and phase planning |
| `command-center tooling` | Build and modify command-center tooling, MCP servers, and agent runners (Phase 6 only) |
| `implementation` | Scoped implementation work explicitly authorized by an unlocked phase prompt |
| `implementation_review` | Review remediation, Gemini feedback handling, QA/security follow-up, and closure validation within the already-approved phase scope |
| `release` | Final release readiness, release notes, closure summaries, deployment checklist preparation, and post-approval release coordination |

The `release` mode does not authorize auto-merge, auto-deploy, bypassing checks, or production changes without explicit user approval.

## Phase-Scoped Agent Permissions

| Mode Family | Code Changes Allowed? |
|---|---|
| Planning / Documentation phases | No product app code changes |
| Phase 6 command-center tooling phase | Command-center tooling/runtime scaffolding only |
| Phases 7-11 implementation phases | Yes, but only in phase-authorized paths |

Implementation agents may be invoked in `implementation_review` mode only for remediation within already-approved phase scope. This does not unlock new scope.

## Phase 6 Clarification
- Phase 6: Build MCP + Agent Command Center.
- Mode: command-center tooling.
- Phase 6 is not a product implementation phase.
- Phase 6 may create/modify command-center tooling under paths such as:
  - `packages/hwh-mcp-server/**`
  - `packages/hwh-agent-runner/**`
  - `agents/**`
  - `prompt-packs/**`
  - command-center docs
- Phase 6 must not modify product app code, product routes, product UI components, product database schema, or production infrastructure.
- Product/app implementation begins at Phase 7.

## Replacement model (no browser assistant)
- GitHub Repo Navigator replaces browser repo inspection.
- Codex Task Dispatcher replaces manual prompt guessing.
- PR Review Coordinator replaces manual PR review coordination.
- CI/Workflow Agent handles workflow job and step inspection.
