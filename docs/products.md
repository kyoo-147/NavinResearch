# Product-site architecture

Navin Research publishes a parent site and a thirteen-entry catalog. Seven product sites are generated in this source tree:

- `sandora.navinresearch.com`
- `moyi.navinresearch.com`
- `sori.navinresearch.com`
- `howhow.navinresearch.com`
- `dossier.navinresearch.com`
- `autopilot.navinresearch.com`
- `lajvard.navinresearch.com`

TeraFlow is the eighth catalog product at `teraflow.navinresearch.com`. Its website is maintained and built separately in `D:/work/michael/teraflow_web`; this repository owns only its parent-site catalog and search entry. The five additional catalog entries—MERAK, Navin OpenBot, Synomorph, PardraVerse, and FirstSnow—are maintained in their own workspaces or repositories and are linked from the parent catalog without being generated as product microsites here.

## Independent system registry and research artifacts

The original nine public-facing systems are intentionally distinct: Navin Research (parent), Sandora, Moyi, Sori, HowHow, Dossier, Autopilot, Lajvard, and TeraFlow. The five newer catalog entries retain their own external product surfaces and source boundaries. The seven integrated product sites each own their renderer, theme, runtime, route-family composition, header, homepage, and footer while using only shared technical/accessibility primitives. TeraFlow retains its own separate build pipeline and visual system.

The reconstruction research artifacts are maintained outside the repository at `D:/work/michael/artifacts/navin-reconstruction/`, with one evidence bundle per system: `navin/`, `sandora/`, `moyi/`, `sori/`, `howhow/`, `dossier/`, `autopilot/`, and `lajvard/`. Each bundle contains the applicable `DESIGN-DNA.json`, `ROUTES.md`, `SOURCE-MAP.md`, and `SYNTHESIS.md`; implementation workflow reports are stored alongside these bundles.

## Source of truth

Each integrated product owns three required files:

- `products/content/<slug>.mjs` — narrative, capability, evidence, status, access, and source trail.
- `products/themes/<slug>.css` — a product-specific visual system prefixed by `.product-<slug>`.
- `products/media/<slug>-system.svg` — an original, accessible system diagram.

External catalog entries are defined in `products/catalog-external.mjs`. That registry contains only parent-catalog metadata and canonical external URLs; it does not claim that those products have generated microsites or that every linked runtime is publicly available.

`scripts/product-data.mjs` exposes the seven integrated products, TeraFlow, and the five external catalog entries to the multilingual main-site product directory. `scripts/generate-products.mjs` generates only the seven integrated subdomain sites and their cross-product navigation.

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

The generator separates shared technical primitives from page composition. The parent Navin Research site and all seven product systems are independently authored at the renderer/theme/runtime layer; generated HTML is output, never the sole source of a change. Every route resolves an explicit `data-layout` value (or a future `page.layout` override) from this vocabulary:

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
