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

`config/agent-runtime.json` defines runtime behavior, but it must inherit the approval requirements, protected-path restrictions, deployment restrictions, and human-review rules established in Phase 5.

## Constraints & Rules
- **No Dependencies**: Phase 6 strictly prohibits adding new runtime or development dependencies to `package.json`.
- **No Product Code Changes**: This phase focuses exclusively on the orchestration tooling. It does not touch product features, frontend routes, UI blocks, Supabase schemas, or migrations.
- **Config Format**: Configuration files must be plain JSON to remain human- and machine-readable. Tools like TypeScript configuration files, Zod, YAML, or TOML are prohibited.
- **Security**: No secrets, tokens, URLs, or real credentials may be included in the scaffolding.
- **No Autonomous Execution**: All agents remain disabled from executing implementation code autonomously until a future approved phase explicitly enables phase-scoped execution under the Phase 5 guardrails.

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

### Phase 6 Completion & Transition Record

The formal Phase 6 closeout and Overseer-governed transition protocol is documented in [`docs/phases/phase-6-completion-and-phase-7-transition.md`](./phase-6-completion-and-phase-7-transition.md). This record consolidates exit-criteria evidence, governance-control verification, and the step-by-step unlock procedure.

### Phase 7 Unlock Is Overseer-Gated

Phase 7 **may not begin** until an authorized Overseer:
1. Reviews and signs the completion record.
2. Updates `config/agent-runtime.json` to reflect `phase: 7` and sets `overseerApprovalRecorded: true` in the `phaseTransition` block.

The machine-readable transition status is tracked in `config/agent-runtime.json` under `phaseTransition`. While `transitionStatus` is not `overseer_approved_ready_for_phase_7` and `overseerApprovalRecorded` is not `true`, Phase 7 remains locked regardless of any other readiness markers.
