# Comment review criteria

Review only scoped files or the supplied diff. Return findings and proposed comment deletions; do not modify application code during a comment-only review.

Preserve these useful categories when supported by current evidence:

- Legal and license notices.
- Non-obvious behavior forced by a dependency, platform, vendor, or protocol the task cannot reshape.
- Formatting exceptions such as `prettier-ignore`, and lint suppressions whose rule is faulty or purely stylistic.
- Doc comments defining a public API contract.
- Issue or RFC links explaining a constraint the code cannot express.

Flag narration, banners, dead code in comments, and long justifications for internal surprises. Name the exact scoped symbol and propose a rename, extraction, type, or structural change that makes the behavior clearer. A comment that describes surprising internal code is evidence to investigate, not proof that deleting it fixes the code.

For `eslint-disable`, `@ts-ignore`, `@ts-expect-error`, or similar directives, inspect the actual diagnostic and rule. Correctness or safety violations require a verified underlying fix. Do not erase an intentional negative type test or claim the directive is redundant without checking its role.

Treat IMPORTANT, do not remove, too risky, and fine for now as prompts to read the live code and source history. Verify what can and cannot change. Report uncertainty explicitly; preserve an unverified safety-relevant constraint until the parent resolves it.

For each finding give file and symbol, comment category, current evidence, deletion or retention recommendation, proposed root-cause work, and any missing proof. Report scope skips and the count of proposed deletions separately from applied deletions.
