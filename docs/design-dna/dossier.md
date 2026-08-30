# Dossier design DNA

## Direction
Warm forensic document desk: a paper working file opened beside a dark instrument strip. The page follows a document through intake, extraction, validation, reconciliation, review, and handoff; each stage gets its own evidence posture instead of a generic feature-card treatment. Every visual state is explicitly illustrative unless backed by a live receipt.

## Typography
Use a high-contrast editorial serif for page titles and a restrained system sans for labels, status, navigation, and controls. Tight display tracking; generous readable body measure.

## Palette
- Paper: `#e9e2d0`
- Ink: `#171814`
- Muted evidence: `#5d604f`
- Rule: `#a9a58f`
- Signal / exception: `#a33d27`

## Spacing and layout
Use ruled sections, asymmetric two-column editorial composition from 768px upward, and 1rem–6rem responsive gutters. At 375px collapse to one column, preserve 44px-equivalent target area, and never require horizontal scrolling.

## Primitives
## Information architecture
- **The desk**: product thesis and the review workstation.
- **Processing**: document processing, extraction, and validation explain how source pages become candidate records.
- **Review**: reconciliation, human review, and workflows explain disagreement, decisions, and ownership.
- **Build**: integrations, developers, and docs explain contracts without implying a live API.
- **Boundaries**: security, availability/pricing, privacy, terms, and contact state what is known and what remains unannounced.

## Reference reconstruction notes
Reducto's document-first extraction story, Rossum's document-to-workflow framing, and Nanonets' OCR/API/solutions split informed the route map. Dossier adapts those category patterns into a local-first, source-adjacent review desk: no copied identity, no fabricated demo output, and no invented commercial terms.

## Primitives
Illustrative document canvas; restrained bounding boxes; evidence links; confidence/status labels; discrepancy rows; retry and human-review states; source trail. Prefer borders, rules, and whitespace over cards.

## Motion and accessibility
Motion is optional and quiet. Respect `prefers-reduced-motion`; keep visible focus outlines, semantic landmarks, readable contrast, and descriptive labels. Validate at 375, 768, 1440, and large desktop widths.

## Prohibited patterns
No generic AI gradients, glassmorphism, invented customer logos or metrics, fake processing results, unsupported prices/availability/certifications, or decorative visuals presented as physical/product proof.
