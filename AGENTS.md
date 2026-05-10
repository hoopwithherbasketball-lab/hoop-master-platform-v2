# AGENTS

## HoopWithHer Agent Command Center

This repository uses a phased multi-agent operating model documented under `agents/` and `prompt-packs/`.

## Phase-Scoped Editing Rules

Planning, audit, and guardrail phases are documentation-only unless the active prompt explicitly authorizes command-center tooling.

Phase 6 is command-center tooling only (`command_center_tooling`).

Phases 7-11 allow scoped implementation only within the files and areas explicitly authorized by the active phase prompt.

## Global restrictions (all phases)

- Do not hardcode secrets.
- Do not expose parent email or phone publicly.
- Do not expose private evaluation notes publicly.
- Do not expose private recruiting notes publicly.
- Do not bypass QA/Test or Security/Privacy review.
- Do not auto-merge or perform destructive repo changes.
- Do not modify unrelated apps/packages.
- Do not change billing, repo permissions, production secrets, or production infrastructure without explicit approval.
