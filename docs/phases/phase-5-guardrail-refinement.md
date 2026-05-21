# Phase 5 Guardrail Refinement

<!-- artifact: phase-5-guardrail-refinement -->
<!-- status: complete -->
<!-- committed-in: phase-6.1-governance-cleanup -->

## Purpose

This document closes the two missing Phase 5 deliverables identified in the `PHASE_5_GUARDRAIL_PLAN.md` audit table: the PR template and the Phase 5 refinement doc itself.

## Scope

Phase 5 is documentation and configuration only. It does not modify product app routes, product UI, Supabase schema, migrations, deployment behavior, or runtime dependencies.

## Deliverables in This PR

| # | Artifact | Path | Status |
|---|---|---|---|
| 1 | PR Template with guardrail checklist | `.github/pull_request_template.md` | Complete — committed in this PR |
| 2 | Phase 5 refinement documentation | `docs/phases/phase-5-guardrail-refinement.md` | Complete — this file |

## Guardrail Policy to Enforcement Mapping

| Policy Rule | Technical Enforcement Mechanism | Evidence |
|---|---|---|
| All PRs include guardrail checklist | `.github/pull_request_template.md` — mandatory checkboxes rendered in every PR | GitHub PR UI, template presence in diff |
| Protected paths require overseer review | .github/CODEOWNERS — *, config/**, packages/config/**, docs/**, agents/**, .github/**, scripts/**, **/*.md, AGENT_PHASE_GATES.md, .github/CODEOWNERS all require @overseers | CODEOWNERS review requirement in PR timeline |
| Runtime config validates phase scope | `scripts/ci/validate-agent-runtime.sh` — checks `phase`, `mcpRuntimeMode`, `enabledAgents`, `artifactCommitted`, file references | CI check output |
| Forward-only migrations enforced | `scripts/ci/validate-agent-runtime.sh` — scans for forbidden `.down.sql` files | CI check output |
| No secrets or credentials committed | GitHub secret scanning + branch protection | Secret scanning alerts |
| No merge in Phase 6 | `config/agent-guardrails.json` `forbiddenActions` includes `merge_pull_request` | Guardrail config, agent rejection logs |

## Core Policies

- Agent-accessible paths are deny-by-default unless explicitly authorized by phase scope.
- Product app code changes remain blocked until Phase 7 is explicitly unlocked.
- Protected files require human review and an auditable justification.
- Secrets, credentials, private player data, parent contact information, and private evaluation notes must not be exposed.
- Production migrations, deployment actions, billing changes, and auth/RBAC changes require explicit approval.
- Each implementation slice must remain independently reviewable and revertible.

## Phase 5 to Phase 6 Gate

Phase 6 may proceed only after guardrail policies, guardrail configuration, protected-file ownership, PR review expectations, and Overseer signoff are in place.

## Phase 6 to Phase 7 Gate

Phase 7 may proceed only after the Phase 6 runtime scaffold is merged, runtime execution remains disabled until approved, `config/agent-runtime.json` validates, and Phase 7 authorized paths are documented.

## Status

<!-- artifactCommitted: true -->
Complete. This artifact closes the missing Phase 5 refinement documentation deliverable.
