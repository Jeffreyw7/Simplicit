import csv
import runpy
import subprocess
import sys
import tempfile
import unittest
from pathlib import Path

SCRIPT = Path(__file__).resolve().parents[1] / "skills/show-me-your-work/scripts/log.py"


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
