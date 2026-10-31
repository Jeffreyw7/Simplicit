---
name: recall
description: "Use when asked to reconstruct recent work across available history and live project records before resuming a named topic; use ketchup for this chat's short catch-up."
---

Read and follow the [runtime contract](../simplicit/references/runtime.md) before using this skill. It governs scope, tools, authorization, verification, and review.

# Recall

Rebuild current working context, not a transcript dump. Stay read-only and on topic.

1. Classify the request. One specific prior chat needs session pickup, a personal mode belongs to [Automate me](../automate-me/SKILL.md), and a summary of this chat belongs to [Ketchup](../ketchup/SKILL.md). Use a complete supplied state capsule directly instead of mining again.
2. State the topic, workspace, and time window before searching. Default recent to seven days. Never quietly narrow an explicit request for all history. Read only available history for the active workspace or another workspace the user named. Do not guess transcript paths or search unrelated private chats.
3. Search topic terms before reading relevant message regions, order conversations by actual timestamps rather than opaque IDs, and exclude current-chat, test, and helper noise. For each relevant chat capture goal, decisions, open threads, struggles and corrections, and artifacts with an evidence pointer. If history is unavailable, state the gap and use the supplied context plus live state. Split corpus work only when authorized delegation actually helps.
4. For a named feature, subsystem, file, or bug, use [Why](../why/SKILL.md) to inspect available shared records: source history, issues, linked discussions, docs, and error reports. Ask what is current, what was tried or reverted, and what users still report. Read only relevant sources; unavailable services and null results are findings. Pure activity recall can omit this sweep.
5. Check surfaced branches, PRs, and tickets against current local state or connected service tools. Do not report merged from a stale transcript. When the question concerns what an agent actually did, inspect the available full record rather than trusting a summary and label absent evidence.

Return a capsule of at most five bullets, then one status line per thread, up to five recurring problems, and the single most useful next action. Use precise statuses such as merged, open PR, in flight, verified uncommitted, reverted, planned, or unknown. Link evidence, include reverted attempts, and keep adjacent work out unless it blocks the topic. Apply [Unslop](../unslop/SKILL.md). Sanitize private context before any public output; recall does not authorize publishing it.
