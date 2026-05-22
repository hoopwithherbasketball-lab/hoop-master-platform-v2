# MCP Runtime Boundaries (Phase 6 Scaffold)

## What MCP Tools May Do

- Perform read-only repository/file introspection.
- Retrieve non-sensitive build/test status metadata.
- Generate draft planning artifacts for human review.
- Propose (but not execute) changes that require approval.

## What MCP Tools May Not Do

- Execute production deploy pipelines.
- Apply database schema or migration mutations.
- Rotate/create/reveal secrets or credentials.
- Modify protected platform permissions/billing.
- Trigger autonomous multi-step destructive workflows.

## Allowed Read-only Actions

- Source code and docs inspection.
- Static config validation.
- Non-destructive lint/build/test invocation in approved environments.
- Observability/log reading where data is access-controlled and redacted.

## Approval-required Actions

- Environment or infra configuration changes.
- Changes to protected policy/config files.
- Any external side-effecting integration execution.

## Blocked Actions

- Production deploy/release execution.
- Pull request merge execution.
- Supabase production migrations.
- Secret value reads/writes.
- Direct IAM/RBAC elevation.
- Force-pushes or branch deletion.

## Secrets Handling

- No secrets are stored in runtime policy files.
- Secret material must remain in approved secret managers only.
- Logs and audit events must redact tokens, keys, and PII.

## Production Deployment Restrictions

- Deployment actions remain blocked in Phase 6.
- Any future deploy capability requires explicit phase unlock and operator approval workflow.

## Database and Migration Restrictions

- Schema/migration create/apply/rollback actions are blocked in Phase 6.
- Database access is read-only unless explicitly unlocked in a later phase.
- **Rollback Definition**: Revert ("rollback") migrations must be implemented as forward-only changes (new migrations that undo previous changes) rather than using .down.sql files, to maintain a linear history. If manual intervention is specifically intended, manual rollback scripts must follow a strict naming convention (e.g., <timestamp>_<name>.rollback.sql) and include a clear rationale.


## Canonical Policy Action Identifiers

To keep policy enforcement deterministic across runtime config, guardrails, and documentation, blocked actions use canonical identifiers:

- `run_production_supabase_migrations`
- `production_deployments`
- `secret_access`
- `modify_auth_or_rbac`
- `modify_billing_or_stripe`
- `destructive_file_operations`

Any legacy aliases (for example `database_migrations`, `modify_supabase_schema`, `create_migrations`, `schema_mutations`, `auth_rbac_changes`, or `billing_changes`) should be normalized to the canonical identifiers above before policy evaluation.

## Logging and Audit Expectations

- Persist immutable command decision logs for approval-required and blocked events.
- Include correlation IDs between request, approval decision, and execution attempt.
- Preserve reviewer-attributable metadata for compliance and incident analysis.



## CI Path Filter Scope Note

The guardrail workflow intentionally uses `*.md` in GitHub Actions path filters to match **root-level markdown files only**. This is intentionally aligned with CODEOWNERS `*.md`, which also scopes to repository-root markdown governance artifacts (for example `AGENT_PHASE_GATES.md` and `PHASE_5_GUARDRAIL_PLAN.md`).

## Rule-to-Enforcement Mapping

| Policy Rule | Enforcement Mechanism | Evidence / Audit Artifact |
|---|---|---|
| Block production deploy actions | CI guardrail workflow check + protected deployment environments requiring reviewer approval | CI run logs and environment protection approval logs |
| Block database/migration mutation actions in Phase 6 | Policy declaration in `config/agent-runtime.json` (disabledActions) + CODEOWNERS on `packages/supabase/migrations/**` + PR review gate | Policy config, CODEOWNERS review requirement, PR review history |
| Block secret read/write actions | GitHub secret scanning + repository rules preventing `.env` commit patterns | Secret scanning alerts and PR check results |
| Block force-push and branch deletion on protected branches | GitHub branch protection settings on `main` | Branch protection settings and audit log entries |
| Require human approval for protected config changes | CODEOWNERS review requirement on `config/**` and guardrail docs + required approving review | Required reviewer approvals in PR timeline |
| Forbid merge to main (Phase 6) | `config/agent-guardrails.json` forbiddenActions list (`merge_pull_request`) + branch protection blocking merges | Guardrail config, branch protection settings, agent rejection logs |
| Restrict runtime to read-only validation paths | Command Center policy engine classification check using `config/agent-runtime.json` + CI validation script (`scripts/ci/validate-agent-runtime.sh`) | Policy decision log with action classification |
| Ensure audit logs for approval-required/blocked commands | Structured command log sink with immutable append-only records | Command logs including correlation IDs and approver metadata |
