# Worker model and reasoning policy

Apply this policy before dispatching an ordinary worker or generic specialist, including read-only investigation. Classify the worker's bounded assignment, not the entire project. This selects execution settings; it does not authorize delegation, increase concurrency, or replace verification and independent review.

## Choose a tier

| Complexity | Observable task characteristics | Preferred model | Reasoning effort | First fallback |
|---|---|---|---|---|
| Routine | Explicit steps, known answer shape, narrow scope, cheap deterministic checks, and low consequence of error. Examples: exact renames, formatting, extracting facts from identified files. | `gpt-6-luna` | `low` | `gpt-6.1-sol` / `low` |
| Standard | Bounded implementation or investigation with established contracts, some judgment, and a clear verification path. Examples: a normal feature, localized bug fix, or regression test. | `gpt-6.1-sol` | `medium` | `gpt-6-astra` / `medium` |
| Complex | Uncertain design or root cause, coupled subsystems, concurrency, security boundaries, durable-data risk, or difficult verification. Examples: an intermittent retry race, migration design, or authorization analysis. | `gpt-6-astra` | `high` | `gpt-6.1-sol` / `high` |

These are workflow defaults, not universal model availability or benchmark claims. Check the current host's advertised model names and supported effort values before using any pair. Project preferences may map these tiers to other verified available pairs.

Use the highest tier whose characteristics apply. A small security-sensitive edit can be complex; a long mechanical edit can be routine. Routine requires all its listed conditions. Use standard when ordinary uncertainty remains; unresolved consequential risk requires complex. Time pressure, file count, or a worker's confident summary cannot lower the tier.

## Respect explicit choices and host capabilities

1. Honor explicit user requirements and applicable project constraints before these defaults. Honor a selected custom role's configured model and effort, including documented inheritance. The configured `critic` remains `gpt-6.1-sol` / `high`; named Comment Sicko retains its host inheritance. Generic fallback reviewers use this policy and the applicable reviewer brief. If a required pair conflicts with a role's fixed settings, do not claim that role ran with different settings; use an authorized compatible route or report the requirement unmet.
2. Try the preferred model first. Use its target effort if supported; otherwise use that model's nearest higher supported effort within explicit limits. Only if the model is unavailable or has no permitted effort at or above the target, try the first fallback model with the same effort rule. Record every adjustment. For example, standard work uses `gpt-6.1-sol` / `high` when Sol supports only high, before trying Astra / medium. A required user or role pin is not eligible for automatic adjustment or fallback: report its failure once and keep that specific requirement unmet.
3. If neither listed model offers a permitted effort, choose another advertised model with a documented capability suitable for the tier, applying the same effort rule. If that suitability cannot be established, use host inheritance and disclose that the tier's model selection is unverified. If the inherited model is known to be unsuitable for complex work, keep consequential implementation pending and continue only useful bounded investigation until a suitable execution route is available. Never guess model slugs or append effort/speed names to them.
4. Set both model and reasoning effort explicitly through supported dispatch fields for ordinary workers whenever possible. Use a compatible context mode if the host requires it for overrides, passing the compact worker brief. Putting a choice only in the prompt does not configure execution. For fixed custom roles, use the supported role selector without conflicting overrides.
5. If only one setting can be controlled, set the supported one and record the other as inherited or unverified. If controls are absent, use host inheritance and report which selections could not be applied. When no permitted effort meets the target, disclose the limitation rather than silently lowering it. Host limits and user budget constraints always win; an impossible required pair remains unmet.

Before dispatch, record in the [worker brief](simplicit-agent.md): complexity and a short task-based reason; requested model and effort; role or user overrides; and any fallback or unsupported setting. Record observed effective settings from host metadata when available. Otherwise label them requested, not confirmed. Do not ask workers to reveal private reasoning; only the effort setting and concise selection rationale are needed.

For example, a normal feature under an existing API contract routes to standard: `gpt-6.1-sol`, `medium`. If investigation reveals a cross-service data-loss race, reclassify the unresolved assignment as complex before further dispatch. The subsequent independent `critic` still uses its configured `gpt-6.1-sol`, `high` settings.

## Reassess on follow-up

Reuse a suitable helper when its settings still fit. If new evidence raises complexity, the worker reports the unresolved issue and the lead reclassifies it. Change settings only through a supported host mechanism; a follow-up prompt cannot be assumed to change model or effort. When replacement is needed, stop the prior writer and verify ownership transfer before dispatching the replacement with current artifacts and evidence.

Repeated reasoning failures after a focused correction justify reassessment and, if appropriate, a higher tier. Missing access, broken tools, and transient infrastructure errors require diagnosis, not automatic model escalation. Keep successful evidence that remains valid. Increased effort does not waive scope, budget, review independence, or acceptance checks.
