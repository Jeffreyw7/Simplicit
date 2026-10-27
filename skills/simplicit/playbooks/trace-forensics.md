Follow the [runtime contract](../references/runtime.md). This playbook supplies a workflow, not additional tools or authorization.

When candidate review is required, use the existing [Review playbook](review.md) and its linked reviewer contract. The workflow here does not replace those review gates.

# Trace forensics

Diagnose from an existing capture as a fixed dataset. Do not silently rerun the workload, instrument a live process, or edit the product.

1. Identify the capture format and provenance: CPU profile, compressed trace JSON, heap snapshot, thread dump, spindump, or another concrete format. Note runtime/version and source/symbol mapping information carried by the artifact. Preserve the original file; parse a copy or write derived scratch output.
2. Use an appropriate available parser or viewer. For substantial artifacts, build a queryable representation such as tables or SQLite with one row per sample/frame/node and retained identifiers. For a small dump, direct structured inspection may be enough. Bound large reads and keep the reduced finding plus exact evidence pointers. Authorized parsing helpers are optional, never required by model family.
3. Query the mechanism: CPU samples and inclusive/self time along a hot call path; leaked object retention to a GC root; or the on-CPU/blocked thread and its wait reason. Check units, sample intervals, dropped events, timing windows, and whether a snapshot measures retained versus allocated memory. A large allocation total alone is not proof of a leak.
4. Attribute through the artifact's own symbols and source maps to file, symbol, and line. Plausible function names from the current repository are not attribution. Identify source/build mismatch, missing symbols, and unresolved frames. Where exact mapping is impossible, report the strongest supported level instead of guessing.
5. Compare a supplied paired capture only when workload, state, and timing are comparable. A reduction in the implicated path can corroborate a change; capture differences alone do not establish causality. Without a discriminating experiment or adequate paired evidence, label the finding the strongest supported hypothesis, not a confirmed cause.
6. Deliver a cited diagnosis and a focused next experiment. Route an authorized repair to [Bug fix](bug-fix.md) or the Performance issue route. No product fix, live mutation, fresh capture, or external upload is implied by artifact analysis.

Report format and artifact, query/reduction method, hot path/retainer/wait finding, exact source attribution or symbol gap, paired evidence if any, confidence, and limitations.
