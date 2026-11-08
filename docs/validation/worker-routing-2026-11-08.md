# Worker routing policy validation — November 8, 2026

Initial scope: the uncommitted complexity-based worker policy and its links from the
runtime contract, worker brief, main workflow, swarm, setup, reflection, issue
setup, and README. This is instruction validation, not proof that each selected
model ran or that every future dispatch will follow the policy.

## Behavioral application

A fresh read-only baseline agent applied the previous instructions to five
assignments with a hypothetical Astra/high lead. It inherited Astra/high for
both a mechanical rename and a normal feature, identifying no prescribed
complexity or effort mapping. It preserved the fixed Sol/high critic.

A separate fresh agent applied the revised instructions to eleven scenarios:
routine rename, standard feature, complex data-loss race, fixed critic, absent
controls, unavailable Astra, a one-line authorization change under time
pressure, generic reviewer fallback, newly discovered corruption, unsupported
medium effort, and named Comment Sicko inheritance.

The first pass found an ambiguity between increasing effort on the preferred
model and switching models. The policy now normalizes effort on the preferred
model first. A focused follow-up passed fallback, reviewer, effort, explicit-pin,
and known-unsuitable inheritance cases. No actual model dispatch was performed
within these hypothetical scenarios. Independent critic review and a narrow
repair review returned no actionable findings.

## Repository checks

- `git diff --check`: passed.
- `scripts/validate_skills.py`: passed for all 62 skills, local links, and licenses.
- `scripts/validate_agents.py` and `scripts/check_package.py`: failed on the
  pre-existing empty, untracked `coder-light.toml` and `coder-hard.toml` profiles.
  Both files were preserved unchanged.
- Python unittest discovery: 109 tests, 3 failures, 1 error, 6 skips. Two failures
  were `test_complete_collection_outside_checkout_without_archive` and
  `test_complete_adoption_preserves_unrelated_destination_files`, caused by the
  same empty profiles. `test_linked_directory_is_rejected` failed because Windows
  denied junction creation. `test_markdown_report_explains_scope_and_lists_resource_paths`
  errored during temporary Git-directory cleanup because another process held
  the directory open.

Checks used the installed Python 3.13.15 executable directly because the
WindowsApps alias could not start. The full suite was rerun with a workspace
temporary directory after the default sandbox temporary directory denied writes.
The suite is not fully green. No plugin cache, installed copy, role profile, or
global configuration was changed. At this stage, host/model execution remained unverified.

## Separate branch and live worker trials

The follow-up created local branch `feat/worker-model-routing` from
`f75e86de470f56a20dd2763916fe3e9e583839c5`. A separate test controller read the
policy and selected and dispatched three bounded read-only workers sequentially.
Each used the default role with an isolated context (`fork_turns: none`).

| Assignment | Requested model / effort | Observed result |
|---|---|---|
| Exact extraction of the policy table | `gpt-6-luna` / `low` | Host accepted the dispatch; worker completed with the correct three rows. |
| Trace routing callers and conflicting defaults | `gpt-6.1-sol` / `medium` | Host accepted the dispatch; worker identified an inherited-model default in the issue-workflow example. |
| Analyze pin, fallback, and partial-control boundaries | `gpt-6-astra` / `high` | Host accepted the dispatch; worker completed with no supported pin-bypass defect. |

The caller-tracing finding was repaired in
`skills/setup-benny/references/configuration.example.yaml`: the example now has
`models: {}` and explains that an empty map uses complexity routing. Explicit
project overrides remain possible. The same independent worker's narrow
follow-up confirmed the repair. All children completed; no live helper work
remained. Tool acceptance and completed responses establish these requested
routes, not independent proof of backend model identity. No model-availability
failure occurred; fallback behavior was assessed through scenarios and static
analysis rather than an induced live outage.

## Clean candidate checks

A disposable local clone of the branch received only the policy changes and
this report. The two unrelated empty coder profiles were excluded from that
snapshot and preserved unchanged in the user's checkout. Test subprocesses ran
outside the restrictive sandbox with a dedicated temporary directory. The pinned
TLC JAR's SHA-256 was verified before use.

| Check | Result |
|---|---|
| Skill validation | Passed: 62 skills, local links, and licenses. |
| Agent-profile validation | Passed: the two shipped profiles. |
| Package validation | Passed; repeated after the example-config correction. |
| Python unittest discovery | Passed: 109 tests, 5 skips, no failures or errors. |
| Node/Statechart with pinned TLC | Passed: 180 tests, no skips, failures, or cancellations. |
| Installation after the example correction | All 62 skills installed into a disposable project; installed validation passed and the corrected example matched source bytes. |
| Git whitespace check | Passed. |

The Python suite ran before the example-only correction. The corrected example
was then checked by the independent worker and the package/installation checks;
the unchanged Node/Statechart code completed its full suite. The Node suite took
about 575 seconds. After every test command exited successfully, the temporary
wrapper failed to print Unicode checkmarks through Windows cp1252. The completed
logs supplied the results above; the wrapper's output encoding was corrected
without rerunning the successful suites.

Sanitized logs, the disposable candidate and installation, and the local runner
are retained under ignored `.scratch/worker-routing-20261108/`. These follow-up
results supersede the initial environment/profile failures for the clean branch
candidate. The source checkout still contains the user's empty untracked profiles;
running profile/package validation there continues to include those files.
