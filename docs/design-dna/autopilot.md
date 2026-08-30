# Autopilot design DNA

## Direction
Dark editorial fieldwork: a test-track notebook translated into a restrained instrument panel. Show the chain from sensor to actuator and label whether a view is source material, diagram, simulation, or physical evidence.

## Type
Atkinson for readable body/UI copy; Pixelated Elegance for the oversized Autopilot wordmark only. Uppercase micro-labels use generous tracking. Keep headings short and sentence case elsewhere.

## Palette
Ground `#101315`; panel `#171c1e`; ink `#eef0e8`; muted `#aab3ad`; rule `#53605d`; signal yellow `#e4c45b`; track green `#8bb6aa`. Yellow is for links, focus, and measured-looking accents—not success claims.

## Layout and primitives
Use a 12-column editorial grid that collapses to one column at 760px. Generous 1px rules, indexed sections, source captions, technical diagrams, vehicle photography, telemetry-like linework, and compact evidence/status rows. Preserve readable line lengths and 44px minimum interactive targets.

## Motion and access
No essential information depends on motion. Honor `prefers-reduced-motion: reduce`; preserve visible keyboard focus, skip navigation, semantic headings, alt text, and sufficient contrast. Responsive targets: 375, 768, 1440, and wide desktop.

## Prohibited patterns
No generic AI gradients, glassmorphism, floating card forests, invented metrics, pricing, customer logos, certification badges, autonomous-road claims, or simulation presented as physical proof. Do not copy upstream code or assets; use only project-owned media with provenance captions.

## Reference reconstruction notes

The information architecture is adapted from inspected official category references, not copied: comma/openpilot separates the vehicle product from open-source code and community documentation; Applied Intuition foregrounds simulation and validation as a product surface; RoboRacer uses a compact technical platform story; and the public Autopilot repository supplies the BFMC-oriented scale-model context. The resulting route order is intentionally physical-to-software: `Vehicle → Perception → Localisation → Planning → Control`, with `Hardware → Software → Simulation` as the lab layer and `Research → Benchmarks → Releases` as the evidence layer.

### Evidence rules

- `PROJECT SOURCE` means an owned image or public repository fact, not a live runtime observation.
- `SIMULATION` means synthetic or diagrammatic material and cannot support physical or public-road claims.
- `NOT_CALLED` / `UNVERIFIED` remain visible when this site has not executed the vehicle stack.
- No route may imply driverless operation, safety certification, customer deployment, or benchmark performance without a captured, reproducible receipt.

### Page grammar

The overview uses a vehicle-loop thesis; system pages use handoff diagrams; the vehicle page uses physical context and a reproduction checklist; perception/localisation/planning/control pages isolate transformations; simulation uses a dashed synthetic grid; benchmarks are protocol-first; and research is a field-notebook evidence taxonomy. This is a deliberate test-track instrument language rather than a generic SaaS feature grid.

### Source retrieval status

The linked repository URL was checked during reconstruction but its GitHub `main` README raw path returned HTTP 404; therefore repository-specific statements remain bounded by the existing source-backed content and are not upgraded to fresh execution evidence. Official reference pages inspected: https://comma.ai/openpilot, https://appliedintuition.com/, and https://roboracer.ai/. Their tracking scripts/assets were not copied.

## Checkpoint 4 refinements

The route notebook now gives each high-impact loop edge an instrument treatment: perception records capture conditions, localisation records coordinate context, planning records intent, control records actuation boundaries, and simulation records synthetic assumptions. Hardware and software use wiring/interface grammar, while benchmarks use a protocol contract and releases use an archive treatment. These are editorial distinctions only; they do not indicate that the stack has been called or that the pictured vehicle is operational.
