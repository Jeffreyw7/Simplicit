---
name: show-me-your-work
description: "Use when long-running, multi-phase, or unattended work needs a reviewable append-only decision trail with evidence and outcomes."
---

Read and follow the [runtime contract](../simplicit/references/runtime.md) before using this skill. It governs scope, tools, authorization, verification, and review.

# Show me your work

Keep one canonical log.

## The format

A single TSV file, one row per decision. Cells stay single-line. Evidence is a pointer, not prose.

Copy the [header template](references/decision-log-template.tsv) (the header row) to start a clean log. Columns:

- **ts.** ISO8601 timestamp.
- **phase.** The phase or workstream.
- **decision.** What was chosen or done, one line.
- **why.** The reason in plain words. If a principle drove it, say it plainly, not as a jargon tag.
- **evidence.** A link or path that proves it: commit SHA, PR number, `file:line`, or an artifact, trace, or screenshot path. Never a paragraph.
- **result.** The outcome or predicate state: `tests green`, `reverted`, `pixel-diff 0`, `INCONCLUSIVE`, `open`.

An example, plain-spoken so a reviewer reads it at a glance.

```
ts	phase	decision	why	evidence	result
2026-05-24T09:02:00Z	frame	counted the work first, about 100 components and roughly 75 hours	wanted to know the size before starting a long run	commit 3a9f1c2	found 5 things to sort out before starting
2026-05-24T09:40:00Z	harness	took screenshots of the old version before changing anything	so we can compare old against new and catch any visual change	scripts/snapshot.sh, baseline/	saved 120 reference screenshots
2026-05-24T11:15:00Z	widget	moved the widget styles over without changing how it looks	keep the change small and the result identical	commit 7c21e0a, pixel-diff 0	looks identical, tests pass
2026-05-24T12:30:00Z	widget	threw out a helper's work because its screenshots were blank	checked the real files instead of trusting its summary	worktree reset	reverted, tightened the instructions for next time
```

## Logging a row

Write each entry the way you'd tell a teammate what you did. Plain words, concrete actions, no AI speak or abstract jargon (the **unslop** skill applies to log text too).

Use `python <installed-skill>/scripts/log.py <logfile> <phase> <decision> <why> <evidence> <result>` with the installed skill's actual absolute path. Read [helper behavior](references/helper.md) before first use. It stamps `ts`, writes the header on first use, replaces tabs and line breaks with spaces, and prefixes cells beginning with `=`, `+`, `-`, or `@` after leading whitespace with a single quote. It also applies TSV quoting to preserve literal double quotes. Prefer this helper to manual appends. Manual writers must apply the same sanitization and formula guards, double every literal double quote, and enclose any cell containing quotes in double quotes.

Log decision points and checkpoints, not every action: a fork chosen, a unit completed with its verification result, a pivot or revert with its trigger, a blocker surfaced, a gate fixed. For loop runs, one row per iteration. Skip the trivial and self-evident.

A run is one agent conversation, including its later turns and any summary of it. A pickup, a replacement agent, or a new chat starts a new run. When a run adds to a log that already has rows, its first row has phase `start`, and so does its first row after another run's `start` row. So a run that comes back to a log in a later turn first reads the log's last rows to see whether another run wrote since. A `start` row names the `ts` range of the rows before it that this run did not write, and its evidence names this run, such as its agent id. Use phase `start` for nothing else.

## Where it lives

By default the log is a working artifact, not committed. Keep it at `decisions.tsv` in the work dir, or `.audit/<task-slug>.tsv` when several efforts run at once, and leave it out of git.

Include it in the reviewable changes when a reviewer needs the trail to trust the result, and commit only within existing authorization. Do not change ignore rules or stage unrelated files without scope.

## Rules

- Append-only. A wrong call gets a new row that supersedes it. Never edit or delete history.
- Prefer evidence produced by committed scripts over hand-made one-offs (the **encode-lessons-in-structure** principle skill).

## Audit the log against the transcript

At the end of the run, before handing back, check the log told the truth. Use the visible conversation or an explicitly available active transcript. Do not infer transcript paths or search other workspaces. If only a digest is available, identify what it cannot prove. Walk this run's rows against what actually happened. Each stretch of them begins at one of this run's `start` rows, or at the first row if this run created the log, and ends at the next `start` row of another run:

- Check that every row maps to a real decision or action.
- Check that each row's evidence resolves and shows what the row claims.
- A fork, pivot, or abandoned approach that shaped the work but isn't logged is a gap. Add it.

Correct the log, not the story. The audit never edits or removes a row, even an invented one. When a row records neither a real decision nor a real action, or its claim or evidence is wrong, add a row that supersedes it with what actually happened and a pointer that resolves. This audit does not check rows outside this run's stretches. If this run's own work shows one of them is wrong, supersede it like any wrong call.

## Independent review of the trail

When authorized independent review is available, give a reviewer the trail and the available run evidence. Prefer a different perspective; a different model family is useful only if actually available. Do not change models or spawn helpers outside authorization. Ask for weak evidence, missing verification, risky choices, scope creep, and unlogged pivots. Self-review is not independent review.

Report attention items pointing to specific rows or moments, identify who actually reviewed, and state any unavailable independence or model diversity. No flags is valid only after the review ran; absent review is pending.

## Reviewing the trail

Read top to bottom, follow the evidence pointers, and spot-check. GitHub renders a committed TSV as a table. On Windows, `Import-Csv -Delimiter "`t" -LiteralPath decisions.tsv | Format-Table` renders it in PowerShell. On hosts with `column`, `column -s$'\t' -t decisions.tsv` renders it in a terminal.

## Composing this skill

Other skills route their audit trail here instead of inventing one. Reference it by name and let it own the format. Don't restate the columns.
