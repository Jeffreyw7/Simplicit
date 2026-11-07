# Review fixes implementation plan

**Goal:** Fix all eight reviewed defects, the preservation hazard, and three related validation/policy gaps while retaining supported Simplicit workflows.
**Architecture:** Keep current interfaces and modules. Use focused parser fixes, portable publication with recoverable sibling backups, TSV serialization, and instruction corrections. Independent scopes share no writable files.
**Tech stack:** Python standard library; Node.js 22+; Java/TLC 1.7.4.
**Spec:** User attachment 7d415589-a119-4567-be1c-ef6b5330fd7a/pasted-text-1.txt and ../Simplicit-review-2026-10-27.md.
**Base:** 8cd5a1c82b325f09d5aeafaac2b2c751d72de3f3, feat/all-pstack-skills.

## Constraints and execution decisions

- Preserve commands, output schemas, skill/role names, and documented exit codes; no dependencies/upgrades.
- Do not modify pstack or unrelated user content. No remote writes, push, publication or deployment.
- Work in the existing clean feature checkout: user explicitly requested autonomous execution and preservation of existing branch work. No worktree/approval handoff is needed.
- The user subsequently requested commits for major changes during implementation. Commit verified changes in coherent local groups; no push or other remote changes.
- Evidence lives in .scratch/review-fixes-2026-10-27; retain it as requested.
- Lead owns statechart.mjs, chart-to-tla.mjs, statechart-help.mjs, runtime docs, scripts/test_statechart.mjs and integration.
- Values agent owns lib.mjs and new scripts/test_statechart_values.mjs only.
- Packaging agent owns logger, its skill instructions/tests, validate_agents.py and its tests only.
- Workflow agent owns reproduce-and-fix-issues, reflect instructions, and statechart/SKILL.md only.
- Each implementation agent first reads the report and relevant linked evidence; records current failing probes, applies focused fixes, and runs scoped regressions. Fresh reviewers then inspect combined changes.
- Stop/close all task-created agents after collecting their results. Host has interrupt/list but no deletion API; report this limitation accurately.

## Review focus

- String/comment delimiters and multiline property lists in TLC config must not alter constants.
- Duplicate names and escapes must not silently change model identity.
- Existing input/output files must survive preflight, checking, publication and rollback failures.
- Windows collision handling must not conceal other permission failures.
- Missing notification/readback/permissions must not allow unattended fixing; manual authorization remains effective.

## Task 1 — Lead: configuration, publication, mapping errors, preservation

Files: statechart.mjs, chart-to-tla.mjs if needed, statechart-help.mjs, runtime.md, scripts/test_statechart.mjs.
- [x] Read source and retained reproducers; rerun baseline.
- [x] Add failing real-TLC tests for significant whitespace in config, invalid mapping status, repeat generation, blocked actual output and sibling-source preservation.
- [x] Preserve configuration lexemes while removing only rule sections.
- [x] Normalize mapping operational errors to exit 2.
- [x] Replace output safely on Windows with rollback; validate all destinations before sibling writes.
- [x] Preserve generation behavior with recoverable backups for replaced customized siblings and rollback on failed generation.
- [x] Run Node/TLC regressions, including unchanged normal chart and invariant behavior.

## Task 2 — Values agent: parallel-region identity and escaped strings

Files: lib.mjs and scripts/test_statechart_values.mjs.
- [x] Reproduce silent duplicate-caption loss and escaped-string collapse.
- [x] Add failing parser and real-TLC tests with independent expected region/state/trace assertions.
- [x] Preserve distinct region IDs or reject ambiguous unsupported names clearly; no false unchanged result.
- [x] Decode supported TLA escapes without merging distinct values.
- [x] Run scoped tests. Lead wires new tests into existing suite entrypoint.

## Task 3 — Packaging agent: TSV correctness and required profile inventory

Files: log.py, show-me-your-work/SKILL.md, scripts/test_decision_log.py, validate_agents.py, test_validate_agents.py.
- [x] Reproduce quoted-cell corruption and missing-comment-sicko inventory gap.
- [x] Add failing CSV-reader/PowerShell round-trip and fixed-required-inventory cases.
- [x] Use standard TSV serialization while preserving sanitization and helper CLI.
- [x] Require both shipped roles independently of dynamic inventory; keep supported destination validation semantics.
- [x] Run affected Python tests and document PowerShell evidence.

## Task 4 — Workflow agent: unattended gate, reflection routing, command typo

Files: reproduce-and-fix-issues instructions, reflect instructions, statechart/SKILL.md.
- [x] Exercise baseline instruction scenarios and broken literal help command.
- [x] Start unattended correction window after authorized report delivery/readback or explicit alternative; missing capability leaves pending.
- [x] Resolve existing new-skill route without expanding scope.
- [x] Fix documented command and scan bundled examples.
- [x] Record scenario outcomes including manual work, no posting authorization, delayed/failed readback, correction and new-workflow evidence.

## Task 5 — Lead and independent reviewers: acceptance

- [x] Integrate all edits and run full Python, Node/TLC, skill and agent checks.
- [x] Run available platform checks; disclose unavailable Linux Node/TLC, native-role and live-service checks without claiming them.
- [x] Have fresh reviewers inspect source, test quality, compatibility and requirement coverage.
- [x] Resolve material findings, with focused failing/passing regressions.
- [x] Verify untouched pstack, interfaces/inventory, final diff and source hashes.
- [x] Write final requirement-by-requirement evidence report outside scratch.
- [x] Close task-created agents and verify none remain running; accurately report deletion limitation.
