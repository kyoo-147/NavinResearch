import { createHash } from "node:crypto";
import { execFileSync } from "node:child_process";
import { cp, lstat, mkdir, mkdtemp, readFile, readdir, rm, stat, symlink, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { basename, dirname, extname, isAbsolute, relative, resolve, sep } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const productSlugs = ["sandora", "moyi", "sori", "howhow", "dossier", "autopilot", "lajvard"];

const exactPublicFiles = [
  "404.html",
  "google00bfffcce9844575.html",
  "robots.txt",
  "script.js",
  "sitemap.xml",
  "styles.css",
  "content-routes/release-search.js",
  "content-routes/route-foundation.css",
  "content-routes/route-search.js",
  "content-routes/search-index.json",
  "products/product-foundation.css",
  "products/product-site.js",
  "products/site-manifest.json",
  "visitor-map/country-centroids.json",
  "visitor-map/index.html",
  "visitor-map/script.js",
  "visitor-map/style.css",
  "visitor-insights/index.html",
  "visitor-insights/script.js",
];

const publicTrees = [
  { prefix: "assets/", extensions: new Set([".png", ".svg", ".webp", ".woff", ".woff2", ".ttf"]) },
  { prefix: "products/media/", extensions: new Set([".avif", ".jpeg", ".jpg", ".png", ".svg", ".webp"]) },
  { prefix: "products/themes/", extensions: new Set([".css"]) },
];

const forbiddenPatterns = [
  /(^|\/)\.(?:git|github)(?:\/|$)/i,
  /(^|\/)(?:analytics|deployment-example|scripts)(?:\/|$)/i,
  /(^|\/)docs\/(?!index\.html$)/i,
  /(^|\/)products\/content(?:\/|$)/i,
  /(^|\/)(?:AGENTS|PROJECT_STATE|README|THIRD_PARTY_NOTICES)\.md$/i,
  /(^|\/)package(?:-lock)?\.json$/i,
  /(^|\/)site\.config\.mjs$/i,
  /(^|\/)visitor-(?:map|insights)\/data\.json$/i,
  /(^|\/)[1-5]\.png$/i,
  /(?:^|[._-])(?:credential|secret|password|private-key)(?:[._-]|$)/i,
  /\.(?:conf|db|env|htpasswd|log|mmdb|mjs|pem|py|service|sh|sqlite|sqlite3|timer|yml)$/i,
];

function normalizePath(value) {
  return value.replaceAll("\\", "/").replace(/^\.\//, "");
}

function trackedFiles() {
  const output = execFileSync("git", ["ls-files", "-z"], { cwd: repoRoot, encoding: "utf8" });
  return output.split("\0").filter(Boolean).map(normalizePath);
}

function sitemapLocations(xml, label) {
  const locations = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1]);
  if (!locations.length) throw new Error(`${label} contains no URLs`);
  if (new Set(locations).size !== locations.length) throw new Error(`${label} contains duplicate URLs`);
  return locations;
}

function rejectDuplicateOutputs(outputs, label) {
  if (new Set(outputs).size !== outputs.length) throw new Error(`${label} contains URLs that map to duplicate release outputs`);
  return outputs;
}

function parentSitemapOutput(urlValue) {
  const url = new URL(urlValue);
  if (url.protocol !== "https:" || url.hostname !== "navinresearch.com" || url.username || url.password || url.search || url.hash) {
    throw new Error(`Unexpected parent sitemap URL: ${urlValue}`);
  }
  const pathname = decodeURIComponent(url.pathname);
  if (!pathname.startsWith("/") || pathname.includes("..") || pathname.includes("\\")) throw new Error(`Unsafe parent sitemap path: ${pathname}`);
  if (pathname === "/") return "index.html";
  return pathname.endsWith("/") ? `${pathname.slice(1)}index.html` : pathname.slice(1);
}

function productSitemapOutput(slug, urlValue) {
  const url = new URL(urlValue);
  if (url.protocol !== "https:" || url.hostname !== `${slug}.navinresearch.com` || url.username || url.password || url.search || url.hash) {
    throw new Error(`Unexpected ${slug} sitemap URL: ${urlValue}`);
  }
  const pathname = decodeURIComponent(url.pathname);
  if (!pathname.startsWith("/") || !pathname.endsWith("/") || pathname.includes("..") || pathname.includes("\\")) {
    throw new Error(`Unsafe ${slug} sitemap path: ${pathname}`);
  }
  return pathname === "/" ? `${slug}/index.html` : `${slug}${pathname}index.html`;
}

function validateProductSitemap(slug, xml, manifestOutputs) {
  const mappedOutputs = rejectDuplicateOutputs(sitemapLocations(xml, `${slug}/sitemap.xml`).map((url) => productSitemapOutput(slug, url)), `${slug}/sitemap.xml`);
  const sitemapOutputs = new Set(mappedOutputs);
  const expectedOutputs = new Set([...manifestOutputs].filter((output) => output !== `${slug}/404.html`));
  const missing = [...expectedOutputs].filter((output) => !sitemapOutputs.has(output));
  const extra = [...sitemapOutputs].filter((output) => !expectedOutputs.has(output));
  if (missing.length || extra.length) {
    throw new Error(`${slug} sitemap/manifest mismatch\nMissing: ${missing.join(", ") || "none"}\nExtra: ${extra.join(", ") || "none"}`);
  }
  return sitemapOutputs.size;
}

async function expectedReleaseInventory() {
  const tracked = new Set(trackedFiles());
  const files = new Set(exactPublicFiles);

  const rootSitemap = await readFile(resolve(repoRoot, "sitemap.xml"), "utf8");
  const parentOutputs = rejectDuplicateOutputs(sitemapLocations(rootSitemap, "sitemap.xml").map(parentSitemapOutput), "sitemap.xml");
  for (const output of parentOutputs) files.add(output);

  const manifest = JSON.parse(await readFile(resolve(repoRoot, "products/site-manifest.json"), "utf8"));
  if (!Array.isArray(manifest) || !manifest.length) throw new Error("Product manifest must be a non-empty array");
  const manifestByProduct = new Map(productSlugs.map((slug) => [slug, new Set()]));
  for (const entry of manifest) {
    if (!productSlugs.includes(entry.product)) throw new Error(`Unexpected product in manifest: ${entry.product}`);
    const output = normalizePath(entry.output || "");
    if (!output.startsWith(`${entry.product}/`) || !output.endsWith(".html") || output.includes("..")) throw new Error(`Unsafe product output: ${output}`);
    const outputs = manifestByProduct.get(entry.product);
    if (outputs.has(output)) throw new Error(`Duplicate product output: ${output}`);
    outputs.add(output);
    files.add(output);
  }

  let productSitemapUrls = 0;
  for (const slug of productSlugs) {
    const outputs = manifestByProduct.get(slug);
    if (!outputs.size || !outputs.has(`${slug}/404.html`)) throw new Error(`${slug} manifest must include pages and 404.html`);
    const sitemapPath = `${slug}/sitemap.xml`;
    const productSitemap = await readFile(resolve(repoRoot, sitemapPath), "utf8");
    productSitemapUrls += validateProductSitemap(slug, productSitemap, outputs);
    files.add(`${slug}/robots.txt`);
    files.add(sitemapPath);
  }
  if (productSitemapUrls !== manifest.length - productSlugs.length) {
    throw new Error(`Product sitemap count ${productSitemapUrls} does not match ${manifest.length - productSlugs.length} indexable manifest routes`);
  }

  for (const rule of publicTrees) {
    const matches = [...tracked].filter((file) => file.startsWith(rule.prefix));
    if (!matches.length) throw new Error(`Public asset tree is empty: ${rule.prefix}`);
    for (const file of matches) {
      if (!rule.extensions.has(extname(file).toLowerCase())) throw new Error(`Unexpected file type in public asset tree: ${file}`);
      files.add(file);
    }
  }

  for (const file of files) {
    if (!tracked.has(file)) throw new Error(`Allowlisted release file is not tracked: ${file}`);
    if (forbiddenPatterns.some((pattern) => pattern.test(file))) throw new Error(`Forbidden path entered release allowlist: ${file}`);
    const info = await lstat(resolve(repoRoot, file));
    if (!info.isFile() || info.isSymbolicLink()) throw new Error(`Release source must be a regular file: ${file}`);
  }

  return {
    files: [...files].sort(),
    parentUrls: parentOutputs.length,
    productUrls: manifest.length,
    indexableProductUrls: productSitemapUrls,
  };
}

async function listFiles(root, directory = root) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const absolute = resolve(directory, entry.name);
    const path = normalizePath(relative(root, absolute));
    if (entry.isSymbolicLink()) throw new Error(`Release contains a symbolic link: ${path}`);
    if (entry.isDirectory()) files.push(...await listFiles(root, absolute));
    else if (entry.isFile()) files.push(path);
    else throw new Error(`Release contains a non-regular entry: ${path}`);
  }
  return files.sort();
}

async function sha256(path) {
  const hash = createHash("sha256");
  hash.update(await readFile(path));
  return hash.digest("hex");
}

function safeOutput(output) {
  if (process.platform !== "win32" && (/^[A-Za-z]:[\\/]/.test(output) || output.includes("\\"))) {
    throw new Error(`Windows-form release path is invalid on ${process.platform}: ${output}`);
  }
  const absolute = resolve(output);
  if (absolute === repoRoot) throw new Error("Release output cannot be the repository root");
  const relation = relative(repoRoot, absolute);
  const outsideRepository = isAbsolute(relation) || relation === ".." || relation.startsWith(`..${sep}`);
  const ignoredReleaseDirectory = relation === "release" || relation.startsWith(`release${sep}`);
  if (relation === "" || (!outsideRepository && !ignoredReleaseDirectory)) {
    throw new Error("Release output must be outside the repository or under the ignored release/ directory");
  }
  return absolute;
}

async function rejectSymlinkComponents(absolute) {
  let current = absolute;
  while (true) {
    const info = await lstat(current).catch((error) => {
      if (error.code === "ENOENT") return null;
      throw error;
    });
    if (info?.isSymbolicLink()) throw new Error(`Release path contains a symbolic link: ${current}`);
    const parent = dirname(current);
    if (parent === current) break;
    current = parent;
  }
}

async function verifiedRoot(output) {
  const root = safeOutput(output);
  await rejectSymlinkComponents(root);
  const info = await lstat(root).catch((error) => {
    if (error.code === "ENOENT") return null;
    throw error;
  });
  if (!info?.isDirectory() || info.isSymbolicLink()) throw new Error(`Release directory does not exist as a regular directory: ${root}`);
  return root;
}

export async function verifyRelease(output) {
  const root = await verifiedRoot(output);
  const inventory = await expectedReleaseInventory();
  const actual = await listFiles(root);
  const missing = inventory.files.filter((file) => !actual.includes(file));
  const extra = actual.filter((file) => !inventory.files.includes(file));
  if (missing.length || extra.length) {
    throw new Error(`Release file set mismatch\nMissing: ${missing.join(", ") || "none"}\nExtra: ${extra.join(", ") || "none"}`);
  }

  for (const file of actual) {
    if (forbiddenPatterns.some((pattern) => pattern.test(file))) throw new Error(`Forbidden release path: ${file}`);
    const [sourceHash, releaseHash] = await Promise.all([
      sha256(resolve(repoRoot, file)),
      sha256(resolve(root, file)),
    ]);
    if (sourceHash !== releaseHash) throw new Error(`Release file differs from tracked source: ${file}`);
  }

  return {
    root,
    files: actual.length,
    html: actual.filter((file) => file.endsWith(".html")).length,
    markdown: actual.filter((file) => file.endsWith(".md")).length,
    parentUrls: inventory.parentUrls,
    productUrls: inventory.productUrls,
    indexableProductUrls: inventory.indexableProductUrls,
  };
}

export async function buildRelease(output) {
  const root = safeOutput(output);
  await rejectSymlinkComponents(root);
  const inventory = await expectedReleaseInventory();
  await rm(root, { recursive: true, force: true });
  await mkdir(root, { recursive: true });
  await rejectSymlinkComponents(root);
  for (const file of inventory.files) {
    const destination = resolve(root, file);
    await mkdir(dirname(destination), { recursive: true });
    await cp(resolve(repoRoot, file), destination, { force: false, errorOnExist: true });
  }
  return verifyRelease(root);
}

async function expectFailure(label, operation, pattern) {
  try {
    await operation();
  } catch (error) {
    if (pattern.test(String(error))) return;
    throw new Error(`${label} failed for the wrong reason: ${error.message}`);
  }
  throw new Error(`${label} did not fail closed`);
}

async function smokeTest() {
  const temporary = await mkdtemp(resolve(tmpdir(), "navin-release-"));
  const rootLink = `${temporary}-link`;
  const ancestorLink = `${temporary}-parent-link`;
  try {
    const report = await buildRelease(temporary);

    await writeFile(resolve(temporary, "README.md"), "must fail closed\n", "utf8");
    await expectFailure("internal Markdown injection", () => verifyRelease(temporary), /Extra: README\.md/);
    await rm(resolve(temporary, "README.md"));

    await mkdir(resolve(temporary, "analytics"));
    await writeFile(resolve(temporary, "analytics/aggregate.py"), "must fail closed\n", "utf8");
    await expectFailure("operator source injection", () => verifyRelease(temporary), /analytics\/aggregate\.py/);
    await rm(resolve(temporary, "analytics"), { recursive: true });

    await writeFile(resolve(temporary, "assets/brand/unlisted.webp"), "must fail closed\n", "utf8");
    await expectFailure("allowed-looking extra asset", () => verifyRelease(temporary), /assets\/brand\/unlisted\.webp/);
    await rm(resolve(temporary, "assets/brand/unlisted.webp"));

    const hashFixture = resolve(temporary, "styles.css");
    const originalStyles = await readFile(hashFixture);
    await writeFile(hashFixture, "modified\n", "utf8");
    await expectFailure("modified file hash", () => verifyRelease(temporary), /differs from tracked source: styles\.css/);
    await writeFile(hashFixture, originalStyles);

    await rm(resolve(temporary, "robots.txt"));
    await expectFailure("missing allowlisted file", () => verifyRelease(temporary), /Missing: robots\.txt/);
    await cp(resolve(repoRoot, "robots.txt"), resolve(temporary, "robots.txt"));

    await expectFailure("repository output containment", () => buildRelease(resolve(repoRoot, "unsafe-output")), /outside the repository/);
    if (process.platform !== "win32") {
      await expectFailure("foreign Windows path", () => buildRelease("C:\\navin-release"), /Windows-form release path/);
    }

    const manifestOutputs = new Set(["sample/index.html", "sample/route/index.html", "sample/404.html"]);
    const validSitemap = "<urlset><url><loc>https://sample.navinresearch.com/</loc></url><url><loc>https://sample.navinresearch.com/route/</loc></url></urlset>";
    if (validateProductSitemap("sample", validSitemap, manifestOutputs) !== 2) throw new Error("Product sitemap fixture count is incorrect");
    await expectFailure("product sitemap drift", async () => validateProductSitemap("sample", validSitemap.replace("/route/", "/other/"), manifestOutputs), /sitemap\/manifest mismatch/);
    await expectFailure("unsafe product sitemap host", async () => validateProductSitemap("sample", validSitemap.replace("sample.navinresearch.com", "navinresearch.com"), manifestOutputs), /Unexpected sample sitemap URL/);

    await symlink(temporary, rootLink, process.platform === "win32" ? "junction" : "dir");
    await expectFailure("symlinked release root", () => verifyRelease(rootLink), /symbolic link/);
    await rm(rootLink, { force: true });
    await symlink(dirname(temporary), ancestorLink, process.platform === "win32" ? "junction" : "dir");
    await expectFailure("symlinked release ancestor", () => verifyRelease(resolve(ancestorLink, basename(temporary))), /symbolic link/);
    await rm(ancestorLink, { force: true });

    const collidingSitemap = validSitemap.replace("/route/", "/%72oute/")
      .replace("</urlset>", "<url><loc>https://sample.navinresearch.com/route/</loc></url></urlset>");
    await expectFailure("encoded sitemap output collision", async () => validateProductSitemap("sample", collidingSitemap, manifestOutputs), /duplicate release outputs/);

    await verifyRelease(temporary);
    return report;
  } finally {
    await rm(rootLink, { recursive: true, force: true }).catch(() => {});
    await rm(ancestorLink, { recursive: true, force: true }).catch(() => {});
    await rm(temporary, { recursive: true, force: true });
  }
}

function reportLine(report) {
  return `${report.files} files; ${report.html} HTML; ${report.markdown} public blog Markdown; ${report.parentUrls} parent URLs; ${report.productUrls} product URLs (${report.indexableProductUrls} in product sitemaps plus ${report.productUrls - report.indexableProductUrls} product 404s).`;
}

async function main() {
  const [command, output] = process.argv.slice(2);
  if (command === "--self-test") {
    const report = await smokeTest();
    console.log(`Release allowlist self-test passed: ${reportLine(report)}`);
    return;
  }
  if ((command !== "--build" && command !== "--verify") || !output) {
    throw new Error("Usage: node scripts/build-release.mjs --build <output-directory> | --verify <release-directory> | --self-test");
  }
  const report = command === "--build" ? await buildRelease(output) : await verifyRelease(output);
  console.log(`Release ${command === "--build" ? "built and verified" : "verified"}: ${report.root}`);
  console.log(reportLine(report));
}

if (process.argv[1] && pathToFileURL(resolve(process.argv[1])).href === import.meta.url) {
  main().catch((error) => {
    console.error(error.message);
    process.exitCode = 1;
  });
}
