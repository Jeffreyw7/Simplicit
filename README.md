# Simplicit

**62 skills adapted from pstack for Codex**, covering development, review, verification, writing, and automation. The collection includes all 61 upstream skills, the `simplicit-mode` compatibility alias, and routes for all 23 upstream mode playbooks.

One lead carries work through investigation, implementation, verification, and independent review. Merging, deployment, and external messaging stay within the user's authorization.

## Install

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
[project-scoped adoption](#optional-reviewer-roles) below.

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

On Windows, use a path such as `C:/dev/my-project`. The installer copies the complete collection into the project's `.agents/skills/` and validates it.

- Unrelated skills are preserved; identical installations are a no-op.
- Differing same-name folders stop installation. Compare and reconcile customizations before upgrading; there is no overwrite switch.
- Linked destination paths are rejected. Rerun an interrupted installation to finish it, without concurrent installers or destination edits.

For manual installation, copy the entire `skills/` collection with the same collision checks. Skills share resources, so do not copy individual folders or activate the original `pstack/` tree. Installation does not change global settings, install dependencies, or start services.

## Use

Start Codex in the target project and invoke a skill:

```text
$simplicit Fix the duplicate-request bug, verify the result, and prepare a reviewable change.
```

Use `$simplicit-help` to find a skill, or select one directly, such as `$no-comments`, `$tdd`, or `$statechart`. Restart the session if newly installed skills do not appear. If several packages supply the same name, select the intended skill path.

See the [skill catalog](skills/simplicit/references/catalog.md) for all skills and the [main workflow](skills/simplicit/SKILL.md) for supported modes. Most skills use Codex's normal tools; integrations require the relevant host capabilities.

### Optional reviewer roles

Adopt the shipped `.codex/agents/*.toml` files individually into the selected project's `.codex/agents/` to expose these named roles. Neither plugin installation nor the skill installer registers them in another project. Codex documents personal and project agent directories; a profile stored inside a plugin cache is not project-scoped adoption.

1. Inspect the target project's `.codex/agents/` and its ancestors for linked paths. Create missing ordinary directories only in the selected project.
2. Copy `.codex/agents/critic.toml` and `.codex/agents/comment-sicko.toml` from this source checkout into that directory. For each existing same-name file, compare first: retain identical content, or reconcile differences explicitly before replacement. Preserve all unrelated files. Do not copy the whole `.codex/` directory or install globally.
3. Run `python -B scripts/validate_agents.py "/absolute/path/to/project/.codex/agents"` from Simplicit, then start a fresh session in the selected project and confirm actual named-role execution when required.

- **critic** — independent review, configured for `gpt-6.1-sol` with high reasoning.
- **comment-sicko** — comment review for `$no-comments`, using the host model.

Comment Sicko inherits the host model and reads its portable brief from the selected installed `no-comments` skill. The parent supplies its verified absolute brief path, including for plugin installs. Keep the complete skills collection available; it need not be physically beside the project roles.

When permitted, skills can use a disclosed generic independent-reviewer fallback; unavailable independent review remains pending. The critic's configured model and effort must be honored when using that role. Effective permissions come from the host/parent; read-only instructions do not enforce a separate sandbox. A profile-validator pass does not establish native discovery or model execution.

Native execution of both roles with project-local skills and a small set of automatic-selection cases passed on Windows with Codex 0.165.0. This is historical evidence, not a plugin-install behavior result. The [November 6 plugin trial](docs/validation/plugin-2026-11-06.md) verified installation, discovery, resource files and refresh; isolated authentication was unavailable for model-driven workflow and role trials. For app-server tests on that version, use a persisted parent thread (`thread/start` with `ephemeral: false`): named-role launches from ephemeral parents failed while loading missing parent rollout context. The disclosed generic fallback worked, but did not satisfy the critic's model pin. See the [dated native validation record](docs/validation.md#native-roles-models-and-selection--october-31-2026) for the tested settings and remaining limits.

## Runtime requirements

Most skills need no extra runtime. Some capabilities have additional requirements:

- **Statechart:** Node.js 22+, plus Java 11+ and the pinned TLC JAR for model checking. PNG rendering requires optional dependencies and explicit installation opt-in. See [runtime setup](skills/statechart/references/runtime.md).
- **Decision log:** Python 3.10+.
- **History, video, and bots:** available history tools, a local renderer, or configured integrations as appropriate. Scheduling requires a real scheduler; manual workflows remain available.

## Validate

From this checkout:

```sh
python -B -m unittest discover -s scripts -p 'test_*.py'
python -B scripts/validate_skills.py
python -B scripts/validate_agents.py
python -B scripts/check_package.py
node --test scripts/test_statechart.mjs
```

Set `TLA2TOOLS` to the verified TLC JAR path to include model-checking tests; otherwise those cases are explicitly skipped. To validate an installed skill collection:

```sh
python -B scripts/validate_skills.py "/absolute/path/to/project/.agents/skills"
```

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
not evidence of a completed hosted run. See [validation evidence](docs/validation.md)
for runtime trials and remaining limits.

## Upstream updates

The original `pstack/` snapshot is preserved unchanged. [UPSTREAM.md](UPSTREAM.md) documents provenance, mappings, and intentional Codex adaptations.

Compare a chosen revision from an existing local clone of `cursor/plugins`:

```sh
python -B scripts/upstream_report.py --upstream-repo "/path/to/cursor-plugins" --ref <commit-or-ref>
```

Run this from a Simplicit Git checkout containing the pinned source tree. The report reads committed upstream files and maps changes to Simplicit adaptations. It does not fetch, install, replace instructions, or update the source pin. New unmapped resources require review.

Preview-and-accept adoption is not yet enabled. Updates must preserve intentional adaptations and local customizations; newer pstack files must never replace adapted instructions automatically. See the [resource map](upstream-resources.json) and [comparison report](docs/upstream-comparison-2026-10-28.md).

## Credit

- [pstack by Lauren Tan](https://github.com/cursor/plugins/tree/99b609a72323b70204eab407c622f436e858e112/pstack) provides the original skills, playbooks, and resources. The source is [MIT licensed](pstack/LICENSE), copyright 2026 Lauren Tan; every installed skill retains that license.
