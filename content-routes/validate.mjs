import { access, readFile } from "node:fs/promises";
import { chapters, experience, legalPages, locales, localePath, sections, site } from "../site.config.mjs";

const errors = [];
const generatedRoutes = [];
const routeCss = (await readFile("content-routes/route-foundation.css", "utf8")).replaceAll("\r\n", "\n");

for (const [localeKey, locale] of Object.entries(locales)) {
  generatedRoutes.push({ localeKey, section: "", path: localePath(localeKey), file: locale.prefix ? `${locale.prefix}/index.html` : "index.html" });
  for (const section of sections) {
    generatedRoutes.push({ localeKey, section, path: localePath(localeKey, section), file: `${[locale.prefix, section].filter(Boolean).join("/")}/index.html` });
  }
  for (const chapter of chapters) {
    generatedRoutes.push({ localeKey, section: chapter.slug, type: "chapter", path: localePath(localeKey, chapter.slug), file: `${[locale.prefix, chapter.slug].filter(Boolean).join("/")}/index.html` });
  }
  for (const legalPage of legalPages) {
    generatedRoutes.push({ localeKey, section: legalPage, type: "legal", path: localePath(localeKey, legalPage), file: `${[locale.prefix, legalPage].filter(Boolean).join("/")}/index.html` });
  }
}

for (const route of generatedRoutes) {
  const html = await readFile(route.file, "utf8");
  const locale = locales[route.localeKey];
  const canonical = `${site.origin}${route.path}`;
  if (!html.includes(`<html lang="${locale.htmlLang}">`)) errors.push(`${route.file}: html lang missing`);
  if (!html.includes(`<link rel="canonical" href="${canonical}">`)) errors.push(`${route.file}: canonical missing`);
  for (const requiredLanguage of ["en", "vi", "zh-CN", "x-default"]) {
    if (!html.includes(`hreflang="${requiredLanguage}"`)) errors.push(`${route.file}: hreflang ${requiredLanguage} missing`);
  }
  for (const marker of ["<title>", 'name="description"', "<main"]) {
    if (!html.includes(marker)) errors.push(`${route.file}: ${marker} missing`);
  }
  if (!html.includes('/assets/brand/logo_icon_tab.png')) errors.push(`${route.file}: current favicon missing`);
  if (sections.includes(route.section)) {
    for (const routeComponent of ['class="route-page__header content-header"', 'class="route-page__footer content-footer"', 'class="content-field"']) {
      if (!html.includes(routeComponent)) errors.push(`${route.file}: content-route component ${routeComponent} missing`);
    }
    if (!html.includes('/content-routes/route-foundation.css?v=')) errors.push(`${route.file}: route stylesheet missing`);
    if (!html.includes(`content-${route.section}`)) errors.push(`${route.file}: route background class missing`);
    if (!routeCss.includes(`.content-${route.section} .content-field { background-image:`)) errors.push(`${route.file}: route background image mapping missing`);
  } else {
    for (const sharedComponent of ['class="masthead site-header"', 'class="footer site-footer', 'id="site-menu"']) {
      if (!html.includes(sharedComponent)) errors.push(`${route.file}: shared component ${sharedComponent} missing`);
    }
    if (!html.includes('/styles.css?v=')) errors.push(`${route.file}: shared shell stylesheet missing`);
    if (!html.includes('/script.js?v=')) errors.push(`${route.file}: shared shell script missing`);
  }
  if (html.includes('/favicon.svg')) errors.push(`${route.file}: deleted favicon referenced`);
  if (html.includes('datePublished') || html.includes('application/ld+json')) errors.push(`${route.file}: unsupported schema/date marker found`);
  if (route.section && route.type !== "legal" && !html.includes(locale.common.preparation)) errors.push(`${route.file}: truthful preparation notice missing`);
  if (route.type === "chapter") {
    if (!html.includes(`chapter-${route.section}`) || !html.includes('class="chapter-field"')) errors.push(`${route.file}: chapter background structure missing`);
    if (!routeCss.includes(`.chapter-${route.section} .chapter-field { background-image:`)) errors.push(`${route.file}: chapter background image mapping missing`);
    for (const label of Object.values(experience[route.localeKey].chapterLabels)) {
      if (!html.includes(label)) errors.push(`${route.file}: localized chapter label ${label} missing`);
    }
  }
}

if (!routeCss.includes(".chapter-field { position: fixed; z-index: 0;") || !routeCss.includes(".content-field {\n  position: fixed;\n  z-index: 0;")) {
  errors.push("route stylesheet: background fields must remain above the opaque page background");
}

for (const file of [
  "styles.css",
  "script.js",
  "google00bfffcce9844575.html",
  "content-routes/route-foundation.css",
  "content-routes/route-search.js",
  "scripts/components/page-head.mjs",
  "scripts/components/site-shell.mjs",
  "assets/brand/logo.webp",
  "assets/brand/logo_icon_tab.png",
]) {
  try {
    await access(file);
  } catch {
    errors.push(`${file}: required asset missing`);
  }
}

const robots = await readFile("robots.txt", "utf8");
const sitemap = await readFile("sitemap.xml", "utf8");
const searchIndex = JSON.parse(await readFile("content-routes/search-index.json", "utf8"));
if (!Array.isArray(searchIndex) || searchIndex.length !== generatedRoutes.length) errors.push("search index: route count mismatch");
if (!robots.includes(`Sitemap: ${site.origin}/sitemap.xml`)) errors.push("robots.txt: sitemap missing");
if (!robots.includes("Disallow: /visitor-insights/")) errors.push("robots.txt: private insights exclusion missing");
for (const route of generatedRoutes) {
  if (!sitemap.includes(`${site.origin}${route.path}`)) errors.push(`sitemap.xml: ${route.path} missing`);
}

if (errors.length) {
  console.error(errors.join("\n"));
  process.exit(1);
}
console.log(`Validated ${generatedRoutes.length} generated localized pages, assets, robots policy, and sitemap URLs.`);
