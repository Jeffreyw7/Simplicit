---
name: setup-simplicit
description: "Use when asked to configure Simplicit's available runtime capabilities, delegation preferences, or per-role model budget for this project."
---

Read and follow the [runtime contract](../simplicit/references/runtime.md) before using this skill. It governs scope, tools, authorization, verification, and review.

# Setup Simplicit

Adapt Simplicit to this host without inventing model configuration APIs. Inherit the lead's model by default.

1. Inspect the current project's instructions and existing Simplicit configuration. Discover actual shell, connector, browser, planning, and collaboration capabilities. A tool's documented available options are evidence; familiar provider names are not. Do not read credentials or enumerate unrelated personal projects.
2. Identify what the user asked to change: verification access, review availability, permitted delegation, or role preferences. Preserve unrelated settings. For a missing preference that materially changes cost, offer a concise choice such as minimal, balanced, or thorough, explaining the difference in checks or authorized helper work. A preference cannot raise tool or permission limits.
3. Show the proposed role table: implementation, difficult debugging, explanation and prose, investigation, independent review, and comparison panels when relevant. Use inherit unless an exposed host option and the user's request justify an alternative. Model choice, effort, and speed are separate host capabilities, not tokens to append to a guessed model slug. Panel size is bounded by the runtime contract; a role list is not permission to spawn a panel.
4. Validate every selected option against the host's actual supported options. If models cannot be enumerated, retain inherit and report that explicit alternatives are unverified. When the host lacks a role configuration API, store only documented workflow preferences in the user-selected project instruction destination, such as a clearly delimited section in `AGENTS.md`. Say that this guides future work and does not change the active model or guarantee host enforcement.
5. Apply only requested configuration in the selected repository. Preserve existing instructions and unrelated files; do not overwrite a whole global rule file, install globally, modify a plugin cache, or claim a setting became active without checking. Re-running should reconcile the owned section rather than duplicate it. Re-read the result and report what changed, where, and which capabilities remain unavailable.

If the project lacks real-product verification, mention [Create verification skill](../create-verification-skill/SKILL.md) as an optional follow-up. For a property that would benefit from a model checker or proof, mention [Create formal verification skill](../create-formal-verification-skill/SKILL.md). Neither optional suggestion authorizes installation or a new project.
