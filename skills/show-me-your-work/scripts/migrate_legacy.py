"""Convert a known legacy raw-tab decision log into a new quoted TSV file."""
import argparse
import csv
from pathlib import Path

from log import HEADER, clean


def migrate(source, destination):
    rows = []
    with Path(source).open("r", encoding="utf-8", newline="") as handle:
        if handle.readline() not in (HEADER, HEADER.replace("\n", "\r\n")):
            raise ValueError("legacy log must have the expected complete header")
        for number, line in enumerate(handle, 2):
            if not line.endswith("\n"):
                raise ValueError(f"legacy log has an incomplete record at line {number}")
            record = line[:-1].removesuffix("\r")
            cells = record.split("\t")
            if len(cells) != 6 or "\r" in record:
                raise ValueError(f"legacy log needs six single-line cells at line {number}")
            rows.append([clean(cell) for cell in cells])
    target = Path(destination)
    target.parent.mkdir(parents=True, exist_ok=True)
    with target.open("x", encoding="utf-8", newline="") as handle:
        handle.write(HEADER)
        csv.writer(handle, delimiter="\t", lineterminator="\n").writerows(rows)
    return len(rows)


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("source", type=Path, help="known legacy raw-tab log; retained unchanged")
    parser.add_argument("destination", type=Path, help="new file; existing destinations are refused")
    args = parser.parse_args()
    try:
        count = migrate(args.source, args.destination)
    except (OSError, UnicodeError, ValueError, csv.Error) as exc:
        parser.exit(1, f"migrate legacy log: {exc}\n")
    print(f"Converted {count} decision row(s) into {args.destination}; original retained at {args.source}.")
    print("Use the destination for subsequent log.py appends.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
