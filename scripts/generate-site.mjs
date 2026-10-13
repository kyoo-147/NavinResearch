import { mkdir, writeFile } from "node:fs/promises";
import { aboutPublication, chapters, experience, legalPages, locales, localePath, releaseRoute, sections, site } from "../site.config.mjs";
import { pageHead } from "./components/page-head.mjs";
import { contentHeader, cookieManageLabel, cookiePreferencesMarkup, escapeHtml, footerSocialIcons, languageLinks, routeFooter, siteDrawer, siteFooter, siteHeader, themePicker } from "./components/site-shell.mjs";
import { catalogProducts } from "./product-data.mjs";
import { blogMarkdownPath, blogPostPath, blogPostReviewedAt, blogPosts, blogSources, renderBlogPost } from "./blog-posts.mjs";
import { routeDetails, routeLinks } from "./route-details.mjs";
import { aboutPageCopy } from "./about-content.mjs";
import { companyPageCopy } from "./company-content.mjs";
import { aboutPreservedPageCopy } from "./about-preserved-content.mjs";
import { people, peoplePageCopy, personPath } from "./people-data.mjs";

const localeEntries = Object.entries(locales);
const homeAssetRevision = "20261013-14";
const head = (localeKey, title, description, suffix = "", styles = ["/content-routes/route-foundation.css"], scripts = [], image = "/assets/field-4.webp") => pageHead({
  localeKey,
  title,
  description,
  suffix,
  styles: Array.isArray(styles) ? styles : [styles],
  scripts: Array.isArray(scripts) ? scripts : [scripts],
  revision: homeAssetRevision,
  image,
});

const productCopy = {
  en: { eyebrow: "PRODUCT SYSTEMS / 01—13", title: "Research, made operational.", lede: "Thirteen independent product programs. Each has its own interface, evidence standard, and path to availability.", status: "Current status", product: "PRODUCT", research: "IN RESEARCH", homeLabel: "Product systems", homeTitle: "Models, software, and intelligent systems designed to make AI more capable, adaptable, and useful.", homeLink: "" },
  vi: { eyebrow: "HỆ THỐNG SẢN PHẨM / 01—13", title: "Nghiên cứu được đưa vào vận hành.", lede: "Mười ba chương trình sản phẩm độc lập. Mỗi sản phẩm có giao diện, chuẩn bằng chứng và lộ trình tiếp cận riêng.", status: "Trạng thái hiện tại", product: "SẢN PHẨM", research: "ĐANG NGHIÊN CỨU", homeLabel: "Hệ thống sản phẩm", homeTitle: "Các mô hình, phần mềm và hệ thống thông minh được thiết kế để AI trở nên mạnh mẽ, thích ứng và hữu ích hơn.", homeLink: "" },
  "zh-cn": { eyebrow: "产品系统 / 01—13", title: "让研究进入实际运行。", lede: "十三个独立产品计划，每一个都有自己的界面、证据标准与开放路径。", status: "当前状态", product: "产品", research: "研究中", homeLabel: "产品系统", homeTitle: "为让 AI 更强大、更具适应性且更有用而设计的模型、软件与智能系统。", homeLink: "" },
};

const notesCopy = {
  en: { eyebrow: "NAVIN RESEARCH / NOTES", title: "Notes", lede: "Working notes on AI systems, methods, and the questions that shape what we build.", browse: "Browse topics", all: "All notes", featured: "Featured note", latest: "Latest notes", older: "Older notes", filter: "Filter", sort: "Sort", newest: "Newest", oldest: "Oldest", gridView: "Grid view", listView: "List view", read: "Read note", readMore: "Read more", reviewed: "Reviewed" },
  vi: { eyebrow: "NAVIN RESEARCH / GHI CHÚ", title: "Ghi chú", lede: "Những ghi chép về hệ thống AI, phương pháp và các câu hỏi định hình những gì chúng tôi xây dựng.", browse: "Chủ đề", all: "Tất cả ghi chú", featured: "Ghi chú nổi bật", latest: "Ghi chú mới", older: "Ghi chú cũ hơn", filter: "Lọc", sort: "Sắp xếp", newest: "Mới nhất", oldest: "Cũ nhất", gridView: "Dạng lưới", listView: "Dạng danh sách", read: "Đọc ghi chú", readMore: "Xem thêm", reviewed: "Đã xem xét" },
  "zh-cn": { eyebrow: "NAVIN RESEARCH / 笔记", title: "笔记", lede: "关于 AI 系统、方法，以及塑造我们所构建事物的问题记录。", browse: "浏览主题", all: "全部笔记", featured: "精选笔记", latest: "最新笔记", older: "较早笔记", filter: "筛选", sort: "排序", newest: "最新", oldest: "最早", gridView: "网格视图", listView: "列表视图", read: "阅读笔记", readMore: "阅读更多", reviewed: "已审阅" },
};
function productUrl(product) {
  return product.url || `https://${product.slug}.navinresearch.com/`;
}

function productGrid(localeKey, compact = false) {
  const copy = productCopy[localeKey];
  return catalogProducts.map((product, index) => {
    const localized = product.catalogCopy?.[localeKey] || product;
    const catalogStatus = copy[product.catalogStatus];
    if (!catalogStatus) throw new Error(`Missing catalog status for ${product.slug}`);
    return `<article class="product-entry${compact ? " product-entry--compact" : ""}"><a href="${escapeHtml(productUrl(product))}"><span class="product-entry__number">${String(index + 1).padStart(2, "0")}</span><span class="product-entry__identity"><small>${escapeHtml(localized.eyebrow)}</small><strong>${escapeHtml(product.name)}</strong></span><span class="product-entry__statement">${escapeHtml(localized.thesis)}</span><span class="product-entry__state"><small>${escapeHtml(copy.status)}</small>${escapeHtml(catalogStatus)}</span><span class="product-entry__arrow" aria-hidden="true">↗</span></a></article>`;
  }).join("\n");
}

function homeTemplate(localeKey) {
  const locale = locales[localeKey];
  const home = locale.home;
  const ui = experience[localeKey];
  const title = home.title.map(escapeHtml).join("<br>");
  return `<!DOCTYPE html>
<html lang="${locale.htmlLang}">
  <head>
${head(localeKey, locale.meta.title, locale.meta.description, "", [`/styles.css?v=${homeAssetRevision}`, "/content-routes/route-foundation.css"], [`/script.js?v=${homeAssetRevision}`, "/content-routes/theme.js"])}  </head>
  <body class="home-page content-page">
    <div class="field" aria-hidden="true">${[1,2,3,4,5].map((n) => `<div class="field__layer field__layer--${n}"></div>`).join("")}<div class="field__wash"></div><div class="field__grain"></div></div>
    <div class="shell">
      ${siteHeader(localeKey)}
      ${siteDrawer(localeKey)}
      <main>
        <section class="hero">
          <div class="hero__index" aria-hidden="true">NR — 00</div>
          <div class="hero__content"><p class="eyebrow">${escapeHtml(ui.chapterEyebrow)}</p><h1>${title}</h1><p class="statement">${escapeHtml(home.statement)}</p></div>
          <aside class="contact" aria-label="${escapeHtml(home.contactAria)}"><p>${escapeHtml(home.contactLabel)}</p><h2>${escapeHtml(home.contactTitle)}</h2><nav class="contact__links" aria-label="${escapeHtml(home.contactLinksAria)}"><a href="mailto:${site.email}"><span>Email</span><span aria-hidden="true">↗</span></a><a href="${site.linkedin}" target="_blank" rel="noopener noreferrer"><span>LinkedIn</span><span aria-hidden="true">↗</span></a><a href="${site.github}" target="_blank" rel="noopener noreferrer"><span>GitHub</span><span aria-hidden="true">↗</span></a></nav></aside>
        </section>
        <section class="home-products" aria-labelledby="home-products-title"><div class="home-products__intro"><p>${escapeHtml(productCopy[localeKey].homeLabel)}</p><h2 id="home-products-title">${escapeHtml(productCopy[localeKey].homeTitle)}</h2>${productCopy[localeKey].homeLink ? `<a href="${localePath(localeKey, "products")}">${escapeHtml(productCopy[localeKey].homeLink)} <span aria-hidden="true">→</span></a>` : ""}</div><div class="product-directory product-directory--home">${productGrid(localeKey, true)}</div></section>
        <section class="wealth" id="wealth-of-nature" aria-labelledby="wealth-title">
          <div class="wealth__mark" aria-hidden="true"><span></span></div>
          <p class="wealth__label">${escapeHtml(ui.wealth.label)}</p>
          <h2 id="wealth-title">${escapeHtml(ui.wealth.title)}</h2>
          <span class="wealth__rule" aria-hidden="true"></span>
          <p class="wealth__statement">${escapeHtml(ui.wealth.statement)}</p>
        </section>
      </main>
      ${siteFooter(localeKey)}
    </div>
  </body>
</html>
`;
}

function routeNav(localeKey, current) {
  const locale = locales[localeKey];
  const navSections = ["research", "models", "products", "publications", "notes", "releases", "about", "careers", "contact", "docs", "search"];
  return navSections.map((section) => `<a href="${localePath(localeKey, section)}"${section === current ? ' aria-current="page"' : ""}>${escapeHtml(locale.routes[section].title)}</a>`).join("\n          ");
}

function localizedRouteHref(localeKey, href) {
  if (!href.startsWith("/")) return href;
  if (href.startsWith("/blog/")) {
    const parts = href.split("/").filter(Boolean);
    return parts.length === 3 ? blogPostPath({ category: parts[1], slug: parts[2].replace(/\.md$/, "") }, localeKey) : href;
  }
  const suffix = href.replace(/^\//, "").replace(/\/$/, "");
  return localePath(localeKey, suffix);
}

function routeFeatureMarkup(localeKey, section) {
  const details = routeDetails[localeKey]?.[section];
  if (!details) return "";
  const links = routeLinks[section] || [];
  const items = details.map(([label, title, body], index) => {
    const href = links[index];
    const attrs = href?.startsWith("http") ? ' target="_blank" rel="noopener noreferrer"' : "";
    return `<article class="route-feature"><p>${escapeHtml(label)}</p><h2>${escapeHtml(title)}</h2><span>${escapeHtml(body)}</span>${href ? `<a href="${escapeHtml(localizedRouteHref(localeKey, href))}"${attrs}>${escapeHtml(title)} <span aria-hidden="true">→</span></a>` : ""}</article>`;
  }).join("");
  return `<section class="route-features route-features--${section}" aria-label="${escapeHtml(locales[localeKey].routes[section].title)}">${items}</section>`;
}

function aboutIntroMetaMarkup(localeKey) {
  const date = aboutPublication.publishedAt
    ? new Intl.DateTimeFormat(locales[localeKey].htmlLang, { year: "numeric", month: "long", day: "numeric", timeZone: "UTC" }).format(new Date(`${aboutPublication.publishedAt}T00:00:00Z`))
    : "";
  return date ? `<div class="about-intro__meta"><time datetime="${escapeHtml(aboutPublication.publishedAt)}">${escapeHtml(date)}</time></div>` : "";
}

const aboutRelatedOrder = ["multi-agent-orchestration-patterns", "agent-memory", "multimodal-rag", "prompt-injection-defense", "reduce-llm-latency", "human-approval-gates", "single-agent-before-multi-agent", "agent-handoffs", "reasoning-models-vs-chat-models"];
const noteImageBySlug = {
  "multi-agent-orchestration-patterns": "/assets/notes-01.png",
  "agent-memory": "/assets/notes-02.png",
  "multimodal-rag": "/assets/notes-03.png",
  "prompt-injection-defense": "/assets/notes-04.png",
  "reduce-llm-latency": "/assets/notes-05.png",
  "human-approval-gates": "/assets/notes-06.png",
  "agent-handoffs": "/assets/notes-07.png",
  "reasoning-models-vs-chat-models": "/assets/notes-08.png",
  "agent-tool-design": "/assets/notes-09.png",
  "single-agent-before-multi-agent": "/assets/notes-10.png",
};
const noteImageSequence = Object.values(noteImageBySlug);
const aboutRelatedImages = {
  agents: "/assets/field-1.webp",
  reasoning: "/assets/field-2.webp",
  models: "/assets/field-3.webp",
  multimodal: "/assets/field-4.webp",
  inference: "/assets/field-5.webp",
  "safety-evaluation": "/assets/field-1.webp",
};

function aboutRelatedPosts() {
  const posts = new Map(blogPosts.map((post) => [post.slug, post]));
  return aboutRelatedOrder.map((slug) => posts.get(slug)).filter(Boolean);
}

const blogCategoryLabels = {
  en: { agents: "Agents", reasoning: "Reasoning", models: "Models", multimodal: "Multimodal", inference: "Inference", "safety-evaluation": "Safety Evaluation" },
  vi: { agents: "Tác nhân", reasoning: "Suy luận", models: "Mô hình", multimodal: "Đa phương thức", inference: "Suy luận hệ thống", "safety-evaluation": "Đánh giá an toàn" },
  "zh-cn": { agents: "智能体", reasoning: "推理", models: "模型", multimodal: "多模态", inference: "推理服务", "safety-evaluation": "安全评估" },
};
const blogArticleUi = {
  en: { introduction: "Introduction", shortAnswer: "Short answer", implementation: "Implementation steps", validation: "Validation checklist", mistakes: "Common mistakes", decision: "Practical decision", sources: "Official sources", practicalBody: "Ship the smallest design that passes the checks above. Record the model, prompt, tool, dataset, and runtime versions used in testing so later changes can be compared rather than guessed. Recheck the linked documentation before relying on provider-specific limits, model names, prices, or preview features; those details change more quickly than the engineering principles in this note." },
  vi: { introduction: "Giới thiệu", shortAnswer: "Tóm tắt", implementation: "Các bước triển khai", validation: "Danh sách kiểm tra", mistakes: "Sai lầm thường gặp", decision: "Quyết định thực tế", sources: "Nguồn chính thức", practicalBody: "Hãy triển khai thiết kế nhỏ nhất vượt qua các bước kiểm tra ở trên. Ghi lại phiên bản mô hình, prompt, công cụ, dữ liệu và runtime đã dùng để kiểm thử để những thay đổi sau này có thể được so sánh thay vì phỏng đoán. Kiểm tra lại tài liệu được liên kết trước khi dựa vào giới hạn, tên mô hình, giá hoặc tính năng thử nghiệm của nhà cung cấp." },
  "zh-cn": { introduction: "简介", shortAnswer: "简要回答", implementation: "实施步骤", validation: "验证清单", mistakes: "常见错误", decision: "实际决策", sources: "官方来源", practicalBody: "先交付能够通过上述检查的最小设计。记录测试中使用的模型、提示词、工具、数据集与运行时版本，让后续变化可以被比较而不是被猜测。依赖供应商的限制、模型名称、价格或预览功能之前，请重新检查链接文档；这些细节变化往往快于本文的工程原则。" },
};

function blogCopy(post, localeKey) {
  return post.translations?.[localeKey] || post;
}

function relatedCategoryLabel(category, localeKey = "en") {
  return blogCategoryLabels[localeKey]?.[category] || category.split("-").map((word) => word.charAt(0).toUpperCase() + word.slice(1)).join(" ");
}

function relatedDateLabel(localeKey, label) {
  const locale = locales[localeKey];
  const date = new Intl.DateTimeFormat(locale.htmlLang, { year: "numeric", month: "short", day: "numeric", timeZone: "UTC" }).format(new Date(`${blogPostReviewedAt}T00:00:00Z`));
  return `${label} · ${date}`;
}

function aboutRelatedMarkup(localeKey) {
  const copy = aboutPageCopy[localeKey];
  const cards = aboutRelatedPosts().map((post) => { const postCopy = blogCopy(post, localeKey); return `<article class="about-related__item" data-related-card><a href="${escapeHtml(blogPostPath(post, localeKey))}" draggable="false"><img src="${escapeHtml(noteImageBySlug[post.slug] || aboutRelatedImages[post.category] || "/assets/field-1.webp")}" alt="" width="1672" height="941" loading="lazy" decoding="async"><div><h3>${escapeHtml(postCopy.title)}</h3><p class="about-related__meta"><span>${escapeHtml(relatedCategoryLabel(post.category, localeKey))}</span><time datetime="${escapeHtml(blogPostReviewedAt)}">${escapeHtml(relatedDateLabel(localeKey, copy.related.dateLabel))}</time></p></div></a></article>`; }).join("");
  return `<section class="about-related" aria-labelledby="about-related-title" data-related-carousel><header><h2 id="about-related-title">${escapeHtml(copy.related.title)}</h2><div class="about-related__controls"><button type="button" data-related-previous aria-controls="about-related-track" aria-label="${escapeHtml(copy.related.previous)}"><svg viewBox="0 0 16 16" aria-hidden="true"><path d="m10 3-5 5 5 5"></path></svg></button><button type="button" data-related-next aria-controls="about-related-track" aria-label="${escapeHtml(copy.related.next)}"><svg viewBox="0 0 16 16" aria-hidden="true"><path d="m6 3 5 5-5 5"></path></svg></button><a class="about-related__view-all" href="${localePath(localeKey, copy.related.viewAllPath)}">${escapeHtml(copy.related.viewAll)}</a></div></header><div class="about-related__viewport" data-related-viewport tabindex="0" role="region" aria-label="${escapeHtml(copy.related.title)}"><div class="about-related__track" id="about-related-track" data-related-track>${cards}</div></div></section>`;
}

function notesDate(localeKey) {
  const locale = locales[localeKey];
  return new Intl.DateTimeFormat(locale.htmlLang, { year: "numeric", month: "short", day: "numeric", timeZone: "UTC" }).format(new Date(`${blogPostReviewedAt}T00:00:00Z`));
}

function notesCard(localeKey, post, variant = "", index = 0) {
  const image = noteImageBySlug[post.slug] || noteImageSequence[index % noteImageSequence.length] || aboutRelatedImages[post.category] || "/assets/field-1.webp";
  const copy = notesCopy[localeKey];
  const postCopy = blogCopy(post, localeKey);
  return `<article class="notes-card${variant ? ` notes-card--${variant}` : ""}" data-notes-card data-notes-category="${escapeHtml(relatedCategoryLabel(post.category, localeKey))}"><a href="${escapeHtml(blogPostPath(post, localeKey))}"><div class="notes-card__media"><img src="${escapeHtml(image)}" alt="" width="960" height="540" loading="lazy" decoding="async"></div><div class="notes-card__copy"><p class="notes-card__category">${escapeHtml(relatedCategoryLabel(post.category, localeKey))}</p><h2>${escapeHtml(postCopy.title)}</h2><p class="notes-card__description">${escapeHtml(postCopy.description)}</p><p class="notes-card__meta"><span>${escapeHtml(copy.reviewed)}</span><time datetime="${escapeHtml(blogPostReviewedAt)}">${escapeHtml(notesDate(localeKey))}</time></p></div></a></article>`;
}

function notesTemplate(localeKey) {
  const locale = locales[localeKey];
  const copy = notesCopy[localeKey];
  const topics = [...new Set(blogPosts.map((post) => relatedCategoryLabel(post.category, localeKey)))];
  const featured = notesCard(localeKey, blogPosts[0], "featured", 0);
  const side = blogPosts.slice(1, 3).map((post, index) => notesCard(localeKey, post, "compact", index + 1)).join("");
  const grid = blogPosts.slice(3).map((post, index) => notesCard(localeKey, post, "", index + 3)).join("");
  return `<!DOCTYPE html><html lang="${locale.htmlLang}"><head>
${head(localeKey, `${locale.routes.notes.title} — ${site.name}`, locale.routes.notes.description, "notes", "/content-routes/route-foundation.css")}  </head><body class="route-page content-page content-notes"><div class="content-field" aria-hidden="true"></div><div class="route-page__shell">
    ${contentHeader(localeKey, "notes")}
    <main id="main-content" class="notes-main"><header class="notes-hero"><h1>${escapeHtml(copy.title)}</h1></header><div class="notes-browsebar"><nav id="notes-topic-controls" class="notes-topics" aria-label="${escapeHtml(copy.browse)}"><span class="notes-topics__label">${escapeHtml(copy.browse)}</span><button type="button" class="notes-topics__tab is-active" data-notes-topic="all">${escapeHtml(copy.all)}</button>${topics.map((topic) => `<button type="button" class="notes-topics__tab" data-notes-topic="${escapeHtml(topic)}">${escapeHtml(topic)}</button>`).join("")}</nav><div class="notes-controls" aria-label="${escapeHtml(copy.browse)}"><div class="notes-controls__primary"><button type="button" data-notes-filter aria-controls="notes-topic-controls" aria-expanded="true"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 7h16M7 12h10M10 17h4"></path><circle cx="9" cy="7" r="1.5"></circle><circle cx="15" cy="12" r="1.5"></circle><circle cx="11" cy="17" r="1.5"></circle></svg><span>${escapeHtml(copy.filter)}</span></button><button type="button" data-notes-sort aria-pressed="false"><span data-notes-sort-label>${escapeHtml(copy.sort)}</span><svg viewBox="0 0 16 16" aria-hidden="true"><path d="m4 6 4 4 4-4"></path></svg></button></div><div class="notes-controls__views" role="group" aria-label="${escapeHtml(copy.browse)}"><button type="button" class="is-active" data-notes-view="grid" aria-label="${escapeHtml(copy.gridView)}" aria-pressed="true"><svg viewBox="0 0 16 16" aria-hidden="true"><rect x="1.5" y="1.5" width="5" height="5" rx=".5"></rect><rect x="9.5" y="1.5" width="5" height="5" rx=".5"></rect><rect x="1.5" y="9.5" width="5" height="5" rx=".5"></rect><rect x="9.5" y="9.5" width="5" height="5" rx=".5"></rect></svg></button><button type="button" data-notes-view="list" aria-label="${escapeHtml(copy.listView)}" aria-pressed="false"><svg viewBox="0 0 16 16" aria-hidden="true"><path d="M5 3h9M5 8h9M5 13h9"></path><circle cx="2.2" cy="3" r=".8"></circle><circle cx="2.2" cy="8" r=".8"></circle><circle cx="2.2" cy="13" r=".8"></circle></svg></button></div></div></div><section class="notes-latest" aria-labelledby="notes-latest-title"><header class="notes-section-heading"><p class="route-page__eyebrow">${escapeHtml(copy.latest)}</p><h2 id="notes-latest-title">${escapeHtml(copy.latest)}</h2></header><section class="route-features notes-featured" aria-labelledby="notes-featured-title"><h2 id="notes-featured-title" class="sr-only">${escapeHtml(copy.featured)}</h2>${featured}<div class="notes-featured__side">${side}</div></section></section><section class="notes-grid" id="notes-grid" aria-labelledby="notes-older-title"><header class="notes-section-heading"><p class="route-page__eyebrow">${escapeHtml(copy.older)}</p><h2 id="notes-older-title">${escapeHtml(copy.older)}</h2></header><div class="notes-grid__items" data-notes-items>${grid}</div><button type="button" class="notes-more" data-notes-more>${escapeHtml(copy.readMore)}</button></section></main>
    ${routeFooter(localeKey, "notes")}
  </div><script src="/content-routes/notes.js?v=${homeAssetRevision}" defer></script></body></html>`;
}

function blogTemplate(localeKey, post) {
  const locale = locales[localeKey];
  const aboutCopy = aboutPageCopy[localeKey];
  const article = blogCopy(post, localeKey);
  const ui = blogArticleUi[localeKey];
  const reviewedAt = new Intl.DateTimeFormat(locale.htmlLang, { year: "numeric", month: "long", day: "numeric", timeZone: "UTC" }).format(new Date(`${blogPostReviewedAt}T00:00:00Z`));
  const category = relatedCategoryLabel(post.category, localeKey);
  const image = noteImageBySlug[post.slug] || aboutRelatedImages[post.category] || "/assets/field-1.webp";
  const sourceLinks = post.sources.map((key) => {
    const source = blogSources[key];
    return source ? `<li><a href="${escapeHtml(source[1])}" target="_blank" rel="noopener noreferrer">${escapeHtml(source[0])} <span aria-hidden="true">↗</span></a></li>` : "";
  }).join("");
  const section = (id, label, title, content) => `<section class="about-section" id="${id}" aria-labelledby="blog-${id}-title"><div class="about-section__meta" data-reading-exclude><p>${escapeHtml(label)}</p></div><div class="about-section__body"><h2 id="blog-${id}-title">${escapeHtml(title)}</h2>${content}</div></section>`;
  const sectionContent = (item) => `${item.paragraphs.map((paragraph) => `<p>${escapeHtml(paragraph)}</p>`).join("")}${item.points?.length ? `<ul>${item.points.map((point) => `<li>${escapeHtml(point)}</li>`).join("")}</ul>` : ""}`;
  const articleSections = article.sections
    ? article.sections.map((item, index) => section(`blog-section-${index + 1}`, item.label, item.title, sectionContent(item)))
    : [
      section("implementation-steps", `01. ${ui.implementation.toUpperCase()}`, ui.implementation, `<ol>${article.steps.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ol>`),
      section("validation-checklist", `02. ${ui.validation.toUpperCase()}`, ui.validation, `<ul>${article.checks.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>`),
      section("common-mistakes", `03. ${ui.mistakes.toUpperCase()}`, ui.mistakes, `<ul>${article.pitfalls.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>`),
      section("practical-decision", `04. ${ui.decision.toUpperCase()}`, ui.decision, `<p>${escapeHtml(ui.practicalBody)}</p>`),
    ];
  const sourceSection = section("official-sources", `${String(articleSections.length + 1).padStart(2, "0")}. ${ui.sources.toUpperCase()}`, ui.sources, `<ul>${sourceLinks}</ul>`);
  const tocLinks = article.sections
    ? article.sections.map((item, index) => `<a href="#blog-section-${index + 1}">${escapeHtml(item.title)}</a>`).join("")
    : `<a href="#implementation-steps">${escapeHtml(ui.implementation)}</a><a href="#validation-checklist">${escapeHtml(ui.validation)}</a><a href="#common-mistakes">${escapeHtml(ui.mistakes)}</a><a href="#official-sources">${escapeHtml(ui.sources)}</a>`;
  return `<!DOCTYPE html><html lang="${locale.htmlLang}"><head>
${head(localeKey, `${article.title} — ${site.name}`, article.description, `blog/${post.category}/${post.slug}`, ["/content-routes/route-foundation.css"], ["/content-routes/about-article.js", "/content-routes/about-carousel.js"], image)}  </head><body class="route-page content-page content-about content-blog content-blog-article"><div class="content-field" aria-hidden="true"></div><div class="route-page__shell">
    ${contentHeader(localeKey, "blog")}
    <main id="main-content" class="about-main content-main"><article class="about-article" data-about-article><header class="about-intro content-copy"><p class="route-page__eyebrow">${escapeHtml(category)} / NAVIN RESEARCH</p><h1>${escapeHtml(article.title)}</h1><p class="route-page__lede about-intro__lede--italic">${escapeHtml(article.description)}</p><div class="about-intro__meta"><time datetime="${escapeHtml(blogPostReviewedAt)}">${escapeHtml(reviewedAt)}</time></div></header><figure class="about-hero"><img src="${escapeHtml(image)}" alt="" width="1672" height="941" decoding="async" fetchpriority="high"></figure>${aboutToolbarMarkup({ toolbar: aboutCopy.toolbar })}<div class="about-reading-layout"><aside class="about-index content-index" aria-label="${escapeHtml(aboutCopy.indexLabel)}"><p>${escapeHtml(aboutCopy.indexLabel)}</p><nav aria-label="${escapeHtml(aboutCopy.indexLabel)}"><a href="#blog-opening">${escapeHtml(ui.introduction)}</a>${tocLinks}<a href="#official-sources">${escapeHtml(ui.sources)}</a></nav></aside><article class="about-prose" data-article-content><div class="about-prose__opening" id="blog-opening"><p>${escapeHtml(article.description)}</p><p><strong>${escapeHtml(ui.shortAnswer)}:</strong> ${escapeHtml(article.answer)}</p></div><div class="route-features about-sections">${articleSections.join("")}${sourceSection}</div></article></div></article>${aboutRelatedMarkup(localeKey)}</main>
    ${routeFooter(localeKey, `blog/${post.category}/${post.slug}`)}
  </div></body></html>`;
}
function aboutToolbarMarkup(copy) {
  const toolbar = copy.toolbar;
  const backLabel = toolbar.seekBack || "Back 15 seconds";
  const forwardLabel = toolbar.seekForward || "Forward 15 seconds";
  return `<div class="about-article__toolbar" data-about-toolbar data-listen-label="${escapeHtml(toolbar.listen)}" data-pause-label="${escapeHtml(toolbar.pause)}" data-resume-label="${escapeHtml(toolbar.resume)}" data-reading-label="${escapeHtml(toolbar.readingTime)}" data-unsupported-label="${escapeHtml(toolbar.unsupported)}" data-finished-label="${escapeHtml(toolbar.finished)}" data-shared-label="${escapeHtml(toolbar.shared)}" data-copied-label="${escapeHtml(toolbar.copied)}" data-share-error-label="${escapeHtml(toolbar.shareError)}" data-seek-back-label="${escapeHtml(backLabel)}" data-seek-forward-label="${escapeHtml(forwardLabel)}" data-speed-label="${escapeHtml(toolbar.speed || "Playback speed")}"><button type="button" data-listen aria-pressed="false"><span class="about-article__play-icon" data-listen-icon aria-hidden="true"><svg data-icon-play viewBox="0 0 24 24" focusable="false"><path d="M8 5.5v13l10-6.5-10-6.5Z"></path></svg><svg data-icon-pause viewBox="0 0 24 24" focusable="false"><path d="M7 5.5h3.5v13H7zM13.5 5.5H17v13h-3.5z"></path></svg></span><span data-listen-label>${escapeHtml(toolbar.listen)}</span></button><span class="about-article__toolbar-elapsed" data-listen-elapsed aria-live="off">0:00</span><span class="about-article__toolbar-reading" data-reading-time>${escapeHtml(toolbar.readingTime)}</span><span class="about-article__toolbar-divider" aria-hidden="true"></span><button type="button" class="about-article__toolbar-icon" data-seek-back data-audio-control aria-label="${escapeHtml(backLabel)}" title="${escapeHtml(backLabel)}"><svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M9.5 17a7 7 0 1 1 0-10"></path><path d="m9.5 4-4 3 4 3"></path></svg><span aria-hidden="true">15</span></button><button type="button" class="about-article__toolbar-icon" data-seek-forward data-audio-control aria-label="${escapeHtml(forwardLabel)}" title="${escapeHtml(forwardLabel)}"><svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M14.5 17a7 7 0 1 0 0-10"></path><path d="m14.5 4 4 3-4 3"></path></svg><span aria-hidden="true">15</span></button><button type="button" class="about-article__toolbar-speed" data-speed data-audio-control aria-label="${escapeHtml(toolbar.speed || "Playback speed")}" title="${escapeHtml(toolbar.speed || "Playback speed")}">1x</button><button type="button" data-share><svg class="about-article__share-icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M7 17 17 7"></path><path d="M9 7h8v8"></path></svg><span>${escapeHtml(toolbar.share)}</span></button><span class="about-article__toolbar-status" data-toolbar-status role="status" aria-live="polite"></span></div>`;
}

function aboutTemplate(localeKey, { light = false } = {}) {
  const locale = locales[localeKey];
  const copy = aboutPageCopy[localeKey];
  const routeSection = light ? "about-light" : "about";
  const bodyClass = light ? "content-about content-about-light" : "content-about";
  const routeStyles = light ? ["/content-routes/route-foundation.css", "/content-routes/about-light-editorial.css"] : "/content-routes/route-foundation.css";
  const sectionLinks = copy.sections.map((section) => `<a href="#${escapeHtml(section.id)}">${escapeHtml(section.navLabel)}</a>`).join("\n              ");
  const introParagraphs = Array.isArray(copy.intro) ? copy.intro : [copy.intro];
  const introMarkup = introParagraphs.map((paragraph) => `<p>${escapeHtml(paragraph)}</p>`).join("");
  const sectionsMarkup = copy.sections.map((section) => {
    const paragraphs = section.paragraphs.map((paragraph) => `<p>${escapeHtml(paragraph)}</p>`).join("");
    const list = section.list ? `<ul>${section.list.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>` : "";
    const links = section.links ? `<nav class="about-section__links" data-reading-exclude aria-label="${escapeHtml(section.navLabel)}">${section.links.map((link) => `<a href="${escapeHtml(localePath(localeKey, link.path))}">${escapeHtml(link.label)} <span aria-hidden="true">→</span></a>`).join("")}</nav>` : "";
    const closing = section.closing ? `<p class="about-section__closing"><strong>${escapeHtml(section.closing)}</strong></p>` : "";
    return `<section class="about-section" id="${escapeHtml(section.id)}" aria-labelledby="about-${escapeHtml(section.id)}-title"><div class="about-section__meta" data-reading-exclude><p>${escapeHtml(section.label)}</p></div><div class="about-section__body"><h2 id="about-${escapeHtml(section.id)}-title">${escapeHtml(section.title)}</h2>${paragraphs}${list}${links}${closing}</div></section>`;
  }).join("\n");
  return `<!DOCTYPE html><html lang="${locale.htmlLang}"><head>
${head(localeKey, `${locale.routes[routeSection].title} — ${site.name}`, locale.routes[routeSection].description, routeSection, routeStyles, ["/content-routes/about-nav.js", "/content-routes/about-article.js", "/content-routes/about-carousel.js"], "/assets/about/navin-introduction-banner.png")}  </head><body class="route-page content-page ${bodyClass}"><div class="content-field" aria-hidden="true"></div><div class="route-page__shell">
    ${contentHeader(localeKey, "about", routeSection)}
    <main id="main-content" class="about-main content-main"><article class="about-article" data-about-article><header class="about-intro content-copy"><p class="route-page__eyebrow">${escapeHtml(copy.eyebrow)}</p><h1>${escapeHtml(copy.title)}</h1><p class="route-page__lede${copy.ledeItalic ? " about-intro__lede--italic" : ""}">${escapeHtml(copy.lede)}</p>${aboutIntroMetaMarkup(localeKey)}</header><figure class="about-hero"><img src="/assets/about/navin-introduction-banner.png" alt="" width="1672" height="941" decoding="async" fetchpriority="high"></figure>${aboutToolbarMarkup(copy)}<div class="about-reading-layout"><aside class="about-index content-index" aria-label="${escapeHtml(copy.indexLabel)}"><p>${escapeHtml(copy.indexLabel)}</p><nav aria-label="${escapeHtml(copy.indexLabel)}">${sectionLinks}</nav></aside><article class="about-prose" data-article-content><div class="about-prose__opening">${introMarkup}</div><div class="route-features about-sections">${sectionsMarkup}</div></article></div></article>${aboutRelatedMarkup(localeKey)}</main>
    ${routeFooter(localeKey, routeSection)}
  </div></body></html>
`;
}

function companyFooter(localeKey) {
  const copy = companyPageCopy[localeKey];
  const groups = copy.footer.groups.map((group) => `<section><h2>${escapeHtml(group.label)}</h2><nav aria-label="${escapeHtml(group.label)}">${group.links.map((link) => `<a href="${escapeHtml(localePath(localeKey, link.path))}">${escapeHtml(link.label)}</a>`).join("")}</nav></section>`).join("");
  return `<footer class="route-page__footer content-footer company-footer"><div class="company-footer__grid">${groups}<section><h2>${escapeHtml(copy.footer.connect)}</h2><nav aria-label="${escapeHtml(copy.footer.connect)}"><a href="mailto:${site.email}">${escapeHtml(copy.footer.email)}</a><a href="${site.linkedin}" target="_blank" rel="noopener noreferrer">LinkedIn</a><a href="${site.github}" target="_blank" rel="noopener noreferrer">GitHub</a></nav><div class="content-footer__legal-group"><h2>${escapeHtml(copy.footer.legal)}</h2><nav aria-label="${escapeHtml(copy.footer.legal)}"><a href="${localePath(localeKey, "privacy-policy")}">${escapeHtml(copy.footer.privacy)}</a><a href="${localePath(localeKey, "terms-of-use")}">${escapeHtml(copy.footer.terms)}</a></nav></div></section></div><div class="company-footer__bottom"><p class="content-footer__copyright">© ${new Date().getUTCFullYear()} NAVIN RESEARCH <button type="button" class="manage-cookies" data-cookie-open>${escapeHtml(cookieManageLabel(localeKey))}</button></p>${footerSocialIcons()}<div class="content-footer__preferences">${themePicker(localeKey)}${languageLinks(localeKey, "company")}</div></div></footer>${cookiePreferencesMarkup(localeKey)}`;
}

function companyTemplate(localeKey) {
  const locale = locales[localeKey];
  const copy = companyPageCopy[localeKey];
  const toc = copy.sections.map((section) => `<a href="#${escapeHtml(section.id)}">${escapeHtml(section.title)}</a>`).join("");
  const intro = copy.intro.map((paragraph) => `<p>${escapeHtml(paragraph)}</p>`).join("");
  const sectionsMarkup = copy.sections.map((section) => {
    const paragraphs = section.paragraphs.map((paragraph) => `<p>${escapeHtml(paragraph)}</p>`).join("");
    const links = section.links ? `<nav class="company-prose__links" aria-label="${escapeHtml(section.title)}">${section.links.map((link) => `<a href="${escapeHtml(localePath(localeKey, link.path))}">${escapeHtml(link.label)} <span aria-hidden="true">→</span></a>`).join("")}</nav>` : "";
    return `<section id="${escapeHtml(section.id)}" class="company-prose__section" aria-labelledby="company-${escapeHtml(section.id)}-title"><h2 id="company-${escapeHtml(section.id)}-title">${escapeHtml(section.title)}</h2>${paragraphs}${links}</section>`;
  }).join("");
  const related = copy.related.map((item) => `<article class="company-related__item"><a href="${escapeHtml(localePath(localeKey, item.path))}"><img src="${escapeHtml(item.image)}" alt="${escapeHtml(item.alt)}" width="960" height="540" loading="lazy" decoding="async"><div><p>${escapeHtml(item.category)}</p><h3>${escapeHtml(item.title)}</h3><span>${escapeHtml(item.description)}</span><strong>Explore <i aria-hidden="true">↗</i></strong></div></a></article>`).join("");
  return `<!DOCTYPE html><html lang="${locale.htmlLang}"><head>
${head(localeKey, `${copy.title} — ${site.name}`, locale.routes.company.description, "company", ["/content-routes/route-foundation.css", "/content-routes/company-editorial.css"])}  </head><body class="route-page content-page content-company"><div class="content-field" aria-hidden="true"></div><div class="route-page__shell">
    ${contentHeader(localeKey, "company")}
    <main id="main-content" class="company-main"><article class="company-article"><header class="company-article__header"><p class="company-article__category">${escapeHtml(copy.category)}</p><h1>${escapeHtml(copy.title)}</h1><p class="company-article__subtitle">${escapeHtml(copy.subtitle)}</p></header><figure class="company-hero"><img src="/assets/about/navin-introduction-banner.png" alt="${escapeHtml(copy.bannerAlt)}" width="1672" height="941" decoding="async"></figure><div class="company-reading-layout"><aside class="company-toc" aria-label="${escapeHtml(copy.contentsLabel)}"><p>${escapeHtml(copy.contentsLabel)}</p><nav>${toc}</nav></aside><article class="company-prose"><div class="company-prose__intro">${intro}</div>${sectionsMarkup}</article></div></article><section class="route-features company-related" aria-labelledby="company-related-title"><header><p class="company-section-label">${escapeHtml(copy.relatedTitle)}</p><h2 id="company-related-title">${escapeHtml(copy.relatedTitle)}</h2></header><div class="company-related__grid">${related}</div></section></main>
    ${routeFooter(localeKey, "company")}
  </div></body></html>
`;
}

function aboutPreservedTemplate(localeKey) {
  const locale = locales[localeKey];
  const copy = aboutPreservedPageCopy[localeKey];
  const toc = copy.sections.map((section) => `<a href="#${escapeHtml(section.id)}">${escapeHtml(section.title)}</a>`).join("");
  const sectionsMarkup = copy.sections.map((section) => {
    const paragraphs = section.paragraphs.map((paragraph) => `<p>${escapeHtml(paragraph)}</p>`).join("");
    const links = section.links || section.emailLabel ? `<nav class="preserved-prose__links" aria-label="${escapeHtml(section.title)}">${(section.links || []).map((link) => `<a href="${escapeHtml(localePath(localeKey, link.path))}">${escapeHtml(link.label)} <span aria-hidden="true">→</span></a>`).join("")} ${section.emailLabel ? `<a href="mailto:${site.email}">${escapeHtml(section.emailLabel)} <span aria-hidden="true">↗</span></a>` : ""}</nav>` : "";
    return `<section id="${escapeHtml(section.id)}" class="preserved-prose__section" aria-labelledby="preserved-${escapeHtml(section.id)}-title"><h2 id="preserved-${escapeHtml(section.id)}-title">${escapeHtml(section.title)}</h2>${paragraphs}${links}</section>`;
  }).join("\n");
  const related = copy.related.map((item) => `<article class="preserved-related__item"><a href="${escapeHtml(localePath(localeKey, item.path))}"><img src="${escapeHtml(item.image)}" alt="${escapeHtml(item.alt)}" width="1600" height="900" loading="lazy" decoding="async"><div class="preserved-related__copy"><p>${escapeHtml(item.category)}</p><h3>${escapeHtml(item.title)}</h3><span>${escapeHtml(item.description)}</span><strong>${escapeHtml(copy.relatedLinkLabel)} <i aria-hidden="true">↗</i></strong></div></a></article>`).join("\n");
  return `<!DOCTYPE html><html lang="${locale.htmlLang}"><head>
${head(localeKey, `${copy.title} — ${site.name}`, locale.routes["about-preserved"].description, "about-preserved", ["/content-routes/route-foundation.css", "/content-routes/about-preserved-editorial.css?v=20261013-03"], [], "/assets/about/navin-introduction-banner.png")}  </head><body class="route-page content-page content-about-preserved"><div class="content-field" aria-hidden="true"></div><div class="route-page__shell">
    ${contentHeader(localeKey, "about-preserved")}
    <main id="main-content" class="preserved-main"><article class="preserved-article"><header class="preserved-article__header"><p class="preserved-article__category">${escapeHtml(copy.category)}</p><h1>${escapeHtml(copy.title)}</h1><p class="preserved-article__subtitle">${escapeHtml(copy.subtitle)}</p></header><figure class="preserved-hero"><img src="/assets/about/navin-introduction-banner.png" alt="${escapeHtml(copy.bannerAlt)}" width="1672" height="941" decoding="async"></figure><div class="preserved-reading-layout"><aside class="preserved-toc" aria-label="${escapeHtml(copy.contentsLabel)}"><p>${escapeHtml(copy.contentsLabel)}</p><nav aria-label="${escapeHtml(copy.contentsLabel)}">${toc}</nav></aside><article class="preserved-prose"><p class="preserved-prose__opening">${escapeHtml(copy.opening)}</p>${sectionsMarkup}</article></div></article><section class="preserved-related route-features" aria-labelledby="preserved-related-title"><header><p>${escapeHtml(copy.relatedTitle)}</p><h2 id="preserved-related-title">${escapeHtml(copy.relatedTitle)}</h2></header><div class="preserved-related__grid">${related}</div></section></main>
    ${routeFooter(localeKey, "about-preserved")}
  </div></body></html>
`;
}

function signInTemplate(localeKey) {
  const locale = locales[localeKey];
  const legal = experience[localeKey];
  const account = legal.account;
  const privacyPath = localePath(localeKey, "privacy-policy");
  const termsPath = localePath(localeKey, "terms-of-use");
  return `<!DOCTYPE html><html lang="${locale.htmlLang}"><head>
${head(localeKey, `${locale.routes["sign-in"].title} — ${site.name}`, locale.routes["sign-in"].description, "sign-in", "/content-routes/route-foundation.css")}  </head><body class="standalone-sign-in">
  <main class="sign-in-shell"><aside class="sign-in-aside"><a class="sign-in-aside__brand" href="${localePath(localeKey)}" aria-label="${escapeHtml(site.name)} home"><span>NAVIN</span><span>RESEARCH</span></a><div class="sign-in-aside__content"><p class="sign-in-aside__eyebrow">NAVIN RESEARCH / ACCOUNT</p><h1>Welcome to Navin Research</h1></div></aside><section class="sign-in-panel" aria-labelledby="sign-in-page-title"><div class="sign-in-panel__inner"><img class="sign-in-panel__mark" src="/assets/brand/navin-account-logo.png" alt="Navin Research"><p class="sign-in-panel__eyebrow">NAVIN RESEARCH</p><h2 id="sign-in-page-title">${escapeHtml(account.dialogTitle)}</h2><div class="sign-in-providers" aria-label="${escapeHtml(account.signIn)}"><button type="button" data-sign-in-provider="Google"><svg viewBox="0 0 24 24" aria-hidden="true"><path fill="#4285F4" d="M21.6 12.2c0-.7-.1-1.4-.2-2H12v3.8h5.4a4.6 4.6 0 0 1-2 3v2.5h3.2c1.9-1.8 3-4.3 3-7.3Z"></path><path fill="#34A853" d="M12 22c2.7 0 5-.9 6.6-2.5l-3.2-2.5c-.9.6-2 .9-3.4.9-2.6 0-4.8-1.8-5.6-4.2H3.1v2.6A10 10 0 0 0 12 22Z"></path><path fill="#FBBC05" d="M6.4 13.7a6 6 0 0 1 0-3.5V7.6H3.1a10 10 0 0 0 0 8.8l3.3-2.7Z"></path><path fill="#EA4335" d="M12 6c1.5 0 2.8.5 3.9 1.6l2.9-2.9A10 10 0 0 0 3.1 7.6l3.3 2.6C7.2 7.8 9.4 6 12 6Z"></path></svg><span>Google</span></button><button type="button" data-sign-in-provider="GitHub"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3.5a8.5 8.5 0 0 0-2.7 16.6c.4.1.6-.2.6-.4v-1.5c-2.3.5-2.8-1-2.8-1-.4-.9-.9-1.1-.9-1.1-.8-.6.1-.6.1-.6.9.1 1.4.9 1.4.9.8 1.4 2.1 1 2.6.8.1-.6.3-1 .5-1.2-1.9-.2-3.9-1-3.9-4.2 0-.9.3-1.7.9-2.3-.1-.2-.4-1.1.1-2.3 0 0 .7-.2 2.4.9.7-.2 1.4-.3 2.1-.3s1.5.1 2.1.3c1.7-1.1 2.4-.9 2.4-.9.5 1.2.2 2.1.1 2.3.3.3.5.8.5 1.6v2.4c0 .2.2.5.6.4A8.5 8.5 0 0 0 12 3.5Z"></path></svg><span>GitHub</span></button><button type="button" data-sign-in-provider="Apple"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M16.9 12.7c0-2.1 1.7-3.1 1.8-3.2a4 4 0 0 0-3.1-1.7c-1.3-.1-2.5.8-3.1.8-.7 0-1.7-.8-2.8-.8a4.2 4.2 0 0 0-3.6 2.2c-1.5 2.6-.4 6.4 1 8.5.7 1 1.5 2.2 2.6 2.1 1 0 1.4-.7 2.7-.7s1.7.7 2.8.7c1.2 0 1.9-1 2.6-2.1.8-1.1 1.1-2.2 1.1-2.3-.1 0-2-.8-2-3.5ZM15 6.5c.6-.7 1-1.7.9-2.7-.9 0-2 .6-2.7 1.3-.6.6-1.1 1.6-1 2.6 1 .1 2.1-.5 2.8-1.2Z"></path></svg><span>Apple</span></button></div><div class="sign-in-divider" aria-hidden="true"><span>${escapeHtml(account.orLabel)}</span></div><div class="sign-in-methods" role="tablist" aria-label="${escapeHtml(account.signIn)}"><button type="button" class="is-active" data-sign-in-method="email" role="tab" aria-selected="true">${escapeHtml(account.emailMethod)}</button><button type="button" data-sign-in-method="phone" role="tab" aria-selected="false">${escapeHtml(account.phoneMethod)}</button></div><form class="sign-in-form" data-sign-in-form data-sign-in-page-form data-unavailable-message="${escapeHtml(account.unavailable)}"><label data-sign-in-email-field>${escapeHtml(account.emailLabel)}<input type="email" name="email" autocomplete="username" placeholder="${escapeHtml(account.emailPlaceholder)}" required></label><label data-sign-in-phone-field hidden>${escapeHtml(account.phoneLabel)}<input type="tel" name="phone" autocomplete="tel" placeholder="${escapeHtml(account.phonePlaceholder)}"></label><label><span class="sign-in-form__label-row"><span>${escapeHtml(account.passwordLabel)}</span><button type="button" data-forgot-password>${escapeHtml(account.forgotPassword)}</button></span><span class="sign-in-form__password"><input type="password" name="password" autocomplete="current-password" required><button type="button" data-password-toggle aria-label="${escapeHtml(account.showPassword)}"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3.5 12s3-5 8.5-5 8.5 5 8.5 5-3 5-8.5 5-8.5-5-8.5-5Z"></path><circle cx="12" cy="12" r="2"></circle></svg></button></span></label><button type="submit" class="sign-in-form__submit">${escapeHtml(account.continueWithEmail || account.continueLabel)}</button><p class="sign-in-status" data-sign-in-status role="status" aria-live="polite" hidden></p></form><p class="sign-in-panel__legal">By continuing, you acknowledge Navin Research's <a href="${privacyPath}">${escapeHtml(legal.privacy)}</a> and <a href="${termsPath}">${escapeHtml(legal.terms)}</a>.</p><p class="sign-in-panel__availability">${escapeHtml(account.unavailable)}</p><a class="sign-in-panel__return" href="${localePath(localeKey)}">${escapeHtml(account.returnHome)} <span aria-hidden="true">↗</span></a></div></section></main><script src="/content-routes/sign-in.js?v=${homeAssetRevision}" defer></script></body></html>`;
}



function routeTemplate(localeKey, section) {
  const locale = locales[localeKey];
  const route = locale.routes[section];
  const ui = experience[localeKey];
  const routeNumber = String(sections.indexOf(section) + 1).padStart(2, "0");
  const search = section === "search" ? `<section class="route-search" aria-labelledby="search-label"><label id="search-label" for="route-search">${escapeHtml(locale.common.searchLabel)}</label><input id="route-search" type="search" data-route-search placeholder="${escapeHtml(locale.common.searchPlaceholder)}" autocomplete="off"><div class="route-search__results" data-search-results data-empty-label="${escapeHtml(locale.common.noResults)}" aria-live="polite"></div></section>` : "";
  const contact = section === "contact" ? `<address class="route-contact"><a href="mailto:${site.email}">${site.email}</a></address>` : "";
  const features = routeFeatureMarkup(localeKey, section);
  return `<!DOCTYPE html><html lang="${locale.htmlLang}"><head>
${head(localeKey, `${route.title} — ${site.name}`, route.description, section, "/content-routes/route-foundation.css", section === "search" ? "/content-routes/route-search.js" : "")}  </head><body class="route-page content-page content-${section}"><div class="content-field" aria-hidden="true"></div><div class="route-page__shell">
    ${contentHeader(localeKey, section)}
    <main class="route-page__main content-main"><div class="content-copy"><p class="route-page__eyebrow">SECTION ${routeNumber} / ${escapeHtml(route.title)}</p><h1>${escapeHtml(route.title)}</h1><p class="route-page__lede">${escapeHtml(route.lede)}</p>${contact}${search}</div><aside class="content-index" aria-label="${escapeHtml(ui.menu.explore)}"><p>${escapeHtml(ui.menu.explore)}</p><nav aria-label="${escapeHtml(ui.menu.explore)}">${routeNav(localeKey, section)}</nav></aside>${features}</main>
    ${routeFooter(localeKey, section)}
  </div></body></html>
`;
}

function productsTemplate(localeKey) {
  const locale = locales[localeKey];
  const copy = productCopy[localeKey];
  return `<!DOCTYPE html><html lang="${locale.htmlLang}"><head>
${head(localeKey, `${locale.routes.products.title} — ${site.name}`, locale.routes.products.description, "products", "/content-routes/route-foundation.css")}  </head><body class="route-page content-page content-products products-page"><div class="content-field" aria-hidden="true"></div><div class="route-page__shell">
    ${contentHeader(localeKey, "products")}
    <main class="products-main"><header class="products-intro"><p class="route-page__eyebrow">${escapeHtml(copy.eyebrow)}</p><h1>${escapeHtml(copy.title)}</h1><p>${escapeHtml(copy.lede)}</p></header><section class="product-directory" aria-label="${escapeHtml(locale.routes.products.title)}">${productGrid(localeKey)}</section></main>
    ${routeFooter(localeKey, "products")}
  </div></body></html>`;
}

function personCard(localeKey, person) {
  const copy = peoplePageCopy[localeKey];
  const profile = person.copy[localeKey];
  return `<article class="people-card"><a href="${personPath(localeKey, person.slug)}"><figure><img src="${person.image}" alt="${escapeHtml(`${person.name} — ${profile.role}`)}" width="1000" height="1000" decoding="async"></figure><div class="people-card__copy"><p>${escapeHtml(profile.role)}</p><h3>${escapeHtml(person.cardName || person.name)}</h3><small>${escapeHtml(copy.viewProfile)} <i aria-hidden="true">↗</i></small></div></a></article>`;
}

function peopleTemplate(localeKey) {
  const locale = locales[localeKey];
  const copy = peoplePageCopy[localeKey];
  const orderedPeople = [people[1], people[0], people[2]].map((person) => personCard(localeKey, person)).join("");
  const structure = copy.structure.map(([number, title, body]) => `<article class="people-structure__item"><span>${escapeHtml(number)}</span><h3>${escapeHtml(title)}</h3><p>${escapeHtml(body)}</p></article>`).join("");
  return `<!DOCTYPE html><html lang="${locale.htmlLang}"><head>
${head(localeKey, `${copy.title} — ${site.name}`, locale.routes.people.description, "about/people", "/content-routes/route-foundation.css")}  </head><body class="route-page content-page content-people"><div class="content-field" aria-hidden="true"></div><div class="route-page__shell">
    ${contentHeader(localeKey, "people")}
    <main class="people-main" data-people-index><header class="people-intro"><p class="route-page__eyebrow">${escapeHtml(copy.eyebrow)}</p><h1>${escapeHtml(copy.title)}</h1><p>${escapeHtml(copy.lede)}</p></header><section class="people-group" aria-label="${escapeHtml(copy.title)}"><div class="people-grid">${orderedPeople}</div></section><section class="people-structure" aria-labelledby="people-structure-title"><header><p class="route-page__eyebrow">${escapeHtml(copy.structureEyebrow)}</p><h2 id="people-structure-title">${escapeHtml(copy.structureTitle)}</h2><p>${escapeHtml(copy.structureIntro)}</p></header><div class="people-structure__list">${structure}</div></section></main>
    ${routeFooter(localeKey, "about/people")}
  </div></body></html>`;
}

function personTemplate(localeKey, person) {
  const locale = locales[localeKey];
  const copy = peoplePageCopy[localeKey];
  const profile = person.copy[localeKey];
  const suffix = `about/people/${person.slug}`;
  const website = person.website ? `<a class="person-website" href="${person.website}" target="_blank" rel="noopener noreferrer">${escapeHtml(copy.website)} <span aria-hidden="true">↗</span></a>` : "";
  return `<!DOCTYPE html><html lang="${locale.htmlLang}"><head>
${head(localeKey, `${person.name} — ${site.name}`, profile.summary, suffix, "/content-routes/route-foundation.css", [], person.image)}  </head><body class="route-page content-page content-person"><div class="content-field" aria-hidden="true"></div><div class="route-page__shell">
    ${contentHeader(localeKey, "people", suffix)}
    <main class="person-main" data-person="${person.slug}"><a class="person-back" href="${personPath(localeKey)}">← ${escapeHtml(copy.back)}</a><section class="person-hero"><figure><img src="${person.image}" alt="${escapeHtml(`${person.name} — ${profile.role}`)}" width="1000" height="1000" decoding="async"></figure><div class="person-hero__copy"><p class="route-page__eyebrow">${escapeHtml(copy.profileEyebrow)}</p><h1>${escapeHtml(person.name)}</h1><p class="person-role">${escapeHtml(profile.role)}</p>${website}</div></section><section class="person-profile" aria-labelledby="person-profile-title"><div><p>${escapeHtml(copy.role)}</p><strong>${escapeHtml(profile.role)}</strong></div><article><p class="route-page__eyebrow">${escapeHtml(copy.status)}</p><h2 id="person-profile-title">${escapeHtml(copy.about)}</h2><p>${escapeHtml(profile.profile)}</p><small>${escapeHtml(copy.statusValue)}</small></article></section></main>
    ${routeFooter(localeKey, suffix)}
  </div></body></html>`;
}

function chapterTemplate(localeKey, chapter) {
  const locale = locales[localeKey];
  const ui = experience[localeKey];
  const domain = chapter.domains[localeKey];
  const title = `NAVIN / ${chapter.key} — ${chapter.number}`;
  const intro = ui.chapterIntro(domain);
  const chapterIndex = chapters.findIndex((item) => item.slug === chapter.slug);
  const previous = chapters[chapterIndex - 1];
  const next = chapters[chapterIndex + 1];
  const nav = chapters.map((item) => `<a href="${localePath(localeKey, item.slug)}"${item.slug === chapter.slug ? ' aria-current="page"' : ""}><span>${item.number}</span><strong>${item.key}</strong></a>`).join("");
  const previousLink = previous ? `<a class="chapter-nav__arrow" href="${localePath(localeKey, previous.slug)}" aria-label="Previous chapter">←</a>` : '<span class="chapter-nav__arrow" aria-hidden="true">←</span>';
  const nextLink = next ? `<a class="chapter-nav__arrow" href="${localePath(localeKey, next.slug)}" aria-label="Next chapter">→</a>` : '<span class="chapter-nav__arrow" aria-hidden="true">→</span>';
  return `<!DOCTYPE html><html lang="${locale.htmlLang}"><head>
${head(localeKey, title, `${intro} ${ui.chapterNotice}`, chapter.slug, ["/styles.css", "/content-routes/route-foundation.css"], ["/script.js", "/content-routes/theme.js?v=20261013-01"])}  </head><body class="route-page chapter-page content-page chapter-${chapter.slug}"><div class="chapter-field" aria-hidden="true"></div><div class="route-page__shell">
    ${siteHeader(localeKey, chapter.slug)}
    ${siteDrawer(localeKey)}
    <a class="all-chapters" href="${localePath(localeKey)}#wealth-of-nature">← ${escapeHtml(ui.menu.chapters)}</a>
    <main class="chapter-main"><div class="chapter-copy"><p class="route-page__eyebrow">CHAPTER ${chapter.number}</p><h1>NAVIN / ${chapter.key}<span> — ${chapter.number}</span></h1><p class="chapter-domain">${escapeHtml(domain)}</p><span class="chapter-rule" aria-hidden="true"></span><h2>${escapeHtml(domain)}</h2><p class="route-page__lede">${escapeHtml(intro)}</p><div class="route-page__notice"><strong>${escapeHtml(locale.common.preparation)}</strong><span>${escapeHtml(ui.chapterNotice)}</span></div></div><aside class="chapter-facts" aria-label="${escapeHtml(domain)}"><p><small>${escapeHtml(ui.menu.chapters)}</small><strong>${chapter.number} / 05</strong></p><p><small>${escapeHtml(ui.chapterLabels.researchProgram)}</small><strong>NAVIN / ${chapter.key}</strong></p><p><small>${escapeHtml(ui.chapterLabels.coreDimension)}</small><strong>${escapeHtml(domain)}</strong></p><p><small>${escapeHtml(ui.chapterLabels.status)}</small><strong>${escapeHtml(locale.common.preparation)}</strong></p><p class="chapter-nav__label"><small>${escapeHtml(ui.chapterLabels.navigation)}</small></p><nav class="chapter-nav" aria-label="${escapeHtml(ui.menu.chapters)}">${previousLink}${nav}${nextLink}</nav></aside></main>
    ${siteFooter(localeKey, { flow: true, suffix: chapter.slug })}</div></body></html>
`;
}

const releaseModels = [
  ["01", "Dossier-1B", "Document", "Fast document OCR, handwriting, layout analysis, tables, forms, receipts and key-value extraction.", "1B"],
  ["02", "Dossier-2B", "Document", "Compact document understanding with structured extraction, classification, document QA and field-level validation.", "2B"],
  ["03", "Dossier-4B", "Agentic Document", "Flagship Agentic Document Intelligence model. OCR, document reasoning, evidence grounding, verification, risk detection, tool use and bounded repair.", "4B"],
  ["04", "Dossier-9B", "Document Reasoning", "Advanced multi-page and multi-document reasoning for complex contracts, financial documents, compliance workflows and high-quality verification.", "9B"],
  ["05", "Sandora-3B", "Agent", "Lightweight agent model for tool calling, routing, delegation, local automation and basic computer-use tasks.", "3B"],
  ["06", "Sandora-9B", "Adaptive Agent", "Flagship Adaptive Multimodal Agent. Planning, computer use, multi-agent orchestration, tool use, memory, skill learning, self-reflection and user adaptation.", "9B"],
  ["07", "Sandora-27B", "Agent Reasoning", "High-capability agent model for long-horizon planning, complex orchestration, reasoning, trajectory generation, evaluation and teacher-model workloads.", "27B"],
  ["08", "Moyi-T2.5-160M", "Speech", "Micro / embedded streaming speech model optimized for highly constrained edge devices and offline execution.", "160M"],
  ["09", "Moyi-T2.5-350M", "Speech", "Ultra-edge multilingual speech intelligence for low-memory mobile and embedded hardware.", "350M"],
  ["10", "Moyi-T2.5-600M", "Edge Speech", "Flagship Edge Speech Intelligence model. Real-time multilingual speech translation, streaming inference, context awareness and on-device execution.", "600M"],
  ["11", "Moyi-T2.5-1.7B", "Speech", "Quality-oriented speech model for workstation, higher-end edge devices and teacher / distillation workloads.", "1.7B"],
];

function releaseTemplate(localeKey) {
  const locale = locales[localeKey];
  const ui = experience[localeKey];
  const rows = releaseModels.map(([number, name, type, details, size]) => `<tr data-release-row><td>${number}</td><th scope="row"><span class="release-model-name" data-release-placeholder>${escapeHtml(name)}</span><small class="release-model-status">${escapeHtml(ui.releases.preparing)}</small></th><td>${escapeHtml(type)}</td><td>${escapeHtml(details)}</td><td>—</td><td>—</td><td>${size}</td></tr>`).join("\n                ");
  const headers = ui.releases.headers.map((label) => `<th scope="col">${escapeHtml(label)}</th>`).join("");
  return `<!DOCTYPE html><html lang="${locale.htmlLang}"><head>
${head(localeKey, `${locale.routes.releases.title} — ${site.name}`, locale.routes.releases.description, releaseRoute, "/content-routes/route-foundation.css", "/content-routes/release-search.js")}  </head><body class="route-page content-page release-page"><div class="content-field" aria-hidden="true"></div><div class="route-page__shell">
    ${contentHeader(localeKey, "")}
    <main class="release-main"><div class="release-intro"><h1 data-release-title aria-live="off">NAVIN RELEASES</h1><p class="release-subtitle">${escapeHtml(ui.releases.subtitle)}</p></div><section class="release-registry" aria-labelledby="release-registry-title"><div class="release-registry__toolbar"><h2 id="release-registry-title">${escapeHtml(locale.routes.releases.title)}</h2><label for="release-search">${escapeHtml(ui.releases.search)}</label><input id="release-search" type="search" data-release-search placeholder="${escapeHtml(ui.releases.search)}" autocomplete="off"></div><div class="release-table-wrap"><table class="release-table"><caption class="sr-only">${escapeHtml(locale.routes.releases.title)}</caption><thead><tr>${headers}</tr></thead><tbody>${rows}</tbody></table></div></section></main>
    ${routeFooter(localeKey, "releases")}
  </div></body></html>`;
}

function legalTemplate(localeKey, slug) {
  const locale = locales[localeKey];
  const ui = experience[localeKey];
  const [title, first, second] = ui.legal[slug];
  return `<!DOCTYPE html><html lang="${locale.htmlLang}"><head>
${head(localeKey, `${title} — ${site.name}`, first, slug, ["/styles.css", "/content-routes/route-foundation.css"], ["/script.js", "/content-routes/theme.js?v=20261013-01"])}  </head><body class="route-page legal-route content-page"><div class="route-page__shell">${siteHeader(localeKey, slug)}${siteDrawer(localeKey)}<main class="route-page__main legal-page"><p class="route-page__eyebrow">Navin Research</p><h1>${escapeHtml(title)}</h1><p class="route-page__lede">${escapeHtml(first)}</p><div class="route-page__notice"><span>${escapeHtml(second)}</span></div></main>${siteFooter(localeKey, { flow: true, suffix: slug })}</div></body></html>
`;
}

const pages = [];
async function emit(localeKey, suffix, html) {
  const prefix = locales[localeKey].prefix;
  const directory = [prefix, suffix].filter(Boolean).join("/") || ".";
  await mkdir(directory, { recursive: true });
  const file = directory === "." ? "index.html" : `${directory}/index.html`;
  await writeFile(file, html, "utf8");
  pages.push({ localeKey, suffix, file, url: localePath(localeKey, suffix) });
}

for (const [localeKey] of localeEntries) {
  await emit(localeKey, "", homeTemplate(localeKey));
  for (const section of sections) {
    const template = section === "products" ? productsTemplate(localeKey) : section === "notes" ? notesTemplate(localeKey) : section === "sign-in" ? signInTemplate(localeKey) : section === "about" ? aboutTemplate(localeKey) : section === "about-light" ? aboutTemplate(localeKey, { light: true }) : section === "company" ? companyTemplate(localeKey) : section === "about-preserved" ? aboutPreservedTemplate(localeKey) : routeTemplate(localeKey, section);
    await emit(localeKey, section, template);
  }
  await emit(localeKey, "about/people", peopleTemplate(localeKey));
  for (const person of people) await emit(localeKey, `about/people/${person.slug}`, personTemplate(localeKey, person));
  await emit(localeKey, releaseRoute, releaseTemplate(localeKey));
  for (const chapter of chapters) await emit(localeKey, chapter.slug, chapterTemplate(localeKey, chapter));
  for (const legalPage of legalPages) await emit(localeKey, legalPage, legalTemplate(localeKey, legalPage));
  for (const post of blogPosts) await emit(localeKey, `blog/${post.category}/${post.slug}`, blogTemplate(localeKey, post));
}

const notFoundTemplate = (localeKey = "en") => {
  const locale = locales[localeKey];
  return `<!DOCTYPE html><html lang="${locale.htmlLang}"><head>${head(localeKey, `Page not found — ${site.name}`, "The requested Navin Research page was not found.", "404", "/content-routes/route-foundation.css")}</head><body class="route-page content-page content-404"><div class="content-field" aria-hidden="true"></div><div class="route-page__shell">${contentHeader(localeKey, "")}<main class="route-page__main content-main"><div class="content-copy"><p class="route-page__eyebrow">NAVIN RESEARCH / 404</p><h1>Page not found.</h1><p class="route-page__lede">This route is not part of the public site.</p><p><a class="route-contact" href="/">Return home <span aria-hidden="true">→</span></a></p></div></main>${routeFooter(localeKey)}</div></body></html>`;
};
await writeFile("404.html", notFoundTemplate(), "utf8");

const markdownPosts = [];
for (const post of blogPosts) {
  const url = blogMarkdownPath(post);
  const file = url.slice(1);
  await mkdir(file.slice(0, file.lastIndexOf("/")), { recursive: true });
  await writeFile(file, renderBlogPost(post), "utf8");
  markdownPosts.push({ ...post, file, url });
}

const searchIndex = pages.map(({ localeKey, suffix, url }) => {
  const locale = locales[localeKey];
  const ui = experience[localeKey];
  const chapter = chapters.find((item) => item.slug === suffix);
  if (!suffix) return { language: locale.shortLabel, url, title: locale.meta.title, description: locale.meta.description, text: `${locale.home.statement} ${ui.wealth.statement}` };
  if (chapter) return { language: locale.shortLabel, url, title: `NAVIN / ${chapter.key} — ${chapter.number}`, description: ui.chapterIntro(chapter.domains[localeKey]), text: `${chapter.domains[localeKey]} ${ui.chapterNotice}` };
  if (legalPages.includes(suffix)) { const copy = ui.legal[suffix]; return { language: locale.shortLabel, url, title: copy[0], description: copy[1], text: copy[2] }; }
  if (suffix === "about/people") {
    const copy = peoplePageCopy[localeKey];
    return { language: locale.shortLabel, url, title: copy.title, description: locale.routes.people.description, text: `${copy.lede} ${copy.structureIntro}` };
  }
  if (suffix.startsWith("about/people/")) {
    const slug = suffix.slice("about/people/".length);
    const person = people.find((item) => item.slug === slug);
    if (!person) throw new Error(`Missing person data for ${suffix}`);
    const profile = person.copy[localeKey];
    return { language: locale.shortLabel, url, title: person.name, description: profile.summary, text: `${profile.role} ${profile.profile}` };
  }
  if (suffix.startsWith("blog/")) {
    const slug = suffix.split("/").pop();
    const post = blogPosts.find((item) => item.slug === slug);
    if (!post) throw new Error(`Missing blog data for ${suffix}`);
    const postCopy = blogCopy(post, localeKey);
    return { language: locale.shortLabel, url, title: postCopy.title, description: postCopy.description, text: `${postCopy.answer} ${(postCopy.keywords || post.keywords).join(" ")}` };
  }
  const route = locale.routes[suffix]; return { language: locale.shortLabel, url, title: route.title, description: route.description, text: route.lede };
});
searchIndex.push(...catalogProducts.map((product) => ({
  language: "EN",
  url: productUrl(product),
  title: `${product.name} — Navin Research`,
  description: product.thesis,
  text: `${product.eyebrow} ${product.intro} ${product.capabilities.join(" ")} ${product.status}`,
})));

await writeFile("content-routes/search-index.json", `${JSON.stringify(searchIndex, null, 2)}\n`, "utf8");
await writeFile("sitemap.xml", `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${pages.map(({ url }) => `  <url><loc>${site.origin}${url}</loc></url>`).join("\n")}\n</urlset>\n`, "utf8");
console.log(`Generated ${pages.length} localized pages and ${markdownPosts.length} Markdown blog posts.`);
