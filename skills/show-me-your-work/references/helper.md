# Portable logging helper

Run `python <absolute-skill-path>/scripts/log.py <logfile> <phase> <decision> <why> <evidence> <result>` from any working directory. Python 3.9 or newer is required; the script uses only the standard library. It creates parent folders and a header for a new or empty log, then appends a UTC-stamped row.

Tabs, carriage returns, and line feeds become spaces. Cells beginning with =, +, -, or @ after leading whitespace receive a quote to prevent spreadsheet formula interpretation. TSV quoting preserves literal double quotes. Existing non-empty logs must have the expected header, valid TSV quoting, six columns per row, no tabs or line breaks within cells, and a complete final newline; malformed files are rejected without appending. LF and CRLF record endings are accepted.

## Continuing a legacy log

The original Bash logger and early Python adapter wrote raw tab-separated cells, with double quotes treated literally. Such files may be rejected by the current appender, or have balanced literal quotes interpreted as TSV quoting by readers. For a file known to come from that raw-tab writer, use the [legacy converter](../scripts/migrate_legacy.py) before continuing it:

```sh
python "<absolute-skill-path>/scripts/migrate_legacy.py" "decisions.tsv" "decisions-converted.tsv"
python "<absolute-skill-path>/scripts/log.py" "decisions-converted.tsv" "review" "continued migrated log" "preserved earlier decisions" "decisions.tsv" "ok"
```

The converter reads the complete source before creating output. It requires the expected header, six tab-separated cells per row and complete LF or CRLF endings. It retains timestamps, literal quotes, empty cells and Unicode text, while applying the current formula-prefix protection. The source remains unchanged, and an existing destination is refused, including the source itself. After success, use the converted destination as the canonical log and retain the source as the original record. A repeated conversion to the same destination is refused so later appends cannot be replaced.

Use this command only for a known legacy raw-tab file. Modern quoted TSV can look identical to legacy data; there is no reliable automatic format detection. Converting a modern or mixed-format file as legacy would reinterpret its quote characters. Normal appends retain strict validation and never convert automatically. If a write is interrupted, retain the source and retry conversion to a fresh destination.

Use one writer per log. There is no cross-process or distributed lock. Parallel efforts should own separate log paths and merge only at the reporting boundary. File creation and append are local writes; a read-only task may instead present the rows in its reply. Never use evidence paths that do not resolve or include credentials in cells.
