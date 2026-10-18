
# ConnectGBB recruiting engine: screenshot reverse-engineering and delivery plan

## Source workflow translated into product requirements

The supplied D1 Scholarship flowchart is a *marketing/recruiting process diagram*, not evidence of a scholarship-probability formula. It depicts the following inputs and connections:

| Diagram node(s) | ConnectGBB equivalent | Reuse/new |
| --- | --- | --- |
| Email → Video → Skill 1–5 | Athlete profile, skill-tagged clips, full-game film and personalized introduction | Existing profile/film; skill tagging future |
| Twitter/X Bio, Pinned Tweet, DMs, Tags | Permission-aware social/profile checklist; manual outreach channel and history | Pipeline channel logging added |
| Coach Referrals → Highlight Video, Profile | Verified referral provenance, coach recommendation and permissions | `coach_referral_notes` exists; integration later |
| Recruiting Events → In-person / Stay In Touch / More Info | `player_events` and event attendance, then timeline entry and follow-up | Events exist; relationship logging added |
| First Conversation | Logged conversation with channel and dated summary | Added |
| Transcripts / Test Scores / New Video / Schedule / Coach Contact / Keep In Touch | Requested-material checklist and private academics with controlled sharing | Existing profile/film; checklist future |
| Follow Up Conversations → Recruiting Event / Text / Phone | Next-action tasks and contact history | Added |
| 0–100 scholarship arrow | **Do not reproduce as a scholarship-probability claim.** Use documented process milestones and academic/financial fit instead | Required safeguard |

## Target product

Personalized college-fit shortlist -> verified professional contacts -> draft personalized outreach -> guardian review and applicable rules check -> manually confirmed contact -> response/film/event updates -> follow-up queue -> visits/offers -> net-cost decision.

### Current integration slice (PR 1)
- Membership-gated, private **Recruiting Tracker** for authenticated athletes whose account owns a player profile.
- Create recruiting targets with program, division, coach details, source and next action.
- Move a program through a transparent, manually selected stage. Labels distinguish *contact logged*, *response logged*, *offer reported* and *decision recorded*.
- Manually log actual email, X, phone, text, event or referral interactions; view history in chronological order.
- Show follow-ups due, program count, programs with logged inbound responses, and self-reported offers.
- Reuse `@hoop-master/features/recruiting` for domain stage vocabulary and testable summaries.
- Row-level security defaults to **owner-only** for both tables; this data is never public or searchable by other athletes/coaches.
- No background sends, scraping, grade/transcript publication, guardian contact disclosure or financial-aid predictions.
- Existing educational roadmap, templates, college fit advice, coach search and media retain their existing implementations.

### Next integration slices (separate PRs)
1. **Asset readiness**: Use `player_profiles` and `film_entries`; five adjustable skill categories; verified full-game clips; private academics as separately permissioned records.
2. **Coach discovery**: Verified *professional* college athletics contacts with attribution, source date, opt-out flags and manual verification; no harvesting personal SMS/DM contact details.
3. **Outreach composer**: Reuse `recruitingEmailTemplates`; per-program personalization, review/approval workflow, required fields and current NCAA/NAIA/NJCAA rule verification. Sending remains disabled until age/guardian, consent, opt-out, sender verification and provider integration are tested.
4. **Referral/event handoffs**: Associate `coach_referral_notes`, `player_events`, and film to recruiting programs with owner/guardian-controlled consent, per-resource access and audit logging.
5. **Coach relationship intelligence**: Explicit requests for full-game film, questionnaire, evaluation, visit and program/roster need; no inference that social likes or event invitations mean offers.
6. **Decision center**: Written-offer evidence verification, academic-major fit, estimated net price, confirmed scholarship terms and deadline reminders; clearly distinguish confirmed vs family-entered facts.
7. **Parent access**: Explicit verified guardian-athlete relationship, scoped RLS and audit logs, age-aware communication; no assumption a parent account owns the child's profile.
8. **Messaging and automation**: Opt-in task reminders, no unsolicited auto-contact. Delivery, replies and suppression lists are auditable and use approved integrations.

### Suggested UI
- Recruiting Tracker: metrics / program list / follow-up queue / per-program activity timeline.
- Program workspace: academic fit, roster fit, film and coach contacts, written notes, next action.
- Outreach draft builder: scenario templates and required token validation.
- Parent review: permission and review workflow, with controlled transcript sharing.
- Decision center: full cost of attendance, written aid offers, renewals and athlete priorities.

### Security, legal and recruiting guardrails
- Player is often a minor: verify guardian permissions, approved staff identity, role access and consent **before external outreach or document sharing**.
- Never put guardian contacts, transcripts, private evaluations or coach relationship notes in public tables/feeds.
- Do not auto-send unsolicited emails, SMS or DMs; enforce provider-specific policies, anti-spam rules, stop requests and reasonable message cadence if sending is later enabled.
- NCAA, NAIA and NJCAA contact and evaluation restrictions vary by date, division, and sport; compliance checks must be current before outreach. Sending a draft cannot establish that coach response or attendance is permitted.
- Offer statuses are family reported until independently verified in writing. Never promise scholarships or claim a 0–100 probability.
- Do not use stealth tracking pixels against coaches or expose minors' engagement history to third parties without a compliant consent and disclosure plan.
- Run migration only after security review and environment backups. Test owner A cannot view/update/inject owner B's records, including references to B's targets, and ensure unauthenticated users have no access.

### QA acceptance criteria
1. Logged-in player with their own profile can create a school, update stage, set next action, and log interaction.
2. Owner A cannot see or mutate Owner B's recruiting program or create an interaction attached to B's program.
3. A public player profile or coach role does not grant access to personal pipeline notes.
4. Membership-inactive accounts cannot use the dashboard UI.
5. Logged outbound messages are never presented as provider-delivered messages, and no message is sent.
6. Logged inbound interaction is required for the 'responses logged' metric.
7. Closed and committed records are excluded from due-action count.
8. No documents/transcripts/guardian contact information or coach personal SMS are published.
9. CI build, `npm run test:recruiting`, lint/typecheck, SQL migration review and a manual browser test pass before merge.

### Rollout
**Current PR is a reviewable implementation, not a deployment.** No production migration or real message sends have been run. Apply schema in a staging environment, test RLS with two accounts, verify members-only route behavior and run build/tests. Only then approve merge and schedule production rollout.
