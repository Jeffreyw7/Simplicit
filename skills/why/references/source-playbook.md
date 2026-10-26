# Source selection

Adapted from pstack's source playbooks. Choose sources for a concrete unanswered question; tool and query syntax comes from the available connector documentation.

| Evidence | Useful question | Method |
|---|---|---|
| Source control and PR discussion | What did the implementer intend? | Trace introduction and later changes, including renames, tests, reverts, linked PRs and comments. |
| Issue tracker | What product constraint forced this? | Follow linked work items, acceptance criteria, scope changes, and resolved discussion. |
| Design documents | Which alternatives were considered? | Read the relevant proposal and decision history; distinguish proposal from accepted design. |
| Team discussion | Was a tradeoff recorded elsewhere? | Search narrowly for linked symbols, dates, incidents, or decisions. Read context and cite the actual message. |
| Runtime observations and error reports | Did an incident motivate the defense? | Follow the relevant timeframe, failure mode, deployed version, and corrective change. Current health does not prove historical rationale. |
| Product data | What measurement informed this threshold? | Find the recorded query, metric definition, timeframe, or experiment. Avoid treating today's number as the original basis. |

For defensive code, consider an incident or postmortem when the linked history suggests one. Do not assume every guard or retry was incident-driven. Prefer existing linked evidence over an organization-wide search.

Record searched source, query or path, relevant date/version, result, and confidence. An unavailable source is a coverage limit; an unsearched source is not a null result. Stop when the bounded question is answered adequately or further evidence requires a consequential user decision.
