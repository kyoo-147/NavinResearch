(() => {
  try {
    const saved = window.localStorage.getItem("navin-theme");
    const preference = ["light", "dark", "system"].includes(saved) ? saved : "dark";
    const resolved = preference === "system"
      ? (window.matchMedia?.("(prefers-color-scheme: light)").matches ? "light" : "dark")
      : preference;
    document.documentElement.dataset.theme = resolved;
    document.documentElement.dataset.themePreference = preference;
  } catch {
    document.documentElement.dataset.theme = "dark";
    document.documentElement.dataset.themePreference = "dark";
  }
})();
