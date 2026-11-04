/* Smooth scrolling (Lenis) and whole-cell snapping on phones. */

(() => {
  const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (window.Lenis && !reduceMotion) {
    new Lenis({ autoRaf: true, anchors: true });
  }

  /* Phones: blocks marked [data-snap] get --rows = the number of whole
     cells their content needs, so everything stays on the grid. */
  const page = document.querySelector(".page");
  const phone = matchMedia("(max-width: 899px)");
  const blocks = [...document.querySelectorAll("[data-snap]")];

  function snap() {
    if (!phone.matches) {
      blocks.forEach((el) => el.style.removeProperty("--rows"));
      return;
    }
    const cell = page.clientWidth / 4;
    // Measure every block at its natural height first, then write, to avoid
    // a layout per block.
    blocks.forEach((el) => el.style.setProperty("height", "auto", "important"));
    const rows = blocks.map((el) => Math.max(1, Math.ceil((el.scrollHeight - 1) / cell)));
    blocks.forEach((el, i) => {
      el.style.removeProperty("height");
      el.style.setProperty("--rows", rows[i]);
    });
  }

  let frame = 0;
  const schedule = () => {
    cancelAnimationFrame(frame);
    frame = requestAnimationFrame(snap);
  };
  new ResizeObserver(schedule).observe(page);
  phone.addEventListener("change", schedule);
  document.fonts?.ready.then(schedule);
  snap();
})();
