# NavinResearch accessibility, SEO, and content quality

This audit is grounded in `index.html`, `styles.css`, and `script.js` at baseline `48b4b1c7a30664a99cbe47c2c14b1e40ff22cbef`. It records what exists and the safeguards required when the visual system is reused.

## Current baseline

### Semantics and names

- `html lang="en"`, `meta viewport`, one page-level `h1`, supporting `h2`, semantic `header`, `main`, `aside`, `nav`, and `footer` are present.
- Brand home link has an accessible label. The field is `aria-hidden`; decorative mark and external-link arrows are also hidden. Contact aside and contact nav have labels.
- Language is a keyboard-operable `<button>` with `aria-pressed`; its label changes to the target language. The click handler and storage fallback preserve basic function.
- `:focus-visible` is global and uses acid outline, 2px width, 5px offset. Links and controls inherit the dark-theme text color.
- External links use `target="_blank" rel="noreferrer"`; visible labels remain meaningful without the arrow.

### Motion and sensory considerations

- Background crossfades, pan/scale/blur, pointer wash, status ping, and link transitions are present. The `prefers-reduced-motion: reduce` block stops the animation/transition system, fixes layer 1, and avoids pointer tracking.
- Motion is decorative and does not gate content. Keep it that way: no autoplaying content, parallax that changes reading order, or essential status communicated solely by color/pulse.
- The grain is decorative and has no pointer interaction. On low-power or data-constrained contexts, a future enhancement may use a static layer, but that is not current behavior.

### Responsive behavior

- `min-width: 320px` prevents an unusable sub-320 layout. `100svh` avoids common mobile browser viewport issues.
- At ≤900px, the index disappears, status copy hides, and hero becomes one column. At ≤540px, edges shrink to 1.2rem and footer copy wraps deliberately.
- Verify focus visibility, no horizontal scrolling, line wrapping, and tap target size at 320, 375, 540, 768, 900, and wide desktop widths. The current CSS does not declare an explicit 44px minimum for every control; this is a follow-up requirement for production expansion.

## Implementation-ready patterns

### Keyboard and focus

- Preserve semantic elements: real links for navigation; real buttons for toggles.
- Keep the DOM order masthead → hero index/content → contact → footer. CSS layout may reposition visually, but must not create a confusing reading/focus order.
- Keep focus rings unoccluded against the field; if a future component changes background, use an opaque focus backing or equivalent contrast.
- Use `aria-current` only for a current navigation item. For the locale control, `aria-pressed` is appropriate for the current Vietnamese state, but its accessible label must always say the action (“Switch to …”), not only the current value.
- If a future async status changes materially, use a polite live region with concise updates; the current static “Major update in progress” does not need one.

### Color and contrast

Current text colors are `#f4f7ec`, `rgba(244,247,236,.84)`, and `rgba(244,247,236,.70)` over a dark wash; rules are `.24` alpha and acid is `#d9ff57`. Because images sit beneath the wash, contrast must be tested against the actual darkest and lightest portions at every viewport and language. Use full-opacity near-white for essential small text if a photograph reduces contrast. Do not use line color, muted copy, the dot, or hover color as the only semantic signal. Pair state colors with text/structure.

**Required checks for a new component:** normal body text should meet WCAG AA 4.5:1, large text 3:1, and non-text controls/focus indicators 3:1 against adjacent colors. These ratios are a validation requirement, not a claim that every current alpha overlay has been exhaustively measured.

### Motion contract

Preserve current values unless a deliberate system change is approved:

- field: 40s infinite cycle, staggered layer delays; default animation easing is browser `ease` because no timing function is set on `.field__layer`;
- ping: 2.8s `ease-out` infinite;
- link/language transitions: 180ms `ease`;
- pointer wash: 500ms `ease`.

Under reduced motion, stop decorative animation, transition, and pointer response. Test both the OS setting and keyboard-only navigation; reduced motion must not remove focus or content.

## SEO and sharing

Current `index.html` has a descriptive `<title>`, meta description, canonical `https://navinresearch.com/`, Open Graph site/title/description/locale/type/url/image/type/width/height, Twitter large-image card/image, theme color, favicon, and image preload. `robots.txt` and `sitemap.xml` are present in the repository. Keep canonical, OG URL, sitemap, and language URL strategy consistent if deployment changes.

- Keep one truthful title and description per locale. `script.js` updates title, description, OG title, OG description, and OG locale client-side; crawlers that do not execute JavaScript may only see English metadata. For indexable future locales, prefer server-rendered or statically generated localized HTML and stable locale URLs.
- Ensure the OG image is reachable, intentional, and representative. Current social image is `/assets/field-4.webp`, not either supplied logo PNG.
- Preserve the canonical host and trailing-slash convention unless routing changes. Do not add keyword-stuffed copy or claim research/products not present in the page.
- Add `og:locale:alternate`, `hreflang`, and JSON-LD only when their values and URL routes are real. Do not manufacture an organization schema identity from the supplied logo alone.

## Internationalization and safe rendering

The locale dictionary currently includes English and Vietnamese. Add a locale only with complete copy and metadata records. Set `document.documentElement.lang` before/with content updates, check translated heading line lengths, and test all metadata. Prefer DOM text nodes to HTML injection. The current title uses trusted dictionary `<br>` markup; if dictionary ownership expands, replace that exception with structured line data. Preserve proper Vietnamese diacritics and do not let uppercase tracking destroy legibility.

## Asset and logo guidance

The supplied `logo.png` and `logo_icon_tab.png` are 1254×1254 RGBA references, visually distinct from the current inline header mark. They contain saturated ribbon artwork; the icon-tab variant has a white circular field. If adopted, provide meaningful alt text when informative, empty alt when decorative, and a suitable `maskable`/favicon treatment only after checking transparency and small-size recognition. Keep clearspace around the visible artwork and do not place it over the photographic field without contrast testing. Never silently replace the current mark in a docs-only extraction.

## Review findings

- **medium — `styles.css` (focus/control sizing):** the current language button has vertical padding `.45rem` but no explicit minimum 44px target; verify its computed target and add a larger hit area in a future runtime change if needed.
- **medium — `index.html`/`script.js` (localized SEO):** locale metadata changes only after client JavaScript runs, so non-JS crawlers receive English metadata. Use localized HTML/URLs if Vietnamese becomes indexable.
- **low — `styles.css` (contrast under imagery):** alpha body/muted text is intentionally layered over a wash, but a formal contrast sweep over all five images/viewports is still needed.
- **low — supplied logo references:** the colorful PNGs are not connected to the runtime; any brand adoption needs product approval, asset optimization, and favicon/alt-text testing.

## Verification checklist

1. Keyboard through brand, locale button, email, LinkedIn, GitHub; confirm visible focus and sensible order.
2. Test EN and VI at 320/375/540/768/900px and desktop; confirm no clipping or horizontal scroll.
3. Test `prefers-reduced-motion` and a screen reader/browser combination.
4. Run axe or equivalent automated checks, then manually sample contrast over every background layer.
5. Inspect title, description, canonical, OG tags, favicon, robots, and sitemap in a non-JS fetch and a rendered page.
6. Confirm supplied logo files are not referenced unless an approved runtime change adds them.
