/* ============ mobile navigation ============ */
(function () {
  var btn = document.getElementById('navBtn');
  var nav = document.getElementById('nav');
  if (!btn || !nav) return;

  function setOpen(open) {
    nav.classList.toggle('open', open);
    btn.setAttribute('aria-expanded', open ? 'true' : 'false');
    btn.textContent = open ? 'Close' : 'Menu';
  }

  btn.addEventListener('click', function () {
    setOpen(!nav.classList.contains('open'));
  });

  // close after choosing a section
  nav.querySelectorAll('a').forEach(function (link) {
    link.addEventListener('click', function () { setOpen(false); });
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && nav.classList.contains('open')) {
      setOpen(false);
      btn.focus();
    }
  });

  document.addEventListener('click', function (e) {
    if (!nav.classList.contains('open')) return;
    if (nav.contains(e.target) || btn.contains(e.target)) return;
    setOpen(false);
  });
})();

/* ============ scroll spy ============ */
(function () {
  var links = Array.prototype.slice.call(document.querySelectorAll('.nav a[href^="#"]'));
  if (!links.length || !('IntersectionObserver' in window)) return;

  var map = {};
  links.forEach(function (link) {
    var id = link.getAttribute('href').slice(1);
    var section = document.getElementById(id);
    if (section) map[id] = link;
  });

  var current = null;

  function activate(id) {
    if (id === current) return;
    current = id;
    links.forEach(function (l) { l.classList.remove('is-current'); });
    if (map[id]) {
      map[id].classList.add('is-current');
      map[id].setAttribute('aria-current', 'true');
    }
  }

  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) activate(entry.target.id);
    });
  }, { rootMargin: '-45% 0px -50% 0px', threshold: 0 });

  Object.keys(map).forEach(function (id) {
    observer.observe(document.getElementById(id));
  });
})();

/* ============ publication filter ============ */
(function () {
  var list = document.getElementById('pubList');
  var count = document.getElementById('pubCount');
  var empty = document.getElementById('pubEmpty');
  var chips = Array.prototype.slice.call(document.querySelectorAll('.chip'));
  if (!list || !chips.length) return;

  var items = Array.prototype.slice.call(list.querySelectorAll('.pub'));

  function apply(filter) {
    var shown = 0;

    items.forEach(function (item) {
      var match = filter === 'all' || item.getAttribute('data-kind') === filter;
      item.hidden = !match;
      if (match) shown += 1;
    });

    chips.forEach(function (chip) {
      chip.setAttribute('aria-pressed', chip.getAttribute('data-filter') === filter ? 'true' : 'false');
    });

    if (count) {
      count.textContent = shown + (shown === 1 ? ' entry' : ' entries');
    }

    if (empty) empty.hidden = shown !== 0;
  }

  chips.forEach(function (chip) {
    chip.addEventListener('click', function () {
      apply(chip.getAttribute('data-filter') || 'all');
    });
  });

  apply('all');
})();
