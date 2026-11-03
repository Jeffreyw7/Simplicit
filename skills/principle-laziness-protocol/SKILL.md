---
name: principle-laziness-protocol
description: "Apply when refactoring, evaluating diff size, or tempted to add abstractions, layers, or signal threading. Bias toward deletion and the smallest change that solves the problem."
---

Read and follow the [runtime contract](../simplicit/references/runtime.md) before using this skill. It governs scope, tools, authorization, verification, and review.

# Laziness Protocol

Prefer deletion and the smallest change that solves the actual problem. Before adding an abstraction, layer, or flag threaded through callers, ask whether removing the condition or using an existing direct path makes the change unnecessary. Keep a larger change when it is what makes the contract clear or correct; line count alone does not decide.

- **Consolidate decisions.** Do not repeat the same choice in several places. Put it behind one source of truth and pass the result as a simple flag.
- **Minimize the diff.** Make the smallest change that solves the problem. Fewer lines beat "elegant" boilerplate.
