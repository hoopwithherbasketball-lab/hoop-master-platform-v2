# AGENT_OPERATING_MODEL

## Runtime maturity (current PR)
- Agents in this PR are **instruction/documentation agents**.
- They are **not** executable runtime agents yet.
- MCP server/runtime orchestration comes in a later phase.

## Control plane
- **Overseer:** phase authority and final gatekeeper.
- **Codex Task Dispatcher:** prompt + repo routing authority and task triage.

## Specialist plane
- Audit: target-repo-auditor, legacy-repo-auditor
- Build planning: cross-repo-migration-architect, page-builder, forms-crm, evaluation-scouting
- Quality/safety: qa-test, security-privacy, ci-workflow, pr-review-coordinator
- Docs/comms: documentation-agent, content-brand, release-manager

## Replacement model (no browser-based assistant required)
- GitHub Repo Navigator replaces browser repo inspection.
- Codex Task Dispatcher replaces manual prompt guessing.
- PR Review Coordinator replaces manual PR review coordination.
- CI/Workflow Agent handles workflow job and step inspection.

## Safety model
- Security/Privacy agent can block outputs that expose player/minor data.
- Release Manager issues phase completion summaries and remaining risks.
