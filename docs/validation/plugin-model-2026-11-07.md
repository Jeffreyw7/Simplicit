# Authenticated plugin workflows — November 7, 2026

Four bounded native trials exercised the model-driven gaps in the
[November 6 plugin record](plugin-2026-11-06.md). All four completed successfully
against `main` revision `f0c05686238a85e00eb14356b7cb3a9dad3cd8fc`, plugin version
`0.1.0`. No plugin implementation or reviewer-profile repair was needed. This
update records the results and corrects the documentation's remaining-authentication
status; fixture setup corrections are described separately below.

## Isolation and method

Windows used Codex CLI 0.165.0, Node.js 25.2.0 and the existing Python 3.12.14.
An isolated `CODEX_HOME`, clean source snapshot and four disposable projects
were created outside Simplicit. Native marketplace registration and installation
supplied the skills; `install_skills.py` was not used. Each project explicitly
received the two unchanged reviewer profiles in its own `.codex/agents/`.

Following the documented [auth-cache method](https://learn.chatgpt.com/docs/auth),
each app-server process received a temporary copy of the existing sign-in cache
in the isolated home. The copy's file ACL allowed only its owner and SYSTEM.
The access token had more than an hour of validity before each run; credential
contents were never printed or included in the evidence. Each process confirmed
ChatGPT authentication with `account/read` and `refreshToken: false`. The copy
was deleted after each run, including the failed preflight. No logout or normal
credential-file replacement was performed. Normal auth-cache hashes matched
before and after every run.

The [app-server protocol](https://learn.chatgpt.com/docs/app-server) used persisted
parents (`ephemeral: false`), `gpt-6-astra/medium`, provider-model fallback
disabled and approval policy `never`. The implementation fixture used
workspace-write restricted to that project; the other parent turns were
read-only. Tool network access was disabled. The isolated Windows sandbox
setting was `unelevated`. The resolved thread response confirmed the parent
model, effort, persistence, approval policy and sandbox settings. Provider
fallback was disabled in the request; `unelevated` was set in isolated
configuration. Reviewer read-only instructions are
behavioral restrictions, not proof of a separate child sandbox.

Every successful trial discovered all 62 enabled, qualified Simplicit skills
from the actual native installation path, with no discovery errors, active
`pstack/` skills or project-local skill copy. Invocation supplied both the
qualified selector and a native skill input pointing to that discovered
`SKILL.md`. Parents ran serially, with a ten-minute turn limit and at most one
independent child per case. No operator steering or continuation prompt was
sent during a model turn.

## Observed results

| Trial | Native evidence |
|---|---|
| Help and resource loading | The model read the installed help, main routing, runtime, bug-fix, comment-review and Statechart references. It explained the requested workflows, dependencies and separate role adoption accurately. Zero helpers and no fixture edits. |
| One-prompt bug fix | The lead added four regressions to the two passing seed tests. Three of six tests failed before the implementation change. It added duplicate detection after amount validation; all six then passed. The actual configured critic independently ran all six tests and returned no findings. The lead continued through final verification without steering. A separate controller test run and behavior oracle passed. |
| Assigned independent review | On a separate unfixed ledger, `$simplicit:interrogate` demonstrated duplicate crediting: `2, 4` instead of `2, 2`, and a retry returning `7` instead of `5`. It reported the defect and that both existing tests missed it. No edits, helpers or recursive reviews occurred. |
| Comment Sicko audit | `$simplicit:no-comments` dispatched the actual named `comment-sicko`. The child read the exact installed reviewer brief and runtime contract, proposed deleting two narration comments and one dead-code comment, and retained the SPDX license notice and API docstring. The lead inspected and accepted the three proposals. Actual deletions were zero, as required by the read-only request. |

The bug-fix controller's independent oracle checked duplicate IDs, distinct IDs,
current-balance return, negative retries, rejected-request state and the zero
boundary. Only `ledger.py` and new `test_ledger_retries.py` changed. The original
tests, contract, policy, profiles, sentinel and Git metadata were preserved.
The other three projects were byte-for-byte unchanged.

| Native role | Observed configuration | Execution |
|---|---|---|
| `critic` | `gpt-6.1-sol`, `high` | One actual child; no spawn model/effort override; exact installed review brief and supporting rubric read; six tests passed; no edits or delegation. |
| `comment-sicko` | Inherited `gpt-6-astra`, `medium` | One actual child; no spawn model/effort override; exact installed comment brief read; bounded static review; no edits or delegation. |

These are native named-role results, not generic-helper substitutes. Thread
metadata establishes the configured role/model/effort, not backend serving
identity. The critic's combined inspection command ended with `rg` finding no
bytecode, yielding exit 1; its test output separately records all six tests
passing. That exit is not relabeled a successful shell command.

## Setup corrections and preservation limits

Windows packaged-app redirection made the host's canonical fixture paths differ
from the paths initially supplied. The help trial completed, but its project
configuration layer carried an untrusted-path warning. Before role trials,
trusted-project entries in the isolated configuration were corrected to the
host-reported paths. A test-setup rewrite accidentally removed that isolated
configuration's marketplace/plugin entries. The next preflight found zero
Simplicit skills and stopped before creating a model thread. Native marketplace
registration and plugin installation restored the entries; the corrected
bug-fix trial then passed. The initial evidence and failed preflight remain
retained. Reproduction must preserve existing configuration tables when adding
canonical trust entries.

The normal `config.toml` hash changed between the help process's clean exit at
16:27:15 UTC and the next preflight at 16:28:26 UTC; its modification time was
16:27:52 UTC. No test app-server was running at that time. The actor was not
established, so whole-window normal-configuration preservation is not claimed.
The original mismatch flags remain in the evidence. A separate later snapshot
matched through the remaining runs. The normal personal marketplace catalog
remained absent, and no test code wrote normal configuration or registrations.
No attempt was made to restore or overwrite the concurrent configuration change.
The follow-up investigation below retains this limitation.

The host also emitted an unrelated `codex-security` MCP startup warning; no MCP
tool calls occurred in these trials. All 224 tested functional source/configuration
files and the installed package bytes remained unchanged. All six model threads
were archived, all five app-server processes (including the failed preflight)
exited with code 0, and a final process check found no remaining owned app-server
or fixture process. The temporary credential file was absent. A scan of retained
sanitized run evidence found none of the cached access, refresh or ID tokens, or
API key values.

## CI and configuration follow-up

Hosted [run 42392519751](https://github.com/Jeffreyw7/Simplicit/actions/runs/42392519751)
completed successfully for documentation commit
`1eb7c8949049567a608cca5b70c2ac7e9e64c0ab`. Its functional files are unchanged
from the native trial candidate above. Both jobs also passed the skill, agent
and repository-root package validators and verified the pinned TLC download.

| CI job | Python unittest result | Node/TLC result |
|---|---|---|
| Ubuntu | 109 tests, 4 skips, no failures | 180 tests: 160 passed, 20 platform skips, no failures |
| Windows | 109 tests, 1 skip, no failures | 180 passed, no skips or failures |

A read-only investigation on November 7 checked the retained case timeline,
runner write destinations, current configuration and available host logs:

- Help app-server exit was confirmed at `16:27:15.648Z`; the next preflight
  started at `16:28:26.018Z` and spawned its app-server at `16:28:28.069Z`.
  The normal file's modification time, `16:27:52.625559Z`, falls between them.
- At `16:58:42Z`, the normal file still matched the separate `16:32:41Z`
  observation. It parsed as valid TOML, contained neither this trial's unique
  fixture identifier nor a Simplicit plugin/marketplace registration, and the
  normal personal marketplace catalog remained absent.
- Runtime diagnostic queries found configuration reads but no recorded writer.
  Other Codex desktop/editor activity was present, including generic editor
  cache-invalidation messages shortly after the modification. Those messages
  do not identify who changed the file or what changed. These logs are not an
  exhaustive filesystem-write audit.
- An independent reviewer checked whether existing Windows audit telemetry
  could identify a writer. The Sysmon event log was absent; the Security log
  required administrator access and remained uninspected. Neither result
  establishes the absence of a matching file-access event.

The original capture retained only a whole-file hash, not earlier bytes or a
settings snapshot. No matching prior copy was found. The changed settings and
writer therefore remain unresolved; this is an evidence gap, not a confirmed
plugin defect or proof that external activity caused the change. No supported
implementation repair was identified, and normal settings were left intact.
The original mismatch flags and failed preflight remain unchanged.

For future repetitions, capture per-run configuration timestamps, sizes and a
redacted snapshot of relevant non-secret settings alongside the whole-file
hash, before and after execution. Keep the initial observation when a change
appears; a later baseline must not erase the mismatch. File-writer attribution
requires suitable telemetry captured when the write occurs. Raw user
configuration and credentials do not belong in the repository evidence.

## Reproduction and evidence

Use the ledger, seed tests and contract from the
[November 1 reproduction protocol](native-workflow-2026-11-01.md#reproduction),
but install the repository-root plugin into a fresh isolated Codex home instead
of copying skills into each project. Adopt the shipped profiles only into the
disposable projects. Freeze the source, installed files, fixtures and prompts.
Use actual discovery paths rather than guessing the cache directory. Match
trusted-project entries to the host's canonical paths without replacing other
configuration tables.

Run separate persisted parent requests for help, an authorized duplicate-credit
repair with the configured critic, an assigned read-only review of an unfixed
copy, and a read-only no-comments audit. The comment fixture contains an SPDX
MIT notice, a public function docstring, comments narrating initialization and
addition, and `# return sum(amounts)` as dead commented code. Do not supply the
expected findings to the reviewer. Keep the role pins, file scope and no-recursion
requirements explicit. Capture command outcomes, ordered edits, role metadata,
final hashes and cleanup; omit credentials and hidden reasoning.

An independent read-only critic reviewed the protocol and evidence, including
red/green ordering, actual role execution, resource reads, read-only behavior,
preservation and cleanup. Its evidence-scan finding was repaired: the scan now
checks every nonempty supported credential field, including short tokens, rather
than filtering by length. The corrected audit passed. Source/runtime behavior
needed no repair.

Sanitized local artifacts are retained under `.scratch/plugin-model-20261107/`:
the preparation and native runner scripts, original and corrected freezes,
manifest/protocol, per-case events and evidence, audit, configuration-change
observation and process check. The CI/configuration follow-up adds sanitized
`ci-followup.json`, `config-investigation.json` and its read-only collector
`investigate-config.py`. They are ignored by Git. This report does not
claim general automatic skill selection, all 62 skills' behavior, model diversity,
Linux/macOS native execution, or a review-driven repair loop: the critic found
no additional defect in the repaired fixture. Earlier project-local repair-loop
evidence remains separate. Hosted deterministic CI does not replace these
native model-driven trials.
