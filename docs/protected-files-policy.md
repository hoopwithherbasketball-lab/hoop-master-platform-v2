# Protected Files Policy

## Purpose
This document defines the protected-file policy for agent-accessible repository paths during Phase 5/6 guardrail operation.

## Protected Path Categories

- Governance/config artifacts (`config/**`, `packages/config/**`)
- Agent runtime/guardrail control files (`config/agent-runtime.json`, `config/agent-guardrails.json`, `AGENT_PHASE_GATES.md`)
- CI and workflow enforcement assets (`.github/**`, `scripts/**`)
- Migration infrastructure (`supabase/migrations/**`, `packages/supabase/migrations/**`)
- Root governance documents (`*.md`)

## Enforcement Mechanisms

1. CODEOWNERS requires maintainer/overseer review for protected paths.
2. Guardrail validation CI runs `scripts/ci/validate-agent-runtime.sh` on protected path changes.
3. Protected files are enumerated in `config/agent-guardrails.json` under `protectedFiles`.

## Exception Handling
Any exception requires explicit human authorization (for example via designated PR labels such as `agent-config-auth`) and maintainer approval.
