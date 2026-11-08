# Named coder delegation — November 8, 2026

The local working-tree candidate on `feat/worker-model-routing`, based on
`bcc4c84`, defines three coder roles in `.codex/agents/`. All three files contain
nonempty `name`, `description`, and `developer_instructions` fields. The valid
instruction key is plural, as specified in the
[official standalone-agent schema](https://learn.chatgpt.com/docs/agent-configuration/subagents).
The reported missing fields were not reproduced in either the sandbox file
reads or the native process's reads. No profile repair was needed in this check.

## Native execution

A fresh authenticated Codex CLI 0.165.0 app-server process ran in this checkout.
The parent used `gpt-6.1-sol` / `medium`, read-only permissions, approval policy
`never`, and disabled provider-model fallback. Test-only configuration overrides
enabled delegation and disabled unrelated apps, plugins, memories, and automatic
skill-instruction injection. The parent explicitly read the current routing
policy. Overrides were process-scoped; the probe did not write global
configuration or copy profiles.

The parent selected each named role once, sequentially, with `fork_turns: none`.
The actual spawn calls contained no model or reasoning-effort overrides. Each
child read the supplied worker brief and the README, then returned PASS with the
correct first heading, `# Simplicit`.

| Named role | Child-session model | Child-session effort | Result |
|---|---|---|---|
| `coder-light` | `gpt-6-luna` | `high` | Completed |
| `coder-medium` | `gpt-6.1-sol` | `high` | Completed |
| `coder-hard` | `gpt-6-astra` | `high` | Completed |

The role, model, and effort values came from native child-thread metadata, not
worker self-reports. Scoped parent execution records confirmed the named-role
spawn arguments. These results establish actual named-role execution in a fresh
local session; they do not independently establish backend serving identity or
automatic tier selection for arbitrary future assignments.

No file-change events were observed. Before/after SHA-256 hashes matched for
all three profiles, the routing policy, worker brief, and README. All four test
threads were archived, and the app-server exited with code 0. PowerShell emitted
a profile language-mode warning during reads; it did not prevent completion.

## Checks and scope

Fresh profile, skill, package, and whitespace checks passed. The preceding Python
suite covered the implementation: 109 tests, five skips, with two ownership-blocked
tests passing on an owner-context rerun. No full Python or Node suite was rerun
for this read-only probe or the subsequent report and README link additions.

Native evidence and the bounded probe are retained in ignored
`.scratch/coder-role-check/native-1794179942171/evidence.json` and
`.scratch/coder-role-check/native.cjs`. An already-running chat's role inventory
may still omit the new profiles. This result also does not register the profiles
in other projects; those projects still require explicit profile adoption.
