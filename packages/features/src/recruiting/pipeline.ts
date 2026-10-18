
/** A family-owned, evidence-based recruiting relationship tracker.
 * Status is user-reported. No score represents scholarship probability.
 */
export const recruitingPipelineStages = [
  { id: 'researching', label: 'Researching', guidance: 'Confirm school, academics, roster fit and recruiting rules.' },
  { id: 'ready', label: 'Ready to contact', guidance: 'Verify profile, film, coach identity and guardian review before contacting.' },
  { id: 'contacted', label: 'Contact logged', guidance: 'Record only outreach that actually occurred. Review before any follow-up.' },
  { id: 'responded', label: 'Response logged', guidance: 'Save an accurate summary and any requested materials.' },
  { id: 'evaluating', label: 'Ongoing evaluation', guidance: 'Share meaningful updates and record the next agreed step.' },
  { id: 'visit', label: 'Visit or conversation', guidance: 'Confirm visit rules and document questions, fit and next steps.' },
  { id: 'offer_reported', label: 'Offer reported', guidance: 'Verify the written terms with the college and financial-aid office.' },
  { id: 'committed', label: 'Decision recorded', guidance: 'Complete eligibility, admission and financial-aid requirements.' },
  { id: 'closed', label: 'Closed or opted out', guidance: 'Respect the stop request; do not continue outreach.' },
] as const;

export type RecruitingPipelineStage = typeof recruitingPipelineStages[number]['id'];
export type RecruitingActivityDirection = 'outbound' | 'inbound' | 'in_person';
export type RecruitingChannel = 'email' | 'x' | 'text' | 'phone' | 'event' | 'referral' | 'other';

export interface RecruitingTargetSummary {
  id: string;
  stage: RecruitingPipelineStage;
  next_action_date: string | null;
}
export interface RecruitingActivitySummary {
  target_id: string;
  direction: RecruitingActivityDirection;
}
export function summarizeRecruitingPipeline(
  targets: ReadonlyArray<RecruitingTargetSummary>,
  activities: ReadonlyArray<RecruitingActivitySummary>,
  today: string,
) {
  const repliedTo = new Set(activities.filter(a => a.direction === 'inbound').map(a => a.target_id));
  return {
    programs: targets.length,
    programsWithLoggedReplies: targets.filter(t => repliedTo.has(t.id)).length,
    followUpsDue: targets.filter(t => t.stage !== 'closed' && t.stage !== 'committed' && !!t.next_action_date && t.next_action_date <= today).length,
    offersReported: targets.filter(t => t.stage === 'offer_reported').length,
  };
}
