# Simplicit specialist integration

Goal: apply the revised workflow from the shared comparison thread, adopt Jimmy's naming pattern, and connect a useful pstack specialist library to Codex in selected repositories.

Architecture: a repository-local collection of Markdown skills. `simplicit` is the entrypoint, `simplicit-mode` a compatibility alias, and `simplicit-help` the catalog. Specialist names remain unchanged. Shared runtime guidance and a `simplicit-agent` worker brief live with the entrypoint. No execution framework, background service, marketplace, global installation, or upstream updater.

Tech stack: Markdown skills; Python standard library for package validation. Preserve the original `pstack/` snapshot and license unchanged.

Spec: the user's current goal and [shared thread](https://chatgpt.com/share/6adef042-3f54-83ea-a20c-0a7dea766d1e), especially its final revision distinguishing a workflow from a framework. [Jimmy naming](https://github.com/ja153903/jimmy/tree/2bb05bcd288f60a9b435ddd156dabb8d88fafe80/plugins/adapters/common/skills) supplies the naming pattern, not a code dependency. The starting revision is `bdc9e0476694770592743735f2485102b0f7cf3c`; the previous PR is merged.

## Global constraints

- One lead normally investigates, plans, implements, tests, integrates, and repairs. Mechanical changes need appropriate checks and self-review. Meaningful features, fixes, and refactors need one independent candidate review, plus focused review of repairs, including consequential refactors that preserve intended behavior.
- Risk follows ownership, trust, durable data, concurrency, and consequential transitions. A file count or function boundary alone does not trigger an architecture panel.
- Reuse an existing brief and valid evidence. Source revision, dirty changes, tests, dependencies, configuration, generated artifacts, and runtime all matter.
- Default to one optional specialist at a time. Expand for a concrete independent need; budgets never excuse unresolved defects. Review independence means separate authorship, not a different model name.
- Continue authorized investigation, verification, and repair. After two failed fixes based on one premise, test the premise. Ask only for missing consequential decisions or authorization; prior authorization persists.
- Preserve a single active Draft PR as the default working queue unless the user or repository specifies another convention. Merge and release require explicit authorization. Do not send messages to people without authorization.
- Helpers receive compact briefs and exclusive write ownership or read-only scope. Reuse suitable helpers. End consumed work and use lifecycle capabilities actually available; never claim unavailable deletion happened.
- Keep unrelated `.codex/` content out of the change. Do not install into other project repositories or a user-wide directory.
- Do not claim all upstream skills or host scripts are portable. Identify the supported subset and source-only capabilities explicitly.

## Intended package

Public entrypoints: `simplicit`, `simplicit-mode`, `simplicit-help`.

Specialists: `architect`, `how`, `why`, `interrogate`, `tdd`, `teach`, `correct`, `blast-radius`, `arena`, `swarm`, `create-verification-skill`, `maintain-verification-skill`. Keep `statechart` source-only: its Node/Java/TLC and rendering dependencies need a separate runtime-validation effort.

Retain substantive specialist procedures and useful upstream references. Replace Cursor tool/model settings and mandatory fan-out with actual available host capabilities and explicit escalation criteria. Direct specialist invocation reads the same runtime contract as the main workflow. No specialist silently changes a read-only question into implementation or grants shipping authority.

Installation: copy the complete supported `skills/` collection into a selected repository's `.agents/skills/`. First inventory collisions. Keep identical files, preserve unrelated skills, and stop before replacement when ownership or authorization is unclear; ask for a concrete replacement choice or choose another selected repository. Do not silently overwrite or omit a conflicting dependency. For a known prior Simplicit installation, compare local customizations and preserve them before an authorized upgrade. Do not copy `pstack/` as an active skill package. This collection has shared dependencies; copying only an entrypoint is no longer supported. State this migration clearly for earlier single-folder installations.

Concrete portability acceptance criteria, including linked templates:

- `interrogate` ranks execution-path evidence, not reviewer consensus. No arbitrary line threshold or blanket restructuring is a blocking rule.
- `why` starts with linked history and searches relevant sources conditionally. No required seven-source panel or separate synthesizer.
- `teach` reuses established findings. No required `unslop` installation, image-generation service, or sequence of diagrams.
- `correct` applies enforcement within the authorized scope. A correction does not grant permission for broad refactoring or automatic commits.
- Verification authoring and maintenance use actual available host tooling and repository commands. No assumed Cursor browser/tool, automatic dependency install, or product-code edits during verification maintenance.
- Every specialist reads the shared runtime contract; it cannot widen authorization, change a read-only task into implementation, or weaken required independent review.

## Review focus

- Can the package be copied away from this repository and still resolve every local link?
- Does an explicit specialist invocation preserve scope and authorization, independent of the main entrypoint?
- Do copied references contain mandatory multi-model, platform-specific, shipping, or scope-expanding instructions that contradict the adapters?
- Are reference templates usable with the adapter's inputs and outputs? Are ephemeral filenames presented as template placeholders rather than broken required package files?
- Are read-only explanations, tiny edits, consequential design, candidate review, stale evidence, unavailable runtime, and unavailable helper deletion handled correctly?
- Does documentation accurately distinguish supported specialist adaptations from unchanged upstream source and from live evidence?

## Task 1: review before implementation

Read the relevant source skills and their dependency closure. Have an independent reviewer evaluate this plan and the source audit before production edits. Record actionable feedback and resolutions here. Do not request another implementation approval: the user already authorized implementation after review.

Expected: explicit source mapping, supported subset, reviewed scope, and resolved plan defects.

## Task 2: add package validation

Create `scripts/validate_skills.py` and `scripts/test_validate_skills.py`. Validate discoverable folder/name agreement, required metadata, licenses, and local Markdown reference closure inside the copied collection. Use no third-party dependencies. Avoid interpreting normal example/code paths as Markdown links. Test valid isolated packages plus missing links, escaping paths, mismatched names, and missing attribution before implementing the validator.

Expected: failing behavioral fixture tests before code exists, then a passing suite. Validator returns nonzero for an invalid collection and does not mutate it.

## Task 3: implement the skill collection

Move the existing mode's workflow and playbooks to `skills/simplicit/`; replace `skills/simplicit-mode/SKILL.md` with the compatibility alias. Add shared runtime and worker reference, specialist routes, and `skills/simplicit-help/SKILL.md`. Port the audited specialists and their needed resources with licenses. Maintain a support/source map in `UPSTREAM.md`. Keep `pstack/` byte-for-byte unchanged.

Expected: each supported skill contains meaningful source-derived procedure, explicit routes resolve, and none requires unavailable upstream host tooling.

## Task 4: documentation and forward verification

Update `README.md` with the new invocation, entire-collection adoption, migration from single-folder mode, supported capabilities, and limitations. Run standard skill metadata validation and collection validation in an isolated copy. Exercise a real small bug-fix task in a scratch repository through the installed `tdd` route, recording failing-before and passing-after evidence. Exercise bounded read-only and unavailable-capability scenarios. These are targeted trials, not a full Codex discovery test or a performance benchmark.

Expected: package closure and real regression execution succeed; simulated behavior is labeled separately; no false claim of installed native roles or automatic deletion.

## Task 5: independent review and handoff

Obtain independent review of the final candidate, assess findings, fix material defects, and rerun affected checks with focused review of repairs. Compare the imported source tree to its pinned hash. Commit/push the reviewed candidate to this feature branch and open one Draft PR, without merging. Confirm remote files match the validated candidate. End helper tasks and report outstanding limits.

Expected: reviewable Draft PR, observed verification, accurate readiness, no unrelated repository/global modifications.

## Progress and decisions

- Baseline inspected. Previous PR #1 was merged by the user; revision starts from current `origin/main` on `feat/simplicit-specialists`.
- Preimplementation review found missing concrete source-hazard checks, an ambiguous review exemption for behavior-preserving refactors, and underspecified skill-name collision handling. All three were resolved above; the reviewer approved implementation before skill edits began. `statechart` remains source-only.
- Task 2: validator fixture tests observed failing before implementation (7 assertion failures), then all 10 passed. Two adoption-selection cases were added for existing unrelated skills and missing required siblings; both failed before adding the selection interface.
- Task 3: 15 skill entries implemented (three Simplicit entries plus 12 specialists). Shared runtime and all routed local resources are packaged; all 15 passed the standard skill validator.
- Task 4 complete: isolated copy validates and all 48 copied files match source. A bounded worker observed a duplicate-credit regression fail before its fix and all three fixture tests pass afterward. Parent independently inspected the artifacts and reran all three tests successfully. The successful original trial evidence is retained in ignored workspace scratch, not replayed as a new trial. External-temp write attempts initially failed; a fixture-relative default-shell operation succeeded without changing permissions.
- Ruling: the validator checks only this collection's names when validating an adopting repository. Unrelated pre-existing skills may legitimately have different resource/license conventions and must be preserved.
- Task 5 review complete: independent reviewer found no actionable defect and approved Draft PR preparation. Reviewer independently ran the 12 validator tests, collection validation, and three fixture tests; evaluated five bounded scenarios as hypothetical, not live runs. Native discovery, every-specialist live execution, and efficiency remain unverified, as documented.
