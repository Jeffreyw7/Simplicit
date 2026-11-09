# Token-efficiency safeguard validation — 2026-11-09

Status: local instruction draft; not independently reviewed, behaviorally validated, installed, or released. Token/cost/latency savings and quality preservation are unverified.

## Candidate and scope

Source: `feat/worker-model-routing`, base `d08c74f19f20a6f19d4af20d71be87ff650453f8`. Before edits, authorized Git status showed only the two untracked planning documents; tracked files were clean. The main conversation was idle. This side conversation's latest request authorized selective safeguard edits; its prohibition on subagents remains in force.

Only these production references change:

| Reference | Candidate SHA-256 |
|---|---|
| `skills/simplicit/references/runtime.md` | `4287842c2044aa1a752fb48e76e835edf8446b3ef46e3f3579c46f3319504249` |
| `skills/simplicit/references/worker-routing.md` | `069bda0b31d733a772435f49682d81322a5737f989f167f4c95053742069b65b` |
| `skills/simplicit/references/simplicit-agent.md` | `a05bed24af1b1ee76328a44d97cd552a656e23d2bdf3b5dbd0eed4cbafe9e6d1` |

The two planning documents record the scoped authorization and outstanding gates. No new wrapper, cache, reporting system, dependency, model setting, role profile, or installation change is included. Edits remain in the requested branch without a new worktree, branch switch, commit, or changes to unrelated work. Authoring conventions permit a concrete draft with missing execution/review evidence; no sentence-matching tests or simulated routing claims substitute for native trials.

## Selected safeguards and existing coverage

- Output: select relevant material before model ingestion when supported; retain actual exit status, coverage gaps, warnings and failures; obtain missing diagnostics. A later summary alone earns no input-token saving. Authorized evidence retention does not require indiscriminate full-log storage.
- Context: fresh context is conditional on a sufficient brief and compatible host controls. Preserve relevant decisions and reasons for rejected approaches, but allow reassessment when assumptions change. Requested versus observed context and actual role extend existing fields.
- Evidence: extend the existing task-local record only where reuse needs it. Inspect relevant changes; prefer a cheap safe check over lengthy freshness reconstruction. Unknown validity requires an authorized affected recheck or an explicit gap.
- Existing helper reuse, exact profile settings, generic-fallback disclosure, applicable instruction loading, final integrated verification, independent candidate review, and repair review remain authoritative. These do not need duplicated policies.
- A new review uses the neutral reviewer brief and does not inherit prior review conclusions. An existing independent reviewer can still perform bounded repair follow-up.

Jimmy reference inspected: `ja153903/jimmy` at `6b8ed1183420abf82a43a399bfa336428b04a100`, especially [delegation](https://github.com/ja153903/jimmy/blob/6b8ed1183420abf82a43a399bfa336428b04a100/docs/delegation.md), [verification](https://github.com/ja153903/jimmy/blob/6b8ed1183420abf82a43a399bfa336428b04a100/docs/verification.md), and [efficiency](https://github.com/ja153903/jimmy/blob/6b8ed1183420abf82a43a399bfa336428b04a100/docs/efficiency.md). Simplicit retains its stronger independent-review requirement. No patch-only evidence identity rule is introduced.

## Executed checks

Working directory: `C:/Users/jeffr/OneDrive/Desktop/Simplicit`. Interpreter: bundled Python 3.12, invoked by absolute path with `-B`. These are local structural checks, not native behavioral tests or the full Python 3.11 Windows/Linux CI matrix.

| Check | Baseline | Candidate |
|---|---|---|
| `python -B scripts/validate_skills.py` | PASS, exit 0; 62 skills, local links and licenses | PASS, exit 0; 62 skills, local links and licenses |
| `python -B scripts/validate_agents.py` | PASS, exit 0; 5 profiles, TOML and policy | PASS, exit 0; 5 profiles, TOML and policy |
| `python -B scripts/check_package.py` | PASS, exit 0; 62 skills, resources and profiles | PASS, exit 0; 62 skills, resources and profiles |
| `git diff --check` | Not needed to establish tracked baseline; status showed no tracked edits | PASS, exit 0; Git reports a future LF-to-CRLF normalization warning for worker-routing.md |
| Author self-review of changes, callers, existing review contract | Baseline inspected | Completed; no additional actionable issue found. This is not independent review or native behavioral proof |

## Open behavioral and review gates

The fixed cases and matched evaluation protocol remain in the [implementation plan](../superpowers/plans/2026-11-09-simplicit-token-efficiency.md). Case definitions must not be weakened based on candidate behavior.

| Cases / gate | Status | Evidence needed |
|---|---|---|
| O1–O4: successful output, buried failure, required skip, inaccessible/sensitive evidence | NOT RUN | Native model-visible tool payloads, true exit status and retained diagnostics; a short final answer is insufficient |
| C1–C6: sufficient context, helper reuse, unsupported isolation, generic fallback, absent reviewer, prior decisions | NOT RUN | Authorized native dispatch records, actual role/model/effort/context, result artifacts and reassessment behavior |
| E1–E5: valid reuse, input changes, external state, integration repair, proportionate freshness checking | NOT RUN | Actual input changes, check execution/reuse records, final integration evidence and independent repair review |
| Independent whole-candidate review | PENDING | A non-author reviewer in an authorized context; this side conversation prohibits subagents |
| Matched efficiency pilot | NOT RUN | Three predefined tasks, five attempts per arm per task (30 fixed attempts), all failures/retries and lead/worker/reviewer usage, as specified in the plan |
| Full existing CI matrix and statechart runtime tests | NOT RUN | Normal repository CI before merge/release; scripts and statechart code are unchanged |

No native dispatch, fallback, context isolation, or token reduction is claimed from static validation. Baseline/candidate native comparisons remain pending, not assumed passes. Missing usage is unknown, not zero; cached input/reasoning usage must not be double-counted.

## Remaining downsides and containment

1. More instruction text has an input cost. Additions are limited to three existing authorities and brief fields; net savings need the matched pilot.
2. Selection can hide needed context. Failure details, skips, relevant warnings, expandable diagnostics and explicit gaps remain required; no fixed truncation cap is imposed.
3. Fresh workers can miss decisions or repeat work. Isolation is conditional on brief sufficiency; existing helpers remain preferred for suitable follow-ups, and decisions are revisitable.
4. Reuse can go stale or cost too much to justify. Track only relevant state, include dirty/environment inputs, use cheap safe rechecks, and preserve final integration checks.
5. Host limits and agent compliance remain uncertain. Record actual/unverified settings, preserve explicit requirements and leave missing review pending. Instructions alone cannot enforce the behavior.

Completion requires the outstanding behavioral evidence and independent review. Efficiency claims additionally require the matched pilot; an inconclusive pilot may support retaining the change only as workflow clarification, without savings claims.
