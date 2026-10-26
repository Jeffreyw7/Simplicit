# Upstream source

Simplicit imports the `pstack/` directory from [cursor/plugins](https://github.com/cursor/plugins/tree/99b609a72323b70204eab407c622f436e858e112/pstack).

- Upstream commit: `99b609a72323b70204eab407c622f436e858e112`.
- Imported: October 26, 2026.
- Source subtree: `pstack/`.
- License: [MIT, copyright 2026 Lauren Tan](pstack/LICENSE).

The 200 imported files are preserved unchanged. This is a source import into Simplicit, not a GitHub fork relationship with the upstream monorepo. Other upstream plugins and root build scripts are not included. Instructions in the imported README that call monorepo generators or describe Cursor/Claude installation refer to that original environment.

## Personal workflow adaptation

The personal mode lives separately in `skills/simplicit-mode/`. It adapts these pstack sources:

| Local guidance | Upstream basis | Personal choice |
|---|---|---|
| Mode and task routing | `pstack/skills/poteto-mode/SKILL.md`, `pstack/skills/automate-me/SKILL.md` | One implementing lead; bounded helpers; current host tools and models. |
| Change playbook | `pstack/skills/poteto-mode/playbooks/feature.md` | Design depth follows risk; no mandatory parallel implementation. |
| Bug-fix playbook | `pstack/skills/poteto-mode/playbooks/bug-fix.md` | Reproduce, trace the cause, verify the repair; report unavailable runtime evidence. |
| Investigation playbook | `pstack/skills/poteto-mode/playbooks/investigation.md` | Read-only answers stay read-only. |
| Review playbook | `pstack/skills/interrogate/SKILL.md` | One independent pass by default; evidence determines findings, not reviewer agreement. |
| Resume and evidence reuse | `pstack/skills/poteto-mode/playbooks/session-pickup.md` | Reuse prior work after checking the actual candidate and relevant inputs. |
| Engineering reference | `principle-prove-it-works`, `principle-fix-root-causes`, `principle-attack-the-premise`, `principle-test-behavior-not-implementation`, `principle-encode-lessons-in-structure` under `pstack/skills/` | Preserve these practices in a portable reference, loaded only when relevant. |

The adaptation includes a copy of the upstream license so attribution travels with repository-local installations. It does not invoke the original mode, setup tools, orchestration scripts, or automations. It requires no Jimmy installation. Updates are deliberate imports, followed by review of the adaptation; there is no automatic upstream synchronization.
