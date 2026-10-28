# Upstream source and complete adaptation map

Simplicit preserves the original 200-file pstack subtree from [cursor/plugins](https://github.com/cursor/plugins/tree/99b609a72323b70204eab407c622f436e858e112/pstack).

- Pinned commit: `99b609a72323b70204eab407c622f436e858e112`.
- Imported October 26, 2026; this adaptation expanded October 27, 2026.
- Git tree: `880564357e051d7c7802da1cb5d8df1d0b008299`.
- License: [MIT, copyright 2026 Lauren Tan](pstack/LICENSE). Every installed skill carries the same license bytes.

All imported files remain unchanged. This is a subtree source import, not a GitHub fork relationship. No automatic upstream updater is installed.

## Coverage

Every one of the 58 top-level skills and all three nested Benny skills has a substantive adapter in `skills/`. `poteto-mode` maps to `simplicit`, `poteto-help` to `simplicit-help`, and `setup-pstack` to `setup-simplicit`. Other skill names are preserved. `simplicit-mode` is an additional compatibility alias, yielding 62 installed skills.

The [machine-readable map](migration-map.json) enumerates every source skill and all 23 source playbooks. Feature and refactoring both use Simplicit's existing change playbook; review is an additional Simplicit playbook. The [installed catalog](skills/simplicit/references/catalog.md) explains direct invocation.

## Adaptation policy

Retain substantive domain reasoning, evidence requirements and useful resources. Replace Cursor-only tool calls, fixed model rosters, mandatory multi-agent fan-out and global settings with actual Codex capabilities and the existing [runtime contract](skills/simplicit/references/runtime.md). The lead normally implements; helpers resolve bounded needs and independent review. No source instruction widens authorization for external actions.

The complete skill map is not a promise that the host supplies every external integration. History uses available sources, video uses available renderers, bot workflows require a configured webhook, and scheduled issue work requires an actual scheduler. Skills can be invoked manually without a scheduler. Missing capabilities have explicit outcomes.

The upstream `pstack/agents/comment-sicko.md` is adapted as `.codex/agents/comment-sicko.toml` plus the installed `no-comments/references/comment-review.md` brief. `$no-comments` dispatches that named reviewer, or discloses a generic independent helper using the same brief when the host lacks the role. The lead verifies findings and owns edits. The adaptation preserves the keep categories and `MUST KILL` root-cause findings while retaining Simplicit's evidence-based treatment of uncertain safety constraints. It does not add another skill entrypoint or require the original `pstack/` tree at runtime.

### Executable helpers

- Statechart retains all 21 production JavaScript modules from the pinned source. TLC setup now requires explicit existing Java/JAR configuration. PNG dependencies require a one-time opt-in; documented versions stay pinned. CLI help describes these differences. Original upstream tests remain in the source snapshot; portable behavioral tests are in `scripts/test_statechart.mjs`.
- The active statechart implementation additionally corrects configuration/string parsing, rejects ambiguous duplicate region captions, normalizes mapping failures, and supports safe Windows regeneration with recoverable source backups. The original subtree remains unchanged; [review-fix evidence](docs/review-fixes-2026-10-27.md) records the regressions and compatibility checks.
- The [October 28 follow-up](docs/statechart-followup-fixes-2026-10-28.md) adds context-aware configuration extraction, retained previous-output folders, and reliable publication/mapping failure diagnostics. The upstream resource map includes the added configuration and recovery regression tests.
- The Bash decision logger is replaced by a Python 3.10+ helper with the same six-column UTC TSV contract, literal argument handling, whitespace/formula sanitation and malformed-log rejection.
- The upstream Bun orchestration framework, PR watcher and destructive shell cleanup helpers are not installed. Their workflows are adapted into the mode's portable playbooks: durable unit/evidence records, single topology writer, actual host collaboration/Git tools, bounded retries, and explicit shipping/cleanup authority. These are workflow adaptations, not claims of binary/CLI compatibility with `orch`.

The naming pattern and worker brief established by the earlier adaptation continue to follow [Jimmy at 2bb05bc](https://github.com/ja153903/jimmy/tree/2bb05bcd288f60a9b435ddd156dabb8d88fafe80/plugins/adapters/common/skills). No Jimmy runtime is imported.

## Validation and updates

Run the [checks in README](README.md#validate). Coverage tests enumerate the pinned subtree independently of the map, then check every adapter, license and playbook target. Update the source snapshot, map, adapters and validation deliberately as one reviewed change. Never execute inactive upstream instructions as a fallback for missing installed resources.

The [resource-level map](upstream-resources.json) supplements the entrypoint/playbook map with every pinned upstream file and its review targets or explicit omission. `scripts/upstream_report.py` validates both maps against the pinned Git tree, compares a selected local upstream commit, and produces a read-only report. It reports new resources as unresolved and does not change this pin, the source snapshot, or active instructions. The [October 28 comparison](docs/upstream-comparison-2026-10-28.md) records the first candidate and the remaining mapping work before any preview-and-accept adoption feature.

See [validation evidence](docs/validation.md) for actual trials and remaining limits. Instructions guide behavior; they do not enforce sandbox or service permissions.
