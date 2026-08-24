---
title: "KV Cache Planning for LLM Inference"
description: "Estimate memory from context, concurrency, model architecture, precision, and reuse before promising capacity."
language: en
canonical: https://navinresearch.com/blog/inference/kv-cache.md
topics: ["KV cache LLM", "LLM inference memory", "long context serving"]
---

# KV Cache Planning for LLM Inference

Estimate memory from context, concurrency, model architecture, precision, and reuse before promising capacity.

**Short answer:** Weights are only part of serving memory. The key-value cache grows with active sequence length and concurrent requests, so long contexts can sharply reduce capacity. Measure with the exact runtime and scheduling policy rather than relying on a simple model-size estimate.

## Implementation steps

1. Define input and output length distributions.
2. Measure per-request cache use for the selected model and precision.
3. Reserve memory for weights, runtime workspace, fragmentation, and safety margin.
4. Test prefix reuse, paging, or eviction behavior if supported.

## Validation checklist

- Load-test mixed short and long requests.
- Observe rejection, preemption, and tail latency.
- Verify isolation when cache reuse spans requests.

## Common mistakes

- Sizing only for model weights.
- Advertising maximum context at maximum concurrency.
- Ignoring memory fragmentation and runtime overhead.

## Practical decision

Ship the smallest design that passes the checks above. Record the model, prompt, tool, dataset, and runtime versions used in testing so later changes can be compared rather than guessed. Recheck the linked documentation before relying on provider-specific limits, model names, prices, or preview features; those details change more quickly than the engineering principles in this note.

## Official sources

- [NVIDIA, TensorRT-LLM documentation](https://nvidia.github.io/TensorRT-LLM/)
- [NVIDIA, Dynamo documentation](https://docs.nvidia.com/dynamo/latest/)

---

Reviewed: 2026-08-24. This concise engineering note is educational, not a claim that Navin Research created or independently verified the cited provider technology.
