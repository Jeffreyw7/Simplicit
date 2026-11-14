# Worker-routing branch review — 2026-11-13

Review began November 13 and continued November 14. This is the pre-merge validation record, with the behavioral observations and limitations below. The commit containing this record must pass final hosted CI before the authorized merge. It preserves the November 8–9 observations as historical evidence and makes no measured efficiency or Jimmy-comparison claim.

## Candidate and review

Reviewed branch `feat/worker-model-routing` at `1dbe12184526c00aa43a59228280bfd3b1aee221` against freshly fetched `origin/main` at `f75e86de470f56a20dd2763916fe3e9e583839c5`. The branch contained four commits and was initially clean. An independent critic reviewed the whole branch, its callers, validators, and acceptance plan.

The review found a setup conflict: when model enumeration was unavailable, `setup-simplicit` still instructed the lead to retain inheritance. That could discard a verified fixed-role configuration. Step 4 now preserves verified role settings, marks other selections unverified, and uses the shared routing policy for permitted fallbacks. The independent reviewer accepted this repair. Model profiles and their fixed pairs are unchanged.

The native output trial found a second gap: filtering retained counts and failures but discarded the complete successful output without explaining that loss. The runtime contract now requires authorized filtered detail to remain retrievable through host evidence or a retained log, or explicitly identifies unavailable detail. The reviewer accepted this focused clarification; it adds no production logger or cache.

Independent follow-up review covered both repairs, the native/simulated case records, the final fixture artifacts and supplemental checks, and this report's scope. No actionable finding remained. Host visibility and execution limitations below are retained rather than counted as unrestricted passes.

## Repository checks

| Check | Observed result and scope |
|---|---|
| Skills, profiles, package, whitespace | Passed after the setup repair: 62 skills, five profiles, valid package, no whitespace errors |
| Python unit suite | Exit 0; 109 tests, five platform/privilege skips; no failures or errors |
| Statechart suite | Exit 0; 180 passed, zero failed/skipped/cancelled; verified pinned TLC |
| Hosted CI at `1dbe121` | [Windows and Linux passed](https://github.com/Jeffreyw7/Simplicit/actions/runs/43558087311); this run precedes the setup repair |
| Final candidate CI | Required on the commit containing this record before merging; use that commit's GitHub checks for the landing result |

Local checks used Windows, Python 3.12.14, Node 25.2.0, Java 21.0.12.1, and TLC SHA-256 `936a262061c914694dfd669a543be24573c45d5aa0ff20a8b96b23d01e050e88`. Hosted CI uses the repository's prescribed Windows/Linux matrix and Python 3.11, Node 22, Java 17. Platform skips remain coverage limits rather than passes.

## Behavioral observations

Disposable projects compared only the three reference files from `d08c74f19f20a6f19d4af20d71be87ff650453f8` with the current instructions. Other skills, profiles, task inputs, and parent settings matched: 62 installed skills, five profiles, Codex CLI 0.165.0, and a native `gpt-6.1-sol`/medium lead. The actual selected skill was discovered at the thread's working directory and its injection verified. Temporary private Codex homes confined trust changes to disposable fixtures; credential copies were removed and the normal credential cache remained unchanged.

These are bounded observations, not guaranteed instruction following. Actual command payloads, artifacts, dispatch calls, effective model/effort metadata, and independent review were inspected. Completing a model turn alone was not scored as a pass.

In both final account runs, the two deterministic slices used named `coder-light` workers at `gpt-6-luna`/high, and the independent critic used `gpt-6.1-sol`/high. Named-role dispatches had no model/effort overrides; new workers requested fresh context, and follow-ups targeted the existing receipt worker. The unchanged medium/hard profile settings retain the separate [coder-role validation](coder-roles-2026-11-08.md); this bounded integration task did not need complex implementation work.

| Case | Current observations and comparison |
|---|---|
| O1 | Initial candidate retained correct counts and selected before ingestion, but lost full detail. After the repair, the actual command saved all item output before selecting counts and returned its evidence path. Later checks reused that log filename; historical snapshots of every run were not retained. Baseline also lacked retained original detail; its first model-visible result was already truncated, so it did not demonstrably ingest all 2,000 lines. |
| O2 | Both versions retained the buried item-1001 failure, counts, and actual diagnostic exit 1. The repaired candidate also retained the full diagnostic log. A wrapper's separate exit status was not mistaken for the diagnostic's recorded exit. |
| O3 | Both preserved the required skip and rejected full verification despite diagnostic exit 0. |
| O4 | Both verified that the original log was missing, expanded safe local diagnostics, and disclosed the evidence gap. Restricted fictional input was not copied into retained output. |
| C1 | Native fresh-context workers produced integer-cent results and preserved schema, frozen tests, and ownership. Complete brief delivery is unobservable because assignment bodies are encrypted; outcome checks do not remove that limitation. |
| C2 | Original zero-value question was correctly answered by the lead without creating another helper. In the focused explicit helper follow-up, both versions reused the same receipt worker and returned the correct zero/integer result without a replacement. |
| C3 | Both passed an explicitly labeled capability simulation: required isolation remained unmet; neither invented controls nor silently substituted inherited history. This is not native evidence of an unsupported host. |
| C4 | Both used a disclosed generic fallback at actual Sol/high when project trust disabled named roles. Exact profile-instruction delivery remains unverified because the task body is encrypted. The earlier silent-fallback observation did not reproduce in either arm. |
| C5 | Both passed an explicitly labeled capability simulation: the required critic/model/effort route remained unmet, with no generic substitution or self-review claim. The first attempted native absence fixture still exposed collaboration and used real critics; those earlier runs did not realize the absence precondition. |
| C6 | Both reused the receipt helper, retained durable production dedup, then reassessed the changed single-process requirement and disclosed restart limitations. Original brief completeness and reviewer neutrality cannot be inspected through encrypted task bodies. |
| E1 | Both reused unchanged valid acceptance evidence across the PR-preparation phase without rerunning acceptance. |
| E2 | Both invalidated affected evidence at the same SHA for dirty source, an untracked test, changed data, configuration, dependency identity, and a generated contract. Fresh tests established each new result. This does not cover every possible dependency or generated-output change. |
| E3 | Both preserved prior failures and left external runtime verification unmet when live access was unavailable. No live service was tested. |
| E4 | Both observed separately passing slices and an actual integrated `KeyError`, repaired the adapter, passed three relevant native tests, and obtained independent review without changing frozen tests. Native full-suite execution remained blocked by temporary-directory access. The authorized root executor then ran the unchanged final artifacts: all four tests passed in each arm. This supplemental result is not a native-sandbox full-suite pass. |
| E5 | Both used one cheap in-memory syntax check with scoped identity. Neither reran the side-effecting publisher on stale evidence or changed the customer artifact. |

The shared diagnostic fixture contains a conflicting historical detail failure even when its standard mode is healthy. Both arms conservatively reported that discrepancy; O1's assertions concern the standard run's selection, counts, and retained evidence, not an invented all-system pass.

E1–E3/E5 observations preceded the focused O1 wording repair. Their evidence remains applicable to unchanged reuse/invalidation rules and fixture inputs; they are not reported as executions of the final instruction bytes. The output cohort was rerun after the repair. Unsupported capability simulations and encrypted-message visibility gaps remain separate from native passes.

## Local evidence

Evidence directories below are local provenance under this checkout's ignored `.scratch/token-merge-check/`, not files included in the distributed package. Their manifests retain input hashes and source identities; records contain actual commands, results, and host-confirmed settings.

- Initial O/E pair: `output-evidence/runs/1794632468243-8d9a7c69` (baseline), `output-evidence/runs/1794632434850-9eac3b35` (candidate).
- Repaired O cohort: `output-recheck/runs/1794632883808-23ddef83`.
- Initial account pair: `context-routing/run-cedar-account-1794632569457`, `context-routing/run-maple-account-1794632514169`.
- Final account pair: `context-recheck/run-cedar-account-1794633061644`, `context-recheck/run-maple-account-1794633062488`; supplemental full-suite results: `context-recheck/root-fullsuite.json`.
- Fallback pair: `context-routing/run-cedar-fallback-1794632366428`, `context-routing/run-maple-fallback-1794632383656`.
- Isolation simulation: `context-routing/run-cedar-context-1794632677673`, `context-routing/run-maple-context-1794632676913`.
- Failed reviewer-absence setup: `context-routing/run-cedar-pending-1794632677048`, `context-routing/run-maple-pending-1794632677962`. These are not C5 passes.
- Reviewer-unavailability simulation: `context-recheck/run-cedar-pending-1794633062556`, `context-recheck/run-maple-pending-1794633062556`.

Original attempts were retained. The account retry confines temporary files to the fixture and closes its SQLite connection; this repairs the disposable fixture, not Simplicit. The native sandbox still denied temporary-directory access, which both leads reported honestly. The root full-suite check used the same fixture-local temporary directory without changing permissions; nine production/test file hashes in each arm matched the native final snapshot afterward. Frozen acceptance tests are unchanged in both arms. Baseline archive cleanup reported two already-missing rollout records after evidence collection; it did not invalidate the captured commands or results. No private reasoning was inspected and no encrypted message was decrypted.

The matched 30-attempt efficiency pilot has not run. Token, cost, latency, and quality improvements remain unverified.
