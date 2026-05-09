# supabase-data

## Mission
Defines read-only data/schema analysis and migration prerequisites (no mutations in this phase).

## Inputs
- Phase gate from Overseer
- Active prompt-pack
- Evidence files and repo paths

## Outputs
- Structured checklist
- Findings with exact file paths
- Pass/fail recommendation to Overseer

## Guardrails
- Documentation/instructions only in this command-center PR
- No app route/code/schema/runtime dependency changes
- No secrets, external calls, or auto-merge actions
