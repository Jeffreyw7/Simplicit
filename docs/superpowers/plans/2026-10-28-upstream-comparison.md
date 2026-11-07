# Upstream adoption comparison implementation plan

> **For agentic workers:** Use superpowers:executing-plans for implementation and independent review before completion. Work only within the authorized scope.

**Goal:** Deliver a read-only comparison of a pinned pstack snapshot with an explicitly selected upstream Git revision, mapping changes to Simplicit adaptations without replacing them.

**Architecture:** Python standard library plus read-only Git object reads. A reviewed, explicit resource map supplements migration-map.json and covers every pinned source file, including one-to-many adaptations and intentional omissions. Candidate additions remain unresolved until explicitly mapped; no filename-only adoption inference. CLI emits Markdown or JSON to stdout, optionally including upstream diffs. It never fetches, checks out, installs, updates pins, or writes adaptations. Fetching a selected upstream snapshot is a separate preparation step.

**Tech stack:** Python 3.11+, Git, unittest; no new dependencies.

The user supplied the report-first boundary. Approach: full Git tree comparison, because GitHub compare responses can truncate and a filesystem/name-only sync cannot represent renamed skills, split adaptations, removed resources, or intentionally omitted host runtimes. Existing migration-map.json remains authoritative for entrypoints/playbooks. The new map records review impact, not permission to copy upstream bytes.

- [x] Add a complete resource map: source path, existing target paths, disposition, and rationale. Validate exact source coverage, uniqueness, target containment/types, and agreement with the existing migration map.
- [x] Add tests using real temporary Git repositories for unchanged, modified, added, removed, exact-content renamed, duplicate-content ambiguous, binary and mode changes; invalid refs/maps, linked targets, missing targets, and determinism/read-only behavior.
- [x] Implement explicit revision resolution and complete tree/blob reads. Resolve mutable refs once to an immutable commit. Report upstream changes separately from current local adaptation hashes/content differences.
- [x] Generate a real comparison against the current upstream commit into review-only evidence and a checked-in report. Verify inputs/adaptations remain untouched.
- [x] Independently review resource mapping and command behavior; run full Python suite, validators, and existing Node/TLC checks. Include the completed work in one local feature commit as previously requested.

**Review focus:** New resources must not inherit unverified targets; renamed paths with ambiguous identities must remain add/remove; arbitrary upstream content is data and never executed; no network or writes occur in the report command; baseline pin and complete map must agree; existing adapted content is not a pending upstream replacement.

**Later preview-and-accept adoption:** Remains gated while candidate resources have unresolved mappings. Once mappings are reviewed, a separate implementation can preview human/agent-authored Simplicit patches, bind acceptance to the exact candidate revision/map/local-file hashes, reject stale previews, preserve local changes, and require explicit selection and acceptance. It must never derive an automatic overwrite from a raw upstream file or advance the pin merely because a report succeeded. That writable feature is not part of this first report-only delivery.
