# Design red flags

Adapted from pstack. These are evidence-seeking prompts, not automatic blockers or permission for unrelated restructuring.

- **Shallow module:** callers coordinate many public steps while still knowing the implementation. Prefer a small public surface that owns substantial policy. A deep call chain is not a deep module.
- **Information leakage:** multiple modules depend on the same storage, wire, or representation decision. Parse external shapes at a clear boundary; preserve intentional public protocols and compatibility obligations.
- **Temporal decomposition:** load, validate, transform, and save layers repeat one domain's invariants. Consider grouping knowledge and ownership rather than simply grouping execution order.
- **Pass-through layers:** forwarding the same arguments adds no policy or adaptation. Remove indirection only when it provides no required boundary.
- **Split ownership:** multiple writers or hand-synchronized copies can diverge. Identify one owner or an explicit consistency protocol; prove concurrent behavior where it matters.
- **Competing APIs:** a new path leaves an old one for contributors to copy. Migrate internal callers when in scope; do not silently break external consumers.
- **Importable internals:** callers can bypass an invariant-protecting API. Use language or package boundaries when practical.
- **Hand-maintained lists:** one addition requires matching edits in several places. Derive them from one source, or check their consistency when derivation is inappropriate.

State the concrete failure a red flag can cause, its affected contract, and whether the cost of changing it belongs in this task.
