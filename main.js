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
  // Phones: these sit at the top of the same block as the element after them
  const LEAD = ".cs-pillar-label, .cs-item-title, .cs-next > .cs-small, .cs-outcome > .cs-stat";

  function snap() {
    if (!phone.matches) {
      blocks.forEach((el) => { el.style.removeProperty("--rows"); el.style.removeProperty("--lead"); });
      return;
    }
    const cell = page.clientWidth / 4;
    // Measure every block at its natural height first, then write, to avoid
    // a layout per block.
    blocks.forEach((el) => el.style.setProperty("height", "auto", "important"));
    // A case-study label shares its block with the text after it: that text
    // snaps to whole cells counting the label's height (--lead) too.
    const leads = blocks.map((el) => {
      let prev = el.previousElementSibling;
      while (prev && !prev.getClientRects().length) prev = prev.previousElementSibling; // skip hidden (e.g. .desktop-only)
      return prev?.matches(LEAD) && !el.matches(LEAD) ? prev.offsetHeight : 0;
    });
    // A run of approach pillars (label + text, label + text, …) is sized as a
    // group: the run rounds up to whole cells and the leftover is shared
    // evenly, so a pillar that wraps one line longer doesn't leave a gap.
    const needs = blocks.map((el, i) => (el.scrollHeight + leads[i]) / cell);
    const rows = needs.map((need) => Math.max(1, Math.ceil(need - 1 / cell)));
    let run = [];
    blocks.forEach((el, i) => {
      if (!el.matches(".cs-pillar-body")) return;
      run.push(i);
      if (el.nextElementSibling?.matches(".cs-pillar-label")) return;
      const sum = run.reduce((t, j) => t + needs[j], 0);
      const extra = (Math.max(1, Math.ceil(sum - 1 / cell)) - sum) / run.length;
      run.forEach((j) => { rows[j] = needs[j] + extra; });
      run = [];
    });
    blocks.forEach((el, i) => {
      el.style.removeProperty("height");
      el.style.setProperty("--rows", rows[i]);
      if (leads[i]) el.style.setProperty("--lead", leads[i] + "px");
      else el.style.removeProperty("--lead");
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

  /* No single word alone on the last line: in every block of text with 3+
     words, the last two words are joined by a non-breaking space so they
     always wrap together. Runs before fx.js reads the text for its reveals.
     A second pass ignores phone-hidden text (.desktop-only), so the last
     visible words on phones are joined too. */
  (() => {
    const SKIP = ".keys-bar, .jump, .hero-nav, script, style, svg, [aria-hidden='true']";
    const containers = [...document.querySelectorAll("body *")].filter((el) =>
      !el.closest(SKIP) &&
      getComputedStyle(el).display !== "inline" &&
      [...el.childNodes].some((n) => n.nodeType === 3 && n.data.trim()));
    const glue = (el, skipHidden) => {
      const nodes = [];
      const walk = document.createTreeWalker(el, NodeFilter.SHOW_TEXT, {
        acceptNode: (n) => (n.parentElement.closest(SKIP) || (skipHidden && n.parentElement.closest(".desktop-only"))
          ? NodeFilter.FILTER_REJECT : NodeFilter.FILTER_ACCEPT),
      });
      for (let n; (n = walk.nextNode()); ) nodes.push(n);
      const text = nodes.map((n) => n.data).join("");
      if ((text.match(/\S+/g) || []).length < 3) return;
      // the last run of breakable space that has a word after it
      const m = /[ \t\n\r]+(?=\S+\s*$)/.exec(text);
      if (!m) return;
      let i = m.index;
      for (const n of nodes) {
        if (i < n.data.length) { n.data = n.data.slice(0, i) + "\u00a0" + n.data.slice(i).replace(/^[ \t\n\r]+/, ""); return; }
        i -= n.data.length;
      }
    };
    containers.forEach((el) => { glue(el, false); if (el.querySelector(".desktop-only")) glue(el, true); });
  })();

  /* Dev: ?edit in the URL loads the drag-to-position editor for images. */
  if (new URLSearchParams(location.search).has("edit")) {
    document.head.append(Object.assign(document.createElement("script"), { src: "position-editor.js" }));
  }

  /* Case-study videos: muted loops that only load and play while on screen,
     with no player controls. If autoplay is blocked (e.g. iPhone Low Power
     Mode), a tap plays/pauses. With reduced motion they stay on their poster
     and show controls. */
  const videos = document.querySelectorAll("video.cs-video");
  if (reduceMotion) {
    videos.forEach((v) => { v.removeAttribute("autoplay"); v.controls = true; });
  } else if (videos.length) {
    const io = new IntersectionObserver((entries) => {
      for (const { target: v, isIntersecting } of entries) {
        if (isIntersecting) {
          if (v.preload === "none") v.preload = "auto";
          v.play().catch(() => {}); // autoplay blocked: tap to play (below)
        } else {
          v.pause();
        }
      }
    }, { threshold: 0.25 });
    videos.forEach((v) => {
      io.observe(v);
      v.addEventListener("click", () => (v.paused ? v.play().catch(() => {}) : v.pause()));
    });
  }
})();
