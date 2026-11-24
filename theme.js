/* Theme toggle: remembers the choice, follows the device until one is made,
   and swaps the page with a circle that grows out of the button. */
(function () {
  var root = document.documentElement;
  var META = { light: '#F3F4F6', dark: '#141312' };
  function current() { return root.dataset.theme === 'dark' ? 'dark' : 'light'; }
  function apply(t) {
    root.dataset.theme = t;
    var m = document.querySelector('meta[name="theme-color"]'); if (m) m.setAttribute('content', META[t]);
    document.querySelectorAll('.theme-toggle').forEach(function (b) {
      b.setAttribute('aria-label', t === 'dark' ? 'Switch to light mode' : 'Switch to dark mode');
      b.setAttribute('aria-pressed', String(t === 'dark'));
    });
  }
  apply(current());
  document.querySelectorAll('.theme-toggle').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var next = current() === 'dark' ? 'light' : 'dark';
      try { localStorage.setItem('theme', next); } catch (e) {}
      var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (!document.startViewTransition || reduce) { apply(next); return; }
      var r = btn.getBoundingClientRect(), x = r.left + r.width / 2, y = r.top + r.height / 2;
      var end = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y));
      var vt = document.startViewTransition(function () { apply(next); });
      /* safety net: if the transition can't run (busy tab, unsupported setup), switch anyway */
      setTimeout(function () { if (current() !== next) apply(next); }, 500);
      vt.finished.catch(function () { if (current() !== next) apply(next); });
      vt.ready.then(function () {
        root.animate({ clipPath: ['circle(0px at ' + x + 'px ' + y + 'px)', 'circle(' + end + 'px at ' + x + 'px ' + y + 'px)'] },
          { duration: 700, easing: 'cubic-bezier(0.2, 0.7, 0.2, 1)', pseudoElement: '::view-transition-new(root)' });
      });
    });
  });
  /* follow the device setting until the visitor picks one */
  try {
    var mq = window.matchMedia('(prefers-color-scheme: dark)');
    mq.addEventListener('change', function (e) { if (!localStorage.getItem('theme')) apply(e.matches ? 'dark' : 'light'); });
  } catch (e) {}
})();
