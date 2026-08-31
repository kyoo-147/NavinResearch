(() => {
  document.querySelectorAll("[data-release-placeholder]").forEach((link) => {
    link.addEventListener("click", (event) => event.preventDefault());
  });

  const input = document.querySelector("[data-release-search]");
  const rows = [...document.querySelectorAll("[data-release-row]")];
  if (input && rows.length) {
    input.addEventListener("input", () => {
      const query = input.value.trim().toLocaleLowerCase();
      rows.forEach((row) => {
        row.hidden = query && !row.textContent.toLocaleLowerCase().includes(query);
      });
    });
  }

  const title = document.querySelector("[data-release-title]");
  if (!title || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  const fontClasses = [
    "release-title-font--pixelated",
    "release-title-font--domino",
    "release-title-font--fort",
    "release-title-font--matrix",
    "release-title-font--matrix-display",
    "release-title-font--super",
  ];
  const text = "NAVIN RELEASES";
  let fontIndex = 0;
  let timer;

  const type = (value, index = 0) => {
    title.textContent = value.slice(0, index);
    if (index < value.length) {
      timer = window.setTimeout(() => type(value, index + 1), 78);
    } else {
      timer = window.setTimeout(erase, 2000);
    }
  };

  const erase = () => {
    const current = title.textContent;
    if (current.length) {
      title.textContent = current.slice(0, -1);
      timer = window.setTimeout(erase, 52);
      return;
    }
    title.classList.remove(...fontClasses);
    fontIndex = (fontIndex + 1) % fontClasses.length;
    title.classList.add(fontClasses[fontIndex]);
    timer = window.setTimeout(() => type(text), 180);
  };

  title.classList.add(fontClasses[fontIndex]);
  timer = window.setTimeout(erase, 2000);
  window.addEventListener("pagehide", () => window.clearTimeout(timer), { once: true });
})();
