"""Read-only checks for Simplicit's repository-root compatibility package.

Python 3.11+, standard library only. This is a focused package policy check,
not a complete host schema validator or proof of native discovery/execution.
"""

import argparse
import json
import os
import re
from pathlib import Path

from install_skills import reject_link
from validate_agents import validate as validate_agents
from validate_skills import validate as validate_skills


ROOT = Path(__file__).resolve().parents[1]
MANIFEST = ".codex-plugin/plugin.json"
CATALOG = ".agents/plugins/marketplace.json"
RUNTIME_RESOURCES = (
    "skills/simplicit/SKILL.md",
    "skills/simplicit-help/SKILL.md",
    "skills/simplicit/references/runtime.md",
    "skills/simplicit/references/simplicit-agent.md",
    "skills/simplicit/references/worker-routing.md",
    "skills/interrogate/references/reviewer-prompt.md",
    "skills/no-comments/references/comment-review.md",
    ".codex/agents/critic.toml",
    ".codex/agents/comment-sicko.toml",
    ".codex/agents/coder-light.toml",
    ".codex/agents/coder-medium.toml",
    ".codex/agents/coder-hard.toml",
)
SEMVER = re.compile(
    r"(0|[1-9][0-9]*)\.(0|[1-9][0-9]*)\.(0|[1-9][0-9]*)"
    r"(?:-((?:0|[1-9][0-9]*|[0-9]*[A-Za-z-][0-9A-Za-z-]*)"
    r"(?:\.(?:0|[1-9][0-9]*|[0-9]*[A-Za-z-][0-9A-Za-z-]*))*))?"
    r"(?:\+[0-9A-Za-z-]+(?:\.[0-9A-Za-z-]+)*)?"
)


def read_object(path):
    try:
        with path.open(encoding="utf-8") as stream:
            value = json.load(stream)
    except (OSError, UnicodeError, ValueError) as exc:
        raise ValueError(f"{path.as_posix()}: cannot read JSON: {exc}") from exc
    if not isinstance(value, dict):
        raise ValueError(f"{path.as_posix()}: expected JSON object")
    return value


def contained_tree(path):
    reject_link(path)
    for directory, folders, files in os.walk(path, followlinks=False, onerror=raise_error):
        for name in folders + files:
            reject_link(Path(directory) / name)


def raise_error(error):
    raise error


def check_metadata(manifest):
    errors = []
    if "description" in manifest and not isinstance(manifest["description"], str):
        errors.append(f"{MANIFEST}: description must be a string")
    if "author" in manifest and not isinstance(manifest["author"], dict):
        errors.append(f"{MANIFEST}: author must be an object")
    interface = manifest.get("interface", {})
    if not isinstance(interface, dict):
        return errors + [f"{MANIFEST}: interface must be an object"]
    for field in ("displayName", "shortDescription", "longDescription", "developerName", "category"):
        if field in interface and (not isinstance(interface[field], str) or not interface[field].strip()):
            errors.append(f"{MANIFEST}: interface.{field} must be a nonempty string")
    if "defaultPrompt" in interface:
        prompts = interface["defaultPrompt"]
        if isinstance(prompts, str):
            prompts = [prompts]
        if not isinstance(prompts, list) or not 1 <= len(prompts) <= 3 or any(
            not isinstance(prompt, str) or not prompt.strip() for prompt in prompts
        ):
            errors.append(f"{MANIFEST}: interface.defaultPrompt must contain one to three nonempty prompts")
    return errors


def validate(root):
    errors = []
    try:
        root = Path(root).absolute()
        reject_link(root)
        root = root.resolve()
        for component in (".codex-plugin", ".agents/plugins", "skills", ".codex/agents"):
            contained_tree(root / component)
        for name in ("plugin.json", ".mcp.json", "mcp.json", ".app.json", "hooks/hooks.json", "commands"):
            if (root / name).exists() or (root / name).is_symlink():
                errors.append(f"{name}: outside Simplicit's single-manifest, skills-only package policy")
        manifest = read_object(root / MANIFEST)
        catalog = read_object(root / CATALOG)
        errors.extend(check_metadata(manifest))
        if manifest.get("name") != "simplicit":
            errors.append(f"{MANIFEST}: name must be simplicit")
        version = manifest.get("version")
        if not isinstance(version, str) or not SEMVER.fullmatch(version):
            errors.append(f"{MANIFEST}: version must follow Simplicit's SemVer release policy")
        if manifest.get("skills") != "./skills/":
            errors.append(f"{MANIFEST}: skills must register only ./skills/")
        for field in ("mcpServers", "apps", "hooks", "commands"):
            if field in manifest:
                errors.append(f"{MANIFEST}: {field} is outside the skills-only package policy")
        if catalog.get("name") != "simplicit":
            errors.append(f"{CATALOG}: marketplace name must be simplicit")
        entries = catalog.get("plugins")
        if not isinstance(entries, list) or len(entries) != 1 or not isinstance(entries[0], dict):
            errors.append(f"{CATALOG}: plugins must contain the single Simplicit package")
        else:
            entry = entries[0]
            if entry.get("name") != manifest.get("name"):
                errors.append(f"{CATALOG}: plugin name must match the manifest name")
            source = entry.get("source")
            if not isinstance(source, dict) or source.get("source") != "local" or source.get("path") != "./":
                errors.append(f"{CATALOG}: source must be local ./ (the repository root)")
            policy = entry.get("policy")
            if not isinstance(policy, dict) or policy.get("installation") != "AVAILABLE" or policy.get("authentication") != "ON_INSTALL":
                errors.append(f"{CATALOG}: policy must retain AVAILABLE and ON_INSTALL")
            if not isinstance(entry.get("category"), str) or not entry["category"].strip():
                errors.append(f"{CATALOG}: category must be a nonempty string")
        for name in RUNTIME_RESOURCES:
            if not (root / name).is_file():
                errors.append(f"{name}: missing selected runtime/reviewer resource")
        errors.extend(validate_skills(root / "skills"))
        errors.extend(validate_agents(source_root=root / ".codex/agents"))
    except (OSError, UnicodeError, ValueError, RuntimeError) as exc:
        errors.append(str(exc))
    return errors


def main(argv=None):
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("root", nargs="?", type=Path, default=ROOT)
    args = parser.parse_args(argv)
    errors = validate(args.root)
    if errors:
        print("\n".join(errors))
        return 1
    count = len(list((args.root / "skills").glob("*/SKILL.md")))
    print(f"Valid package: simplicit@simplicit; {count} skills; resources and profiles present.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
