(function () {
  var root = document.documentElement;
  var STORAGE_KEY = 'checklab-lang';

  function applyLang(lang) {
    root.setAttribute('data-lang', lang);
    root.setAttribute('lang', lang === 'en' ? 'en' : 'ja');
    document.querySelectorAll('[data-lang-btn]').forEach(function (btn) {
      btn.textContent = lang === 'ja' ? 'EN' : '日本語';
    });
  }

  function setLang(lang) {
    try { localStorage.setItem(STORAGE_KEY, lang); } catch (e) {}
    applyLang(lang);
  }

  var stored = null;
  try { stored = localStorage.getItem(STORAGE_KEY); } catch (e) {}
  applyLang(stored === 'en' ? 'en' : 'ja');

  document.addEventListener('DOMContentLoaded', function () {
    document.querySelectorAll('[data-lang-btn]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        setLang(root.getAttribute('data-lang') === 'en' ? 'ja' : 'en');
      });
    });
  });
})();
