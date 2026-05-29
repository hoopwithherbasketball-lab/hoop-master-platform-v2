---
name: handoff
description: Use when the user says 'handoff', 'save state', or before ending a session. Generates a complete session handoff document.
---

# Handoff Generator

## Purpose
Produce an updated `HANDOFF.md` at the repo root so the next session (agent or human) can pick up exactly where we left off.

## Process

### 1. Gather Context
- Read `HANDOFF.md` (previous state)
- Read `.opencode/state/phase.json` (current phase state)
- Read `git log --oneline -10` (recent commits)
- Read `git status --short` (uncommitted changes)
- Read `git diff --stat` (what changed)

### 2. Determine What Changed This Session
- Review the git log and diff since the last recorded commit in HANDOFF.md
- Identify every file that was created or modified
- Note any migrations, new tables, new pages, fixed bugs

### 3. Determine Current State
- What's working? What's not?
- What migrations have been applied? Which haven't?
- Any known blockers?

### 4. Write HANDOFF.md
Structure:
```
# Handoff — hoop-master-platform-v2

## Current State
- Branch, latest commit
- Build status

## What Was Built This Session
- Bullet list of features, fixes, migrations (with file paths)

## Migration Status
- Applied: list
- Pending: list

## Known Issues / Blockers
- Bullet list

## Architecture Decisions
- Key decisions made this session

## Commit History (Recent)
- git log output

## Next Steps
- Ordered list of the next 3-5 actions

## Quick Commands
- turbo build, turbo lint, etc.
```

### 5. Commit
Stage `HANDOFF.md` and `.opencode/state/phase.json`, commit with message "handoff: update session state".
