# HOOP WITH HER TV catalog and channel builder

The web media library remains the source of truth. Admins upload assets in **Media Assets**, mark an asset `ready`, and switch on **TV catalog**. This uses the repository's `publish_to_roku` database migration; confirm that migration has already been applied in the target environment before using the switch. This change does not apply a production migration. The switch means an asset is eligible for the public feed, **not** that Roku or FireBossTV has published a channel.

| Consumer | URL | Contract |
| --- | --- | --- |
| Existing Roku SceneGraph app | `GET https://<api-host>/api/roku/feed` | `providerName`, `lastUpdated`, `movies[]`; each movie has `id`, `title`, `shortDescription`, `thumbnail`, `tags`, `content.videos[0].url` and `videoType` (`HLS` or `MP4`). |
| Channel-builder import/adapter | `GET https://<api-host>/api/tv/catalog` | `providerName`, `videos[]`; each video has `id`, `title`, `description`, `streamUrl`, `streamFormat`, `thumbnailUrl`, `publishedAt`, `category`, `tags`, `durationSeconds`. |

Both endpoints include **only** ready, explicitly selected assets with absolute, public HTTPS video and image URLs. Video URLs must end with `.m3u8` or `.mp4` (HLS or MP4). URL credentials, query parameters and fragments are excluded so the public catalog does not publish access tokens. Configure `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` **on the API server only**. Its anonymous feed must contain only material approved for public viewing; do not select private athlete footage. Cache lifetime is 60 seconds.

The current Cloudflare Pages workflow deploys **only `apps/web`**, not `services/api`. A passing frontend deployment therefore does not make either TV endpoint available. Deploy the existing API service separately behind HTTPS, configure its server-side credentials, and verify the actual `/api/roku/feed` URL on the host configured in `apps/roku/manifest` before connecting the Channel Builder. That host has not been verified by this change.

## FireBossTV plugin / Channel Builder

The product team uses FireBossTV's plugin and Channel Builder. Its import format, plugin host, authentication model, and Roku/Fire TV distribution settings are not specified in this repository. **Do not paste a service-role key or a signed URL into its dashboard.** Map the public catalog's fields to the vendor's actual schema when the Channel Builder import documentation or export sample is available. If the builder supports the existing Roku JSON shape, `/api/roku/feed` may be a direct source; otherwise implement a small server-side adapter from `/api/tv/catalog` to its documented schema. Verify whether FireBossTV requires a URL it can poll, a manual import, or a plugin push before calling that integration live.

The repository also contains a separate SceneGraph Roku app in `apps/roku` which currently consumes the Roku feed. Decide with the channel owner whether FireBossTV replaces that app or is an additional distribution path; do not ship both under the same store listing without confirming ownership. A future Fire TV release may be built by Channel Builder; Amazon's app submission and device QA still apply independently.

## Release check

1. Verify the chosen asset has consent/rights for public TV distribution and reachable HTTPS film/artwork with no access token in the URL.
2. Use the admin TV switch; confirm both endpoints include the asset and removing it makes it disappear after cache expiry.
3. Import the catalog into the Channel Builder using its documented field mapping; test HLS and MP4 on physical Roku and Fire TV devices.
4. Supply a real brand splash/icon package for `apps/roku/manifest` before packaging the native Roku app: its current splash image reference has no tracked image file.
5. Obtain the channel-builder configuration and vendor import spec before enabling automatic provider sync or claiming an external channel is published.
