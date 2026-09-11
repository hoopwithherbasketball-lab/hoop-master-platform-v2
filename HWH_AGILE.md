# HWH AGILE

HWH AGILE is the repository-native autonomous DevOps agent for Hoop Master Platform v2. It uses the OpenAI Responses API for multi-step tool calling while enforcing repository-local execution policy before model-requested actions execute.

## Setup

Set `OPENAI_API_KEY` in the parent shell or secret manager. The agent deliberately does not read `.env` files.

Optional: set `OPENAI_MODEL`; otherwise the CLI uses `gpt-5.6`.

## Commands

```bash
npm run agile:observe -- "analyze the monorepo and identify failing checks"
npm run agile -- "fix the current TypeScript/build failures and verify the build"
npm run agile -- "fix the issue, verify it, and prepare the branch" -- --mode branch --approve
npm run agile -- "deploy the verified build to staging and run health checks" -- --mode staging --approve
```

Production mode is intentionally exceptional and requires both flags:

```bash
npm run agile -- "deploy the already verified release to production" -- --mode production --approve --approve-production
```

## Modes

- `observe`: repository inspection, build, lint, tests, Git inspection. No file writes.
- `repair`: default. May edit repository files, but cannot commit, push, install dependencies, or deploy.
- `branch`: may perform approved dependency/Git mutation on a non-main branch.
- `staging`: branch capabilities plus approved preview/staging deployment commands.
- `production`: deployment only with explicit dual approval. Direct pushes from/to `main` or `master` remain blocked.

## Safety controls

The runtime blocks path traversal, `.env`, `.ssh`, npm credentials, private keys, credential files, dangerous shell patterns, environment dumping, destructive Git reset/clean commands, and shell download pipes. Child processes receive a reduced environment rather than inheriting API keys and other parent-process secrets.

Every policy decision and command result is recorded in `.agile/audit.jsonl`. Add `.agile/` to local ignore/exclude rules if you do not want execution logs in Git status.

The model is instructed to preserve repository guardrails, authorization, RLS, tests, and CI gates. It may not claim completion until it has run the relevant verification commands and observed their results.

## Budgets

Defaults: 24 reasoning/tool steps, 30 shell commands, 30 minutes. Hard caps: 60 steps, 100 commands, 120 minutes.

Override with `--max-steps`, `--max-commands`, or `--max-minutes`.

## Architecture

`scripts/hwh-agile.mjs` owns the OpenAI reasoning loop and tools. `scripts/hwh-agile-policy.mjs` is the non-model security boundary. Safety policy is deterministic; the model cannot override it through prompting.
