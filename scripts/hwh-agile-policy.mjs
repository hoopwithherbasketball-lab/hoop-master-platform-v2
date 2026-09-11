import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';

export const MODES = ['observe', 'repair', 'branch', 'staging', 'production'];

const BLOCKED_PATH_PATTERNS = [
  /(^|\/)\.env(?:\.|$)/i,
  /(^|\/)(?:id_rsa|id_ed25519|credentials|secrets?)(?:\.|$)/i,
  /(^|\/)\.git\/(?:config|credentials)/i,
  /(^|\/)node_modules\//i,
  /(^|\/)\.npmrc$/i,
  /(^|\/)\.ssh\//i,
  /(^|\/)supabase\/\.temp\//i,
];

const BLOCKED_COMMAND_PATTERNS = [
  /\brm\s+-rf\b/i,
  /\bsudo\b/i,
  /\bchmod\b/i,
  /\bchown\b/i,
  /\bmkfs\b/i,
  /\bdd\s+if=/i,
  /\bshutdown\b|\breboot\b/i,
  /\bcurl\b[^\n]*\|\s*(?:sh|bash)\b/i,
  /\bwget\b[^\n]*\|\s*(?:sh|bash)\b/i,
  /(?:^|\s)(?:>|>>|<)(?:\s|$)/,
  /[`\x00\r\n]/,
  /\$\([^)]*\)/,
  /\b(?:printenv|env|set)\b/i,
  /\bcat\s+[^\n]*(?:\.env|\.npmrc|id_rsa|id_ed25519|credentials|secret)/i,
  /\bgit\s+(?:reset\s+--hard|clean\s+-[a-z]*f|checkout\s+--\s+\.)\b/i,
  /\b(?:psql|mysql|sqlite3)\b[^\n]*(?:DROP|DELETE|TRUNCATE)\b/i,
];

const SAFE_PREFIXES = [
  'pwd', 'ls', 'find ', 'git status', 'git diff', 'git log', 'git show', 'git branch',
  'git rev-parse', 'git remote -v', 'npm test', 'npm run ', 'npm exec ', 'npx ',
  'node ', 'tsc ', 'turbo ', 'pnpm test', 'pnpm run ', 'yarn test', 'yarn run ',
  'bun test', 'bun run ', 'grep ', 'rg ', 'sed -n ', 'head ', 'tail ', 'wc ',
];

const MUTATING_PREFIXES = [
  'git add ', 'git commit ', 'git push ', 'npm install', 'npm ci', 'pnpm install',
  'yarn install', 'bun install',
];

const DEPLOY_PREFIXES = ['vercel ', 'wrangler ', 'docker push ', 'npm run deploy', 'pnpm run deploy', 'yarn deploy'];

const SECRET_PATTERNS = [
  /sk-[A-Za-z0-9_-]{20,}/g,
  /gh[pousr]_[A-Za-z0-9]{20,}/g,
  /(?:AKIA|ASIA)[A-Z0-9]{16}/g,
  /-----BEGIN [A-Z ]*PRIVATE KEY-----[\s\S]*?-----END [A-Z ]*PRIVATE KEY-----/g,
  /(?:api[_-]?key|token|secret|password)\s*[:=]\s*['"]?[^\s'";,]{8,}/gi,
];

export function assertInsideRoot(root, candidate) {
  const resolvedRoot = path.resolve(root);
  const resolved = path.resolve(resolvedRoot, candidate);
  if (resolved !== resolvedRoot && !resolved.startsWith(resolvedRoot + path.sep)) {
    throw new Error(`Path escapes repository root: ${candidate}`);
  }
  const relative = path.relative(resolvedRoot, resolved).replaceAll('\\', '/');
  if (BLOCKED_PATH_PATTERNS.some((pattern) => pattern.test(relative))) {
    throw new Error(`Protected path is not accessible: ${relative}`);
  }
  return resolved;
}

export function redactSecrets(value) {
  let text = String(value ?? '');
  for (const pattern of SECRET_PATTERNS) text = text.replace(pattern, '[REDACTED]');
  return text;
}

export function currentBranch(root) {
  try {
    return execFileSync('git', ['branch', '--show-current'], { cwd: root, encoding: 'utf8' }).trim();
  } catch {
    return '';
  }
}

export function evaluateCommand(command, { mode, root, approved = false, productionApproved = false } = {}) {
  const cmd = String(command ?? '').trim();
  if (!cmd) return { allowed: false, reason: 'Empty command.' };
  if (!MODES.includes(mode)) return { allowed: false, reason: `Unknown mode: ${mode}` };
  if (BLOCKED_COMMAND_PATTERNS.some((pattern) => pattern.test(cmd))) {
    return { allowed: false, reason: 'Command matched a blocked safety pattern.' };
  }

  const deploy = DEPLOY_PREFIXES.some((prefix) => cmd.startsWith(prefix));
  const mutating = MUTATING_PREFIXES.some((prefix) => cmd.startsWith(prefix));
  const readOnly = SAFE_PREFIXES.some((prefix) => cmd === prefix.trim() || cmd.startsWith(prefix));

  if (mode === 'observe' && !readOnly) return { allowed: false, reason: 'Observe mode only permits read/build/test commands.' };
  if (deploy) {
    if (!['staging', 'production'].includes(mode)) return { allowed: false, reason: 'Deployment commands require staging or production mode.' };
    if (!approved) return { allowed: false, reason: 'Deployment requires --approve.' };
    if (mode === 'production' && !productionApproved) return { allowed: false, reason: 'Production deployment requires --approve-production.' };
  }
  if (mutating && !['branch', 'staging', 'production'].includes(mode)) {
    return { allowed: false, reason: 'Git/dependency mutation requires branch, staging, or production mode.' };
  }
  if (mutating && !approved) return { allowed: false, reason: 'Mutating shell commands require --approve.' };
  if (!readOnly && !mutating && !deploy) return { allowed: false, reason: 'Command is not in the approved command classes.' };

  if (/^git\s+push\b/i.test(cmd)) {
    const branch = currentBranch(root);
    if (!branch || ['main', 'master'].includes(branch)) return { allowed: false, reason: 'Direct pushes from main/master are blocked.' };
    if (/\b(?:main|master)\b/.test(cmd)) return { allowed: false, reason: 'Direct pushes to main/master are blocked.' };
  }

  return { allowed: true, reason: 'Allowed by execution policy.' };
}

export function sanitizedChildEnv() {
  const keep = ['PATH', 'HOME', 'USERPROFILE', 'SystemRoot', 'WINDIR', 'TEMP', 'TMP', 'TMPDIR', 'CI', 'NODE_ENV', 'FORCE_COLOR'];
  const env = {};
  for (const key of keep) if (process.env[key] !== undefined) env[key] = process.env[key];
  env.FORCE_COLOR = '0';
  return env;
}

export function appendAudit(root, event) {
  const dir = path.join(root, '.agile');
  fs.mkdirSync(dir, { recursive: true });
  const safe = { ...event, timestamp: new Date().toISOString() };
  fs.appendFileSync(path.join(dir, 'audit.jsonl'), JSON.stringify(safe) + '\n', 'utf8');
}

export function projectInstructions(root) {
  const files = ['AGENTS.md', 'AGENT_OPERATING_MODEL.md', 'AGENT_PHASE_GATES.md'];
  const chunks = [];
  for (const file of files) {
    const full = path.join(root, file);
    if (fs.existsSync(full)) chunks.push(`\n# ${file}\n${fs.readFileSync(full, 'utf8').slice(0, 12000)}`);
  }
  return chunks.join('\n');
}
