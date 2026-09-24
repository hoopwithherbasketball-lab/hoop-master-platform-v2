import assert from 'node:assert/strict'
import test from 'node:test'
import { calculateDecisionScore, calculateNetCost, decisionCriteria, gradePlans, roadmapSections } from '../../packages/features/dist/features/src/recruiting/roadmap.js'
import { getMissingTemplateTokens, recruitingEmailTemplates } from '../../packages/features/dist/features/src/recruiting/emailSequences.js'

test('net cost subtracts confirmed gift aid, never loans, and never assumes missing costs are zero', () => {
  const costs = { tuition: '20000', housing: '10000', other: '2500', athletic: '8000', otherAid: '4000', loans: '9000' }
  assert.equal(calculateNetCost(costs), 20500)
  assert.equal(calculateNetCost({ ...costs, housing: '' }), null)
  assert.equal(calculateNetCost({ ...costs, housing: '-1' }), null)
  assert.equal(calculateNetCost({ ...costs, housing: 'Infinity' }), null)
  assert.equal(calculateNetCost({ ...costs, athletic: '99999' }), 0)
  assert.equal(calculateNetCost(Object.fromEntries(Object.keys(costs).map(key => [key, '0']))), 0)
})

test('decision score uses complete 1–10 responses and weights totaling 100%', () => {
  assert.equal(decisionCriteria.reduce((sum, criterion) => sum + criterion.weight, 0), 100)
  const scores = Object.fromEntries(decisionCriteria.map(criterion => [criterion.id, '10']))
  assert.equal(calculateDecisionScore(scores), 10)
  assert.equal(calculateDecisionScore({ ...scores, academics: '5' }), 9)
  for (const invalid of ['', '0', '11', 'bad']) assert.equal(calculateDecisionScore({ ...scores, academics: invalid }), null)
})

test('roadmap covers all grades and educational domains with distinct anchors', () => {
  assert.deepEqual(gradePlans.map(plan => plan.id), ['foundation', 'freshman', 'sophomore', 'junior', 'senior'])
  const ids = roadmapSections.map(section => section.id)
  assert.equal(ids.length, new Set(ids).size)
  for (const id of ['recruiting-101', 'profile', 'film', 'contact', 'visits', 'aid', 'eligibility', 'myths', 'evaluation', 'parents', 'faq']) assert.ok(ids.includes(id))
})

test('family progress requires actual status and does not assert work has happened', () => {
  const family = recruitingEmailTemplates.find(template => template.stage === 'family_update')
  const text = family.variants[0].body
  for (const token of ['profile_status', 'outreach_status', 'coach_response_summary']) assert.ok(getMissingTemplateTokens(text, {}).includes(token))
})

test('coach communication includes thank-you scenarios and useful event identification', () => {
  const variants = recruitingEmailTemplates.flatMap(template => template.variants)
  for (const id of ['engagement-visit-thank-you', 'engagement-call-thank-you']) assert.ok(variants.some(variant => variant.id === id))
  const event = recruitingEmailTemplates.find(template => template.stage === 'event_outreach').variants[0]
  for (const token of ['jersey_number', 'event_time', 'court_number']) assert.ok(getMissingTemplateTokens(event.body, {}).includes(token))
})
