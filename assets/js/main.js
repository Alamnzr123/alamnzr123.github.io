/* Rahmad Alamsyah Nazaruddin: site interactions */
(() => {
  const root = document.documentElement;
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];

  /* ---------- year ---------- */
  const y = $('#year'); if (y) y.textContent = new Date().getFullYear();

  /* ---------- theme: follows the system until the visitor picks one ---------- */
  const themeBtn = $('#themeToggle');
  const sysLight = window.matchMedia('(prefers-color-scheme: light)');
  const stored = () => { try { return localStorage.getItem('theme'); } catch (e) { return null; } };
  const isLight = () => {
    const t = root.getAttribute('data-theme');
    return t ? t === 'light' : sysLight.matches;
  };
  const syncTheme = () => {
    const light = isLight();
    root.classList.toggle('is-light', light);
    if (themeBtn) themeBtn.setAttribute('aria-label', light ? 'Switch to dark theme' : 'Switch to light theme');
  };
  syncTheme();
  if (themeBtn) {
    themeBtn.addEventListener('click', () => {
      const next = isLight() ? 'dark' : 'light';
      root.setAttribute('data-theme', next);
      try { localStorage.setItem('theme', next); } catch (e) { /* theme still applies for this visit */ }
      syncTheme();
    });
  }
  sysLight.addEventListener('change', () => { if (!stored()) syncTheme(); });

  /* ---------- nav ---------- */
  const nav = $('#nav');
  const toggle = $('#navToggle');
  const links = $('#navLinks');
  const onScroll = () => nav.classList.toggle('is-scrolled', window.scrollY > 20);
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  const setMenu = (open, returnFocus) => {
    links.classList.toggle('is-open', open);
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    if (open) { const first = $('a', links); if (first) first.focus(); }
    else if (returnFocus) toggle.focus();
  };
  toggle.addEventListener('click', () => setMenu(!links.classList.contains('is-open'), false));
  $$('a', links).forEach((a) => a.addEventListener('click', () => setMenu(false, false)));
  document.addEventListener('keydown', (ev) => {
    if (ev.key === 'Escape' && links.classList.contains('is-open')) setMenu(false, true);
  });

  const sections = ['work', 'experience', 'projects', 'contact'].map((id) => document.getElementById(id));
  const navObs = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) {
        $$('a', links).forEach((a) => a.classList.toggle('is-active', a.getAttribute('href') === `#${e.target.id}`));
      }
    });
  }, { rootMargin: '-45% 0px -50% 0px' });
  sections.forEach((s) => s && navObs.observe(s));

  /* ---------- reveal on scroll (one short fade per element) ---------- */
  const groups = new Map();
  $$('.reveal').forEach((el) => {
    const parent = el.parentElement;
    const n = groups.get(parent) || 0;
    el.style.setProperty('--d', `${Math.min(n, 5) * 0.06}s`);
    groups.set(parent, n + 1);
  });
  const revObs = new IntersectionObserver((entries) => {
    entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('in'); revObs.unobserve(e.target); } });
  }, { threshold: 0.12 });
  $$('.reveal').forEach((el) => revObs.observe(el));

  /* ---------- pipeline: drawn once when it scrolls into view ---------- */
  const pipe = $('#pipeline');
  if (pipe) {
    $$('.step', pipe).forEach((s, i) => s.style.setProperty('--sd', `${i < 5 ? i * 0.18 : 2.6 + (i - 5) * 0.18}s`));
    const pipeObs = new IntersectionObserver((entries) => {
      if (entries.some((e) => e.isIntersecting)) { pipe.classList.add('is-on'); pipeObs.disconnect(); }
    }, { threshold: 0.35 });
    pipeObs.observe(pipe);
  }

  /* ---------- timeline progress follows the scroll position ---------- */
  const tl = $('#timeline');
  if (tl) {
    const fill = $('.timeline__fill', tl);
    const items = $$('.tl', tl);
    const update = () => {
      const r = tl.getBoundingClientRect();
      const mid = window.innerHeight * 0.6;
      const p = Math.max(0, Math.min(1, (mid - r.top) / r.height));
      fill.style.setProperty('--p', p.toFixed(3));
      items.forEach((it) => it.classList.toggle('is-passed', it.getBoundingClientRect().top + 30 < mid));
    };
    update();
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
  }

  /* ---------- copy email ---------- */
  const copyBtn = $('#copyEmail');
  const status = $('#copyStatus');
  if (copyBtn) {
    const email = copyBtn.dataset.email;
    copyBtn.addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText(email);
        if (status) status.textContent = 'Email address copied to your clipboard.';
      } catch (err) {
        if (status) status.textContent = `Could not copy automatically. Opening your email app for ${email}.`;
        window.location.href = `mailto:${email}`;
      }
      setTimeout(() => { if (status) status.textContent = ''; }, 4000);
    });
  }

  if (reduce && pipe) pipe.classList.add('is-on');
})();
