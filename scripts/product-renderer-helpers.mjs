import { mkdir, rm, writeFile } from "node:fs/promises";

const version = "20260830-4";

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
  const description = String(page.description || page.lede || product.thesis);
  const metaDescription = description.length >= 24 ? description : `${description} Public information for ${product.name}.`;
  const canonical = canonicalUrl(product, path);
  const robots = path === "/404.html" ? "noindex,follow" : "index,follow,max-image-preview:large";
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
  <meta name="theme-color" content="#03120d">
  <link rel="canonical" href="${canonical}">
  <link rel="icon" href="/assets/brand/logo_icon_tab.png" type="image/png">
  <link rel="stylesheet" href="/products/product-primitives.css?v=${version}">
  <link rel="stylesheet" href="/products/themes/${product.slug}.css?v=${version}">
  <script>document.documentElement.classList.remove('no-js')</script>
  <script src="/products/runtime/${product.slug}.js?v=${version}" defer></script>
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
