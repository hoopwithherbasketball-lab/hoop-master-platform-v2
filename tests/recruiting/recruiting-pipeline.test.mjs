
import assert from 'node:assert/strict'
import test from 'node:test'
import { recruitingPipelineStages, summarizeRecruitingPipeline } from '../../packages/features/dist/features/src/recruiting/pipeline.js'

test('pipeline stages distinguish outreach from an offer or decision', () => {
  const ids = recruitingPipelineStages.map(stage => stage.id)
  assert.equal(new Set(ids).size, ids.length)
  for (const stage of ['researching', 'contacted', 'responded', 'offer_reported', 'closed']) {
    assert.ok(ids.includes(stage))
  }
})
test('inbound activity is evidence of a response; social impressions alone are not', () => {
  const rows = [
    { id: 'a', stage: 'contacted', next_action_date: '2026-10-17' },
    { id: 'b', stage: 'offer_reported', next_action_date: '2026-11-01' },
    { id: 'c', stage: 'closed', next_action_date: '2026-01-01' },
    { id: 'd', stage: 'committed', next_action_date: '2026-01-01' },
  ]
  const activity = [{ target_id: 'a', direction: 'outbound' }, { target_id: 'b', direction: 'inbound' }]
  assert.deepEqual(summarizeRecruitingPipeline(rows, activity, '2026-10-18'), {
    programs: 4, programsWithLoggedReplies: 1, followUpsDue: 1, offersReported: 1,
  })
})
