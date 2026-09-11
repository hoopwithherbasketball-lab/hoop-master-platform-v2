#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { spawn } from 'node:child_process';
import {
  MODES, assertInsideRoot, redactSecrets, evaluateCommand, sanitizedChildEnv,
  appendAudit, projectInstructions, currentBranch,
} from './hwh-agile-policy.mjs';

const ROOT = process.cwd();
const args = process.argv.slice(2);
const flag = (name) => args.includes(name);
const value = (name, fallback) => {
  const i = args.indexOf(name);
  return i >= 0 && args[i + 1] ? args[i + 1] : fallback;
};
const mode = value('--mode', 'repair');
const maxSteps = Math.min(Number(value('--max-steps', '24')), 60);
const maxCommands = Math.min(Number(value('--max-commands', '30')), 100);
const maxMinutes = Math.min(Number(value('--max-minutes', '30')), 120);
const model = value('--model', process.env.OPENAI_MODEL || 'gpt-5.6');
const approved = flag('--approve');
const productionApproved = flag('--approve-production');
const task = args.filter((a, i) => !a.startsWith('--') && !(i > 0 && args[i - 1].startsWith('--'))).join(' ').trim();

if (!MODES.includes(mode)) throw new Error(`Invalid mode. Use: ${MODES.join(', ')}`);
if (!task) {
  console.error('Usage: npm run agile -- "task" [--mode observe|repair|branch|staging|production]');
  process.exit(2);
}
if (!process.env.OPENAI_API_KEY) {
  console.error('OPENAI_API_KEY is required in the parent environment. AGILE never reads .env files.');
  process.exit(2);
}
if (mode === 'production' && !(approved && productionApproved)) {
  console.error('Production mode requires both --approve and --approve-production.');
  process.exit(2);
}

let commandCount = 0;
const started = Date.now();

function withinBudget() {
  if (commandCount >= maxCommands) throw new Error(`Command budget exhausted (${maxCommands}).`);
  if (Date.now() - started > maxMinutes * 60_000) throw new Error(`Runtime budget exhausted (${maxMinutes} minutes).`);
}

function exec(command, timeoutSeconds = 300) {
  withinBudget();
  const decision = evaluateCommand(command, { mode, root: ROOT, approved, productionApproved });
  appendAudit(ROOT, { type: 'command_policy', command: redactSecrets(command), mode, ...decision });
  if (!decision.allowed) return Promise.resolve({ success: false, output: `BLOCKED: ${decision.reason}` });
  commandCount += 1;
  return new Promise((resolve) => {
    const shell = process.platform === 'win32' ? 'powershell.exe' : 'sh';
    const shellArgs = process.platform === 'win32'
      ? ['-NoProfile', '-NonInteractive', '-Command', command]
      : ['-c', command];
    const child = spawn(shell, shellArgs, {
      cwd: ROOT,
      env: sanitizedChildEnv(),
      detached: process.platform !== 'win32',
      windowsHide: true,
    });
    let stdout = '', stderr = '', finished = false;
    const timer = setTimeout(() => {
      if (finished) return;
      if (process.platform === 'win32') child.kill();
      else { try { process.kill(-child.pid, 'SIGKILL'); } catch { child.kill('SIGKILL'); } }
    }, Math.min(timeoutSeconds, 600) * 1000);
    child.stdout.on('data', d => { if (stdout.length < 30000) stdout += d; });
    child.stderr.on('data', d => { if (stderr.length < 15000) stderr += d; });
    child.on('close', code => {
      finished = true; clearTimeout(timer);
      const output = redactSecrets(`Exit: ${code ?? 1}\nSTDOUT:\n${stdout}\nSTDERR:\n${stderr}`).slice(0, 45000);
      appendAudit(ROOT, { type: 'command_result', command: redactSecrets(command), exitCode: code ?? 1 });
      resolve({ success: code === 0, output });
    });
    child.on('error', err => { finished = true; clearTimeout(timer); resolve({ success: false, output: redactSecrets(err.message) }); });
  });
}

const tools = [
  {
    type: 'function', name: 'list_files', description: 'List repository files matching a simple directory path. Never reads protected secrets.',
    parameters: { type: 'object', properties: { directory: { type: 'string' } }, required: ['directory'], additionalProperties: false },
  },
  {
    type: 'function', name: 'read_file', description: 'Read a UTF-8 repository file. Protected credential and environment paths are blocked.',
    parameters: { type: 'object', properties: { path: { type: 'string' } }, required: ['path'], additionalProperties: false },
  },
  {
    type: 'function', name: 'write_file', description: 'Replace a UTF-8 repository file. Available only outside observe mode; protected paths are blocked.',
    parameters: { type: 'object', properties: { path: { type: 'string' }, content: { type: 'string' } }, required: ['path', 'content'], additionalProperties: false },
  },
  {
    type: 'function', name: 'run_command', description: 'Run a policy-checked shell command inside the repository. Use for builds, tests, lint, git inspection, and approved branch/deploy actions.',
    parameters: { type: 'object', properties: { command: { type: 'string' }, timeout: { type: 'number' } }, required: ['command'], additionalProperties: false },
  },
  {
    type: 'function', name: 'complete_task', description: 'Finish only after verifying the requested outcome. Report checks actually run and unresolved issues.',
    parameters: { type: 'object', properties: { summary: { type: 'string' }, verification: { type: 'array', items: { type: 'string' } }, unresolved: { type: 'array', items: { type: 'string' } } }, required: ['summary', 'verification', 'unresolved'], additionalProperties: false },
  },
];

async function invokeTool(name, input) {
  try {
    if (name === 'list_files') {
      const dir = assertInsideRoot(ROOT, input.directory || '.');
      return { success: true, output: fs.readdirSync(dir, { withFileTypes: true }).slice(0, 300).map(x => `${x.isDirectory() ? 'd' : 'f'} ${x.name}`).join('\n') };
    }
    if (name === 'read_file') {
      const file = assertInsideRoot(ROOT, input.path);
      return { success: true, output: redactSecrets(fs.readFileSync(file, 'utf8')).slice(0, 60000) };
    }
    if (name === 'write_file') {
      if (mode === 'observe') return { success: false, output: 'BLOCKED: observe mode is read-only.' };
      const file = assertInsideRoot(ROOT, input.path);
      fs.mkdirSync(path.dirname(file), { recursive: true });
      fs.writeFileSync(file, input.content, 'utf8');
      appendAudit(ROOT, { type: 'file_write', path: path.relative(ROOT, file).replaceAll('\\', '/') });
      return { success: true, output: `Wrote ${path.relative(ROOT, file)}` };
    }
    if (name === 'run_command') return await exec(input.command, input.timeout || 300);
    if (name === 'complete_task') return { success: true, output: JSON.stringify(input), complete: true };
    return { success: false, output: `Unknown tool: ${name}` };
  } catch (err) {
    return { success: false, output: redactSecrets(err.message) };
  }
}

const system = `You are HWH AGILE, the autonomous DevOps engineer for Hoop With Her's production monorepo.
Work until the task is actually complete or a real external blocker exists. Inspect before editing. Make the smallest correct changes. Never claim a build/test passed unless you ran it and saw success. Do not weaken tests, security controls, authorization, RLS, CI gates, or protected-file rules to make checks pass. Do not read, print, move, or modify secrets. Never expose athlete, parent, donor, payment, CRM, authentication, or private contact data.
Current execution mode: ${mode}. Current branch: ${currentBranch(ROOT) || '(unknown)'}. Repository root: ${ROOT}.
In repair mode, edit files locally but do not commit/push/deploy. In branch mode, branch-scoped Git mutations may be used only when policy allows and approval was supplied. Staging deploys require approval. Production is exceptional and requires dual approval.
Before complete_task, run the relevant build/typecheck/lint/tests available for the changed scope. If a repository instruction conflicts with safety, safety wins.
${projectInstructions(ROOT)}`;

async function openai(body) {
  const res = await fetch('https://api.openai.com/v1/responses', {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`OpenAI API ${res.status}: ${redactSecrets(await res.text())}`);
  return await res.json();
}

console.log(`HWH AGILE | mode=${mode} | model=${model} | maxSteps=${maxSteps} | task=${task}`);
appendAudit(ROOT, { type: 'run_start', mode, model, task: redactSecrets(task) });

let input = [{ role: 'user', content: task }];
let previousResponseId;
let finalResult;

for (let step = 1; step <= maxSteps; step += 1) {
  withinBudget();
  const response = await openai({ model, instructions: system, input, tools, previous_response_id: previousResponseId, parallel_tool_calls: false });
  previousResponseId = response.id;
  const calls = (response.output || []).filter(x => x.type === 'function_call');
  if (!calls.length) {
    const text = (response.output || []).flatMap(x => x.content || []).filter(x => x.type === 'output_text').map(x => x.text).join('\n');
    input = [{ role: 'user', content: `Continue working. Do not stop with commentary. Use complete_task only after verification. Last model text: ${text.slice(0, 8000)}` }];
    continue;
  }
  const outputs = [];
  for (const call of calls) {
    let parsed = {};
    try { parsed = JSON.parse(call.arguments || '{}'); } catch { parsed = {}; }
    const result = await invokeTool(call.name, parsed);
    console.log(`[${step}] ${call.name}: ${result.success ? 'ok' : 'blocked/failed'}`);
    outputs.push({ type: 'function_call_output', call_id: call.call_id, output: result.output });
    if (call.name === 'complete_task' && result.complete) finalResult = parsed;
  }
  if (finalResult) break;
  input = outputs;
}

if (!finalResult) {
  appendAudit(ROOT, { type: 'run_end', success: false, reason: 'step_budget' });
  console.error(`AGILE stopped without completion after ${maxSteps} steps.`);
  process.exit(1);
}
appendAudit(ROOT, { type: 'run_end', success: finalResult.unresolved?.length === 0, summary: redactSecrets(finalResult.summary) });
console.log('\n=== AGILE RESULT ===');
console.log(redactSecrets(finalResult.summary));
for (const item of finalResult.verification || []) console.log(`✓ ${redactSecrets(item)}`);
for (const item of finalResult.unresolved || []) console.log(`! ${redactSecrets(item)}`);
process.exit(finalResult.unresolved?.length ? 1 : 0);
