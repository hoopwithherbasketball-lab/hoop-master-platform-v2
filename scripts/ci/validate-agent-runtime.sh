#!/usr/bin/env bash
set -e

echo "Validating agent-runtime.json..."
node -e "
try {
  const runtime = JSON.parse(require('fs').readFileSync('config/agent-runtime.json','utf8'));
  console.log('agent-runtime.json is valid JSON.');
  if (runtime.phase !== 6) {
    console.error('Error: phase must be 6 in Phase 6 scaffold.');
    process.exit(1);
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
