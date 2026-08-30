import { mkdir, writeFile } from "node:fs/promises";
import { chapters, experience, legalPages, locales, localePath, releaseRoute, sections, site } from "../site.config.mjs";
import { pageHead } from "./components/page-head.mjs";
import { contentHeader, escapeHtml, routeFooter, siteDrawer, siteFooter, siteHeader } from "./components/site-shell.mjs";
import { products } from "./product-data.mjs";
import { blogPostPath, blogPosts, renderBlogPost } from "./blog-posts.mjs";

const localeEntries = Object.entries(locales);
const homeAssetRevision = "20260824-11";
const head = (localeKey, title, description, suffix = "", styles = ["/content-routes/route-foundation.css"], scripts = []) => pageHead({
  localeKey,
  title,
  description,
  suffix,
  styles: Array.isArray(styles) ? styles : [styles],
  scripts: Array.isArray(scripts) ? scripts : [scripts],
  revision: homeAssetRevision,
});

const productCopy = {
  en: { eyebrow: "PRODUCT SYSTEMS / 01—07", title: "Research, made operational.", lede: "Seven independent product programs. Each has its own interface, evidence standard, and path to availability.", status: "Current status", product: "PRODUCT", research: "IN RESEARCH", homeLabel: "Product systems", homeTitle: "Seven systems, built as distinct worlds.", homeLink: "View all products" },
  vi: { eyebrow: "HỆ THỐNG SẢN PHẨM / 01—07", title: "Nghiên cứu được đưa vào vận hành.", lede: "Bảy chương trình sản phẩm độc lập. Mỗi sản phẩm có giao diện, chuẩn bằng chứng và lộ trình tiếp cận riêng.", status: "Trạng thái hiện tại", product: "SẢN PHẨM", research: "ĐANG NGHIÊN CỨU", homeLabel: "Hệ thống sản phẩm", homeTitle: "Bảy hệ thống, bảy thế giới riêng.", homeLink: "Xem tất cả sản phẩm" },
  "zh-cn": { eyebrow: "产品系统 / 01—07", title: "让研究进入实际运行。", lede: "七个独立产品计划，每一个都有自己的界面、证据标准与开放路径。", status: "当前状态", product: "产品", research: "研究中", homeLabel: "产品系统", homeTitle: "七个系统，七个独立世界。", homeLink: "查看全部产品" },
};

function productGrid(localeKey, compact = false) {
  const copy = productCopy[localeKey];
  return products.map((product, index) => {
    const catalogStatus = copy[product.catalogStatus];
    if (!catalogStatus) throw new Error(`Missing catalog status for ${product.slug}`);
    return `<article class="product-entry${compact ? " product-entry--compact" : ""}"><a href="https://${product.slug}.navinresearch.com/"><span class="product-entry__number">${String(index + 1).padStart(2, "0")}</span><span class="product-entry__identity"><small>${escapeHtml(product.eyebrow)}</small><strong>${escapeHtml(product.name)}</strong></span><span class="product-entry__statement">${escapeHtml(product.thesis)}</span><span class="product-entry__state"><small>${escapeHtml(copy.status)}</small>${escapeHtml(catalogStatus)}</span><span class="product-entry__arrow" aria-hidden="true">↗</span></a></article>`;
  }).join("\n");
}

function homeTemplate(localeKey) {
  const locale = locales[localeKey];
  const home = locale.home;
  const ui = experience[localeKey];
  const title = home.title.map(escapeHtml).join("<br>");
  return `<!DOCTYPE html>
<html lang="${locale.htmlLang}">
  <head>
${head(localeKey, locale.meta.title, locale.meta.description, "", `/styles.css?v=${homeAssetRevision}`, `/script.js?v=${homeAssetRevision}`)}  </head>
  <body class="home-page">
    <div class="field" aria-hidden="true">${[1,2,3,4,5].map((n) => `<div class="field__layer field__layer--${n}"></div>`).join("")}<div class="field__wash"></div><div class="field__grain"></div></div>
    <div class="shell">
      ${siteHeader(localeKey)}
      ${siteDrawer(localeKey)}
      <main>
        <section class="hero">
          <div class="hero__index" aria-hidden="true">NR — 00</div>
          <div class="hero__content"><p class="eyebrow">${escapeHtml(ui.chapterEyebrow)}</p><h1>${title}</h1><p class="statement">${escapeHtml(home.statement)}</p></div>
          <aside class="contact" aria-label="${escapeHtml(home.contactAria)}"><p>${escapeHtml(home.contactLabel)}</p><h2>${escapeHtml(home.contactTitle)}</h2><nav class="contact__links" aria-label="${escapeHtml(home.contactLinksAria)}"><a href="mailto:${site.email}"><span>Email</span><span aria-hidden="true">↗</span></a><a href="${site.linkedin}" target="_blank" rel="noopener noreferrer"><span>LinkedIn</span><span aria-hidden="true">↗</span></a><a href="${site.github}" target="_blank" rel="noopener noreferrer"><span>GitHub</span><span aria-hidden="true">↗</span></a></nav></aside>
        </section>
        <section class="home-products" aria-labelledby="home-products-title"><div class="home-products__intro"><p>${escapeHtml(productCopy[localeKey].homeLabel)}</p><h2 id="home-products-title">${escapeHtml(productCopy[localeKey].homeTitle)}</h2><a href="${localePath(localeKey, "products")}">${escapeHtml(productCopy[localeKey].homeLink)} <span aria-hidden="true">→</span></a></div><div class="product-directory product-directory--home">${productGrid(localeKey, true)}</div></section>
        <section class="wealth" id="wealth-of-nature" aria-labelledby="wealth-title">
          <div class="wealth__mark" aria-hidden="true"><span></span></div>
          <p class="wealth__label">${escapeHtml(ui.wealth.label)}</p>
          <h2 id="wealth-title">${escapeHtml(ui.wealth.title)}</h2>
          <span class="wealth__rule" aria-hidden="true"></span>
          <p class="wealth__statement">${escapeHtml(ui.wealth.statement)}</p>
        </section>
      </main>
      ${siteFooter(localeKey)}
    </div>
  </body>
</html>
`;
}

function routeNav(localeKey, current) {
  const locale = locales[localeKey];
  const navSections = ["research", "models", "products", "publications", "notes", "releases", "about", "careers", "contact", "docs", "search"];
  return navSections.map((section) => `<a href="${localePath(localeKey, section)}"${section === current ? ' aria-current="page"' : ""}>${escapeHtml(locale.routes[section].title)}</a>`).join("\n          ");
}

function routeTemplate(localeKey, section) {
  const locale = locales[localeKey];
  const route = locale.routes[section];
  const ui = experience[localeKey];
  const routeNumber = String(sections.indexOf(section) + 1).padStart(2, "0");
  const search = section === "search" ? `<section class="route-search" aria-labelledby="search-label"><label id="search-label" for="route-search">${escapeHtml(locale.common.searchLabel)}</label><input id="route-search" type="search" data-route-search placeholder="${escapeHtml(locale.common.searchPlaceholder)}" autocomplete="off"><div class="route-search__results" data-search-results data-empty-label="${escapeHtml(locale.common.noResults)}" aria-live="polite"></div></section>` : "";
  const contact = section === "contact" ? `<p class="route-contact"><a href="mailto:${site.email}">${site.email}</a></p>` : "";
  return `<!DOCTYPE html><html lang="${locale.htmlLang}"><head>
${head(localeKey, `${route.title} — ${site.name}`, route.description, section, "/content-routes/route-foundation.css", section === "search" ? "/content-routes/route-search.js" : "")}  </head><body class="route-page content-page content-${section}"><div class="content-field" aria-hidden="true"></div><div class="route-page__shell">
    ${contentHeader(localeKey, section)}
    <main class="route-page__main content-main"><div class="content-copy"><p class="route-page__eyebrow">SECTION ${routeNumber} / ${escapeHtml(route.title)}</p><h1>${escapeHtml(route.title)}</h1><p class="route-page__lede">${escapeHtml(route.lede)}</p><div class="route-page__notice"><strong>${escapeHtml(locale.common.preparation)}</strong><span>${escapeHtml(route.description)}</span></div>${contact}${search}</div><aside class="content-index" aria-label="${escapeHtml(ui.menu.explore)}"><p>${escapeHtml(ui.menu.explore)}</p><nav aria-label="${escapeHtml(ui.menu.explore)}">${routeNav(localeKey, section)}</nav></aside></main>
    ${routeFooter(localeKey)}
  </div></body></html>
`;
}

function productsTemplate(localeKey) {
  const locale = locales[localeKey];
  const copy = productCopy[localeKey];
  return `<!DOCTYPE html><html lang="${locale.htmlLang}"><head>
${head(localeKey, `${locale.routes.products.title} — ${site.name}`, locale.routes.products.description, "products", "/content-routes/route-foundation.css?v=20260830-12")}  </head><body class="route-page content-page content-products products-page"><div class="content-field" aria-hidden="true"></div><div class="route-page__shell">
    ${contentHeader(localeKey, "products")}
    <main class="products-main"><header class="products-intro"><p class="route-page__eyebrow">${escapeHtml(copy.eyebrow)}</p><h1>${escapeHtml(copy.title)}</h1><p>${escapeHtml(copy.lede)}</p></header><section class="product-directory" aria-label="${escapeHtml(locale.routes.products.title)}">${productGrid(localeKey)}</section></main>
    ${routeFooter(localeKey)}
  </div></body></html>`;
}

function chapterTemplate(localeKey, chapter) {
  const locale = locales[localeKey];
  const ui = experience[localeKey];
  const domain = chapter.domains[localeKey];
  const title = `NAVIN / ${chapter.key} — ${chapter.number}`;
  const intro = ui.chapterIntro(domain);
  const chapterIndex = chapters.findIndex((item) => item.slug === chapter.slug);
  const previous = chapters[chapterIndex - 1];
  const next = chapters[chapterIndex + 1];
  const nav = chapters.map((item) => `<a href="${localePath(localeKey, item.slug)}"${item.slug === chapter.slug ? ' aria-current="page"' : ""}><span>${item.number}</span><strong>${item.key}</strong></a>`).join("");
  const previousLink = previous ? `<a class="chapter-nav__arrow" href="${localePath(localeKey, previous.slug)}" aria-label="Previous chapter">←</a>` : '<span class="chapter-nav__arrow" aria-hidden="true">←</span>';
  const nextLink = next ? `<a class="chapter-nav__arrow" href="${localePath(localeKey, next.slug)}" aria-label="Next chapter">→</a>` : '<span class="chapter-nav__arrow" aria-hidden="true">→</span>';
  return `<!DOCTYPE html><html lang="${locale.htmlLang}"><head>
${head(localeKey, title, `${intro} ${ui.chapterNotice}`, chapter.slug, ["/styles.css", "/content-routes/route-foundation.css"], "/script.js")}  </head><body class="route-page chapter-page chapter-${chapter.slug}"><div class="chapter-field" aria-hidden="true"></div><div class="route-page__shell">
    ${siteHeader(localeKey, chapter.slug)}
    ${siteDrawer(localeKey)}
    <a class="all-chapters" href="${localePath(localeKey)}#wealth-of-nature">← ${escapeHtml(ui.menu.chapters)}</a>
    <main class="chapter-main"><div class="chapter-copy"><p class="route-page__eyebrow">CHAPTER ${chapter.number}</p><h1>NAVIN / ${chapter.key}<span> — ${chapter.number}</span></h1><p class="chapter-domain">${escapeHtml(domain)}</p><span class="chapter-rule" aria-hidden="true"></span><h2>${escapeHtml(domain)}</h2><p class="route-page__lede">${escapeHtml(intro)}</p><div class="route-page__notice"><strong>${escapeHtml(locale.common.preparation)}</strong><span>${escapeHtml(ui.chapterNotice)}</span></div></div><aside class="chapter-facts" aria-label="${escapeHtml(domain)}"><p><small>${escapeHtml(ui.menu.chapters)}</small><strong>${chapter.number} / 05</strong></p><p><small>${escapeHtml(ui.chapterLabels.researchProgram)}</small><strong>NAVIN / ${chapter.key}</strong></p><p><small>${escapeHtml(ui.chapterLabels.coreDimension)}</small><strong>${escapeHtml(domain)}</strong></p><p><small>${escapeHtml(ui.chapterLabels.status)}</small><strong>${escapeHtml(locale.common.preparation)}</strong></p><p class="chapter-nav__label"><small>${escapeHtml(ui.chapterLabels.navigation)}</small></p><nav class="chapter-nav" aria-label="${escapeHtml(ui.menu.chapters)}">${previousLink}${nav}${nextLink}</nav></aside></main>
    ${siteFooter(localeKey, { flow: true })}</div></body></html>
`;
}

const releaseModels = [
  ["01", "Dossier-1B", "Document", "Fast document OCR, handwriting, layout analysis, tables, forms, receipts and key-value extraction.", "1B"],
  ["02", "Dossier-2B", "Document", "Compact document understanding with structured extraction, classification, document QA and field-level validation.", "2B"],
  ["03", "Dossier-4B", "Agentic Document", "Flagship Agentic Document Intelligence model. OCR, document reasoning, evidence grounding, verification, risk detection, tool use and bounded repair.", "4B"],
  ["04", "Dossier-9B", "Document Reasoning", "Advanced multi-page and multi-document reasoning for complex contracts, financial documents, compliance workflows and high-quality verification.", "9B"],
  ["05", "Sandora-3B", "Agent", "Lightweight agent model for tool calling, routing, delegation, local automation and basic computer-use tasks.", "3B"],
  ["06", "Sandora-9B", "Adaptive Agent", "Flagship Adaptive Multimodal Agent. Planning, computer use, multi-agent orchestration, tool use, memory, skill learning, self-reflection and user adaptation.", "9B"],
  ["07", "Sandora-27B", "Agent Reasoning", "High-capability agent model for long-horizon planning, complex orchestration, reasoning, trajectory generation, evaluation and teacher-model workloads.", "27B"],
  ["08", "Moyi-T2.5-160M", "Speech", "Micro / embedded streaming speech model optimized for highly constrained edge devices and offline execution.", "160M"],
  ["09", "Moyi-T2.5-350M", "Speech", "Ultra-edge multilingual speech intelligence for low-memory mobile and embedded hardware.", "350M"],
  ["10", "Moyi-T2.5-600M", "Edge Speech", "Flagship Edge Speech Intelligence model. Real-time multilingual speech translation, streaming inference, context awareness and on-device execution.", "600M"],
  ["11", "Moyi-T2.5-1.7B", "Speech", "Quality-oriented speech model for workstation, higher-end edge devices and teacher / distillation workloads.", "1.7B"],
];

function releaseTemplate(localeKey) {
  const locale = locales[localeKey];
  const ui = experience[localeKey];
  const rows = releaseModels.map(([number, name, type, details, size]) => `<tr data-release-row><td>${number}</td><th scope="row"><a class="release-model-name" href="#" data-release-placeholder>${escapeHtml(name)}</a></th><td>${escapeHtml(type)}</td><td>${escapeHtml(details)}</td><td>—</td><td>—</td><td>${size}</td></tr>`).join("\n                ");
  const headers = ui.releases.headers.map((label) => `<th scope="col">${escapeHtml(label)}</th>`).join("");
  return `<!DOCTYPE html><html lang="${locale.htmlLang}"><head>
${head(localeKey, `${locale.routes.releases.title} — ${site.name}`, locale.routes.releases.description, releaseRoute, "/content-routes/route-foundation.css", "/content-routes/release-search.js")}  </head><body class="route-page content-page release-page"><div class="content-field" aria-hidden="true"></div><div class="route-page__shell">
    ${contentHeader(localeKey, "")}
    <main class="release-main"><div class="release-intro"><h1 data-release-title aria-live="off">NAVIN RELEASES</h1><p class="release-subtitle">${escapeHtml(ui.releases.subtitle)}</p></div><section class="release-registry" aria-labelledby="release-registry-title"><div class="release-registry__toolbar"><h2 id="release-registry-title">${escapeHtml(locale.routes.releases.title)}</h2><label for="release-search">${escapeHtml(ui.releases.search)}</label><input id="release-search" type="search" data-release-search placeholder="${escapeHtml(ui.releases.search)}" autocomplete="off"></div><div class="release-table-wrap"><table class="release-table"><caption class="sr-only">${escapeHtml(locale.routes.releases.title)}</caption><thead><tr>${headers}</tr></thead><tbody>${rows}</tbody></table></div></section></main>
    ${routeFooter(localeKey)}
  </div></body></html>`;
}

function legalTemplate(localeKey, slug) {
  const locale = locales[localeKey];
  const ui = experience[localeKey];
  const [title, first, second] = ui.legal[slug];
  return `<!DOCTYPE html><html lang="${locale.htmlLang}"><head>
${head(localeKey, `${title} — ${site.name}`, first, slug, ["/styles.css", "/content-routes/route-foundation.css"], "/script.js")}  </head><body class="route-page legal-route"><div class="route-page__shell">${siteHeader(localeKey, slug)}${siteDrawer(localeKey)}<main class="route-page__main legal-page"><p class="route-page__eyebrow">Navin Research</p><h1>${escapeHtml(title)}</h1><p class="route-page__lede">${escapeHtml(first)}</p><div class="route-page__notice"><span>${escapeHtml(second)}</span></div></main>${siteFooter(localeKey, { flow: true })}</div></body></html>
`;
}

const pages = [];
async function emit(localeKey, suffix, html) {
  const prefix = locales[localeKey].prefix;
  const directory = [prefix, suffix].filter(Boolean).join("/") || ".";
  await mkdir(directory, { recursive: true });
  const file = directory === "." ? "index.html" : `${directory}/index.html`;
  await writeFile(file, html, "utf8");
  pages.push({ localeKey, suffix, file, url: localePath(localeKey, suffix) });
}

for (const [localeKey] of localeEntries) {
  await emit(localeKey, "", homeTemplate(localeKey));
  for (const section of sections) await emit(localeKey, section, section === "products" ? productsTemplate(localeKey) : routeTemplate(localeKey, section));
  await emit(localeKey, releaseRoute, releaseTemplate(localeKey));
  for (const chapter of chapters) await emit(localeKey, chapter.slug, chapterTemplate(localeKey, chapter));
  for (const legalPage of legalPages) await emit(localeKey, legalPage, legalTemplate(localeKey, legalPage));
}

const notFoundTemplate = (localeKey = "en") => {
  const locale = locales[localeKey];
  return `<!DOCTYPE html><html lang="${locale.htmlLang}"><head>${head(localeKey, `Page not found — ${site.name}`, "The requested Navin Research page was not found.", "404", "/content-routes/route-foundation.css")}</head><body class="route-page content-page content-404"><div class="content-field" aria-hidden="true"></div><div class="route-page__shell">${contentHeader(localeKey, "")}<main class="route-page__main content-main"><div class="content-copy"><p class="route-page__eyebrow">NAVIN RESEARCH / 404</p><h1>Page not found.</h1><p class="route-page__lede">This route is not part of the public site.</p><p><a class="route-contact" href="/">Return home <span aria-hidden="true">→</span></a></p></div></main>${routeFooter(localeKey)}</div></body></html>`;
};
await writeFile("404.html", notFoundTemplate(), "utf8");

const markdownPosts = [];
for (const post of blogPosts) {
  const url = blogPostPath(post);
  const file = url.slice(1);
  await mkdir(file.slice(0, file.lastIndexOf("/")), { recursive: true });
  await writeFile(file, renderBlogPost(post), "utf8");
  markdownPosts.push({ ...post, file, url });
}

const searchIndex = pages.map(({ localeKey, suffix, url }) => {
  const locale = locales[localeKey];
  const ui = experience[localeKey];
  const chapter = chapters.find((item) => item.slug === suffix);
  if (!suffix) return { language: locale.shortLabel, url, title: locale.meta.title, description: locale.meta.description, text: `${locale.home.statement} ${ui.wealth.statement}` };
  if (chapter) return { language: locale.shortLabel, url, title: `NAVIN / ${chapter.key} — ${chapter.number}`, description: ui.chapterIntro(chapter.domains[localeKey]), text: `${chapter.domains[localeKey]} ${ui.chapterNotice}` };
  if (legalPages.includes(suffix)) { const copy = ui.legal[suffix]; return { language: locale.shortLabel, url, title: copy[0], description: copy[1], text: copy[2] }; }
  const route = locale.routes[suffix]; return { language: locale.shortLabel, url, title: route.title, description: route.description, text: route.lede };
});
searchIndex.push(...products.map((product) => ({
  language: "EN",
  url: `https://${product.slug}.navinresearch.com/`,
  title: `${product.name} — Navin Research`,
  description: product.thesis,
  text: `${product.eyebrow} ${product.intro} ${product.capabilities.join(" ")} ${product.status}`,
})));

searchIndex.push(...markdownPosts.map((post) => ({
  language: "EN",
  url: post.url,
  title: post.title,
  description: post.description,
  text: `${post.answer} ${post.keywords.join(" ")}`,
})));
await writeFile("content-routes/search-index.json", `${JSON.stringify(searchIndex, null, 2)}\n`, "utf8");
await writeFile("sitemap.xml", `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${[...pages, ...markdownPosts].map(({ url }) => `  <url><loc>${site.origin}${url}</loc></url>`).join("\n")}\n</urlset>\n`, "utf8");
console.log(`Generated ${pages.length} localized pages and ${markdownPosts.length} Markdown blog posts.`);
