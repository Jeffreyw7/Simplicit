# Validation evidence

This record preserves the October 26, 2026 specialist evidence below, followed by candidate-specific reliability-update results. It distinguishes package checks, real execution trials, and review-based scenario evaluation. It does not establish native Codex discovery, every specialist's end-to-end behavior, or measured efficiency.

## Package checks

- All 15 skill entrypoints passed the standard Codex skill-creator metadata validator.
- The collection's validator found all local inline resource links and licenses in an isolated copy of the full skill collection. Its 48 files matched the source copy; root documentation links resolved and all license copies matched the upstream license.
- Twelve behavioral validator tests pass: valid sibling resources, missing resources, escaping links, folder/name mismatch, missing descriptions/licenses, code examples, nested links, empty collections, read-only validation, unrelated installed skills, and missing selected siblings.
- Seven invalid-package tests failed before the validator implementation. Two adoption-selection cases failed before that interface was added.
- Each adapted skill contains a copy of the original MIT license. The upstream source remains pinned separately; it is not required at execution time.

The historical package checks used Python 3.10+; the reliability update below raises the collection's tooling minimum to Python 3.11 for `tomllib`:

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

## Reliability update — October 26, 2026 (America/New_York)

### Candidate, scope, and host

- Starting checkout: clean `main`, revision `6c5cf96291c00262ad36d19db652849ea6b0e742`, equal to the requested review baseline. No newer changes were present to preserve; no applicable `AGENTS.md` was found in the checkout or inspected ancestor directories.
- Working candidate: local uncommitted diff on `codex/simplicit-reliability`, based on that same revision. It includes the critic, shared runtime/review routing, README, this record, two new agent-validation scripts, and `.github/workflows/validate.yml`. The final diff and untracked files are part of the candidate; HEAD alone does not identify it.
- Scope: Simplicit and disposable fixtures under ignored `.scratch/reliability-2026-10-26/`. No commit, push, PR, global configuration change, client installation, deployment, or adoption into a real project was performed.
- Host: Windows `10.0.26200.0`, PowerShell `7.6.5`, Git `2.51.2.windows.1`, Codex CLI `0.163.0`, bundled Python `3.12.14`. Local Python 3.11 execution and Linux execution are Not Run; the CI matrix requests Python 3.11 on both hosted platforms.
- `python` initially resolved to an inaccessible WindowsApps alias. Tests used the existing bundled runtime at `C:\Users\jeffr\.cache\codex-runtimes\codex-primary-runtime\dependencies\python\python.exe`; nothing was installed. The first unit-test attempt hit Windows temporary-directory access errors before assertions. Pointing process-local `TEMP` and `TMP` at owned workspace scratch resolved those errors without changing permissions or product code.
- `codex login status` reported ChatGPT authentication configured. `codex doctor --summary --ascii --no-color` reported startup/state-database access and network limitations in this sandbox. This is not evidence of database corruption or account/model unavailability. The active chat has independent-helper tools but no custom-role selector.

Current official documentation was read on this date: [custom agents and inherited permissions](https://learn.chatgpt.com/docs/agent-configuration/subagents), [native skill discovery](https://learn.chatgpt.com/docs/build-skills), and [configuration reference](https://learn.chatgpt.com/docs/config-file/config-reference). The installed CLI's help confirms `read-only`, `workspace-write`, and `danger-full-access` as parent sandbox values; it does not establish custom-role loading. The shipped `gpt-6.1-sol` / `high` choices remain unchanged. Parser validation is a narrower Simplicit policy, not a complete host schema validator or proof of account access.

### Executed deterministic checks

All source commands ran from `C:\Users\jeffr\OneDrive\Desktop\Simplicit`. This PowerShell setup reproduces the local runtime and writable temporary location (changes apply only to that process):

```powershell
$runtime = 'C:\Users\jeffr\.cache\codex-runtimes\codex-primary-runtime\dependencies\python'
$env:PATH = "$runtime;$env:PATH"
New-Item -ItemType Directory -Force '.scratch/reliability-2026-10-26/tmp' | Out-Null
$env:TEMP = (Resolve-Path '.scratch/reliability-2026-10-26/tmp').Path
$env:TMP = $env:TEMP
python -B -m unittest discover -s scripts -p 'test_*.py'
python -B scripts/validate_skills.py
python -B scripts/validate_agents.py
```

| Check | Observed result and coverage |
|---|---|
| Before edits: existing unit suite | 12 tests passed after the temporary-directory adjustment. |
| Before edits: skill validator | Passed for all 15 shipped skills. |
| New agent tests before implementation | Initial missing-module error, then 71 assertion failures against a no-op scaffold; 22 test methods, 2 unsupported symlink subcases skipped. The scaffold was replaced by the real implementation. |
| Implemented validator against original critic | Failed on `sandbox_mode`, as required. After removing it, passed for 1 agent. |
| Integrated suite including adoption | 35 test methods passed, with 2 symlink subcases skipped because this sandbox cannot create links. Existing 12 skill tests and their destination semantics are unchanged. |
| Source validators | Passed: 15 skills and 1 agent. |
| Complete copied destinations | Both CLI validators passed against `.scratch/reliability-2026-10-26/native/.agents/skills` and `.scratch/reliability-2026-10-26/native/.codex/agents`. |
| Collision/preservation fixture | `test_complete_adoption_preserves_unrelated_destination_files` copies the whole collection and critic into a fresh temporary destination containing an unrelated skill, an unrelated malformed agent, and `AGENTS.md`. Byte snapshots confirm all inputs are unchanged by validation and all three sentinels survive adoption. This is a test of disjoint fixture copying, not an overwrite/merge installer. |
| Local diff whitespace | `git diff --check` passed. |
| Hosted CI | Not Run. Workflow added with `contents: read`, Linux/Windows and Python 3.11, unit tests and both validators. No secrets, model calls, publishing, or automatic adoption. |

The agent tests cover real TOML syntax, absent/empty/wrong-type required fields, names and filenames, duplicate shipped names, optional model field types, unsupported permission/session overrides, empty/missing source inventories, missing destination critic, unrelated destination profiles, invalid UTF-8, non-file profiles, input preservation, and CLI exit/count behavior. Symlink containment tests remain in the suite for hosts that support creating them. Validators never modify input files or call models.

Retained local evidence is under `.scratch/reliability-2026-10-26/`: `baseline-tests.txt`, `agents-red.txt`, `tests-green.txt`, `tests-adoption.txt`, `host-doctor.txt`, and `native-mechanical.jsonl`. Scratch is ignored and not part of the distributable package. The tests above recreate the deterministic cases without relying on these logs. To reproduce adoption alone, run:

```sh
python -B -m unittest discover -s scripts -p 'test_validate_agents.py'
```

### Native trials and remaining limits

A complete copied collection and critic were prepared in a new scratch `native/` directory. Its `README.md` contained `Simplicit reliablity fixture.`. The native mechanical trial used the following actual command from the source checkout (with the Python/temporary environment above):

```powershell
codex --no-daemon exec --ephemeral --json --sandbox workspace-write -C '.scratch/reliability-2026-10-26/native' -m gpt-6.1-sol '$simplicit Correct reliablity to reliability in README.md only. This is a mechanical edit. Check the result, preserve all other files, and report available custom role discovery separately. Do not spawn a reviewer, commit, install, or modify any configuration.'
```

It failed before model execution with `failed to initialize in-process app-server client: Access is denied. (os error 5)`, alongside state-database access warnings. The README typo remained unchanged. No permission bypass, authentication copying, global config edit, or client upgrade was attempted. Authentication configuration and copied files do not establish model execution or native role discovery.

| Native acceptance trial | Status |
|---|---|
| Native skill and critic discovery; pinned model execution through that role | Blocked at fresh CLI startup. |
| Mechanical edit with checks and no unnecessary reviewer | Blocked before execution; no behavior result. |
| One-prompt scratch bug fix through tests, independent review, supported repairs, and final evidence | Not Run because fresh native startup is blocked. |
| Separate review-only fixture through native discovery | Not Run; an explicit file-loaded in-chat trial is recorded separately below. |
| Missing runtime/role capabilities remain pending | Actual startup blocker and missing role-selector interface recorded; no pass substituted. |
| Reassess changed configuration; reuse unchanged evidence across phases | Deterministic evidence: original critic failed the new validator, then the corrected profile was rechecked and passed. Changed runtime links were revalidated. This is not a native behavioral proof of evidence reuse. |

For a future native retry, use a new disposable directory, copy the entire skills collection and critic after inventorying collisions, and start a fresh authenticated session there. Confirm native paths/role selection before treating discovery as proven. For the meaningful fix and separate review-only cases, seed `ledger.py` with this intentionally defective implementation and the contract in the README starting prompt:

```python
class Ledger:
    def __init__(self):
        self.balance = 0
        self.receipts = set()

    def credit(self, request_id, amount):
        if amount < 0:
            raise ValueError("negative amount")
        self.receipts.add(request_id)
        self.balance += amount
        return self.balance
```

Seed tests that distinct requests add (`2 + 3 == 5`) and a negative amount raises `ValueError`. Invoke the complete README starting prompt for the fix; require an executed duplicate-retry regression before and after the repair and an actual independent review. In a separate unchanged copy, request review only with the same contract and inspect hashes and helper activity afterward. If review finds no needed repair, record that the review-driven repair loop was not exercised. To test evidence invalidation, change a relevant fixture/configuration input after a pass, verify that affected coverage is reassessed, and verify unchanged valid coverage is reused. Do not represent these reproduction instructions as executed trials.

### Independent review and preservation

The generic in-chat reviewer ran successfully on the requested `gpt-6.1-sol` / `high` settings, since this host does not expose a `critic` role selector. It received an explicit bounded reviewer brief, not the parent's transcript. This establishes an available independent execution path on that requested model in this chat, not native custom-role loading. The modified critic is itself an artifact to inspect rather than an authority approving its own changes.

The actual separate review-only trial used `.scratch/reliability-2026-10-26/review-only/` with the defective ledger above and the two seed tests. The assigned reviewer directly performed the bounded review, spawned no reviewer, and reported the duplicate-credit defect at `ledger.py:9`: two calls with `("retry", 10)` returned `10`, then `20`, violating the required `10`. Its two seed tests passed; focused diagnostics also confirmed distinct IDs add and negatives reject. After return, the lead compared both files' SHA-256 hashes with the pre-review snapshot and found no edits. This was actual execution with explicitly loaded Interrogate instructions; it was not native discovery. The intentional defect remains in the review-only fixture. No repair loop is claimed for that read-only assignment.

The review-only trial's exact PowerShell command and observed output summary are retained in `.scratch/reliability-2026-10-26/review-diagnostic.txt`. Its exit 0 reflects the seed suite passing; the printed retry values establish the defect. The same independent candidate reviewer checked the later workflow-trial evidence additions against actual fixture files and hashes, found no supported corrections, and did not rerun unchanged checks.

The primary independent candidate review returned **PASS, no actionable findings** after inspecting all 10 changed/new files, including the modified critic's text/configuration independently. It verified the candidate hashes before and after review, independently reran the 35-method suite (2 symlink subcases skipped), both source validators, and `git diff --check`. Both new Python files also parsed under Python 3.11 grammar; this is not a Python 3.11 execution trial. No supported candidate defect required a repair or repair review. Later evidence-only additions to this record do not invalidate unchanged code/configuration checks.

### Additional executed workflow trial (explicit file loading)

A separate `.scratch/reliability-2026-10-26/bug-fix/` copy contained the complete skills, critic, defective ledger, and two seed tests. One compact prompt assigned a fixture lead the acceptance criteria, allowed local implementation/tests, and explicitly allowed exactly one independent reviewer. It continued through all stages without manual chat coordination. This supplements the blocked native trials; it does not establish native discovery.

| Stage | Observed execution |
|---|---|
| Original baseline | `python -B -m unittest -v test_ledger`: 2 tests passed. |
| Regression before repair | Same command: 4 tests ran; duplicate retry failed with `AssertionError: 2 != 4`. A negative-retry test also checked validation order. |
| Implemented repair | After rejecting negatives, return the current balance if the request ID already has a receipt; otherwise credit and record it. Same command: all 4 tests passed. |
| Actual independent review | One generic reviewer on `gpt-6.1-sol` / `high`, separate from the implementing lead, inspected the final fixture and reran its 4 tests. Result: PASS, no findings. It spawned no further helpers. |
| Final lead verification | `python -B -m unittest discover -v`: 4 tests passed after review; candidate hashes unchanged. |
| Parent integration check | Inspected actual files and retained evidence, then `python -B -m unittest discover -s . -p 'test_*.py' -v`: all 4 tests passed, exit 0. Copied skills/critic still match source bytes, and all reviewed source/configuration files remain unchanged. |

All table commands ran from the `bug-fix/` directory with the bundled Python 3.12.14 executable identified above. The implementing lead retained exact commands, hashes, review identity/disposition, and limits in `bug-fix/evidence.txt`. Final fixture hashes: `ledger.py` = `185418881062EE1BB34E7EC00F7583D9F1A52CB1EB85197EA88D9B03199CCAEB`; `test_ledger.py` = `98ACD96D8131D2F0E789EDE69A35841ED11C3F8D1E5F0979B86D5406CA2EE2E1`. The receipt fix and tests are disposable fixture content, not product changes.

No review-driven repair loop occurred: the original defect was fixed before review, and review found no further defect. The current host's generic reviewer path worked on the configured model, while custom critic loading remains unverified. Persistence, concurrency, and conflicting amounts for one ID were outside the stated fixture contract. Task-wide helpers were limited to three contexts: one reviewer reused for the separate read-only trial and primary candidate review; one fixture lead; and its one required independent reviewer. Completed helper records remain because this host exposes no record-deletion operation.

The initial `pstack/` snapshot contains 200 files, with tree object `880564357e051d7c7802da1cb5d8df1d0b008299`; a full-file SHA-256 inventory is retained locally in `pstack-before.json`. Both lead and reviewer confirmed all 200 file paths and byte hashes still matched, no tracked diff or untracked additions existed under `pstack/`, and license files were unchanged. No token, cost, speed, or quality savings are claimed.
