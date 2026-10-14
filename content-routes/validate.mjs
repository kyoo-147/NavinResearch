import { access, readFile, readdir } from "node:fs/promises";
import { chapters, experience, legalPages, locales, localePath, releaseRoute, sections, site } from "../site.config.mjs";
import { catalogProducts, products } from "../scripts/product-data.mjs";
import { blogMarkdownPath, blogPostPath, blogPosts, blogSources, renderBlogPost } from "../scripts/blog-posts.mjs";
import { people, peoplePageCopy, personPath } from "../scripts/people-data.mjs";
import { aboutPreservedPageCopy } from "../scripts/about-preserved-content.mjs";

const errors = [];
const generatedRoutes = [];
const routeCss = (await readFile("content-routes/route-foundation.css", "utf8")).replaceAll("\r\n", "\n");
const preservedCss = (await readFile("content-routes/about-preserved-editorial.css", "utf8")).replaceAll("\r\n", "\n");
const companyCss = (await readFile("content-routes/company-editorial.css", "utf8")).replaceAll("\r\n", "\n");
const lightCss = (await readFile("content-routes/about-light-editorial.css", "utf8")).replaceAll("\r\n", "\n");
const allRouteCss = `${routeCss}\n${preservedCss}\n${companyCss}\n${lightCss}`;
const deploymentNginx = await readFile("deployment-example/nginx.conf", "utf8");

for (const [localeKey, locale] of Object.entries(locales)) {
  generatedRoutes.push({ localeKey, section: "", path: localePath(localeKey), file: locale.prefix ? `${locale.prefix}/index.html` : "index.html" });
  generatedRoutes.push({ localeKey, section: releaseRoute, type: "release", path: localePath(localeKey, releaseRoute), file: `${[locale.prefix, releaseRoute].filter(Boolean).join("/")}/index.html` });
  for (const section of sections) {
    generatedRoutes.push({ localeKey, section, path: localePath(localeKey, section), file: `${[locale.prefix, section].filter(Boolean).join("/")}/index.html` });
  }
  generatedRoutes.push({ localeKey, section: "people", type: "people", path: personPath(localeKey), file: `${[locale.prefix, "about/people"].filter(Boolean).join("/")}/index.html` });
  for (const person of people) {
    generatedRoutes.push({ localeKey, section: "people", type: "person", person, path: personPath(localeKey, person.slug), file: `${[locale.prefix, "about/people", person.slug].filter(Boolean).join("/")}/index.html` });
  }
  for (const chapter of chapters) {
    generatedRoutes.push({ localeKey, section: chapter.slug, type: "chapter", path: localePath(localeKey, chapter.slug), file: `${[locale.prefix, chapter.slug].filter(Boolean).join("/")}/index.html` });
  }
  for (const legalPage of legalPages) {
    generatedRoutes.push({ localeKey, section: legalPage, type: "legal", path: localePath(localeKey, legalPage), file: `${[locale.prefix, legalPage].filter(Boolean).join("/")}/index.html` });
  }
  for (const post of blogPosts) {
    const suffix = `blog/${post.category}/${post.slug}`;
    generatedRoutes.push({ localeKey, section: suffix, type: "blog", post, path: blogPostPath(post, localeKey), file: `${[locale.prefix, suffix].filter(Boolean).join("/")}/index.html` });
  }
}


generatedRoutes.push({ localeKey: "vi", section: "letter", type: "letter", path: "/letter/", file: "letter/index.html" });
generatedRoutes.push({ localeKey: "vi", section: "letter/full", type: "letter-full", path: "/letter/full/", file: "letter/full/index.html" });

if (blogPosts.length !== 52) errors.push(`blog library: expected 52 posts, found ${blogPosts.length}`);
const expectedCategories = new Set(["agents", "reasoning", "models", "multimodal", "inference", "safety-evaluation"]);
const allowedSourceHosts = new Set(["openai.com", "platform.openai.com", "www.anthropic.com", "docs.anthropic.com", "modelcontextprotocol.io", "a2a-protocol.org", "ai.google.dev", "api-docs.deepseek.com", "deepseek.com", "www.deepseek.com", "github.com", "qwen.readthedocs.io", "www.llama.com", "docs.mistral.ai", "mistral.ai", "nvidia.github.io", "docs.nvidia.com", "navinresearch.com", "moyi.navinresearch.com"]);
const diskBlogFiles = (await readdir("blog", { recursive: true })).filter((file) => file.endsWith(".md")).map((file) => `blog/${file.replaceAll("\\", "/")}`);
if (diskBlogFiles.length !== blogPosts.length) errors.push(`blog library: expected ${blogPosts.length} generated Markdown files, found ${diskBlogFiles.length}`);
const blogPaths = new Set();
for (const post of blogPosts) {
  const url = blogPostPath(post);
  const markdownUrl = blogMarkdownPath(post);
  const file = markdownUrl.slice(1);
  if (!expectedCategories.has(post.category)) errors.push(`${url}: unsupported category`);
  if (!/^\/blog\/[a-z0-9-]+\/[a-z0-9-]+\/$/.test(url)) errors.push(`${url}: invalid public blog URL`);
  if (blogPaths.has(url)) errors.push(`${url}: duplicate Markdown URL`);
  blogPaths.add(url);
  const markdown = await readFile(file, "utf8");
  if (markdown !== renderBlogPost(post)) errors.push(`${file}: generated Markdown is stale`);
  const articleMarkers = post.sections ? post.sections.map((section) => `## ${section.title}`) : ["## Implementation steps", "## Validation checklist", "## Common mistakes"];
  for (const marker of ["---\n", `# ${post.title}`, ...articleMarkers, "## Official sources", `canonical: ${site.origin}${url}`]) {
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
  if (route.type === "letter" || route.type === "letter-full") {
    const markers = route.type === "letter"
      ? ['<html lang="vi">', '<title>', 'name="description"', '<main class="letter"', 'id="letter-title">', '/content-routes/letter.css?v=', '<h1 id="letter-title">Chúng tôi sẽ không dừng lại ở đây.</h1>', '<em>Thư gửi Ban Tổ chức AI Thực Chiến 2026.</em>', 'class="letter-read-full"', 'href="/letter/full/"']
      : ['<html lang="vi">', '<title>', 'name="description"', '<main class="letter"', 'id="letter-title">', '/content-routes/letter.css?v=', '<em>Kính gửi Ban Tổ chức cuộc thi AI Thực Chiến 2026,</em>', '<em>Chúng tôi không dừng lại ở đây.</em>'];
    for (const marker of markers) {
      if (!html.includes(marker)) errors.push(`${route.file}: letter marker missing: ${marker}`);
    }
    if (route.type === "letter" && html.includes("Trước hết, chúng tôi thẳng thắn")) errors.push(`${route.file}: summary must not include the full letter opening`);
    if (html.includes('class="masthead site-header"') || html.includes('class="footer site-footer')) errors.push(`${route.file}: letter must remain a blank letter-only page`);
    continue;
  }
  if (!html.includes(`<html lang="${locale.htmlLang}">`)) errors.push(`${route.file}: html lang missing`);
  if (!html.includes(`<link rel="canonical" href="${canonical}">`)) errors.push(`${route.file}: canonical missing`);
  for (const requiredLanguage of ["en", "vi", "zh-CN", "x-default"]) {
    if (!html.includes(`hreflang="${requiredLanguage}"`)) errors.push(`${route.file}: hreflang ${requiredLanguage} missing`);
  }
  for (const marker of ["<title>", 'name="description"', "<main"]) {
    if (!html.includes(marker)) errors.push(`${route.file}: ${marker} missing`);
  }
  if (!html.includes('/assets/brand/logo_icon_tab.png')) errors.push(`${route.file}: current favicon missing`);
  if (route.type === "people" || route.type === "person") {
    for (const marker of ['class="route-page__header content-header"', 'class="route-page__footer content-footer"', 'class="content-field"', 'aria-current="page">' + locale.routes.people.title]) {
      if (!html.includes(marker)) errors.push(`${route.file}: people marker ${marker} missing`);
    }
    if (!html.includes('/content-routes/route-foundation.css?v=')) errors.push(`${route.file}: people stylesheet missing`);
    if (route.type === "people") {
      if (!html.includes("data-people-index")) errors.push(`${route.file}: people index marker missing`);
      for (const person of people) {
        if (!html.includes(personPath(route.localeKey, person.slug))) errors.push(`${route.file}: member link missing for ${person.slug}`);
      }
    } else {
      if (!html.includes(`data-person="${route.person.slug}"`)) errors.push(`${route.file}: person marker missing`);
      if (!html.includes(route.person.copy[route.localeKey].role) || !html.includes(route.person.copy[route.localeKey].profile)) errors.push(`${route.file}: verified person copy missing`);
    }
  } else if (route.type === "release") {
    for (const marker of ['class="route-page__header content-header"', 'class="route-page__footer content-footer"', 'class="content-field"', 'class="release-registry"', 'data-release-search', "release-page"]) {
      if (!html.includes(marker)) errors.push(`${route.file}: release marker ${marker} missing`);
    }
  } else if (route.section === "sign-in") {
    for (const marker of ['class="sign-in-shell"', 'class="sign-in-panel"', 'class="sign-in-form"', '/content-routes/sign-in.js?v=']) {
      if (!html.includes(marker)) errors.push(`${route.file}: sign-in marker ${marker} missing`);
    }
    if (!html.includes('/content-routes/route-foundation.css?v=')) errors.push(`${route.file}: sign-in stylesheet missing`);
  } else if (sections.includes(route.section)) {
    for (const routeComponent of ['class="route-page__header content-header"', 'class="route-page__footer content-footer', 'class="content-field"']) {
      if (!html.includes(routeComponent)) errors.push(`${route.file}: content-route component ${routeComponent} missing`);
    }
    if (!html.includes('/content-routes/route-foundation.css?v=')) errors.push(`${route.file}: route stylesheet missing`);
    if (!html.includes(`content-${route.section}`)) errors.push(`${route.file}: route background class missing`);
    if (!allRouteCss.includes(`.content-${route.section} .content-field {`)) errors.push(`${route.file}: route background image mapping missing`);
    if (route.section === "products" && !html.includes('class="product-directory"')) errors.push(`${route.file}: product directory missing`);
    if (route.section === "about" || route.section === "about-light") {
      for (const marker of ['data-about-article', 'data-article-content', 'data-about-toolbar', 'data-reading-time', 'about-related', '/content-routes/about-article.js?v=', '/content-routes/theme.js?v=']) {
        if (!html.includes(marker)) errors.push(`${route.file}: about article marker missing: ${marker}`);
      }
    }
    if (route.section === "about-preserved") {
      const copy = aboutPreservedPageCopy[route.localeKey];
      if (!html.includes('/content-routes/about-preserved-editorial.css?v=')) errors.push(`${route.file}: preserved route stylesheet missing`);
      if (!html.includes('/assets/about/navin-introduction-banner.png')) errors.push(`${route.file}: preserved route banner missing`);
      if ((html.match(/<main\b/g) || []).length !== 1 || (html.match(/<h1\b/g) || []).length !== 1) errors.push(`${route.file}: preserved route must have exactly one main and one h1`);
      for (const section of copy.sections) if (!html.includes(`id="${section.id}"`)) errors.push(`${route.file}: preserved section missing: ${section.id}`);
      for (const item of copy.related) if (!html.includes(localePath(route.localeKey, item.path))) errors.push(`${route.file}: preserved related link missing: ${item.path}`);
    }
  } else if (route.type === "blog") {
    for (const marker of ['class="route-page__header content-header"', 'class="route-page__footer content-footer', 'class="content-field"', 'data-about-article', 'data-about-toolbar', 'data-article-content', 'content-blog-article', '/content-routes/route-foundation.css?v=', '/content-routes/about-article.js?v=']) {
      if (!html.includes(marker)) errors.push(`${route.file}: blog marker ${marker} missing`);
    }
    const localizedPost = route.post.translations?.[route.localeKey] || route.post;
    if (!html.includes(localizedPost.title) || !html.includes(localizedPost.answer)) errors.push(`${route.file}: blog content missing`);
    for (const sourceKey of route.post.sources) {
      const source = blogSources[sourceKey];
      if (source && !html.includes(source[1])) errors.push(`${route.file}: blog source missing: ${sourceKey}`);
    }
  } else {
    for (const sharedComponent of ['class="masthead site-header"', 'class="footer site-footer', 'id="site-menu"']) {
      if (!html.includes(sharedComponent)) errors.push(`${route.file}: shared component ${sharedComponent} missing`);
    }
    if (!html.includes('/styles.css?v=')) errors.push(`${route.file}: shared shell stylesheet missing`);
    if (!html.includes('/script.js?v=')) errors.push(`${route.file}: shared shell script missing`);
  }
  if (html.includes('/favicon.svg')) errors.push(`${route.file}: deleted favicon referenced`);
  if (html.includes('datePublished') || html.includes('application/ld+json')) errors.push(`${route.file}: unsupported schema/date marker found`);
  if (route.section && route.section !== "products" && route.section !== "about-preserved" && route.section !== "sign-in" && !["legal", "release", "people", "person"].includes(route.type) && !html.includes(locale.common.preparation) && !html.includes('class="route-features ')) errors.push(`${route.file}: truthful preparation notice or route detail structure missing`);
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
  "content-routes/company-editorial.css",
  "content-routes/about-preserved-editorial.css",
  "content-routes/about-light-editorial.css",
  "content-routes/about-nav.js",
  "content-routes/about-article.js",
  "content-routes/theme.js",
  "content-routes/route-search.js",
  "content-routes/release-search.js",
  "content-routes/release-search.js",
  "products/product-primitives.css",
  "products/product-foundation.css",
  "products/product-site.js",
  "products/site-manifest.json",
  "scripts/product-data.mjs",
  "scripts/generate-products.mjs",
  "scripts/components/page-head.mjs",
  "scripts/components/site-shell.mjs",
  "scripts/people-data.mjs",
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

for (const person of people) {
  try { await access(person.image.slice(1)); } catch { errors.push(`${person.image}: people image missing`); }
  for (const localeKey of Object.keys(locales)) {
    const profile = person.copy[localeKey];
    if (!profile?.role || !profile?.summary || !profile?.profile) errors.push(`${person.slug}: incomplete ${localeKey} profile`);
  }
}
for (const localeKey of Object.keys(locales)) {
  if (!peoplePageCopy[localeKey]?.structure?.length) errors.push(`people page: missing ${localeKey} structure copy`);
}

const productContracts = {
  sandora: { prefix: "sd", frames: { editorial: "sd-modules", index: "sd-atlas", workflow: "sd-runbook", docs: "sd-manual", specs: "sd-modules", media: "sd-observation", ledger: "sd-ledger", timeline: "sd-chronicle", comparison: "sd-matrix", availability: "sd-availability-board", product: "sd-product-map", error: "sd-error" } },
  moyi: { prefix: "my", frames: { editorial: "my-cards", workflow: ["my-flow", "my-signal-study"], docs: "my-docs", specs: ["my-lab", "my-signal-study"], timeline: "my-lab", availability: "my-offer", product: "my-product-family", ledger: "my-legal-ledger", error: "my-error" } },
  sori: { prefix: "so", frames: { editorial: "so-stories", workflow: "so-use", docs: "so-guide", ledger: "so-boundaries", timeline: "so-history", availability: "so-offer", product: "so-product-studio", error: "so-error" } },
  howhow: { prefix: "hh", frames: { editorial: "hh-shelf", product: "hh-system-map", workflow: "hh-recipe", docs: "hh-manual", ledger: "hh-ledger", availability: "hh-review-pass", error: "hh-error" } },
  dossier: { prefix: "ds", frames: { editorial: "ds-workstation", workflow: ["ds-pipeline", "ds-decision-map"], integration: "ds-contract", docs: "ds-docs", ledger: "ds-review", availability: "ds-register", enterprise: "ds-enterprise", error: "ds-error" } },
  autopilot: { prefix: "ap", frames: { editorial: "ap-overview", workflow: "ap-loop", docs: "ap-docs", specs: "ap-wiring", timeline: "ap-log", availability: "ap-boundary", ledger: "ap-log", error: "ap-error" } },
  lajvard: { prefix: "lj", frames: { editorial: "lj-essays", index: "lj-essays", workflow: "lj-movement", docs: "lj-docs", specs: "lj-specs", media: "lj-archive", ledger: "lj-notebook", timeline: "lj-notebook", comparison: "lj-layers", availability: "lj-availability-sheet", error: "lj-error" } },
};

for (const slug of ["sandora", "moyi", "sori", "howhow", "dossier", "autopilot", "lajvard"]) {
  const contract = productContracts[slug];
  for (const file of [`products/content/${slug}.mjs`, `products/themes/${slug}.css`, `products/media/${slug}-system.svg`, `scripts/product-sites/${slug}.mjs`, `products/runtime/${slug}.js`, `${slug}/index.html`, `${slug}/404.html`, `${slug}/robots.txt`, `${slug}/sitemap.xml`]) {
    try { await access(file); } catch { errors.push(`${file}: required product asset missing`); }
  }
  const productHtml = await readFile(`${slug}/index.html`, "utf8");
  for (const marker of [`https://${slug}.navinresearch.com/`, `data-product="${slug}"`, `/products/themes/${slug}.css`, `/products/runtime/${slug}.js`, '/products/product-primitives.css', 'name="robots"', 'property="og:title"', 'class="skip-link"', 'id="main-content"', `class="${contract.prefix}-header"`, `class="${contract.prefix}-footer"`]) {
    if (!productHtml.includes(marker)) errors.push(`${slug}/index.html: product marker missing: ${marker}`);
  }
  if (productHtml.includes("Details to be announced") || productHtml.includes("product-pricing")) errors.push(`${slug}/index.html: obsolete generic pricing scaffold remains`);
  if (productHtml.includes("product-foundation.css") || productHtml.includes("product-site.js")) errors.push(`${slug}/index.html: legacy shared product shell remains`);
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
  const contract = productContracts[entry.product];
  if (!contract) {
    errors.push(`${entry.output}: unknown product contract ${entry.product}`);
    continue;
  }
  for (const marker of [`class="${contract.prefix}-header"`, `class="${contract.prefix}-footer"`, `<body class="${contract.prefix}-body ${contract.prefix}-${entry.layout}"`, `data-product="${entry.product}"`, '<meta name="description"', `/products/themes/${entry.product}.css`, `/products/runtime/${entry.product}.js`, '/products/product-primitives.css']) {
    if (!routeHtml.includes(marker)) errors.push(`${entry.output}: route marker missing: ${marker}`);
  }
  if (!routeHtml.includes(`class="${contract.prefix}-hero"`) && !routeHtml.includes(`class="${contract.prefix}-route-lead`)) errors.push(`${entry.output}: product-owned route lead missing`);
  if (routeHtml.includes('product-foundation.css') || routeHtml.includes('product-site.js')) errors.push(`${entry.output}: legacy shared product shell remains`);
  if ((routeHtml.match(/<main\b/g) || []).length !== 1 || (routeHtml.match(/<footer\b/g) || []).length !== 1) errors.push(`${entry.output}: expected exactly one main and one footer`);
  if (!routeHtml.includes('data-product-menu') || !routeHtml.includes('aria-controls="product-menu"') || !routeHtml.includes('id="product-menu"')) errors.push(`${entry.output}: responsive menu linkage missing`);
  if (!entry.layout) errors.push(`${entry.output}: manifest layout missing`);
  const mainHtml = routeHtml.match(/<main\b[\s\S]*?<\/main>/)?.[0] || "";
  if (entry.path !== "/404.html") {
    const sectionCount = (mainHtml.match(/<section\b/g) || []).length;
    if (sectionCount < 2) errors.push(`${entry.output}: route has no purpose/content section`);
    if (!/<h1>[^<]+<\/h1>/.test(mainHtml) || !/<p>[^<]{24,}<\/p>/.test(mainHtml)) errors.push(`${entry.output}: route purpose requires a descriptive heading and paragraph inside main`);
  }
  const requiredFrame = contract.frames[entry.layout];
  const acceptedFrames = Array.isArray(requiredFrame) ? requiredFrame : [requiredFrame];
  if (!requiredFrame) errors.push(`${entry.output}: unknown ${entry.product} layout contract ${entry.layout}`);
  else if (!acceptedFrames.some((frame) => mainHtml.includes(`class="${frame}"`) || mainHtml.includes(`class="${frame} `))) errors.push(`${entry.output}: ${entry.layout} layout frame missing inside main (${acceptedFrames.join(" or ")})`);
}

for (const slug of ["sandora", "moyi", "sori", "howhow", "dossier", "autopilot", "lajvard"]) {
  const layouts = new Set(productManifest.filter((entry) => entry.product === slug).map((entry) => entry.layout));
  if (layouts.size < 3) errors.push(`${slug}: route architecture is too repetitive (${layouts.size} layouts)`);
}

const robots = await readFile("robots.txt", "utf8");
const sitemap = await readFile("sitemap.xml", "utf8");
const searchIndex = JSON.parse(await readFile("content-routes/search-index.json", "utf8"));
if (!Array.isArray(searchIndex) || searchIndex.length !== generatedRoutes.length + catalogProducts.length) errors.push("search index: route count mismatch");
for (const product of catalogProducts) {
  const productUrl = product.url || `https://${product.slug}.navinresearch.com/`;
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
