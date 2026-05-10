# GEMINI_REVIEW_WORKFLOW

1. PR Review Coordinator prepares standardized review prompt.
2. Gemini feedback is captured as actionable checklist items.
3. Codex Task Dispatcher routes fixes to the correct specialist agent.
4. Overseer validates closure before phase advancement.


## Overseer in implementation_review
After Gemini feedback, Overseer determines whether a Codex fix prompt is required and only closes/unlocks phases after QA/Test and Security/Privacy checks pass.
