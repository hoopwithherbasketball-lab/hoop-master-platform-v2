# NIL Hub component regression checks

Run `npm ci` at the repository root, then `npm run test:nil`.

The tests use the esbuild and jsdom dependencies already included in the workspace lockfile. They render the actual React components with an isolated Supabase response stub. They never use real credentials, send outreach, or change remote records.

Covered behavior:
- Create a proposal with a directly entered recipient when the NIL brand query fails.
- Reject any request for `crm_partners` or `sponsorship_inventory`.
- Save native NIL details without assigning a NIL brand ID to the CRM foreign key.
- Preserve the draft after failed persistence and allow a successful retry.
- Preserve opportunity cents when opening the edit form.
- Display an overview error instead of fabricated zero counts; recover on retry.
- Preserve the existing signed-out, non-admin, and admin route-guard behavior.

These component tests do not establish browser layout quality or production database permissions. All production `/nil/*` routes retain their existing admin guard. The test harness is outside the application entry points and production bundle.
