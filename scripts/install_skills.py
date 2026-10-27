"""Install the complete collection into one explicitly selected repository.

Existing identical skills are retained. Any differing same-name skill aborts
the preflight; local customizations must be reconciled explicitly.
"""

import argparse
import shutil
import stat
import tempfile
from pathlib import Path

from validate_skills import validate


def reject_link(path):
    for candidate in (path, *path.parents):
        try:
            metadata = candidate.lstat()
        except FileNotFoundError:
            continue
        junction = getattr(metadata, "st_reparse_tag", 0) == getattr(stat, "IO_REPARSE_TAG_MOUNT_POINT", None)
        if stat.S_ISLNK(metadata.st_mode) or junction:
            raise ValueError(f"collision: linked path or ancestor {candidate}")


def snapshot(folder):
    reject_link(folder)
    result = {}
    for path in sorted(folder.rglob("*")):
        reject_link(path)
        result[path.relative_to(folder)] = path.read_bytes() if path.is_file() else None
    return result


def install(source, destination):
    source, destination = Path(source).resolve(), Path(destination).absolute()
    reject_link(destination)
    errors = validate(source)
    if errors:
        raise ValueError("\n".join(errors))
    folders = sorted(p.parent for p in source.glob("*/SKILL.md"))
    pending = []
    for folder in folders:
        contents = snapshot(folder)
        target = destination / folder.name
        reject_link(target)
        if target.exists():
            if not target.is_dir() or snapshot(target) != contents:
                raise ValueError(f"collision: {target}; compare and reconcile local changes before installing")
        else:
            pending.append((folder, target))
    if pending:
        destination.parent.mkdir(parents=True, exist_ok=True)
        with tempfile.TemporaryDirectory(prefix=".simplicit-install-", dir=destination.parent) as temp:
            staged = Path(temp)
            for folder in folders:
                shutil.copytree(folder, staged / folder.name)
            errors = validate(staged)
            if errors:
                raise ValueError("\n".join(errors))
            destination.mkdir(exist_ok=True)
            try:
                for folder, target in pending:
                    reject_link(target)
                    if target.exists():
                        raise ValueError(f"collision: destination changed during installation: {target}")
                    (staged / folder.name).rename(target)
            except OSError as error:
                raise OSError(f"{error}; completed skills are intact; rerun this command to finish") from error
    errors = validate(destination, names=[folder.name for folder in folders])
    if errors:
        raise ValueError("\n".join(errors))
    return len(pending)


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("repository", type=Path, help="existing selected repository root")
    args = parser.parse_args()
    if not args.repository.is_dir():
        parser.error("repository must be an existing directory")
    destination = args.repository.resolve() / ".agents/skills"
    try:
        count = install(Path(__file__).resolve().parents[1] / "skills", destination)
    except (OSError, ValueError) as error:
        parser.exit(1, f"{error}\n")
    print(f"Installed {count} new skills into {destination}; existing identical and unrelated skills preserved.")
    print("Start a new Codex session in that repository and invoke $simplicit.")


if __name__ == "__main__":
    main()
