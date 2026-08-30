# Product-site architecture

Navin Research publishes seven product programs from one generated source tree:

- `sandora.navinresearch.com`
- `moyi.navinresearch.com`
- `sori.navinresearch.com`
- `howhow.navinresearch.com`
- `dossier.navinresearch.com`
- `autopilot.navinresearch.com`
- `lajvard.navinresearch.com`

## Source of truth

Each product owns three required files:

- `products/content/<slug>.mjs` — narrative, capability, evidence, status, access, and source trail.
- `products/themes/<slug>.css` — a product-specific visual system prefixed by `.product-<slug>`.
- `products/media/<slug>-system.svg` — an original, accessible system diagram.

`scripts/product-data.mjs` exposes the same content to the multilingual main-site product directory. `scripts/generate-products.mjs` generates each subdomain entry page and cross-product navigation.

Run:

```sh
npm test
```

The validation gate checks all required product files, canonical URLs, metadata, evidence/access anchors, shared navigation, and removal of the former generic pricing scaffold.

## Status and claims

Product copy must distinguish:

- `VERIFIED` or `SOURCE-BACKED`: supported by a named public source.
- `UNVERIFIED`: not exercised by the website build or lacking physical/runtime proof.
- `NOT_CALLED`: an implementation path exists but was not executed for this evidence.
- `CONCEPT-STAGE` or `DESIGN INTENT`: a proposed direction, not a shipped capability.
- `NOT ANNOUNCED`: no date, price, package, or availability has been approved.

Never infer performance, production readiness, launch dates, customer outcomes, or commercial availability from a repository description.

## Media policy

Use project-owned media or original diagrams. Every image needs useful alternative text and a visible provenance/status caption when it may be mistaken for operational proof. Concept renders, fixtures, simulations, and physical tests must remain explicitly distinguishable.

Autopilot currently includes project-source images copied from its public repository. Other product pages use original technical/editorial diagrams until approved product screenshots or photography are available.

## Interest and commerce

Current non-commercial product CTAs are either:

- a transparent, non-binding email expression of interest; or
- a direct open-research source link.

Do not add deposits, checkout, pricing numbers, delivery estimates, or an email-marketing form until the owner approves packages, terms, privacy/retention, consent copy, regions, support obligations, and a production data processor.

## Layout contract

The generator separates shared technical primitives from page composition. Every route resolves an explicit `data-layout` value (or a future `page.layout` override) from this vocabulary:

- `editorial` — thesis-led product landing page;
- `index` — route directory or orientation;
- `workflow` — sequential steps, use cases, and handoffs;
- `docs` — developer and documentation entry points;
- `specs` — models, APIs, hardware, and bounded technical detail;
- `media` — source imagery, galleries, and visual evidence;
- `ledger` — privacy, security, and evidence boundaries;
- `timeline` — research and release chronology;
- `comparison` — explicit side-by-side distinctions;
- `availability` — access, contact, and commercial-status boundaries.

These layouts intentionally share semantic markup, focus behavior, and responsive primitives, while CSS modifiers change composition per page and product theme. Validation fails when a generated route omits its layout contract or a product collapses to fewer than three route layouts.
