import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";

const contracts = {
  sandora: "sd",
  moyi: "my",
  sori: "so",
  howhow: "hh",
  dossier: "ds",
  autopilot: "ap",
  lajvard: "lj",
};
const prefixes = Object.values(contracts);
const legacyMarkers = [
  "product-page-hero",
  "product-page-section",
  "product-footer__groups",
  "product-docs-frame",
  "product-availability-frame",
  "product-foundation.css",
  "product-site.js",
];
const meaningfulTags = new Set(["header", "nav", "main", "section", "article", "aside", "div", "footer", "figure", "figcaption", "ol", "ul", "li", "dl", "dt", "dd", "table", "thead", "tbody", "tr", "th", "td", "h1", "h2", "h3", "pre", "details", "summary", "button", "a"]);
const errors = [];
const digest = (value) => createHash("sha256").update(value).digest("hex");
const manifest = JSON.parse(await readFile("products/site-manifest.json", "utf8"));

function countTag(html, tag) {
  return (html.match(new RegExp(`<${tag}\\b`, "gi")) || []).length;
}

function fragment(html, tag) {
  const match = html.match(new RegExp(`<${tag}\\b[\\s\\S]*?<\\/${tag}>`, "i"));
  return match?.[0] || "";
}

function normalizedClasses(attributes) {
  return (attributes.match(/class="([^"]+)"/)?.[1] || "")
    .split(/\s+/)
    .filter(Boolean)
    .filter((name) => !["skip-link", "product-menu", "product-menu-button"].includes(name))
    .map((name) => name.replace(/^(sd|my|so|hh|ds|ap|lj)-/, "site-"))
    .sort();
}

function structuralTokens(html) {
  const tokens = [];
  for (const match of html.matchAll(/<(\/)?([a-z][a-z0-9-]*)([^>]*)>/gi)) {
    const closing = Boolean(match[1]);
    const tag = match[2].toLowerCase();
    if (!meaningfulTags.has(tag)) continue;
    if (closing) {
      tokens.push(`/${tag}`);
      continue;
    }
    const classes = normalizedClasses(match[3]);
    const semantic = match[3].match(/(?:aria-label|role)="([^"]+)"/)?.[1]?.toLowerCase().replace(/[^a-z0-9]+/g, "-") || "";
    tokens.push(`${tag}${classes.length ? `.${classes.join(".")}` : ""}${semantic ? `@${semantic}` : ""}`);
  }
  return tokens;
}

function shingles(tokens, width = 4) {
  const result = new Set();
  if (tokens.length < width) return new Set([tokens.join(">")] );
  for (let index = 0; index <= tokens.length - width; index += 1) result.add(tokens.slice(index, index + width).join(">"));
  return result;
}

function similarity(left, right) {
  let intersection = 0;
  for (const value of left) if (right.has(value)) intersection += 1;
  const union = left.size + right.size - intersection;
  return union ? intersection / union : 1;
}

function outputFile(slug, path) {
  if (path === "/") return `${slug}/index.html`;
  if (path === "/404.html") return `${slug}/404.html`;
  return `${slug}${path}index.html`;
}

const pages = [];
for (const [slug, prefix] of Object.entries(contracts)) {
  const renderer = await readFile(`scripts/product-sites/${slug}.mjs`, "utf8");
  const runtime = await readFile(`products/runtime/${slug}.js`, "utf8");
  const theme = await readFile(`products/themes/${slug}.css`, "utf8");
  if (!renderer.includes(`class=\"${prefix}-header`) || !renderer.includes(`class=\"${prefix}-footer`)) errors.push(`${slug}: renderer does not own its header/footer vocabulary`);
  if (!runtime.includes(`max-width:`) || !runtime.includes("data-product-menu")) errors.push(`${slug}: runtime does not own responsive menu behavior`);
  if (!theme.includes(`.${prefix}-header`) || !theme.includes(`.${prefix}-footer`) || !theme.includes("prefers-reduced-motion")) errors.push(`${slug}: theme lacks owned header/footer/reduced-motion rules`);

  const entries = manifest.filter((entry) => entry.product === slug);
  if (!entries.length) errors.push(`${slug}: no manifest routes`);
  for (const entry of entries) {
    const file = outputFile(slug, entry.path);
    const html = await readFile(file, "utf8");
    if (countTag(html, "header") < 1 || countTag(html, "main") !== 1 || countTag(html, "footer") !== 1) errors.push(`${file}: expected owned header, exactly one main, and exactly one footer`);
    if (!html.includes(`data-product=\"${slug}\"`) || !html.includes(`class=\"${prefix}-body`)) errors.push(`${file}: missing product ownership markers`);
    if (!html.includes(`/products/themes/${slug}.css`) || !html.includes(`/products/runtime/${slug}.js`)) errors.push(`${file}: wrong theme/runtime linkage`);
    if (!html.includes("data-product-menu") || !html.includes('aria-controls="product-menu"') || !html.includes('id="product-menu"')) errors.push(`${file}: incomplete accessible menu linkage`);
    for (const marker of legacyMarkers) if (html.includes(marker)) errors.push(`${file}: legacy shared presentation marker remains: ${marker}`);
    for (const other of prefixes.filter((candidate) => candidate !== prefix)) if (new RegExp(`class=\"[^\"]*\\b${other}-`).test(html)) errors.push(`${file}: contains ${other}- presentation vocabulary owned by another product`);
    const main = fragment(html, "main");
    const tokens = structuralTokens(main);
    pages.push({ slug, path: entry.path, layout: entry.layout, file, tokens, shingles: shingles(tokens), headerShingles: shingles(structuralTokens(fragment(html, "header"))), footerShingles: shingles(structuralTokens(fragment(html, "footer"))) });
  }
}

for (let leftIndex = 0; leftIndex < pages.length; leftIndex += 1) {
  const left = pages[leftIndex];
  for (let rightIndex = leftIndex + 1; rightIndex < pages.length; rightIndex += 1) {
    const right = pages[rightIndex];
    if (left.slug === right.slug || left.layout !== right.layout) continue;
    const score = similarity(left.shingles, right.shingles);
    if (score >= 0.78) errors.push(`${right.file}: ${right.layout} grammar is ${(score * 100).toFixed(1)}% similar to ${left.file}`);
  }
}

const homes = pages.filter((page) => page.path === "/");
for (let leftIndex = 0; leftIndex < homes.length; leftIndex += 1) {
  for (let rightIndex = leftIndex + 1; rightIndex < homes.length; rightIndex += 1) {
    const left = homes[leftIndex]; const right = homes[rightIndex];
    const headerScore = similarity(left.headerShingles, right.headerShingles);
    const footerScore = similarity(left.footerShingles, right.footerShingles);
    if (headerScore >= 0.78) errors.push(`${right.slug}: header grammar is ${(headerScore * 100).toFixed(1)}% similar to ${left.slug}`);
    if (footerScore >= 0.78) errors.push(`${right.slug}: footer grammar is ${(footerScore * 100).toFixed(1)}% similar to ${left.slug}`);
  }
}

const probe = pages[0]?.tokens || [];
if (probe.length > 12) {
  const midpoint = Math.floor(probe.length / 2);
  const inertWrapperMutation = [...probe.slice(0, midpoint), "section.site-inert-wrapper", ...probe.slice(midpoint), "/section"];
  if (similarity(shingles(probe), shingles(inertWrapperMutation)) < 0.78) errors.push("checker self-test: one inert wrapper can evade the similarity gate");
}

for (const slug of Object.keys(contracts)) {
  const representatives = new Map();
  for (const page of pages.filter((candidate) => candidate.slug === slug)) {
    if (!representatives.has(page.layout)) representatives.set(page.layout, digest(page.tokens.join(">")));
  }
  const seen = new Map();
  for (const [layout, hash] of representatives) {
    if (seen.has(hash)) errors.push(`${slug}: ${layout} duplicates the structural fingerprint of ${seen.get(hash)}`);
    seen.set(hash, layout);
  }
}

if (errors.length) {
  console.error(errors.join("\n"));
  process.exit(1);
}
console.log(`Product independence check passed: ${Object.keys(contracts).length} owned renderer/theme/runtime systems, ${pages.length} manifest routes, cross-product family similarity below 78%.`);
