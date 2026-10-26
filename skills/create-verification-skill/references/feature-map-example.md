# Feature-map shape

Adapted from pstack's feature-map examples. These are placeholders for authoring, not executable application commands. Replace them with observed repository details.

The generated `features/README.md` indexes one file per user-facing feature. Each feature file records:

```text
# Feature name

## Sub-features
User-visible operations covered and their acceptance criteria.

## How to get to it (user POV)
Entry points, prerequisites, test data, and expected starting state.

## Driving it with <actual harness>
Exact action sequence and the resulting visible state and side effects.
Evidence location and what proves success.

## Gotchas
Known limitations, auth/OS/data dependencies, failure recovery, and cleanup.
```

For a create-item journey, cover the entry action, valid input, submission, visible confirmation, and persistence after reloading where applicable. For search, cover a known matching query, a non-matching query, and clearing the filter. Substitute the application's actual behavior and commands; do not invent it from these examples.
