import csv
import json
import shutil
import runpy
import subprocess
import sys
import tempfile
import unittest
from pathlib import Path

SCRIPT = Path(__file__).resolve().parents[1] / "skills/show-me-your-work/scripts/log.py"
POWERSHELL = shutil.which("pwsh") or shutil.which("powershell")
COLUMNS = ["ts", "phase", "decision", "why", "evidence", "result"]
QUOTE_CASES = [
    ("unmatched", ['"review', "keep", "reason", "file:1", "ok"],
     ['"review', "keep", "reason", "file:1", "ok"]),
    ("balanced", ['"review"', 'keep "it"', '""', 'file:"a"', '"ok"'],
     ['"review"', 'keep "it"', '""', 'file:"a"', '"ok"']),
    ("formula-like", ['"=1+1"', '=SUM("A1")', " \t+1", "-1", "@x"],
     ['"=1+1"', "'=SUM(\"A1\")", "'  +1", "'-1", "'@x"]),
]
MIGRATOR = SCRIPT.with_name("migrate_legacy.py")


class DecisionLogTests(unittest.TestCase):
    def setUp(self):
        self.temp = tempfile.TemporaryDirectory()
        self.addCleanup(self.temp.cleanup)
        self.log = Path(self.temp.name) / "decisions.tsv"

    def run_log(self, cells, logfile=None):
        return subprocess.run([sys.executable, "-B", str(SCRIPT), str(logfile or self.log), *cells],
                              capture_output=True, text=True, encoding="utf-8")

    def run_migration(self, destination):
        return subprocess.run([sys.executable, "-B", str(MIGRATOR), str(self.log), str(destination)],
                              capture_output=True, text=True, encoding="utf-8")

    def test_legacy_quotes_convert_and_remain_appendable_with_source_preserved(self):
        for ending in ("\n", "\r\n"):
            with self.subTest(ending=repr(ending)):
                before = ("ts\tphase\tdecision\twhy\tevidence\tresult" + ending +
                          '2026-11-03T10:00:00Z\t"open\t"closed"junk\t"balanced"\tproof "quoted"\tcafé ☃' + ending).encode("utf-8")
                self.log.write_bytes(before)
                failed_append = self.run_log(["review", "keep", "reason", "artifact", "ok"])
                self.assertNotEqual(0, failed_append.returncode)
                self.assertEqual(before, self.log.read_bytes())
                converted = Path(self.temp.name) / ("lf.tsv" if ending == "\n" else "crlf.tsv")

                result = self.run_migration(converted)

                self.assertEqual(0, result.returncode, result.stderr)
                self.assertEqual(before, self.log.read_bytes())
                later = ["review", "keep", "reason", "artifact", "ok"]
                result = self.run_log(later, converted)
                self.assertEqual(0, result.returncode, result.stderr)
                with converted.open(encoding="utf-8", newline="") as handle:
                    rows = list(csv.reader(handle, delimiter="\t", strict=True))
                self.assertEqual(["ts", "phase", "decision", "why", "evidence", "result"], rows[0])
                self.assertEqual(['2026-11-03T10:00:00Z', '"open', '"closed"junk', '"balanced"', 'proof "quoted"', 'café ☃'], rows[1])
                self.assertEqual(later, rows[2][1:])
                self.assertEqual(3, len(rows))

    def test_legacy_balanced_quotes_are_literal_and_empty_cells_keep_their_columns(self):
        before = (b"ts\tphase\tdecision\twhy\tevidence\tresult\n"
                  b'2026-11-03T10:00:00Z\t"balanced"\t\t""\tproof\t\n')
        self.log.write_bytes(before)
        converted = Path(self.temp.name) / "converted.tsv"
        result = self.run_migration(converted)
        self.assertEqual(0, result.returncode, result.stderr)
        self.assertEqual(before, self.log.read_bytes())
        with converted.open(encoding="utf-8", newline="") as handle:
            rows = list(csv.reader(handle, delimiter="\t", strict=True))
        self.assertEqual(['2026-11-03T10:00:00Z', '"balanced"', '', '""', 'proof', ''], rows[1])

    def test_legacy_conversion_applies_formula_guards_without_double_prefixing(self):
        before = (b"ts\tphase\tdecision\twhy\tevidence\tresult\n"
                  b"2026-11-03T10:00:00Z\t =1+1\t +1\t -1\t @SUM(A1)\t'=already\n")
        self.log.write_bytes(before)
        converted = Path(self.temp.name) / "converted.tsv"
        result = self.run_migration(converted)
        self.assertEqual(0, result.returncode, result.stderr)
        self.assertEqual(before, self.log.read_bytes())
        with converted.open(encoding="utf-8", newline="") as handle:
            rows = list(csv.reader(handle, delimiter="\t", strict=True))
        self.assertEqual(["2026-11-03T10:00:00Z", "' =1+1", "' +1", "' -1", "' @SUM(A1)", "'=already"], rows[1])

    def test_invalid_legacy_input_creates_no_destination(self):
        header = b"ts\tphase\tdecision\twhy\tevidence\tresult\n"
        cases = {
            "missing": None,
            "empty": b"",
            "header": b"wrong\n",
            "incomplete header": header[:-1],
            "missing column": header + b"stamp\ta\tb\tc\td\n",
            "extra column": header + b"stamp\ta\tb\tc\td\te\tf\n",
            "blank record": header + b"\n",
            "incomplete record": header + b"stamp\ta\tb\tc\td\te",
            "bare carriage return": header + b"stamp\ta\tb\tc\td\te\rf\n",
            "invalid encoding": header + b"stamp\ta\tb\tc\td\t\xff\n",
        }
        converted = Path(self.temp.name) / "absent-parent/converted.tsv"
        for name, before in cases.items():
            with self.subTest(name=name):
                if before is not None:
                    self.log.write_bytes(before)
                result = self.run_migration(converted)
                self.assertNotEqual(0, result.returncode)
                self.assertFalse(converted.parent.exists())
                if before is not None:
                    self.assertEqual(before, self.log.read_bytes())

    def test_migration_refuses_existing_destinations_including_its_source(self):
        before = b'ts\tphase\tdecision\twhy\tevidence\tresult\nstamp\t"open\tb\tc\td\te\n'
        self.log.write_bytes(before)
        existing = Path(self.temp.name) / "existing.tsv"
        existing.write_bytes(b"user data\n")
        folder = Path(self.temp.name) / "folder"
        folder.mkdir()
        for destination in (self.log, existing, folder):
            with self.subTest(destination=destination.name):
                result = self.run_migration(destination)
                self.assertNotEqual(0, result.returncode)
                self.assertEqual(before, self.log.read_bytes())
                self.assertEqual(b"user data\n", existing.read_bytes())
                self.assertEqual([], list(folder.iterdir()))

    def test_repeated_migration_preserves_the_converted_log_and_later_appends(self):
        self.log.write_bytes(b'ts\tphase\tdecision\twhy\tevidence\tresult\nstamp\t"open\tb\tc\td\te\n')
        converted = Path(self.temp.name) / "new-parent/converted.tsv"
        first = self.run_migration(converted)
        self.assertEqual(0, first.returncode, first.stderr)
        appended = self.run_log(["review", "keep", "reason", "artifact", "ok"], converted)
        self.assertEqual(0, appended.returncode, appended.stderr)
        before = converted.read_bytes()
        again = self.run_migration(converted)
        self.assertNotEqual(0, again.returncode)
        self.assertEqual(before, converted.read_bytes())

    def test_legacy_header_only_conversion_can_receive_its_first_append(self):
        self.log.write_bytes(b"ts\tphase\tdecision\twhy\tevidence\tresult\r\n")
        converted = Path(self.temp.name) / "converted.tsv"
        result = self.run_migration(converted)
        self.assertEqual(0, result.returncode, result.stderr)
        result = self.run_log(["review", "keep", "reason", "artifact", "ok"], converted)
        self.assertEqual(0, result.returncode, result.stderr)
        with converted.open(encoding="utf-8", newline="") as handle:
            rows = list(csv.reader(handle, delimiter="\t", strict=True))
        self.assertEqual(2, len(rows))
        self.assertEqual(["review", "keep", "reason", "artifact", "ok"], rows[1][1:])

    def test_large_legacy_cell_survives_conversion_and_later_append(self):
        value = '"' + "x" * 140_000
        before = ('ts\tphase\tdecision\twhy\tevidence\tresult\nstamp\treview\tkeep\t' + value + '\tproof\tok\n').encode()
        self.log.write_bytes(before)
        converted = Path(self.temp.name) / "converted.tsv"
        result = self.run_migration(converted)
        self.assertEqual(0, result.returncode, result.stderr)
        result = self.run_log(["review", "keep", "reason", "artifact", "ok"], converted)
        self.assertEqual(0, result.returncode, result.stderr)
        self.assertEqual(before, self.log.read_bytes())
        previous = csv.field_size_limit(200_000)
        try:
            with converted.open(encoding="utf-8", newline="") as handle:
                rows = list(csv.reader(handle, delimiter="\t", strict=True))
            self.assertEqual(value, rows[1][3])
            self.assertEqual(3, len(rows))
        finally:
            csv.field_size_limit(previous)

    def test_appends_one_header_and_sanitizes_literal_cells(self):
        cells = ["-phase", "=SUM(A1)", "why\nline\ttwo", "proof", "done"]
        self.assertEqual(0, self.run_log(cells).returncode)
        self.assertEqual(0, self.run_log(["review", "keep", "reason", "artifact", "ok"]).returncode)
        with self.log.open(encoding="utf-8", newline="") as handle:
            rows = list(csv.reader(handle, delimiter="\t"))
        self.assertEqual(3, len(rows))
        self.assertEqual(["ts", "phase", "decision", "why", "evidence", "result"], rows[0])
        self.assertEqual(["'-phase", "'=SUM(A1)", "why line two", "proof", "done"], rows[1][1:])
        self.assertRegex(rows[1][0], r"^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z$")

    def read_python_rows(self):
        with self.log.open(encoding="utf-8", newline="") as handle:
            rows = list(csv.reader(handle, delimiter="\t"))
        self.assertEqual(COLUMNS, rows[0])
        return rows[1:]

    def read_powershell_rows(self):
        literal_path = "'" + str(self.log).replace("'", "''") + "'"
        command = ("Import-Csv -Delimiter ([char]9) -LiteralPath " + literal_path +
                   " | ConvertTo-Json -Compress")
        result = subprocess.run([POWERSHELL, "-NoProfile", "-NonInteractive", "-Command", command],
                                capture_output=True, text=True, encoding="utf-8")
        self.assertEqual(0, result.returncode, result.stderr)
        records = json.loads(result.stdout)
        if isinstance(records, dict):
            records = [records]
        return [[record[column] for column in COLUMNS] for record in records]

    def assert_quoted_round_trips(self, reader):
        following = ["verify", "test", "passed", "file:2", "done"]
        for name, cells, expected in QUOTE_CASES:
            with self.subTest(case=name):
                self.log = Path(self.temp.name) / (name + ".tsv")
                for row in (cells, following):
                    result = self.run_log(row)
                    self.assertEqual(0, result.returncode, result.stderr)
                rows = reader()
                self.assertEqual([6, 6], [len(row) for row in rows])
                self.assertEqual([expected, following], [row[1:] for row in rows])

    def test_quotes_and_successive_records_round_trip_with_python_csv(self):
        self.assert_quoted_round_trips(self.read_python_rows)

    @unittest.skipUnless(POWERSHELL, "PowerShell unavailable")
    def test_quotes_and_successive_records_round_trip_with_powershell_import_csv(self):
        self.assert_quoted_round_trips(self.read_powershell_rows)

    def test_malformed_log_is_rejected_without_mutation(self):
        before = b"user data\n"
        self.log.write_bytes(before)
        self.assertNotEqual(0, self.run_log(["a"] * 5).returncode)
        self.assertEqual(before, self.log.read_bytes())

    def test_incomplete_row_is_rejected_without_mutation(self):
        before = b"ts\tphase\tdecision\twhy\tevidence\tresult\npartial"
        self.log.write_bytes(before)
        self.assertNotEqual(0, self.run_log(["a"] * 5).returncode)
        self.assertEqual(before, self.log.read_bytes())

    def test_quoted_cells_round_trip_after_later_append(self):
        cases = [
            (["\"literal\"", "\"=1+1\"", "\"+1\"", "\"-1\"", "\"@SUM(A1)\""],
             ["\"literal\"", "\"=1+1\"", "\"+1\"", "\"-1\"", "\"@SUM(A1)\""]),
            (["\"open", "middle\"quote", "ends\"", "\"\"", "text \"quoted\""],
             ["\"open", "middle\"quote", "ends\"", "\"\"", "text \"quoted\""]),
            (["phase", "decision", "why", "evidence", "\"unclosed"],
             ["phase", "decision", "why", "evidence", "\"unclosed"]),
            (["\"line\nbreak\"", "\"tab\there\"", "\"carriage\rreturn\"", " =1+1", "\t@SUM(A1)"],
             ["\"line break\"", "\"tab here\"", "\"carriage return\"", "' =1+1", "' @SUM(A1)"]),
        ]
        later = ["review", "keep", "reason", "artifact", "ok"]
        for cells, expected in cases:
            with self.subTest(cells=cells):
                self.log.write_bytes(b"")
                result = self.run_log(cells)
                self.assertEqual(0, result.returncode, result.stderr)
                result = self.run_log(later)
                self.assertEqual(0, result.returncode, result.stderr)
                with self.log.open(encoding="utf-8", newline="") as handle:
                    rows = list(csv.reader(handle, delimiter="\t"))
                self.assertEqual(3, len(rows))
                self.assertEqual(expected, rows[1][1:])
                self.assertEqual(later, rows[2][1:])

    def test_malformed_existing_records_are_rejected_without_mutation(self):
        header = b"ts\tphase\tdecision\twhy\tevidence\tresult\n"
        cases = {
            "partial row with newline": b"partial\n",
            "missing cell": b"stamp\ta\tb\tc\td\n",
            "extra cell": b"stamp\ta\tb\tc\td\te\tf\n",
            "blank row": b"\n",
            "unclosed quote": b"stamp\ta\tb\tc\td\t\"open\n",
            "text after closing quote": b"stamp\ta\tb\tc\td\t\"closed\"junk\n",
            "quoted line feed": b"stamp\ta\tb\tc\td\t\"two\nlines\"\n",
            "quoted carriage return": b"stamp\ta\tb\tc\td\t\"two\rlines\"\n",
            "quoted tab": b"stamp\ta\tb\tc\td\t\"two\tcolumns\"\n",
        }
        for name, body in cases.items():
            with self.subTest(name=name):
                before = header + body
                self.log.write_bytes(before)
                result = self.run_log(["a"] * 5)
                self.assertNotEqual(0, result.returncode)
                self.assertEqual(before, self.log.read_bytes())

    def test_valid_existing_records_accept_append(self):
        cases = [
            b"ts\tphase\tdecision\twhy\tevidence\tresult\n",
            b"ts\tphase\tdecision\twhy\tevidence\tresult\n"
            b"stamp\treview\tkeep\treason\tartifact\tok\n",
            b"ts\tphase\tdecision\twhy\tevidence\tresult\r\n"
            b"stamp\t\"review\"\t\"\"\"quoted\"\"\"\t\tartifact\tok\r\n",
        ]
        for before in cases:
            with self.subTest(before=before):
                self.log.write_bytes(before)
                result = self.run_log(["a"] * 5)
                self.assertEqual(0, result.returncode, result.stderr)
                self.assertTrue(self.log.read_bytes().startswith(before))
                with self.log.open(encoding="utf-8", newline="") as handle:
                    rows = list(csv.reader(handle, delimiter="\t", strict=True))
                self.assertEqual(["a"] * 5, rows[-1][1:])
                self.assertEqual(6, len(rows[-1]))

    def test_large_existing_cell_accepts_append_without_changing_prior_content(self):
        before = (b"ts\tphase\tdecision\twhy\tevidence\tresult\n"
                  b"stamp\treview\tkeep\t" + b"x" * 140_000 + b"\tartifact\tok\n")
        self.log.write_bytes(before)
        result = self.run_log(["a"] * 5)
        self.assertEqual(0, result.returncode, result.stderr)
        after = self.log.read_bytes()
        self.assertEqual(before, after[:len(before)])
        appended = list(csv.reader(after[len(before):].decode("utf-8").splitlines(), delimiter="\t"))
        self.assertEqual(1, len(appended))
        self.assertEqual(["a"] * 5, appended[0][1:])

    def test_validation_restores_the_callers_csv_field_limit(self):
        append = runpy.run_path(str(SCRIPT))["append"]
        self.addCleanup(csv.field_size_limit, csv.field_size_limit())
        csv.field_size_limit(16)
        header = b"ts\tphase\tdecision\twhy\tevidence\tresult\n"
        for suffix in (b"\tartifact\tok\n", b"\tartifact\n"):
            with self.subTest(suffix=suffix):
                self.log.write_bytes(header + b"stamp\treview\tkeep\treason" + suffix)
                try:
                    if suffix == b"\tartifact\tok\n":
                        append(self.log, ["a"] * 5)
                    else:
                        with self.assertRaises(ValueError):
                            append(self.log, ["a"] * 5)
                finally:
                    self.assertEqual(16, csv.field_size_limit())
