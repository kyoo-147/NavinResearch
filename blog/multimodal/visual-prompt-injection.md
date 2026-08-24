---
title: "Defend Multimodal Agents Against Visual Prompt Injection"
description: "Treat text inside images and documents as untrusted data, not system instructions."
language: en
canonical: https://navinresearch.com/blog/multimodal/visual-prompt-injection.md
topics: ["visual prompt injection", "multimodal AI security", "indirect prompt injection"]
---

# Defend Multimodal Agents Against Visual Prompt Injection

Treat text inside images and documents as untrusted data, not system instructions.

**Short answer:** An image can contain instructions intended for the model rather than the user. Keep system policy separate, label visual content as untrusted, restrict tools, require authorization for side effects, and validate actions in code. No prompt can replace these controls.

## Implementation steps

1. Threat-model screenshots, PDFs, web pages, QR codes, and retrieved images.
2. Tell the model to extract relevant content without following embedded commands.
3. Use least-privilege tools and confirmation for consequential actions.
4. Detect unexpected tool requests and retain redacted security traces.

## Validation checklist

- Add benign and adversarial visual instructions to the test set.
- Verify the same policy holds across OCR and native vision paths.
- Test mixed trusted and untrusted images.

## Common mistakes

- Relying on a warning sentence alone.
- Giving a browsing agent broad credentials.
- Displaying external content without origin labels.

## Practical decision

Ship the smallest design that passes the checks above. Record the model, prompt, tool, dataset, and runtime versions used in testing so later changes can be compared rather than guessed. Recheck the linked documentation before relying on provider-specific limits, model names, prices, or preview features; those details change more quickly than the engineering principles in this note.

## Official sources

- [OpenAI, Safety best practices](https://platform.openai.com/docs/guides/safety-best-practices)
- [Model Context Protocol, Security best practices](https://modelcontextprotocol.io/specification/draft/basic/security_best_practices)

---

Reviewed: 2026-08-24. This concise engineering note is educational, not a claim that Navin Research created or independently verified the cited provider technology.
