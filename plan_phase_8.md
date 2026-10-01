# Phase 8: Page Builder MVP - Implementation Plan

## Objective
Build a dynamic, database-driven Page Builder that allows admins to create, preview, and publish landing pages and resources without writing code. 

Currently, the admin preview (`AdminPageBuilderPage.tsx`) stores drafts in `localStorage`, while the public viewer (`usePageBuilder.ts` -> `DynamicPage.tsx`) attempts to fetch from non-existent Supabase tables (`page_builder_pages` and `page_builder_blocks`). This phase will unify the architecture, create the database schema, and build out the UI block components.

---

## 1. Database & Schema Architecture
We need to create a new migration file in Supabase to establish the `page_builder` tables and secure them via RLS.

**`page_builder_pages` Table**
- `id` (uuid, primary key)
- `slug` (text, unique)
- `title` (text)
- `status` (enum: draft, published, archived)
- `audience` (enum: public, players, coaches, admins)
- `theme_json` (jsonb) - Stores accent and surface theme choices
- `seo_json` (jsonb) - Stores SEO title, description, and noIndex
- `created_at`, `updated_at`, `updated_by`

**`page_builder_blocks` Table**
- `id` (uuid, primary key)
- `page_id` (uuid, foreign key to `page_builder_pages` on delete cascade)
- `type` (text) - hero, richText, featureGrid, stats, cta, mediaEmbed, leadCapture
- `order_index` (integer) - Defines the rendering sequence
- `content_json` (jsonb) - Flexible payload for block-specific content (e.g., arrays for feature grids, URLs for media embeds)

**RLS Policies**
- **Admins:** Full CRUD operations on both tables.
- **Public:** `SELECT` access to `page_builder_pages` where `status = 'published'`, and `SELECT` access to `page_builder_blocks` joined to published pages.

---

## 2. Refactoring the Admin Editor
The current `AdminPageBuilderPage.tsx` MVP relies entirely on `localStorage` for rapid prototyping. We need to:
- Rip out `localStorage` logic.
- Connect `AdminPageBuilderPage.tsx` to Supabase hooks.
- Create API helpers or use `supabase-js` to handle saving drafts and publishing pages. Saving a page requires an upsert to the page table, and an upsert/delete-sync on the associated blocks to match `order_index`.

---

## 3. UI Block Components Implementation
We need to flesh out the rendering layer in `@hoop-master/ui/src/blocks/` and ensure `DynamicPage.tsx` (via `PageRenderer`) can render each of the defined block types cleanly using our design system.

We will build the following block components:
- `<HeroBlock />` - Full-width hero with primary/secondary actions.
- `<RichTextBlock />` - Prose container for standard text.
- `<FeatureGridBlock />` - Grid mapping for icons and descriptions.
- `<StatsBlock />` - Big number callouts.
- `<CtaBlock />` - Lead conversion actions.
- `<MediaEmbedBlock />` - YouTube/Vimeo iframe wrappers.
- `<LeadCaptureBlock />` - Form integration for collecting data.

---

## 4. Quality Assurance & E2E
- Ensure `PageBuilder.validatePageDefinition` triggers correctly before allowing a "Publish" action.
- Update Playwright E2E tests to simulate an admin creating and publishing a page, then visiting the public slug (`/p/:slug`) to verify rendering.

---

## Next Steps
With your approval, we will begin Step 1: Writing and executing the Supabase migration for the `page_builder_pages` and `page_builder_blocks` schema.
