export interface RoadmapSection { id: string; title: string; items: { title: string; text: string }[] }
export const gradePlans = [
  { id: 'foundation', title: '6th–8th grade · Build the foundation', tasks: ['Practice handling, shooting, passing, footwork and finishing.', 'Learn multiple positions, spacing and basketball decisions.', 'Build study habits, sleep and recovery routines.', 'Save full games and seek instruction with healthy competition.', 'Enjoy other sports and interests; avoid rankings, early offers and exposure pressure.'] },
  { id: 'freshman', title: 'Freshman · Organize your information', tasks: ['Complete your player profile, graduation year, measurements and coach contacts.', 'Record clear full games and create a simple player résumé.', 'Track grades and review approved courses with your counselor.', 'Research colleges across divisions, locations and academic interests.', 'Choose instruction and development over promises of exposure.'] },
  { id: 'sophomore', title: 'Sophomore · Become recruitable', tasks: ['Update your profile, GPA, measurements and schedule.', 'Create a focused highlight reel and keep full-game links ready.', 'Build a balanced reach, possible and likely college list.', 'Send a personalized introduction and ask coaches which events they attend.', 'Request honest feedback from trusted coaches and verify current recruiting rules.'] },
  { id: 'junior', title: 'Junior · Create momentum', tasks: ['Respond professionally and share meaningful film, academic and schedule updates.', 'Prepare for permitted official and unofficial visits.', 'Ask about roster needs, development, academics and total cost.', 'Review eligibility-center requirements with your counselor.', 'Narrow your list using demonstrated interest and fit; review your online presence.'] },
  { id: 'senior', title: 'Senior · Finish the process', tasks: ['Complete applications, aid forms and eligibility tasks.', 'Compare written offers, renewal terms and the full cost of attendance.', 'Consider all divisions, junior colleges, walk-on options and college club teams.', 'Understand agreements before signing and notify other coaches after deciding.', 'Keep grades, training and communication consistent through graduation.'] },
]
export const monthlyTasks = ['Refresh profile, measurements and contact information.', 'Add useful film and accurate contextual statistics.', 'Review transcripts and course progress with your counselor.', 'Share a meaningful schedule or academic update when appropriate.', 'Record coach replies and the next action for each college.', 'Revisit school fit, family budget and development priorities.']
export const collegePaths = [
  ['NCAA Division I', 'Highly demanding training, travel and competition.', 'Athletic aid may be available; confirm the school’s current offer and rules.'],
  ['NCAA Division II', 'Competitive basketball alongside academic commitments.', 'Athletic aid may be available, often combined with other eligible aid.'],
  ['NCAA Division III', 'Competitive basketball with an academic emphasis.', 'No athletic scholarships; ask about academic and need-based aid.'],
  ['NAIA', 'Competitive programs with varied campus sizes and missions.', 'Athletic aid may be available; verify eligibility through PlayNAIA.'],
  ['NJCAA / junior college', 'Two-year programs with development and transfer pathways.', 'Aid differs by division and institution; confirm transfer and eligibility plans.'],
  ['College club', 'Student-organized competition alongside campus life.', 'Typically no varsity athletic scholarship; check dues, travel and participation rules.'],
] as const
export const roadmapSections: RoadmapSection[] = [
  { id: 'recruiting-101', title: 'Recruiting 101', items: [
    { title: 'How coaches find players', text: 'Coaches combine live evaluation, full-game film, highlights, academic information, recommendations and roster needs. A recruiting service or profile cannot guarantee an offer.' },
    { title: 'When to begin and who initiates', text: 'Start with development and academics. Athletes can prepare a personal introduction; whether and how a coach can respond depends on the association, division, sport and current calendar. Verify before arranging contact.' },
    { title: 'Not receiving attention yet?', text: 'Expand your geographic and division range. Ask a trusted coach for an honest level assessment, share full games, research graduation-year and position needs, and contact the appropriate recruiting staff. Continue improving instead of measuring progress only by replies.' },
    { title: 'Interest is not an offer', text: 'A questionnaire, generic email, social follow or event invitation is not a confirmed roster place or financial award. Ask what the coach is offering, what remains conditional and when written details will arrive.' },
  ] },
  { id: 'profile', title: 'Build a strong recruiting profile', items: [
    { title: 'Player identity and basketball', text: 'Include your name, graduation year, primary and secondary positions, verified height, school, club, general location, jersey number, schedule, contextual statistics, awards, highlights and full games.' },
    { title: 'Academics and character', text: 'Identify GPA and its scale, academic honors, intended majors and test scores when applicable. Include leadership, community service, other sports and interests. A short personal statement should honestly explain who you are, what you study and how you contribute to a team.' },
    { title: 'Contacts and privacy', text: 'Keep player, guardian, school and club coach contacts accurate in the existing protected account workflow. Share permissioned contact details directly with verified recruiting staff. Never publish guardian phone numbers, private evaluations or transcripts in a public profile.' },
    { title: 'Keep it current', text: 'Update each season and after meaningful changes. Check every video and schedule link, use a clear player photo, verify measurements and avoid inflated statistics or claims.' },
  ] },
  { id: 'film', title: 'The highlight video academy', items: [
    { title: 'Length and first impression', text: 'A focused reel of roughly 3–5 minutes is a useful starting point; strong evidence matters more than length. Lead with your best transferable basketball play, identify yourself before the action and keep a full-game link available.' },
    { title: 'Show the whole player', text: 'Include decisions, passing, defense, help and recovery, rebounding, off-ball movement and transition effort alongside scoring. Use elevated, steady, wide footage that shows the possession and other players.' },
    { title: 'Sequence and presentation', text: 'Open briefly with name, graduation year, height, position and a safe contact/profile link. Follow with strongest clips, skill variety, defense and off-ball actions, then your profile link. Avoid long intros, distracting music, excessive slow motion and persistent markers.' },
    { title: 'Honest evidence', text: 'Never speed up footage, change statistics or include another player’s clips as your own. Check sharing permissions and playback on a phone. Music is unnecessary; clean footage is enough.' },
  ] },
  { id: 'contact', title: 'Contacting college coaches', items: [
    { title: 'A useful introduction', text: 'The athlete should lead. Use graduation year, name, position and height in the subject. Explain a specific academic or basketball fit, link a profile and film, and ask one clear question. Keep messages brief and proofread the coach and college names.' },
    { title: 'Schedule update', text: 'Send the event date, venue, court, time, team, jersey number and schedule link so a coach can find you. Only claim attendance or results you have confirmed.' },
    { title: 'Follow-up and thank-you', text: 'Follow up with meaningful new film, academic progress, a schedule or a specific question. After a visit or call, mention something you learned and confirm the agreed next step. Do not send repeated identical messages or assume no reply means rejection.' },
    { title: 'Communication rhythm', text: 'Use the coach’s instructions and current contact rules. A calendar reminder is a prompt to review relevance, not permission to send an automated message. Log actual replies and stop when a program or athlete declines.' },
  ] },
  { id: 'visits', title: 'The college visit guide', items: [
    { title: 'Basketball questions', text: 'How do you see my role? What are your recruiting needs in my class? How do players develop? What is the practice and travel schedule? How are playing-time decisions explained? What happens if the staff changes?' },
    { title: 'Academic questions', text: 'Is my major available? Can required labs fit around travel? What tutoring and advising exist? What are graduation outcomes and internship opportunities? Who helps if academic and athletic demands conflict?' },
    { title: 'Culture questions', text: 'Why do players stay or transfer? How are disagreements handled? What does a normal week look like? What support exists for wellbeing, injuries, housing and personal safety?' },
    { title: 'Financial questions', text: 'What is the full annual cost after grants and scholarships? What are renewal conditions and uncovered costs? How could injury, a roster change or a coaching change affect the written award? Confirm answers with financial aid and compliance staff.' },
    { title: 'Ask current players', text: 'What surprised you? What support do you actually use? Do you feel comfortable asking for help? What would you want a recruit to know? Seek conversations beyond the formal tour.' },
    { title: 'Observe, then reflect', text: 'Watch interactions between coaches and players, attend a class if possible, and explore campus. Compare what you heard with what you observed. Record questions and follow up after the visit or call.' },
  ] },
  { id: 'aid', title: 'Scholarships, financial aid and real cost', items: [
    { title: 'Full, partial and non-athletic aid', text: 'An athletic award can cover some or more of the school’s defined costs. “Full” is not a substitute for a written itemized offer. NCAA Division III does not award athletic scholarships, but academic and need-based assistance may be available.' },
    { title: 'Compare net price, not headlines', text: 'List tuition, fees, housing, meals, books, transport and personal costs for the same academic year. Subtract confirmed grants and scholarships once. Loans must be repaid; work-study requires earnings and is not an upfront price reduction.' },
    { title: 'Renewal and change', text: 'Ask the financial aid office about duration, renewal, academic requirements, permitted combinations of aid and the effects of changed circumstances. Check FAFSA and school deadlines using official sources. Do not assume every award renews automatically.' },
  ] },
  { id: 'eligibility', title: 'Eligibility and academic preparation', items: [
    { title: 'NCAA', text: 'Review the applicable division’s academic and amateurism requirements through the NCAA Eligibility Center. Work with a counselor on approved core courses, transcripts and graduation. College admission and athletic eligibility are separate decisions.' },
    { title: 'NAIA and NJCAA', text: 'For NAIA schools, review PlayNAIA registration and the applicable eligibility process. For junior colleges, ask the school to explain current NJCAA and institutional requirements, including any transfer plan.' },
    { title: 'International students', text: 'Request guidance on country-specific credentials, translations, graduation evidence and amateurism documentation. Confirm immigration and admission requirements with qualified school staff; do not assume a domestic checklist applies unchanged.' },
    { title: 'Academic checklist', text: 'Meet your counselor, review approved courses each year, keep accurate transcripts and verify requirements before changing schools, repeating a year or choosing online courses. Report academic and participation history honestly.' },
  ] },
  { id: 'myths', title: 'Recruiting myths, explained', items: [
    { title: '“Good enough means coaches will find me.”', text: 'Development matters, but accurate information and thoughtful communication help coaches evaluate fit. No visibility service guarantees recruitment.' },
    { title: '“Only Division I matters.”', text: 'Academic opportunity, growth, affordability and wellbeing matter across divisions, junior colleges and club basketball.' },
    { title: '“A highlight reel or ranking guarantees an offer.”', text: 'Coaches consider full games, decision-making, academics, character and roster needs. Rankings and edited clips are only partial information.' },
    { title: '“A coach’s message is a scholarship.”', text: 'Interest, an event invitation, a roster discussion and a written financial award are different stages. Ask direct questions rather than interpreting signals as promises.' },
    { title: '“Parents should handle every conversation.”', text: 'Parents support planning and safety while athletes practice communicating for themselves. School staff can help clarify formal requirements.' },
    { title: '“A verbal commitment is the same as signing.”', text: 'A verbal commitment and a written agreement are different. Read the applicable current documents and confirm obligations with the school before making decisions.' },
  ] },
  { id: 'evaluation', title: 'How college coaches evaluate players', items: [
    { title: 'Skill and basketball IQ', text: 'Shooting, passing, handling, finishing and defensive technique matter alongside spacing, timing, reads, decisions and understanding of team concepts.' },
    { title: 'Physical tools and competitiveness', text: 'Movement, speed, strength, balance and repeatable effort are evaluated in context. Notice responses to fatigue, mistakes and difficult possessions.' },
    { title: 'Coachability and communication', text: 'Coaches look at responses to instruction, constructive teammate communication, preparation and whether feedback turns into better decisions.' },
    { title: 'Body language, academics and roster fit', text: 'Bench behavior and responses to adversity matter. Academic options, position needs, class year and the program’s system also influence fit. Private evaluation notes remain protected in the existing evaluation tools.' },
  ] },
  { id: 'parents', title: 'The parent recruiting guide', items: [
    { title: 'Helpful support', text: 'Discuss realistic goals, protect time for school and recovery, organize deadlines and a sustainable budget, verify information and let the athlete lead appropriate conversations. Choose healthy development environments.' },
    { title: 'Avoid pressure and public criticism', text: 'Do not argue publicly with coaches or officials, speak for the athlete at every step, treat a scholarship as the measure of success or pressure a choice based only on status.' },
    { title: 'Playing-time conversations', text: 'Help the athlete prepare respectful questions about role, development and what they can improve. Separate feedback from promises of minutes and encourage the athlete to speak with the coach first.' },
    { title: 'Exposure spending', text: 'Ask who will attend, whether the event fits the athlete’s level and goals, and what it costs including travel. Set a family limit; avoid debt driven by recruiting promises. Prioritize useful instruction and academic needs.' },
  ] },
  { id: 'faq', title: 'Frequently asked recruiting questions', items: [
    { title: 'Do recruiting services matter?', text: 'A service can help organization or film, but it cannot guarantee admission, coach interest, eligibility or scholarships. Ask for specific deliverables and keep ownership of your information.' },
    { title: 'Should a player play multiple sports?', text: 'Other sports can support enjoyment and general athletic development. Discuss schedule, recovery and goals with trusted coaches rather than assuming early specialization is required.' },
    { title: 'Should I transfer schools or reclassify?', text: 'Consider academics, graduation, wellbeing and the applicable participation and eligibility rules with your counselor and school staff first. A move or repeated year is not a guaranteed recruiting advantage.' },
    { title: 'Is travel basketball or a shoe circuit required?', text: 'Programs recruit through different channels. Evaluate competition quality, development, coach access, team environment and total cost. A circuit label is not an offer.' },
    { title: 'What GPA is needed?', text: 'Requirements vary by association, division, school, coursework and applicant. Verify your course record with a counselor and the official eligibility body; no single GPA guarantees admission or eligibility.' },
    { title: 'Can coaches direct-message players?', text: 'Communication rules depend on the association, division, sport and calendar. Verify the sender’s identity and current rules; use trusted, appropriate channels and include guardian support where needed.' },
    { title: 'Should I use social media?', text: 'Keep a professional profile and useful film links, protect private information and verify staff identities. A follow, like or direct message should not be treated as a confirmed offer.' },
    { title: 'What if I am injured?', text: 'Share only information you choose to disclose, use accurate updates and follow qualified medical guidance. Do not promise a return date or present old film as current performance.' },
    { title: 'What if the head coach changes?', text: 'Contact the school to reconfirm roster plans, relationships and written financial arrangements. Reassess academic, personal and financial fit rather than assuming verbal plans remain unchanged.' },
    { title: 'How do I decline a program?', text: 'Thank the coach personally, communicate your decision clearly and close the loop promptly. You do not need to criticize another school or disclose private financial details.' },
    { title: 'What is the biggest recruiting mistake?', text: 'Choosing status over fit, neglecting academics or treating interest as a promise can all limit options. Keep a balanced college list, honest evidence and a clear record of next steps.' },
  ] },
]
export const recruitingGlossary = [
  ['Prospective student-athlete', 'A student who may participate in college athletics; formal definitions depend on the governing rules.'],
  ['Verbal commitment', 'An expressed intention to attend a school, distinct from a signed agreement.'],
  ['Official visit', 'A visit for which a college pays permitted expenses under the applicable rules.'],
  ['Unofficial visit', 'A visit generally funded by the prospect or family, subject to applicable rules.'],
  ['Contact', 'Recruiting communication or interaction defined by the governing association.'],
  ['Evaluation', 'A coach’s assessment of athletic or academic qualifications.'],
  ['Dead period', 'A restricted recruiting period; verify which in-person activities are prohibited and which communications remain permitted.'],
  ['Quiet period', 'A period restricting certain off-campus recruiting activities; consult the sport-specific calendar.'],
  ['Preferred walk-on', 'A discussed roster opportunity without an athletic scholarship; confirm the actual conditions in writing.'],
  ['Redshirt', 'A term commonly used for a season without competition; participation exceptions and remaining eligibility require school review.'],
  ['Transfer portal', 'An NCAA system for transfer notification; entry does not guarantee admission, aid or a roster place.'],
  ['Core courses', 'Academic courses that count toward the applicable eligibility requirements, subject to approval.'],
  ['Amateurism certification', 'Review of athletic participation and related history under the governing rules.'],
  ['Financial aid agreement', 'Written terms describing aid and its conditions; read the actual agreement before signing.'],
] as const
export const decisionCriteria = [
  { id: 'academics', label: 'Academic program', weight: 20 },
  { id: 'coaching', label: 'Coaching relationships', weight: 15 },
  { id: 'development', label: 'Player development', weight: 15 },
  { id: 'culture', label: 'Team culture', weight: 15 },
  { id: 'cost', label: 'Total family cost', weight: 15 },
  { id: 'campus', label: 'Campus and personal fit', weight: 10 },
  { id: 'role', label: 'Projected basketball role', weight: 10 },
] as const
export const costFields = [
  { id: 'tuition', label: 'Tuition and required fees', aid: false },
  { id: 'housing', label: 'Housing and meals', aid: false },
  { id: 'other', label: 'Books, travel and other costs', aid: false },
  { id: 'athletic', label: 'Confirmed athletic aid', aid: true },
  { id: 'otherAid', label: 'Confirmed academic / need-based grants', aid: true },
] as const
function nonnegative(value: string | undefined): number | null {
  if (!value?.trim()) return null
  const number = Number(value)
  return Number.isFinite(number) && number >= 0 ? number : null
}
export function calculateNetCost(values: Record<string, string>): number | null {
  const amounts = costFields.map(field => nonnegative(values[field.id]))
  if (amounts.some(value => value === null)) return null
  return Math.max(0, amounts.reduce<number>((total, value, i) => total + (costFields[i].aid ? -1 : 1) * (value ?? 0), 0))
}
export function calculateDecisionScore(values: Record<string, string>): number | null {
  const scores = decisionCriteria.map(criterion => nonnegative(values[criterion.id]))
  if (scores.some(score => score === null || score < 1 || score > 10)) return null
  return scores.reduce<number>((total, score, i) => total + (score ?? 0) * decisionCriteria[i].weight / 100, 0)
}
