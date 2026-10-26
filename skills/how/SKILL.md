---
name: how
description: Use for code walkthroughs, runtime data flow, subsystem behavior, and placement or ownership questions. Use why for historical motivation.
---

# How

Adapted from pstack. Read the [runtime contract](../simplicit/references/runtime.md). Explain how the system works from observed source and execution, with enough structure to change or review it safely. This is read-only unless the user separately authorizes changes.

1. Interpret the target from the question and current context. State a consequential assumption briefly and investigate; do not require onboarding questions for facts the repository can answer.
2. For a narrow utility or flow, investigate directly. Follow entrypoints, inputs, transformations, state owners, boundaries, and outputs. Read actual consumers and tests rather than summarizing names from search results.
3. For a large subsystem, divide by independent questions only if bounded explorers will help. Use the [explorer brief](references/explorer-prompt.md). The lead synthesizes; no obligatory explainer agent or panel. Helpers return file evidence and gaps without edits.
4. Walk one representative request or user action end to end. Distinguish synchronous work, deferred work, persistence, cancellation, and failure paths where relevant. Verify uncertain behavior with a safe existing check when possible.
5. Explain the mechanism with source locations. Use overview, key concepts, flow, ownership map, and gotchas only as needed. A small question can have a small answer. State unexecuted runtime assumptions rather than pretending code reading proves them.

Do not infer original motivation from present behavior; use [why](../why/SKILL.md) when that distinction matters. Return the explanation, not a report about having explored.
