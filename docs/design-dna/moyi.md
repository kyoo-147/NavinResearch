# Moyi design DNA

## Direction
Moyi is a sonic instrument for speech in context: the page should feel like a listening room crossed with an API lab, not a generic AI dashboard. Reference research across Deepgram, ElevenLabs, Cartesia, Speechmatics, and AssemblyAI supports a category structure that moves from model capability to developer interface, then to operational use cases and evidence. Moyi adapts that structure around its truthful research-preview boundary.

## Reference reconstruction
- **Deepgram:** model/API-first navigation and developer pathways suggest separate speech, streaming, and API explanations; adapt as Moyi's `Models → Speech → Streaming → API` path.
- **ElevenLabs:** distinct capability families and an obvious creation-to-developer transition suggest that each modality needs its own story; adapt with separate translation and device/edge stories rather than one features page.
- **Cartesia:** low-latency, voice-native presentation suggests treating signal timing and turn state as visual primitives; adapt with ruled timelines and partial/reviewed state labels, without claiming latency.
- **Speechmatics / AssemblyAI:** transcription, translation, diarization, and developer documentation are organized as practical workflows; adapt with `Solutions` and `Developers` routes that explain inputs, boundaries, and review rather than invented customer results.

These are structural inspirations only. No copy, logos, screenshots, code, or claims are copied from references.

## Information architecture
Primary navigation is intentionally sonic and technical: **Models**, **Speech**, **Translation**, **Runtime**, **Developers**, **Research**. Secondary routes make the category complete without collapsing into one generic page: `/models/family/`, `/streaming/`, `/edge/`, `/devices/`, `/api/`, `/docs/`, `/solutions/`, `/solutions/realtime/`, `/benchmarks/`, `/company/`, `/contact/`, `/privacy/`, and `/terms/`.

Each route has a distinct job and visual identifier: model family map, acoustic field, translation loop, chunk timeline, device boundary, API receipt, solution path, evidence protocol, or research notebook. The shared technical shell supplies accessibility and routing only; Moyi's theme supplies signal geometry, mono labels, cyan context lines, and amber review marks.

## Typography
Use IBM Plex Mono for labels, metadata, and technical notation; Georgia for large editorial headings. Keep headings short, high-contrast, and readable at 375px.

## Palette
- Field: `#111616`
- Ink: `#e8e2d5`
- Muted: `#9c9b91`
- Grid: `#43504d`
- Signal amber: `#d5b36a`
- Context cyan: `#81b8af`

## Layout and primitives
Use a wide measured shell, ruled sections, waveform/ellipse diagrams, signal-path arrows, evidence ledgers, and compact status stamps. Preserve the architecture: models → runtime/API → edge/device → solutions. Use generous vertical rhythm, a two-column editorial split on desktop, and one column at 375/768px.

## Motion and accessibility
Motion is optional and quiet: no essential animated content. Honor `prefers-reduced-motion: reduce`; preserve visible keyboard focus, skip navigation, semantic headings, readable contrast, and text alternatives for diagrams. Validate at 375, 768, 1440, and large desktop widths.

## Prohibited patterns
No AI gradients, glassmorphism, invented model names, benchmarks, prices, customers, certifications, availability, or physical-proof language. Do not use decorative cards to imply product maturity. Do not present concept diagrams as measured system evidence.
