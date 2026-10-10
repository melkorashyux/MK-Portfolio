/* Page animations: the ASCII background decodes into place, and every piece
   of text rises out of its own invisible mask, on load and on scroll.

   Every tunable value lives in DEFAULTS. The control panel (SHOW_CONTROLS)
   edits a live copy, keeps your changes in this browser's localStorage, and
   "Copy settings" puts a new DEFAULTS block on the clipboard to paste here. */
(() => {
  const root = document.documentElement;
  const SHOW_CONTROLS = true;
  const STORE_KEY = "anim-config";
  const MOTION = "anim" in root.dataset; // set by the boot script in <head>

  const DEFAULTS = {
    playback: {
      speed: 0.8,
      autoReplay: true,
    },
    ascii: {
      delay: 0,
      duration: 1200,
      band: 20, // rows of scrambled characters on the reveal front
      tick: 40, // ms between glyph swaps; higher feels more mechanical
      direction: "up",
      charset: ":::.;-+*#",
    },
    mask: {
      duration: 750,
      easing: [0.16, 1, 0.3, 1],
      distance: 160, // % of the word's own height it starts below its mask
      tilt: 5, // deg of rotation at the start of the rise
      lineStagger: 110,
      clipTop: 0.35, // em the mask extends above each word (ascenders)
      clipBottom: 0.3, // em the mask extends below each word (descenders)
    },
    hero: {
      delay: 1010,
      blockStagger: 265, // between eyebrow, headline, subtext, button, clock
      navStagger: 140,
      navDistance: 20, // px the nav drops in from
      ctaDistance: 24, // px the button rises from
    },
    scroll: {
      triggerOffset: 15, // % of viewport height above the bottom edge
      descDelay: 195, // card title/description after the image
      cardStagger: 500,
      wipeDuration: 1300,
      easing: [0.16, 1, 0.3, 1],
    },
    // Each row reveals as one unit: its year, the description it belongs to,
    // and the divider under them, all off a single scroll trigger.
    timeline: {
      triggerOffset: 12,
      order: "together", // year | together | text — which side leads
      gap: 500, // ms between the leading side and the one that follows
      rowCascade: 290, // ms between rows that enter the viewport together
      yearDuration: 750,
      yearDistance: 160,
      yearTilt: 5,
      yearEasing: [0.16, 1, 0.3, 1],
      textDuration: 750,
      textDistance: 160,
      textTilt: 5,
      textLineStagger: 110,
      textEasing: [0.16, 1, 0.3, 1],
      dividerDelay: 150, // after the description starts
      dividerDuration: 1400,
      dividerOrigin: "left",
      dividerEasing: [0.16, 1, 0.3, 1],
    },
  };

  const clone = (o) => JSON.parse(JSON.stringify(o));
  const same = (a, b) => JSON.stringify(a) === JSON.stringify(b);

  // Saved values for settings that no longer exist are dropped.
  function load() {
    const cfg = clone(DEFAULTS);
    try {
      const saved = JSON.parse(localStorage.getItem(STORE_KEY)) || {};
      for (const k in cfg) {
        for (const f in saved[k]) if (f in cfg[k]) cfg[k][f] = saved[k][f];
      }
    } catch {}
    return cfg;
  }

  let C = load();

  // Only values that differ from DEFAULTS are stored, so later edits to
  // DEFAULTS still show through for everything you haven't touched.
  function changes() {
    const diff = {};
    for (const k in C) {
      for (const f in C[k]) {
        if (!same(C[k][f], DEFAULTS[k][f])) (diff[k] ??= {})[f] = C[k][f];
      }
    }
    return diff;
  }

  function save() {
    try {
      localStorage.setItem(STORE_KEY, JSON.stringify(changes()));
    } catch {}
  }

  const ease = (b) => `cubic-bezier(${b.join(", ")})`;

  function applyVars() {
    root.style.setProperty("--mask-clip-top", `${C.mask.clipTop}em`);
    root.style.setProperty("--mask-clip-bottom", `${C.mask.clipBottom}em`);
  }

  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];
  const wait = (ms) => new Promise((r) => setTimeout(r, ms));

  /* ---------- Text splitting ---------- */

  // Split markup is temporary: once an element's reveal finishes, its original
  // HTML goes back so kerning and line wrapping are exactly the designed ones.
  const originals = new Map();

  function remember(el) {
    if (!originals.has(el)) originals.set(el, el.innerHTML);
  }

  function restore(el) {
    if (!originals.has(el)) return;
    el.innerHTML = originals.get(el);
    originals.delete(el);
  }

  // Wraps every word in a span, recursing into inline children like <strong>
  // and leaving <br> alone. Returns the word spans in reading order.
  function splitWords(el) {
    const words = [];
    const walk = (node) => {
      for (const child of [...node.childNodes]) {
        if (child.nodeType === Node.TEXT_NODE) {
          const frag = document.createDocumentFragment();
          for (const part of child.textContent.split(/(\s+)/)) {
            if (!part) continue;
            if (/^\s+$/.test(part)) {
              frag.append(" ");
              continue;
            }
            const word = document.createElement("span");
            word.className = "a-word";
            word.textContent = part;
            frag.append(word);
            words.push(word);
          }
          child.replaceWith(frag);
        } else if (child.nodeType === Node.ELEMENT_NODE && child.tagName !== "BR") {
          walk(child);
        }
      }
    };
    walk(el);
    return words;
  }

  // Groups inline nodes into the visual lines they currently wrap onto.
  function byLine(nodes) {
    const lines = [];
    let top = null;
    for (const node of nodes) {
      const y = node.getBoundingClientRect().top;
      if (top === null || Math.abs(y - top) > 4) {
        lines.push([]);
        top = y;
      }
      lines.at(-1).push(node);
    }
    return lines;
  }

  /* ---------- Playback ---------- */

  // Every group on the page, so a replay can tear all of them down cleanly.
  let groups = [];
  let observers = [];

  // A group is a set of WAAPI animations plus scripted jobs that start together.
  function group() {
    const g = { anims: [], jobs: [], running: [], restore: [], cleanup: [], dead: false };
    groups.push(g);
    return g;
  }

  // Created paused with fill "both", so the start keyframe applies right away
  // and the element sits hidden until its group plays.
  function paused(el, keyframes, options) {
    const a = el.animate(keyframes, { fill: "both", ...options });
    a.pause();
    return a;
  }

  // offset (ms) pushes the whole group later, e.g. to cascade timeline rows.
  function play(g, offset = 0) {
    g.anims.forEach((a) => {
      if (offset) a.effect.updateTiming({ delay: a.effect.getTiming().delay + offset });
      a.playbackRate = C.playback.speed;
      a.play();
    });
    const pending = [...g.anims.map((a) => a.finished), ...g.jobs.map((start) => start(g))];
    Promise.all(pending).then(() => {
      if (g.dead) return;
      g.anims.forEach((a) => a.cancel());
      g.restore.forEach(restore);
    }, () => {});
  }

  function kill(g) {
    g.dead = true;
    g.anims.forEach((a) => a.cancel());
    g.running.forEach((job) => jobs.delete(job));
    g.restore.forEach(restore);
    g.cleanup.forEach((fn) => fn());
  }

  function teardown() {
    observers.forEach((io) => io.disconnect());
    groups.forEach(kill);
    observers = [];
    groups = [];
  }

  function scrollGroup(trigger, build, { triggerOffset = C.scroll.triggerOffset, offset } = {}) {
    if (!trigger) return;
    const g = group();
    build(g);
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          io.disconnect();
          play(g, offset ? offset() : 0);
        }
      },
      { rootMargin: `0px 0px -${triggerOffset}% 0px` }
    );
    io.observe(trigger);
    observers.push(io);
  }

  /* ---------- Moves ---------- */

  function fade(g, el, delay, duration, easing = "ease-out") {
    if (!el) return;
    g.anims.push(paused(el, [{ opacity: 0 }, { opacity: 1 }], { duration, delay, easing }));
  }

  function rise(g, el, delay, duration, easing, distance) {
    if (!el) return;
    g.anims.push(
      paused(
        el,
        [
          { opacity: 0, transform: `translateY(${distance}px)` },
          { opacity: 1, transform: "none" },
        ],
        { duration, delay, easing }
      )
    );
  }

  function wipe(g, el, delay, duration, easing) {
    if (!el) return;
    g.anims.push(
      paused(el, [{ clipPath: "inset(100% 0 0 0)" }, { clipPath: "inset(0 0 0 0)" }], {
        duration,
        delay,
        easing,
      })
    );
  }

  function draw(g, el, delay, duration, easing, origin = "left") {
    if (!el) return;
    g.anims.push(
      paused(
        el,
        [
          { transform: "scaleX(0)", transformOrigin: origin },
          { transform: "scaleX(1)", transformOrigin: origin },
        ],
        { duration, delay, easing }
      )
    );
  }

  // Each word clips its own content; lines rise one after another. `opts`
  // overrides any C.mask value for this element only.
  function maskWords(g, el, delay, opts = {}) {
    if (!el) return;
    const m = { ...C.mask, ...opts };
    remember(el);
    g.restore.push(el);
    const words = splitWords(el);
    for (const word of words) {
      const inner = document.createElement("span");
      inner.className = "a-inner";
      inner.append(...word.childNodes);
      word.classList.add("a-mask");
      word.append(inner);
    }
    byLine(words).forEach((line, i) => {
      for (const word of line) {
        g.anims.push(
          paused(
            word.firstChild,
            [
              { transform: `translateY(${m.distance}%) rotate(${m.tilt}deg)` },
              { transform: "none" },
            ],
            { duration: m.duration, delay: delay + i * m.lineStagger, easing: ease(m.easing) }
          )
        );
      }
    });
  }

  /* ---------- ASCII decode ---------- */

  // One throttled rAF loop drives the scramble.
  const jobs = new Set();
  let decodeRaf = 0;
  let lastTick = 0;

  const randomFrom = (set) => set[(Math.random() * set.length) | 0];
  const garble = (text, set) => text.replace(/\S/g, () => randomFrom(set));

  function loop(now) {
    if (now - lastTick >= C.ascii.tick) {
      lastTick = now;
      for (const job of jobs) job.step(now);
    }
    decodeRaf = jobs.size ? requestAnimationFrame(loop) : 0;
  }

  function run(g, job) {
    jobs.add(job);
    g.running.push(job);
    if (!decodeRaf) decodeRaf = requestAnimationFrame(loop);
  }

  const asciiEl = $(".ascii-art");
  const ASCII = asciiEl ? asciiEl.textContent : "";

  // The art builds row by row behind a band of noise drawn from its own glyphs.
  function decodeAscii(g, pre) {
    if (!pre) return;
    const a = C.ascii;
    const speed = C.playback.speed;
    const set = a.charset || ":";
    const rows = ASCII.split("\n");
    const blank = rows.map((r) => r.replace(/\S/g, " "));
    pre.textContent = blank.join("\n");
    g.cleanup.push(() => {
      pre.textContent = ASCII;
    });

    g.jobs.push(
      () =>
        new Promise((resolve) => {
          const t0 = performance.now() + a.delay / speed;
          run(g, {
            step(now) {
              const p = Math.min(1, Math.max(0, ((now - t0) * speed) / a.duration));
              const front = p * (rows.length + a.band);
              pre.textContent = rows
                .map((row, i) => {
                  const k = a.direction === "up" ? rows.length - 1 - i : i;
                  if (k < front - a.band) return row;
                  if (k < front) return garble(row, set);
                  return blank[i];
                })
                .join("\n");
              if (p >= 1) {
                jobs.delete(this);
                resolve();
              }
            },
          });
        })
    );
  }

  /* ---------- Page ---------- */

  // Sets every element to its start state and returns the hero group; scroll
  // groups arm themselves and play as they enter (immediately if in view).
  function build() {
    teardown();
    const m = C.mask;
    const hc = C.hero;
    const s = C.scroll;
    const e = ease(m.easing);
    const se = ease(s.easing);
    const hero = group();

    decodeAscii(hero, asciiEl);
    [$(".logo"), ...$$(".nav-links a")].forEach((el, i) =>
      rise(hero, el, i * hc.navStagger, m.duration * 0.8, e, -hc.navDistance)
    );
    let t = hc.delay;
    for (const el of $$(".eyebrow, .headline, .subtext")) {
      maskWords(hero, el, t);
      t += hc.blockStagger;
    }
    rise(hero, $(".cta"), t, m.duration, e, hc.ctaDistance);
    fade(hero, $("#clock"), t + hc.blockStagger, m.duration);

    for (const el of $$(".section-title")) scrollGroup(el, (g) => maskWords(g, el, 0));

    scrollGroup($(".work-cards"), (g) =>
      $$(".work-card").forEach((card, i) => {
        const d = i * s.cardStagger;
        wipe(g, $(".work-card-image", card), d, s.wipeDuration, se);
        maskWords(g, $(".work-card-title", card), d + s.descDelay);
        maskWords(g, $(".work-card-description", card), d + s.descDelay * 2);
      })
    );

    const tl = C.timeline;
    const yearStart = tl.order === "text" ? tl.gap : 0;
    const textStart = tl.order === "year" ? tl.gap : 0;
    // Rows that enter together (a fast scroll, a replay) queue up instead of
    // all firing at once. Offsets are in animation time, hence the speed.
    let lastRow = -Infinity;
    const cascade = () => {
      const now = performance.now();
      const start = Math.max(now, lastRow + tl.rowCascade / C.playback.speed);
      lastRow = start;
      return (start - now) * C.playback.speed;
    };
    for (const row of $$(".timeline-row")) {
      scrollGroup(
        row,
        (g) => {
          maskWords(g, $(".timeline-year", row), yearStart, {
            duration: tl.yearDuration,
            distance: tl.yearDistance,
            tilt: tl.yearTilt,
            easing: tl.yearEasing,
          });
          maskWords(g, $(".timeline-description", row), textStart, {
            duration: tl.textDuration,
            distance: tl.textDistance,
            tilt: tl.textTilt,
            lineStagger: tl.textLineStagger,
            easing: tl.textEasing,
          });
          draw(
            g,
            $(".timeline-divider", row),
            textStart + tl.dividerDelay,
            tl.dividerDuration,
            ease(tl.dividerEasing),
            tl.dividerOrigin
          );
        },
        { triggerOffset: tl.triggerOffset, offset: cascade }
      );
    }

    for (const p of $$(".about-text p")) scrollGroup(p, (g) => maskWords(g, p, 0));
    scrollGroup($(".about-picture"), (g) =>
      wipe(g, $(".about-picture"), 0, s.wipeDuration, se)
    );

    return hero;
  }

  function replay() {
    if (MOTION) play(build());
  }

  /* ---------- Control panel ---------- */

  const FIELDS = [
    {
      title: "Playback",
      rows: [
        { path: "playback.speed", label: "Speed", min: 0.1, max: 2, step: 0.05, unit: "×" },
        { path: "playback.autoReplay", label: "Replay on change", type: "toggle" },
      ],
    },
    {
      title: "ASCII background",
      rows: [
        { path: "ascii.delay", label: "Delay", min: 0, max: 3000, step: 10, unit: "ms" },
        { path: "ascii.duration", label: "Duration", min: 200, max: 6000, step: 50, unit: "ms" },
        { path: "ascii.band", label: "Noise band", min: 0, max: 67, step: 1, unit: "rows" },
        { path: "ascii.tick", label: "Glyph swap", min: 16, max: 250, step: 1, unit: "ms" },
        {
          path: "ascii.direction",
          label: "Direction",
          type: "select",
          options: { up: "Bottom → top", down: "Top → bottom" },
        },
        { path: "ascii.charset", label: "Noise glyphs", type: "text" },
      ],
    },
    {
      title: "Text mask",
      rows: [
        { path: "mask.duration", label: "Duration", min: 100, max: 3000, step: 10, unit: "ms" },
        { path: "mask.easing", label: "Easing", type: "bezier" },
        { path: "mask.distance", label: "Rise distance", min: 0, max: 300, step: 1, unit: "%" },
        { path: "mask.tilt", label: "Tilt", min: -20, max: 20, step: 0.5, unit: "°" },
        { path: "mask.lineStagger", label: "Line stagger", min: 0, max: 500, step: 5, unit: "ms" },
        { path: "mask.clipTop", label: "Mask top bleed", min: 0, max: 1, step: 0.01, unit: "em" },
        { path: "mask.clipBottom", label: "Mask bottom bleed", min: 0, max: 1, step: 0.01, unit: "em" },
      ],
    },
    {
      title: "Hero intro",
      rows: [
        { path: "hero.delay", label: "Start delay", min: 0, max: 2000, step: 10, unit: "ms" },
        { path: "hero.blockStagger", label: "Block stagger", min: 0, max: 800, step: 5, unit: "ms" },
        { path: "hero.navStagger", label: "Nav stagger", min: 0, max: 300, step: 5, unit: "ms" },
        { path: "hero.navDistance", label: "Nav drop", min: -60, max: 60, step: 1, unit: "px" },
        { path: "hero.ctaDistance", label: "Button rise", min: -60, max: 120, step: 1, unit: "px" },
      ],
    },
    {
      title: "Scroll reveals",
      rows: [
        { path: "scroll.triggerOffset", label: "Trigger offset", min: 0, max: 50, step: 1, unit: "%" },
        { path: "scroll.descDelay", label: "Card text delay", min: 0, max: 800, step: 5, unit: "ms" },
        { path: "scroll.cardStagger", label: "Card stagger", min: 0, max: 800, step: 5, unit: "ms" },
        { path: "scroll.wipeDuration", label: "Image wipe", min: 100, max: 4000, step: 10, unit: "ms" },
        { path: "scroll.easing", label: "Image wipe easing", type: "bezier" },
      ],
    },
    {
      title: "Timeline",
      rows: [
        { type: "heading", label: "Row" },
        { path: "timeline.triggerOffset", label: "Trigger offset", min: 0, max: 50, step: 1, unit: "%" },
        {
          path: "timeline.order",
          label: "Leads",
          type: "select",
          options: { year: "Year first", together: "Together", text: "Description first" },
        },
        { path: "timeline.gap", label: "Year ↔ description gap", min: 0, max: 1000, step: 5, unit: "ms" },
        { path: "timeline.rowCascade", label: "Row cascade", min: 0, max: 800, step: 5, unit: "ms" },
        { type: "heading", label: "Year" },
        { path: "timeline.yearDuration", label: "Duration", min: 100, max: 3000, step: 10, unit: "ms" },
        { path: "timeline.yearDistance", label: "Rise distance", min: 0, max: 300, step: 1, unit: "%" },
        { path: "timeline.yearTilt", label: "Tilt", min: -20, max: 20, step: 0.5, unit: "°" },
        { path: "timeline.yearEasing", label: "Easing", type: "bezier" },
        { type: "heading", label: "Description" },
        { path: "timeline.textDuration", label: "Duration", min: 100, max: 3000, step: 10, unit: "ms" },
        { path: "timeline.textDistance", label: "Rise distance", min: 0, max: 300, step: 1, unit: "%" },
        { path: "timeline.textTilt", label: "Tilt", min: -20, max: 20, step: 0.5, unit: "°" },
        { path: "timeline.textLineStagger", label: "Line stagger", min: 0, max: 500, step: 5, unit: "ms" },
        { path: "timeline.textEasing", label: "Easing", type: "bezier" },
        { type: "heading", label: "Divider" },
        { path: "timeline.dividerDelay", label: "Delay after description", min: 0, max: 1500, step: 10, unit: "ms" },
        { path: "timeline.dividerDuration", label: "Draw duration", min: 100, max: 4000, step: 10, unit: "ms" },
        {
          path: "timeline.dividerOrigin",
          label: "Draws from",
          type: "select",
          options: { left: "Left", center: "Center", right: "Right" },
        },
        { path: "timeline.dividerEasing", label: "Easing", type: "bezier" },
      ],
    },
  ];

  const BEZIER_PRESETS = {
    "Expo out": [0.16, 1, 0.3, 1],
    "Quart out": [0.25, 1, 0.5, 1],
    "Cubic out": [0.33, 1, 0.68, 1],
    "Back out": [0.34, 1.56, 0.64, 1],
    "In-out": [0.65, 0, 0.35, 1],
    "Ease out": [0, 0, 0.58, 1],
    Linear: [0, 0, 1, 1],
  };

  const getPath = (path) => path.split(".").reduce((o, k) => o[k], C);
  const defaultAt = (path) => path.split(".").reduce((o, k) => o[k], DEFAULTS);
  const setPath = (path, value) => {
    const [k, f] = path.split(".");
    C[k][f] = value;
  };

  function make(tag, props = {}, ...children) {
    const n = document.createElement(tag);
    for (const [k, v] of Object.entries(props)) {
      if (k === "class") n.className = v;
      else if (k.startsWith("on")) n.addEventListener(k.slice(2), v);
      else if (k in n) n[k] = v;
      else n.setAttribute(k, v);
    }
    n.append(...children.filter((c) => c != null));
    return n;
  }

  function svg(tag, attrs = {}) {
    const n = document.createElementNS("http://www.w3.org/2000/svg", tag);
    for (const [k, v] of Object.entries(attrs)) n.setAttribute(k, v);
    return n;
  }

  let replayTimer = 0;
  let onChanged = () => {};

  function changed(path) {
    save();
    applyVars();
    onChanged();
    if (C.playback.autoReplay && path !== "playback.autoReplay") {
      clearTimeout(replayTimer);
      replayTimer = setTimeout(replay, 300);
    }
  }

  function rangeRow(row, refresh) {
    const value = getPath(row.path);
    const num = make("input", {
      type: "number",
      min: row.min,
      max: row.max,
      step: row.step,
      value,
      class: "ac-num",
    });
    const slider = make("input", {
      type: "range",
      min: row.min,
      max: row.max,
      step: row.step,
      value,
      class: "ac-range",
    });
    const set = (v) => {
      if (Number.isNaN(v)) return;
      setPath(row.path, v);
      num.value = v;
      slider.value = v;
      refresh();
      changed(row.path);
    };
    slider.addEventListener("input", () => set(parseFloat(slider.value)));
    num.addEventListener("change", () => set(parseFloat(num.value)));
    return [slider, make("span", { class: "ac-value" }, num, make("span", { class: "ac-unit" }, row.unit))];
  }

  function bezierRow(row, refresh) {
    const S = 200; // viewBox size
    const P = 24; // padding around the unit square
    const YMIN = -0.5;
    const YMAX = 1.5;
    const X = (x) => P + x * (S - 2 * P);
    const Y = (y) => P + ((YMAX - y) / (YMAX - YMIN)) * (S - 2 * P);

    const box = svg("svg", { viewBox: `0 0 ${S} ${S}`, class: "ac-curve" });
    const frame = svg("rect", {
      x: X(0),
      y: Y(1),
      width: X(1) - X(0),
      height: Y(0) - Y(1),
      class: "ac-curve-frame",
    });
    const line1 = svg("line", { class: "ac-curve-arm" });
    const line2 = svg("line", { class: "ac-curve-arm" });
    const path = svg("path", { class: "ac-curve-path" });
    const h1 = svg("circle", { r: 7, class: "ac-curve-handle" });
    const h2 = svg("circle", { r: 7, class: "ac-curve-handle" });
    box.append(frame, line1, line2, path, h1, h2);

    const inputs = [0, 1, 2, 3].map((i) =>
      make("input", { type: "number", step: 0.01, class: "ac-num", "aria-label": ["x1", "y1", "x2", "y2"][i] })
    );
    const presets = make(
      "select",
      { class: "ac-select" },
      make("option", { value: "" }, "Custom"),
      ...Object.keys(BEZIER_PRESETS).map((name) => make("option", { value: name }, name))
    );

    const draw = () => {
      const [x1, y1, x2, y2] = getPath(row.path);
      path.setAttribute(
        "d",
        `M${X(0)},${Y(0)} C${X(x1)},${Y(y1)} ${X(x2)},${Y(y2)} ${X(1)},${Y(1)}`
      );
      line1.setAttribute("x1", X(0));
      line1.setAttribute("y1", Y(0));
      line1.setAttribute("x2", X(x1));
      line1.setAttribute("y2", Y(y1));
      line2.setAttribute("x1", X(1));
      line2.setAttribute("y1", Y(1));
      line2.setAttribute("x2", X(x2));
      line2.setAttribute("y2", Y(y2));
      h1.setAttribute("cx", X(x1));
      h1.setAttribute("cy", Y(y1));
      h2.setAttribute("cx", X(x2));
      h2.setAttribute("cy", Y(y2));
      inputs.forEach((input, i) => (input.value = getPath(row.path)[i]));
      const match = Object.entries(BEZIER_PRESETS).find(([, b]) => same(b, getPath(row.path)));
      presets.value = match ? match[0] : "";
    };

    const set = (b) => {
      setPath(row.path, b.map((v) => Math.round(v * 100) / 100));
      draw();
      refresh();
      changed(row.path);
    };

    const drag = (handle, ix) => {
      handle.addEventListener("pointerdown", (e) => {
        handle.setPointerCapture(e.pointerId);
        const move = (ev) => {
          const r = box.getBoundingClientRect();
          const vx = ((ev.clientX - r.left) / r.width) * S;
          const vy = ((ev.clientY - r.top) / r.height) * S;
          const x = Math.min(1, Math.max(0, (vx - P) / (S - 2 * P)));
          const y = YMAX - ((vy - P) / (S - 2 * P)) * (YMAX - YMIN);
          const b = [...getPath(row.path)];
          b[ix] = x;
          b[ix + 1] = Math.min(YMAX, Math.max(YMIN, y));
          set(b);
        };
        const up = () => {
          handle.removeEventListener("pointermove", move);
          handle.removeEventListener("pointerup", up);
        };
        handle.addEventListener("pointermove", move);
        handle.addEventListener("pointerup", up);
      });
    };
    drag(h1, 0);
    drag(h2, 2);

    inputs.forEach((input, i) =>
      input.addEventListener("change", () => {
        const b = [...getPath(row.path)];
        const v = parseFloat(input.value);
        if (Number.isNaN(v)) return;
        b[i] = i % 2 === 0 ? Math.min(1, Math.max(0, v)) : v;
        set(b);
      })
    );
    presets.addEventListener("change", () => {
      if (presets.value) set([...BEZIER_PRESETS[presets.value]]);
    });

    draw();
    return [
      make(
        "div",
        { class: "ac-bezier" },
        presets,
        box,
        make("div", { class: "ac-bezier-inputs" }, ...inputs)
      ),
    ];
  }

  function fieldRow(row, rerender) {
    if (row.type === "heading") return make("div", { class: "ac-subhead" }, row.label);
    const reset = make("button", {
      type: "button",
      class: "ac-reset",
      title: "Reset to default",
      "aria-label": `Reset ${row.label}`,
      textContent: "↺",
      onclick: () => {
        setPath(row.path, clone(defaultAt(row.path)));
        changed(row.path);
        rerender();
      },
    });
    const refresh = () => {
      reset.hidden = same(getPath(row.path), defaultAt(row.path));
    };

    let controls;
    if (row.type === "toggle") {
      const box = make("input", { type: "checkbox", checked: getPath(row.path), class: "ac-check" });
      box.addEventListener("change", () => {
        setPath(row.path, box.checked);
        refresh();
        changed(row.path);
      });
      controls = [box];
    } else if (row.type === "select") {
      const sel = make(
        "select",
        { class: "ac-select" },
        ...Object.entries(row.options).map(([v, text]) => make("option", { value: v }, text))
      );
      sel.value = getPath(row.path);
      sel.addEventListener("change", () => {
        setPath(row.path, sel.value);
        refresh();
        changed(row.path);
      });
      controls = [sel];
    } else if (row.type === "text") {
      const input = make("input", { type: "text", value: getPath(row.path), class: "ac-text" });
      input.addEventListener("change", () => {
        setPath(row.path, input.value);
        refresh();
        changed(row.path);
      });
      controls = [input];
    } else if (row.type === "bezier") {
      controls = bezierRow(row, refresh);
    } else {
      controls = rangeRow(row, refresh);
    }

    refresh();
    return make(
      "div",
      { class: `ac-row ac-row-${row.type || "range"}` },
      make("span", { class: "ac-label" }, row.label, reset),
      ...controls
    );
  }

  async function copySettings(button) {
    const text = `  const DEFAULTS = ${JSON.stringify(C, null, 2).replace(/\n/g, "\n  ")};\n`;
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      const area = make("textarea", { value: text });
      document.body.append(area);
      area.select();
      document.execCommand("copy");
      area.remove();
    }
    button.textContent = "Copied ✓";
    setTimeout(() => (button.textContent = "Copy settings"), 1500);
  }

  function buildPanel() {
    let open = false;
    try {
      open = localStorage.getItem("anim-panel-open") === "1";
    } catch {}

    const toggle = make("button", { type: "button", class: "ac-toggle", textContent: "Animation controls" });
    const count = make("span", { class: "ac-count" });
    const body = make("div", { class: "ac-body" });

    const render = () => {
      const scroll = body.scrollTop;
      body.replaceChildren(
        ...FIELDS.map((section) =>
          make(
            "details",
            { class: "ac-section", open: true },
            make("summary", {}, section.title),
            ...section.rows.map((row) => fieldRow(row, render))
          )
        )
      );
      body.scrollTop = scroll;
    };

    onChanged = () => {
      const n = Object.values(changes()).reduce((sum, k) => sum + Object.keys(k).length, 0);
      count.textContent = n ? `${n} changed` : "";
    };

    const copy = make("button", { type: "button", class: "ac-btn", textContent: "Copy settings" });
    copy.addEventListener("click", () => copySettings(copy));

    const panel = make(
      "aside",
      { class: "ac-panel", "aria-label": "Animation controls", hidden: !open },
      make(
        "header",
        { class: "ac-head" },
        make("strong", {}, "Animation"),
        count,
        make("button", {
          type: "button",
          class: "ac-close",
          "aria-label": "Close",
          textContent: "×",
          onclick: () => setOpen(false),
        })
      ),
      make(
        "div",
        { class: "ac-actions" },
        make("button", { type: "button", class: "ac-btn ac-btn-primary", textContent: "Replay ↻", onclick: replay }),
        copy,
        make("button", {
          type: "button",
          class: "ac-btn",
          textContent: "Reset all",
          onclick: () => {
            C = clone(DEFAULTS);
            changed("reset");
            render();
          },
        })
      ),
      MOTION
        ? null
        : make(
            "p",
            { class: "ac-note" },
            "Reduced motion is on in your system settings. ",
            make("a", { href: "?motion=force" }, "Play anyway")
          ),
      body,
      make(
        "p",
        { class: "ac-note" },
        "Changes are saved in this browser only. Copy settings and paste over DEFAULTS in animations.js to make them permanent."
      )
    );

    const setOpen = (v) => {
      open = v;
      panel.hidden = !v;
      toggle.hidden = v;
      try {
        localStorage.setItem("anim-panel-open", v ? "1" : "0");
      } catch {}
    };
    toggle.addEventListener("click", () => setOpen(true));

    render();
    onChanged();
    toggle.hidden = open;
    document.body.append(toggle, panel);
  }

  async function init() {
    applyVars();
    if (SHOW_CONTROLS) buildPanel();
    if (!MOTION) return;
    await Promise.race([document.fonts.ready, wait(1500)]);
    const hero = build();
    root.classList.remove("anim-pending");
    play(hero);
  }

  init();
})();
