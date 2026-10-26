---
name: arena
description: Use for explicitly requested competing candidates or a consequential design uncertainty that short sketches cannot resolve.
---

# Arena

Adapted from pstack. Read the [runtime contract](../simplicit/references/runtime.md). Compare alternatives only when the experiment earns its cost. Start with sketches; default to one final implementation.

1. **Frame:** state the artifact, constraints, unanswered question, and three to six concrete success criteria. Choose the smallest experiment that discriminates between approaches. Set a stopping condition. Clarify whether outputs are sketches or code.
2. **Isolate:** give each authorized candidate the same task and its own output directory or worktree. Shared filesystem access is not isolation; avoid concurrent writes to shared manifests, lockfiles, or app instances. Record candidate identities and runtime assumptions. Use available capacity and models, never invented tool fields.
3. **Produce:** for independent candidates, use bounded worker briefs with no recursive delegation. If helpers are unavailable, compare lead-authored sketches and state they are not independent; if independence was explicitly required, leave that requirement pending. Record dropouts as gaps.
4. **Judge:** read completed candidates against the same criteria. Use one independent design critic when a consequential question warrants it or the request requires it. A candidate author cannot provide the independent review of that candidate. Existing review evidence can be reused when valid.
5. **Choose and integrate:** select one base with a rationale. Incorporate only useful compatible pieces from alternatives, preserving one coherent design. Agreement does not prove correctness; divergent outputs may reveal an ambiguous task, which needs reframing rather than averaging.
6. **Verify:** test the synthesized artifact, not merely each candidate. Apply the normal independent review requirement to meaningful implementation. Clean up only scratch work this task owns and only through safe host operations; preserve evidence.

Return the selected base, accepted tradeoffs, retained/rejected ideas, independent review coverage or gaps, and actual verification. Design-only work ends at the design; it does not grant implementation or shipping authority.
