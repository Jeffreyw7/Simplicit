---
name: no-comments
description: "Use when asked to remove unnecessary comments or review comment-backed workarounds in a specified set of files or diff."
---

Read and follow the [runtime contract](../simplicit/references/runtime.md) before using this skill. It governs scope, tools, authorization, verification, and review.

# No comments

Prefer code that explains itself while preserving useful contracts and externally imposed constraints. Use the caller's files or diff. Otherwise identify the actual base and current diff, including working-tree changes; do not assume `main` exists. An audit stays read-only; a cleanup request permits scoped edits.

Read the [comment review criteria](references/comment-review.md). An available authorized independent reviewer can apply them as a bounded read-only review. Without one, review directly and disclose that limitation.

Inspect every finding against nearby code. Reject scope escapes, unsupported claims, removal of an exception without evidence, and application edits made by a comment-only reviewer. Check missed lint and TypeScript suppressions. Investigate uncertain claims with [How](../how/SKILL.md) or [Why](../why/SKILL.md); ambiguity is not proof that a constraint is false.

For an authorized cleanup, delete redundant narration or dead commented code. Fix a trivial accepted root cause directly. If a nontrivial shape is needed, use [Architect](../architect/SKILL.md) once for the scoped accepted set, then implement the smallest supported fix. Removing a safety suppression requires resolving and verifying the underlying error, not just deleting the line. Report out-of-scope causes instead of widening the fence.

For comments that say do not remove, do not change wording, or consult someone, verify the current reason. Preserve a supported external contract. For internal invariants, propose the cheapest type, test, runtime check, or lint that could enforce the claim. Apply an encoding when authorized and verified before removing its only documentation. Otherwise leave the unresolved constraint visible and report it.

Review the diff and run relevant checks. Report files, actual deletion count, restored comments, accepted fixes, encoding proposals or completed encodings, unresolved constraints, evidence, and review limits. Do not claim all comments are unnecessary merely because they are comments.
