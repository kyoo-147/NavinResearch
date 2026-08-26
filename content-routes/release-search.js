(() => {
  const input = document.querySelector("[data-release-search]");
  const rows = [...document.querySelectorAll("[data-release-row]")];
  if (!input || !rows.length) return;

  input.addEventListener("input", () => {
    const query = input.value.trim().toLocaleLowerCase();
    rows.forEach((row) => {
      row.hidden = query && !row.textContent.toLocaleLowerCase().includes(query);
    });
  });
})();
