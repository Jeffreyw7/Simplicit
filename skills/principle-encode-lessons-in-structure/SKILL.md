---
name: principle-encode-lessons-in-structure
description: "Apply when you catch yourself writing the same instruction a second time, or notice a recurring correction. Encode the rule as a lint, metadata flag, runtime check, or script instead of more text."
---

Read and follow the [runtime contract](../simplicit/references/runtime.md) before using this skill. It governs scope, tools, authorization, verification, and review.

# Encode Lessons in Structure

When the same instruction or correction recurs, ask whether a lint rule, metadata flag, runtime check, or small script can enforce it. Prefer a mechanism that detects the actual failure over another reminder. Keep the enforcement inside the authorized scope and verify that it catches the failure without rejecting valid work.

If the lesson needs judgment and cannot be encoded, make the instruction more prominent and add an example of the failure mode.

**Corollary:** If the fix is structural, only use the structural fix. The instruction is the symptom.
