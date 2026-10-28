# Remaining statechart review fixes

> Implement the user-authorized four fixes with regression evidence and fresh independent review.

Base: bba13b8. Keep the original pstack tree, upstream pin, skill entrypoints, CLI options and model-output schemas unchanged.

- [x] Reproduce the four findings against current code: unrelated TLC-format deletion, keyword-valued config operands, compound publication/restore/cleanup failures, and unprintable mapping exceptions.
- [x] Preserve every replaced output directory at a unique reported sibling path. Extension/name checks cannot prove provenance. Preserve normal regeneration and overlap handling; never delete an earlier displaced directory when another output appears. Document manual backup cleanup.
- [x] Parse TLC configuration operands/constant values before recognizing section keywords, verified against the pinned TLC grammar and real model checks.
- [x] Keep publication/restore errors and old-output paths even if staged cleanup fails; operational failures retain exit 2.
- [x] Format arbitrary thrown mapping values through a guarded fallback; retain diagnostics and prior outputs.
- [x] Run full Python/validators and Node/TLC suites, targeted independent probes and cross-platform Python checks. Review the combined implementation, repair material findings, summarize behavior and limits, and commit the major change locally. The completion report records intermittent Windows rename failures and successful isolated reruns; it does not claim a clean single full-suite run.

The preservation correction deliberately adds recoverable output backups rather than a new ownership manifest. Existing output files may have been hand-edited even when their names match generated artifacts. Backups are retained after success and named in normal output; users remove them after review. Source backup behavior stays intact. Upstream adoption remains report-only.
