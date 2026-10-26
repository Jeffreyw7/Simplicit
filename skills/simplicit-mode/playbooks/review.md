# Review

Adapted from pstack's Interrogate workflow. Default to one independent review, not a mandatory multi-model panel.

1. Establish the intent, acceptance criteria, base and candidate state, diff, relevant contracts, and verification gaps. Include dirty changes in the candidate identity. Check whether a completed local or hosted review already covers this candidate and risk.
2. For a new independent pass, use a reviewer who did not author the candidate. Give that reviewer the evidence and scope without conclusions to agree with. Follow affected producers, consumers, and tests beyond the edited lines. Add another specialist only for a distinct unresolved risk or repository requirement. A same-model reviewer is independent of authorship, not model diversity.
3. Require findings to state location, failure scenario, impact, and supporting evidence. Separate blocking defects, optional improvements, and questions needing evidence. Agreement does not prove a finding; judge the mechanism and evidence.
4. In a review-only task, report findings without modifying code. During an authorized implementation task, the lead assesses findings, fixes supported defects, and reruns affected checks. An independent follow-up examines the repair and introduced risks while retaining unaffected review coverage.
5. Record the candidate reviewed and remaining gaps. If an independent execution path is unavailable, report the requirement as pending; do not relabel self-review as independent review. A clean review does not substitute for required runtime acceptance.
