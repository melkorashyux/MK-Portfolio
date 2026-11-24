/* Scroll reveal for the home page: each block rises one baseline (8px) the first time it enters the screen. */
(function () {
  if (!('IntersectionObserver' in window) || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  var groups = [
    ['.exp-title', 0], ['.about-title', 0], ['.about-text', 90],
    ['.ftitle', 0], ['.fcta', 90], ['.links', 180]
  ];
  var els = [];
  groups.forEach(function (g) { document.querySelectorAll(g[0]).forEach(function (el) { el.style.setProperty('--d', g[1] + 'ms'); els.push(el); }); });
  document.querySelectorAll('.xp li').forEach(function (li, i) { li.style.setProperty('--d', (90 + i * 60) + 'ms'); els.push(li); });
  els.forEach(function (el) { el.classList.add('rv'); });
  document.documentElement.classList.add('reveal-on');
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
  }, { rootMargin: '0px 0px -40px 0px' });
  els.forEach(function (el) { io.observe(el); });
})();
