# Hoop Master Platform

A consolidated Turborepo monorepo unifying 8 basketball-focused repositories into a single, maintainable codebase.

## Architecture

```
hoop-master-platform/
├── apps/
│   ├── web/                    # Foundation shell (from ELITEGBBHNIL)
│   │                           # Player profiles, services, readiness scoring
│   ├── procoach/               # Pro coaching platform (from PROCOACH)
│   │                           # Tournaments, events, video library, dev assistant
│   ├── partner-portal/         # Partner portal (from HWH-PARTNER-PORTAL)
│   │                           # Frontend + Python backend
│   ├── player-advantage/       # Player advantage v1 (from hwh-player-advantage)
│   │                           # Frontend + Python backend
│   └── player-advantage-app/   # Player advantage v2 (from hwh-player-advantage-app)
│                               # Frontend + Python backend
├── packages/
│   ├── config/                 # Shared Tailwind, PostCSS, and TypeScript configs
│   ├── features/
│   │   └── src/
│   │       ├── connectgbb/     # ConnectGBB feature module (from lrevell8-arch/elitegbb)
│   │       ├── crm/            # League CRM (from lrevell8-arch/HWHLEAGUECRM)
│   │       ├── coaching/       # Shared coaching logic (placeholder)
│   │       ├── nil/            # NIL management (placeholder)
│   │       └── recruiting/     # Recruiting workflows (placeholder)
│   ├── supabase/
│   │   └── migrations/
│   │       ├── elitegbb/       # ELITEGBBHNIL migrations
│   │       ├── elitegbb-arch/  # lrevell8-arch/elitegbb SQL schemas
│   │       ├── procoach/       # PROCOACH migrations
│   │       └── crm/            # HWHLEAGUECRM migrations
│   ├── types/                  # Shared TypeScript types
│   │   └── src/
│   │       └── database.ts     # Unified database types
│   └── ui/                     # Shared UI component library
│       ├── src/
│       │   ├── components/     # Extracted shared components
│       │   │   ├── ReadinessGauge.tsx
│       │   │   ├── ScoreBar.tsx
│       │   │   └── StatusBadge.tsx
│       │   └── lightblueportal/ # UI reference from lightblueportal
│       ├── COLOR_PALETTE.md    # Brand color reference
│       └── HOOP_WITH_HER_DESIGN.md
```

## Source Repositories

| # | Repository | Maps To | Purpose |
|---|-----------|---------|---------|
| 1 | `hoopwithherbasketball-lab/ELITEGBBHNIL` | `apps/web` | Foundation shell, player profiles, services |
| 2 | `hoopwithherbasketball-lab/lightblueportal` | `packages/ui` | Design system, UI components |
| 3 | `hoopwithherbasketball-lab/PROCOACH` | `apps/procoach` | Pro coaching, tournaments, video library |
| 4 | `hoopwithherbasketball-lab/HWH-PARTNER-PORTAL` | `apps/partner-portal` | Partner management portal |
| 5 | `hoopwithherbasketball-lab/hwh-player-advantage` | `apps/player-advantage` | Player advantage features v1 |
| 6 | hoopwithherbasketball-lab/hwh-player-advantage-app | apps/player-advantage-app | Player advantage features v2 (Planned) |
| 7 | `lrevell8-arch/elitegbb` | `packages/features/src/connectgbb` | ConnectGBB social/networking |
| 8 | `lrevell8-arch/HWHLEAGUECRM` | `packages/features/src/crm` | League CRM management |

## Brand Colors

- **Primary Blue**: `#0134BD`
- **Brand Orange**: `#FB6C1D`
- **Brand Gold**: `#C8A24A`
- **Navy**: `#121B47`

## Tech Stack

- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS (unified config)
- **Backend**: Supabase (Postgres, Auth, Storage, Edge Functions)
- **Monorepo**: Turborepo
- **Additional backends**: Python (FastAPI) for partner-portal and player-advantage apps

## Getting Started

```bash
# Install dependencies
npm install

# Run all apps in dev mode
npm run dev

# Build all apps
npm run build

# Run a specific app
npx turbo dev --filter=web
```

## Shared Packages

- `@hoop-master/config` - Tailwind, PostCSS, and TypeScript base configs
- `@hoop-master/ui` - Shared React UI components (ReadinessGauge, ScoreBar, StatusBadge)
- `@hoop-master/types` - Shared TypeScript type definitions
- `@hoop-master/features` - Feature modules (ConnectGBB, CRM, Coaching, NIL, Recruiting)
- `@hoop-master/supabase` - Consolidated Supabase migrations and schemas