# Phase 6: MCP + Agent Command Center Runtime Scaffolding

## Purpose

Phase 6 establishes the non-destructive runtime scaffolding for MCP-assisted agents and the Agent Command Center so that future implementation phases can execute within explicit human-controlled guardrails.

## Scope

- Define runtime boundaries for MCP tool usage.
- Define the Command Center's governance responsibilities.
- Add machine-readable runtime policy configuration for Phase 6.
- Add planning artifacts that make protected-action handling auditable and reviewable.

## Non-scope

- No autonomous agent execution.
- No deployment automation.
- No production settings or billing/permission changes.
- No secret creation, rotation, or exposure.
- No Supabase schema changes or migrations.
- No product application behavior changes.

## Relationship to Phase 5 Guardrails

Phase 5 documented baseline guardrails and phase gates. Phase 6 consumes those guardrails and translates them into runtime scaffolding contracts that can be enforced before any implementation unlock in Phase 7+.

## Runtime Safety Principles

1. Human-in-the-loop for every protected action.
2. Default-deny for destructive or irreversible operations.
3. Minimum necessary capability for each runtime component.
4. Explicit action classification (read-only, approval-required, blocked).
5. Full auditability for command origin, approvals, and outcomes.


## Technical Enforcement Mapping

Phase 6 policies must map to explicit automation controls so they are enforceable:

- **CI guardrail checks:** enforce blocked actions and protected file path constraints.
- **Branch protection rules:** enforce no direct pushes/force pushes to protected branches and require passing checks.
- **CODEOWNERS + required reviews:** enforce human approval for policy/config and protected workflow changes.
- **Secret scanning and push protection:** prevent credential leakage and `.env`-class secret exposure.
- **Command Center policy engine classification:** evaluate requested actions against `config/agent-runtime.json` before execution.
- **Audit log pipeline:** record command request, classification, approval decision, and outcome for traceability.

Detailed per-rule mappings are defined in `docs/mcp-runtime-boundaries.md`.


## Guardrail Reference Resolution

The runtime policy reference (`guardrailConfigReference`) must resolve to a committed file at load time.

- Loaders/validators must **fail closed** if the referenced guardrail file is missing or unreadable.
- Loaders/validators must verify the guardrail artifact identity/status before enabling command execution paths.
- Phase 6 runtime startup should be considered invalid when guardrail reference validation fails.

## MCP Server Boundaries

- MCP integrations are limited to bounded tooling contracts.
- Runtime must not grant blanket shell/deployment/database mutation authority.
- MCP actions are constrained by the Phase 6 runtime policy (`config/agent-runtime.json`).

## Agent Command Center Purpose

The Agent Command Center serves as a control plane for:

- Tracking registered agent roles and statuses.
- Reviewing queued commands.
- Enforcing approval requirements before protected operations.
- Preserving a complete audit trail for operator review.

## Human Approval Requirements

Human approval is required before any action classified as high-risk, external-impacting, or irreversible, including deploy, schema/migration, secret, and privilege changes.

## Protected Action Model

Actions are classified into:

- **Read-only:** Safe metadata and status retrieval.
- **Approval-required:** Potentially impactful actions requiring explicit operator approval.
- **Blocked:** Forbidden in Phase 6 regardless of requester.

## Audit Trail Requirements

Every command lifecycle event should capture:

- Requesting agent identity and role.
- Requested action type and target.
- Risk classification and policy decision.
- Approval decision details (approver, timestamp, rationale).
- Execution status and resulting artifacts/log pointers.

## Exit Criteria

- Runtime policy file exists and validates as JSON.
- MCP and Command Center planning docs are documented and reviewed.
- Protected action model is explicit and consistent with guardrail constraints.
- No autonomous or destructive runtime capabilities are enabled.

## Recommended Next Phase

Proceed to Phase 7 only after:

- Runtime policy enforcement hooks are defined in CI/review workflow.
- Command Center scaffolding is reviewed by maintainers.
- Phase 6 artifacts are merged with explicit sign-off.
