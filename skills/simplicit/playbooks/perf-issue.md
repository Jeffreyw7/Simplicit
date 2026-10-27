Follow the [runtime contract](../references/runtime.md). This playbook supplies a workflow, not additional tools or authorization.

When candidate review is required, use the existing [Review playbook](review.md) and its linked reviewer contract. The workflow here does not replace those review gates.

# Performance issue

Tie a scoped fix to measurements on the same meaningful surface. Use Hillclimb for sustained search against one metric rather than a one-off repair.

1. Capture the baseline with an available driver/profiler for the actual user path. Name dataset, state, concurrency, versions, environment, and timed region. Preserve the raw trace and vet both baseline and later numbers with [Benchmark checklist](../../benchmark-checklist/SKILL.md). A wrong-surface or nonreproducing workload cannot establish the complaint.
2. Use [How](../../how/SKILL.md) to map observed cost to architecture. Do not claim a ceiling from source inspection. Order hypotheses by the cheapest way to remove the measured work:
   1. Stop work whose result is unused.
   2. Avoid doing it again.
   3. Do it less.
   4. Do it later.
   5. Move it away from the time the user waits.
   6. Run independent work concurrently.
   7. Make each operation cheaper.
3. Choose the earliest approach sufficient for the target, naming its concrete mechanism and correctness risks. Use [Architect](../../architect/SKILL.md) for consequential boundary/design uncertainty. The lead normally implements; a bounded helper needs authorized exclusive ownership.
4. Make one attempt, measure the post-change path with comparable conditions, and run regression checks before trying the next. Inspect parsed trace/profile data or query results, not an eyeballed headline. Revert your ineffective experimental changes instead of stacking speculative fixes. Independently review a meaningful accepted repair.
5. Confirm work/error counts, units, run variation, the limiter, and end-to-end relevance. A ratio requires the same metric and comparable scenario on both sides. If the feature did not exist before or the work differs, report absolute budgets and the end state the user waits for. Inconclusive and missing runtime remain explicit gaps.
6. Prepare authorized delivery through [Opening a PR](opening-a-pr.md), using one primary number and a link to full evidence. Stop when the scoped target is met, not after optional unrelated optimization.

Report baseline, after value, delta and units, comparison conditions, artifact paths, real work/error counts, mechanism, regression and review evidence, and unresolved measurement limits.
