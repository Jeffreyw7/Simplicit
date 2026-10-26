---
name: interrogate
description: Use for an independent candidate review, adversarial design challenge, or a requested review of code and its affected contracts.
---

# Interrogate

Adapted from pstack. Read the [runtime contract](../simplicit/references/runtime.md). Review independently, then judge findings by evidence. Do not auto-apply changes in a review-only task.

1. **Scope the candidate.** Establish intent, acceptance criteria, base, current revision, and relevant staged, unstaged, and untracked changes. Include configuration, dependency, generated-artifact, and runtime differences that affect the result. A base-to-HEAD diff alone omits dirty work. Gather relevant contracts and verification gaps.
2. **Check existing evidence.** Reuse a completed independent local or hosted review if it covers this candidate and risk. An author's self-review does not meet this requirement. If this invocation is itself an independent review assignment, perform it directly; do not spawn another reviewer.
3. **Review.** Otherwise obtain one independent reviewer who did not author the candidate, using the [reviewer brief](references/reviewer-prompt.md), [rubric](references/rubric.md), and relevant [code-quality considerations](references/code-quality-review.md). Supply intent and evidence, not conclusions to agree with. Follow affected callers, consumers, and tests beyond edited lines.
4. **Escalate conditionally.** Add a specialist for a distinct unresolved risk, an explicit multi-review request, or a repository requirement. Use actual available models. Same-model reviewers can be independent authors but are not model diversity. If no independent path exists, report review pending; useful self-inspection does not replace it.
5. **Judge.** Deduplicate by failure mechanism. Use [lead judgment](references/lead-judgment.md) to classify Act on, Consider, Noted, or Dismissed with reasons. A lone evidence-backed finding can block; multiple agreeing reviewers do not prove a defect or correctness.
6. **Resolve within scope.** In an authorized implementation workflow, the lead fixes supported defects and reruns affected checks. Independently review the repair and its introduced risks, retaining valid earlier coverage. Broaden only when coverage was invalidated. In review-only work, deliver findings and stop without edits.

Return the actual candidate reviewed, reviewer independence and coverage, findings with location/failure/impact/evidence, disposition, and missing checks. A clean review does not prove untested runtime behavior. Taste and arbitrary file-size thresholds are not blocking defects.
