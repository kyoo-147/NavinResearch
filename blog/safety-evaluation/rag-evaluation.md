---
title: "Evaluate RAG Before Tuning the Generator"
description: "Separate retrieval recall, ranking, context quality, answer support, and citation correctness."
language: en
canonical: https://navinresearch.com/blog/safety-evaluation/rag-evaluation.md
topics: ["RAG evaluation", "retrieval augmented generation evals", "citation accuracy"]
---

# Evaluate RAG Before Tuning the Generator

Separate retrieval recall, ranking, context quality, answer support, and citation correctness.

**Short answer:** Diagnose retrieval-augmented generation in stages. First confirm the needed evidence exists and is retrieved. Then test ranking and context assembly. Only after that should you evaluate whether the model answers faithfully and cites the supporting passage.

## Implementation steps

1. Create questions with labeled source passages and unanswerable cases.
2. Measure retrieval recall at several cutoffs.
3. Inspect reranking and duplicate chunks.
4. Score answer correctness, support, and citation precision separately.

## Validation checklist

- Run ablations with oracle evidence.
- Test stale and conflicting documents.
- Verify access control before retrieval results enter context.

## Common mistakes

- Changing embeddings and prompts simultaneously.
- Using answer similarity as a retrieval metric.
- Forcing an answer when evidence is absent.

## Practical decision

Ship the smallest design that passes the checks above. Record the model, prompt, tool, dataset, and runtime versions used in testing so later changes can be compared rather than guessed. Recheck the linked documentation before relying on provider-specific limits, model names, prices, or preview features; those details change more quickly than the engineering principles in this note.

## Official sources

- [Anthropic, Effective context engineering for AI agents](https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents)
- [OpenAI, Evaluations guide](https://platform.openai.com/docs/guides/evals)

---

Reviewed: 2026-08-24. This concise engineering note is educational, not a claim that Navin Research created or independently verified the cited provider technology.
