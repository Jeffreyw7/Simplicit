---
name: blast-radius
description: Use to assess what a change can break beyond the diff, including downstream, wire, storage, dependency, and lifecycle contracts.
---

# Blast radius

Adapted from pstack. Read the [runtime contract](../simplicit/references/runtime.md). This is a read-only risk investigation unless changes are separately authorized.

1. Read the full candidate and relevant history. Identify changed behavior, deleted or added symbols, and consequences the diff does not spell out. Use [why](../why/SKILL.md) only for unresolved historical constraints.
2. Identify the load-bearing facts on which safety depends. There may be several; do not force every change into one safety claim.
3. Follow what symbol search misses: pinned library versions and local patches, JSON and wire formats, stored schemas, cross-language readers, feature flags, teardown, async timing, retries, and consumers multiple steps downstream. Cite actual callers or contracts; do not invent them.
4. For each material risk, trace reachability and impact. Distinguish confirmed risks, cleared cases, and unresolved assumptions. A missing search result is evidence about that search, not proof that no consumer exists.
5. Prove load-bearing runtime safety facts by running a practical script or test against the actual implementation/dependency, or reproducing them in the app. Source evidence and traced reachability guide that probe but do not replace executable proof of a runtime-dependent fact. If safe execution is unavailable or impractical, mark that fact unproven and give the exact completion step; do not clear it from source reasoning alone. Static evidence may establish purely static facts. Use existing diagnostics or isolated scratch outputs in read-only work. Inspect side effects; do not change live data to prove a point.
6. Add a bounded specialist only for a named cross-system uncertainty. A wide diff alone does not require several models or duplicate reviews.

Return what changed, safety facts and their evidence level, confirmed risks, cases checked and cleared, and outstanding checks. Keep source reasoning, executed code, and live-app proof distinct.
