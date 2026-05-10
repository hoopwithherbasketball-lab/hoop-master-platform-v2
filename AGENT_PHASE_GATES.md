# AGENT_PHASE_GATES

1. Bootstrap target docs
2. Audit target monorepo
3. Audit legacy repo
4. Create cross-repo migration plan
5. Add agent/Codex/Gemini guardrails
6. Build MCP + agent command center
7. Build public MVP shell
8. Build Page Builder MVP
9. Migrate ConnectGBB
10. Build data/forms workflows
11. Build evaluation/scouting workflow

Only Overseer can advance phase after evidence + checklist signoff.

## Guardrail Scope

The “docs-only” restriction applies to:
- Agent Command Center setup PRs
- audit PRs
- planning PRs
- guardrail PRs

The restriction does not apply to unlocked implementation phases, provided:
- the phase is explicitly unlocked
- the work is in the correct repo
- the work is within the approved target paths
- Security/Privacy Agent rules are followed
- QA/Test Agent checks are run
- Gemini review is requested before merge


## Overseer runtime role
The Overseer is active in planning, implementation, and implementation_review phases to validate gates, coordinate dispatch, and authorize phase unlocks/closure.

## Phase 6 Mode
- Phase 6: Build MCP + agent command center
- Mode: planning
- Product/app implementation begins at Phase 7.
