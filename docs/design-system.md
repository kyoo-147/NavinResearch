# NavinResearch design system

**Status:** extracted from the baseline coming-soon implementation (`48b4b1c7a30664a99cbe47c2c14b1e40ff22cbef`). This is a documentation system, not a runtime change. Values marked **proposed** are names for future implementation; values marked **current** are observable in `styles.css`, `index.html`, and `script.js`.

## Direction

**Dark editorial fieldwork:** restrained research-institution typography and rules sit over a slow, atmospheric green photographic field. The acid signal color creates the one precise point of energy. The memorable device is the collision of a strict editorial grid with shifting organic imagery, not a generic tech gradient.

## Source of truth and boundaries

- `index.html`: semantic shell, inline monochrome wordmark/mark, content hierarchy, links, metadata.
- `styles.css`: all current visual values, responsive rules, layers, and motion.
- `script.js`: EN/VI copy, document metadata updates, language persistence, pointer-driven wash.
- `assets/fonts/atkinson-regular.woff` and `atkinson-bold.woff`: the only loaded typefaces.
- `assets/field-1.webp` through `field-5.webp`: production background layers. Root `1.png`–`5.png` are preserved source PNGs per `README.md`.
- Supplied `C:/Users/hoang/Downloads/new_logo/logo.png` and `logo_icon_tab.png` are 1254×1254 RGBA PNG references. They show a saturated orange/red/pink/purple/blue infinity-like ribbon; `logo_icon_tab.png` includes a white circular field. They are **not currently imported**. The page currently renders an inline stroked `N` mark and NAVIN/RESEARCH text. Do not claim the supplied artwork is live until a runtime asset import is approved.

## Tokens

```css
:root {
  /* current exact values */
  --color-ink: #f4f7ec;
  --color-muted: rgba(244, 247, 236, .70);
  --color-body: rgba(244, 247, 236, .84);
  --color-line: rgba(244, 247, 236, .24);
  --color-acid: #d9ff57;
  --color-ground: #03120d;
  --layout-edge: clamp(1.25rem, 4vw, 4.5rem);

  /* proposed aliases; preserve the values above when adopting */
  --space-1: .45rem; /* 7.2px */
  --space-2: .55rem; /* 8.8px */
  --space-3: .65rem; /* 10.4px */
  --space-4: .8rem;  /* 12.8px */
  --space-5: .9rem;  /* 14.4px */
  --space-6: 1.1rem; /* 17.6px */
  --space-7: 1.4rem; /* 22.4px */
  --space-8: 1.8rem; /* 28.8px */
  --space-9: 2.2rem; /* 35.2px */
  --space-10: 3rem;  /* 48px */
  --space-11: 4rem;  /* 64px */
  --space-12: 6rem;  /* 96px */
  --duration-fast: 180ms;
  --duration-wash: 500ms;
  --duration-field: 40s;
  --ease-standard: ease;
  --ease-field: ease-in-out; /* proposed; current animation uses default ease */
}
```

The current spacing is rem-based and fluid where marked `clamp()`. There is no radius, shadow, or explicit container max-width token in the current page. Do not invent those as current facts.

### Color, opacity, and contrast

- Ground is deep green `#03120d`; field fallback is `#06331f`.
- Primary text is warm near-white `#f4f7ec` (nominal contrast against ground is high). Body copy is `.84` alpha; muted labels/rules use `.70` and `.24` alpha respectively. Acid `#d9ff57` is reserved for eyebrow/status dot/interaction emphasis.
- The wash is a radial pointer aperture plus a dark linear veil: `rgba(2,13,9,.82)` left, `.68` at 55%, `.62` right; radial veil reaches `.36` at 72% outside a transparent 0–8% center. Keep text over the wash, and never use low-alpha text for essential copy.
- Background images are `saturate(1.12) contrast(1.05) blur(2px)` by default, with the animation range reaching saturation `1.10–1.25`, contrast `1.04–1.08`, blur `7px–1px`. On ≤900px the static filter is reduced to saturation `1.06`, contrast `1.03`.
- `--line` is decorative structure, not a text color. Validate any future palette/background combination with WCAG contrast; preserve a solid or sufficiently opaque text treatment when imagery changes.

## Type

Atkinson is loaded locally with `font-display: swap`, regular 400 and bold 700 only. Use `font-family: "Atkinson", sans-serif`; there is no separate display family in the current implementation.

| Role | Current size | Weight | Tracking | Leading / other |
|---|---:|---:|---:|---|
| Hero `h1` desktop | `clamp(4.2rem, 8.3vw, 9.2rem)` | 400 | `-.068em` | `.8`, max `10ch`, balanced |
| Hero `h1` ≤900 | `clamp(4rem, 15vw, 7rem)` | 400 | same | same |
| Hero `h1` ≤540 | `clamp(3.55rem, 17vw, 5.1rem)` | 400 | same | `.84` |
| Statement | `clamp(1.02rem, 1.4vw, 1.35rem)` | 400 | normal | `1.55`, max `41rem` desktop / `34rem` tablet |
| Contact heading | `clamp(1.55rem, 2.3vw, 2.35rem)` | 400 | `-.035em` | normal |
| Eyebrow / contact label | `.68rem` | 700 | `.22em` | uppercase |
| Brand | `.78rem` (≤540 `.68rem`) | 700 | `.17em` | `.9` |
| Brand subline | `.56rem` | 400 | `.31em` | `.42rem` top margin, muted |
| Signal / language | `.70rem` | 400 | `.12em` / `.14em` | uppercase signal |
| Links | `.78rem` | 400 | `.10em` | uppercase |
| Index | `.62rem` | 400 | `.16em` | vertical writing |
| Footer | `.60rem` (≤540 `.52rem`) | 400 | `.15em` | uppercase |

Use sentence case for editorial headlines, uppercase only for metadata/navigation labels, and do not fake weights unavailable in the font files.

## Layout, grid, and breakpoints

The full-height `.shell` is a three-row grid (`auto 1fr auto`) with horizontal edge padding `clamp(1.25rem, 4vw, 4.5rem)`. The masthead is at least `7rem`, the footer `4.5rem`. The desktop hero is a three-column grid: `minmax(0,.15fr) minmax(20rem,1.2fr) minmax(17rem,.55fr)`, with `gap: clamp(2rem,5vw,6rem)`, bottom alignment, and vertical padding `clamp(4rem,9vh,8rem)` top / `clamp(3.5rem,8vh,7rem)` bottom. The index is a vertical rail; content is the dominant column; contact is the narrow utility column.

- **>900px:** three columns and full signal label; masthead min-height 7rem.
- **≤900px:** one-column hero, 3.5rem gap, top-aligned, padding `clamp(4rem,10vh,6rem)` / 4rem; hide index, hide signal text (dot remains), masthead min-height 6rem; contact max-width 30rem.
- **≤540px:** edge `1.2rem`, masthead 5.25rem, hero min-height `calc(100svh - 9.75rem)`, padding 3.6rem / 3rem, contact top padding 1.1rem, footer remains 4.5rem and wraps its final line to max 12rem.
- Keep the minimum viewport width 320px. `100svh` is intentional for mobile browser chrome. Avoid introducing a max-width or new breakpoint without a content/translation reason.

## Layered background

`.field` is fixed, full-viewport, `z-index:0`, with five fixed full-bleed layers inset `-8%`; each uses center/cover, starts hidden, scales from 1.08, and runs the same 40-second infinite `field-shift` animation with staggered delays `-2s, 6s, 14s, 22s, 30s`. The wash and SVG turbulence grain sit above them. `.shell` is relative at `z-index:1`. Grain opacity is `.2`, `mix-blend-mode: soft-light`, and it does not receive pointer events. Pointer coordinates update CSS custom properties unless reduced motion is requested; wash background transitions in 500ms ease.

## Motion

Current timings: field cycle 40s infinite; status ping 2.8s ease-out; interactive opacity/padding/color transitions 180ms ease; wash background 500ms ease. Field motion shifts scale `1.12→1.03`, translation about ±1.5%, rotation `-.35deg→.35deg`, opacity peaks from 20–35% then fades. Hover/focus links add `.45rem` right padding and acid color. Motion is ambient, not required to understand content.

`prefers-reduced-motion: reduce` disables animation and transitions, hides all field layers except layer 1 (opacity 1, scale 1.04), and disables pointer tracking. Preserve this behavior in future templates; never make the field or ping the only status cue.

## Logo and clearspace

Current lockup is the inline 36×36 viewBox mark rendered at 2.25rem (36px) desktop and 1.9rem (30.4px) ≤540px, with `.8rem` / `.55rem` gap to the wordmark. The clickable brand has no explicit minimum box beyond its content; preserve a comfortable 44px pointer target when replacing it. A practical future clearspace rule is **proposed**: keep at least the mark's visible stroke height (1× mark height) clear on all sides; do not let rules or imagery touch the mark. For the supplied 1254px raster assets, preserve transparency, do not crop the ribbon, and use `logo_icon_tab.png` only where a circular white backdrop is intended. A **proposed** production minimum is 24px rendered icon size (32px preferred); test down to 16px favicon scale separately. The supplied assets are reference-only until imported.

## Do / don't

- **Do** retain near-white text, thin rules, acid micro-accents, and slow image crossfades as the recognizable language.
- **Do** keep one dominant editorial headline and one supporting action group per view.
- **Do** place content on the dark wash and test translated copy at narrow widths.
- **Don't** use the supplied colorful logo as if it were the current header mark.
- **Don't** add gradients, shadows, rounded cards, or decorative UI chrome absent from the source without a new design decision.
- **Don't** rely on image detail, opacity, color, hover, or motion alone to convey meaning.
