# Agent Guardrails

## Scope
This contract governs agent behavior for planning, documentation, and command-center tooling phases.

## Core Rules

- Default-deny posture for protected or undefined sensitive paths.
- No product/app implementation changes before Phase 7 unlock.
- No production deployment, merge execution, or destructive workflows.
- No secret handling outside approved secret-management systems.

## Protected Changes
Changes to protected configs, workflow files, migration infrastructure, and governance docs require maintainer + overseer review.

## Runtime Boundaries
Runtime policy is defined by:
- `config/agent-runtime.json`
- `config/agent-guardrails.json`
- `docs/mcp-runtime-boundaries.md`

## Auditability
All policy-relevant changes must be traceable in PRs with explicit checks and validation evidence.
