# CROSS_REPO_PHASES

> This file is the canonical cross-repo phase map. Agent dispatch rules and prompt-pack IDs must strictly align with this numbering.

## Repo roles
Target consolidation repo:
- `hoopwithherbasketball-lab/hoop-master-platform-v2`

Legacy implementation repo:
- `lrevell8-arch/elitegbb`

## Global Phases

| Global Phase | Phase ID | Prompt Pack | Primary Repo | Mode |
|---|---|---|---|---|
| Phase 1 | phase_1_bootstrap_target_docs | prompt-packs/01_bootstrap_target_docs.prompt.md | hoop-master-platform-v2 | planning |
| Phase 2 | phase_2_audit_target_monorepo | prompt-packs/02_audit_target_monorepo.prompt.md | hoop-master-platform-v2 | planning |
| Phase 3 | phase_3_audit_legacy_repo | prompt-packs/03_audit_legacy_repo.prompt.md | elitegbb | planning |
| Phase 4 | phase_4_cross_repo_migration_plan | prompt-packs/04_cross_repo_migration_plan.prompt.md | hoop-master-platform-v2 | planning |
| Phase 5 | phase_5_agent_guardrails | prompt-packs/05_agent_guardrails.prompt.md | hoop-master-platform-v2 | planning |
| Phase 6 | phase_6_mcp_agent_command_center | prompt-packs/06_phase_6_mcp_agent_command_center.prompt.md | hoop-master-platform-v2 | command_center_tooling |
| Phase 7 | phase_7_public_mvp | prompt-packs/07_phase_7_public_mvp.prompt.md | hoop-master-platform-v2 | implementation |
| Phase 8 | phase_8_page_builder | prompt-packs/08_phase_8_page_builder.prompt.md | hoop-master-platform-v2 | implementation |
| Phase 9 | phase_9_connectgbb_migration | prompt-packs/09_connectgbb_migration.prompt.md | hoop-master-platform-v2 | implementation |
| Phase 10 | phase_10_data_forms | prompt-packs/10_data_forms.prompt.md | hoop-master-platform-v2 | implementation |
| Phase 11 | phase_11_evaluations | prompt-packs/11_evaluations.prompt.md | hoop-master-platform-v2 | implementation |

## Milestone Definitions
- **Phase 1-5 (Planning)**: Successful completion establishes structural guardrails, documentation, and the migration strategy. No product code implementation occurs.
- **Phase 6 (Tooling)**: Successful completion results in active, automated agent routing and MCP capabilities for the repository.
- **Phase 7-11 (Implementation)**: Successful completion delivers production-ready features directly serving the MVP scope.
