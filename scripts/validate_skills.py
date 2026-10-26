"""Check this package's flat frontmatter, licenses, and inline Markdown links.

This is not a general YAML/Markdown parser or a host execution test. Use simple
single-line frontmatter and inline links in this instruction-only collection.
"""

import argparse
import re
from pathlib import Path
from urllib.parse import unquote, urlsplit


def prose(text):
    """Exclude examples before looking for local resource links."""
    text = re.sub(r"(?ms)^```[^\n]*\n.*?^```\s*$", "", text)
    return re.sub(r"`[^`\n]*`", "", text)


def validate(root, names=None):
    root = Path(root).resolve()
    errors = []
    skills = sorted(root.glob("*/SKILL.md")) if names is None else [root / name / "SKILL.md" for name in sorted(names)]
    if not skills:
        return [f"{root}: no skills found"]
    for skill in skills:
        if not skill.resolve().is_relative_to(root):
            errors.append(f"{skill}: outside collection")
            continue
        if not skill.is_file():
            errors.append(f"{skill}: missing skill")
            continue
        text = skill.read_text(encoding="utf-8")
        header = re.match(r"\A---\r?\n(.*?)\r?\n---(?:\r?\n|$)", text, re.S)
        fields = dict(re.findall(r"(?m)^([a-z-]+):[ \t]*(.+)$", header[1])) if header else {}
        name = fields.get("name", "").strip().strip("\"'")
        if name != skill.parent.name or not re.fullmatch(r"[a-z0-9]+(?:-[a-z0-9]+)*", name):
            errors.append(f"{skill}: name must match the folder name")
        if not fields.get("description", "").strip().strip("\"'"):
            errors.append(f"{skill}: missing description")
        license_file = skill.parent / "LICENSE"
        if not license_file.resolve().is_relative_to(root):
            errors.append(f"{license_file}: outside collection")
        elif not license_file.is_file() or not license_file.read_text(encoding="utf-8").strip():
            errors.append(f"{skill}: missing LICENSE")
    docs = {doc for skill in skills if skill.parent.resolve().is_relative_to(root) for doc in skill.parent.rglob("*.md")}
    for doc in sorted(docs):
        if not doc.resolve().is_relative_to(root):
            errors.append(f"{doc}: outside collection")
            continue
        for match in re.finditer(r"\[[^\]\n]*\]\((<[^>]+>|[^\s)]+)(?:\s+\"[^\"]*\")?\)", prose(doc.read_text(encoding="utf-8"))):
            link = match[1].strip("<>")
            parsed = urlsplit(link)
            if parsed.scheme in {"https", "http", "mailto"}:
                continue
            path = unquote(parsed.path)
            if not path:
                continue
            target = (doc.parent / path).resolve()
            if parsed.scheme or parsed.netloc or not target.is_relative_to(root):
                errors.append(f"{doc}: outside collection: {link}")
            elif not target.exists():
                errors.append(f"{doc}: missing target: {link}")
    return errors


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("root", nargs="?", type=Path, default=Path(__file__).resolve().parents[1] / "skills")
    args = parser.parse_args()
    source_root = Path(__file__).resolve().parents[1] / "skills"
    names = [path.parent.name for path in source_root.glob("*/SKILL.md")]
    try:
        errors = validate(args.root, names=names)
    except (OSError, UnicodeError, ValueError) as exc:
        errors = [str(exc)]
    if errors:
        print("\n".join(errors))
        return 1
    print(f"Valid collection: {len(names)} skills; local links and licenses present.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
