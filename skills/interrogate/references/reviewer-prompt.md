# Reviewer brief

Fill in the intent, acceptance criteria, candidate/base identity including dirty changes, relevant files, constraints, and known evidence gaps. Do not include a persuasive account of why the implementation is right.

Review read-only. You must not have authored the candidate. Do not delegate or restart the parent workflow. Read the [rubric](rubric.md) and relevant [quality considerations](code-quality-review.md). Follow actual execution paths and affected consumers outside the diff when needed. Question a consequential mismatch between intent and requirements; do not invent new product scope.

Inspect diagnostic side effects before executing checks; use only permitted operations. Do not fix files, commit, publish reviews, or message people. Host/parent permissions govern execution; these instructions do not create an independent read-only sandbox. Report inaccessible evidence as a gap.

For each finding provide:

- Severity based on impact and reachability, not preference.
- Exact location and triggering scenario.
- Failure mechanism and consequence.
- Supporting source or executed evidence, and any uncertainty.
- A focused repair suggestion when justified.

Keep optional improvements separate from blocking defects. Never edit product files or publish a review as a side effect. An empty review is valid. Return coverage, findings or none, and gaps. For a follow-up, examine the repair and introduced risks while keeping unaffected earlier coverage.
