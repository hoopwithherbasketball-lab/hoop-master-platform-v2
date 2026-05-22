# Agent Permissions Matrix

## Phase 6 Matrix (Scaffold Only)

| Capability | Status | Notes |
|---|---|---|
| Read repository files | Allowed | Documentation/config introspection only |
| Edit product/app code | Blocked | Implementation starts Phase 7+ only |
| Modify runtime/guardrail configs | Restricted | Requires protected-path review and CI validation |
| Execute production deploy actions | Blocked | Forbidden during Phase 6 |
| Apply DB migrations in production | Blocked | Forward-only policy and human approval required |
| Merge PRs autonomously | Blocked | Human-led merge control |
| Access raw secrets | Blocked | Secret managers only |

## Approval Requirements
Protected-path and governance changes require maintainer + overseer approval as defined in CODEOWNERS and branch policies.
