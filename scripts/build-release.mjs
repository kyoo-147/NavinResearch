import { createHash } from "node:crypto";
import { execFileSync } from "node:child_process";
import { cp, lstat, mkdir, mkdtemp, readFile, readdir, rm, stat, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { dirname, extname, isAbsolute, relative, resolve, sep } from "node:path";
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

function sitemapOutput(pathname) {
  const decoded = decodeURIComponent(pathname);
  if (!decoded.startsWith("/") || decoded.includes("..")) throw new Error(`Unsafe sitemap path: ${pathname}`);
  if (decoded === "/") return "index.html";
  return decoded.endsWith("/") ? `${decoded.slice(1)}index.html` : decoded.slice(1);
}

async function expectedReleaseFiles() {
  const tracked = new Set(trackedFiles());
  const expected = new Set(exactPublicFiles);

  const sitemap = await readFile(resolve(repoRoot, "sitemap.xml"), "utf8");
  const urls = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => new URL(match[1]));
  if (urls.length !== 110) throw new Error(`Expected 110 parent sitemap URLs, found ${urls.length}`);
  for (const url of urls) {
    if (url.hostname !== "navinresearch.com") throw new Error(`Unexpected parent sitemap host: ${url.hostname}`);
    expected.add(sitemapOutput(url.pathname));
  }

  const manifest = JSON.parse(await readFile(resolve(repoRoot, "products/site-manifest.json"), "utf8"));
  if (!Array.isArray(manifest) || manifest.length !== 145) throw new Error(`Expected 145 product routes, found ${manifest.length}`);
  for (const entry of manifest) {
    if (!productSlugs.includes(entry.product)) throw new Error(`Unexpected product in manifest: ${entry.product}`);
    const output = normalizePath(entry.output || "");
    if (!output.startsWith(`${entry.product}/`) || !output.endsWith(".html")) throw new Error(`Unsafe product output: ${output}`);
    expected.add(output);
  }

  for (const slug of productSlugs) {
    expected.add(`${slug}/robots.txt`);
    expected.add(`${slug}/sitemap.xml`);
  }

  for (const rule of publicTrees) {
    const matches = [...tracked].filter((file) => file.startsWith(rule.prefix));
    if (!matches.length) throw new Error(`Public asset tree is empty: ${rule.prefix}`);
    for (const file of matches) {
      if (!rule.extensions.has(extname(file).toLowerCase())) throw new Error(`Unexpected file type in public asset tree: ${file}`);
      expected.add(file);
    }
  }

  for (const file of expected) {
    if (!tracked.has(file)) throw new Error(`Allowlisted release file is not tracked: ${file}`);
    if (forbiddenPatterns.some((pattern) => pattern.test(file))) throw new Error(`Forbidden path entered release allowlist: ${file}`);
    const info = await lstat(resolve(repoRoot, file));
    if (!info.isFile() || info.isSymbolicLink()) throw new Error(`Release source must be a regular file: ${file}`);
  }

  return [...expected].sort();
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

export async function verifyRelease(output) {
  const root = safeOutput(output);
  const info = await stat(root).catch(() => null);
  if (!info?.isDirectory()) throw new Error(`Release directory does not exist: ${root}`);

  const expected = await expectedReleaseFiles();
  const actual = await listFiles(root);
  const missing = expected.filter((file) => !actual.includes(file));
  const extra = actual.filter((file) => !expected.includes(file));
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

  const htmlCount = actual.filter((file) => file.endsWith(".html")).length;
  const markdownCount = actual.filter((file) => file.endsWith(".md")).length;
  return { root, files: actual.length, html: htmlCount, markdown: markdownCount, parentUrls: 110, productUrls: 145 };
}

export async function buildRelease(output) {
  const root = safeOutput(output);
  const expected = await expectedReleaseFiles();
  await rm(root, { recursive: true, force: true });
  await mkdir(root, { recursive: true });
  for (const file of expected) {
    const destination = resolve(root, file);
    await mkdir(dirname(destination), { recursive: true });
    await cp(resolve(repoRoot, file), destination, { force: false, errorOnExist: true });
  }
  return verifyRelease(root);
}

async function smokeTest() {
  const temporary = await mkdtemp(resolve(tmpdir(), "navin-release-"));
  try {
    const report = await buildRelease(temporary);
    await writeFile(resolve(temporary, "README.md"), "must fail closed\n", "utf8");
    let rejected = false;
    try {
      await verifyRelease(temporary);
    } catch (error) {
      rejected = /Extra: README\.md/.test(String(error));
    }
    if (!rejected) throw new Error("Release verifier did not reject an injected internal file");
    await rm(resolve(temporary, "README.md"));
    await verifyRelease(temporary);
    return report;
  } finally {
    await rm(temporary, { recursive: true, force: true });
  }
}

async function main() {
  const [command, output] = process.argv.slice(2);
  if (command === "--self-test") {
    const report = await smokeTest();
    console.log(`Release allowlist self-test passed: ${report.files} files, ${report.html} HTML, ${report.markdown} Markdown, ${report.parentUrls + report.productUrls} public URLs.`);
    return;
  }
  if ((command !== "--build" && command !== "--verify") || !output) {
    throw new Error("Usage: node scripts/build-release.mjs --build <output-directory> | --verify <release-directory> | --self-test");
  }
  const report = command === "--build" ? await buildRelease(output) : await verifyRelease(output);
  console.log(`Release ${command === "--build" ? "built and verified" : "verified"}: ${report.root}`);
  console.log(`${report.files} files; ${report.html} HTML; ${report.markdown} Markdown; ${report.parentUrls} parent URLs; ${report.productUrls} product URLs.`);
}

if (process.argv[1] && pathToFileURL(resolve(process.argv[1])).href === import.meta.url) {
  main().catch((error) => {
    console.error(error.message);
    process.exitCode = 1;
  });
}
