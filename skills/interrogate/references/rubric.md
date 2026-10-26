# Review rubric

Adapted from pstack. Apply relevant lenses; a small fix does not need an essay on every category.

- **Correctness:** trace intended behavior and failure paths. Check boundary values, errors, encoding, stale state, cancellation, concurrent access, retries, and partial completion where reachable. Show the path that makes an invalid value possible.
- **Root cause:** distinguish legitimate input guards from masks for broken internal invariants. Inspect producers, callers, types, and sibling code. A fix in one module may belong at the owner of its contract.
- **Ownership and structure:** identify validation boundaries, state owners, coupling, and migration consumers. Judge new complexity against actual needs. Compatibility obligations can justify an old path; do not require its removal without evidence.
- **Verification:** check whether tests exercise observable behavior and whether they would catch the defect. Identify missing runtime or integration coverage. Compilation and a helper's report cannot prove the real user path.
- **Complexity:** identify unnecessary state, wrappers, configuration, or duplicate paths that cause a concrete maintenance or correctness risk. Do not demand speculative abstractions.
- **Security:** for relevant changes, trace attacker-controlled input to a reachable sink or authority decision. Inspect authorization, secret handling, and time-of-check/time-of-use behavior. A generic concern is not a supported vulnerability finding.

Evidence should show source locations, reachability, and consequence. A missing test may be a verification gap without proving the implementation is broken.
