# Simplicit

A personal development workflow built from [pstack](https://github.com/cursor/plugins/tree/main/pstack), adapted for Codex and selected repositories.

One lead investigates, plans, implements, verifies, obtains independent review, repairs findings, and prepares a handoff. Specialists resolve bounded questions. The user controls merging and releasing.

## Use the workflow

```text
$simplicit Fix the duplicate-request bug using the current feature contract.
Verify the result and prepare a reviewable change.
```

[Simplicit](skills/simplicit/SKILL.md) is the main entrypoint. `$simplicit-mode` remains a compatibility alias; `$simplicit-help` explains the catalog. The naming follows [Jimmy](https://github.com/ja153903/jimmy/tree/2bb05bcd288f60a9b435ddd156dabb8d88fafe80/plugins/adapters/common/skills): a short main command, a mode alias, a help entry, and unchanged specialist names.

| Task | Default |
|---|---|
| Mechanical edit | Lead, applicable checks, self-review. |
| Meaningful feature, fix, or refactor | Lead implements; one independent candidate review and focused review of repairs. |
| Consequential design uncertainty | Explicit invariants and contracts; a bounded specialist when needed. |
| Explanation or review only | Read-only answer or findings. |

Start with one optional specialist at a time. Expand for independent work that earns its cost. Keep one active Draft PR by default unless the project or user specifies another convention. Reuse valid review and test evidence after checking all relevant inputs, including dirty changes, dependencies, configuration, generated artifacts, and runtime state.

## Pstack specialists on Codex

The workflow now reads the actual adapted specialist instructions, not only condensed principles. You can also invoke them directly in Codex:

| Skill | Job |
|---|---|
| [architect](skills/architect/SKILL.md) | Usage-first design, ownership, types, and tradeoffs. |
| [how](skills/how/SKILL.md) / [why](skills/why/SKILL.md) | Runtime mechanisms / historical rationale with evidence. |
| [interrogate](skills/interrogate/SKILL.md) | Independent review and judgment of findings. |
| [tdd](skills/tdd/SKILL.md) | Practical failing-before and passing-after regression checks. |
| [blast-radius](skills/blast-radius/SKILL.md) | Downstream, storage, wire, dependency, and lifecycle risks. |
| [teach](skills/teach/SKILL.md) | Clear explanations that preserve uncertainty. |
| [correct](skills/correct/SKILL.md) | Structural prevention of evidenced recurring mistakes. |
| [arena](skills/arena/SKILL.md) / [swarm](skills/swarm/SKILL.md) | Conditional alternative comparison / bounded independent work. |
| [create-verification-skill](skills/create-verification-skill/SKILL.md) | Author project-specific instructions for real runtime verification. |
| [maintain-verification-skill](skills/maintain-verification-skill/SKILL.md) | Audit those instructions against source and live behavior. |

Loading a skill does not automatically spawn an agent. These adaptations use available host tools and models. They do not require Cursor settings, a fixed model roster, or the upstream orchestrators.

## Adopt in a selected repository

Adopt these two components separately in a chosen repository:

| Source in Simplicit | Destination in the selected repository |
|---|---|
| Entire `skills/` collection | `.agents/skills/` |
| `.codex/agents/critic.toml` | `.codex/agents/critic.toml` |

Both are needed for this specific custom critic. Skills-only adoption still uses the documented generic independent-reviewer fallback when permitted; without an independent execution path, review stays pending. Keep every sibling skill, reference, and license together. Do not copy the original `pstack/` tree as active skills.

1. Inventory existing destination skill folders and agent files first. Generic names such as `architect`, `tdd`, or `critic` may already exist. Check destination paths for symlinks or redirection before writing.
2. Keep identical content and preserve unrelated skills. If ownership or replacement authorization is unclear, stop before overwriting and choose explicitly which version to retain. Do not silently skip a required sibling.
3. For a known prior Simplicit installation, compare and preserve local customizations before an authorized upgrade. Preserve unrelated skills, agents, and `AGENTS.md`; do not replace entire destination directories.
4. Copy the approved collection and critic, then run both validators from this source checkout against the destination paths below. These checks do not authorize overwriting collisions.
5. Start a supported, fresh authenticated Codex session in the selected repository. Confirm `$simplicit` resolves to the intended `.agents/skills/simplicit/SKILL.md` and that the host exposes the custom `critic` role through its supported delegation interface. A copied file or successful parser check is not evidence of native discovery.
6. Confirm the configured model and effort are available to that session and actually execute a bounded read-only review. Record discovery, model execution, and behavioral results separately. If a required capability is missing, use the permitted fallback or report the remaining requirement pending; do not install or upgrade clients silently.

```text
<selected-repository>/.agents/skills/
    simplicit/
    simplicit-mode/
    simplicit-help/
    architect/
    ...the other specialist folders...
<selected-repository>/.codex/agents/critic.toml
```

**Migration:** the old release supported copying only `simplicit-mode/`. This release requires the complete collection. Its alias points to the sibling `simplicit/` entrypoint; old playbooks should not be used as a fallback. Compare any locally customized old playbooks before retiring them.

Codex CLI and IDE support explicit `$skill-name` invocation and automatic selection from descriptions. Local repository discovery uses `.agents/skills`; restart if changes do not appear. If another installed package exposes the same name, select the intended path rather than assuming the names merge. See [OpenAI's skill documentation](https://learn.chatgpt.com/docs/build-skills).

This repository stores reusable source. It does not install skills into other projects or user-wide locations. No installer, service, marketplace, or global configuration is required.

The critic deliberately pins `gpt-6.1-sol` with `high` reasoning. These are project choices, not universally available defaults. Effective permissions come from the host/parent; the critic's no-edit instructions do not enforce an independent read-only sandbox. Current [OpenAI custom-agent documentation](https://learn.chatgpt.com/docs/agent-configuration/subagents) describes project-scoped TOML roles and inherited permissions. Check your installed client's capabilities. If the pinned model cannot run, report it once, disclose any permitted generic-reviewer fallback, and leave an explicitly required model-specific review unmet. Do not duplicate an otherwise valid completed review just for the role name.

After adoption, this is a complete starting prompt for a repository with a duplicate-request defect:

```text
$simplicit Fix the duplicate-request bug in this repository's in-memory ledger.
Acceptance: retrying the same request ID with the same positive amount credits
once; distinct IDs still add; negative amounts remain rejected. Inspect the
current contract and preserve existing edits. Local edits, isolated fixtures,
tests, and internal independent review are authorized. Continue through
investigation, implementation, executed checks, one independent review,
supported repairs, and final verification in this chat. Prefer the available
critic; a generic independent reviewer is permitted if it is unavailable.
Report actual evidence and remaining gaps. Leave a reviewable local diff.
Do not commit, push, create a PR, merge, deploy, or send external messages.
```

One prompt authorizes the stated work, not extra permissions or a guarantee against host interruptions. Ordinary stage transitions do not need another "continue". Missing product decisions, authorization, genuine access/capability blockers, and execution/context limits can require a precise handoff. Plan-only, review-only, and investigation-only requests retain their boundaries. Commit/push/PR work needs separate applicable authorization; keep one active Draft PR by default when that work is authorized.

## Validate the collection

Use Python 3.11 or later (`python3` on systems where that is the command). The agent validator uses the standard library's real TOML parser, `tomllib`; no dependencies are installed. CI uses Python 3.11 on Linux and Windows:

```sh
python -B -m unittest discover -s scripts -p 'test_*.py'
python -B scripts/validate_skills.py
python -B scripts/validate_agents.py
python -B scripts/validate_skills.py /path/to/copied/.agents/skills
python -B scripts/validate_agents.py /path/to/copied/.codex/agents
```

Run validators from this source checkout. The skill validator retains its source-selected destination semantics and checks simple flat frontmatter, licenses, and inline Markdown resource links. It is not a general Markdown parser.

The agent validator checks the source inventory (which must include `critic.toml`) and those same filenames at an optional destination, leaving unrelated destination profiles alone. Simplicit's narrow profile policy allows only nonempty strings for `name`, `description`, `developer_instructions`, and optional `model`, `model_reasoning_effort`, `model_reasoning_summary`, and `model_verbosity`. Names must match lowercase kebab-case filenames; duplicate names and paths escaping the selected directory fail. All other fields, including permission, sandbox, approval, provider, MCP, feature, and skill overrides, are rejected under this package policy. This is deliberately narrower than the host's full schema; it prevents implying separate permissions. It does not test model names/effort support against an account or claim native discovery or runtime correctness.

Both validators only read inputs and never call models. The [CI workflow](.github/workflows/validate.yml) runs unit tests and both validators with read-only repository permissions; it does not install this workflow into projects. A workflow file does not prove hosted CI passed. [Validation evidence](docs/validation.md) separates parser checks, CI, native discovery, and executed behavior, with reproduction instructions and remaining limits.

## Source and limits

[pstack/](pstack/) preserves the original 200-file snapshot and MIT license. [UPSTREAM.md](UPSTREAM.md) maps the supported adaptations. The remaining upstream skills and scripts are source-only here, including `statechart` formal model checking, transcript mining, platform setup, orchestrators, and shipping automations. They have not been ported by this collection.

The [simplicit-agent brief](skills/simplicit/references/simplicit-agent.md) is a worker template, not a registered Codex role. Helper cleanup uses available lifecycle tools. If deletion is unsupported, report completed/inactive status and that records were not deleted. Instructions guide behavior and do not enforce permissions.

No token or speed savings are claimed. Assess those through comparable project trials that include review, repairs, delegates, and verification.
