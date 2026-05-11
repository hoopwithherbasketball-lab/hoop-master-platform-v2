# MVP_SPEC

## Status legend
- `BUILT`: End-to-end available in this repo.
- `PARTIAL`: Some UI/data pieces exist, but feature is incomplete.
- `MISSING`: No meaningful implementation located.
- `BROKEN`: Intended implementation exists but currently fails at build/runtime or has unresolved dependency path.
- `BELONGS_IN_OTHER_REPO`: Feature exists, but canonical implementation is owned by another repo/product surface.
- `LATER`: Explicitly deferred post-MVP.

## HoopWithHer MVP features
1. **Public marketing site**: Must include the core landing page (`/`), services (`/services`), workshops (`/workshops`), and SEO metadata. Responsive design is required.
2. **Events listing and registration**: Must allow users to view upcoming events and securely register. Requires dedicated API routes and database persistence for attendees.
3. **Player profiles / recruiting**: Must support public-facing player stats and private evaluation notes (gated by role). Includes messaging and search/filter capabilities.
4. **ConnectGBB member platform**: Must provide authenticated social connectivity, allowing players and coaches to interact within a managed ecosystem.
5. **HoopWithHer TV / media section**: Must aggregate video content, highlights, and educational materials. Requires a dedicated route and media playback components.
6. **Admin dashboard**: Must provide secure access (`/admin`) for staff to manage users, audits, leads, orders, and player data.
7. **Supabase auth and RLS**: Must correctly enforce Row Level Security (RLS) across all tables, ensuring users only see data they are authorized to access.
8. **Stripe or payment integration**: Must support secure checkout sessions and handle webhooks for event registration and product purchases.
9. **Email/notifications**: Must support transactional emails for registration confirmations, profile updates, and critical system alerts.
10. **HWH Elite arm**: Must provide a high-performance portal for evaluation readiness and direct scouting.
11. **Agent command center**: Must complete setup of `AGENTS.md`, `CROSS_REPO_MAP.md`, `MVP_SPEC.md`, and MCP runtimes for automated workflows.

## Evidence requirements
For each feature status update in `GAP_ANALYSIS.md`:
- Include exact file paths that prove the status.
- If a route exists, include the route path and route definition file.
- If database/auth claims are made, include migration/client/auth-context paths.
- If a feature is marked `BELONGS_IN_OTHER_REPO`, include the mapped area from `CROSS_REPO_MAP.md`.
