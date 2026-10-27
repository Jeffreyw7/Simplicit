---
name: principle-redesign-from-first-principles
description: "Apply when integrating a new requirement into an existing design."
---

Read and follow the [runtime contract](../simplicit/references/runtime.md) before using this skill. It governs scope, tools, authorization, verification, and review.

# Redesign From First Principles

When integrating a change, don't bolt it onto the existing design. Redesign as if the requirement had been a foundational assumption from the start.

- Read the relevant affected files and understand the current design within the task boundary
- Ask: "if we were writing this from scratch with this new requirement, what would we build?"
- Propagate the authorized change through affected types, docs, examples, and rationale. Report necessary work outside the boundary.
- Think about the whole redesign, then deliver it incrementally

This is the method for preserving option value when integrating changes into an existing design.
