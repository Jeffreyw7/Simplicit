---
name: figure-it-out
description: "Use for an explicitly open-ended complex task or a large migration that needs a custom, auditable workflow when no narrower playbook fits."
---

Read and follow the [runtime contract](../simplicit/references/runtime.md) before using this skill. It governs scope, tools, authorization, verification, and review.

# Figure it out

Design the workflow before implementation. Read the [Simplicit entrypoint](../simplicit/SKILL.md), then keep a compact phase list with the host's planning tool or a task note.

## Frame

State the definition of done as a falsifiable predicate, rough units and effort, grounded blockers, and the rigor level. One-way doors and large impact need stronger gates and artifacts. Reversible low-stakes work needs less. Explain the framing before a long run; proceed inside existing authorization.

## Design

Sequence small independently checkable units, with the riskiest unknown first. Capture the pre-change baseline and build the verification harness before changing what it measures. For consequential unsettled design decisions use [Architect](../architect/SKILL.md); skip another design panel over a settled mechanical plan.

Use deterministic tools for repeated work. Delegate only when available and authorized, across bounded seams with exclusive write ownership or isolated workspaces. Record the phase list the reviewer will inspect.

## Experiment and log

For each unit, state the hypothesis, make the smallest change, inspect the real artifact against the predicate, and keep or revert your own change according to evidence. Check the unit before the next. A result is VERIFIED, NOT VERIFIED, or INCONCLUSIVE. A suspiciously easy pass earns a check of the observation method.

Inspect delegated output directly. If a worker games a gate, reject the candidate and strengthen the contract. If the gate is wrong, repair it in its own unit rather than routing around it. Keep decisions, pivots, reverts, and blockers using [Show me your work](../show-me-your-work/SKILL.md) as they happen.

## Hand back

Verify the integrated result on the real product against the original predicate, complete the runtime contract's review, and repair supported findings. Propose recurring corrections as structural checks when appropriate. Report the custom playbook, rigor and reason, trail path, evidence against the predicate, and remaining gaps. Missing runtime access or independent review remains explicit.
