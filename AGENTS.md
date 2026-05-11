# AGENTS

## HoopWithHer Agent Command Center

This repository uses a phased multi-agent operating model documented under `agents/` and `prompt-packs/`.

## Mode policy
- **Planning / Documentation Mode:** used for docs, audits, mapping, and guardrail PRs.
- **Command Center Tooling Mode (`command_center_tooling`):** used exclusively for Phase 6 command-center setup and tooling. No product/app code changes allowed.
- **Implementation Mode:** used only after a phase is explicitly unlocked (Phase 7+).

Do not modify app code during planning, audit, guardrail, or command-center setup phases. During unlocked implementation phases, modify only the files and areas explicitly authorized by the phase prompt.

## Global forbidden actions (all phases)
- Hardcoding secrets.
- Exposing parent emails/phones publicly.
- Exposing private evaluation notes publicly.
- Force-pushing, merging without user approval, or deleting branches without approval.
- Running production Supabase migrations without explicit approval.
- Sending real emails/SMS without explicit approval.
- Changing repo billing/permissions/settings without explicit approval.
