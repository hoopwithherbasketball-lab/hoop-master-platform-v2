# CODEX_TASK_DISPATCH_RULES

- Dispatcher selects phase-appropriate prompt-pack and repo context.
- No implementation phase starts until required docs/audits are present and Overseer has unlocked the phase.
- During planning phases, documentation-only outputs are enforced.
- During implementation phases, only phase-authorized target paths may be modified.
- Out-of-phase requests must be escalated to Overseer.


## Overseer authority during implementation
During unlocked implementation phases, Dispatcher routes scoped tasks while Overseer can approve, block, or reroute work based on gate status and review outcomes.

## Phase 6 Dispatch Rule
- `phase_6_mcp_agent_command_center` is planning-only.
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
