import { escapeHtml, headMarkup } from "../product-renderer-helpers.mjs";
const e = escapeHtml;
const normalizePath = (value = "/") => value === "/404.html" ? value : (`/${String(value).replace(/^\/+|\/+$/g, "")}/`).replace("//", "/");
const external = (href = "") => /^https?:|^mailto:/.test(href) ? ' target="_blank" rel="noopener noreferrer"' : "";
const layoutFor = (page) => /docs|api|developers/.test(page.path) ? "docs" : /models|benchmarks|evaluation|edge|devices/.test(page.path) ? "specs" : /research/.test(page.path) ? "timeline" : /pricing|contact/.test(page.path) ? "availability" : /solutions|speech|translation|streaming/.test(page.path) ? "workflow" : "editorial";

function navigation(site, path) {
  return site.navigation.map((item) => {
    const href = item.href || item.children?.[0]?.href || "/";
    const active = normalizePath(href) === path || item.children?.some((child) => normalizePath(child.href) === path);
    if (item.children?.length) return `<details class="my-nav-group"${active ? " data-current" : ""}><summary>${e(item.label)}<span>+</span></summary><div>${item.children.map((child) => `<a href="${e(child.href)}"${normalizePath(child.href) === path ? ' aria-current="page"' : ""}${external(child.href)}>${e(child.label)}</a>`).join("")}</div></details>`;
    return `<a href="${e(href)}"${active ? ' aria-current="page"' : ""}${external(href)}>${e(item.label)}</a>`;
  }).join("");
}

function waveform(page) {
  const items = (page.visual?.items || ["Speaker", "Meaning", "Context", "Output"]).slice(0, 6);
  const bars = Array.from({ length: 48 }, (_, index) => `<i style="--h:${18 + ((index * 37) % 78)}%"></i>`).join("");
  return `<figure class="my-wave"><div class="my-wave__top"><span>LIVE SIGNAL / ILLUSTRATIVE</span><span>00:${String(items.length * 7).padStart(2, "0")}</span></div><div class="my-wave__bars" aria-hidden="true">${bars}</div><ol>${items.map((item, index) => `<li><span>${String(index + 1).padStart(2, "0")}</span>${e(item)}</li>`).join("")}</ol><figcaption>${e(page.visual?.caption || "A conceptual signal path. No benchmark or live latency is implied.")}</figcaption></figure>`;
}

function cards(page) {
  return `<section class="my-cards">${(page.sections || []).map((section, index) => `<article class="my-card my-card--${(index % 4) + 1}"><span>${String(index + 1).padStart(2, "0")}</span><h2>${e(section.title)}</h2><p>${e(section.body)}</p>${section.status ? `<strong>${e(section.status)}</strong>` : ""}${section.points?.length ? `<ul>${section.points.map((point) => `<li>${e(point)}</li>`).join("")}</ul>` : ""}${section.cta ? `<a href="${e(section.cta.href)}"${external(section.cta.href)}>${e(section.cta.label)} ↗</a>` : ""}</article>`).join("")}</section>`;
}

function docs(page) {
  const sections = page.sections || [];
  return `<div class="my-docs"><aside><span>ON THIS PAGE</span>${sections.map((section, index) => `<a href="#topic-${index + 1}">${String(index + 1).padStart(2, "0")} ${e(section.title)}</a>`).join("")}</aside><article><header><span>MOYI DEVELOPER SURFACE</span><code>signal → context → output</code></header>${sections.map((section, index) => `<section id="topic-${index + 1}"><p class="my-docs__index">${String(index + 1).padStart(2, "0")}</p><div><h2>${e(section.title)}</h2><p>${e(section.body)}</p>${section.status ? `<mark>${e(section.status)}</mark>` : ""}</div>${section.points?.length ? `<pre><code>${section.points.map((point) => `• ${e(point)}`).join("\n")}</code></pre>` : ""}</section>`).join("")}</article></div>`;
}

function specs(page) {
  return `<section class="my-lab"><header><span>LANGUAGE LAB</span><p>Claims remain bounded by published project evidence.</p></header>${(page.sections || []).map((section, index) => `<article><div class="my-lab__number">${String(index + 1).padStart(2, "0")}</div><div><h2>${e(section.title)}</h2><p>${e(section.body)}</p></div><div class="my-lab__reading"><span>${e(section.status || "OBSERVATION")}</span>${section.points?.length ? `<ul>${section.points.map((point) => `<li>${e(point)}</li>`).join("")}</ul>` : ""}</div></article>`).join("")}</section>`;
}

function flow(page) {
  return `<section class="my-flow"><div class="my-flow__line" aria-hidden="true"></div>${(page.sections || []).map((section, index) => `<article style="--step:${index}"><span>STEP ${String(index + 1).padStart(2, "0")}</span><h2>${e(section.title)}</h2><p>${e(section.body)}</p>${section.points?.length ? `<ol>${section.points.map((point) => `<li>${e(point)}</li>`).join("")}</ol>` : ""}</article>`).join("")}</section>`;
}

function availability(page) {
  const sections = page.sections || [];
  return `<section class="my-offer"><header><span>PUBLIC AVAILABILITY</span><strong>${e(sections[0]?.status || "NOT ANNOUNCED")}</strong></header><div class="my-offer__statement"><p>01 / STATE</p><h2>${e(page.headline || page.title)}</h2><p>No number, tier, or date is inferred where the project has not published one.</p></div><dl>${sections.map((section, index) => `<div><dt>${String(index + 2).padStart(2, "0")} / ${e(section.title)}</dt><dd>${e(section.body)}${section.status ? `<b>${e(section.status)}</b>` : ""}</dd></div>`).join("")}</dl></section>`;
}

function pageBody(page, mode) { if (mode === "availability") return availability(page); if (mode === "docs") return docs(page); if (mode === "specs" || mode === "timeline") return specs(page); if (mode === "workflow") return flow(page); return cards(page); }

function footer(product, site) {
  const groups = site.footerGroups;
  return `<footer class="my-footer"><div class="my-footer__voice"><span>MOYI</span><h2>Speech carries more than words.</h2><p>${e(product.thesis)}</p></div><div class="my-footer__links">${groups.map((group) => `<section><h3>${e(group.title)}</h3>${group.links.map((link) => `<a href="${e(link.href)}"${external(link.href)}>${e(link.label)}</a>`).join("")}</section>`).join("")}</div><div class="my-footer__ticker"><span>LANGUAGE</span><span>CONTEXT</span><span>VOICE</span><span>MEANING</span><span>© <span data-current-year></span></span></div></footer>`;
}

function render(product, site, page) {
  const path = normalizePath(page.path); const mode = layoutFor(page); const home = path === "/"; const cta = page.cta || site.primaryCta;
  return `<!doctype html><html lang="en" class="no-js"><head>${headMarkup({ product, page, path, layout: mode, isHome: home })}</head><body class="my-body my-${mode}" data-product="moyi" data-route="${e(path)}"><a class="skip-link" href="#main-content">Skip to content</a><header class="my-header"><a class="my-logo" href="/" aria-label="Moyi home">MOYI<i aria-hidden="true"></i></a><button class="product-menu-button my-menu-button" type="button" aria-controls="product-menu" aria-expanded="false" data-product-menu>Menu</button><div class="product-menu my-menu" id="product-menu"><nav aria-label="Primary navigation">${navigation(site, path)}</nav><a class="my-header__cta" href="${e(site.primaryCta.href)}"${external(site.primaryCta.href)}>${e(site.primaryCta.label)}</a></div></header><main id="main-content"><section class="my-hero"><div class="my-hero__copy"><p>${e(page.eyebrow || "VOICE AI / CONTEXT FIRST")}</p><h1>${e(page.headline || page.title)}</h1><div class="my-hero__lede"><span aria-hidden="true">↳</span><p>${e(page.lede || page.description)}</p></div>${home ? `<div class="my-actions"><a href="${e(site.primaryCta.href)}"${external(site.primaryCta.href)}>${e(site.primaryCta.label)}</a><a href="/models/">Explore the model family</a></div>` : ""}</div>${waveform(page)}</section>${pageBody(page, mode)}${cta ? `<section class="my-next"><p>WHERE THE SIGNAL GOES NEXT</p><div><h2>${e(cta.title || "Keep the boundary audible")}</h2><p>${e(cta.body || product.availability.body)}</p></div><a href="${e(cta.href)}"${external(cta.href)}>${e(cta.label)} <span>↗</span></a></section>` : ""}${home ? `<section class="my-evidence"><div><p>EVIDENCE / LIMITS</p><h2>Evaluation before exaggeration.</h2><p>${e(product.proofNote)}</p></div><ol>${product.evidence.map((item, index) => `<li><span>${String(index + 1).padStart(2, "0")}</span><b>${e(item.label)}</b><strong>${e(item.value)}</strong><small>${e(item.state)}</small></li>`).join("")}</ol></section>` : ""}</main>${footer(product, site)}</body></html>`;
}
export default function renderMoyi(product, site, page) { return render(product, site, page).replace(/[ \t]+$/gm, ""); }
export { layoutFor, normalizePath };
