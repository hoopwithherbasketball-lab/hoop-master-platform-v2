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
node -e "
const fs = require('fs');
const path = require('path');

const validateJson = (file, validationFn) => {
  let data;
  try {
    data = JSON.parse(fs.readFileSync(file, 'utf8'));
  } catch (error) {
    throw new Error('Failed to parse ' + file + ': ' + error.message);
  }

  try {
    validationFn(data);
  } catch (error) {
    throw new Error('Validation failed for ' + file + ': ' + error.message);
  }

  return data;
};

const validatePhase = (data, file, expectedPhase) => {
  if (data.phase !== expectedPhase) {
    throw new Error(file + ' phase mismatch: expected ' + expectedPhase + ', got ' + data.phase);
  }
};

try {
  console.log('Validating agent-runtime.json...');
  const runtimePath = 'config/agent-runtime.json';
  const runtime = validateJson(runtimePath, (data) => {
    if (![6, 7].includes(data.phase)) throw new Error('phase must be 6 or 7 in runtime scaffold/implementation transition.');
    if (data.phase === 6) {
      if (data.mcpRuntimeMode !== 'disabled') throw new Error('mcpRuntimeMode must be \"disabled\" in Phase 6.');
      if (!Array.isArray(data.enabledAgents) || data.enabledAgents.length > 0) throw new Error('enabledAgents must be an empty array in Phase 6.');
    }
    if (data.phase === 7) {
      if (data.mcpRuntimeMode !== 'restricted_enabled') throw new Error('mcpRuntimeMode must be \"restricted_enabled\" in Phase 7.');
      if (!data.phaseTransition) throw new Error('phaseTransition block is required in agent-runtime.json for Phase 7.');
      if (data.phaseTransition.transitionStatus !== 'overseer_approved_ready_for_phase_7') throw new Error('phaseTransition.transitionStatus must be \"overseer_approved_ready_for_phase_7\" in Phase 7.');
      if (data.phaseTransition.overseerApprovalRequired !== true) throw new Error('phaseTransition.overseerApprovalRequired must be true in Phase 7.');
      if (data.phaseTransition.overseerApprovalRecorded !== true) throw new Error('phaseTransition.overseerApprovalRecorded must be true — Overseer approval is required to unlock Phase 7.');
    }

    // Safety-critical blocked actions enforced regardless of phase
    const requiredBlockedActions = [
      'production_deployments',
      'secret_access',
      'destructive_file_operations',
      'modify_auth_or_rbac',
      'modify_billing_or_stripe',
      'modify_deployment_config'
    ];
    if (!Array.isArray(data.disabledActions)) throw new Error('disabledActions must be an array in agent-runtime.json');
    for (const action of requiredBlockedActions) {
      if (!data.disabledActions.includes(action)) throw new Error('Required blocked action missing from disabledActions: ' + action);
    }

    if (!data.guardrailConfigReference) throw new Error('guardrailConfigReference is required in agent-runtime.json');
    if (!fs.existsSync(data.guardrailConfigReference)) throw new Error('guardrailConfigReference file missing: ' + data.guardrailConfigReference);
    if (path.normalize(data.guardrailConfigReference) !== path.normalize('config/agent-guardrails.json')) throw new Error('guardrailConfigReference must point to config/agent-guardrails.json');
    if (!data.phaseGateReference) throw new Error('phaseGateReference is required in agent-runtime.json');
    if (!fs.existsSync(data.phaseGateReference)) throw new Error('phaseGateReference file missing: ' + data.phaseGateReference);
    if (path.normalize(data.phaseGateReference) !== path.normalize('AGENT_PHASE_GATES.md')) throw new Error('phaseGateReference must point to AGENT_PHASE_GATES.md');
  });

  console.log('agent-runtime.json is valid.');

  console.log('Validating agent-guardrails.json...');
  const guardrailsPath = runtime.guardrailConfigReference;
  const guardrails = validateJson(guardrailsPath, (data) => {
    validatePhase(data, guardrailsPath, 5);
    if (data.artifactCommitted !== true) throw new Error('artifactCommitted must be true in agent-guardrails.json');
  });
  console.log('agent-guardrails.json is valid.');

  console.log('Validating migration rollback enforcement rules...');
  const boundariesPath = 'docs/mcp-runtime-boundaries.md';
  const boundariesText = fs.readFileSync(boundariesPath, 'utf8');
  for (const token of ['Rollback Definition', 'forward-only', '.down.sql']) {
    if (!boundariesText.includes(token)) {
      throw new Error('docs/mcp-runtime-boundaries.md is missing required rollback rule text: ' + token);
    }
  }

  const migrationDirs = ['packages/supabase/migrations'];
  for (const migrationsDir of migrationDirs) {
    if (!fs.existsSync(migrationsDir)) continue;
    const collectFiles = (dir) => {
      const entries = fs.readdirSync(dir, { withFileTypes: true });
      const files = [];
      for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);
        if (entry.isDirectory()) files.push(...collectFiles(fullPath));
        else if (entry.isFile()) files.push(fullPath);
      }
      return files;
    };
    const files = collectFiles(migrationsDir);
    const relFiles = files.map((f) => path.relative(migrationsDir, f));

    const downSqlFiles = relFiles.filter((name) => name.endsWith('.down.sql'));
    if (downSqlFiles.length > 0) throw new Error('Found forbidden .down.sql migration files in ' + migrationsDir + ': ' + downSqlFiles.join(', '));

    const sqlFiles = relFiles.filter((name) => name.endsWith('.sql'));
    const invalidNames = sqlFiles.filter((name) => !/^\\d{14}_[a-z0-9_]+\\.sql$/.test(name));
    if (invalidNames.length > 0) throw new Error('Invalid migration filename(s) in ' + migrationsDir + '. Expected YYYYMMDDHHMMSS_snake_case.sql: ' + invalidNames.join(', '));
  }
} catch (error) {
  console.error('Validation failed:', error.message);
  process.exit(1);
}
"

echo "Validation complete."
