Follow the [runtime contract](../references/runtime.md). This playbook supplies a workflow, not additional tools or authorization.

When candidate review is required, use the existing [Review playbook](review.md) and its linked reviewer contract. The workflow here does not replace those review gates.

# Visual parity

Use image comparison to establish the agreed visual equivalence. A valid immutable baseline is a prerequisite; eyeballing the result cannot prove pixel parity.

1. Before migration, capture the current implementation and relevant target across representative states. Pin route/component, data, viewport, device scale, fonts, renderer/browser version, animation/time state, and other environmental inputs. Preserve baseline images, capture recipe, and harness identity. If no valid baseline exists, stop the parity claim and report what must be supplied or established.
2. Hold the acceptance rule fixed. Exact parity means zero image delta. If nondeterminism prevents that comparison, expose the cause and obtain an explicitly agreed tolerance or mask for justified dynamic content before claiming a pass. Do not silently change a zero-diff target.
3. Do not modify baseline or weaken the harness to silence a failure. If a baseline appears wrong, identify the evidence and resolve that requirements decision separately. Behavior restructuring solely to make screenshots equal can hide a regression and is not an acceptable shortcut.
4. Move shared primitives first as a blocking prerequisite, then migrate one component or safe independent slice at a time. Keep one owner per artifact; optional parallel work needs isolated write scope and a coherent integration owner. Check each unit before proceeding.
5. Capture the candidate on the same controlled surface and states with an actual supported driver. Run the image diff and inspect every nonzero delta. Distinguish implementation mismatch from environmental mismatch, preserve diff artifacts, and repair only the actual cause. Drive important interactions as well; equal static images do not prove their behavior.
6. Verify the integrated result and complete meaningful independent review. Prepare authorized delivery through [Opening a PR](opening-a-pr.md). Continue scoped attempts while they can resolve the measured mismatch; no assumed loop/wake mechanism or mandatory PR per component is required.

Report components and states, baseline/harness location, per-unit image-diff result and actual threshold, interaction evidence, environmental limits, review, and remaining mismatches. No baseline means no verified parity.
