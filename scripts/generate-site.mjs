import { mkdir, writeFile } from "node:fs/promises";
import { chapters, experience, legalPages, locales, localePath, releaseRoute, sections, site } from "../site.config.mjs";
import { pageHead } from "./components/page-head.mjs";
import { contentHeader, escapeHtml, routeFooter, siteDrawer, siteFooter, siteHeader } from "./components/site-shell.mjs";
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
  return sections.map((section) => `<a href="${localePath(localeKey, section)}"${section === current ? ' aria-current="page"' : ""}>${escapeHtml(locale.routes[section].title)}</a>`).join("\n          ");
}

function routeTemplate(localeKey, section) {
  const locale = locales[localeKey];
  const route = locale.routes[section];
  const ui = experience[localeKey];
  const routeNumber = String(sections.indexOf(section) + 1).padStart(2, "0");
  const search = section === "search" ? `<section class="route-search" aria-labelledby="search-label"><label id="search-label" for="route-search">${escapeHtml(locale.common.searchLabel)}</label><input id="route-search" type="search" data-route-search placeholder="${escapeHtml(locale.common.searchPlaceholder)}" autocomplete="off"><div class="route-search__results" data-search-results data-empty-label="${escapeHtml(locale.common.noResults)}" aria-live="polite"></div></section>` : "";
  return `<!DOCTYPE html><html lang="${locale.htmlLang}"><head>
${head(localeKey, `${route.title} — ${site.name}`, route.description, section, "/content-routes/route-foundation.css", section === "search" ? "/content-routes/route-search.js" : "")}  </head><body class="route-page content-page content-${section}"><div class="content-field" aria-hidden="true"></div><div class="route-page__shell">
    ${contentHeader(localeKey, section)}
    <main class="route-page__main content-main"><div class="content-copy"><p class="route-page__eyebrow">SECTION ${routeNumber} / ${escapeHtml(route.title)}</p><h1>${escapeHtml(route.title)}</h1><p class="route-page__lede">${escapeHtml(route.lede)}</p><div class="route-page__notice"><strong>${escapeHtml(locale.common.preparation)}</strong><span>${escapeHtml(route.description)}</span></div>${search}</div><aside class="content-index" aria-label="${escapeHtml(ui.menu.explore)}"><p>${escapeHtml(ui.menu.explore)}</p><nav aria-label="${escapeHtml(ui.menu.explore)}">${routeNav(localeKey, section)}</nav></aside></main>
    ${routeFooter(localeKey)}
  </div></body></html>
`;
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

function releaseTemplate(localeKey) {
  const locale = locales[localeKey];
  const ui = experience[localeKey];
  const rows = ["01", "02", "03"].map((number) => `<tr data-release-row><td>${number}</td><th scope="row">${escapeHtml(ui.releases.preparing)} ${number}</th><td>—</td><td>${escapeHtml(ui.releases.details)}</td><td>—</td><td>—</td><td>—</td></tr>`).join("\n                ");
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
  for (const section of sections) await emit(localeKey, section, routeTemplate(localeKey, section));
  await emit(localeKey, releaseRoute, releaseTemplate(localeKey));
  for (const chapter of chapters) await emit(localeKey, chapter.slug, chapterTemplate(localeKey, chapter));
  for (const legalPage of legalPages) await emit(localeKey, legalPage, legalTemplate(localeKey, legalPage));
}

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
