# AGENTS

## HoopWithHer Agent Command Center

This repository uses a phased multi-agent operating model documented under `agents/` and `prompt-packs/`.

## Mode policy
- **Planning / Documentation Mode:** used for command-center setup, audits, mapping, and guardrail phases.
- **Implementation Mode:** used only after a phase is explicitly unlocked.

## Phase-Scoped Editing Rules

Planning, audit, guardrail, and command-center documentation phases are documentation-only unless the active phase prompt explicitly authorizes runtime scaffolding.

Implementation phases may modify only the files and areas explicitly authorized by the active phase prompt.

Implementation phases currently include:

- Phase 7: Public MVP Shell
- Phase 8: Page Builder MVP
- Phase 9: ConnectGBB Migration
- Phase 10: Data/Forms Workflows
- Phase 11: Evaluation/Scouting Workflow

Global restrictions always apply:

- Do not hardcode secrets.
- Do not expose parent email or phone publicly.
- Do not expose private evaluation notes publicly.
- Do not expose private recruiting notes publicly.
- Do not bypass QA/Test or Security/Privacy review.
- Do not merge PRs automatically.
- Do not modify unrelated apps/packages.
- Do not change billing, repo permissions, production secrets, or production infrastructure without explicit approval.
