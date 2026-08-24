---
title: "Build Long-Running AI Agent Jobs That Can Resume Safely"
description: "Use checkpoints, idempotent tools, bounded retries, and cancellation for tasks that outlive one request."
language: en
canonical: https://navinresearch.com/blog/agents/long-running-agent-jobs.md
topics: ["long-running AI agents", "resumable agent workflow", "idempotent tool calls"]
---

# Build Long-Running AI Agent Jobs That Can Resume Safely

Use checkpoints, idempotent tools, bounded retries, and cancellation for tasks that outlive one request.

**Short answer:** Persist explicit workflow state after meaningful steps instead of relying on a live model session. Each resumable step should have an idempotency key, recorded inputs, result status, and a clear rule for retry or human escalation.

## Implementation steps

1. Represent the job as a state machine with terminal and recoverable states.
2. Checkpoint tool outputs and decisions, excluding hidden reasoning.
3. Propagate deadlines and cancellation to workers and external calls.
4. Resume from the last verified state using current credentials and policy.

## Validation checklist

- Kill the worker between every pair of steps and resume.
- Replay callbacks and confirm side effects are not duplicated.
- Verify expired permissions stop the resumed job safely.

## Common mistakes

- Keeping progress only in conversation history.
- Unlimited automatic retries.
- Marking a timeout as success because partial prose exists.

## Practical decision

Ship the smallest design that passes the checks above. Record the model, prompt, tool, dataset, and runtime versions used in testing so later changes can be compared rather than guessed. Recheck the linked documentation before relying on provider-specific limits, model names, prices, or preview features; those details change more quickly than the engineering principles in this note.

## Official sources

- [OpenAI, Responses API reference](https://platform.openai.com/docs/api-reference/responses)
- [Anthropic, Building effective agents](https://www.anthropic.com/engineering/building-effective-agents)

---

Reviewed: 2026-08-24. This concise engineering note is educational, not a claim that Navin Research created or independently verified the cited provider technology.
