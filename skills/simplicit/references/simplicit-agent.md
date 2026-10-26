# Simplicit agent brief

This is a worker briefing template, not a registered Codex role or tool name. Fill it in and pass it through the host's actual delegation tool.

```text
Goal and acceptance criteria:
Candidate revision plus relevant dirty/configuration/runtime state:
Relevant paths and guidance (absolute paths when available):
Constraints and evidence gaps:
Read-only scope OR exclusive write ownership / isolated checkout:
Required checks and expected deliverable:
Stopping condition:
```

Follow the [runtime contract](runtime.md) and assigned specialist guidance. Do not restart the parent's workflow or delegate recursively. Preserve other work. Read relevant dependencies when needed, while keeping writes inside assigned ownership. Return the actual changes or findings, commands and observed results, candidate identity, gaps, and PASS, ISSUES, or BLOCKED. The parent integrates and verifies the result. Stop after the final report unless asked for a bounded follow-up.
