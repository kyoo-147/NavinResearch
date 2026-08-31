import { mkdir, readFile, rm, writeFile } from "node:fs/promises";
import sandora from "../products/content/sandora.mjs";
import moyi from "../products/content/moyi.mjs";
import sori from "../products/content/sori.mjs";
import howhow from "../products/content/howhow.mjs";
import dossier from "../products/content/dossier.mjs";
import autopilot from "../products/content/autopilot.mjs";
import lajvard from "../products/content/lajvard.mjs";
import renderSandora from "./product-sites/sandora.mjs";
import renderMoyi from "./product-sites/moyi.mjs";
import renderSori from "./product-sites/sori.mjs";
import renderHowhow from "./product-sites/howhow.mjs";
import renderDossier from "./product-sites/dossier.mjs";
import renderAutopilot from "./product-sites/autopilot.mjs";
import renderLajvard from "./product-sites/lajvard.mjs";
import {
  canonicalUrl,
  ensureOutputDirectory,
  outputPath,
  productRobots,
  productSitemap,
  resetProductOutput,
  writeProductManifest,
} from "./product-renderer-helpers.mjs";

const products = [sandora, moyi, sori, howhow, dossier, autopilot, lajvard];
const renderers = new Map([
  ["sandora", renderSandora], ["moyi", renderMoyi], ["sori", renderSori],
  ["howhow", renderHowhow], ["dossier", renderDossier], ["autopilot", renderAutopilot], ["lajvard", renderLajvard],
]);
const layouts = new Set(["editorial", "index", "workflow", "docs", "specs", "media", "ledger", "timeline", "comparison", "availability"]);
const normalizePath = (value = "/") => {
  if (value === "/404.html") return value;
  const path = `/${String(value).replace(/^\/+|\/+$/g, "")}/`;
  return path === "//" ? "/" : path;
};
const layoutFor = (page) => {
  if (page.layout && layouts.has(page.layout)) return page.layout;
  const path = normalizePath(page.path);
  if (path === "/") return "editorial";
  if (/pricing|contact|availability/.test(path)) return "availability";
  if (/docs|developers|github/.test(path)) return "docs";
  if (/research|releases|changelog/.test(path)) return "timeline";
  if (/benchmarks|specs|hardware|models|api/.test(path)) return "specs";
  if (/use-cases|solutions|workflows|planning|control|movement/.test(path)) return "workflow";
  if (/integrations|devices|gallery|media/.test(path)) return "media";
  if (/security|privacy|terms/.test(path)) return "ledger";
  return page.visual?.kind === "comparison" ? "comparison" : "index";
};

const productFlag = process.argv.indexOf("--product");
const selected = productFlag === -1 ? undefined : process.argv[productFlag + 1];
if (process.argv.includes("--product") && (!selected || !renderers.has(selected))) {
  throw new Error(`Unknown product. Use --product ${[...renderers.keys()].join(" | ")}`);
}
const targets = selected ? products.filter((product) => product.slug === selected) : products;
const previousManifest = selected ? JSON.parse(await readFile("products/site-manifest.json", "utf8")) : [];
const manifest = selected ? previousManifest.filter((entry) => entry.product !== selected) : [];
const slugs = new Set();
for (const product of products) {
  if (slugs.has(product.slug)) throw new Error(`Duplicate product slug: ${product.slug}`);
  slugs.add(product.slug);
}
for (const product of targets) {
  await resetProductOutput(product.slug);
  const site = product.site;
  if (!site) throw new Error(`${product.slug}: product site contract missing`);
  const pages = [...site.pages];
  if (!pages.some((page) => normalizePath(page.path) === "/404.html")) throw new Error(`${product.slug}: 404 route missing`);
  const routeSet = new Set();
  for (const page of pages) {
    const route = normalizePath(page.path);
    if (routeSet.has(route)) throw new Error(`${product.slug}: duplicate route ${route}`);
    routeSet.add(route);
    const output = outputPath(product.slug, route);
    await ensureOutputDirectory(output);
    await writeFile(output, renderers.get(product.slug)(product, site, { ...page, path: route }), "utf8");
    manifest.push({ product: product.slug, name: product.name, path: route, layout: layoutFor({ ...page, path: route }), output, url: canonicalUrl(product, route), title: page.title });
  }
  const publicRoutes = pages.map((page) => normalizePath(page.path)).filter((route) => route !== "/404.html");
  await writeFile(`${product.slug}/sitemap.xml`, productSitemap(product, publicRoutes), "utf8");
  await writeFile(`${product.slug}/robots.txt`, productRobots(product), "utf8");
}
await writeProductManifest(manifest);
console.log(`Generated ${manifest.length} product-site pages across ${targets.length} domains${selected ? ` (${selected})` : ""}.`);
