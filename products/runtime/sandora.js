/* Product runtime: sandora terminal and department controls. */
document.documentElement.classList.remove("no-js");
document.documentElement.dataset.sandoraRuntime = "terminal";
const menuButton = document.querySelector("[data-product-menu]");
const menu = document.querySelector("#product-menu");
const details = [...document.querySelectorAll(".sd-nav-group")];

function setMenu(open) {
  document.documentElement.classList.toggle("product-menu-open", open);
  document.body.classList.toggle("sd-menu-scroll-lock", open);
  menuButton?.setAttribute("aria-expanded", String(open));
  if (menu) menu.inert = !open && matchMedia("(max-width: 1100px)").matches;
  if (!open) details.forEach((item) => item.removeAttribute("open"));
}

menuButton?.addEventListener("click", () => {
  const open = menuButton.getAttribute("aria-expanded") !== "true";
  setMenu(open);
  if (open) menu?.querySelector("a, summary")?.focus();
});
document.addEventListener("keydown", (event) => {
  const menuOpen = menuButton?.getAttribute("aria-expanded") === "true";
  const openGroup = details.find((item) => item.open);
  if (event.key === "Tab" && menuOpen && menu) {
    const focusable = [...menu.querySelectorAll("a[href], summary, button:not([disabled])")].filter((item) => !item.closest("[inert]"));
    const first = focusable[0];
    const last = focusable.at(-1);
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last?.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first?.focus();
    }
  }
  if (event.key === "Escape" && (menuOpen || openGroup)) {
    setMenu(false);
    if (menuOpen) menuButton?.focus();
    else openGroup?.querySelector("summary")?.focus();
  }
});

document.addEventListener("pointerdown", (event) => {
  if (!event.target.closest(".sd-header")) setMenu(false);
});

details.forEach((item) => item.addEventListener("toggle", () => {
  if (!item.open) return;
  details.filter((candidate) => candidate !== item).forEach((candidate) => candidate.removeAttribute("open"));
}));

const media = matchMedia("(max-width: 1100px)");
function syncMenuMode() {
  if (media.matches) setMenu(false);
  else {
    document.documentElement.classList.remove("product-menu-open");
    document.body.classList.remove("sd-menu-scroll-lock");
    if (menu) menu.inert = false;
    menuButton?.setAttribute("aria-expanded", "false");
  }
}
media.addEventListener?.("change", syncMenuMode);
syncMenuMode();

document.querySelectorAll("[data-current-year]").forEach((node) => {
  node.textContent = String(new Date().getFullYear());
});
