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

- Pull request merge execution.
- Environment or infra configuration changes.
- Changes to protected policy/config files.
- Any external side-effecting integration execution.

## Blocked Actions

- Production deploy/release execution.
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

## Logging and Audit Expectations

- Persist immutable command decision logs for approval-required and blocked events.
- Include correlation IDs between request, approval decision, and execution attempt.
- Preserve reviewer-attributable metadata for compliance and incident analysis.


## Rule-to-Enforcement Mapping

| Policy Rule | Enforcement Mechanism | Evidence / Audit Artifact |
|---|---|---|
| Block production deploy actions | CI guardrail workflow check + protected deployment environments requiring reviewer approval | CI run logs and environment protection approval logs |
| Block database/migration mutation actions in Phase 6 | CI path filter check for migration directories + PR review gate | CI check output, PR review history |
| Block secret read/write actions | GitHub secret scanning + repository rules preventing `.env` commit patterns | Secret scanning alerts and PR check results |
| Block force-push and branch deletion on protected branches | GitHub branch protection settings on `main` | Branch protection settings and audit log entries |
| Require human approval for protected config changes | CODEOWNERS review requirement on `config/**` and guardrail docs + required approving review | Required reviewer approvals in PR timeline |
| Require approval for merge to main | Protected branch required status checks + required reviews before merge | Merged PR status checks and reviewer approvals |
| Restrict runtime to read-only validation paths | Command Center policy engine classification check using `config/agent-runtime.json` + CI validation script (`scripts/ci/validate-agent-runtime.sh`) | Policy decision log with action classification |
| Ensure audit logs for approval-required/blocked commands | Structured command log sink with immutable append-only records | Command logs including correlation IDs and approver metadata |

