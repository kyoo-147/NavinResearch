import { locales, localePath, site } from "../../site.config.mjs";
import { escapeHtml } from "./site-shell.mjs";

function alternateLinks(suffix = "") {
  const links = Object.entries(locales).map(([key, locale]) => `    <link rel="alternate" hreflang="${locale.hreflang}" href="${site.origin}${localePath(key, suffix)}">`);
  links.push(`    <link rel="alternate" hreflang="x-default" href="${site.origin}${localePath("en", suffix)}">`);
  return links.join("\n");
}

export function pageHead({ localeKey, title, description, suffix = "", styles = ["/content-routes/route-foundation.css"], scripts = [], revision, image = "/assets/field-4.webp" }) {
  const locale = locales[localeKey];
  const canonical = `${site.origin}${localePath(localeKey, suffix)}`;
  const socialImage = image.startsWith("http") ? image : `${site.origin}${image}`;
  const versionedStyles = styles.map((href) => href.includes("?") ? href : `${href}?v=${revision}`);
  const versionedScripts = ["/content-routes/theme.js", ...scripts].filter(Boolean).filter((src, index, list) => list.indexOf(src) === index).map((src) => src.includes("?") ? src : `${src}?v=${revision}`);
  const themeBootstrap = `    <script src="/content-routes/theme-bootstrap.js?v=${revision}"></script>`;
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
    <meta property="og:image" content="${socialImage}">
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:image" content="${socialImage}">
    <title>${escapeHtml(title)}</title>
    <link rel="canonical" href="${canonical}">
${alternateLinks(suffix)}
    <link rel="icon" href="/assets/brand/logo_icon_tab.png" type="image/png">
${themeBootstrap}
${versionedStyles.map((href) => `    <link rel="stylesheet" href="${href}">`).join("\n")}
${versionedScripts.map((src) => `    <script src="${src}" defer></script>`).join("\n")}${versionedScripts.length ? "\n" : ""}`;
}
