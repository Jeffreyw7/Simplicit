# Upstream source

Simplicit imports only `pstack/` from [cursor/plugins](https://github.com/cursor/plugins/tree/99b609a72323b70204eab407c622f436e858e112/pstack).

- Upstream commit: `99b609a72323b70204eab407c622f436e858e112`.
- Imported: October 26, 2026.
- Exact pstack Git tree: `880564357e051d7c7802da1cb5d8df1d0b008299`.
- License: [MIT, copyright 2026 Lauren Tan](pstack/LICENSE).

All 200 imported files remain unchanged. This is a subtree source import, not a GitHub fork relationship. Other upstream plugins and root build generators are outside this import.

## Supported adaptations

`skills/` is a separate Codex-oriented collection. Every skill includes the upstream license, so attribution travels with repository-local adoption. Install the collection together; its sibling links are required dependencies.

| Adaptation | Upstream basis | Change |
|---|---|---|
| `simplicit`, mode alias, help, runtime, worker brief | `poteto-mode`, `poteto-help`, `automate-me` and mode playbooks | Implementing lead, risk-based routes, independent candidate review, scoped helpers, current host capabilities. |
| Change/bug/investigation/review playbooks | Mode feature, bug-fix, investigation, session-pickup; `interrogate` | Progressive loading, read-only routes, evidence freshness, focused repair review. |
| Engineering reference | `principle-prove-it-works`, `principle-fix-root-causes`, `principle-attack-the-premise`, `principle-test-behavior-not-implementation`, `principle-encode-lessons-in-structure` | Portable supporting guidance loaded when relevant. |
| `architect` and two references | Same upstream skill, design-red-flags and rationale-template | Usage-first sketch retained; panels and duplicate implementations conditional; design-only scope respected. |
| `how` and explorer brief | Same upstream skill and explorer/explainer prompts | Lead investigates/synthesizes; explorers conditional. |
| `why` and three references | Same upstream skill, epistemics, investigator prompt, source playbooks | Epistemics copied unchanged; targeted source search replaces mandatory fan-out. |
| `interrogate` and four references | Same upstream skill and review references | One independent reviewer by default; evidence over consensus; no arbitrary line threshold or scope-expanding cleanup mandate. |
| `tdd` | Same upstream skill | Retains focused regression workflow; adds runtime contract and preserves authorization. |
| `teach` | Same upstream skill | Reuses findings; no forced panels, writing dependency, or diagrams. |
| `correct` | Same upstream skill | Structural enforcement within scope; no automatic broad refactor, rule-table expansion, or commits. |
| `blast-radius` | Same upstream skill | Retains cross-contract investigation and real-code proof; allows multiple safety facts and marks unavailable evidence. |
| `arena`, `swarm` | Same upstream skills | Conditional experiments or independent slices, actual host tools, explicit ownership, final integrated verification. |
| `create-verification-skill` and feature-map outline | Same upstream skill and feature-map examples | Repository-local `.agents/skills`, observed host commands, end-to-end proof or draft status. |
| `maintain-verification-skill` | Same upstream skill | Full requested coverage retained; source delegation optional; product edits excluded; no automatic PR. |

The [reviewed revision plan](docs/superpowers/plans/2026-10-26-simplicit-specialists.md) records the shared-thread requirements and preimplementation review.

## Naming and support boundary

The main/alias/help pattern and worker-brief naming follow [Jimmy at revision 2bb05bc](https://github.com/ja153903/jimmy/tree/2bb05bcd288f60a9b435ddd156dabb8d88fafe80). Specialist names stay descriptive, as Jimmy's do. No Jimmy runtime or generated package is imported.

Only the 12 specialists above and the three Simplicit entrypoints are supported adaptations. Every other skill under `pstack/skills/` remains source-only, even if some of its guidance is host-neutral. In particular, formal verification and `statechart` scripts need separate Node/Java/TLC and rendering validation; transcript tools, platform setup, orchestration, automations, and shipping paths are not active routes.

Do not read original host-specific instructions as an execution fallback for an unavailable adapted skill. Restore a missing collection dependency instead. Updates require deliberate source review and validation; there is no automatic upstream synchronization.
