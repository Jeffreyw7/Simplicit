# Simplicit

All skills from the pinned [pstack](https://github.com/cursor/plugins/tree/99b609a72323b70204eab407c622f436e858e112/pstack) snapshot, adapted for Codex.

The collection contains **62 Codex skills**: adaptations of all 58 top-level pstack skills and all three nested Benny skills, plus the existing `simplicit-mode` alias. All 23 upstream mode playbooks have portable routes. The [migration map](migration-map.json) makes coverage explicit.

One lead investigates, plans, implements, verifies and integrates. Specialists resolve bounded needs; meaningful changes receive independent review. The user controls merging, deployment and external messaging.

## Choose an installation

Use the plugin for a reusable collection managed by Codex, or the project-local
installer for a collection owned and reconciled inside one repository. Choose
one active copy per project to avoid duplicate skills.

### Repository-root plugin

This repository is both the plugin package and a local marketplace. No build
step is required. With a Codex CLI that supports `plugin` (tested: 0.165.0):

```sh
codex plugin marketplace add "/absolute/path/to/clean/Simplicit"
codex plugin add simplicit@simplicit --json
codex plugin marketplace list --json
codex plugin list --marketplace simplicit --json
```

Use a clean, dedicated checkout as the marketplace source. The tested host
copies the package directory, including files outside `skills/`; a working
checkout full of scratch files is a poor installation source. Only `./skills/`
is registered for discovery; the preserved `pstack/` archive stays inactive.
Registration and installation change the selected Codex configuration and
cache. They do not publish a listing or create an authentication service.

Start a fresh Codex session in your target project. Select the plugin's skill
by its actual installed path when names collide. Codex 0.165.0 exposes qualified
names such as `simplicit:simplicit`, `simplicit:simplicit-help`, and
`simplicit:no-comments`. For example:

```text
$simplicit:simplicit Fix this bug, verify the result, and obtain independent review.
```

The shorter `$simplicit` examples below describe project-local installation;
use the corresponding qualified selector for plugin skills. Use the host's
discovery result rather than constructing cache paths. All resources resolve
relative to the selected skill. Reviewer profiles require the separate
[project-scoped adoption](#custom-reviewer-roles) below.

Edit the source checkout directly. To refresh a local installation, the tested
CLI method is:

```sh
codex plugin remove simplicit@simplicit --json
codex plugin add simplicit@simplicit --json
codex plugin list --marketplace simplicit --json
```

Then start a fresh session and verify the installed files against the intended
source. This remove/add sequence refreshed changed files even at the same
package version in the isolated test. Do not edit the cache. `marketplace
upgrade` refreshes Git marketplace snapshots; it is not the local-source
refresh command. Publish distinct source versions deliberately when releasing.

Git-backed registration (`codex plugin marketplace add Jeffreyw7/Simplicit
--ref <published-ref>`) is an option only after that remote revision contains
the manifests. A local commit or unpushed `main` does not make the metadata
available from GitHub. See [OpenAI's package and marketplace documentation](https://developers.openai.com/plugins/build/plugins).

### Install in a selected repository

Use Python 3.11 or later. From this Simplicit checkout:

```sh
python -B scripts/install_skills.py "/absolute/path/to/your-project"
```

On Windows, the destination can be a path such as `C:/dev/my-project`. The installer copies the **complete** collection into that project's `.agents/skills/`, validates the result, and preserves unrelated skills. An identical prior installation is a no-op. Any differing same-name folder aborts before copying; compare and reconcile it explicitly so local customizations are retained. There is no overwrite switch.

Linked destination paths are rejected. Copies are staged and validated before complete skill folders are published. If publication is interrupted, rerun the command: completed folders are retained and missing folders are added. Do not run concurrent installers or edit the destination during installation.

New skill folders inherit the staging parent's access permissions, preserving inherited Windows read permissions. Older installations made through private temporary staging may have restrictive permissions even when discovery succeeds. Identical installations remain a no-op: this update does not rewrite their permissions. Use a fresh destination or reconcile affected folder permissions under the project's access policy after preserving and comparing local customizations.

For a manual installation, copy the entire `skills/` collection to `<project>/.agents/skills/` with the same collision checks. Do not copy only one folder: these skills share references and sibling dependencies. Do not activate the original `pstack/` tree.

Start Codex in the selected project. Type:

```text
$simplicit Fix the duplicate-request bug, verify the result, and prepare a reviewable change.
```

Use `$simplicit-help` to find a skill, or invoke one directly. Codex supports explicit `$skill-name` selection and automatic matching from descriptions; if new skills do not appear, restart the session. Same-name skills from other packages remain separate, so select the intended path. See [OpenAI's current skill documentation](https://learn.chatgpt.com/docs/build-skills).

Installation is project-local. It does not modify global model configuration, register a service, enable a scheduler, or install external dependencies.

### Custom reviewer roles

Adopt the shipped `.codex/agents/*.toml` files individually into the selected project's `.codex/agents/` to expose these named roles. Neither plugin installation nor the skill installer registers them in another project. Codex documents personal and project agent directories; a profile stored inside a plugin cache is not project-scoped adoption.

1. Inspect the target project's `.codex/agents/` and its ancestors for linked paths. Create missing ordinary directories only in the selected project.
2. Copy `.codex/agents/critic.toml` and `.codex/agents/comment-sicko.toml` from this source checkout into that directory. For each existing same-name file, compare first: retain identical content, or reconcile differences explicitly before replacement. Preserve all unrelated files. Do not copy the whole `.codex/` directory or install globally.
3. Run `python -B scripts/validate_agents.py "/absolute/path/to/project/.codex/agents"` from Simplicit, then start a fresh session in the selected project and confirm actual named-role execution when required.

| Role | Used by |
|---|---|
| [critic](.codex/agents/critic.toml) | General independent candidate review. |
| [comment-sicko](.codex/agents/comment-sicko.toml) | `$no-comments`: an independent comment review; the lead verifies findings and makes authorized edits. |

Comment Sicko inherits the host model and reads its portable brief from the selected installed `no-comments` skill. The parent supplies its verified absolute brief path, including for plugin installs. Keep the complete skills collection available; it need not be physically beside the project roles.

The critic pins `gpt-6.1-sol` with `high` reasoning. Honor those choices when using the role; model availability and the host's supported role selector must be checked. Effective permissions come from the host/parent; the critic's instructions do not enforce a separate sandbox. See [OpenAI's custom-agent documentation](https://learn.chatgpt.com/docs/agent-configuration/subagents).

Native execution of both roles with project-local skills and a small set of automatic-selection cases passed on Windows with Codex 0.165.0. This is historical evidence, not a plugin-install behavior result. The [November 6 plugin trial](docs/validation/plugin-2026-11-06.md) verified installation, discovery, resource files and refresh; isolated authentication was unavailable for model-driven workflow and role trials. For app-server tests on that version, use a persisted parent thread (`thread/start` with `ephemeral: false`): named-role launches from ephemeral parents failed while loading missing parent rollout context. The disclosed generic fallback worked, but did not satisfy the critic's model pin. See the [dated native validation record](docs/validation.md#native-roles-models-and-selection--october-31-2026) for the tested settings and remaining limits.

Skills-only adoption uses the documented generic independent-reviewer fallback when permitted. For `$no-comments`, that helper receives the Comment Sicko brief and the fallback is disclosed. If independent execution is unavailable, the requested independent pass remains pending. Validate the complete copied role inventory with `python -B scripts/validate_agents.py "/path/to/project/.codex/agents"`, then separately confirm native role discovery and a real bounded review. The validator expects both shipped profiles; a parser pass does not establish native loading or model execution. Do not repeat an already valid review just to obtain a preferred role name.

### Continue through the authorized work

One prompt can authorize investigation, implementation, verification, independent review and supported repairs. Ordinary stage transitions do not need another "continue"; material product decisions, authorization, access and host limits can still require a precise handoff. For example:

```text
$simplicit Fix the duplicate-request bug in this repository's in-memory ledger.
Acceptance: retrying the same request ID with the same positive amount credits
once; distinct IDs still add; negative amounts remain rejected. Preserve existing
edits. Local edits, isolated fixtures, tests and internal independent review are
authorized. Continue through repairs and final verification in this chat.
Prefer the available critic; a generic independent reviewer is permitted if it
is unavailable. Report actual evidence and gaps. Leave a reviewable local diff.
Do not commit, push, create a PR, merge, deploy or send external messages.
```

Read-only and plan-only requests retain their boundaries. Honor existing commit/push/PR authorization; keep one active Draft PR by default. Evidence reuse checks relevant dirty changes, tests, dependencies, configuration, generated output and runtime state, not only the commit SHA.

## What is included

| Need | Examples |
|---|---|
| Main workflow and setup | `simplicit`, `simplicit-mode`, `simplicit-help`, `setup-simplicit` |
| Understand, design and review | `how`, `why`, `architect`, `interrogate`, `blast-radius`, `teach` |
| Verification | `tdd`, create/maintain verification skills, create/maintain formal-verification skills, `statechart` |
| Parallel work and measurement | `arena`, `swarm`, `benchmark-checklist`, `show-me-your-work` |
| Writing and communication | `unslop`, `technical-writing`, `bro`, `ketchup`, `ketchup-video`, `in-your-own-words`, `sharpen` |
| Learning and context | `recall`, `reflect`, `correct`, `automate-me`, `figure-it-out` |
| Code discipline | `no-comments`, `typescript-best-practices`, all 24 `principle-*` skills |
| Bots and issue workflows | `make-bot-ui`, `setup-benny`, `triage-issue-reports`, `reproduce-and-fix-issues` |

The [complete installed catalog](skills/simplicit/references/catalog.md) lists every skill and trigger. The [main router](skills/simplicit/SKILL.md) adds performance, hillclimb, forensics, visual parity, prototype, skill authoring/evaluation, resume/pause, multi-phase work, orchestration, PR readiness and authorized shipping/cleanup.

Names follow the existing Simplicit convention. `poteto-mode` becomes `simplicit`, `poteto-help` becomes `simplicit-help`, and `setup-pstack` becomes `setup-simplicit`. Other specialist names are preserved.

## Runtime-dependent capabilities

Most skills need only Codex's normal file, shell and reasoning tools. They discover actual host capabilities rather than require Cursor tools or a fixed model roster.

- **Statechart:** Node.js 22+; Java 11+ and the pinned TLC JAR for model checking. PNG rendering is optional and uses pinned packages with explicit installation opt-in. See [runtime setup](skills/statechart/references/runtime.md).
- **Decision log:** the portable TSV helper uses Python 3.10+.
- **History:** visible context or available transcript/search tools; no assumed access to other chats.
- **Video:** an available local renderer. When unavailable, the catch-up remains available as text.
- **Bot and issue automation:** a real configured webhook, source/tracker tools, and scheduler when scheduling is requested. Manual workflows remain usable without a scheduler.

The source's Bun `orch` framework and host-specific watchers are replaced by portable workflow instructions, not a new orchestration service. Unsupported external operations remain explicit pending steps. A model result, local test, instruction trial and live service verification are different evidence.

## Validate

From this checkout:

```sh
python -B -m unittest discover -s scripts -p 'test_*.py'
python -B scripts/validate_skills.py
python -B scripts/validate_agents.py
python -B scripts/check_package.py
node --test scripts/test_statechart.mjs
```

The Node suite runs local checks without Java/TLC and explicitly skips model-checking cases when `TLA2TOOLS` is unset. Set it to the verified JAR path to run those cases too. To validate an installed copy:

```sh
python -B scripts/validate_skills.py "/absolute/path/to/project/.agents/skills"
```

Checks cover complete source mapping, licenses, metadata and local resource links, JavaScript module closure, collision-preserving installation, decision-log behavior, and statechart success/failure paths. [Validation evidence](docs/validation.md) records actual runtime and independent instruction trials, plus limits.

All validators are read-only. The skill validator checks this package's simple flat frontmatter and inline links, not arbitrary Markdown/YAML. The agent validator uses Python's `tomllib` and a narrow package policy: role identity/instructions and optional model/effort/summary/verbosity strings only, with matching names and no path escapes. It rejects sandbox, approval, permission, provider, MCP, feature and skill overrides; it does not test account/model availability. Destination validation checks source-selected entries and preserves unrelated entries.

The package checker accepts an optional relocated package root. It checks the
compatibility manifest/catalog, Simplicit identity and SemVer release policy,
the maintained collection, reviewer resources, and the existing prohibition on
linked paths in installed resources. It deliberately enforces this repository's
single-package, skills-only policy; it is not a complete Codex schema validator.
It does not fetch, install, generate files, or invoke models. Python 3.11+ is
required for package/profile validation and installation tests; basic skills
need only the host's normal tools. [CI](.github/workflows/validate.yml) includes
these checks on Linux and Windows; a locally inspected workflow definition is
not evidence of a completed hosted run.

## Source and upgrading

The original 200-file `pstack/` snapshot remains unchanged. [UPSTREAM.md](UPSTREAM.md) records provenance, source mapping and runtime differences; each installed skill carries the MIT license.

Earlier Simplicit releases adapted only a subset or installed a single mode folder. Upgrade to the full collection after comparing local customizations. The installer deliberately refuses conflicting upgrades instead of overwriting them. Updates to the pinned source require deliberate review; no background updater runs.
