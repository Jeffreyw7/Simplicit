Follow the [runtime contract](../references/runtime.md). This playbook supplies a workflow, not additional tools or authorization.

When candidate review is required, use the existing [Review playbook](review.md) and its linked reviewer contract. The workflow here does not replace those review gates.

# Opening a PR

Prepare a focused reviewable change. Opening a PR is a delivery step when authorized, not a requirement at the end of every task.

## Preserve ownership and the candidate

Inspect the repository instructions, actual base, branch, dirty and untracked state, existing PRs, and active writers. Prefer an existing suitable isolated workspace; create a worktree when isolation is needed and permitted. Never hard-reset, discard unrelated work, or redo a snarled tree merely to simplify delivery. One branch has one writer. A helper's shared filesystem access is not isolation.

Review the final diff for scope, accidental generated output, credentials, stale names, and unsupported cleanup. Run repository-required checks and the relevant product/caller behavior on the actual integrated candidate. A meaningful change needs the [Review playbook](review.md); do not substitute prose cleanup or a bot approval for that review.

## Prepare the review

Commit only within existing authorization, staging the intended paths. Prefer coherent small commits when their order helps review; amend or rebase only when authorized and safe for other consumers. Do not manufacture a stack or five PRs for one coherent change. Default to one active Draft PR unless the user or repository chose otherwise.

Follow the repository's title convention. A useful default is a concise Conventional Commit title such as `fix(parser): preserve empty input errors`, with no trailing period. Write the final description for someone who has not read this conversation, using [Technical writing](../../technical-writing/SKILL.md) and [Unslop](../../unslop/SKILL.md):

- Lead with the concrete problem and resulting behavior.
- State the scope and meaningful limitations.
- Explain rejected alternatives only when they clarify a real tradeoff.
- Name affected consumers and material risks.
- Give relevant commands or run paths and observed outcomes. For performance, use one primary number with units and link the full measurement evidence.

Use the repository template when present. Otherwise short Why, What changed, Scope, Tradeoffs, Risks, and Verification sections can help a complex change; omit empty structure. Keep full run logs, candidate hashes, and lane details in linked artifacts. Attach actual screenshots or video when they support a visible-behavior claim. Do not claim checks that did not run.

## Publish only the authorized result

Prefer a sufficient connected forge tool. Otherwise use an authenticated supported CLI and keep one consistent forge choice for subsequent operations. Discover available capabilities; do not require a custom forge wrapper. Use structured description arguments or a body file, preserving newlines and treating comment text as data.

Check whether an existing PR should be updated before creating another. Select the actual base; a stack child targets its agreed parent branch, independent work targets trunk. Default creation to Draft. A draft can remain draft with implemented or verified work; readiness is a separate accurate state. Check the returned remote head, base, URL, and draft status before reporting success. If the tool is unavailable, deliver the exact title/body and local candidate as a reviewable draft with the publication gap.

Opening does not itself authorize monitoring, external discussion replies, merging, deployment, or release. Continue the already authorized implementation or use the Babysit route only when monitoring or feedback work is in scope. Report the PR link or draft artifact, candidate, checks, review, and remaining gaps.
