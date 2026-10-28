"""Check profile policy and relocation using real, disposable TOML files."""

import contextlib
import io
import shutil
import tempfile
import unittest
from pathlib import Path

from validate_agents import main, validate
from validate_skills import validate as validate_skills


VALID = ('name = "critic"\n'
         'description = "Independent review"\n'
         'developer_instructions = "Review without edits."\n')


class AgentTests(unittest.TestCase):
    def setUp(self):
        self.temp = tempfile.TemporaryDirectory()
        self.addCleanup(self.temp.cleanup)
        self.base = Path(self.temp.name)
        self.source = self.base / "source"
        self.destination = self.base / "destination"
        self.source.mkdir()
        self.destination.mkdir()
        self.write(self.source)
        self.write(self.destination)
        for root in (self.source, self.destination):
            self.write(root, VALID.replace('"critic"', '"comment-sicko"'), "comment-sicko.toml")

    def write(self, root, text=VALID, filename="critic.toml"):
        path = root / filename
        path.write_text(text, encoding="utf-8")
        return path

    def errors(self):
        return validate(self.destination, source_root=self.source)

    def assert_error(self, fragment):
        self.assertTrue(any(fragment in error for error in self.errors()), self.errors())

    def test_valid_source_and_destination(self):
        self.assertEqual([], validate(source_root=self.source))
        self.assertEqual([], self.errors())

    def test_malformed_toml_in_source_or_destination(self):
        for root in (self.source, self.destination):
            with self.subTest(root=root):
                self.write(root, VALID + 'model = ["unterminated"\n')
                self.assert_error("TOML")
                self.write(root)

    def test_required_fields_missing_empty_or_wrong_type(self):
        for field in ("name", "description", "developer_instructions"):
            lines = [line for line in VALID.splitlines() if not line.startswith(field + " =")]
            for value in (None, '""', '"  "', "12", "false", "[]", "{}"):
                with self.subTest(field=field, value=value):
                    text = "\n".join(lines) + "\n"
                    if value is not None:
                        text += f"{field} = {value}\n"
                    self.write(self.destination, text)
                    self.assert_error(field)

    def test_name_must_match_expected_filename(self):
        self.write(self.destination, VALID.replace('"critic"', '"different"'))
        self.assert_error("name must match")

    def test_source_filename_convention(self):
        for name in ("Bad_Name", "two.words", "-critic", "café"):
            with self.subTest(name=name):
                path = self.write(self.source, VALID.replace('"critic"', f'"{name}"'), name + ".toml")
                self.assert_error("filename")
                path.unlink()

    def test_duplicate_shipped_names(self):
        self.write(self.source, VALID, "second.toml")
        self.assert_error("duplicate")

    def test_optional_model_fields_are_nonempty_strings(self):
        for field in ("model", "model_reasoning_effort", "model_reasoning_summary", "model_verbosity"):
            for value in ('""', '" "', "42", "true", "[]", "{}"):
                with self.subTest(field=field, value=value):
                    self.write(self.destination, VALID + f"{field} = {value}\n")
                    self.assert_error(field)

    def test_valid_optional_model_configuration(self):
        self.write(self.destination, VALID + 'model = "chosen-model"\nmodel_reasoning_effort = "high"\n')
        self.assertEqual([], self.errors())

    def test_permission_and_session_overrides_are_rejected(self):
        for setting in ('sandbox_mode = "read-only"', 'approval_policy = "never"',
                        'sandbox_permissions = ["disk-full-read-access"]',
                        'permissions = {}', 'sandbox_workspace_write = {}',
                        'model_provider = "custom"', 'mcp_servers = {}',
                        '[features]\nrequest_permissions_tool = false'):
            with self.subTest(setting=setting):
                self.write(self.destination, VALID + setting + "\n")
                self.assert_error("unsupported")

    def test_each_required_source_profile_is_independent_of_inventory(self):
        for filename in ("critic.toml", "comment-sicko.toml"):
            with self.subTest(profile=filename):
                profile = self.source / filename
                before = profile.read_bytes()
                profile.unlink()
                for args in ([], [str(self.destination)]):
                    output = io.StringIO()
                    with contextlib.redirect_stdout(output):
                        status = main(args, source_root=self.source)
                    self.assertEqual(1, status, output.getvalue())
                    self.assertIn(f"{profile}: missing expected source profile", output.getvalue())
                    self.assertNotIn("Valid profiles", output.getvalue())
                profile.write_bytes(before)

    def test_empty_source_inventory(self):
        for profile in self.source.glob("*.toml"):
            profile.unlink()
        self.assert_error("no agents")

    def test_missing_source_directory(self):
        self.source = self.base / "absent"
        self.assert_error("missing")

    def test_each_required_destination_profile_is_checked(self):
        for filename in ("critic.toml", "comment-sicko.toml"):
            with self.subTest(profile=filename):
                profile = self.destination / filename
                before = profile.read_bytes()
                profile.unlink()
                self.assert_error(f"{filename}: missing expected destination profile")
                profile.write_bytes(before)

    def test_missing_destination_directory(self):
        self.destination = self.base / "absent"
        self.assert_error("missing")

    def test_selects_all_source_profiles(self):
        self.write(self.source, VALID.replace('"critic"', '"second"'), "second.toml")
        self.assert_error("second.toml")
        self.write(self.destination, VALID.replace('"critic"', '"second"'), "second.toml")
        self.assertEqual([], self.errors())

    def test_unrelated_destination_profiles_are_not_parsed(self):
        self.write(self.destination, "this is not TOML", "unrelated.toml")
        self.assertEqual([], self.errors())

    def test_unreadable_encoding_is_reported(self):
        (self.destination / "critic.toml").write_bytes(b"\xff\xfe")
        self.assert_error("critic.toml")

    def test_directory_cannot_replace_profile(self):
        (self.destination / "critic.toml").unlink()
        (self.destination / "critic.toml").mkdir()
        self.assert_error("missing expected")

    def test_escaping_symlinks_in_source_and_destination(self):
        outside = self.write(self.base)
        for root in (self.source, self.destination):
            with self.subTest(root=root):
                profile = root / "critic.toml"
                profile.unlink()
                try:
                    profile.symlink_to(outside)
                except (OSError, NotImplementedError) as exc:
                    self.skipTest(f"symlinks unavailable: {exc}")
                self.assert_error("outside")
                profile.unlink()
                self.write(root)

    def test_validation_preserves_all_inputs(self):
        self.write(self.destination, "not TOML", "unrelated.toml")
        before = {p.relative_to(self.base): p.read_bytes() for p in self.base.rglob("*") if p.is_file()}
        self.assertEqual([], self.errors())
        after = {p.relative_to(self.base): p.read_bytes() for p in self.base.rglob("*") if p.is_file()}
        self.assertEqual(before, after)

    def test_complete_adoption_preserves_unrelated_destination_files(self):
        repository = Path(__file__).resolve().parents[1]
        target = self.base / "adopted"
        skills = target / ".agents" / "skills"
        agents = target / ".codex" / "agents"
        (skills / "unrelated").mkdir(parents=True)
        agents.mkdir(parents=True)
        sentinels = {
            skills / "unrelated" / "SKILL.md": b"Local skill, outside Simplicit policy.\n",
            agents / "unrelated.toml": b"Local agent, intentionally not TOML.\n",
            target / "AGENTS.md": b"Local repository guidance remains unchanged.\n",
        }
        for path, content in sentinels.items():
            path.write_bytes(content)
        # Copy only into this new fixture, whose inventory is known and disjoint.
        shutil.copytree(repository / "skills", skills, dirs_exist_ok=True)
        for profile in (repository / ".codex/agents").glob("*.toml"):
            shutil.copy2(profile, agents / profile.name)
        before = {p.relative_to(target): p.read_bytes() for p in target.rglob("*") if p.is_file()}
        names = [p.parent.name for p in (repository / "skills").glob("*/SKILL.md")]
        self.assertEqual([], validate_skills(skills, names=names))
        self.assertEqual([], validate(agents))
        after = {p.relative_to(target): p.read_bytes() for p in target.rglob("*") if p.is_file()}
        self.assertEqual(before, after)
        for path, content in sentinels.items():
            self.assertEqual(content, path.read_bytes())

    def test_cli_exit_and_count_for_source_and_destination(self):
        for args in ([], [str(self.destination)]):
            output = io.StringIO()
            with contextlib.redirect_stdout(output):
                status = main(args, source_root=self.source)
            self.assertEqual(0, status)
            self.assertIn("2 agent", output.getvalue())

    def test_cli_never_reports_success_for_empty_source_or_missing_destination(self):
        for root in (self.destination, self.source):
            for profile in root.glob("*.toml"):
                profile.unlink()
            output = io.StringIO()
            with contextlib.redirect_stdout(output):
                status = main([str(self.destination)], source_root=self.source)
            self.assertEqual(1, status)
            self.assertNotIn("Valid", output.getvalue())


if __name__ == "__main__":
    unittest.main()
