import { chapters, experience, locales, localePath, sections, site } from "../../site.config.mjs";

const currentYear = new Date().getUTCFullYear();

export const escapeHtml = (value) => String(value)
  .replaceAll("&", "&amp;")
  .replaceAll("<", "&lt;")
  .replaceAll(">", "&gt;")
  .replaceAll('"', "&quot;");

export function languageLinks(activeKey, suffix = "") {
  return Object.entries(locales)
    .map(([key, locale]) => `<a href="${localePath(key, suffix)}" hreflang="${locale.hreflang}" lang="${locale.htmlLang}"${key === activeKey ? ' aria-current="page"' : ""}>${locale.shortLabel}</a>`)
    .join('<span aria-hidden="true">/</span>');
}

function chapterExplorer(localeKey) {
  const ui = experience[localeKey];
  const links = chapters.map((chapter, index) => `<a href="${localePath(localeKey, chapter.slug)}" data-chapter-link="${chapter.slug}" aria-controls="chapter-preview-${chapter.slug}"${index === 0 ? " data-preview-active" : ""}><small>${chapter.number}</small><strong>${chapter.key}</strong></a>`).join("\n                ");
  const previews = chapters.map((chapter, index) => `<article id="chapter-preview-${chapter.slug}" data-chapter-preview="${chapter.slug}"${index === 0 ? "" : " hidden"}><img data-src="/assets/${chapter.asset}" alt="" width="280" height="220" decoding="async"><p>${escapeHtml(ui.chapterIntro(chapter.domains[localeKey]))}</p><a href="${localePath(localeKey, chapter.slug)}">${escapeHtml(ui.menu.viewChapter)} <span aria-hidden="true">→</span></a></article>`).join("\n                ");
  return `<div class="chapter-list"><p>${escapeHtml(ui.menu.chapters)}</p><nav aria-label="${escapeHtml(`${ui.menu.chapters} — ${ui.menu.explore}`)}">${links}</nav></div><div class="chapter-previews" aria-live="polite">${previews}</div>`;
}

export function siteDrawer(localeKey) {
  const locale = locales[localeKey];
  const ui = experience[localeKey];
  return `<div class="menu-backdrop" data-menu-backdrop hidden></div>
      <aside class="site-menu" id="site-menu" aria-label="${escapeHtml(locale.common.navAria)}" aria-hidden="true" inert>
        <div class="site-menu__primary">
          <button class="menu-close" type="button" data-menu-close aria-label="${escapeHtml(ui.menu.close)}"><span aria-hidden="true">×</span></button>
          <nav aria-label="${escapeHtml(locale.common.navAria)}">
            <a href="${localePath(localeKey)}">${escapeHtml(ui.menu.home)}</a>
            <a href="${localePath(localeKey, "products")}">${escapeHtml(ui.menu.products)}</a>
            <button type="button" data-chapters-toggle aria-expanded="false" aria-controls="chapter-panel">${escapeHtml(ui.menu.chapters)}<span aria-hidden="true">→</span></button>
            <a href="${localePath(localeKey, "research")}">${escapeHtml(ui.menu.work)}</a>
            <a href="${localePath(localeKey, "blog")}">${escapeHtml(ui.menu.notes)}</a>
            <a href="${localePath(localeKey, "releases")}">${escapeHtml(ui.menu.releases)}</a>
            <a href="${localePath(localeKey)}#wealth-of-nature">${escapeHtml(ui.menu.philosophy)}</a>
            <a href="mailto:${site.email}">${escapeHtml(ui.menu.contact)}</a>
          </nav>
        </div>
        <div class="chapter-panel" id="chapter-panel" aria-hidden="true" inert>
          <button class="chapter-back" type="button" data-chapter-back><span aria-hidden="true">←</span>${escapeHtml(ui.menu.back)}</button>
          ${chapterExplorer(localeKey)}
        </div>
      </aside>`;
}

export function siteHeader(localeKey, suffix = "") {
  const locale = locales[localeKey];
  const ui = experience[localeKey];
  return `<header class="masthead site-header">
        <div class="masthead__brand-group">
          <button class="menu-toggle" type="button" data-menu-open aria-expanded="false" aria-controls="site-menu" aria-label="${escapeHtml(ui.menu.open)}"><span></span><span></span><span></span></button>
          <a class="brand brand--wordmark" href="${localePath(localeKey)}" aria-label="${escapeHtml(ui.aria.home)}"><span class="brand__name">NAVIN<br>RESEARCH</span></a>
        </div>
        <div class="masthead__meta"><span class="signal">${escapeHtml(locale.home.status)}</span><nav class="language" aria-label="${escapeHtml(locale.common.languageAria)}">${languageLinks(localeKey, suffix)}</nav></div>
      </header>`;
}

export function contentHeader(localeKey, currentSection) {
  const locale = locales[localeKey];
  const navSections = ["research", "models", "products", "publications", "notes", "releases", "about", "careers", "contact", "docs", "search"];
  const routes = navSections.map((section) => `<a href="${localePath(localeKey, section)}"${section === currentSection ? ' aria-current="page"' : ""}>${escapeHtml(locale.routes[section].title)}</a>`).join("\n          ");
  return `<header class="route-page__header content-header"><a class="route-page__brand content-wordmark" href="${localePath(localeKey)}"><span>NAVIN<br>RESEARCH</span></a><nav class="route-page__nav" aria-label="${escapeHtml(locale.common.navAria)}">${routes}</nav><nav class="route-page__languages" aria-label="${escapeHtml(locale.common.languageAria)}">${languageLinks(localeKey, currentSection)}</nav></header>`;
}

export function routeFooter(localeKey) {
  const ui = experience[localeKey];
  return `<footer class="route-page__footer content-footer"><p>© ${currentYear} NAVIN RESEARCH</p><nav aria-label="${escapeHtml(ui.aria.legal)}"><a href="${localePath(localeKey, "privacy-policy")}">${escapeHtml(ui.privacy)}</a><span aria-hidden="true">/</span><a href="${localePath(localeKey, "terms-of-use")}">${escapeHtml(ui.terms)}</a></nav></footer>`;
}

export function siteFooter(localeKey, { flow = false } = {}) {
  const ui = experience[localeKey];
  return `<footer class="footer site-footer${flow ? " site-footer--flow" : ""}"><p>© <span data-current-year>2026</span> NAVIN RESEARCH</p><nav aria-label="${escapeHtml(ui.aria.legal)}"><a href="${localePath(localeKey, "privacy-policy")}">${escapeHtml(ui.privacy)}</a><span aria-hidden="true">/</span><a href="${localePath(localeKey, "terms-of-use")}">${escapeHtml(ui.terms)}</a></nav></footer>`;
}
