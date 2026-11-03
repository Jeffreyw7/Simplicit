Follow the [runtime contract](../references/runtime.md). This playbook supplies a workflow, not additional tools or authorization.

When candidate review is required, use the existing [Review playbook](review.md) and its linked reviewer contract. The workflow here does not replace those review gates.

# Autopilot for a dependent stack

Build one reviewable base-chained stack. [Autopilot full](autopilot-full.md) governs ownership, evidence, and liveness; this route replaces its independent-branch topology. Withheld landing authority is preserved, not inferred from the word autopilot.

1. Draw the dependency order and assign one topology owner. The root branches from actual trunk; each dependent child branches from its parent's exact candidate and targets that parent in its PR. Independent items should not be coupled merely to create a stack. Default delivery remains Draft.
2. Give branch owners exclusive slice ownership. They implement, verify, and publish only their branches within existing authorization. Each reports branch, exact tip, intended parent, changed files, tests, behavioral evidence, and STACK-READY or a precise gap. They do not independently retarget, restack, close, merge, or arm auto-merge.
3. Serialize all topology work through the owner: parent advancement, authorized chain rebase, base retarget, and merge coordination. Before rewriting a child's branch, suspend its ordinary writer and reconcile local/remote tips and lease. Conflict resolution can return to the slice owner under an explicit temporary ownership transfer; do not permit both actors to push concurrently.
4. Reconcile drift bottom-up. Check changes to relevant files, consumers, dependencies, generated output, config, and required checks at each link. Refresh the dependency brief for descendants when parent contracts change. Apply [Shipping](shipping.md)'s evidence-freshness rules link by link: each base is its actual parent, and an unchanged patch ID alone does not preserve runtime proof.
5. Present root and tip links plus the ordered chain, per-link candidate/parent, verification and independent review, and unresolved product or approval gates. A link is STACK-READY only when its required evidence against its current dependency state exists. Do not mark an upper link ready against a parent that has materially changed beneath it.
6. When separately authorized landing starts, freeze ordinary branch and base writes throughout the chain. Only the topology owner's authorized post-parent-merge movement in Shipping continues. A mid-landing fix needs coordinated pause and applicable scope; do not repair behind an active merge operation. Verify actual remote merge state before moving the next child.

Report the chain, one-line readiness per link, excluded or parked items with reasons, and who owns topology and landing. Use full autopilot for truly independent items; use this route when dependencies or deliberate review-before-landing require a chain.
