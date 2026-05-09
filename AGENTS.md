# AGENTS

## Purpose
This file defines the HoopWithHer **Agent Command Center** operating rules for this repository.

## Scope
- Repository root (`/workspace/hoop-master-platform-v2`) and all subdirectories.

## Ground rules for coding agents
1. **Do not guess feature ownership**. Confirm ownership in `CROSS_REPO_MAP.md` first.
2. **Use MVP statuses consistently**:
   - `BUILT`, `PARTIAL`, `MISSING`, `BROKEN`, `BELONGS_IN_OTHER_REPO`, `LATER`.
3. **Document-first for planning tasks**:
   - Update `REPO_AUDIT.md`, `GAP_ANALYSIS.md`, and `IMPLEMENTATION_PLAN.md` before implementing major cross-cutting features.
4. **Preserve shared package boundaries**:
   - Shared auth/profile logic stays in `packages/features/src/crm/*`.
   - Shared Supabase client/migrations stay under `packages/supabase/*`.
5. **Role-sensitive routes** must use `ProtectedRoute` from `packages/features/src/crm/components/ProtectedRoute.tsx`.
6. **No silent schema drift**:
   - Any DB schema changes require a new SQL migration in `packages/supabase/migrations/*` and corresponding updates to shared types when applicable.
7. **Command-center docs to keep current**:
   - `AGENTS.md`
   - `CROSS_REPO_MAP.md`
   - `MVP_SPEC.md`
   - `REPO_AUDIT.md`
   - `GAP_ANALYSIS.md`
   - `IMPLEMENTATION_PLAN.md`

## MVP authority
- `MVP_SPEC.md` is the source of truth for MVP feature definitions.
- `GAP_ANALYSIS.md` is the source of truth for current implementation status.
