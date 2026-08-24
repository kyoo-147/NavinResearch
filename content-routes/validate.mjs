import { access, readFile } from "node:fs/promises";
import { locales, localePath, sections, site } from "../site.config.mjs";

const errors = [];
const generatedRoutes = [];

for (const [localeKey, locale] of Object.entries(locales)) {
  generatedRoutes.push({ localeKey, section: "", path: localePath(localeKey), file: locale.prefix ? `${locale.prefix}/index.html` : "index.html" });
  for (const section of sections) {
    generatedRoutes.push({ localeKey, section, path: localePath(localeKey, section), file: `${[locale.prefix, section].filter(Boolean).join("/")}/index.html` });
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
  if (html.includes('/favicon.svg')) errors.push(`${route.file}: deleted favicon referenced`);
  if (html.includes('datePublished') || html.includes('application/ld+json')) errors.push(`${route.file}: unsupported schema/date marker found`);
  if (route.section && !html.includes(locale.common.preparation)) errors.push(`${route.file}: truthful preparation notice missing`);
}

for (const file of [
  "styles.css",
  "script.js",
  "content-routes/route-foundation.css",
  "content-routes/route-search.js",
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
