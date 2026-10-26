---
name: maintain-verification-skill
description: Use for a requested audit of an existing project verification skill and feature map against current source and live application behavior.
---

# Maintain a verification skill

Adapted from pstack. Read the [runtime contract](../simplicit/references/runtime.md). Keep the verification instructions honest. Default edit scope is the chosen skill directory, its map, and owned harness scripts; product regressions are reported separately. An advice-only audit stays read-only.

1. **Locate:** find the project-local verification skill and feature map, normally under `.agents/skills/verify-*/`. Resolve an ambiguous target from context or ask for the missing choice. With no target, report that and point to [create-verification-skill](../create-verification-skill/SKILL.md).
2. **Index:** compare the README's feature list with actual feature files. Investigate missing, duplicate, stale, or unindexed journeys. Do not delete apparent drift without checking current requirements.
3. **Source coverage:** inspect every mapped feature. Record the implementation entrypoints, expected behavior, likely drift, and a concise live recipe. The lead normally reads directly; bounded source specialists may help with independent complex slices. They do not drive the app or edit overlapping files.
4. **Reconcile:** combine redundant setup while retaining coverage of every feature. Look for newly added user surfaces supported by concrete source paths. Separate actual changed requirements from product defects; do not rewrite a map to bless a regression.
5. **Live coverage:** follow the target's launch/doctor/drive/evidence/cleanup instructions. One coordinator owns driving, with isolated sessions where required. Exercise every mapped feature in a full maintenance audit, even when source looks clean. Doctor before first drive and after surprises; reset a wedged UI rather than relying only on process health. Record inaccessible features with the actual attempted route and missing prerequisite, not as passed.
6. **Repair within scope:** fix proven instruction or harness drift, re-drive changed instructions, and retain evidence. Do not edit product code. After a failed attempt, clean owned residue and preserve proof. A missing runtime or prerequisite makes coverage incomplete even when static edits look right.
7. **Finish:** review meaningful changes independently and prepare one Draft PR only when authorized. A blocked audit may still return useful verified edits; identify which portions remain draft instead of hiding them. No automatic branch, PR, commit, or external message is implied.

Return **clean** only when required source and live coverage completed with no material correction; **changed** for proven corrections with stated coverage; or **blocked** when required coverage remains incomplete. Include feature-level results, product gaps, changed instructions, commands/results, retained evidence, and cleanup status. Never claim full live coverage from one convenient journey.
