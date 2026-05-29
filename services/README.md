# Hoop With Her — Media Platform

White-label sports media platform for live streaming, linear channels, and VOD content.

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                      Frontend (Vite SPA)                     │
│  /watch (browse)  /watch/:slug (player)  /embed/:slug (iframe) │
└──────────────────────────┬──────────────────────────────────┘
                           │ Supabase JS Client
┌──────────────────────────┴──────────────────────────────────┐
│                      Supabase/Postgres                       │
│  media_channels │ media_assets │ channel_schedules           │
│  ad_slots │ epg_programs │ analytics_events                  │
│  analytics_aggregates │ white_label_tenants │ tenant_channels │
└──────────────────────────┬──────────────────────────────────┘
                           │
┌──────────────────────────┴──────────────────────────────────┐
│                   Backend Services (Node.js)                  │
│  services/api           — Express API (channels, epg, analytics) │
│  services/playlist-engine — M3U8 playlist generation         │
│  services/epg-generator   — JSON EPG feed + Roku format      │
│  services/ad-insertion    — SCTE-35 marker injection         │
│  services/analytics-ingester — Event ingestion + stats       │
└─────────────────────────────────────────────────────────────┘
```

## Database Tables

| Table | Purpose |
|-------|---------|
| `media_channels` | Live, linear, and VOD channels with branding config |
| `media_assets` | VOD content (films, highlights, training) |
| `channel_schedules` | Program schedules linking assets to time slots |
| `ad_slots` | VAST/VMAP ad placements per channel |
| `epg_programs` | Electronic program guide entries |
| `analytics_events` | Raw viewer events (play, pause, heartbeat) |
| `analytics_aggregates` | Hourly rollups for dashboard queries |
| `white_label_tenants` | Partner sites with custom branding |
| `tenant_channels` | Maps channels to white-label tenants |

## API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/channels` | GET | List all active channels |
| `/api/channels/:id` | GET | Get channel details |
| `/api/channels/:id/manifest` | GET | HLS M3U8 playlist |
| `/api/channels/:id/schedule` | POST | Upsert schedule entry |
| `/api/epg/channels` | GET | List channels with programs |
| `/api/epg/programs` | GET | EPG feed (supports `?format=roku`) |
| `/api/analytics/ingest` | POST | Ingest analytics event |
| `/api/analytics/ingest/batch` | POST | Batch ingest events |
| `/api/analytics/channel/:id` | GET | Channel stats |
| `/api/analytics/asset/:id` | GET | Asset stats |
| `/api/player/config/:slug` | GET | Player config + ad tags |
| `/api/player/config/domain/:domain` | GET | Tenant config by domain |
| `/health` | GET | Health check |

## Frontend Routes

| Route | Description |
|-------|-------------|
| `/watch` | Public channel browser |
| `/watch/:slug` | Channel player with EPG schedule |
| `/embed/:slug` | Embeddable iframe player |
| `/embed/docs` | Developer documentation |
| `/admin/channels` | Admin: channel management |
| `/admin/assets` | Admin: asset management |
| `/admin/schedules` | Admin: schedule management |
| `/admin/ad-slots` | Admin: ad slot management |
| `/admin/analytics` | Admin: analytics dashboard |
| `/admin/tenants` | Admin: white-label tenant management |

## Services

### playlist-engine
Generates HLS M3U8 playlists from channel schedules. Queries `channel_schedules` joined with `media_assets` to build time-ordered segment lists.

### epg-generator
Produces JSON EPG feeds consumable by Roku and other clients. Supports date-range queries and channel filtering.

### ad-insertion
Injects SCTE-35 markers into HLS manifests at ad slot positions. Generates `#EXT-X-DATERANGE` tags with VAST/VMAP ad tag URLs.

### analytics-ingester
Accepts analytics events from players, stores raw events in `analytics_events`, and exposes aggregation queries for dashboards.

### api
Express server that wires all services together. Routes for channels, EPG, analytics, and player config.

## Embedding

```html
<iframe
  src="https://yourdomain.com/embed/channel-slug"
  width="100%"
  height="540"
  frameborder="0"
  allow="autoplay; fullscreen; picture-in-picture"
  allowfullscreen
></iframe>
```

See `/embed/docs` for full documentation including JavaScript API and React component examples.

## Environment Variables

```bash
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_KEY=your-service-role-key  # for services/api
PORT=3001                                   # API server port
```

## Running

```bash
# Frontend dev server
npx turbo dev --filter=web

# API server
cd services/api && npm run dev

# Full build
npx turbo build
```
