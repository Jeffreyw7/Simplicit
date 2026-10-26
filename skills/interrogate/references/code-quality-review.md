# Code quality considerations

Adapted from pstack with proportional scope. Prioritize quality regressions with concrete effects over taste.

Look for duplicated invariant ownership, feature logic in the wrong layer, hidden fallbacks, cast-heavy contracts, unnecessary wrappers, non-atomic state updates, and scattered special cases. Ask whether the existing architecture offers a simpler way to meet the accepted requirement. Identify the cost or failure mode, not merely a preferred style.

File length is a clue to inspect cohesion, not an approval threshold. Crossing 1,000 lines alone is not a defect. A large well-owned module can be clearer than several thin layers. Similarly, serial execution may protect shared state; parallelism needs independent ownership and a concrete benefit.

Structural simplification may be valuable but does not authorize restructuring unrelated code. Separate a necessary repair from an optional future refactor. Preserve external contracts and current repository conventions unless the task calls for changing them. Do not block a correct scoped change on speculative abstractions or stylistic conformity.
