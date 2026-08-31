/* Lajvard runtime: notebook navigation only; no robot service or telemetry is contacted. */
const notebook = document.querySelector("[data-notebook-state]");
if (notebook) notebook.setAttribute("data-runtime", "static-concept");
const menuButton = document.querySelector("[data-product-menu]");
const menu = document.querySelector("#product-menu");
const details = [...document.querySelectorAll(".lj-nav-group")];

function setMenu(open) {
  document.documentElement.classList.toggle("product-menu-open", open);
  menuButton?.setAttribute("aria-expanded", String(open));
  if (menu) menu.inert = !open && matchMedia("(max-width: 1000px)").matches;
  if (!open) details.forEach((item) => item.removeAttribute("open"));
}

menuButton?.addEventListener("click", () => setMenu(menuButton.getAttribute("aria-expanded") !== "true"));
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    setMenu(false);
    menuButton?.focus();
  }
});

details.forEach((item) => item.addEventListener("toggle", () => {
  if (!item.open) return;
  details.filter((candidate) => candidate !== item).forEach((candidate) => candidate.removeAttribute("open"));
}));

const media = matchMedia("(max-width: 1000px)");
function syncMenuMode() {
  if (media.matches) setMenu(false);
  else {
    document.documentElement.classList.remove("product-menu-open");
    if (menu) menu.inert = false;
    menuButton?.setAttribute("aria-expanded", "false");
  }
}
media.addEventListener?.("change", syncMenuMode);
syncMenuMode();

document.querySelectorAll("[data-current-year]").forEach((node) => {
  node.textContent = String(new Date().getFullYear());
});
