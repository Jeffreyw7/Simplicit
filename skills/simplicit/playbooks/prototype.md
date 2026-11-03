Follow the [runtime contract](../references/runtime.md). This playbook supplies a workflow, not additional tools or authorization.

When candidate review is required, use the existing [Review playbook](review.md) and its linked reviewer contract. The workflow here does not replace those review gates.

# Prototype

Resolve an explicit design or empirical decision cheaply. The output is a decision and a throwaway artifact, not production-ready code.

1. Name the question: layout, interaction, density, behavior, timing, or approach. If there is no unresolved decision, route to [Change](change.md) rather than manufacturing alternatives. Preserve the user's scope and product choices.
2. When the direction is open, inspect relevant prior art and show a few useful themes or options. An explicit research request uses actual sources. Skip a moodboard or waiting checkpoint when existing context already establishes direction; obtain only consequential choices the user owns.
3. Build in an isolated writable scratch directory outside production source. Use the lightest supported stack or script that exercises the question. Do not install global tooling or depend on an unavailable CDN/service. Avoid production abstractions, broad test suites, and polish that do not help distinguish the options. Cheap code still must respect safety and data boundaries.
4. For visual alternatives, use one labeled switcher so the same viewport and state compare side by side. A behavioral/timing experiment should use comparable inputs and controlled conditions. Try small competing variations when the design space is genuinely unsettled, discarding poor alternatives early.
5. Inspect the actual behavior through an available matching driver. Capture each visual variant and drive its relevant interaction. For a timing or output question, measure the real operation and retain raw observations. A mockup cannot prove runtime integration; a screenshot cannot prove an interaction you did not drive. Label missing access and inconclusive outcomes.
6. Present the alternatives, their gains and costs, evidence, and a recommendation. Keep the scratch path and mark the output throwaway. If the user already authorized the real build, carry the chosen direction into Change or [Architect](../../architect/SKILL.md) as appropriate. Otherwise stop with the reviewable decision rather than promoting scratch code automatically.

Report the question resolved, variants explored, actual screenshots/output/timing, tradeoffs, recommendation, scratch artifact, and what remains unproved.
