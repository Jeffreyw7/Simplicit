---
name: teach
description: Use when the user asks to understand a change or subsystem through a plain explanation of what it is, how it works, and why it has that shape.
---

# Teach

Adapted from pstack. Read the [runtime contract](../simplicit/references/runtime.md). The outcome is understanding, not code changes.

Infer the useful depth from the question and conversation. Reuse established [how](../how/SKILL.md) and [why](../why/SKILL.md) findings; investigate only missing parts. A narrow question may need only one of them. Preserve historical confidence language: uncertainty is a finding, not prose to polish away.

Start with the smallest complete explanation in plain language. Name the thing, the problem it solves, and its concrete mechanism. Walk through a representative user action or caller sequence, using source locations and a small example when useful. Explain the important tradeoff without turning every minor edit into a tutorial.

Use a diagram when relationships are easier to understand visually, not as a compulsory sequence. No writing skill, diagram renderer, or image-generation service is required. Do not generate images just to satisfy a ritual.

Build detail around the user's interest, avoid quizzes and pacing theater, and stop once their question is answered. If reasons are unknown, say so; do not fill the gap with a convenient story. Return the explanation itself.
