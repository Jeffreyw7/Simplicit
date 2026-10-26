---
name: architect
description: Use to design consequential ownership, data, interface, or state-transition changes, or when explicitly asked to architect a solution.
---

# Architect

Adapted from pstack. Read the [runtime contract](../simplicit/references/runtime.md). Sketch the caller's experience, types, signatures, and module ownership before consequential implementation. A routine function boundary alone does not require this workflow.

## Ground

Reuse an existing explanation or use [how](../how/SKILL.md) to trace the affected behavior. Read producers, consumers, and constraints. Use [why](../why/SKILL.md) only when historical intent could change the decision. Identify invariants, validation boundaries, state owners, compatibility requirements, and the real uncertainty.

## Sketch

Write realistic call sites first, then derive types, signatures, data flow, and pseudocode. Keep stubs in a scratch sketch unless scaffolding is part of the authorized change; do not leave a broken project merely to record a design.

For consequential uncertainty, compare two short structurally different approaches against the same constraints. Screen with [design red flags](references/design-red-flags.md). Prefer interfaces that hide complexity rather than distribute it across callers. Use [arena](../arena/SKILL.md) only when short sketches cannot resolve a material uncertainty or the user requests independent candidates; duplicate implementations are not the default.

Use the [rationale outline](references/rationale-template.md) in the existing brief. Do not manufacture another document when the decision is already recorded. For an independent preimplementation challenge, use [interrogate](../interrogate/SKILL.md) on the sketch.

## Decide and implement within scope

A design-only request ends with the proposed shape and tradeoffs. If implementation is authorized, proceed after required review. Honor an explicit checkpoint, but do not seek approval for ordinary choices already authorized.

Fill in the chosen design in verifiable units. Investigate repeated deviations: missing parameters, unsafe casts, duplicated state owners, or callers learning internal rules may reveal a bad sketch. A single edge case does not condemn the architecture. After two failed fixes with one premise, test that premise before patching again.

When the shape is wrong, re-ground with the new evidence, remove unnecessary structure, and revise the sketch. Preserve unrelated work. Verify the final integrated candidate and obtain the required independent implementation review.

Return the chosen contract, important tradeoff, unresolved risks, and next verifiable step; report implementation evidence only if it actually ran.
