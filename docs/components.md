# NavinResearch components and templates

This catalogue describes the current coming-soon composition and the reusable contracts implied by it. “Current” means implemented in `index.html`/`styles.css`/`script.js`; “proposed” means a safe extraction for future pages, not a claim that runtime components already exist.

## Component contracts

### Field backdrop (current)

```html
<div class="field" aria-hidden="true">
  <div class="field__layer field__layer--1"></div>
  <!-- layers 2–5 -->
  <div class="field__wash"></div>
  <div class="field__grain"></div>
</div>
```

Keep it decorative and outside the reading order. Use five optimized WebP layers from `/assets/field-1.webp` … `/assets/field-5.webp`; set a fallback background. The wash must maintain legibility, and grain must remain `pointer-events:none`. Provide a reduced-motion still state. Do not put content or alt text in this layer.

### Masthead / brand lockup (current)

A semantic `header` contains a home link (`aria-label="Navin Research home"`) and a metadata cluster. The current mark is an inline 36×36 viewBox path with no fill and a 1.7 stroke; the text is NAVIN with a RESEARCH subline. Status is a dot plus uppercase text; on ≤900px only the dot remains. The language control is a real `button` with `aria-pressed`, a dynamic `aria-label`, and EN/VI state styling. Use a visible focus ring (`2px solid #d9ff57`, 5px offset).

**Proposed extraction:** `<BrandLockup href label markVariant="inline-n">`, `<StatusSignal label>`, `<LocaleToggle current supportedLocales>`. Keep labels translatable and make the status dot supplementary, not the only status announcement.

### Editorial hero (current)

The `main.hero` has three desktop tracks: vertical index (`NR — 01`), editorial content, and contact aside. The content uses an acid uppercase eyebrow, one `h1` with intentional `<br>` in both language strings, and a paragraph. The `h1` is max 10ch and uses balanced text; translated strings must be rechecked before preserving a forced line break.

**Proposed extraction:** `<EditorialHero index eyebrow title statement aside>`. Enforce exactly one page-level `h1`, with a concise text alternative for any line-break treatment. Do not use `aria-hidden` on actual copy.

### Contact panel and link list (current)

The aside has an `aria-label`, muted section label, `h2`, and a bordered list of email, LinkedIn, and GitHub links. Links are uppercase, separated by top rules, with a final bottom rule. The arrow is decorative (`aria-hidden`) while the link text is the accessible name. External links use `target="_blank" rel="noreferrer"`; mail uses `mailto:`.

**Proposed extraction:** `<LinkList heading items>` where each item has a visible label and optional external indicator. Keep an actual link for navigation; never make the entire panel a click target without a name.

### Footer (current)

A `footer` uses two uppercase metadata lines: dynamic current year and “Independent AI research · Vietnam”. It is flex-aligned with a 4.5rem minimum height; on mobile the second line is constrained to 12rem and right-aligned.

**Proposed extraction:** `<InstitutionFooter year organization descriptor>` with locale-aware year and punctuation. Keep legal/identity text readable even when it is visually small.

### Language switcher (current)

`script.js` owns a small EN/VI dictionary. `setLanguage()` updates `document.documentElement.lang`, `document.title`, description, OG title/description/locale, `aria-pressed`, button label, and `[data-copy]` nodes. The title is the only node updated with `innerHTML` because its dictionary value intentionally contains `<br>`; all other values use `textContent`. `localStorage` key is `navin-language`; invalid/missing storage falls back to English.

**Proposed extraction:** a locale record with `htmlTitle` only when markup is explicitly trusted, otherwise render line breaks structurally. Each locale must provide every required key, metadata, accessible toggle label, and social preview copy.

## Page templates

### Coming-soon landing (current)

1. `body` with dark ground and decorative field.
2. `.shell` full viewport: masthead / hero / footer.
3. Masthead brand + status + locale toggle.
4. Hero: optional index rail + one editorial message + contact panel.
5. Footer identity line.

Use this template when the page has one temporary state and a small set of contact actions. It is intentionally content-light; do not force product cards or navigation into it.

### Research editorial landing (proposed)

Reuse the same masthead, field/wash, edge padding, typography, rules, and footer. Replace the coming-soon hero with one `h1`, a short dek, and a modular sequence of research sections. Keep the dark wash behind copy and use rules/acid labels to expose hierarchy. A future multi-section page needs a skip link and landmark plan; those are not present in the current one-screen page.

### Detail / project page (proposed)

Use the same brand and type tokens, with a narrow reading measure for long-form text and a persistent but less dominant contact/navigation rail. Background imagery should be decorative and not compete with code, figures, or citations. Add breadcrumbs only if the information architecture warrants them; do not infer them from the coming-soon page.

## Internationalization expansion rules

- Current locales are English (`en`) and Vietnamese (`vi`); default is English, with Vietnamese restored only when storage equals exactly `vi`.
- Keep locale keys complete: status, eyebrow, title, statement, contact label/title, footer, links, document title, description, OG description, OG locale, and toggle label.
- Update `lang` to a valid BCP 47 language tag (`en`, `vi`) and use locale-specific metadata. Add `hreflang`/server-routed URLs only when distinct indexable locale URLs exist; the current client toggle does not create URLs.
- Never assume English word lengths. Vietnamese already has longer status, statement, contact title, and footer strings. Test the 320px/540px layouts, headline wrapping, link rules, focus order, and social previews for every locale.
- Do not concatenate translated fragments or translate brand names, Email, LinkedIn, or GitHub. Keep the separator (`·`) intentional and locale-reviewed.
- Avoid `innerHTML` for translations. If controlled line breaks are needed, model title lines as data and render text nodes plus `<br>`; the current `innerHTML` is a narrow, trusted-dictionary exception.

## Interaction and state rules

Default link state is inherited near-white; hover/focus color is acid and contact links shift right `.45rem` over `180ms ease`. Language labels are `.45` opacity when inactive and `1` when active/hover/focused. Focus uses a high-visibility acid outline. Pointer movement changes only decorative wash variables and is absent under reduced motion. Storage failure must not block language switching or content rendering.

## Do / don't examples

```html
<!-- Do: named landmarks and an actual control -->
<header>...</header>
<main>
  <h1>...</h1>
  <aside aria-label="Contact information">...</aside>
</main>
<button type="button" aria-pressed="false" aria-label="Switch to Vietnamese">EN / VI</button>

<!-- Don't: decorative text pretending to be a control -->
<div onclick="switchLanguage()">EN / VI</div>
```

- **Do:** keep the status text in the DOM even when its visual label is hidden at tablet width.
- **Don't:** make the green pulse the only indication of progress.
- **Do:** mark decorative arrows and background layers `aria-hidden="true"`.
- **Don't:** hide the actual hero, contact labels, or translated content from assistive technology.
- **Do:** preserve the three-track composition on wide screens and collapse it to a readable single column at 900px.
- **Don't:** replicate desktop min-width tracks on a 320px viewport.
