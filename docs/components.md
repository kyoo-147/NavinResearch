# Navin Research components and templates

This catalogue defines the reusable contracts behind the generated EN/VI/ZH-CN site. Runtime markup is generated from `site.config.mjs` by `scripts/generate-site.mjs`; generated HTML is deployable output, not the translation source of truth.

## Source component architecture

Shared page chrome is implemented as generator components rather than copied into page templates:

- `scripts/components/page-head.mjs` — canonical, hreflang, social metadata, favicon, and versioned CSS/JavaScript imports.
- `scripts/components/site-shell.mjs` — `siteHeader`, `siteFooter`, `siteDrawer`, language switching, and chapter preview explorer.
- `scripts/generate-site.mjs` — page composition only: homepage, content routes, chapters, and legal content slots.
- `site.config.mjs` — localized data and route contracts only.

Every public generated page imports the same header, footer, drawer, language switcher, and page-head components. Do not reproduce their HTML inside an individual template. Structural changes belong in components, page-specific layout belongs in templates/CSS, and localized copy belongs in `site.config.mjs`.

## Field backdrop

```html
<div class="field" aria-hidden="true">
  <div class="field__layer field__layer--1"></div>
  <!-- field__layer--2 through --5 -->
  <div class="field__wash"></div>
  <div class="field__grain"></div>
</div>
```

Keep it decorative and outside reading order. The five optimized WebPs start after a short calm state and crossfade over a 40-second loop. Wash opacity protects text contrast. Grain remains `pointer-events:none`. Reduced-motion mode fixes layer 1 and disables pointer response.

## Masthead and brand

The reusable `siteHeader(localeKey, suffix)` contains:

- the hamburger menu and NAVIN RESEARCH text wordmark used consistently across homepage, content, chapter, and legal routes;
- an uppercase update-status label, hidden as a whole below 900px;
- a locale `nav` with real links to `/`, `/vi/`, and `/zh-cn/`, `hreflang`, valid BCP 47 language tags, and `aria-current="page"`.

The browser icon is the distinct white-backed `assets/brand/logo_icon_tab.png`. Do not interchange the two logo assets. Locale links must preserve a minimum 44px target and the global acid focus ring.

## Editorial hero

The homepage `main.hero` has three desktop tracks: vertical index, editorial content, and contact aside. It contains one `h1`, an acid uppercase eyebrow, and one truthful statement. Controlled line breaks are generated from locale title arrays rather than injected at runtime. Every translated headline must be visually checked rather than inheriting English wrapping assumptions.

**Reusable contract:** `EditorialHero(index, eyebrow, titleLines, statement, aside)` with exactly one page-level `h1`.

## Contact panel

The `aside` has a localized accessible label, section label, `h2`, and semantic links for Email, LinkedIn, and GitHub. External links use `target="_blank" rel="noopener noreferrer"`; the arrow remains decorative. Do not turn the whole panel into an unnamed click target.

## Footer

The reusable `siteFooter(localeKey)` pairs a script-enhanced current year with localized Privacy Policy and Terms of Use links. It remains readable without JavaScript because the generated year is a valid fallback.

Homepage composition uses the default fixed transparent footer. Content, chapter, and legal compositions call `siteFooter(localeKey, { flow: true })`, preserving identical markup and visual language while keeping long content and chapter navigation unobstructed.

## Content-route shell

Blog, Research, Docs, and Search use one generated editorial shell:

1. approved brand asset;
2. localized primary navigation;
3. localized URL switcher;
4. one page `h1` and a truthful preparation notice;
5. shared route footer.

Route metadata, canonical URLs, and all hreflang alternates are generated at build time. Placeholder surfaces must not contain fake articles, fake dates, fabricated research, schema claims, or keyword stuffing.

## Search

The public search is a small client-side directory over real route metadata only. It creates DOM nodes with `textContent`, does not index unpublished material, and remains a progressive enhancement. It is not represented as full-text research search.

## Visitor map

`/visitor-map/` uses an original Canvas 2D globe, static country centroids, and periodically refreshed aggregate JSON. The globe is ambient; the ranked country list is the authoritative accessible data. Public groups below `k=5` are withheld. There is no WebSocket or individual event stream.

## Private visitor insights

`/visitor-insights/` is public source code but a private production route. Nginx authentication, `Cache-Control: private, no-store`, and `X-Robots-Tag: noindex` are deployment requirements. The UI reads aggregate city/region counts only; it never receives raw IPs or individual trajectories.

## Internationalization rules

- Locale keys: `en`, `vi`, `zh-cn`; rendered tags: `en`, `vi`, `zh-CN`.
- Stable home URLs: `/`, `/vi/`, `/zh-cn/`.
- Stable route pattern: `/{optional-locale}/{blog|research|docs|search}/`.
- Every locale record must provide complete homepage, route, metadata, navigation, footer, and accessibility copy.
- Never concatenate translated fragments or translate brand names, Email, LinkedIn, or GitHub.
- Run the generator and validator after every copy or route change.

## Interaction rules

- Use links for navigation and buttons only for in-page actions.
- Preserve DOM order: masthead → hero content → contact → footer.
- Keep acid `:focus-visible` outlines and 44px targets.
- Motion may decorate but may not gate information.
- Contact-link shifts and color changes must not cause layout overflow.

## Do / don't

```html
<!-- Do: stable locale URLs and current-page semantics -->
<nav aria-label="Language selection">
  <a href="/" hreflang="en" aria-current="page">EN</a>
  <a href="/vi/" hreflang="vi" lang="vi">VI</a>
  <a href="/zh-cn/" hreflang="zh-CN" lang="zh-CN">CN</a>
</nav>

<!-- Don't: client-only text pretending to be indexable locale content -->
<div onclick="replaceAllCopy()">EN / VI / CN</div>
```

Do preserve the three-track wide layout and one-column mobile collapse. Do not duplicate translation copy by hand in generated HTML, expose private analytics without authentication, or present demo analytics as live data.
