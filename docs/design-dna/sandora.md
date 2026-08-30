# Sandora design DNA

## Direction
Hacker/runtime fieldwork: a quiet dark console for mapping an AI department. The interface should feel like an instrument panel and annotated system diagram, not enterprise SaaS.

## Typography
Use the existing Navin display face for oversized, compressed headlines; pair with Atkinson for reading and a restrained monospace for states, routes, and evidence labels. Keep copy short and concrete.

## Palette
- Field: `#111613` (near-black green)
- Ink: `#e7e2d5` (warm off-white)
- Muted: `#a9aa9c`
- Rule: `#4b5149`
- Signal: `#e1a457` (amber)

Amber is reserved for links, active states, and deliberate attention—not decoration.

## Information architecture
Sandora is organized as an AI-department operating surface rather than a generic feature list: Product → Departments → Agents → Workflows → Runtime → Memory → Approvals → Integrations, with Developers/Docs for the provisional contract, Research for the open question, and Releases/Contact for status and human entry. The page types deliberately change by job: atlas, terminal, handoff, gate, connector, schema, lab note, and intake.

Reference observations (live, 2026-08-30): Hermes separates memorable capabilities from documentation and integrations; Factory leads with an agent-native software workflow and developer path; Letta makes memory/identity a product concept; Browserbase foregrounds browser infrastructure, SDK/docs, and use cases; Sintra groups task-oriented assistants around concrete work. Sandora adapts those structural lessons to a truthful concept-stage department map without copying their assets, claims, or layout.

## Layout and primitives
Use a wide editorial frame with generous horizontal margins, thin rules, asymmetric hero columns, and one-pixel grid seams. Primary primitives are terminal/event rows, organization graph lines, worker-state stamps, handoff arrows, approval checkpoints, connector contracts, schema blocks, and source/evidence strips. Route-specific layouts use the body route identifier: departments widen the map, runtime/agents become terminal-dark, approvals split a decision gate, research becomes a ruled lab note, and pricing/security become status notices. Support 375, 768, 1440, and large desktop widths without hiding essential status text.

## Motion and accessibility
Prefer static diagrams and state changes over ambient animation. Preserve visible focus, semantic headings, skip navigation, readable contrast, keyboard access, and reduced-motion behavior via `prefers-reduced-motion: reduce`.

## Prohibited patterns
No generic AI gradients, glassmorphism, testimonial/customer logos, invented prices, benchmarks, availability, certifications, production claims, or physical-proof implications. Do not copy reference-site code or assets. Do not imply that external references validate Sandora's implementation.
