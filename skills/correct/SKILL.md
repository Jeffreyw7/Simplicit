---
name: correct
description: Use when asked to prevent recurring repository mistakes with structural safeguards, types, lint checks, or meaningful regression coverage.
---

# Correct

Adapted from pstack. Read the [runtime contract](../simplicit/references/runtime.md). Turn an evidenced recurring mistake into a safeguard within the authorized scope. A correction is not automatic permission for a broad refactor, commits, or new global rules.

1. Inspect relevant corrections, reverts, reviews, code, and tests. Group repeated failures by cause. Count a recurring class when there are at least two evidenced instances; distinguish one-off defects from a demonstrated pattern.
2. Choose the highest useful enforcement level: remove the invalid path through architecture; make invalid states unrepresentable with types; add a targeted lint/CI check with an actionable error; then test observable behavior. Use prose only for decisions that cannot sensibly be enforced. Prefer existing infrastructure over a new subsystem.
3. Explain why the chosen level fits and whether a stronger change exceeds scope or compatibility constraints. Report broader work separately instead of silently doing it. Do not delete compatibility paths whose consumers still require them.
4. Prove the check rejects a real past failure or a faithful safe reproduction, then that the valid case passes. Keep the experiment isolated; never reintroduce a real production incident. Confirm the same check can run in its intended local/CI context or state the gap.
5. Keep project instructions short. If a rule already has structural enforcement, reference that check rather than duplicating a long rule table. Follow existing exception policy; do not invent a blanket approval ritual. Meaningful changes receive the normal independent review.

Return the mistake evidence, selected safeguard, scope tradeoff, failing-before/passing-after checks, and unresolved limits. In an advice-only request, propose the safeguard without editing.
