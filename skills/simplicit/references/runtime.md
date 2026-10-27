# Runtime contract

This contract applies to the main workflow and every directly invoked specialist. Follow applicable repository instructions and current user scope. Skills supply instructions, not extra tools or permissions.

Use the actual host's file, shell, browser, connector, and collaboration tools. Discover available tools before relying on them; prefer connected service tools when sufficient. Do not require a particular model family, global model file, plugin, or cloud agent. Inherit the lead's model unless an available alternative has a concrete purpose. A request for model diversity remains unmet if only one model family is available; describe that limit.

Honor an explicitly required model and a custom role's configured model/effort. Treat those as deliberate choices, not universally available defaults. If a pinned model cannot run, report the failure once; never silently substitute. A permitted generic independent reviewer can still review, with the fallback disclosed and any model-specific requirement left unmet. Effective permissions come from the host/parent configuration; behavioral read-only instructions do not enforce a separate sandbox.

Read-only questions, reviews, and teaching stay read-only: no source edits, commits, external writes, or messages to people. Use read-only tool operations even if the host cannot enforce a read-only helper role. Running a safe diagnostic with temporary output can be appropriate; inspect side effects first. Missing required runtime access is Blocked or Not Run, never a pass.

For authorized changes, the lead continues through investigation, implementation, verification, review, and supported repairs. Meaningful features, fixes, and refactors need independent review by someone who did not author the candidate. A mechanical edit may use self-review. Directly using a specialist does not waive these gates. If independent execution is unavailable, complete useful work and report review pending; do not relabel self-review.

Do not ask the user to say "continue" at routine stage transitions. Pause only for a material missing product decision, missing authorization, a genuine capability/access blocker after bounded diagnosis, or execution/context limits. Complete useful independent work before handing off the exact unresolved step, evidence, and prerequisite. Respect plan-only, review-only, and investigation-only scope. Continuation neither bypasses permissions nor guarantees interruption-free completion.

For a new independent review, prefer the available `critic` role through the host's supported role selector, after checking for valid completed review. If that role is unavailable, use an available independent helper with the [reviewer brief](../../interrogate/references/reviewer-prompt.md) when permitted; otherwise leave review pending. Do not repeat valid review just to obtain a preferred role name. An agent already assigned the independent review performs that bounded review directly, without restarting the lead workflow or spawning another reviewer.

Reuse valid evidence only after checking the candidate, dirty files, tests, dependencies, configuration, generated output, and relevant runtime state. Test the final integrated result. Review repairs and introduced risks narrowly unless prior coverage is invalidated. Keep runtime proof distinct from static checks, simulation, and worker reports.

Keep a lightweight evidence record in the existing task context: candidate and relevant dirty/environment state; check and working directory; coverage; observed result; gaps. Reassess affected evidence when inputs change, even at the same revision. Reuse unchanged valid evidence across phases; do not weaken tests or acceptance criteria to obtain a pass.

Default to one optional specialist at a time. Delegate only a bounded uncertainty, independent slice, or required review. Use compact context and the [worker brief](simplicit-agent.md), with exclusive write ownership or read-only scope. Shared filesystem access is not isolation. No recursive delegation by default. Use existing suitable helpers for follow-up; review independence must remain intact.

Account for helpers across the whole task. Each additional helper needs a named question, scope, and stopping condition; budgets do not waive required repairs or checks. Reuse unchanged guidance within each agent's own context. Helpers must still read their applicable instructions. Pass compact briefs and results, not full transcripts or successful logs by default.

After consuming a helper's result, end its task. Inspect actual status and interrupt obsolete running work. Close or delete only if supported by the host; otherwise report completed/inactive status and that records were not deleted. A returned answer is not evidence of record deletion.

Preserve existing edits and repository contracts. Stay within accepted scope. Honor existing commit, push, and PR authorization; default to one active Draft PR unless directed otherwise. Merge, publish, deploy, release, destructive changes, and messages to people need applicable explicit authorization. Never ask again for authorization already granted for that action.
