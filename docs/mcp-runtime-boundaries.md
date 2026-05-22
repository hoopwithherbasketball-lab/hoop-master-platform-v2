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
