import { mkdir, writeFile } from "node:fs/promises";
import { locales, localePath, sections, site } from "../site.config.mjs";

const localeEntries = Object.entries(locales);

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function alternates(section = "") {
  return [
    ...localeEntries.map(([key, locale]) => `    <link rel="alternate" hreflang="${locale.hreflang}" href="${site.origin}${localePath(key, section)}">`),
    `    <link rel="alternate" hreflang="x-default" href="${site.origin}${localePath("en", section)}">`,
  ].join("\n");
}

function languageLinks(activeKey, section = "") {
  return localeEntries
    .map(([key, locale]) => {
      const current = key === activeKey ? ' aria-current="page"' : "";
      return `<a href="${localePath(key, section)}" hreflang="${locale.hreflang}" lang="${locale.htmlLang}"${current}>${locale.shortLabel}</a>`;
    })
    .join('<span aria-hidden="true">/</span>');
}

function homeTemplate(localeKey) {
  const locale = locales[localeKey];
  const canonical = `${site.origin}${localePath(localeKey)}`;
  const home = locale.home;
  const title = home.title.map(escapeHtml).join("<br>");
  return `<!DOCTYPE html>
<html lang="${locale.htmlLang}">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="theme-color" content="#04130e">
    <meta name="description" content="${escapeHtml(locale.meta.description)}">
    <meta property="og:site_name" content="${site.name}">
    <meta property="og:title" content="${escapeHtml(locale.meta.title)}">
    <meta property="og:description" content="${escapeHtml(locale.meta.ogDescription)}">
    <meta property="og:locale" content="${locale.ogLocale}">
${localeEntries.filter(([key]) => key !== localeKey).map(([, item]) => `    <meta property="og:locale:alternate" content="${item.ogLocale}">`).join("\n")}
    <meta property="og:type" content="website">
    <meta property="og:url" content="${canonical}">
    <meta property="og:image" content="${site.origin}/assets/field-4.webp">
    <meta property="og:image:type" content="image/webp">
    <meta property="og:image:width" content="1600">
    <meta property="og:image:height" content="900">
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:image" content="${site.origin}/assets/field-4.webp">
    <title>${escapeHtml(locale.meta.title)}</title>
    <link rel="canonical" href="${canonical}">
${alternates()}
    <link rel="icon" href="/assets/brand/logo_icon_tab.png" type="image/png">
    <link rel="preload" href="/assets/field-1.webp" as="image" fetchpriority="high">
    <link rel="stylesheet" href="/styles.css">
    <script src="/script.js" defer></script>
  </head>
  <body>
    <div class="field" aria-hidden="true">
      <div class="field__layer field__layer--1"></div>
      <div class="field__layer field__layer--2"></div>
      <div class="field__layer field__layer--3"></div>
      <div class="field__layer field__layer--4"></div>
      <div class="field__layer field__layer--5"></div>
      <div class="field__wash"></div>
      <div class="field__grain"></div>
    </div>
    <div class="shell">
      <header class="masthead">
        <a class="brand" href="${localePath(localeKey)}" aria-label="Navin Research home">
          <img class="brand__logo" src="/assets/brand/logo.webp" alt="" width="80" height="80">
        </a>
        <div class="masthead__meta">
          <span class="signal">${escapeHtml(home.status)}</span>
          <nav class="language" aria-label="${escapeHtml(locale.common.languageAria)}">
            ${languageLinks(localeKey)}
          </nav>
        </div>
      </header>
      <main class="hero">
        <div class="hero__index" aria-hidden="true">NR — 01</div>
        <div class="hero__content">
          <p class="eyebrow">${escapeHtml(home.eyebrow)}</p>
          <h1>${title}</h1>
          <p class="statement">${escapeHtml(home.statement)}</p>
        </div>
        <aside class="contact" aria-label="${escapeHtml(home.contactAria)}">
          <p>${escapeHtml(home.contactLabel)}</p>
          <h2>${escapeHtml(home.contactTitle)}</h2>
          <nav class="contact__links" aria-label="${escapeHtml(home.contactLinksAria)}">
            <a href="mailto:${site.email}"><span>Email</span><span aria-hidden="true">↗</span></a>
            <a href="${site.linkedin}" target="_blank" rel="noopener noreferrer"><span>LinkedIn</span><span aria-hidden="true">↗</span></a>
            <a href="${site.github}" target="_blank" rel="noopener noreferrer"><span>GitHub</span><span aria-hidden="true">↗</span></a>
          </nav>
        </aside>
      </main>
      <footer class="footer">
        <p>© <span data-current-year>2026</span> NAVIN RESEARCH</p>
        <p>${escapeHtml(home.footer)}</p>
      </footer>
    </div>
  </body>
</html>
`;
}

function routeTemplate(localeKey, section) {
  const locale = locales[localeKey];
  const route = locale.routes[section];
  const canonical = `${site.origin}${localePath(localeKey, section)}`;
  const nav = sections
    .map((item) => `<a href="${localePath(localeKey, item)}"${item === section ? ' aria-current="page"' : ""}>${escapeHtml(locale.routes[item].title)}</a>`)
    .join("\n          ");
  const search = section === "search" ? `
        <section class="route-search" aria-labelledby="search-label">
          <label id="search-label" for="route-search">${escapeHtml(locale.common.searchLabel)}</label>
          <input id="route-search" type="search" data-route-search placeholder="${escapeHtml(locale.common.searchPlaceholder)}" autocomplete="off">
          <div class="route-search__results" data-search-results data-empty-label="${escapeHtml(locale.common.noResults)}" aria-live="polite"></div>
        </section>` : "";
  return `<!DOCTYPE html>
<html lang="${locale.htmlLang}">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="description" content="${escapeHtml(route.description)}">
    <meta name="robots" content="index, follow">
    <meta property="og:site_name" content="${site.name}">
    <meta property="og:title" content="${escapeHtml(route.title)} — ${site.name}">
    <meta property="og:description" content="${escapeHtml(route.description)}">
    <meta property="og:type" content="website">
    <meta property="og:url" content="${canonical}">
    <meta property="og:locale" content="${locale.ogLocale}">
    <title>${escapeHtml(route.title)} — ${site.name}</title>
    <link rel="canonical" href="${canonical}">
${alternates(section)}
    <link rel="icon" href="/assets/brand/logo_icon_tab.png" type="image/png">
    <link rel="stylesheet" href="/content-routes/route-foundation.css">
${section === "search" ? '    <script src="/content-routes/route-search.js" defer></script>\n' : ""}
  </head>
  <body class="route-page">
    <div class="route-page__shell">
      <header class="route-page__header">
        <a class="route-page__brand" href="${localePath(localeKey)}" aria-label="Navin Research home"><img src="/assets/brand/logo.webp" alt="" width="64" height="64"><span>NAVIN RESEARCH</span></a>
        <nav class="route-page__nav" aria-label="${escapeHtml(locale.common.navAria)}">
          ${nav}
        </nav>
        <nav class="route-page__languages" aria-label="${escapeHtml(locale.common.languageAria)}">${languageLinks(localeKey, section)}</nav>
      </header>
      <main class="route-page__main">
        <p class="route-page__eyebrow">${escapeHtml(route.title)}</p>
        <h1>${escapeHtml(route.title)}</h1>
        <p class="route-page__lede">${escapeHtml(route.lede)}</p>
        <div class="route-page__notice"><strong>${escapeHtml(locale.common.preparation)}</strong><span>${escapeHtml(route.description)}</span></div>${search}
      </main>
      <footer class="route-page__footer"><p>${escapeHtml(locale.common.footer)}</p><p><a href="${localePath(localeKey)}">Navin Research</a></p></footer>
    </div>
  </body>
</html>
`;
}

const written = [];
for (const [localeKey, locale] of localeEntries) {
  const homeDirectory = locale.prefix || ".";
  await mkdir(homeDirectory, { recursive: true });
  const homeFile = locale.prefix ? `${locale.prefix}/index.html` : "index.html";
  await writeFile(homeFile, homeTemplate(localeKey), "utf8");
  written.push(homeFile);

  for (const section of sections) {
    const directory = [locale.prefix, section].filter(Boolean).join("/");
    await mkdir(directory, { recursive: true });
    const file = `${directory}/index.html`;
    await writeFile(file, routeTemplate(localeKey, section), "utf8");
    written.push(file);
  }
}

const searchIndex = localeEntries.flatMap(([localeKey, locale]) => [
  {
    language: locale.shortLabel,
    url: localePath(localeKey),
    title: locale.meta.title,
    description: locale.meta.description,
    text: `${locale.home.statement} ${locale.home.contactTitle}`,
  },
  ...sections.map((section) => ({
    language: locale.shortLabel,
    url: localePath(localeKey, section),
    title: locale.routes[section].title,
    description: locale.routes[section].description,
    text: locale.routes[section].lede,
  })),
]);
await writeFile("content-routes/search-index.json", `${JSON.stringify(searchIndex, null, 2)}\n`, "utf8");
written.push("content-routes/search-index.json");

const sitemapUrls = localeEntries.flatMap(([localeKey]) => [localePath(localeKey), ...sections.map((section) => localePath(localeKey, section))]);
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${sitemapUrls.map((path) => `  <url><loc>${site.origin}${path}</loc></url>`).join("\n")}\n</urlset>\n`;
await writeFile("sitemap.xml", sitemap, "utf8");
written.push("sitemap.xml");
console.log(`Generated ${written.length} files.`);
