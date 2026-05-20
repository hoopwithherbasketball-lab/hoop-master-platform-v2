#!/usr/bin/env bash
set -e

# Ensure the script runs from the repository root
cd "$(dirname "$0")/../.."

echo "Validating artifact presence..."
for doc in "docs/phases/phase-6-mcp-agent-command-center-runtime.md" "docs/mcp-runtime-boundaries.md" "docs/agent-command-center.md"; do
  if [ ! -f "$doc" ]; then
    echo "Error: Required artifact $doc is missing."
    exit 1
  fi
done

echo "Validating agent-runtime.json..."
node -e "
try {
  const runtime = JSON.parse(require('fs').readFileSync('config/agent-runtime.json','utf8'));
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
  if (runtime.artifactCommitted !== true) {
    console.error('Error: artifactCommitted must be true in agent-runtime.json');
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
  const guardrails = JSON.parse(require('fs').readFileSync('config/agent-guardrails.json','utf8'));
  console.log('agent-guardrails.json is valid JSON.');
  if (guardrails.phase !== 5) {
    console.error('Error: phase must be 5 in agent-guardrails.json');
    process.exit(1);
  }
  if (guardrails.artifactCommitted !== true) {
    console.error('Error: artifactCommitted must be true in agent-guardrails.json');
    process.exit(1);
  }
} catch (e) {
  console.error('Failed to parse agent-guardrails.json:', e.message);
  process.exit(1);
}
"

echo "Validation complete."
