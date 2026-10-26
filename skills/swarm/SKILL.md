---
name: swarm
description: Use when explicitly asked for parallel coverage or when substantial independent slices justify bounded workers with clear ownership.
---

# Swarm

Adapted from pstack. Read the [runtime contract](../simplicit/references/runtime.md). Parallelism is optional; ownership and integration are mandatory.

1. Define the done condition, candidate state, required coverage, output, and integration owner. Partition independent questions or files. Do not duplicate full implementations unless a comparison experiment is explicitly useful; use [arena](../arena/SKILL.md) for that.
2. Default to one optional specialist at a time. Expand only for demonstrably independent slices and available capacity. Assign each worker read-only scope or exclusive writes in a separate path/worktree. A shared checkout does not make conflicting edits safe. Keep live app driving under one owner unless instances are actually isolated.
3. Use the [worker brief](../simplicit/references/simplicit-agent.md): goal, paths, constraints, precise candidate inputs including relevant dirty/runtime state, checks, deliverable, and stopping condition. For measurement, include method, sample definition/count, and order. Inherit the current model unless a supported alternative is justified.
4. Dispatch with actual collaboration tools. If unavailable, perform separable slices sequentially in the lead and report that no parallel execution occurred. If the user specifically requires independent workers, report that unmet capability instead of implying equivalent coverage.
5. Consume every result. Confirm its artifact and evidence refer to the assigned inputs. Follow up with a suitable existing worker for missing evidence; a missing required slice remains a gap. Integrate outputs and run checks on the final combined candidate. Worker PASS reports alone do not prove integration.
6. Stop completed work; interrupt obsolete running workers and inspect status. Use supported closure tools and disclose unavailable deletion. Do not stop necessary work merely because a nominal budget was spent while a known defect remains.

Return one concise report with slices, actual outcomes, integration verification, and gaps. No cloud-agent infrastructure, fixed model roster, or background service is required.
