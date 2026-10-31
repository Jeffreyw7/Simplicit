---
name: typescript-best-practices
description: "Use when designing, reviewing, or editing TypeScript types and boundaries, including .ts and .tsx code; keep changes within the requested task."
---

Read and follow the [runtime contract](../simplicit/references/runtime.md) before using this skill. It governs scope, tools, authorization, verification, and review.

# TypeScript best practices

Read [Type system discipline](../principle-type-system-discipline/SKILL.md) for the underlying modeling choices.

| Rule | Summary |
|------|---------|
| Discriminated unions | Model variants with a `kind` literal discriminant so impossible states can't be represented. Avoid bags of optionals when combinations represent distinct states. |
| Branded types | Brand primitives with `& { readonly __brand: "X" }` so they can't be mixed up. Validate once at the boundary. A brand comes from a verifying type guard (`input is AgentId`), never from `as`. |
| Constructive modeling | Use shapes that enforce structural constraints: `[T, ...T[]]` for non-empty and `[T, T][]` for pairs. A range represented by `start` plus `duration` still needs boundary validation that both are finite and duration is nonnegative; TypeScript's `number` does not enforce those value constraints. |
| Simplest total type | Keep `T[]` while every operation on it stays total. Strengthen to `NonEmpty<T>` only where the loose type forces `!`, a cast, or a "should never happen" throw. |
| `unknown` over `any` | External data is `unknown`. |
| Schemas before guards | Before hand-writing a property-by-property type guard, use the repository's runtime schema library and infer the type from the schema, such as `z.infer`. |
| No `as` casts | Avoid assertions that hide unvalidated data or a modeling gap. Keep a justified assertion narrow, backed by an invariant or validation. `as const` is not an unsafe data cast. |
| Narrowing hierarchy | Discriminant switch > `in` operator > `typeof`/`instanceof` > user-defined type guard > `as`. |
| Type guards | Must verify the claim. A lying guard is worse than `as` because the bug hides behind a name that says it's safe. Name them `isX` or `hasX`. |
| Exhaustiveness | Inline `const _exhaustive: never = x;` in default arms so the compiler errors when a new variant is added. |
| `satisfies` over `as` | Validates the value without widening literal types. |
| Boundary validation | Parse where data crosses in, into a named domain type. `Record<string, unknown>` (however spelled) stops at that parse. Trust types inside. See the **boundary-discipline** principle skill. |
| Schema-derived types | Reach for `Pick`/`Omit`/`Parameters`/`ReturnType`/`Awaited`/`typeof` before declaring a new interface. |
| Object args | Prefer named object arguments for multiple easily confused parameters. Skip on hot paths (per-frame render, tokenizers, parsers). |
| Real tests | Don't mock what you can run. Prefer the framework's real test primitives with leak/disposable checks, and verify UI in a running build. Mock only what you can't run locally. |
| Structured telemetry | Prefer structured logger diagnostics with enough context to debug from an id. Respect the project logger and diagnostics conventions. |

Read [patterns and examples](references/patterns.md) for the relevant rule. Follow existing project conventions and run the project's type checker for changed contracts.
