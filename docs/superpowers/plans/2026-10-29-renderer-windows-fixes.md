# Symbolic renderer and Windows publication fixes

> Implement the user-authorized fixes with systematic debugging, failing regressions, independent review, and local commits.

Base: 8872fe6. Scope: retain existing commands, options, output schemas, model outcomes, mapping values, backups and rollback behavior. Keep the original pstack tree and upstream pin unchanged.

1. Renderer: trace parseValue/readBroken failure using real TLC output. Add regressions for symbolic and digit-leading model values nested in broken-state records, existing value structures, malformed marker output, and an actual multi-state counterexample. Fix token parsing at the source; reject malformed marked output clearly instead of converting it to bogus state data.
2. Windows publication: reproduce a real rename denial and add deterministic transient/permanent-failure controls. Add bounded, Windows-only handling for temporary rename denials, preserving collision detection, recovery paths and permanent-error exits.
3. Integrate new tests into the existing suite and update the adaptation resource map and runtime help where behavior changes.
4. Independently review each fix for model-value fidelity, finite retry behavior, changed-input/concurrent-output protection, and lossless recovery. Repair material findings before completion.
5. Run the full Node/TLC suite and Python/validators; run selected upstream compatibility cases. Record exact results and remaining limits, then commit the major changes locally.

Progress:
- [x] Renderer red/green and counterexample verification.
- [x] Windows red/green and real-lock verification.
- [x] Independent reviews and any corrections.
- [x] Combined verification, report, local commits. Full Node/TLC run: 111 passed, zero failures, one junction capability skip. All 64 selected upstream cases passed; Python/validators passed with documented environment skips.
