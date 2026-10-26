---
name: simplicit
description: Use for Simplicit development workflows, scoped features, fixes, refactors, or reviews using one implementing lead and selective pstack specialists.
---

# Simplicit

Own the outcome as one lead who normally implements. Read the [runtime contract](references/runtime.md) once per workflow context. These playbooks adapt pstack to selective delegation, independent review, and evidence-based completion.

## Ground and route

Read applicable repository instructions, the current feature contract, relevant code and tests, and the branch and dirty state. Preserve existing work. Historical examples do not supersede current requirements; resolve consequential contradictions before dependent edits.

Reuse an existing brief. Otherwise state the outcome, acceptance criteria, constraints, and verification approach concisely in the conversation. Investigate facts yourself. Ask for missing product decisions that materially change the result; proceed with authorized routine choices.

Read only the matching playbook:

| Request | Guidance |
|---|---|
| Explanation or investigation | [Investigation](playbooks/investigation.md), read-only. |
| Feature or refactor | [Change](playbooks/change.md). |
| Defect | [Bug fix](playbooks/bug-fix.md). |
| Review only | [Review](playbooks/review.md), read-only. |

A mechanical edit needs only the lead, applicable checks, and self-review. Meaningful features, fixes, and refactors need independent candidate review, including consequential refactors that preserve intended behavior. Ownership, trust boundaries, durable data, concurrency, and consequential transitions need explicit invariants before implementation. Compare short approaches when the design matters; file count alone does not determine risk.

## Load specialists when needed

Read and follow the linked skill for its bounded job. These are executable instructions for the lead or a helper; loading a skill does not itself require another agent. Use the adapted copy here, not the original source snapshot.

| Need | Skill |
|---|---|
| Runtime behavior, placement, ownership | [how](../how/SKILL.md) |
| Historical reasons or constraints | [why](../why/SKILL.md) |
| Consequential design uncertainty | [architect](../architect/SKILL.md) |
| Candidate or design challenge | [interrogate](../interrogate/SKILL.md) |
| Practical failing-before regression | [tdd](../tdd/SKILL.md) |
| Downstream contract risk | [blast-radius](../blast-radius/SKILL.md) |
| Explanation for the user | [teach](../teach/SKILL.md) |
| Recurring mistake worth structural prevention | [correct](../correct/SKILL.md) |
| Competing designs need an experiment | [arena](../arena/SKILL.md) |
| Independent slices justify workers | [swarm](../swarm/SKILL.md) |
| Missing project runtime-verification instructions | [create-verification-skill](../create-verification-skill/SKILL.md) |
| Requested audit of an existing verification skill | [maintain-verification-skill](../maintain-verification-skill/SKILL.md) |

Do not chain the entire catalog. Reuse grounded findings and read only guidance that resolves the current need. [Simplicit help](../simplicit-help/SKILL.md) explains invocation and support boundaries.

## Verify and review

For implementation tasks, run applicable repository checks and verify the final integrated candidate on the relevant surface. Use [engineering guidance](references/engineering.md) when designing boundaries, diagnosing failures, or selecting tests. Report missing required checks as Blocked or Not Run with concrete completion steps.

Reuse evidence only while the relevant source, dirty files, tests, dependencies, configuration, generated artifacts, and runtime assumptions remain valid. A commit SHA alone is insufficient. On resume, compare the handoff with actual state and continue from the first unresolved item.

Obtain one primary independent review for meaningful changes, local or hosted, using the review playbook. Reuse valid completed review. The reviewer must not have authored the candidate. Assess findings and repair supported defects; rerun affected checks and obtain narrow independent review of those repairs. Broaden only when earlier coverage is invalidated or a required gate demands it. Missing required review remains pending.

## Delegate and finish

Delegate a bounded uncertainty, independent slice, or required review using the [simplicit-agent brief](references/simplicit-agent.md). Default to one optional specialist at a time; expand for a concrete independent need within available capacity. Budgets never excuse unresolved defects. Helpers do not recursively delegate by default. Use actual host tools and available models; inherit the lead's model unless a supported alternative is justified.

Reuse a suitable helper for follow-up while preserving review independence. Integrate and check its result. End its work after consuming the final result; interrupt active helpers no longer needed and verify their status. Close or delete only through supported lifecycle tools; disclose when deletion is unavailable.

For changes, report the outcome, observed checks, unresolved gaps, review result, readiness, and the important design decision. Keep implemented, verified, merge-ready, and release-ready distinct. Stop at accepted scope. For read-only requests, deliver the answer or findings without entering implementation gates.

Honor existing authorization for commits, pushes, and PRs. Keep one active Draft PR as the default working queue unless the user or repository specifies another convention. Merge or release only with explicit user authorization, including authorization already given for that action. This mode grants no additional permissions and does not authorize messages to other people.
