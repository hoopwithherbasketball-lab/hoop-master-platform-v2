# MVP_SPEC

## Status legend
- `BUILT`: End-to-end available in this repo.
- `PARTIAL`: Some UI/data pieces exist, but feature is incomplete.
- `MISSING`: No meaningful implementation located.
- `BROKEN`: Intended implementation exists but currently fails at build/runtime or has unresolved dependency path.
- `BELONGS_IN_OTHER_REPO`: Feature exists, but canonical implementation is owned by another repo/product surface.
- `LATER`: Explicitly deferred post-MVP.

## HoopWithHer MVP features
1. Public marketing site
2. Events listing and registration
3. Player profiles / recruiting
4. ConnectGBB member platform
5. HoopWithHer TV / media section
6. Admin dashboard
7. Supabase auth and RLS
8. Stripe or payment integration
9. Email/notifications
10. HWH Elite arm
11. Agent command center (`AGENTS.md`, `CROSS_REPO_MAP.md`, `MVP_SPEC.md`)

## Evidence requirements
For each feature status update in `GAP_ANALYSIS.md`:
- Include exact file paths that prove the status.
- If a route exists, include the route path and route definition file.
- If database/auth claims are made, include migration/client/auth-context paths.
- If a feature is marked `BELONGS_IN_OTHER_REPO`, include the mapped area from `CROSS_REPO_MAP.md`.
