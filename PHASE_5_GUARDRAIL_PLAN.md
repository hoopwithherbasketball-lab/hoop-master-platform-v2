<<<<<<< HEAD
=======
# PHASE_5_GUARDRAIL_PLAN

## Phase 5: Agent guardrail refinement and protected workflow policies

### Status

Complete. No product app code changes in this phase.

### Purpose

Before granting agents and MCP servers runtime power (Phase 6), this phase locks in the rules, boundaries, and enforcement policies that govern what agents can and cannot do across the monorepo. This prevents automation from becoming uncontrolled or hard to roll back.

### Prerequisites

- Phase 4 merged (`MIGRATION_BACKLOG.md`, `CROSS_REPO_IMPLEMENTATION_PLAN.md`, `CROSS_REPO_DEPENDENCIES.md` all in `main`) ✅
- No premature product app code changes ✅
- AGENT_PHASE_GATES.md and AGENT_OPERATING_MODEL.md reviewed and confirmed accurate ✅

---

## Guardrail Categories

### 1. Branch Protection Policies

| Policy | Rule | Enforcement |
|--------|------|-------------|
| `main` branch | Require PR + passing checks before merge | GitHub branch protection |
| `main` branch | No direct pushes | GitHub branch protection |
| Agent branches | Must follow `codex/` prefix naming convention | CI check / PR Review |
| Agent branches | Must be scoped to a single phase or migration slice | Codex Dispatcher / PR Review |
| Merge strategy | Must use squash merges — merge commits and rebase merging disabled on `main` | GitHub settings / Branch protection |

### 2. Agent Scope Boundaries

| Boundary | Rule | Enforcement |
|----------|------|-------------|
| Agent Scope | Agents must not modify `apps/` or `packages/` source (excluding config files authorized via the `agent-config-auth` label applied by human maintainers and designated Phase 6 command-center tooling paths) or make product app code changes before Phase 7 | CI check / PR Review |
| Secrets | Agents must never commit `.env`, secrets, tokens, or credentials | Secret scanning / CI |
| Schema | Agents must not modify Supabase migration files without explicit authorization (e.g., via agent-schema-auth label applied by human maintainers) | CI check / PR Review |
| Config | Agents must not modify critical configuration files (e.g., `turbo.json`, `pnpm-workspace.yaml`, all `package.json` and `tsconfig.json` files, `.gitignore`, `supabase/config.toml`, `config/agent-guardrails.json`), `.github/workflows`, or Cloudflare configs (e.g., `wrangler.toml`) without explicit authorization (e.g., via `agent-config-auth` label applied by human maintainers). Lockfiles are permitted to change if triggered by authorized package updates. | CI check / PR Review |

### 3. Security, RBAC, and Privacy Guardrails

| Rule | Applies To | Enforcement |
|------|------------|-------------|
| Eval records are coach/admin-only — never player-visible without explicit gate | Evaluation/scouting workflow (Phase 11 slices 1-3) | RLS / Middleware |
| Member profiles require auth session — no unauthenticated reads | ConnectGBB (Phase 9 slices 1-3) | RLS / Auth Guard |
| Media/TV content defaults to privacy-safe publishing — no PII in public routes | Media/TV rollout | PR Review / CI |
| All external webhooks require idempotency keys and webhook signature verification | Webhook integrations | Code Review / Integration Test |
| All admin routes (UI and API) must validate RBAC role before processing or rendering | Admin dashboard hardening | RBAC Middleware |

### 4. Rollback Safety Policies

| Policy | Rule | Enforcement |
|--------|------|-------------|
| Migration Slices | Each migration slice must be independently revertible | Slice PR structure (Phase 4) |
| PR Bundling | No multi-epic bundling in a single PR | PR Review |
| DB Schema | All changes must have a corresponding machine-executable rollback migration (down migration) | CI check / PR Review |
| Previews | Cloudflare deployment previews required before merging to main | Existing CI/CD check |

### 5. Phase Gate Rules (Agent Phase Gates)

Phase gates block agents from advancing until conditions are met. These align with `AGENT_PHASE_GATES.md`.

| Gate | Condition to Advance |
|------|---------------------|
| Phase 5 → Phase 6 | All guardrail policies documented, reviewed, merged to main, and signed off by Overseer |
| Phase 6 → Phase 7 | MCP runtime stable, agent contracts signed, and CI guardrails enforced |
| Phase 7 → Phase 8 | Phase 7 (Public MVP shell) deliverables complete and verified |

---

## Deliverables for This Phase

>>>>>>> origin/main
| Deliverable | File | Status | Inclusion Marker |
|-------------|------|--------|------------------|
| This guardrail plan | `PHASE_5_GUARDRAIL_PLAN.md` | Complete | N/A |
| Updated branch protection rules (documented) | `docs/protected-files-policy.md` | Complete | ✅ Present in repository |
| Agent scope contract | `docs/agent-guardrails.md` | Complete | ✅ Present in repository |
| RBAC policy matrix | `docs/agent-permissions-matrix.md` | Complete | ✅ Present in repository |
| Agent guardrail configuration | `config/agent-guardrails.json` | Complete | ✅ `artifactCommitted: true` |
| PR Template with guardrail checks | `.github/pull_request_template.md` | Complete | ✅ Present in repository |
| Phase 5 refinement documentation | `docs/phases/phase-5-guardrail-refinement.md` | Complete | ✅ Present in repository |
| Rollback policy confirmation | `MIGRATION_BACKLOG.md` annotation | Complete | Annotation present in Phase 5 merge |

---

## Phase 6.1 Governance Cleanup

This cleanup closes the remaining pre-Phase 7 governance gaps:

- Strengthens `.github/CODEOWNERS` with maintainers and overseers on the default catch-all rule.
- Adds explicit `packages/config/` CODEOWNERS coverage.
- Adds `.github/pull_request_template.md` with guardrail checklist items.
- Adds `docs/phases/phase-5-guardrail-refinement.md` as the missing Phase 5 refinement artifact.

No product app code, routes, UI, schema, migrations, dependencies, or deployment behavior are changed by this cleanup.

---

## Next Phase

After all Phase 5 and Phase 6.1 governance deliverables are merged to main:

- Phase 6 kickoff artifacts remain complete: `docs/phases/phase-6-mcp-agent-command-center-runtime.md`, `docs/mcp-runtime-boundaries.md`, `docs/agent-command-center.md`, `config/agent-runtime.json`, `scripts/ci/validate-agent-runtime.sh`
- **Phase 7:** Public MVP Shell may begin with explicit phase-scoped authorized paths and guardrail-compliant implementation rules.
- Product/app implementation remains blocked until Phase 7 is opened and explicitly scoped.
