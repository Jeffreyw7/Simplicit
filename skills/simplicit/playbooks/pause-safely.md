Follow the [runtime contract](../references/runtime.md). This playbook supplies a workflow, not additional tools or authorization.

When candidate review is required, use the existing [Review playbook](review.md) and its linked reviewer contract. The workflow here does not replace those review gates.

# Pause safely

Use only when the user explicitly asks to pause or stop. A keep-going instruction, compaction, or an absent user is not a pause request.

1. Stop dispatching new work. Propagate the pause to every active helper immediately, then bring the current atomic operation to a safe boundary or back out your own incomplete operation. Verify helper status; do not assume a queued stop message ended a running write.
2. Take no new irreversible action to pause. Preserve existing dirty and untracked work. Commit or push only if already authorized and appropriate; a WIP commit is optional, never a reason to stage unrelated changes or rewrite history.
3. Write a resume checkpoint in a permitted repository scratch location or the user's selected durable destination. Include the goal and accepted scope, user decisions and outstanding authorization, current branch/worktree/base and candidate including dirty files, completed and pending units, checks with evidence and freshness limits, active or stopped helpers, key files, gotchas, and the first concrete next action. Link an existing decision trail instead of copying it.
4. Re-read the checkpoint and inspect the actual disk state. Record anything that still exists only in memory or is not durable across host restart. If checkpoint writing is unavailable, provide the resume capsule in the reply and say it was not saved.

Report where the operation stopped, checkpoint path, saved versus unsaved state, any authorized commits actually made, tree status, helper status, and first action on resume. Unfinished work remains unfinished; pausing does not make it complete.
