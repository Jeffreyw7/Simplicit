Follow the [runtime contract](../references/runtime.md). This playbook supplies a workflow, not additional tools or authorization.

When candidate review is required, use the existing [Review playbook](review.md) and its linked reviewer contract. The workflow here does not replace those review gates.

# Multi-phase or multi-PR plan

The deliverable is a plan a future owner can execute and a reviewer can audit. Do not implement the program merely because planning was requested. For a small obvious change, give a proportionate short plan rather than inventing a multi-PR program.

1. Ground the goal, current code and tests, user contract, base/dirty state, and relevant runtime access. State the measurable outcome and scope, then identify empirical unknowns versus product choices. Resolve empirical uncertainty with an explicitly permitted [Prototype](prototype.md) when useful; do not modify production or launch a broad experiment under a plan-only request. Record what remains unproved and provide options for user-owned decisions.
2. Decompose into independently checkable units with exact dependency edges and exclusive write boundaries. Prerequisites, shared types/primitives, baseline capture, and verification setup precede consuming work. One implementing lead is the default; name selective helper opportunities only where bounded uncertainty, independent slices, or independent review justify them.
3. Choose an execution route and explain why: [Autonomous run](autonomous-run.md) for one driven task, [Autopilot full](autopilot-full.md) for independent changes, [Autopilot stack](autopilot-stack.md) for base-chained dependencies, or [Orchestrate](orchestrate.md) for a durable program. Name integration/topology ownership and the actual authorization boundary for commits, PRs, merging, release, and external messages.
4. Write in the user's selected destination or an established project plan directory. Use [Technical writing](../../technical-writing/SKILL.md) and [Unslop](../../unslop/SKILL.md). Keep action steps in the body and substantial rationale/evidence in appendices. Preserve repository templates rather than requiring the upstream host's exact headings or checker.

## Plan contract

Open with the outcome, audience, program invariant, scope, and ordered units. Explain how checkboxes become true: each names an actual artifact, log, test, screenshot, or verified candidate, never just an owner saying done. Include these program-level blocks:

- Start conditions and accepted authorization; explicitly distinguish plan approval from execution when the latter has not been granted.
- Dependency graph, ownership/write fences, and integration or stack topology.
- Execution/continuation capabilities, available capacity, checkpoints, stop behavior, and durable handoff location. Do not promise cloud agents, hourly loops, or future wakeups absent host tools.
- Delivery convention, defaulting to one active Draft PR unless otherwise selected. Identify any chosen stack parents and user-owned review/landing gates.
- Verification strategy and evidence freshness rules, including candidate identity, independent review, and final integration.

For every unit include:

| Field | Required content |
|---|---|
| Depends on | Stable predecessor ids or None, and the upstream evidence/contract the unit consumes. |
| Files and ownership | Allowed edits/creates/deletes, forbidden areas, exclusive writer, base and integration owner. |
| Build | Concrete symbols or behavior to change; each step ends in a checkable state. |
| You see | Observable acceptance result on the actual caller/user surface. |
| Unit/static proof | Exact repository command, scenario, expected predicate, and evidence output. |
| Live proof | Driver/boot/input recipe, controlled state, actual scenario, pass predicate, artifact path, and required access or explicit gap. |
| Performance | When relevant, metric/unit, command or probe, comparable baseline, samples/work/errors, and numerical fail rule. A nonapplicable gate gets a reason. |
| Review | Independent candidate review, meaningful risks, user product review if required, and narrow repair review. |
| Delivery | Intended Draft/base, current-candidate evidence, required approvals, and readiness/landing authority; do not imply a merge grant. |

Scale scenario count to risk and actual surfaces, not a fixed ten-lane quota. A change touching multiple surfaces needs coverage on each. Unit/static tests cannot replace a required live scenario. If no real driver exists, name the boot/input procedure needed and leave the gate blocked rather than inventing a pass.

Baseline and head must emit the same metric for a ratio. Measure baseline before treatment with comparable data/state/environment. If trunk lacks the new feature or scenarios differ, say so and set absolute budgets for the added work and the end-to-end state the user waits for. Never call unlike scenarios an improvement percentage. Interaction changes need the agreed user-visible review evidence, such as screenshots or a video when available; do not force a video for unrelated backend work.

Finish with completion conditions and appendices for prototype evidence, rejected alternatives, risks with owning unit and mitigation, source links, verification gaps, and the decision trail destination. Keep unresolved alternatives visible rather than silently choosing a product direction.

## Validate and hand back

Check graph completeness and cycles, ownership collisions, exact commands against actual tooling, resource links, scenario comparability, missing dependencies/access, evidence destinations, and every authority gate. Use an available compatible checker if the project has one; do not run an upstream checker that hardcodes unsupported hosts, model names, or lane counts just to claim validation.

Report the plan path, units/dependencies, review-gated set, what prototypes actually established, remaining decisions and proof gaps, and validation performed. Stop after planning unless the user already authorized execution; if so continue using the named route without repeat permission requests.
