# Portable logging helper

Run `python <absolute-skill-path>/scripts/log.py <logfile> <phase> <decision> <why> <evidence> <result>` from any working directory. Python 3.9 or newer is required; the script uses only the standard library. It creates parent folders and a header for a new or empty log, then appends a UTC-stamped row.

Tabs, carriage returns, and line feeds become spaces. Cells beginning with =, +, -, or @ after leading whitespace receive a quote to prevent spreadsheet formula interpretation. Existing non-empty logs must have the expected header and complete final newline; malformed files are rejected without appending.

Use one writer per log. There is no cross-process or distributed lock. Parallel efforts should own separate log paths and merge only at the reporting boundary. File creation and append are local writes; a read-only task may instead present the rows in its reply. Never use evidence paths that do not resolve or include credentials in cells.
