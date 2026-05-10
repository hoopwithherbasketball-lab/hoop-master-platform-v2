# CODEX_TASK_DISPATCH_RULES

- Dispatcher selects phase-appropriate prompt-pack and repo context.
- No implementation phase starts until required docs/audits are present and Overseer has unlocked the phase.
- During planning phases, documentation-only outputs are enforced.
- During implementation phases, only phase-authorized target paths may be modified.
- Out-of-phase requests must be escalated to Overseer.

## Overseer authority during implementation
During unlocked implementation phases, Dispatcher routes scoped tasks while Overseer can approve, block, or reroute work based on gate status and review outcomes.

## Phase 6 Dispatch Rule
- `phase_6_mcp_agent_command_center` is a command-center tooling phase, not a product implementation phase.
- Phase 6 may dispatch command-center tooling work only (for example: `packages/hwh-mcp-server/**`, `packages/hwh-agent-runner/**`, `agents/**`, `prompt-packs/**`, and command-center docs).
- Do not dispatch product/app implementation tasks until Phase 7 (`phase_7_public_mvp`).

## Authorized Path Requirement

For implementation phases, the dispatcher must verify that the selected prompt pack contains a `Phase-Authorized Paths` section.

If the section is missing, dispatch is blocked.

This applies to:

- Phase 7: Public MVP Shell
- Phase 8: Page Builder MVP
- Phase 9: ConnectGBB Migration
- Phase 10: Data/Forms Workflows
- Phase 11: Evaluation/Scouting Workflow


## Command-Center Tooling Mode

Phase 6 uses `command_center_tooling`.

The dispatcher may only route Phase 6 tasks to agents whose registry includes `command_center_tooling`.

If a Phase 6 task requires an agent that does not include `command_center_tooling`, dispatch is blocked until the registry and instruction files are aligned.

`command_center_tooling` allows command-center runtime scaffolding and documentation, but it does not allow product/app implementation.
