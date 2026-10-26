---
name: simplicit-help
description: Use to explain Simplicit commands, supported pstack skills, installation dependencies, and Codex capability limits.
---

# Simplicit help

Read the [runtime contract](../simplicit/references/runtime.md). Explain only the requested part of the collection.

Use `$simplicit` for the lead workflow. `$simplicit-mode` remains an alias. The [main routing table](../simplicit/SKILL.md) lists the 12 supported pstack specialist adaptations. In Codex CLI or IDE, a specialist can also be invoked directly, for example `$architect`, `$interrogate`, `$tdd`, or `$teach`. On a host without skill selectors, explicitly read its `SKILL.md` and follow it with the available tools.

The collection uses progressive loading: select the relevant specialist, then its necessary references. Reading a skill is not the same as spawning a helper. Meaningful changes still require independent review; a review-only request does not authorize repairs.

Install the whole collection together under a selected repository's `.agents/skills/`. These skills share sibling dependencies. Inventory existing same-name skills first, retain identical files, preserve unrelated skills, and resolve ownership or replacement authorization before overwriting. Do not silently omit a dependency. A previous single-folder `simplicit-mode` installation needs the complete collection to upgrade; preserve local customizations before replacing it.

The unchanged `pstack/` import is source material, not an active Codex package. Its other skills, formal model-checking scripts (`statechart`), transcript mining, platform setup, orchestrators, and shipping automations are not supported by this collection. Do not route to them as a fallback. `simplicit-agent` is a briefing template, not a registered host agent role. Model selection, runtime access, and helper lifecycle depend on actual host capabilities. Completed helpers are not necessarily deletable.
