import { mkdir, writeFile } from "node:fs/promises";
import sandora from "../products/content/sandora.mjs";
import moyi from "../products/content/moyi.mjs";
import sori from "../products/content/sori.mjs";
import howhow from "../products/content/howhow.mjs";
import dossier from "../products/content/dossier.mjs";
import autopilot from "../products/content/autopilot.mjs";
import lajvard from "../products/content/lajvard.mjs";

const products = [sandora, moyi, sori, howhow, dossier, autopilot, lajvard];
const esc = (value) => String(value)
  .replaceAll("&", "&amp;")
  .replaceAll("<", "&lt;")
  .replaceAll(">", "&gt;")
  .replaceAll('"', "&quot;");

function classNames(product, base) {
  return `${base} product-${product.slug}__${base.replace(/^product-/, "")}`;
}

function productNavigation(activeProduct) {
  return products.map((product, index) => `<a href="https://${product.slug}.navinresearch.com/"${product.slug === activeProduct.slug ? ' aria-current="page"' : ""}><small>${String(index + 1).padStart(2, "0")}</small><span>${esc(product.name)}</span></a>`).join("");
}

function productTemplate(product) {
  const sections = product.sections.map((section) => `<section class="${classNames(product, "product-section")}" id="${esc(section.id)}"><header class="product-section__head product-${product.slug}__section-head"><p class="product-kicker product-${product.slug}__kicker">${esc(section.kicker)}</p><h2>${esc(section.title)}</h2></header><div class="product-section__body product-${product.slug}__section-body product-${product.slug}__section-copy"><p>${esc(section.body)}</p><ul class="product-section__points product-${product.slug}__points">${section.points.map((point) => `<li>${esc(point)}</li>`).join("")}</ul></div></section>`).join("");
  const capabilities = product.capabilities.map((capability, index) => `<div class="capability"><b>${String(index + 1).padStart(2, "0")}</b><span>${esc(capability)}</span></div>`).join("");
  const evidence = product.evidence.map((item) => `<article class="product-evidence__item product-${product.slug}__evidence-item"><span class="product-evidence__label product-${product.slug}__evidence-label">${esc(item.label)}</span><strong class="product-evidence__value product-${product.slug}__evidence-value">${esc(item.value)}</strong><span class="product-evidence__state product-${product.slug}__evidence-state">${esc(item.state)}</span></article>`).join("");
  const media = product.media?.length ? `<section class="product-gallery product-${product.slug}__gallery" aria-labelledby="gallery-title"><p class="product-label">PROJECT SOURCE MATERIAL</p><h2 id="gallery-title">The vehicle, track, and build record.</h2><div class="product-gallery__grid">${product.media.map((item) => `<figure><img src="${esc(item.src)}" alt="${esc(item.alt)}" loading="lazy"><figcaption>${esc(item.caption)}</figcaption></figure>`).join("")}</div></section>` : "";
  const sources = product.sourceLinks.map((source) => `<a href="${esc(source.url)}" target="_blank" rel="noopener noreferrer">${esc(source.label)} <span aria-hidden="true">↗</span></a>`).join("");
  const isOpenResearch = product.slug === "autopilot";
  const ctaHref = isOpenResearch ? product.sourceLinks[0].url : `mailto:michaelbui.contact@gmail.com?subject=${encodeURIComponent(`${product.name} — product interest`)}`;
  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="description" content="${esc(product.thesis)}">
  <meta name="robots" content="index,follow,max-image-preview:large">
  <meta property="og:type" content="website">
  <meta property="og:site_name" content="Navin Research">
  <meta property="og:title" content="${esc(product.name)} — Navin Research">
  <meta property="og:description" content="${esc(product.thesis)}">
  <meta property="og:url" content="https://${product.slug}.navinresearch.com/">
  <meta name="twitter:card" content="summary">
  <meta name="theme-color" content="#03120d">
  <link rel="canonical" href="https://${product.slug}.navinresearch.com/">
  <link rel="icon" href="/assets/brand/logo_icon_tab.png" type="image/png">
  <link rel="stylesheet" href="/products/product-foundation.css?v=20260830-1">
  <link rel="stylesheet" href="/products/themes/${product.slug}.css?v=20260830-1">
  <title>${esc(product.name)} — Navin Research</title>
</head>
<body class="product-${product.slug}">
  <a class="skip-link" href="#main-content">Skip to content</a>
  <div class="product-field" aria-hidden="true"></div>
  <div class="product-shell product-${product.slug}__shell">
    <header class="product-header product-${product.slug}__masthead">
      <a class="product-brand product-${product.slug}__wordmark" href="https://navinresearch.com/products/"><span>NAVIN</span> / ${esc(product.name)}</a>
      <nav aria-label="Product navigation"><a href="#system">System</a><a href="#evidence">Evidence</a><a href="#availability">Access</a><a href="https://navinresearch.com/products/">All products</a></nav>
    </header>
    <main class="product-main product-${product.slug}__main" id="main-content">
      <section class="${classNames(product, "product-hero")} product-${product.slug}__intro">
        <div class="product-hero__copy product-${product.slug}__intro-copy">
          <p class="product-eyebrow product-${product.slug}__eyebrow">${esc(product.eyebrow)}</p>
          <h1>${esc(product.name)}</h1>
          <p class="product-thesis product-${product.slug}__thesis">${esc(product.thesis)}</p>
        </div>
        <aside class="product-hero__aside product-${product.slug}__hero-note">
          <p class="product-intro">${esc(product.intro)}</p>
          <span class="product-status product-${product.slug}__status product-${product.slug}__stamp">${esc(product.status)}</span>
        </aside>
      </section>
      <figure class="product-diagram-frame" id="system"><img class="product-${product.slug}__diagram" src="/products/media/${product.slug}-system.svg" alt="${esc(product.name)} system concept diagram" width="1200" height="620"><figcaption>System view / editorial technical diagram</figcaption></figure>
      <div class="product-sections product-${product.slug}__sections">${sections}</div>
      <section class="product-capabilities" aria-labelledby="capabilities-title"><p class="product-label">SYSTEM CAPABILITIES</p><h2 id="capabilities-title">What this program is designed to hold.</h2><div class="capability-grid">${capabilities}</div></section>
${media}
      <section class="product-proof product-${product.slug}__proof" id="evidence" aria-labelledby="evidence-title"><p class="product-label product-${product.slug}__label">EVIDENCE / LIMITS</p><h2 id="evidence-title">Claims stay attached to their status.</h2><p class="product-proof__note">${esc(product.proofNote)}</p><div class="product-evidence product-${product.slug}__evidence">${evidence}</div></section>
      <section class="product-availability product-${product.slug}__availability" id="availability"><div><p class="product-label">${esc(product.availability.label)}</p><h2>${esc(product.availability.title)}</h2><p>${esc(product.availability.body)}</p></div><a class="product-cta product-${product.slug}__cta" href="${esc(ctaHref)}">${esc(product.availability.cta)} <span aria-hidden="true">→</span></a></section>
      <section class="product-ecosystem" aria-labelledby="ecosystem-title"><p class="product-label">NAVIN PRODUCT SYSTEMS</p><h2 id="ecosystem-title">One research institution. Seven distinct programs.</h2><nav class="product-switcher" aria-label="Explore Navin products">${productNavigation(product)}</nav></section>
      <div class="product-sources product-${product.slug}__sources"><strong>Source trail</strong>${sources}</div>
    </main>
    <footer class="product-footer product-${product.slug}__footer"><span>${esc(product.name)} · ${esc(product.status)}</span><a href="https://navinresearch.com/">Navin Research</a></footer>
  </div>
</body>
</html>`;
}

const slugs = new Set();
for (const product of products) {
  if (slugs.has(product.slug)) throw new Error(`Duplicate product slug: ${product.slug}`);
  slugs.add(product.slug);
  await mkdir(product.slug, { recursive: true });
  await writeFile(`${product.slug}/index.html`, productTemplate(product), "utf8");
}
console.log(`Generated ${products.length} detailed product pages.`);
