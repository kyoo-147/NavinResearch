# Agent Instructions

Read `PROJECT_STATE.md` and `README.md` before making changes. Then read the documentation relevant to the area being changed, especially `docs/products.md`, `docs/design-system.md`, `docs/accessibility.md`, `analytics/README.md`, and `deployment-example/README.md`.

## Source and generation rules

- This is a generated static site. Never make a generated HTML file the sole source of a change.
- Parent-site locale/content source lives in `site.config.mjs`, `scripts/route-details.mjs`, `scripts/blog-posts.mjs`, and generator components under `scripts/components/`.
- Product-site source lives in `products/content/*.mjs`, `products/themes/*.css`, shared product primitives, and `scripts/generate-products.mjs`.
- Run `npm test` after any source change. It regenerates committed output, validates routes/content/SEO contracts, and syntax-checks JavaScript.
- After generation, inspect `git diff` and require `git diff --check`; generated output must be committed with its source.

## Product and evidence rules

- Navin Research and each of the seven product sites must remain structurally distinct. Share technical/accessibility primitives, not interchangeable page templates.
- Preserve explicit evidence states such as `VERIFIED`, `SOURCE-BACKED`, `UNVERIFIED`, `NOT_CALLED`, `CONCEPT-STAGE`, `DESIGN INTENT`, and `NOT ANNOUNCED`.
- Never invent prices, customers, testimonials, benchmarks, dates, certifications, model capabilities, language coverage, latency, compatibility, availability, physical proof, production maturity, or sentience.
- Lajvard is the sole catalog item marked as research. Sandora, Moyi, Sori, HowHow, Dossier, and Autopilot remain products, while their individual evidence/access limitations stay explicit.
- Use project-owned media or original diagrams. Captions must distinguish concepts, fixtures, simulations, source material, and physical evidence.
- Do not add checkout, deposits, waitlists, CRM collection, or commercial claims until pricing, terms, consent, retention, support, and data-processing decisions are owner-approved.

## Design and accessibility rules

- Preserve the parent site's Dark Editorial Fieldwork direction, Atkinson typography, natural field imagery, acid signal color, approved multilingual homepage copy, and reduced-motion behavior.
- Keep semantic landmarks, one page-level `h1`, keyboard operation, visible focus, 44px targets where specified, logical source order, and no information conveyed only by color, motion, hover, or imagery.
- Validate representative pages at 375px and 1440px at minimum; use the full matrix in `docs/accessibility.md` for visual releases.
- The Releases registry intentionally remains a semantic wide table with horizontal scrolling on mobile.

## Analytics and privacy rules

- Analytics is an offline Nginx-log aggregation pipeline, not client-side behavioral tracking.
- Never persist raw IPs, IP hashes, URLs, user agents, referrers, events, or individual trajectories in analytics storage.
- A visitor is one exact source IP per UTC/log day during in-memory deduplication. Production public aggregation currently publishes groups of one (`minimumGroupSize: 1`).
- Keep `/visitor-insights/` authenticated, `private, no-store`, excluded from indexing, and outside public aggregate data.
- Keep credentials, raw logs, SQLite databases, MMDB files, generated production JSON, and operator secrets outside the repository and immutable web releases.

## Deployment rules

- Never commit or print credentials. Do not reuse a root/server password for the private analytics dashboard.
- Build and validate locally before deployment.
- Production deployments must use an explicit public-file allowlist, stage a complete immutable release, validate it, and atomically switch both `/var/www/navinresearch.com/current` and `/var/www/navinresearch.com/ecosystem-current` while preserving rollback.
- Do not deploy the repository wholesale: source PNGs, Python/operator code, internal Markdown, product source modules, tests, and deployment files are not public release assets.
- Verify the parent domain and all seven `*.navinresearch.com` product hosts, HTTP-to-HTTPS redirects, robots, sitemaps, representative 404s, security headers, analytics boundaries, and rollback after a release.

## Git and delivery

- Work from the actual `main` state and inspect `git status` before editing.
- Keep secrets, logs, databases, MMDB files, deployment archives, and browser artifacts out of commits.
- Prefer focused Conventional Commit messages.
- GitHub Actions may be unavailable; local evidence is required and CI failure must not be hidden or described as a test failure when the job never started.
