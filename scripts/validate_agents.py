"""Validate Simplicit's TOML profile policy, not host loading or model access.

Python 3.11+; standard library only. An optional destination is checked only
for profiles selected by this checkout's source inventory. Inputs are read-only.
"""

import argparse
import re
import tomllib
from pathlib import Path

SOURCE_ROOT = Path(__file__).resolve().parents[1] / ".codex" / "agents"
REQUIRED_PROFILES = {"critic.toml", "comment-sicko.toml"}
REQUIRED_FIELDS = {"name", "description", "developer_instructions"}
OPTIONAL_FIELDS = {"model", "model_reasoning_effort", "model_reasoning_summary", "model_verbosity"}


def check_profiles(root, filenames, label):
    errors = []
    seen = {}
    for filename in filenames:
        path = root / filename
        if not re.fullmatch(r"[a-z0-9]+(?:-[a-z0-9]+)*\.toml", filename):
            errors.append(f"{path}: filename must be a lowercase kebab-case name.toml")
            continue
        try:
            if not path.resolve().is_relative_to(root):
                errors.append(f"{path}: outside {label} directory")
                continue
            if not path.is_file():
                errors.append(f"{path}: missing expected {label} profile")
                continue
            with path.open("rb") as stream:
                profile = tomllib.load(stream)
        except (OSError, UnicodeError, ValueError, RuntimeError) as exc:
            errors.append(f"{path}: cannot read TOML: {exc}")
            continue
        for field in sorted(REQUIRED_FIELDS | (OPTIONAL_FIELDS & profile.keys())):
            value = profile.get(field)
            if not isinstance(value, str) or not value.strip():
                errors.append(f"{path}: {field} must be a nonempty string")
        name = profile.get("name")
        if isinstance(name, str):
            if name != path.stem:
                errors.append(f"{path}: name must match expected filename stem {path.stem!r}")
            if name in seen:
                errors.append(f"{path}: duplicate agent name {name!r} (also {seen[name]})")
            seen[name] = path
        for field in sorted(profile.keys() - REQUIRED_FIELDS - OPTIONAL_FIELDS):
            errors.append(f"{path}: unsupported field {field!r} under Simplicit policy; "
                          "session permissions and capabilities belong to the host/parent")
    return errors


def validate(root=None, *, source_root=SOURCE_ROOT):
    try:
        source = Path(source_root).resolve()
        destination = source if root is None else Path(root).resolve()
        if not source.is_dir():
            return [f"{source}: missing source agents directory"]
        filenames = sorted(path.name for path in source.glob("*.toml"))
        errors = []
        if not filenames:
            errors.append(f"{source}: no agents in expected source inventory")
        for filename in sorted(REQUIRED_PROFILES - set(filenames)):
            errors.append(f"{source / filename}: missing expected source profile")
        errors.extend(check_profiles(source, filenames, "source"))
        if destination != source:
            if not destination.is_dir():
                errors.append(f"{destination}: missing destination agents directory")
            else:
                errors.extend(check_profiles(destination, filenames, "destination"))
        return errors
    except (OSError, ValueError, RuntimeError) as exc:
        return [f"Cannot inspect agents directory: {exc}"]


def main(argv=None, *, source_root=SOURCE_ROOT):
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("root", nargs="?", type=Path, help="copied .codex/agents directory")
    args = parser.parse_args(argv)
    errors = validate(args.root, source_root=source_root)
    if errors:
        print("\n".join(errors))
        return 1
    count = len(list(Path(source_root).glob("*.toml")))
    print(f"Valid profiles: {count} agent(s); TOML and Simplicit policy only.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
