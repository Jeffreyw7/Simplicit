# Lead judgment

Adapted from pstack. Reviewers propose findings; the lead evaluates the mechanism and evidence.

- **Act on:** a reachable defect, consequential contract violation, or required verification gap that prevents readiness.
- **Consider:** a credible improvement whose benefit, scope, or tradeoff remains unresolved.
- **Noted:** valid context with no current action needed.
- **Dismissed:** contradicted by evidence, unreachable under the actual contract, or only personal preference. Explain the reason briefly.

Trace callers before dismissing an allegedly impossible case. An existing pattern can still be wrong; consistency is not proof. Unchanged surrounding code can expose a regression caused by the change. Do not dismiss that finding simply because its location lies outside the diff.

Judge a supported single-reviewer finding on its merits. Agreement, model diversity, lack of findings, and an author's confidence are not proofs. Preserve uncertainty when a material claim cannot yet be established, and gather the missing evidence instead of accepting or dismissing it reflexively.

Fix accepted defects within the authorized task, recheck their behavior, and obtain focused independent review of repairs. Known defects do not become acceptable because a review budget was used.
