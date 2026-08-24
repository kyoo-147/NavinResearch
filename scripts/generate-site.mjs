import { mkdir, writeFile } from "node:fs/promises";
import { chapters, experience, legalPages, locales, localePath, sections, site } from "../site.config.mjs";

const localeEntries = Object.entries(locales);
const homeAssetRevision = "20260824-07";
const escapeHtml = (value) => String(value).replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;");

function alternates(suffix = "") {
  return [...localeEntries.map(([key, locale]) => `    <link rel="alternate" hreflang="${locale.hreflang}" href="${site.origin}${localePath(key, suffix)}">`), `    <link rel="alternate" hreflang="x-default" href="${site.origin}${localePath("en", suffix)}">`].join("\n");
}

function languageLinks(activeKey, suffix = "") {
  return localeEntries.map(([key, locale]) => `<a href="${localePath(key, suffix)}" hreflang="${locale.hreflang}" lang="${locale.htmlLang}"${key === activeKey ? ' aria-current="page"' : ""}>${locale.shortLabel}</a>`).join('<span aria-hidden="true">/</span>');
}

function head(localeKey, title, description, suffix = "", css = "/content-routes/route-foundation.css", script = "") {
  const locale = locales[localeKey];
  const canonical = `${site.origin}${localePath(localeKey, suffix)}`;
  return `    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="theme-color" content="#04130e">
    <meta name="description" content="${escapeHtml(description)}">
    <meta name="robots" content="index, follow">
    <meta property="og:site_name" content="${site.name}">
    <meta property="og:title" content="${escapeHtml(title)}">
    <meta property="og:description" content="${escapeHtml(description)}">
    <meta property="og:type" content="website">
    <meta property="og:url" content="${canonical}">
    <meta property="og:locale" content="${locale.ogLocale}">
    <meta property="og:image" content="${site.origin}/assets/field-4.webp">
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:image" content="${site.origin}/assets/field-4.webp">
    <title>${escapeHtml(title)}</title>
    <link rel="canonical" href="${canonical}">
${alternates(suffix)}
    <link rel="icon" href="/assets/brand/logo_icon_tab.png" type="image/png">
    <link rel="stylesheet" href="${css}">
${script ? `    <script src="${script}" defer></script>\n` : ""}`;
}

function chapterLinks(localeKey) {
  return chapters.map((chapter) => `<a href="${localePath(localeKey, chapter.slug)}"><span class="chapter-link__number">${chapter.number}</span><span><small>NAVIN</small><strong>${chapter.key}</strong><em>${escapeHtml(chapter.domains[localeKey])}</em></span><span aria-hidden="true">↗</span></a>`).join("\n              ");
}

function drawer(localeKey) {
  const locale = locales[localeKey];
  const ui = experience[localeKey];
  return `<div class="menu-backdrop" data-menu-backdrop hidden></div>
      <aside class="site-menu" id="site-menu" aria-label="${escapeHtml(locale.common.navAria)}" aria-hidden="true" inert>
        <div class="site-menu__primary">
          <button class="menu-close" type="button" data-menu-close aria-label="${escapeHtml(ui.menu.close)}"><span aria-hidden="true">×</span></button>
          <nav aria-label="${escapeHtml(locale.common.navAria)}">
            <a href="${localePath(localeKey)}">${escapeHtml(ui.menu.home)}</a>
            <button type="button" data-chapters-toggle aria-expanded="false" aria-controls="chapter-panel">${escapeHtml(ui.menu.chapters)}<span aria-hidden="true">→</span></button>
            <a href="${localePath(localeKey, "research")}">${escapeHtml(ui.menu.work)}</a>
            <a href="${localePath(localeKey, "blog")}">${escapeHtml(ui.menu.notes)}</a>
            <a href="${localePath(localeKey)}#wealth-of-nature">${escapeHtml(ui.menu.philosophy)}</a>
            <a href="mailto:${site.email}">${escapeHtml(ui.menu.contact)}</a>
          </nav>
        </div>
        <div class="chapter-panel" id="chapter-panel" aria-hidden="true" inert>
          <button class="chapter-back" type="button" data-chapter-back><span aria-hidden="true">←</span>${escapeHtml(ui.menu.back)}</button>
          <p>${escapeHtml(ui.menu.chapters)}</p>
          <nav aria-label="${escapeHtml(ui.menu.chapters)}">
              ${chapterLinks(localeKey)}
          </nav>
        </div>
      </aside>`;
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
      <header class="masthead">
        <div class="masthead__brand-group">
          <button class="menu-toggle" type="button" data-menu-open aria-expanded="false" aria-controls="site-menu" aria-label="${escapeHtml(ui.menu.open)}"><span></span><span></span><span></span></button>
          <a class="brand brand--wordmark" href="${localePath(localeKey)}" aria-label="Navin Research home"><span class="brand__name">NAVIN<br>RESEARCH</span></a>
        </div>
        <div class="masthead__meta"><span class="signal">${escapeHtml(home.status)}</span><nav class="language" aria-label="${escapeHtml(locale.common.languageAria)}">${languageLinks(localeKey)}</nav></div>
      </header>
      ${drawer(localeKey)}
      <main>
        <section class="hero">
          <div class="hero__index" aria-hidden="true">NR — 00</div>
          <div class="hero__content"><p class="eyebrow">${escapeHtml(ui.chapterEyebrow)}</p><h1>${title}</h1><p class="statement">${escapeHtml(home.statement)}</p></div>
          <aside class="contact" aria-label="${escapeHtml(home.contactAria)}"><p>${escapeHtml(home.contactLabel)}</p><h2>${escapeHtml(home.contactTitle)}</h2><nav class="contact__links" aria-label="${escapeHtml(home.contactLinksAria)}"><a href="mailto:${site.email}"><span>Email</span><span aria-hidden="true">↗</span></a><a href="${site.linkedin}" target="_blank" rel="noopener noreferrer"><span>LinkedIn</span><span aria-hidden="true">↗</span></a><a href="${site.github}" target="_blank" rel="noopener noreferrer"><span>GitHub</span><span aria-hidden="true">↗</span></a></nav></aside>
        </section>
        <section class="wealth" id="wealth-of-nature" aria-labelledby="wealth-title">
          <div class="wealth__mark" aria-hidden="true"><span></span></div>
          <p class="wealth__label">${escapeHtml(ui.wealth.label)}</p>
          <h2 id="wealth-title">${escapeHtml(ui.wealth.title)}</h2>
          <span class="wealth__rule" aria-hidden="true"></span>
          <p class="wealth__statement">${escapeHtml(ui.wealth.statement)}</p>
        </section>
      </main>
      <footer class="footer"><p>© <span data-current-year>2026</span> NAVIN RESEARCH</p><nav aria-label="Legal"><a href="${localePath(localeKey, "privacy-policy")}">${escapeHtml(ui.privacy)}</a><span aria-hidden="true">/</span><a href="${localePath(localeKey, "terms-of-use")}">${escapeHtml(ui.terms)}</a></nav></footer>
    </div>
  </body>
</html>
`;
}

function routeNav(localeKey, current) {
  const locale = locales[localeKey];
  return sections.map((section) => `<a href="${localePath(localeKey, section)}"${section === current ? ' aria-current="page"' : ""}>${escapeHtml(locale.routes[section].title)}</a>`).join("\n          ");
}

function routeTemplate(localeKey, section) {
  const locale = locales[localeKey];
  const route = locale.routes[section];
  const search = section === "search" ? `<section class="route-search" aria-labelledby="search-label"><label id="search-label" for="route-search">${escapeHtml(locale.common.searchLabel)}</label><input id="route-search" type="search" data-route-search placeholder="${escapeHtml(locale.common.searchPlaceholder)}" autocomplete="off"><div class="route-search__results" data-search-results data-empty-label="${escapeHtml(locale.common.noResults)}" aria-live="polite"></div></section>` : "";
  return `<!DOCTYPE html><html lang="${locale.htmlLang}"><head>\n${head(localeKey, `${route.title} — ${site.name}`, route.description, section, "/content-routes/route-foundation.css", section === "search" ? "/content-routes/route-search.js" : "")}  </head><body class="route-page"><div class="route-page__shell"><header class="route-page__header"><a class="route-page__brand" href="${localePath(localeKey)}"><img src="/assets/brand/logo.webp" alt="" width="64" height="64"><span>NAVIN RESEARCH</span></a><nav class="route-page__nav" aria-label="${escapeHtml(locale.common.navAria)}">${routeNav(localeKey, section)}</nav><nav class="route-page__languages" aria-label="${escapeHtml(locale.common.languageAria)}">${languageLinks(localeKey, section)}</nav></header><main class="route-page__main"><p class="route-page__eyebrow">${escapeHtml(route.title)}</p><h1>${escapeHtml(route.title)}</h1><p class="route-page__lede">${escapeHtml(route.lede)}</p><div class="route-page__notice"><strong>${escapeHtml(locale.common.preparation)}</strong><span>${escapeHtml(route.description)}</span></div>${search}</main><footer class="route-page__footer"><p>${escapeHtml(locale.common.footer)}</p><p><a href="${localePath(localeKey)}">Navin Research</a></p></footer></div></body></html>\n`;
}

function chapterTemplate(localeKey, chapter) {
  const locale = locales[localeKey];
  const ui = experience[localeKey];
  const domain = chapter.domains[localeKey];
  const title = `NAVIN / ${chapter.key} — ${chapter.number}`;
  const intro = ui.chapterIntro(domain);
  const nav = chapters.map((item) => `<a href="${localePath(localeKey, item.slug)}"${item.slug === chapter.slug ? ' aria-current="page"' : ""}><span>${item.number}</span><strong>${item.key}</strong></a>`).join("");
  return `<!DOCTYPE html><html lang="${locale.htmlLang}"><head>\n${head(localeKey, title, `${intro} ${ui.chapterNotice}`, chapter.slug, "/content-routes/route-foundation.css")}  </head><body class="route-page chapter-page chapter-${chapter.slug}"><div class="chapter-field" aria-hidden="true"></div><div class="route-page__shell"><header class="route-page__header"><a class="route-page__brand" href="${localePath(localeKey)}"><img src="/assets/brand/logo.webp" alt="" width="64" height="64"><span>NAVIN RESEARCH</span></a><a class="all-chapters" href="${localePath(localeKey)}#wealth-of-nature">← ${escapeHtml(ui.menu.chapters)}</a><nav class="route-page__languages" aria-label="${escapeHtml(locale.common.languageAria)}">${languageLinks(localeKey, chapter.slug)}</nav></header><main class="chapter-main"><div><p class="route-page__eyebrow">CHAPTER ${chapter.number}</p><h1>NAVIN / ${chapter.key}<span> — ${chapter.number}</span></h1><p class="chapter-domain">${escapeHtml(domain)}</p><span class="chapter-rule" aria-hidden="true"></span><h2>${escapeHtml(domain)}</h2><p class="route-page__lede">${escapeHtml(intro)}</p><div class="route-page__notice"><strong>${escapeHtml(locale.common.preparation)}</strong><span>${escapeHtml(ui.chapterNotice)}</span></div></div><aside class="chapter-facts"><p><small>${escapeHtml(ui.menu.chapters)}</small><strong>${chapter.number} / 05</strong></p><p><small>Research program</small><strong>NAVIN / ${chapter.key}</strong></p><p><small>Core dimension</small><strong>${escapeHtml(domain)}</strong></p><p><small>Status</small><strong>${escapeHtml(locale.common.preparation)}</strong></p><nav class="chapter-nav" aria-label="${escapeHtml(ui.menu.chapters)}">${nav}</nav></aside></main><footer class="route-page__footer"><p>© <span data-current-year>2026</span> NAVIN RESEARCH</p><p><a href="${localePath(localeKey, "privacy-policy")}">${escapeHtml(ui.privacy)}</a> / <a href="${localePath(localeKey, "terms-of-use")}">${escapeHtml(ui.terms)}</a></p></footer></div></body></html>\n`;
}

function legalTemplate(localeKey, slug) {
  const locale = locales[localeKey];
  const ui = experience[localeKey];
  const [title, first, second] = ui.legal[slug];
  return `<!DOCTYPE html><html lang="${locale.htmlLang}"><head>\n${head(localeKey, `${title} — ${site.name}`, first, slug)}  </head><body class="route-page"><div class="route-page__shell"><header class="route-page__header"><a class="route-page__brand" href="${localePath(localeKey)}"><img src="/assets/brand/logo.webp" alt="" width="64" height="64"><span>NAVIN RESEARCH</span></a><nav class="route-page__languages" aria-label="${escapeHtml(locale.common.languageAria)}">${languageLinks(localeKey, slug)}</nav></header><main class="route-page__main legal-page"><p class="route-page__eyebrow">Navin Research</p><h1>${escapeHtml(title)}</h1><p class="route-page__lede">${escapeHtml(first)}</p><div class="route-page__notice"><span>${escapeHtml(second)}</span></div></main><footer class="route-page__footer"><p>© <span data-current-year>2026</span> NAVIN RESEARCH</p><a href="${localePath(localeKey)}">Navin Research</a></footer></div></body></html>\n`;
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
  for (const section of sections) await emit(localeKey, section, routeTemplate(localeKey, section));
  for (const chapter of chapters) await emit(localeKey, chapter.slug, chapterTemplate(localeKey, chapter));
  for (const legalPage of legalPages) await emit(localeKey, legalPage, legalTemplate(localeKey, legalPage));
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
await writeFile("content-routes/search-index.json", `${JSON.stringify(searchIndex, null, 2)}\n`, "utf8");
await writeFile("sitemap.xml", `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${pages.map(({ url }) => `  <url><loc>${site.origin}${url}</loc></url>`).join("\n")}\n</urlset>\n`, "utf8");
console.log(`Generated ${pages.length} localized pages.`);
