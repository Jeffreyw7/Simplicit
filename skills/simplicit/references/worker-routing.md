# Worker role routing policy

Apply this policy before dispatching an ordinary worker or generic specialist, including read-only investigation. Classify the worker's bounded assignment, not the entire project. This selects a role; it does not authorize delegation, increase concurrency, or replace verification and independent review. Model and reasoning settings belong in the role's `.codex/agents/<role>.toml` profile, not in this skill.

## Choose a tier

| Complexity | Observable task characteristics | Role |
|---|---|---|
| Routine | Explicit steps, known answer shape, narrow scope, cheap deterministic checks, and low consequence of error. Examples: exact renames, formatting, extracting facts from identified files. | `coder-light` |
| Standard | Bounded implementation or investigation with established contracts, some judgment, and a clear verification path. Examples: a normal feature, localized bug fix, or regression test. | `coder-medium` |
| Complex | Uncertain design or root cause, coupled subsystems, concurrency, security boundaries, durable-data risk, or difficult verification. Examples: an intermittent retry race, migration design, or authorization analysis. | `coder-hard` |

These are workflow defaults, not universal role availability or benchmark claims. The shipped profiles live in the source package's `.codex/agents/`. Plugin installation and the skill installer do not register those roles in another project. Adopt the profiles into that project's `.codex/agents/`, preserving existing customizations, and start a fresh session to check discovery. Use the host's actual role inventory; a file's presence alone does not establish that it is loaded. Project preferences may select other verified roles.

Use the highest tier whose characteristics apply. A small security-sensitive edit can be complex; a long mechanical edit can be routine. Routine requires all its listed conditions. Use standard when ordinary uncertainty remains; unresolved consequential risk requires complex. Time pressure, file count, or a worker's confident summary cannot lower the tier.

## Respect explicit choices and host capabilities

1. Honor explicit user requirements and applicable project constraints before these defaults. Honor every selected role's configured model and effort, including documented inheritance. The `critic` and Comment Sicko keep their own profiles; coder routing does not replace their reviewer settings or instructions. Generic fallback reviewers use the tier's settings with the applicable reviewer brief and a read-only scope. If a required pair conflicts with a role's fixed settings, use an authorized compatible route or report the requirement unmet.
2. When the selected role is registered, dispatch through the host's role selector without model or effort overrides. Pass the verified absolute [worker brief](simplicit-agent.md) path and the bounded assignment. Record the settings from host role metadata or the verified active profile when available; otherwise mark them unverified. Do not claim that the source package's profile is necessarily the active project profile.
3. If the role is unavailable but a generic fallback is permitted, read its profile from the selected project's `.codex/agents/` or a verified source package explicitly supplied for this task. Prefer the project's adopted profile. Do not guess plugin-cache paths or assume a skills-only installation contains profiles. Apply that profile's exact model and effort through supported dispatch fields, with a compatible context mode, its worker instructions, and the compact brief. For an independent reviewer, use the reviewer instructions instead of the coder instructions. Disclose that a generic helper ran, not the named role. Putting settings only in a prompt does not configure execution.
4. If the configured model or effort cannot run, report the failure once and leave that route unmet. Do not silently raise/lower its effort or substitute another model. A different pair requires an explicit user or project override and must not be reported as execution of the original fixed role.
5. If no profile can be read or controls are partial/absent, disclose which selections are unverified or unapplied. A permitted generic helper may inherit only when no explicit role/model/effort requirement would be bypassed. An impossible required pair remains unmet. If inherited capability is known to be unsuitable for complex work, keep consequential implementation pending and continue only useful bounded investigation. Host limits and user budgets always win.

Before dispatch, record in the [worker brief](simplicit-agent.md): complexity and a short task-based reason; selected role and verified profile path or host metadata; requested model and effort; user/project overrides; and any fallback or unsupported setting. Record observed effective settings from host metadata when available. Otherwise label them requested, not confirmed. Do not ask workers to reveal private reasoning; only the effort setting and concise selection rationale are needed.

For example, a normal feature under an existing API contract routes to `coder-medium`. If investigation reveals a cross-service data-loss race, reclassify the unresolved assignment for `coder-hard` before further dispatch. The subsequent independent `critic` still uses its own profile.

## Reassess on follow-up

Reuse a suitable helper when its settings still fit. If new evidence raises complexity, the worker reports the unresolved issue and the lead reclassifies it. Change settings only through a supported host mechanism; a follow-up prompt cannot be assumed to change model or effort. When replacement is needed, stop the prior writer and verify ownership transfer before dispatching the replacement with current artifacts and evidence.

Repeated reasoning failures after a focused correction justify reassessment and, if appropriate, a higher tier. Missing access, broken tools, and transient infrastructure errors require diagnosis, not automatic model escalation. Keep successful evidence that remains valid. Increased effort does not waive scope, budget, review independence, or acceptance checks.
