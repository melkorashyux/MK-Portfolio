/* Image position & zoom editor (dev only). Loaded by main.js when the URL has ?edit.

   On any cropped image (case-study slots, work cards, about picture):
   - drag to choose which part shows
   - pinch on a trackpad, or hold ⌥ Option / Ctrl and scroll, to zoom
     (or use the − / + buttons on the image)
   - double-click to reset position and zoom
   Values are kept in this browser (localStorage) so reloads keep them;
   "Copy all" copies them to paste back into the HTML.

   Zoom is plain CSS: transform: scale(z) with transform-origin at the same
   x% y% as object-position, so the framed point stays put while zooming
   and dragging still pans across the whole (zoomed) image. */

(() => {
  const SELECTOR = ".cs-image img, .card-image img, .about-picture img";
  const KEY = "pos-editor:" + location.pathname.split("/").pop();
  const ZMIN = 1, ZMAX = 4;
  const imgs = [...document.querySelectorAll(SELECTOR)];
  if (!imgs.length) return;

  const load = () => { try { return JSON.parse(localStorage.getItem(KEY)) || {}; } catch { return {}; } };
  const save = (v) => { try { localStorage.setItem(KEY, JSON.stringify(v)); } catch {} };
  const name = (img) => decodeURIComponent(img.getAttribute("src").split("/").pop().split("?")[0]);
  const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
  const fmt = ({ x, y, z }) => `${Math.round(x)}% ${Math.round(y)}%` + (z > 1.001 ? ` ×${z.toFixed(2)}` : "");

  // Read the image's current framing from its styles.
  function read(img) {
    const [px = "50%", py = "50%"] = getComputedStyle(img).objectPosition.split(" ");
    const pct = (v) => (v.endsWith("%") ? parseFloat(v) : 50);
    const z = parseFloat((img.style.transform.match(/scale\(([\d.]+)\)/) || [])[1]) || 1;
    return { x: pct(px), y: pct(py), z };
  }
  function apply(img, s) {
    s.x = clamp(s.x, 0, 100); s.y = clamp(s.y, 0, 100); s.z = clamp(s.z, ZMIN, ZMAX);
    img.__s = s;
    const pos = `${s.x.toFixed(1)}% ${s.y.toFixed(1)}%`;
    img.style.objectPosition = pos;
    if (s.z > 1.001) { img.style.transform = `scale(${s.z.toFixed(3)})`; img.style.transformOrigin = pos; }
    else { img.style.removeProperty("transform"); img.style.removeProperty("transform-origin"); }
    img.__badge.textContent = fmt(s);
  }
  // How far (in px) the zoomed, cover-fitted image overflows its box on each axis.
  function overflow(img) {
    const w = img.offsetWidth, h = img.offsetHeight; // layout size, unaffected by the transform
    const k = Math.max(w / img.naturalWidth, h / img.naturalHeight) * img.__s.z;
    return { ox: img.naturalWidth * k - w, oy: img.naturalHeight * k - h };
  }

  const stored = load();
  const css = document.createElement("style");
  css.textContent = `
    .pe-on { cursor: grab; touch-action: none; user-select: none; -webkit-user-drag: none; }
    .pe-on:active { cursor: grabbing; }
    .card-link::after { pointer-events: none; } /* let drags reach the card image */
    .pe-wrap { outline: 1px dashed #09fd42; outline-offset: -1px; overflow: hidden; }
    .pe-badge, .pe-zoom { position: absolute; top: 8px; z-index: 5;
      font: 500 11px/1 "Geist Mono", monospace; background: #121212cc; color: #09fd42; }
    .pe-badge { left: 8px; padding: 5px 7px; pointer-events: none; }
    .pe-zoom { right: 8px; display: flex; }
    .pe-zoom button { font: inherit; color: inherit; background: none; border: 0; width: 24px; height: 21px; cursor: pointer; }
    .pe-zoom button:hover { background: #09fd42; color: #121212; }
    .pe-panel { position: fixed; left: 16px; bottom: 16px; z-index: 100; width: 330px; max-width: calc(100vw - 32px);
      font: 12px/1.5 "Geist Mono", monospace; color: #fff; background: #121212f0; border: 1px solid #09fd42; padding: 12px; }
    .pe-panel b { color: #09fd42; font-weight: 500; }
    .pe-panel p { margin: 0 0 8px; color: #b8b8b8; }
    .pe-panel pre { margin: 0 0 10px; max-height: 30vh; overflow: auto; white-space: pre-wrap; font: inherit; }
    .pe-panel button { font: inherit; color: #121212; background: #09fd42; border: 0; padding: 5px 10px; margin-right: 6px; cursor: pointer; }
    .pe-panel button.pe-ghost { color: #fff; background: transparent; outline: 1px solid #626161; }
  `;
  document.head.append(css);

  const panel = document.createElement("div");
  panel.className = "pe-panel";
  panel.innerHTML = `<b>Position editor</b><p>Drag to move. Pinch, or ⌥/Ctrl + scroll, to zoom (or − / +). Double-click resets.</p><pre></pre>
    <button type="button" data-a="copy">Copy all</button><button type="button" class="pe-ghost" data-a="reset">Reset all</button>`;
  document.body.append(panel);
  const list = panel.querySelector("pre");

  function refresh() {
    const out = imgs.map((img) => `${name(img)}: ${fmt(img.__s)}`).join("\n");
    list.textContent = out;
    const v = {};
    imgs.forEach((img) => { if (img.__moved) v[name(img)] = img.__s; });
    save(v);
    return out;
  }
  const changed = (img) => { img.__moved = true; refresh(); };

  panel.addEventListener("click", (e) => {
    const a = e.target.dataset.a;
    if (a === "copy") {
      const text = `Image positions & zoom (${location.pathname.split("/").pop()}):\n` + refresh();
      navigator.clipboard?.writeText(text).then(
        () => { e.target.textContent = "Copied ✓"; setTimeout(() => (e.target.textContent = "Copy all"), 1200); },
        () => prompt("Copy these values:", text),
      );
    } else if (a === "reset") {
      imgs.forEach((img) => { img.setAttribute("style", img.__original); img.__moved = false; apply(img, read(img)); });
      refresh();
    }
  });

  imgs.forEach((img) => {
    const wrap = img.parentElement;
    if (getComputedStyle(wrap).position === "static") wrap.style.position = "relative";
    wrap.classList.add("pe-wrap");
    img.classList.add("pe-on");
    img.draggable = false;
    img.__original = img.getAttribute("style") || "";
    img.__badge = Object.assign(document.createElement("span"), { className: "pe-badge" });
    const zoom = Object.assign(document.createElement("span"), { className: "pe-zoom" });
    zoom.innerHTML = `<button type="button" aria-label="Zoom out">−</button><button type="button" aria-label="Zoom in">+</button>`;
    wrap.append(img.__badge, zoom);
    apply(img, read(img));
    const saved = stored[name(img)];
    if (saved && typeof saved === "object") { apply(img, { ...saved }); img.__moved = true; }

    const zoomBy = (f) => { apply(img, { ...img.__s, z: img.__s.z * f }); changed(img); };
    zoom.addEventListener("click", (e) => {
      e.preventDefault(); e.stopPropagation();
      zoomBy(e.target === zoom.lastElementChild ? 1.1 : 1 / 1.1);
    });

    // Trackpad pinch arrives as wheel + ctrlKey; ⌥ + scroll also zooms.
    img.addEventListener("wheel", (e) => {
      if (!e.ctrlKey && !e.altKey) return;
      e.preventDefault(); e.stopPropagation();
      img.__s.z = clamp(img.__s.z * Math.exp(-e.deltaY * 0.01), ZMIN, ZMAX);
      apply(img, img.__s);
      clearTimeout(img.__t); img.__t = setTimeout(() => changed(img), 200);
    }, { passive: false });

    let drag = null;
    img.addEventListener("pointerdown", (e) => {
      if (!img.naturalWidth || e.button !== 0) return;
      e.preventDefault();
      img.setPointerCapture(e.pointerId);
      drag = { x0: e.clientX, y0: e.clientY, start: { ...img.__s }, ...overflow(img), moved: false };
    });
    img.addEventListener("pointermove", (e) => {
      if (!drag) return;
      const dx = e.clientX - drag.x0, dy = e.clientY - drag.y0;
      if (Math.abs(dx) + Math.abs(dy) > 3) drag.moved = true;
      // Dragging right reveals more of the left side, so the percentage goes down.
      apply(img, {
        x: drag.ox > 0.5 ? drag.start.x - (dx / drag.ox) * 100 : drag.start.x,
        y: drag.oy > 0.5 ? drag.start.y - (dy / drag.oy) * 100 : drag.start.y,
        z: drag.start.z,
      });
    });
    const end = () => { if (drag?.moved) changed(img); drag = null; };
    img.addEventListener("pointerup", end);
    img.addEventListener("pointercancel", end);
    img.addEventListener("dblclick", () => { apply(img, { x: 50, y: 50, z: 1 }); changed(img); });
  });

  refresh();
})();
