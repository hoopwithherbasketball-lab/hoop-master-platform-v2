# PHASE_5_GUARDRAIL_PLAN

## Phase 5: Agent guardrail refinement and protected workflow policies

### Status

Planning only. No product app code changes in this phase.

### Purpose

Before granting agents and MCP servers runtime power (Phase 6), this phase locks in the rules, boundaries, and enforcement policies that govern what agents can and cannot do across the monorepo. This prevents automation from becoming uncontrolled or hard to rollback.

### Prerequisites

- Phase 4 merged (MIGRATION_BACKLOG.md, CROSS_REPO_IMPLEMENTATION_PLAN.md, CROSS_REPO_DEPENDENCIES.md all in main) ✅
- No premature product app code changes
- AGENT_PHASE_GATES.md and AGENT_OPERATING_MODEL.md reviewed and confirmed accurate

---

## Guardrail Categories

### 1. Branch Protection Policies

| Policy | Rule | Enforcement |
|--------|------|-------------|
| `main` branch | Require PR + passing checks before merge | GitHub branch protection |
| `main` branch | No direct pushes | GitHub branch protection |
| Agent branches | Must follow codex/ prefix naming convention | CI check / PR Review |
| Agent branches | Must be scoped to a single phase or epic slice | Codex Dispatcher / PR Review |
| Merge strategy | Must use squash merges — merge commits and rebase merging disabled on main | GitHub merge settings |

### 2. Agent Scope Boundaries

| Boundary | Rule |
|----------|------|
| Phase scope | Agents must not make product app code changes during Phases 1-6 |
| File scope | Agents must not modify `apps/` or `packages/` source during planning phases |
| Secrets | Agents must never commit `.env`, secrets, tokens, or credentials |
| Schema | Agents must not modify Supabase migration files without explicit Phase 7 authorization |
| Config | Agents must not modify turbo.json, package.json workspace roots, lockfiles, or Cloudflare config without explicit PR scope |

### 3. RBAC and Privacy Guardrails

| Rule | Applies To |
|------|------------|
| Eval records are coach/admin-only — never player-visible without explicit gate | Evaluation/scouting workflow (Phase 4 slices 2-3) |
| Member profiles require auth session — no unauthenticated reads | ConnectGBB (Phase 4 slice 1-2) |
| Media/TV content defaults to privacy-safe publishing — no PII in public routes | Media/TV rollout |
| Payment webhooks require idempotency keys and secret validation | Payments hardening |
| All admin routes must validate RBAC role before rendering | Admin dashboard hardening |

### 4. Rollback Safety Policies

| Policy | Rule |
|--------|------|
| Each migration slice must be independently revertible | Enforced by slice PR structure from Phase 4 |
| No multi-epic bundling in a single PR | Max 1 epic slice per PR during implementation |
| All DB schema changes must have a corresponding down migration (e.g., .down.sql) | Supabase migration policy |
| Cloudflare deployment previews required before merging to main | Enforced by existing CI/CD check |

### 5. Phase Gate Rules (Agent Phase Gates)

Phase gates block agents from advancing until conditions are met. These align with `AGENT_PHASE_GATES.md`.

| Gate | Condition to Advance |
|------|---------------------|
| Phase 5 → Phase 6 | All guardrail policies documented, reviewed, and merged to main |
| Phase 6 → Phase 7 | MCP command center runtime is stable and agent scope contracts are signed off |
| Phase 7 → Implementation | Phase 5 guardrails enforced in CI, no open guardrail violations |

---

## Deliverables for This Phase

| Deliverable | File | Status |
|-------------|------|--------|
| This guardrail plan | PHASE_5_GUARDRAIL_PLAN.md | Complete |
| Updated branch protection rules (documented) | docs/protected-files-policy.md | Complete |
| Agent scope contract | docs/agent-guardrails.md | Complete |
| RBAC policy matrix | docs/agent-permissions-matrix.md | Complete |
| Rollback policy confirmation | MIGRATION_BACKLOG.md annotation | Complete |

---

## Next Phase

After all Phase 5 deliverables are merged to main:

- **Phase 6:** MCP + Agent Command Center runtime — agents gain structured tool access with guardrails enforced
- Product/app implementation remains blocked until Phase 7
