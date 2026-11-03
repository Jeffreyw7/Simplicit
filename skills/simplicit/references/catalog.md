# Simplicit skill catalog

All 61 skill entrypoints in the pinned pstack snapshot have Codex adaptations. The collection contains 62 folders because Simplicit also retains its mode alias. Install the complete collection; links below resolve entirely within it.

Read only the skill relevant to the request. Loading a principle or specialist is not permission to spawn helpers, change scope, or use unavailable tools.

## Workflow and specialists

| Skill | When it applies |
|---|---|
| [architect](../../architect/SKILL.md) | Use to design consequential ownership, data, interface, or state-transition changes, or when explicitly asked to architect a solution. |
| [arena](../../arena/SKILL.md) | Use for explicitly requested competing candidates or a consequential design uncertainty that short sketches cannot resolve. |
| [automate-me](../../automate-me/SKILL.md) | Use when the user wants to capture or update their recurring working preferences in a personal mode skill, rather than a task-specific workflow. |
| [benchmark-checklist](../../benchmark-checklist/SKILL.md) | Vet a perf measurement (limiter, tuning, limits, errors, repeatability, relevance, and whether the work happened) before you report or act on it. Use when you run a benchmark or report a speedup or regression you measured. |
| [blast-radius](../../blast-radius/SKILL.md) | Use to assess what a change can break beyond the diff, including downstream, wire, storage, dependency, and lifecycle contracts. |
| [bro](../../bro/SKILL.md) | Use when asked to restate the previous assistant message in plain human language with less jargon. |
| [correct](../../correct/SKILL.md) | Use when asked to prevent recurring repository mistakes with structural safeguards, types, lint checks, or meaningful regression coverage. |
| [create-formal-verification-skill](../../create-formal-verification-skill/SKILL.md) | Generate a project-local skill that formally verifies the code where a bug costs the most and tests reach the least, in any language, with whichever verification tool fits. Use for $create-formal-verification-skill, \"model-check this race\", \"prove this invariant\", or when concurrency, retries, state machines, parsers, or unsafe code need more than tests. |
| [create-verification-skill](../../create-verification-skill/SKILL.md) | Use when asked to create project-local instructions for launching, driving, observing, and cleaning up real application verification. |
| [figure-it-out](../../figure-it-out/SKILL.md) | Use for an explicitly open-ended complex task or a large migration that needs a custom, auditable workflow when no narrower playbook fits. |
| [how](../../how/SKILL.md) | Use for code walkthroughs, runtime data flow, subsystem behavior, and placement or ownership questions. Use why for historical motivation. |
| [in-your-own-words](../../in-your-own-words/SKILL.md) | Use when asked to restate the user's goals and the problem they are trying to solve. |
| [interrogate](../../interrogate/SKILL.md) | Use for an independent candidate review, adversarial design challenge, or a requested review of code and its affected contracts. |
| [ketchup](../../ketchup/SKILL.md) | Use when the user requests a plain-language catch-up on this chat since their last message, including every decision still waiting on them. |
| [ketchup-video](../../ketchup-video/SKILL.md) | Use when the user requests a short silent slide video to catch up on this chat, with pending decisions written below it. |
| [maintain-formal-verification-skill](../../maintain-formal-verification-skill/SKILL.md) | Bring a project's formal verification back in line with the code after the code changes: find the commits that touched verified code, update the model, harness, or properties to describe the code as it is now, rerun, and say whether each failure is drift in the verification or a bug in the code. Use for $maintain-formal-verification-skill, \"is the model still true to the code\", or after merges and refactors that touched verified code without rechecking it. |
| [maintain-verification-skill](../../maintain-verification-skill/SKILL.md) | Use for a requested audit of an existing project verification skill and feature map against current source and live application behavior. |
| [make-bot-ui](../../make-bot-ui/SKILL.md) | Use when creating a page or dashboard whose controls invoke an agent or bot through an authenticated webhook. |
| [no-comments](../../no-comments/SKILL.md) | Use when asked to remove unnecessary comments or review comment-backed workarounds in a specified set of files or diff. |
| [recall](../../recall/SKILL.md) | Use when asked to reconstruct recent work across available history and live project records before resuming a named topic; use ketchup for this chat's short catch-up. |
| [reflect](../../reflect/SKILL.md) | Use when the user asks to reflect on a substantive session and propose durable improvements to the skills or tools it actually used. |
| [reproduce-and-fix-issues](../../reproduce-and-fix-issues/SKILL.md) | Use when reproducing a triaged issue through real app behavior, verifying an existing fix, or implementing an authorized bounded fix with before-and-after evidence. |
| [setup-benny](../../setup-benny/SKILL.md) | Use when configuring Simplicit's issue triage and reproduction workflows for a repository, tracker, source thread, or scheduled automation. |
| [setup-simplicit](../../setup-simplicit/SKILL.md) | Use when asked to configure Simplicit's available runtime capabilities, delegation preferences, or per-role model budget for this project. |
| [sharpen](../../sharpen/SKILL.md) | Use when asked to deepen a task or rewrite its prompt without expanding its scope. |
| [show-me-your-work](../../show-me-your-work/SKILL.md) | Use when long-running, multi-phase, or unattended work needs a reviewable append-only decision trail with evidence and outcomes. |
| [simplicit](../../simplicit/SKILL.md) | Use for Simplicit development workflows, scoped features, fixes, refactors, or reviews using one implementing lead and selective pstack specialists. |
| [simplicit-help](../../simplicit-help/SKILL.md) | Use to explain Simplicit commands, supported pstack skills, installation dependencies, and Codex capability limits. |
| [simplicit-mode](../../simplicit-mode/SKILL.md) | Compatibility entrypoint for simplicit-mode; routes to the Simplicit workflow. |
| [statechart](../../statechart/SKILL.md) | Draw how any system moves between states, such as a product flow, a protocol, or a service, as a Mermaid statechart from a TLA+ model. Each bug is a numbered path with blue borders to a state that breaks a rule. Use for $statechart, to show a bug as a path through states, or to turn an agreed chart into a TLA+ skeleton. |
| [swarm](../../swarm/SKILL.md) | Use when explicitly asked for parallel coverage or when substantial independent slices justify bounded workers with clear ownership. |
| [tdd](../../tdd/SKILL.md) | Use only when the user explicitly asks for TDD, a failing test, or a regression test, OR when the bug has an obvious cheap local test target. Skip when the test path is unclear, expensive, integration-heavy, or not requested. |
| [teach](../../teach/SKILL.md) | Use when the user asks to understand a change or subsystem through a plain explanation of what it is, how it works, and why it has that shape. |
| [technical-writing](../../technical-writing/SKILL.md) | Use when writing or reviewing developer documentation, RFCs, readmes, PR descriptions, or commit messages; use product copy guidance for UI strings. |
| [triage-issue-reports](../../triage-issue-reports/SKILL.md) | Use when classifying an issue report, tracing likely cause, checking duplicates, or preparing a scoped tracker and source-thread verdict. |
| [typescript-best-practices](../../typescript-best-practices/SKILL.md) | Use when designing, reviewing, or editing TypeScript types and boundaries, including .ts and .tsx code; keep changes within the requested task. |
| [unslop](../../unslop/SKILL.md) | Use when asked to edit writing to remove AI phrasing, filler, vague claims, jargon, and distracting formatting while preserving meaning and tone. |
| [why](../../why/SKILL.md) | Use to investigate design rationale, historical constraints, regressions, or unexplained thresholds using cited history and relevant connected sources. |

## Engineering principles

Each is a separate directly usable skill, loaded only when its decision arises.

| Skill | When it applies |
|---|---|
| [principle-attack-the-premise](../../principle-attack-the-premise/SKILL.md) | Apply when two or more fixes that share one premise have failed the same gate. Write the premise down and test it directly before you write another fix that assumes it. |
| [principle-boundary-discipline](../../principle-boundary-discipline/SKILL.md) | Apply when wiring validation, error handling, or framework adapters. Concentrate guards at system boundaries (CLI, config, network, external APIs); trust internal types and keep business logic in pure functions. |
| [principle-build-the-lever](../../principle-build-the-lever/SKILL.md) | Use when non-trivial edits, migrations, analyses, or checks benefit from a small rerunnable tool that performs or verifies the work. |
| [principle-encode-lessons-in-structure](../../principle-encode-lessons-in-structure/SKILL.md) | Apply when you catch yourself writing the same instruction a second time, or notice a recurring correction. Encode the rule as a lint, metadata flag, runtime check, or script instead of more text. |
| [principle-exhaust-the-design-space](../../principle-exhaust-the-design-space/SKILL.md) | Apply when facing a novel UI interaction or architectural decision with no precedent in the codebase. Build 2-3 competing prototypes and compare side by side before committing. |
| [principle-experience-first](../../principle-experience-first/SKILL.md) | Apply when product, UX, or feature-scope tradeoffs come up. Choose user delight over implementation convenience; ship fewer polished features over more rough ones. |
| [principle-explain-the-number](../../principle-explain-the-number/SKILL.md) | Apply before you trust, report, or act on a number you measured: a speedup, a regression, a throughput, a latency, or an eval result. Find what limits it, and rule out that it measured something other than the work you think. |
| [principle-fix-root-causes](../../principle-fix-root-causes/SKILL.md) | Apply when debugging. Trace each symptom back to the first place the system went wrong and fix it there. A guard is a fix only when the state it handles is legitimate. |
| [principle-foundational-thinking](../../principle-foundational-thinking/SKILL.md) | Apply before writing logic: choosing core types and data structures, sequencing scaffold-vs-feature work, asking what concurrent actors share. Get the data structures right so downstream code becomes obvious. |
| [principle-guard-the-context-window](../../principle-guard-the-context-window/SKILL.md) | Use when large outputs, long files, repeated reads, or task decomposition threaten available context. |
| [principle-laziness-protocol](../../principle-laziness-protocol/SKILL.md) | Apply when refactoring, evaluating diff size, or tempted to add abstractions, layers, or signal threading. Bias toward deletion and the smallest change that solves the problem. |
| [principle-make-operations-idempotent](../../principle-make-operations-idempotent/SKILL.md) | Apply when designing commands, lifecycle steps, or processing loops that run amid crashes, restarts, and retries. Converge to the same end state regardless of partial prior runs. |
| [principle-migrate-callers-then-delete-legacy-apis](../../principle-migrate-callers-then-delete-legacy-apis/SKILL.md) | Apply when introducing a new internal API while old callers still exist. Migrate callers and delete the old API in the same wave instead of preserving compatibility layers. |
| [principle-minimize-reader-load](../../principle-minimize-reader-load/SKILL.md) | Apply when reviewing or shaping code that's hard to trace. Count layers between question and answer, and hidden state in the reader's head; collapse one-caller wrappers and shrink mutable scope. |
| [principle-model-the-domain](../../principle-model-the-domain/SKILL.md) | Apply when writing stateful logic, or when code branches a lot or repeats a shape assumption across files. |
| [principle-never-block-on-the-human](../../principle-never-block-on-the-human/SKILL.md) | Apply when tempted to ask 'should I do X?' on reversible work. |
| [principle-outcome-oriented-execution](../../principle-outcome-oriented-execution/SKILL.md) | Apply during planned rewrites and migrations with explicit phase boundaries. Converge on the target architecture; don't preserve smooth intermediate states with throwaway compatibility code. |
| [principle-prove-it-works](../../principle-prove-it-works/SKILL.md) | Apply after completing a task, before declaring done. Verify against the real artifact (run the feature, read the actual value, inspect the diff), not a proxy, self-report, or 'it compiles.' |
| [principle-redesign-from-first-principles](../../principle-redesign-from-first-principles/SKILL.md) | Apply when integrating a new requirement into an existing design. |
| [principle-separate-before-serializing-shared-state](../../principle-separate-before-serializing-shared-state/SKILL.md) | Apply when concurrent actors might write to the same file, branch, key, or state object. Eliminate the sharing first; serialize structurally only when one shared writer is a real invariant. |
| [principle-sequence-verifiable-units](../../principle-sequence-verifiable-units/SKILL.md) | Apply to multi-step work (sweeps, migrations, runs of similar edits) and to how you stack commits and PRs. Break work into small units that each end in a verifiable state, check each before the next, and order delivery so the sequence proves itself to a reviewer. |
| [principle-subtract-before-you-add](../../principle-subtract-before-you-add/SKILL.md) | Apply when sequencing an addition, refactor, or rewrite. Remove dead code, redundant validators, and stub references first, then build on the simpler base. |
| [principle-test-behavior-not-implementation](../../principle-test-behavior-not-implementation/SKILL.md) | Apply when you write, change, or keep a test. Assert what the code's users can observe, so that the test fails when that behavior breaks and keeps passing when only the internals change. |
| [principle-type-system-discipline](../../principle-type-system-discipline/SKILL.md) | Apply when designing types, reviewing a function signature, or writing code in any statically-typed language. Make illegal states unrepresentable, brand semantic primitives, parse external data at boundaries, exhaust variants, derive from authoritative schemas. |

## Capability limits

- **Statechart and formal verification:** Node.js 22+, Java 11+ and TLC for model checking; optional pinned PNG renderer. Read [statechart runtime](../../statechart/references/runtime.md). Missing dependencies never count as a proof.
- **History:** recall, correct, automate-me and reflect use visible history or explicitly available transcript/search tools. They do not manufacture access to other chats.
- **Video:** ketchup-video requires a local renderer to produce MP4. It returns a written catch-up when rendering is unavailable.
- **Bot UI and issue automation:** make-bot-ui and the three Benny skills use actual connected services. Manual work is available without a scheduler. Installing skills creates no live jobs and grants no message, ticket, merge or deployment authority.
- **Delegation and models:** use the actual host's capabilities. Setup preferences are not host enforcement, and self-review is not independent review.
