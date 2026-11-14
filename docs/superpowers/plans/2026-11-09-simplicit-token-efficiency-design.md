# Simplicit token efficiency scope and design

Status: the three reference changes are committed in `bc0ce67`. Live author-guided smoke checks and local Windows/Ubuntu suites have run, including successful Linux coverage of the previously skipped symlink/POSIX methods. Controlled agent trials and independent review are blocked by the side-conversation restriction; exact-version CI coverage and measured savings remain pending. See [validation status](../../validation/token-efficiency-2026-11-09.md).

## Request and baseline

Plan the first three proposed optimizations: selective tool output, isolated new-worker context, and evidence reuse tied to relevant inputs. Preserve verification and independent review; avoid redundant instructions. The referenced conversation also reports an undisclosed generic fallback when project trust prevented named-role discovery. That is reported evidence, not an independently reproduced result here.

Original inspected baseline: branch `feat/worker-model-routing` at `d08c74f19f20a6f19d4af20d71be87ff650453f8`; current instruction candidate is `bc0ce67`. Relevant working files were read on November 9, 2026. The initial restricted Git status failed; a later authorized read confirmed no tracked edits before implementation. Candidate `bc0ce67` had a clean working tree before the live trials. Preserve subsequent unrelated changes.

## Existing coverage and missing decisions

| Area | Existing authority at the inspected version | Small remaining change |
|---|---|---|
| Compact results | `skills/simplicit/references/runtime.md:25` already rejects full transcripts and successful logs by default | Select relevant output before it enters model context where supported; preserve exit status, skips, warnings, actionable failures, and access to retained evidence. A short final summary alone is not input reduction |
| Isolated workers | Runtime lines 23–25 require compact briefs and suitable-helper reuse; the November 8 role probe used isolated contexts | Make fresh-context preference explicit for new workers, conditional on actual host support and role/model requirements; record requested versus observed context mode |
| Brief completeness | `skills/simplicit/references/simplicit-agent.md:6–17` already records acceptance, candidate state, paths, constraints, checks, and stopping condition | Add relevant established decisions, rejected approaches with their reasons/evidence, and context mode by extending existing fields. Prefer isolation only when the assignment can be transferred sufficiently |
| Evidence validity | Runtime lines 19–21 already cover dirty files, tests, dependencies, configuration, outputs, runtime state, integration, and phase reuse | Clarify compact input identity and invalidators in that existing record; unknown validity requires affected checks, not a cache hit. Safely rerun a cheap affected check when establishing freshness would cost more |
| Independent review | Runtime lines 13–19; `skills/simplicit/playbooks/review.md`; reviewer brief and critic profile | Preserve unchanged; test that compression and reuse cannot erase required review or final integration verification |
| Generic fallback | `skills/simplicit/references/worker-routing.md:21–25` already requires exact profile settings/instructions and disclosure | Add behavioral coverage and a requested/actual role distinction in the existing brief field; do not add another fallback policy |

The entrypoint, review playbook, critic profile, swarm skill, and authoring playbook already link to or implement these shared contracts. Do not copy the new details into each caller.

## Proposed approach and alternatives

Recommended: small replacements in three existing reference files, plus one validation protocol/report. Simplicit is a skills package, not the host executor; instructions guide behavior but cannot enforce output limits, role availability, context isolation, or test caching.

An output-wrapper subsystem plus persistent evidence cache could enforce more mechanics, but adds host-specific behavior, cache invalidation risk, maintenance, and new calls. Defer it until traces demonstrate a repeated failure the minimal approach cannot address. Adding the same rules to every skill would increase instruction tokens and drift; reject that approach.

The user authorized the selective instruction edits, their commit, and subsequent live trials/document updates. This does not authorize weaker verification, installation, push, or release.

## Requirements

- Keep the three coder model/effort pairs and all reviewer profiles unchanged.
- Preserve required checks, final integrated-result verification, and independent review for meaningful changes.
- Never count unavailable execution, missing evidence, or self-review as a completed independent review.
- Use only actual host capabilities; no hard-coded tool schema, universal token cap, or inferred transcript path in shipped guidance.
- Do not silently replace a required named role, model, effort, or context requirement.
- Preserve source evidence within authorization; do not persist secrets or unrelated data merely to create a log.
- Do not add dependencies, hooks, a persistent cache, a new skill, or blanket full-repository hashing.
- Keep the original `pstack/` archive, global configuration, project trust, and plugin caches unchanged.
- No quantified token, cost, latency, or quality gain may be claimed without matched observations.
- The user authorized selective safeguard implementation and then commit `bc0ce67`; the current request authorizes live trials and document updates. Subagents remain prohibited in this side conversation, so worker-dispatch trials and independent review remain pending. No installation, push, or release is authorized by this plan.

## Acceptance and limits

Output selection must preserve failure diagnosis, true command exit status, skips, and material warnings. Where the available tool supports it, select relevant fields or capture output to an authorized log and return sufficient diagnostics before the bulk output enters model context. Inspect the returned tool payload rather than only the final answer when testing this behavior. A short summary after ingesting the full output does not establish input-token savings. If the host does not expose or control that boundary, mark the input-reduction claim unverified rather than inventing an enforcement mechanism. Keep authorized full logs or host evidence accessible when available; if not available, disclose the limitation and expand diagnostics where necessary. A log path alone does not prove success. Do not rerun expensive successful work merely to make a prettier summary.

A fresh worker brief must be sufficient to recover task intent and relevant decisions without inheriting the full chat. Include consequential rejected approaches with concise reasons and source evidence when they affect the assignment; this does not prohibit checking assumptions or revisiting decisions invalidated by new evidence. Prefer isolation when that transfer is sufficient and the host supports the required role/model/context combination. Otherwise improve the brief, keep the work in the lead, or use an authorized compatible context route with disclosure; do not silently relax an explicit requirement. Applicable guidance and required evidence remain readable. Record host-confirmed context and role settings when available; otherwise mark them unverified. Reuse a suitable existing worker for follow-up. Keep independent-review briefs neutral rather than transferring the implementer's persuasive conclusions. Isolation does not establish reviewer independence of authorship, and filesystem sharing is not isolation.

Evidence is reused only for its recorded coverage while relevant input identity remains valid. Include changed and untracked files, tests, dependencies, configuration, generated output, and runtime assumptions as applicable. Use existing evidence identity when sufficient. When establishing freshness is more expensive than safely rerunning the affected check, rerun it; make this a practical judgment, not a separate cost-estimation loop. This permits targeted rechecking, not blanket reruns or weakening freshness standards. Use cheap available identities or scoped hashes; a commit ID, timestamp, or a hash of source files alone is not sufficient. Unknown or mutable external state prevents reusing the affected runtime claim. A prior failure remains a failure until the affected behavior is verified.

Quality acceptance requires all predefined behavior cases, ordinary package checks, and an independent review of the resulting instruction changes. Behavioral trials establish bounded observations, not guaranteed instruction following. A small matched study with all agents/retries included is required before calling the result a demonstrated token optimization. It must count the added briefing, rereading, instruction, logging, and evidence-tracking work. Missing usage remains unknown. Correctness-approved changes may be delivered as workflow clarifications with efficiency unverified when measurement is unavailable or inconclusive; they must not be labeled measured savings.

## Remaining tradeoffs and rollout

The committed edits cover output selection, conditional worker isolation, and minimal evidence-record clarification. Continue with the remaining validation rather than repeating implementation. Pre-context filtering can hide material diagnostics; fresh workers can repeat grounding; evidence tracking can exceed the cost of a cheap check. The behavioral cases must test these failure modes, while the matched pilot assesses the combined net effect. More instructions may increase every session's input, so replace existing prose and avoid repeating records at each turn. Do not create a new wrapper or cache merely to make the pilot easier.

The pilot and independent review have a one-time evaluation cost; report that separately from per-task operating usage. The committed changes have no guaranteed saving or guaranteed quality preservation; author-guided smoke checks do not establish a causal improvement. Host limitations and stochastic behavior remain implementation constraints rather than reasons to bypass verification. Before these edits, an authorized Git status check confirmed only the two untracked planning documents and no tracked changes.
