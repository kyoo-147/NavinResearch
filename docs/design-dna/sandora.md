# Sandora design DNA

## Direction
Operational Field Atlas: a dark editorial operating surface for mapping an AI department. It combines tactile terrain, organizational specimens, readable system routes, and explicit review boundaries. The interface should feel like a field atlas and accountable instrument panel, not generic enterprise SaaS or neon AI theatre.

## Typography
Use Atkinson for editorial display and body reading, with a restrained monospace for states, routes, records, and evidence labels. Display type is large but controlled by semantic roles rather than route-local sizes: display, page title, section title, component title, body, large body, and micro label. Keep copy short and concrete; never split display words arbitrarily.

## Palette
- Bone field: `#f2f0e7`
- Paper field: `#e6e4da`
- Graphite field: `#151a16`
- Deep field: `#090d0a`
- Ink: `#151a16`
- Body copy: `#555c54`
- Light rule: `#bec2b9`
- Dark rule: `#414a42`
- Route / authority: `#1528f5` (cobalt)
- Consequential accent: `#ff4b12` (rust orange)
- Secondary warm accent: `#f28a2e`
- State / orientation: `#d8ff45` (acid chartreuse)

Rust orange is reserved for consequential accents, cobalt for routes, authority, and major research transitions, and chartreuse for status, selection, and navigational orientation. None is decorative glow. Purple is not a Sandora status channel.

## Information architecture
Sandora is organized as an AI-department operating surface rather than a generic feature list: Product → Departments → Agents → Workflows → Runtime → Memory → Approvals → Integrations, with Developers/Docs for the provisional contract, Research for the open question, and Releases/Contact for status and human entry. The page types deliberately change by job: atlas, terminal, handoff, gate, connector, schema, lab note, and intake.

Reference observations (live, 2026-08-30): Hermes separates memorable capabilities from documentation and integrations; Factory leads with an agent-native software workflow and developer path; Letta makes memory/identity a product concept; Browserbase foregrounds browser infrastructure, SDK/docs, and use cases; Sintra groups task-oriented assistants around concrete work. Sandora adapts those structural lessons to a truthful concept-stage department map without copying their assets, claims, or layout.

## Original media system
Sandora owns three normalized media families: **product proof** (HTML interface studies with persistent concept/static/not-live state), **operational field and geology** (atlas, territories, workflow river, strata, observatory, and approval boundary), and **research/editorial graphics** (specimen and archive plates). Every image is an original project asset with a truthful caption and consistent frame/provenance treatment. Object-like renders are illustrative concept imagery, never physical or runtime proof. Reference screenshots, logos, customer marks, product UI, diagrams, and distinctive brand subjects remain research-only and never enter the public repository.

## Layout and primitives
Use a `1560px` maximum page field, fluid shared gutters, a 12-column desktop grid, thin rules, asymmetric hero columns, and one-pixel seams. Spacing roles are micro, compact, standard, large, and cinematic; controls are at least `44px`; ordinary frames use a restrained small radius while diagrams may use round geometry. Primary primitives are the shared Sandora app chrome, department directories, event rows, worker-state stamps, handoff sequences, approval ledgers, connector contracts, schema blocks, and source/evidence strips. Route-specific layouts change composition by job: departments become a responsibility directory, agents use persistent role bands, workflows become a sequence, runtime uses a module field, memory uses geological strata, approvals/security use ledgers, docs use a manual/code bridge, pricing uses an availability ledger, and research/releases form a question/archive family. Support 375, 390, 768, 1024, 1440, 1560, and 1920 widths without hiding essential status text.

## Motion and accessibility
Prefer static diagrams and state changes over ambient animation. Preserve visible focus, semantic headings, skip navigation, readable contrast, keyboard access, and reduced-motion behavior via `prefers-reduced-motion: reduce`.

## Prohibited patterns
No generic AI gradients, glassmorphism, testimonial/customer logos, invented prices, benchmarks, availability, certifications, production claims, or physical-proof implications. Do not copy reference-site code or assets. Do not imply that external references validate Sandora's implementation.
