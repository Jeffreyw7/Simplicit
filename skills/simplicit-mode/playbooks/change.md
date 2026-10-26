# Change

Adapted from pstack's Feature playbook. The lead normally owns both design and implementation.

1. Establish the observable behavior or the behavior a refactor must preserve. Inspect the affected producer, consumers, data shape, and tests. Define ownership and public contracts before consequential boundary changes.
2. Keep the plan proportional. A small established pattern needs a short plan. A consequential uncertainty may need two design sketches or a bounded experiment. Choose one implementation; parallel work requires independent ownership and an integration owner.
3. Implement in verifiable increments. Use acceptance criteria to choose checks. Add tests that catch changed behavior, not checks that merely repeat the implementation. Keep unrelated refactors and future features outside the task.
4. Run focused checks during implementation and required repository checks for the integrated result. Exercise the relevant user or caller behavior. Record runtime gaps separately from compilation and simulated tests.
5. For a meaningful change, use the Review playbook after the candidate is coherent. Fix supported findings, recheck affected behavior, and independently review the repair. Reuse valid evidence for unchanged inputs.
6. Prepare commits or a PR when authorized. Follow the repository's draft and readiness conventions. Report evidence and remaining gaps; merge and release are separate authorized actions.
