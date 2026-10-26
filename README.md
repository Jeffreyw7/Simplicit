# Simplicit

A personal agentic development workflow built on [pstack](https://github.com/cursor/plugins/tree/main/pstack), adapted for Codex and use in selected repositories.

The lead investigates, normally implements, verifies, obtains independent review, repairs findings, and prepares the handoff. Helpers receive bounded work and finish when their results have been integrated. The user controls merging and releasing.

## Start here

Read [Simplicit mode](skills/simplicit-mode/SKILL.md). Its routes cover features and refactors, bug fixes, read-only investigations, and reviews. Resume checks and evidence reuse are part of the mode.

| Task | Default |
|---|---|
| Small mechanical edit | Lead, applicable checks, self-review. |
| Meaningful feature or fix | Lead implements; one independent candidate review, followed by focused repairs. |
| Consequential design or unresolved risk | Explicit invariants and contracts; a specialist only for a concrete need. |

The mode adapts pstack's playbooks and principles while using the tools and models the current host actually provides. It does not run the original mode's mandatory delegation, Cursor setup, or autonomous shipping procedures.

## Use in a selected repository

Copy the entire [skills/simplicit-mode](skills/simplicit-mode/) folder, including its playbooks, reference, and license, into the chosen repository:

```text
<repository>/.agents/skills/simplicit-mode/
    SKILL.md
    LICENSE
    playbooks/
    references/
```

Inspect an existing folder with that name before replacing it. Keep project contracts, commands, and acceptance requirements in that repository's existing documentation. The mode reads those sources.

Invoke it in Codex CLI or the IDE extension:

```text
$simplicit-mode Fix the duplicate-request bug using the current feature contract.
Verify the result and prepare a reviewable change.
```

Codex can also select it automatically when the request matches its description. Codex detects skill changes automatically; restart the session if the skill does not appear. See [OpenAI's skill documentation](https://learn.chatgpt.com/docs/build-skills).

Adopt it separately in each repository you select. The source folder here is not a user-wide installation. Copy only `skills/simplicit-mode`, not the full imported `pstack` tree, for this workflow.

## Source and boundaries

- [pstack/](pstack/) preserves the original 200-file source snapshot, including its MIT license.
- [UPSTREAM.md](UPSTREAM.md) records the exact revision, source mapping, and adaptation choices.
- [skills/simplicit-mode/](skills/simplicit-mode/) is the self-contained personal workflow.

The imported documentation describes the original Cursor/Claude environment. Upstream monorepo generators and other plugins are outside this import. They are not needed to use Simplicit mode. No installer, background service, global model configuration, or automatic upstream update is added.

Helper cleanup uses the host's available lifecycle tools. When deletion is unsupported, the agent reports that limitation rather than claiming records were removed. Instructions guide behavior and do not enforce permissions. Real repository trials are still needed to measure quality, time, and token usage; no measured savings are claimed.
