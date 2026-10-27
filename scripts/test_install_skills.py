"""Copy a complete validated collection without discarding local changes."""

import tempfile
import unittest
import os
import subprocess
import shutil
from pathlib import Path
from unittest.mock import patch

from install_skills import install


class InstallationTests(unittest.TestCase):
    def setUp(self):
        self.temp = tempfile.TemporaryDirectory()
        self.addCleanup(self.temp.cleanup)
        self.root = Path(self.temp.name)
        self.source = self.root / "source"
        self.target = self.root / "project/.agents/skills"
        for name in ("one", "two"):
            folder = self.source / name
            folder.mkdir(parents=True)
            (folder / "SKILL.md").write_text(
                f"---\nname: {name}\ndescription: Use for {name}.\n---\n", encoding="utf-8"
            )
            (folder / "LICENSE").write_text("MIT", encoding="utf-8")

    def test_copies_complete_collection_and_is_idempotent(self):
        self.assertEqual(2, install(self.source, self.target))
        before = {p.relative_to(self.target): p.read_bytes() for p in self.target.rglob("*") if p.is_file()}
        self.assertEqual(0, install(self.source, self.target))
        after = {p.relative_to(self.target): p.read_bytes() for p in self.target.rglob("*") if p.is_file()}
        self.assertEqual(before, after)

    def test_collision_aborts_before_copying_any_skill(self):
        existing = self.target / "two"
        existing.mkdir(parents=True)
        (existing / "SKILL.md").write_text("local customization", encoding="utf-8")
        with self.assertRaisesRegex(ValueError, "collision"):
            install(self.source, self.target)
        self.assertFalse((self.target / "one").exists())
        self.assertEqual("local customization", (existing / "SKILL.md").read_text())

    def test_existing_extra_resource_is_preserved_and_treated_as_collision(self):
        install(self.source, self.target)
        extra = self.target / "one/local.md"
        extra.write_text("mine")
        with self.assertRaisesRegex(ValueError, "collision"):
            install(self.source, self.target)
        self.assertEqual("mine", extra.read_text())

    def test_unrelated_skills_are_preserved(self):
        extra = self.target / "unrelated"
        extra.mkdir(parents=True)
        (extra / "custom").write_text("mine")
        self.assertEqual(2, install(self.source, self.target))
        self.assertEqual("mine", (extra / "custom").read_text())

    def test_missing_resource_aborts_before_creating_destination(self):
        (self.source / "one/SKILL.md").write_text(
            "---\nname: one\ndescription: Example\n---\n[Guide](missing.md)\n"
        )
        with self.assertRaisesRegex(ValueError, "missing target"):
            install(self.source, self.target)
        self.assertFalse(self.target.exists())

    def test_file_at_destination_is_a_collision(self):
        self.target.mkdir(parents=True)
        (self.target / "two").write_text("mine")
        with self.assertRaisesRegex(ValueError, "collision"):
            install(self.source, self.target)
        self.assertFalse((self.target / "one").exists())

    @unittest.skipUnless(os.name == "nt", "Windows short-name paths only")
    def test_windows_short_name_path_is_not_mistaken_for_a_link(self):
        import ctypes

        buffer = ctypes.create_unicode_buffer(32768)
        size = ctypes.windll.kernel32.GetShortPathNameW(str(self.root), buffer, len(buffer))
        if not size:
            self.skipTest("short-name lookup unavailable")
        short_root = Path(buffer.value)
        if short_root == self.root.resolve():
            self.skipTest("8.3 short names unavailable on this volume")
        destination = short_root / "project/.agents/skills"
        self.assertEqual(2, install(self.source, destination))
        self.assertEqual(0, install(self.source, destination))
        self.assertTrue((self.root.resolve() / "project/.agents/skills/one/SKILL.md").is_file())

    def test_interrupted_copy_preserves_existing_content_and_can_be_retried(self):
        existing = self.target / "unrelated"
        existing.mkdir(parents=True)
        (existing / "custom").write_text("mine")
        original = shutil.copytree

        def interrupted(source, target, *args, **kwargs):
            if Path(source).name == "two":
                Path(target).mkdir(parents=True)
                (Path(target) / "SKILL.md").write_text("partial")
                raise OSError("simulated copy failure")
            return original(source, target, *args, **kwargs)

        with patch("install_skills.shutil.copytree", side_effect=interrupted):
            with self.assertRaisesRegex(OSError, "simulated copy failure"):
                install(self.source, self.target)
        self.assertEqual([existing], list(self.target.iterdir()))
        self.assertEqual("mine", (existing / "custom").read_text())
        self.assertEqual(2, install(self.source, self.target))

    def test_interrupted_publish_leaves_only_complete_skills_and_can_be_retried(self):
        original = Path.rename

        def interrupted(path, target):
            if path.name == "two":
                raise OSError("simulated publish failure")
            return original(path, target)

        with patch.object(Path, "rename", interrupted):
            with self.assertRaisesRegex(OSError, "simulated publish failure"):
                install(self.source, self.target)
        self.assertEqual((self.source / "one/SKILL.md").read_bytes(),
                         (self.target / "one/SKILL.md").read_bytes())
        self.assertFalse((self.target / "two").exists())
        self.assertEqual(1, install(self.source, self.target))

    def test_linked_destination_ancestor_cannot_write_outside_project(self):
        project = self.root / "project"
        outside = self.root / "outside"
        project.mkdir()
        outside.mkdir()
        link = project / ".agents"
        if os.name == "nt":
            result = subprocess.run(["cmd", "/c", "mklink", "/J", str(link), str(outside)],
                                    capture_output=True, text=True)
            if result.returncode:
                self.skipTest("junction creation unavailable")
        else:
            link.symlink_to(outside, target_is_directory=True)
        try:
            with self.assertRaisesRegex(ValueError, "collision"):
                install(self.source, self.target)
            self.assertEqual([], list(outside.iterdir()))
        finally:
            if os.name == "nt":
                link.rmdir()
            else:
                link.unlink()


if __name__ == "__main__":
    unittest.main()
