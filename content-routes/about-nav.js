(() => {
  const links = [...document.querySelectorAll('.about-index a[href^="#"]')];
  const sections = links
    .map((link) => document.getElementById(link.getAttribute('href').slice(1)))
    .filter(Boolean);
  if (!links.length || !sections.length) return;

  let frame = 0;

  const setActive = (id) => {
    links.forEach((link) => {
      const active = link.getAttribute('href') === `#${id}`;
      link.classList.toggle('is-active', active);
      if (active) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    });
  };

  const updateActive = () => {
    frame = 0;
    const trigger = window.innerHeight * .32;
    let current = sections[0].id;
    for (const section of sections) {
      if (section.getBoundingClientRect().top <= trigger) current = section.id;
      else break;
    }
    setActive(current);
  };

  const scheduleUpdate = () => {
    if (frame) return;
    frame = window.requestAnimationFrame(updateActive);
  };

  setActive(sections[0].id);
  updateActive();
  window.addEventListener('scroll', scheduleUpdate, { passive: true });
  window.addEventListener('resize', scheduleUpdate, { passive: true });
  window.addEventListener('hashchange', scheduleUpdate, { passive: true });
})();
