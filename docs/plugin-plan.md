# Repository-root plugin implementation plan

The approved design is the attached November 6, 2026 request: use this repository
as the skills-only plugin and marketplace root. Implement on `main`, retain the
existing collection and project-local installer, and commit without pushing.

- [x] Inspect the actual candidate, existing edits, host help and official docs.
- [x] Write failing package tests, then implement `scripts/check_package.py`.
  Validate JSON identity, SemVer release policy, root containment, maintained
  skills and reviewer resources. Reuse skill/profile validators. Test real
  disposable files, relocation, malformed input, links and input preservation.
- [x] Fill `.codex-plugin/plugin.json` and `.agents/plugins/marketplace.json`.
  Keep one manifest and register only `./skills/` from source `./`.
- [x] Resolve resources relative to the selected skill location and pass exact
  absolute brief paths. Retain explicit project reviewer adoption and fallback.
- [x] Add deterministic package checking to the existing Windows/Linux CI job.
- [x] Test isolated native installation, discovery, refresh and bounded behavior
  where available; record actual blockers separately from passing static tests.
- [x] Update README and dated validation evidence, preserving historical notes.
- [x] Obtain independent critic review; repair supported findings and request
  focused follow-up. Check the final diff and commit the task changes on `main`.

Review focus: cache versus source paths; linked/escaping package resources;
duplicate skills; reviewer registration and model claims; configuration scope;
refresh instructions. No publication, MCP server, distribution build, new agent
profiles, changes to the critic settings, or edits to archived pstack/licenses.

Baseline: checkout started on `codex/simplicit-reliability` at `655eec3`, whose
tree matches merged `origin/main` at `a8e0d75`. Existing dirty work was the
November 3 validation entry/report plus two empty plugin metadata placeholders.
The existing `main` ref was fast-forwarded to `a8e0d75` and selected, preserving
those edits. The historical validation entry/report remain outside this commit.
