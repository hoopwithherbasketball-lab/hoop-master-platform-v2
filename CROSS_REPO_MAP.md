# CROSS_REPO_MAP

## Source-to-target mapping (from monorepo README)
| Source repo | Target location in this repo | Current maturity |
|---|---|---|
| `hoopwithherbasketball-lab/ELITEGBBHNIL` | `apps/web` | Active, multi-route app |
| `hoopwithherbasketball-lab/lightblueportal` | `packages/ui` | Shared UI components active |
| `hoopwithherbasketball-lab/PROCOACH` | `apps/procoach` | Mostly landing shell/stub |
| `hoopwithherbasketball-lab/HWH-PARNTER-PORTAL` | `apps/partner-portal` | Basic auth shell + Python backend folder |
| `hoopwithherbasketball-lab/hwh-player-advantage` | `apps/player-advantage` | Backend model file only (limited) |
| `hoopwithherbasketball-lab/hwh-player-advantage-app` | `apps/player-advantage-app` | Not present in current file listing |
| `lrevell8-arch/elitegbb` | `packages/features/src/connectgbb` | Package export placeholder surface |
| `lrevell8-arch/HWHLEAGUECRM` | `packages/features/src/crm` | Active auth/profile components + hooks |

## Command-center documents status
| Document | Status | Notes |
|---|---|---|
| `AGENTS.md` | Missing in repo tree | No agent instructions file found via filesystem scan. |
| `CROSS_REPO_MAP.md` | Built in this change | This file. |
| `MVP_SPEC.md` | Missing | Not found at repo root. |

## Ownership guidance by feature area
- `apps/web`: public marketing + member/dashboard + admin/NIL control panels.
- `packages/features/src/crm`: auth, role gating, profile CRUD hooks/components.
- `packages/supabase`: shared client and SQL migrations.
- `apps/procoach`: pro-coach product line surface (currently mostly placeholder).
- `apps/partner-portal` and `apps/player-advantage`: external/adjacent products that may hold functionality marked BELONGS_IN_OTHER_REPO for the main MVP.
