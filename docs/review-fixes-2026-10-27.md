# Review fixes and completion evidence — October 27, 2026

This work fixes the eight findings in the Simplicit review, its source-preservation hazard, and the related test/inventory/reflection gaps. It builds on `8cd5a1c82b325f09d5aeafaac2b2c751d72de3f3` on `feat/all-pstack-skills`. The user subsequently requested local commits for major changes.

## Requirement audit

| Requirement | Implemented behavior | Verification |
|---|---|---|
| 1. Configuration fidelity | Property extraction masks declarations without rewriting strings, whitespace or comments. Line comments support LF/CRLF/CR, nested block comments are scanned, and TYPE/TYPE_CONSTRAINT remain sections. | Direct-TLC comparisons reproduce the original two-space false pass and CR-only false pass; both now return the expected violated invariant. Complex quoted/commented configs and both TYPE sections match direct TLC. |
| 2. Duplicate region captions | Ambiguous repeated display captions are rejected clearly before model publication. Normal unique captions remain supported. Special JavaScript property names are stored as ordinary data. | Parser/CLI rejection; independent generated TLA assertions and real four-state/four-transition control. Independent special-caption/guard probes preserve four states/three transitions. |
| 3. Windows regeneration | Existing-directory EPERM is treated as a collision only in the verified Windows directory case. Replacement retains rollback and ownership checks. | Repeated from-chart and from-spec publication; stale output replaced; unrelated EACCES/EPERM and failed restoration probes preserve or report recoverable originals. |
| 4. Escaped values | All six TLA escapes decode correctly; malformed input keeps the existing raw-value fallback. | Distinct state keys, two-state/one-transition TLC counterexample with Before → After, one reader step and startsHere=false. Independent 12-value TLC probe covers all six escapes and literal counterparts. |
| 5. Decision logs | Standard TSV serialization preserves literal quotes after existing control-character/formula sanitization. CLI, columns and timestamp contract stay intact. | Python csv.reader and actual PowerShell Import-Csv round trips for balanced/unbalanced quotes, formula-like values and successive records; original corruption reproduced before repair. |
| 6. Unattended correction gate | Full window starts after authorized report delivery and successful content/location readback, or an explicitly selected alternate gate. Missing prerequisites leave the fix pending. | Implementer and fresh independent scenarios cover timing, missing permission, failed delivery/readback, observation failure, setup corrections, ownership changes, alternate gates and manual work. |
| 7. Documented command | Statechart help uses the real slash-separated, quoted script path. | Original command fails; corrected command succeeds. A persistent test executes the command extracted from SKILL.md without external runtimes. |
| 8. Mapping errors | Syntax/import failures and arbitrary thrown values use operational status 2 with useful diagnostics. | Actual modules with syntax errors, missing imports, null, undefined and string throws; previous output remains intact. |
| Source preservation | Output/tool preflight and source-type/readability checks precede sibling writes. Generation stages first, backs up replaced siblings, and restores them on execution/publication failure when safe. | Blocked actual output, nested foreign files, non-file source, unknown expected rule, partial writes, concurrent edits, permission failures, failed source/output restoration and successful backup probes. |
| Correct preservation test | Sentinel uses the actual Flow-statechart output path. | Top-level and nested foreign-file regressions verify input/output preservation. |
| Required Comment Sicko profile | Both shipped profiles are independently required, while source-selected destination validation still permits unrelated roles. | Required-source removal tests and independent selected/unrelated-profile probes. |
| Reflection routing | Existing edits retain invoked/missed-trigger constraints; recurring workflows with no existing home can use the already documented new-skill route. | All three lens briefs, entrypoint and synthesizer agree; independent recurrence, one-off, existing-home, missed-trigger and backlog scenarios pass. |
| Compatibility and source preservation | Commands, options, output schemas, skill/role names and role profiles remain unchanged. The original pstack subtree is untouched. | Full suites, five additional CLI workflow probes, PNG success/failure, validators, actual diff review and unchanged upstream/role checks. |
| Independent review and cleanup | Three implementers and three fresh reviewers worked in bounded scopes; all material findings were addressed. | Reports and correction regressions retained; lifecycle inspection shows no task-created agent running. Host exposes stop/interrupt, not session deletion. |

## Additional findings caught during independent review

The fresh reviewers identified six material gaps in the initial fixes. These were reproduced before the corresponding corrections:

- CR-only line comments could still hide invariants.
- TYPE and TYPE_CONSTRAINT could be mistaken for invariant names.
- A mapping throwing null/undefined could still return status 1; string exceptions lost their diagnostic.
- Generated regions-proof.mmd / regions-all.mmd were rejected on a later run.
- Old-output or work-folder cleanup failure could roll sources back behind already published results.
- Source-stage cleanup failure could cancel the transaction handle before the caller received it.

All are covered by the final regression suite. Cleanup after successful publication now reports retained paths while preserving the completed check's result and committed sources. Temporary cleanup cannot cancel a source transaction. PNG documentation explicitly preserves the existing partial-output contract.

## Preserved behavior and necessary corrections

- Existing TLA files remain the source of truth; from-chart does not regenerate their siblings.
- When TLA is absent, generation still replaces sibling cfg/map with generated defaults. Original bytes are retained in a unique reported `.NAME-statechart-backup-*` folder. Review these backups before removing them.
- Duplicate region captions now produce an actionable error instead of silently dropping behavior. Distinct captions continue to work.
- The exit contract remains 0 for expected outcomes, 1 for unexpected model outcomes/chart mismatch, and 2 for setup/input/execution failures. PNG-only failure still returns 2 while retaining published model results, generated sources and source backups.
- Cleanup-only warnings identify retained temporary/old-output paths and do not convert a completed check into a property failure.
- No packages or dependencies were installed or upgraded. The inactive upstream subtree remains `880564357e051d7c7802da1cb5d8df1d0b008299`; both custom role profiles are unchanged.

## Executed verification

| Check | Result |
|---|---|
| Windows Python 3.14.5 full suite | 54 tests, zero failures, 3 skips: two symlink-privilege cases and unavailable Windows 8.3 names. |
| Ubuntu Python 3.14.4 full suite | 54 tests, zero failures, 2 skips: unavailable PowerShell and the Windows-only short-name case. |
| Windows Node 24.11.1 / Java 20.0.2 / pinned TLC | 30 tests passed, zero skips. The existing suite entrypoint imports the new value/parser regressions, so CI runs them too. |
| Skill validator on Windows and Ubuntu | 62 skills valid; local resources and licenses present. |
| Agent validator on Windows and Ubuntu | Both profiles valid. |
| Preserved CLI workflow checks | Real TLC exercises --fixed, --against, --expect-broken, --cover, --module and --out with independently expected statuses/model-state counts. |
| Optional PNG | Existing cache produces a readable Idle → Done PNG, visually inspected. Injected PNG-write failure returns 2 while retaining model output, generated sources and original-source backups. No installation opt-in used. |
| Review/static checks | Fresh independent scoped reviews; diff whitespace check; unchanged pstack/role profile checks; evidence and changed-file hashes retained. |

Reproduction commands remain:

```text
python -B -m unittest discover -s scripts -p 'test_*.py'
python -B scripts/validate_skills.py
python -B scripts/validate_agents.py
node --test scripts/test_statechart.mjs
```

Set TLA2TOOLS to the existing checksum-verified JAR for Node/TLC tests. The JAR SHA-256 is `936a262061c914694dfd669a543be24573c45d5aa0ff20a8b96b23d01e050e88`.

## Evidence and limits

Local receipts are retained under `.scratch/review-fixes-2026-10-27/`: root-red.txt, review-red.txt, review-green.txt, cleanup-red.txt, final-node.txt, integrated-python.txt, linux-results.json, png-results.json, compatibility-results.json, and the packaging/values/workflows folders. Fresh review reports are in review-packaging-workflows/review.md, review-semantics/review.md and review-publication/report.md. Those reports describe their initial reviewed candidates; this document and the final tests record the subsequent corrections.

- Ubuntu had Python but no native Node or Java. Linux Python/validators ran; Linux Node/TLC did not. Docker's daemon was unavailable. No hosted CI or external service was triggered.
- Native custom-role/model execution, live notifications, trackers and schedulers remain untested. Workflow evidence is explicit independent instruction-scenario review, not a claim of live delivery.
- Existing corrupted historical logs are not repaired automatically. The reviewer also confirmed a pre-existing PowerShell limitation: unquoted whitespace-only cells can be trimmed by that reader. Neither is introduced by these quote fixes.
- File rollback preserves concurrent user edits rather than overwriting them. If disk/permission failures prevent restoration, diagnostics identify recoverable originals; an active partially written file is not claimed intact after such a failure.
- Six task-created agents completed. Stop/interrupt controls were applied after collecting results; final inventory showed no worker still running. Session deletion is unavailable through this host's API, so no deletion is claimed.
- Major changes are committed locally as requested. No push, merge, deployment, publication or external message occurred.
