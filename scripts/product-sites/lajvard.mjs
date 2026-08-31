import { escapeHtml, headMarkup, canonicalUrl } from "../product-renderer-helpers.mjs";

const esc = escapeHtml;
const normalizePath = (value = "/") => {
  if (value === "/404.html") return value;
  const path = `/${String(value).replace(/^\/+|\/+$/g, "")}/`;
  return path === "//" ? "/" : path;
};
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
  return `<footer class="product-footer" data-footer="lajvard-notebook"><div class="product-footer__brand"><a href="/" class="product-wordmark">${esc(product.name)}</a><p>${esc(product.thesis)}</p><span>A Navin Research project</span></div><div class="product-footer__groups">${site.footerGroups.map((group) => `<section><h2>${esc(group.title)}</h2>${group.links.map((link) => `<a href="${esc(link.href)}"${linkAttrs(link.href)}>${esc(link.label)}</a>`).join("")}</section>`).join("")}${legal}</div><div class="product-footer__base"><span>© <span data-current-year></span> ${esc(product.name)}</span><a href="https://navinresearch.com/products/">Navin Research products</a></div></footer>`;
}

function pageTemplate(product, site, page) {
  const path = normalizePath(page.path);
  const layout = layoutFor(page);
  const isHome = path === "/";
  const cta = page.cta || site.primaryCta;
  const productRoute = site.pages.some((candidate) => normalizePath(candidate.path) === "/product/") ? "/product/" : site.navigation[0]?.href || "/";
  return `<!doctype html>
<html lang="en" class="no-js">
<head>
  ${headMarkup({ product, page, path, layout, isHome })}
</head>
<body class="product-${product.slug} product-renderer-${product.slug} product-layout-${layout}" data-product="${product.slug}" data-route="${esc(path)}" data-layout="${layout}">
  <a class="skip-link" href="#main-content">Skip to content</a><div class="product-field" aria-hidden="true"></div>
  <header class="product-header" data-shell="lajvard-notebook"><span class="lajvard-margin-note" aria-hidden="true">FIELD NOTE / 01</span><a class="product-wordmark" href="/" aria-label="${esc(product.name)} home">${esc(product.name)}</a><button class="product-menu-button" type="button" aria-controls="product-menu" aria-expanded="false" data-product-menu>Menu</button><div class="product-menu" id="product-menu"><nav class="product-nav" aria-label="Primary navigation">${site.navigation.map((item) => navItem(item, path)).join("")}</nav><a class="product-header__cta" href="${esc(site.primaryCta.href)}"${linkAttrs(site.primaryCta.href)}>${esc(site.primaryCta.label)}</a></div></header>
  <main id="main-content" class="product-main" data-notebook-state="IN RESEARCH" data-field="lajvard-paper"><section class="product-page-hero product-page-hero--${layout}${isHome ? " product-page-hero--home" : ""}"><div class="product-page-hero__copy">${page.eyebrow ? `<p class="product-eyebrow">${esc(page.eyebrow)}</p>` : ""}<h1>${esc(page.headline || page.title)}</h1><p>${esc(page.lede || page.description)}</p>${isHome ? `<div class="product-page-hero__actions"><a class="product-button" href="${esc(site.primaryCta.href)}"${linkAttrs(site.primaryCta.href)}>${esc(site.primaryCta.label)}</a><a class="product-text-link" href="${esc(productRoute)}">Explore the product <span aria-hidden="true">→</span></a></div>` : ""}</div>${visualMarkup(product, page.visual)}</section><div class="product-page-sections product-page-sections--${layout}">${sectionsMarkup(page)}</div>${cta ? `<section class="product-page-cta"><div><h2>${esc(cta.title || "Continue")}</h2><p>${esc(cta.body || product.availability.body)}</p></div><a class="product-button" href="${esc(cta.href)}"${linkAttrs(cta.href)}>${esc(cta.label)}</a></section>` : ""}${isHome ? `<section class="product-evidence-block"><div><h2>Evidence and limitations</h2><p>${esc(product.proofNote)}</p></div><ul>${product.evidence.map((item) => `<li><span>${esc(item.label)}</span><strong>${esc(item.value)}</strong><small>${esc(item.state)}</small></li>`).join("")}</ul></section>` : ""}</main>${footerMarkup(product, site)}</body>
</html>`;
}
export default function renderProductPage(product, site, page) { return pageTemplate(product, site, page).replace(/[ 	]+$/gm, ""); }
export { layoutFor, normalizePath };

function layoutSectionMarkup(page, layout) {
  const sections = page.sections || [];
  const item = (section, index, pointsMarkup, tag = "section") => `<${tag} class="product-page-section product-section--${layout} lajvard-entry--${esc(section.kind || "narrative")}" data-kind="${esc(section.kind || "narrative")}" data-renderer="${layout}" data-notebook-state="${esc(section.status || "CONCEPT STAGE")}"><div class="product-page-section__index" aria-hidden="true">${String(index + 1).padStart(2, "0")}</div><div class="product-page-section__copy"><h2>${esc(section.title)}</h2><p>${esc(section.body)}</p>${section.status ? `<strong class="product-page-section__status">${esc(section.status)}</strong>` : ""}</div>${pointsMarkup}${section.cta ? `<a class="product-text-link" href="${esc(section.cta.href)}"${linkAttrs(section.cta.href)}>${esc(section.cta.label)} <span aria-hidden="true">→</span></a>` : ""}</${tag}>`;
  if (layout === "workflow") return `<ol class="product-workflow" aria-label="Workflow sequence">${sections.map((section, index) => item(section, index, renderSectionPoints(section, layout), "li")).join("")}</ol>`;
  if (layout === "ledger") return `<aside class="product-ledger" aria-label="Evidence register">${sections.map((section, index) => item(section, index, renderSectionPoints(section, layout))).join("")}</aside>`;
  if (layout === "docs") return `<article class="product-docs-frame"><header><p class="product-docs-frame__label">Documentation index</p><p>Read the concepts, boundaries, and source trail in sequence.</p></header><div>${sections.map((section, index) => item(section, index, renderSectionPoints(section, layout))).join("")}</div></article>`;
  if (layout === "specs") return `<dl class="product-specs-frame">${sections.map((section, index) => `<div><dt><span>${String(index + 1).padStart(2, "0")}</span>${esc(section.title)}</dt><dd>${esc(section.body)}${renderSectionPoints(section, layout)}</dd></div>`).join("")}</dl>`;
  if (layout === "media") return `<section class="product-media-frame" aria-label="Source material"><div class="product-media-frame__intro"><p>Source material</p><p>Images and visual references stay close to their provenance.</p></div><div>${sections.map((section, index) => item(section, index, renderSectionPoints(section, layout))).join("")}</div></section>`;
  if (layout === "availability") return `<section class="product-availability-frame" aria-label="Availability status"><div class="product-availability-frame__status">STATUS / ${esc(sections.length ? sections[0].status || "NOT ANNOUNCED" : "NOT ANNOUNCED")}</div>${sections.map((section, index) => item(section, index, renderSectionPoints(section, layout))).join("")}</section>`;
  return sections.map((section, index) => item(section, index, renderSectionPoints(section, layout))).join("");
}
