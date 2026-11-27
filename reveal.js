/* Scroll reveal for the home page: each block rises one baseline (8px) the first time it enters the screen.
   Section based: blocks play strictly in page order, and a section starts only after the one before it has
   finished (second row of work, Experience, About, then the footer), even when a later block reaches the screen first. */
(function () {
  if (!('IntersectionObserver' in window) || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  var sections = [
    ['.c3 .cover', '.c4 .cover', '.c3 .card-meta', '.c4 .card-meta'],
    ['.exp-title', '.xp li'],
    ['.about-title', '.about-text'],
    ['.ftitle', '.fcta', '.links']
  ];
  var STEP = 70;   // stagger between blocks inside a section
  var DONE = 70;   // next section follows right away, so nothing sits blank while you scroll

  var seq = [];
  sections.forEach(function (sels, s) {
    sels.forEach(function (sel) {
      document.querySelectorAll(sel).forEach(function (el) { el.classList.add('rv'); seq.push({ el: el, sec: s, ready: false }); });
    });
  });
  document.documentElement.classList.add('reveal-on');

  var next = 0, lastStart = -1e9, lastSec = -1;
  function pump() {
    var now = performance.now();
    while (next < seq.length && seq[next].ready) {
      var it = seq[next++];
      if (it.el.getBoundingClientRect().bottom < 0) { it.el.classList.add('now'); continue; } // already scrolled past: just show it
      var start = Math.max(now, lastStart + (it.sec === lastSec ? STEP : DONE));
      it.el.style.setProperty('--d', Math.round(start - now) + 'ms');
      it.el.classList.add('in');
      lastStart = start; lastSec = it.sec;
    }
  }

  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (!e.isIntersecting) return;
      io.unobserve(e.target);
      // this block and everything before it may play now, in order
      for (var i = 0; i < seq.length; i++) { seq[i].ready = true; if (seq[i].el === e.target) break; }
    });
    pump();
  }, { rootMargin: '0px 0px 0px 0px' });
  seq.forEach(function (it) { io.observe(it.el); });
})();
