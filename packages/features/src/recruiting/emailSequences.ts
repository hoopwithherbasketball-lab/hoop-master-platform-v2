export type RecruitingAudience = 'athlete' | 'family' | 'college_coach' | 'internal_staff'

export type RecruitingStageId =
  | 'launch'
  | 'profile_assets'
  | 'evaluation'
  | 'target_list'
  | 'initial_outreach'
  | 'follow_up'
  | 'event_outreach'
  | 'coach_engagement'
  | 'monthly_update'
  | 'family_update'
  | 'paused'

export type RecruitingScenarioId =
  | 'standard'
  | 'guard'
  | 'forward'
  | 'new_film'
  | 'academic_update'
  | 'injury_update'
  | 'position_change'
  | 'open_run'
  | 'showcase'
  | 'camp_invite'
  | 'coach_call'
  | 'no_response'
  | 'program_fit'

export interface RecruitingStage {
  id: RecruitingStageId
  label: string
  shortLabel: string
  description: string
  order: number
}

export interface RecruitingScenario {
  id: RecruitingScenarioId
  label: string
}

export interface RecruitingEmailVariant {
  id: string
  label: string
  whenToUse: string
  subject: string
  body: string
}

export interface RecruitingEmailTemplate {
  id: string
  stage: RecruitingStageId
  title: string
  description: string
  audience: RecruitingAudience
  cadence: string
  trigger: string
  goal: string
  scenarios: RecruitingScenarioId[]
  variants: RecruitingEmailVariant[]
}

export interface RecruitingPersonalizationField {
  token: string
  label: string
  placeholder: string
  group: 'athlete' | 'coach' | 'program' | 'event' | 'links' | 'staff'
}

export const recruitingStages: RecruitingStage[] = [
  { id: 'launch', label: 'Recruiting Launch', shortLabel: 'Launch', description: 'Welcome the family, set expectations, and establish the next action.', order: 1 },
  { id: 'profile_assets', label: 'Profile & Film Readiness', shortLabel: 'Profile', description: 'Collect missing recruiting assets before coach contact begins.', order: 2 },
  { id: 'evaluation', label: 'Evaluation Delivery', shortLabel: 'Evaluation', description: 'Deliver the athlete evaluation and turn findings into priorities.', order: 3 },
  { id: 'target_list', label: 'College-Fit List', shortLabel: 'Target List', description: 'Review academic, athletic, geographic, and roster fit.', order: 4 },
  { id: 'initial_outreach', label: 'Initial Coach Outreach', shortLabel: 'Introduction', description: 'Introduce the athlete with a clear fit reason and verified links.', order: 5 },
  { id: 'follow_up', label: 'No-Response Follow-Up', shortLabel: 'Follow-Up', description: 'Add useful information without sending repetitive messages.', order: 6 },
  { id: 'event_outreach', label: 'Event Communication', shortLabel: 'Events', description: 'Share schedules before an event and a focused recap afterward.', order: 7 },
  { id: 'coach_engagement', label: 'Coach Engagement', shortLabel: 'Engaged', description: 'Respond to coach interest, invitations, and calls promptly.', order: 8 },
  { id: 'monthly_update', label: 'Monthly Recruiting Update', shortLabel: 'Monthly', description: 'Keep active programs informed with meaningful progress.', order: 9 },
  { id: 'family_update', label: 'Family Progress Update', shortLabel: 'Family', description: 'Summarize outreach, replies, next steps, and family action items.', order: 10 },
  { id: 'paused', label: 'Pause or Close the Loop', shortLabel: 'Pause', description: 'Close communication professionally when timing or fit changes.', order: 11 },
]

export const recruitingScenarios: RecruitingScenario[] = [
  { id: 'standard', label: 'Standard' },
  { id: 'guard', label: 'Guard' },
  { id: 'forward', label: 'Forward / Post' },
  { id: 'new_film', label: 'New Film' },
  { id: 'academic_update', label: 'Academic Update' },
  { id: 'injury_update', label: 'Injury Update' },
  { id: 'position_change', label: 'Position Change' },
  { id: 'open_run', label: 'Open Run' },
  { id: 'showcase', label: 'Showcase / Tournament' },
  { id: 'camp_invite', label: 'Camp Invite' },
  { id: 'coach_call', label: 'Coach Call' },
  { id: 'no_response', label: 'No Response' },
  { id: 'program_fit', label: 'Program Fit Changed' },
]

export const recruitingPersonalizationFields: RecruitingPersonalizationField[] = [
  { token: 'athlete_first_name', label: 'Athlete first name', placeholder: 'Maya', group: 'athlete' },
  { token: 'athlete_full_name', label: 'Athlete full name', placeholder: 'Maya Johnson', group: 'athlete' },
  { token: 'grad_year', label: 'Graduation year', placeholder: '2028', group: 'athlete' },
  { token: 'position', label: 'Position', placeholder: 'PG / SG', group: 'athlete' },
  { token: 'height', label: 'Height', placeholder: "5'9\"", group: 'athlete' },
  { token: 'school_name', label: 'High school', placeholder: 'Central High School', group: 'athlete' },
  { token: 'club_team', label: 'Club team', placeholder: 'HOOP WITH HER Select', group: 'athlete' },
  { token: 'gpa', label: 'Core GPA', placeholder: '3.7', group: 'athlete' },
  { token: 'academic_interest', label: 'Academic interest', placeholder: 'Sports medicine', group: 'athlete' },
  { token: 'coach_name', label: 'Coach name', placeholder: 'Coach Taylor', group: 'coach' },
  { token: 'program_name', label: 'College program', placeholder: 'North State University', group: 'program' },
  { token: 'fit_reason', label: 'Program fit reason', placeholder: 'your transition style and strong kinesiology program', group: 'program' },
  { token: 'profile_url', label: 'Recruiting profile URL', placeholder: 'https://example.com/profile', group: 'links' },
  { token: 'highlight_url', label: 'Highlight reel URL', placeholder: 'https://example.com/highlights', group: 'links' },
  { token: 'full_game_url', label: 'Full-game film URL', placeholder: 'https://example.com/full-game', group: 'links' },
  { token: 'schedule_url', label: 'Schedule URL', placeholder: 'https://example.com/schedule', group: 'links' },
  { token: 'event_name', label: 'Event name', placeholder: 'Fall Open Run', group: 'event' },
  { token: 'event_date', label: 'Event date', placeholder: 'October 12', group: 'event' },
  { token: 'event_location', label: 'Event location', placeholder: 'HOOP WITH HER Training Center', group: 'event' },
  { token: 'court_number', label: 'Court number', placeholder: 'Court 2', group: 'event' },
  { token: 'event_result', label: 'Event result / takeaway', placeholder: '12 points, 6 assists, and strong on-ball defense', group: 'event' },
  { token: 'new_update', label: 'New recruiting update', placeholder: 'a new highlight reel and updated spring schedule', group: 'athlete' },
  { token: 'next_action', label: 'Next action', placeholder: 'review the target list by Friday', group: 'staff' },
  { token: 'staff_name', label: 'Staff member name', placeholder: 'Jordan Smith', group: 'staff' },
]

export const recruitingEmailTemplates: RecruitingEmailTemplate[] = [
  {
    id: 'launch-family-welcome',
    stage: 'launch',
    title: 'Family Recruiting Launch',
    description: 'Starts the guided recruiting process with roles, expectations, and a concrete first action.',
    audience: 'family',
    cadence: 'Day 0',
    trigger: 'Enrollment or recruiting-service activation',
    goal: 'Confirm the process and secure the first family action.',
    scenarios: ['standard'],
    variants: [
      {
        id: 'launch-standard',
        label: 'Standard welcome',
        whenToUse: 'Default launch message after enrollment.',
        subject: '{{athlete_first_name}}\'s HOOP WITH HER recruiting launch',
        body: `Hi {{athlete_first_name}} and family,

Welcome to your HOOP WITH HER recruiting launch. Over the next several weeks, we will organize {{athlete_first_name}}'s profile, film, evaluation, college-fit list, and coach outreach plan.

Our first step is to verify the information coaches will use:
- Graduation year: {{grad_year}}
- Position: {{position}}
- School: {{school_name}}
- Club team: {{club_team}}

Next action: {{next_action}}.

We will never guarantee offers or roster spots. Our role is to help your family present accurate information, communicate professionally, and stay consistent throughout the process.

— {{staff_name}}
HOOP WITH HER`,
      },
      {
        id: 'launch-accelerated',
        label: 'Accelerated timeline',
        whenToUse: 'An event or coach-contact deadline is approaching.',
        subject: 'Action needed: {{athlete_first_name}} recruiting launch',
        body: `Hi {{athlete_first_name}} and family,

We are starting an accelerated recruiting launch because an upcoming opportunity is time-sensitive. Before outreach begins, we need to confirm {{athlete_first_name}}'s core profile, film, schedule, and academic information.

Please complete this next action first: {{next_action}}.

Once the information is verified, HOOP WITH HER will prepare the first outreach drafts for family review.

— {{staff_name}}`,
      },
    ],
  },
  {
    id: 'profile-assets-request',
    stage: 'profile_assets',
    title: 'Missing Profile Assets',
    description: 'Requests only the assets that block a credible coach introduction.',
    audience: 'family',
    cadence: 'Day 1–3',
    trigger: 'Profile-readiness review finds missing or outdated material',
    goal: 'Complete the minimum viable recruiting profile.',
    scenarios: ['standard', 'new_film'],
    variants: [
      {
        id: 'assets-standard',
        label: 'Profile checklist',
        whenToUse: 'Several profile fields or links need confirmation.',
        subject: 'Items needed for {{athlete_first_name}}\'s recruiting profile',
        body: `Hi {{athlete_first_name}} and family,

We reviewed the recruiting profile and need the following items before coach outreach:
- Verified height and position
- Current school and club team
- Core GPA
- Highlight reel
- At least one recent full-game film link
- Upcoming schedule

Current profile: {{profile_url}}

Next action: {{next_action}}.

Please send original links and accurate information. HOOP WITH HER will review everything before it is used in outreach.

— {{staff_name}}`,
      },
      {
        id: 'assets-film-only',
        label: 'Film refresh',
        whenToUse: 'The profile is complete but film is old or incomplete.',
        subject: 'Film update needed for {{athlete_first_name}}',
        body: `Hi {{athlete_first_name}} and family,

The profile information is ready. The remaining priority is updated film that shows current decision-making, pace, defense, and role execution.

Please provide:
- A concise current highlight reel
- One or more recent full-game cuts
- Opponent and event context for each game

Next action: {{next_action}}.

— {{staff_name}}`,
      },
    ],
  },
  {
    id: 'evaluation-delivery',
    stage: 'evaluation',
    title: 'Evaluation & Development Priorities',
    description: 'Delivers the evaluation without exposing private notes to coaches.',
    audience: 'family',
    cadence: 'After evaluation review',
    trigger: 'Staff evaluation is complete',
    goal: 'Turn evaluation findings into measurable development and recruiting actions.',
    scenarios: ['standard', 'guard', 'forward'],
    variants: [
      {
        id: 'evaluation-balanced',
        label: 'Balanced evaluation',
        whenToUse: 'Default delivery for any athlete.',
        subject: '{{athlete_first_name}} recruiting evaluation and next priorities',
        body: `Hi {{athlete_first_name}} and family,

We completed the current recruiting evaluation. The review considered film, role, athletic tools, production, academics, and projected college fit.

The strongest current recruiting themes are the skills and habits that consistently appear on film. The next development priorities should now guide training clips, game-film selection, and coach conversations.

Next action: {{next_action}}.

This evaluation is developmental and informational. It does not guarantee placement, offers, or scholarships.

— {{staff_name}}
HOOP WITH HER`,
      },
      {
        id: 'evaluation-guard',
        label: 'Guard emphasis',
        whenToUse: 'Lead guards and combo guards.',
        subject: '{{athlete_first_name}} guard evaluation: recruiting priorities',
        body: `Hi {{athlete_first_name}} and family,

The guard evaluation is complete. Future film and updates should make these areas easy for a college staff to assess: decision-making, pace, ball security, paint touches, shooting versatility, and point-of-attack defense.

Next action: {{next_action}}.

We will use those priorities when selecting clips and explaining {{athlete_first_name}}'s projected role.

— {{staff_name}}`,
      },
      {
        id: 'evaluation-forward',
        label: 'Forward / post emphasis',
        whenToUse: 'Wings, forwards, and posts.',
        subject: '{{athlete_first_name}} frontcourt evaluation: recruiting priorities',
        body: `Hi {{athlete_first_name}} and family,

The frontcourt evaluation is complete. Future film and updates should clearly show positional mobility, rebounding range, screening, finishing, defensive versatility, and any perimeter skill that expands {{athlete_first_name}}'s projected role.

Next action: {{next_action}}.

— {{staff_name}}`,
      },
    ],
  },
  {
    id: 'target-list-review',
    stage: 'target_list',
    title: 'College-Fit List Review',
    description: 'Invites the family to review fit factors before outreach starts.',
    audience: 'family',
    cadence: 'Before first coach contact',
    trigger: 'Initial college-fit list is ready',
    goal: 'Approve a realistic, balanced list of programs.',
    scenarios: ['standard', 'program_fit'],
    variants: [
      {
        id: 'target-list-standard',
        label: 'Initial list review',
        whenToUse: 'First complete fit-list review.',
        subject: '{{athlete_first_name}} college-fit list is ready for review',
        body: `Hi {{athlete_first_name}} and family,

The first college-fit list is ready. Programs were considered across athletic role, academic interest, location, roster need, and current recruiting level.

Please review the list with three questions in mind:
1. Would {{athlete_first_name}} be happy attending this school without basketball?
2. Does the academic offering support {{academic_interest}}?
3. Is the projected basketball role realistic and appealing?

Next action: {{next_action}}.

We will finalize the first outreach group after your feedback.

— {{staff_name}}`,
      },
      {
        id: 'target-list-reset',
        label: 'List reset',
        whenToUse: 'The current list is too narrow or program fit has changed.',
        subject: 'Refreshing {{athlete_first_name}}\'s college-fit list',
        body: `Hi {{athlete_first_name}} and family,

Based on the latest recruiting information, we recommend refreshing the target list. This is a normal part of a healthy process and gives us a chance to rebalance academic, athletic, geographic, and roster-fit priorities.

Next action: {{next_action}}.

The goal is a list with credible opportunities at several levels—not a list built only around name recognition.

— {{staff_name}}`,
      },
    ],
  },
  {
    id: 'coach-introduction',
    stage: 'initial_outreach',
    title: 'Initial College Coach Introduction',
    description: 'A short athlete-voice introduction with one clear program-fit reason.',
    audience: 'college_coach',
    cadence: 'First contact',
    trigger: 'Profile, film, and target program are approved',
    goal: 'Earn a profile or film review without overstating the athlete.',
    scenarios: ['standard', 'guard', 'forward'],
    variants: [
      {
        id: 'intro-standard',
        label: 'Balanced introduction',
        whenToUse: 'Default first contact.',
        subject: '{{grad_year}} {{position}} {{athlete_full_name}} | {{school_name}}',
        body: `Hi {{coach_name}},

My name is {{athlete_full_name}}, a {{grad_year}} {{position}} at {{school_name}} playing with {{club_team}}. I am interested in {{program_name}} because of {{fit_reason}}.

Profile: {{profile_url}}
Highlights: {{highlight_url}}
Full game: {{full_game_url}}
Schedule: {{schedule_url}}

Thank you for taking the time to learn more about me. I would appreciate any feedback on whether I may fit your recruiting needs.

{{athlete_full_name}}
{{grad_year}} | {{position}} | {{height}}`,
      },
      {
        id: 'intro-guard',
        label: 'Guard introduction',
        whenToUse: 'Lead guard or combo guard whose film supports the claims.',
        subject: '{{grad_year}} guard {{athlete_full_name}} | Film and schedule',
        body: `Hi {{coach_name}},

I am {{athlete_full_name}}, a {{height}} {{grad_year}} {{position}} from {{school_name}}. My game is built around pace, decision-making, creating paint touches, and defending the ball. I am especially interested in {{program_name}} because of {{fit_reason}}.

Profile: {{profile_url}}
Highlights: {{highlight_url}}
Full game: {{full_game_url}}
Schedule: {{schedule_url}}

Thank you for your time,
{{athlete_full_name}}`,
      },
      {
        id: 'intro-forward',
        label: 'Forward / post introduction',
        whenToUse: 'Wing, forward, or post whose film supports the claims.',
        subject: '{{grad_year}} {{position}} {{athlete_full_name}} | {{height}} | Film',
        body: `Hi {{coach_name}},

I am {{athlete_full_name}}, a {{height}} {{grad_year}} {{position}} at {{school_name}}. I contribute through rebounding, finishing, defensive versatility, and expanding floor skill. I am interested in {{program_name}} because of {{fit_reason}}.

Profile: {{profile_url}}
Highlights: {{highlight_url}}
Full game: {{full_game_url}}
Schedule: {{schedule_url}}

Thank you for reviewing my information,
{{athlete_full_name}}`,
      },
    ],
  },
  {
    id: 'coach-follow-up',
    stage: 'follow_up',
    title: 'Coach Follow-Up Without a Reply',
    description: 'A concise follow-up that adds context or a real update.',
    audience: 'college_coach',
    cadence: '7–10 days after initial contact',
    trigger: 'No reply and no opt-out after the first email',
    goal: 'Return to the coach’s inbox with new value.',
    scenarios: ['no_response', 'new_film', 'academic_update'],
    variants: [
      {
        id: 'follow-up-update',
        label: 'Value-added update',
        whenToUse: 'There is a meaningful new result, schedule, or asset.',
        subject: 'Update: {{grad_year}} {{position}} {{athlete_full_name}}',
        body: `Hi {{coach_name}},

I wanted to follow up on my introduction and share a quick update: {{new_update}}.

Updated profile: {{profile_url}}
Film: {{highlight_url}}
Schedule: {{schedule_url}}

I remain interested in {{program_name}} because of {{fit_reason}}. Thank you for your time.

{{athlete_full_name}}`,
      },
      {
        id: 'follow-up-brief',
        label: 'Brief check-in',
        whenToUse: 'One final concise follow-up when there is no major update.',
        subject: 'Following up | {{athlete_full_name}}, {{grad_year}} {{position}}',
        body: `Hi {{coach_name}},

I am following up on the recruiting information I sent for {{program_name}}. My current profile, film, and schedule are below if helpful:

{{profile_url}}
{{highlight_url}}
{{schedule_url}}

Thank you for your consideration,
{{athlete_full_name}}`,
      },
      {
        id: 'follow-up-academic',
        label: 'Academic update',
        whenToUse: 'There is a verified GPA, test, or academic-interest update.',
        subject: 'Academic and recruiting update | {{athlete_full_name}}',
        body: `Hi {{coach_name}},

I wanted to share an academic update as I continue learning about {{program_name}}. My current core GPA is {{gpa}}, and I am interested in studying {{academic_interest}}.

Recruiting profile: {{profile_url}}
Film: {{highlight_url}}

Thank you,
{{athlete_full_name}}`,
      },
    ],
  },
  {
    id: 'event-communication',
    stage: 'event_outreach',
    title: 'Event & Open Run Communication',
    description: 'Shares viewing details before an event and a useful recap afterward.',
    audience: 'college_coach',
    cadence: '5–7 days before; 1–2 days after',
    trigger: 'Approved event schedule or completed event',
    goal: 'Make live or film evaluation easy for the coach.',
    scenarios: ['open_run', 'showcase', 'new_film'],
    variants: [
      {
        id: 'event-open-run',
        label: 'Upcoming Open Run',
        whenToUse: 'The athlete will participate in a scheduled Open Run.',
        subject: '{{athlete_full_name}} at {{event_name}} | {{event_date}}',
        body: `Hi {{coach_name}},

I will participate in {{event_name}} on {{event_date}} at {{event_location}}. I am scheduled for {{court_number}}.

Profile: {{profile_url}}
Highlights: {{highlight_url}}

If your staff is attending or reviewing event film, I would appreciate the opportunity to be evaluated.

Thank you,
{{athlete_full_name}}`,
      },
      {
        id: 'event-showcase',
        label: 'Showcase / tournament notice',
        whenToUse: 'The athlete has a verified tournament or showcase schedule.',
        subject: '{{event_name}} schedule | {{athlete_full_name}}, {{grad_year}} {{position}}',
        body: `Hi {{coach_name}},

I will compete at {{event_name}} on {{event_date}} in {{event_location}}. My complete schedule is available here: {{schedule_url}}.

Profile: {{profile_url}}
Film: {{highlight_url}}

Thank you for following my progress,
{{athlete_full_name}}`,
      },
      {
        id: 'event-recap',
        label: 'Post-event recap',
        whenToUse: 'Within two days of a completed event.',
        subject: '{{event_name}} recap and film | {{athlete_full_name}}',
        body: `Hi {{coach_name}},

Thank you for following my schedule at {{event_name}}. A key takeaway from the event was {{event_result}}.

Updated film: {{highlight_url}}
Full game: {{full_game_url}}
Profile: {{profile_url}}

I remain interested in {{program_name}} and appreciate your time.

{{athlete_full_name}}`,
      },
    ],
  },
  {
    id: 'coach-engagement-response',
    stage: 'coach_engagement',
    title: 'Responding to Coach Interest',
    description: 'Keeps replies prompt, specific, and easy for the coach to act on.',
    audience: 'college_coach',
    cadence: 'Within one business day',
    trigger: 'Coach replies, requests a call, or extends a camp invitation',
    goal: 'Acknowledge interest and confirm the next action.',
    scenarios: ['coach_call', 'camp_invite', 'standard'],
    variants: [
      {
        id: 'engagement-call',
        label: 'Schedule a call',
        whenToUse: 'A coach asks to speak with the athlete or family.',
        subject: 'Re: {{athlete_full_name}} | Call availability',
        body: `Hi {{coach_name}},

Thank you for reaching out. I would be glad to speak with you and learn more about {{program_name}}.

I will coordinate with my family and reply with availability. If there is anything you would like me to review before the call, please let me know.

Thank you,
{{athlete_full_name}}`,
      },
      {
        id: 'engagement-camp',
        label: 'Camp invitation',
        whenToUse: 'A program sends a camp or clinic invitation.',
        subject: 'Re: {{program_name}} camp invitation | {{athlete_full_name}}',
        body: `Hi {{coach_name}},

Thank you for inviting me to the {{program_name}} camp. My family and I are reviewing the date, travel, and registration details. I will confirm whether I can attend as soon as possible.

I appreciate the invitation and your interest.

{{athlete_full_name}}`,
      },
      {
        id: 'engagement-film-request',
        label: 'Additional film request',
        whenToUse: 'A coach asks for more film or schedule information.',
        subject: 'Requested film | {{athlete_full_name}}',
        body: `Hi {{coach_name}},

Thank you for reviewing my information. Here is the additional material you requested:

Full game: {{full_game_url}}
Highlights: {{highlight_url}}
Schedule: {{schedule_url}}

Please let me know if another game, angle, or date would be more useful.

{{athlete_full_name}}`,
      },
    ],
  },
  {
    id: 'monthly-coach-update',
    stage: 'monthly_update',
    title: 'Monthly Active-Recruiting Update',
    description: 'A compact progress note for programs already in the active outreach group.',
    audience: 'college_coach',
    cadence: 'Every 4–6 weeks when there is meaningful news',
    trigger: 'New verified film, academics, schedule, development, or role information',
    goal: 'Maintain a professional relationship without over-contacting.',
    scenarios: ['standard', 'new_film', 'academic_update', 'position_change', 'injury_update'],
    variants: [
      {
        id: 'monthly-standard',
        label: 'Progress update',
        whenToUse: 'There are one or more meaningful verified updates.',
        subject: '{{athlete_full_name}} monthly recruiting update',
        body: `Hi {{coach_name}},

I wanted to share a brief update as I continue following {{program_name}}: {{new_update}}.

Current profile: {{profile_url}}
Film: {{highlight_url}}
Schedule: {{schedule_url}}

Thank you for continuing to follow my progress.

{{athlete_full_name}}`,
      },
      {
        id: 'monthly-position',
        label: 'Role or position update',
        whenToUse: 'A verified role change affects how the athlete should be evaluated.',
        subject: 'Role update | {{athlete_full_name}}, {{grad_year}} {{position}}',
        body: `Hi {{coach_name}},

I am sharing an update to my current role and position: {{new_update}}. Recent film showing that development is available below.

Highlights: {{highlight_url}}
Full game: {{full_game_url}}
Profile: {{profile_url}}

Thank you,
{{athlete_full_name}}`,
      },
      {
        id: 'monthly-injury',
        label: 'Injury / return update',
        whenToUse: 'Only with family approval and accurate, limited health information.',
        subject: '{{athlete_full_name}} availability update',
        body: `Hi {{coach_name}},

I wanted to share a brief availability update: {{new_update}}. My family and I will provide only confirmed information and will update my schedule when appropriate.

Current profile: {{profile_url}}

Thank you for your understanding,
{{athlete_full_name}}`,
      },
    ],
  },
  {
    id: 'family-progress-report',
    stage: 'family_update',
    title: 'Family Recruiting Progress Report',
    description: 'Summarizes current activity and keeps the family accountable to the next action.',
    audience: 'family',
    cadence: 'Biweekly during launch; monthly after activation',
    trigger: 'Scheduled family checkpoint',
    goal: 'Make progress, blockers, and ownership visible.',
    scenarios: ['standard', 'no_response'],
    variants: [
      {
        id: 'family-progress-standard',
        label: 'Progress checkpoint',
        whenToUse: 'Default scheduled family update.',
        subject: '{{athlete_first_name}} recruiting progress and next action',
        body: `Hi {{athlete_first_name}} and family,

Here is the current recruiting checkpoint:
- Profile and film status: reviewed
- Active outreach: in progress
- Coach responses: documented in the recruiting workspace
- Upcoming event information: {{schedule_url}}

Current priority: {{new_update}}.
Next action: {{next_action}}.

Please reply with any schedule, academic, contact, or availability changes so the record stays accurate.

— {{staff_name}}
HOOP WITH HER`,
      },
      {
        id: 'family-progress-reset',
        label: 'No-response strategy reset',
        whenToUse: 'Coach replies are limited after two thoughtful contacts.',
        subject: 'Recruiting strategy update for {{athlete_first_name}}',
        body: `Hi {{athlete_first_name}} and family,

The current outreach group has produced limited replies. Rather than repeating the same contact, we recommend a strategy reset: review new film, rebalance the target list, and identify the next credible update.

Next action: {{next_action}}.

No response is not a final evaluation of the athlete. It is information we use to improve timing, fit, and presentation.

— {{staff_name}}`,
      },
    ],
  },
  {
    id: 'close-loop',
    stage: 'paused',
    title: 'Pause or Close the Loop',
    description: 'Closes communication respectfully when timing, interest, or fit has changed.',
    audience: 'college_coach',
    cadence: 'As needed',
    trigger: 'Program removed from target list or athlete pauses recruiting activity',
    goal: 'Protect the relationship and keep records accurate.',
    scenarios: ['program_fit', 'injury_update', 'standard'],
    variants: [
      {
        id: 'close-fit-change',
        label: 'Program fit changed',
        whenToUse: 'The athlete is no longer actively pursuing the program.',
        subject: 'Recruiting update | {{athlete_full_name}}',
        body: `Hi {{coach_name}},

Thank you for the time your staff has spent reviewing my information. After discussing my current academic, athletic, and geographic priorities with my family, I am adjusting my college list and will not continue active outreach to {{program_name}} at this time.

I appreciate your consideration and wish your program a successful season.

{{athlete_full_name}}`,
      },
      {
        id: 'close-temporary-pause',
        label: 'Temporary pause',
        whenToUse: 'The athlete needs time before resuming active communication.',
        subject: 'Temporary recruiting update | {{athlete_full_name}}',
        body: `Hi {{coach_name}},

I wanted to let you know that I am temporarily pausing active recruiting communication while my family and I address current priorities. I appreciate your time and will share an update if my availability changes.

Thank you,
{{athlete_full_name}}`,
      },
    ],
  },
]

const tokenPattern = /{{\s*([a-z0-9_]+)\s*}}/gi

export function getTemplateTokens(template: RecruitingEmailTemplate): string[] {
  const tokens = new Set<string>()
  for (const variant of template.variants) {
    for (const text of [variant.subject, variant.body]) {
      for (const match of text.matchAll(tokenPattern)) tokens.add(match[1])
    }
  }
  return [...tokens]
}

export function renderRecruitingTemplate(text: string, values: Record<string, string>): string {
  return text.replace(tokenPattern, (_, token: string) => {
    const value = values[token]?.trim()
    if (value) return value
    const field = recruitingPersonalizationFields.find(item => item.token === token)
    return `[${field?.label ?? token.replace(/_/g, ' ')}]`
  })
}

export function getMissingTemplateTokens(text: string, values: Record<string, string>): string[] {
  const tokens = new Set<string>()
  for (const match of text.matchAll(tokenPattern)) {
    if (!values[match[1]]?.trim()) tokens.add(match[1])
  }
  return [...tokens]
}
