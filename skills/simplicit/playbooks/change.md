# Change

Adapted from pstack's Feature and Refactoring playbooks. The lead normally owns both design and implementation.

1. Establish the observable behavior or the behavior a refactor must preserve. Inspect the affected producer, consumers, data shape, and tests. Define ownership and public contracts before consequential boundary changes.
2. Keep the plan proportional. A small established pattern needs a short plan. Use [architect](../../architect/SKILL.md) for consequential design uncertainty, comparing short sketches before any larger experiment. Choose one implementation; parallel work requires independent ownership and an integration owner.
3. Implement in verifiable increments. Use acceptance criteria to choose checks. Add tests that catch changed behavior, not checks that merely repeat the implementation. Keep unrelated refactors and future features outside the task.
4. Run focused checks during implementation and required repository checks for the integrated result. Exercise the relevant user or caller behavior. Record runtime gaps separately from compilation and simulated tests.
5. For a meaningful feature or refactor, use the [Review playbook](review.md) after the candidate is coherent. Fix supported findings, recheck affected behavior, and independently review the repair. Reuse valid evidence for unchanged inputs.
6. Prepare commits or a PR when authorized. Follow the repository's draft and readiness conventions. Report evidence and remaining gaps; merge and release are separate authorized actions.

## For a behavior-preserving refactor

Before structural edits, inspect the actual contract with [how](../../how/SKILL.md) as needed and capture current behavior in an executable characterization test, snapshot, or old-versus-new equivalence harness. Run that baseline against the unchanged implementation. Existing coverage can supply it when it observes the affected behavior; type checks and lint alone cannot. If the baseline cannot run, preserve useful investigation and report the verification gap before claiming behavior is preserved.

Name the missing structure and target module, type, or call shape. Keep already-clear code. [Subtract before adding](../../principle-subtract-before-you-add/SKILL.md); avoid speculative wrappers and indirection. Separate newly discovered bugs or requested new behavior into their own scoped changes. Route large cross-cutting work through [figure-it-out](../../figure-it-out/SKILL.md).

Keep the baseline passing after each structural increment. For an API reshape, [migrate callers and retire the old API](../../principle-migrate-callers-then-delete-legacy-apis/SKILL.md) within the agreed compatibility contract; inspect string references, documentation and other non-code consumers too. Compare actual old and new outputs or replay the recorded baseline on the relevant runtime surface. Do not replace behavioral equivalence with compilation or an after-only test.

Keep the refactor only if the resulting structure reduces reader effort or removes an evidenced maintenance problem. Report the structure changed, the captured baseline, actual equivalence evidence, remaining gaps, and what simplification was achieved. Preserve unrelated edits when dropping an unhelpful task-owned change.
