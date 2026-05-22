const fs = require('fs');
const path = require('path');

class ValidationError extends Error {
  constructor(message) {
    super(message);
    this.name = 'ValidationError';
  }
}

function validateJson(file, validationFn) {
  let data;
  try {
    data = JSON.parse(fs.readFileSync(file, 'utf8'));
  } catch (error) {
    throw new ValidationError('Failed to parse ' + file + ': ' + error.message);
  }

  try {
    validationFn(data);
  } catch (error) {
    throw new ValidationError('Validation failed for ' + file + ': ' + error.message);
  }

  return data;
}

function validatePhase(data, file, expectedPhase) {
  if (data.phase !== expectedPhase) {
    throw new ValidationError(file + ' phase mismatch: expected ' + expectedPhase + ', got ' + data.phase);
  }
}

function validateRuntime(runtime) {
  if (![6, 7].includes(runtime.phase)) throw new ValidationError('phase must be 6 or 7 in runtime scaffold/implementation transition.');

  if (runtime.phase === 6) {
    if (runtime.mcpRuntimeMode !== 'disabled') throw new ValidationError('mcpRuntimeMode must be "disabled" in Phase 6.');
    if (!Array.isArray(runtime.enabledAgents) || runtime.enabledAgents.length > 0) throw new ValidationError('enabledAgents must be an empty array in Phase 6.');
  }

  if (runtime.phase === 7) {
    if (runtime.mcpRuntimeMode !== 'restricted_enabled') throw new ValidationError('mcpRuntimeMode must be "restricted_enabled" in Phase 7.');
    if (!runtime.phaseTransition) throw new ValidationError('phaseTransition block is required in agent-runtime.json for Phase 7.');
    if (runtime.phaseTransition.transitionStatus !== 'overseer_approved_ready_for_phase_7') throw new ValidationError('phaseTransition.transitionStatus must be "overseer_approved_ready_for_phase_7" in Phase 7.');
    if (runtime.phaseTransition.overseerApprovalRequired !== true) throw new ValidationError('phaseTransition.overseerApprovalRequired must be true in Phase 7.');
    if (runtime.phaseTransition.overseerApprovalRecorded !== true) throw new ValidationError('phaseTransition.overseerApprovalRecorded must be true — Overseer approval is required to unlock Phase 7.');
  }

  const requiredBlockedActions = [
    'production_deployments',
    'secret_access',
    'destructive_file_operations',
    'modify_auth_or_rbac',
    'modify_billing_or_stripe',
    'modify_deployment_config'
  ];
  if (!Array.isArray(runtime.disabledActions)) throw new ValidationError('disabledActions must be an array in agent-runtime.json');
  for (const action of requiredBlockedActions) {
    if (!runtime.disabledActions.includes(action)) throw new ValidationError('Required blocked action missing from disabledActions: ' + action);
  }

  if (!runtime.guardrailConfigReference) throw new ValidationError('guardrailConfigReference is required in agent-runtime.json');
  if (!fs.existsSync(runtime.guardrailConfigReference)) throw new ValidationError('guardrailConfigReference file missing: ' + runtime.guardrailConfigReference);
  if (path.normalize(runtime.guardrailConfigReference) !== path.normalize('config/agent-guardrails.json')) throw new ValidationError('guardrailConfigReference must point to config/agent-guardrails.json');

  if (!runtime.phaseGateReference) throw new ValidationError('phaseGateReference is required in agent-runtime.json');
  if (!fs.existsSync(runtime.phaseGateReference)) throw new ValidationError('phaseGateReference file missing: ' + runtime.phaseGateReference);
  if (path.normalize(runtime.phaseGateReference) !== path.normalize('AGENT_PHASE_GATES.md')) throw new ValidationError('phaseGateReference must point to AGENT_PHASE_GATES.md');
}

function validateGuardrails(guardrails) {
  validatePhase(guardrails, 'agent-guardrails.json', 5);
  if (guardrails.artifactCommitted !== true) throw new ValidationError('artifactCommitted must be true in agent-guardrails.json');
}

function validateBoundariesDoc() {
  const boundariesPath = 'docs/mcp-runtime-boundaries.md';
  const boundariesText = fs.readFileSync(boundariesPath, 'utf8');
  for (const token of ['Rollback Definition', 'forward-only', '.down.sql']) {
    if (!boundariesText.includes(token)) {
      throw new ValidationError('docs/mcp-runtime-boundaries.md is missing required rollback rule text: ' + token);
    }
  }
}

function collectFiles(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) files.push(...collectFiles(fullPath));
    else if (entry.isFile()) files.push(fullPath);
  }
  return files;
}

function validateMigrations() {
  const migrationDirs = ['packages/supabase/migrations'];
  for (const migrationsDir of migrationDirs) {
    if (!fs.existsSync(migrationsDir)) continue;

    const files = collectFiles(migrationsDir);
    const relFiles = files.map((f) => path.relative(migrationsDir, f));

    const downSqlFiles = relFiles.filter((name) => name.endsWith('.down.sql'));
    if (downSqlFiles.length > 0) throw new ValidationError('Found forbidden .down.sql migration files in ' + migrationsDir + ': ' + downSqlFiles.join(', '));

    const sqlFiles = relFiles.filter((name) => name.endsWith('.sql'));
    const invalidNames = sqlFiles.filter((name) => !/^\d{14}_[a-z0-9_]+\.sql$/.test(path.basename(name)));
    if (invalidNames.length > 0) throw new ValidationError('Invalid migration filename(s) in ' + migrationsDir + '. Expected YYYYMMDDHHMMSS_snake_case.sql: ' + invalidNames.join(', '));
  }
}

function run() {
  try {
    console.log('Validating agent-runtime.json...');
    const runtime = validateJson('config/agent-runtime.json', validateRuntime);
    console.log('agent-runtime.json is valid.');

    console.log('Validating agent-guardrails.json...');
    const guardrailsPath = runtime.guardrailConfigReference;
    validateJson(guardrailsPath, validateGuardrails);
    console.log('agent-guardrails.json is valid.');

    console.log('Validating migration rollback enforcement rules...');
    validateBoundariesDoc();

    console.log('Validating migration directories...');
    validateMigrations();
    console.log('Migration validation passed.');
  } catch (error) {
    if (error instanceof ValidationError) {
      console.error('Validation failed:', error.message);
    } else {
      console.error('Unexpected error:', error.message);
    }
    process.exit(1);
  }
}

run();
