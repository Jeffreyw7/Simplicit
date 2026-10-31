Follow the [runtime contract](../references/runtime.md). This playbook supplies a workflow, not additional tools or authorization.

When candidate review is required, use the existing [Review playbook](review.md) and its linked reviewer contract. The workflow here does not replace those review gates.

# Hillclimb

Improve one measurable thing through one hypothesis, one comparable measurement, and keep or revert. Correctness and simplicity outrank the number. The lead normally implements; selective independent help is optional.

1. Ground the real workload with [How](../../how/SKILL.md), including data size, history, state, concurrency, and the user's symptom. Reproduce the complaint before optimizing. Fix one metric, unit, improvement direction, target, and any user-agreed minimum-attempt floor. Do not invent a large iteration quota. Make the stop predicate checkable and use the user's numbers when given.
2. Build a sensitive rerunnable harness before treatment. Show that contrasting realistic workloads separate as expected and the target workload reproduces the symptom. Vet the harness with [Benchmark checklist](../../benchmark-checklist/SKILL.md), including tuning, repeated/interleaved samples, limiter, work counts, and errors. Freeze the command, inputs, metric, and interpretation after validation. Record baseline variation and a passing initial regression gate.
3. Keep [Show me your work](../../show-me-your-work/SKILL.md)'s canonical decision trail. For each attempt put an id, hypothesis, mechanism, before/after/delta, regression outcome, and kept/reverted verdict in its row or a linked measurement record. Read the recent trail before another attempt so a rejected idea is not repeated without new evidence.
4. Ground hypotheses in the architecture and observed limiter, not generic suggestions such as try memoization. For performance, use the cost-removal order in [Performance issue](perf-issue.md). Choose one change at a time. Independent competing attempts need separate owned candidates and a common unchanged harness; integrate only evidence-backed winners.
5. Measure before and after with the frozen harness, then run the regression gate. Accept an improvement only when it exceeds noise and preserves behavior. Revert the whole attempt otherwise, preserving unrelated work. A useful simplification can stay when the metric is equivalent and acceptance allows it; record it as a simplification, not a speedup. Check each unit before the next. Commit only within authorization.
6. A series of rejects earns a deliberate pivot: challenge the premise, profile again, change hypothesis category, or inspect an untested mechanism. Do not alter the frozen workload or metric to manufacture gains. If the harness is defective, correct it as its own unit, explain the invalidation, and recapture comparable baseline evidence.
7. Stop at the predicate, justified diminishing returns relative to the agreed budget, a genuine dependent gate, or an evidenced dead end. Do not relax the target or silently ignore an agreed attempt floor. A plateau alone is not proof no useful work remains. [Autonomous run](autonomous-run.md) supplies supported continuation, not a different stop rule.
8. Verify the final integrated candidate and complete independent review. Use [Opening a PR](opening-a-pr.md) only for authorized delivery.

Report metric/target, baseline to final with units and comparable percent delta, attempts kept and reverted, accepted mechanisms, trail and raw evidence, regression/review state, unmet predicate, and best next hypothesis.
