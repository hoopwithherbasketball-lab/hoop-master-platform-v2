# FEATURE_REGISTRY

| Feature | Current Status | Target Location | Notes |
|---|---|---|---|
| Public HoopWithHer site | BUILT | `apps/web/src/pages/public/*` | Marketing, `/services`, and `/workshops` routes present. Egress optimized. |
| Events | PARTIAL | `apps/web/src/pages/dashboard/EventsPage.tsx` | UI exists, but backend registration logic is missing. |
| Player profiles | BUILT | `packages/features/src/crm` & `apps/web/src/pages/public/PlayerDetailPage.tsx` | Profile UI and basic integrations complete. |
| Rankings/watchlists | PARTIAL | `packages/features/src/recruiting/*` | Recruiting email sequences built; watchlists incomplete. |
| HoopWithHer Elite | LATER | `apps/procoach` or `apps/web` | High-performance portal deferred. |
| Elite GBB evaluations | BUILT | `packages/features/src/evaluations/*` | Admin and Coach evaluation workflows built (PR 40). |
| HoopWithHer Academy | MISSING | TBD | Learning workflows are currently absent. |
| ConnectGBB | BUILT | `packages/features/src/connectgbb/*` | Member platform routing, community feed, and messages merged. |
| Page Builder | BUILT | `apps/web/src/pages/admin/AdminPageBuilderPage.tsx` | Admin page builder MVP merged via PR 37. |
| Data/forms workflows | BUILT | `packages/features/src/crm` & admin pages | Forms, orders, and leads workflows are present. |
| Evaluation/scouting workflow | BUILT | `packages/features/src/scouting` & admin pages | Courtside communication and evaluations merged via PR 40. |
| Media/TV Platform | BUILT | `apps/web/src/pages/public/ChannelsBrowsePage.tsx` | HWH TV platform merged via PR 45. |
