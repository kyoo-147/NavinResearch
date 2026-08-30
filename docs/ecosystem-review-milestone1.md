# Ecosystem review — milestone 1

**Scope.** Read-only architecture/design review of the Navin Research site and seven product surfaces. Reviewed the source contracts in `README.md`, `docs/design-system.md`, `docs/products.md`, `docs/components.md`, `docs/accessibility.md`, `docs/nature-chapters.md`, `site.config.mjs`, `scripts/components/site-shell.mjs`, `scripts/generate-products.mjs`, `scripts/product-data.mjs`, `products/content/*.mjs`, `products/themes/*.css`, and generated local pages. Representative visual references `1.png`, `2.png`, and `3.png` were inspected; they share saturated organic green/blue field texture. Live HTTP headers and representative markup were checked at `https://navinresearch.com/`, `https://dossier.navinresearch.com/`, `https://sori.navinresearch.com/`, and `https://moyi.navinresearch.com/` on 2026-08-30. No reference code or asset was copied.

## Executive assessment

The source tree has a credible family system: dark editorial fieldwork, Atkinson, thin rules, near-white text, acid signal, restrained motion, and source-linked evidence. Product themes deliberately diverge without abandoning the shared grid (`products/themes/*.css`). The local generated pages are substantially more truthful and structured than the deployed representative product pages. **Release is blocked until generated output and live deployment converge, and the full responsive/a11y matrix is evidenced.**

## Findings (severity / path)

- **BLOCKER — deployed/source drift:** live Dossier, Sori, and Moyi responses contain `class="product-pricing"`; local generated pages do not. This is a production truth and navigation risk: the old generic scaffold can imply commercial pricing or stale content. Rebuild, deploy, then fetch every product host and assert current evidence/access markup. (`scripts/generate-products.mjs`, `dossier/index.html`, `sori/index.html`, `moyi/index.html`, deployment release)
- **HIGH — validator is not green at current HEAD:** `node content-routes/validate.mjs` reports stale/mismatched generated Markdown for all 50 blog posts. Do not call the ecosystem release-ready until the source/generator/output contract is repaired and the validator passes. (`content-routes/validate.mjs`, `scripts/blog-posts.mjs`, `blog/**/*.md`)
- **HIGH — product legal footer omission:** product output has only product status and a Navin Research link; it does not expose Privacy Policy or Terms of Use, unlike the main shell. Add equivalent legal links before any interest CTA becomes production-facing. (`scripts/generate-products.mjs`)
- **HIGH — product accessibility/i18n contract is weaker than main site:** product pages are English-only, have no locale alternates, and hardcode labels such as `System`, `Evidence`, `Access`, and `All products`. Confirm English-only is deliberate or define locale output; otherwise this violates the site’s three-locale architecture. (`scripts/generate-products.mjs`, `docs/accessibility.md`)
- **MEDIUM — IA sequence is consistent but incomplete for a commercial ecosystem:** product pages currently follow hero → diagram → sections → capabilities → evidence → availability → switcher → sources. Add a clearly labeled demo/build record where real material exists, a changelog/release state, and a support/contact/legal destination; do not add screenshots or metrics until source-backed. Autopilot has media; the other six have diagrams only. (`scripts/generate-products.mjs`, `products/content/*.mjs`)
- **MEDIUM — CTA semantics vary by product:** most CTAs generate mailto interest; Autopilot links to its first source. Make the destination and consent expectations explicit, and avoid describing “open,” “ready,” or “current access” as availability unless an owner-approved access path exists. (`products/content/{moyi,sori,howhow,dossier}.mjs`, `scripts/generate-products.mjs`)
- **MEDIUM — shared product CSS risks dense small type and narrow layouts:** `products/product-foundation.css` uses `.65rem`–`.72rem` navigation/labels, five-column capability grids, and a two-column evidence grid. Verify WCAG contrast with each theme, 44px targets, 375px and 768px wrapping, and 1440/large desktop line lengths; current CSS alone is not evidence. (`products/product-foundation.css`, `products/themes/*.css`)
- **MEDIUM — generator coupling:** `scripts/generate-products.mjs` embeds English copy, fixed version query strings, all navigation labels, footer markup, and an Autopilot slug special case. Content/theming is modular, but shell changes cannot be made per-site safely. Extract contract-level navigation/legal/CTA fields before adding more products; never hand-edit generated HTML. (`scripts/generate-products.mjs`, `docs/components.md`)
- **LOW — typography compatibility:** Atkinson is a strong shared reading/utility face and the product-specific display fonts create differentiation. Confirm glyph coverage and wrapping for Vietnamese and Simplified Chinese before product localization; the product shell currently lacks those localized routes. (`docs/design-system.md`, `products/product-foundation.css`)

## Family resemblance and deliberate differentiation

**Keep:** Atkinson, editorial uppercase metadata, deep green/near-white foundation, acid or theme signal, thin rules, asymmetric/grid-led composition, direct source trail, explicit evidence states, and motion that is decorative only. The inspected reference field images support the organic field language; they should remain project-owned source material and not be presented as product proof.

**Differentiate:** Sandora can stay organizational/amber and diagrammatic; Moyi acoustic/teal; Sori quiet desktop instrument/ochre; HowHow evidence-led/green; Dossier paper/terracotta; Autopilot track/instrument panel; Lajvard warm companion/coral-blue. Differentiation must remain in theme tokens, diagram/media treatment, and editorial voice—not separate navigation rules or unsupported claims.

## Navigation, footer, and legal conventions

Main-site navigation is coherent: visible content-route nav plus the homepage drawer, stable locale URLs, `aria-current`, and chapter exploration. Product navigation correctly offers System/Evidence/Access and an all-products switcher locally, but must inherit legal links, contact ownership, source trail, and locale policy. Footer copy should state Navin Research ownership, privacy, terms, and a truthful status; do not use a status-only footer as a substitute for legal information.

## Responsive, a11y, and performance acceptance

Use the existing target matrix: 375, 768, 1440, and large desktop (also retain 320/390/540/900 checks). At each size test no overflow, intentional headings, switcher/grid collapse, focus visibility, keyboard drawer/skip-link behavior, source-link announcements, alt text, and CTA target size. Test all three main-site locales and every product theme. Run `prefers-reduced-motion: reduce`; no information or status may depend on animation, hover, or imagery. Check text over each field/theme background at WCAG AA, lazy media dimensions, font loading, no autoplay, and a production asset/network budget. Browser/live crawler behavior remains unverified by this review.

## Prioritized acceptance checklist

1. **P0 production truth:** regenerate product output, deploy atomically, and HTTP-fetch all seven hosts; prove no `product-pricing`, stale title/copy, or missing evidence/availability/legal links.
2. **P0 source gate:** repair blog generated Markdown drift; run `npm run generate`, `npm run validate`, and `npm run check:js` from a clean tree, then verify only intended generated artifacts changed.
3. **P0 claim gate:** review every product sentence and media caption against a named source; retain `CONCEPT`, `UNVERIFIED`, `NOT_CALLED`, and `NOT ANNOUNCED` boundaries; no prices, customers, benchmarks, certifications, launch dates, or physical proof without evidence.
4. **P1 navigation/legal:** decide product locale policy; add legal/contact destinations and a truthful CTA/consent path; verify keyboard and `aria-current` behavior.
5. **P1 visual matrix:** capture EN/VI/ZH-CN main-site and represen
tative product screenshots at 375/768/1440/large desktop, including reduced motion; obtain visual approval before deployment.
6. **P1 quality/performance:** run automated accessibility/HTML checks, contrast checks over all theme backgrounds, local asset/link checks, and production console/network checks.
7. **P2 evolution:** move hardcoded product shell labels/versioning into explicit generator contracts; add per-product demos/changelogs only when real, source-backed material exists.

## Unknowns and non-claims

No browser screenshot, keyboard session, screen-reader run, contrast computation, performance trace, or physical/runtime product test was executed here. HTTP 200 confirms reachability only, not correctness, availability, product capability, or physical proof. The supplied visual references establish an aesthetic direction only.
