import { mkdir, rm, writeFile } from "node:fs/promises";

const version = "20260831-v5";

export function escapeHtml(value = "") {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

export function canonicalUrl(product, path = "/") {
  return `https://${product.slug}.navinresearch.com${path}`;
}

export function outputPath(slug, route) {
  if (route === "/") return `${slug}/index.html`;
  if (route === "/404.html") return `${slug}/404.html`;
  return `${slug}${route}index.html`;
}

export function headMarkup({ product, page, path, layout, isHome }) {
  const assetVersion = product.assetVersion || version;
  const description = String(page.description || page.lede || product.thesis);
  const metaDescription = description.length >= 24 ? description : `${description} Public information for ${product.name}.`;
  const canonical = canonicalUrl(product, path);
  const robots = path === "/404.html" ? "noindex,follow" : "index,follow,max-image-preview:large";
  const sandoraNonLeadingPaths = new Set(["/runtime/", "/observability/", "/docs/", "/pricing/", "/releases/"]);
  const sandoraImage = product.slug === "sandora" && page.media?.src && !sandoraNonLeadingPaths.has(path) ? page.media.src : "";
  const sandoraCompactImage = sandoraImage.replace(/\.webp$/, "-960.webp");
  const sandoraImageWidth = sandoraImage.endsWith("hero-atlas.webp") ? 1915 : 1672;
  const sandoraPreloads = product.slug === "sandora" && sandoraImage ? `
  <link rel="preload" as="image" href="${escapeHtml(sandoraImage)}" imagesrcset="${escapeHtml(sandoraCompactImage)} 960w, ${escapeHtml(sandoraImage)} ${sandoraImageWidth}w" imagesizes="(max-width: 960px) calc(100vw - 2rem), 52vw">` : "";
  return `<meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="description" content="${escapeHtml(metaDescription)}">
  <meta name="robots" content="${robots}">
  <meta property="og:type" content="website">
  <meta property="og:site_name" content="${escapeHtml(product.name)}">
  <meta property="og:title" content="${escapeHtml(page.title)}">
  <meta property="og:description" content="${escapeHtml(metaDescription)}">
  <meta property="og:url" content="${canonical}">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="theme-color" content="${escapeHtml(product.themeColor || "#03120d")}">
  <link rel="canonical" href="${canonical}">${sandoraPreloads}
  <link rel="icon" href="/assets/brand/logo_icon_tab.png" type="image/png">
  <link rel="stylesheet" href="/products/product-primitives.css?v=${assetVersion}">
  <link rel="stylesheet" href="/products/themes/${product.slug}.css?v=${assetVersion}">
  <!-- no-JS state is cleared by the external product runtime; this keeps the strict CSP script-src self-only. -->
  <script src="/products/runtime/${product.slug}.js?v=${assetVersion}" defer></script>
  <title>${escapeHtml(page.title)}${isHome ? "" : ` | ${escapeHtml(product.name)}`}</title>`;
}

export async function resetProductOutput(slug) {
  await rm(slug, { recursive: true, force: true });
}

export async function ensureOutputDirectory(output) {
  await mkdir(output.slice(0, output.lastIndexOf("/")), { recursive: true });
}

export async function writeProductManifest(manifest) {
  manifest.sort((a, b) => a.product.localeCompare(b.product) || a.path.localeCompare(b.path));
  await writeFile("products/site-manifest.json", `${JSON.stringify(manifest, null, 2)}\n`, "utf8");
}

export function productSitemap(product, routes) {
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${routes.map((route) => `  <url><loc>${canonicalUrl(product, route)}</loc></url>`).join("\n")}\n</urlset>\n`;
}

export function productRobots(product) {
  return `User-agent: *\nAllow: /\nSitemap: https://${product.slug}.navinresearch.com/sitemap.xml\n`;
}
