# Nature chapters experience

The homepage uses an editorial nature direction: a full-viewport opening chapter, a calm below-fold `Wealth of Nature` statement, and a persistent legal footer. The left drawer is an original navigation treatment inspired by the supplied references rather than a copied interface.

## Chapter model

Five truthful coming-soon routes are generated for every locale from `site.config.mjs`:

1. NAVIN / PHYSIS — Embodied & Natural Intelligence
2. NAVIN / NOEMA — Language & Multimodal Reasoning
3. NAVIN / LUMEN — Vision & Perception
4. NAVIN / PNEUMA — Speech & Voice
5. NAVIN / POIESIS — Generative Systems

Chapter pages describe planned editorial areas only. They must not imply published studies, findings, dates, metrics, or delivery commitments.

## Interaction contract

- The menu opens from left to right and returns focus to its trigger when closed.
- Escape closes the chapter panel first, then the drawer.
- Focus is contained while the drawer is open; the scrim closes it.
- On narrow/touch layouts the chapter panel becomes a drill-in view with a visible Back action.
- `prefers-reduced-motion` removes drawer and ambient transitions.
- The fixed homepage footer is offset by matching shell padding so it never hides the final content.
