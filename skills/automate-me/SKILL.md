---
name: automate-me
description: "Use when the user wants to capture or update their recurring working preferences in a personal mode skill, rather than a task-specific workflow."
---

Read and follow the [runtime contract](../simplicit/references/runtime.md) before using this skill. It governs scope, tools, authorization, verification, and review.

# Automate me

Turn the user's repeated working conventions into one concise personal `-mode` skill.

1. Look for an existing mode skill in the active repository's discoverable skill directories and any personal directory the host actually exposes. Preserve its destination and unrelated rules. If the user requested an update, update it. Do not replace a conflicting personal mode without resolving the intent.
2. Use the current conversation and any explicitly available, workspace-scoped history. Never infer a transcript path, search unrelated projects, or claim access to private history. On updates, prefer evidence since the last edit. If history is unavailable, state that limitation and work from the user's stated preferences.
3. Hunt recurring signals: response length and tone, autonomy, delegation, verification, code and prose conventions, and delivery. Cross-check multiple incidents before treating an inferred habit as a rule. Explicit user preferences can stand on their own; contradictory examples need clarification. Evidence seen only once stays tentative.
4. Ask one or two focused questions about consequential gaps, using a structured question tool if available. Do not turn the task into a questionnaire when the existing evidence is enough.
5. Cluster only non-default rules into sections such as response style, autonomy, understanding, review, or process. Use the [Simplicit entrypoint](../simplicit/SKILL.md) for granularity, not as content to copy. Preserve the user's actual authorization boundaries and model choices.
6. Use the host's skill-creator guidance if available. Draft a project-local skill unless the user selected a personal destination. Trigger its description on the user's chosen identifier and requests to work in that style, not generic coding. Keep automatic discovery enabled unless the user explicitly requests explicit-only invocation. Use `$<handle>-mode` for invocation.
7. Apply [Unslop](../unslop/SKILL.md), show the concrete draft, and incorporate feedback. Check the name, description, resources, and local links with an available validator. A subjective mode needs the user's fit judgment; description optimization is useful only after a demonstrated routing problem.

Reference other available skills instead of copying their contents. Do not edit plugin caches, install globally, commit, push, or create a PR unless that action is already authorized. For a narrow workflow, author an ordinary task skill instead of a personal mode.
