---
title: "Benchmark an LLM Inference Server Correctly"
description: "Report workload, hardware, concurrency, prompt and output lengths, latency percentiles, throughput, and quality together."
language: en
canonical: https://navinresearch.com/blog/inference/inference-benchmark.md
topics: ["LLM inference benchmark", "tokens per second", "time to first token"]
---

# Benchmark an LLM Inference Server Correctly

Report workload, hardware, concurrency, prompt and output lengths, latency percentiles, throughput, and quality together.

**Short answer:** A useful benchmark reproduces the intended workload. Warm the server, control request distributions, report time to first token and inter-token latency, and include p95 or p99 under sustained concurrency. Throughput without quality and workload details is not comparable.

## Implementation steps

1. Pin model artifact, runtime version, flags, drivers, and hardware.
2. Generate a request distribution matching production.
3. Warm caches, then run long enough to reach steady state.
4. Report errors, queueing, latency percentiles, and tokens per second.

## Validation checklist

- Repeat runs and publish variance.
- Verify outputs are valid and quality has not collapsed.
- Test overload and admission-control behavior.

## Common mistakes

- Comparing different prompt or output lengths.
- Using only one request at a time.
- Omitting failed and rejected requests.

## Practical decision

Ship the smallest design that passes the checks above. Record the model, prompt, tool, dataset, and runtime versions used in testing so later changes can be compared rather than guessed. Recheck the linked documentation before relying on provider-specific limits, model names, prices, or preview features; those details change more quickly than the engineering principles in this note.

## Official sources

- [NVIDIA, TensorRT-LLM documentation](https://nvidia.github.io/TensorRT-LLM/)
- [NVIDIA, Dynamo documentation](https://docs.nvidia.com/dynamo/latest/)

---

Reviewed: 2026-08-24. This concise engineering note is educational, not a claim that Navin Research created or independently verified the cited provider technology.
