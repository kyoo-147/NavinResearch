(() => {
  const input = document.querySelector("[data-route-search]");
  const results = document.querySelector("[data-search-results]");
  if (!input || !results) return;

  let items = [];

  function appendResult(item) {
    const article = document.createElement("article");
    article.className = "route-search__result";
    const heading = document.createElement("h2");
    const link = document.createElement("a");
    link.href = item.url;
    link.textContent = `${item.title} · ${item.language}`;
    heading.append(link);
    const description = document.createElement("p");
    description.textContent = item.description;
    article.append(heading, description);
    results.append(article);
  }

  function render() {
    const query = input.value.trim().toLocaleLowerCase();
    const matches = query
      ? items.filter((item) => `${item.title} ${item.description} ${item.text}`.toLocaleLowerCase().includes(query))
      : items;
    results.replaceChildren();
    if (matches.length) {
      matches.forEach(appendResult);
      return;
    }
    const empty = document.createElement("p");
    empty.className = "route-search__empty";
    empty.textContent = results.dataset.emptyLabel || "No matching public page was found.";
    results.append(empty);
  }

  input.addEventListener("input", render);
  fetch("/content-routes/search-index.json", { cache: "force-cache" })
    .then((response) => {
      if (!response.ok) throw new Error("search index unavailable");
      return response.json();
    })
    .then((data) => {
      if (!Array.isArray(data)) throw new Error("invalid search index");
      items = data.filter(
        (item) =>
          typeof item.url === "string" &&
          item.url.startsWith("/") &&
          typeof item.title === "string" &&
          typeof item.description === "string" &&
          typeof item.text === "string" &&
          typeof item.language === "string",
      );
      render();
    })
    .catch(() => {
      results.textContent = results.dataset.emptyLabel || "Search is temporarily unavailable.";
    });
})();
