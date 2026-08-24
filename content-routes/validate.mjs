import { readFile } from 'node:fs/promises';

const routes = ['blog', 'research', 'docs', 'search', 'vi/blog', 'vi/research', 'vi/docs', 'vi/search', 'zh-cn/blog', 'zh-cn/research', 'zh-cn/docs', 'zh-cn/search'];
const errors = [];
for (const route of routes) {
  const file = `${route}/index.html`;
  const html = await readFile(file, 'utf8');
  const canonical = `https://navinresearch.com/${route}/`;
  if (!html.includes(`<link rel="canonical" href="${canonical}">`)) errors.push(`${file}: canonical missing`);
  for (const lang of ['en', 'vi', 'zh-CN', 'x-default']) if (!html.includes(`hreflang="${lang}"`)) errors.push(`${file}: hreflang ${lang} missing`);
  for (const required of ['<title>', 'name="description"', '<main']) {
    if (!html.includes(required)) errors.push(`${file}: ${required} missing`);
  }
  const prepared = route.startsWith('vi/') ? 'Nội dung đang được chuẩn bị' : route.startsWith('zh-cn/') ? '内容正在准备中' : 'Content is being prepared';
  if (!html.includes(prepared)) errors.push(`${file}: localized preparation notice missing`);
  if (html.includes('application/ld+json') || html.includes('datePublished')) errors.push(`${file}: fabricated schema/date marker found`);
}
const robots = await readFile('robots.txt', 'utf8');
const sitemap = await readFile('sitemap.xml', 'utf8');
if (!robots.includes('Sitemap: https://navinresearch.com/sitemap.xml')) errors.push('robots.txt: sitemap missing');
for (const route of ['/', ...routes.map(route => `/${route}/`)]) if (!sitemap.includes(`https://navinresearch.com${route}`)) errors.push(`sitemap.xml: ${route} missing`);
if (errors.length) { console.error(errors.join('\n')); process.exit(1); }
console.log(`Validated ${routes.length} localized route pages, robots policy, and sitemap URLs.`);
