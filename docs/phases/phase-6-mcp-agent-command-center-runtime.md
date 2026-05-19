# Phase 6: MCP Agent Command Center Runtime

## Overview
This document defines the Phase 6 scaffolding for the MCP (Model Context Protocol) and Agent Command Center Runtime. Phase 6 is explicitly a **docs/config-only** setup phase designed to establish runtime boundaries without introducing implementation-level changes.

## Phase 6 Objectives
1. Document the command center runtime structures.
2. Define the configuration for autonomous and manual agent boundaries.
3. Prepare the plain-JSON configurations (`config/agent-runtime.json`) that act as the source of truth for agent execution during development.

## Relationship to Phase 5 Guardrails

Phase 6 does not override Phase 5. All runtime scaffolding must comply with the guardrail policies defined in:

- `config/agent-guardrails.json`
- `docs/agent-guardrails.md`
- `docs/agent-permissions-matrix.md`
- `docs/protected-files-policy.md`

`config/agent-runtime.json` defines runtime behavior, but it must inherit the approval requirements, protected-path restrictions, deployment restrictions, and human-review rules established in Phase 5.

## Constraints & Rules
- **No Dependencies**: Phase 6 strictly prohibits adding new runtime or development dependencies to `package.json`.
- **No Product Code Changes**: This phase focuses exclusively on the orchestration tooling. It does not touch product features, frontend routes, UI blocks, Supabase schemas, or migrations.
- **Config Format**: Configuration files must be plain JSON to remain human- and machine-readable. Tools like TypeScript configuration files, Zod, YAML, or TOML are prohibited.
- **Security**: No secrets, tokens, URLs, or real credentials may be included in the scaffolding.
- **No Autonomous Execution**: All agents remain disabled from executing implementation code autonomously until Phase 7.

## Required Artifacts
The artifacts generated during this phase form the boundary constraints:
- `docs/phases/phase-6-mcp-agent-command-center-runtime.md`: This file.
- `docs/mcp-runtime-boundaries.md`: The definition of how MCP tools are allowed to interact with the system.
- `docs/agent-command-center.md`: Documentation for the orchestration workflow.
- `config/agent-runtime.json`: The machine-readable runtime constraints.

## Exit Criteria

Phase 6 is complete when:

- Runtime boundaries are documented.
- MCP tool permissions are documented.
- Agent Command Center workflow is documented.
- `config/agent-runtime.json` exists and validates as plain JSON.
- No dependencies have been added.
- No product code has been modified.
- No routes, UI, schemas, migrations, secrets, or deployment logic have changed.
- Autonomous execution remains disabled.
- Phase 7 can begin with guardrail-compliant implementation boundaries.

## Handoff to Phase 7
Completion of Phase 6 ensures that the environment is strictly defined, making it safe to proceed to Phase 7 (Build Public MVP Shell), where implementation agents will finally be granted phase-scoped runtime power.
