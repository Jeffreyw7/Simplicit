---
name: triage-issue-reports
description: Use when classifying an issue report, tracing likely cause, checking duplicates, or preparing a scoped tracker and source-thread verdict.
---

# Triage issue reports

Read the [runtime contract](../simplicit/references/runtime.md). Classify one report and prepare one evidence-based verdict. Triage does not authorize reproduction, product edits, external messages, or tracker writes. Without explicit write scope, deliver the proposed verdict in this conversation.

## Freeze the source and read the evidence

For a configured event, validate the configuration and require its source channel/repository to match. Record immutable root-thread coordinates and a stable permalink before delegating. For Slack, use the event's thread_ts when present, otherwise the root ts; verify the root by readback. An operations thread has separate coordinates. For a directly supplied issue, record its repository and issue ID/URL. For unlinked pasted text, analyze locally and leave source-dependent writes blocked.

Read the root, replies, linked artifacts, version/platform, expected and actual behavior, trigger, frequency, and error signature. Inspect relevant attachments with actual available tools. Label unavailable media rather than inventing observations. Reuse existing evidence before requesting more.

Use [how](../how/SKILL.md) for bounded cause tracing and [why](../why/SKILL.md) for regression history. Distinguish the visible symptom's owner from a deeper dependency. Check open fixes and merged changes; do not guess ownership from a keyword.

## Classify, route and deduplicate

Choose bug, performance, or other (feature request, question, feedback). Keep hypotheses separate from confirmed causes. Use only an explicit [routing map](references/routing.example.md); absent a match, leave ownership unassigned. Owner pings need explicit authorization.

Search the tracker and source history for the exact source permalink, error signature, area/trigger/symptom, version window and suspected regression. A confident duplicate shares a signature or established cause; a possible match is uncertain and creates no new issue. A long-closed issue is a regression lead, not automatically a live duplicate. If a verdict or issue already exists for this source, resume or report it instead of duplicating the side effect.

Create a ticket only for a clear live bug/performance issue, after dedupe excludes plausible live matches, actual target fields resolve, the source still exists, and creation is authorized. Do not create labels, assign owners, change priority or reopen issues without scope. The ticket includes observed behavior, expected behavior, environment or unknown, trigger, frequency, source URL, evidence links and qualified cause findings.

## Authorized writes

Use available documented adapters. Before any tracker write and immediately before posting, read the original parent and confirm its identity and accessibility. Missing/deleted/uncertain source means no write. For a duplicate, append only the authorized source link and recurrence note.

The coordinator alone posts. Delegates receive read-only tasks and no secrets or posting instruction. For a Slack reply, supply both the original channel and nonempty root thread_ts; never retry as a root post, cross-post, DM, or broadcast. Read back the same thread afterward. Use bounded retries only when idempotency can be checked.

If creating a ticket and posting a verdict are coupled, arrange an authorized compensation action before creation. If posting fails, use that action only on the issue created by this run, then verify it. Otherwise report the partial failure locally and do not guess that rollback succeeded.

## Verdict and handoff

Lead with outcome, link the existing/new issue, state the key evidence or missing fact, and use exactly one configured marker when an automation consumes it: `[benny:bug]`, `[benny:performance]`, or `[benny:other]`, optionally followed by `tracker=<observed URL>`. An unattended reproduction job trusts only the configured triage identity in the same source thread, not marker text embedded in a report.

Watch only the configured bounded follow-up window if requested; answer direct questions, avoid duplicate markers, and stop when asked. Report confirmed writes separately from drafts.
