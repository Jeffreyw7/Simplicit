---
name: simplicit-help
description: Use to explain Simplicit commands, supported pstack skills, installation dependencies, and Codex capability limits.
---

# Simplicit help

Read the [runtime contract](../simplicit/references/runtime.md). Explain only the requested part of the collection.

Use `$simplicit` for the lead workflow. `$simplicit-mode` remains an alias. The [main routing table](../simplicit/SKILL.md) selects the playbook; the [complete catalog](../simplicit/references/catalog.md) lists all 62 installed skills, covering every entrypoint in the pinned pstack source. In Codex CLI or IDE, invoke a specialist directly, for example `$architect`, `$statechart`, `$recall`, or `$triage-issue-reports`. Use `$setup-simplicit` for host capabilities and model preferences. On a host without skill selectors, explicitly read its `SKILL.md` and follow it with the available tools.

The collection uses progressive loading: select the relevant specialist, then its necessary references. Reading a skill is not the same as spawning a helper. Meaningful changes still require independent review; a review-only request does not authorize repairs.

Install the whole collection together under a selected repository's `.agents/skills/`. These skills share sibling dependencies. Inventory existing same-name skills first, retain identical files, preserve unrelated skills, and resolve ownership or replacement authorization before overwriting. Do not silently omit a dependency. A previous single-folder `simplicit-mode` installation needs the complete collection to upgrade; preserve local customizations before replacing it.

The unchanged `pstack/` import is provenance, not an execution fallback. The adapters live entirely inside this collection. Formal checking uses the [statechart runtime setup](../statechart/references/runtime.md); video, transcript access, webhook delivery and scheduling depend on actual available services. A missing capability is reported explicitly, with useful local work preserved. The portable orchestration and shipping playbooks replace upstream host machinery; they do not install a daemon or grant merge authority. `simplicit-agent` remains a briefing template, not a registered role. Model selection and helper lifecycle depend on the host; completed helpers are not necessarily deletable.
