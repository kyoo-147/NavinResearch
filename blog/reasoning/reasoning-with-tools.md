---
title: "Reasoning With Tools: Separate Planning From Execution"
description: "Let models choose actions while deterministic code validates, executes, and records each operation."
language: en
canonical: https://navinresearch.com/blog/reasoning/reasoning-with-tools.md
topics: ["reasoning with tools", "AI tool calling", "agent execution loop"]
---

# Reasoning With Tools: Separate Planning From Execution

Let models choose actions while deterministic code validates, executes, and records each operation.

**Short answer:** The model may propose a plan and tool calls, but the application owns permissions, validation, execution, retry policy, and stopping. This separation keeps failures inspectable and prevents natural language from bypassing control logic.

## Implementation steps

1. Expose a narrow set of task-relevant tools.
2. Validate each call against schema, user scope, and current state.
3. Return concise results with stable identifiers and explicit error types.
4. Stop on success, budget exhaustion, policy denial, or repeated non-progress.

## Validation checklist

- Simulate stale state between planning and execution.
- Test partial tool failure and duplicate requests.
- Confirm the agent cannot manufacture a tool result in plain text.

## Common mistakes

- Executing a prose plan as code.
- Returning stack traces or secrets to the model.
- Allowing endless plan-revise loops.

## Practical decision

Ship the smallest design that passes the checks above. Record the model, prompt, tool, dataset, and runtime versions used in testing so later changes can be compared rather than guessed. Recheck the linked documentation before relying on provider-specific limits, model names, prices, or preview features; those details change more quickly than the engineering principles in this note.

## Official sources

- [OpenAI, Function calling guide](https://platform.openai.com/docs/guides/function-calling)
- [Google, Gemini API function calling](https://ai.google.dev/gemini-api/docs/function-calling)
- [Anthropic, Writing effective tools for agents](https://www.anthropic.com/engineering/writing-tools-for-agents)

---

Reviewed: 2026-08-24. This concise engineering note is educational, not a claim that Navin Research created or independently verified the cited provider technology.
