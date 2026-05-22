## Summary
- Describe the change and why it is needed.

## Guardrail Checklist
- [ ] Change is within current unlocked phase scope.
- [ ] No unauthorized app/product code modifications for docs/config-only phases.
- [ ] Protected-path changes include maintainer/overseer review.
- [ ] `./scripts/ci/validate-agent-runtime.sh` executed (or CI run linked).
- [ ] No prohibited migration rollback artifacts (`.down.sql`) introduced.

## Evidence
- Validation commands and outputs:
  - `./scripts/ci/validate-agent-runtime.sh`

## Risk / Rollback
- Risk level:
- Rollback plan:
