# Recruiting workspace coverage

## Purpose and source boundary

The supplied 19-page September 16, 2026 screenshot PDF is a competitor’s landing page and lead magnet. It is a topic-coverage benchmark, not a specification to copy. Pages 10–18 repeat most of pages 1–9. HOOP WITH HER uses original guidance and its own existing product design. Competitor branding, artwork, screenshots, marketing claims and mailing list are not imported.

The implementation extends the React / Vite monorepo. It preserves Supabase authentication and permissions, player profiles, film, evaluation, funding, NIL, events, community and existing outreach tools. No Next.js or Prisma migration is introduced.

## Coverage map

All anchors below are on `/recruiting-roadmap`.

| Benchmark topic | Product coverage | Existing system connection |
| --- | --- | --- |
| Grade-by-grade roadmap: middle school through senior year | `#checklists`: five selectable plans with separate completion state | Existing `/dashboard/readiness` remains available |
| No recruiting attention | `#recruiting-101`: feedback, broader college list, full games, roster research | Profiles, film library and coach discovery retained |
| Recruiting basics and interest versus offers | `#recruiting-101`; contact/evaluation/quiet/dead-period definitions in `#glossary` | Rules verified with official sources, no eligibility verdict |
| NCAA DI/DII/DIII, NAIA, NJCAA, college club | `#college-levels`: experience and aid comparison | Existing college-fit outreach stage |
| Profile identity, academics, basketball, contacts, character and updates | `#profile`: requirements and privacy guidance | `/dashboard/profile`, `/dashboard/onepager`; guardian contacts stay private |
| Personal statement | `#profile`: concise, honest identity, interests and contribution guidance | Existing profile editing |
| Highlight length, opening clip, defense, music, camera and sequencing | `#film`: preparation and honest editing guidance | `/dashboard/film-index` and existing full-game links |
| Initial coach email, schedule, follow-up and post-visit/call thanks | `#contact` + `#outreach-drafts`: athlete-facing composer using the shared template catalog | Existing `/admin/recruiting/outreach`; added visit/call thank-you variants and jersey/time fields |
| Contact frequency and meaningful updates | `#contact`: relevance, coach instructions and actual response tracking | Existing follow-up, monthly, injury, academic and close-loop variants retained |
| Visit basketball, academic, culture, financial and player questions | `#visits`: six question groups | Three college worksheets include visit notes and unanswered questions |
| Scholarships, partial/full aid, DIII and renewal | `#aid`: itemized award and renewal questions | Existing funding area retained |
| Three-school net-price comparison | `#comparison`: tuition/fees, housing/meals, other costs, athletic and other gift aid | Loans/work-study excluded; missing inputs stay unknown; no award assumptions |
| NCAA, NAIA, NJCAA, international eligibility and academics | `#eligibility`: counselor, course, transcript, credential and amateurism guidance | Official-source links; no schema or eligibility-policy changes |
| Recruiting myths | `#myths`: discovery, division prestige, film/rankings, interest, parents and verbal commitments | No recruiting guarantees or automated claims |
| Coach evaluation: skill, IQ, physical tools, competitiveness, coachability, communication, body language, academics and roster fit | `#evaluation`: all nine dimensions | Existing protected evaluation and readiness workflows |
| Parent support, harmful behavior, playing time and spending | `#parents` | Parent dashboard and protected family workflows retained |
| Freshman, sophomore, junior, senior and monthly checklists | `#checklists`: stage tasks and shared monthly actions | User-reported completion, not a readiness or eligibility score |
| Recruiting glossary | `#glossary`: 14 terms | Links to official verification sources |
| FAQs: services, multiple sports, transfer, reclassification, club/circuit, GPA, DMs/social, injury, coach change, declining and common mistakes | `#faq` | Existing outreach injury and closure scenarios |
| Academic, basketball, financial and personal fit | `#comparison`: three-school weighted 1–10 scorecards and notes | Complements existing target-list workflow |
| Official resources | `#official-resources`: NCAA, Eligibility Center, PlayNAIA, NJCAA, Federal Student Aid | Current requirements are confirmed externally; no hardcoded contact dates |
| Registration, login and footer lead capture | Existing signup/login and contact entry points | The competitor’s newsletter widget is replaced by existing account/contact flows; no false subscription or unconsented mailing list |

## Operational limits

- Checklist, comparison and athlete draft inputs are page-session state. They are explicitly labeled as unsaved; print/save PDF or copy the completed draft before navigating away. They do not silently store youth information in browser storage or claim cloud persistence.
- Email templates produce drafts only. No emails, automated sequences, CRM delivery records or subscriptions are sent/created by this workspace.
- The public composer exposes only coach-facing athlete templates. Staff/family operational drafts remain in the existing admin route.
- Editable notes and cost estimates are planning tools; the school and applicable governing body determine admission, eligibility and actual awards.
- The PDF’s collapsed FAQ bodies were not visible. Coverage addresses the visible questions with original, cautious guidance rather than claiming to reproduce hidden answers.
- Rule-dependent content intentionally avoids dated contact windows, scholarship limits and universal GPA thresholds. Official organizations and school compliance staff remain authoritative.

## Verification

Run `npm run test:recruiting` for catalog, financial calculation, scorecard and component regressions; `npm run test:nil` for NIL independence and guard behavior; `npm run typecheck`, `npm run lint` and `npm run build` for repository validation. GitHub checks must pass on the published head before merge.
