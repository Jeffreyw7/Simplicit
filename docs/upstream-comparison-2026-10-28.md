# Upstream adoption comparison — October 28, 2026

This is the first, read-only adoption phase. The pinned source remains at [99b609a](https://github.com/cursor/plugins/tree/99b609a72323b70204eab407c622f436e858e112/pstack). This report compares it with [c742dd6](https://github.com/cursor/plugins/tree/c742dd61706fbacc1b95f1a20b7b988cf096ce6c/pstack), resolved from upstream main during this task. A full local Git-tree comparison was used because the GitHub comparison response did not provide a complete resource inventory.

**Result: 25 modified, 33 removed, 406 added, and no exact-content renames.** The candidate contains 573 resources versus the pin's 200. The explicit [resource map](../upstream-resources.json) covers every pinned file: 168 adapted, 19 retained, and 13 intentionally omitted, pointing to 207 distinct existing Simplicit files. It also agrees with the existing 61 skill-entrypoint and 23 playbook mappings.

All 406 additions are in statechart; 376 are under its test directory. They are deliberately marked unmapped. This is a major implementation and interface change, not a collection of interchangeable replacements. **Preview-and-accept adoption is not implemented or enabled in this phase.** It must follow reviewed mappings for the proposed candidate resources.

| Upstream change | Corresponding Simplicit review locations | Adoption consideration |
|---|---|---|
| Statechart replaces its 21 production JavaScript modules and five test/fixture resources with a TypeScript implementation, renderer reference and expanded tests/corpora. Its entrypoint and documented invocation change. | Active statechart instructions and scripts; portable statechart tests; runtime setup. The full table names existing targets for removals. | Reconcile the new CLI, rendering and model-checking behavior with current Codex runtime setup and local correctness/preservation repairs. New resource destinations need explicit decisions. No upstream program was executed. |
| Interrogate is rewritten around executed adversarial repros and removes four review references. | Interrogate entrypoint/references; critic profile for the rubric. | Review the intended evidence and delegation behavior; deleting an upstream reference does not authorize deleting a local adaptation that still uses it. |
| Orchestration guidance is rewritten and removes three Bun orchestration files. | Simplicit orchestration, multi-phase, unattended and PR playbooks. | Simplicit already adapts this runtime to host tools. Review workflow changes rather than install/delete a Bun framework. |
| Arena, formal verification, video, help, setup, a principle skill, mode playbooks and guide prose change. | Renamed entrypoints and portable routes listed below. | Keep Codex capability checks, authorization, lead ownership and local instructions while assessing upstream reasoning changes. |
| Plugin manifests change. | Intentionally omitted from installed Simplicit resources. | Package metadata does not replace Codex skill metadata. |

The map records review impact and provenance, not executable equivalence or permission to copy bytes. Retained sources may have different checkout line endings or later local edits. Portable test targets are coverage-review locations; they do not imply one-for-one upstream test coverage.

Reproduce the report from a Simplicit Git checkout using an existing complete upstream clone:

    python -B scripts/upstream_report.py --upstream-repo /path/to/cursor-plugins --ref c742dd61706fbacc1b95f1a20b7b988cf096ce6c
    python -B scripts/upstream_report.py --upstream-repo /path/to/cursor-plugins --ref c742dd61706fbacc1b95f1a20b7b988cf096ce6c --format json

The command emits stdout only. JSON includes old/new blob identities, all upstream diffs and SHA-256 hashes of affected local adaptation files. Markdown can include diffs with --include-diffs. Reports use the immutable resolved commit, exclude uncommitted upstream edits, and reject incomplete/duplicate maps, invalid paths, missing/linked targets and disagreement with migration-map.json. New paths are never assigned targets by filename similarity. Unique exact content-and-mode moves carry a review-only mapping; ambiguous or edited moves remain added/removed.

A later acceptance feature must use deliberately adapted candidate patches, display the exact changes for selected resources, bind acceptance to the upstream commit/map/local-file hashes, reject stale previews, preserve local edits and backups, and require explicit acceptance. Reporting alone must never advance the pin or overwrite instructions.

Independent review caught and corrected a missing critic-profile dependency and missing-final-newline diff formatting. A missing-blob probe confirmed failure without lazy fetching or repository mutation. Fresh verification ran 70 Python tests on Windows (66 passed, 4 skipped) and Ubuntu (68 passed, 2 skipped), 30 Windows Node/TLC tests (all passed), and both validators on both platforms (62 skills, 2 profiles). The 16 new tests include real Git fixtures and packaged-map coverage. Windows skips concern unavailable symlink privileges and 8.3 names; Ubuntu skips concern unavailable PowerShell and the Windows-only short-name case. Native Linux Node/Java remain unavailable. Evidence is retained under .scratch/upstream-adoption/. No installed skills, profiles, statechart implementation, original source snapshot, or source pins were changed by this feature.

The complete resource-by-resource comparison follows.

# Upstream comparison (read-only)

Baseline: 99b609a72323b70204eab407c622f436e858e112 (200 resources).
Candidate: c742dd61706fbacc1b95f1a20b7b988cf096ce6c (573 resources).
Mapping coverage: 200 baseline resources; 207 adaptation targets.
Adoption is disabled. No files, pins, installations, or Git refs were changed.

Mappings identify review impact, not permission to replace adaptations. New resources require explicit mappings.
Local target hashes describe current bytes; differing content is expected for adaptations and is not proof of a local regression.
Renames are paired only when removed/added content and mode identify one unique pair; edited or ambiguous renames remain add/remove.
Candidate worktree edits are excluded. Only the resolved commit is compared.

Changes: modified=25, added=406, removed=33, renamed=0, unmapped=406, unsupported_types=0.

| Change | Upstream resource | Mapping | Simplicit adaptations | Rationale |
|---|---|---|---|---|
| modified | pstack/.cursor-plugin/plugin.json | omitted | — | Cursor marketplace registration, discovery paths and branding are not installed by Simplicit; the project-local Codex skill collection has no Cursor plugin manifest. |
| modified | pstack/README.md | mapped | README.md; UPSTREAM.md; skills/simplicit-help/SKILL.md; skills/simplicit/references/catalog.md | The collection overview, installation, naming, runtime limits and provenance are rewritten for the project-local Codex collection; source-plugin installation and automatic updates are not carried over. |
| modified | pstack/docs/guide/04-design.md | mapped | skills/architect/SKILL.md; skills/arena/SKILL.md; skills/swarm/SKILL.md; skills/interrogate/SKILL.md; skills/simplicit/playbooks/prototype.md; skills/simplicit/playbooks/multi-phase-plan.md | Design sketches, optional independent candidates, bounded slices, challenge, prototypes and verifiable planning are adapted to the available Codex host. |
| modified | pstack/docs/guide/06-verify-and-ship.md | mapped | skills/benchmark-checklist/SKILL.md; skills/create-verification-skill/SKILL.md; skills/maintain-verification-skill/SKILL.md; skills/create-formal-verification-skill/SKILL.md; skills/maintain-formal-verification-skill/SKILL.md; skills/statechart/SKILL.md; skills/simplicit/playbooks/opening-a-pr.md; skills/simplicit/playbooks/babysit.md; skills/simplicit/playbooks/shipping.md | Verification and measured claims use the installed specialists; opening, tending and landing PRs use distinct portable workflows with explicit shipping authority. |
| modified | pstack/docs/guide/07-overnight.md | mapped | skills/simplicit/playbooks/autonomous-run.md; skills/simplicit/playbooks/autopilot-full.md; skills/simplicit/playbooks/autopilot-stack.md; skills/simplicit/playbooks/orchestrate.md; skills/show-me-your-work/SKILL.md; skills/setup-benny/SKILL.md | Unattended work, queue ownership, durable evidence and optional scheduled issue work are adapted to actual host continuation and scheduler capabilities; no daemon or automatic wake is promised. |
| modified | pstack/docs/guide/10-recipes-and-pitfalls.md | mapped | README.md; skills/simplicit-help/SKILL.md; skills/simplicit/references/catalog.md; skills/simplicit/SKILL.md; skills/simplicit/references/runtime.md | Prompt examples and route selection are consolidated into the Codex usage guide, help/catalog and router; scope and capability pitfalls are handled by the runtime contract. |
| modified | pstack/plugin.json | omitted | — | The upstream agent-plugin package manifest is not used by the project-local Codex skill installer; its package name/version must not replace Simplicit metadata. |
| modified | pstack/skills/arena/SKILL.md | mapped | skills/arena/SKILL.md | The Arena skill is installed at the migration-map Codex entrypoint; its workflow uses available host tools and the shared runtime contract for scope, authorization and review. |
| modified | pstack/skills/create-formal-verification-skill/SKILL.md | mapped | skills/create-formal-verification-skill/SKILL.md | The Create a formal verification skill skill is installed at the migration-map Codex entrypoint; its workflow uses available host tools and the shared runtime contract for scope, authorization and review. |
| modified | pstack/skills/interrogate/SKILL.md | mapped | skills/interrogate/SKILL.md | The Interrogate skill is installed at the migration-map Codex entrypoint; its workflow uses available host tools and the shared runtime contract for scope, authorization and review. |
| removed | pstack/skills/interrogate/references/code-quality-review.md | mapped | skills/interrogate/references/code-quality-review.md | Code quality concerns remain a review reference while findings must be scoped and supported by current evidence. |
| removed | pstack/skills/interrogate/references/lead-judgment.md | mapped | skills/interrogate/references/lead-judgment.md | The lead owns triage of supported findings and candidate-aware evidence; review output alone does not authorize edits. |
| removed | pstack/skills/interrogate/references/reviewer-prompt.md | mapped | skills/interrogate/references/reviewer-prompt.md | The independent reviewer receives explicit scope, candidate identity and read-only evidence/report duties using the available host. |
| removed | pstack/skills/interrogate/references/rubric.md | mapped | skills/interrogate/references/rubric.md; .codex/agents/critic.toml | The review rubric focuses on consequential, evidenced defects and contract risk within the requested review. The critic Codex profile directly credits this rubric and adapts its risk prioritization, evidence requirements and concise findings format. |
| modified | pstack/skills/ketchup-video/SKILL.md | mapped | skills/ketchup-video/SKILL.md | The Ketchup video skill is installed at the migration-map Codex entrypoint; its workflow uses available host tools and the shared runtime contract for scope, authorization and review. |
| modified | pstack/skills/poteto-help/SKILL.md | mapped | skills/simplicit-help/SKILL.md; skills/simplicit/references/catalog.md | Command discovery and capability limits are adapted to Codex selection syntax, renamed entrypoints and the complete installed catalog. |
| modified | pstack/skills/poteto-help/references/recipes.md | mapped | README.md; skills/simplicit-help/SKILL.md; skills/simplicit/references/catalog.md; skills/simplicit/SKILL.md | Source command recipes become Codex invocation examples, a complete installed catalog and the portable routing table; source slash-command syntax is not installed. |
| modified | pstack/skills/poteto-mode/SKILL.md | mapped | skills/simplicit/SKILL.md; skills/simplicit-mode/SKILL.md; skills/simplicit/references/runtime.md; skills/simplicit/references/engineering.md; skills/simplicit/playbooks/review.md | The main mode is renamed Simplicit, with a compatibility alias; host/tool, delegation and authorization rules live in the runtime contract, engineering guidance is split into a reference, and candidate review has a dedicated portable playbook. |
| modified | pstack/skills/poteto-mode/playbooks/autonomous-run.md | mapped | skills/simplicit/playbooks/autonomous-run.md | The Autonomous run workflow is adapted into the portable mode playbook with actual host tools, evidence requirements and explicit authorization boundaries. |
| modified | pstack/skills/poteto-mode/playbooks/autopilot-full.md | mapped | skills/simplicit/playbooks/autopilot-full.md | The Autopilot for independent changes workflow is adapted into the portable mode playbook with actual host tools, evidence requirements and explicit authorization boundaries. |
| modified | pstack/skills/poteto-mode/playbooks/autopilot-stack.md | mapped | skills/simplicit/playbooks/autopilot-stack.md | The Autopilot for a dependent stack workflow is adapted into the portable mode playbook with actual host tools, evidence requirements and explicit authorization boundaries. |
| modified | pstack/skills/poteto-mode/playbooks/babysit.md | mapped | skills/simplicit/playbooks/babysit.md | The Babysit workflow is adapted into the portable mode playbook with actual host tools, evidence requirements and explicit authorization boundaries. |
| modified | pstack/skills/poteto-mode/playbooks/multi-phase-plan.md | mapped | skills/simplicit/playbooks/multi-phase-plan.md | The Multi-phase or multi-PR plan workflow is adapted into the portable mode playbook with actual host tools, evidence requirements and explicit authorization boundaries. |
| modified | pstack/skills/poteto-mode/playbooks/opening-a-pr.md | mapped | skills/simplicit/playbooks/opening-a-pr.md | The Opening a PR workflow is adapted into the portable mode playbook with actual host tools, evidence requirements and explicit authorization boundaries. |
| modified | pstack/skills/poteto-mode/playbooks/orchestrate.md | mapped | skills/simplicit/playbooks/orchestrate.md | The Orchestrate workflow is adapted into the portable mode playbook with actual host tools, evidence requirements and explicit authorization boundaries. |
| removed | pstack/skills/poteto-mode/scripts/orch/orch.test.ts | mapped | skills/simplicit/playbooks/orchestrate.md | Store lifecycle, ledgers, queues and frontier invariants have a workflow review destination in Orchestrate; upstream Bun implementation tests remain source-only and are not claimed as portable test coverage. |
| removed | pstack/skills/poteto-mode/scripts/orch/orch.ts | mapped | skills/simplicit/playbooks/orchestrate.md | The orch CLI command workflow becomes lead-owned unit/evidence ledgers, completion draining, frontier tracking and actual host collaboration; no CLI compatibility is claimed. |
| removed | pstack/skills/poteto-mode/scripts/orch/store.ts | mapped | skills/simplicit/playbooks/orchestrate.md; skills/simplicit/playbooks/autopilot-stack.md; skills/simplicit/playbooks/shipping.md | Durable unit/verdict/gate records, stale evidence, frontier and topology ownership become portable orchestration and stack/shipping rules; the Bun file-store/lock implementation is not installed. |
| modified | pstack/skills/poteto-mode/scripts/package.json | omitted | — | The dependency/build metadata belongs only to the uninstalled upstream Bun orchestration and watcher package; no active Simplicit package consumes it. |
| modified | pstack/skills/principle-explain-the-number/SKILL.md | mapped | skills/principle-explain-the-number/SKILL.md | The Explain the Number skill is installed at the migration-map Codex entrypoint; its workflow uses available host tools and the shared runtime contract for scope, authorization and review. |
| modified | pstack/skills/setup-pstack/SKILL.md | mapped | skills/setup-simplicit/SKILL.md | Setup configures the selected project and actual host capabilities; it replaces Cursor/global model rules with supported options and inherited models. |
| modified | pstack/skills/statechart/SKILL.md | mapped | skills/statechart/SKILL.md; skills/statechart/references/runtime.md | The statechart workflow invokes the installed JavaScript modules and documents explicit Java/TLC configuration and opt-in renderer dependency installation. |
| added | pstack/skills/statechart/references/render.md | unmapped | — | New resource: requires an explicit reviewed mapping. |
| added | pstack/skills/statechart/scripts/backends/cfg.ts | unmapped | — | New resource: requires an explicit reviewed mapping. |
| added | pstack/skills/statechart/scripts/backends/mermaid.ts | unmapped | — | New resource: requires an explicit reviewed mapping. |
| added | pstack/skills/statechart/scripts/backends/plain-text.ts | unmapped | — | New resource: requires an explicit reviewed mapping. |
| added | pstack/skills/statechart/scripts/backends/report.ts | unmapped | — | New resource: requires an explicit reviewed mapping. |
| removed | pstack/skills/statechart/scripts/bug-states.mjs | mapped | skills/statechart/scripts/bug-states.mjs | Retained upstream implementation; checkout line endings or subsequent local edits may differ. This production module is installed under the active statechart skill; upstream changes must be reviewed together with the modified CLI/runtime boundary. |
| removed | pstack/skills/statechart/scripts/chart-edges.mjs | mapped | skills/statechart/scripts/chart-edges.mjs | Retained upstream implementation; checkout line endings or subsequent local edits may differ. This production module is installed under the active statechart skill; upstream changes must be reviewed together with the modified CLI/runtime boundary. |
| removed | pstack/skills/statechart/scripts/chart-parts.mjs | mapped | skills/statechart/scripts/chart-parts.mjs | Retained upstream implementation; checkout line endings or subsequent local edits may differ. This production module is installed under the active statechart skill; upstream changes must be reviewed together with the modified CLI/runtime boundary. |
| removed | pstack/skills/statechart/scripts/chart-to-tla.mjs | mapped | skills/statechart/scripts/chart-to-tla.mjs | Retained upstream implementation; checkout line endings or subsequent local edits may differ. This production module is installed under the active statechart skill; upstream changes must be reviewed together with the modified CLI/runtime boundary. |
| removed | pstack/skills/statechart/scripts/compare-charts.mjs | mapped | skills/statechart/scripts/compare-charts.mjs | Retained upstream implementation; checkout line endings or subsequent local edits may differ. This production module is installed under the active statechart skill; upstream changes must be reviewed together with the modified CLI/runtime boundary. |
| added | pstack/skills/statechart/scripts/frontends/config.ts | unmapped | — | New resource: requires an explicit reviewed mapping. |
| added | pstack/skills/statechart/scripts/frontends/dot.ts | unmapped | — | New resource: requires an explicit reviewed mapping. |
| added | pstack/skills/statechart/scripts/frontends/marks.ts | unmapped | — | New resource: requires an explicit reviewed mapping. |
| added | pstack/skills/statechart/scripts/frontends/messages.ts | unmapped | — | New resource: requires an explicit reviewed mapping. |
| added | pstack/skills/statechart/scripts/frontends/spec.ts | unmapped | — | New resource: requires an explicit reviewed mapping. |
| added | pstack/skills/statechart/scripts/frontends/trace.ts | unmapped | — | New resource: requires an explicit reviewed mapping. |
| added | pstack/skills/statechart/scripts/frontends/value.ts | unmapped | — | New resource: requires an explicit reviewed mapping. |
| added | pstack/skills/statechart/scripts/frontends/verdict.ts | unmapped | — | New resource: requires an explicit reviewed mapping. |
| added | pstack/skills/statechart/scripts/frontends/view.ts | unmapped | — | New resource: requires an explicit reviewed mapping. |
| added | pstack/skills/statechart/scripts/ir.ts | unmapped | — | New resource: requires an explicit reviewed mapping. |
| removed | pstack/skills/statechart/scripts/lib.mjs | mapped | skills/statechart/scripts/lib.mjs | The shared parser preserves string escapes, rejects ambiguous duplicate region captions and treats object-property captions as data. |
| removed | pstack/skills/statechart/scripts/map-view.mjs | mapped | skills/statechart/scripts/map-view.mjs | Retained upstream implementation; checkout line endings or subsequent local edits may differ. This production module is installed under the active statechart skill; upstream changes must be reviewed together with the modified CLI/runtime boundary. |
| added | pstack/skills/statechart/scripts/package.json | unmapped | — | New resource: requires an explicit reviewed mapping. |
| added | pstack/skills/statechart/scripts/passes/annotate.ts | unmapped | — | New resource: requires an explicit reviewed mapping. |
| added | pstack/skills/statechart/scripts/passes/label.ts | unmapped | — | New resource: requires an explicit reviewed mapping. |
| added | pstack/skills/statechart/scripts/passes/lift.ts | unmapped | — | New resource: requires an explicit reviewed mapping. |
| added | pstack/skills/statechart/scripts/passes/loop-check.ts | unmapped | — | New resource: requires an explicit reviewed mapping. |
| added | pstack/skills/statechart/scripts/passes/paths.ts | unmapped | — | New resource: requires an explicit reviewed mapping. |
| added | pstack/skills/statechart/scripts/passes/reach.ts | unmapped | — | New resource: requires an explicit reviewed mapping. |
| added | pstack/skills/statechart/scripts/passes/region-check.ts | unmapped | — | New resource: requires an explicit reviewed mapping. |
| added | pstack/skills/statechart/scripts/passes/regions.ts | unmapped | — | New resource: requires an explicit reviewed mapping. |
| added | pstack/skills/statechart/scripts/pipeline.ts | unmapped | — | New resource: requires an explicit reviewed mapping. |
| removed | pstack/skills/statechart/scripts/property-loop.mjs | mapped | skills/statechart/scripts/property-loop.mjs | Retained upstream implementation; checkout line endings or subsequent local edits may differ. This production module is installed under the active statechart skill; upstream changes must be reviewed together with the modified CLI/runtime boundary. |
| removed | pstack/skills/statechart/scripts/read-check.mjs | mapped | skills/statechart/scripts/read-check.mjs | Retained upstream implementation; checkout line endings or subsequent local edits may differ. This production module is installed under the active statechart skill; upstream changes must be reviewed together with the modified CLI/runtime boundary. |
| removed | pstack/skills/statechart/scripts/regions-chart.mjs | mapped | skills/statechart/scripts/regions-chart.mjs | Retained upstream implementation; checkout line endings or subsequent local edits may differ. This production module is installed under the active statechart skill; upstream changes must be reviewed together with the modified CLI/runtime boundary. |
| removed | pstack/skills/statechart/scripts/render.mjs | mapped | skills/statechart/scripts/render.mjs | The renderer retains pinned packages but requires STATECHART_ALLOW_INSTALL=1 before a missing dependency can be installed. |
| removed | pstack/skills/statechart/scripts/rule-book.mjs | mapped | skills/statechart/scripts/rule-book.mjs | Retained upstream implementation; checkout line endings or subsequent local edits may differ. This production module is installed under the active statechart skill; upstream changes must be reviewed together with the modified CLI/runtime boundary. |
| added | pstack/skills/statechart/scripts/run.ts | unmapped | — | New resource: requires an explicit reviewed mapping. |
| removed | pstack/skills/statechart/scripts/second-replay.mjs | mapped | skills/statechart/scripts/second-replay.mjs | Retained upstream implementation; checkout line endings or subsequent local edits may differ. This production module is installed under the active statechart skill; upstream changes must be reviewed together with the modified CLI/runtime boundary. |
| removed | pstack/skills/statechart/scripts/snapshot.mjs | mapped | skills/statechart/scripts/snapshot.mjs | Retained upstream implementation; checkout line endings or subsequent local edits may differ. This production module is installed under the active statechart skill; upstream changes must be reviewed together with the modified CLI/runtime boundary. |
| removed | pstack/skills/statechart/scripts/spec-text.mjs | mapped | skills/statechart/scripts/spec-text.mjs | Retained upstream implementation; checkout line endings or subsequent local edits may differ. This production module is installed under the active statechart skill; upstream changes must be reviewed together with the modified CLI/runtime boundary. |
| added | pstack/skills/statechart/scripts/statechart | unmapped | — | New resource: requires an explicit reviewed mapping. |
| removed | pstack/skills/statechart/scripts/statechart-help.mjs | mapped | skills/statechart/scripts/statechart-help.mjs | CLI help documents explicit Java/TLC configuration, opt-in renderer installation and safe regeneration/publication with recoverable source backups. |
| removed | pstack/skills/statechart/scripts/statechart.mjs | mapped | skills/statechart/scripts/statechart.mjs | The active CLI preserves configuration syntax, normalizes mapping failures and stages/restores Windows-safe regeneration and output publication with retained backups. |
| added | pstack/skills/statechart/scripts/statechart.ts | unmapped | — | New resource: requires an explicit reviewed mapping. |
| added | pstack/skills/statechart/scripts/test/ConfigOracle.java | unmapped | — | New resource: requires an explicit reviewed mapping. |
| removed | pstack/skills/statechart/scripts/test/band.mmd | mapped | scripts/test_statechart.mjs; scripts/test_statechart_values.mjs | The group entry/exit fixture is not installed as a runtime asset. Changes route to the portable statechart test suites for coverage review; their local fixtures are not copies and do not promise identical scenario coverage. |
| added | pstack/skills/statechart/scripts/test/chart.test.ts | unmapped | — | New resource: requires an explicit reviewed mapping. |
| added | pstack/skills/statechart/scripts/test/charts/Braces.mmd | unmapped | — | New resource: requires an explicit reviewed mapping. |
| added | pstack/skills/statechart/scripts/test/charts/Escapes.mmd | unmapped | — | New resource: requires an explicit reviewed mapping. |
| added | pstack/skills/statechart/scripts/test/charts/Phases.mmd | unmapped | — | New resource: requires an explicit reviewed mapping. |
| added | pstack/skills/statechart/scripts/test/cli.test.ts | unmapped | — | New resource: requires an explicit reviewed mapping. |
| added | pstack/skills/statechart/scripts/test/config-fuzz.test.ts | unmapped | — | New resource: requires an explicit reviewed mapping. |
| added | pstack/skills/statechart/scripts/test/corpus.test.ts | unmapped | — | New resource: requires an explicit reviewed mapping. |
| added | pstack/skills/statechart/scripts/test/corpus/Counter/ChartRun.out | unmapped | — | New resource: requires an explicit reviewed mapping. |
| added | pstack/skills/statechart/scripts/test/corpus/Counter/Counter.cfg | unmapped | — | New resource: requires an explicit reviewed mapping. |
| added | pstack/skills/statechart/scripts/test/corpus/Counter/Counter.tla | unmapped | — | New resource: requires an explicit reviewed mapping. |
| added | pstack/skills/statechart/scripts/test/corpus/Counter/chart.mmd | unmapped | — | New resource: requires an explicit reviewed mapping. |
| added | pstack/skills/statechart/scripts/test/corpus/Counter/graph.dot | unmapped | — | New resource: requires an explicit reviewed mapping. |
| added | pstack/skills/statechart/scripts/test/corpus/Counter/report.md | unmapped | — | New resource: requires an explicit reviewed mapping. |
| added | pstack/skills/statechart/scripts/test/corpus/Counter/sany.out | unmapped | — | New resource: requires an explicit reviewed mapping. |
| added | pstack/skills/statechart/scripts/test/corpus/Counter/verdict-1.out | unmapped | — | New resource: requires an explicit reviewed mapping. |
| added | pstack/skills/statechart/scripts/test/corpus/CounterAction/ChartRun.out | unmapped | — | New resource: requires an explicit reviewed mapping. |
| added | pstack/skills/statechart/scripts/test/corpus/CounterAction/CounterAction.cfg | unmapped | — | New resource: requires an explicit reviewed mapping. |
| added | pstack/skills/statechart/scripts/test/corpus/CounterAction/CounterAction.tla | unmapped | — | New resource: requires an explicit reviewed mapping. |
| added | pstack/skills/statechart/scripts/test/corpus/CounterAction/chart.mmd | unmapped | — | New resource: requires an explicit reviewed mapping. |
| added | pstack/skills/statechart/scripts/test/corpus/CounterAction/graph.dot | unmapped | — | New resource: requires an explicit reviewed mapping. |
| added | pstack/skills/statechart/scripts/test/corpus/CounterAction/report.md | unmapped | — | New resource: requires an explicit reviewed mapping. |
| added | pstack/skills/statechart/scripts/test/corpus/CounterAction/sany.out | unmapped | — | New resource: requires an explicit reviewed mapping. |
| added | pstack/skills/statechart/scripts/test/corpus/CounterAction/verdict-1.exit | unmapped | — | New resource: requires an explicit reviewed mapping. |
| added | pstack/skills/statechart/scripts/test/corpus/CounterAction/verdict-1.out | unmapped | — | New resource: requires an explicit reviewed mapping. |
| added | pstack/skills/statechart/scripts/test/corpus/CounterAction/verdict-2.exit | unmapped | — | New resource: requires an explicit reviewed mapping. |
| added | pstack/skills/statechart/scripts/test/corpus/CounterAction/verdict-2.out | unmapped | — | New resource: requires an explicit reviewed mapping. |
| added | pstack/skills/statechart/scripts/test/corpus/CounterAction/verdict-3.out | unmapped | — | New resource: requires an explicit reviewed mapping. |
| added | pstack/skills/statechart/scripts/test/corpus/CounterDeadlock/ChartRun.out | unmapped | — | New resource: requires an explicit reviewed mapping. |
| added | pstack/skills/statechart/scripts/test/corpus/CounterDeadlock/CounterDeadlock.cfg | unmapped | — | New resource: requires an explicit reviewed mapping. |
| added | pstack/skills/statechart/scripts/test/corpus/CounterDeadlock/CounterDeadlock.tla | unmapped | — | New resource: requires an explicit reviewed mapping. |
| added | pstack/skills/statechart/scripts/test/corpus/CounterDeadlock/chart.mmd | unmapped | — | New resource: requires an explicit reviewed mapping. |
| added | pstack/skills/statechart/scripts/test/corpus/CounterDeadlock/graph.dot | unmapped | — | New resource: requires an explicit reviewed mapping. |
| added | pstack/skills/statechart/scripts/test/corpus/CounterDeadlock/report.md | unmapped | — | New resource: requires an explicit reviewed mapping. |
| added | pstack/skills/statechart/scripts/test/corpus/CounterDeadlock/sany.out | unmapped | — | New resource: requires an explicit reviewed mapping. |
| added | pstack/skills/statechart/scripts/test/corpus/CounterDeadlock/verdict-1.exit | unmapped | — | New resource: requires an explicit reviewed mapping. |
| added | pstack/skills/statechart/scripts/test/corpus/CounterDeadlock/verdict-1.out | unmapped | — | New resource: requires an explicit reviewed mapping. |
| added | pstack/skills/statechart/scripts/test/corpus/CounterDeadlock/verdict-2.exit | unmapped | — | New resource: requires an explicit reviewed mapping. |
| added | pstack/skills/statechart/scripts/test/corpus/CounterDeadlock/verdict-2.out | unmapped | — | New resource: requires an explicit reviewed mapping. |
| added | pstack/skills/statechart/scripts/test/corpus/CounterFan/ChartRun.out | unmapped | — | New resource: requires an explicit reviewed mapping. |
| added | pstack/skills/statechart/scripts/test/corpus/CounterFan/CounterFan.cfg | unmapped | — | New resource: requires an explicit reviewed mapping. |
| added | pstack/skills/statechart/scripts/test/corpus/CounterFan/CounterFan.tla | unmapped | — | New resource: requires an explicit reviewed mapping. |
| added | pstack/skills/statechart/scripts/test/corpus/CounterFan/chart.mmd | unmapped | — | New resource: requires an explicit reviewed mapping. |
| added | pstack/skills/statechart/scripts/test/corpus/CounterFan/graph.dot | unmapped | — | New resource: requires an explicit reviewed mapping. |
| added | pstack/skills/statechart/scripts/test/corpus/CounterFan/report.md | unmapped | — | New resource: requires an explicit reviewed mapping. |
| added | pstack/skills/statechart/scripts/test/corpus/CounterFan/sany.out | unmapped | — | New resource: requires an explicit reviewed mapping. |
| added | pstack/skills/statechart/scripts/test/corpus/CounterFan/verdict-1.exit | unmapped | — | New resource: requires an explicit reviewed mapping. |
| added | pstack/skills/statechart/scripts/test/corpus/CounterFan/verdict-1.out | unmapped | — | New resource: requires an explicit reviewed mapping. |
| added | pstack/skills/statechart/scripts/test/corpus/CounterFan/verdict-2.out | unmapped | — | New resource: requires an explicit reviewed mapping. |
| added | pstack/skills/statechart/scripts/test/corpus/CounterGuard/ChartRun.exit | unmapped | — | New resource: requires an explicit reviewed mapping. |
| added | pstack/skills/statechart/scripts/test/corpus/CounterGuard/ChartRun.out | unmapped | — | New resource: requires an explicit reviewed mapping. |
| added | pstack/skills/statechart/scripts/test/corpus/CounterGuard/CounterGuard.cfg | unmapped | — | New resource: requires an explicit reviewed mapping. |
| added | pstack/skills/statechart/scripts/test/corpus/CounterGuard/CounterGuard.tla | unmapped | — | New resource: requires an explicit reviewed mapping. |
| added | pstack/skills/statechart/scripts/test/corpus/CounterGuard/chart.mmd | unmapped | — | New resource: requires an explicit reviewed mapping. |
| added | pstack/skills/statechart/scripts/test/corpus/CounterGuard/graph.dot | unmapped | — | New resource: requires an explicit reviewed mapping. |
| added | pstack/skills/statechart/scripts/test/corpus/CounterGuard/report.md | unmapped | — | New resource: requires an explicit reviewed mapping. |
| added | pstack/skills/statechart/scripts/test/corpus/CounterGuard/sany.out | unmapped | — | New resource: requires an explicit reviewed mapping. |
| added | pstack/skills/statechart/scripts/test/corpus/CounterGuard/verdict-1.exit | unmapped | — | New resource: requires an explicit reviewed mapping. |
| added | pstack/skills/statechart/scripts/test/corpus/CounterGuard/verdict-1.out | unmapped | — | New resource: requires an explicit reviewed mapping. |
| added | pstack/skills/statechart/scripts/test/corpus/CounterGuard/verdict-2.exit | unmapped | — | New resource: requires an explicit reviewed mapping. |
| added | pstack/skills/statechart/scripts/test/corpus/CounterGuard/verdict-2.out | unmapped | — | New resource: requires an explicit reviewed mapping. |
| added | pstack/skills/statechart/scripts/test/corpus/CounterInitPast/ChartRun.out | unmapped | — | New resource: requires an explicit reviewed mapping. |
| added | pstack/skills/statechart/scripts/test/corpus/CounterInitPast/CounterInitPast.cfg | unmapped | — | New resource: requires an explicit reviewed mapping. |
| added | pstack/skills/statechart/scripts/test/corpus/CounterInitPast/CounterInitPast.tla | unmapped | — | New resource: requires an explicit reviewed mapping. |
| added | pstack/skills/statechart/scripts/test/corpus/CounterInitPast/chart.mmd | unmapped | — | New resource: requires an explicit reviewed mapping. |
| added | pstack/skills/statechart/scripts/test/corpus/CounterInitPast/graph.dot | unmapped | — | New resource: requires an explicit reviewed mapping. |
| added | pstack/skills/statechart/scripts/test/corpus/CounterInitPast/report.md | unmapped | — | New resource: requires an explicit reviewed mapping. |
| added | pstack/skills/statechart/scripts/test/corpus/CounterInitPast/sany.out | unmapped | — | New resource: requires an explicit reviewed mapping. |
| added | pstack/skills/statechart/scripts/test/corpus/CounterInitPast/verdict-1.exit | unmapped | — | New resource: requires an explicit reviewed mapping. |
| added | pstack/skills/statechart/scripts/test/corpus/CounterInitPast/verdict-1.out | unmapped | — | New resource: requires an explicit reviewed mapping. |
| added | pstack/skills/statechart/scripts/test/corpus/CounterInitPast/verdict-2.out | unmapped | — | New resource: requires an explicit reviewed mapping. |
| added | pstack/skills/statechart/scripts/test/corpus/CounterInitPastHolds/ChartRun.out | unmapped | — | New resource: requires an explicit reviewed mapping. |
| added | pstack/skills/statechart/scripts/test/corpus/CounterInitPastHolds/CounterInitPastHolds.cfg | unmapped | — | New resource: requires an explicit reviewed mapping. |
| added | pstack/skills/statechart/scripts/test/corpus/CounterInitPastHolds/CounterInitPastHolds.tla | unmapped | — | New resource: requires an explicit reviewed mapping. |
| added | pstack/skills/statechart/scripts/test/corpus/CounterInitPastHolds/chart.mmd | unmapped | — | New resource: requires an explicit reviewed mapping. |
| added | pstack/skills/statechart/scripts/test/corpus/CounterInitPastHolds/graph.dot | unmapped | — | New resource: requires an explicit reviewed mapping. |
| added | pstack/skills/statechart/scripts/test/corpus/CounterInitPastHolds/report.md | unmapped | — | New resource: requires an explicit reviewed mapping. |
| added | pstack/skills/statechart/scripts/test/corpus/CounterInitPastHolds/sany.out | unmapped | — | New resource: requires an explicit reviewed mapping. |
| added | pstack/skills/statechart/scripts/test/corpus/CounterInitPastHolds/verdict-1.out | unmapped | — | New resource: requires an explicit reviewed mapping. |
| added | pstack/skills/statechart/scripts/test/corpus/CounterInstance/ChartRun.out | unmapped | — | New resource: requires an explicit reviewed mapping. |
| added | pstack/skills/statechart/scripts/test/corpus/CounterInstance/CounterInstance.cfg | unmapped | — | New resource: requires an explicit reviewed mapping. |
| added | pstack/skills/statechart/scripts/test/corpus/CounterInstance/CounterInstance.tla | unmapped | — | New resource: requires an explicit reviewed mapping. |
| added | pstack/skills/statechart/scripts/test/corpus/CounterInstance/CounterSteps.tla | unmapped | — | New resource: requires an explicit reviewed mapping. |
| added | pstack/skills/statechart/scripts/test/corpus/CounterInstance/chart.mmd | unmapped | — | New resource: requires an explicit reviewed mapping. |
| added | pstack/skills/statechart/scripts/test/corpus/CounterInstance/graph.dot | unmapped | — | New resource: requires an explicit reviewed mapping. |
| added | pstack/skills/statechart/scripts/test/corpus/CounterInstance/report.md | unmapped | — | New resource: requires an explicit reviewed mapping. |
| added | pstack/skills/statechart/scripts/test/corpus/CounterInstance/sany.out | unmapped | — | New resource: requires an explicit reviewed mapping. |
| added | pstack/skills/statechart/scripts/test/corpus/CounterInstance/verdict-1.exit | unmapped | — | New resource: requires an explicit reviewed mapping. |
| added | pstack/skills/statechart/scripts/test/corpus/CounterInstance/verdict-1.out | unmapped | — | New resource: requires an explicit reviewed mapping. |
| added | pstack/skills/statechart/scripts/test/corpus/CounterJump/ChartRun.out | unmapped | — | New resource: requires an explicit reviewed mapping. |
| added | pstack/skills/statechart/scripts/test/corpus/CounterJump/CounterJump.cfg | unmapped | — | New resource: requires an explicit reviewed mapping. |
| added | pstack/skills/statechart/scripts/test/corpus/CounterJump/CounterJump.tla | unmapped | — | New resource: requires an explicit reviewed mapping. |
| added | pstack/skills/statechart/scripts/test/corpus/CounterJump/chart.mmd | unmapped | — | New resource: requires an explicit reviewed mapping. |
| added | pstack/skills/statechart/scripts/test/corpus/CounterJump/graph.dot | unmapped | — | New resource: requires an explicit reviewed mapping. |
| added | pstack/skills/statechart/scripts/test/corpus/CounterJump/report.md | unmapped | — | New resource: requires an explicit reviewed mapping. |
| added | pstack/skills/statechart/scripts/test/corpus/CounterJump/sany.out | unmapped | — | New resource: requires an explicit reviewed mapping. |
| added | pstack/skills/statechart/scripts/test/corpus/CounterJump/verdict-1.exit | unmapped | — | New resource: requires an explicit reviewed mapping. |
| added | pstack/skills/statechart/scripts/test/corpus/CounterJump/verdict-1.out | unmapped | — | New resource: requires an explicit reviewed mapping. |
| added | pstack/skills/statechart/scripts/test/corpus/CounterJump/verdict-2.out | unmapped | — | New resource: requires an explicit reviewed mapping. |
| added | pstack/skills/statechart/scripts/test/corpus/CounterLoop/ChartRun.out | unmapped | — | New resource: requires an explicit reviewed mapping. |
| added | pstack/skills/statechart/scripts/test/corpus/CounterLoop/CounterLoop.cfg | unmapped | — | New resource: requires an explicit reviewed mapping. |
| added | pstack/skills/statechart/scripts/test/corpus/CounterLoop/CounterLoop.tla | unmapped | — | New resource: requires an explicit reviewed mapping. |
| added | pstack/skills/statechart/scripts/test/corpus/CounterLoop/chart.mmd | unmapped | — | New resource: requires an explicit reviewed mapping. |
| added | pstack/skills/statechart/scripts/test/corpus/CounterLoop/graph.dot | unmapped | — | New resource: requires an explicit reviewed mapping. |
| added | pstack/skills/statechart/scripts/test/corpus/CounterLoop/report.md | unmapped | — | New resource: requires an explicit reviewed mapping. |
| added | pstack/skills/statechart/scripts/test/corpus/CounterLoop/sany.out | unmapped | — | New resource: requires an explicit reviewed mapping. |
| added | pstack/skills/statechart/scripts/test/corpus/CounterLoop/verdict-1.exit | unmapped | — | New resource: requires an explicit reviewed mapping. |
| added | pstack/skills/statechart/scripts/test/corpus/CounterLoop/verdict-1.out | unmapped | — | New resource: requires an explicit reviewed mapping. |
| added | pstack/skills/statechart/scripts/test/corpus/CounterOrder/ChartRun.out | unmapped | — | New resource: requires an explicit reviewed mapping. |
| added | pstack/skills/statechart/scripts/test/corpus/CounterOrder/CounterOrder.cfg | unmapped | — | New resource: requires an explicit reviewed mapping. |
| added | pstack/skills/statechart/scripts/test/corpus/CounterOrder/CounterOrder.tla | unmapped | — | New resource: requires an explicit reviewed mapping. |
| added | pstack/skills/statechart/scripts/test/corpus/CounterOrder/chart.mmd | unmapped | — | New resource: requires an explicit reviewed mapping. |
| added | pstack/skills/statechart/scripts/test/corpus/CounterOrder/graph.dot | unmapped | — | New resource: requires an explicit reviewed mapping. |
| added | pstack/skills/statechart/scripts/test/corpus/CounterOrder/report.md | unmapped | — | New resource: requires an explicit reviewed mapping. |
| added | pstack/skills/statechart/scripts/test/corpus/CounterOrder/sany.out | unmapped | — | New resource: requires an explicit reviewed mapping. |
| added | pstack/skills/statechart/scripts/test/corpus/CounterOrder/verdict-1.exit | unmapped | — | New resource: requires an explicit reviewed mapping. |
| added | pstack/skills/statechart/scripts/test/corpus/CounterOrder/verdict-1.out | unmapped | — | New resource: requires an explicit reviewed mapping. |
| added | pstack/skills/statechart/scripts/test/corpus/CounterOrder/verdict-2.exit | unmapped | — | New resource: requires an explicit reviewed mapping. |
| added | pstack/skills/statechart/scripts/test/corpus/CounterOrder/verdict-2.out | unmapped | — | New resource: requires an explicit reviewed mapping. |
| added | pstack/skills/statechart/scripts/test/corpus/CounterRules/ChartRun.out | unmapped | — | New resource: requires an explicit reviewed mapping. |
| added | pstack/skills/statechart/scripts/test/corpus/CounterRules/CounterRules.cfg | unmapped | — | New resource: requires an explicit reviewed mapping. |
| added | pstack/skills/statechart/scripts/test/corpus/CounterRules/CounterRules.tla | unmapped | — | New resource: requires an explicit reviewed mapping. |
| added | pstack/skills/statechart/scripts/test/corpus/CounterRules/Moves.tla | unmapped | — | New resource: requires an explicit reviewed mapping. |
| added | pstack/skills/statechart/scripts/test/corpus/CounterRules/chart.mmd | unmapped | — | New resource: requires an explicit reviewed mapping. |
| added | pstack/skills/statechart/scripts/test/corpus/CounterRules/graph.dot | unmapped | — | New resource: requires an explicit reviewed mapping. |
| added | pstack/skills/statechart/scripts/test/corpus/CounterRules/report.md | unmapped | — | New resource: requires an explicit reviewed mapping. |
| added | pstack/skills/statechart/scripts/test/corpus/CounterRules/sany.out | unmapped | — | New resource: requires an explicit reviewed mapping. |
| added | pstack/skills/statechart/scripts/test/corpus/CounterRules/verdict-1.exit | unmapped | — | New resource: requires an explicit reviewed mapping. |
| added | pstack/skills/statechart/scripts/test/corpus/CounterRules/verdict-1.out | unmapped | — | New resource: requires an explicit reviewed mapping. |
| added | pstack/skills/statechart/scripts/test/corpus/CounterRules/verdict-2.exit | unmapped | — | New resource: requires an explicit reviewed mapping. |
| added | pstack/skills/statechart/scripts/test/corpus/CounterRules/verdict-2.out | unmapped | — | New resource: requires an explicit reviewed mapping. |
| added | pstack/skills/statechart/scripts/test/corpus/CounterRules/verdict-3.exit | unmapped | — | New resource: requires an explicit reviewed mapping. |
| added | pstack/skills/statechart/scripts/test/corpus/CounterRules/verdict-3.out | unmapped | — | New resource: requires an explicit reviewed mapping. |
| added | pstack/skills/statechart/scripts/test/corpus/CounterRules/verdict-4.out | unmapped | — | New resource: requires an explicit reviewed mapping. |
| added | pstack/skills/statechart/scripts/test/corpus/CounterStart/ChartRun.out | unmapped | — | New resource: requires an explicit reviewed mapping. |
| added | pstack/skills/statechart/scripts/test/corpus/CounterStart/CounterStart.cfg | unmapped | — | New resource: requires an explicit reviewed mapping. |
| added | pstack/skills/statechart/scripts/test/corpus/CounterStart/CounterStart.tla | unmapped | — | New resource: requires an explicit reviewed mapping. |
| added | pstack/skills/statechart/scripts/test/corpus/CounterStart/chart.mmd | unmapped | — | New resource: requires an explicit reviewed mapping. |
| added | pstack/skills/statechart/scripts/test/corpus/CounterStart/graph.dot | unmapped | — | New resource: requires an explicit reviewed mapping. |
| added | pstack/skills/statechart/scripts/test/corpus/CounterStart/report.md | unmapped | — | New resource: requires an explicit reviewed mapping. |
| added | pstack/skills/statechart/scripts/test/corpus/CounterStart/sany.out | unmapped | — | New resource: requires an explicit reviewed mapping. |
| added | pstack/skills/statechart/scripts/test/corpus/CounterStart/verdict-1.exit | unmapped | — | New resource: requires an explicit reviewed mapping. |
| added | pstack/skills/statechart/scripts/test/corpus/CounterStart/verdict-1.out | unmapped | — | New resource: requires an explicit reviewed mapping. |
| added | pstack/skills/statechart/scripts/test/corpus/CounterStart/verdict-2.out | unmapped | — | New resource: requires an explicit reviewed mapping. |
| added | pstack/skills/statechart/scripts/test/corpus/CounterStop/ChartRun.out | unmapped | — | New resource: requires an explicit reviewed mapping. |
| added | pstack/skills/statechart/scripts/test/corpus/CounterStop/CounterStop.cfg | unmapped | — | New resource: requires an explicit reviewed mapping. |
| added | pstack/skills/statechart/scripts/test/corpus/CounterStop/CounterStop.tla | unmapped | — | New resource: requires an explicit reviewed mapping. |
| added | pstack/skills/statechart/scripts/test/corpus/CounterStop/chart.mmd | unmapped | — | New resource: requires an explicit reviewed mapping. |
| added | pstack/skills/statechart/scripts/test/corpus/CounterStop/graph.dot | unmapped | — | New resource: requires an explicit reviewed mapping. |
| added | pstack/skills/statechart/scripts/test/corpus/CounterStop/report.md | unmapped | — | New resource: requires an explicit reviewed mapping. |
| added | pstack/skills/statechart/scripts/test/corpus/CounterStop/sany.out | unmapped | — | New resource: requires an explicit reviewed mapping. |
| added | pstack/skills/statechart/scripts/test/corpus/CounterStop/verdict-1.out | unmapped | — | New resource: requires an explicit reviewed mapping. |
| added | pstack/skills/statechart/scripts/test/corpus/CounterTie/ChartRun.out | unmapped | — | New resource: requires an explicit reviewed mapping. |
| added | pstack/skills/statechart/scripts/test/corpus/CounterTie/CounterTie.cfg | unmapped | — | New resource: requires an explicit reviewed mapping. |
| added | pstack/skills/statechart/scripts/test/corpus/CounterTie/CounterTie.tla | unmapped | — | New resource: requires an explicit reviewed mapping. |
| added | pstack/skills/statechart/scripts/test/corpus/CounterTie/chart.mmd | unmapped | — | New resource: requires an explicit reviewed mapping. |
| added | pstack/skills/statechart/scripts/test/corpus/CounterTie/graph.dot | unmapped | — | New resource: requires an explicit reviewed mapping. |
| added | pstack/skills/statechart/scripts/test/corpus/CounterTie/report.md | unmapped | — | New resource: requires an explicit reviewed mapping. |
| added | pstack/skills/statechart/scripts/test/corpus/CounterTie/sany.out | unmapped | — | New resource: requires an explicit reviewed mapping. |
| added | pstack/skills/statechart/scripts/test/corpus/CounterTie/verdict-1.exit | unmapped | — | New resource: requires an explicit reviewed mapping. |
| added | pstack/skills/statechart/scripts/test/corpus/CounterTie/verdict-1.out | unmapped | — | New resource: requires an explicit reviewed mapping. |
| added | pstack/skills/statechart/scripts/test/corpus/CounterTie/verdict-2.exit | unmapped | — | New resource: requires an explicit reviewed mapping. |
| added | pstack/skills/statechart/scripts/test/corpus/CounterTie/verdict-2.out | unmapped | — | New resource: requires an explicit reviewed mapping. |
| added | pstack/skills/statechart/scripts/test/corpus/CounterTie/verdict-3.exit | unmapped | — | New resource: requires an explicit reviewed mapping. |
| added | pstack/skills/statechart/scripts/test/corpus/CounterTie/verdict-3.out | unmapped | — | New resource: requires an explicit reviewed mapping. |
| added | pstack/skills/statechart/scripts/test/corpus/CounterTie/verdict-4.out | unmapped | — | New resource: requires an explicit reviewed mapping. |
| added | pstack/skills/statechart/scripts/test/corpus/CounterTieInGraph/ChartRun.out | unmapped | — | New resource: requires an explicit reviewed mapping. |
| added | pstack/skills/statechart/scripts/test/corpus/CounterTieInGraph/CounterTieInGraph.cfg | unmapped | — | New resource: requires an explicit reviewed mapping. |
| added | pstack/skills/statechart/scripts/test/corpus/CounterTieInGraph/CounterTieInGraph.tla | unmapped | — | New resource: requires an explicit reviewed mapping. |
| added | pstack/skills/statechart/scripts/test/corpus/CounterTieInGraph/chart.mmd | unmapped | — | New resource: requires an explicit reviewed mapping. |
| added | pstack/skills/statechart/scripts/test/corpus/CounterTieInGraph/graph.dot | unmapped | — | New resource: requires an explicit reviewed mapping. |
| added | pstack/skills/statechart/scripts/test/corpus/CounterTieInGraph/report.md | unmapped | — | New resource: requires an explicit reviewed mapping. |
| added | pstack/skills/statechart/scripts/test/corpus/CounterTieInGraph/sany.out | unmapped | — | New resource: requires an explicit reviewed mapping. |
| added | pstack/skills/statechart/scripts/test/corpus/CounterTieInGraph/verdict-1.exit | unmapped | — | New resource: requires an explicit reviewed mapping. |
| added | pstack/skills/statechart/scripts/test/corpus/CounterTieInGraph/verdict-1.out | unmapped | — | New resource: requires an explicit reviewed mapping. |
| added | pstack/skills/statechart/scripts/test/corpus/CounterTieInGraph/verdict-2.out | unmapped | — | New resource: requires an explicit reviewed mapping. |
| added | pstack/skills/statechart/scripts/test/corpus/CounterView/ChartRun.out | unmapped | — | New resource: requires an explicit reviewed mapping. |
| added | pstack/skills/statechart/scripts/test/corpus/CounterView/CounterView.cfg | unmapped | — | New resource: requires an explicit reviewed mapping. |
| added | pstack/skills/statechart/scripts/test/corpus/CounterView/CounterView.tla | unmapped | — | New resource: requires an explicit reviewed mapping. |
| added | pstack/skills/statechart/scripts/test/corpus/CounterView/chart.mmd | unmapped | — | New resource: requires an explicit reviewed mapping. |
| added | pstack/skills/statechart/scripts/test/corpus/CounterView/graph.dot | unmapped | — | New resource: requires an explicit reviewed mapping. |
| added | pstack/skills/statechart/scripts/test/corpus/CounterView/report.md | unmapped | — | New resource: requires an explicit reviewed mapping. |
| added | pstack/skills/statechart/scripts/test/corpus/CounterView/sany.out | unmapped | — | New resource: requires an explicit reviewed mapping. |
| added | pstack/skills/statechart/scripts/test/corpus/CounterView/verdict-1.exit | unmapped | — | New resource: requires an explicit reviewed mapping. |
| added | pstack/skills/statechart/scripts/test/corpus/CounterView/verdict-1.out | unmapped | — | New resource: requires an explicit reviewed mapping. |
| added | pstack/skills/statechart/scripts/test/corpus/CounterView/verdict-2.exit | unmapped | — | New resource: requires an explicit reviewed mapping. |
| added | pstack/skills/statechart/scripts/test/corpus/CounterView/verdict-2.out | unmapped | — | New resource: requires an explicit reviewed mapping. |
| added | pstack/skills/statechart/scripts/test/corpus/CounterView/verdict-3.exit | unmapped | — | New resource: requires an explicit reviewed mapping. |
| added | pstack/skills/statechart/scripts/test/corpus/CounterView/verdict-3.out | unmapped | — | New resource: requires an explicit reviewed mapping. |
| added | pstack/skills/statechart/scripts/test/corpus/CounterView/verdict-4.out | unmapped | — | New resource: requires an explicit reviewed mapping. |
| added | pstack/skills/statechart/scripts/test/corpus/CounterView/view.mjs | unmapped | — | New resource: requires an explicit reviewed mapping. |
| added | pstack/skills/statechart/scripts/test/corpus/DieHard/ChartRun.out | unmapped | — | New resource: requires an explicit reviewed mapping. |
| added | pstack/skills/statechart/scripts/test/corpus/DieHard/DieHard.cfg | unmapped | — | New resource: requires an explicit reviewed mapping. |
| added | pstack/skills/statechart/scripts/test/corpus/DieHard/DieHard.tla | unmapped | — | New resource: requires an explicit reviewed mapping. |
| added | pstack/skills/statechart/scripts/test/corpus/DieHard/chart.mmd | unmapped | — | New resource: requires an explicit reviewed mapping. |
| added | pstack/skills/statechart/scripts/test/corpus/DieHard/graph.dot | unmapped | — | New resource: requires an explicit reviewed mapping. |
| added | pstack/skills/statechart/scripts/test/corpus/DieHard/report.md | unmapped | — | New resource: requires an explicit reviewed mapping. |
| added | pstack/skills/statechart/scripts/test/corpus/DieHard/sany.out | unmapped | — | New resource: requires an explicit reviewed mapping. |
| added | pstack/skills/statechart/scripts/test/corpus/DieHard/verdict-1.exit | unmapped | — | New resource: requires an explicit reviewed mapping. |
| added | pstack/skills/statechart/scripts/test/corpus/DieHard/verdict-1.out | unmapped | — | New resource: requires an explicit reviewed mapping. |
| added | pstack/skills/statechart/scripts/test/corpus/DieHard/verdict-2.out | unmapped | — | New resource: requires an explicit reviewed mapping. |
| added | pstack/skills/statechart/scripts/test/corpus/FirstRule/ChartRun.out | unmapped | — | New resource: requires an explicit reviewed mapping. |
| added | pstack/skills/statechart/scripts/test/corpus/FirstRule/FirstRule.cfg | unmapped | — | New resource: requires an explicit reviewed mapping. |
| added | pstack/skills/statechart/scripts/test/corpus/FirstRule/FirstRule.tla | unmapped | — | New resource: requires an explicit reviewed mapping. |
| added | pstack/skills/statechart/scripts/test/corpus/FirstRule/chart.mmd | unmapped | — | New resource: requires an explicit reviewed mapping. |
| added | pstack/skills/statechart/scripts/test/corpus/FirstRule/graph.dot | unmapped | — | New resource: requires an explicit reviewed mapping. |
| added | pstack/skills/statechart/scripts/test/corpus/FirstRule/report.md | unmapped | — | New resource: requires an explicit reviewed mapping. |
| added | pstack/skills/statechart/scripts/test/corpus/FirstRule/sany.out | unmapped | — | New resource: requires an explicit reviewed mapping. |
| added | pstack/skills/statechart/scripts/test/corpus/FirstRule/verdict-1.exit | unmapped | — | New resource: requires an explicit reviewed mapping. |
| added | pstack/skills/statechart/scripts/test/corpus/FirstRule/verdict-1.out | unmapped | — | New resource: requires an explicit reviewed mapping. |
| added | pstack/skills/statechart/scripts/test/corpus/FirstRule/verdict-2.exit | unmapped | — | New resource: requires an explicit reviewed mapping. |
| added | pstack/skills/statechart/scripts/test/corpus/FirstRule/verdict-2.out | unmapped | — | New resource: requires an explicit reviewed mapping. |
| added | pstack/skills/statechart/scripts/test/corpus/FirstRule/verdict-3.exit | unmapped | — | New resource: requires an explicit reviewed mapping. |
| added | pstack/skills/statechart/scripts/test/corpus/FirstRule/verdict-3.out | unmapped | — | New resource: requires an explicit reviewed mapping. |
| added | pstack/skills/statechart/scripts/test/corpus/FirstRule/verdict-4.exit | unmapped | — | New resource: requires an explicit reviewed mapping. |
| added | pstack/skills/statechart/scripts/test/corpus/FirstRule/verdict-4.out | unmapped | — | New resource: requires an explicit reviewed mapping. |
| added | pstack/skills/statechart/scripts/test/corpus/HiddenClock/ChartRun.out | unmapped | — | New resource: requires an explicit reviewed mapping. |
| added | pstack/skills/statechart/scripts/test/corpus/HiddenClock/HiddenClock.cfg | unmapped | — | New resource: requires an explicit reviewed mapping. |
| added | pstack/skills/statechart/scripts/test/corpus/HiddenClock/HiddenClock.tla | unmapped | — | New resource: requires an explicit reviewed mapping. |
| added | pstack/skills/statechart/scripts/test/corpus/HiddenClock/chart.mmd | unmapped | — | New resource: requires an explicit reviewed mapping. |
| added | pstack/skills/statechart/scripts/test/corpus/HiddenClock/graph.dot | unmapped | — | New resource: requires an explicit reviewed mapping. |
| added | pstack/skills/statechart/scripts/test/corpus/HiddenClock/report.md | unmapped | — | New resource: requires an explicit reviewed mapping. |
| added | pstack/skills/statechart/scripts/test/corpus/HiddenClock/sany.out | unmapped | — | New resource: requires an explicit reviewed mapping. |
| added | pstack/skills/statechart/scripts/test/corpus/HiddenClock/verdict-1.exit | unmapped | — | New resource: requires an explicit reviewed mapping. |
| added | pstack/skills/statechart/scripts/test/corpus/HiddenClock/verdict-1.out | unmapped | — | New resource: requires an explicit reviewed mapping. |
| added | pstack/skills/statechart/scripts/test/corpus/Login/ChartRun.out | unmapped | — | New resource: requires an explicit reviewed mapping. |
| added | pstack/skills/statechart/scripts/test/corpus/Login/Login.cfg | unmapped | — | New resource: requires an explicit reviewed mapping. |
| added | pstack/skills/statechart/scripts/test/corpus/Login/Login.tla | unmapped | — | New resource: requires an explicit reviewed mapping. |
| added | pstack/skills/statechart/scripts/test/corpus/Login/chart.mmd | unmapped | — | New resource: requires an explicit reviewed mapping. |
| added | pstack/skills/statechart/scripts/test/corpus/Login/graph.dot | unmapped | — | New resource: requires an explicit reviewed mapping. |
| added | pstack/skills/statechart/scripts/test/corpus/Login/report.md | unmapped | — | New resource: requires an explicit reviewed mapping. |
| added | pstack/skills/statechart/scripts/test/corpus/Login/sany.out | unmapped | — | New resource: requires an explicit reviewed mapping. |
| added | pstack/skills/statechart/scripts/test/corpus/Login/verdict-1.out | unmapped | — | New resource: requires an explicit reviewed mapping. |
| added | pstack/skills/statechart/scripts/test/corpus/Login/view.mjs | unmapped | — | New resource: requires an explicit reviewed mapping. |
| added | pstack/skills/statechart/scripts/test/corpus/LoginGuarded/ChartRun.out | unmapped | — | New resource: requires an explicit reviewed mapping. |
| added | pstack/skills/statechart/scripts/test/corpus/LoginGuarded/LoginGuarded.cfg | unmapped | — | New resource: requires an explicit reviewed mapping. |
| added | pstack/skills/statechart/scripts/test/corpus/LoginGuarded/LoginGuarded.tla | unmapped | — | New resource: requires an explicit reviewed mapping. |
| added | pstack/skills/statechart/scripts/test/corpus/LoginGuarded/chart.mmd | unmapped | — | New resource: requires an explicit reviewed mapping. |
| added | pstack/skills/statechart/scripts/test/corpus/LoginGuarded/graph.dot | unmapped | — | New resource: requires an explicit reviewed mapping. |
| added | pstack/skills/statechart/scripts/test/corpus/LoginGuarded/report.md | unmapped | — | New resource: requires an explicit reviewed mapping. |
| added | pstack/skills/statechart/scripts/test/corpus/LoginGuarded/sany.out | unmapped | — | New resource: requires an explicit reviewed mapping. |
| added | pstack/skills/statechart/scripts/test/corpus/LoginGuarded/verdict-1.out | unmapped | — | New resource: requires an explicit reviewed mapping. |
| added | pstack/skills/statechart/scripts/test/corpus/LoginGuarded/view.mjs | unmapped | — | New resource: requires an explicit reviewed mapping. |
| added | pstack/skills/statechart/scripts/test/corpus/LoginParallel/ChartRun.out | unmapped | — | New resource: requires an explicit reviewed mapping. |
| added | pstack/skills/statechart/scripts/test/corpus/LoginParallel/LoginParallel.cfg | unmapped | — | New resource: requires an explicit reviewed mapping. |
| added | pstack/skills/statechart/scripts/test/corpus/LoginParallel/LoginParallel.tla | unmapped | — | New resource: requires an explicit reviewed mapping. |
| added | pstack/skills/statechart/scripts/test/corpus/LoginParallel/chart.mmd | unmapped | — | New resource: requires an explicit reviewed mapping. |
| added | pstack/skills/statechart/scripts/test/corpus/LoginParallel/graph.dot | unmapped | — | New resource: requires an explicit reviewed mapping. |
| added | pstack/skills/statechart/scripts/test/corpus/LoginParallel/report.md | unmapped | — | New resource: requires an explicit reviewed mapping. |
| added | pstack/skills/statechart/scripts/test/corpus/LoginParallel/sany.out | unmapped | — | New resource: requires an explicit reviewed mapping. |
| added | pstack/skills/statechart/scripts/test/corpus/LoginParallel/verdict-1.exit | unmapped | — | New resource: requires an explicit reviewed mapping. |
| added | pstack/skills/statechart/scripts/test/corpus/LoginParallel/verdict-1.out | unmapped | — | New resource: requires an explicit reviewed mapping. |
| added | pstack/skills/statechart/scripts/test/corpus/LoginParallel/verdict-2.out | unmapped | — | New resource: requires an explicit reviewed mapping. |
| added | pstack/skills/statechart/scripts/test/corpus/LoginParallel/view.mjs | unmapped | — | New resource: requires an explicit reviewed mapping. |
| added | pstack/skills/statechart/scripts/test/corpus/MediaPlayer/ChartRun.out | unmapped | — | New resource: requires an explicit reviewed mapping. |
| added | pstack/skills/statechart/scripts/test/corpus/MediaPlayer/MediaPlayer.cfg | unmapped | — | New resource: requires an explicit reviewed mapping. |
| added | pstack/skills/statechart/scripts/test/corpus/MediaPlayer/MediaPlayer.tla | unmapped | — | New resource: requires an explicit reviewed mapping. |
| added | pstack/skills/statechart/scripts/test/corpus/MediaPlayer/chart.mmd | unmapped | — | New resource: requires an explicit reviewed mapping. |
| added | pstack/skills/statechart/scripts/test/corpus/MediaPlayer/graph.dot | unmapped | — | New resource: requires an explicit reviewed mapping. |
| added | pstack/skills/statechart/scripts/test/corpus/MediaPlayer/report.md | unmapped | — | New resource: requires an explicit reviewed mapping. |
| added | pstack/skills/statechart/scripts/test/corpus/MediaPlayer/sany.out | unmapped | — | New resource: requires an explicit reviewed mapping. |
| added | pstack/skills/statechart/scripts/test/corpus/MediaPlayer/verdict-1.exit | unmapped | — | New resource: requires an explicit reviewed mapping. |
| added | pstack/skills/statechart/scripts/test/corpus/MediaPlayer/verdict-1.out | unmapped | — | New resource: requires an explicit reviewed mapping. |
| added | pstack/skills/statechart/scripts/test/corpus/MediaPlayer/verdict-2.out | unmapped | — | New resource: requires an explicit reviewed mapping. |
| added | pstack/skills/statechart/scripts/test/corpus/MediaPlayer/view.mjs | unmapped | — | New resource: requires an explicit reviewed mapping. |
| added | pstack/skills/statechart/scripts/test/corpus/MediaPlayerFixed/ChartRun.out | unmapped | — | New resource: requires an explicit reviewed mapping. |
| added | pstack/skills/statechart/scripts/test/corpus/MediaPlayerFixed/MediaPlayerFixed.cfg | unmapped | — | New resource: requires an explicit reviewed mapping. |
| added | pstack/skills/statechart/scripts/test/corpus/MediaPlayerFixed/MediaPlayerFixed.tla | unmapped | — | New resource: requires an explicit reviewed mapping. |
| added | pstack/skills/statechart/scripts/test/corpus/MediaPlayerFixed/chart.mmd | unmapped | — | New resource: requires an explicit reviewed mapping. |
| added | pstack/skills/statechart/scripts/test/corpus/MediaPlayerFixed/graph.dot | unmapped | — | New resource: requires an explicit reviewed mapping. |
| added | pstack/skills/statechart/scripts/test/corpus/MediaPlayerFixed/report.md | unmapped | — | New resource: requires an explicit reviewed mapping. |
| added | pstack/skills/statechart/scripts/test/corpus/MediaPlayerFixed/sany.out | unmapped | — | New resource: requires an explicit reviewed mapping. |
| added | pstack/skills/statechart/scripts/test/corpus/MediaPlayerFixed/verdict-1.out | unmapped | — | New resource: requires an explicit reviewed mapping. |
| added | pstack/skills/statechart/scripts/test/corpus/MediaPlayerFixed/view.mjs | unmapped | — | New resource: requires an explicit reviewed mapping. |
| added | pstack/skills/statechart/scripts/test/corpus/MediaPlayerProps/ChartRun.out | unmapped | — | New resource: requires an explicit reviewed mapping. |
| added | pstack/skills/statechart/scripts/test/corpus/MediaPlayerProps/MediaPlayer.tla | unmapped | — | New resource: requires an explicit reviewed mapping. |
| added | pstack/skills/statechart/scripts/test/corpus/MediaPlayerProps/MediaPlayerProps.cfg | unmapped | — | New resource: requires an explicit reviewed mapping. |
| added | pstack/skills/statechart/scripts/test/corpus/MediaPlayerProps/MediaPlayerProps.tla | unmapped | — | New resource: requires an explicit reviewed mapping. |
| added | pstack/skills/statechart/scripts/test/corpus/MediaPlayerProps/chart.mmd | unmapped | — | New resource: requires an explicit reviewed mapping. |
| added | pstack/skills/statechart/scripts/test/corpus/MediaPlayerProps/graph.dot | unmapped | — | New resource: requires an explicit reviewed mapping. |
| added | pstack/skills/statechart/scripts/test/corpus/MediaPlayerProps/report.md | unmapped | — | New resource: requires an explicit reviewed mapping. |
| added | pstack/skills/statechart/scripts/test/corpus/MediaPlayerProps/sany.out | unmapped | — | New resource: requires an explicit reviewed mapping. |
| added | pstack/skills/statechart/scripts/test/corpus/MediaPlayerProps/verdict-1.exit | unmapped | — | New resource: requires an explicit reviewed mapping. |
| added | pstack/skills/statechart/scripts/test/corpus/MediaPlayerProps/verdict-1.out | unmapped | — | New resource: requires an explicit reviewed mapping. |
| added | pstack/skills/statechart/scripts/test/corpus/MediaPlayerProps/verdict-2.out | unmapped | — | New resource: requires an explicit reviewed mapping. |
| added | pstack/skills/statechart/scripts/test/corpus/MediaPlayerProps/verdict-3.out | unmapped | — | New resource: requires an explicit reviewed mapping. |
| added | pstack/skills/statechart/scripts/test/corpus/MediaPlayerProps/verdict-4.exit | unmapped | — | New resource: requires an explicit reviewed mapping. |
| added | pstack/skills/statechart/scripts/test/corpus/MediaPlayerProps/verdict-4.out | unmapped | — | New resource: requires an explicit reviewed mapping. |
| added | pstack/skills/statechart/scripts/test/corpus/MediaPlayerProps/verdict-5.exit | unmapped | — | New resource: requires an explicit reviewed mapping. |
| added | pstack/skills/statechart/scripts/test/corpus/MediaPlayerProps/verdict-5.out | unmapped | — | New resource: requires an explicit reviewed mapping. |
| added | pstack/skills/statechart/scripts/test/corpus/MediaPlayerProps/verdict-6.out | unmapped | — | New resource: requires an explicit reviewed mapping. |
| added | pstack/skills/statechart/scripts/test/corpus/MediaPlayerProps/view.mjs | unmapped | — | New resource: requires an explicit reviewed mapping. |
| added | pstack/skills/statechart/scripts/test/corpus/PickWorker/ChartRun.out | unmapped | — | New resource: requires an explicit reviewed mapping. |
| added | pstack/skills/statechart/scripts/test/corpus/PickWorker/PickWorker.cfg | unmapped | — | New resource: requires an explicit reviewed mapping. |
| added | pstack/skills/statechart/scripts/test/corpus/PickWorker/PickWorker.tla | unmapped | — | New resource: requires an explicit reviewed mapping. |
| added | pstack/skills/statechart/scripts/test/corpus/PickWorker/chart.mmd | unmapped | — | New resource: requires an explicit reviewed mapping. |
| added | pstack/skills/statechart/scripts/test/corpus/PickWorker/graph.dot | unmapped | — | New resource: requires an explicit reviewed mapping. |
| added | pstack/skills/statechart/scripts/test/corpus/PickWorker/report.md | unmapped | — | New resource: requires an explicit reviewed mapping. |
| added | pstack/skills/statechart/scripts/test/corpus/PickWorker/sany.out | unmapped | — | New resource: requires an explicit reviewed mapping. |
| added | pstack/skills/statechart/scripts/test/corpus/PickWorker/verdict-1.out | unmapped | — | New resource: requires an explicit reviewed mapping. |
| added | pstack/skills/statechart/scripts/test/corpus/Shadow/ChartRun.out | unmapped | — | New resource: requires an explicit reviewed mapping. |
| added | pstack/skills/statechart/scripts/test/corpus/Shadow/Shadow.cfg | unmapped | — | New resource: requires an explicit reviewed mapping. |
| added | pstack/skills/statechart/scripts/test/corpus/Shadow/Shadow.tla | unmapped | — | New resource: requires an explicit reviewed mapping. |
| added | pstack/skills/statechart/scripts/test/corpus/Shadow/ShadowLib.tla | unmapped | — | New resource: requires an explicit reviewed mapping. |
| added | pstack/skills/statechart/scripts/test/corpus/Shadow/ShadowSub.tla | unmapped | — | New resource: requires an explicit reviewed mapping. |
| added | pstack/skills/statechart/scripts/test/corpus/Shadow/chart.mmd | unmapped | — | New resource: requires an explicit reviewed mapping. |
| added | pstack/skills/statechart/scripts/test/corpus/Shadow/graph.dot | unmapped | — | New resource: requires an explicit reviewed mapping. |
| added | pstack/skills/statechart/scripts/test/corpus/Shadow/report.md | unmapped | — | New resource: requires an explicit reviewed mapping. |
| added | pstack/skills/statechart/scripts/test/corpus/Shadow/sany.out | unmapped | — | New resource: requires an explicit reviewed mapping. |
| added | pstack/skills/statechart/scripts/test/corpus/Shadow/verdict-1.out | unmapped | — | New resource: requires an explicit reviewed mapping. |
| added | pstack/skills/statechart/scripts/test/corpus/SpacedNames/ChartRun.out | unmapped | — | New resource: requires an explicit reviewed mapping. |
| added | pstack/skills/statechart/scripts/test/corpus/SpacedNames/SpacedNames.cfg | unmapped | — | New resource: requires an explicit reviewed mapping. |
| added | pstack/skills/statechart/scripts/test/corpus/SpacedNames/SpacedNames.tla | unmapped | — | New resource: requires an explicit reviewed mapping. |
| added | pstack/skills/statechart/scripts/test/corpus/SpacedNames/chart.mmd | unmapped | — | New resource: requires an explicit reviewed mapping. |
| added | pstack/skills/statechart/scripts/test/corpus/SpacedNames/graph.dot | unmapped | — | New resource: requires an explicit reviewed mapping. |
| added | pstack/skills/statechart/scripts/test/corpus/SpacedNames/report.md | unmapped | — | New resource: requires an explicit reviewed mapping. |
| added | pstack/skills/statechart/scripts/test/corpus/SpacedNames/sany.out | unmapped | — | New resource: requires an explicit reviewed mapping. |
| added | pstack/skills/statechart/scripts/test/corpus/SpacedNames/verdict-1.exit | unmapped | — | New resource: requires an explicit reviewed mapping. |
| added | pstack/skills/statechart/scripts/test/corpus/SpacedNames/verdict-1.out | unmapped | — | New resource: requires an explicit reviewed mapping. |
| added | pstack/skills/statechart/scripts/test/corpus/SpacedNames/verdict-2.exit | unmapped | — | New resource: requires an explicit reviewed mapping. |
| added | pstack/skills/statechart/scripts/test/corpus/SpacedNames/verdict-2.out | unmapped | — | New resource: requires an explicit reviewed mapping. |
| added | pstack/skills/statechart/scripts/test/corpus/TwoPhase/ChartRun.out | unmapped | — | New resource: requires an explicit reviewed mapping. |
| added | pstack/skills/statechart/scripts/test/corpus/TwoPhase/TwoPhase.cfg | unmapped | — | New resource: requires an explicit reviewed mapping. |
| added | pstack/skills/statechart/scripts/test/corpus/TwoPhase/TwoPhase.tla | unmapped | — | New resource: requires an explicit reviewed mapping. |
| added | pstack/skills/statechart/scripts/test/corpus/TwoPhase/chart.mmd | unmapped | — | New resource: requires an explicit reviewed mapping. |
| added | pstack/skills/statechart/scripts/test/corpus/TwoPhase/graph.dot | unmapped | — | New resource: requires an explicit reviewed mapping. |
| added | pstack/skills/statechart/scripts/test/corpus/TwoPhase/report.md | unmapped | — | New resource: requires an explicit reviewed mapping. |
| added | pstack/skills/statechart/scripts/test/corpus/TwoPhase/sany.out | unmapped | — | New resource: requires an explicit reviewed mapping. |
| added | pstack/skills/statechart/scripts/test/corpus/TwoPhase/verdict-1.exit | unmapped | — | New resource: requires an explicit reviewed mapping. |
| added | pstack/skills/statechart/scripts/test/corpus/TwoPhase/verdict-1.out | unmapped | — | New resource: requires an explicit reviewed mapping. |
| added | pstack/skills/statechart/scripts/test/corpus/TwoPhase/verdict-2.out | unmapped | — | New resource: requires an explicit reviewed mapping. |
| added | pstack/skills/statechart/scripts/test/corpus/TwoPhase/view.mjs | unmapped | — | New resource: requires an explicit reviewed mapping. |
| added | pstack/skills/statechart/scripts/test/corpus/TwoPhaseFixed/ChartRun.out | unmapped | — | New resource: requires an explicit reviewed mapping. |
| added | pstack/skills/statechart/scripts/test/corpus/TwoPhaseFixed/TwoPhaseFixed.cfg | unmapped | — | New resource: requires an explicit reviewed mapping. |
| added | pstack/skills/statechart/scripts/test/corpus/TwoPhaseFixed/TwoPhaseFixed.tla | unmapped | — | New resource: requires an explicit reviewed mapping. |
| added | pstack/skills/statechart/scripts/test/corpus/TwoPhaseFixed/chart.mmd | unmapped | — | New resource: requires an explicit reviewed mapping. |
| added | pstack/skills/statechart/scripts/test/corpus/TwoPhaseFixed/graph.dot | unmapped | — | New resource: requires an explicit reviewed mapping. |
| added | pstack/skills/statechart/scripts/test/corpus/TwoPhaseFixed/report.md | unmapped | — | New resource: requires an explicit reviewed mapping. |
| added | pstack/skills/statechart/scripts/test/corpus/TwoPhaseFixed/sany.out | unmapped | — | New resource: requires an explicit reviewed mapping. |
| added | pstack/skills/statechart/scripts/test/corpus/TwoPhaseFixed/verdict-1.out | unmapped | — | New resource: requires an explicit reviewed mapping. |
| added | pstack/skills/statechart/scripts/test/corpus/TwoPhaseFixed/view.mjs | unmapped | — | New resource: requires an explicit reviewed mapping. |
| added | pstack/skills/statechart/scripts/test/corpus/TypeGuard/ChartRun.exit | unmapped | — | New resource: requires an explicit reviewed mapping. |
| added | pstack/skills/statechart/scripts/test/corpus/TypeGuard/ChartRun.out | unmapped | — | New resource: requires an explicit reviewed mapping. |
| added | pstack/skills/statechart/scripts/test/corpus/TypeGuard/TypeGuard.cfg | unmapped | — | New resource: requires an explicit reviewed mapping. |
| added | pstack/skills/statechart/scripts/test/corpus/TypeGuard/TypeGuard.tla | unmapped | — | New resource: requires an explicit reviewed mapping. |
| added | pstack/skills/statechart/scripts/test/corpus/TypeGuard/chart.mmd | unmapped | — | New resource: requires an explicit reviewed mapping. |
| added | pstack/skills/statechart/scripts/test/corpus/TypeGuard/graph.dot | unmapped | — | New resource: requires an explicit reviewed mapping. |
| added | pstack/skills/statechart/scripts/test/corpus/TypeGuard/report.md | unmapped | — | New resource: requires an explicit reviewed mapping. |
| added | pstack/skills/statechart/scripts/test/corpus/TypeGuard/sany.out | unmapped | — | New resource: requires an explicit reviewed mapping. |
| added | pstack/skills/statechart/scripts/test/corpus/TypeGuard/verdict-1.exit | unmapped | — | New resource: requires an explicit reviewed mapping. |
| added | pstack/skills/statechart/scripts/test/corpus/TypeGuard/verdict-1.out | unmapped | — | New resource: requires an explicit reviewed mapping. |
| added | pstack/skills/statechart/scripts/test/corpus/TypeGuard/verdict-2.exit | unmapped | — | New resource: requires an explicit reviewed mapping. |
| added | pstack/skills/statechart/scripts/test/corpus/TypeGuard/verdict-2.out | unmapped | — | New resource: requires an explicit reviewed mapping. |
| added | pstack/skills/statechart/scripts/test/corpus/UserNoDeadlock/ChartRun.out | unmapped | — | New resource: requires an explicit reviewed mapping. |
| added | pstack/skills/statechart/scripts/test/corpus/UserNoDeadlock/UserNoDeadlock.cfg | unmapped | — | New resource: requires an explicit reviewed mapping. |
| added | pstack/skills/statechart/scripts/test/corpus/UserNoDeadlock/UserNoDeadlock.tla | unmapped | — | New resource: requires an explicit reviewed mapping. |
| added | pstack/skills/statechart/scripts/test/corpus/UserNoDeadlock/chart.mmd | unmapped | — | New resource: requires an explicit reviewed mapping. |
| added | pstack/skills/statechart/scripts/test/corpus/UserNoDeadlock/graph.dot | unmapped | — | New resource: requires an explicit reviewed mapping. |
| added | pstack/skills/statechart/scripts/test/corpus/UserNoDeadlock/report.md | unmapped | — | New resource: requires an explicit reviewed mapping. |
| added | pstack/skills/statechart/scripts/test/corpus/UserNoDeadlock/sany.out | unmapped | — | New resource: requires an explicit reviewed mapping. |
| added | pstack/skills/statechart/scripts/test/corpus/UserNoDeadlock/verdict-1.exit | unmapped | — | New resource: requires an explicit reviewed mapping. |
| added | pstack/skills/statechart/scripts/test/corpus/UserNoDeadlock/verdict-1.out | unmapped | — | New resource: requires an explicit reviewed mapping. |
| added | pstack/skills/statechart/scripts/test/corpus/UserNoDeadlock/verdict-2.exit | unmapped | — | New resource: requires an explicit reviewed mapping. |
| added | pstack/skills/statechart/scripts/test/corpus/UserNoDeadlock/verdict-2.out | unmapped | — | New resource: requires an explicit reviewed mapping. |
| added | pstack/skills/statechart/scripts/test/differential.test.ts | unmapped | — | New resource: requires an explicit reviewed mapping. |
| added | pstack/skills/statechart/scripts/test/grid/Grid.cfg | unmapped | — | New resource: requires an explicit reviewed mapping. |
| added | pstack/skills/statechart/scripts/test/grid/Grid.tla | unmapped | — | New resource: requires an explicit reviewed mapping. |
| added | pstack/skills/statechart/scripts/test/grid/sany.out | unmapped | — | New resource: requires an explicit reviewed mapping. |
| added | pstack/skills/statechart/scripts/test/java.ts | unmapped | — | New resource: requires an explicit reviewed mapping. |
| added | pstack/skills/statechart/scripts/test/labels.ts | unmapped | — | New resource: requires an explicit reviewed mapping. |
| added | pstack/skills/statechart/scripts/test/messages.test.ts | unmapped | — | New resource: requires an explicit reviewed mapping. |
| added | pstack/skills/statechart/scripts/test/pipeline.test.ts | unmapped | — | New resource: requires an explicit reviewed mapping. |
| added | pstack/skills/statechart/scripts/test/plain-tlc.test.ts | unmapped | — | New resource: requires an explicit reviewed mapping. |
| removed | pstack/skills/statechart/scripts/test/regions.mmd | mapped | scripts/test_statechart.mjs; scripts/test_statechart_values.mjs | The parallel-region display fixture is not installed as a runtime asset. Changes route to the portable statechart test suites for coverage review; their local fixtures are not copies and do not promise identical scenario coverage. |
| added | pstack/skills/statechart/scripts/test/render.test.ts | unmapped | — | New resource: requires an explicit reviewed mapping. |
| removed | pstack/skills/statechart/scripts/test/statechart.test.mjs | mapped | scripts/test_statechart.mjs; scripts/test_statechart_values.mjs | The upstream suite remains in the source snapshot; portable tests exercise the active helpers and adaptation regressions. Review changed source cases here, without claiming one-for-one case coverage. |
| removed | pstack/skills/statechart/scripts/test/sync.mmd | mapped | scripts/test_statechart.mjs; scripts/test_statechart_values.mjs | The parallel-region synchronization and forbidden states fixture is not installed as a runtime asset. Changes route to the portable statechart test suites for coverage review; their local fixtures are not copies and do not promise identical scenario coverage. |
| added | pstack/skills/statechart/scripts/test/tlc-out.test.ts | unmapped | — | New resource: requires an explicit reviewed mapping. |
| added | pstack/skills/statechart/scripts/test/tlc.ts | unmapped | — | New resource: requires an explicit reviewed mapping. |
| removed | pstack/skills/statechart/scripts/test/upload.mmd | mapped | scripts/test_statechart.mjs; scripts/test_statechart_values.mjs | The composite upload transitions fixture is not installed as a runtime asset. Changes route to the portable statechart test suites for coverage review; their local fixtures are not copies and do not promise identical scenario coverage. |
| removed | pstack/skills/statechart/scripts/tlc-to-chart-args.mjs | mapped | skills/statechart/scripts/tlc-to-chart-args.mjs | Retained upstream implementation; checkout line endings or subsequent local edits may differ. This production module is installed under the active statechart skill; upstream changes must be reviewed together with the modified CLI/runtime boundary. |
| removed | pstack/skills/statechart/scripts/tlc-to-chart.mjs | mapped | skills/statechart/scripts/tlc-to-chart.mjs | Retained upstream implementation; checkout line endings or subsequent local edits may differ. This production module is installed under the active statechart skill; upstream changes must be reviewed together with the modified CLI/runtime boundary. |
| removed | pstack/skills/statechart/scripts/tlc-tools.mjs | mapped | skills/statechart/scripts/tlc-tools.mjs | TLC setup uses an existing configured JAR and Java executable; automatic mise/Java/TLC downloads are removed. |
| added | pstack/skills/statechart/scripts/tsconfig.json | unmapped | — | New resource: requires an explicit reviewed mapping. |
| removed | pstack/skills/statechart/scripts/ways-in.mjs | mapped | skills/statechart/scripts/ways-in.mjs | Retained upstream implementation; checkout line endings or subsequent local edits may differ. This production module is installed under the active statechart skill; upstream changes must be reviewed together with the modified CLI/runtime boundary. |
| added | pstack/skills/statechart/scripts/worker.ts | unmapped | — | New resource: requires an explicit reviewed mapping. |
