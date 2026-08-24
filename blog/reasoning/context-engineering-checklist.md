---
title: "A Context Engineering Checklist for AI Agents"
description: "Curate instructions, tools, evidence, state, and history as a limited resource on every model turn."
language: en
canonical: https://navinresearch.com/blog/reasoning/context-engineering-checklist.md
topics: ["context engineering checklist", "AI agent context", "prompt context management"]
---

# A Context Engineering Checklist for AI Agents

Curate instructions, tools, evidence, state, and history as a limited resource on every model turn.

**Short answer:** Build context from explicit layers: stable policy, task contract, current state, relevant tools, retrieved evidence, and a compact recent history. Give each layer an owner and a removal rule. More context is useful only when it changes the correct next action.

## Implementation steps

1. Reserve the beginning for stable high-priority instructions.
2. Select tools on demand and avoid loading large catalogs blindly.
3. Retrieve evidence with provenance and a relevance threshold.
4. Compact completed work into decisions, artifacts, and open questions.

## Validation checklist

- Ablate each context layer and measure task impact.
- Detect conflicting instructions before sending the request.
- Track tokens by layer to identify growth.

## Common mistakes

- Mixing untrusted documents with system instructions.
- Keeping stale tool definitions.
- Summarizing away constraints or unresolved risks.

## Practical decision

Ship the smallest design that passes the checks above. Record the model, prompt, tool, dataset, and runtime versions used in testing so later changes can be compared rather than guessed. Recheck the linked documentation before relying on provider-specific limits, model names, prices, or preview features; those details change more quickly than the engineering principles in this note.

## Official sources

- [Anthropic, Effective context engineering for AI agents](https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents)
- [Google, Gemini API context caching](https://ai.google.dev/gemini-api/docs/caching)

---

Reviewed: 2026-08-24. This concise engineering note is educational, not a claim that Navin Research created or independently verified the cited provider technology.
