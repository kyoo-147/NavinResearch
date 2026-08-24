# Accessibility, SEO, privacy, and content quality

This checklist applies to every generated Navin Research page and analytics surface.

## Semantics and keyboard

- Keep a valid document language, one page-level `h1`, and semantic `header`, `main`, `nav`, `aside`, and `footer` landmarks.
- Use real links for navigation. Locale links use stable URLs and `aria-current="page"`; do not recreate them as client-only toggles.
- Brand links require an accessible label while the decorative logo image uses empty alt text to avoid duplication.
- Decorative background layers, arrows, and visual globe effects stay outside the accessibility tree.
- Preserve the global `2px solid #d9ff57` focus ring with 5px offset and minimum 44px locale targets.
- Keep source order logical even when the desktop grid places the contact panel beside the hero.

## Motion

- Homepage motion waits 3 seconds, then begins a slow 40-second crossfade. It is decorative and never gates content.
- `prefers-reduced-motion: reduce` fixes one field image and suppresses transitions and pointer wash.
- The visitor globe stops rotation for reduced motion and when its tab is hidden.
- Do not add autoplaying media, rapid flashes, or parallax that changes reading order.

## Color and contrast

Current primary colors are near-white `#f4f7ec`, acid `#d9ff57`, and deep green `#03120d`. Because field imagery moves beneath copy, preserve the dark wash and test every image, locale, and viewport. Body text must meet WCAG AA 4.5:1, large text 3:1, and focus/control boundaries 3:1. Thin rules and muted text are not valid as the only state indicator.

## Responsive checks

Test all three locales at 320, 375, 390, 540, 768, 900, 1440, and 1920 CSS pixels. Confirm:

- no horizontal overflow;
- logo and EN/VI/CN links remain usable;
- the long status label disappears below 900px rather than clipping;
- hero line breaks remain intentional;
- contact and footer text do not collide;
- focus indicators are not clipped.

## SEO and i18n

- Locale source of truth is `site.config.mjs`; generated HTML must not be edited as the only copy change.
- Stable locale URLs are `/`, `/vi/`, and `/zh-cn/`, with matching localized content-route paths.
- Every indexable page must emit server-rendered title, description, canonical, `html lang`, and complete `en`/`vi`/`zh-CN`/`x-default` hreflang links.
- The sitemap contains only real public pages. `/visitor-insights/` is excluded and disallowed in robots.
- Content placeholders must say they are being prepared. Never add hidden text, doorway pages, fake articles, fake dates, fake metrics, fabricated research, or unsupported JSON-LD.
- Search only indexes real route metadata and must not imply unpublished full-text content exists.

## Analytics privacy boundary

- Raw IPs are sensitive and remain only in the restricted Nginx log and aggregator process memory.
- SQLite stores aggregate counts only—no raw IP, IP hash, URL, user agent, event, or individual trajectory.
- Public visitor geography is country/day only and suppresses groups smaller than five.
- Private insights may show daily region/city aggregates but must be protected by authentication and `no-store` headers.
- Demo JSON must remain visibly labeled `DEMO DATA`; never report it as live visitors.
- GeoLite2 is approximate. Never use it to identify a person, household, or street address. Keep required attribution and current EULA/update obligations.

## Logo and assets

- Use `assets/brand/logo.webp` for the transparent header mark.
- Use `assets/brand/logo_icon_tab.png` only as the browser/favicon asset.
- Preserve proportions, transparency, minimum size, and clearspace; do not stretch, recolor, rotate, or crop the ribbon.
- Source background PNGs are versioned design inputs but must not be deployed to the public web root; only optimized WebPs ship.

## Verification checklist

1. Run `node scripts/generate-site.mjs` and `node content-routes/validate.mjs`.
2. Run JavaScript syntax checks for homepage, search, public map, and private insights.
3. Run `uv run python -m unittest analytics.test_aggregate -v`.
4. Validate HTML and check every local asset and route over an HTTP server.
5. Keyboard-test brand, locale links, contact links, search, and analytics pages.
6. Capture EN/VI/ZH-CN screenshots on desktop and mobile after the 3-second motion boundary.
7. Test reduced motion and inspect browser console/network/CSP errors.
8. Verify canonical/hreflang/sitemap from non-JavaScript fetches.
9. Verify public analytics has no private fields and private production routes return `401` without credentials.
10. Confirm source PNGs, SQLite, MMDB, raw logs, and credentials are absent from the release archive.
