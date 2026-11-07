"""Exercise upstream comparison through its read-only public CLI and real Git objects."""
import hashlib
import json
import os
from pathlib import Path
import shutil
import subprocess
import sys
import tempfile
import unittest

SCRIPT = Path(__file__).with_name("upstream_report.py")


def git(root, *args):
    result = subprocess.run(["git", "-C", str(root), *args], capture_output=True, check=True)
    return result.stdout.decode("utf-8").strip()


def save(root, name, data):
    target = root / name
    target.parent.mkdir(parents=True, exist_ok=True)
    target.write_bytes(data if isinstance(data, bytes) else data.encode("utf-8"))


def files(root):
    return {p.relative_to(root).as_posix(): p.read_bytes()
            for p in root.rglob("*") if p.is_file() and ".git" not in p.relative_to(root).parts}


class UpstreamReportTests(unittest.TestCase):
    def setUp(self):
        self.temp = tempfile.TemporaryDirectory(prefix="upstream report ")
        self.addCleanup(self.temp.cleanup)
        self.root = Path(self.temp.name) / "Simplicit"
        self.upstream = Path(self.temp.name) / "upstream"
        for folder in (self.root, self.upstream):
            folder.mkdir()
            git(folder, "init", "-q")
            git(folder, "config", "user.name", "Test")
            git(folder, "config", "user.email", "test@example.invalid")
            git(folder, "config", "core.autocrlf", "false")
            save(folder, "pstack/skills/old/SKILL.md", "old instruction\n")
            save(folder, "pstack/skills/old/references/detail.md", "old detail\n")
            save(folder, "pstack/assets/logo.bin", b"\x00old")
            git(folder, "add", ".")
            git(folder, "commit", "-qm", "base")
        self.base = git(self.upstream, "rev-parse", "HEAD")
        self.tree = git(self.root, "rev-parse", "HEAD:pstack")
        save(self.root, "skills/new/SKILL.md", "Codex adaptation; preserve local behavior\n")
        save(self.root, "skills/new/references/detail.md", "portable detail\n")
        save(self.root, "README.md", "local guide\n")
        self.mapping = {
            "version": 1, "upstream_commit": self.base, "upstream_tree": self.tree,
            "resources": [
                {"source": "pstack/skills/old/SKILL.md", "targets": ["skills/new/SKILL.md"],
                 "disposition": "adapted", "reason": "Renamed for Codex."},
                {"source": "pstack/skills/old/references/detail.md",
                 "targets": ["skills/new/references/detail.md", "README.md"],
                 "disposition": "adapted", "reason": "Split into instructions and guide."},
                {"source": "pstack/assets/logo.bin", "targets": [],
                 "disposition": "omitted", "reason": "Upstream branding is not installed."},
            ],
        }
        self.write_map()
        save(self.root, "migration-map.json", json.dumps({
            "upstream_commit": self.base, "upstream_tree": self.tree,
            "skills": [{"source": "pstack/skills/old/SKILL.md", "target": "skills/new/SKILL.md"}],
            "playbooks": [],
        }))

    def write_map(self):
        save(self.root, "upstream-resources.json", json.dumps(self.mapping))

    def commit(self):
        git(self.upstream, "add", "-A")
        git(self.upstream, "commit", "-qm", "candidate")
        return git(self.upstream, "rev-parse", "HEAD")

    def run_cli(self, *args):
        return subprocess.run(
            [sys.executable, "-B", str(SCRIPT), "--root", str(self.root),
             "--upstream-repo", str(self.upstream), "--ref", "HEAD", *args],
            capture_output=True, text=True, encoding="utf-8",
        )

    def report(self):
        result = self.run_cli("--format", "json")
        self.assertEqual(0, result.returncode, result.stderr)
        return json.loads(result.stdout)

    def test_unchanged_report_is_complete_deterministic_and_read_only(self):
        before = files(self.root), files(self.upstream)
        a = self.run_cli("--format", "json")
        self.assertEqual(0, a.returncode, a.stderr)
        b = self.run_cli("--format", "json")
        self.assertEqual(a.stdout, b.stdout)
        report = json.loads(a.stdout)
        self.assertEqual([], report["changes"])
        self.assertEqual(3, report["mapping"]["covered"])
        self.assertEqual(self.base, report["candidate"]["commit"])
        self.assertEqual(before, (files(self.root), files(self.upstream)))
        self.assertFalse(report["adoption_enabled"])

    def test_modified_resource_names_all_adaptations_without_overwriting(self):
        save(self.upstream, "pstack/skills/old/references/detail.md", "new upstream detail\n")
        self.commit()
        report = self.report()
        row, = report["changes"]
        self.assertEqual("modified", row["change"])
        self.assertEqual("mapped", row["mapping_status"])
        self.assertEqual(["skills/new/references/detail.md", "README.md"],
                         [t["path"] for t in row["targets"]])
        self.assertIn("+new upstream detail", row["upstream_diff"])
        self.assertEqual("portable detail\n", (self.root / row["targets"][0]["path"]).read_text())
        self.assertEqual(hashlib.sha256(b"portable detail\n").hexdigest(), row["targets"][0]["sha256"])

    def test_added_resources_are_unmapped_even_when_similar_target_exists(self):
        save(self.upstream, "pstack/skills/old/references/new.md", "new\n")
        save(self.root, "skills/new/references/new.md", "local\n")
        self.commit()
        row, = self.report()["changes"]
        self.assertEqual("added", row["change"])
        self.assertEqual("unmapped", row["mapping_status"])
        self.assertEqual([], row["targets"])

    def test_deleted_upstream_resource_keeps_local_adaptation(self):
        (self.upstream / "pstack/skills/old/SKILL.md").unlink()
        self.commit()
        row, = self.report()["changes"]
        self.assertEqual("removed", row["change"])
        self.assertEqual("skills/new/SKILL.md", row["targets"][0]["path"])
        self.assertTrue((self.root / "skills/new/SKILL.md").is_file())

    def test_unique_exact_rename_retains_mapping_but_requires_review(self):
        (self.upstream / "pstack/skills/old/SKILL.md").rename(self.upstream / "pstack/skills/old/renamed.md")
        self.commit()
        row, = self.report()["changes"]
        self.assertEqual("renamed", row["change"])
        self.assertEqual("pstack/skills/old/SKILL.md", row["previous_source"])
        self.assertEqual("mapped-rename", row["mapping_status"])

    def test_duplicate_content_is_not_guessed_as_a_rename(self):
        (self.upstream / "pstack/skills/old/SKILL.md").unlink()
        save(self.upstream, "pstack/skills/old/a.md", "old instruction\n")
        save(self.upstream, "pstack/skills/old/b.md", "old instruction\n")
        self.commit()
        report = self.report()
        self.assertEqual(["added", "added", "removed"], sorted(r["change"] for r in report["changes"]))

    def test_binary_and_mode_changes_are_reported(self):
        save(self.upstream, "pstack/assets/logo.bin", b"\x00new")
        git(self.upstream, "update-index", "--chmod=+x", "pstack/skills/old/SKILL.md")
        git(self.upstream, "add", "pstack/assets/logo.bin")
        git(self.upstream, "commit", "-qm", "binary and mode")
        changes = {r["source"]: r for r in self.report()["changes"]}
        self.assertTrue(changes["pstack/assets/logo.bin"]["binary"])
        self.assertEqual("omitted", changes["pstack/assets/logo.bin"]["mapping_status"])
        mode = changes["pstack/skills/old/SKILL.md"]
        self.assertEqual("100644", mode["before"]["mode"])
        self.assertEqual("100755", mode["after"]["mode"])

    def test_invalid_map_cannot_claim_reliable_coverage(self):
        for change in ("missing", "duplicate", "missing-target", "escape", "disagreement", "pin"):
            with self.subTest(change=change):
                original = json.loads(json.dumps(self.mapping))
                if change == "missing":
                    self.mapping["resources"].pop()
                elif change == "duplicate":
                    self.mapping["resources"].append(self.mapping["resources"][0])
                elif change == "missing-target":
                    self.mapping["resources"][0]["targets"] = ["skills/missing/SKILL.md"]
                elif change == "escape":
                    self.mapping["resources"][0]["targets"] = ["../outside"]
                elif change == "disagreement":
                    self.mapping["resources"][0]["targets"] = ["README.md"]
                else:
                    self.mapping["upstream_commit"] = "a" * 40
                self.write_map()
                result = self.run_cli("--format", "json")
                self.assertEqual(2, result.returncode, result.stdout + result.stderr)
                self.assertEqual("", result.stdout)
                self.mapping = original
                self.write_map()

    def test_unknown_manifest_fields_and_invalid_shapes_are_errors(self):
        for field, value in (("targets", "skills/new/SKILL.md"), ("disposition", []),
                             ("source", "."), ("unexpected", True)):
            with self.subTest(field=field):
                original = json.loads(json.dumps(self.mapping))
                self.mapping["resources"][0][field] = value
                self.write_map()
                result = self.run_cli()
                self.assertEqual(2, result.returncode)
                self.assertNotIn("Traceback", result.stderr)
                self.mapping = original

    def test_missing_and_option_shaped_refs_fail_without_writes(self):
        before = files(self.root)
        for ref in ("absent-branch", "--help"):
            result = self.run_cli("--ref=" + ref)
            self.assertEqual(2, result.returncode)
            self.assertEqual("", result.stdout)
        self.assertEqual(before, files(self.root))

    def test_linked_target_is_rejected_without_reading_external_content(self):
        target = self.root / "skills/new/SKILL.md"
        target.unlink()
        outside = Path(self.temp.name) / "private.txt"
        outside.write_text("EXTERNAL SENTINEL")
        try:
            target.symlink_to(outside)
        except OSError:
            self.skipTest("symlink creation unavailable")
        result = self.run_cli()
        self.assertEqual(2, result.returncode)
        self.assertNotIn("EXTERNAL SENTINEL", result.stdout + result.stderr)

    def test_candidate_worktree_edits_do_not_change_selected_commit(self):
        save(self.upstream, "pstack/skills/old/SKILL.md", "uncommitted\n")
        self.assertEqual([], self.report()["changes"])

    def test_markdown_report_explains_scope_and_lists_resource_paths(self):
        save(self.upstream, "pstack/skills/old/SKILL.md", "new instructions\n")
        self.commit()
        result = self.run_cli()
        self.assertEqual(0, result.returncode, result.stderr)
        self.assertIn("pstack/skills/old/SKILL.md", result.stdout)
        self.assertIn("skills/new/SKILL.md", result.stdout)
        self.assertIn("read-only", result.stdout.lower())
        self.assertIn("disabled", result.stdout.lower())
        self.assertNotIn("+new instructions", result.stdout)
        with_diff = self.run_cli("--include-diffs")
        self.assertIn("+new instructions", with_diff.stdout)


class PackagedMappingTests(unittest.TestCase):
    def test_removed_review_rubric_identifies_critic_profile_as_affected(self):
        with tempfile.TemporaryDirectory(prefix="upstream rubric ") as temp:
            candidate = Path(temp)
            git(candidate, "init", "-q")
            git(candidate, "config", "user.name", "Test")
            git(candidate, "config", "user.email", "test@example.invalid")
            save(candidate, "pstack/README.md", "Minimal candidate with review resources removed.\n")
            git(candidate, "add", ".")
            git(candidate, "commit", "-qm", "remove review resources")
            result = subprocess.run([sys.executable, "-B", str(SCRIPT), "--upstream-repo", temp,
                                     "--ref", "HEAD", "--format", "json"], capture_output=True,
                                    text=True, encoding="utf-8")
            self.assertEqual(0, result.returncode, result.stderr)
            changes = {r["source"]: r for r in json.loads(result.stdout)["changes"]}
            for source in ("pstack/skills/interrogate/references/rubric.md",
                           "pstack/skills/architect/references/design-red-flags.md"):
                self.assertIn(".codex/agents/critic.toml", [t["path"] for t in changes[source]["targets"]])

    def test_complete_packaged_mapping_matches_pinned_tree_and_existing_routes(self):
        root = SCRIPT.resolve().parents[1]
        result = subprocess.run([sys.executable, "-B", str(SCRIPT), "--upstream-repo", str(root),
                                 "--ref", "HEAD", "--format", "json"], capture_output=True,
                                text=True, encoding="utf-8")
        self.assertEqual(0, result.returncode, result.stderr)
        report = json.loads(result.stdout)
        self.assertEqual(200, report["mapping"]["covered"])
        self.assertEqual([], report["changes"])


class DiffEvidenceTests(unittest.TestCase):
    def test_missing_final_newlines_keep_removal_and_addition_separate(self):
        from upstream_report import diff_bytes
        for before, after, wanted in (
            (b"old", b"new\n", "-old\n\\ No newline at end of file\n+new\n"),
            (b"old\n", b"new", "-old\n+new\n\\ No newline at end of file\n"),
            (b"old", b"new", "-old\n\\ No newline at end of file\n+new\n\\ No newline at end of file\n"),
        ):
            with self.subTest(before=before, after=after):
                binary, diff = diff_bytes(before, after, "old", "new")
                self.assertFalse(binary)
                self.assertEqual("--- old\n+++ new\n@@ -1 +1 @@\n" + wanted, diff)


if __name__ == "__main__":
    unittest.main()
