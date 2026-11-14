# Token-efficiency safeguard validation — 2026-11-09

Historical status as of November 9. The later authorized branch review and behavioral observations are recorded in the [November 13–14 validation addendum](branch-merge-2026-11-13.md). The observations and remaining-gates table below retain their original scope; consult the addendum for subsequent evidence.

Status: instruction candidate committed; local live smoke checks and repository suites executed. Independent review, controlled baseline/candidate agent trials, full CI coverage, and measured token/cost/latency savings remain pending.

## Candidate and identity

Branch: `feat/worker-model-routing`. Implementation commit: `bc0ce67ab2e109488097130bcc4fbc3d262c7c4c`. Baseline: `d08c74f19f20a6f19d4af20d71be87ff650453f8`. The working tree was clean before trials. Only validation/planning documents and their evidence record are updated by this trial pass; the three production references and all model profiles remain unchanged.

Hashes below identify exact committed Git blob bytes, not checkout line endings. The previous report used local-file hashes; two differed from Git solely because of CRLF normalization. Local hashes are retained separately in the [machine-readable evidence](token-efficiency-2026-11-09-evidence.json). Compare commit/path/blob identity or explicitly normalize newlines; do not treat line-ending changes as instruction changes.

| Reference | SHA-256 of committed Git blob |
|---|---|
| `skills/simplicit/references/runtime.md` | `543c6469a54672bbbf6e8f370b3d660840195cc699a1491ccdd5eab2e8ae95e3` |
| `skills/simplicit/references/worker-routing.md` | `069bda0b31d733a772435f49682d81322a5737f989f167f4c95053742069b65b` |
| `skills/simplicit/references/simplicit-agent.md` | `4eb612eea03365e5086cf61ee29622d3b192dcd88119df30c13a1720d91e0fe7` |

The selected safeguards were informed by Jimmy at `6b8ed1183420abf82a43a399bfa336428b04a100`, especially its delegation and verification guidance. Existing Simplicit fallback disclosure, exact profile settings, final integration checks, and independent review remain unchanged. This is not a live Jimmy-versus-Simplicit comparison.

## What ran and what the observations mean

The current author used the live shell tools and the candidate's guidance to handle disposable, predefined diagnostics. Fixtures and output-selection commands were authored with the expected cases known. Selection occurred in PowerShell before the returned tool result entered model context; raw diagnostic logs were retained locally, and one detail was retrieved separately. This demonstrates available tool mechanics and this author's execution, not reliable independent-agent behavior, an automatic policy, or an improvement caused by the instruction change. No baseline agent arm was run. No worker/reviewer was launched, and no model routing or context-isolation result is inferred.

| Local check | Actual observation | Scope of result |
|---|---|---|
| O1 successful output | 2,001 generated lines; tool response retained counts (`passed=2000 skipped=0`), exit 0, command/cwd and evidence reference; log item 1001 was retrieved on demand | PASS for this author-guided output-mechanics smoke check |
| O2 buried failure | Item 1001 failure and `passed=1999 failed=1 skipped=0` retained; actual process and tool exit 1 | PASS for preservation of the intentional failure; diagnostic itself failed as designed |
| O3 required skip | Exit 0 with `passed=1999 skipped=1`; required-skip reason remained visible | PASS for preserving the gap; fixture coverage is incomplete, not a full verification pass |
| O4 missing/sensitive evidence | Original log absent; safe diagnostic expansion produced failure details and exit 1; fictional sensitive value redacted before retention and confirmed absent from log | PASS for this recovery/redaction smoke check; no real secret was used |
| E-related syntax check | Safe one-file check passed, then failed after a deliberate syntax change, then passed after restoration; recorded input identity changed and returned to the original | Partial mechanical coverage only; full E1–E5 workflow cases remain pending |

The output fixture was synthetic and its schema known. No fixed log-tail filter is proposed for real commands. O1–O4 still need fresh baseline/candidate sessions under the plan's evaluation method. A short selected payload is not a measured whole-task token saving; command-writing, fixture setup, diagnostics, and rereads have costs too.

## Existing repository checks

Local environment: Windows, Python 3.12.14, Node 25.2.0, Java 21.0.12.1. TLC file SHA-256: `936a262061c914694dfd669a543be24573c45d5aa0ff20a8b96b23d01e050e88`, matching the repository's pinned file. Java/TLC selection was process-local; no global configuration changed. The prescribed CI matrix uses Python 3.11, Node 22, Java 17 on Windows/Linux, so these local results do not replace it.

| Command (repository root unless noted) | Observed result |
|---|---|
| `python -B scripts/validate_skills.py` | PASS, exit 0; 62 skills, local links and licenses |
| `python -B scripts/validate_agents.py` | PASS, exit 0; 5 profiles, TOML and policy |
| `python -B scripts/check_package.py` | PASS, exit 0; 62 skills, resources and profiles |
| `python -B -m unittest discover -s scripts -p 'test_*.py'` | Exit 0; 109 tests run, no failures/errors, five reported skips (including subtest skips); coverage incomplete |
| Targeted verbose rerun of four methods with skipped cases | Confirmed four symlink-related skipped checks/subtests due to unavailable Windows symlink privilege, plus one unprivileged-POSIX-only skip; no permissions were changed |
| `node --test scripts/test_statechart.mjs` with verified TLC and installed JDK | PASS; exit 0; tests=180, pass=180, fail=0, skipped=0, cancelled=0 |
| `git diff --check` before and after document updates | PASS; no production changes from the trials; only planning/validation documents and evidence changed |
| Document links, captured log hashes, evidence JSON, and archive integrity | PASS after updates; checked repository and delivery copies |

The statechart test process exited 0 and its full log/metadata were saved. The capture helper subsequently exited 1 while displaying Unicode through Windows cp1252; this was a reporting failure, not a test failure. Reading the saved UTF-8 log recovered the 180-test result without rerunning the suite. The local helper was corrected to use UTF-8 stdout and a focused Unicode check passed; both its original executed source and corrected source are retained. No repository code was changed for this repair.

The original structural checks also passed before and after the instruction edits; current results above are fresh trial observations. Test-run durations and commands are retained in the evidence record solely for reproducibility, not as model/workflow latency benchmarks. The initial Oracle Java launcher stalled and was interrupted; the installed JDK worked directly. One syntax-evidence command used the wrong working directory and never executed the check; the corrected attempt is recorded. A progress-to-test mapping attempt failed because subtest skips add progress characters; targeted verbose execution resolved the skip reasons. These setup attempts are not hidden or counted as product passes.

## Evidence and reproducibility

The [evidence JSON](token-efficiency-2026-11-09-evidence.json) records exact commands, working directories, UTC starts, exits, log hashes, runtime versions, source identities, fixture/selection source, setup problems, and limitations. Full local logs and the disposable sources are bundled in `outputs/simplicit-live-trials-2026-11-09.zip` in this conversation's workspace. Original local evidence directory: `C:/Users/jeffr/Documents/Codex/2026-11-08/referenced-chatgpt-conversation-this-is-an/work/live-trials-20261109`. Local paths are provenance, not portable installation paths. The JSON retains source text so another reviewer can reconstruct the fixtures in their own disposable directory and substitute their verified runtime paths.

The collection helper captures command output and exits; it does not simulate role routing, choose whether evidence is fresh, or grade agent compliance. It remains a local test utility, not a shipped workflow wrapper/cache. An original missing log remains missing; the O4 log is new diagnostic evidence. No secrets were collected.

## Remaining gates

| Gate | Status / next action |
|---|---|
| Controlled O1–O4 baseline/candidate trials | NOT RUN; current smoke observations are supplementary, not substitute passes |
| C1–C6 worker/context/fallback trials | NOT RUN; execute outside this side conversation in an authorized environment with actual dispatch metadata |
| Complete E1–E5 cases and integrated workflow | NOT RUN; syntax checks cover only a small mechanical subset, not state-aware agent reuse or independent repair review |
| Independent whole-candidate review | PENDING; the author cannot satisfy it and subagents remain prohibited here |
| Full CI matrix and skipped coverage | PARTIAL: symlink/POSIX behaviors passed on Ubuntu; Windows-specific cases have complementary Windows evidence. Exact-version CI and Windows symlink execution remain unverified; no candidate hosted CI run exists |
| Matched efficiency pilot | NOT RUN; use the plan's frozen 30-attempt design and explicit paired analysis rule; complete lead/worker/reviewer/retry usage remains unavailable |

The [implementation plan](../superpowers/plans/2026-11-09-simplicit-token-efficiency.md) records completed editing steps and the remaining work. Its pilot now specifies pairing, a 5% practical threshold, an exploratory paired-bootstrap interval, and quality gates before any results. These are evaluation conventions, not predicted savings. An unavailable or inconclusive pilot permits no demonstrated-efficiency claim.

## Remaining downsides and containment

| Downside | Workflow impact | Containment without removing required functionality |
|---|---|---|
| Added instruction/brief overhead | Small tasks may use more tokens than the changes save | Keep one authoritative rule/record, omit irrelevant detail, and measure the complete task before claiming net savings |
| Output selection can omit relevant material | Diagnosis may require extra reads or could miss a warning | Preserve true status, failures/skips and relevant warnings; retain authorized evidence and expand diagnostics as needed. Synthetic smoke success is not universal log-parser coverage |
| Fresh context can lose decisions or repeat grounding | Workers may revisit rejected approaches or perform extra investigation | Require a sufficient brief, preserve reasons/evidence, allow reassessment, and reuse suitable existing helpers |
| Evidence can go stale or cost too much to validate | Incorrect reuse risks missed regressions; excessive tracking slows work | Inspect only relevant state, safely rerun cheap affected checks, and retain final integration/independent-review gates |
| Host limits and agent judgment vary | Intended role/context or evidence behavior may be unavailable or inconsistently followed | Record actual/unverified settings, preserve explicit requirements, and keep unsupported or unreviewed work pending |
| Local testing leaves coverage gaps | Passing commands could be mistaken for full workflow validation | Report skips and platform/version differences; complete native comparisons and independent review separately |

## Follow-up completion attempt

The existing Ubuntu environment runs as unprivileged user ID 1000 with Python 3.12.3. Its full Python suite ran 109 tests with no failures/errors and five reported skips. The four methods covering symlink rejection and POSIX read-only-directory cleanup that were skipped on Windows passed on Linux, including the source/destination symlink subcases. Linux skipped Windows junctions, Windows short names, Windows ACL inheritance, Windows read-only-file deletion, and the PowerShell CSV case. These are complementary local observations, not proof that every test passed on every platform. Windows symlink behavior remains unexecuted on Windows.

All three structural validators also passed on Ubuntu: 62 skills, five profiles, and a valid package. Exact command, output, skip details, and log hash are included in the evidence record and refreshed local archive. No test or acceptance criterion was weakened to obtain these results.

The GitHub Actions lookup for implementation commit `bc0ce67ab2e109488097130bcc4fbc3d262c7c4c` returned zero runs. The available Ubuntu environment has no Node or Java runtime; the available Windows versions remain different from CI. No runtimes, permissions, global configuration, or project trust were changed, and no push or workflow dispatch was performed.

**Completion is blocked, not achieved.** This side conversation prohibits subagents, so it cannot execute the delegated baseline/candidate trials or provide an independent non-author agent review. The 30-attempt efficiency pilot depends on those executions and complete usage evidence. Continue those gates in an authorized main conversation; then obtain exact-candidate CI in the prescribed runtime matrix. Do not substitute another author self-review, another shell fixture, or repeated local checks for these missing gates. No implementation regression was found in the additional checks.

## Document self-review after trials

Implementation status now points to the real commit, completed edits are checked, and handoff starts with missing validation. Hashes use a declared Git-blob convention. The pilot verdict rule is explicit before measurements. Local smoke observations, intentionally failing fixtures, skipped tests, and unrun controlled trials are distinguished. No new model setting, production helper, review exemption, or savings claim was introduced. This is author self-review only. The document/evidence update is not committed or pushed by this trial pass.
