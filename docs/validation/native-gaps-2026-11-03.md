# Native workflow gap follow-up — November 3, 2026

Four isolated native trials exercised the review-driven repair branch, unavailable-model handling and cancellation. The observed outcomes met the bounded criteria below. Expected failed/interrupted turns are retained as those statuses; they are not relabeled successful executions.

## Candidate and method

Tested merged candidate: `a8e0d75a3504c1785dc8a4718810dd6e56b9436c`, whose file tree matches `655eec327537c1079d563e9bd845d41b330998e4`. Windows Codex CLI 0.165.0 ran `codex app-server --stdio` using existing authentication. Four fresh disposable projects each received all 62 skills through the shipped installer and copied reviewer profiles. Native discovery found all 62 enabled. The missing-model role fixture changed only its copied critic model to `simplicit-native-missing-model-20261103`; the source profile was preserved.

Parents were persisted, normally `gpt-6-astra/medium`, with provider-model fallback disabled, approval policy `never`, workspace-write confined to the fixture, and tool network access disabled. Recovery was read-only. The direct missing-model case requested the deliberately unavailable model for the parent itself. Each parent received explicit `$simplicit` text and a native skill input pointing at its installed SKILL.md. No global configuration, trust settings or client installation changed.

The runner reused the prior acceptance harness, freezing source/package, fixture, protocol and harness hashes before execution. It collected allowlisted public messages, commands, file changes, statuses and model/role metadata, excluding hidden reasoning and opaque spawn-message contents. One parent ran at a time. The reused `protocol.json` retains historical criteria for older mechanical/invalidation trials; those entries were not executed or counted here. The frozen `manifest.json` prompts and `run.cjs` transitions define the four scenarios in this report. The [app-server protocol](https://learn.chatgpt.com/docs/app-server) supplies thread/turn lifecycle and interruption operations.

## Actual results

| Trial | Observed result |
|---|---|
| Review-driven repair and focused re-review | One parent prompt requested independent review of the existing candidate before edits. Native `critic` on `gpt-6.1-sol/high`, without spawn model/effort overrides, demonstrated duplicate crediting: `2, 5, 7` where the contract requires `2, 5, 5`. The lead added five regressions; captured command output showed three failures among seven tests before repair. It repaired `ledger.py`, passed all seven tests, and reused the same critic thread for a focused re-review. That critic independently passed all seven tests and returned no actionable findings. The parent also checked protected-file hashes and Git state, then completed without operator steering. A separate non-model behavior oracle passed retries, distinct IDs, current-balance return, negative retry rejection, rejected-request recovery and zero. |
| Unavailable model pinned in a custom role | A valid parent attempted the actual critic once with the fixture-only unavailable model. Child metadata retained that model and high effort; the child turn failed with `modelNotFound`. The parent reported the host failure and left the explicitly required review pending. It did not substitute, override the pin, retry or edit files. The parent reporting turn completed; the requested review did not. |
| Direct unavailable-model request | The native parent turn failed with `modelNotFound`: “The 'simplicit-native-missing-model-20261103' model is not supported when using Codex with a ChatGPT account.” No helper, final successful answer or file change occurred. This tests an invalid model identifier with this account, not a real model entitlement outage. |
| Cancellation and same-parent reassessment | A native diagnostic wrote `started.txt`, slept for 60 seconds, then was supposed to write `finished.txt`. The controller sent `turn/interrupt` after observing the start marker. The terminal status was `interrupted`, emitted approximately 46 ms after the interrupt request. A separately declared read-only turn on the same parent correctly reported interruption and absent completion evidence, without restarting the command or editing files. The controller observed no completion marker more than 100 seconds after start and found no remaining Python process matching the exact diagnostic. |

The cancellation parent explicitly noted that its file check alone did not prove process termination or byte preservation. The controller supplied the separate delayed-marker/process check and frozen-hash comparison; those checks are not attributed to the model.

## Preservation, cleanup and evidence

The repair fixture changed only `ledger.py` and the new `test_ledger_regressions.py`. Seed tests, policy, contract, sentinels, installed skills/profiles and Git metadata were preserved. Both missing-model fixtures had no file changes. Cancellation changed only the authorized start marker; read-only recovery changed nothing. Hash audits confirmed source skills and reviewer profiles unchanged in every case. All six owned threads were archived; all four app-server processes exited normally with code 0. No missing-evidence entries were recorded.

| Owned thread | ID |
|---|---|
| Repair parent | `01a19feb-e2a6-7070-9780-255081f699bf` |
| Same critic, initial and follow-up review | `01a19fec-5cb7-7950-997e-ea5287404b82` |
| Missing-role-model parent | `01a19fee-4070-7900-8e2a-c2ee0bf763a0` |
| Expected failed critic | `01a19fee-c3f3-7351-9dc5-f20bb59d3df0` |
| Direct missing-model parent | `01a19fee-033a-7f03-86e0-e05640f4c54f` |
| Cancellation/reassessment parent | `01a19fef-60e0-70e3-8123-bca817ec2f6e` |

Detailed local evidence is retained under `.scratch/native-gaps-20261103/`: `prepare.py`, `run.cjs`, `protocol.json`, `manifest.json`, `freeze.json`, per-case `runs/*/events.jsonl` and `evidence.json`, `audit.py`, `audit.json`, and `process-audit.json`. These artifacts are ignored by Git. Preparation and execution used the existing Python executable with `-B` and `PYTHONDONTWRITEBYTECODE=1`.

An independent read-only evidence review checked command-event ordering and red/green output, same-critic reuse, model error/status distinctions, cancellation/reassessment, file deltas, archives/process exits and all four frozen artifact hashes. After correcting a chronology description and explicitly identifying unused historical protocol fields, it found no remaining actionable discrepancy. It did not run additional native trials.

## Reproduction contract and limits

Use the ledger/policy/seed-test fixture in the [November 1 protocol](native-workflow-2026-11-01.md#reproduction). Install the current complete package into a fresh project, copy profiles, initialize Git, and freeze hashes. Ask the native parent to obtain one actual critic review before changing the candidate, repair supported findings with failing regressions, reuse the same critic for repair review, and verify. Authorize edits only to the ledger and new tests. Do not steer the parent after starting that prompt.

For model failure, copy the critic profile into a separate fresh fixture and change only that copied model identifier to the sentinel above. Explicitly require that exact model, one actual role attempt, no substitution, and pending status on failure. Separately request the same sentinel as a parent model with fallback disabled and record the actual terminal error. Do not change real model configuration or infer behavior from catalog absence alone.

For cancellation, request one Python diagnostic that writes a start marker, sleeps 60 seconds and writes a completion marker. Interrupt only after the start marker appears. Record the actual terminal status, then start a read-only reassessment on the same parent. Observe beyond the intended completion deadline, compare frozen hashes, check for the exact owned diagnostic process, archive owned terminal threads and verify server exit.

These trials exercise the previously unexercised repair branch and demonstrate missing-model/cancellation behavior only for the stated Windows scenarios. The lead was explicitly instructed to review first and reuse the critic; default sequencing and spontaneous discovery after a lead-authored repair were not tested. These trials do not establish automatic selection, general quality gains, every skill, other client/model combinations, backend serving identity, real entitled-model outages, fallback-permitted recovery, cancellation during helper delegation/partial edits, arbitrary timing, disk-full or forced process-death recovery. No Linux-native Codex executable was found by `command -v codex` in the existing Ubuntu WSL environment; Linux-native execution was not run. macOS was unavailable. The installed client and system settings were not changed to expand coverage.
