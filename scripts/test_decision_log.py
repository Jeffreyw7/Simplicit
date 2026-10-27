import csv
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
