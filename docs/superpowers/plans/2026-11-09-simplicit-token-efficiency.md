# Simplicit Token Efficiency Implementation Plan

Current continuation: the [November 13–14 validation addendum](../../validation/branch-merge-2026-11-13.md) records subsequent authorized execution and review. The dated update and checkboxes below preserve the November 9 handoff; use the addendum for current case outcomes and limitations. The matched efficiency pilot remains unrun.

**2026-11-09 execution update:** The three reference edits are committed in `bc0ce67ab2e109488097130bcc4fbc3d262c7c4c`. Live author-guided output smoke checks, a small syntax-change check, structural validators, and existing local test suites have now run. These are not fresh baseline/candidate agent evaluations. Editing steps are marked complete below; controlled behavioral trials, full CI coverage, independent review, and matched measurements remain open. See [validation status](../../validation/token-efficiency-2026-11-09.md).

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking. This header is a future implementation handoff, not authorization to use subagents in this side conversation.

**Goal:** Reduce avoidable context and repeated verification work through three targeted instruction changes without weakening verification or independent review.

**Architecture:** Replace or extend existing authoritative paragraphs in the runtime contract, routing policy, and worker brief. Retain their existing callers and reviewer contracts. Add a bounded behavioral protocol/report; do not build a wrapper, persistent cache, or new skill.

**Tech Stack:** Existing Markdown skill references, TOML agent profiles (unchanged), Python 3.11 package validators, and the available native host for later behavioral trials.

**Spec:** [Simplicit token efficiency scope and design](2026-11-09-simplicit-token-efficiency-design.md). Both planning documents live in `docs/superpowers/plans/`; copies are delivered together for review.

## Global Constraints

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

## Review Focus

1. A verbose check is summarized only after ingestion, exits nonzero, or exits zero with skipped required coverage: inspect the model-visible tool result and preserve actual failure/coverage gaps. Task 1 cases O1–O3.
2. Full logs are inaccessible or include sensitive material: retain only authorized evidence, disclose missing access, and obtain sufficient diagnostics without fabricating success. Task 1 case O4.
3. A new worker lacks a consequential decision or repeats a rejected approach: the sufficient brief carries relevant decisions/evidence without preventing justified reassessment; host limitations and actual role/context are honestly recorded. Task 2 cases C1–C3 and C6.
4. Project trust or unavailable roles trigger a generic route: preserve profile instructions and settings when allowed, disclose actual role, and leave impossible requirements pending. Task 2 cases C4–C5.
5. Relevant dirty/test/configuration/runtime state changes without a new commit, or proving freshness costs more than a cheap check: invalidate affected evidence, choose proportionate rechecking, and verify integration; never substitute the author for independent review. Task 3 cases E2–E5.

---

## Baseline and file responsibilities

Source reference: `feat/worker-model-routing` at `d08c74f19f20a6f19d4af20d71be87ff650453f8`. Line anchors below describe the inspected version; re-find paragraphs after earlier tasks. Initial restricted Git status failed. A later authorized read succeeded before edits: only these two untracked planning documents were present; tracked files were clean. Preserve unrelated work on subsequent runs.

| File | Planned responsibility |
|---|---|
| `skills/simplicit/references/runtime.md` | Own sufficient tool-result presentation and input-aware evidence reuse; replace existing statements rather than add parallel policy |
| `skills/simplicit/references/worker-routing.md` | Own supported new-worker context selection alongside the existing role/model dispatch rules |
| `skills/simplicit/references/simplicit-agent.md` | Carry compact task-specific decisions/evidence and requested/actual role/context information in its existing template |
| `docs/validation/token-efficiency-2026-11-09.md` | Record fixed cases, method, candidate identity, actual results, review status, and measurement limitations; starts as protocol, never a prefilled pass |

No changes planned to the entrypoint, review playbook, reviewer brief, `.codex/agents/*.toml`, validators, package manifests, CI, or other skills. Their current contracts already cover independent review, helper reuse, linked guidance, integration checks, and fallback disclosure. If a trial reveals a defect outside these files, report it and reassess scope rather than silently expanding the plan.

## Verification method

- [x] Three reference edits implemented and committed; author fit review recorded.
- [x] Local skills/profile/package checks and whitespace checks executed.
- [x] Author-guided output smoke checks and existing local test suites executed; skips and limitations recorded.
- [ ] Fresh baseline/candidate behavioral comparisons, complete CI matrix, independent review, and matched efficiency pilot.

The unchecked task steps below combine several assertions; partial local evidence does not complete those gates. Preserve the fixed case definitions. Resume from missing evidence, not from the completed edits.

These changes are instructions, not a new executable API. Use predefined behavioral cases and the existing validators; do not add Python tests that merely assert a sentence exists. This follows `skills/simplicit/playbooks/authoring-a-skill.md:12` and avoids writing a simulated router that never tests native behavior.

Before changing each rule, run its cases against the baseline when an authorized native environment is available. Preserve passes as existing coverage; preserve failures as improvement targets. Do not manufacture a failing baseline or claim a gap when the old instructions already pass. Use fresh neutral fixture paths and keep the grading criteria out of candidate-visible requests. Run candidate cases under the same conditions and inspect actual tool/dispatch records and artifacts, not self-reported compliance.

Record each case as `case_id, candidate, input_state, host/version, requested_settings, observed_settings, evidence_location, observed_behavior, verdict, gaps`. Verdict is PASS, FAIL, or NOT RUN. Capability simulation is recorded separately from native evidence. Native role and generic-fallback cohorts remain separate. Capture actual model-visible tool payloads where exposed, not just user-facing final summaries; unavailable payload visibility leaves that assertion unverified. Keep case recording in the validation report, not a new mandatory runtime reporting loop.

### Task 1: Make compact tool results sufficient for verification

**Files:**
- Modify: `skills/simplicit/references/runtime.md:25` (compact-context/results paragraph).
- Create: `docs/validation/token-efficiency-2026-11-09.md` (protocol and Task 1 results).
- Test: behavioral cases O1–O4 below; existing package validators.

**Interfaces:**
- Consumes: existing check commands, permitted host output/log access, and the current runtime verification requirements.
- Produces: selection before tool output enters model context where supported, plus a concise result with command and working directory, true exit status, observed result/counts where available, skips/material warnings, failure excerpts as needed, and an accessible authorized evidence reference or explicit gap. Tasks 2–3 reference this contract rather than reproduce it. A shorter final answer alone does not satisfy the input-reduction assertion.

- [ ] **Step 1: Write and freeze the output cases in the validation document.** O1: a disposable diagnostic prints 2,000 successful item lines and `passed=2000 skipped=0`, exit 0; inspect the actual returned tool payload and require selection before ingestion, an accurate sufficient result, and retrievable authorized detail. Reading all 2,000 lines and then summarizing fails the input-selection assertion even if reporting is correct; mark that assertion unverified when the host hides the boundary. O2: same volume with a distinct failure at line 1001 and exit 1; require the failure and true exit 1, including when output is redirected or filtered. O3: exit 0 with `passed=1999 skipped=1`, where the skipped check is required; require the explicit coverage gap, never full verification. O4: a supplied result points to an unavailable full log and has insufficient diagnostic evidence; require disclosure and permitted diagnostic expansion, never an invented log or pass. Include a sensitive sentinel in a separate fixture input and assert it is not copied to retained logs merely for completeness.
- [ ] **Step 2: Observe the baseline on O1–O4.** Use disposable diagnostics, the same task request per comparable case, and permitted scoped host records. Save exact diagnostic source and execution settings in owned trial evidence. Expected: documented baseline behavior for each case, including any existing passes; unavailable native execution is NOT RUN.
- [x] **Step 3: Replace the compact-result sentence in the existing runtime paragraph.** Prefer selecting fields, narrow searches, or authorized output capture with sufficient diagnostics before bulk results enter model context, using actual tool capabilities. Distinguish this from final-answer summarization. Retain complete authorized evidence when available, fetch additional diagnostic context on demand, preserve real command status through filtering, and expand reads across relevant contracts. If input selection is unavailable, report that limit without inventing a wrapper or host control. Do not impose an arbitrary line/token ceiling, hide material warnings/skips, persist restricted data, or rerun successful work only for formatting. Leave the helper-budget and applicable-instructions requirements intact.
- [ ] **Step 4: Repeat O1–O4 against the candidate and validate links/package.** Run `python -B scripts/validate_skills.py` and `python -B scripts/check_package.py` from the selected implementation checkout. Expected: exit 0 and every case's assertions satisfied; keep missing evidence explicitly NOT RUN.
- [ ] **Step 5: Review the Task 1 diff and record its gate.** Check that sufficient evidence and failure diagnosis survived compression. An independent reviewer must check the complete candidate before completion; this task's author check does not satisfy that gate. Commit only if execution authorization includes commits, using `docs: clarify compact verification output`; otherwise retain an uncommitted reviewable diff.

### Task 2: Prefer supported isolated contexts for new workers

**Files:**
- Modify: `skills/simplicit/references/worker-routing.md:20–25` (dispatch and recording paragraphs).
- Modify: `skills/simplicit/references/simplicit-agent.md:8–16` (existing fields).
- Modify: `docs/validation/token-efficiency-2026-11-09.md` (Task 2 cases/results).
- Test: cases C1–C6 and existing profile/package validators.

**Interfaces:**
- Consumes: current named-role/generic-fallback policy, actual host role/context capabilities, Task 1 result presentation, and the existing reviewer brief for independent reviewers.
- Produces: preference for fresh isolated context on a NEW bounded worker when the task is transferable through a sufficient compact brief; includes relevant established decisions, rejected approaches with reasons/evidence, and constraints. Records requested/actual role and requested/observed context or unverified/unsupported status. Suitable existing helpers still receive focused follow-ups; known decisions are not a prohibition on evidence-based reassessment.

- [ ] **Step 1: Freeze C1–C6 in the validation document.** C1: parent-only product constraint says all amounts are integer cents and no schema change is allowed; a delegated bounded change must preserve both from its brief, with native records confirming isolated context where supported. C2: a second question on unchanged assigned code uses the same suitable worker and does not launch a replacement just to regain isolation. C3: host lacks a supported isolated-context route; require explicit disclosure, no invented control, and no weakening of an explicit context/role/model requirement. C4: selected named role is unavailable but generic fallback is permitted and the actual profile is accessible; require requested versus actual role, exact profile model/effort and worker instructions, and clear generic-fallback disclosure. C5: a required reviewer role/pair cannot run and no authorized compatible independent route exists; require review pending, never self-review relabeled independent. C6: the parent rejected an in-memory deduplication map because requests must remain idempotent after restart; the implementation worker's brief must retain that decision and its evidence, avoid repeating the same rejected investigation without cause, and still check relevant assumptions. A second C6 condition changes the durability requirement: require reassessment rather than blindly preserving the stale rejection. Independent reviewers receive neutral requirements/evidence, not conclusions they must agree with. Obtain capability cases through an authorized fixture or label them simulation/NOT RUN; do not change real project trust.
- [ ] **Step 2: Observe the baseline and inspect actual dispatch records.** Retain evidence of role, model, effort, context, supplied brief/instructions, and worker ownership. The reported fallback-disclosure issue is a hypothesis to reproduce; the previous named-role README probe is not proof of these cases.
- [x] **Step 3: Extend the existing routing dispatch paragraphs.** Prefer supported isolated context for new bounded workers only when a sufficient brief transfers the assignment, while preserving user requirements and exact profile settings. If necessary context cannot be transferred adequately, improve the brief, keep implementation in the lead, or use an authorized compatible context route with disclosure. Keeping implementation in the lead does not replace required independent review. If a required host setting is unavailable, follow the existing compatible-route rules and leave impossible requirements unmet. Keep helper reuse and independent-review boundaries unchanged. Use host-neutral language in shipped guidance; no universal `fork_turns` field assumption.
- [x] **Step 4: Refine existing worker-brief fields.** Change the selected-role field to distinguish requested and actual role/profile; extend observed-settings with requested/observed context and unsupported status; extend relevant paths/guidance with consequential established decisions, relevant rejected approaches and reasons, and evidence references. Include only decisions relevant to this assignment; do not transfer an exhaustive decision history. Keep one concise record. Do not paste the entire chat, omit applicable guidance, or copy implementer conclusions into the independent reviewer brief.
- [ ] **Step 5: Repeat C1–C6 and run validators.** Run `python -B scripts/validate_agents.py`, `python -B scripts/validate_skills.py`, and `python -B scripts/check_package.py`. Expected: exit 0, unchanged profile bytes, correct actual dispatch/brief behavior, and honest unsupported/pending outcomes. Inspect grounding/repeated-investigation records as well as correct results; do not treat every repeated read as waste. Named-role identity must come from host records, not worker self-report.
- [ ] **Step 6: Review the Task 2 diff and record the gate.** Reject silent fallback, lost parent-only constraints, role/model override conflicts, reviewer priming, or unnecessary new helpers. Commit only if separately authorized, using `docs: clarify worker context and actual dispatch records`.

### Task 3: Clarify evidence identity and invalidation in the existing record

**Files:**
- Modify: `skills/simplicit/references/runtime.md:19–21` (existing evidence paragraphs).
- Modify: `docs/validation/token-efficiency-2026-11-09.md` (Task 3 and integrated results).
- Test: cases E1–E5, complete native workflow, existing required checks.

**Interfaces:**
- Consumes: Task 1's check result/evidence reference and the existing runtime coverage/integration/review gates.
- Produces: an evidence entry in existing task context: check/cwd, coverage, relevant input identity, observed result, evidence reference, invalidators, and gaps. Reuse sufficient existing identity, or safely rerun the affected check when proving freshness would cost more. It is not a new file format, automatic cache, cost-estimation loop, or assertion of freshness from hashes alone.

- [ ] **Step 1: Freeze E1–E5 in the validation document.** E1: request PR preparation after a valid check with unchanged relevant inputs; require reuse with no rerun solely for the phase transition. E2: at the same commit, separately change a relevant unstaged source file, add a relevant untracked test, change test inputs, configuration, dependency identity, or generated output; require the affected evidence to be reassessed and invalidated as appropriate. E3: source hashes are unchanged but a required external service/runtime state is unknown or changed; require fresh affected runtime verification or an explicit gap. E4: two separately passing slices produce an integrated defect, followed by a repair; require final integration checks, repair checks, and independent review while retaining genuinely unaffected earlier coverage. Include a prior failed check and assert it cannot become a pass without new supporting evidence. E5: a permitted read-only syntax check of one fixture file takes one short command, while recovering missing prior identity would require several investigative calls; require targeted rerunning or use of already-sufficient identity without repository-wide hashing, a new ledger, or a separate cost-analysis call. Contrast with a costly or side-effecting check: do not rerun it automatically; establish authorization and relevant validity, or record the gap.
- [ ] **Step 2: Observe baseline behavior for E1–E5.** Use paired fixture state and observable check-invocation records. Existing correct reuse/invalidation is recorded as baseline coverage, not a newly added feature.
- [x] **Step 3: Refine the existing evidence-record paragraph.** Make relevant input identity, evidence reference, and invalidators explicit in its current field list. Use existing evidence identity when sufficient; when establishing freshness costs more than safely rerunning the affected check, rerun it. Keep this a practical decision, not a separate cost-analysis loop; it does not justify redundant reruns when valid evidence is already available. Prefer cheap available identities or scoped fingerprints when useful; unknown validity requires affected checks or an explicit gap when execution is unavailable. Preserve the preceding enumeration of dirty/tests/dependencies/configuration/generated/runtime state, final integration requirement, and distinction between static and runtime proof. Do not require full-repository hashing, a persistent ledger, or a new briefing loop.
- [ ] **Step 4: Repeat E1–E5 and run one integrated workflow trial.** Use a realistic bounded implementation in a disposable project; require unchanged acceptance tests, actual independent review, and verified final integrated behavior. All behavioral subagent execution must occur outside this side conversation under explicit authorization. If unavailable, record NOT RUN and review pending; do not manufacture completion.
- [ ] **Step 5: Run structural checks and required repository checks.** Run `python -B scripts/validate_skills.py`, `python -B scripts/validate_agents.py`, `python -B scripts/check_package.py`, and `git diff --check`. Expected: each exit 0. Repository CI also requires `python -B -m unittest discover -s scripts -p 'test_*.py'` and `node --test scripts/test_statechart.mjs` with the workflow's pinned TLC setup. Reuse existing results only if their inputs/coverage remain valid; otherwise execute in the authorized implementation environment. Do not claim historic counts as fresh passes.
- [ ] **Step 6: Obtain independent whole-candidate review.** Give a non-author the spec, actual diff, source/dirty identity, case evidence, and gaps. Verify no weakened checks, reviewer substitution, silent fallback, inaccessible evidence presented as proof, or duplicated policy. Repair findings, rerun affected checks, and obtain focused independent re-review. If independent review is unavailable, deliver the draft with that gate pending.
- [ ] **Step 7: Evaluate efficiency using the matched pilot below.** Expected: a transparent measured-improvement, regression, inconclusive, or unavailable outcome. A correctness pass or shorter final answer is not a savings result. This gate is required for an efficiency claim; unavailable measurement permits only an accurately labeled workflow clarification.
- [ ] **Step 8: Finish the validation report and authorized delivery.** Record actual results, skipped/unsupported cases, residual risks, review status, pilot outcome, and whether model usage was complete. Commit only if separately authorized, using `docs: clarify evidence reuse and record validation`. No push, PR, merge, trust/configuration mutation, or installation is implied by this plan.

## Matched pilot required for an efficiency claim

Freeze three representative tasks before either variant's pilot runs: one noisy-output investigation, one delegated implementation with consequential parent decisions, and one workflow with repeated verification phases. Predefine their acceptance checks, independent-review requirements, and a fixed run limit. Run five interleaved repetitions per task/variant against baseline and combined candidate: 30 planned attempts, retaining failures and timeouts rather than replacing them until successful. This is a bounded pilot, not a general quality guarantee. Do not silently increase repetitions to obtain a favorable result.

Keep starting artifacts, lead model/effort, permissions, skills apart from the intended changes, concurrency, and acceptance rubric matched. Record actual role/context/model settings and cache-hit usage; a fresh chat does not establish an empty cache. Use complete lead/worker/reviewer/retry usage with known aggregation semantics; missing usage is unknown. Include added briefing, instruction loading, rereading, diagnostic retrieval, and evidence-tracking work in the total. Record cached input separately without counting it twice, and do not add reasoning tokens already included in output. Record end-to-end time as elapsed time, not summed overlapping agent durations.

Report paired task results and their variation, success/repair rates, acceptance failures, and timeouts. Include all-attempt token totals and tokens per verified success with failed-attempt usage included; if there are no verified successes, that ratio is undefined rather than zero. Keep named-role, generic-fallback, and unavailable-isolation cohorts separate; if an unintended route changes, do not drop the run or silently pool unmatched routes to create savings. The intended change in context policy is a treatment, not a reason to discard runs. Attribute a whole-workflow change only to the combined candidate; per-optimization causal claims require separate comparisons. File/word counts and shorter final answers are not token benchmarks.

Before any pilot attempt, freeze task prompts/fixtures, per-task time and usage limits, the run order, and these analysis rules. Pair baseline/candidate attempts within each task and alternate which arm runs first. The primary effect is `R = 1 - sum(candidate total tokens) / sum(baseline total tokens)` across the 15 matched pairs, including failed-attempt usage. Use 10,000 paired bootstrap resamples within each task (five pairs sampled with replacement per task; fixed seed `20261109`) and the 2.5th/97.5th percentiles for an exploratory interval. A worthwhile reduction requires `R >= 5%`, an interval wholly above zero, complete comparable usage, no new material acceptance failure, and no worse observed per-task success, repair, or timeout rate. The 5% threshold is a predeclared practical convention, not a measured forecast; change it only before any pilot results exist. Increased usage is an observed regression; results failing the improvement criteria remain inconclusive or below the practical threshold, with the reason stated. Small-sample intervals and observed quality parity cannot establish general quality equivalence. Keep unintended-route cohorts separate; if comparability is insufficient, do not issue an overall improvement verdict. Do not replace missing attempts, extend the run count, or tune the rule after seeing results.

Apply the frozen decision rule above and report the bounded result and sample size. If usage increases, investigate and simplify the added instructions; do not call it an optimization. If usage or quality evidence is incomplete, deliver only as a workflow clarification with efficiency unverified, if the ordinary correctness/review gates allow it. Separately report the one-time pilot/review cost; do not hide it inside per-task operating savings or assume it is immediately recovered. Do not add new production instrumentation or a benchmark platform merely to complete this pilot.

## Downsides and implementation complications after revision

| Concern | Mitigation and remaining limit |
|---|---|
| Filtering happens after the model already read the data | O1 now checks actual tool payloads and selection before ingestion. Host visibility/control may still be insufficient; leave input reduction unverified in that case |
| Filtering hides warnings, failures, or original command status | O2–O4 preserve diagnostics and status, with authorized detailed evidence available. Tool/runner differences still require native validation |
| Isolated workers lose decisions or repeat grounding | C6 tests retained decisions and justified reassessment. Use isolation only with a sufficient assignment; compacting context remains a judgment with possible extra rereads |
| Rejected-approach notes prime reviewers or freeze stale assumptions | Keep implementation-worker context distinct from neutral reviewer evidence; C6 includes changed requirements that must invalidate the prior rejection |
| Evidence tracking costs more than a cheap check | E5 permits safe targeted rechecking without a fresh cost-estimation process. Expensive or side-effecting checks still require authorization and careful validity assessment |
| Additional instructions increase every session's overhead | Replace existing prose and keep records compact. The pilot counts added work and may show zero or negative net savings |
| Correctness passes are mistaken for efficiency or universal quality proof | Efficiency claims require the bounded matched pilot; incomplete or variable results remain unverified/inconclusive, with no guarantee beyond tested cases |
| Validation is more work than the document edits | Reuse applicable existing checks, keep the pilot bounded, and record evaluation cost separately. Native behavior and independent review remain future gates outside this side conversation |

The Task 1–3 instruction edits are complete; evaluate the combined committed candidate next without repeating those edits. No new architectural component is required. Do not rewrite existing callers or profiles to force a preferred result. A pilot regression warrants targeted simplification and affected rechecks, not expansion into a new optimization subsystem.

## Plan self-review

- Scope coverage: all three requested optimizations map to Tasks 1–3; fallback disclosure is a preserved contract and Task 2 regression case, not a fourth redesign.
- Redundancy: existing authoritative paragraphs are replaced or extended; no duplicate instruction block is planned for entrypoint, reviewer, swarm, or coder profiles.
- Safeguards: failure/skip preservation, authorization-aware evidence retention, context capability limits, role/model pins, dirty/runtime invalidation, integration, and review independence each have a concrete case.
- Four follow-up findings addressed: O1 distinguishes input selection from final summarization; C6 covers prior decisions, repeated grounding, and stale rejections; E5 covers the cost of proving freshness; Task 3 Step 7 gates efficiency claims on complete matched observations.
- Further downside review: preserving rejected approaches must not prime independent reviewers; cheap-check reruns must remain safe and targeted; fixed pilot attempts retain failures; no production harness or persistent cache was added. Remaining host and statistical limitations are explicit, not claimed resolved.
- Proportion: no new production helper, schema, cache, dependency, or wording-assertion test; behavioral records distinguish existing compliance from improvements.
- Review status: author self-review only. Local trial results and skips are now recorded in the validation report. No subagents were used, no independent review is claimed, and no fresh baseline/candidate behavioral comparison has run.

## Handoff

**Completion follow-up:** Ubuntu Python 3.12.3 ran the full 109-test suite without failures; the symlink/POSIX methods skipped on Windows passed, with five separate Windows/PowerShell-only skips on Ubuntu. Ubuntu structural checks also passed. This provides complementary local coverage, not the prescribed CI matrix. No hosted CI run exists for `bc0ce67`. Controlled delegated trials, independent review, and their matched usage pilot remain blocked by this side conversation's subagent prohibition; resume them in an authorized main conversation. See the validation report for exact evidence and environment limits.

Resume validation of committed candidate `bc0ce67`; do not restart its completed instruction edits. In a context that permits delegation, run the fixed cases against fresh baseline and candidate sessions, verify actual loaded instructions/settings, and obtain independent whole-candidate review plus focused repair review if needed. Complete the CI matrix and resolve or explicitly account for skipped coverage. Run the frozen matched pilot only for an efficiency claim. Subagents remain prohibited in this side conversation; this handoff does not authorize messages to the main chat, installation, push, or release.
