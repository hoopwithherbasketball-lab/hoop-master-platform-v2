# RecruitSpotlight — Sports Recruit Graphic Generator

A web app that turns raw player photos + typed details into a polished "INCOMING" recruiting graphic, rendered across Instagram Story (9:16), Portrait (4:5), and Square (1:1). One gritty master template, fully placeholder-driven.

## What kind of app
Web-based, desktop-first (min viewport 1280px). Not optimized for mobile — users upload photos and fine-tune layouts, which needs screen real estate. Show a "best viewed on desktop" banner below 1024px rather than breaking the layout.

## Target Users
- High school players / parents making recruiting posts
- Coaches and small sports media/agency accounts
- Anyone needing repeatable, branded recruit graphics

## Core Features

### Live template editor
Fixed design system: dark navy/black textured background, purple lightning energy, gold paint splatter, subtle halftone overlay, bold "INCOMING" headline.
- **Palette** (lock these so output is consistent): navy `#0A0E1A`, near-black `#050608`, accent purple `#8B2FE0`, accent gold `#D4A017`, text white `#F5F5F0`.
- **Typography**: one heavy display font for "INCOMING" / player name, one condensed sans for labels/stats. Pick two Google Fonts (e.g. Anton + Barlow Condensed) so nothing needs licensing.

### Photo handling
- 3 photo slots: large central hero + 2 smaller side shots.
- Accepted formats: JPG/PNG/WEBP, max 15MB per file, client-side validated before upload.
- **AI background removal** on the hero shot (primary path) — cutout placed over the texture automatically.
- **Manual crop/zoom/reposition** controls per photo — this is not a fallback-only feature, it's always available so users can fine-tune AI output too.
- If AI removal fails or times out (>8s), fall back to the original uncut photo in the same slot with a visible "background removal failed — crop manually" notice, not a silent blank slot.

### Text & branding fields
- Player name, school, position, jersey number, class year — all required before export is enabled.
- 5 skill bullets — editable list, add/remove, 40-char cap each with live counter.
- Team logo + sponsor logo uploads (PNG with transparency recommended; flag if a JPG with a background is uploaded).
- Footer block: quote (120-char cap), signature, up to 3 social handles, sponsor logo.
- App header brand text: dynamic, editable in a settings field (defaults to "RecruitSpotlight"), stored per workspace.

### School-color accent swap
Recolor the purple/gold accents to a custom hex pair. Provide 4–5 preset school-color combos plus a custom picker. Recoloring must not touch the navy/black base or the photos.

### Multi-ratio render + export
- Canvas renders live at 9:16, 4:5, and 1:1.
- Auto-reflow rules per ratio (footer condenses, side photos stack differently) so nothing gets clipped — see Honest Callouts below.
- Export: high-res PNG per ratio (2x pixel density minimum) + "export all 3" batch as a zip.

## User Flow
1. Land on editor with the template pre-loaded, placeholder labels visible, brand header default set.
2. Upload hero photo → AI removes background → auto-placed as cutout → user can nudge/crop/re-crop.
3. Upload 2 side photos → crop/zoom to fit.
4. Fill in name, school, position, number, class year.
5. Add up to 5 skill bullets, team + sponsor logos, footer quote/signature/socials.
6. (Optional) swap accent colors to school colors via preset or custom picker.
7. Preview across 9:16 / 4:5 / 1:1 → export high-res PNG(s), individually or as a batch.
8. Save the design (see Persistence below); reload it later from a "My Graphics" list.

## Persistence ("save designs to workspace")
- No login for v1 — a workspace is identified by a browser-generated ID stored in a cookie/localStorage token, mapped server-side to a MongoDB record. This is a soft identity, not an account: clearing cookies loses access to prior saves.
- Saved design = JSON snapshot (all field values, crop/zoom state, color choices) + references to the uploaded/processed photo assets in Object Storage. Re-opening a save re-hydrates the canvas exactly as left.
- "My Graphics" list shows thumbnail, name/school, last-edited date; supports rename, duplicate, delete.

## Tech Stack
- **Frontend**: React + TypeScript. Canvas library: **Konva** (via react-konva) — pick this over Fabric for the layered drag/crop/export requirements; don't build with both.
- **Backend**: FastAPI — handles uploads, AI background-removal orchestration, asset storage, save/load endpoints.
- **Database**: MongoDB — template configs, saved graphic snapshots, asset references, workspace tokens.
- **AI background removal**: async call from FastAPI to a hosted cutout service, with the 8s timeout + manual-crop fallback described above.
- **Storage**: Object Storage (S3-compatible) for uploaded photos, logos, and exported PNGs. Signed URLs, not public buckets.

## UI/UX Direction
- Split layout: canvas preview left (fixed aspect, ratio-switch tabs above it), controls panel right (photos / text / skills / colors / export as accordion or tab sections).
- Dark UI to match the aesthetic; placeholders shown as literal grey-label text until filled, not lorem ipsum.
- Non-destructive edits — re-upload or reposition anytime without losing other field values.
- Warning banner if an element set will crowd the 1:1 ratio (hero + 2 photos + 6 text fields + logos + 5 bullets + footer), nudging toward 4:5 as the recommended default — this is informational, never a hard block.
- Empty/error states: no photo uploaded yet → visible placeholder silhouette in that slot, not a blank void. Export button disabled (with tooltip explaining why) until required fields + hero photo are present.

## Acceptance Criteria
- A user can go from blank editor to a downloaded, correctly-cropped PNG in all 3 ratios without touching devtools or refreshing.
- Reloading a saved design reproduces the canvas pixel-for-pixel (same crops, colors, text).
- AI removal failure never blocks the flow — manual crop always gets the user to export.
- Exported PNGs are print-usable resolution (long edge ≥ 1920px at 2x).

## Assumptions (flag if wrong)
- Single-user-per-workspace for v1, no formal login — see Persistence above for how "save" works without accounts.
- Background art is a baked-in master design; accent-color recoloring is the only structural flexibility in v1.
- Konva is acceptable as the canvas engine (chosen over Fabric to avoid maintaining two rendering paths).

## Honest Callouts
- The 1:1 square will fight you — hero + 2 photos + 6 text fields + logos + 5 bullets + full footer is a lot of content for a square frame. Footer and side photos auto-reflow per ratio to stay readable; 4:5 remains the recommended default, and 1:1 gets a soft warning, not a hard limit.
- AI background removal is strong on clean-contrast shots, weak on busy gym backgrounds (crowds, banners, reflective floors). Manual crop is not an edge-case fallback — build it as a first-class, always-available control, since a meaningful share of users will need it every time.

## Future Improvements (v2+)
- Accounts + saved player profiles and post history (agency/school use)
- Multiple template styles beyond "INCOMING" (Committed, Game Day, Player of the Week)
- Direct Instagram publishing/scheduling
- Transparent PNG export for further design work
