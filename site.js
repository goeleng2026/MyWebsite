/* =============================================
   GOEDGELESS ENGINEERING — SHARED SITE JS
   ============================================= */

(function () {
  // ── Preloader curtain (homepage, first visit per session only) ──
  var preloader = document.getElementById('preloader');
  if (preloader) {
    if (sessionStorage.getItem('preloaderShown')) {
      preloader.style.display = 'none';
      document.body.classList.add('loaded');
    } else {
      function dismissPreloader() {
        document.body.classList.add('loaded');
        sessionStorage.setItem('preloaderShown', '1');
      }
      window.addEventListener('load', function () { setTimeout(dismissPreloader, 800); });
      setTimeout(dismissPreloader, 2200);
    }
  } else {
    document.body.classList.add('loaded');
  }

  // ── Particle field ──
  const cv = document.getElementById('stars');
  if (cv) {
    const cx = cv.getContext('2d');
    let W, H, pts = [];
    function resize() { W = cv.width = innerWidth; H = cv.height = innerHeight; }
    resize();
    addEventListener('resize', resize);
    for (let i = 0; i < 80; i++) {
      pts.push({
        x: Math.random() * innerWidth,
        y: Math.random() * innerHeight,
        r: Math.random() * 1.5 + 0.3,
        s: Math.random() * 0.22 + 0.04,
        o: Math.random() * 0.45 + 0.12
      });
    }
    (function tick() {
      cx.clearRect(0, 0, W, H);
      pts.forEach(p => {
        p.y -= p.s;
        if (p.y < -4) { p.y = H + 4; p.x = Math.random() * W; }
        cx.beginPath();
        cx.arc(p.x, p.y, p.r, 0, 7);
        cx.fillStyle = 'rgba(79,170,255,' + p.o + ')';
        cx.fill();
      });
      requestAnimationFrame(tick);
    })();
  }

  // ── Scroll reveals ──
  const io = new IntersectionObserver((es) => {
    es.forEach((e, i) => {
      if (e.isIntersecting) {
        setTimeout(() => e.target.classList.add('in'), i * 80);
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.1 });
  document.querySelectorAll('.reveal').forEach(el => io.observe(el));

  // ── Animated counters ──
  const cio = new IntersectionObserver((es) => {
    es.forEach(e => {
      if (!e.isIntersecting) return;
      cio.unobserve(e.target);
      const to = +e.target.dataset.to, t0 = performance.now();
      (function step(t) {
        const k = Math.min((t - t0) / 1600, 1);
        e.target.textContent = Math.round(to * (1 - Math.pow(1 - k, 3)));
        if (k < 1) requestAnimationFrame(step);
      })(t0);
    });
  }, { threshold: 0.6 });
  document.querySelectorAll('.count').forEach(el => cio.observe(el));

  // ── Current year ──
  document.querySelectorAll('.yr').forEach(el => el.textContent = new Date().getFullYear());

  // ── Mobile nav panel (anchored expand-in-place, frosted-glass pill) ──
  const hamburger = document.querySelector('.nav-hamburger');
  const navPanel  = document.querySelector('.nav-mobile-panel');
  const siteNav   = document.querySelector('.site-nav');

  function isPanelOpen() { return hamburger.classList.contains('open'); }

  function openPanel() {
    hamburger.classList.add('open');
    navPanel.style.maxHeight = navPanel.scrollHeight + 'px';
  }
  function closePanel() {
    hamburger.classList.remove('open');
    navPanel.style.maxHeight = '0px';
  }

  if (hamburger && navPanel) {
    hamburger.addEventListener('click', function (e) {
      e.stopPropagation();
      if (isPanelOpen()) closePanel(); else openPanel();
    });

    navPanel.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', closePanel);
    });

    document.addEventListener('click', function (e) {
      if (isPanelOpen() && siteNav && !siteNav.contains(e.target)) closePanel();
    });
  }

  // ── Light/dark theme toggle ──
  document.querySelectorAll('.theme-toggle').forEach(function (toggle) {
    toggle.addEventListener('click', function () {
      const isLight = document.documentElement.getAttribute('data-theme') === 'light';
      if (isLight) {
        document.documentElement.removeAttribute('data-theme');
        localStorage.setItem('theme', 'dark');
      } else {
        document.documentElement.setAttribute('data-theme', 'light');
        localStorage.setItem('theme', 'light');
      }
    });
  });
})();
