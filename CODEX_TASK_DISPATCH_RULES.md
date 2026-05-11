# CODEX_TASK_DISPATCH_RULES

This PR is the dispatch-rule foundation.

- Dispatcher selects phase-appropriate prompt-pack and repo context.
- No implementation phase starts until required docs/audits are present and Overseer has unlocked the phase.
- During planning phases, documentation-only outputs are enforced.
- During Phase 6 (`command_center_tooling`), only command-center tooling changes are authorized (no product/app implementation). Product/app implementation begins at Phase 7.
- During implementation phases (Phase 7+), only phase-authorized target paths may be modified.
- Out-of-phase requests must be escalated to Overseer.
