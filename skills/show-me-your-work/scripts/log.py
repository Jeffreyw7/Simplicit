"""Append a sanitized UTC decision row to a single-writer TSV log."""
import argparse
import csv
import sys
from datetime import datetime, timezone
from pathlib import Path

HEADER = "ts\tphase\tdecision\twhy\tevidence\tresult\n"

def clean(value):
    value = value.replace("\t", " ").replace("\r", " ").replace("\n", " ")
    if value.lstrip().startswith(("=", "+", "-", "@")):
        value = "'" + value
    return value

def append(logfile, cells):
    path = Path(logfile)
    if path.exists() and path.stat().st_size:
        with path.open("r", encoding="utf-8", newline="") as handle:
            if handle.readline().rstrip("\r\n") != HEADER.rstrip("\n"):
                raise ValueError("existing log has an unexpected header")
        with path.open("rb") as handle:
            handle.seek(-1, 2)
            if handle.read(1) != b"\n":
                raise ValueError("existing log has an incomplete final row")
    path.parent.mkdir(parents=True, exist_ok=True)
    needs_header = not path.exists() or path.stat().st_size == 0
    stamp = datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ")
    with path.open("a", encoding="utf-8", newline="") as handle:
        if needs_header:
            handle.write(HEADER)
        writer = csv.writer(handle, delimiter="\t", lineterminator="\n")
        writer.writerow([stamp] + [clean(cell) for cell in cells])

def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("logfile")
    for name in ("phase", "decision", "why", "evidence", "result"):
        parser.add_argument(name)
    raw = sys.argv[1:]
    if raw in (["-h"], ["--help"]):
        parser.print_help()
        return 0
    if raw[:1] == ["--"]:
        raw = raw[1:]
    # All six values are data, including cells beginning with a minus sign.
    args = parser.parse_args(["--", *raw])
    try:
        append(args.logfile, [args.phase, args.decision, args.why, args.evidence, args.result])
    except (OSError, UnicodeError, ValueError) as exc:
        parser.exit(1, f"log: {exc}\n")
    return 0

if __name__ == "__main__":
    raise SystemExit(main())
