"""Copy a complete validated collection without discarding local changes."""

import tempfile
import unittest
import os
import subprocess
import shutil
import json
import stat
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

    @unittest.skipUnless(os.name == "nt", "Windows inherited access permissions only")
    def test_published_skills_retain_inherited_read_access(self):
        parent = self.target.parent
        parent.mkdir(parents=True)
        nested = self.source / "one/references"
        nested.mkdir()
        (nested / "guide.md").write_text("installed reference", encoding="utf-8")
        script = self.root / "check-access.ps1"
        script.write_text(r'''
$ErrorActionPreference = 'Stop'
$parent = $env:SIMPLICIT_ACL_TEST_PARENT
$sid = [System.Security.Principal.SecurityIdentifier]::new('S-1-5-32-545')
if ($env:SIMPLICIT_ACL_TEST_STAGE -eq 'prepare') {
    $acl = Get-Acl -LiteralPath $parent
    $rule = [System.Security.AccessControl.FileSystemAccessRule]::new(
        $sid, 'ReadAndExecute', 'ContainerInherit,ObjectInherit', 'None', 'Allow')
    $acl.AddAccessRule($rule)
    Set-Acl -LiteralPath $parent -AclObject $acl
} else {
    @('skills/one', 'skills/one/SKILL.md', 'skills/one/references/guide.md') | ForEach-Object {
        $acl = Get-Acl -LiteralPath (Join-Path $parent $_)
        $readable = @($acl.Access | Where-Object {
            $_.IdentityReference.Translate([System.Security.Principal.SecurityIdentifier]).Value -eq $sid.Value -and
            $_.AccessControlType -eq 'Allow' -and
            ($_.FileSystemRights -band [System.Security.AccessControl.FileSystemRights]::ReadAndExecute) -eq
                [System.Security.AccessControl.FileSystemRights]::ReadAndExecute
        }).Count -gt 0
        [pscustomobject]@{ path = $_; inheritedRead = $readable; protectedAcl = $acl.AreAccessRulesProtected }
    } | ConvertTo-Json -Compress
}
''', encoding="utf-8")

        def access_check(stage):
            env = {**os.environ, "SIMPLICIT_ACL_TEST_PARENT": str(parent), "SIMPLICIT_ACL_TEST_STAGE": stage}
            env = {key: value for key, value in env.items() if key.lower() != "psmodulepath"}
            result = subprocess.run(
                ["powershell.exe", "-NoProfile", "-NonInteractive", "-File", str(script)],
                env=env, capture_output=True, text=True, timeout=30)
            self.assertEqual(0, result.returncode, result.stderr)
            return result.stdout

        access_check("prepare")
        install(self.source, self.target)
        for entry in json.loads(access_check("inspect")):
            with self.subTest(path=entry["path"]):
                self.assertTrue(entry["inheritedRead"], "installation lost the parent's read permission")
                self.assertFalse(entry["protectedAcl"], "installation blocked permission inheritance")

    @unittest.skipUnless(os.name == "nt", "Windows read-only file deletion behavior")
    def test_partial_install_cleans_staged_readonly_files(self):
        install(self.source, self.target)
        license_file = self.source / "one/LICENSE"
        license_file.chmod(stat.S_IREAD)
        self.addCleanup(license_file.chmod, stat.S_IREAD | stat.S_IWRITE)
        extra = self.source / "three"
        shutil.copytree(self.source / "two", extra)
        (extra / "SKILL.md").write_text("---\nname: three\ndescription: Use for three.\n---\n", encoding="utf-8")
        self.assertEqual(1, install(self.source, self.target))
        self.assertTrue((self.target / "three/SKILL.md").is_file())
        self.assertEqual([], list(self.target.parent.glob(".simplicit-install-*")))
        self.assertFalse(license_file.stat().st_mode & stat.S_IWRITE)

    @unittest.skipUnless(os.name == "posix" and os.geteuid() != 0, "unprivileged POSIX permissions only")
    def test_partial_install_cleans_staged_readonly_directories(self):
        existing = self.source / "one"
        nested = existing / "references"
        nested.mkdir()
        (nested / "guide.md").write_text("reference", encoding="utf-8")
        install(self.source, self.target)
        parent_mode = self.target.parent.stat().st_mode
        for folder in (existing, nested):
            folder.chmod(0o555)
            self.addCleanup(folder.chmod, 0o755)
        extra = self.source / "three"
        shutil.copytree(self.source / "two", extra)
        (extra / "SKILL.md").write_text("---\nname: three\ndescription: Use for three.\n---\n", encoding="utf-8")

        self.assertEqual(1, install(self.source, self.target))
        self.assertTrue((self.target / "three/SKILL.md").is_file())
        self.assertEqual([], list(self.target.parent.glob(".simplicit-install-*")))
        self.assertEqual(parent_mode, self.target.parent.stat().st_mode)
        for folder in (existing, nested):
            self.assertEqual(0o555, stat.S_IMODE(folder.stat().st_mode))
        self.assertEqual(0, install(self.source, self.target))


if __name__ == "__main__":
    unittest.main()
