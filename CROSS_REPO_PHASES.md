# CROSS_REPO_PHASES

> This file is the canonical cross-repo phase map. Agent dispatch rules and prompt-pack IDs should align with this numbering.

## Repo roles
Target consolidation repo:
- `hoopwithherbasketball-lab/hoop-master-platform-v2`

Legacy implementation repo:
- `lrevell8-arch/elitegbb`

| Global Phase | Phase ID | Prompt Pack | Primary Repo | Mode |
|---|---|---|---|---|
| Phase 1 | phase_1_bootstrap_target_docs | prompt-packs/01_bootstrap_target_docs.prompt.md | hoop-master-platform-v2 | planning |
| Phase 2 | phase_2_audit_target_monorepo | prompt-packs/02_audit_target_monorepo.prompt.md | hoop-master-platform-v2 | planning |
| Phase 3 | phase_3_audit_legacy_repo | prompt-packs/03_audit_legacy_repo.prompt.md | elitegbb | planning |
| Phase 4 | phase_4_cross_repo_migration_plan | prompt-packs/04_cross_repo_migration_plan.prompt.md | hoop-master-platform-v2 | planning |
| Phase 5 | phase_5_agent_guardrails | prompt-packs/05_agent_guardrails.prompt.md | hoop-master-platform-v2 | planning |
| Phase 6 | phase_6_mcp_agent_command_center | prompt-packs/06_mcp_agent_command_center.prompt.md | hoop-master-platform-v2 | planning / implementation |
| Phase 7 | phase_7_public_mvp | prompt-packs/07_phase_7_public_mvp.prompt.md | hoop-master-platform-v2 | implementation |
| Phase 8 | phase_8_page_builder | prompt-packs/08_phase_8_page_builder.prompt.md | hoop-master-platform-v2 | implementation |
| Phase 9 | phase_9_connectgbb_migration | prompt-packs/09_phase_9_connectgbb_migration.prompt.md | hoop-master-platform-v2 | implementation |
| Phase 10 | phase_10_data_forms | prompt-packs/10_phase_10_data_forms.prompt.md | hoop-master-platform-v2 | implementation |
| Phase 11 | phase_11_evaluations | prompt-packs/11_phase_11_evaluations.prompt.md | hoop-master-platform-v2 | implementation |
