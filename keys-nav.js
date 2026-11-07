/* Scroll navigation (styles in keys-nav.css):
   - The MK logo stays pinned in its hero cell while the page scrolls.
   - Once the top nav row scrolls away, a key bar docks at the bottom, like
     Midnight Commander's function keys: number keys jump to sections, and
     ":" or "/" opens a vim-style jump line.
   Home page keys: the hero nav's sections. Case studies: 0 Home plus one key
   per case-study heading (their sections get cs-<slug> ids to jump to). */
(() => {
  const root = document.documentElement;
  const page = document.querySelector(".page");
  const section = document.querySelector(".page .section");
  const heroLogo = document.querySelector(".hero-logo");
  const heroNav = document.querySelector(".hero-nav");
  if (!page || !section || !heroNav) return;

  const el = (tag, cls, html) => {
    const n = document.createElement(tag);
    if (cls) n.className = cls;
    if (html != null) n.innerHTML = html;
    return n;
  };
  // Layout position relative to .page (ignores the reveal transforms)
  const offset = (n) => {
    let x = 0, y = 0;
    while (n && n !== page) { x += n.offsetLeft; y += n.offsetTop; n = n.offsetParent; }
    return [x, y];
  };

  /* ---- Pinned logo: a fixed copy sitting exactly over the original ---- */
  let pin = null;
  if (heroLogo) {
    pin = heroLogo.cloneNode(true);
    pin.className = "pin-logo";
    for (let i = 0; i < 4; i++) pin.append(el("span", "pin-handle"));
    document.body.append(pin);
    root.classList.add("has-pin-logo");
  }

  /* ---- Keys ---- */
  const csHeadings = [...document.querySelectorAll(".page .section > .cs-heading")];
  const slugify = (t) => t.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "section";
  const items = csHeadings.length
    ? [{ href: "index.html", label: "Home", key: "0" }].concat(csHeadings.map((h, i) => {
        const sec = h.closest(".section");
        const label = h.tagName === "H1" ? "Overview" : h.textContent.trim();
        if (!sec.id) sec.id = "cs-" + slugify(label);
        return { href: "#" + sec.id, label, key: String(i + 1) };
      }))
    : [...heroNav.querySelectorAll("a")].map((a, i) => ({
        href: a.getAttribute("href"),
        label: a.textContent.trim(),
        key: String(i + 1),
      }));

  const goTo = (i) => {
    const it = items[i];
    if (!it) return;
    if (!it.href.startsWith("#")) { location.href = it.href; return; }
    const t = document.getElementById(it.href.slice(1));
    if (t) scrollTo({ top: t.getBoundingClientRect().top + scrollY, behavior: "smooth" });
  };

  const bar = el("nav", "keys-bar");
  bar.setAttribute("aria-label", "Sections");
  const links = items.map((it) => {
    const a = el("a", null, `<span class="kb-n">${it.key}</span><span class="kb-l">${it.label}</span>`);
    a.href = it.href;
    bar.append(a);
    return a;
  });
  const jump = el("a", "kb-jump", `<span class="kb-n">:</span><span class="kb-l">Jump</span>`);
  jump.href = "#";
  jump.addEventListener("click", (e) => { e.preventDefault(); openPalette(); });
  bar.append(jump);

  /* ---- Jump line (vim ':' and '/') ---- */
  const palette = el("div", "jump",
    `<ul class="jump-list"></ul>` +
    `<label class="jump-line"><span class="jump-colon">:</span><input class="jump-input" type="text" spellcheck="false" autocomplete="off" aria-label="Jump to section" /></label>`);
  const pInput = palette.querySelector(".jump-input");
  const pList = palette.querySelector(".jump-list");
  const mail = document.querySelector('a[href^="mailto:"]');
  const email = mail ? mail.getAttribute("href").replace("mailto:", "") : "m.elkorashy@gmail.com";
  const toast = el("div", "jump-toast");
  let toastT = 0;
  const flash = (msg) => {
    toast.textContent = msg;
    toast.classList.add("show");
    clearTimeout(toastT);
    toastT = setTimeout(() => toast.classList.remove("show"), 1800);
  };
  const commands = items.map((it, i) => ({ name: it.label.toLowerCase(), desc: `go to ${it.label}`, run: () => goTo(i) }))
    .concat([
      { name: "top", desc: "back to top", run: () => scrollTo({ top: 0, behavior: "smooth" }) },
      { name: "mail", desc: `copy ${email}`, run: () => {
        navigator.clipboard?.writeText(email).catch(() => {});
        flash(`copied ${email}`);
      } },
    ]);
  let pSel = 0;
  const matches = () => {
    const q = pInput.value.trim().toLowerCase().replace(/^[:/]/, "");
    return commands.filter((c) => !q || c.name.includes(q));
  };
  const escapeHtml = (t) => t.replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);
  const renderPalette = () => {
    const m = matches();
    pSel = Math.min(pSel, Math.max(0, m.length - 1));
    pList.innerHTML = m.length
      ? m.map((c, i) => `<li class="${i === pSel ? "sel" : ""}" data-n="${escapeHtml(c.name)}"><span>${escapeHtml(c.name)}</span><span class="jump-desc">${escapeHtml(c.desc)}</span></li>`).join("")
      : `<li class="jump-none">E492: Not a section: ${escapeHtml(pInput.value)}</li>`;
  };
  function openPalette() {
    palette.classList.add("open");
    pInput.value = "";
    pSel = 0;
    renderPalette();
    pInput.focus();
  }
  const closePalette = () => { palette.classList.remove("open"); pInput.blur(); };
  const runSel = () => {
    const c = matches()[pSel];
    closePalette();
    if (c) c.run();
  };
  pInput.addEventListener("input", () => { pSel = 0; renderPalette(); });
  pInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") { e.preventDefault(); runSel(); }
    else if (e.key === "Escape") closePalette();
    else if (e.key === "ArrowDown" || (e.key === "Tab" && !e.shiftKey)) { e.preventDefault(); pSel = Math.min(pSel + 1, matches().length - 1); renderPalette(); }
    else if (e.key === "ArrowUp" || (e.key === "Tab" && e.shiftKey)) { e.preventDefault(); pSel = Math.max(pSel - 1, 0); renderPalette(); }
  });
  pInput.addEventListener("blur", () => setTimeout(closePalette, 120));
  pList.addEventListener("mousedown", (e) => {
    const li = e.target.closest("li[data-n]");
    if (!li) return;
    e.preventDefault();
    pSel = matches().findIndex((c) => c.name === li.dataset.n);
    runSel();
  });

  document.body.append(bar, palette, toast);

  /* ---- Keyboard ---- */
  addEventListener("keydown", (e) => {
    if (e.metaKey || e.ctrlKey || e.altKey) return;
    if (e.target.closest && e.target.closest("input, textarea, select, [contenteditable]")) return;
    if (e.key === ":" || e.key === "/") { e.preventDefault(); openPalette(); return; }
    const hit = items.findIndex((it) => it.key === e.key);
    if (hit >= 0) goTo(hit);
  });

  /* ---- Measure the grid so the fixed pieces line up with it ---- */
  const measure = () => {
    const r = section.getBoundingClientRect();
    root.style.setProperty("--nav-cell", r.width / 12 + "px");
    root.style.setProperty("--nav-side", Math.max(0, r.left) + "px");
    if (pin) {
      const [ox, oy] = offset(heroLogo);
      const pr = page.getBoundingClientRect();
      const size = heroLogo.offsetWidth; // one cell: always a square
      Object.assign(pin.style, { left: pr.left + ox + "px", top: pr.top + scrollY + oy + "px", width: size + "px", height: size + "px" });
    }
    update();
  };

  /* ---- Dock once the top nav row has scrolled out of view ---- */
  new IntersectionObserver(([e]) => {
    root.classList.toggle("nav-docked", !e.isIntersecting && e.boundingClientRect.top < 0);
  }).observe(heroNav.querySelector("a") || heroNav);

  /* ---- Current section ---- */
  const targets = items.map((it) => (it.href.startsWith("#") ? document.getElementById(it.href.slice(1)) : null));
  function update() {
    const mid = innerHeight * 0.45;
    let idx = -1;
    targets.forEach((t, i) => { if (t && t.getBoundingClientRect().top <= mid) idx = i; });
    links.forEach((a, i) => (i === idx ? a.setAttribute("aria-current", "true") : a.removeAttribute("aria-current")));
  }
  addEventListener("scroll", update, { passive: true });
  new ResizeObserver(measure).observe(page);
  document.fonts && document.fonts.ready.then(measure);
  addEventListener("load", measure);
  measure();
})();
