---
title: "Prompt Injection Defense for Tool-Using AI Agents"
description: "Combine trust separation, least privilege, validation, approvals, and monitoring because prompts alone cannot secure agents."
language: en
canonical: https://navinresearch.com/blog/safety-evaluation/prompt-injection-defense.md
topics: ["prompt injection defense", "AI agent security", "indirect prompt injection"]
---

# Prompt Injection Defense for Tool-Using AI Agents

Combine trust separation, least privilege, validation, approvals, and monitoring because prompts alone cannot secure agents.

**Short answer:** Treat retrieved pages, emails, files, images, and tool results as untrusted data. Keep policy separate, restrict available tools, validate every call in code, require approval for consequential actions, and minimize credentials and data exposure.

## Implementation steps

1. Map every place untrusted content can enter context.
2. Label source and trust level in structured context.
3. Enforce authorization outside the model.
4. Add adversarial cases to continuous evaluations.

## Validation checklist

- Attempt data exfiltration and privilege escalation.
- Test indirect instructions inside each supported modality.
- Confirm blocked actions leave an auditable event.

## Common mistakes

- Using 'ignore malicious instructions' as the only defense.
- Giving browsing and write tools the same broad token.
- Returning secrets in tool errors.

## Practical decision

Ship the smallest design that passes the checks above. Record the model, prompt, tool, dataset, and runtime versions used in testing so later changes can be compared rather than guessed. Recheck the linked documentation before relying on provider-specific limits, model names, prices, or preview features; those details change more quickly than the engineering principles in this note.

## Official sources

- [OpenAI, Safety best practices](https://platform.openai.com/docs/guides/safety-best-practices)
- [Model Context Protocol, Security best practices](https://modelcontextprotocol.io/specification/draft/basic/security_best_practices)

---

Reviewed: 2026-08-24. This concise engineering note is educational, not a claim that Navin Research created or independently verified the cited provider technology.
