Follow the [runtime contract](../references/runtime.md). This playbook supplies a workflow, not additional tools or authorization.

When candidate review is required, use the existing [Review playbook](review.md) and its linked reviewer contract. The workflow here does not replace those review gates.

# Session pickup

Recover the precise resume point from a targeted prior trail, then continue the already authorized task. Avoid redoing completed work whose evidence remains valid.

1. Locate only the trail the user supplied or the host explicitly exposes: a handoff, scoped transcript, project note, branch, or connected agent record. Do not infer transcript-store paths or scan unrelated workspaces. Read metadata and latest context first, then selectively inspect decisions and failures. For long records, keep a compact timeline with evidence pointers; optional authorized helpers can reduce bulk.
2. Reconstruct goal, scope, user rulings and authorization, branch/worktree/base, delivered and uncommitted changes, planned units, active helpers, rejected approaches, and open gates. Treat the prior trail as important evidence to reuse, not as infallible current state.
3. Compare with actual source and dirty/untracked files, branch history/diff, current remote PRs, checks, dependencies, config, generated artifacts, and relevant runtime state. Name what changed since the handoff. Preserve unrelated edits. A stable commit hash cannot prove that the running product or dependencies match earlier evidence.
4. Mark done versus pending using evidence freshness. Reuse completed repro, tests, review, and runtime checks when their candidate and relevant inputs still match. Rerun only invalidated lanes or genuinely missing proof; do not repeat the entire investigation as a ritual. If the task asks what an agent actually did, available full execution records matter more than a narrative summary.
5. State the first unresolved unit and route it through the appropriate [Simplicit guidance](../SKILL.md): continue implementation, deliver a finished recommendation, reassess a disputed conclusion, or diagnose a failed run. A pickup request does not expand scope, permit landing, or override a prior stop. If the user asked to resume authorized execution, continue without another unnecessary permission checkpoint.

Report where prior work stopped, what evidence was inherited and what needed refresh, current candidate and gaps, precise resume point, and the resulting action. If prior history is inaccessible, use the supplied handoff/git/docs and clearly identify what cannot be reconstructed.
