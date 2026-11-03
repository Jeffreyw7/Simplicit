# Simplicit

**62 skills adapted from pstack for Codex**, covering development, review, verification, writing, and automation. The collection includes all 61 upstream skills, the `simplicit-mode` compatibility alias, and routes for all 23 upstream mode playbooks.

One lead carries work through investigation, implementation, verification, and independent review. Merging, deployment, and external messaging stay within the user's authorization.

## Install

With Python 3.11 or later, run this from your Simplicit checkout:

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

Copy the shipped profiles from [.codex/agents/](.codex/agents/) into your project's `.codex/agents/`, preserving existing customizations and checking for linked paths or name collisions:

- **critic** — independent review, configured for `gpt-6.1-sol` with high reasoning.
- **comment-sicko** — comment review for `$no-comments`, using the host model.

The skill installer does not copy these profiles. Keep the complete skill collection installed alongside them. When permitted, skills can use a disclosed generic reviewer fallback; unavailable independent review remains pending.

Validate the copied profiles with `python -B scripts/validate_agents.py "/path/to/project/.codex/agents"`, then confirm native role discovery and execution. See [validation evidence and host limitations](docs/validation.md) for tested configurations.

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
node --test scripts/test_statechart.mjs
```

Set `TLA2TOOLS` to the verified TLC JAR path to include model-checking tests; otherwise those cases are explicitly skipped. To validate an installed skill collection:

```sh
python -B scripts/validate_skills.py "/absolute/path/to/project/.agents/skills"
```

The validators are read-only. [CI](.github/workflows/validate.yml) runs validation on Windows and Ubuntu. See [validation evidence](docs/validation.md) for runtime trials and remaining limits.

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
