document.querySelectorAll("[data-current-year]").forEach((node) => {
  node.textContent = String(new Date().getFullYear());
});

const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
if (!reduceMotion.matches) {
  window.setTimeout(() => document.documentElement.classList.add("motion-ready"), 1400);
  window.addEventListener("pointermove", (event) => {
    document.documentElement.style.setProperty("--pointer-x", `${(event.clientX / innerWidth) * 100}%`);
    document.documentElement.style.setProperty("--pointer-y", `${(event.clientY / innerHeight) * 100}%`);
  }, { passive: true });
}

const openButton = document.querySelector("[data-menu-open]");
const closeButton = document.querySelector("[data-menu-close]");
const backdrop = document.querySelector("[data-menu-backdrop]");
const menu = document.querySelector("#site-menu");
const chaptersButton = document.querySelector("[data-chapters-toggle]");
const chapterPanel = document.querySelector("#chapter-panel");
const chapterBack = document.querySelector("[data-chapter-back]");
const chapterLinks = [...document.querySelectorAll("[data-chapter-link]")];
const chapterPreviews = [...document.querySelectorAll("[data-chapter-preview]")];
let returnFocus = null;
let closeTimer = null;

function focusable() {
  return menu ? [...menu.querySelectorAll('a[href], button:not([disabled])')].filter((item) => item.offsetParent !== null) : [];
}

function setChapterPreview(slug) {
  chapterLinks.forEach((link) => link.toggleAttribute("data-preview-active", link.dataset.chapterLink === slug));
  chapterPreviews.forEach((preview) => { preview.hidden = preview.dataset.chapterPreview !== slug; });
}

function setChapters(open, manageFocus = true) {
  document.documentElement.classList.toggle("chapters-open", open);
  menu?.classList.toggle("site-menu--chapters", open);
  chaptersButton?.setAttribute("aria-expanded", String(open));
  chapterPanel?.setAttribute("aria-hidden", String(!open));
  if (chapterPanel) chapterPanel.inert = !open;
  if (!open && chapterLinks[0]) setChapterPreview(chapterLinks[0].dataset.chapterLink);
  if (manageFocus && open) chapterPanel?.querySelector("a")?.focus();
  else if (manageFocus) chaptersButton?.focus();
}

function setMenu(open) {
  if (closeTimer) {
    window.clearTimeout(closeTimer);
    closeTimer = null;
  }
  if (open) {
    setChapters(false, false);
    if (backdrop) backdrop.hidden = false;
  }
  document.documentElement.classList.toggle("menu-open", open);
  openButton?.setAttribute("aria-expanded", String(open));
  menu?.setAttribute("aria-hidden", String(!open));
  if (menu) menu.inert = !open;
  if (open) {
    returnFocus = document.activeElement;
    closeButton?.focus();
  } else {
    returnFocus?.focus?.();
    closeTimer = window.setTimeout(() => {
      setChapters(false, false);
      if (backdrop) backdrop.hidden = true;
      closeTimer = null;
    }, 680);
  }
}

openButton?.addEventListener("click", () => setMenu(true));
closeButton?.addEventListener("click", () => setMenu(false));
backdrop?.addEventListener("click", () => setMenu(false));
const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
chaptersButton?.addEventListener("click", (event) => {
  const isOpen = document.documentElement.classList.contains("chapters-open");
  const pointerClick = finePointer && event.detail > 0;
  setChapters(pointerClick ? true : !isOpen, !pointerClick);
});
if (finePointer) {
  chaptersButton?.addEventListener("pointerenter", () => setChapters(true, false));
}
chapterLinks.forEach((link) => {
  link.addEventListener("pointerenter", () => setChapterPreview(link.dataset.chapterLink));
  link.addEventListener("focus", () => setChapterPreview(link.dataset.chapterLink));
});
chapterBack?.addEventListener("click", () => setChapters(false));
menu?.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    event.preventDefault();
    if (document.documentElement.classList.contains("chapters-open")) setChapters(false);
    else setMenu(false);
    return;
  }
  if (event.key !== "Tab") return;
  const items = focusable();
  if (!items.length) return;
  const first = items[0];
  const last = items[items.length - 1];
  if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
  else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
});
