# Bug fix

Adapted from pstack's Bug fix playbook and root-cause principles. The lead investigates and normally implements the fix.

1. Establish the expected behavior and reproduce the failure on the relevant surface. Use available tooling and targeted instrumentation. If that surface is unavailable, document the exact limitation; a static diagnosis can support a proposed repair but cannot establish that the runtime failure is gone.
2. Trace the earliest incorrect state or decision. Test competing hypotheses against observations. After two failed fixes sharing one premise, write that premise down and test it before another similar patch. Remove your disproven experimental changes while preserving unrelated work.
3. Use [tdd](../../tdd/SKILL.md) when a meaningful practical regression-test path exists, then fix the cause. A legitimate boundary condition may need a guard; a guard that only hides impossible internal state leaves the cause unresolved. Follow repository testing requirements.
4. Re-run the reproduction and affected checks. For related instances of the same cause, investigate within scope; identify wider work separately when it would change the task. Keep unverified runtime claims explicit.
5. Obtain independent review for a meaningful fix and narrow follow-up review for review-driven repairs. Finish with the failure mechanism, change, observed verification, and unresolved evidence. A reproduction that could not run remains Blocked or Not Run.
