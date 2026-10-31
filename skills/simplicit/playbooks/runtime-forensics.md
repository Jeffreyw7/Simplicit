Follow the [runtime contract](../references/runtime.md). This playbook supplies a workflow, not additional tools or authorization.

When candidate review is required, use the existing [Review playbook](review.md) and its linked reviewer contract. The workflow here does not replace those review gates.

# Runtime forensics

Diagnose an actual live process from observed CPU, memory, scheduling, or rendering evidence. The deliverable is a cited mechanism, not a source fix. Existing-capture analysis belongs to [Trace forensics](trace-forensics.md).

1. Establish process/build identity, relevant state, reproduction, and the matching available inspection surface. Capture the actual signal: CPU profile for a spin, heap snapshots for retention, runtime trace for scheduling or rendering, or equivalent host tooling. Do not assume CDP, a named control plugin, private production access, or a particular profiler exists. Missing required access is a visible gap.
2. Reduce the artifact to the implicated mechanism: hot function and caller, retained object to GC-root chain, or an idle loop firing without input. Use structured queries and bounded reads; an authorized helper may handle a large artifact. Keep raw artifacts and reduced evidence linked rather than relying on a summary.
3. Seek a discriminating observation or focused experiment. Nonmutating inspection is the default for diagnosis. Injecting code, adding live instrumentation, changing runtime configuration, hot-patching, restarting, or perturbing production state can change behavior and requires applicable diagnostic authorization. A read-only request does not permit such a probe. Prepare the concrete probe and expected distinguishing result when dependent approval is missing; keep useful analysis moving.
4. When a probe is authorized, constrain its target, side effects, rollback, and duration. Capture before/after state, restore temporary instrumentation where appropriate, and inspect the actual result. Failure to reproduce or an ambiguous response is not confirmation.
5. Map the signal through the artifact/build's symbols to source file, symbol, and allocation/scheduling line. Inspect source to explain the evidence, not as a replacement for the live signal. Record mismatched builds, unresolved source maps, and possible confounders.

Report the captured signal and artifacts, reduced mechanism, exact source mapping, observation or authorized experiment and result, confidence, and missing access. Hand a known cause to [Bug fix](bug-fix.md) or [Performance issue](perf-issue.md) only within the user's existing repair authorization.
