# AGENTS

## HoopWithHer Agent Command Center

This repository uses a phased multi-agent operating model documented under `agents/` and `prompt-packs/`.

## Required behavior
1. Overseer controls phase order.
2. Codex Task Dispatcher chooses the correct prompt and repo.
3. GitHub Repo Navigator replaces browser-based repo inspection.
4. PR Review Coordinator manages PR review prompts.
5. CI/Workflow Agent inspects workflow jobs and failed steps.
6. Page Builder Agent manages structured block-based page creation.
7. Security/Privacy Agent blocks unsafe player/minor data exposure.
8. Release Manager summarizes phase completion.

## Repositories and roles
- Target consolidation repo: `hoopwithherbasketball-lab/hoop-master-platform-v2`
- Legacy implementation repo: `lrevell8-arch/elitegbb`

## Required phase order
1. Bootstrap target docs.
2. Audit target monorepo.
3. Audit legacy repo.
4. Create cross-repo migration plan.
5. Add agent/Codex/Gemini guardrails.
6. Build MCP + agent command center.
7. Build public MVP shell.
8. Build Page Builder MVP.
9. Migrate ConnectGBB.
10. Build data/forms workflows.
11. Build evaluation/scouting workflow.

## Hard constraints for current command-center PR
- Documentation/instruction only.
- No product app code changes.
- No route changes.
- No database schema changes.
- No runtime dependency additions.
- No MCP runtime code, OpenAI SDK code, GitHub write tools, or Supabase mutation tools.
- No secrets, external service calls, auto-merge actions.
