Follow the [runtime contract](../references/runtime.md). This playbook supplies a workflow, not additional tools or authorization.

When candidate review is required, use the existing [Review playbook](review.md) and its linked reviewer contract. The workflow here does not replace those review gates.

# Autonomous run

Define done, then continue through authorized work until the evidence meets it. Use this for one task driven to a checkable predicate; a standing program with many durable units belongs to the Orchestrate route.

1. State a falsifiable exit predicate before the first iteration, such as the original reproduction passing, all scoped units verified, or the agreed image difference reaching its threshold. Include scope, required review, and authorization boundaries. A merge predicate is usable only when landing is already authorized.
2. Choose the host's real continuation mechanism. If an available watcher reports CI or a ref advancing, consume that event rather than polling blindly. If supported, a heartbeat can cover missed events. Without a durable scheduler or wake tool, continue within the active session and record the limitation; a background process or promise in prose is not a scheduled future agent turn. Do not claim unattended persistence the host cannot provide.
3. Per iteration, state a hypothesis, make the smallest evidence-backed change, verify it against the real predicate, and keep or discard your own attempt. Check each unit before starting the next. Preserve unrelated edits. Commit or publish only within existing authorization.
4. Repair blockers inside the accepted scope. Record unrelated discoveries and optional follow-ups rather than automatically opening side PRs. Product choices, missing dependent approvals, inaccessible required runtime, or a demonstrated dead end remain explicit gates. Continue useful independent work where possible.
5. Log each meaningful attempt, result, pivot, revert, and blocker using [Show me your work](../../show-me-your-work/SKILL.md). Check actual artifacts and helper output, not summaries. Complete independent review for meaningful candidate changes.
6. A plateau prompts a reasoned pivot: challenge the premise, inspect new evidence, or try a different mechanism. Do not repeat ineffective changes or relax acceptance to claim success. Stop when the predicate passes, the user stops, a genuine dependent gate prevents further progress, or the exhausted alternatives justify a documented dead end. Use [Pause safely](pause-safely.md) for an explicit pause.

Report the predicate, attempts run, retained and discarded changes, evidence for the final state, review, and any unmet condition or continuation limitation.
