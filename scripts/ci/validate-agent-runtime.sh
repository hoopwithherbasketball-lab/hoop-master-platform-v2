#!/usr/bin/env bash
set -e

echo "Validating agent-runtime.json..."
node -e "
const fs = require('fs');
const path = require('path');
try {
  const runtime = JSON.parse(fs.readFileSync('config/agent-runtime.json','utf8'));
  console.log('agent-runtime.json is valid JSON.');
  if (runtime.phase !== 6) {
    console.error('Error: phase must be 6 in Phase 6 scaffold.');
    process.exit(1);
  }
  if (runtime.mcpRuntimeMode !== 'disabled') {
    console.error('Error: mcpRuntimeMode must be \"disabled\" in Phase 6.');
    process.exit(1);
  }
  if (!Array.isArray(runtime.enabledAgents) || runtime.enabledAgents.length > 0) {
    console.error('Error: enabledAgents must be an empty array in Phase 6.');
    process.exit(1);
  }
  if (runtime.phaseGateReference) {
    if (!fs.existsSync(path.resolve(runtime.phaseGateReference))) {
      console.error('Error: phaseGateReference file does not exist: ' + runtime.phaseGateReference);
      process.exit(1);
    }
    console.log('phaseGateReference file exists: ' + runtime.phaseGateReference);
  }
  if (runtime.guardrailConfigReference) {
    if (!fs.existsSync(path.resolve(runtime.guardrailConfigReference))) {
      console.error('Error: guardrailConfigReference file does not exist: ' + runtime.guardrailConfigReference);
      process.exit(1);
    }
    console.log('guardrailConfigReference file exists: ' + runtime.guardrailConfigReference);
  }
} catch (e) {
  console.error('Failed to parse agent-runtime.json:', e.message);
  process.exit(1);
}
"

echo "Validating agent-guardrails.json..."
node -e "
try {
  JSON.parse(require('fs').readFileSync('config/agent-guardrails.json','utf8'));
  console.log('agent-guardrails.json is valid JSON.');
} catch (e) {
  console.error('Failed to parse agent-guardrails.json:', e.message);
  process.exit(1);
}
"

echo "Validation complete."
