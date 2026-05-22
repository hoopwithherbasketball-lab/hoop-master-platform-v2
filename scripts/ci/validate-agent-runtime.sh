#!/usr/bin/env bash
set -e

# Ensure the script runs from the repository root
cd "$(dirname "$0")/../.."

echo "Verifying required Phase 6 artifacts..."
REQUIRED_FILES=(
  "config/agent-runtime.json"
  "config/agent-guardrails.json"
  "docs/phases/phase-6-mcp-agent-command-center-runtime.md"
  "docs/mcp-runtime-boundaries.md"
  "docs/agent-command-center.md"
  "AGENT_PHASE_GATES.md"
)

for file in "${REQUIRED_FILES[@]}"; do
  if [ ! -f "$file" ]; then
    echo "Validation failed: required artifact missing: $file"
    exit 1
  fi
done

echo "Validating agent configurations and enforcement rules..."
node scripts/ci/validate-agent-runtime.js

echo "Validation complete."
