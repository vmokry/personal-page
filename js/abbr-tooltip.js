/* Tap-to-show tooltips for <abbr title="..."> on touch devices,
   which never display native title tooltips. Desktop is left alone. */
(function () {
    if (!window.matchMedia('(hover: none)').matches) return;

    var tip = document.createElement('div');
    tip.className = 'abbr-tip';
    tip.id = 'abbr-tip';
    tip.setAttribute('role', 'tooltip');
    // Attached outside <body>, because body is scaled on wide screens.
    document.documentElement.appendChild(tip);

    var current = null;
    var gap = 10;
    var edge = 8;

    function place() {
        if (!current) return;
        var r = current.getBoundingClientRect();
        var w = tip.offsetWidth;
        var h = tip.offsetHeight;
        var center = r.left + r.width / 2;

        var left = Math.max(edge, Math.min(center - w / 2, window.innerWidth - w - edge));
        var top = r.top - h - gap;
        var below = top < edge;
        if (below) top = r.bottom + gap;

        tip.style.left = left + 'px';
        tip.style.top = top + 'px';
        tip.style.setProperty('--arrow-x', Math.max(12, Math.min(center - left, w - 12)) + 'px');
        tip.classList.toggle('below', below);
    }

    function show(abbr) {
        if (current) current.removeAttribute('aria-describedby');
        current = abbr;
        tip.textContent = abbr.getAttribute('title');
        abbr.setAttribute('aria-describedby', 'abbr-tip');
        place();
        tip.classList.add('visible');
    }

    function hide() {
        if (!current) return;
        current.removeAttribute('aria-describedby');
        current = null;
        tip.classList.remove('visible');
    }

    document.addEventListener('click', function (e) {
        var abbr = e.target.closest('abbr[title]');
        if (!abbr) return;
        if (abbr === current) hide();
        else show(abbr);
    });

    // Any touch elsewhere closes it (click alone is unreliable on iOS for plain text).
    document.addEventListener('pointerdown', function (e) {
        if (current && !current.contains(e.target)) hide();
    });

    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') hide();
    });

    window.addEventListener('scroll', place, { passive: true });
    window.addEventListener('resize', place);
})();
