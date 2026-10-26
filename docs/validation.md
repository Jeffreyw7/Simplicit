# Validation evidence

This record covers the October 26, 2026 Simplicit specialist revision. It distinguishes package checks, a real execution trial, and review-based scenario evaluation. It does not establish native Codex discovery, every specialist's end-to-end behavior, or measured efficiency.

## Package checks

- All 15 skill entrypoints passed the standard Codex skill-creator metadata validator.
- The collection's validator found all local inline resource links and licenses in an isolated copy of the full skill collection. Its 48 files matched the source copy; root documentation links resolved and all license copies matched the upstream license.
- Twelve behavioral validator tests pass: valid sibling resources, missing resources, escaping links, folder/name mismatch, missing descriptions/licenses, code examples, nested links, empty collections, read-only validation, unrelated installed skills, and missing selected siblings.
- Seven invalid-package tests failed before the validator implementation. Two adoption-selection cases failed before that interface was added.
- Each adapted skill contains a copy of the original MIT license. The upstream source remains pinned separately; it is not required at execution time.

Reproduce the package checks with Python 3.10+:

```sh
python -B -m unittest discover -s scripts -p 'test_*.py'
python -B scripts/validate_skills.py
python -B scripts/validate_skills.py /path/to/copied/.agents/skills
```

The package validator uses this source checkout's skill names when checking a destination. It intentionally leaves unrelated installed skills out of its checks. It supports the simple frontmatter and inline-link style used here; it does not validate Markdown heading anchors or arbitrary YAML schemas.

## Real regression trial

A bounded worker explicitly loaded a copied `simplicit` entrypoint, runtime contract, bug-fix playbook, `tdd`, and engineering reference. It operated only in a scratch Python fixture, without modifying reusable skills or spawning another helper.

The fixture's in-memory ledger recorded request IDs but credited the balance on every retry. Acceptance was deliberately narrow: retrying the same ID with the same positive amount credits once, distinct requests still add, and negative amounts remain rejected.

The worker added the regression before changing the implementation and ran `python -B -m unittest -v`:

```text
Before repair: duplicate retry FAIL, AssertionError: 2 != 4
Existing two tests: PASS
After repair: all 3 tests PASS, exit 0
```

The fix checks an existing receipt after negative-amount validation and returns the unchanged current balance for retries. The parent inspected the actual fixture, tests, and retained trial record and independently reran all three tests successfully. The fixture and logs remain in ignored workspace scratch rather than becoming product code.

This trial used explicit file-based skill loading, not Codex's native selector. It did not test persistence, concurrency, conflicting retry amounts, or a real project's runtime. It is evidence that the adapted routing and focused regression procedure were usable in this host, with those limits.

## Independent review

Before implementation, a reviewer found three plan defects: concrete source hazards were underspecified, meaningful behavior-preserving refactors lacked an explicit review gate, and installation collision handling was ambiguous. All were corrected and the reviewer approved implementation before skill edits began.

The final independent reviewer inspected the complete candidate, including new files, specialist references, validator implementation, adoption instructions, and actual scratch fixture. The reviewer independently ran the 12 validator tests, validated all 15 skills, reran the three fixture tests, and confirmed no upstream changes. Verdict: approved for Draft PR preparation, with no actionable findings.

The reviewer also evaluated these hypothetical scenarios by reading the instructions. These were not live host executions:

| Scenario | Evaluated behavior |
|---|---|
| Read-only why and teach | Targeted investigation, preserved confidence, no edits/messages or obligatory panel/diagram. |
| Consequential behavior-preserving refactor | Contracts, verification, and independent candidate review still required. |
| Direct interrogate with changed dependencies but unchanged SHA, and no independent tool | Invalidate affected stale evidence; report independent review pending; no review-only repairs. |
| Direct arena without workers or model diversity | Disclose lead-authored sketches; explicitly requested independence/diversity remains unmet. |
| Verification maintenance without runtime or deletion capability | Report incomplete live coverage as blocked and deletion unavailable; preserve product-code scope. |

The original imported Git subtree remains `880564357e051d7c7802da1cb5d8df1d0b008299`, with no tracked or untracked source additions under `pstack/`.

## Remaining limits

- No native Codex skill-selector/automatic-discovery session was launched.
- The 12 specialists were not all exercised against live projects or every supported application surface.
- No model-diversity, cloud-agent, formal-verification, or automatic deletion capability is claimed.
- No token, cost, speed, or quality benchmark was performed.
- Installation into another selected project has not been performed by this revision.
