# CODEX_TASK_DISPATCH_RULES

## Foundation status
This PR is the **task-dispatch foundation** for HoopWithHer Agent Command Center operations.

## Dispatch rules
- Codex Task Dispatcher must choose the prompt-pack matching current phase.
- Dispatcher must set repo target explicitly:
  - Target: `hoopwithherbasketball-lab/hoop-master-platform-v2`
  - Legacy: `lrevell8-arch/elitegbb`
- Dispatcher must attach evidence paths for all completion claims.

## Phase-start gate
No implementation phase can begin until required docs and audits are present and approved by Overseer, including at minimum:
- `AGENTS.md`
- `AGENT_PHASE_GATES.md`
- `AGENT_OPERATING_MODEL.md`
- `GAP_ANALYSIS.md`
- `IMPLEMENTATION_PLAN.md`
- `CROSS_REPO_MAP.md`
- Target/legacy audit outputs for the active phase

## Escalation rule
If task requests out-of-phase implementation, defer and escalate to Overseer.
