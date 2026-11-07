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

  /* Dev: ?edit in the URL loads the drag-to-position editor for images. */
  if (new URLSearchParams(location.search).has("edit")) {
    document.head.append(Object.assign(document.createElement("script"), { src: "position-editor.js" }));
  }

  /* Case-study videos: muted loops that only load and play while on screen.
     With reduced motion they stay on their poster and show controls. */
  const videos = document.querySelectorAll("video.cs-video");
  if (reduceMotion) {
    videos.forEach((v) => { v.removeAttribute("autoplay"); v.controls = true; });
  } else if (videos.length) {
    const io = new IntersectionObserver((entries) => {
      for (const { target: v, isIntersecting } of entries) {
        if (isIntersecting) {
          if (v.preload === "none") v.preload = "auto";
          v.play().catch(() => { v.controls = true; }); // autoplay blocked: let the viewer start it
        } else {
          v.pause();
        }
      }
    }, { threshold: 0.25 });
    videos.forEach((v) => io.observe(v));
  }
})();
