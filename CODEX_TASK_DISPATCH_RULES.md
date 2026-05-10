# CODEX_TASK_DISPATCH_RULES

This PR is the dispatch-rule foundation.

- Dispatcher selects phase-appropriate prompt-pack and repo context.
- No implementation phase starts until required docs/audits are present and Overseer has unlocked the phase.
- During planning phases, documentation-only outputs are enforced.
- During implementation phases, only phase-authorized target paths may be modified.
- Out-of-phase requests must be escalated to Overseer.
