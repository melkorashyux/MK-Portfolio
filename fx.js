/* Page animations: 5 swappable reveal presets + a WebGL dither shader.

   Presets (config.version):
     dither  blocks dissolve in through an ordered-dither (Bayer) mask; green
             "ghost" pixels land first, then resolve into the content
     decode  text scrambles from glyphs into place; blocks wipe in by steps
     boot    blocks power on in a wave: flicker, green outline, CRT expand
     scan    a scan beam passes over each block and leaves it drawn, with an
             RGB split on the text and optional CRT scanlines
     field   blocks assemble from random grid sub-cells; the cursor lights up
             the empty grid cells it passes over

   The dither shader (config.shader) runs on the MK graphics and the image
   slots with any preset: animated noise (or the MK shape, or a real image)
   is reduced to on/off pixels by comparing it to a Bayer threshold matrix.

   Every tunable value lives in DEFAULTS. The panel (SHOW_CONTROLS, toggle
   with the FX button or the ` key) edits a live copy, keeps it in this
   browser's localStorage, and "Copy" puts the JSON on the clipboard to paste
   over DEFAULTS. */
(() => {
  const SHOW_CONTROLS = new URLSearchParams(location.search).has("fx"); // add ?fx to the URL for the panel
  const STORE_KEY = "fx-config";
  const root = document.documentElement;
  const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
  // Photosensitivity limits for any blinking effect
  const MAX_FLASH_HZ = 3;
  const FLICKER_FLOOR = 0.6;

  const DEFAULTS = {
    version: "boot",
    speed: 1,
    autoReplay: true,
    versions: {
      dither: { duration: 750, stagger: 55, order: "diagonal", pixel: 4, matrix: 8, ghost: true },
      decode: { duration: 1000, stagger: 45, order: "rows", glyphs: "symbols", wipe: true, steps: 6 },
      boot: { duration: 600, stagger: 35, order: "diagonal", flickers: 1, outline: true, powerOn: true, gridFlicker: true },
      scan: { duration: 700, stagger: 60, order: "rows", beam: true, rgbSplit: 4, scanlines: 0.08 },
      field: { duration: 650, stagger: 30, order: "random", cellDiv: 8, ghost: true, trail: true, trailDiv: 2, trailFade: 900, trailOpacity: 0.35 },
    },
    // Button micro-interaction: the green fill dithers in, the label
    // re-decodes, the arrow steps forward; a press flickers the fill
    buttons: {
      on: true,
      duration: 200, // fill dither in/out, ms
      pixel: 2, // CSS px per fill pixel
      matrix: 4, // Bayer matrix size: 2 | 4 | 8
      scramble: true, // label decodes from glyphs on hover
      scrambleDuration: 180,
      arrowShift: 4, // px the arrow steps forward
      press: true, // flicker on press
    },
    shader: {
      on: true,
      mk: true, // MK graphics
      slots: true, // image slots (cards, about picture, case-study images)
      pixel: 2, // CSS px per dither pixel
      matrix: 4, // Bayer matrix size: 2 | 4 | 8
      dot: "square", // square | round | colon
      density: 0.42, // base brightness before dithering
      slotDensity: 0.18, // same, for the image slots
      scale: 1.8, // noise zoom
      flow: 0.08, // noise speed
      contrast: 1.1,
      softness: 5, // MK shape edge blur, CSS px
      mouse: 0.7, // cursor light strength
      radius: 0.28, // cursor light radius (fraction of the block)
      color: "#09fd42",
      intro: 2150, // ms for a block's pixels to fill in
      edge: 44, // CSS px: width of the dither band around a media (photo/video) slot's edges
      edgeDensity: 0.62, // brightness at the very edge, fading to nothing inward
      edgeColor: "#09fd42", // media slots' dither color (accent green)
      edgeOpacity: 0.08, // ...drawn at this opacity
      cursorEverywhere: false, // a smaller dither light follows the cursor outside the blocks above
      cursorRadius: 10, // CSS px
      cursorLight: 0.3,
      cursorLayer: "above", // behind: lights the empty grid only | above: over everything (screen blend)
    },
    // About photo: its own WebGL layer that redraws the portrait as an effect.
    // The cursor works as a lens over it; the effect resolves in on reveal.
    portrait: {
      on: true,
      effect: "dither", // dither | halftone | ascii | scan
      lens: 0.61, // cursor lens radius (fraction of the photo's short side)
      lensSoft: 0.2, // lens edge softness
      intro: 0, // ms for the effect to resolve in
      effects: {
        dither: { cell: 4, matrix: 8, brightness: 0, contrast: 1.15, key: 0, invert: false, ink: "#09fd42", bg: "#121212", cursor: "reveal" },
        halftone: { cell: 3, angle: 45, dotScale: 1, brightness: 0, contrast: 1.2, key: 0, invert: false, ink: "#ffffff", bg: "#121212", tint: 0, bulge: 0.8, cursor: "magnify" },
        ascii: { cell: 9, ramp: "standard", brightness: 0, contrast: 1.25, key: 0.8, invert: true, ink: "#09fd42", bg: "#121212", tint: 0, cursor: "scramble" },
        scan: { cell: 4, split: 3, scanlines: 0.35, beam: 0.15, tint: 0.6, ink: "#09fd42", contrast: 1.1, cursor: "resolve" },
      },
    },
  };

  const VERSIONS_META = {
    dither: { n: 1, name: "Dither", desc: "Blocks dissolve in through an ordered-dither mask. Green ghost pixels land first, then resolve into the content." },
    decode: { n: 2, name: "Decode", desc: "Text scrambles from glyphs into place, left to right, while blocks wipe open in stepped increments." },
    boot: { n: 3, name: "Boot", desc: "Blocks power on in a wave across the grid: CRT expand, flicker, then a green outline that fades." },
    scan: { n: 4, name: "Scan", desc: "A scan beam draws each block top to bottom with an RGB split on the text. Optional CRT scanlines." },
    field: { n: 5, name: "Field", desc: "Blocks assemble from random grid sub-cells. The cursor lights up the empty grid cells it passes." },
  };

  const ORDERS = ["diagonal", "rows", "columns", "random", "sequence"];
  const common = [
    { key: "duration", label: "Duration", type: "range", min: 150, max: 2500, step: 50, unit: "ms" },
    { key: "stagger", label: "Stagger", type: "range", min: 0, max: 200, step: 5, unit: "ms" },
    { key: "order", label: "Order", type: "select", options: ORDERS },
  ];
  const SCHEMA = {
    dither: [...common,
      { key: "pixel", label: "Pixel size", type: "range", min: 1, max: 20, step: 1, unit: "px" },
      { key: "matrix", label: "Bayer matrix", type: "select", options: [2, 4, 8] },
      { key: "ghost", label: "Green ghost", type: "toggle" }],
    decode: [...common,
      { key: "glyphs", label: "Glyphs", type: "select", options: ["symbols", "hex", "binary", "blocks", "katakana"] },
      { key: "wipe", label: "Block wipe", type: "toggle" },
      { key: "steps", label: "Wipe steps", type: "range", min: 0, max: 16, step: 1, unit: "" }],
    boot: [...common,
      { key: "flickers", label: "Flickers", type: "range", min: 0, max: 2, step: 1, unit: "" },
      { key: "outline", label: "Outline", type: "toggle" },
      { key: "powerOn", label: "CRT expand", type: "toggle" },
      { key: "gridFlicker", label: "Grid fade-in", type: "toggle" }],
    scan: [...common,
      { key: "beam", label: "Beam", type: "toggle" },
      { key: "rgbSplit", label: "RGB split", type: "range", min: 0, max: 16, step: 1, unit: "px" },
      { key: "scanlines", label: "Scanlines", type: "range", min: 0, max: 0.4, step: 0.01, unit: "" }],
    field: [...common,
      { key: "cellDiv", label: "Sub-cells", type: "range", min: 2, max: 24, step: 1, unit: "" },
      { key: "ghost", label: "Green ghost", type: "toggle" },
      { key: "trail", label: "Cursor trail", type: "toggle" },
      { key: "trailDiv", label: "Trail cells", type: "range", min: 1, max: 8, step: 1, unit: "" },
      { key: "trailFade", label: "Trail fade", type: "range", min: 100, max: 3000, step: 50, unit: "ms" },
      { key: "trailOpacity", label: "Trail opacity", type: "range", min: 0.05, max: 1, step: 0.05, unit: "" }],
  };
  const BUTTON_SCHEMA = [
    { key: "on", label: "Enabled", type: "toggle" },
    { key: "duration", label: "Fill speed", type: "range", min: 60, max: 800, step: 10, unit: "ms" },
    { key: "pixel", label: "Fill pixel", type: "range", min: 1, max: 12, step: 1, unit: "px" },
    { key: "matrix", label: "Bayer matrix", type: "select", options: [2, 4, 8] },
    { key: "scramble", label: "Label decode", type: "toggle" },
    { key: "scrambleDuration", label: "Decode time", type: "range", min: 100, max: 1000, step: 10, unit: "ms" },
    { key: "arrowShift", label: "Arrow step", type: "range", min: 0, max: 24, step: 1, unit: "px" },
    { key: "press", label: "Press flicker", type: "toggle" },
  ];

  const SHADER_SCHEMA = [
    { key: "on", label: "Enabled", type: "toggle" },
    { key: "mk", label: "MK graphics", type: "toggle" },
    { key: "slots", label: "Image slots", type: "toggle" },
    { key: "pixel", label: "Pixel size", type: "range", min: 1, max: 16, step: 1, unit: "px" },
    { key: "matrix", label: "Bayer matrix", type: "select", options: [2, 4, 8] },
    { key: "dot", label: "Dot shape", type: "select", options: ["square", "round", "colon"] },
    { key: "density", label: "MK density", type: "range", min: 0, max: 1.5, step: 0.01, unit: "" },
    { key: "slotDensity", label: "Slot density", type: "range", min: 0, max: 1.5, step: 0.01, unit: "" },
    { key: "scale", label: "Noise scale", type: "range", min: 0.3, max: 10, step: 0.1, unit: "" },
    { key: "flow", label: "Flow speed", type: "range", min: 0, max: 1.5, step: 0.01, unit: "" },
    { key: "contrast", label: "Contrast", type: "range", min: 0.3, max: 4, step: 0.05, unit: "" },
    { key: "softness", label: "Edge softness", type: "range", min: 0, max: 40, step: 1, unit: "px" },
    { key: "mouse", label: "Cursor light", type: "range", min: 0, max: 2, step: 0.05, unit: "" },
    { key: "radius", label: "Light radius", type: "range", min: 0.05, max: 1, step: 0.01, unit: "" },
    { key: "color", label: "Color", type: "color" },
    { key: "intro", label: "Fill-in", type: "range", min: 0, max: 4000, step: 50, unit: "ms" },
    { key: "cursorEverywhere", label: "Cursor everywhere", type: "toggle" },
    { key: "cursorRadius", label: "Outside radius", type: "range", min: 10, max: 300, step: 5, unit: "px" },
    { key: "cursorLight", label: "Outside light", type: "range", min: 0, max: 2, step: 0.05, unit: "" },
    { key: "cursorLayer", label: "Outside layer", type: "select", options: ["behind", "above"] },
  ];

  const PORTRAIT_META = {
    dither: { n: 1, name: "Dither", desc: "1-bit ordered dither in the accent green. The cursor lens reveals the real photo through a dithered edge." },
    halftone: { n: 2, name: "Halftone", desc: "A rotated print dot screen, dot size from brightness. The cursor magnifies the dots like a loupe." },
    ascii: { n: 3, name: "ASCII", desc: "The photo as monospace characters. Glyphs decode in on reveal; the cursor scrambles them." },
    scan: { n: 4, name: "Scan", desc: "Pixelated CRT readout: RGB split, scanlines, a slow beam. The cursor resolves it to the sharp photo." },
  };
  const PORTRAIT_COMMON = [
    { key: "on", label: "Enabled", type: "toggle" },
    { key: "lens", label: "Lens radius", type: "range", min: 0.05, max: 0.8, step: 0.01, unit: "" },
    { key: "lensSoft", label: "Lens softness", type: "range", min: 0, max: 1, step: 0.05, unit: "" },
    { key: "intro", label: "Resolve-in", type: "range", min: 0, max: 5000, step: 50, unit: "ms" },
  ];
  const tone = [
    { key: "brightness", label: "Brightness", type: "range", min: -0.5, max: 0.5, step: 0.01, unit: "" },
    { key: "contrast", label: "Contrast", type: "range", min: 0.3, max: 3, step: 0.05, unit: "" },
    { key: "key", label: "Key backdrop", type: "range", min: 0, max: 1, step: 0.01, unit: "" }, // 0 = off
    { key: "invert", label: "Invert", type: "toggle" },
  ];
  const ASCII_RAMPS = {
    standard: " .:-=+*#%@",
    dense: " .'`^\",:;Il!i><~+_-?][}{1)(|/tfjrxnuvczXYUJCLQ0OZmwqpdbkhao*#MW&8%B@$",
    blocks: " ░▒▓█",
    dots: " ·:•●",
    binary: " 01",
  };
  const PORTRAIT_SCHEMA = {
    dither: [
      { key: "cell", label: "Pixel size", type: "range", min: 1, max: 16, step: 1, unit: "px" },
      { key: "matrix", label: "Bayer matrix", type: "select", options: [2, 4, 8] },
      ...tone,
      { key: "ink", label: "Ink", type: "color" },
      { key: "bg", label: "Background", type: "color" },
      { key: "cursor", label: "Cursor", type: "select", options: ["reveal", "invert", "none"] }],
    halftone: [
      { key: "cell", label: "Dot spacing", type: "range", min: 3, max: 40, step: 1, unit: "px" },
      { key: "angle", label: "Screen angle", type: "range", min: 0, max: 90, step: 1, unit: "°" },
      { key: "dotScale", label: "Dot scale", type: "range", min: 0.3, max: 2, step: 0.05, unit: "" },
      ...tone,
      { key: "ink", label: "Ink", type: "color" },
      { key: "bg", label: "Background", type: "color" },
      { key: "tint", label: "Photo tint", type: "range", min: 0, max: 1, step: 0.05, unit: "" },
      { key: "bulge", label: "Magnify", type: "range", min: 0, max: 3, step: 0.05, unit: "" },
      { key: "cursor", label: "Cursor", type: "select", options: ["magnify", "reveal", "none"] }],
    ascii: [
      { key: "cell", label: "Char size", type: "range", min: 4, max: 32, step: 1, unit: "px" },
      { key: "ramp", label: "Characters", type: "select", options: Object.keys(ASCII_RAMPS) },
      ...tone,
      { key: "ink", label: "Ink", type: "color" },
      { key: "bg", label: "Background", type: "color" },
      { key: "tint", label: "Photo tint", type: "range", min: 0, max: 1, step: 0.05, unit: "" },
      { key: "cursor", label: "Cursor", type: "select", options: ["scramble", "reveal", "none"] }],
    scan: [
      { key: "cell", label: "Block size", type: "range", min: 1, max: 24, step: 1, unit: "px" },
      { key: "split", label: "RGB split", type: "range", min: 0, max: 16, step: 0.5, unit: "px" },
      { key: "scanlines", label: "Scanlines", type: "range", min: 0, max: 1, step: 0.05, unit: "" },
      { key: "beam", label: "Beam speed", type: "range", min: 0, max: 0.5, step: 0.01, unit: "" },
      { key: "contrast", label: "Contrast", type: "range", min: 0.3, max: 3, step: 0.05, unit: "" },
      { key: "ink", label: "Tint color", type: "color" },
      { key: "tint", label: "Tint", type: "range", min: 0, max: 1, step: 0.05, unit: "" },
      { key: "cursor", label: "Cursor", type: "select", options: ["resolve", "glitch", "none"] }],
  };

  /* ---------- Config ---------- */

  const clone = (o) => JSON.parse(JSON.stringify(o));
  function merge(base, over) {
    if (!over || typeof over !== "object") return base;
    for (const k of Object.keys(base)) {
      if (!(k in over)) continue;
      if (base[k] && typeof base[k] === "object") merge(base[k], over[k]);
      else if (typeof over[k] === typeof base[k]) base[k] = over[k];
    }
    return base;
  }
  let config = clone(DEFAULTS);
  try { merge(config, JSON.parse(localStorage.getItem(STORE_KEY))); } catch {}
  const save = () => { try { localStorage.setItem(STORE_KEY, JSON.stringify(config)); } catch {} };

  /* ---------- Helpers ---------- */

  const TARGETS = ".hero-logo, .hero-name, .hero-nav a, .hero-line, .hero-subtext, .hero-button, .mk, .heading, .card-image, .card-text, .tl-year, .tl-desc, .about-text, .about-picture, .cta-line, .cta-arrow, .cta-btn, .cta-footer, .cs-heading, .cs-cell, .cs-image";
  const clamp01 = (v) => Math.min(1, Math.max(0, v));
  const easeOut = (t) => 1 - Math.pow(1 - t, 3);
  const easeInOut = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
  const dpr = () => Math.min(2, window.devicePixelRatio || 1);
  const phone = matchMedia("(max-width: 899px)");
  const isReplaced = (el) => el.tagName === "IMG";

  function cellSize() {
    const s = document.querySelector(".section");
    if (!s) return 120;
    return s.getBoundingClientRect().width / (phone.matches ? 4 : 12);
  }

  // Inline styles set during a reveal are recorded so clean() can undo them.
  function setStyle(el, prop, value) {
    (el.__fxProps ||= new Set()).add(prop);
    el.style.setProperty(prop, value);
  }
  function addNode(el, node) {
    if (isReplaced(el)) return null;
    if (getComputedStyle(el).position === "static") setStyle(el, "position", "relative");
    (el.__fxNodes ||= []).push(node);
    el.appendChild(node);
    return node;
  }
  function clean(el) {
    cancel(el);
    el.__fxProps?.forEach((p) => el.style.removeProperty(p));
    el.__fxProps = null;
    el.__fxNodes?.forEach((n) => n.remove());
    el.__fxNodes = null;
    el.__fxText?.forEach(([node, text]) => { node.data = text; });
  }

  /* ---------- Tweens: one rAF loop for every reveal ---------- */

  const tweens = new Set();
  let tweenFrame = 0;
  function tween(el, delay, duration, frame, done) {
    cancel(el);
    const t = { el, start: performance.now() + delay, duration: Math.max(1, duration), frame, done };
    el.__fxTween = t;
    tweens.add(t);
    frame(0);
    if (!tweenFrame) tweenFrame = requestAnimationFrame(tick);
  }
  function cancel(el) {
    if (el.__fxTween) { tweens.delete(el.__fxTween); el.__fxTween = null; }
  }
  function tick(now) {
    tweenFrame = 0;
    for (const t of [...tweens]) {
      if (now < t.start) continue;
      const p = clamp01((now - t.start) / t.duration);
      t.frame(p);
      if (p >= 1) { tweens.delete(t); t.el.__fxTween = null; t.done?.(); }
    }
    if (tweens.size) tweenFrame = requestAnimationFrame(tick);
  }

  /* ---------- Dissolve masks (Bayer or random threshold tiles) ---------- */

  function bayerMatrix(n) {
    let m = [[0]];
    while (m.length < n) {
      const s = m.length, out = [];
      for (let y = 0; y < s * 2; y++) {
        out.push([]);
        for (let x = 0; x < s * 2; x++) {
          const v = m[y % s][x % s] * 4;
          out[y].push(v + [[0, 2], [3, 1]][Math.floor(y / s)][Math.floor(x / s)]);
        }
      }
      m = out;
    }
    return m.flat();
  }
  function randomRanks(n) {
    const r = [...Array(n * n).keys()];
    for (let i = r.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [r[i], r[j]] = [r[j], r[i]]; }
    return r;
  }
  const maskCache = new Map();
  // Returns { frames, inverse, size }: frames[k] reveals k/(F-1) of the cells.
  function maskSet(kind, m, pixel) {
    const d = dpr();
    const pd = Math.max(1, Math.round(pixel * d));
    const key = `${kind}:${m}:${pd}`;
    if (maskCache.has(key)) return maskCache.get(key);
    const ranks = kind === "bayer" ? bayerMatrix(m) : randomRanks(m);
    const cells = m * m;
    const F = Math.min(cells, 32) + 1;
    const cv = document.createElement("canvas");
    cv.width = cv.height = m * pd;
    const ctx = cv.getContext("2d");
    const draw = (count, invert) => {
      ctx.clearRect(0, 0, cv.width, cv.height);
      ctx.fillStyle = "#fff";
      for (let i = 0; i < cells; i++) {
        if ((ranks[i] < count) !== invert) ctx.fillRect((i % m) * pd, Math.floor(i / m) * pd, pd, pd);
      }
      return `url("${cv.toDataURL()}")`;
    };
    const frames = [], inverse = [];
    for (let k = 0; k < F; k++) {
      const count = Math.round((k / (F - 1)) * cells);
      frames.push(draw(count, false));
      inverse.push(draw(count, true));
    }
    const set = { frames, inverse, size: `${(m * pd) / d}px ${(m * pd) / d}px` };
    maskCache.set(key, set);
    return set;
  }
  function setMask(el, url, size) {
    for (const pre of ["", "-webkit-"]) {
      setStyle(el, pre + "mask-image", url);
      setStyle(el, pre + "mask-size", size);
      setStyle(el, pre + "mask-repeat", "repeat");
      setStyle(el, pre + "mask-position", "0 0");
    }
  }
  function dissolve(el, delay, duration, set, ghost) {
    const F = set.frames.length;
    let g = null;
    if (ghost) {
      g = document.createElement("div");
      g.className = "fx-ghost";
      g.style.background = config.shader.color;
      g = addNode(el, g);
    }
    tween(el, delay, duration, (p) => {
      const pc = g ? clamp01(p / 0.6) : p;
      setMask(el, set.frames[Math.floor(pc * (F - 1))], set.size);
      if (g) {
        const pg = clamp01((p - 0.3) / 0.7);
        const url = set.inverse[Math.floor(pg * (F - 1))];
        g.style.maskImage = g.style.webkitMaskImage = url;
        g.style.maskSize = g.style.webkitMaskSize = set.size;
      }
    }, () => finish(el));
  }

  /* ---------- Presets ---------- */

  const GLYPHS = {
    symbols: "!<>-_\\/[]{}=+*^?#%&$@",
    hex: "0123456789ABCDEF",
    binary: "01",
    blocks: "░▒▓█▚▞▖▗▘▝",
    katakana: "アイウエオカキクケコサシスセソタチツテトナニヌネノ",
  };

  function textOf(el) {
    if (!el.__fxText) {
      const w = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
      const out = [];
      let n;
      while ((n = w.nextNode())) if (n.data.trim()) out.push([n, n.data]);
      el.__fxText = out;
    }
    return el.__fxText;
  }

  const PRESETS = {
    dither: {
      reveal(el, delay, o) {
        dissolve(el, delay, o.duration, maskSet("bayer", o.matrix, o.pixel), o.ghost);
      },
    },

    decode: {
      reveal(el, delay, o) {
        const nodes = textOf(el);
        const total = nodes.reduce((s, [, t]) => s + t.length, 0);
        const rnd = Array.from({ length: total }, () => Math.random());
        const glyphs = GLYPHS[o.glyphs] || GLYPHS.symbols;
        const cur = new Array(total);
        const textless = !total;
        tween(el, delay, o.duration, (p) => {
          let g = 0;
          for (const [node, text] of nodes) {
            let s = "";
            for (let i = 0; i < text.length; i++, g++) {
              const ch = text[i];
              const at = (g / total) * 0.7 + rnd[g] * 0.3;
              if (p >= at || ch === " " || ch === "\n") { s += ch; continue; }
              if (!cur[g] || Math.random() < 0.45) cur[g] = glyphs[Math.floor(Math.random() * glyphs.length)];
              s += cur[g];
            }
            node.data = s;
          }
          if (o.wipe || textless) {
            const raw = clamp01(p * 1.8);
            const e = o.steps > 0 ? Math.ceil(raw * o.steps - 1e-6) / o.steps : easeOut(raw);
            setStyle(el, "clip-path", `inset(0 ${(1 - e) * 100}% 0 0)`);
          }
        }, () => finish(el));
      },
    },

    boot: {
      enter(o) {
        if (!o.gridFlicker) return;
        document.querySelectorAll(".page-grid").forEach((grid) => {
          // Photosensitivity: the grid covers the whole viewport, so it
          // fades in smoothly instead of blinking.
          tween(grid, 0, 700 / config.speed, (p) => {
            setStyle(grid, "opacity", String(easeOut(p)));
          }, () => clean(grid));
        });
      },
      reveal(el, delay, o) {
        const flick = 0.55;
        // Photosensitivity (WCAG 2.3.1): dips are shallow (never below
        // FLICKER_FLOOR) and capped at MAX_FLASH_HZ, whatever the panel says.
        const span = (o.duration / config.speed) * flick / 1000;
        const flickers = Math.min(o.flickers, Math.max(1, Math.floor(span * MAX_FLASH_HZ)));
        tween(el, delay, o.duration, (p) => {
          let op = 1;
          if (p === 0) op = 0;
          else if (p < flick && flickers > 0) {
            const seg = Math.floor((p / flick) * flickers * 2);
            op = seg % 2 ? FLICKER_FLOOR : easeOut(clamp01((p / flick) * flickers * 2));
          }
          setStyle(el, "opacity", String(op));
          if (o.powerOn) {
            const sy = p < 0.18 ? Math.max(0.02, easeOut(p / 0.18)) : 1;
            setStyle(el, "transform", `scaleY(${sy})`);
          }
          if (o.outline) {
            const a = p < flick ? 1 : 1 - (p - flick) / (1 - flick);
            setStyle(el, "outline", `1px solid rgb(9 253 66 / ${a})`);
            setStyle(el, "outline-offset", "-1px");
          }
        }, () => finish(el));
      },
    },

    scan: {
      enter(o) {
        ambient.scanlines(o.scanlines);
        if (o.beam) ambient.beam();
      },
      leave() { ambient.scanlines(0); },
      reveal(el, delay, o) {
        let beam = null;
        if (o.beam) {
          beam = document.createElement("div");
          beam.className = "fx-beam-local";
          beam = addNode(el, beam);
        }
        const hasText = textOf(el).length > 0;
        tween(el, delay, o.duration, (p) => {
          const e = easeInOut(p);
          setStyle(el, "clip-path", `inset(0 0 ${(1 - e) * 100}% 0)`);
          if (beam) {
            beam.style.top = `calc(${e * 100}% - 56px)`;
            beam.style.opacity = String(p > 0.85 ? (1 - p) / 0.15 : 1);
          }
          if (hasText && o.rgbSplit) {
            const s = o.rgbSplit * (1 - easeOut(p));
            setStyle(el, "text-shadow", `${s}px 0 rgb(255 0 80 / 0.75), ${-s}px 0 rgb(0 220 255 / 0.75)`);
          }
        }, () => finish(el));
      },
    },

    field: {
      enter(o) { ambient.trail(o.trail); },
      leave() { ambient.trail(false); },
      reveal(el, delay, o) {
        dissolve(el, delay, o.duration, maskSet("random", 32, cellSize() / o.cellDiv), o.ghost);
      },
    },
  };

  /* ---------- Ambient layers ---------- */

  const ambient = (() => {
    let lines = null, trailCanvas = null, trailOn = false, trailRaf = 0;
    const cells = new Map();
    let pointer = null;

    function scanlines(opacity) {
      if (!opacity || reduceMotion) { lines?.remove(); lines = null; return; }
      if (!lines) { lines = document.createElement("div"); lines.className = "fx-scanlines"; document.body.appendChild(lines); }
      lines.style.opacity = String(opacity);
    }

    function beam() {
      if (reduceMotion) return;
      const b = document.createElement("div");
      b.className = "fx-beam";
      document.body.appendChild(b);
      const a = b.animate(
        [{ transform: "translateY(0)", opacity: 1 }, { transform: `translateY(${innerHeight}px)`, opacity: 0.6 }],
        { duration: 1100 / config.speed, easing: "cubic-bezier(.65,0,.35,1)" }
      );
      a.onfinish = a.oncancel = () => b.remove();
    }

    function addCell(x, y) {
      const o = config.versions.field;
      const cell = cellSize();
      const s = cell / o.trailDiv;
      const page = document.querySelector(".page");
      const sec = document.querySelector(".section");
      if (!page || !sec) return;
      const pr = page.getBoundingClientRect();
      const ox = phone.matches ? pr.left : sec.getBoundingClientRect().left;
      const i = Math.floor((x - ox) / s), j = Math.floor((y - pr.top) / s);
      cells.set(`${i},${j}`, { i, j, t: performance.now() });
    }

    function draw(now) {
      trailRaf = 0;
      const o = config.versions.field;
      const ctx = trailCanvas.getContext("2d");
      const d = dpr();
      const w = innerWidth, h = innerHeight;
      if (trailCanvas.width !== Math.round(w * d) || trailCanvas.height !== Math.round(h * d)) {
        trailCanvas.width = Math.round(w * d);
        trailCanvas.height = Math.round(h * d);
      }
      ctx.setTransform(d, 0, 0, d, 0, 0);
      ctx.clearRect(0, 0, w, h);
      if (pointer) addCell(pointer.x, pointer.y);
      const page = document.querySelector(".page");
      const sec = document.querySelector(".section");
      const pr = page.getBoundingClientRect();
      const ox = phone.matches ? pr.left : sec.getBoundingClientRect().left;
      const s = cellSize() / o.trailDiv;
      const [r, g, b] = hexRgb(config.shader.color);
      for (const [k, c] of cells) {
        const age = (now - c.t) / o.trailFade;
        if (age >= 1) { cells.delete(k); continue; }
        ctx.fillStyle = `rgb(${r * 255} ${g * 255} ${b * 255} / ${o.trailOpacity * (1 - age) * (1 - age)})`;
        ctx.fillRect(ox + c.i * s + 1, pr.top + c.j * s + 1, s - 1, s - 1);
      }
      if (trailOn) trailRaf = requestAnimationFrame(draw);
    }

    const onMove = (e) => { pointer = { x: e.clientX, y: e.clientY }; };
    const onLeave = () => { pointer = null; };

    function trail(on) {
      trailOn = on && !reduceMotion;
      if (!trailOn) {
        trailCanvas?.remove(); trailCanvas = null; cells.clear();
        removeEventListener("pointermove", onMove);
        document.removeEventListener("pointerleave", onLeave);
        return;
      }
      if (!trailCanvas) {
        trailCanvas = document.createElement("canvas");
        trailCanvas.className = "fx-trail";
        trailCanvas.setAttribute("aria-hidden", "true");
        document.body.prepend(trailCanvas);
        addEventListener("pointermove", onMove, { passive: true });
        document.addEventListener("pointerleave", onLeave);
      }
      if (!trailRaf) trailRaf = requestAnimationFrame(draw);
    }

    return { scanlines, beam, trail };
  })();

  /* ---------- Reveal engine ---------- */

  const targets = [...document.querySelectorAll(TARGETS)];
  targets.forEach(textOf); // capture original text before anything scrambles it

  function delays(els, order, stagger) {
    const cell = cellSize();
    const rects = els.map((e) => e.getBoundingClientRect());
    const minT = Math.min(...rects.map((r) => r.top));
    const minL = Math.min(...rects.map((r) => r.left));
    return els.map((el, i) => {
      const row = Math.round((rects[i].top - minT) / cell);
      const col = Math.round((rects[i].left - minL) / cell);
      switch (order) {
        case "rows": return (row * 2 + col * 0.25) * stagger;
        case "columns": return (col + row * 0.25) * stagger;
        case "random": return Math.random() * Math.min(els.length, 12) * stagger;
        case "sequence": return i * stagger;
        default: return (row + col) * stagger;
      }
    });
  }

  function finish(el) {
    clean(el);
    el.__fxState = "done";
  }
  function show(el) {
    clean(el);
    el.classList.remove("fx-wait");
    el.__fxState = "done";
    observerFor(el).unobserve(el);
  }

  function runBatch(els) {
    const o = config.versions[config.version];
    const preset = PRESETS[config.version];
    const sp = config.speed;
    const ds = delays(els, o.order, o.stagger / sp);
    els.forEach((el, i) => {
      observerFor(el).unobserve(el);
      el.__fxState = "run";
      el.classList.remove("fx-wait");
      preset.reveal(el, ds[i], { ...o, duration: o.duration / sp });
      shader.intro(el, ds[i]);
      portrait.intro(el, ds[i]);
    });
  }

  function onIntersect(entries) {
    const batch = [];
    for (const e of entries) {
      if (e.target.__fxState !== "wait") continue;
      if (e.isIntersecting) batch.push(e.target);
      else if (e.boundingClientRect.bottom < 0) show(e.target);
    }
    if (batch.length) runBatch(batch);
  }
  const io = new IntersectionObserver(onIntersect, { rootMargin: "0px 0px -6% 0px" });
  // Timeline rows wait until they reach TIMELINE_LINE of the viewport, so
  // the years come in one by one as you scroll instead of all at once.
  const TIMELINE_LINE = 0.7;
  const ioTimeline = new IntersectionObserver(onIntersect, { rootMargin: `0px 0px -${(1 - TIMELINE_LINE) * 100}% 0px` });
  const observerFor = (el) => (el.closest(".tl-row") ? ioTimeline : io);

  let activeVersion = null;
  function replay() {
    if (activeVersion && activeVersion !== config.version) PRESETS[activeVersion].leave?.(config.versions[activeVersion]);
    activeVersion = config.version;
    targets.forEach((el) => {
      clean(el);
      if (reduceMotion) { el.__fxState = "done"; return; }
      el.__fxState = "wait";
      el.classList.add("fx-wait");
      observerFor(el).unobserve(el);
      observerFor(el).observe(el);
    });
    PRESETS[config.version].enter?.(config.versions[config.version]);
    shader.resetIntro();
    portrait.resetIntro();
  }

  /* ---------- Dither shader ---------- */

  function hexRgb(hex) {
    const n = parseInt(hex.replace("#", ""), 16);
    return [(n >> 16) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255];
  }

  const VERT = `attribute vec2 p; void main(){ gl_Position = vec4(p, 0., 1.); }`;
  const FRAG = `
precision highp float;
uniform vec2 uRes;
uniform float uSeed, uTime, uMode, uPixel, uMatrix, uDot, uDensity, uScale, uContrast, uReveal, uRadius, uEdge, uAlpha;
uniform vec3 uMouse, uColor;
uniform sampler2D uSrc;

float hash(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
float noise(vec2 p){
  vec2 i = floor(p), f = fract(p), u = f * f * (3. - 2. * f);
  return mix(mix(hash(i), hash(i + vec2(1, 0)), u.x), mix(hash(i + vec2(0, 1)), hash(i + vec2(1, 1)), u.x), u.y);
}
float fbm(vec2 p){
  float v = 0., a = .5;
  for (int i = 0; i < 5; i++) { v += a * noise(p); p = p * 2.03 + vec2(1.7, 9.2); a *= .5; }
  return v;
}
// Ordered-dither thresholds in [0,1): each level doubles the matrix size.
float bayer2(vec2 a){ a = floor(a); return fract(a.x * .5 + a.y * a.y * .75); }
float bayer4(vec2 a){ return bayer2(.5 * a) * .25 + bayer2(a); }
float bayer8(vec2 a){ return bayer4(.5 * a) * .25 + bayer2(a); }

void main(){
  vec2 cell = floor(gl_FragCoord.xy / uPixel);
  vec2 uv = (cell + .5) * uPixel / uRes;            // sample once per dither pixel
  float aspect = uRes.x / uRes.y;
  vec2 p = vec2(uv.x * aspect, uv.y) * uScale + uSeed;
  float t = uTime;
  vec2 q = vec2(fbm(p + vec2(0., t)), fbm(p + vec2(5.2, 1.3) - vec2(t * .7, 0.)));
  float n = fbm(p + 1.8 * q + vec2(t * .3, -t * .2));  // domain-warped noise

  vec4 src = texture2D(uSrc, vec2(uv.x, 1. - uv.y));
  float m = 1.;
  float v;
  if (uMode < .5) {             // MK shape: noise inside the logo mask
    m = src.a;
    v = m * (uDensity + (n - .5) * 1.3);
  } else if (uMode < 1.5) {     // empty slot: free-flowing noise
    v = uDensity + (n - .5) * 1.5;
    if (uEdge > 0.) {           // video slot: only a band along the edges, fading inward
      vec2 px = uv * uRes;
      float e = min(min(px.x, uRes.x - px.x), min(px.y, uRes.y - px.y));
      v *= 1. - smoothstep(0., uEdge, e);
    }
  } else if (uMode < 2.5) {     // real image: its luminance, lightly stirred
    v = dot(src.rgb, vec3(.299, .587, .114)) * uDensity * 1.6 + (n - .5) * .15;
  } else {                      // page-wide cursor light: nothing but the light
    v = 0.;
  }

  vec2 d = uv - uMouse.xy; d.x *= aspect;
  float glow = exp(-dot(d, d) / (uRadius * uRadius));
  if (uMode > 2.5) v += uMouse.z * glow * (.85 + (n - .5) * .6);
  else v += uMouse.z * glow * (uMode < .5 ? .3 + .7 * m : 1.);
  v = (v - .5) * uContrast + .5;
  v *= clamp(uReveal * 1.6 - (1. - uv.y) * .6, 0., 1.);  // fill in from the top

  float th = uMatrix < 3. ? bayer2(cell) : (uMatrix < 5. ? bayer4(cell) : bayer8(cell));
  float on = step(th + .001, v);

  vec2 l = fract(gl_FragCoord.xy / uPixel) - .5;
  if (uDot > .5 && uDot < 1.5) on *= step(length(l), .42);
  else if (uDot > 1.5) on *= step(min(length(l - vec2(0., .22)), length(l + vec2(0., .22))), .16);

  gl_FragColor = vec4(uColor * on, on) * uAlpha;  // premultiplied alpha
}`;

  const shader = (() => {
    const surfaces = [];
    let cursor = null; // the page-wide cursor light
    const finePointer = matchMedia("(hover: hover) and (pointer: fine)");
    let raf = 0;
    let mouse = null;
    const t0 = performance.now();
    const logoPath = document.querySelector(".hero-logo path")?.getAttribute("d");

    function compile(gl) {
      const prog = gl.createProgram();
      for (const [type, src] of [[gl.VERTEX_SHADER, VERT], [gl.FRAGMENT_SHADER, FRAG]]) {
        const s = gl.createShader(type);
        gl.shaderSource(s, src);
        gl.compileShader(s);
        if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(s));
        gl.attachShader(prog, s);
      }
      gl.linkProgram(prog);
      if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(prog));
      return prog;
    }

    function create(el, mode) {
      const canvas = document.createElement("canvas");
      canvas.className = "fx-surface";
      canvas.setAttribute("aria-hidden", "true");
      const gl = canvas.getContext("webgl", { premultipliedAlpha: true, antialias: false });
      if (!gl) return;
      let prog;
      try { prog = compile(gl); } catch (err) { console.warn("fx: dither shader failed", err); return; }
      gl.useProgram(prog);
      const buf = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, buf);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
      const loc = gl.getAttribLocation(prog, "p");
      gl.enableVertexAttribArray(loc);
      gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
      const tex = gl.createTexture();
      gl.bindTexture(gl.TEXTURE_2D, tex);
      for (const [k, v] of [[gl.TEXTURE_MIN_FILTER, gl.LINEAR], [gl.TEXTURE_MAG_FILTER, gl.LINEAR], [gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE], [gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE]]) gl.texParameteri(gl.TEXTURE_2D, k, v);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, new Uint8Array([0, 0, 0, 0]));
      const u = {};
      for (const name of ["uSeed", "uRes", "uTime", "uMode", "uPixel", "uMatrix", "uDot", "uDensity", "uScale", "uContrast", "uReveal", "uRadius", "uEdge", "uAlpha", "uMouse", "uColor", "uSrc"]) u[name] = gl.getUniformLocation(prog, name);

      if (!el) { // page-wide cursor light: fixed, viewport-sized
        canvas.classList.add("fx-cursor");
        if (config.shader.cursorLayer === "above") canvas.classList.add("fx-cursor--above");
        document.body.prepend(canvas);
        cursor = { el: null, canvas, gl, u, tex, mode: 3, seed: 91.7, visible: true, reveal: 1, mouseK: 0, restore: [], w: 0, h: 0, idle: false };
        resize(cursor);
        return;
      }
      const img = el.querySelector("img");
      // Slots holding real media (a photo or a video) show it as-is, with only
      // a faint dither band along the edges; the shader never replaces it.
      const video = mode === "slot" && !el.classList.contains("mk") ? el.querySelector("video, img") : null;
      const restore = [];
      if (getComputedStyle(el).position === "static") { el.style.position = "relative"; restore.push(() => el.style.removeProperty("position")); }
      if (img && !video) { img.style.opacity = "0"; restore.push(() => img.style.removeProperty("opacity")); }
      el.prepend(canvas);

      const s = { el, canvas, gl, u, tex, mode: mode === "slot" && img && !video && !el.classList.contains("mk") ? 2 : mode === "mk" ? 0 : 1, img, video, seed: surfaces.length * 7.31, visible: false, reveal: 1, introStart: null, mouseK: 0, restore, w: 0, h: 0 };
      s.ro = new ResizeObserver(() => resize(s));
      s.ro.observe(el);
      s.io = new IntersectionObserver(([e]) => { s.visible = e.isIntersecting; if (s.visible) kick(); });
      s.io.observe(el);
      if (s.mode === 2 && !img.complete) img.addEventListener("load", () => upload(s), { once: true });
      surfaces.push(s);
      resize(s);
    }

    function resize(s) {
      const r = s.el ? s.el.getBoundingClientRect() : { width: innerWidth, height: innerHeight };
      const d = dpr();
      const w = Math.max(1, Math.round(r.width * d)), h = Math.max(1, Math.round(r.height * d));
      if (w === s.w && h === s.h) return;
      s.w = s.canvas.width = w;
      s.h = s.canvas.height = h;
      s.gl.viewport(0, 0, w, h);
      upload(s);
      kick();
    }

    // Source texture: the MK logo path (blurred, so its edges dither into a
    // gradient) or the slot's image drawn with object-fit: cover.
    function upload(s) {
      if (s.mode === 1 || s.mode === 3) return;
      const c = document.createElement("canvas");
      c.width = s.w; c.height = s.h;
      const ctx = c.getContext("2d");
      if (s.mode === 0) {
        if (!logoPath) return;
        const pad = 0.04;
        ctx.filter = `blur(${config.shader.softness * dpr()}px)`;
        ctx.setTransform((s.w * (1 - 2 * pad)) / 52, 0, 0, (s.h * (1 - 2 * pad)) / 35, s.w * pad, s.h * pad);
        ctx.fillStyle = "#fff";
        ctx.fill(new Path2D(logoPath));
      } else {
        const im = s.img;
        if (!im.naturalWidth) return;
        const k = Math.max(s.w / im.naturalWidth, s.h / im.naturalHeight);
        const iw = im.naturalWidth * k, ih = im.naturalHeight * k;
        ctx.drawImage(im, (s.w - iw) / 2, (s.h - ih) / 2, iw, ih);
      }
      const gl = s.gl;
      gl.bindTexture(gl.TEXTURE_2D, s.tex);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, c);
    }

    function render(now) {
      raf = 0;
      const c = config.shader;
      const d = dpr();
      const time = reduceMotion ? 0 : ((now - t0) / 1000) * c.flow;
      const color = hexRgb(c.color);
      const edgeColor = hexRgb(c.edgeColor);
      const dotMode = { square: 0, round: 1, colon: 2 }[c.dot] ?? 0;
      let busy = false;
      let overBlock = false;
      const draw = (s, mx, my, k, radius) => {
        const { gl, u } = s;
        gl.uniform2f(u.uRes, s.w, s.h);
        gl.uniform1f(u.uTime, time);
        gl.uniform1f(u.uSeed, s.seed);
        gl.uniform1f(u.uMode, s.mode);
        gl.uniform1f(u.uPixel, Math.max(1, c.pixel * d));
        gl.uniform1f(u.uMatrix, c.matrix);
        gl.uniform1f(u.uDot, dotMode);
        gl.uniform1f(u.uDensity, s.mode === 0 ? c.density : s.video ? c.edgeDensity : c.slotDensity);
        gl.uniform1f(u.uScale, c.scale);
        gl.uniform1f(u.uContrast, c.contrast);
        gl.uniform1f(u.uReveal, s.reveal);
        gl.uniform1f(u.uRadius, radius);
        gl.uniform1f(u.uEdge, s.video ? c.edge * d : 0);
        gl.uniform1f(u.uAlpha, s.video ? c.edgeOpacity : 1);
        gl.uniform3f(u.uMouse, mx, my, k);
        gl.uniform3f(u.uColor, ...(s.video ? edgeColor : color));
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      };
      for (const s of surfaces) {
        if (!s.visible) continue;
        if (s.introStart != null) {
          s.reveal = c.intro && !reduceMotion ? clamp01((now - s.introStart) / (c.intro / config.speed)) : now >= s.introStart ? 1 : 0;
          if (s.reveal >= 1) s.introStart = null;
        }
        const r = s.el.getBoundingClientRect();
        let mx = 0.5, my = 0.5, hover = false;
        if (mouse) {
          mx = (mouse.x - r.left) / r.width;
          my = 1 - (mouse.y - r.top) / r.height;
          hover = mx > -0.1 && mx < 1.1 && my > -0.1 && my < 1.1;
          if (mx >= 0 && mx <= 1 && my >= 0 && my <= 1) overBlock = true;
        }
        s.mouseK += ((hover ? 1 : 0) - s.mouseK) * 0.12;
        if (hover) { s.mx = mx; s.my = my; }
        draw(s, s.mx ?? 0.5, s.my ?? 0.5, s.video ? 0 : s.mouseK * c.mouse, c.radius); // no cursor light on videos
        busy = true;
      }
      // Outside the blocks, a smaller light follows the cursor; it hands
      // over to the block's own (larger) light when the cursor enters one.
      let cursorBusy = false;
      if (cursor) {
        const hover = !!mouse && !overBlock;
        cursor.mouseK += ((hover ? 1 : 0) - cursor.mouseK) * 0.18;
        if (hover) { cursor.mx = mouse.x / innerWidth; cursor.my = 1 - mouse.y / innerHeight; }
        if (hover || cursor.mouseK > 0.003) {
          draw(cursor, cursor.mx ?? 0.5, cursor.my ?? 0.5, cursor.mouseK * c.cursorLight, c.cursorRadius / innerHeight);
          cursor.idle = false;
          cursorBusy = true;
        } else if (!cursor.idle) {
          draw(cursor, 0.5, 0.5, 0, 0.1); // clear once, then stop drawing
          cursor.idle = true;
        }
      }
      if (cursorBusy || (busy && (!reduceMotion || surfaces.some((s) => s.introStart != null || s.mouseK > 0.01)))) raf = requestAnimationFrame(render);
    }
    function kick() { if (!raf && !document.hidden) raf = requestAnimationFrame(render); }

    function build() {
      destroy();
      const c = config.shader;
      if (!c.on) return;
      if (c.mk) document.querySelectorAll(".mk").forEach((el) => create(el, "mk"));
      // Slots holding a video show it as-is: dithering a UI recording makes it unreadable.
      const slots = ".card-image, .cs-image" + (config.portrait.on ? "" : ", .about-picture"); // the portrait layer owns the About photo
      if (c.slots) document.querySelectorAll(slots).forEach((el) => create(el, "slot"));
      if (c.cursorEverywhere && finePointer.matches) create(null, "cursor");
      kick();
    }
    function destroy() {
      for (const s of surfaces.splice(0)) {
        s.ro.disconnect(); s.io.disconnect();
        s.gl.getExtension("WEBGL_lose_context")?.loseContext();
        s.canvas.remove();
        s.restore.forEach((f) => f());
      }
      if (cursor) {
        cursor.gl.getExtension("WEBGL_lose_context")?.loseContext();
        cursor.canvas.remove();
        cursor = null;
      }
    }
    function intro(el, delay) {
      const s = surfaces.find((x) => x.el === el);
      if (s) { s.introStart = performance.now() + delay; s.reveal = 0; kick(); }
    }
    function resetIntro() {
      for (const s of surfaces) { s.reveal = reduceMotion ? 1 : 0; s.introStart = null; }
      kick();
    }

    addEventListener("pointermove", (e) => { if (e.pointerType === "touch") return; mouse = { x: e.clientX, y: e.clientY }; kick(); }, { passive: true }); // no cursor light left behind by a finger
    document.addEventListener("pointerleave", () => { mouse = null; });
    document.addEventListener("visibilitychange", kick);
    addEventListener("resize", () => { if (cursor) resize(cursor); });
    return { build, intro, resetIntro, refresh: () => surfaces.forEach(upload), kick };
  })();

  /* ---------- Portrait effects (About photo) ---------- */

  const PFRAG = `
precision highp float;
uniform vec2 uRes;
uniform vec3 uMouse, uInk, uBg;
uniform float uEffect, uTime, uIntro, uLens, uLensSoft, uCell, uMatrix, uBright, uContrast, uAngle, uDotScale, uTint, uBulge, uCursor, uGlyphs, uInvert, uSplit, uScan, uBeam, uDpr, uKey;
uniform sampler2D uSrc, uAtlas;

float hash(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
float bayer2(vec2 a){ a = floor(a); return fract(a.x * .5 + a.y * a.y * .75); }
float bayer4(vec2 a){ return bayer2(.5 * a) * .25 + bayer2(a); }
float bayer8(vec2 a){ return bayer4(.5 * a) * .25 + bayer2(a); }
float bayer(vec2 c){ return uMatrix < 3. ? bayer2(c) : (uMatrix < 5. ? bayer4(c) : bayer8(c)); }
vec3 photo(vec2 uv){ return texture2D(uSrc, vec2(clamp(uv.x, 0., 1.), 1. - clamp(uv.y, 0., 1.))).rgb; }
float luma(vec3 c){ return dot(c, vec3(.299, .587, .114)); }
float tone(float l){ return clamp((l - .5) * uContrast + .5 + uBright, 0., 1.); }
// Key out the light studio backdrop: raw brightness above uKey drops to the background.
float keep(vec3 c){ return uKey > 0. ? 1. - smoothstep(uKey - .05, uKey, luma(c)) : 1.; }
mat2 rot(float a){ float c = cos(a), s = sin(a); return mat2(c, -s, s, c); }

void main(){
  vec2 fc = gl_FragCoord.xy;
  vec2 uv = fc / uRes;
  vec2 mp = uMouse.xy * uRes;
  float r = uLens * min(uRes.x, uRes.y);
  float L = uMouse.z * (1. - smoothstep(r * (1. - uLensSoft) - .5, r, length(fc - mp)));  // lens, 0..1
  float t = uTime;
  vec3 col;

  if (uEffect < .5) {                     // ---- dither
    vec2 cell = floor(fc / uCell);
    vec2 cuv = (cell + .5) * uCell / uRes;
    vec3 src = photo(cuv);
    float l = tone(luma(src));
    if (uInvert > .5) l = 1. - l;
    l *= keep(src);
    l *= clamp(uIntro * 1.5 - (1. - cuv.y) * .5, 0., 1.);  // builds in from the top
    float th = bayer(cell);
    float on = step(th + .001, l);
    float lensOn = step(th + .001, L);
    if (uCursor > .5 && uCursor < 1.5) on = mix(on, 1. - on, lensOn);
    col = mix(uBg, uInk, on);
    if (uCursor < .5) col = mix(col, photo(uv), lensOn);
  } else if (uEffect < 1.5) {             // ---- halftone
    float b = uCursor < .5 ? L * uBulge : 0.;
    vec2 q = mp + (fc - mp) / (1. + b);   // loupe: pull content toward the cursor
    mat2 R = rot(radians(uAngle));
    vec2 p = R * q;
    vec2 center = (floor(p / uCell) + .5) * uCell;
    vec2 cuv = (center * R) / uRes;       // back to unrotated (R is orthonormal)
    vec3 src = photo(cuv);
    float l = tone(luma(src));
    if (uInvert > .5) l = 1. - l;
    l *= keep(src);
    float rad = sqrt(l) * uCell * .5 * 1.414 * uDotScale * smoothstep(0., 1., uIntro * 1.4 - (1. - cuv.y) * .4);
    float on = clamp(rad - length(p - center) + .5, 0., 1.);
    vec3 ink = mix(uInk, src * 1.15, uTint);
    col = mix(uBg, ink, on);
    if (uCursor > .5 && uCursor < 1.5) col = mix(col, photo(uv), L);
  } else if (uEffect < 2.5) {             // ---- ascii
    vec2 cs = vec2(uCell, uCell * 1.6);
    vec2 cell = floor(fc / cs);
    vec2 cuv = (cell + .5) * cs / uRes;
    vec3 src = photo(cuv);
    float l = tone(luma(src));
    if (uInvert > .5) l = 1. - l;
    l *= keep(src);
    float g = floor(l * (uGlyphs - .001));
    float h = hash(cell);
    float k = uIntro * 1.3 - h;                          // decode in, per character
    if (k < 0.) g = 0.;
    else if (k < .3) g = 1. + floor(hash(cell + floor(t * 14.)) * (uGlyphs - 1.));
    if (uCursor < .5 && hash(cell * 1.7) < L * 1.4)       // scramble under the cursor
      g = 1. + floor(hash(cell + floor(t * 10.) * 3.1) * (uGlyphs - 1.));
    vec2 f = fract(fc / cs);
    float a = texture2D(uAtlas, vec2((g + f.x) / uGlyphs, 1. - f.y)).a;
    vec3 ink = mix(uInk, src * 1.3, uTint);
    col = mix(uBg, ink, a);
    if (uCursor > .5 && uCursor < 1.5) col = mix(col, photo(uv), L);
  } else {                                // ---- scan
    float intro = smoothstep(0., 1., uIntro);
    float bs = mix(48. * uDpr, uCell, intro);            // big blocks resolve down
    float sharp = uCursor < .5 ? step(bayer8(floor(fc / 2.)) + .001, L) : 0.;
    bs = max(1., mix(bs, 1., sharp));
    vec2 x = fc;
    if (uCursor > .5 && uCursor < 1.5) {                 // glitch: row tears under the cursor
      float row = floor(fc.y / (6. * uDpr));
      x.x += (hash(vec2(row, floor(t * 6.))) - .5) * 40. * uDpr * L;
    }
    vec2 cuv = (floor(x / bs) + .5) * bs / uRes;
    vec2 o = vec2(uSplit * (1. - sharp) / uRes.x, 0.);
    vec3 c = vec3(photo(cuv + o).r, photo(cuv).g, photo(cuv - o).b);
    c = clamp((c - .5) * uContrast + .5, 0., 1.);
    c = mix(c, luma(c) * uInk * 1.4, uTint * (1. - sharp));
    float line = step(.5, fract(fc.y / (3. * uDpr)));
    c *= 1. - uScan * .6 * line * (1. - sharp);
    float by = 1. - fract(t * uBeam);                    // beam sweeps top to bottom
    float bd = (uv.y - by) * uRes.y / (24. * uDpr);
    c += uInk * .22 * exp(-bd * bd) * step(.001, uBeam) * (1. - sharp);
    c *= intro * .85 + .15;
    col = c;
  }
  gl_FragColor = vec4(col, 1.);
}`;

  const portrait = (() => {
    let s = null; // the one surface
    let raf = 0;
    let mouse = null;
    const t0 = performance.now();
    const EFFECTS = Object.keys(PORTRAIT_META);
    const CURSORS = { dither: ["reveal", "invert", "none"], halftone: ["magnify", "reveal", "none"], ascii: ["scramble", "reveal", "none"], scan: ["resolve", "glitch", "none"] };

    function compile(gl) {
      const prog = gl.createProgram();
      for (const [type, src] of [[gl.VERTEX_SHADER, VERT], [gl.FRAGMENT_SHADER, PFRAG]]) {
        const sh = gl.createShader(type);
        gl.shaderSource(sh, src);
        gl.compileShader(sh);
        if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(sh));
        gl.attachShader(prog, sh);
      }
      gl.linkProgram(prog);
      if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(prog));
      return prog;
    }
    function texture(gl, unit) {
      const tex = gl.createTexture();
      gl.activeTexture(gl.TEXTURE0 + unit);
      gl.bindTexture(gl.TEXTURE_2D, tex);
      for (const [k, v] of [[gl.TEXTURE_MIN_FILTER, gl.LINEAR], [gl.TEXTURE_MAG_FILTER, gl.LINEAR], [gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE], [gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE]]) gl.texParameteri(gl.TEXTURE_2D, k, v);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, new Uint8Array([0, 0, 0, 0]));
      return tex;
    }

    function build() {
      destroy();
      const el = document.querySelector(".about-picture");
      const img = el?.querySelector("img");
      if (!img || !config.portrait.on) return;
      const canvas = document.createElement("canvas");
      canvas.className = "fx-surface fx-portrait";
      canvas.setAttribute("aria-hidden", "true");
      const gl = canvas.getContext("webgl", { antialias: false });
      if (!gl) return;
      let prog;
      try { prog = compile(gl); } catch (err) { console.warn("fx: portrait shader failed", err); return; }
      gl.useProgram(prog);
      const buf = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, buf);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
      const loc = gl.getAttribLocation(prog, "p");
      gl.enableVertexAttribArray(loc);
      gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
      const u = {};
      for (const n of PFRAG.match(/uniform [^;]+;/g).flatMap((l) => l.replace(/uniform \w+ /, "").replace(";", "").split(/,\s*/))) u[n] = gl.getUniformLocation(prog, n);
      const src = texture(gl, 0), atlas = texture(gl, 1);
      gl.uniform1i(u.uSrc, 0);
      gl.uniform1i(u.uAtlas, 1);

      const restore = [];
      if (getComputedStyle(el).position === "static") { el.style.position = "relative"; restore.push(() => el.style.removeProperty("position")); }
      el.prepend(canvas);
      s = { el, img, canvas, gl, u, src, atlas, restore, w: 0, h: 0, intro: reduceMotion ? 1 : 0, introStart: null, mouseK: 0, ready: false, glyphs: 1 };
      s.ro = new ResizeObserver(resize);
      s.ro.observe(el);
      s.io = new IntersectionObserver(([e]) => { s.visible = e.isIntersecting; if (s.visible) kick(); });
      s.io.observe(el);
      if (!img.complete) img.addEventListener("load", () => { upload(); kick(); }, { once: true });
      atlasUpload();
      resize();
    }
    function destroy() {
      if (!s) return;
      s.ro.disconnect(); s.io.disconnect();
      s.gl.getExtension("WEBGL_lose_context")?.loseContext();
      s.canvas.remove();
      s.img.style.removeProperty("opacity");
      s.restore.forEach((f) => f());
      s = null;
    }
    function resize() {
      if (!s) return;
      const r = s.el.getBoundingClientRect();
      const d = dpr();
      const w = Math.max(1, Math.round(r.width * d)), h = Math.max(1, Math.round(r.height * d));
      if (w === s.w && h === s.h) return;
      s.w = s.canvas.width = w;
      s.h = s.canvas.height = h;
      s.gl.viewport(0, 0, w, h);
      upload();
      kick();
    }
    // The photo drawn the way the <img> shows it: object-fit cover at its object-position.
    function upload() {
      const im = s?.img;
      if (!im?.naturalWidth) return;
      const c = document.createElement("canvas");
      c.width = s.w; c.height = s.h;
      const k = Math.max(s.w / im.naturalWidth, s.h / im.naturalHeight);
      const iw = im.naturalWidth * k, ih = im.naturalHeight * k;
      const [px, py] = getComputedStyle(im).objectPosition.split(" ").map((v) => (v.endsWith("%") ? parseFloat(v) / 100 : 0.5));
      c.getContext("2d").drawImage(im, (s.w - iw) * px, (s.h - ih) * py, iw, ih);
      const gl = s.gl;
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, s.src);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, c);
      s.ready = true;
      s.img.style.opacity = "0"; // the canvas draws the photo from here on
    }
    // ASCII glyphs side by side in one strip, white on transparent.
    function atlasUpload() {
      if (!s) return;
      const chars = [...(ASCII_RAMPS[config.portrait.effects.ascii.ramp] || ASCII_RAMPS.standard)];
      const W = 40, H = 64;
      const c = document.createElement("canvas");
      c.width = W * chars.length; c.height = H;
      const ctx = c.getContext("2d");
      const font = getComputedStyle(root).getPropertyValue("--font-mono").trim() || "monospace";
      ctx.font = `500 ${H * 0.62}px ${font}`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillStyle = "#fff";
      chars.forEach((ch, i) => ctx.fillText(ch, W * i + W / 2, H / 2));
      const gl = s.gl;
      gl.activeTexture(gl.TEXTURE1);
      gl.bindTexture(gl.TEXTURE_2D, s.atlas);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, c);
      s.glyphs = chars.length;
      kick();
    }

    function render(now) {
      raf = 0;
      if (!s || !s.visible || !s.ready) return;
      const p = config.portrait;
      const e = p.effects[p.effect] || p.effects.dither;
      const d = dpr();
      if (s.introStart != null) {
        s.intro = p.intro && !reduceMotion ? clamp01((now - s.introStart) / (p.intro / config.speed)) : now >= s.introStart ? 1 : 0;
        if (s.intro >= 1) s.introStart = null;
      }
      const r = s.el.getBoundingClientRect();
      let hover = false, mx = s.mx ?? 0.5, my = s.my ?? 0.5;
      if (mouse) {
        const x = (mouse.x - r.left) / r.width, y = 1 - (mouse.y - r.top) / r.height;
        hover = x > -0.15 && x < 1.15 && y > -0.15 && y < 1.15;
        if (hover) { s.mx = mx = x; s.my = my = y; }
      }
      s.mouseK += ((hover ? 1 : 0) - s.mouseK) * 0.14;
      const { gl, u } = s;
      const f = (n, v) => gl.uniform1f(u[n], v);
      gl.uniform2f(u.uRes, s.w, s.h);
      gl.uniform3f(u.uMouse, mx, my, s.mouseK);
      gl.uniform3f(u.uInk, ...hexRgb(e.ink || "#09fd42"));
      gl.uniform3f(u.uBg, ...hexRgb(e.bg || "#121212"));
      f("uEffect", Math.max(0, EFFECTS.indexOf(p.effect)));
      f("uTime", reduceMotion ? 0 : (now - t0) / 1000);
      f("uIntro", s.intro);
      f("uLens", p.lens);
      f("uLensSoft", p.lensSoft);
      f("uCell", Math.max(1, e.cell * d));
      f("uMatrix", e.matrix ?? 8);
      f("uBright", e.brightness ?? 0);
      f("uContrast", e.contrast ?? 1);
      f("uAngle", e.angle ?? 0);
      f("uDotScale", e.dotScale ?? 1);
      f("uTint", e.tint ?? 0);
      f("uBulge", e.bulge ?? 0);
      f("uCursor", Math.max(0, CURSORS[p.effect].indexOf(e.cursor)));
      f("uGlyphs", s.glyphs);
      f("uInvert", e.invert ? 1 : 0);
      f("uSplit", (e.split ?? 0) * d);
      f("uScan", e.scanlines ?? 0);
      f("uBeam", reduceMotion ? 0 : e.beam ?? 0);
      f("uDpr", d);
      f("uKey", e.key ?? 0);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      // Keep drawing while something moves: the intro, the lens, or the scan beam.
      const moving = s.introStart != null || s.mouseK > 0.005 || hover || (p.effect === "scan" && e.beam > 0 && !reduceMotion);
      if (moving) raf = requestAnimationFrame(render);
    }
    function kick() { if (!raf && !document.hidden) raf = requestAnimationFrame(render); }

    function intro(el, delay) {
      if (s && s.el === el) { s.introStart = performance.now() + delay; s.intro = 0; kick(); }
    }
    function resetIntro() { if (s) { s.intro = reduceMotion ? 1 : 0; s.introStart = null; kick(); } }

    addEventListener("pointermove", (e) => { if (e.pointerType === "touch") return; mouse = { x: e.clientX, y: e.clientY }; kick(); }, { passive: true });
    document.addEventListener("pointerleave", () => { mouse = null; kick(); });
    document.addEventListener("visibilitychange", kick);
    return { build, intro, resetIntro, kick, atlas: atlasUpload, refresh: () => { upload(); kick(); }, replayIntro: () => intro(s?.el, 0) };
  })();

  /* ---------- Buttons ---------- */

  const buttons = (() => {
    const els = [...document.querySelectorAll(".btn")];
    const glyphs = GLYPHS.symbols;

    function setFill(btn, p) {
      const fill = btn.__fxFill;
      const o = config.buttons;
      btn.__fxP = p;
      btn.classList.toggle("fx-on", p >= 0.5);
      if (p <= 0) { fill.style.visibility = "hidden"; return; }
      fill.style.visibility = "visible";
      if (p >= 1) {
        for (const pre of ["", "-webkit-"]) fill.style.removeProperty(pre + "mask-image");
        return;
      }
      const set = maskSet("bayer", o.matrix, o.pixel);
      const url = set.frames[Math.floor(p * (set.frames.length - 1))];
      fill.style.maskImage = fill.style.webkitMaskImage = url;
      fill.style.maskSize = fill.style.webkitMaskSize = set.size;
    }

    // Fill runs from wherever it is now, so quick in/out never jumps.
    function fillTo(btn, target) {
      const from = btn.__fxP || 0;
      const span = Math.abs(target - from);
      if (!span) return;
      tween(btn.__fxFill, 0, (config.buttons.duration / config.speed) * span, (p) => setFill(btn, from + (target - from) * p));
    }

    function scramble(btn) {
      if (!config.buttons.scramble || btn.__fxState === "run" || btn.__fxState === "wait") return;
      const nodes = textOf(btn);
      const total = nodes.reduce((n, [, t]) => n + t.length, 0);
      if (!total) return;
      tween(btn.__fxLabel, 0, config.buttons.scrambleDuration / config.speed, (p) => {
        let g = 0;
        for (const [node, text] of nodes) {
          let out = "";
          for (let i = 0; i < text.length; i++, g++) {
            const ch = text[i];
            out += p >= g / total || /\s|[↑↗→]/.test(ch) ? ch : glyphs[Math.floor(Math.random() * glyphs.length)];
          }
          node.data = out;
        }
      }, () => nodes.forEach(([node, text]) => { node.data = text; }));
    }

    function enter(btn) { if (!btn.__fxIn) { btn.__fxIn = true; fillTo(btn, 1); scramble(btn); } }
    function leave(btn) { if (btn.__fxIn) { btn.__fxIn = false; fillTo(btn, 0); } }

    function setup(btn) {
      const fill = document.createElement("span");
      fill.className = "fx-btn-fill";
      fill.setAttribute("aria-hidden", "true");
      btn.prepend(fill);
      btn.__fxFill = fill;
      btn.__fxLabel = {};
      btn.__fxP = 0;
      btn.classList.add("fx-btn");
      setFill(btn, 0);
      const on = {
        pointerenter: (e) => { if (e.pointerType === "mouse") enter(btn); },
        pointerleave: () => leave(btn),
        focus: () => { if (btn.matches(":focus-visible")) enter(btn); },
        blur: () => leave(btn),
        pointerdown: () => {
          if (!config.buttons.press) return;
          fill.classList.remove("fx-press");
          void fill.offsetWidth; // restart the animation
          fill.classList.add("fx-press");
          if (!btn.__fxIn) { setFill(btn, 1); btn.__fxP = 1; }
        },
        // Touch has no hover to end: clear the fill shortly after the tap (or
        // when the touch turns into a scroll). pointerdown fills without
        // marking __fxIn, so reset directly rather than via leave().
        pointerup: (e) => { if (e.pointerType !== "mouse") setTimeout(() => { btn.__fxIn = false; fillTo(btn, 0); }, 160); },
        pointercancel: () => { btn.__fxIn = false; fillTo(btn, 0); },
      };
      for (const [k, f] of Object.entries(on)) btn.addEventListener(k, f);
      btn.__fxOff = () => {
        for (const [k, f] of Object.entries(on)) btn.removeEventListener(k, f);
        cancel(fill); cancel(btn.__fxLabel);
        textOf(btn).forEach(([node, text]) => { node.data = text; });
        fill.remove();
        btn.classList.remove("fx-btn", "fx-on");
        btn.__fxIn = false;
      };
    }

    function build() {
      els.forEach((b) => b.__fxOff?.());
      root.style.setProperty("--fx-arrow-shift", `${config.buttons.arrowShift}px`);
      if (!config.buttons.on || reduceMotion) return;
      els.forEach(setup);
    }
    return { build };
  })();

  /* ---------- Panel ---------- */

  function control(def, obj, onChange) {
    const row = document.createElement("div");
    row.className = "fx-row";
    const id = `fx-${Math.random().toString(36).slice(2, 8)}`;
    const label = document.createElement("label");
    label.htmlFor = id;
    label.textContent = def.label;
    const out = document.createElement("output");
    let input;
    if (def.type === "select") {
      input = document.createElement("select");
      for (const opt of def.options) input.add(new Option(String(opt), String(opt), false, String(opt) === String(obj[def.key])));
      input.addEventListener("change", () => {
        obj[def.key] = typeof def.options[0] === "number" ? Number(input.value) : input.value;
        onChange(def.key);
      });
    } else if (def.type === "toggle") {
      input = document.createElement("input");
      input.type = "checkbox";
      input.checked = !!obj[def.key];
      input.addEventListener("change", () => { obj[def.key] = input.checked; onChange(def.key); });
    } else if (def.type === "color") {
      input = document.createElement("input");
      input.type = "color";
      input.value = obj[def.key];
      input.addEventListener("input", () => { obj[def.key] = input.value; out.textContent = input.value; onChange(def.key); });
      out.textContent = obj[def.key];
    } else {
      input = document.createElement("input");
      input.type = "range";
      Object.assign(input, { min: def.min, max: def.max, step: def.step, value: obj[def.key] });
      const fmt = () => { out.textContent = `${+Number(obj[def.key]).toFixed(2)}${def.unit || ""}`; };
      fmt();
      input.addEventListener("input", () => { obj[def.key] = Number(input.value); fmt(); onChange(def.key); });
    }
    input.id = id;
    row.append(label, input, out);
    return row;
  }

  function buildPanel() {
    const toggle = document.createElement("button");
    toggle.className = "fx-toggle";
    toggle.type = "button";
    toggle.textContent = "FX";
    toggle.setAttribute("aria-expanded", "false");
    const panel = document.createElement("section");
    panel.className = "fx-panel";
    panel.setAttribute("aria-label", "Animation settings");
    panel.hidden = true;
    let open = false;
    try { open = localStorage.getItem(STORE_KEY + ":open") === "1"; } catch {}
    const setOpen = (v) => {
      open = v;
      panel.hidden = !v;
      toggle.setAttribute("aria-expanded", String(v));
      try { localStorage.setItem(STORE_KEY + ":open", v ? "1" : "0"); } catch {}
    };
    toggle.addEventListener("click", () => setOpen(!open));
    addEventListener("keydown", (e) => {
      if (e.key === "`" && !/INPUT|SELECT|TEXTAREA/.test(document.activeElement?.tagName)) setOpen(!open);
    });

    let replayTimer = 0;
    const queueReplay = () => {
      if (!config.autoReplay) return;
      clearTimeout(replayTimer);
      replayTimer = setTimeout(replay, 350);
    };
    const note = document.createElement("div");
    note.className = "fx-note";

    function render() {
      panel.replaceChildren();
      const h = (t) => { const e = document.createElement("h4"); e.textContent = t; panel.append(e); };

      h("Version");
      const vs = document.createElement("div");
      vs.className = "fx-versions";
      for (const [key, meta] of Object.entries(VERSIONS_META)) {
        const b = document.createElement("button");
        b.type = "button";
        b.setAttribute("aria-pressed", String(config.version === key));
        b.innerHTML = `<b>${meta.n}</b>${meta.name}`;
        b.addEventListener("click", () => {
          if (config.version === key) return replay();
          PRESETS[config.version].leave?.(config.versions[config.version]);
          config.version = key;
          save();
          render();
          replay();
        });
        vs.append(b);
      }
      panel.append(vs);
      const desc = document.createElement("p");
      desc.className = "fx-desc";
      desc.textContent = VERSIONS_META[config.version].desc;
      panel.append(desc);

      h(`Reveal · ${VERSIONS_META[config.version].name}`);
      const vo = config.versions[config.version];
      for (const def of SCHEMA[config.version]) {
        panel.append(control(def, vo, (key) => {
          save();
          if (config.version === "field" && key === "trail") ambient.trail(vo.trail);
          if (config.version === "scan" && key === "scanlines") ambient.scanlines(vo.scanlines);
          if (!["trail", "trailDiv", "trailFade", "trailOpacity", "scanlines"].includes(key)) queueReplay();
        }));
      }

      h("Dither shader");
      for (const def of SHADER_SCHEMA) {
        panel.append(control(def, config.shader, (key) => {
          save();
          if (["on", "mk", "slots", "cursorEverywhere", "cursorLayer"].includes(key)) shader.build();
          else if (key === "softness") shader.refresh();
          shader.kick();
        }));
      }

      h("Portrait effect");
      const pc = config.portrait;
      const ps = document.createElement("div");
      ps.className = "fx-versions fx-versions--4";
      for (const [key, meta] of Object.entries(PORTRAIT_META)) {
        const b = document.createElement("button");
        b.type = "button";
        b.setAttribute("aria-pressed", String(pc.effect === key));
        b.innerHTML = `<b>${meta.n}</b>${meta.name}`;
        b.addEventListener("click", () => {
          pc.effect = key;
          save();
          render();
          portrait.replayIntro();
        });
        ps.append(b);
      }
      panel.append(ps);
      const pdesc = document.createElement("p");
      pdesc.className = "fx-desc";
      pdesc.textContent = PORTRAIT_META[pc.effect].desc;
      panel.append(pdesc);
      for (const def of PORTRAIT_COMMON) {
        panel.append(control(def, pc, (key) => {
          save();
          if (key === "on") { shader.build(); portrait.build(); }
          portrait.kick();
        }));
      }
      for (const def of PORTRAIT_SCHEMA[pc.effect]) {
        panel.append(control(def, pc.effects[pc.effect], (key) => {
          save();
          if (key === "ramp") portrait.atlas();
          portrait.kick();
        }));
      }
      const pa = document.createElement("div");
      pa.className = "fx-actions";
      const pb = document.createElement("button");
      pb.type = "button";
      pb.textContent = "Replay portrait";
      pb.addEventListener("click", () => portrait.replayIntro());
      pa.append(pb);
      panel.append(pa);

      h("Buttons");
      for (const def of BUTTON_SCHEMA) {
        panel.append(control(def, config.buttons, (key) => {
          save();
          if (key === "on" || key === "arrowShift") buttons.build();
        }));
      }

      h("Playback");
      panel.append(control({ key: "speed", label: "Speed", type: "range", min: 0.25, max: 3, step: 0.05, unit: "×" }, config, () => { save(); queueReplay(); }));
      panel.append(control({ key: "autoReplay", label: "Auto replay", type: "toggle" }, config, save));

      const actions = document.createElement("div");
      actions.className = "fx-actions";
      const btn = (label, fn) => { const b = document.createElement("button"); b.type = "button"; b.textContent = label; b.addEventListener("click", fn); actions.append(b); };
      btn("Replay", replay);
      btn("Copy", async () => {
        try {
          await navigator.clipboard.writeText(JSON.stringify(config, null, 2));
          note.textContent = "Copied. Paste over DEFAULTS in fx.js.";
        } catch { note.textContent = "Clipboard blocked by the browser."; }
      });
      btn("Reset", () => {
        PRESETS[config.version].leave?.(config.versions[config.version]);
        config = clone(DEFAULTS);
        save();
        shader.build();
        portrait.build();
        buttons.build();
        render();
        replay();
        note.textContent = "Reset to DEFAULTS.";
      });
      panel.append(actions, note);
    }

    render();
    document.body.append(panel, toggle);
    setOpen(open);
  }

  /* ---------- Start ---------- */

  shader.build();
  portrait.build();
  buttons.build();
  replay();
  root.classList.remove("fx-pending");
  if (SHOW_CONTROLS) buildPanel();
})();
