import { mkdir, rm, writeFile } from "node:fs/promises";
import sandora from "../products/content/sandora.mjs";
import moyi from "../products/content/moyi.mjs";
import sori from "../products/content/sori.mjs";
import howhow from "../products/content/howhow.mjs";
import dossier from "../products/content/dossier.mjs";
import autopilot from "../products/content/autopilot.mjs";
import lajvard from "../products/content/lajvard.mjs";

const products = [sandora, moyi, sori, howhow, dossier, autopilot, lajvard];
const clean = (value = "") => String(value).replaceAll("—", "-").replaceAll("–", "-");
const esc = (value) => clean(value)
  .replaceAll("&", "&amp;")
  .replaceAll("<", "&lt;")
  .replaceAll(">", "&gt;")
  .replaceAll('"', "&quot;");
const normalizePath = (value = "/") => {
  if (value === "/404.html") return value;
  const path = `/${String(value).replace(/^\/+|\/+$/g, "")}/`;
  return path === "//" ? "/" : path;
};
const outputPath = (slug, route) => route === "/"
  ? `${slug}/index.html`
  : route === "/404.html"
    ? `${slug}/404.html`
    : `${slug}${route}index.html`;
const absolute = (product, path) => `https://${product.slug}.navinresearch.com${path}`;
const layouts = new Set(["editorial", "index", "workflow", "docs", "specs", "media", "ledger", "timeline", "comparison", "availability"]);
const layoutFor = (page) => {
  if (page.layout && layouts.has(page.layout)) return page.layout;
  const path = normalizePath(page.path);
  if (path === "/") return "editorial";
  if (/pricing|contact|availability/.test(path)) return "availability";
  if (/docs|developers|github/.test(path)) return "docs";
  if (/research|releases|changelog/.test(path)) return "timeline";
  if (/benchmarks|specs|hardware|models|api/.test(path)) return "specs";
  if (/use-cases|solutions|workflows|planning|control|movement/.test(path)) return "workflow";
  if (/integrations|devices|gallery|media/.test(path)) return "media";
  if (/security|privacy|terms/.test(path)) return "ledger";
  return page.visual?.kind === "comparison" ? "comparison" : "index";
};
const layoutClass = (layout) => `product-layout-${layout}`;

function fallbackSite(product) {
  const sources = product.sourceLinks.map((source) => source.url);
  const contact = product.slug === "autopilot" ? sources[0] : `mailto:michaelbui.contact@gmail.com?subject=${encodeURIComponent(`${product.name} product interest`)}`;
  return {
    primaryCta: { label: product.availability.cta, href: contact },
    navigation: [
      { label: "Product", href: "/product/" },
      { label: "System", href: "/features/" },
      { label: "Evidence", href: "/research/" },
      { label: "Access", href: "/pricing/" }
    ],
    footerGroups: [
      { title: "Product", links: [{ label: "Overview", href: "/product/" }, { label: "Capabilities", href: "/features/" }, { label: "Access", href: "/pricing/" }] },
      { title: "Resources", links: [{ label: "Research", href: "/research/" }, ...product.sourceLinks.map((source) => ({ label: source.label, href: source.url }))] },
      { title: "Company", links: [{ label: "Navin Research", href: "https://navinresearch.com/" }, { label: "Contact", href: contact }] }
    ],
    pages: [
      {
        path: "/",
        title: product.name,
        description: product.thesis,
        eyebrow: product.eyebrow,
        headline: product.thesis,
        lede: product.intro,
        visual: { kind: "system", title: `${product.name} system`, caption: "Product architecture. Status and limitations are documented below." },
        sections: product.sections.map((section) => ({ kind: "narrative", title: section.title, body: section.body, points: section.points })),
        cta: { title: product.availability.title, body: product.availability.body, label: product.availability.cta, href: contact }
      },
      {
        path: "/product/", title: `${product.name} product`, description: product.intro, headline: "The complete product system.", lede: product.thesis,
        visual: { kind: "system", title: "Architecture", items: product.capabilities },
        sections: product.sections.map((section) => ({ kind: "capability", title: section.title, body: section.body, points: section.points }))
      },
      {
        path: "/features/", title: `${product.name} capabilities`, description: product.thesis, headline: "Capabilities with boundaries attached.", lede: product.proofNote,
        visual: { kind: "capabilities", title: "System capabilities", items: product.capabilities },
        sections: [{ kind: "evidence", title: "Evidence and limitations", body: product.proofNote, points: product.evidence.map((item) => `${item.label}: ${item.value} (${item.state})`) }]
      },
      {
        path: "/research/", title: `${product.name} research`, description: product.proofNote, headline: "Evidence before claims.", lede: product.proofNote,
        visual: { kind: "evidence", title: "Current evidence", items: product.evidence.map((item) => `${item.label}: ${item.state}`) },
        sections: [{ kind: "sources", title: "Source trail", body: "Public sources used for this product description.", points: product.sourceLinks.map((source) => `${source.label}: ${source.url}`) }]
      },
      {
        path: "/pricing/", title: `${product.name} access`, description: product.availability.body, headline: product.availability.title, lede: product.availability.body,
        visual: { kind: "access", title: product.status, items: ["No invented price", "No implied delivery date", "Non-binding interest only"] },
        sections: [{ kind: "availability", title: product.availability.label, body: product.availability.body }],
        cta: { title: "Follow the work", body: "Access, packaging, and timing remain attached to the stated product status.", label: product.availability.cta, href: contact }
      },
      {
        path: "/privacy/", title: `${product.name} privacy`, description: "Privacy information for the product website.", headline: "Privacy, stated plainly.", lede: "This public product website does not provide a production account or payment flow.",
        visual: { kind: "legal", title: "Website scope", items: ["Public website", "No checkout", "No product account"] },
        sections: [{ kind: "legal", title: "Contact and access requests", body: "Email links open your mail client. Do not include sensitive information in an access request." }, { kind: "legal", title: "Operational boundaries", body: "Product runtime privacy is documented separately when a runnable product or source repository is available." }]
      },
      {
        path: "/terms/", title: `${product.name} terms`, description: "Terms for the public product website.", headline: "Website terms.", lede: "The site describes active research and product direction. It is not a purchase offer or service-level commitment.",
        visual: { kind: "legal", title: "Truthful use", items: ["No warranty implied", "No purchase contract", "Source licenses remain separate"] },
        sections: [{ kind: "legal", title: "Information only", body: "Availability, capabilities, and status may change as research progresses." }, { kind: "legal", title: "Source software", body: "Any linked repository is governed by its own license and documentation." }]
      },
      {
        path: "/404.html", title: `Not found | ${product.name}`, description: "The requested page was not found.", headline: "That route is not here.", lede: "Return to the product or use the primary navigation.",
        visual: { kind: "not-found", title: "404", items: [product.name, "Route unavailable"] }, sections: [], cta: { title: "Continue", body: "The product overview is the best place to restart.", label: "Return home", href: "/" }
      }
    ]
  };
}

function linkAttrs(href) {
  return /^https?:|^mailto:/.test(href) ? ' target="_blank" rel="noopener noreferrer"' : "";
}

function navItem(item, activePath) {
  const href = item.href || item.children?.[0]?.href || "/";
  const active = normalizePath(href) === activePath || item.children?.some((child) => normalizePath(child.href) === activePath);
  if (item.children?.length) {
    return `<details class="product-nav__group"${active ? " data-active" : ""}><summary>${esc(item.label)}</summary><div class="product-nav__menu">${item.children.map((child) => `<a href="${esc(child.href)}"${normalizePath(child.href) === activePath ? ' aria-current="page"' : ""}${linkAttrs(child.href)}>${esc(child.label)}</a>`).join("")}</div></details>`;
  }
  return `<a href="${esc(href)}"${active ? ' aria-current="page"' : ""}${linkAttrs(href)}>${esc(item.label)}</a>`;
}

function visualMarkup(product, visual = {}) {
  const items = visual.items || [];
  if (visual.kind === "system" || !visual.kind) {
    return `<figure class="product-visual product-visual--system"><img src="/products/media/${product.slug}-system.svg" width="1200" height="620" alt="${esc(visual.title || `${product.name} system architecture`)}"><figcaption>${esc(visual.caption || "System view")}</figcaption></figure>`;
  }
  if (visual.src) {
    return `<figure class="product-visual product-visual--media"><img src="${esc(visual.src)}" alt="${esc(visual.alt || visual.title)}" width="1400" height="900"><figcaption>${esc(visual.caption || "Project-owned source material")}</figcaption></figure>`;
  }
  return `<figure class="product-visual product-visual--${esc(visual.kind)}" data-visual="${esc(visual.kind)}"><div class="product-visual__stage"><span class="product-visual__title">${esc(visual.title || product.name)}</span><div class="product-visual__items">${items.map((item, index) => `<span style="--item:${index}">${esc(item)}</span>`).join("")}</div></div>${visual.caption ? `<figcaption>${esc(visual.caption)}</figcaption>` : ""}</figure>`;
}

function renderSectionPoints(section, layout) {
  if (!section.points?.length) return "";
  const items = section.points.map((point) => `<li>${esc(point)}</li>`).join("");
  if (["workflow", "timeline"].includes(layout)) return `<ol class="product-section-points product-section-points--ordered">${items}</ol>`;
  if (["specs", "ledger"].includes(layout)) return `<dl class="product-section-points product-section-points--ledger">${section.points.map((point, index) => `<div><dt>${String(index + 1).padStart(2, "0")}</dt><dd>${esc(point)}</dd></div>`).join("")}</dl>`;
  return `<ul class="product-section-points">${items}</ul>`;
}

function sectionsMarkup(page) {
  const layout = layoutFor(page);
  return layoutSectionMarkup(page, layout);
}

function footerMarkup(product, site) {
  const hasLegal = site.footerGroups.some((group) => group.title.toLowerCase() === "legal");
  const legal = hasLegal ? "" : `<section><h2>Legal</h2><a href="/privacy/">Privacy</a><a href="/terms/">Terms</a>${product.slug === "sori" || product.slug === "sandora" || product.slug === "dossier" ? '<a href="/security/">Security</a>' : ""}</section>`;
  return `<footer class="product-footer"><div class="product-footer__brand"><a href="/" class="product-wordmark">${esc(product.name)}</a><p>${esc(product.thesis)}</p><span>A Navin Research project</span></div><div class="product-footer__groups">${site.footerGroups.map((group) => `<section><h2>${esc(group.title)}</h2>${group.links.map((link) => `<a href="${esc(link.href)}"${linkAttrs(link.href)}>${esc(link.label)}</a>`).join("")}</section>`).join("")}${legal}</div><div class="product-footer__base"><span>© <span data-current-year></span> ${esc(product.name)}</span><a href="https://navinresearch.com/products/">Navin Research products</a></div></footer>`;
}

function pageTemplate(product, site, page) {
  const path = normalizePath(page.path);
  const canonicalPath = path === "/404.html" ? "/404.html" : path;
  const layout = layoutFor(page);
  const canonical = absolute(product, canonicalPath);
  const isHome = path === "/";
  const cta = page.cta || site.primaryCta;
  const description = clean(page.description || page.lede || product.thesis);
  const metaDescription = description.length >= 24 ? description : `${description} Public information for ${product.name}.`;
  const productRoute = site.pages.some((candidate) => normalizePath(candidate.path) === "/product/") ? "/product/" : site.navigation[0]?.href || "/";
  return `<!doctype html>
<html lang="en" class="no-js">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="description" content="${esc(metaDescription)}">
  <meta name="robots" content="${path === "/404.html" ? "noindex,follow" : "index,follow,max-image-preview:large"}">
  <meta property="og:type" content="website">
  <meta property="og:site_name" content="${esc(product.name)}">
  <meta property="og:title" content="${esc(page.title)}">
  <meta property="og:description" content="${esc(metaDescription)}">
  <meta property="og:url" content="${canonical}">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="theme-color" content="#03120d">
  <link rel="canonical" href="${canonical}">
  <link rel="icon" href="/assets/brand/logo_icon_tab.png" type="image/png">
  <link rel="stylesheet" href="/products/product-foundation.css?v=20260830-3">
  <link rel="stylesheet" href="/products/themes/${product.slug}.css?v=20260830-3">
  <script>document.documentElement.classList.remove('no-js')</script>
  <script src="/products/product-site.js?v=20260830-3" defer></script>
  <title>${esc(page.title)}${isHome ? "" : ` | ${esc(product.name)}`}</title>
</head>
<body class="product-${product.slug} product-layout-${layout}" data-product="${product.slug}" data-route="${esc(path)}" data-layout="${layout}">
  <a class="skip-link" href="#main-content">Skip to content</a>
  <div class="product-field" aria-hidden="true"></div>
  <header class="product-header">
    <a class="product-wordmark" href="/" aria-label="${esc(product.name)} home">${esc(product.name)}</a>
    <button class="product-menu-button" type="button" aria-controls="product-menu" aria-expanded="false" data-product-menu>Menu</button>
    <div class="product-menu" id="product-menu">
      <nav class="product-nav" aria-label="Primary navigation">${site.navigation.map((item) => navItem(item, path)).join("")}</nav>
      <a class="product-header__cta" href="${esc(site.primaryCta.href)}"${linkAttrs(site.primaryCta.href)}>${esc(site.primaryCta.label)}</a>
    </div>
  </header>
  <main id="main-content" class="product-main">
    <section class="product-page-hero product-page-hero--${layout}${isHome ? " product-page-hero--home" : ""}">
      <div class="product-page-hero__copy">${page.eyebrow ? `<p class="product-eyebrow">${esc(page.eyebrow)}</p>` : ""}<h1>${esc(page.headline || page.title)}</h1><p>${esc(page.lede || page.description)}</p>${isHome ? `<div class="product-page-hero__actions"><a class="product-button" href="${esc(site.primaryCta.href)}"${linkAttrs(site.primaryCta.href)}>${esc(site.primaryCta.label)}</a><a class="product-text-link" href="${esc(productRoute)}">Explore the product <span aria-hidden="true">→</span></a></div>` : ""}</div>
      ${visualMarkup(product, page.visual)}
    </section>
    <div class="product-page-sections product-page-sections--${layout}">${sectionsMarkup(page)}</div>
    ${cta ? `<section class="product-page-cta"><div><h2>${esc(cta.title || "Continue")}</h2><p>${esc(cta.body || product.availability.body)}</p></div><a class="product-button" href="${esc(cta.href)}"${linkAttrs(cta.href)}>${esc(cta.label)}</a></section>` : ""}
    ${isHome && product.media?.length ? `<section class="product-source-gallery"><h2>Project source material</h2><div>${product.media.map((item) => `<figure><img src="${esc(item.src)}" alt="${esc(item.alt)}" loading="lazy"><figcaption>${esc(item.caption)}</figcaption></figure>`).join("")}</div></section>` : ""}
    ${isHome ? `<section class="product-evidence-block"><div><h2>Evidence and limitations</h2><p>${esc(product.proofNote)}</p></div><ul>${product.evidence.map((item) => `<li><span>${esc(item.label)}</span><strong>${esc(item.value)}</strong><small>${esc(item.state)}</small></li>`).join("")}</ul></section>` : ""}
  </main>
  ${footerMarkup(product, site)}
</body>
</html>`;
}

const manifest = [];
const slugs = new Set();
for (const product of products) {
  await rm(product.slug, { recursive: true, force: true });
  if (slugs.has(product.slug)) throw new Error(`Duplicate product slug: ${product.slug}`);
  slugs.add(product.slug);
  const site = product.site || fallbackSite(product);
  const pages = [...site.pages];
  if (!pages.some((page) => normalizePath(page.path) === "/404.html")) pages.push(fallbackSite(product).pages.at(-1));
  const routeSet = new Set();
  for (const page of pages) {
    const route = normalizePath(page.path);
    if (routeSet.has(route)) throw new Error(`${product.slug}: duplicate route ${route}`);
    routeSet.add(route);
    const output = outputPath(product.slug, route);
    await mkdir(output.slice(0, output.lastIndexOf("/")), { recursive: true });
    const html = pageTemplate(product, site, { ...page, path: route }).replace(/[ \t]+$/gm, "");
    await writeFile(output, html, "utf8");
    manifest.push({ product: product.slug, name: product.name, path: route, layout: layoutFor({ ...page, path: route }), output, url: absolute(product, route), title: page.title });
  }
  const publicRoutes = pages.map((page) => normalizePath(page.path)).filter((route) => route !== "/404.html");
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${publicRoutes.map((route) => `  <url><loc>${absolute(product, route)}</loc></url>`).join("\n")}\n</urlset>\n`;
  await writeFile(`${product.slug}/sitemap.xml`, sitemap, "utf8");
  await writeFile(`${product.slug}/robots.txt`, `User-agent: *\nAllow: /\nSitemap: https://${product.slug}.navinresearch.com/sitemap.xml\n`, "utf8");
}
await writeFile("products/site-manifest.json", `${JSON.stringify(manifest, null, 2)}\n`, "utf8");
console.log(`Generated ${manifest.length} product-site pages across ${products.length} domains.`);

function layoutSectionMarkup(page, layout) {
  const sections = page.sections || [];
  const item = (section, index, pointsMarkup, tag = "section") => `<${tag} class="product-page-section product-section--${layout}" data-kind="${esc(section.kind || "narrative")}" data-renderer="${layout}"><div class="product-page-section__index" aria-hidden="true">${String(index + 1).padStart(2, "0")}</div><div class="product-page-section__copy"><h2>${esc(section.title)}</h2><p>${esc(section.body)}</p>${section.status ? `<strong class="product-page-section__status">${esc(section.status)}</strong>` : ""}</div>${pointsMarkup}${section.cta ? `<a class="product-text-link" href="${esc(section.cta.href)}"${linkAttrs(section.cta.href)}>${esc(section.cta.label)} <span aria-hidden="true">→</span></a>` : ""}</${tag}>`;
  if (layout === "workflow") return `<ol class="product-workflow" aria-label="Workflow sequence">${sections.map((section, index) => item(section, index, renderSectionPoints(section, layout), "li")).join("")}</ol>`;
  if (layout === "ledger") return `<aside class="product-ledger" aria-label="Evidence register">${sections.map((section, index) => item(section, index, renderSectionPoints(section, layout))).join("")}</aside>`;
  if (layout === "docs") return `<article class="product-docs-frame"><header><p class="product-docs-frame__label">Documentation index</p><p>Read the concepts, boundaries, and source trail in sequence.</p></header><div>${sections.map((section, index) => item(section, index, renderSectionPoints(section, layout))).join("")}</div></article>`;
  if (layout === "specs") return `<dl class="product-specs-frame">${sections.map((section, index) => `<div><dt><span>${String(index + 1).padStart(2, "0")}</span>${esc(section.title)}</dt><dd>${esc(section.body)}${renderSectionPoints(section, layout)}</dd></div>`).join("")}</dl>`;
  if (layout === "media") return `<section class="product-media-frame" aria-label="Source material"><div class="product-media-frame__intro"><p>Source material</p><p>Images and visual references stay close to their provenance.</p></div><div>${sections.map((section, index) => item(section, index, renderSectionPoints(section, layout))).join("")}</div></section>`;
  if (layout === "availability") return `<section class="product-availability-frame" aria-label="Availability status"><div class="product-availability-frame__status">STATUS / ${esc(sections.length ? sections[0].status || "NOT ANNOUNCED" : "NOT ANNOUNCED")}</div>${sections.map((section, index) => item(section, index, renderSectionPoints(section, layout))).join("")}</section>`;
  return sections.map((section, index) => item(section, index, renderSectionPoints(section, layout))).join("");
}
