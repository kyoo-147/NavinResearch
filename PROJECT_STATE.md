# Project State

## Current Objective

Maintain the deployed multilingual Navin Research ecosystem as eight truthful, production-quality static websites:

- parent: `navinresearch.com`
- products: `sandora`, `moyi`, `sori`, `howhow`, `dossier`, `autopilot`, and `lajvard` under `*.navinresearch.com`

The current reconstruction implementation milestone is committed, pushed, and deployed at implementation commit `aa0ab2a`. The repository now includes a fail-closed public release allowlist builder, but production still serves the previous over-broad full-tree artifact until an authenticated atomic deployment is completed. The immediate milestone remains **checkpoint stability and production hardening**, not new feature work.

## Current Architecture

### Parent static site

- `site.config.mjs` is the canonical EN/VI/ZH-CN content, metadata, route, chapter, legal, and locale-path contract.
- `scripts/generate-site.mjs` composes pages using `scripts/components/page-head.mjs` and `scripts/components/site-shell.mjs`.
- The generator emits 60 localized HTML pages: 20 per locale (home, 11 content sections, Releases, five nature chapters, and two legal pages).
- `scripts/blog-posts.mjs` generates 50 English Markdown articles under `blog/<category>/`.
- `scripts/route-details.mjs` supplies route-specific feature compositions for deep parent routes.
- Generation also emits `content-routes/search-index.json`, root `sitemap.xml`, and `404.html`.
- `styles.css` and `script.js` implement the parent Dark Editorial Fieldwork visual/runtime layer. `content-routes/` implements editorial route, search, release-search, and validation behavior.

### Product static sites

- Each product owns `products/content/<slug>.mjs`, `products/themes/<slug>.css`, and an original `products/media/<slug>-system.svg`.
- `scripts/generate-products.mjs` generates product HTML, product-specific robots/sitemaps/404s, and `products/site-manifest.json`.
- The manifest currently contains 145 routes:
  - Sandora 22
  - Moyi 22
  - Sori 24
  - HowHow 17
  - Dossier 21
  - Autopilot 20
  - Lajvard 19
- Routes resolve one of ten semantic layout families: `editorial`, `index`, `workflow`, `docs`, `specs`, `media`, `ledger`, `timeline`, `comparison`, or `availability`.
- `products/product-foundation.css` and `products/product-site.js` provide shared responsive/accessibility primitives. Product themes and content contracts provide distinct IA, visual grammar, voice, evidence, and access states.
- Product pages are currently English-only. The parent catalog and parent routes are EN/VI/ZH-CN.

### Validation

- `npm test` runs parent generation, product generation, route/content validation, and JavaScript syntax checks.
- `content-routes/validate.mjs` checks generated parent and product contracts, manifest/layout agreement, route purpose, required assets, metadata, canonical/hreflang, robots/sitemaps, search inventory, legal/404 structures, and stale generated Markdown.
- Analytics tests use Python `unittest` through `uv`.
- There is no TypeScript, package dependency tree, bundled application build, or committed Playwright test suite.

### Analytics runtime

- Production analytics is an offline Python pipeline, not a browser tracker or always-on application server.
- Nginx writes a dedicated access log. `analytics/run-production.sh` combines the previous uncompressed rotation and active log in chronological order.
- `analytics/aggregate.py` deduplicates exact IP in memory per UTC/log day, resolves an operator-installed DB-IP City Lite/compatible MMDB, and stores only daily aggregate counts in SQLite.
- It atomically exports public country/day JSON and authenticated private country/region/city JSON. No raw IP, IP hash, URL, user agent, referrer, event, or individual trajectory is stored in SQLite or JSON.
- Production JSON, SQLite, MMDB, raw logs, venv, and operator scripts live outside the web release. Nginx serves public/private JSON through exact aliases.
- Production schedules: five-minute aggregate refresh and monthly DB-IP refresh via systemd timers.

### Production delivery

- Nginx serves the parent release root and product subdirectories as separate hosts.
- Atomic releases use `/var/www/navinresearch.com/releases/<release-id>` and both `current` and `ecosystem-current` symlinks.
- Current web implementation release: `/var/www/navinresearch.com/releases/20260830134043-aa0ab2a`.
- Previous rollback release: `/var/www/navinresearch.com/releases/20260830092725-614006f`.
- The deployed page content was compared against all 255 generated public parent/product files during this checkpoint and matched after newline normalization.
- Validated allowlisted deployment candidate: `D:/work/michael/artifacts/navin-release-20260830212841-b3e6b7c.tar.gz` (SHA-256 `9a2359933874a11eb51834086b9acaa3f204b96ad1befa1d844fbfe81aec5917`, 2,363,623 bytes). It was extracted to a disposable directory and independently reverified as the exact 323-file release.

## Completed Work

- Implemented the multilingual parent site with approved EN/VI/ZH-CN homepage copy, locale URLs, metadata, hreflang, chapters, legal pages, route navigation, search, Releases, and product catalog.
- Preserved the Dark Editorial Fieldwork parent direction: Atkinson, natural field imagery, dark green/near-white palette, acid micro-accent, reduced motion, semantic layout, and responsive behavior.
- Published 50 generated, source-linked practical AI Markdown notes across six categories.
- Implemented seven independent product sites with distinct navigation, IA, themes, route hierarchies, CTAs, legal pages, 404 pages, metadata, robots, sitemaps, and explicit evidence/access boundaries.
- Replaced generic product scaffolding with category-correct semantic layout families and route-specific compositions.
- Deepened the latest product routes:
  - Sandora governance/developer surfaces
  - Moyi speech/runtime/evaluation surfaces
  - Sori local desktop studio surfaces
  - HowHow evidence/source/review surfaces
  - Dossier forensic workflow surfaces
  - Autopilot test-track/research surfaces
  - Lajvard field-notebook surfaces
- Fixed the duplicated Autopilot localization route declaration.
- Added an explicit Lajvard 404 home CTA and fixed 375px Movement/Life visual clipping with a 2rem mobile radius.
- Implemented and deployed privacy-preserving production analytics using DB-IP City Lite, aggregate-only SQLite, static JSON, authentication, `no-store`, and systemd schedules.
- Public analytics intentionally publishes country groups of one. Private analytics remains authenticated and returns `401` without credentials.
- Latest implementation batch was merged directly into `main`, pushed to GitHub, and deployed atomically.
- Permanently cancelled external recurring implementation schedule `e072d1d75391`; it must not be recreated unless the owner explicitly asks.

## Partially Completed Work

- Product screenshots, demos, diagrams, prototype media, and physical proof remain limited. Existing concept/source imagery must not be promoted to runtime or physical evidence.
- Sori, Autopilot, and Lajvard physical behavior remains unverified by this website repository.
- Pricing, purchase terms, waitlist policy, CRM/commerce, support obligations, and several commercial/privacy decisions are not approved or implemented.
- Product sites remain English-only; no product localization decision has been approved.
- Referrer/UTM summaries are not implemented because privacy/retention design is not approved.
- Automated browser E2E is currently an ad-hoc Playwright CLI check, not a committed test suite.
- Local release packaging is hardened and validated. `scripts/build-release.mjs` builds only tracked public pages/assets, cross-checks parent/product inventories, rejects symlinks and internal/extra/missing/modified files, and excludes demo analytics JSON. Production still needs an authenticated atomic redeployment of this artifact; see Known Issues and P0 actions.

## Important Decisions

- **Generated source of truth:** edit source contracts/generators, regenerate, validate, and commit source plus generated output. Never patch generated HTML alone.
- **Independent product worlds:** products share accessibility/runtime primitives but retain distinct IA, navigation, route hierarchy, storytelling, and themes.
- **Manifest authority:** `products/site-manifest.json` is the generated authority for all product routes and layouts.
- **Truth before marketing:** do not fabricate prices, metrics, customers, certifications, dates, compatibility, availability, model coverage, latency, physical proof, or maturity.
- **Status taxonomy:** retain precise evidence labels and explicit unknown/unannounced states.
- **Catalog classification:** Lajvard is the sole `research` catalog item; the other six remain `product` entries even when their access/evidence status is limited.
- **Approved homepage copy:** preserve “A new frontier is taking shape.” / “Một chân trời mới đang thành hình.” / “新的前沿正在成形。” and `CHAPTER 00 / WEALTH OF NATURE — COMING SOON`.
- **Responsive Releases table:** preserve the semantic wide table and intentional mobile horizontal scrolling.
- **Analytics privacy:** exact IP may exist only in restricted logs and in-memory daily deduplication. Persist aggregate counts only. Public minimum group size remains 1.
- **Authenticated operator view:** `/visitor-insights/` stays authenticated, `private, no-store`, noindex, and absent from sitemap/search.
- **Atomic deployments:** stage immutable release, validate, switch both symlinks, and retain rollback.
- **No credential persistence:** server/dashboard credentials never belong in Git, handoff documents, logs, deployment archives, or command examples.

## Do Not Revert

- Do not restore the old generic product pricing scaffold or collapse routes back into one interchangeable template.
- Do not remove semantic `data-layout` contracts or the purpose-specific workflow/ledger/docs/specs/media/availability frames.
- Do not reintroduce the duplicate Autopilot `/localization/` declaration.
- Do not restore Lajvard's clipping mobile circle; retain the 2rem mobile radius and explicit 404 home CTA.
- Do not relabel Lajvard as a generally available product or imply preorder/hardware availability.
- Do not promote browser fixtures, source images, concept renders, README descriptions, simulations, or synthetic evidence to physical/runtime proof.
- Do not change approved parent homepage copy while working on products, analytics, or deployment.
- Do not weaken analytics to store raw identifiers, hashes, URLs, referrers, user agents, or trajectories.
- Do not change public analytics suppression from `minimumGroupSize: 1` without an explicit privacy/product decision.
- Do not expose `/visitor-insights/` publicly or cache/index it.
- Do not use one server password as the private dashboard password.
- Do not recreate cancelled schedule `e072d1d75391` without an explicit owner request.

## Relevant Files

- `AGENTS.md` — durable rules for future agents.
- `PROJECT_STATE.md` — canonical continuation checkpoint.
- `README.md` — repository overview and local workflow.
- `site.config.mjs` — parent locale, metadata, routes, chapters, legal copy.
- `scripts/generate-site.mjs` — parent/localized/blog/search/sitemap generation.
- `scripts/route-details.mjs` — route-specific parent compositions.
- `scripts/blog-posts.mjs` — 50-post Markdown source and renderer.
- `scripts/components/page-head.mjs` — canonical, hreflang, social, favicon, assets.
- `scripts/components/site-shell.mjs` — parent headers, drawer, footers, locale switching.
- `content-routes/validate.mjs` — primary generated-output validation gate.
- `content-routes/route-foundation.css` — parent route/chapter/release/search layout.
- `products/content/*.mjs` — product truth/content/IA/evidence contracts.
- `products/themes/*.css` — product-specific visual systems.
- `products/product-foundation.css` — shared product layout/accessibility primitives.
- `products/product-site.js` — product navigation/year runtime.
- `scripts/generate-products.mjs` — product renderer, layout selection, manifest, robots/sitemaps.
- `scripts/build-release.mjs` — fail-closed public artifact allowlist, sitemap/manifest cross-checks, byte verification, and adversarial self-test.
- `products/site-manifest.json` — generated 145-route product inventory.
- `docs/design-dna/*.md` — approved product/parent design directions.
- `docs/products.md` — product architecture, status, media, CTA, and layout contracts.
- `docs/design-system.md`, `docs/components.md`, `docs/accessibility.md` — parent design/runtime/accessibility contracts.
- `analytics/aggregate.py` — importer, aggregation, retention, and JSON export.
- `analytics/run-production.sh` — chronological production log assembly and run.
- `analytics/update-dbip-city.sh` — validated atomic monthly database refresh.
- `analytics/test_aggregate.py` — seven analytics/privacy tests.
- `deployment-example/nginx.conf` — required Nginx analytics/Markdown/security boundaries.
- `deployment-example/*.service`, `*.timer` — hardened systemd examples.
- `.github/workflows/validate.yml` — GitHub validation workflow; currently unable to start due account billing lock.

## Recent Changes

- `fc1e237` — add the public release allowlist builder and package-script gate; the current follow-up hardens sitemap output collisions and ancestor-symlink tests.
- `f00554b` — add the durable agent rules and continuation checkpoint.

Most recent implementation commits, newest first:

- `aa0ab2a` — finalize product route generation, Autopilot duplicate fix, Lajvard 404/mobile fix, regenerated output/manifest.
- `4aa775e` — deepen Lajvard field-notebook route CTAs.
- `8cedf9e` — deepen Autopilot test-track route grammar.
- `bdf8371` — deepen Dossier forensic workflow surfaces.
- `a98dc5f` — sharpen Sori local studio route grammar.
- `b0d026a` — deepen Moyi sonic route storytelling.
- `54357c4` — distinguish Sandora governance/developer surfaces.
- `9fb8a68` — differentiate HowHow evidence route surfaces.
- `1221722` — deepen multilingual parent research routes.
- `ed17962` — render semantic product page families.

The historical `docs/ecosystem-review-milestone1.md` is a dated review, not current status. Its deployment drift, generated Markdown, product legal footer, and generic scaffold blockers have been resolved. Its English-only product localization concern, media limitations, and broader full-matrix accessibility recommendations remain relevant.

## Validation Status

### Passed locally during this checkpoint

- `npm test`
  - **PASS**
  - Generated 60 localized pages, 50 Markdown posts, and 145 product pages.
  - `content-routes/validate.mjs` passed route/content/asset/SEO/manifest contracts.
  - All JavaScript/module syntax checks in `package.json` passed.
- `git diff --exit-code` immediately after generation
  - **PASS before checkpoint documentation edits**
  - Proved committed generated output matched current generators at implementation commit `aa0ab2a`.
- `git diff --check`
  - **PASS**
  - Git emitted expected Windows LF/CRLF conversion warnings; no whitespace errors were found.
- `uv run python -m unittest analytics.test_aggregate -v`
  - **PASS: 7/7**
  - Verified parser filtering, exact-IP daily deduplication/idempotency, no identifier persistence, group-of-one public export, provider labels, retention, schema rejection, and transaction rollback on out-of-order logs.
- Local link/asset audit script over manifest plus representative parent inventory
  - **PASS: 5,015 references across 160 pages, 0 missing targets**.
- Playwright CLI against local static server at 375x900 and 1440x900
  - **PASS: 24 page/viewport checks** across all three parent locales, parent Research/Products, and representative routes for all seven products.
  - Verified HTTP 200, one `h1`, `<main>`, no horizontal overflow, and zero console/page errors.
  - Verified the mobile product menu opens (`aria-expanded=true`) and closes with Escape (`false`).
  - Verified public search returns results for `research`.

### Passed against production during this checkpoint

- Full generated-content comparison using `products/site-manifest.json` and root `sitemap.xml`
  - **PASS: 255/255 live parent/product pages matched local generated files after newline normalization; 0 status failures, 0 mismatches.**
- Eight host roots and HTTP-to-HTTPS redirects
  - **PASS:** parent plus all seven product subdomains returned HTTPS 200 and HTTP 301 to HTTPS.
- Product/root robots and sitemaps
  - **PASS: 16/16 returned 200.**
- `https://navinresearch.com/visitor-map/data.json`
  - **PASS:** HTTP 200 and valid JSON.
- unauthenticated `https://navinresearch.com/visitor-insights/data.json`
  - **PASS:** HTTP 401 with `Cache-Control: private, no-store`.


### Passed for local release hardening

- `npm run check:release`
  - **PASS:** built and verified an isolated 323-file artifact containing 209 HTML files, 50 intentional public blog Markdown files, 110 parent URLs, and 145 product URLs (138 indexable product sitemap URLs plus seven product 404s).
  - Cross-checked the parent sitemap, all seven product sitemaps, and `products/site-manifest.json` without hard-coded route totals.
  - Adversarial checks rejected internal Markdown, operator Python, an unlisted web asset, a modified hash, a missing file, unsafe output containment, sitemap drift/host mutation/output collisions, and symlinked release roots or ancestors.
- `npm run release:build -- release/candidate` followed by `npm run release:verify -- release/candidate`
  - **PASS:** exact 323-file allowlist and SHA-256 source parity; no forbidden paths found.
  - The commit-addressed archive was extracted into a separate disposable directory and `release:verify` passed again with the same 323-file inventory.
- Playwright against the isolated candidate at 375px and 1440px
  - **PASS: 24 page/viewport checks** across all parent locales and representative routes for all seven products.
  - Every tested page returned 200 with one `h1`, one `main`, no horizontal overflow, and zero console errors.
  - Internal/source/operator paths and repository demo analytics JSON returned 404 from the isolated artifact. Production analytics JSON is intentionally supplied by Nginx aliases outside the release.

### Failed or unavailable

- GitHub Actions run `33314706771` for `aa0ab2a`
  - **FAILED TO START**, not a code/test failure.
  - GitHub annotation: account locked due to a billing issue; job had zero steps.
- Public release allowlist check
  - **FAIL:** `/1.png`, `/README.md`, `/analytics/aggregate.py`, and `/products/content/sandora.mjs` returned HTTP 200 in production.
  - This proves the current release was packaged from the full tracked tree, contrary to the documented allowlisted-release boundary. `.git/config` correctly returned 404. No credential/database/MMDB exposure was observed, but source/design/operator files must be removed from the public artifact.
- Screen-reader testing, full keyboard traversal, computed contrast across every theme/background, full 320/390/540/768/900/1920 matrix, performance trace, and physical product/runtime verification were **not run** in this checkpoint.

## Known Issues

- **Production artifact is still over-broad:** tracked source/design/operator files remain publicly reachable from the currently active full-tree release. The local allowlisted replacement passes validation but has not yet been deployed.
- GitHub Actions cannot start while the account billing lock remains. Local gates are authoritative until resolved.
- `.github/workflows/validate.yml` runs `generate-site.mjs` rather than `npm test`; when CI becomes available it should be checked for product-generation freshness coverage.
- Product sites are English-only while the parent site is EN/VI/ZH-CN; this is a known policy/product decision, not an accidental missing locale.
- Real approved product media and physical/runtime evidence remain limited.
- No committed browser E2E suite exists; current Playwright verification is manual/ad-hoc.
- Git on Windows emits extensive LF/CRLF conversion warnings. They are not current diff failures but make logs noisy.
- Root design PNGs remain tracked source assets and should never be included in the public allowlisted artifact.
- CI/local validation does not constitute physical proof for Sori, Autopilot, or Lajvard.

## Current Blockers

- GitHub account billing lock prevents GitHub Actions jobs from starting.
- Secure production release hardening is locally ready, but deployment is **BLOCKED** because this environment has no authenticated non-interactive SSH channel; a batch-mode SSH probe was denied. Never store or reuse credentials to bypass this boundary.
- Commercial features are blocked on owner-approved pricing, terms, privacy/retention, consent, support, and data-processing decisions.
- Physical claims are blocked on actual device/runtime acceptance evidence.
- Private dashboard password reset requires a dedicated owner-approved password; the server/root password must not be reused.

## Next Actions

### P0 — must do next

1. Push the three validated local commits (`f00554b`, `fc1e237`, `b3e6b7c`) to `origin/main`. The commit-addressed candidate archive is already built and independently reverified outside the repository.
2. **USER ACTION REQUIRED FOR ACCESS:** provide or restore an approved authenticated deployment channel without placing credentials in Git, logs, commands, or this document. Deploy the verified artifact atomically to a new immutable release while preserving the current release as rollback and switching both active symlinks together.
3. After deployment, verify public source/design/operator paths return 404, all 255 generated URLs still match, all eight hosts/redirects/robots/sitemaps pass, analytics public JSON works, private analytics remains unauthenticated 401/no-store, and both symlinks plus rollback are correct.
4. Rotate any administrative server credential that has been exposed outside the approved secret-management channel. Do not record the replacement. Use a distinct owner-approved credential for private insights if resetting it.

### P1 — important

1. Resolve the GitHub billing lock, rerun CI, and update the workflow to enforce the same full `npm test` generated-product freshness gate used locally.
2. Convert the ad-hoc responsive/browser checks into a small committed E2E or validation script covering parent locales, all product themes, mobile menu Escape behavior, search, overflow, console errors, and reduced motion.
3. Complete the documented 320/375/390/540/768/900/1440/1920 accessibility/visual matrix, keyboard traversal, contrast checks, and reduced-motion checks before another visual release.
4. Add only owner-approved, provenance-captioned product screenshots/demos/media; preserve evidence boundaries.

### P2 — later

1. Decide whether product sites should remain English-only or receive localized routes.
2. Add referrer/UTM aggregates only after privacy, retention, and disclosure design approval.
3. Add waitlist/CRM/commerce only after commercial, legal, consent, support, and processor decisions.
4. Refactor hardcoded product shell labels/version query strings only when required by a real change; do not churn the stable generator without need.

## Useful Commands

```bash
# orient
git status --short --branch
git log --oneline --decorate -15
git fetch origin main
git rev-parse HEAD
git rev-parse origin/main

# complete static validation
npm test
git diff --exit-code
git diff --check

# focused generation/validation
npm run generate
npm run validate
npm run check:js

# analytics tests
uv run python -m unittest analytics.test_aggregate -v

# local server
uv run python -m http.server 4177
# open http://127.0.0.1:4177/

# inspect product inventory
node --input-type=module -e "import fs from 'node:fs'; const m=JSON.parse(fs.readFileSync('products/site-manifest.json')); console.log(m.length)"

# inspect CI state
gh run list --repo kyoo-147/NavinResearch --limit 10
gh run view <run-id> --repo kyoo-147/NavinResearch
```

For deployment, use a reviewed ephemeral operator procedure rather than checking a credential-bearing script into the repository. Validate the allowlist and rollback before switching either production symlink.

## Environment / Setup Notes

- Repository: `D:/work/michael/navin_research`
- Remote: `https://github.com/kyoo-147/NavinResearch.git`
- Node scripts have no declared npm dependencies. CI is configured for Node 22; this checkpoint also passed locally on the installed Node runtime.
- Use `uv`, not pip/hand-managed virtual environments, for local Python tests.
- Production geolocation database, SQLite, raw logs, JSON outputs, venv, and systemd runtime live outside Git and outside immutable releases.
- Never place server credentials, dashboard credentials, deployment archives, browser artifacts, SQLite files, MMDB files, or logs in this repository.
- Local HTTP ports may already be occupied by old preview servers; verify the served title/path before trusting a port.

## Git State

- Current branch: `main`.
- Latest deployed implementation commit: `aa0ab2a83e240f8161628667671c1b43eccee6d8` (`fix(sites): finalize product route generation`).
- Release hardening starts at `fc1e237` and is completed by `b3e6b7c` for sitemap collision checks and ancestor-symlink tests. Neither release-hardening commit is deployed while the SSH access blocker remains.
- The durable checkpoint commit is `f00554b`. Verify `git status`, local HEAD, and `origin/main` directly before continuing; the tree must be clean after each focused commit.
- Several historical local branches and temporary Pi worktrees still exist. They are not pending integration into `main`; do not merge them merely because they exist. Do not delete ambiguous worktrees as part of ordinary feature work.

## Handoff Notes

- Start a fresh session by reading `AGENTS.md`, then this file, then inspect `git status` and current commits. Do not rely on the dated milestone review as current release status.
- The website reconstruction itself is complete and live. Do not redo the seven product redesigns or parent-route deepening.
- The most important newly discovered issue is deployment packaging, not page-generation correctness: live pages match source, but the public release contains too much of the tracked repository.
- The corrected allowlisted archive is ready at the path recorded under Production delivery. Do not fall back to a Git archive; deployment remains blocked until an approved authenticated channel is restored.
- Production reachability proves website delivery only. It does not prove product runtimes, model behavior, physical devices, commercial availability, or scientific results.
- Analytics totals are genuine aggregate production data, but source-channel attribution is not implemented.
- The previous recurring implementation schedule is permanently cancelled. Continue manually unless the owner explicitly requests a new schedule.
