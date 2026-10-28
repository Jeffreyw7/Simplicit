import csv
import json
import shutil
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


class DecisionLogTests(unittest.TestCase):
    def setUp(self):
        self.temp = tempfile.TemporaryDirectory()
        self.addCleanup(self.temp.cleanup)
        self.log = Path(self.temp.name) / "decisions.tsv"

    def run_log(self, cells):
        return subprocess.run([sys.executable, "-B", str(SCRIPT), str(self.log), *cells],
                              capture_output=True, text=True, encoding="utf-8")

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
