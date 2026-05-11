# CROSS_REPO_MAP

## Migration Direction
- **Final Consolidation Target**: `hoopwithherbasketball-lab/hoop-master-platform-v2` is the canonical monorepo. All legacy features, components, and data structures will ultimately be migrated into this repository.
- **Legacy Repositories**: Repositories such as `lrevell8-arch/elitegbb` and `lrevell8-arch/HWHLEAGUECRM` are sources intended for deprecation post-migration. Code should be audited and moved to the consolidation target.

## Source-to-target mapping (from `README.md`)
| Source repo | Target location in this repo | Current maturity |
|---|---|---|
| `hoopwithherbasketball-lab/ELITEGBBHNIL` | `apps/web` | Active multi-route React/Vite app (`apps/web/src/App.tsx`). |
| `hoopwithherbasketball-lab/lightblueportal` | `packages/ui` | Shared UI component package (`packages/ui/src/components/*`). |
| `hoopwithherbasketball-lab/PROCOACH` | `apps/procoach` | Single-screen shell (`apps/procoach/src/App.tsx`). |
| `hoopwithherbasketball-lab/HWH-PARTNER-PORTAL` | `apps/partner-portal` | Basic auth shell + Python backend (`apps/partner-portal/src/App.js`, `apps/partner-portal/backend/server.py`). |
| `hoopwithherbasketball-lab/hwh-player-advantage` | `apps/player-advantage` | Backend model file present (`apps/player-advantage/backend/models.py`). |
| `hoopwithherbasketball-lab/hwh-player-advantage-app` | `apps/player-advantage-app` | Not currently present in tracked files. |
| `lrevell8-arch/elitegbb` | `packages/features/src/connectgbb` | Placeholder package export (`packages/features/src/connectgbb/index.ts`). |
| `lrevell8-arch/HWHLEAGUECRM` | `packages/features/src/crm` | Active auth/profile module (`packages/features/src/crm/*`). |

## Agent command center documents
| Document | Status |
|---|---|
| `AGENTS.md` | Present |
| `CROSS_REPO_MAP.md` | Present |
| `MVP_SPEC.md` | Present |
| `REPO_AUDIT.md` | Present |
| `GAP_ANALYSIS.md` | Present |
| `IMPLEMENTATION_PLAN.md` | Present |

## Ownership guidance
- `apps/web`: core application housing the public site, dashboard/member experience, coach/admin/NIL surfaces.
- `packages/features/src/crm`: auth, role checks, profile workflows.
- `packages/supabase`: shared client + SQL migrations.
- `apps/procoach`: pro-coach product line (currently early shell).
- `apps/partner-portal`, `apps/player-advantage`: adjacent product surfaces that can justify `BELONGS_IN_OTHER_REPO` status where applicable, separated from the core `web` app.
