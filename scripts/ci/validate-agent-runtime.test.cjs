const test = require('node:test')
const assert = require('node:assert/strict')
const runtime = require('../../config/agent-runtime.json')
const { validateRuntime } = require('./validate-agent-runtime')

test('documented Phase 8 config validates with its existing approval record', () => {
  assert.equal(runtime.phase, 8)
  assert.doesNotThrow(() => validateRuntime(runtime))
})
test('Phase 8 cannot omit approval, widen runtime mode or remove protected actions', () => {
  assert.throws(() => validateRuntime({ ...runtime, phaseTransition: { ...runtime.phaseTransition, overseerApprovalRecorded: false } }))
  assert.throws(() => validateRuntime({ ...runtime, phaseTransition: { ...runtime.phaseTransition, overseerApprovalRequired: false } }))
  assert.throws(() => validateRuntime({ ...runtime, phaseTransition: { ...runtime.phaseTransition, fromPhase: 6 } }))
  assert.throws(() => validateRuntime({ ...runtime, mcpRuntimeMode: 'enabled' }))
  assert.throws(() => validateRuntime({ ...runtime, disabledActions: [] }))
  assert.throws(() => validateRuntime({ ...runtime, phase: 9 }))
})
