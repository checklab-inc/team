(function () {
  var toggle = document.getElementById('menu-toggle');
  var menu = document.getElementById('mobile-menu');
  if (!toggle || !menu) return;

  var overlay = menu.querySelector('[data-menu-overlay]');
  var panel = menu.querySelector('[data-menu-panel]');
  var mq = window.matchMedia('(min-width: 1024px)');

  function setOpen(open) {
    toggle.setAttribute('aria-expanded', String(open));
    menu.classList.toggle('invisible', !open);
    overlay.classList.toggle('opacity-0', !open);
    panel.classList.toggle('translate-x-full', !open);
    document.body.classList.toggle('overflow-hidden', open);
    if (open) {
      var first = panel.querySelector('a');
      if (first) first.focus();
    }
  }

  function isOpen() {
    return toggle.getAttribute('aria-expanded') === 'true';
  }

  toggle.addEventListener('click', function () { setOpen(!isOpen()); });
  panel.querySelector('[data-menu-close]').addEventListener('click', function () {
    setOpen(false);
    toggle.focus();
  });
  overlay.addEventListener('click', function () { setOpen(false); });
  panel.querySelectorAll('a').forEach(function (a) {
    a.addEventListener('click', function () { setOpen(false); });
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && isOpen()) {
      setOpen(false);
      toggle.focus();
    }
  });
  mq.addEventListener('change', function (e) { if (e.matches) setOpen(false); });
})();
