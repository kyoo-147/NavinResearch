/* Collect the generated site into dist/ so wrangler can upload it as static
   assets. Everything that is source (git, node_modules, scripts, src) stays out. */
import { cpSync, mkdirSync, rmSync, readdirSync, statSync } from "node:fs";
import { join, resolve } from "node:path";

const ROOT = resolve(import.meta.dirname, "..");
const DIST = join(ROOT, "dist");

const SKIP = new Set([
  ".git", ".github", "node_modules", "dist", "scripts", "src",
  "package.json", "package-lock.json", "pnpm-lock.yaml", "wrangler.jsonc",
  ".gitignore", ".DS_Store",
]);

rmSync(DIST, { recursive: true, force: true });
mkdirSync(DIST, { recursive: true });

let files = 0;
for (const entry of readdirSync(ROOT)) {
  if (SKIP.has(entry)) continue;
  const from = join(ROOT, entry);
  const to = join(DIST, entry);
  cpSync(from, to, { recursive: true });
  if (statSync(from).isFile()) files += 1;
}

console.log("dist/ ready:", files, "top-level entries");
