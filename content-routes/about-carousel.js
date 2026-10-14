(() => {
  const root = document.querySelector("[data-related-carousel]");
  const viewport = root?.querySelector("[data-related-viewport]");
  const track = root?.querySelector("[data-related-track]");
  const previous = root?.querySelector("[data-related-previous]");
  const next = root?.querySelector("[data-related-next]");
  const cards = track ? [...track.querySelectorAll("[data-related-card]")] : [];
  if (!root || !viewport || !track || !cards.length) return;

  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  let dragStartX = 0;
  let dragStartScroll = 0;
  let dragging = false;
  let moved = false;
  let suppressClickUntil = 0;
  let updateFrame = 0;

  const updateControls = () => {
    updateFrame = 0;
    const maxScroll = Math.max(0, track.scrollWidth - viewport.clientWidth);
    const hasOverflow = maxScroll > 1;
    if (previous) {
      previous.hidden = !hasOverflow;
      previous.disabled = !hasOverflow || viewport.scrollLeft <= 1;
    }
    if (next) {
      next.hidden = !hasOverflow;
      next.disabled = !hasOverflow || viewport.scrollLeft >= maxScroll - 1;
    }
  };

  const scheduleUpdate = () => {
    if (updateFrame) return;
    updateFrame = window.requestAnimationFrame(updateControls);
  };

  const cardStep = () => {
    const card = cards[0];
    if (!card) return viewport.clientWidth;
    const styles = window.getComputedStyle(track);
    const gap = Number.parseFloat(styles.columnGap || styles.gap || "0") || 0;
    return card.getBoundingClientRect().width + gap;
  };

  const scrollByCard = (direction) => {
    viewport.scrollBy({ left: direction * cardStep(), behavior: reducedMotion.matches ? "auto" : "smooth" });
  };

  previous?.addEventListener("click", () => scrollByCard(-1));
  next?.addEventListener("click", () => scrollByCard(1));

  root.addEventListener("keydown", (event) => {
    if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;
    if (event.target !== viewport && !event.target.closest("[data-related-card]")) return;
    event.preventDefault();
    if (event.key === "Home") {
      viewport.scrollTo({ left: 0, behavior: reducedMotion.matches ? "auto" : "smooth" });
    } else if (event.key === "End") {
      viewport.scrollTo({ left: track.scrollWidth, behavior: reducedMotion.matches ? "auto" : "smooth" });
    } else {
      scrollByCard(event.key === "ArrowLeft" ? -1 : 1);
    }
  });

  viewport.addEventListener("scroll", scheduleUpdate, { passive: true });
  viewport.addEventListener("wheel", (event) => {
    const maxScroll = Math.max(0, track.scrollWidth - viewport.clientWidth);
    if (maxScroll <= 1) return;
    const horizontalDelta = Math.abs(event.deltaX) > Math.abs(event.deltaY)
      ? event.deltaX
      : event.shiftKey ? event.deltaY : 0;
    if (!horizontalDelta) return;
    event.preventDefault();
    viewport.scrollLeft += horizontalDelta;
  }, { passive: false });
  viewport.addEventListener("pointerdown", (event) => {
    if (event.pointerType === "mouse" && event.button !== 0) return;
    dragging = true;
    moved = false;
    dragStartX = event.clientX;
    dragStartScroll = viewport.scrollLeft;
    viewport.classList.add("is-dragging");
  });
  viewport.addEventListener("pointermove", (event) => {
    if (!dragging) return;
    const delta = event.clientX - dragStartX;
    if (Math.abs(delta) < 6 && !moved) return;
    moved = true;
    try { viewport.setPointerCapture?.(event.pointerId); } catch {}
    event.preventDefault();
    const maxScroll = Math.max(0, track.scrollWidth - viewport.clientWidth);
    viewport.scrollLeft = Math.max(0, Math.min(maxScroll, dragStartScroll - delta));
  });
  viewport.addEventListener("dragstart", (event) => event.preventDefault());

  const endDrag = (event) => {
    if (!dragging) return;
    dragging = false;
    viewport.classList.remove("is-dragging");
    try {
      if (event?.pointerId != null && viewport.hasPointerCapture?.(event.pointerId)) viewport.releasePointerCapture?.(event.pointerId);
    } catch {}
    if (moved) suppressClickUntil = Date.now() + 250;
    scheduleUpdate();
  };
  viewport.addEventListener("pointerup", endDrag);
  viewport.addEventListener("pointercancel", endDrag);
  viewport.addEventListener("lostpointercapture", () => {
    if (!dragging) return;
    dragging = false;
    viewport.classList.remove("is-dragging");
    if (moved) suppressClickUntil = Date.now() + 250;
    scheduleUpdate();
  });
  cards.forEach((card) => card.querySelector("a")?.addEventListener("click", (event) => {
    if (Date.now() < suppressClickUntil) {
      event.preventDefault();
      event.stopPropagation();
    }
  }));

  if ("ResizeObserver" in window) new ResizeObserver(scheduleUpdate).observe(viewport);
  reducedMotion.addEventListener?.("change", scheduleUpdate);
  window.addEventListener("resize", scheduleUpdate, { passive: true });
  window.addEventListener("load", scheduleUpdate, { once: true });
  document.fonts?.ready?.then(scheduleUpdate);
  updateControls();
})();
