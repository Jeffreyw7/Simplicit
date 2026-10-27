---
name: setup-benny
description: Use when configuring Simplicit's issue triage and reproduction workflows for a repository, tracker, source thread, or scheduled automation.
---

# Set up issue workflows

Read the [runtime contract](../simplicit/references/runtime.md). This adapts the three upstream Benny skills into ordinary Codex skills. They can run manually; installing them does not create a scheduler, subscribe to Slack, or authorize messages.

## Configure a selected project

Install the complete Simplicit collection under the selected repository's `.agents/skills/`, checking collisions and preserving customizations. See [setup-simplicit](../setup-simplicit/SKILL.md). Never write Cursor settings.

Copy [configuration.example.yaml](references/configuration.example.yaml), the [feature map](../reproduce-and-fix-issues/references/feature-map.example.md), and optional [routing map](../triage-issue-reports/references/routing.example.md) into user-owned, secret-free project configuration outside installed skills. Fill actual values; examples are not executable configuration. Keep credentials in the chosen service's secret store or environment.

Resolve the repository and base branch, source type and immutable source identity, tracker/team/project/status, triage identity for unattended runs, allowed actions, feature map/control adapter, budgets, and artifact retention. Use observed available model choices or inherit the current model. Do not guess model slugs.

## Verify capabilities

Use connected tools when available. Confirm source/thread read, repository history, tracker search/read and any explicitly requested write capabilities. Confirm the [control adapter](../reproduce-and-fix-issues/references/control-adapter.md) can launch the correct revision, drive mapped UI actions, inspect without injecting the symptom, capture evidence, reset, and clean up.

Run one harmless adapter check through a mapped feature. If a required capability is absent, preserve completed configuration and state what is blocked. Read-only/manual triage remains useful without posting privileges. Do not enable reproduction automation when it cannot collect the required evidence.

## Optional scheduled or triggered runs

Only when requested, discover an actual scheduler or event service and its supported configuration tools. Prepare one triage job and one reproduction job, pointing at stable committed repository-relative skill/configuration paths available in the execution checkout. Never use local plugin cache paths in remote jobs. Use [triage](../triage-issue-reports/SKILL.md) and [reproduction](../reproduce-and-fix-issues/SKILL.md) as their operational instructions.

Separate authorization for source-thread replies, tracker changes, fixes, draft PR creation, and scheduling. Keep merges/deploys excluded unless separately requested. If no scheduler exists, deliver runnable manual prompts and a configuration checklist without pretending a job was created.

Before enabling traffic, test on an authorized test report: immutable source coordinates; exactly one verdict marker from the configured identity; no root/cross-channel posts; no duplicate ticket on retry; no write when source preflight fails; and read-only delegates with no posting task. If the host cannot enforce the needed worker isolation, the coordinator performs that work.

Hand off the configuration path, actual tool bindings, tested capabilities, manual invocation examples, and any disabled integration.
