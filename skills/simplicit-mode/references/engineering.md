# Engineering guidance

Adapted from pstack's engineering principles. Apply the parts relevant to the current decision.

## Ownership and state

Identify the actor that owns a state transition and the contract callers rely on. Prefer explicit states and data shapes over scattered flags. Validate external inputs at boundaries; keep internal logic consistent with established contracts. For retries, identify what makes an operation safe to repeat. Parallelize work only when shared writes have a clear owner or can be separated.

## Root cause and failed premises

Trace a symptom to the first incorrect decision, using reproduction and instrumentation. If the triggering state is legitimate, handling it may be the correct fix. If the state is impossible by contract, find what produced it instead of silently discarding it.

Repeated fixes that fail the same gate are evidence against their shared premise. Name that premise, seek an observation that could refute it, and change direction when the evidence does. Avoid accumulating compensating patches.

## Evidence and tests

Inspect the actual artifact or behavior that establishes the claim. Compilation establishes syntax or type checks; simulated tests establish only the behavior the simulation covers. Neither establishes real networking, device behavior, or multiplayer interactions.

A useful regression test fails when the promised behavior breaks and survives internal restructuring that preserves the contract. Drive the caller's interface, derive expected results from requirements, and avoid assertions on values manufactured entirely by the test itself. Use reusable checks where they materially improve reliability; keep simple edits simple.

## Recurring mistakes

Prefer a type, interface, invariant check, lint rule, or regression test when it prevents the repeated defect. Keep a concise instruction when the decision actually needs judgment. Do not grow the always-loaded policy with task history.
