---
title: "AI Agent Memory: What to Store and What to Recompute"
description: "Separate working context, durable user facts, episodic history, and external knowledge to reduce cost and privacy risk."
language: en
canonical: https://navinresearch.com/blog/agents/agent-memory.md
topics: ["AI agent memory", "long-term memory LLM", "context engineering"]
---

# AI Agent Memory: What to Store and What to Recompute

Separate working context, durable user facts, episodic history, and external knowledge to reduce cost and privacy risk.

**Short answer:** Treat memory as several stores with different lifetimes. Keep task-local state in working context, verified preferences in a durable profile, reusable facts in a governed knowledge store, and execution traces in observability storage. Do not call an unfiltered transcript memory.

## Implementation steps

1. Define a purpose, retention period, and deletion path for each memory class.
2. Write only facts supported by user confirmation or trusted system events.
3. Retrieve by task relevance and recency, then cap the amount inserted into context.
4. Allow users and operators to inspect and correct durable memory.

## Validation checklist

- Test whether stale facts are superseded correctly.
- Measure retrieval precision, not only recall.
- Verify tenant isolation and deletion across backups and indexes.

## Common mistakes

- Saving every message forever.
- Letting model-generated guesses become durable facts.
- Mixing audit logs with prompt-ready memory.

## Practical decision

Ship the smallest design that passes the checks above. Record the model, prompt, tool, dataset, and runtime versions used in testing so later changes can be compared rather than guessed. Recheck the linked documentation before relying on provider-specific limits, model names, prices, or preview features; those details change more quickly than the engineering principles in this note.

## Official sources

- [Anthropic, “Effective context engineering for AI agents”](https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents)
- [OpenAI, Responses API reference](https://platform.openai.com/docs/api-reference/responses)

---

Reviewed: 2026-08-24. This concise engineering note is educational, not a claim that Navin Research created or independently verified the cited provider technology.
