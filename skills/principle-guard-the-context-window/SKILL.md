---
name: principle-guard-the-context-window
description: "Use when large outputs, long files, repeated reads, or task decomposition threaten available context."
---

Read and follow the [runtime contract](../simplicit/references/runtime.md) before using this skill. It governs scope, tools, authorization, verification, and review.

# Guard the Context Window

**Why:** Context overflow degrades reasoning quality, creates compression artifacts, and halts progress.

**Pattern:**
- **Size phases and cap scope.** Limit files per phase, set turn budgets, account for mechanism costs.

- Search first, read bounded relevant regions, and keep evidence pointers with compact summaries. Route bulk to an authorized helper only when the host supports it and the bounded task benefits from delegation. Otherwise process it in slices yourself.
- Preserve goals, decisions, unresolved questions, and verification state before compaction. Do not discard failure evidence to make the summary look clean.
