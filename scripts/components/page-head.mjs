import { locales, localePath, site } from "../../site.config.mjs";
import { escapeHtml } from "./site-shell.mjs";

function alternateLinks(suffix = "") {
  const links = Object.entries(locales).map(([key, locale]) => `    <link rel="alternate" hreflang="${locale.hreflang}" href="${site.origin}${localePath(key, suffix)}">`);
  links.push(`    <link rel="alternate" hreflang="x-default" href="${site.origin}${localePath("en", suffix)}">`);
  return links.join("\n");
}

export function pageHead({ localeKey, title, description, suffix = "", styles = ["/content-routes/route-foundation.css"], scripts = [], revision }) {
  const locale = locales[localeKey];
  const canonical = `${site.origin}${localePath(localeKey, suffix)}`;
  const versionedStyles = styles.map((href) => href.includes("?") ? href : `${href}?v=${revision}`);
  const versionedScripts = scripts.filter(Boolean).map((src) => src.includes("?") ? src : `${src}?v=${revision}`);
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
${alternateLinks(suffix)}
    <link rel="icon" href="/assets/brand/logo_icon_tab.png" type="image/png">
${versionedStyles.map((href) => `    <link rel="stylesheet" href="${href}">`).join("\n")}
${versionedScripts.map((src) => `    <script src="${src}" defer></script>`).join("\n")}${versionedScripts.length ? "\n" : ""}`;
}
