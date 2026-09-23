import assert from 'node:assert/strict'
import test from 'node:test'
import {
  getMissingTemplateTokens,
  getTemplateTokens,
  recruitingEmailTemplates,
  recruitingPersonalizationFields,
  recruitingStages,
  renderRecruitingTemplate,
} from '../../packages/features/dist/features/src/recruiting/emailSequences.js'

test('every recruiting workflow stage has at least one template', () => {
  for (const stage of recruitingStages) {
    assert.ok(
      recruitingEmailTemplates.some(template => template.stage === stage.id),
      `Expected at least one template for ${stage.id}`,
    )
  }
})

test('template and variation identifiers are unique', () => {
  const templateIds = recruitingEmailTemplates.map(template => template.id)
  const variantIds = recruitingEmailTemplates.flatMap(template => template.variants.map(variant => variant.id))
  assert.equal(new Set(templateIds).size, templateIds.length)
  assert.equal(new Set(variantIds).size, variantIds.length)
})

test('every template token has a registered personalization field', () => {
  const registeredTokens = new Set(recruitingPersonalizationFields.map(field => field.token))
  for (const template of recruitingEmailTemplates) {
    for (const token of getTemplateTokens(template)) {
      assert.ok(registeredTokens.has(token), `Missing field metadata for {{${token}}}`)
    }
  }
})

test('template rendering replaces values and exposes incomplete fields', () => {
  const text = 'Hi {{athlete_first_name}}, contact {{coach_name}}.'
  const values = { athlete_first_name: 'Maya' }
  assert.equal(renderRecruitingTemplate(text, values), 'Hi Maya, contact [Coach name].')
  assert.deepEqual(getMissingTemplateTokens(text, values), ['coach_name'])
})

test('recruiting copy honors locked terminology and brand casing', () => {
  const content = JSON.stringify(recruitingEmailTemplates)
  assert.doesNotMatch(content, /tryout|interest meeting/i)
  assert.doesNotMatch(content, /Hoop With Her/)
})
