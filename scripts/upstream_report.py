"""Read-only pstack change report. Never installs, adopts, fetches, or updates pins."""
import argparse
from collections import Counter, defaultdict
import difflib
import hashlib
import json
import os
from pathlib import Path, PurePosixPath
import re
import stat
import subprocess
import sys


class ReportError(ValueError):
    pass


def git(repo, *args, input_data=None):
    env = {k: v for k, v in os.environ.items() if not k.startswith("GIT_")}
    env.update(GIT_OPTIONAL_LOCKS="0", GIT_NO_LAZY_FETCH="1", GIT_NO_REPLACE_OBJECTS="1")
    result = subprocess.run(
        ["git", "-C", str(repo), *args], input=input_data, capture_output=True, env=env,
    )
    if result.returncode:
        raise ReportError(result.stderr.decode("utf-8", errors="replace").strip() or "Git read failed")
    return result.stdout


def object_id(value):
    return isinstance(value, str) and re.fullmatch(r"[0-9a-f]{40}|[0-9a-f]{64}", value)


def safe_path(value):
    if not isinstance(value, str) or not value or "\\" in value or ":" in value:
        raise ReportError(f"invalid resource path: {value!r}")
    path = PurePosixPath(value)
    if (not path.parts or path.is_absolute() or path.as_posix() != value or ".." in path.parts
            or any(part.endswith((".", " ")) for part in path.parts) or any(ord(c) < 32 for c in value)):
        raise ReportError(f"invalid resource path: {value!r}")
    return path


def read_local(root, name):
    relative = safe_path(name)
    if relative.parts[0].casefold() in {".git", "pstack"}:
        raise ReportError(f"not an adaptation or manifest path: {name}")
    path = root
    for part in relative.parts:
        path = path / part
        info = path.lstat()
        if stat.S_ISLNK(info.st_mode) or getattr(info, "st_reparse_tag", 0):
            raise ReportError(f"linked adaptation/manifest path: {name}")
    if not stat.S_ISREG(info.st_mode):
        raise ReportError(f"not a regular file: {name}")
    return path.read_bytes()


def json_object(pairs):
    result = {}
    for key, value in pairs:
        if key in result:
            raise ReportError(f"duplicate JSON key: {key}")
        result[key] = value
    return result


def parse_json(data):
    return json.loads(data.decode("utf-8"), object_pairs_hook=json_object)


def tree_files(repo, tree):
    result = {}
    for entry in git(repo, "ls-tree", "-r", "-z", tree).split(b"\0"):
        if not entry:
            continue
        metadata, raw_path = entry.split(b"\t", 1)
        mode, kind, oid = metadata.decode("ascii").split()
        name = "pstack/" + raw_path.decode("utf-8")
        safe_path(name)
        result[name] = {"mode": mode, "type": kind, "oid": oid}
    return result


def blob_contents(repo, entries):
    ids = sorted({item["oid"] for item in entries.values() if item["type"] == "blob"})
    if not ids:
        return {}
    output = git(repo, "cat-file", "--batch", input_data=("\n".join(ids) + "\n").encode("ascii"))
    cursor, contents = 0, {}
    for oid in ids:
        end = output.index(b"\n", cursor)
        header = output[cursor:end].decode("ascii").split()
        if len(header) != 3 or header[0] != oid or header[1] != "blob":
            raise ReportError(f"unavailable blob {oid}; prepare a complete local upstream repository first")
        size = int(header[2])
        cursor = end + 1
        data = output[cursor:cursor + size]
        if len(data) != size or output[cursor + size:cursor + size + 1] != b"\n":
            raise ReportError("incomplete Git blob response")
        contents[oid] = data
        cursor += size + 1
    return contents


def load_mapping(root, baseline, manifest, migration):
    if not isinstance(manifest, dict) or manifest.get("version") != 1:
        raise ReportError("unsupported resource map version")
    if set(manifest) != {"version", "upstream_commit", "upstream_tree", "resources"}:
        raise ReportError("unexpected resource map fields")
    if not isinstance(migration, dict):
        raise ReportError("migration map must be an object")
    for field in ("upstream_commit", "upstream_tree"):
        if not object_id(manifest.get(field)) or manifest[field] != migration.get(field):
            raise ReportError(f"resource map and migration map disagree on {field}")
    entries = manifest["resources"]
    if not isinstance(entries, list):
        raise ReportError("resources must be a list")
    mapped, local = {}, {}
    for entry in entries:
        if not isinstance(entry, dict) or set(entry) != {"source", "targets", "disposition", "reason"}:
            raise ReportError("invalid resource mapping fields")
        source, targets = entry["source"], entry["targets"]
        safe_path(source)
        if source not in baseline or source in mapped:
            raise ReportError(f"unknown or duplicate mapped source: {source}")
        if not isinstance(targets, list) or not all(isinstance(t, str) for t in targets) or len(set(targets)) != len(targets):
            raise ReportError(f"targets must be a unique list: {source}")
        if not isinstance(entry["disposition"], str) or entry["disposition"] not in {"adapted", "retained", "omitted"}:
            raise ReportError(f"invalid disposition: {source}")
        if (entry["disposition"] == "omitted") != (len(targets) == 0):
            raise ReportError(f"omitted sources alone must have no targets: {source}")
        if not isinstance(entry["reason"], str) or not entry["reason"].strip():
            raise ReportError(f"missing mapping rationale: {source}")
        for target in targets:
            if target not in local:
                local[target] = read_local(root, target)
        mapped[source] = entry
    if set(mapped) != set(baseline):
        raise ReportError("incomplete resource map; missing: " + ", ".join(sorted(set(baseline) - set(mapped))))
    for group in ("skills", "playbooks"):
        if not isinstance(migration.get(group), list):
            raise ReportError(f"migration map {group} must be a list")
        for entry in migration[group]:
            if not isinstance(entry, dict) or not isinstance(entry.get("source"), str) or not isinstance(entry.get("target"), str):
                raise ReportError(f"invalid migration map {group} entry")
            if entry["source"] not in mapped or entry["target"] not in mapped[entry["source"]]["targets"]:
                raise ReportError(f"resource map disagrees with migration route: {entry['source']}")
    return mapped, local


def sha256(data):
    return hashlib.sha256(data).hexdigest()


def diff_bytes(before, after, old_name, new_name):
    if b"\0" in before or b"\0" in after:
        return True, None
    try:
        left, right = before.decode("utf-8"), after.decode("utf-8")
    except UnicodeDecodeError:
        return True, None
    records = difflib.unified_diff(
        left.splitlines(keepends=True), right.splitlines(keepends=True),
        fromfile=old_name, tofile=new_name,
    )
    return False, "".join(line if line.endswith("\n") else line + "\n\\ No newline at end of file\n"
                          for line in records)


def compare(root, upstream_repo, ref):
    root = Path(root).resolve()
    raw_map = read_local(root, "upstream-resources.json")
    manifest = parse_json(raw_map)
    migration = parse_json(read_local(root, "migration-map.json"))
    if not isinstance(manifest, dict) or not object_id(manifest.get("upstream_tree")):
        raise ReportError("resource map must name an immutable upstream tree")
    baseline_tree = manifest["upstream_tree"]
    if git(root, "cat-file", "-t", baseline_tree).strip() != b"tree":
        raise ReportError("baseline is not a Git tree")
    baseline = tree_files(root, baseline_tree)
    old_blobs = blob_contents(root, baseline)
    mapped, local = load_mapping(root, baseline, manifest, migration)
    if not ref or ref.startswith("-") or any(ord(c) < 32 for c in ref):
        raise ReportError("invalid upstream revision")
    commit = git(upstream_repo, "rev-parse", "--verify", "--end-of-options", ref + "^{commit}").decode("ascii").strip()
    if not object_id(commit):
        raise ReportError("upstream revision did not resolve to one commit")
    candidate_tree = git(upstream_repo, "rev-parse", "--verify", commit + ":pstack").decode("ascii").strip()
    if not object_id(candidate_tree) or git(upstream_repo, "cat-file", "-t", candidate_tree).strip() != b"tree":
        raise ReportError("candidate has no pstack tree")
    candidate = tree_files(upstream_repo, candidate_tree)
    new_blobs = blob_contents(upstream_repo, candidate)
    removed, added = set(baseline) - set(candidate), set(candidate) - set(baseline)
    old_ids, new_ids = defaultdict(list), defaultdict(list)
    for source in removed:
        old_ids[tuple(baseline[source].values())].append(source)
    for source in added:
        new_ids[tuple(candidate[source].values())].append(source)
    pairs = []
    for identity in old_ids.keys() & new_ids.keys():
        if len(old_ids[identity]) == len(new_ids[identity]) == 1:
            old, new = old_ids[identity][0], new_ids[identity][0]
            pairs.append((old, new, "renamed"))
            removed.remove(old)
            added.remove(new)
    pairs += [(s, s, "modified") for s in set(baseline) & set(candidate) if baseline[s] != candidate[s]]
    pairs += [(s, None, "removed") for s in removed]
    pairs += [(None, s, "added") for s in added]
    changes = []
    for old, new, change in sorted(pairs, key=lambda p: p[1] or p[0]):
        entry = mapped.get(old)
        before, after = baseline.get(old), candidate.get(new)
        before_data = old_blobs.get(before["oid"], b"") if before else b""
        after_data = new_blobs.get(after["oid"], b"") if after else b""
        binary, diff = diff_bytes(before_data, after_data, old or "/dev/null", new or "/dev/null")
        mapping_status = ("unmapped" if entry is None else "omitted" if not entry["targets"]
                          else "mapped-rename" if change == "renamed" else "mapped")
        targets = [
            {"path": t, "sha256": sha256(local[t]),
             "content_relation_to_baseline": "identical" if local[t] == before_data else "different"}
            for t in entry["targets"]
        ] if entry else []
        changes.append({
            "source": new or old, "previous_source": old if change == "renamed" else None,
            "change": change, "before": before, "after": after,
            "mapping_status": mapping_status, "disposition": entry["disposition"] if entry else None,
            "reason": entry["reason"] if entry else "New resource: requires an explicit reviewed mapping.",
            "targets": targets, "binary": binary, "upstream_diff": diff,
            "requires_review": True,
        })
    counts = Counter(c["change"] for c in changes)
    return {
        "version": 1, "read_only": True, "adoption_enabled": False,
        "baseline": {"commit": manifest["upstream_commit"], "tree": baseline_tree, "files": len(baseline)},
        "candidate": {"commit": commit, "tree": candidate_tree, "files": len(candidate)},
        "mapping": {"covered": len(mapped), "targets": len(local), "sha256": sha256(raw_map),
                    "omitted": sum(e["disposition"] == "omitted" for e in mapped.values())},
        "summary": {**{k: counts[k] for k in ("modified", "added", "removed", "renamed")},
                    "unmapped": sum(c["mapping_status"] == "unmapped" for c in changes),
                    "unsupported_types": sum(any(i and i["mode"] not in {"100644", "100755"}
                                                for i in (c["before"], c["after"])) for c in changes)},
        "changes": changes,
    }


def markdown(report, include_diffs=False):
    def cell(text):
        return str(text).replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;").replace("|", "&#124;").replace(chr(96), "&#96;").replace("\n", " ")
    lines = [
        "# Upstream comparison (read-only)", "",
        f"Baseline: {report['baseline']['commit']} ({report['baseline']['files']} resources).",
        f"Candidate: {report['candidate']['commit']} ({report['candidate']['files']} resources).",
        f"Mapping coverage: {report['mapping']['covered']} baseline resources; {report['mapping']['targets']} adaptation targets.",
        "Adoption is disabled. No files, pins, installations, or Git refs were changed.", "",
        "Mappings identify review impact, not permission to replace adaptations. New resources require explicit mappings.",
        "Local target hashes describe current bytes; differing content is expected for adaptations and is not proof of a local regression.",
        "Renames are paired only when removed/added content and mode identify one unique pair; edited or ambiguous renames remain add/remove.",
        "Candidate worktree edits are excluded. Only the resolved commit is compared.", "",
        "Changes: " + ", ".join(f"{k}={v}" for k, v in report["summary"].items()) + ".", "",
        "| Change | Upstream resource | Mapping | Simplicit adaptations | Rationale |",
        "|---|---|---|---|---|",
    ]
    for row in report["changes"]:
        name = row["source"]
        if row["previous_source"]:
            name = row["previous_source"] + " → " + name
        targets = "; ".join(t["path"] for t in row["targets"]) or "—"
        lines.append("| " + " | ".join(cell(x) for x in (
            row["change"], name, row["mapping_status"], targets, row["reason"])) + " |")
    if not report["changes"]:
        lines.append("| unchanged | No upstream resource changes | complete | — | Local adaptations remain as they are. |")
    if include_diffs:
        for row in report["changes"]:
            lines += ["", "## " + cell(row["source"]), ""]
            if row["binary"]:
                lines.append("Binary content changed; compare blob IDs in the JSON report.")
            elif row["upstream_diff"]:
                lines.extend("    " + line for line in row["upstream_diff"].splitlines())
            else:
                lines.append("No textual diff; inspect path, mode, or type changes in the JSON report.")
    return "\n".join(lines) + "\n"


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--root", type=Path, default=Path(__file__).resolve().parents[1],
                        help="Simplicit Git checkout containing the pinned tree and resource map")
    parser.add_argument("--upstream-repo", type=Path, required=True, help="existing complete local upstream Git repository")
    parser.add_argument("--ref", required=True, help="upstream commit or ref; resolved once, never fetched")
    parser.add_argument("--format", choices=("markdown", "json"), default="markdown")
    parser.add_argument("--include-diffs", action="store_true", help="include upstream diffs in Markdown (JSON always includes them)")
    args = parser.parse_args()
    try:
        report = compare(args.root, args.upstream_repo, args.ref)
        output = json.dumps(report, indent=2, ensure_ascii=True) + "\n" if args.format == "json" else markdown(report, args.include_diffs)
    except (OSError, ValueError, UnicodeError) as error:
        parser.exit(2, f"Cannot compare upstream: {error}\n")
    sys.stdout.reconfigure(encoding="utf-8")
    sys.stdout.write(output)


if __name__ == "__main__":
    main()
