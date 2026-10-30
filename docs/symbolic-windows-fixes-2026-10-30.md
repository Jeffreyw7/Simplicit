# Symbolic states and Windows publication — October 30, 2026

Based on commit `8872fe6`, this work addresses the two remaining renderer/publication findings. The user requested fixes that retain existing functionality, independent review, a changed-and-why summary, and local commits for major changes. Investigation started October 29; local evidence retains that date in its folder name.

## Changes and reasons

| Area | Change | Reason and retained behavior |
|---|---|---|
| Symbolic model values | Reuse the pinned TLC token reader for opaque value atoms, including digit-leading names and operators, inside records, tuples, sets and functions. The configuration lexer uses the same helper without changing its grammar. | A failed nested value previously turned the entire broken-state tuple into raw text; `readBroken` then read individual characters as fields and crashed. Values now retain structure, numeric/boolean kinds, tuple metadata, mapping labels and counterexample paths. |
| Broken-state diagnostics | Validate the marked tuple, state record and set of violated rule names before using them. Reject malformed or irreducibly ambiguous values with a file/line diagnostic. Bound parsing work across alternate interpretations. | Valid symbolic values must not become fabricated state data. Existing ordinary values retain their first interpretation and malformed values retain the raw fallback contract. |
| Windows publication | Retry temporary EPERM/EACCES/EBUSY directory renames only on Windows, with six attempts and at most 775 ms total backoff for each rename. Recheck inputs/output safety before publication attempts; keep backup, rollback and permanent-error handling. | A native file handle without delete sharing reproduces the observed denial. Releasing it lets the same rename succeed. Bounded retries handle temporary sharing locks while persistent failures still return operational exit 2. |

Existing CLI commands, options, model-result exit meanings, summary schemas and retained-output backups remain in place. The original pstack tree and source pin are unchanged. No dependency installation or upstream adoption is part of this change.

## Review findings addressed

- The initial renderer correction handled the reported operators/digit-leading names but missed legal delimiter-shaped model values. Real TLC controls reproduced those cases, and persistent regressions cover them in scalar, tuple, set and function positions.
- Plain TLC text can be irreducibly ambiguous: two different valid values can print identically. Alternate parses are compared with tuple/set kinds included; differing complete interpretations are rejected rather than silently changing state boundaries.
- The initial alternate parser could take seconds on a small malformed collection. Token/field/delimiter/whitespace work now has an input-sized budget, and a subprocess regression rejects the former slow path.
- Review found that a staging-path replacement during a Windows retry could be removed by failure cleanup. Publication now pins an existing summary file's exact identity during waits, validates real-directory/file identities, releases the handle for each actual rename, and validates/re-pins after failure. Cleanup removes the stage only if ownership still matches; replacement files/directories are retained and named. An additional handle-cleanup failure regression preserves the original publication error and restored output.

## Verification

Final combined verification completed on the reviewed source with zero failures.

| Check | Result |
|---|---|
| Selected upstream compatibility cases | 64 passed, zero failures/skips, against the active helpers. This is a selected subset of the original 150-case suite. |
| Full Node/TLC suite | 112 tests: 111 passed, zero failures, one native junction capability skip. Includes the new symbolic and Windows regressions through the existing CI entrypoint; the complete run took about 11.6 minutes in this sandbox. |
| Python and validators | 70 tests, zero failures, five environment/platform skips; 62 valid skills and two valid agent profiles. |
| Independent reviews | No remaining actionable finding in the revised renderer and Windows scopes. Reviewed product/test hashes are recorded in local receipts. |
| Source integrity | Original pstack tree `880564357e051d7c7802da1cb5d8df1d0b008299`, agent profiles and migration pin unchanged. Resource map covers 200 pinned files and 211 current adaptation targets. |

Completed evidence so far:

- Seven initial renderer regressions passed, including the original two-state symbolic counterexample, expected-broken status behavior and four distinct initially broken operator states.
- Added delimiter, ambiguity and malformed-work regressions were observed failing before the corresponding corrections.
- Independent renderer review exercised eight actual nested atom states, 142 prior value contracts, 27 diagnostics/adjacency checks, ambiguity proofs and a 1,000-case generated symbolic corpus. The final corpus has no silently changed values; all 11 conservative ambiguity/work-budget rejections were also raw on baseline `8872fe6`, with no baseline typed-value regression in that corpus. Malformed 2.4/4.8 KB tuples now return raw in tens of milliseconds instead of seconds, and string scanning is included in the work budget.
- Native Windows probes reproduced EPERM with an open child file lacking delete sharing, and EBUSY with a directory handle. A deterministic release handshake verifies publication recovery after a real OS denial.
- Full Python suite: 70 tests, zero failures, five environment/platform skips. Both validators pass: 62 skills and two agent profiles.
- Full combined model suite: 111 passed, zero failures, one explicit junction skip. Transient denials, permanent errors, native sharing-lock recovery, competing outputs, changed inputs, staging replacements and cleanup failures all passed. The previously intermittent publication cases pass in this combined run.

Reproduction commands:

```text
python -B -m unittest discover -s scripts -p 'test_*.py'
python -B scripts/validate_skills.py
python -B scripts/validate_agents.py
node --test scripts/test_statechart.mjs
```

For model checks, set `TLA2TOOLS` to the existing pinned JAR and `JAVA` to a working Java executable. Local trials use Node 24.11.1, Java 20.0.2 and TLC 2.19 from the immutable 1.7.4 JAR, SHA-256 `936a262061c914694dfd669a543be24573c45d5aa0ff20a8b96b23d01e050e88`. The Oracle javapath launcher stalled inside this sandbox; the installed JDK executable worked directly. This is test setup evidence, not a runtime dependency change.

## Limits

- The exact process that caused the historical Windows denials is unknown. Native probes establish the failure class and recovery behavior. Locks lasting beyond the retry window, permission failures and unsafe concurrent changes continue to fail with recovery diagnostics.
- Ambiguous textual spellings cannot be decoded losslessly without additional type information. Such newly supported symbolic cases are refused clearly. Parsing work limits also preserve a prompt raw fallback for malformed or excessively ambiguous output; no model success is fabricated.
- Native Linux Node/TLC and hosted CI were not run in this task. Non-Windows retry behavior receives scoped review coverage; that is not a native Linux runtime claim.
- Native junction creation is denied in this sandbox. A junction-only escalation was canceled; the native junction replacement test probes capability and skips explicitly when unavailable. File/directory substitution and ownership checks run within current permissions.

Local evidence is in `.scratch/renderer-windows-fixes-2026-10-29/`, including the scoped Windows and renderer reviews. Scratch artifacts are not installed resources. Upstream compatibility checks use isolated temporary copies and retain their assertion adaptations separately.

The upstream assertions are adapted only in that temporary copy: compare configuration tokens while retaining source formatting/comments, accept Windows recovery paths, and account for the already-documented previous-output backup message. Original upstream tests remain unchanged.

All three task helpers completed, and interruption controls were applied after collecting reports. This host has no agent-session deletion API. Changes are committed locally as requested; no push, merge, installation, upstream adoption or external message was performed.
