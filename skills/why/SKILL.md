---
name: why
description: Use to investigate design rationale, historical constraints, regressions, or unexplained thresholds using cited history and relevant connected sources.
---

# Why

Adapted from pstack. Read the [runtime contract](../simplicit/references/runtime.md) and [epistemics](references/epistemics.md). Investigate why code took its shape. Present behavior alone does not establish author intent. This is read-only.

1. Identify the target and the rationale question. Reuse a prior code anchor if current; otherwise collect relevant paths, symbols, tests, nearby comments, and history. Useful local operations include `git blame`, `git log --follow -p -- <file>`, and reading substantive commit messages. Do not assume a local CLI is authenticated.
2. Follow linked PRs, issues, design notes, and incidents using available connected tools. Start with the closest evidence. Read the actual discussion, not only a title or search snippet. Discover relevant tools through the host's tool inventory instead of assuming service names or schemas.
3. Expand only when a relevant unanswered question warrants it. Use the [source guide](references/source-playbook.md) to select sources. There is no mandatory seven-category sweep. Search independent sources in parallel when useful; delegate only a bounded question using the [investigator brief](references/investigator-prompt.md).
4. Synthesize in the lead. Separate direct statements, supported conclusions, inferences, hypotheses, and unknowns. Preserve contradictions and temporal context; the most recent commit is not necessarily the original reason. Do not claim an unsearched source returned nothing.
5. Return the question, cited findings, reasonable inferences, important unknowns, and sources actually consulted with gaps. Scale the format to the answer. If the question precedes a change, finish with Preserve / Change / Avoid / Risk constraints grounded in the evidence.

Do not query unrelated private data merely because a connector exists. Read-only investigation does not authorize contacting authors or posting findings. Retain confidence qualifiers when passing findings to [teach](../teach/SKILL.md).
