(() => {
  const cards = [...document.querySelectorAll("[data-notes-card]")];
  const topics = [...document.querySelectorAll("[data-notes-topic]")];
  const more = document.querySelector("[data-notes-more]");
  const topicControls = document.querySelector("#notes-topic-controls");
  const filterButton = document.querySelector("[data-notes-filter]");
  const sortButton = document.querySelector("[data-notes-sort]");
  const sortLabel = sortButton?.querySelector("[data-notes-sort-label]");
  const items = document.querySelector("[data-notes-items]");
  const viewButtons = [...document.querySelectorAll("[data-notes-view]")];
  if (!cards.length) return;

  let showingOldest = false;
  const sortText = sortLabel?.textContent || "Sort";

  const resetVisibleCards = () => {
    cards.forEach((card) => { if (!card.closest(".notes-grid__items")) card.hidden = false; });
    const orderedGridCards = items ? [...items.querySelectorAll(":scope > [data-notes-card]")] : [];
    orderedGridCards.forEach((card, index) => { card.hidden = index >= 9; });
    if (more) more.hidden = !cards.some((card) => card.hidden);
  };

  const showAll = () => {
    cards.forEach((card) => { card.hidden = false; });
    if (more) more.hidden = true;
  };

  filterButton?.addEventListener("click", () => {
    const isCollapsed = topicControls?.classList.toggle("is-collapsed") || false;
    filterButton.setAttribute("aria-expanded", String(!isCollapsed));
  });

  sortButton?.addEventListener("click", () => {
    if (!items) return;
    showingOldest = !showingOldest;
    const gridCards = [...items.querySelectorAll(":scope > [data-notes-card]")].reverse();
    items.append(...gridCards);
    sortButton.setAttribute("aria-pressed", String(showingOldest));
    if (sortLabel) sortLabel.textContent = sortText;
    resetVisibleCards();
  });

  viewButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const selectedView = button.dataset.notesView;
      viewButtons.forEach((viewButton) => {
        const active = viewButton === button;
        viewButton.classList.toggle("is-active", active);
        viewButton.setAttribute("aria-pressed", String(active));
      });
      items?.classList.toggle("notes-grid__items--list", selectedView === "list");
    });
  });

  more?.addEventListener("click", showAll);
  topics.forEach((topicButton) => {
    topicButton.addEventListener("click", () => {
      const selected = topicButton.dataset.notesTopic;
      topics.forEach((button) => button.classList.toggle("is-active", button === topicButton));
      if (selected === "all") {
        resetVisibleCards();
        return;
      }
      cards.forEach((card) => {
        card.hidden = card.dataset.notesCategory !== selected;
      });
      if (more) more.hidden = true;
    });
  });
  resetVisibleCards();
})();
