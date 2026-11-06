"""Exercise the package boundary with disposable files, including relocation."""

import contextlib
import copy
import io
import json
import os
import shutil
import subprocess
import tempfile
import unittest
from pathlib import Path

import check_package


PLUGIN = {
    "name": "simplicit", "version": "0.1.0", "skills": "./skills/",
    "description": "Coding workflow", "author": {"name": "Jeffrey Wang"},
    "interface": {"displayName": "Simplicit", "defaultPrompt": ["Use Simplicit."]},
}
CATALOG = {"name": "simplicit", "plugins": [{
    "name": "simplicit", "source": {"source": "local", "path": "./"},
    "policy": {"installation": "AVAILABLE", "authentication": "ON_INSTALL"},
    "category": "Productivity",
}]}
REPOSITORY = Path(__file__).resolve().parents[1]


class PackageTests(unittest.TestCase):
    def setUp(self):
        self.temp = tempfile.TemporaryDirectory()
        self.addCleanup(self.temp.cleanup)
        self.root = Path(self.temp.name) / "package"
        self.root.mkdir()
        self.plugin = copy.deepcopy(PLUGIN)
        self.catalog = copy.deepcopy(CATALOG)
        self.write_manifests()
        for name in ("simplicit", "simplicit-help", "interrogate", "no-comments"):
            self.write(f"skills/{name}/SKILL.md",
                       f"---\nname: {name}\ndescription: A workflow\n---\n")
            self.write(f"skills/{name}/LICENSE", "Fixture license\n")
        for path in ("simplicit/references/runtime.md", "simplicit/references/simplicit-agent.md",
                     "interrogate/references/reviewer-prompt.md", "no-comments/references/comment-review.md"):
            self.write("skills/" + path, "Fixture resource\n")
        for name in ("critic", "comment-sicko"):
            self.write(f".codex/agents/{name}.toml",
                       f'name = "{name}"\ndescription = "Review"\ndeveloper_instructions = "Read only"\n')

    def write(self, name, text):
        path = self.root / name
        path.parent.mkdir(parents=True, exist_ok=True)
        path.write_text(text, encoding="utf-8")
        return path

    def write_manifests(self):
        self.write(".codex-plugin/plugin.json", json.dumps(self.plugin))
        self.write(".agents/plugins/marketplace.json", json.dumps(self.catalog))

    def errors(self):
        return check_package.validate(self.root)

    def assert_error(self, fragment):
        errors = self.errors()
        self.assertTrue(any(fragment in error for error in errors), errors)

    def test_valid_package_and_inventory_growth(self):
        self.assertEqual([], self.errors())
        self.write("skills/extra/SKILL.md", "---\nname: extra\ndescription: Extra\n---\n")
        self.write("skills/extra/LICENSE", "Extra license\n")
        self.assertEqual([], self.errors())

    def test_missing_malformed_or_nonobject_manifests(self):
        for name in (".codex-plugin/plugin.json", ".agents/plugins/marketplace.json"):
            path = self.root / name
            original = path.read_bytes()
            for data in (None, b"{", b"[]", b"null", b"\xff"):
                with self.subTest(name=name, data=data):
                    if data is None:
                        path.unlink()
                    else:
                        path.write_bytes(data)
                    self.assert_error(name)
                    path.write_bytes(original)

    def test_missing_package_fields(self):
        for key in ("name", "version", "skills"):
            with self.subTest(key=key):
                self.plugin = copy.deepcopy(PLUGIN)
                del self.plugin[key]
                self.write_manifests()
                self.assert_error(key)

    def test_invalid_supplied_metadata(self):
        for key, value in (("description", 3), ("author", []), ("interface", []),
                           ("interface", {"displayName": 3}),
                           ("interface", {"defaultPrompt": [3]})):
            with self.subTest(key=key, value=value):
                self.plugin = copy.deepcopy(PLUGIN)
                self.plugin[key] = value
                self.write_manifests()
                self.assert_error(key)

    def test_supported_optional_metadata_is_not_restricted(self):
        self.plugin["interface"]["defaultPrompt"] = "Use Simplicit."
        self.plugin["homepage"] = "https://example.com"
        self.write_manifests()
        self.assertEqual([], self.errors())

    def test_identity_and_catalog_structure(self):
        for field, value in (("name", "other"), ("plugins", []), ("plugins", {}),
                             ("plugins", [None]), ("plugins", CATALOG["plugins"] * 2)):
            with self.subTest(field=field, value=value):
                self.catalog = copy.deepcopy(CATALOG)
                self.catalog[field] = value
                self.write_manifests()
                self.assertTrue(self.errors())
        self.catalog = copy.deepcopy(CATALOG)
        self.catalog["plugins"][0]["name"] = "other"
        self.write_manifests()
        self.assert_error("name")

    def test_version_policy(self):
        for value in (None, 1, True, "", "1", "v1.2.3", "01.2.3", "1.2.3-01", "1.2.3+"):
            with self.subTest(value=value):
                self.plugin["version"] = value
                self.write_manifests()
                self.assert_error("version")
        for value in ("1.2.3", "2.0.0-rc.1+build.02"):
            self.plugin["version"] = value
            self.write_manifests()
            self.assertEqual([], self.errors())

    def test_wrong_root_and_escaping_paths(self):
        for path in ("./.agents/plugins/", "../", "./../", "/tmp", "C:/elsewhere", "./skills/", "", None):
            with self.subTest(path=path):
                self.catalog["plugins"][0]["source"]["path"] = path
                self.write_manifests()
                self.assert_error("source")

    def test_missing_and_wrong_catalog_fields(self):
        for field in ("name", "source", "policy", "category"):
            self.catalog = copy.deepcopy(CATALOG)
            del self.catalog["plugins"][0][field]
            self.write_manifests()
            self.assert_error(field)
        self.catalog = copy.deepcopy(CATALOG)
        self.catalog["plugins"][0]["source"]["source"] = "url"
        self.write_manifests()
        self.assert_error("source")

    def test_only_maintained_skills_can_be_registered(self):
        for path in ("./pstack/skills/", "./", ["./skills/", "./pstack/skills/"], "../skills", None):
            self.plugin["skills"] = path
            self.write_manifests()
            self.assert_error("skills")

    def test_missing_skill_directory(self):
        shutil.rmtree(self.root / "skills")
        self.assert_error("skills")

    def test_missing_selected_reviewer_and_runtime_resources(self):
        for name in (".codex/agents/critic.toml", ".codex/agents/comment-sicko.toml",
                     "skills/interrogate/references/reviewer-prompt.md",
                     "skills/no-comments/references/comment-review.md",
                     "skills/simplicit/references/runtime.md",
                     "skills/simplicit/references/simplicit-agent.md"):
            with self.subTest(name=name):
                path = self.root / name
                original = path.read_bytes()
                path.unlink()
                self.assert_error(name)
                path.write_bytes(original)

    def test_relative_resources_are_checked_after_relocation(self):
        self.write("skills/simplicit/SKILL.md", (self.root / "skills/simplicit/SKILL.md").read_text()
                   + "\n[Brief](../no-comments/references/comment-review.md)\n")
        moved = self.root.parent / "relocated"
        self.root.rename(moved)
        self.root = moved
        self.assertEqual([], self.errors())
        (self.root / "skills/no-comments/references/comment-review.md").unlink()
        self.assert_error("missing")

    def test_external_runtime_link_is_rejected(self):
        self.write("skills/simplicit/references/runtime.md", "[Resource](../../../outside.md)\n")
        (self.root / "outside.md").write_text("outside collection")
        self.assert_error("outside collection")

    def test_profile_and_skill_validation_is_reused(self):
        self.write(".codex/agents/critic.toml", 'name = "critic"\nsandbox_mode = "read-only"\n')
        self.assert_error("unsupported field")
        self.write("skills/simplicit/SKILL.md", "Missing frontmatter")
        self.assert_error("name must match")

    def test_competing_manifest_and_active_components_are_rejected(self):
        for name in ("plugin.json", ".mcp.json", "mcp.json", ".app.json", "hooks/hooks.json"):
            path = self.write(name, "{}")
            self.assert_error(name)
            path.unlink()

    def test_manifest_command_registration_cannot_activate_archived_instructions(self):
        self.write("pstack/commands/archived.md", "Inactive command instructions\n")
        self.plugin["commands"] = "./pstack/commands/"
        self.write_manifests()
        self.assert_error("commands")

    def test_conventional_commands_cannot_add_skills_outside_the_collection(self):
        self.write("commands/extra.md", "Extra command instructions\n")
        self.assert_error("commands")

    def test_linked_resources_are_rejected_even_within_package(self):
        target = self.root / "skills/no-comments/references/comment-review.md"
        link = self.root / "skills/no-comments/references/linked.md"
        try:
            link.symlink_to(target)
        except (OSError, NotImplementedError) as exc:
            self.skipTest(f"symlinks unavailable: {exc}")
        self.assert_error("linked")

    @unittest.skipUnless(os.name == "nt", "Windows junction case")
    def test_linked_directory_is_rejected(self):
        target = self.root.parent / "outside"
        target.mkdir()
        link = self.root / "skills/linked"
        result = subprocess.run(["cmd", "/c", "mklink", "/J", str(link), str(target)],
                                capture_output=True, text=True)
        self.assertEqual(0, result.returncode, result.stderr)
        try:
            self.assert_error("linked")
        finally:
            link.rmdir()

    def test_validation_preserves_input_and_unrelated_content(self):
        self.write("unrelated.txt", "Sentinel")
        self.write("pstack/skills/unused/SKILL.md", "Inactive, not a valid maintained skill")
        before = {p.relative_to(self.root): p.read_bytes() for p in self.root.rglob("*") if p.is_file()}
        self.assertEqual([], self.errors())
        after = {p.relative_to(self.root): p.read_bytes() for p in self.root.rglob("*") if p.is_file()}
        self.assertEqual(before, after)

    def test_complete_collection_outside_checkout_without_archive(self):
        shutil.rmtree(self.root / "skills")
        shutil.copytree(REPOSITORY / "skills", self.root / "skills")
        for profile in (REPOSITORY / ".codex/agents").glob("*.toml"):
            shutil.copy2(profile, self.root / ".codex/agents" / profile.name)
        self.assertEqual([], self.errors())
        self.assertFalse((self.root / "pstack").exists())

    def test_cli_exit_status_and_dynamic_count(self):
        output = io.StringIO()
        with contextlib.redirect_stdout(output):
            self.assertEqual(0, check_package.main([str(self.root)]))
        self.assertIn("4 skills", output.getvalue())
        (self.root / ".codex-plugin/plugin.json").unlink()
        with contextlib.redirect_stdout(io.StringIO()):
            self.assertEqual(1, check_package.main([str(self.root)]))


if __name__ == "__main__":
    unittest.main()
