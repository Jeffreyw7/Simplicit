Follow the [runtime contract](../references/runtime.md). This playbook supplies a workflow, not additional tools or authorization.

When candidate review is required, use the existing [Review playbook](review.md) and its linked reviewer contract. The workflow here does not replace those review gates.

# Eval

Design the experiment, preserve blinding, inspect the outputs, and distinguish measured behavior from promotion judgment.

1. State the variant and observable success behavior. Write a judge-only rubric with a few concrete criteria and a common scale. Set trial count and permitted side effects before running. Keep rubric and variant identity out of candidate-visible task material.
2. Prepare isolated, sanitized project-shaped working directories with the actual context an organic task would provide. Remove revealing directory/file/slug names such as eval, judge, benchmark, comparison, candidate, or arena from what the candidate sees. Do not sanitize legitimate product content so aggressively that the task changes. Inspect the whole candidate-visible prompt and paths for experiment leakage.
3. Use the same organic user request for each comparable arm. Ask for the actual deliverable and ordinary design notes, not a list of skills/principles followed or a self-reported reasoning chain. Do not tell an arm other arms exist. Keep environment, task scope, and relevant inputs comparable, changing only the stated variable.
4. Run independent candidate executions only through available authorized host capabilities, using separate owned artifacts. [Arena](../../arena/SKILL.md) can supply a bounded comparison when appropriate. Parallelism or different model families are useful only when actually available; lack of independent execution or model diversity must be reported. Sequential runs must preserve equivalent inputs and avoid leaking earlier answers.
5. Give an independent judge the rubric and all outputs under neutral labels, blind to model and variant identity. Compare all variants in one judgment pass on one scale rather than incompatible per-arm scoring. Retain the identity map separately. If no independent judge is available, report an unblinded self-assessment rather than presenting it as an independent result.
6. For any claim about file/tool/skill usage, inspect available execution records and the artifact shape. An arm saying it followed a chain is not proof. Use only explicitly available scoped transcripts or tool logs; do not infer private transcript paths. If records are unavailable, mark that dimension unverified rather than scoring self-report as evidence.
7. Read every complete output yourself and compare against rubric and judge evidence. Resolve disagreement by checking the artifact, trial variation, or rubric ambiguity; do not assume the judge is correct. Preserve negative results and distinguish a single promising sample from repeatable improvement.

Report the tested variable, rubric, trial conditions/count, neutral per-arm findings, judge result and independence, observed-record limits, synthesis, and supported promotion recommendation. Do not promote a variant beyond what the experiment actually established.
