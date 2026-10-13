(() => {
  const dialog = document.querySelector("[data-cookie-dialog]");
  if (!dialog) return;

  const openButtons = document.querySelectorAll("[data-cookie-open]");
  const closeButton = dialog.querySelector("[data-cookie-close]");
  const doneButton = dialog.querySelector("[data-cookie-done]");
  const storageKey = "navin-cookie-preferences";

  const open = () => {
    if (typeof dialog.showModal === "function") dialog.showModal();
    else dialog.setAttribute("open", "");
  };
  const close = () => {
    if (typeof dialog.close === "function") dialog.close();
    else dialog.removeAttribute("open");
  };
  const save = () => {
    const preferences = Object.fromEntries([...dialog.querySelectorAll("[data-cookie-choice]")].map((input) => [input.dataset.cookieChoice, input.checked]));
    try { window.localStorage.setItem(storageKey, JSON.stringify(preferences)); } catch {}
    close();
  };

  openButtons.forEach((button) => button.addEventListener("click", open));
  closeButton?.addEventListener("click", close);
  doneButton?.addEventListener("click", save);
  dialog.addEventListener("click", (event) => {
    if (event.target === dialog) close();
  });

  try {
    const saved = JSON.parse(window.localStorage.getItem(storageKey) || "null");
    if (saved && typeof saved === "object") {
      dialog.querySelectorAll("[data-cookie-choice]").forEach((input) => {
        if (!input.disabled && typeof saved[input.dataset.cookieChoice] === "boolean") input.checked = saved[input.dataset.cookieChoice];
      });
    }
  } catch {}
})();
