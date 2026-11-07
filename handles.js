/* Corner handles: a small hollow square on the 4 corners of every block, like
   a Figma selection on canvas. They replace the grid lines. Clickable blocks'
   handles turn green on hover or keyboard focus. Static, so photosensitive-safe. */
(() => {
  const SIZE = 8;         // design px: side of each corner square (Figma-style selection handle)
  const STROKE = 1.5;     // design px
  const COLOR = "#4a4a4a";
  const page = document.querySelector(".page");
  const NS = "http://www.w3.org/2000/svg";
  const svg = document.createElementNS(NS, "svg");
  svg.classList.add("corner-marks");
  svg.setAttribute("aria-hidden", "true");
  const path = document.createElementNS(NS, "path");
  path.setAttribute("fill", "#121212"); // page color, so the handle reads as a hollow square
  path.setAttribute("stroke", COLOR);
  // Hovering (or keyboard-focusing) a clickable block turns its 4 marks green.
  const hot = document.createElementNS(NS, "path");
  hot.setAttribute("fill", "#121212");
  hot.setAttribute("stroke", getComputedStyle(document.documentElement).getPropertyValue("--color-accent-green").trim() || "#09fd42");
  svg.append(path, hot);
  page.append(svg);
  const marks = new Map(); // block -> its path data
  let active = null;
  const showHot = () => {
    hot.setAttribute("d", active ? marks.get(active) || "" : "");
    if (typeof drawOverPin === "function") drawOverPin();
  };
  const isClickable = (el) => el.matches("a, button, .card") || !!el.querySelector(":scope > a:only-child");

  // Blocks are the grid items of each .section. Wrappers that only pass the
  // grid down (display: contents, or subgrid lists like the hero headline and
  // timeline) are skipped in favour of their children.
  const isWrapper = (el) => {
    const cs = getComputedStyle(el);
    return cs.display === "contents" || el.matches(".hero-headline, .tl-list, .tl-row");
  };
  const collect = (el, out) => {
    for (const child of el.children) {
      if (isWrapper(child)) collect(child, out);
      else out.push(child);
    }
    return out;
  };
  // Position relative to .page, from layout offsets (ignores reveal transforms).
  const offset = (el) => {
    let x = 0, y = 0, n = el;
    while (n && n !== page) { x += n.offsetLeft; y += n.offsetTop; n = n.offsetParent; }
    return [x, y];
  };

  const draw = () => {
    const sample = document.querySelector(".section");
    const px = sample ? sample.offsetWidth / 1440 : 1;
    const size = SIZE * px;
    const sq = (cx, cy) => `M${cx - size / 2} ${cy - size / 2}h${size}v${size}h${-size}Z`;
    const seen = new Set();
    let d = "";
    marks.clear();
    corners = [];
    handleSize = size;
    strokeW = Math.max(1, STROKE * px);
    for (const section of document.querySelectorAll(".page .section")) {
      for (const el of collect(section, [])) {
        if (!el.offsetWidth || !el.offsetHeight) continue;
        if (el.matches(".hero-logo") && document.querySelector(".pin-logo")?.offsetParent) continue; // the pinned copy draws its own
        const [x, y] = offset(el);
        const w = el.offsetWidth, h = el.offsetHeight;
        if (isClickable(el)) {
          marks.set(el, [[x, y], [x + w, y], [x, y + h], [x + w, y + h]]
            .map(([cx, cy]) => sq(cx, cy)).join(""));
          if (!el.dataset.cornerHover) {
            el.dataset.cornerHover = "1";
            const on = () => { active = el; showHot(); };
            const off = () => { if (active === el) { active = null; showHot(); } };
            el.addEventListener("pointerenter", on);
            el.addEventListener("pointerleave", off);
            el.addEventListener("focusin", on);
            el.addEventListener("focusout", off);
          }
        }
        for (const [cx, cy] of [[x, y], [x + w, y], [x, y + h], [x + w, y + h]]) {
          const key = Math.round(cx) + "," + Math.round(cy);
          if (seen.has(key)) continue; // neighbours share corners
          seen.add(key);
          corners.push([cx, cy]);
          d += sq(cx, cy);
        }
      }
    }
    path.setAttribute("d", d);
    path.setAttribute("stroke-width", String(Math.max(1, STROKE * px)));
    hot.setAttribute("stroke-width", String(Math.max(1, STROKE * px)));
    showHot();
    svg.setAttribute("width", page.scrollWidth);
    svg.setAttribute("height", page.scrollHeight);
    drawOverPin();
  };

  /* The pinned MK logo (keys-nav.js) sits above the page, so its
     background would cut other blocks' handles in half as they scroll past.
     Those few handles are redrawn whole in a fixed layer above the logo; the
     logo's own 4 handles are skipped here, so it always shows exactly 4. */
  let corners = [], handleSize = 8, strokeW = 1.5;
  const over = document.createElementNS(NS, "svg");
  over.classList.add("corner-marks-over");
  over.setAttribute("aria-hidden", "true");
  const overPath = document.createElementNS(NS, "path");
  overPath.setAttribute("fill", "#121212");
  overPath.setAttribute("stroke", COLOR);
  const overHot = document.createElementNS(NS, "path");
  overHot.setAttribute("fill", "#121212");
  overHot.setAttribute("stroke", hot.getAttribute("stroke"));
  over.append(overPath, overHot);
  document.body.append(over);
  function drawOverPin() {
    const pin = document.querySelector(".pin-logo");
    // no pinned logo, or it's hidden (phones)
    if (!pin || !pin.offsetParent) { overPath.setAttribute("d", ""); overHot.setAttribute("d", ""); return; }
    const r = pin.getBoundingClientRect();
    const pr = page.getBoundingClientRect();
    const m = handleSize;
    const own = [[r.left, r.top], [r.right, r.top], [r.left, r.bottom], [r.right, r.bottom]];
    const hotKeys = new Set();
    if (active) {
      const [x, y] = offset(active);
      const w = active.offsetWidth, h = active.offsetHeight;
      for (const [cx, cy] of [[x, y], [x + w, y], [x, y + h], [x + w, y + h]]) hotKeys.add(Math.round(cx) + "," + Math.round(cy));
    }
    let d = "", dh = "";
    for (const [cx, cy] of corners) {
      const vx = pr.left + cx, vy = pr.top + cy;
      if (vx < r.left - m || vx > r.right + m || vy < r.top - m || vy > r.bottom + m) continue;
      if (own.some(([ox, oy]) => Math.abs(ox - vx) < 2 && Math.abs(oy - vy) < 2)) continue;
      const sq = `M${vx - m / 2} ${vy - m / 2}h${m}v${m}h${-m}Z`;
      if (hotKeys.has(Math.round(cx) + "," + Math.round(cy))) dh += sq;
      else d += sq;
    }
    overPath.setAttribute("d", d);
    overHot.setAttribute("d", dh);
    overPath.setAttribute("stroke-width", strokeW);
    overHot.setAttribute("stroke-width", strokeW);
  }
  addEventListener("scroll", drawOverPin, { passive: true });
  addEventListener("resize", drawOverPin);
  let queued = false;
  const schedule = () => {
    if (queued) return;
    queued = true;
    requestAnimationFrame(() => { queued = false; draw(); });
  };
  new ResizeObserver(schedule).observe(page);
  document.querySelectorAll(".page .section").forEach((s) => new ResizeObserver(schedule).observe(s));
  document.fonts && document.fonts.ready.then(schedule);
  addEventListener("load", schedule);

  schedule();
})();
