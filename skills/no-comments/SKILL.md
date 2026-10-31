---
name: no-comments
description: "Use when asked to remove unnecessary comments or review comment-backed workarounds in a specified set of files or diff."
---

Read and follow the [runtime contract](../simplicit/references/runtime.md) before using this skill. It governs scope, tools, authorization, verification, and review.

# No comments

Prefer code that explains itself while preserving useful contracts and externally imposed constraints. Use the caller's files or diff. Otherwise identify the actual base and current diff, including working-tree changes; do not assume `main` exists. An audit stays read-only; a cleanup request permits scoped edits.

## Dispatch Comment Sicko

Read the [Comment Sicko reviewer brief](references/comment-review.md). For this comment-specific pass, use the available `comment-sicko` role through the host's supported delegation interface. The general candidate-review preference for `critic` does not replace this specialist. Keep any valid completed Comment Sicko review whose candidate and relevant inputs are unchanged.

Give the reviewer the exact files or diff, actual base/current revision and relevant dirty state, the absolute path to the installed reviewer brief, applicable repository constraints, and permission for read-only inspection only. Do not supply expected findings. Comment Sicko returns proposals; the lead owns all edits and triage. If already assigned as Comment Sicko, perform that bounded review directly without spawning another reviewer or restarting this dispatcher.

When the named role is unavailable and independent delegation is permitted, launch a generic independent helper with the same Comment Sicko brief. Disclose that the brief ran through a generic helper; do not claim native role loading. If no independent helper is available, useful self-inspection may continue, but mark the Comment Sicko pass pending. Do not silently substitute a lead-authored review for the requested reviewer.

## Triage and apply within scope

Inspect every finding against nearby code. Reject scope escapes, unsupported claims, removal of an exception without evidence, and edits made by a read-only reviewer. A `MUST KILL` finding names the exact internal symbol or correctness suppression and its supported root cause; it is a triage label, not permission to delete useful code. Check missed lint and TypeScript suppressions. Investigate uncertain claims with [How](../how/SKILL.md) or [Why](../why/SKILL.md); ambiguity is not proof that a constraint is false. Return a materially invalid report for one focused correction; if it remains invalid, report the pass pending with the unresolved reason.

For an authorized cleanup, delete redundant narration or dead commented code. Fix a trivial accepted root cause directly. If a nontrivial shape is needed, use [Architect](../architect/SKILL.md) once for the scoped accepted set, then implement the smallest supported fix. Removing a safety suppression requires resolving and verifying the underlying error, not just deleting the line. Report out-of-scope causes instead of widening the fence.

For comments that say do not remove, do not change wording, or consult someone, verify the current reason. Preserve a supported external contract. For internal invariants, propose the cheapest type, test, runtime check, or lint that could enforce the claim. Apply an encoding when authorized and verified before removing its only documentation. Otherwise leave the unresolved constraint visible and report it.

Review the diff and run relevant checks. Comment Sicko's scoped pass does not replace the independent candidate review required for meaningful application-code fixes. Report reviewer identity and native-role versus generic-helper execution, files, proposed and actual deletion counts separately, restored comments, accepted fixes, encoding proposals or completed encodings, unresolved constraints, evidence, and review limits. Do not claim all comments are unnecessary merely because they are comments.
