/* Sori runtime: one accessible, deliberately quiet navigation state. */
const button = document.querySelector("[data-product-menu]");
const menu = document.querySelector("#product-menu");
const mobile = matchMedia("(max-width: 900px)");
let returnFocus = null;
function setMenu(open, restore = true) {
  document.documentElement.classList.toggle("product-menu-open", open);
  button?.setAttribute("aria-expanded", String(open));
  if (menu) menu.inert = mobile.matches && !open;
  if (open) { returnFocus = document.activeElement; menu?.querySelector("a")?.focus(); }
  else if (restore) returnFocus?.focus?.();
}
button?.addEventListener("click", () => setMenu(button.getAttribute("aria-expanded") !== "true"));
document.addEventListener("keydown", (event) => {
  if (event.key !== "Escape" || button?.getAttribute("aria-expanded") !== "true") return;
  event.preventDefault(); setMenu(false);
});
menu?.addEventListener("keydown", (event) => {
  if (event.key !== "Tab") return;
  const items = [...menu.querySelectorAll("a[href],button:not([disabled])")].filter((node) => !node.closest("[inert]"));
  if (!items.length) return;
  if (event.shiftKey && document.activeElement === items[0]) { event.preventDefault(); items.at(-1).focus(); }
  else if (!event.shiftKey && document.activeElement === items.at(-1)) { event.preventDefault(); items[0].focus(); }
});
function sync() { if (!mobile.matches) setMenu(false, false); else if (button) { button.setAttribute("aria-expanded", "false"); if (menu) menu.inert = true; } }
mobile.addEventListener?.("change", sync); sync();
document.querySelectorAll("[data-current-year]").forEach((node) => { node.textContent = String(new Date().getFullYear()); });
