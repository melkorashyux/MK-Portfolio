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
    background: {
      style: "paper", // plain | grid | dots | paper | watermark | tone | gradient
    },
    // 1. The layout grid drawn as hairlines
    grid: {
      columns: "3", // 3 | 12 | both
      color: "#171717",
      opacity: 0.1,
      weight: 1, // px
      dashed: false,
      rules: true, // horizontal rules
      matchHeadline: true, // rule spacing = the hero headline's line height...
      ruleSpacing: 175, // ...or this, in px
      ruleOffset: 0, // px, shifts the rules from the headline's top
      drawIn: true, // lines draw down on load and on Replay
      drawDuration: 1400,
      drawStagger: 60,
    },
    // 2. Halftone dot field
    dots: {
      color: "#cc0000",
      opacity: 0.55,
      spacing: 14, // px between dot centers
      maxSize: 6, // px diameter where the field is densest
      minSize: 0,
      origin: "bottom-right", // where the field is densest
      reach: 0.75, // share of the viewport diagonal the dots fade out over
      curve: 1.6, // >1 keeps the field tight to the origin, <1 spreads it
      cursorRadius: 160, // px
      cursorStrength: 0.7, // how much dots swell near the cursor; 0 = off
    },
    // 3. Paper wash: the better gradient
    paper: {
      tone: "#f5f2ee", // page color
      tint: "#cc0000",
      intensity: 29, // % of the tint at the center of the light, at the top...
      endIntensity: 20, // ...and once it reaches the closing CTA
      size: 83, // vw
      core: 12, // % of the radius that stays at full intensity
      offsetX: 60, // px from the center of "PRODUCT"
      offsetY: -60,
      travel: true, // the light moves down to the CTA as you scroll...
      endOffsetX: 0, // ...ending this far (px) from "Let's design something"
      endOffsetY: 0,
      follow: 0.12, // how fast the light catches up per frame; 1 = locked
      mottle: 0.06, // large soft unevenness in the paper
      mottleScale: 0.004, // noise frequency; lower = bigger blotches
      texture: 0.05, // fine paper-fiber opacity
      dither: 0.15, // noise that keeps the light's falloff from banding
      drift: false, // slow wandering on top of the scroll position
      speed: 1,
    },
    // 4. Giant outline type behind each section
    watermark: {
      content: "numbers", // numbers | names
      color: "#171717",
      opacity: 0.15,
      stroke: 1.5, // px
      size: 40, // vw
      align: "right",
      offset: -4, // vw from the page edge; negative crops it
      top: -4, // vw from the section's top
      lag: 0.2, // 0 = scrolls with the page; higher drifts behind it
    },
    // 5. Flat background that changes color per section
    tone: {
      // A palette variable from styles.css, or a custom hex
      heroBg: "var(--color-white)",
      heroInk: "var(--color-ink)",
      workBg: "var(--color-white)",
      workInk: "var(--color-ink)",
      timelineBg: "var(--color-white)",
      timelineInk: "var(--color-ink)",
      aboutBg: "var(--color-light-gray)",
      aboutInk: "var(--color-ink)",
      contactBg: "var(--color-ink)",
      contactInk: "var(--color-white)",
      trigger: 50, // % of viewport height a section's top must pass
      duration: 700,
      easing: [0.65, 0, 0.35, 1],
    },
    // The original grainy gradient, kept for comparison
    gradient: {
      color: "#cc0000", // the blobs' tint; the Accent
      opacity: 0.5, // overall visibility of the gradient layer
      blur: 1, // multiplier on how soft the blob edges are
      size: 1, // multiplier on the blobs' size
      grain: 0.18, // film-grain overlay opacity
      grainMatch: true, // grain takes the gradient color...
      grainColor: "#171717", // ...or this one when grainMatch is off
      speed: 1, // multiplier on how fast the blobs drift
      animate: true, // blobs drift and grain flickers vs. a static frame
    },
    ascii: {
      scale: 0.5, // share of the space right of the second column's start
      opacity: 50, // %
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
      blockStagger: 265, // between eyebrow, headline, subtext, button
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
    root.style.setProperty("--ascii-scale", C.ascii.scale);
    root.style.setProperty("--ascii-opacity", `${C.ascii.opacity}%`);
    const G = C.gradient;
    root.style.setProperty("--bg-color", G.color);
    root.style.setProperty("--bg-opacity", G.opacity);
    root.style.setProperty("--bg-blur", G.blur);
    root.style.setProperty("--bg-scale", G.size);
    root.style.setProperty("--bg-grain-color", G.grainMatch ? G.color : G.grainColor);
    root.style.setProperty("--bg-grain", G.grain);
    root.style.setProperty("--bg-duration", `${36 / G.speed}s`);
    root.classList.toggle("bg-static", !G.animate);
    backgrounds.apply();
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
            // Hyphenated words get one span per piece with a <wbr> between,
            // so they can wrap after the hyphen just like the restored text.
            part.split(/(?<=-)(?=[^-])/).forEach((piece, i) => {
              if (i) frag.append(document.createElement("wbr"));
              const word = document.createElement("span");
              word.className = "a-word";
              word.textContent = piece;
              frag.append(word);
              words.push(word);
            });
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

    for (const el of $$(".section-title")) scrollGroup(el, (g) => maskWords(g, el, 0));

    scrollGroup($(".work-cards"), (g) =>
      $$(".work-card").forEach((card, i) => {
        const d = i * s.cardStagger;
        wipe(g, $(".work-card-image", card), d, s.wipeDuration, se);
        maskWords(g, $(".work-card-title", card), d + s.descDelay);
        maskWords(g, $(".work-card-description", card), d + s.descDelay * 2);
        maskWords(g, $(".work-card-link", card), d + s.descDelay * 3);
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
    for (const el of $$(".contact-cta-line")) scrollGroup(el, (g) => maskWords(g, el, 0));

    return hero;
  }

  function replay() {
    if (MOTION) play(build());
    backgrounds.replay();
  }

  /* ---------- Backgrounds ----------
     One style at a time, chosen by background.style. Each style's values
     apply live; apply() runs on every panel change. */

  const STYLES = ["plain", "grid", "dots", "paper", "watermark", "tone", "gradient"];
  const TONE_ZONES = ["hero", "work", "timeline", "about", "contact"];

  const backgrounds = (() => {
    let active = null;
    let frame = 0;
    const set = (k, v) => root.style.setProperty(k, v);

    /* 1. Grid */
    const grid = $(".bg-grid");
    let gridKey = "";

    function buildGrid() {
      const key = C.grid.columns;
      if (key === gridKey) return;
      gridKey = key;
      const sets = key === "both" ? ["12", "3"] : [key];
      grid.replaceChildren(
        ...sets.map((n) =>
          make(
            "div",
            { class: "bg-grid-cols", "data-cols": n },
            ...Array.from({ length: +n }, () => make("div", { class: "bg-grid-col" }))
          )
        ),
        make("div", { class: "bg-grid-rules" })
      );
    }

    // Rules start at the headline's top and repeat at its line height, so
    // each one sits on a line of PRODUCT / DESIGNER & / BUILDER.
    function placeRules() {
      const g = C.grid;
      const headline = $(".headline");
      const top = headline.getBoundingClientRect().top - $(".page").getBoundingClientRect().top;
      const spacing = g.matchHeadline ? parseFloat(getComputedStyle(headline).lineHeight) : g.ruleSpacing;
      set("--grid-rule-spacing", `${spacing}px`);
      set("--grid-rule-offset", `${(((top + g.ruleOffset) % spacing) + spacing) % spacing}px`);
    }

    function applyGrid() {
      const g = C.grid;
      buildGrid();
      set("--grid-color", g.color);
      set("--grid-opacity", g.opacity);
      set("--grid-weight", `${g.weight}px`);
      set("--grid-line-style", g.dashed ? "dashed" : "solid");
      $(".bg-grid-rules", grid).hidden = !g.rules;
      placeRules();
    }

    function drawGrid() {
      if (!MOTION || !C.grid.drawIn) return;
      const speed = C.playback.speed;
      $$(".bg-grid-col", grid).forEach((col, i) =>
        col.animate([{ transform: "scaleY(0)" }, { transform: "scaleY(1)" }], {
          duration: C.grid.drawDuration / speed,
          delay: (i * C.grid.drawStagger) / speed,
          easing: ease(C.scroll.easing),
          fill: "backwards",
        })
      );
      $(".bg-grid-rules", grid).animate([{ opacity: 0 }, { opacity: 1 }], {
        duration: C.grid.drawDuration / speed,
        delay: C.grid.drawDuration / 2 / speed,
        fill: "backwards",
      });
    }

    /* 2. Dots */
    const canvas = $(".bg-dots");
    const ctx = canvas.getContext("2d");
    const mouse = { x: -1e4, y: -1e4, tx: -1e4, ty: -1e4 };

    function sizeCanvas() {
      const dpr = window.devicePixelRatio || 1;
      canvas.width = innerWidth * dpr;
      canvas.height = innerHeight * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    function drawDots() {
      const d = C.dots;
      const w = innerWidth;
      const h = innerHeight;
      const [ox, oy] = {
        "top-left": [0, 0],
        "top-right": [w, 0],
        "bottom-left": [0, h],
        "bottom-right": [w, h],
        center: [w / 2, h / 2],
      }[d.origin];
      const reach = Math.hypot(w, h) * d.reach;
      ctx.clearRect(0, 0, w, h);
      ctx.globalAlpha = d.opacity;
      ctx.fillStyle = d.color;
      ctx.beginPath();
      const step = Math.max(4, d.spacing);
      for (let y = step / 2; y < h; y += step) {
        for (let x = step / 2; x < w; x += step) {
          const t = Math.max(0, 1 - Math.hypot(x - ox, y - oy) / reach);
          let r = d.minSize + (d.maxSize - d.minSize) * t ** d.curve;
          const m = Math.hypot(x - mouse.x, y - mouse.y);
          if (m < d.cursorRadius) r += d.maxSize * d.cursorStrength * (1 - m / d.cursorRadius) ** 2;
          r = Math.min(r, step) / 2;
          if (r < 0.25) continue;
          ctx.moveTo(x + r, y);
          ctx.arc(x, y, r, 0, Math.PI * 2);
        }
      }
      ctx.fill();
    }

    // The cursor's influence eases toward the pointer instead of jumping.
    function dotsLoop() {
      frame = 0;
      mouse.x += (mouse.tx - mouse.x) * 0.18;
      mouse.y += (mouse.ty - mouse.y) * 0.18;
      drawDots();
      if (Math.abs(mouse.tx - mouse.x) + Math.abs(mouse.ty - mouse.y) > 0.5) {
        frame = requestAnimationFrame(dotsLoop);
      }
    }

    addEventListener("pointermove", (e) => {
      mouse.tx = e.clientX;
      mouse.ty = e.clientY;
      if (mouse.x < -1e3) Object.assign(mouse, { x: e.clientX, y: e.clientY });
      if (active === "dots" && C.dots.cursorStrength > 0 && !frame) frame = requestAnimationFrame(dotsLoop);
    });
    document.addEventListener("pointerleave", () => {
      mouse.tx = mouse.ty = -1e4;
      Object.assign(mouse, { x: -1e4, y: -1e4 });
      if (active === "dots") drawDots();
    });

    /* 3. Paper */
    const light = { x: 0, y: 0, i: 0, ready: false };
    let lightFrame = 0;

    function applyPaper() {
      const p = C.paper;
      set("--paper-tint", p.tint);
      set("--paper-size", `${p.size}vw`);
      set("--paper-core", `${p.core}%`);
      set("--paper-mottle", p.mottle);
      set("--paper-texture", p.texture);
      set("--paper-dither", p.dither);
      set("--paper-duration", `${40 / p.speed}s`);
      $("#paper-mottle feTurbulence").setAttribute("baseFrequency", p.mottleScale);
      root.classList.toggle("paper-static", !p.drift);
      light.ready = false; // jump straight to the new target
      moveLight();
    }

    const center = (el) => {
      const r = el.getBoundingClientRect();
      return [r.left + r.width / 2, r.top + r.height / 2];
    };

    // Where the light should be right now, in viewport px. It starts on
    // "PRODUCT" and, with travel on, slides to the CTA in step with the
    // scroll, so it's behind the headline at the top of the page and behind
    // "Let's design something" at the bottom.
    function lightTarget() {
      const p = C.paper;
      const [sx, sy] = center($(".headline .accent"));
      const start = [sx + p.offsetX, sy + p.offsetY];
      if (!p.travel) return [...start, p.intensity];
      const max = document.documentElement.scrollHeight - innerHeight;
      const t = max > 0 ? Math.min(1, scrollY / max) : 0;
      // Both anchors in page coordinates, then back to the viewport.
      const [ex, ey] = center($(".contact-cta-line"));
      const a = [start[0], start[1] + scrollY];
      const b = [ex + p.endOffsetX, ey + scrollY + p.endOffsetY];
      return [
        a[0] + (b[0] - a[0]) * t,
        a[1] + (b[1] - a[1]) * t - scrollY,
        p.intensity + (p.endIntensity - p.intensity) * t,
      ];
    }

    function moveLight() {
      lightFrame = 0;
      if (active !== "paper") return;
      const [tx, ty, ti] = lightTarget();
      const k = light.ready && MOTION ? C.paper.follow : 1;
      light.x += (tx - light.x) * k;
      light.y += (ty - light.y) * k;
      light.i += (ti - light.i) * k;
      light.ready = true;
      set("--paper-x", `${light.x}px`);
      set("--paper-y", `${light.y}px`);
      set("--paper-intensity", `${light.i}%`);
      if (Math.abs(tx - light.x) + Math.abs(ty - light.y) + Math.abs(ti - light.i) > 0.1) {
        lightFrame = requestAnimationFrame(moveLight);
      }
    }

    const queueLight = () => {
      if (active === "paper" && !lightFrame) lightFrame = requestAnimationFrame(moveLight);
    };

    /* 4. Watermark */
    const WM_SECTIONS = [
      ["#work", "Work"],
      ["#timeline", "Timeline"],
      ["#about", "About"],
      ["#contact", "Contact"],
    ];

    function applyWatermark() {
      const w = C.watermark;
      set("--wm-color", w.color);
      set("--wm-opacity", w.opacity);
      set("--wm-stroke", `${w.stroke}px`);
      set("--wm-size", w.size);
      set("--wm-offset", w.offset);
      set("--wm-top", w.top);
      WM_SECTIONS.forEach(([sel, name], i) => {
        const section = $(sel);
        let mark = $(":scope > .bg-watermark", section);
        if (!mark) {
          mark = make("span", { class: "bg-watermark", "aria-hidden": "true" });
          section.classList.add("has-watermark");
          section.prepend(mark);
        }
        mark.textContent = w.content === "names" ? name : String(i + 1).padStart(2, "0");
        mark.dataset.align = w.align;
      });
      lagWatermarks();
    }

    function removeWatermarks() {
      for (const mark of $$(".bg-watermark")) {
        mark.parentElement.classList.remove("has-watermark");
        mark.remove();
      }
    }

    function lagWatermarks() {
      const lag = MOTION ? C.watermark.lag : 0;
      for (const mark of $$(".bg-watermark")) {
        const top = mark.parentElement.getBoundingClientRect().top;
        mark.style.transform = `translateY(${-(top - innerHeight / 2) * lag}px)`;
      }
    }

    /* 5. Tone */
    function applyTone() {
      const t = C.tone;
      const line = innerHeight * (t.trigger / 100);
      let zone = TONE_ZONES[0];
      for (const z of TONE_ZONES) {
        const el = z === "hero" ? $(".hero") : $(`#${z}`);
        if (el.getBoundingClientRect().top <= line) zone = z;
      }
      set("--tone-duration", `${t.duration}ms`);
      set("--tone-easing", ease(t.easing));
      set("--page-bg", t[`${zone}Bg`]);
      set("--page-ink", t[`${zone}Ink`]);
    }

    /* Switching */
    function apply() {
      const style = C.background.style;
      if (style !== active) {
        for (const s of STYLES) root.classList.toggle(`bg-style-${s}`, s === style);
        if (active === "watermark") removeWatermarks();
        root.style.removeProperty("--page-bg");
        root.style.removeProperty("--page-ink");
        const switched = active !== null;
        active = style;
        if (style === "grid") {
          applyGrid();
          if (switched) drawGrid();
        }
      } else if (style === "grid") {
        applyGrid();
      }
      if (style === "dots") {
        sizeCanvas();
        drawDots();
      }
      if (style === "paper") {
        applyPaper();
        set("--page-bg", C.paper.tone);
      }
      if (style === "watermark") applyWatermark();
      if (style === "tone") applyTone();
    }

    addEventListener("scroll", () => {
      queueLight();
      if (active === "watermark") lagWatermarks();
      if (active === "tone") applyTone();
    }, { passive: true });

    addEventListener("resize", () => {
      queueLight();
      if (active === "grid") placeRules();
      if (active === "dots") {
        sizeCanvas();
        drawDots();
      }
      if (active === "watermark") lagWatermarks();
    });

    // The headline's line height is only final once Geist has loaded.
    document.fonts.ready.then(() => {
      if (active === "grid") placeRules();
      queueLight();
    });

    return {
      apply,
      replay: () => active === "grid" && drawGrid(),
    };
  })();

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
      title: "Background",
      rows: [
        {
          path: "background.style",
          label: "Style",
          type: "select",
          options: {
            plain: "Plain",
            grid: "1 · Visible grid",
            dots: "2 · Halftone dots",
            paper: "3 · Paper wash",
            watermark: "4 · Outline watermark",
            tone: "5 · Tone shift",
            gradient: "Grain gradient (old)",
          },
        },
      ],
    },
    {
      title: "Visible grid",
      when: "grid",
      rows: [
        {
          path: "grid.columns",
          label: "Columns",
          type: "select",
          options: { 3: "3-column", 12: "12-column", both: "Both" },
        },
        { path: "grid.color", label: "Color", type: "color" },
        { path: "grid.opacity", label: "Opacity", min: 0, max: 1, step: 0.01, unit: "" },
        { path: "grid.weight", label: "Line weight", min: 0.5, max: 4, step: 0.5, unit: "px" },
        { path: "grid.dashed", label: "Dashed", type: "toggle" },
        { type: "heading", label: "Horizontal rules" },
        { path: "grid.rules", label: "Show rules", type: "toggle" },
        { path: "grid.matchHeadline", label: "Match headline line height", type: "toggle" },
        { path: "grid.ruleSpacing", label: "Spacing (if not matched)", min: 8, max: 400, step: 1, unit: "px" },
        { path: "grid.ruleOffset", label: "Offset", min: -200, max: 200, step: 1, unit: "px" },
        { type: "heading", label: "Draw-in" },
        { path: "grid.drawIn", label: "Draw in on load", type: "toggle" },
        { path: "grid.drawDuration", label: "Duration", min: 100, max: 4000, step: 10, unit: "ms" },
        { path: "grid.drawStagger", label: "Stagger", min: 0, max: 300, step: 5, unit: "ms" },
      ],
    },
    {
      title: "Halftone dots",
      when: "dots",
      rows: [
        { path: "dots.color", label: "Color", type: "color" },
        { path: "dots.opacity", label: "Opacity", min: 0, max: 1, step: 0.01, unit: "" },
        { path: "dots.spacing", label: "Spacing", min: 4, max: 48, step: 1, unit: "px" },
        { path: "dots.maxSize", label: "Max dot size", min: 0, max: 24, step: 0.5, unit: "px" },
        { path: "dots.minSize", label: "Min dot size", min: 0, max: 12, step: 0.5, unit: "px" },
        { type: "heading", label: "Falloff" },
        {
          path: "dots.origin",
          label: "Densest at",
          type: "select",
          options: {
            "bottom-right": "Bottom right",
            "bottom-left": "Bottom left",
            "top-right": "Top right",
            "top-left": "Top left",
            center: "Center",
          },
        },
        { path: "dots.reach", label: "Reach", min: 0.1, max: 2, step: 0.05, unit: "×" },
        { path: "dots.curve", label: "Curve", min: 0.2, max: 5, step: 0.1, unit: "" },
        { type: "heading", label: "Cursor" },
        { path: "dots.cursorRadius", label: "Radius", min: 20, max: 500, step: 5, unit: "px" },
        { path: "dots.cursorStrength", label: "Strength", min: 0, max: 2, step: 0.05, unit: "" },
      ],
    },
    {
      title: "Paper wash",
      when: "paper",
      rows: [
        { path: "paper.tone", label: "Paper color", type: "color" },
        { type: "heading", label: "Light" },
        { path: "paper.tint", label: "Color", type: "color" },
        { path: "paper.intensity", label: "Intensity", min: 0, max: 60, step: 1, unit: "%" },
        { path: "paper.size", label: "Size", min: 20, max: 200, step: 1, unit: "vw" },
        { path: "paper.core", label: "Solid core", min: 0, max: 90, step: 1, unit: "%" },
        { path: "paper.offsetX", label: "Offset from PRODUCT X", min: -800, max: 800, step: 5, unit: "px" },
        { path: "paper.offsetY", label: "Offset from PRODUCT Y", min: -600, max: 600, step: 5, unit: "px" },
        { type: "heading", label: "Scroll travel" },
        { path: "paper.travel", label: "Travel to the CTA", type: "toggle" },
        { path: "paper.endIntensity", label: "Intensity at the CTA", min: 0, max: 60, step: 1, unit: "%" },
        { path: "paper.endOffsetX", label: "Offset from CTA X", min: -800, max: 800, step: 5, unit: "px" },
        { path: "paper.endOffsetY", label: "Offset from CTA Y", min: -600, max: 600, step: 5, unit: "px" },
        { path: "paper.follow", label: "Follow speed", min: 0.02, max: 1, step: 0.01, unit: "" },
        { type: "heading", label: "Paper" },
        { path: "paper.mottle", label: "Mottle", min: 0, max: 0.5, step: 0.01, unit: "" },
        { path: "paper.mottleScale", label: "Mottle scale", min: 0.001, max: 0.02, step: 0.0005, unit: "" },
        { path: "paper.texture", label: "Fibers", min: 0, max: 0.3, step: 0.005, unit: "" },
        { path: "paper.dither", label: "Dither", min: 0, max: 0.5, step: 0.01, unit: "" },
        { type: "heading", label: "Drift" },
        { path: "paper.drift", label: "Drift", type: "toggle" },
        { path: "paper.speed", label: "Drift speed", min: 0.1, max: 3, step: 0.05, unit: "×" },
      ],
    },
    {
      title: "Outline watermark",
      when: "watermark",
      rows: [
        {
          path: "watermark.content",
          label: "Content",
          type: "select",
          options: { numbers: "Numbers (01–04)", names: "Section names" },
        },
        { path: "watermark.color", label: "Stroke color", type: "color" },
        { path: "watermark.opacity", label: "Opacity", min: 0, max: 1, step: 0.01, unit: "" },
        { path: "watermark.stroke", label: "Stroke width", min: 0.5, max: 6, step: 0.25, unit: "px" },
        { path: "watermark.size", label: "Size", min: 10, max: 80, step: 1, unit: "vw" },
        {
          path: "watermark.align",
          label: "Side",
          type: "select",
          options: { right: "Right", left: "Left" },
        },
        { path: "watermark.offset", label: "Edge offset", min: -40, max: 20, step: 0.5, unit: "vw" },
        { path: "watermark.top", label: "Vertical offset", min: -30, max: 30, step: 0.5, unit: "vw" },
        { path: "watermark.lag", label: "Scroll lag", min: 0, max: 0.6, step: 0.01, unit: "" },
      ],
    },
    {
      title: "Tone shift",
      when: "tone",
      rows: [
        ...TONE_ZONES.flatMap((z) => {
          const name = z[0].toUpperCase() + z.slice(1);
          return [
            { type: "heading", label: name },
            { path: `tone.${z}Bg`, label: "Background", type: "palette" },
            { path: `tone.${z}Ink`, label: "Text", type: "palette" },
          ];
        }),
        { type: "heading", label: "Transition" },
        { path: "tone.trigger", label: "Trigger line", min: 0, max: 100, step: 1, unit: "%" },
        { path: "tone.duration", label: "Duration", min: 0, max: 3000, step: 10, unit: "ms" },
        { path: "tone.easing", label: "Easing", type: "bezier" },
      ],
    },
    {
      title: "Grain gradient",
      when: "gradient",
      rows: [
        { path: "gradient.color", label: "Color", type: "color" },
        { path: "gradient.opacity", label: "Opacity", min: 0, max: 1, step: 0.01, unit: "" },
        { path: "gradient.blur", label: "Blur", min: 0, max: 3, step: 0.05, unit: "×" },
        { path: "gradient.size", label: "Size", min: 0.3, max: 2.5, step: 0.05, unit: "×" },
        { type: "heading", label: "Grain" },
        { path: "gradient.grain", label: "Grain", min: 0, max: 1, step: 0.01, unit: "" },
        { path: "gradient.grainMatch", label: "Match gradient color", type: "toggle" },
        { path: "gradient.grainColor", label: "Grain color", type: "color" },
        { type: "heading", label: "Motion" },
        { path: "gradient.speed", label: "Animation speed", min: 0.1, max: 3, step: 0.05, unit: "×" },
        { path: "gradient.animate", label: "Animate", type: "toggle" },
      ],
    },
    {
      title: "ASCII background",
      rows: [
        { path: "ascii.scale", label: "Size", min: 0.25, max: 2.5, step: 0.05, unit: "×" },
        { path: "ascii.opacity", label: "Opacity", min: 0, max: 100, step: 1, unit: "%" },
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
  let rerenderPanel = () => {};
  const LIVE = ["background", "grid", "dots", "paper", "watermark", "tone", "gradient"];
  const LIVE_PATHS = ["ascii.scale", "ascii.opacity"];

  function changed(path) {
    save();
    applyVars();
    onChanged();
    // Switching style swaps which background section the panel shows.
    if (path === "background.style") rerenderPanel();
    // Background values apply live, so there's nothing to replay for them.
    if (C.playback.autoReplay && path !== "playback.autoReplay" && !LIVE.includes(path.split(".")[0]) && !LIVE_PATHS.includes(path)) {
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

  // The --color-* variables declared in styles.css, read off the live page
  // so new palette entries show up without touching this file.
  function palette() {
    const style = getComputedStyle(root);
    const vars = [...style].filter((name) => name.startsWith("--color-"));
    return vars.map((name) => ({
      value: `var(${name})`,
      label: name
        .slice(8)
        .split("-")
        .map((w) => w[0].toUpperCase() + w.slice(1))
        .join(" "),
      hex: style.getPropertyValue(name).trim().toLowerCase(),
    }));
  }

  // A palette variable or, via "Custom…" or the picker, any hex.
  function paletteRow(row, refresh) {
    const colors = palette();
    const sel = make(
      "select",
      { class: "ac-select" },
      ...colors.map((c) => make("option", { value: c.value }, `${c.label} · ${c.hex}`)),
      make("option", { value: "custom" }, "Custom…")
    );
    const picker = make("input", { type: "color", class: "ac-color" });
    const sync = () => {
      const v = getPath(row.path);
      const match = colors.find((c) => c.value === v);
      sel.value = match ? v : "custom";
      picker.value = match ? match.hex : v;
    };
    const set = (v) => {
      setPath(row.path, v);
      sync();
      refresh();
      changed(row.path);
    };
    sel.addEventListener("change", () => set(sel.value === "custom" ? picker.value : sel.value));
    picker.addEventListener("input", () => set(picker.value));
    sync();
    return [make("span", { class: "ac-palette" }, sel, picker)];
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
    } else if (row.type === "color") {
      const input = make("input", { type: "color", value: getPath(row.path), class: "ac-color" });
      input.addEventListener("input", () => {
        setPath(row.path, input.value);
        refresh();
        changed(row.path);
      });
      controls = [input];
    } else if (row.type === "palette") {
      controls = paletteRow(row, refresh);
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
        ...FIELDS.filter((section) => !section.when || section.when === C.background.style).map((section) =>
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

    rerenderPanel = render;
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
    backgrounds.replay();
  }

  init();
})();
