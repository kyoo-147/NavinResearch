# Navin Research

Source for [navinresearch.com](https://navinresearch.com): a multilingual static research and product site, truthful crawlable content foundation, seven distinct product microsites, reusable design system, and privacy-preserving visitor geography prototype.

## Architecture

- `site.config.mjs` — source of truth for EN/VI/ZH-CN copy, metadata, routes, and locale prefixes.
- `scripts/generate-site.mjs` — generates 60 localized pages, 50 English Markdown blog posts, search metadata, and sitemap.
- `scripts/generate-products.mjs` — generates seven source-backed product microsites with distinct themes, evidence, access states, and cross-navigation.
- `products/` — product content contracts, original diagrams, project-owned media, themes, and architecture documentation in `docs/products.md`.
- `scripts/blog-posts.mjs` — source manifest and renderer for practical, source-linked AI engineering notes.
- `styles.css` / `script.js` — homepage design and ambient motion.
- `content-routes/` — shared editorial route styles, search, and validation.
- `analytics/` — offline Nginx-log aggregator; no always-on tracking application.
- `visitor-map/` — public country-level aggregate globe; production publishes every country total.
- `visitor-insights/` — private aggregate operator UI; production requires authentication.
- `docs/` — design system, reusable component contracts, accessibility, SEO, and privacy rules.
- `deployment-example/` — Nginx boundaries for public/private analytics data.

The root `1.png`–`5.png` files are versioned design sources. For field backgrounds, a production release allowlist must include the optimized `assets/field-*.webp` files and exclude the root source PNGs; required HTML, CSS, JavaScript, fonts, brand assets, and product media remain separate allowlisted assets.

## Local development

```bash
npm test
uv run python -m unittest analytics.test_aggregate -v
uv run python -m http.server 4173
```

Open:

- `/`, `/vi/`, `/zh-cn/`
- `/products/`, `/blog/`, `/research/`, `/releases/`, `/docs/`, `/search/` and localized equivalents
- Product hosts such as `https://dossier.navinresearch.com/` and `https://sori.navinresearch.com/`
- Direct Markdown notes such as `/blog/agents/multi-agent-orchestration-patterns.md`
- `/visitor-map/`
- `/visitor-insights/` — locally demo-only; production is authenticated

## Change workflow

1. `git switch main && git pull --ff-only origin main`
2. Create a focused branch.
3. Edit `site.config.mjs`, runtime assets, analytics, or docs as appropriate.
4. Run the generator after locale/route changes.
5. Run all validation and responsive browser checks.
6. Commit, push, open a pull request, review, and merge.
7. Deploy an allowlisted release atomically and keep the prior release for rollback.

Do not hand-edit generated HTML as the only source of a content change. Local `npm test` is the complete generated-output freshness gate; the current CI workflow checks parent generation only and must not be treated as product-generation coverage.

## SEO boundary

Products, Blog, Research, Releases, Docs, and Search routes are real and indexable. The Blog library also publishes 50 concise English Markdown notes under `/blog/<category>/<slug>.md`; they are generated from `scripts/blog-posts.mjs`, included in the sitemap and public search index, and cite official primary documentation. Product pages expose explicit evidence and availability states; Research and Docs still state that content is being prepared. Do not add hidden text, doorway pages, keyword stuffing, fabricated research, fake dates, fake metrics, prices, customer claims, or unsupported schema.

## Analytics boundary

The analytics pipeline stores daily aggregate counts only. Raw IPs remain in restricted Nginx logs and process memory during one-day deduplication; SQLite stores no raw IP, IP hash, URL, user agent, or trajectory. The public map publishes every country-level daily total, including single-visitor countries. See `analytics/README.md` before enabling live data.

GeoLite2 is not included. Operators must obtain and update it directly under MaxMind's current terms and preserve required attribution in the project notices.

## License and notices

No project-wide open-source license has been granted yet. Third-party data notices are recorded in `THIRD_PARTY_NOTICES.md`.
