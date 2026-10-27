---
name: technical-writing
description: "Use when writing or reviewing developer documentation, RFCs, readmes, PR descriptions, or commit messages; use product copy guidance for UI strings."
---

Read and follow the [runtime contract](../simplicit/references/runtime.md) before using this skill. It governs scope, tools, authorization, verification, and review.

# Technical writing

Write so a tired engineer understands on the first read. Read the [layered writing guide](references/writing-guide.md) when drafting or reviewing substantial technical prose.

Choose the document's purpose first: tutorial for learning by doing, how-to for solving a task, reference for lookup, or explanation for understanding why. Separate major mixed purposes with links when useful, while respecting an existing repository format.

Use real symbols, paths, flags, and commands. Put conditions before actions, keep actors clear, and use the same word for the same thing. Match the audience and repository style. The guide's sentence lengths and punctuation rules are editing aids; clarity and the user's chosen voice take priority.

Apply [Unslop](../unslop/SKILL.md) for filler and AI patterns. Verify technical claims against the actual code or evidence. A PR description should explain the problem, resulting behavior, and relevant validation, linking large artifacts. Never claim to have run a procedure you only edited.
