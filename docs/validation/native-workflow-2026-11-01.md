# Native workflow acceptance — November 1, 2026

The repaired candidate completed the four bounded native acceptance checks below. This is an explicit-invocation acceptance test, not a comparative quality or automatic-selection benchmark. The initial run exposed an installer defect; that run is retained separately and is not relabeled as a clean pass.

## Candidate and environment

The tested working tree was based on `eff203a39438a3e5cc2d9b58d99cadfac60e30c0`, with the Statechart command correction and the installer/Windows regression repairs. Documentation was added afterward. Tested file SHA-256 values:

| File | SHA-256 |
|---|---|
| `scripts/install_skills.py` | `4f95c8d01866be897a337f4af71a79693b8198f7fb558ed6e5bafa758f0885fb` |
| `scripts/test_install_skills.py` | `38cb966e723bd5dd35d888bdebd34cc0b5c72d2d0c854c351a46fccb0e44c802` |
| `skills/statechart/SKILL.md` | `a8c6f06a5158318dc7b15ddb01ad45e250070878b6681607227dfdcedb57e9ac` |

Host: Windows, Codex CLI 0.165.0, Python 3.12.14. Each fresh project received all 62 skills through the shipped installer and both reviewer profiles through a separate collision-free copy. Both copied destinations validated. Native `skills/list` discovered all 62 project skills enabled. File hashes froze the complete installed collection, profiles, fixtures, prompts and harness before model execution.

The harness used `codex app-server --stdio` with persisted parents, `gpt-6-astra` / `medium`, provider-model fallback disabled and approval policy `never`. Implementation and mechanical cases used workspace-write restricted to their own project; review and evidence-reassessment turns used read-only policy. Tool network access was disabled. No personal/global configuration, project trust settings, credentials or model installation changed. Existing authentication was inherited by the approved host process. Project-trust warnings remained in stderr; actual role execution is evidenced separately below.

Explicit invocation used both `$simplicit` or `$interrogate` in text and a native `skill` input item pointing to the installed entrypoint. This follows the [app-server skill invocation protocol](https://learn.chatgpt.com/docs/app-server). It does not rely on a model guessing a skill name.

## Observed acceptance results

| Check | Executed result |
|---|---|
| One-prompt meaningful bug fix | Read the installed references; ran the two passing seed tests; added four regression tests and observed two failures before repair; fixed duplicate crediting; all six tests passed afterward. The lead continued through independent review and final verification without steering or a continuation prompt. |
| Actual independent reviewer | Native `critic` resolved to `gpt-6.1-sol` / `high`, with no spawn model/effort override. It independently ran all six tests and returned no actionable findings. No reviewer file-change event or recursive delegation was observed. |
| Independent integration oracle | A separate non-model check verified duplicate suppression, distinct IDs, current-balance return on retry, negative retry rejection before mutation, rejected-request recovery and the zero boundary. The complete six-test suite also independently passed before the next exercise. |
| Evidence invalidation and reuse | In a separately declared second turn on the same parent, the controller changed only `policy.MIN_AMOUNT` from 0 to 5. Independent execution and the native lead both observed five errors in the six-test suite. The lead rejected the earlier pass as current evidence, reused unchanged source-review evidence, performed a passing valid-amount diagnostic, and made no edits or delegation. It did not claim an installation-validation result it had not recorded. |
| Mechanical edit | A fresh parent changed only `recieve` to `receive` in README. The checker confirmed the exact expected bytes, no other changes and zero helpers. |
| Separate review-only fixture | A fresh assigned reviewer loaded Interrogate and its references, ran the two seed tests, and reproduced `credit("a", 2)` twice returning 2 then 4 instead of 2 then 2. It reported the defect and made no edits or helper calls. |
| Preservation and cleanup | Only `ledger.py` and `test_ledger.py` changed during repair, only README changed in the mechanical case, and no files changed in either read-only turn. All installed skills, profiles, sentinels and Git files were preserved. All four recovery threads were archived; all three recovery app-server processes exited normally with exit 0. |

The deliberate configuration mutation is retained in the fixture. Its resulting failing suite is the expected evidence-reassessment stimulus, not a failing repository test or an unrepaired ledger defect.

Recovery thread IDs:

- Bug-fix parent: `01a1955e-1797-7ed3-8fd1-37a26115c204`.
- Critic: `01a1955f-046a-7b52-ad3c-0729f3a72319`.
- Mechanical parent: `01a19560-6916-7872-9c61-417013466c5c`.
- Review-only parent: `01a19561-7bce-7281-bc69-b1917775de20`.

## Defect found by the initial native run

Python's `TemporaryDirectory` staging imposed creator-only Windows ACLs. Renaming copied skills into the destination retained those restrictions: host discovery and primary-skill injection worked, but sandbox commands could not read linked references. ACL inspection found protected owner/SYSTEM/Administrators-only skill roots. The native lead disclosed this limitation while completing a correct repair and an actual pinned critic review; that partial-access result is retained as evidence of the installer defect.

The installer now creates an exclusive UUID-named staging folder with ordinary inherited permissions. It retains preflight collision checks, staged validation, complete-folder publication and interrupted-install recovery. A Windows regression granted inheritable read access on a test-owned parent and demonstrated its loss at the installed skill root, entrypoint and nested reference before repair; all three checks pass afterward. Fresh native commands then read the installed references successfully.

Independent review found a second issue in the initial repair: plain staging cleanup could fail on an existing skill's read-only LICENSE after publishing a new skill. A regression reproduced the failure. Cleanup now makes only a failed staged path writable and retries the failed operation. The test confirms successful publication, no staging residue, preservation of source read-only status and idempotence. Independent follow-up found no remaining actionable issue in the repair.

Existing byte-identical installations remain a no-op and do not have their ACLs silently rewritten. A fresh installation or explicit reconciliation under the project's access policy is needed for previously affected copies.

The first cohort stopped after its bug-fix and reassessment turns exposed the defect; its mechanical/review cases were not run. After repair, all three projects and all native parents were fresh. The same task prompts and behavioral fixtures were retained. Initial parent `01a19556-0663-7131-b8c4-0bd5dae6f616` and critic `01a19556-e109-7263-94c4-ada19b02a58d` were also archived and their server exited 0. Initial and repaired outcomes were not pooled as one passing sample.

## Reproduction

Use disposable projects, with the complete installed skills and both copied profiles. Initialize an empty Git repository in each so no real repository state is affected. Keep a sentinel file and hash every installed/fixture file plus Git files before and after. Use Python with `-B` and `PYTHONDONTWRITEBYTECODE=1`.

For the bug-fix and review fixtures, use `policy.py` containing `MIN_AMOUNT = 0`, and this defective `ledger.py`:

```python
import policy

class Ledger:
    def __init__(self):
        self.balance = 0
        self.receipts = set()

    def credit(self, request_id, amount):
        if amount < policy.MIN_AMOUNT:
            raise ValueError("amount below minimum")
        self.receipts.add(request_id)
        self.balance += amount
        return self.balance
```

The contract is single-threaded and in-memory: a repeated ID with the same amount credits once and returns the current balance; distinct IDs add; amounts below the current minimum must reject before mutation, including retries. Zero is accepted at minimum zero. Persistence, concurrency and conflicting positive amounts for one ID are outside the fixture contract. Seed tests check that distinct amounts 2 and 3 produce 5, and a negative request raises without changing the balance. Both seed tests pass on the defective implementation.

The initial native request was:

```text
$simplicit Fix the duplicate-request bug in ledger.py according to CONTRACT.md.
Local changes to ledger.py and test_*.py, focused diagnostics, tests, and one
independent reviewer are authorized. Continue from investigation through
implementation, executed verification, independent review, supported repairs
and final verification without asking me to continue. Prefer the available
critic with its configured model and effort. A generic reviewer is permitted
only if the named role cannot run; disclose the actual limitation. The reviewer
must stay read-only and must not delegate. Reuse it for a focused repair review
if needed. Preserve existing tests and unrelated content. Leave the result
uncommitted.
```

The shared envelope restricted work to that project, prohibited skill/profile/contract/policy/sentinel/Git changes, network, installs, external actions and personal/global configuration changes, specified the local Python executable with `-B`, and required honest evidence. The native executable was `C:/Users/jeffr/AppData/Local/Programs/OpenAI/Codex/bin/codex.exe`; Python was `C:/Users/jeffr/.cache/codex-runtimes/codex-primary-runtime/dependencies/python/python.exe`.

After a completed repair and independently passing behavior oracle plus `python -B -m unittest discover -v`, change only the policy minimum to 5. Start a read-only second turn asking the same parent to reassess changed evidence, run affected checks, reuse unchanged evidence, and report readiness without repair or delegation. This is a distinct follow-up exercise; the initial bug fix remains one uninterrupted prompt.

For the mechanical case, put `The service can recieve a request.` in README and request only that spelling correction with a proportionate check and no helper. For the review case, use a fresh defective ledger and explicitly assign the parent independent review through `$interrogate`, asking for location/input/evidence with no edits or delegation.

Use `initialize`, `initialized`, `skills/list`, `model/list`, `thread/start`, `turn/start`, `thread/read` and `thread/archive` through the installed client's schema. Record command outputs, file changes, terminal status, complete public final answers and resolved child metadata. A catalog entry alone is not execution proof. Do not collect reasoning or decode opaque spawn-message payloads. Check actual process exit and archive only owned completed threads.

## Evidence limits

- These are explicit native skill invocations on one Windows client/version, one model setting and a small synthetic fixture. They do not establish general automatic-selection quality, behavior across all 62 skills, Linux/macOS native behavior or a population improvement.
- Both bug-fix reviewers found no further defect. A native review-driven repair/re-review branch was therefore not exercised. The installer itself did undergo a separate actual review/repair/re-review cycle, which is not substituted for that native branch.
- Child metadata establishes the configured role/model/effort. Backend serving-model identity and blinded reviewer reasoning are not established. The reviewer did not author the repair; isolation of its reasoning from inherited parent context is not claimed.
- Missing-role/model, cancellation and rate-limit behavior were not newly tested. Previous dated outcomes remain separate.
- The harness records safe action/message/metadata fields, not hidden reasoning or opaque message contents. No missing-evidence entries were reported in the repaired matrix. The final audit verifies frozen hashes, exact output changes and cleanup.

Local detailed artifacts are retained under `.scratch/native-acceptance-2026-11-01/` and `.scratch/native-acceptance-2026-11-01-fixed/`: preparation script, frozen protocol/manifest, native runner, event records, per-case evidence and `audit.json`. They are ignored by Git. The reproduction contract, observations, candidate hashes and limits above are committed for review.
