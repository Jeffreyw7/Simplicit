---
name: principle-migrate-callers-then-delete-legacy-apis
description: "Apply when introducing a new internal API while old callers still exist. Migrate callers and delete the old API in the same wave instead of preserving compatibility layers."
---

Read and follow the [runtime contract](../simplicit/references/runtime.md) before using this skill. It governs scope, tools, authorization, verification, and review.

# Migrate Callers Then Delete Legacy APIs

When all affected callers are internal and within the authorized migration, move them to the new contract and remove the old API in the same verified wave. Inventory callers first, including tests, generated integrations, examples, and dynamic uses. Prove the old path has no required consumer before deletion. Preserve a compatibility plan when external consumers or release boundaries require one.

- Update tests to assert the new contract, and delete tests that only protect pre-refactor implementation details

**When this applies:**
- No external users depend on backward compatibility
- The project can absorb coordinated breaking changes
- The new API is part of a simplification or refactor initiative
