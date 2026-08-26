(() => {
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

  const fonts = [
    "Pixelated Elegance",
    "Domino Brick",
    "Fort Avenue",
    "Matrixtype",
    "Matrixtype Display",
    "Super Pixel",
  ];
  const text = "NAVIN RELEASES";
  let fontIndex = 0;
  let timer;

  const type = (value, index = 0) => {
    title.textContent = value.slice(0, index);
    if (index < value.length) {
      timer = window.setTimeout(() => type(value, index + 1), 78);
    } else {
      timer = window.setTimeout(erase, 4000);
    }
  };

  const erase = () => {
    const current = title.textContent;
    if (current.length) {
      title.textContent = current.slice(0, -1);
      timer = window.setTimeout(erase, 52);
      return;
    }
    fontIndex = (fontIndex + 1) % fonts.length;
    title.style.fontFamily = `"${fonts[fontIndex]}", "Courier New", monospace`;
    timer = window.setTimeout(() => type(text), 180);
  };

  title.style.fontFamily = `"${fonts[fontIndex]}", "Courier New", monospace`;
  timer = window.setTimeout(erase, 4000);
  window.addEventListener("pagehide", () => window.clearTimeout(timer), { once: true });
})();
