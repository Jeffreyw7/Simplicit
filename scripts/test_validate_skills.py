"""Behavioral tests for validating a relocatable skill collection."""

import tempfile
import unittest
from pathlib import Path

from validate_skills import validate


class CollectionTests(unittest.TestCase):
    def setUp(self):
        self.temp = tempfile.TemporaryDirectory()
        self.addCleanup(self.temp.cleanup)
        self.root = Path(self.temp.name) / "skills"
        self.root.mkdir()

    def skill(self, name="one", body="", metadata=None):
        folder = self.root / name
        folder.mkdir(exist_ok=True)
        (folder / "SKILL.md").write_text(
            metadata or f"---\nname: {name}\ndescription: Use for {name}.\n---\n{body}",
            encoding="utf-8",
        )
        (folder / "LICENSE").write_text("MIT License\nCopyright example\n", encoding="utf-8")
        return folder

    def test_valid_relocated_collection_with_cross_skill_reference(self):
        self.skill(body="[Other](../two/SKILL.md) [Docs](https://example.com/a)")
        self.skill("two")
        self.assertEqual([], validate(self.root))

    def test_missing_referenced_resource(self):
        self.skill(body="[Guide](references/missing.md)")
        self.assertTrue(any("missing target" in e for e in validate(self.root)))

    def test_existing_resource_outside_collection_is_rejected(self):
        (self.root.parent / "private.md").write_text("not packaged", encoding="utf-8")
        self.skill(body="[Outside](../../private.md)")
        self.assertTrue(any("outside collection" in e for e in validate(self.root)))

    def test_name_must_match_folder(self):
        self.skill(metadata="---\nname: different\ndescription: Example.\n---\n")
        self.assertTrue(any("folder name" in e for e in validate(self.root)))

    def test_missing_description(self):
        self.skill(metadata="---\nname: one\n---\n")
        self.assertTrue(any("description" in e for e in validate(self.root)))

    def test_missing_attribution(self):
        (self.skill() / "LICENSE").unlink()
        self.assertTrue(any("LICENSE" in e for e in validate(self.root)))

    def test_code_examples_do_not_become_dependencies(self):
        self.skill(body="```md\n[Example](missing.md)\n```\n`[Example](also-missing.md)`")
        self.assertEqual([], validate(self.root))

    def test_nested_resource_link_is_checked(self):
        folder = self.skill(body="[Guide](references/guide.md)")
        (folder / "references").mkdir()
        (folder / "references/guide.md").write_text("[Missing](missing.md)", encoding="utf-8")
        self.assertTrue(any("guide.md" in e and "missing target" in e for e in validate(self.root)))

    def test_empty_collection_is_invalid(self):
        self.assertTrue(any("no skills" in e for e in validate(self.root)))

    def test_validation_does_not_change_files(self):
        self.skill()
        before = {p.relative_to(self.root): p.read_bytes() for p in self.root.rglob("*") if p.is_file()}
        validate(self.root)
        after = {p.relative_to(self.root): p.read_bytes() for p in self.root.rglob("*") if p.is_file()}
        self.assertEqual(before, after)

    def test_selected_collection_preserves_unrelated_skill_conventions(self):
        self.skill()
        (self.skill("unrelated") / "LICENSE").unlink()
        self.assertEqual([], validate(self.root, names=["one"]))

    def test_missing_selected_skill_is_reported(self):
        self.skill()
        self.assertTrue(any("missing skill" in e for e in validate(self.root, names=["one", "two"])))


if __name__ == "__main__":
    unittest.main()
