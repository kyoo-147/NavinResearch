(() => {
  const storageKey = "navin-theme";
  const media = window.matchMedia?.("(prefers-color-scheme: light)");
  const controls = [...document.querySelectorAll("[data-theme-choice]")];
  const root = document.documentElement;

  const resolve = (preference) => preference === "system" ? (media?.matches ? "light" : "dark") : preference;
  const readPreference = () => {
    try {
      const value = window.localStorage.getItem(storageKey);
      return ["system", "light", "dark"].includes(value) ? value : "dark";
    } catch {
      return "dark";
    }
  };
  const setPreference = (preference, persist = true) => {
    const safePreference = ["system", "light", "dark"].includes(preference) ? preference : "dark";
    if (persist) {
      try { window.localStorage.setItem(storageKey, safePreference); } catch {}
    }
    root.dataset.themePreference = safePreference;
    root.dataset.theme = resolve(safePreference);
    controls.forEach((control) => {
      const active = control.dataset.themeChoice === safePreference;
      control.setAttribute("aria-checked", String(active));
      control.classList.toggle("is-active", active);
    });
  };

  setPreference(readPreference(), false);
  controls.forEach((control) => control.addEventListener("click", () => setPreference(control.dataset.themeChoice)));
  media?.addEventListener?.("change", () => {
    if (root.dataset.themePreference === "system") root.dataset.theme = resolve("system");
  });
})();
