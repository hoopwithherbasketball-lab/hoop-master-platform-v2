# Hoop With Her Recruiting Command Center™

## Product decision

The spreadsheet concept becomes a first-class module inside HWH Player Advantage™ rather than a separate product. The platform should use the athlete profile as the source of truth and connect evaluations, scouting reports, video, school research, coach communication, showcase scheduling, and recruiting analytics around that profile.

## Existing foundation

The repository already contains:

- Player profiles and game statistics
- A player portal
- Player evaluation retrieval and submission through the existing evaluation feature
- Public player detail pages
- Admin and coach dashboards
- Supabase authentication and persistence

The recruiting package is currently a placeholder, so the first implementation goal is to turn it into the shared recruiting domain layer used by the web application and future mobile clients.

## Phase 1: Recruiting Command Center MVP

Create an authenticated route at `/dashboard/recruiting` with the following sections:

1. **Recruiting Overview**
   - Recruiting readiness score
   - Profile completion
   - Number of target schools
   - Active coach conversations
   - Follow-ups due
   - Upcoming showcases
   - Latest evaluation and performance snapshot

2. **School Pipeline**
   - Target schools
   - Division, conference, location, academic fit, athletic fit, and cost notes
   - Pipeline stage from research through commitment
   - Scholarship and roster opportunity status

3. **Coach CRM**
   - Coach and staff contacts
   - Contact history
   - Response status
   - Next follow-up date
   - Conversation notes and next action

4. **Evaluations and Scouting Reports**
   - Read the current evaluation from the existing evaluation feature
   - Display strengths, development priorities, projection, evaluator, and evaluation date
   - Store future structured scouting reports without replacing the existing evaluation workflow

5. **Highlight Video Library**
   - Video title, URL, thumbnail, duration, event, date, position focus, and visibility
   - Mark one video as the primary recruiting highlight
   - Track which video was sent to each school or coach

6. **Showcase and Camp Scheduler**
   - Event details, registration status, cost, travel details, coaches expected, and follow-up tasks
   - Link event performance notes, clips, and evaluation updates to the athlete profile

7. **AI Coach Email Studio**
   - Generate a draft from verified athlete data, school information, recent evaluation, upcoming event, and selected highlight video
   - Require athlete or parent review before sending
   - Save generated drafts and final sent versions in the communication history

8. **Recruiting Analytics**
   - Schools researched
   - Coaches contacted
   - Response rate
   - Follow-up completion rate
   - Event attendance
   - Profile and video views when available
   - Pipeline movement over time
   - Recruiting expenses by category

## Data ownership rules

- `player_profiles` remains the athlete identity source of truth.
- Existing evaluation data remains authoritative until a dedicated evaluation migration is approved.
- Recruiting records must always be scoped to a player profile.
- Coach-facing private evaluation notes must remain role-gated.
- AI-generated text is always a draft and must not be sent automatically in the MVP.
- Analytics must be derived from real activity records, not manually entered summary numbers.

## Proposed recruiting entities

These entities should be added only after checking all existing migrations for naming collisions:

- recruiting_schools
- recruiting_coaches
- recruiting_interactions
- recruiting_tasks
- recruiting_events
- recruiting_event_attendance
- recruiting_videos
- recruiting_video_shares
- recruiting_email_drafts
- recruiting_expenses
- recruiting_pipeline_history

Every new table should include organization or owner scoping where required, `player_profile_id`, timestamps, and Row Level Security policies.

## First vertical slice

The first shippable slice should connect real data already in the repository:

1. Add the `/dashboard/recruiting` route.
2. Load the signed-in athlete's `player_profiles` record.
3. Load the latest game statistics.
4. Load the latest evaluation through `usePlayerEvaluation`.
5. Display readiness, evaluation, stats, videos, follow-ups, and upcoming events in one page.
6. Use empty states for new recruiting tables until their migration is introduced.

This delivers immediate value without waiting for the full school database or AI layer.

## Delivery sequence

### Sprint 1 — Foundation

- Shared recruiting TypeScript types
- Recruiting readiness scoring utility
- Recruiting dashboard route and page shell
- Existing athlete, stats, and evaluation integration
- Navigation entry

### Sprint 2 — Pipeline and scheduling

- Recruiting database migration and RLS
- School pipeline
- Coach CRM
- Follow-up tasks
- Showcase calendar
- Expense tracking

### Sprint 3 — Media and communication

- Highlight video library
- Video-to-school sharing history
- AI coach email draft generation
- Saved drafts and communication log

### Sprint 4 — Analytics and reports

- Recruiting funnel analytics
- Response and follow-up metrics
- Event ROI and expense reporting
- Weekly athlete and parent progress report
- Exportable recruiting report

### Sprint 5 — Mobile readiness

- Convert the web experience into a responsive PWA first
- Add push-ready reminder architecture
- Preserve the same Supabase data model and authorization rules
- Evaluate native packaging only after web usage proves which mobile workflows matter most

## Definition of done for the flagship MVP

An athlete or parent can open one dashboard and see current performance, latest evaluation, recruiting readiness, target schools, coach conversations, videos, events, expenses, and next actions. A coach email can be drafted from verified profile data, reviewed, logged, and connected to the correct school and video. Staff can monitor progress without maintaining a second spreadsheet.