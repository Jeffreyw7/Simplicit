Follow the [runtime contract](../references/runtime.md). This playbook supplies a workflow, not additional tools or authorization.

When candidate review is required, use the existing [Review playbook](review.md) and its linked reviewer contract. The workflow here does not replace those review gates.

# Orchestrate

Use a durable program ledger when authorized work spans many dependent units or outlives one agent. A single task that fits the session can use [Autonomous run](autonomous-run.md) without a program bureaucracy. One implementing lead remains responsible for the result; helpers resolve bounded slices or independent verification, rather than becoming a mandatory coordinator hierarchy.

## Frame and persist the contract

State a countable program predicate, inventory of units, rough effort and time budget, dependency graph, expected delivery shape, forbidden paths, required evidence, and specific implementation/landing authority. Budget exhaustion is not success. Identify one owner for each artifact and one topology owner for each stack. Name existing product/approval gates separately from routine implementation choices.

Use a transparent permitted project scratch directory or another user-selected durable location. Plain Markdown, TSV, or JSON with available host file tools is sufficient; no imported orchestration framework, Bun runtime, agent store, database, or cloud service is required. Keep each file single-writer and write derived views from records, rather than having workers race on one shared JSON object.

The useful minimum records are:

| Record | Facts to retain |
|---|---|
| Standing orders | Accepted scope, user rulings, authority, forbidden actions/paths, ownership, verification bar, and escalation rules. |
| Units | Stable id, goal, dependencies, owner, state, branch/worktree, parent/base, current head and dirty candidate, brief, result, and evidence pointers. |
| Verification ledger | Unit and candidate identity, scenario, kind of proof, command/driver, relevant inputs, result, verifier, artifacts, and freshness limits. |
| Completion inbox | Worker/unit id, reported state, report pointer, and observed timestamp; reports remain claims until checked. |
| Frontier | Current generation, ordered PR chain, bases/heads, lowest unmerged item, topology owner, and outstanding blockers. |
| Gates and decisions | Question/options, owning decision, blocked dependent work, and the [decision trail](../../show-me-your-work/SKILL.md). |

Derived status reports counts from those records; do not maintain a competing narrative count. Preserve the store as a handoff and audit record.

## Scope a unit before dispatch

Use the [worker brief](../references/simplicit-agent.md), scaled to the work. Every implementation or verification unit needs goal, allowed and forbidden writes, exclusive artifact/branch ownership, dependency evidence, acceptance predicates, exact verification recipe, timebox or stopping rule, report shape, and applicable standing orders. A one-command unit can carry these in a short paragraph. A substantial unit needs concrete paths and examples, not a vague ambition.

A dependency is a context relay: pass the actual upstream contract, candidate, evidence, limitations, and changed assumptions. Ordering alone is not enough. Do not dispatch a unit whose scope or acceptance cannot be stated. On resume consolidate current orders and evidence rather than forwarding a chain of obsolete briefs. Helpers do not recursively delegate by default.

Pilot one representative unit through implementation, verification, integration, and its ledger entry before scaling. For cheap near-identical units, the first checked unit is the pilot. For a novel high-impact unit, test the verification recipe and independence as well. Landing is part of the pilot only if already authorized; merge-ready can be the scoped terminal state.

## Execute and drain

The lead can implement ready units directly. Add a bounded rolling window of authorized helpers only when independent seams justify it and available capacity supports reviewing their results. Default to one optional specialist at a time; do not import fixed fan-out, model-family, environment, or depth requirements. Stop refilling when upstream failures or inadequate review capacity would spread bad work.

Treat completion notifications as queue events. Finish the current atomic ledger update, ownership transfer, or topology operation, then drain at a safe boundary or before a human status report. Urgent user stop/safety signals override batching. For each completion:

1. Check actual helper status and candidate/artifact state. Classify needs-verification, accepted, failed, stale, abandoned, or noise.
2. Give a consequential candidate an independent review and relevant behavioral verification. Do not accept a result solely from its summary or a CI-green label. A cheap mechanical check can be run or spot-checked by the lead; it does not become independent review by renaming it.
3. Record the verified candidate and evidence. Return supported defects to the owning slice in one coherent fix wave, recheck repairs, and retain unaffected valid coverage.
4. Recompute dependency readiness and frontier generation. Relay changed contracts to dependents before they write. Integrate through the one owner; do not race a worker with a second branch writer.
5. End consumed helper tasks and inspect their status. Account for every dispatched child as accepted, still active, stopped, failed, abandoned, or explicitly absorbed. Silent manual redoing hides missing coverage.

A practical unit state sequence is planned, ready, active, needs-verification, accepted, then delivered or merge-ready. Blocked, failed, and abandoned carry reasons. Source edits or parent drift can invalidate accepted evidence and move a unit back to verification. Recompute from actual state; state labels cannot grant readiness.

## Verification and topology

Record distinct proof kinds: static/type check, unit behavior, integration, real surface, simulation, independent review, blocked, or failed. Behavioral work requires its actual acceptance surface; type-check-only is insufficient. A worker may report tests, but independent review must come from someone who did not author the candidate. Missing independent execution remains pending.

Key verdicts by the full relevant candidate and inputs, including head/base, dirty files, dependencies, config, generated output, and runtime conditions. A new SHA prompts reassessment, not automatic erasure of demonstrably unchanged lanes or automatic carryover by patch ID. Current artifact evidence governs.

Keep topology single-writer. Branch owners do not independently rebase, retarget, close parent PRs, or merge. The topology owner reconciles heads, dependency drift, conflicts, and expected remote leases. [Autopilot stack](autopilot-stack.md) covers a chain; [Shipping](shipping.md) covers authorized bottom-up landing. Freeze ordinary writes during landing. A babysitter can report a conflict, not reshape the stack.

Externalize accepted work promptly to the permitted durable location so it survives the claimed failure mode. A local artifact is enough for local persistence; it is not remote backup. Pushes, service writes, and landing still need their applicable grants.

## Liveness, failure, and resume

Probe progress read-only through real artifacts, published heads when authorized, ledger receipts, and host helper status. Do not resume an idle helper merely to ask if it is alive. Time since a transcript write is not proof of liveness. Waiting on a parent or human gate is not a stall.

Bound retries by failure mode and cost. A memory/capacity failure can warrant a smaller unit; a transient network failure may justify a bounded retry; an unknown repeated failure earns diagnosis and replan. Never switch models blindly to hide a tool error. Stop a prior writer and verify transfer before replacing it. Record abandoned work and reasons.

A late result must reconcile with current dependencies, candidate, and frontier before acceptance. Salvage unique findings through a fresh scoped unit; never blindly merge stale work. Broken upstream contracts or infrastructure halt affected refills, while independent useful work can continue. Persist exact progress and recovery commands if the host cannot proceed.

On restart, read standing orders and the ledgers, inspect what actually survived locally or remotely, revalidate ownership/liveness, recompute frontier, and resume the first unresolved unit. Do not assume cloud work survived, local agents died, locks self-clear, or a timer will wake you. Actual host persistence and continuation capabilities decide.

## Finish or checkpoint

Honor user hold immediately, stop new work, propagate the stop, and use [Pause safely](pause-safely.md) when a pause was requested. Continue otherwise until the predicate, a real dependent gate, or a documented dead end; a status question is not cancellation.

At checkpoints report counts from the ledger, current frontier and candidate heads, evidence and review gaps, changed or abandoned units, human-owned gates, durable store, and trail. At close reconcile every child, verify the integrated predicate on the real artifact, report delivery versus merge/release separately, and retain the evidence. No automatic schedule, external message, merge, or deployment is implied.
