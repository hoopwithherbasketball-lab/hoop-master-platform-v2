# AGENTS

## HoopWithHer Agent Command Center

This repository uses a phased multi-agent operating model documented under `agents/` and `prompt-packs/`.

## Mode policy
- **Planning / Documentation Mode:** used for command-center setup, audits, mapping, and guardrail PRs.
- **Implementation Mode:** used only after a phase is explicitly unlocked.

Do not modify app code during planning, audit, guardrail, or command-center setup phases. During unlocked implementation phases, modify only the files and areas explicitly authorized by the phase prompt.

## Global forbidden actions (all phases)
- Hardcoding secrets.
- Exposing parent emails/phones publicly.
- Exposing private evaluation notes publicly.
- Force-pushing, merging without user approval, or deleting branches without approval.
- Running production Supabase migrations without explicit approval.
- Sending real emails/SMS without explicit approval.
- Changing repo billing/permissions/settings without explicit approval.


Status: Active (Planning Mode)
