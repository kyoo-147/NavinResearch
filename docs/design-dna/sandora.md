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

## Layout and primitives
Use a wide editorial frame with generous horizontal margins, thin rules, asymmetric hero columns, and one-pixel grid seams. Primary primitives are terminal/event rows, organization graph lines, worker-state stamps, handoff arrows, approval checkpoints, and source/evidence strips. Support 375, 768, 1440, and large desktop widths without hiding essential status text.

## Motion and accessibility
Prefer static diagrams and state changes over ambient animation. Preserve visible focus, semantic headings, skip navigation, readable contrast, keyboard access, and reduced-motion behavior via `prefers-reduced-motion: reduce`.

## Prohibited patterns
No generic AI gradients, glassmorphism, testimonial/customer logos, invented prices, benchmarks, availability, certifications, production claims, or physical-proof implications. Do not copy reference-site code or assets. Do not imply that external references validate Sandora's implementation.
