---
name: reproduce-and-fix-issues
description: Use when reproducing a triaged issue through real app behavior, verifying an existing fix, or implementing an authorized bounded fix with before-and-after evidence.
---

# Reproduce and fix issues

Read the [runtime contract](../simplicit/references/runtime.md). Reproduce the exact symptom, verify any existing fix, and implement only within the user's granted scope. Read-only reproduction never becomes permission to patch, post, or merge.

## Qualify the report

Read the full report, linked tracker item, attachments, configuration and [feature map](references/feature-map.example.md). Freeze source coordinates as in [triage](../triage-issue-reports/SKILL.md). For unattended runs, accept exactly one configured bug/performance marker from the configured triage identity under that root. Conflicting/untrusted markers, other, timeout, or missing configuration stop the unattended job without writes. A user's direct reproduction request supplies manual scope without requiring a fictional bot marker.

Recheck ownership before work. Do not race someone who explicitly owns the fix. A diagnostic bot or evidence summary is not fix ownership. If a plausible fix PR/commit exists, follow [verify-existing-fix](references/verify-existing-fix.md); do not author over it.

## Establish a real reproduction

Read the [control-adapter contract](references/control-adapter.md). Discover an available browser/native app/test adapter and its actual capabilities. Match the app, revision, account, workspace, data and environment using stable markers. A missing mapped feature or required capability is Blocked, not a reproduction.

Name the correct and broken final states and the discriminating action. Drive the actual user path, observe the broken state, reset relevant state, and reproduce independently a second time. Read-only state inspection can corroborate the result; injecting internal state cannot prove the symptom. For a non-UI issue, agree on the real public/API/CLI entrypoint and observable contract; do not manufacture a UI requirement.

Use the configured budget. Capture the steps and discriminating state, with screenshots/recording where the feature contract requires them. Review evidence for that state, using an independent reviewer when available and warranted. If required recording or review cannot run, report that gap; do not substitute compilation or screenshots for a required video.

Source reading and a plausible model are hypotheses until runtime evidence supports them. Use [how](../how/SKILL.md), [why](../why/SKILL.md) and [blast-radius](../blast-radius/SKILL.md) selectively.

## Fix only after proof

For unattended runs, record when the reproduction was confirmed and honor the configured `rejection_window_minutes` before entering the fix phase. Observe the original source thread within that bounded window using actual host waiting/scheduling capabilities. A correction to the setup invalidates the evidence and requires a fresh reproduction; a new fix owner or artifact switches to the ownership/existing-fix gate. If waiting or source reads cannot be completed, leave the fix pending rather than assume silence. Direct manual work follows the user's current scope and need not fabricate an automation window.

No confirmed reproduction means no fix under this workflow. Verify-only and existing-fix tasks stay read-only. Otherwise confirm root cause, check no new ownership/fix artifact appeared, and keep the change inside the authorized effort and repository scope. Use [tdd](../tdd/SKILL.md) when there is a meaningful practical regression path. Keep unrelated cleanup out.

Re-run the original path twice against the patched build with the same inputs. Show both absence of the broken state and presence of the expected state. Preserve baseline evidence. Run relevant checks and nearby behavior/permission/error-path tests; obtain independent candidate review for meaningful changes through [interrogate](../interrogate/SKILL.md). Unresolved defects or missing required evidence block readiness.

## External handoff and cleanup

By default report in this conversation. External replies and tracker changes require explicit authorization even when configuration names channels. Follow the triage source-parent preflight before each authorized reply; never post at the source root or fall back to another channel. Keep operations coordinates separate. Use one concise source update, and read it back.

Prepare a draft PR only within scope after proof and checks. Its description links the report, mechanism, before/after evidence and tests. No merge or deployment is implied. If PR creation fails, report the actual local/remote state.

Clean up only processes, temporary profiles and disposable data created for this run. Preserve user work and retain evidence under the chosen retention policy. Report Reproduced, Could not reproduce, Blocked, Verified existing fix, or Fixed with concrete evidence and remaining gaps.
