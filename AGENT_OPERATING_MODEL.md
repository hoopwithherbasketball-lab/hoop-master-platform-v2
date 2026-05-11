# AGENT_OPERATING_MODEL

## Runtime maturity (current PR)
- Agents in this PR are instruction/documentation agents.
- MCP server/runtime orchestration comes in a later phase.

## Phase-Scoped Agent Permissions

Agents operate in one of two modes:

| Mode | Used For | Code Changes Allowed? |
|---|---|---|
| Planning / Documentation Mode | Docs, audits, prompt packs | No app/product code changes |
| Command Center Tooling Mode | Phase 6 tooling/docs only | No app/product code changes |
| Implementation Mode | Approved build phases (Phase 7+) | Yes, but only within phase scope |

Current command-center PR status:
- Planning / Documentation Mode only

Future implementation phases:
- Phase 7 Public MVP Shell: Frontend UI Agent may modify approved app UI/routes/components.
- Phase 8 Page Builder MVP: Page Builder Agent may modify approved page-builder packages, UI blocks, and preview/rendering logic.
- Phase 9 ConnectGBB Migration: Cross-Repo Migration Architect and related implementation agents may migrate approved slices into approved target packages.
- Phase 10 Data/Forms: Supabase/Data Agent and Forms & CRM Agent may modify approved schema, types, forms, API actions, and webhook placeholders.
- Phase 11 Evaluations: Evaluation/Scouting Agent may modify approved evaluation models, components, and workflows.

## Replacement model (no browser-based assistant required)
- GitHub Repo Navigator replaces browser repo inspection.
- Codex Task Dispatcher replaces manual prompt guessing.
- PR Review Coordinator replaces manual PR review coordination.
- CI/Workflow Agent handles workflow job and step inspection.
