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

Copy the **entire `skills/` collection** into the chosen repository's `.agents/skills/`. Keep every sibling skill, reference, and license together. Do not copy the original `pstack/` tree as active skills.

1. Inventory existing destination names first. Generic names such as `architect` or `tdd` may already exist.
2. Keep identical content and preserve unrelated skills. If ownership or replacement authorization is unclear, stop before overwriting and choose explicitly which version to retain. Do not silently skip a required sibling.
3. For a known prior Simplicit installation, compare and preserve local customizations before an authorized upgrade.
4. Copy the collection, then run the validator against that destination. Start Codex in the selected repository and invoke `$simplicit`.

```text
<selected-repository>/.agents/skills/
    simplicit/
    simplicit-mode/
    simplicit-help/
    architect/
    ...the other specialist folders...
```

**Migration:** the old release supported copying only `simplicit-mode/`. This release requires the complete collection. Its alias points to the sibling `simplicit/` entrypoint; old playbooks should not be used as a fallback. Compare any locally customized old playbooks before retiring them.

Codex CLI and IDE support explicit `$skill-name` invocation and automatic selection from descriptions. Local repository discovery uses `.agents/skills`; restart if changes do not appear. If another installed package exposes the same name, select the intended path rather than assuming the names merge. See [OpenAI's skill documentation](https://learn.chatgpt.com/docs/build-skills).

This repository stores reusable source. It does not install skills into other projects or user-wide locations. No installer, service, marketplace, or global configuration is required.

## Validate the collection

Use Python 3.10 or later (`python3` on systems where that is the command):

```sh
python -B -m unittest discover -s scripts -p 'test_*.py'
python -B scripts/validate_skills.py
python -B scripts/validate_skills.py /path/to/copied/.agents/skills
```

Run the validator from this source checkout; it selects the skill names shipped here, leaving unrelated installed skills out of its checks. It checks simple flat frontmatter, licenses, and inline Markdown resource links. It is not a general Markdown parser, a native Codex discovery test, or proof of workflow behavior. [Validation evidence](docs/validation.md) records targeted trials and remaining limits.

## Source and limits

[pstack/](pstack/) preserves the original 200-file snapshot and MIT license. [UPSTREAM.md](UPSTREAM.md) maps the supported adaptations. The remaining upstream skills and scripts are source-only here, including `statechart` formal model checking, transcript mining, platform setup, orchestrators, and shipping automations. They have not been ported by this collection.

The [simplicit-agent brief](skills/simplicit/references/simplicit-agent.md) is a worker template, not a registered Codex role. Helper cleanup uses available lifecycle tools. If deletion is unsupported, report completed/inactive status and that records were not deleted. Instructions guide behavior and do not enforce permissions.

No token or speed savings are claimed. Assess those through comparable project trials that include review, repairs, delegates, and verification.
