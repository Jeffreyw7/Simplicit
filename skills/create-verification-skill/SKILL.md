---
name: create-verification-skill
description: Use when asked to create project-local instructions for launching, driving, observing, and cleaning up real application verification.
---

# Create a verification skill

Adapted from pstack. Read the [runtime contract](../simplicit/references/runtime.md). Create an instruction skill for the actual repository and available host tools, not a new testing framework. Automatic use during another task is limited to identifying the gap; author a reusable verification skill only when within the accepted scope.

## Discover from the repository

Read current run instructions, scripts, tests, and application entrypoints. Determine the user surface, launch command, readiness signal, auth/seed prerequisites, driving mechanism, observable effects, and isolation model. Prefer existing harnesses. Use available browser, API, PTY, editor, or engine tools only after discovering their capabilities.

If startup is broken, diagnose it. Repair within scope or report the blocker; do not silently expand into product work or install global dependencies. Do not assume two agents can drive the same session safely.

## Author the local skill

Write `.agents/skills/verify-<app>/SKILL.md` with a matching `name` and a description naming the app and verification surface. Inspect existing content before changing it and preserve local customizations. Replace template placeholders with observed commands; unavailable steps must be explicitly marked unverified, not invented.

- **Launch:** exact command, version/config prerequisites, isolated test data, migration/seed steps, and a readiness signal for usable behavior. A listening port alone may not mean initialization finished. For a short-lived CLI, document a fresh isolated invocation per drive.
- **Doctor:** a read-only check for the expected build, instance ownership, readiness, and auth. Use it before first drive and after unexpected results. A healthy process can still have a wedged UI that needs a reset.
- **Drive:** real selectors, command inputs, routes, or engine actions. Exercise the user-facing path, not internal setters or test-only shortcuts that bypass the behavior under test.
- **Evidence:** capture action and resulting state, plus relevant side effects. Name persistent artifact locations. Inspect what a dry run actually does before assuming it is safe. Use test accounts/data; sending real messages, publishing, or destructive external actions still requires authorization.
- **Cleanup:** tear down only instances and scratch data created by the run. Never kill all processes with a shared name. Preserve proof artifacts and confirm they survive cleanup, including failed iterations.
- **Helpers:** include scripts only when necessary, with complete dependencies and exact invocations suitable for the platform. Verify them; do not ship a shell-specific command as universally portable.

## Map and prove

Seed `features/README.md` and a few important user journeys using the [feature-map shape](references/feature-map-example.md). Name prerequisites and observable acceptance. Missing data or access is a gap, not a reason to weaken the journey.

Run the generated instructions end to end: launch, doctor, drive one mapped feature, capture evidence, cleanup, then confirm evidence remains. Clean up owned residue after failed attempts too. A skill never exercised on its target remains a draft. Stand-in results must name what the real target has not verified. Obtain independent review for meaningful generated harness code or workflow changes.

Report created files, exact observed proof, remaining draft/blocked steps, and the [maintenance route](../maintain-verification-skill/SKILL.md). Do not claim the initial one-feature trial covers the entire map.
