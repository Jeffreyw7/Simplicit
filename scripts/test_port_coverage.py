"""All pinned upstream skills must have a distributable Codex adaptation."""

import unittest
import json
import re
from pathlib import Path

from validate_skills import validate

ROOT = Path(__file__).resolve().parents[1]
RENAMES = {"poteto-mode": "simplicit", "poteto-help": "simplicit-help", "setup-pstack": "setup-simplicit"}


class PortCoverageTests(unittest.TestCase):
    def test_every_upstream_skill_has_a_valid_adapter(self):
        sources = sorted((ROOT / "pstack").rglob("SKILL.md"))
        self.assertEqual(61, len(sources), "Review the mapping when updating the pinned snapshot")
        names = [RENAMES.get(p.parent.name, p.parent.name) for p in sources]
        self.assertEqual(len(names), len(set(names)))
        errors = validate(ROOT / "skills", names=names)
        self.assertEqual([], errors)

    def test_every_adaptation_retains_exact_upstream_license(self):
        license_bytes = (ROOT / "pstack/LICENSE").read_bytes()
        for skill in (ROOT / "skills").glob("*/SKILL.md"):
            with self.subTest(skill=skill.parent.name):
                self.assertEqual(license_bytes, (skill.parent / "LICENSE").read_bytes())

    def test_manifest_covers_every_source_and_resolves_portable_targets(self):
        manifest = json.loads((ROOT / "migration-map.json").read_text(encoding="utf-8"))
        for kind, pattern in (("skills", "**/SKILL.md"), ("playbooks", "skills/poteto-mode/playbooks/*.md")):
            expected = {str(p.relative_to(ROOT)).replace("\\", "/") for p in (ROOT / "pstack").glob(pattern)}
            entries = manifest[kind]
            self.assertEqual(expected, {item["source"] for item in entries})
            self.assertEqual(len(expected), len(entries))
            for item in entries:
                if kind == "skills":
                    source_name = Path(item["source"]).parent.name
                    expected_target = f"skills/{RENAMES.get(source_name, source_name)}/SKILL.md"
                    self.assertEqual(expected_target, item["target"])
                target = (ROOT / item["target"]).resolve()
                self.assertTrue(target.is_relative_to((ROOT / "skills").resolve()))
                self.assertTrue(target.is_file(), item["target"])

    def test_local_javascript_module_dependencies_are_packaged(self):
        for module in (ROOT / "skills").rglob("*.mjs"):
            text = module.read_text(encoding="utf-8")
            for target in re.findall(r'(?:from\s+|import\s*\()["\'](\.[^"\']+)["\']', text):
                dependency = (module.parent / target).resolve()
                self.assertTrue(dependency.is_relative_to((ROOT / "skills").resolve()))
                self.assertTrue(dependency.is_file(), f"{module.name}: {target}")


if __name__ == "__main__":
    unittest.main()
