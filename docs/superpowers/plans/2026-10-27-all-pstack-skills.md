# Complete pstack adaptation for Simplicit

Goal: make every skill in the pinned pstack snapshot available through the existing Codex-oriented Simplicit collection.

Architecture: keep `pstack/` byte-for-byte unchanged. Extend `skills/`, retaining the existing main entrypoint and specialists, with substantive portable adaptations and the scripts/resources their workflows need. Preserve the original license in each distributable skill. Rename `poteto-mode` to the existing `simplicit` entrypoint, `poteto-help` to `simplicit-help`, and `setup-pstack` to `setup-simplicit`; retain `simplicit-mode` as an alias. Include all three nested Benny automation skills as portable issue workflows.

Spec: the user's October 27 request for **all** pstack skills, extending the prior subset documented in the October 26 plan. Use the existing pinned source rather than silently importing a different upstream release. Follow the existing implementing-lead, selective-delegation, evidence, and authorization contract.

## Constraints

- No required Cursor tools, fixed provider/model roster, automatic model changes, or assumptions of transcript/service access.
- Read-only requests remain read-only. Skills do not authorize merges, external messages, credential changes, or deployment.
- Missing optional services and runtimes must produce actionable limitations; preserve useful local work.
- Keep substantive algorithms, workflows, and relevant examples; a wrapper that merely points at inactive upstream instructions is not a port.
- Preserve the 15 existing adaptations, updating routes and support boundaries as needed.
- Package installation must preserve collisions and unrelated user files. No global install is implied.
- Verify scripts on the available Windows/Node/Python host. Explicitly distinguish checked local behavior from unavailable integrations.

## Tasks and verification

- [x] Inventory all 58 top-level and three nested source skills; demonstrate missing coverage before editing and maintain a machine-readable source-to-target manifest.
- [x] Adapt general workflow, writing, explanation, setup, and 24 principle skills. Review source-specific dependencies and validate each added folder before proceeding.
- [x] Adapt formal verification, statechart, bot UI, and nested issue workflows, preserving useful runtime helpers. Test helper behavior and dependency errors with isolated fixtures.
- [x] Extend the main workflow's playbook coverage, help catalog, provenance, and adoption instructions. Add a safe local installer if it reduces copy errors; test collisions before implementation.
- [x] Validate full mapping, metadata, licensing, resource closure, and relocated installation. Run existing and new meaningful tests, script checks, and representative independent skill trials.
- [x] Obtain independent review, repair supported findings, rerun affected checks, and prepare a reviewable branch/patch with accurate limitations. Do not merge or release.

## Review focus

Missing nested skills; broken dependencies after relocation; hidden host-specific mutations; formal-model claims without runtime evidence; installation overwrites; generic skills activating outside their scope.

## Evidence and rulings

- Baseline: 12 validator tests pass; collection validation reports 15 skills. The pinned source contains 58 top-level skills and three nested automation skills.
- Ruling: preserve the pinned source and extend all of it; changing the upstream version is separate work.
- Ruling: the current request supersedes the earlier source-only exclusions. It does not supersede the established authorization and selected-repository installation boundaries.
- Windows sandbox cannot read/write the task checkout despite its declared workspace root; scoped shell operations use reviewed escalation.
- User selected PR #3 as the integration base; its critic, runtime, Interrogate and Review contracts are retained.
- Final coverage: 62 skills and all 23 source playbook routes. Native Codex discovery found every installed skill enabled. Local Python checks pass (51 tests, two inherited symbolic-link skips); all seven Node/TLC checks pass. Independent adaptation, installer, integration and CI/evidence reviews are complete. See [dated evidence](../../validation.md).
