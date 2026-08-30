# Sori design DNA

## Direction
Dark editorial fieldwork: a quiet instrument panel for the path **speech → text → intent → action**. Sori should feel like a precise desktop tool, not a glossy AI landing page.

## Type
Use a restrained monospace for labels, states, and navigation. Pair it with an editorial serif for large statements and section titles. Keep copy short, concrete, and sentence case. The wordmark and large headings should feel like a native utility manual rather than a SaaS campaign.

## Palette
- Deep field: `#0d0f0e`
- Paper panel: `#171817`
- Ink: `#e8e4d8`
- Dim text: `#a6aaa0`
- Rule: `#59615b`
- Signal amber: `#d4b36a`

Amber marks state, focus, and the next deliberate step; it is not decoration or a success guarantee.

## Layout and primitives
Use a wide but bounded shell, generous vertical rhythm, thin rules, asymmetric editorial grids, signal lines, status ledgers, pipeline diagrams, and small focused-app/terminal motifs. Sori's hierarchy is **daily path → Studio → implementation boundary**: the homepage is a quiet four-step instrument, feature pages explain one transition, use-case pages show the focused-app context, and Studio pages expose models, profiles, history, and permissions progressively. At 375px, collapse to one column; preserve readable line length at 768px and 1440px; allow larger desktop whitespace without stretching text.

## Reference reconstruction
The information architecture is adapted from mature voice products such as Wispr Flow (cross-app dictation and clear download path), Superwhisper (offline/privacy, vocabulary and app-aware controls), and VoiceInk (local desktop utility and ownership of the audio path). These references inform page types, not copied branding or assets. Sori remains grounded in the public repository: Windows-first MVP foundation, Rust daemon (`sorid`), loopback IPC, SQLite, optional shell/CLI, and explicit physical-evidence boundaries.

## Page grammar
- `/` — the daily hot path, with one primary action and a compact boundary note.
- `/product/`, `/voice-dictation/`, `/voice-actions/`, `/apps/` — separate stages of speech, text, intent, and destination rather than repeated feature cards.
- `/use-cases/*` — writing, development, and communication scenarios with distinct consequence boundaries.
- `/studio/`, `/models/`, `/profiles/`, `/history/`, `/permissions/` — advanced/native-tool surfaces for configuration and diagnostics.
- `/download/`, `/pricing/`, `/privacy/`, `/security/`, `/docs/`, `/changelog/` — access, trust, reference, and record pages; no unsupported installer, price, performance, or physical-runtime claims.

## Product visual primitive
The signal-path instrument (`products/media/sori-signal.svg`) is an owned, static diagram: capture → preview → review → place. It is deliberately not a screenshot, waveform benchmark, or proof of microphone/input delivery. Use it on product and dictation surfaces with the caption intact.

## Motion and access
Motion is optional and restrained: reveal a line or state only when it clarifies sequence. Honor `prefers-reduced-motion: reduce`. Maintain visible keyboard focus, semantic links, sufficient contrast, and touch targets of at least 44px where controls are introduced.

## Prohibited patterns
No generic AI gradients, glassmorphism, oversized metric claims, fake customer logos, invented pricing, benchmark numbers, stock “human with microphone” imagery, autoplay audio, or UI that implies the physical voice path is verified. Always label availability and physical evidence boundaries.
