# Validation evidence

The dated sections below describe their named candidates, including evidence imported from main. The [November 3 integration report](main-integration-2026-11-03.md) records the earlier integration checks; it does not validate later plugin changes.

## Authenticated plugin workflows — November 7, 2026

The [native plugin workflow report](validation/plugin-model-2026-11-07.md) records successful authenticated trials for installed-resource loading, a one-prompt bug fix with the configured critic, read-only defect review and the named Comment Sicko role. It preserves the failed setup preflight, corrected isolated configuration, credential cleanup, independent evidence review and the observed between-run normal-configuration change. These results supersede the November 6 missing-authentication gaps only within the stated Windows scope.

The [CI and configuration follow-up](validation/plugin-model-2026-11-07.md#ci-and-configuration-follow-up) confirms successful Windows and Ubuntu CI for `1eb7c89`. The normal configuration remained valid and unchanged since the later observation, but available evidence did not identify the writer or changed settings. No plugin defect or basis for restoring global settings was established; the report preserves that gap and improves the reproduction evidence requirements.

## Plugin/main merge — November 6, 2026

The [merge verification record](validation/merge-2026-11-06.md) covers both parent revisions, documentation conflict resolution, preservation checks, the combined test suites, fresh isolated plugin installation/discovery/refresh and independent review. Model-driven plugin trials remain blocked by the isolated profile's missing authentication.

## Repository-root plugin — November 6, 2026

The [candidate-specific plugin record](validation/plugin-2026-11-06.md) covers the repository-root compatibility manifest and local marketplace, package checks and relocation, isolated Codex 0.165.0 installation/discovery/refresh, and the exact missing-authentication blocker for model-driven plugin workflow and named-role trials. It distinguishes static parsing and file resolution from actual model execution and preserves the historical entries below.

## Native workflow gaps — November 3, 2026

Four actual native trials on merged candidate `a8e0d75a3504c1785dc8a4718810dd6e56b9436c` exercised the previously open review-driven repair branch, missing-model handling and cancellation. The [follow-up protocol and results](validation/native-gaps-2026-11-03.md) record exact scope, thread IDs, preservation checks and remaining limits.

| Gap | Observed native evidence |
|---|---|
| Review-driven repair/re-review | Actual configured critic found the seeded retry defect before edits. The lead added five regressions, observed three failures, repaired the implementation, and reused that same critic for focused follow-up. All seven tests passed for the lead, critic and independent controller; a separate behavior oracle also passed. One uninterrupted parent prompt, no steering. |
| Missing configured model | The actual critic child attempted the fixture-only unavailable model and failed with `modelNotFound`. The parent disclosed the failure once and left the required review pending without substitution or edits. A separate direct parent-model request also failed with `modelNotFound` and no file changes. |
| Cancellation and recovery | The controller interrupted a running 60-second diagnostic after its start marker. The turn became `interrupted`; the same parent completed a read-only reassessment without restarting it. The completion marker remained absent beyond 100 seconds, and a separate process check found no matching diagnostic. |
| Preservation and cleanup | Only the permitted ledger/new-test files and cancellation start marker changed. Installed skills/profiles, policy, seed tests, sentinels and Git metadata were preserved. All six owned threads were archived; all four app-server processes exited with code 0. |

These are bounded Windows Codex 0.165.0 trials using explicit native skill invocation, persisted parents, `gpt-6-astra/medium` and the configured `gpt-6.1-sol/high` critic. Negative model trials intentionally ended in failed review/model turns; successful reporting does not turn those into completed reviews. The unavailable identifier is synthetic, so real model entitlement/provider outages and permitted fallback remain untested. Cancellation during delegation/partial edits and other timings remain untested. Linux/macOS native execution and general automatic-selection/quality claims remain open. Earlier dated entries below retain their historical results; the three named gaps are superseded only within this new scope. Detailed local artifacts are under `.scratch/native-gaps-20261103/`.

## Review fixes — October 27, 2026

The [review-fix completion report](review-fixes-2026-10-27.md) records the eight repairs, source-preservation changes, independent review findings and compatibility limits. Final local verification passes 54 Python tests on Windows (3 skips) and Ubuntu (2 skips), 30 real Node/TLC regressions on Windows (no skips), all 62 skills and both agent profiles. Preserved CLI workflows and PNG success/partial-failure behavior were also exercised. Linux Node/TLC and native custom-role execution remain unverified. The earlier counts and hosted CI results below belong to their dated candidates.

## Legacy decision-log compatibility repair — November 3, 2026

The repair starts from `f8463d4861d1b63c134233d1980a0efeef99a8b4`. The compatibility review reproduced a gap introduced by the quoted-TSV repair in `465dcbf`: logs produced by the earlier raw-tab writer with literal cells such as `"open` or `"closed"junk` could no longer receive an append. Rejection preserved the original bytes, but no migration path existed. Balanced literal quotes also make automatic old/new format detection ambiguous.

The new [legacy converter](../skills/show-me-your-work/scripts/migrate_legacy.py) explicitly reads a known raw-tab file, validates all records, and creates a new quoted-TSV destination using exclusive creation. It preserves the source, timestamps, literal quotes, empty cells and Unicode, and applies the current formula-prefix protection. Invalid source data creates no destination; existing destinations, including the source itself, are refused. Normal `log.py` append behavior and strict malformed-log rejection remain unchanged. The [conversion instructions](../skills/show-me-your-work/references/helper.md#continuing-a-legacy-log) explain selecting the new canonical log, format ambiguity and retrying interrupted writes to a fresh destination.

The eight existing decision-log tests passed before the change. Regression-first conversion success cases failed before the new helper existed; after implementation all **16 decision-log tests** passed. Eight added tests cover the two reported quote failures, balanced quotes, empty cells, Unicode, LF/CRLF, formula guards, large cells, header-only input, invalid/missing source data, destination collisions, repeated conversion and continued appends. Existing malformed-modern-log rejection tests still pass.

| Executed check | Result |
|---|---|
| Windows: `python -B -m unittest discover -s scripts -p 'test_*.py'` | 68 tests successful; two unprivileged-symlink skips and one POSIX-only skip. |
| Ubuntu WSL: the same complete Python discovery | 68 tests successful; three Windows-only skips. |
| `python -B scripts/validate_skills.py` and `python -B scripts/validate_agents.py` | 62 skills and two profiles valid. |
| `node --test scripts/test_statechart.mjs` with checksum-pinned TLC 1.7.4 | 59 tests passed, zero failures or skips. |
| Fresh installation into an isolated project whose path contains spaces | All 62 skills installed; both logging scripts matched source bytes. The actual pre-`465dcbf` writer produced two rows, the installed converter migrated them, and the installed appender added a third row from another working directory. Source bytes were preserved. |
| Independent TSV consumer | PowerShell `Import-Csv` read all three rows and preserved literal quotes, Unicode and the empty cell. |
| Independent repair review | No actionable production/test/documentation issue found. Separate probes verified mixed LF/CRLF, literal values, formula guards and rejection of a malformed late record before destination-parent creation. |
| Diff and upstream checks | Clean whitespace check; original `pstack/` tree unchanged at `880564357e051d7c7802da1cb5d8df1d0b008299`. |

Local execution used Windows Python 3.12.14, Node 25.2.0, Java 21 and Ubuntu WSL Python 3.12.3. Tests ran with ordinary host filesystem/process access because the previously diagnosed sandbox temporary-directory ACL and Java pipe restrictions prevent valid execution there. The isolated adoption evidence is retained under `.scratch/legacy-adoption-20261103-7f05d50c07464b3696c9ac7d5fa83146/`. Hosted results for the pushed revision are tracked separately in PR #3.

Conversion is explicit and uses one writer per log. The format cannot distinguish all legacy data from modern quoted TSV; use it only for a known raw-tab source, and retain that original. Interrupted output writes may leave an incomplete new destination; retry to a fresh destination. Disk-full and process-termination failure injection were not run. This pass adds no native model turns or skill-quality measurements. The earlier native acceptance and its remaining platform/model/repair-branch limits below retain their original scope; the CLI conversion tests do not substitute for those trials.

## Functional follow-up review — November 2, 2026

The follow-up began at `3aac00a0a0aa3dd4698e4e752209702b9ad18dda`. Independent reviewers inspected installation/validation, Statechart and decision logging, and skill instructions/role routing. The review distinguishes deliberate portability changes from functional defects, including defects inherited from the newly packaged upstream helper.

| Finding | Executed evidence and correction |
|---|---|
| P2: Read-only source directories break partial-install cleanup on POSIX | After an initial install, make an existing source skill and its nested reference directory mode `0555`, then add another skill. Real Ubuntu execution as an ordinary user reproduced `PermissionError` while deleting staged `guide.md`, after publication. Cleanup now restores owner write permission on the affected staged parent as well as the failed path. It never changes the staging root's parent. The regression passes and checks publication, no residue, unchanged source/project-parent permissions and idempotence. |
| P2: CFG keywords used as values or directive arguments become false rule sections | Direct checksum-pinned TLC accepts `CONSTANT Value = INVARIANT`, nested sets containing keyword-shaped model values, and `INIT INVARIANT` / `NEXT PROPERTY` when those operators are defined. The helper instead stripped the values or invented rules and exited 2. Tokenization now separates punctuation and the splitter consumes complete constant assignments and fixed-arity directive arguments before looking for sections, preserving the original retained text. |
| P2: Valid `TYPE` / `TYPE_CONSTRAINT` directives become false invariants | Pinned TLC accepts those directives after an invariant section; the helper attempted to check `TYPE` as an invariant and exited 2. Both are now recognized with their single arguments, so they remain in the generated configurations. |
| P2: Symbolic state values crash broken-state decoding | With the valid model value `==` in state, the original helper reported the broken invariant and then crashed because undecoded text was destructured as tuple fields. Symbolic atoms now use the shared token reader. Broken metadata must have the expected marker, variables record and string rule list; unsupported or malformed metadata raises an actionable error instead of being skipped or treated as good states. |

The repaired installer passed independent re-review. The complete Python suite passed **60 tests** on Windows Python 3.12.14 (two unprivileged-symlink skips plus one POSIX-only skip) and Ubuntu WSL Python 3.12.3 (three Windows-only skips). The POSIX regression was observed failing before the production change and passing afterward. Earlier Windows inherited-access and read-only-file cleanup regressions remain covered.

The initial real-TLC regression matrix covered 12 cases: spaced/compact model values, nested sets, function-table arguments, overrides, module-context values/overrides, qualified constant names, keyword-shaped initialization/next/specification arguments, and both type directives. Before repair, 11 cases failed with helper exit 2; the compact-value control already worked. Those cases pass with the deliberate violation still reported. A Windows temporary-folder permission error in an initial control run was isolated and rerun; it is not counted as parser-defect evidence.

Follow-up review exposed false passes in an unpublished intermediate lexer repair: splitting symbolic values such as `[]`, `==` and `====`, or grouping `+Other` as one token, could hide the following invariant. The final shared reader preserves native token boundaries, including dynamic module tokens. Constant parsing checks assignment, set, argument and module delimiters instead of advancing blindly. An additional native comparison covered **388 token/boundary cases**, with zero mismatches after correcting the observed differences. The final 18-case CFG matrix includes those symbolic/adjacent cases and a module-header token; generated configurations preserve non-rule text and deliberately broken invariants produce exit 1 and a wrong-state summary. Nine separate positive-model checks also passed on the final candidate with inputs preserved.

The decoder regressions cover symbolic atoms inside broken-state records and malformed/incomplete metadata. The original `==` renderer failure was independently reproduced with the committed pre-repair scripts before correction. Native token compatibility is checked against the pinned [TLC config parser](https://github.com/tlaplus/tlaplus/blob/v1.7.4/tlatools/org.lamport.tlatools/src/tlc2/tool/impl/ModelConfig.java) and its actual lexer. This does not establish lossless representation of every TLC value: textual collisions such as a model value named `[]` and an empty record remain outside the demonstrated cases. Unparseable broken metadata now fails explicitly.

Final combined Windows verification passed **59 Node tests including subtests, zero skips**, with actual pinned TLC; **60 Python tests, three capability/platform skips**; both package validators (62 skills, two profiles); the upstream structured-value examples against the adapted parser; and `git diff --check`. Independent follow-up reviews found no remaining actionable installer or runtime issue in the reviewed scope. Skill instructions, role/model pins and the original `pstack/` tree are unchanged by this follow-up. These are local results; hosted verification is tracked separately in PR #3. Detailed local diagnostics are retained in `.scratch/cfg-parser-fix/`, `.scratch/review-tools/` and `.scratch/functional-review-2026-11-02/` and are not committed.

This follow-up does not rerun native model turns or change role/model pins. The native acceptance, comparison-study conclusions and remaining native gaps below remain dated evidence for their original candidates. The new Python result adds actual Linux installer coverage; it is not Linux native model execution.

## Native workflow acceptance and installation repair — November 1, 2026

The candidate based on `eff203a39438a3e5cc2d9b58d99cadfac60e30c0` corrects the Statechart help command to `node "<skill dir>/scripts/statechart.mjs" --help`. Executing the corrected command succeeds. The new [native acceptance record](validation/native-workflow-2026-11-01.md) contains tested file hashes, the fixture contract, reproduction steps, actual thread IDs and evidence limits.

The first native run exposed an installation defect that discovery alone had missed: Python's private temporary staging produced restrictive Windows permissions, so sandbox commands could not read installed references. Ordinary exclusive staging now preserves inherited access. A regression failed at the installed root, entrypoint and nested reference before repair and passes afterward. Independent review also caught read-only staged-file cleanup failing after a partial installation; a second regression reproduced that failure and passes after the cleanup repair. Existing byte-identical installations remain a no-op and do not automatically receive corrected permissions; README explains fresh installation or explicit permission reconciliation.

All four bounded acceptance checks passed on fresh repaired installations with Windows Codex 0.165.0, parent `gpt-6-astra/medium`, explicit native skill invocation and provider-model fallback disabled:

| Check | Actual result |
|---|---|
| Meaningful bug fix, one uninterrupted prompt | Read installed references, added four regressions to two seed tests, observed two failures, repaired duplicate crediting, obtained an actual `critic` review on `gpt-6.1-sol/high`, and passed final verification. The critic independently ran all six tests; a separate behavior oracle and full-suite check passed. |
| Changed-evidence follow-up on the same parent | A deliberate policy change invalidated the earlier pass. Both independent execution and the native lead observed five errors in six tests. The lead reported the invalidated evidence, reused unchanged source-review evidence, ran a passing valid-amount diagnostic, and made no edits or helper calls. |
| Mechanical edit in a fresh parent | Exact requested README spelling correction, no unrelated byte changes and no helper. |
| Assigned independent review in a fresh parent | Read Interrogate references, ran seed tests and demonstrated the seeded retry bug; no edits or helper. |

Installed skills, profiles, sentinel files and Git state remained unchanged. All owned threads were archived and app-server processes exited normally. The first partial-access cohort remains separately recorded; it is not pooled with the repaired passing cohort. The deliberately failing configuration-change fixture is evidence that stale results were rejected, not a failing repository test.

Repository verification after the installer repair: **59 Python tests successful**, with two local unprivileged-symlink capability skips. The Windows inherited-permission, read-only cleanup, short-path and junction cases executed. Both package validators pass (62 skills and two profiles); diff checks and corrected Statechart help execution pass. The unchanged `pstack/` tree remains `880564357e051d7c7802da1cb5d8df1d0b008299`. Hosted checks for the pushed revision are recorded in PR #3; the last inspected pre-repair [PR run at `eff203a`](https://github.com/Jeffreyw7/Simplicit/actions/runs/41235730500) passed 57 Python and 35 real-TLC tests on both Linux and Windows, with the one expected Linux platform skip.

This closes the bounded explicit native workflow acceptance gap. It does not establish automatic selection, behavior across every skill, other operating systems/client versions or a general quality improvement. Both native bug-fix reviewers returned no further findings, so a native review-driven repair/re-review branch remains unexercised. The separate installer review did exercise a real repair and follow-up review, but is not substituted for that native branch. Backend serving-model identity, missing-model errors and cancellation remain unverified.

## Broader selection, concurrency and documentation quality — October 31, 2026

These studies were completed before the November 1 acceptance test. Their outcomes remain candidate-specific; the later explicit invocation does not retroactively establish automatic routing in the earlier study.

| Study and candidate | Observed result | Limits |
|---|---|---|
| Broader native selection, `465dcbf9ddc046a9b04f921467dd826e00cb82ac` | 23/24 trials completed; one stopped at the account usage limit. Clear functional routing met the frozen criterion in 19/22 trials. Frozen answer score was 67/72; all 23 completed answers were substantively correct. Four actual helper dispatches were generic, with 0/4 named-role executions. | Two repetitions per request, one client/model setting. Two review scores included an extra rubric expectation absent from the prompt; the helper expectation also had an assigned-reviewer ambiguity. Project-trust warnings and absent proof of named-role availability confound the generic fallbacks. No causal before/after conclusion. |
| Concurrency stress, same candidate | 62 cases, 244 writer attempts and 74 completed TLC invocations. No stabilized final-output integrity failure; all 26 successful foreign-file insertions preserved. | Publication-only extraction and full CLI cohorts remain distinct. Windows sharing contention often prevented publication. Transient reader consistency, arbitrary schedules and guaranteed progress are not established. |
| Two documentation corrections, `465dcbf` versus `eff203a` | Twelve real agent tasks: three conditions, two versions and two repetitions. Both versions scored 18/18; all eight produced logs passed independent byte/TSV/helper-compatibility checks. No observed task-quality difference. | Explicit instruction-guided tasks, not automatic selection. All scores reached the rubric ceiling. The final judge was blinded to version labels; the lead was not. Complete method traces were not available to establish every claimed instruction/tool use. |

The documentation changes clarified concurrent publication limits and safe TSV appends; runtime algorithms and role/model pins did not change in `eff203a`. The new Statechart entrypoint correction likewise repairs an executable instruction. The November 1 installer repair changes fresh-installation access and cleanup behavior, with red/green regression and actual native-read evidence; it does not alter skill routing or model profiles.

Detailed local protocols, complete answers, frozen rubrics, artifact checks and reports are retained under `.scratch/benchmark-2026-10-31/` and `.scratch/quality-change-2026-10-31/` and are ignored by Git. The dated summaries above preserve the conclusions and material limitations in the repository. No token, speed, cost, general quality gain or arbitrary-concurrency guarantee is claimed.

## PR review and reliability repairs — October 31, 2026

Parallel independent reviewers inspected PR #3 against `main` (`6c5cf96291c00262ad36d19db652849ea6b0e742`), starting from candidate `85809a64be7a670b895df3c73bba8b4b925d9874`. The review covered statechart helpers, packaging/installation/CI, decision logging, workflow instructions and validation claims. [Baseline Linux/Windows CI](https://github.com/Jeffreyw7/Simplicit/actions/runs/41165133519) was already passing with 52 Python and 10 Node/TLC tests; the following defects required additional regression cases.

| Finding | Reproduction and repair |
|---|---|
| P1: CFG rewriting could falsely verify an invariant | Normalizing all whitespace changed the string `"two  spaces"` to `"two spaces"`. Direct TLC reported the invariant violated while the helper reported it held. The helper now extracts rule clauses without rewriting the remaining config text, including quoted whitespace, escapes and comment-like text. |
| P2: Nested user files could be deleted during publication | A successful rerun removed `tlc/notes.txt` because the old ownership check accepted the entire `tlc` directory. Recursive checks now refuse unknown files, unexpected entry types and directory aliases before replacing output. The documented generated-file namespace remains replaceable; names do not establish provenance. |
| P2: Automatic chart compilation could overwrite model companions | With `NAME.tla` absent, existing `NAME.cfg` and `NAME.map.mjs` were overwritten. `from-chart` now checks all three generated paths before writing any of them. Explicit standalone compiler behavior is unchanged and documented. |
| P2: Quoted decision-log cells did not round-trip | Raw tab joining let TSV readers strip literal quotes, expose formula-like text or consume a later row after an unmatched quote. Standard TSV quoting now preserves sanitized cell values; Python CSV parsing and PowerShell `Import-Csv` confirmed the repair. Actual spreadsheet formula execution was not tested. |
| P2: Malformed decision-log bodies accepted another append | A correct header followed by an incomplete six-column record was accepted. Appends now validate every existing record and refuse malformed quoting, wrong widths or embedded tabs/newlines without modifying the file. Valid large cells and LF/CRLF logs remain usable. |
| P2: Native-validation claims were stale | README and the validation record still described native role/model execution and sampled selection as unverified. The dated native evidence below now records the successful persisted-parent checks and the remaining ephemeral-parent limitation. |

Independent follow-up review caught three issues in the initial statechart repairs: CR-only line comments could hide an invariant, a disappearing/replaced output root could cause a spurious failure, and nested Finder `.DS_Store` metadata could prevent a rerun. The final parser handles CR and LF. Ownership scans tolerate a vanished root, rescan a replacement, and still refuse a missing nested entry under an unchanged root. Regular `.DS_Store` files are allowed in recognized generated directories, while links and wrong entry types remain refused.

Regression evidence includes real TLC failures and successful model runs, companion collision preservation, nested-file/type/alias preservation, deterministic filesystem interleavings, ordinary reruns and quoted/malformed log records. Early CFG test fixtures included an invalid constant-only invariant and an incorrect assumption about CFG/TLA escape decoding; those fixtures were corrected and rerun against both the original and repaired implementation. Their original failures are not counted as proof of a product defect.

### Final local verification

The repaired working tree passed on Windows with Python 3.12.14, Node.js 25.2.0, Java 21.0.12.1 and TLC 1.7.4. `TLA2TOOLS` pointed to a task-local JAR with SHA-256 `936a262061c914694dfd669a543be24573c45d5aa0ff20a8b96b23d01e050e88`; no global runtime configuration changed.

| Command/check | Result |
|---|---|
| `python -B -m unittest discover -s scripts -p 'test_*.py'` | 57 tests, zero failures; two agent-validator tests skipped because unprivileged symbolic links are unavailable. Windows short-name and directory-junction cases executed. |
| `python -B scripts/validate_skills.py` | All 62 skills valid, including local links and licenses. |
| `python -B scripts/validate_agents.py` | Both reviewer profiles pass TOML parsing and package policy. |
| `node --test scripts/test_statechart.mjs` with verified TLC | 35 tests including subtests, all passed, zero skips, 230.2 seconds. |
| Independent repair review | No unresolved actionable findings after the logger, statechart and documentation follow-ups. |
| `git diff --check` and pinned source comparison | Passed; no `pstack/` changes. |

These are local repaired-tree results. The linked baseline CI above predates these repairs; the PR description records the hosted result for the pushed revision separately.

Publication remains optimistic: concurrent nested mutation may conservatively stop a run. The deterministic race cases do not establish arbitrary concurrent-writer or non-rename-filesystem behavior. This repair pass does not repeat optional PNG rendering or broaden the native model study below. The original `pstack/` source tree remains `880564357e051d7c7802da1cb5d8df1d0b008299`.

## Native roles, models, and selection — October 31, 2026

These checks ran against `85809a64be7a670b895df3c73bba8b4b925d9874` on Windows with Codex CLI 0.165.0 and Node.js 25.2.0. They supersede the native-role and sampled-selection gaps in the October 27 records below. Earlier dated results retain their original scope and counts.

Parallel, isolated native `critic` and `comment-sicko` probes completed in the chat host. The critic found a seeded retry-loss defect. Comment Sicko found redundant/dead comments and a false-success workaround, retained legal/API documentation and an unresolved external constraint, and applied no edits. The lead independently reproduced both seeded failures and verified unchanged fixture hashes. Two additional lead trials loaded Simplicit by file path and selected the appropriate native reviewer without receiving its expected name.

Fresh native app-server sessions then executed **six parent turns and four reviewer turns** over four request types. Every session discovered all **62 adopted skills enabled**, with zero loading errors. The 200 copied skill files and both copied agent profiles matched the source bytes. Native prompts supplied no expected skill/role names or findings. The review prompts explicitly requested one independent reviewer, so they test skill/role choice rather than whether to delegate.

| Request | Observed native behavior |
|---|---|
| Explain a module and its empty-input behavior | Loaded `how`, runtime guidance and source; returned the correct explanation. |
| Audit unnecessary comments and comment-backed workarounds | Loaded `no-comments`; with a persisted parent, selected native `comment-sicko`, proposed two removals and retained license, public API and protocol comments. |
| Review a queue against its serialized-caller contract | Loaded `interrogate`; with a persisted parent, selected native `critic`, reproduced the seeded failed-item loss, and kept concurrency outside the supplied contract. |
| Calculate `17 + 25`, answering only with the number | Returned `42` without model-issued tools, skill reads or reviewers. The prompt did not prohibit tools. |

Both persisted review parents used `gpt-6-astra` with `medium` reasoning, after the native model catalog confirmed availability. The actual spawn calls supplied the appropriate `agent_type` and **no model or effort override**:

| Child role | Resolved model | Resolved effort | Result |
|---|---|---|---|
| `critic` | `gpt-6.1-sol` | `high` | Profile override observed; child and parent completed. |
| `comment-sicko` | `gpt-6-astra` | `medium` | Parent settings inherited; child and parent completed. |

Evidence combined actual spawn records, resolved-at-creation `subAgentActivity` fields, metadata-only `thread/read`, final responses and child completion events. The standalone walkthrough also completed under an explicit `gpt-6.1-sol`/`high` request. Each parent request disabled provider fallback, and no model-reroute event was observed. These establish actual execution under the reported configuration; backend serving-model identity is not independently exposed by these APIs.

### Ephemeral parent limitation and reproduction

Both initial review cases used ephemeral parents. Named-role startup failed with `failed to load model context ... no rollout found for thread id <parent-id>`. Each lead disclosed the failure and completed a generic independent review with the appropriate brief. Those helpers used `gpt-6-astra`/`medium`, leaving the critic's model pin unmet on that fallback path.

Repeating the same prompts, files, profiles, model/effort and read-only policy with `thread/start.ephemeral: false` allowed both native roles to complete with the settings above. For a native app-server check on Codex 0.165.0:

1. Install the full collection and both reviewer profiles in a disposable selected project. Initialize the app-server and verify `skills/list` with `forceReload: true`.
2. Use a persisted parent with read-only permissions and the required model/effort available in the native catalog. The comparison parent used `gpt-6-astra`/`medium`; the critic profile retained its shipped pin.
3. Ask for a bounded comment audit or contract review without naming the expected skill or role. Inspect actual skill reads, spawn arguments, resolved child role/model/effort, reviewer completion, lead triage and before/after hashes.
4. Archive only the test-created persisted threads after collecting evidence and stop the app-server. In this run, all four persisted thread archives succeeded and all six app-server processes exited normally.

The paired results isolate this limitation in the tested client path; they do not establish behavior for every version, transport or ephemeral delegation mode. Generic fallback itself worked. Restricted-shell initialization also failed before startup with `Could not find home directory`; approved host execution resolved that environment restriction without changing global configuration or copying credentials. The model tasks still used read-only permissions and approval policy `never`.

The first observation harness missed `subAgentActivity` child IDs while looking for a different spawn event. Raw start/completion events established the generic reviews; later collection captured the correct IDs. Original failed-run evidence was retained. The harnesses and fixtures were disposable local artifacts, not automated repository CI.

### Limits of the result

This is a small smoke study, not a general accuracy or quality benchmark. Native reviewers in the automatic-dispatch cases inherited parent history (`fork_turns: all`); these checks do not establish blinded reviewer reasoning. The initial direct role probes used isolated contexts. All 62 skills loaded, but their individual behavior was not exhaustively tested. Linux/macOS native execution, other client versions, ambiguous or mixed-intent requests, repeated quality trials, unavailable-model errors, rate limits and cancellation remain untested. No token, cost, speed or quality savings are claimed. Behavioral role instructions alone do not enforce a separate sandbox.

An independent critic audited the supplied protocol/metadata evidence, matched hashes and parent-persistence comparison and corroborated these bounded conclusions.

## Comment Sicko dispatch update — October 27, 2026

The requested follow-up keeps `$no-comments` as the entrypoint and routes its comment-specific pass through `comment-sicko`. The new `.codex/agents/comment-sicko.toml` loads the installed portable reviewer brief; general candidate review still prefers `critic`. An unavailable named role uses a permitted independent generic helper with the same brief and an explicit disclosure. Without independent execution the Comment Sicko pass stays pending. Reviewers return proposals; the lead owns authorized edits and verifies findings.

Before this change, an independent instruction-selection trial given both named roles selected `critic` under the existing runtime default. Repeating the selection after the change selected `comment-sicko`; generic-only and no-helper scenarios followed the documented fallback and pending paths. These are simulated dispatch decisions, not native role launches.

An actual independent generic helper loaded the new role instructions and reviewer brief and inspected a disposable JavaScript fixture. It proposed two deletions (a section banner and redundant narration), retained the license and public API contract, and left an external signing constraint visible pending evidence. It reported zero applied deletions and no unsupported `MUST KILL` finding. The parent checked that the fixture's SHA-256 remained `6601c3c6ed4913065f93a15d67fdd407965259a740dc1483a72c7e7b91e1ff5b` after review. This establishes the disclosed helper path, not native custom-role loading.

The existing complete-adoption fixture initially caught the missing copied Comment Sicko profile. It now copies the full shipped profile inventory and still verifies preservation of unrelated skills, agents and `AGENTS.md`. Local validation passes: 52 Python tests with the same three platform-capability skips, all 62 skills under both metadata validators, and both TOML profiles under package policy. Relocated adoption remains byte-identical/idempotent, and a fresh native `skills/list` again discovers all 62 skills enabled. Native execution of the custom role is unverified in this host. The original `pstack/` snapshot is unchanged. Earlier one-profile results below remain evidence for their explicitly dated candidates.

## Complete pstack adaptation — October 27, 2026

This revision builds on the user-selected reliability PR #3 at `2c6be41080c0530876d933336b33d82b40183923`. It preserves that revision's critic, runtime, Interrogate and Review instructions. The collection now covers all 61 source skills (58 top-level and three nested Benny skills), plus the existing alias, for **62 installed skills**. All 23 upstream playbooks have explicit portable mappings. The original 200-file source tree remains `880564357e051d7c7802da1cb5d8df1d0b008299`.

### Executed package and runtime checks

Local host: Windows, Python 3.14.5, Node.js 24.11.1, Java 20.0.2, TLC 1.7.4, and Codex `0.164.0-alpha.11.1`. Commands ran from the Simplicit checkout unless stated otherwise:

| Check | Actual result |
|---|---|
| `python -B -m unittest discover -s scripts -p 'test_*.py'` | 52 tests, zero failures; two inherited agent-validator symlink cases skipped because unprivileged symbolic links are unavailable, and one Windows short-name case skipped because this local volume supplies no 8.3 alias. The Windows junction-containment case executed and passed. |
| `python -B scripts/validate_skills.py` | All 62 skills valid; local links and licenses present. |
| `python -B scripts/validate_agents.py` | The retained critic passes TOML parsing and package policy. |
| Standard Codex skill-creator `quick_validate` on each entrypoint | All 62 pass. PyYAML 6.0.3 was supplied only in ignored task-local scratch, with no global installation. |
| `node --test scripts/test_statechart.mjs`, with `TLA2TOOLS` set to the checksum-verified JAR | Seven tests pass, zero skips: real TLC success/round-trip, a real failing invariant and counterexample, help without dependencies/writes, chart compilation, actionable missing TLC, no unapproved renderer install, and preservation of unrelated output after invalid input. |
| Actual upload-statechart exercise | TLC explored five states/eight transitions with no broken properties; the chart round-tripped unchanged. PNG rendering ran with explicit opt-in and isolated cache; the generated image was opened and inspected for readability. This is a bounded model fixture, not proof of a product. |
| Relocated installation in a temporary Git project whose path contains spaces | All 62 skills and 200 distributable files copied byte-for-byte; destination validation passes; a second install adds zero folders; relocated statechart CLI help works. The separately copied critic passes its parser. |

The 52-test Python suite includes complete source mapping and exact licenses, deterministic manifest destinations, JavaScript module dependency closure, ten installer cases, and three decision-log cases. Installer tests cover differing/extra local content, unrelated skills, invalid sources, files at destinations, ancestor junctions, interrupted staging, interrupted publication and Windows short-name aliases. The junction/interruption failures were reproduced before their repairs. Staging prevents partially copied active folders; completed folder publication can be resumed idempotently. Concurrent destination writers are outside the installer contract.

The decision logger was exercised with whitespace, formula-like values, UTC timestamps and malformed existing logs. It preserves invalid inputs rather than appending corrupt records. It remains a single-writer helper.

### Native Codex discovery

**Passed.** A fresh native `codex app-server --stdio` process, launched in the isolated adopted project, received `initialize`, `initialized`, then `skills/list` with that project's `cwds` and `forceReload: true`. Filtering the response by the installed `.agents/skills` path found all **62 expected skills enabled**, with zero installation loading errors. This closes the earlier skill-discovery gap for this client/version and selected-project layout.

This check started no model turn and changed no global configuration. It establishes native skill parsing/discovery, not automatic-selection quality, behavior of every skill, custom `critic` role discovery, or execution of its pinned model. The earlier file-loaded workflow and reviewer trials below remain separate evidence. For reproduction, install into a disposable selected project, launch the app-server from it, initialize with a named client, and issue `{"id":1,"method":"skills/list","params":{"cwds":["<absolute-project-path>"],"forceReload":true}}`; compare returned names, paths, enabled flags and errors against the manifest plus alias.

### Independent review and bounded instruction trials

An independent reviewer compared all 47 newly added skill entrypoints and their required resources against the pinned source. Five concrete instruction applications covered unavailable model enumeration, missing transcript access, triage without posting authorization, formal-model drift/missing TLC, and repeated-measurement conclusions. These are instruction trials over supplied facts, not live service tests. Review exposed and verified repairs for UI-only references contradicting API/CLI reproduction, a missing unattended reporter-correction window, an overstatement of TypeScript range guarantees, and inconsistent video-render failure fallback.

A separate reviewer reproduced two installer defects: a destination-ancestor junction could redirect writes outside the chosen project, and a failed copy left partial active content that blocked retry. Both are repaired and independently approved. Additional paths-with-spaces installation/idempotence checks pass. The main routing/playbook integration passed a separate review against the retained PR #3 contract, including all 23 mappings and four bounded instruction trials for stale resume evidence, cleanup authority, critic-first review and missing capabilities. Its refactoring-baseline finding is repaired and the repair independently approved: the workflow now requires an executable pre-change behavioral record and actual equivalence checks.

### Current limits and CI

- Live webhook, tracker, scheduler, transcript and video integrations were not available/exercised. Their adapters discover actual capabilities and preserve explicit pending steps. Manual issue workflows remain usable without a scheduler.
- Statechart verifies bounded model assumptions; generated formal skills and real product behavior still need project-specific execution. Optional PNG dependencies are not installed by normal validation.
- Native custom-role/model execution and automatic skill selection remain unverified. Native loading of all 62 skills is established separately above.
- No token, cost, speed or quality benchmark was performed. Reviewer arithmetic over synthetic timings is not a performance result.
- CI retains the Python 3.11 Linux/Windows matrix and now adds Node 22, Java 17, a checksum-pinned TLC download and all seven statechart checks. Current completed results are recorded immediately below; the October 26 results belong to the earlier candidate.

The first expanded [hosted run](https://github.com/Jeffreyw7/Simplicit/actions/runs/40546396886) passed all Linux steps but exposed a Windows short-name-path incompatibility at `56bbe99`: `RUNNER~1` normalized to a different spelling and was wrongly rejected as a link. The installer now inspects actual symlink modes and junction reparse tags on each ancestor rather than equating normalization with redirection. An independent narrow review approved the repair. A dedicated native Windows short-name regression accompanies it and executed successfully on the hosted Windows runner.

The [repaired implementation run](https://github.com/Jeffreyw7/Simplicit/actions/runs/40546983901) at `0cc5d9cae0d0e1be7321f7d4482b39b358f0a03c` completed successfully on both platforms. Job steps and downloaded logs were inspected, rather than inferring success from workflow configuration:

| Platform | Python 3.11 suite | Collection and critic | Node 22 / Java 17 / TLC |
|---|---|---|---|
| [Linux](https://github.com/Jeffreyw7/Simplicit/actions/runs/40546983901/job/122340104727) | 52 tests, zero failures; one Windows-only short-name test skipped | 62 skills and one critic pass | Seven tests pass, zero skips |
| [Windows](https://github.com/Jeffreyw7/Simplicit/actions/runs/40546983901/job/122340105303) | All 52 tests pass with no skips, including short-name and link cases | 62 skills and one critic pass | Seven tests pass, zero skips |

These results establish Python 3.11 execution and Windows alias handling for the repaired implementation, without changing the earlier local skips. A ZIP made from the reviewed Git revision was also extracted into a temporary path containing spaces; its shipped installer successfully adopted all 62 skills and the copied destination passed validation. The archive excludes Git internals, scratch evidence and local runtime downloads.

## Historical evidence — October 26, 2026

The remaining record preserves the earlier 15-skill and reliability results. Counts, native-startup blockers and unrun capabilities below describe those historical candidates; the current native skill-discovery result above supersedes that specific gap only.

## Package checks

- All 15 skill entrypoints passed the standard Codex skill-creator metadata validator.
- The collection's validator found all local inline resource links and licenses in an isolated copy of the full skill collection. Its 48 files matched the source copy; root documentation links resolved and all license copies matched the upstream license.
- Twelve behavioral validator tests pass: valid sibling resources, missing resources, escaping links, folder/name mismatch, missing descriptions/licenses, code examples, nested links, empty collections, read-only validation, unrelated installed skills, and missing selected siblings.
- Seven invalid-package tests failed before the validator implementation. Two adoption-selection cases failed before that interface was added.
- Each adapted skill contains a copy of the original MIT license. The upstream source remains pinned separately; it is not required at execution time.

The historical package checks used Python 3.10+; the reliability update below raises the collection's tooling minimum to Python 3.11 for `tomllib`:

```sh
python -B -m unittest discover -s scripts -p 'test_*.py'
python -B scripts/validate_skills.py
python -B scripts/validate_skills.py /path/to/copied/.agents/skills
```

The package validator uses this source checkout's skill names when checking a destination. It intentionally leaves unrelated installed skills out of its checks. It supports the simple frontmatter and inline-link style used here; it does not validate Markdown heading anchors or arbitrary YAML schemas.

## Real regression trial

A bounded worker explicitly loaded a copied `simplicit` entrypoint, runtime contract, bug-fix playbook, `tdd`, and engineering reference. It operated only in a scratch Python fixture, without modifying reusable skills or spawning another helper.

The fixture's in-memory ledger recorded request IDs but credited the balance on every retry. Acceptance was deliberately narrow: retrying the same ID with the same positive amount credits once, distinct requests still add, and negative amounts remain rejected.

The worker added the regression before changing the implementation and ran `python -B -m unittest -v`:

```text
Before repair: duplicate retry FAIL, AssertionError: 2 != 4
Existing two tests: PASS
After repair: all 3 tests PASS, exit 0
```

The fix checks an existing receipt after negative-amount validation and returns the unchanged current balance for retries. The parent inspected the actual fixture, tests, and retained trial record and independently reran all three tests successfully. The fixture and logs remain in ignored workspace scratch rather than becoming product code.

This trial used explicit file-based skill loading, not Codex's native selector. It did not test persistence, concurrency, conflicting retry amounts, or a real project's runtime. It is evidence that the adapted routing and focused regression procedure were usable in this host, with those limits.

## Independent review

Before implementation, a reviewer found three plan defects: concrete source hazards were underspecified, meaningful behavior-preserving refactors lacked an explicit review gate, and installation collision handling was ambiguous. All were corrected and the reviewer approved implementation before skill edits began.

The final independent reviewer inspected the complete candidate, including new files, specialist references, validator implementation, adoption instructions, and actual scratch fixture. The reviewer independently ran the 12 validator tests, validated all 15 skills, reran the three fixture tests, and confirmed no upstream changes. Verdict: approved for Draft PR preparation, with no actionable findings.

The reviewer also evaluated these hypothetical scenarios by reading the instructions. These were not live host executions:

| Scenario | Evaluated behavior |
|---|---|
| Read-only why and teach | Targeted investigation, preserved confidence, no edits/messages or obligatory panel/diagram. |
| Consequential behavior-preserving refactor | Contracts, verification, and independent candidate review still required. |
| Direct interrogate with changed dependencies but unchanged SHA, and no independent tool | Invalidate affected stale evidence; report independent review pending; no review-only repairs. |
| Direct arena without workers or model diversity | Disclose lead-authored sketches; explicitly requested independence/diversity remains unmet. |
| Verification maintenance without runtime or deletion capability | Report incomplete live coverage as blocked and deletion unavailable; preserve product-code scope. |

The original imported Git subtree remains `880564357e051d7c7802da1cb5d8df1d0b008299`, with no tracked or untracked source additions under `pstack/`.

## Remaining limits

- No native Codex skill-selector/automatic-discovery session was launched.
- The 12 specialists were not all exercised against live projects or every supported application surface.
- No model-diversity, cloud-agent, formal-verification, or automatic deletion capability is claimed.
- No token, cost, speed, or quality benchmark was performed.
- Installation into another selected project has not been performed by this revision.

## Reliability update — October 26, 2026 (America/New_York)

### Candidate, scope, and host at the initial local handoff

- Starting checkout: clean `main`, revision `6c5cf96291c00262ad36d19db652849ea6b0e742`, equal to the requested review baseline. No newer changes were present to preserve; no applicable `AGENTS.md` was found in the checkout or inspected ancestor directories.
- Working candidate: local uncommitted diff on `codex/simplicit-reliability`, based on that same revision. It includes the critic, shared runtime/review routing, README, this record, two new agent-validation scripts, and `.github/workflows/validate.yml`. The final diff and untracked files are part of the candidate; HEAD alone does not identify it.
- Scope: Simplicit and disposable fixtures under ignored `.scratch/reliability-2026-10-26/`. No commit, push, PR, global configuration change, client installation, deployment, or adoption into a real project was performed.
- Host: Windows `10.0.26200.0`, PowerShell `7.6.5`, Git `2.51.2.windows.1`, Codex CLI `0.163.0`, bundled Python `3.12.14`. Local Python 3.11 execution and Linux execution are Not Run; the CI matrix requests Python 3.11 on both hosted platforms.
- `python` initially resolved to an inaccessible WindowsApps alias. Tests used the existing bundled runtime at `C:\Users\jeffr\.cache\codex-runtimes\codex-primary-runtime\dependencies\python\python.exe`; nothing was installed. The first unit-test attempt hit Windows temporary-directory access errors before assertions. Pointing process-local `TEMP` and `TMP` at owned workspace scratch resolved those errors without changing permissions or product code.
- `codex login status` reported ChatGPT authentication configured. `codex doctor --summary --ascii --no-color` reported startup/state-database access and network limitations in this sandbox. This is not evidence of database corruption or account/model unavailability. The active chat has independent-helper tools but no custom-role selector.

Current official documentation was read on this date: [custom agents and inherited permissions](https://learn.chatgpt.com/docs/agent-configuration/subagents), [native skill discovery](https://learn.chatgpt.com/docs/build-skills), and [configuration reference](https://learn.chatgpt.com/docs/config-file/config-reference). The installed CLI's help confirms `read-only`, `workspace-write`, and `danger-full-access` as parent sandbox values; it does not establish custom-role loading. The shipped `gpt-6.1-sol` / `high` choices remain unchanged. Parser validation is a narrower Simplicit policy, not a complete host schema validator or proof of account access.

### Executed deterministic checks

All source commands ran from `C:\Users\jeffr\OneDrive\Desktop\Simplicit`. This PowerShell setup reproduces the local runtime and writable temporary location (changes apply only to that process):

```powershell
$runtime = 'C:\Users\jeffr\.cache\codex-runtimes\codex-primary-runtime\dependencies\python'
$env:PATH = "$runtime;$env:PATH"
New-Item -ItemType Directory -Force '.scratch/reliability-2026-10-26/tmp' | Out-Null
$env:TEMP = (Resolve-Path '.scratch/reliability-2026-10-26/tmp').Path
$env:TMP = $env:TEMP
python -B -m unittest discover -s scripts -p 'test_*.py'
python -B scripts/validate_skills.py
python -B scripts/validate_agents.py
```

| Check | Observed result and coverage |
|---|---|
| Before edits: existing unit suite | 12 tests passed after the temporary-directory adjustment. |
| Before edits: skill validator | Passed for all 15 shipped skills. |
| New agent tests before implementation | Initial missing-module error, then 71 assertion failures against a no-op scaffold; 22 test methods, 2 unsupported symlink subcases skipped. The scaffold was replaced by the real implementation. |
| Implemented validator against original critic | Failed on `sandbox_mode`, as required. After removing it, passed for 1 agent. |
| Integrated suite including adoption | 35 test methods passed, with 2 symlink subcases skipped because this sandbox cannot create links. Existing 12 skill tests and their destination semantics are unchanged. |
| Source validators | Passed: 15 skills and 1 agent. |
| Complete copied destinations | Both CLI validators passed against `.scratch/reliability-2026-10-26/native/.agents/skills` and `.scratch/reliability-2026-10-26/native/.codex/agents`. |
| Collision/preservation fixture | `test_complete_adoption_preserves_unrelated_destination_files` copies the whole collection and critic into a fresh temporary destination containing an unrelated skill, an unrelated malformed agent, and `AGENTS.md`. Byte snapshots confirm all inputs are unchanged by validation and all three sentinels survive adoption. This is a test of disjoint fixture copying, not an overwrite/merge installer. |
| Local diff whitespace | `git diff --check` passed. |
| Hosted CI at the initial local handoff | Not Run at that point; subsequent passing results are recorded in the hosted CI follow-up below. Workflow uses `contents: read`, Linux/Windows and Python 3.11, unit tests and both validators. No secrets, model calls, publishing, or automatic adoption. |

The agent tests cover real TOML syntax, absent/empty/wrong-type required fields, names and filenames, duplicate shipped names, optional model field types, unsupported permission/session overrides, empty/missing source inventories, missing destination critic, unrelated destination profiles, invalid UTF-8, non-file profiles, input preservation, and CLI exit/count behavior. Symlink containment tests remain in the suite for hosts that support creating them. Validators never modify input files or call models.

Retained local evidence is under `.scratch/reliability-2026-10-26/`: `baseline-tests.txt`, `agents-red.txt`, `tests-green.txt`, `tests-adoption.txt`, `host-doctor.txt`, and `native-mechanical.jsonl`. Scratch is ignored and not part of the distributable package. The tests above recreate the deterministic cases without relying on these logs. To reproduce adoption alone, run:

```sh
python -B -m unittest discover -s scripts -p 'test_validate_agents.py'
```

### Native trials and remaining limits

A complete copied collection and critic were prepared in a new scratch `native/` directory. Its `README.md` contained `Simplicit reliablity fixture.`. The native mechanical trial used the following actual command from the source checkout (with the Python/temporary environment above):

```powershell
codex --no-daemon exec --ephemeral --json --sandbox workspace-write -C '.scratch/reliability-2026-10-26/native' -m gpt-6.1-sol '$simplicit Correct reliablity to reliability in README.md only. This is a mechanical edit. Check the result, preserve all other files, and report available custom role discovery separately. Do not spawn a reviewer, commit, install, or modify any configuration.'
```

It failed before model execution with `failed to initialize in-process app-server client: Access is denied. (os error 5)`, alongside state-database access warnings. The README typo remained unchanged. No permission bypass, authentication copying, global config edit, or client upgrade was attempted. Authentication configuration and copied files do not establish model execution or native role discovery.

| Native acceptance trial | Status |
|---|---|
| Native skill and critic discovery; pinned model execution through that role | Blocked at fresh CLI startup. |
| Mechanical edit with checks and no unnecessary reviewer | Blocked before execution; no behavior result. |
| One-prompt scratch bug fix through tests, independent review, supported repairs, and final evidence | Not Run because fresh native startup is blocked. |
| Separate review-only fixture through native discovery | Not Run; an explicit file-loaded in-chat trial is recorded separately below. |
| Missing runtime/role capabilities remain pending | Actual startup blocker and missing role-selector interface recorded; no pass substituted. |
| Reassess changed configuration; reuse unchanged evidence across phases | Deterministic evidence: original critic failed the new validator, then the corrected profile was rechecked and passed. Changed runtime links were revalidated. This is not a native behavioral proof of evidence reuse. |

For a future native retry, use a new disposable directory, copy the entire skills collection and critic after inventorying collisions, and start a fresh authenticated session there. Confirm native paths/role selection before treating discovery as proven. For the meaningful fix and separate review-only cases, seed `ledger.py` with this intentionally defective implementation and the contract in the README starting prompt:

```python
class Ledger:
    def __init__(self):
        self.balance = 0
        self.receipts = set()

    def credit(self, request_id, amount):
        if amount < 0:
            raise ValueError("negative amount")
        self.receipts.add(request_id)
        self.balance += amount
        return self.balance
```

Seed tests that distinct requests add (`2 + 3 == 5`) and a negative amount raises `ValueError`. Invoke the complete README starting prompt for the fix; require an executed duplicate-retry regression before and after the repair and an actual independent review. In a separate unchanged copy, request review only with the same contract and inspect hashes and helper activity afterward. If review finds no needed repair, record that the review-driven repair loop was not exercised. To test evidence invalidation, change a relevant fixture/configuration input after a pass, verify that affected coverage is reassessed, and verify unchanged valid coverage is reused. Do not represent these reproduction instructions as executed trials.

### Independent review and preservation

The generic in-chat reviewer ran successfully on the requested `gpt-6.1-sol` / `high` settings, since this host does not expose a `critic` role selector. It received an explicit bounded reviewer brief, not the parent's transcript. This establishes an available independent execution path on that requested model in this chat, not native custom-role loading. The modified critic is itself an artifact to inspect rather than an authority approving its own changes.

The actual separate review-only trial used `.scratch/reliability-2026-10-26/review-only/` with the defective ledger above and the two seed tests. The assigned reviewer directly performed the bounded review, spawned no reviewer, and reported the duplicate-credit defect at `ledger.py:9`: two calls with `("retry", 10)` returned `10`, then `20`, violating the required `10`. Its two seed tests passed; focused diagnostics also confirmed distinct IDs add and negatives reject. After return, the lead compared both files' SHA-256 hashes with the pre-review snapshot and found no edits. This was actual execution with explicitly loaded Interrogate instructions; it was not native discovery. The intentional defect remains in the review-only fixture. No repair loop is claimed for that read-only assignment.

The review-only trial's exact PowerShell command and observed output summary are retained in `.scratch/reliability-2026-10-26/review-diagnostic.txt`. Its exit 0 reflects the seed suite passing; the printed retry values establish the defect. The same independent candidate reviewer checked the later workflow-trial evidence additions against actual fixture files and hashes, found no supported corrections, and did not rerun unchanged checks.

The primary independent candidate review returned **PASS, no actionable findings** after inspecting all 10 changed/new files, including the modified critic's text/configuration independently. It verified the candidate hashes before and after review, independently reran the 35-method suite (2 symlink subcases skipped), both source validators, and `git diff --check`. Both new Python files also parsed under Python 3.11 grammar; this is not a Python 3.11 execution trial. No supported candidate defect required a repair or repair review. Later evidence-only additions to this record do not invalidate unchanged code/configuration checks.

### Additional executed workflow trial (explicit file loading)

A separate `.scratch/reliability-2026-10-26/bug-fix/` copy contained the complete skills, critic, defective ledger, and two seed tests. One compact prompt assigned a fixture lead the acceptance criteria, allowed local implementation/tests, and explicitly allowed exactly one independent reviewer. It continued through all stages without manual chat coordination. This supplements the blocked native trials; it does not establish native discovery.

| Stage | Observed execution |
|---|---|
| Original baseline | `python -B -m unittest -v test_ledger`: 2 tests passed. |
| Regression before repair | Same command: 4 tests ran; duplicate retry failed with `AssertionError: 2 != 4`. A negative-retry test also checked validation order. |
| Implemented repair | After rejecting negatives, return the current balance if the request ID already has a receipt; otherwise credit and record it. Same command: all 4 tests passed. |
| Actual independent review | One generic reviewer on `gpt-6.1-sol` / `high`, separate from the implementing lead, inspected the final fixture and reran its 4 tests. Result: PASS, no findings. It spawned no further helpers. |
| Final lead verification | `python -B -m unittest discover -v`: 4 tests passed after review; candidate hashes unchanged. |
| Parent integration check | Inspected actual files and retained evidence, then `python -B -m unittest discover -s . -p 'test_*.py' -v`: all 4 tests passed, exit 0. Copied skills/critic still match source bytes, and all reviewed source/configuration files remain unchanged. |

All table commands ran from the `bug-fix/` directory with the bundled Python 3.12.14 executable identified above. The implementing lead retained exact commands, hashes, review identity/disposition, and limits in `bug-fix/evidence.txt`. Final fixture hashes: `ledger.py` = `185418881062EE1BB34E7EC00F7583D9F1A52CB1EB85197EA88D9B03199CCAEB`; `test_ledger.py` = `98ACD96D8131D2F0E789EDE69A35841ED11C3F8D1E5F0979B86D5406CA2EE2E1`. The receipt fix and tests are disposable fixture content, not product changes.

No review-driven repair loop occurred: the original defect was fixed before review, and review found no further defect. The current host's generic reviewer path worked on the configured model, while custom critic loading remains unverified. Persistence, concurrency, and conflicting amounts for one ID were outside the stated fixture contract. Task-wide helpers were limited to three contexts: one reviewer reused for the separate read-only trial and primary candidate review; one fixture lead; and its one required independent reviewer. Completed helper records remain because this host exposes no record-deletion operation.

The initial `pstack/` snapshot contains 200 files, with tree object `880564357e051d7c7802da1cb5d8df1d0b008299`; a full-file SHA-256 inventory is retained locally in `pstack-before.json`. Both lead and reviewer confirmed all 200 file paths and byte hashes still matched, no tracked diff or untracked additions existed under `pstack/`, and license files were unchanged. No token, cost, speed, or quality savings are claimed.

## Hosted CI follow-up — October 26, 2026 (America/New_York)

The reliability update was subsequently committed and pushed as `cc608eb87764a72356d62eb342ae2ddd742344e5` on `codex/simplicit-reliability`, and [Draft PR #3](https://github.com/Jeffreyw7/Simplicit/pull/3) was opened against `main`. The initial local-handoff record above is retained as historical evidence. This follow-up records actual completed CI runs for that implementation commit, not a prediction about later commits.

All four `Validate` jobs completed successfully:

| Trigger / run | Linux job | Windows job |
|---|---|---|
| Push / [40430635290](https://github.com/Jeffreyw7/Simplicit/actions/runs/40430635290) | [PASS](https://github.com/Jeffreyw7/Simplicit/actions/runs/40430635290/job/121947143401) | [PASS](https://github.com/Jeffreyw7/Simplicit/actions/runs/40430635290/job/121947143088) |
| Pull request / [40430710624](https://github.com/Jeffreyw7/Simplicit/actions/runs/40430710624) | [PASS](https://github.com/Jeffreyw7/Simplicit/actions/runs/40430710624/job/121947389531) | [PASS](https://github.com/Jeffreyw7/Simplicit/actions/runs/40430710624/job/121947390319) |

Job-step results confirm successful unit tests and both validators in all four jobs. The pull-request job logs were also inspected directly: Ubuntu 24.04 used CPython 3.11.17 with working directory `/home/runner/work/Simplicit/Simplicit`; Windows Server 2025 used CPython 3.11.9 with working directory `D:\a\Simplicit\Simplicit`. Both checked out GitHub's test merge `033d38204001956874d89b3e1ad9d2a25051bd11`, combining the implementation head above with base `6c5cf96291c00262ad36d19db652849ea6b0e742`. This test merge is CI infrastructure; the PR itself remains unmerged.

The executed commands and observed results in each inspected pull-request job were:

```sh
python -B -m unittest discover -s scripts -p 'test_*.py'
# Ran 35 tests; OK, with no skips on either hosted platform.
python -B scripts/validate_skills.py
# Valid collection: 15 skills; local links and licenses present.
python -B scripts/validate_agents.py
# Valid profiles: 1 agent(s); TOML and Simplicit policy only.
```

This establishes actual Python 3.11 execution on Linux and Windows, including the symlink-containment subcases skipped by the local Windows sandbox. It does not change that earlier local result. The logs include a non-failing Node.js 20 deprecation notice for the existing checkout/setup actions, which GitHub ran on Node.js 24; no workflow change was needed for these successful runs.

### Remaining native-test gaps

- Fresh native Codex startup remains blocked by the recorded `failed to initialize in-process app-server client: Access is denied. (os error 5)` failure. Native discovery of the copied skills and custom `critic`, and execution of the pinned model through that role, remain unverified.
- The native mechanical-edit trial was blocked before execution. The complete native one-prompt bug-fix and native review-only trials remain Not Run. Native evidence invalidation/reuse behavior is also unverified.
- Successful in-chat trials explicitly loaded copied files and used the disclosed generic independent-reviewer fallback on `gpt-6.1-sol` / `high`. They are actual behavioral evidence for that path, not proof of native discovery or role loading.
- No review-driven repair loop was exercised because review found no additional defect. CI runs deterministic tests and parsers, with no model calls; it cannot close those native behavioral gaps.

No native trial was rerun for this documentation follow-up. The PR remains Draft; no merge, deployment, global configuration change, or adoption into another real project is part of this update.
