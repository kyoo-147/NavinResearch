import { escapeHtml, headMarkup, canonicalUrl } from "../product-renderer-helpers.mjs";

const esc = escapeHtml;
const layouts = new Set(["editorial", "index", "workflow", "docs", "specs", "media", "ledger", "timeline", "comparison", "availability"]);
const normalizePath = (value = "/") => value === "/404.html" ? value : `/${String(value).replace(/^\/+|\/+$/g, "")}/`.replace("//", "/");
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
  return "index";
};
const external = (href) => /^https?:|^mailto:/.test(href) ? ' target="_blank" rel="noopener noreferrer"' : "";

function navMarkup(site, path) {
  const links = [
    ["Product", "/product/"], ["Studio", "/studio/"], ["Download", "/download/"],
    ["Docs", "/docs/"], ["Pricing", "/pricing/"]
  ];
  return links.map(([label, href]) => `<a href="${href}"${path === href ? ' aria-current="page"' : ""}>${label}</a>`).join("") +
    `<a class="sori-nav__cta" href="${esc(site.primaryCta.href)}"${external(site.primaryCta.href)}>${esc(site.primaryCta.label)}</a>`;
}

function visualMarkup(product, visual = {}) {
  if (visual.src) return `<figure class="sori-visual sori-visual--diagram"><img src="${esc(visual.src)}" width="1400" height="900" alt="${esc(visual.alt || visual.title || product.name)}"><figcaption>${esc(visual.caption || "Project-owned source material")}</figcaption></figure>`;
  const items = (visual.items || []).map((item, index) => `<li><span>${String(index + 1).padStart(2, "0")}</span>${esc(item)}</li>`).join("");
  return `<figure class="sori-visual sori-visual--instrument"><div class="sori-instrument"><p>${esc(visual.title || "SORI / LOCAL VOICE")}</p><ol>${items}</ol><b aria-hidden="true">⌁</b></div>${visual.caption ? `<figcaption>${esc(visual.caption)}</figcaption>` : ""}</figure>`;
}

function points(section, ordered = false) {
  if (!section.points?.length) return "";
  const tag = ordered ? "ol" : "ul";
  return `<${tag} class="sori-points">${section.points.map((point) => `<li>${esc(point)}</li>`).join("")}</${tag}>`;
}
function sectionMarkup(section, index, layout) {
  return `<section class="product-page-section sori-section sori-section--${esc(section.kind || "narrative")}" data-kind="${esc(section.kind || "narrative")}" data-renderer="${layout}"><div class="sori-section__count">${String(index + 1).padStart(2, "0")}</div><div class="sori-section__copy"><h2>${esc(section.title)}</h2><p>${esc(section.body)}</p>${section.status ? `<strong class="sori-status">${esc(section.status)}</strong>` : ""}</div>${points(section, layout === "workflow")}${section.cta ? `<a class="sori-inline" href="${esc(section.cta.href)}"${external(section.cta.href)}>${esc(section.cta.label)} <span aria-hidden="true">↗</span></a>` : ""}</section>`;
}
function contentFrame(page, layout) {
  const sections = page.sections || [];
  const body = sections.map((section, index) => sectionMarkup(section, index, layout)).join("");
  if (layout === "workflow") return `<ol class="product-workflow" aria-label="Sori workflow">${body}</ol>`;
  if (layout === "ledger") return `<aside class="product-ledger" aria-label="Sori boundary register">${body}</aside>`;
  if (layout === "docs") return `<article class="product-docs-frame"><header><strong>READ THE BOUNDARY FIRST</strong><p>Source description, local test, and physical voice session are separate receipts.</p></header>${body}</article>`;
  if (layout === "specs") return `<dl class="product-specs-frame">${sections.map((section, index) => `<div class="sori-spec"><dt><span>${String(index + 1).padStart(2, "0")}</span>${esc(section.title)}</dt><dd>${esc(section.body)}${points(section)}</dd></div>`).join("")}</dl>`;
  if (layout === "availability") return `<section class="product-availability-frame"><p class="sori-availability">ACCESS / NOT ANNOUNCED</p>${body}</section>`;
  return `<div class="sori-frame">${body}</div>`;
}
function footer(product, site) {
  return `<footer class="product-footer"><div><a class="sori-footer__mark" href="/">${esc(product.name)}</a><p>${esc(product.thesis)}</p><small>A Navin Research project · evidence stays visible</small></div><nav aria-label="Footer navigation"><a href="/product/">Product</a><a href="/studio/">Studio</a><a href="/docs/">Docs</a><a href="/privacy/">Privacy</a><a href="/terms/">Terms</a></nav><div class="product-footer__base"><span>© <span data-current-year></span> ${esc(product.name)}</span><a href="https://navinresearch.com/products/"${external("https://navinresearch.com/products/")}>Navin Research products</a></div></footer>`;
}
function render(product, site, page) {
  const path = normalizePath(page.path); const layout = layoutFor(page); const home = path === "/";
  const productRoute = "/product/";
  const cta = page.cta || site.primaryCta;
  return `<!doctype html><html lang="en" class="no-js"><head>${headMarkup({ product, page, path, layout, isHome: home })}</head><body class="product-${product.slug} product-renderer-${product.slug} product-layout-${layout}" data-product="${product.slug}" data-route="${esc(path)}" data-layout="${layout}"><a class="skip-link" href="#main-content">Skip to content</a><div class="product-field" aria-hidden="true"></div><header class="product-header"><a class="product-wordmark" href="/" aria-label="Sori home">sori<span>·</span></a><button class="product-menu-button" type="button" aria-controls="product-menu" aria-expanded="false" data-product-menu>Menu</button><div class="product-menu" id="product-menu"><nav class="product-nav" aria-label="Primary navigation">${navMarkup(site, path)}</nav></div></header><main id="main-content" class="product-main"><section class="product-page-hero product-page-hero--${layout}${home ? " product-page-hero--home" : ""}"><div class="sori-hero__copy">${page.eyebrow ? `<p class="product-eyebrow">${esc(page.eyebrow)}</p>` : ""}<h1>${esc(page.headline || page.title)}</h1><p>${esc(page.lede || page.description)}</p>${home ? `<div class="product-page-hero__actions"><a class="product-button" href="${esc(site.primaryCta.href)}">${esc(site.primaryCta.label)}</a><a class="sori-inline" href="${productRoute}">See the product <span aria-hidden="true">↘</span></a></div>` : ""}</div>${visualMarkup(product, page.visual)}</section>${contentFrame(page, layout)}${cta ? `<section class="product-page-cta sori-cta"><div><p class="product-eyebrow">NEXT SIGNAL</p><h2>${esc(cta.title || "Continue with care.")}</h2><p>${esc(cta.body || product.availability.body)}</p></div><a class="product-button" href="${esc(cta.href)}"${external(cta.href)}>${esc(cta.label)}</a></section>` : ""}${home ? `<section class="product-evidence-block sori-evidence"><div><p class="product-eyebrow">THE RECEIPT</p><h2>Direction is not proof.</h2><p>${esc(product.proofNote)}</p></div><ul>${product.evidence.map((item) => `<li><span>${esc(item.label)}</span><strong>${esc(item.value)}</strong><small>${esc(item.state)}</small></li>`).join("")}</ul></section>` : ""}</main>${footer(product, site)}</body></html>`;
}
export default function renderProductPage(product, site, page) { return render(product, site, page).replace(/[ \t]+$/gm, ""); }
export { layoutFor, normalizePath };
