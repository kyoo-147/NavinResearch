---
title: "Reduce LLM Latency Before Changing Models"
description: "Cut sequential calls, shorten outputs, stream useful progress, cache stable prefixes, and parallelize independent work."
language: en
canonical: https://navinresearch.com/blog/inference/reduce-llm-latency.md
topics: ["reduce LLM latency", "AI inference optimization", "time to first token"]
---

# Reduce LLM Latency Before Changing Models

Cut sequential calls, shorten outputs, stream useful progress, cache stable prefixes, and parallelize independent work.

**Short answer:** Start with architecture. The largest wins often come from fewer serial model calls and shorter generated outputs. Then optimize prompt size, cache reusable prefixes, parallelize independent retrieval, and choose a faster model only after measuring the quality trade-off.

## Implementation steps

1. Break total latency into queue, input, first-token, generation, and tool time.
2. Remove unnecessary model turns and combine deterministic processing.
3. Set concise output contracts and realistic token limits.
4. Stream user-visible progress without pretending unfinished work is complete.

## Validation checklist

- Track p50 and p95 by task class.
- Measure task success after every optimization.
- Load-test with real concurrency and output lengths.

## Common mistakes

- Optimizing average latency only.
- Streaming verbose text that users do not need.
- Shrinking context without checking retrieval failures.

## Practical decision

Ship the smallest design that passes the checks above. Record the model, prompt, tool, dataset, and runtime versions used in testing so later changes can be compared rather than guessed. Recheck the linked documentation before relying on provider-specific limits, model names, prices, or preview features; those details change more quickly than the engineering principles in this note.

## Official sources

- [OpenAI, Latency optimization guide](https://platform.openai.com/docs/guides/latency-optimization)
- [Google, Gemini API context caching](https://ai.google.dev/gemini-api/docs/caching)

---

Reviewed: 2026-08-24. This concise engineering note is educational, not a claim that Navin Research created or independently verified the cited provider technology.
