import { access, readFile, readdir } from "node:fs/promises";
import { chapters, experience, legalPages, locales, localePath, releaseRoute, sections, site } from "../site.config.mjs";
import { products } from "../scripts/product-data.mjs";
import { blogPostPath, blogPosts, blogSources, renderBlogPost } from "../scripts/blog-posts.mjs";

const errors = [];
const generatedRoutes = [];
const routeCss = (await readFile("content-routes/route-foundation.css", "utf8")).replaceAll("\r\n", "\n");
const deploymentNginx = await readFile("deployment-example/nginx.conf", "utf8");

for (const [localeKey, locale] of Object.entries(locales)) {
  generatedRoutes.push({ localeKey, section: "", path: localePath(localeKey), file: locale.prefix ? `${locale.prefix}/index.html` : "index.html" });
  generatedRoutes.push({ localeKey, section: releaseRoute, type: "release", path: localePath(localeKey, releaseRoute), file: `${[locale.prefix, releaseRoute].filter(Boolean).join("/")}/index.html` });
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

if (blogPosts.length !== 50) errors.push(`blog library: expected 50 posts, found ${blogPosts.length}`);
const expectedCategories = new Set(["agents", "reasoning", "models", "multimodal", "inference", "safety-evaluation"]);
const allowedSourceHosts = new Set(["openai.com", "platform.openai.com", "www.anthropic.com", "docs.anthropic.com", "modelcontextprotocol.io", "a2a-protocol.org", "ai.google.dev", "api-docs.deepseek.com", "www.deepseek.com", "github.com", "qwen.readthedocs.io", "www.llama.com", "docs.mistral.ai", "nvidia.github.io", "docs.nvidia.com"]);
const diskBlogFiles = (await readdir("blog", { recursive: true })).filter((file) => file.endsWith(".md")).map((file) => `blog/${file.replaceAll("\\", "/")}`);
if (diskBlogFiles.length !== blogPosts.length) errors.push(`blog library: expected ${blogPosts.length} generated Markdown files, found ${diskBlogFiles.length}`);
const blogPaths = new Set();
for (const post of blogPosts) {
  const url = blogPostPath(post);
  const file = url.slice(1);
  if (!expectedCategories.has(post.category)) errors.push(`${url}: unsupported category`);
  if (!/^\/blog\/[a-z0-9-]+\/[a-z0-9-]+\.md$/.test(url)) errors.push(`${url}: invalid public Markdown URL`);
  if (blogPaths.has(url)) errors.push(`${url}: duplicate Markdown URL`);
  blogPaths.add(url);
  const markdown = await readFile(file, "utf8");
  if (markdown !== renderBlogPost(post)) errors.push(`${file}: generated Markdown is stale`);
  for (const marker of ["---\n", `# ${post.title}`, "## Implementation steps", "## Validation checklist", "## Common mistakes", "## Official sources", `canonical: ${site.origin}${url}`]) {
    if (!markdown.includes(marker)) errors.push(`${file}: required article marker missing: ${marker}`);
  }
  const words = markdown.replace(/https?:\/\/\S+/g, "").trim().split(/\s+/).length;
  if (words < 220) errors.push(`${file}: article is too short (${words} words)`);
  for (const sourceKey of post.sources) {
    const source = blogSources[sourceKey];
    if (!source || !source[1].startsWith("https://")) {
      errors.push(`${file}: invalid source ${sourceKey}`);
    } else if (!allowedSourceHosts.has(new URL(source[1]).hostname)) {
      errors.push(`${file}: source host is not allowlisted: ${new URL(source[1]).hostname}`);
    }
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
  if (route.type === "release") {
    for (const marker of ['class="route-page__header content-header"', 'class="route-page__footer content-footer"', 'class="content-field"', 'class="release-registry"', 'data-release-search', "release-page"]) {
      if (!html.includes(marker)) errors.push(`${route.file}: release marker ${marker} missing`);
    }
  } else if (sections.includes(route.section)) {
    for (const routeComponent of ['class="route-page__header content-header"', 'class="route-page__footer content-footer"', 'class="content-field"']) {
      if (!html.includes(routeComponent)) errors.push(`${route.file}: content-route component ${routeComponent} missing`);
    }
    if (!html.includes('/content-routes/route-foundation.css?v=')) errors.push(`${route.file}: route stylesheet missing`);
    if (!html.includes(`content-${route.section}`)) errors.push(`${route.file}: route background class missing`);
    if (!routeCss.includes(`.content-${route.section} .content-field { background-image:`)) errors.push(`${route.file}: route background image mapping missing`);
    if (route.section === "products" && !html.includes('class="product-directory"')) errors.push(`${route.file}: product directory missing`);
  } else {
    for (const sharedComponent of ['class="masthead site-header"', 'class="footer site-footer', 'id="site-menu"']) {
      if (!html.includes(sharedComponent)) errors.push(`${route.file}: shared component ${sharedComponent} missing`);
    }
    if (!html.includes('/styles.css?v=')) errors.push(`${route.file}: shared shell stylesheet missing`);
    if (!html.includes('/script.js?v=')) errors.push(`${route.file}: shared shell script missing`);
  }
  if (html.includes('/favicon.svg')) errors.push(`${route.file}: deleted favicon referenced`);
  if (html.includes('datePublished') || html.includes('application/ld+json')) errors.push(`${route.file}: unsupported schema/date marker found`);
  if (route.section && route.section !== "products" && route.type !== "legal" && route.type !== "release" && !html.includes(locale.common.preparation) && !html.includes('class="route-features ')) errors.push(`${route.file}: truthful preparation notice or route detail structure missing`);
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
  "content-routes/release-search.js",
  "content-routes/release-search.js",
  "products/product-foundation.css",
  "products/product-site.js",
  "products/site-manifest.json",
  "scripts/product-data.mjs",
  "scripts/generate-products.mjs",
  "scripts/components/page-head.mjs",
  "scripts/components/site-shell.mjs",
  "assets/fonts/PixelatedEleganceRegular.ttf",
  "assets/fonts/DominoBrick.ttf",
  "assets/fonts/FortAvenue.ttf",
  "assets/fonts/Matrixtype.ttf",
  "assets/fonts/MatrixtypeDisplay.ttf",
  "assets/fonts/SuperPixel.ttf",
  "assets/brand/logo.webp",
  "assets/brand/logo_icon_tab.png",
]) {
  try {
    await access(file);
  } catch {
    errors.push(`${file}: required asset missing`);
  }
}

for (const slug of ["sandora", "moyi", "sori", "howhow", "dossier", "autopilot", "lajvard"]) {
  for (const file of [`products/content/${slug}.mjs`, `products/themes/${slug}.css`, `products/media/${slug}-system.svg`, `${slug}/index.html`, `${slug}/404.html`, `${slug}/robots.txt`, `${slug}/sitemap.xml`]) {
    try { await access(file); } catch { errors.push(`${file}: required product asset missing`); }
  }
  const productHtml = await readFile(`${slug}/index.html`, "utf8");
  for (const marker of [`https://${slug}.navinresearch.com/`, `product-${slug}`, `/products/themes/${slug}.css`, '/products/product-site.js', 'name="robots"', 'property="og:title"', 'class="skip-link"', 'id="main-content"', 'class="product-nav"', 'class="product-footer"']) {
    if (!productHtml.includes(marker)) errors.push(`${slug}/index.html: product marker missing: ${marker}`);
  }
  if (productHtml.includes("Details to be announced") || productHtml.includes("product-pricing")) errors.push(`${slug}/index.html: obsolete generic pricing scaffold remains`);
  if (!productHtml.includes('data-product-menu') || !productHtml.includes('aria-controls="product-menu"')) errors.push(`${slug}/index.html: responsive product navigation missing`);
  const productSitemap = await readFile(`${slug}/sitemap.xml`, "utf8");
  if (!productSitemap.includes(`https://${slug}.navinresearch.com/`)) errors.push(`${slug}/sitemap.xml: product origin missing`);
  const productRobots = await readFile(`${slug}/robots.txt`, "utf8");
  if (!productRobots.includes(`Sitemap: https://${slug}.navinresearch.com/sitemap.xml`)) errors.push(`${slug}/robots.txt: sitemap missing`);
}

if (!deploymentNginx.includes("location ~ \\.md$") || !deploymentNginx.includes("default_type text/markdown;") || !deploymentNginx.includes("charset_types text/markdown;")) {
  errors.push("deployment nginx: public Markdown content type mapping missing");
}

const productManifest = JSON.parse(await readFile("products/site-manifest.json", "utf8"));
if (!Array.isArray(productManifest) || !productManifest.length) errors.push("product site manifest: no generated routes");
for (const entry of productManifest) {
  try { await access(entry.output); } catch { errors.push(`product site manifest: missing ${entry.output}`); }
  const routeHtml = await readFile(entry.output, "utf8");
  for (const marker of ['class="product-header"', 'class="product-main"', 'class="product-footer"', '<meta name="description"', 'data-layout="', 'product-page-hero--']) {
    if (!routeHtml.includes(marker)) errors.push(`${entry.output}: route marker missing: ${marker}`);
  }
  if (!entry.layout) errors.push(`${entry.output}: manifest layout missing`);
  if (entry.layout && !routeHtml.includes(`data-layout="${entry.layout}"`)) errors.push(`${entry.output}: manifest/layout mismatch`);
  if (entry.path !== "/404.html") {
    const sectionCount = (routeHtml.match(/class="product-page-section /g) || []).length;
    if (!sectionCount && !routeHtml.includes('class="product-specs-frame"') && !routeHtml.includes('class="product-docs-frame"')) errors.push(`${entry.output}: route has no purpose/content section`);
    if (!/<h1>[^<]+<\/h1>/.test(routeHtml) || !/<p>[^<]{24,}<\/p>/.test(routeHtml)) errors.push(`${entry.output}: route purpose requires a descriptive heading and paragraph`);
  }
  const requiredFrame = { workflow: 'product-workflow', ledger: 'product-ledger', docs: 'product-docs-frame', specs: 'product-specs-frame', media: 'product-media-frame', availability: 'product-availability-frame' }[entry.layout];
  if (requiredFrame && !routeHtml.includes(`class="${requiredFrame}"`)) errors.push(`${entry.output}: ${entry.layout} layout frame missing`);
}

for (const slug of ["sandora", "moyi", "sori", "howhow", "dossier", "autopilot", "lajvard"]) {
  const layouts = new Set(productManifest.filter((entry) => entry.product === slug).map((entry) => entry.layout));
  if (layouts.size < 3) errors.push(`${slug}: route architecture is too repetitive (${layouts.size} layouts)`);
}

const robots = await readFile("robots.txt", "utf8");
const sitemap = await readFile("sitemap.xml", "utf8");
const searchIndex = JSON.parse(await readFile("content-routes/search-index.json", "utf8"));
if (!Array.isArray(searchIndex) || searchIndex.length !== generatedRoutes.length + blogPosts.length + products.length) errors.push("search index: route count mismatch");
for (const product of products) {
  const productUrl = `https://${product.slug}.navinresearch.com/`;
  if (!searchIndex.some((item) => item.url === productUrl && item.title.includes(product.name))) errors.push(`search index: ${productUrl} missing`);
}
if (!robots.includes(`Sitemap: ${site.origin}/sitemap.xml`)) errors.push("robots.txt: sitemap missing");
if (!robots.includes("Disallow: /visitor-insights/")) errors.push("robots.txt: private insights exclusion missing");
const visitorMapCss = await readFile("visitor-map/style.css", "utf8");
if (!visitorMapCss.includes(".demo-badge {") || !visitorMapCss.includes(".demo-badge[hidden]") || !visitorMapCss.includes("display: none !important")) {
  errors.push("visitor-map/style.css: hidden demo badge must remain visually hidden");
}
for (const route of generatedRoutes) {
  if (!sitemap.includes(`${site.origin}${route.path}`)) errors.push(`sitemap.xml: ${route.path} missing`);
}
for (const post of blogPosts) {
  const url = blogPostPath(post);
  if (!sitemap.includes(`${site.origin}${url}`)) errors.push(`sitemap.xml: ${url} missing`);
  if (!searchIndex.some((item) => item.url === url && item.title === post.title)) errors.push(`search index: ${url} missing`);
}

if (errors.length) {
  console.error(errors.join("\n"));
  process.exit(1);
}
console.log(`Validated ${generatedRoutes.length} localized pages, ${blogPosts.length} Markdown posts, assets, robots policy, search metadata, and sitemap URLs.`);
