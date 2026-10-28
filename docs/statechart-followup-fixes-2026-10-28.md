# Statechart follow-up fixes and review — October 28, 2026

These changes address the four remaining findings from the October 27 intensive review, based on commit `bba13b8`. The user requested preservation of existing functionality, independent review, a summary with reasons, and local commits for major changes.

## Changes and reasons

| Finding | Change | Reason and preserved behavior |
|---|---|---|
| Accepted TLC filenames could hide manually authored files that publication deleted. | Retain every replaced output directory in a unique dot-prefixed sibling ending in `-old`; print its location. Keep each displaced directory separately during overlapping publications. | Filenames and extensions cannot establish ownership. Whole-directory retention preserves custom bytes while still publishing fresh results at the normal output path. Unrecognized names and linked paths remain rejected. |
| Configuration section names used as constant values were interpreted as new sections. | Consume constant values, nested sets, operator arguments, module qualifiers and replacement operands before looking for another section; preserve source text by masking only extracted rule tokens. | TLC permits keywords in these positions. Actual model checks must retain their invariants, literal spacing, comments and line endings. |
| Cleanup failure could mask a publication/restoration failure and its recovery location. | Use best-effort staged cleanup and keep the original publication diagnostic and restoration result. | Operational failure remains exit 2, and users can locate their prior output even when cleanup also fails. |
| Formatting unusual mapping exceptions could throw a second exception. | Guard prototype inspection, message access and string conversion, with a safe fallback description. | Mapping-import failure remains an operational error with its mapping path and prior output intact. |

The existing commands, options, skill entrypoints, model-output schemas and 0/1/2 exit meanings are unchanged. Existing TLA sources remain authoritative; source-backup behavior is retained. The intentional visible change is persistent previous-output backups and their printed locations. Review and remove these folders manually when no longer needed: repeated runs can retain large TLC graphs.

## Independent review

The preservation/exception reviewer found no remaining actionable issue in those three fixes after 38 successful assertions: 34 candidate CLI launches and four baseline controls. Tests covered byte-exact inventories of 22 files, successive generations, multiple overlaps, rejected foreign overlaps, overlapping runs followed by restoration failure, cleanup exceptions, unusual mapping throws, and publication of status-1 model outcomes.

The first parser candidate introduced a compatibility regression by splitting symbolic model values such as `=>`, `[]` and `<=>`. Independent comparison with the pinned TLC grammar exposed it before commit. The correction uses longest-token matching from the pinned SANY lexer, including identifiers, symbolic tokens, strings and proof-label forms, before applying configuration grammar. Regression controls reproduced the failure before correction. The final review compares both extracted rule lists and the values TLC parses from the retained configuration, rather than relying only on exit status.

The final independent matrix exercised 2,687 configurations against the actual pinned parser. All 2,391 nonmalformed accepted cases matched extracted rules and retained configuration semantics; no new actionable mismatch remained. Coverage included symbolic tokens, keyword operands, constant/module replacements, operator argument parsing, singleton/list sections, whitespace-free boundaries, comments and escaped strings. This finite parser comparison is supplemented by full CLI tests; it does not imply that every parsed configuration is a semantically valid model.

## Compatibility boundaries

- The original `pstack/` snapshot, upstream pin and custom agent profiles remain unchanged. Upstream adoption remains a read-only comparison workflow; no automatic replacement or preview/accept adoption was added.
- Two pre-existing renderer failures were independently reproduced on baseline `bba13b8`: configurations assigning `+` or `0INVARIANT` to a constant used as model state can reach `bug-states.mjs:61` and fail with `b.rules.some is not a function`. These are separate from configuration extraction and are not repaired by this four-finding change.
- The existing stricter rejection of unterminated comments remains. The pinned TLC parser also rejects certain radix numerals with a number-format error; extraction does not change those errors into successful checks. Compatibility evidence is against the pinned TLC build, not a promise about future grammar changes.
- Native Linux Python checks ran, but native Linux Node/Java were unavailable. Hosted CI was not triggered. Fault injection exercises deterministic permission/overlap cases, not power-loss durability, disk exhaustion or every filesystem scheduling behavior.

## Verification

| Check | Result |
|---|---|
| Windows Python 3.14.5 | 70 tests, zero failures; four skips for unavailable symlink privileges/Windows short names. |
| Ubuntu Python 3.14.4 | 70 tests, zero failures; two skips for unavailable PowerShell and the Windows-only short-name case. |
| Skill and agent validators on both platforms | 62 valid skills and two valid profiles. |
| Windows Node 24.11.1 / Java 20.0.2 / pinned TLC | Final combined run: 83 passed, two Windows EPERM publication failures, zero skips. Both affected cases and the earlier permission-failure case then passed in an isolated three-test run. All 85 distinct cases passed across these runs; a clean single full-suite run is not claimed. |
| Selected original upstream cases against active helpers | 64 distinct cases passed: 63 in the broad run, then the remaining scenario passed after adjusting its legacy console expectation. This is a selected subset of the 150-case upstream suite. |
| Independent reviews | 38 preservation/exception assertions and the 2,687-config parser matrix; 24 completed additional config integration fixtures were checked independently. A duplicate reviewer suite was stopped to avoid redundant work and is not claimed as a completed run. |
| Source/review integrity | Original pstack tree, role profiles and migration pin unchanged; production file matches the reviewed hash; all four preservation/exception scopes match their reviewed snapshot. |

The upstream assertions were adapted only in an isolated temporary copy: compare configuration tokens while preserving original comments/spacing, accept Windows recovery paths, and remove the new backup-location line from two legacy exact-console comparisons in the same scenario. Model-result comparisons remain intact. Dedicated recovery tests verify the new message and backup contents; no original upstream test file was edited.

Three new constant-operator controls initially expected a violated invariant, but direct pinned TLC instead raises a RuntimeException during initialization even when the configured operator is unused. They now assert that same failure reaches the wrapper as operational exit 2, with the specific TLC diagnostic and unchanged source configuration. They do not claim support for evaluating those operators. An earlier parallel combined run also encountered one Windows EPERM during publication and reported restoring the prior output; its evidence is retained rather than discarded.

The final combined run's two permission failures also occurred after successful model analysis, during staging-folder rename. The affected scalar-token and CR-only-comment cases passed on isolated rerun without code changes, as did the earlier preservation case. The rename helper is byte-for-byte equivalent to baseline after line-ending normalization. The cause of the intermittent OS denial was not established; Windows publication intermittency remains a validation limitation. No permission override or unbounded retry was added.

Reproduction commands:

```text
python -B -m unittest discover -s scripts -p 'test_*.py'
python -B scripts/validate_skills.py
python -B scripts/validate_agents.py
node --test scripts/test_statechart.mjs
```

Set `TLA2TOOLS` to the existing pinned JAR for the Node/TLC suite. Its SHA-256 is `936a262061c914694dfd669a543be24573c45d5aa0ff20a8b96b23d01e050e88`. The suite entrypoint imports the new configuration and recovery tests, so the existing CI command includes them. The resource-level upstream map identifies these tests as adaptation review targets.

Local evidence is retained under `.scratch/four-fixes-2026-10-28/`, including the config regressions, preservation review, final config review, suite receipts and isolated upstream test adaptations. Scratch evidence is local and is not part of the installed skills.

Helpers finished and were stopped after their reports were collected. This host exposes interruption but no agent-session deletion API. The changes are committed locally as requested; no push, merge, installation, upstream adoption or external message was performed.
