/**
 * Automated Application Deadline Engine
 * 
 * Simulated CRON job intended for Supabase Edge Functions or GitHub Actions.
 * Scans active entries in the grant draft registry, calculates completion,
 * and triggers notification/outreach if a deadline is approaching.
 */

interface EssayDraft {
  id: string
  title: string
  opportunityId: string
  body: string
  lastSaved: string
}

interface FundingOpportunity {
  id: string
  deadline: string
  title: string
}

// Mock Database Fetch
const fetchActiveDrafts = async (): Promise<EssayDraft[]> => {
  // In production, this pulls from Supabase `nil_drafts` table.
  // For this local engine script, we mock the local storage state.
  return [
    {
      id: 'draft-201',
      title: 'Incomplete Statement',
      opportunityId: 'opp-1',
      body: 'I am applying for this grant because I need funding for travel.',
      lastSaved: new Date().toISOString()
    },
    {
      id: 'draft-202',
      title: 'Completed Statement',
      opportunityId: 'opp-4',
      body: ' '.repeat(500).replace(/ /g, 'word '), // 500 words mock
      lastSaved: new Date().toISOString()
    }
  ]
}

const fetchOpportunities = async (): Promise<FundingOpportunity[]> => {
  return [
    { id: 'opp-1', deadline: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(), title: 'HoopWithHer Athletic Grant' }, // 48 hours away
    { id: 'opp-4', deadline: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString(), title: 'GBB Development Trust' } // 10 days away
  ]
}

const REQUIRED_WORD_COUNT = 250;

async function runDeadlineEngine() {
  console.log('🕒 Starting Automated Application Deadline Engine...\n')

  const drafts = await fetchActiveDrafts()
  const opps = await fetchOpportunities()

  const oppsMap = new Map(opps.map(o => [o.id, o]))

  let notificationsSent = 0;

  for (const draft of drafts) {
    const opp = oppsMap.get(draft.opportunityId)
    if (!opp) continue;

    // Calculate Completion Percentage
    const wordCount = draft.body.trim().split(/\s+/).filter(Boolean).length
    const completionPercentage = Math.min((wordCount / REQUIRED_WORD_COUNT) * 100, 100)

    // Calculate Time to Deadline
    const deadlineDate = new Date(opp.deadline)
    const hoursRemaining = (deadlineDate.getTime() - Date.now()) / (1000 * 60 * 60)

    console.log(`Analyzing Draft: [${draft.title}]`)
    console.log(` -> Opp: ${opp.title}`)
    console.log(` -> Completion: ${completionPercentage.toFixed(1)}% (${wordCount}/${REQUIRED_WORD_COUNT} words)`)
    console.log(` -> Deadline: ${hoursRemaining.toFixed(1)} hours away`)

    if (hoursRemaining <= 72 && completionPercentage < 100) {
      console.log(` ⚠️ ACTION REQUIRED: Triggering outreach sequence for Draft ${draft.id}`)
      // In production: trigger localized notification or email via Email Composer API
      console.log(`    [Email] To: athlete@hwh.edu | Subject: Don't miss out! Finish your application for ${opp.title}\n`)
      notificationsSent++
    } else {
      console.log(` ✅ Status: OK (No action needed)\n`)
    }
  }

  console.log(`🏁 Engine run complete. Triggered ${notificationsSent} outreach event(s).`)
}

runDeadlineEngine()
