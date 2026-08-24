# Navin Research

Source for [navinresearch.com](https://navinresearch.com): a multilingual static research site, coming-soon homepage, truthful crawlable content foundation, reusable design system, and privacy-preserving visitor geography prototype.

## Architecture

- `site.config.mjs` — source of truth for EN/VI/ZH-CN copy, metadata, routes, and locale prefixes.
- `scripts/generate-site.mjs` — generates 36 localized pages, 50 English Markdown blog posts, search metadata, and sitemap.
- `scripts/blog-posts.mjs` — source manifest and renderer for practical, source-linked AI engineering notes.
- `styles.css` / `script.js` — homepage design and ambient motion.
- `content-routes/` — shared editorial route styles, search, and validation.
- `analytics/` — offline Nginx-log aggregator; no always-on tracking application.
- `visitor-map/` — public country-level aggregate globe; demo data is clearly labeled.
- `visitor-insights/` — private aggregate operator UI; production requires authentication.
- `docs/` — design system, reusable component contracts, accessibility, SEO, and privacy rules.
- `deployment-example/` — Nginx boundaries for public/private analytics data.

The root `1.png`–`5.png` files are versioned design sources. Production deploys only optimized `assets/field-*.webp` files.

## Local development

```bash
node scripts/generate-site.mjs
node content-routes/validate.mjs
uv run python -m unittest analytics.test_aggregate -v
uv run python -m http.server 4173
```

Open:

- `/`, `/vi/`, `/zh-cn/`
- `/blog/`, `/research/`, `/docs/`, `/search/` and localized equivalents
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

Do not hand-edit generated HTML as the only source of a content change. CI rejects stale generated output.

## SEO boundary

Blog, Research, Docs, and Search routes are real and indexable. The Blog library also publishes 50 concise English Markdown notes under `/blog/<category>/<slug>.md`; they are generated from `scripts/blog-posts.mjs`, included in the sitemap and public search index, and cite official primary documentation. The existing editorial route UI remains unchanged. Research and Docs still state that content is being prepared. Do not add hidden text, doorway pages, keyword stuffing, fabricated research, fake dates, fake metrics, or unsupported schema.

## Analytics boundary

The analytics prototype stores daily aggregate counts only. Raw IPs remain in restricted Nginx logs and process memory during one-day deduplication; SQLite stores no raw IP, IP hash, URL, user agent, or trajectory. Public country groups require at least five unique visitors. See `analytics/README.md` before enabling live data.

GeoLite2 is not included. Operators must obtain and update it directly under MaxMind's current terms and preserve visible attribution.

## License and notices

No project-wide open-source license has been granted yet. Third-party data notices are recorded in `THIRD_PARTY_NOTICES.md`.
