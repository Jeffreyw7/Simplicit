Follow the [runtime contract](../references/runtime.md). This playbook supplies a workflow, not additional tools or authorization.

When candidate review is required, use the existing [Review playbook](review.md) and its linked reviewer contract. The workflow here does not replace those review gates.

# Authoring or modifying a skill

Own the skill's voice and keep its scope precise. Use the host's applicable skill-creator guidance when available; no particular editor's built-in authoring tool is required.

1. Establish the real task the skill should handle, existing discovery policy, destination, and resources. Read the existing skill and its callers before revising it. Preserve unrelated instructions and user preferences. A project-local draft is the default when no personal installation was requested; do not edit a plugin cache.
2. Write a discriminating name and description. Put essential behavior in the body, substantial conditional guidance in linked references, and repeatable mechanics in small portable helpers. Keep only prose that changes a decision. Link authoritative types, config, and repository documentation instead of repeating facts that drift. Use installed relative links and `$skill-name` invocation.
3. Preserve normal automatic discovery unless the user explicitly chose an explicit-only skill. Do not copy provider-specific tool names, model requirements, machine paths, or permissions from a source workflow.
4. Validate name and description, supported metadata, resource existence, sibling-link closure, and relocation. Run new or changed helpers on isolated fixtures, including actionable dependency failure. For a structural workflow, try a realistic invocation and inspect the output and relevant side effects. A prose-only subjective revision needs a fit review, not invented tests that assert its wording.
5. Apply [Technical writing](../../technical-writing/SKILL.md) and [Unslop](../../unslop/SKILL.md) as useful. Review substantive instruction changes independently under the runtime contract. If execution or review is unavailable, deliver the concrete draft and label the missing evidence.
6. Prepare authorized delivery through [Opening a PR](opening-a-pr.md). Skill authoring alone does not authorize global installation, commits, pushes, PR creation, or release. Propose a recurring uncaptured workflow only when it deserves its own bounded skill.

Report the skill and destination, the decisions that changed its behavior, validation and actual trial results, and any limitations.
