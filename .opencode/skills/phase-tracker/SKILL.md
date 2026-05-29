---
name: phase-tracker
description: Use when the user asks about progress, status, or what phase they're in. Tracks the current build phase and task completion.
---

# Phase Tracker

## State File
Phase state is stored in `.opencode/state/phase.json`.

## Structure
```json
{
  "current_phase": 6,
  "phase_name": "mcp_agent_command_center",
  "mode": "command_center_tooling",
  "status": "in_progress",
  "started_at": "2026-05-29",
  "completed_tasks": [
    { "task": "Create .opencode directory structure", "commit": "none" }
  ],
  "pending_tasks": [
    "Run migration 20260531000000_audit_fixes.sql in Supabase dashboard",
    "Verify all CRUD works end-to-end",
    "Create Supabase storage buckets (training-thumbnails, training-videos)"
  ],
  "blockers": []
}
```

## Usage
When asked "what's the status?":
1. Read `.opencode/state/phase.json`
2. Read `HANDOFF.md` for context
3. Summarize: current phase, completed count, pending count, blockers
4. Suggest the next single action

When advancing:
1. Move completed task from pending to completed_tasks
2. If no pending tasks remain, increment current_phase
3. Load the next prompt pack from `prompt-packs/` to populate new pending_tasks
4. Write updated phase.json
5. Commit
