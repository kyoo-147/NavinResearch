import { chapters, experience, locales, localePath, sections, site } from "../../site.config.mjs";
import { catalogProducts } from "../product-data.mjs";

const currentYear = new Date().getUTCFullYear();
const cookieCopy = {
  en: {
    manage: "Manage Cookies", title: "Cookie Preferences", intro: "Websites and apps use cookies and other identifiers to store and retrieve information on your device. Some of this information may be shared with third parties for different purposes. Use the tool below to manage your preferences. You can change them anytime.", learnMore: "Learn more", close: "Close cookie preferences", done: "Done",
    required: ["Strictly necessary", "These cookies are required for the site to work and can’t be turned off. They support essential functions like security, user authentication, and customer support."],
    analytics: ["Analytics Cookies", "These cookies help us understand how visitors interact with our site. They allow us to measure traffic and improve site performance."],
    marketing: ["Marketing measurement", "These cookies help us measure the effectiveness of our marketing campaigns."],
    personalized: ["Personalized marketing", "This helps us personalize and measure Navin Research’s own marketing on third-party platforms."],
  },
  vi: {
    manage: "Quản lý cookie", title: "Tùy chọn cookie", intro: "Website và ứng dụng sử dụng cookie cùng các mã nhận diện khác để lưu trữ và truy xuất thông tin trên thiết bị của bạn. Một phần thông tin có thể được chia sẻ với bên thứ ba cho các mục đích khác nhau. Hãy dùng công cụ bên dưới để quản lý tùy chọn. Bạn có thể thay đổi bất cứ lúc nào.", learnMore: "Tìm hiểu thêm", close: "Đóng tùy chọn cookie", done: "Xong",
    required: ["Bắt buộc", "Các cookie này cần thiết để website hoạt động và không thể tắt. Chúng hỗ trợ các chức năng thiết yếu như bảo mật, xác thực người dùng và hỗ trợ khách hàng."],
    analytics: ["Cookie phân tích", "Các cookie này giúp chúng tôi hiểu cách khách truy cập sử dụng website, đo lường lưu lượng và cải thiện hiệu suất."],
    marketing: ["Đo lường tiếp thị", "Các cookie này giúp chúng tôi đo lường hiệu quả của các chiến dịch tiếp thị."],
    personalized: ["Tiếp thị cá nhân hóa", "Tính năng này giúp cá nhân hóa và đo lường hoạt động tiếp thị của Navin Research trên các nền tảng bên thứ ba."],
  },
  "zh-cn": {
    manage: "管理 Cookie", title: "Cookie 偏好设置", intro: "网站和应用会使用 Cookie 及其他标识符，在您的设备上存储和读取信息。其中部分信息可能会出于不同目的与第三方共享。请使用下方工具管理您的偏好设置，您可以随时更改。", learnMore: "了解更多", close: "关闭 Cookie 偏好设置", done: "完成",
    required: ["严格必要", "这些 Cookie 是网站运行所必需的，无法关闭。它们支持安全、用户身份验证和客户支持等基本功能。"],
    analytics: ["分析 Cookie", "这些 Cookie 帮助我们了解访客如何使用网站，并衡量流量、改善网站性能。"],
    marketing: ["营销衡量", "这些 Cookie 帮助我们衡量营销活动的效果。"],
    personalized: ["个性化营销", "这有助于我们在第三方平台上个性化并衡量 Navin Research 自有营销活动。"],
  },
};

export const escapeHtml = (value) => String(value)
  .replaceAll("&", "&amp;")
  .replaceAll("<", "&lt;")
  .replaceAll(">", "&gt;")
  .replaceAll('"', "&quot;");

export function languageLinks(activeKey, suffix = "") {
  const locale = locales[activeKey];
  const options = Object.entries(locales)
    .map(([key, option]) => `<a href="${localePath(key, suffix)}" hreflang="${option.hreflang}" lang="${option.htmlLang}"${key === activeKey ? ' aria-current="page"' : ""}>${escapeHtml(locale.languageNames?.[key] || option.shortLabel)}</a>`)
    .join("");
  const currentLanguage = locale.languageNames?.[activeKey] || locale.shortLabel;
  return `<details class="language-picker"><summary aria-label="${escapeHtml(locale.common.languageAria)}"><span class="language-picker__current">${escapeHtml(currentLanguage)}</span></summary><div>${options}</div></details>`;
}

export function themePicker(localeKey) {
  const ui = experience[localeKey];
  const theme = ui.theme;
  return `<div class="theme-picker" role="group" aria-label="${escapeHtml(theme.label)}"><button type="button" data-theme-choice="system" role="radio" aria-checked="false" aria-label="${escapeHtml(theme.system)}" title="${escapeHtml(theme.system)}"><svg viewBox="0 0 24 24" aria-hidden="true"><rect x="4" y="5" width="16" height="11" rx="1.5"></rect><path d="M9 19h6M12 16v3"></path></svg></button><button type="button" data-theme-choice="light" role="radio" aria-checked="false" aria-label="${escapeHtml(theme.light)}" title="${escapeHtml(theme.light)}"><svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="3.2"></circle><path d="M12 2.8v2M12 19.2v2M2.8 12h2M19.2 12h2M5.5 5.5l1.4 1.4M17.1 17.1l1.4 1.4M18.5 5.5l-1.4 1.4M6.9 17.1l-1.4 1.4"></path></svg></button><button type="button" data-theme-choice="dark" role="radio" aria-checked="false" aria-label="${escapeHtml(theme.dark)}" title="${escapeHtml(theme.dark)}"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M18.8 14.5A7.2 7.2 0 0 1 9.5 5.2a7.6 7.6 0 1 0 9.3 9.3Z"></path></svg></button></div>`;
}

export function cookiePreferencesMarkup(localeKey) {
  const copy = cookieCopy[localeKey] || cookieCopy.en;
  const option = (key, [title, body], disabled = false) => `<label class="cookie-dialog__option"><input type="checkbox" data-cookie-choice="${key}"${disabled ? " disabled checked" : " checked"}><span><strong>${escapeHtml(title)}</strong><small>${escapeHtml(body)}</small></span></label>`;
  return `<dialog class="cookie-dialog" data-cookie-dialog aria-labelledby="cookie-preferences-title"><form method="dialog" class="cookie-dialog__panel"><button type="button" class="cookie-dialog__close" data-cookie-close aria-label="${escapeHtml(copy.close)}">×</button><h2 id="cookie-preferences-title">${escapeHtml(copy.title)}</h2><p>${escapeHtml(copy.intro)} <a href="${localePath(localeKey, "privacy-policy")}" target="_blank" rel="noopener noreferrer">${escapeHtml(copy.learnMore)} <span aria-hidden="true">↗</span></a></p><div class="cookie-dialog__options">${option("required", copy.required, true)}${option("analytics", copy.analytics)}${option("marketing", copy.marketing)}${option("personalized", copy.personalized)}</div><button type="button" class="cookie-dialog__done" data-cookie-done>${escapeHtml(copy.done)}</button></form></dialog><script src="/content-routes/cookie-preferences.js?v=20261013-01" defer></script>`;
}

export function cookieManageLabel(localeKey) {
  return (cookieCopy[localeKey] || cookieCopy.en).manage;
}

export function footerSocialIcons() {
  return `<div class="content-footer__social" aria-label="Social platforms"><span role="img" aria-label="X"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 4 19 20M19 4 5 20"></path></svg></span><span role="img" aria-label="YouTube"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20 8.2a2 2 0 0 0-1.4-1.4C17.3 6.5 12 6.5 12 6.5s-5.3 0-6.6.3A2 2 0 0 0 4 8.2 21 21 0 0 0 3.7 12 21 21 0 0 0 4 15.8a2 2 0 0 0 1.4 1.4c1.3.3 6.6.3 6.6.3s5.3 0 6.6-.3a2 2 0 0 0 1.4-1.4 21 21 0 0 0 .3-3.8 21 21 0 0 0-.3-3.8ZM10.5 15V9l5 3-5 3Z"></path></svg></span><span role="img" aria-label="LinkedIn"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 8.5V18M6 5.5v.1M10 18v-5.2a3 3 0 0 1 6 0V18M10 11.5V18"></path></svg></span><span role="img" aria-label="GitHub"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3.5a8.5 8.5 0 0 0-2.7 16.6c.4.1.6-.2.6-.4v-1.5c-2.3.5-2.8-1-2.8-1-.4-.9-.9-1.1-.9-1.1-.8-.6.1-.6.1-.6.9.1 1.4.9 1.4.9.8 1.4 2.1 1 2.6.8.1-.6.3-1 .5-1.2-1.9-.2-3.9-1-3.9-4.2 0-.9.3-1.7.9-2.3-.1-.2-.4-1.1.1-2.3 0 0 .7-.2 2.4.9.7-.2 1.4-.3 2.1-.3s1.5.1 2.1.3c1.7-1.1 2.4-.9 2.4-.9.5 1.2.2 2.1.1 2.3.6.6.9 1.4.9 2.3 0 3.2-2 4-3.9 4.2.3.3.5.8.5 1.6v2.4c0 .2.2.5.6.4A8.5 8.5 0 0 0 12 3.5Z"></path></svg></span><span role="img" aria-label="Instagram"><svg viewBox="0 0 24 24" aria-hidden="true"><rect x="5" y="5" width="14" height="14" rx="4"></rect><circle cx="12" cy="12" r="3"></circle><circle cx="16.5" cy="7.5" r=".7" fill="currentColor" stroke="none"></circle></svg></span><span role="img" aria-label="TikTok"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M14 5v9.2a3.3 3.3 0 1 1-2.5-3.2M14 5c.6 1.8 1.8 2.8 4 3"></path></svg></span><span role="img" aria-label="Discord"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 7.5c3.2-1.5 6.8-1.5 10 0l1.5 8.3c-2.6 1.8-4.1 2.2-4.1 2.2l-1-1.4a7.7 7.7 0 0 1-2.8 0l-1 1.4s-1.5-.4-4.1-2.2L7 7.5Z"></path><circle cx="9.5" cy="12" r=".8" fill="currentColor" stroke="none"></circle><circle cx="14.5" cy="12" r=".8" fill="currentColor" stroke="none"></circle></svg></span></div>`;
}

function accountActions(localeKey) {
  const account = experience[localeKey].account;
  return `<div class="content-header__utilities"><div class="content-header__account"><a class="content-header__sign-in" href="${localePath(localeKey, "sign-in")}">${escapeHtml(account.signIn)}</a><a class="content-header__sales" href="${localePath(localeKey, "contact")}">${escapeHtml(account.contactSales)}</a><button type="button" class="content-header__try" disabled aria-disabled="true">${escapeHtml(account.tryNavin)} <span aria-hidden="true">↗</span></button></div></div>`;
}

function signInMarkup(localeKey) {
  const account = experience[localeKey].account;
  return `<dialog class="sign-in-dialog" data-sign-in-dialog aria-labelledby="sign-in-title"><form method="dialog" class="sign-in-dialog__panel" data-sign-in-form data-unavailable-message="${escapeHtml(account.unavailable)}"><button type="button" class="sign-in-dialog__close" data-sign-in-close aria-label="${escapeHtml(account.closeLabel)}">×</button><p class="route-page__eyebrow">NAVIN RESEARCH</p><h2 id="sign-in-title">${escapeHtml(account.dialogTitle)}</h2><p class="sign-in-dialog__intro">${escapeHtml(account.dialogIntro)}</p><label>${escapeHtml(account.emailLabel)}<input type="email" name="email" autocomplete="username" required></label><label>${escapeHtml(account.passwordLabel)}<input type="password" name="password" autocomplete="current-password" required></label><button type="submit" class="sign-in-dialog__submit">${escapeHtml(account.continueLabel)}</button><p class="sign-in-dialog__status" data-sign-in-status role="status" aria-live="polite" hidden></p></form></dialog><script src="/content-routes/sign-in.js?v=20261013-12" defer></script>`;
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
            <a href="${localePath(localeKey, "about/people")}">${escapeHtml(ui.menu.people)}</a>
            <button type="button" data-chapters-toggle aria-expanded="false" aria-controls="chapter-panel">${escapeHtml(ui.menu.chapters)}<span aria-hidden="true">→</span></button>
            <a href="${localePath(localeKey, "research")}">${escapeHtml(ui.menu.work)}</a>
            <a href="${localePath(localeKey, "about")}">${escapeHtml(ui.menu.about)}</a>
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
  const status = suffix ? locale.common.status : locale.home.status;
  return `<header class="masthead site-header">
        <div class="masthead__brand-group">
          <button class="menu-toggle" type="button" data-menu-open aria-expanded="false" aria-controls="site-menu" aria-label="${escapeHtml(ui.menu.open)}"><span></span><span></span><span></span></button>
          <a class="brand brand--wordmark" href="${localePath(localeKey)}" aria-label="${escapeHtml(ui.aria.home)}"><span class="brand__name">NAVIN<br>RESEARCH</span></a>
        </div>
        <div class="masthead__meta"><span class="signal">${escapeHtml(status)}</span>${accountActions(localeKey)}</div>
      </header>`;
}

export function contentHeader(localeKey, currentSection, localeSuffix = currentSection === "people" ? "about/people" : currentSection) {
  const locale = locales[localeKey];
  const ui = experience[localeKey];
  const primary = ["research", "products", "models", "notes", "releases"];
  const secondary = ["publications", "about", "people", "careers", "contact", "docs", "search"];
  const link = (section) => {
    const suffix = section === "people" ? "about/people" : section;
    return `<a href="${localePath(localeKey, suffix)}"${section === currentSection ? ' aria-current="page"' : ""}>${escapeHtml(locale.routes[section].title)}</a>`;
  };
  const routes = primary.map(link).join("\n          ");
  const explore = secondary.map(link).join("");
  return `<header class="route-page__header content-header"><a class="route-page__brand content-wordmark" href="${localePath(localeKey)}" aria-label="${escapeHtml(experience[localeKey].aria.home)}"><span>NAVIN<br>RESEARCH</span></a><nav class="route-page__nav" aria-label="${escapeHtml(locale.common.navAria)}">${routes}<details class="content-header__more"><summary>${escapeHtml(ui.menu.more)}</summary><div>${explore}</div></details></nav>${accountActions(localeKey)}</header>`;
}

function footerGroups(localeKey) {
  const locale = locales[localeKey];
  const footer = experience[localeKey].footer;
  const routeLink = (path, label) => ({ path, label });
  const externalLink = (href, label) => ({ href, label, external: true });
  const productLinks = catalogProducts.map((product) => externalLink(product.url || `https://${product.slug}.navinresearch.com/`, product.name));
  return [
    { label: footer.research, groups: [
      { label: footer.library, links: [routeLink("research", locale.routes.research.title), routeLink("models", locale.routes.models.title), routeLink("publications", locale.routes.publications.title)] },
      { label: footer.latest, links: [routeLink("blog", locale.routes.blog.title), routeLink("releases", locale.routes.releases.title)] },
    ] },
    { label: footer.products, groups: [
      { label: footer.directory, links: [routeLink("products", locale.routes.products.title)] },
      { label: footer.systems, links: productLinks },
    ] },
    { label: footer.company, groups: [
      { label: footer.about, links: [routeLink("about", locale.routes.about.title), routeLink("about/people", locale.routes.people.title), routeLink("careers", locale.routes.careers.title), routeLink("contact", locale.routes.contact.title)] },
    ] },
    { label: footer.resources, groups: [
      { label: footer.learn, links: [routeLink("blog", locale.routes.blog.title), routeLink("publications", locale.routes.publications.title), routeLink("docs", locale.routes.docs.title), routeLink("search", locale.routes.search.title)] },
    ] },
    { label: footer.connect, groups: [
      { label: footer.channels, links: [externalLink(`mailto:${site.email}`, footer.email), externalLink(site.linkedin, footer.linkedin), externalLink(site.github, footer.github)] },
    ] },
    { label: footer.more, groups: [
      { label: footer.account, links: [routeLink("sign-in", locale.routes["sign-in"].title), routeLink("contact", locale.routes.contact.title)] },
      { label: footer.legal, links: [routeLink("privacy-policy", experience[localeKey].privacy), routeLink("terms-of-use", experience[localeKey].terms)] },
    ] },
  ];
}

export function routeFooter(localeKey, localeSuffix = "", legacy = false) {
  const locale = locales[localeKey];
  const ui = experience[localeKey];
  const footerClass = legacy ? "footer site-footer route-page__footer content-footer" : "route-page__footer content-footer";
  const groups = footerGroups(localeKey).map((group) => `<section><h2>${escapeHtml(group.label)}</h2>${group.groups.map((subgroup) => `<div class="content-footer__group"><h3>${escapeHtml(subgroup.label)}</h3><nav aria-label="${escapeHtml(subgroup.label)}">${subgroup.links.map((link) => `<a href="${escapeHtml(link.external ? link.href : localePath(localeKey, link.path))}"${link.external ? ' target="_blank" rel="noopener noreferrer"' : ""}>${escapeHtml(link.label)}${link.external ? ' <span aria-hidden="true">↗</span>' : ""}</a>`).join("")}</nav></div>`).join("")}</section>`).join("");
  return `<footer class="${footerClass}"><div class="content-footer__grid">${groups}</div><div class="content-footer__base"><p class="content-footer__copyright">© ${currentYear} NAVIN RESEARCH <button type="button" class="manage-cookies" data-cookie-open>${escapeHtml(cookieManageLabel(localeKey))}</button></p>${footerSocialIcons()}<div class="content-footer__preferences">${themePicker(localeKey)}${languageLinks(localeKey, localeSuffix)}</div></div></footer>${cookiePreferencesMarkup(localeKey)}`;
}

export function siteFooter(localeKey, { flow = false, suffix = "" } = {}) {
  return routeFooter(localeKey, suffix, true);
}
