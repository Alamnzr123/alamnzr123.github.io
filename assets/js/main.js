/* Rahmad Alamsyah Nazaruddin — site interactions */
(() => {
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];

  /* ---------- year ---------- */
  const y = $('#year'); if (y) y.textContent = new Date().getFullYear();

  /* ---------- split name into letters ---------- */
  let delay = 0;
  $$('.split').forEach((el) => {
    const text = el.textContent;
    el.textContent = '';
    text.split(' ').forEach((word, wi, arr) => {
      const w = document.createElement('span');
      w.className = 'w';
      w.setAttribute('aria-hidden', 'true');
      [...word].forEach((c) => {
        const s = document.createElement('span');
        s.className = 'ch';
        s.textContent = c;
        s.style.animationDelay = `${0.15 + delay * 0.035}s`;
        w.appendChild(s);
        delay++;
      });
      el.appendChild(w);
      if (wi < arr.length - 1) el.appendChild(document.createTextNode(' '));
    });
  });

  /* ---------- typing roles ---------- */
  const typed = $('#typed');
  const roles = [
    'Odoo Developer — Odoo 19 Enterprise',
    'Full-Stack Developer — React · Next.js · Node.js',
    'Business processes → working software',
  ];
  if (typed && !reduce) {
    let r = 0, i = roles[0].length, del = true;
    const tick = () => {
      const word = roles[r];
      if (del) {
        i--;
        typed.textContent = word.slice(0, i);
        if (i === 0) { del = false; r = (r + 1) % roles.length; }
        setTimeout(tick, 28);
      } else {
        i++;
        typed.textContent = roles[r].slice(0, i);
        if (i === roles[r].length) { del = true; setTimeout(tick, 2200); return; }
        setTimeout(tick, 55);
      }
    };
    setTimeout(tick, 2600);
  }

  /* ---------- nav ---------- */
  const nav = $('#nav');
  const toggle = $('#navToggle');
  const links = $('#navLinks');
  const onScroll = () => nav.classList.toggle('is-scrolled', window.scrollY > 20);
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });
  toggle.addEventListener('click', () => {
    const open = links.classList.toggle('is-open');
    toggle.setAttribute('aria-expanded', String(open));
  });
  $$('a', links).forEach((a) => a.addEventListener('click', () => {
    links.classList.remove('is-open');
    toggle.setAttribute('aria-expanded', 'false');
  }));
  const sections = ['work', 'experience', 'projects', 'contact'].map((id) => document.getElementById(id));
  const navObs = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) {
        $$('a', links).forEach((a) => a.classList.toggle('is-active', a.getAttribute('href') === `#${e.target.id}`));
      }
    });
  }, { rootMargin: '-45% 0px -50% 0px' });
  sections.forEach((s) => s && navObs.observe(s));

  /* ---------- reveal on scroll ---------- */
  const groups = new Map();
  $$('.reveal').forEach((el) => {
    const parent = el.parentElement;
    const n = groups.get(parent) || 0;
    el.style.setProperty('--d', `${Math.min(n, 6) * 0.08}s`);
    groups.set(parent, n + 1);
  });
  const revObs = new IntersectionObserver((entries) => {
    entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('in'); revObs.unobserve(e.target); } });
  }, { threshold: 0.12 });
  $$('.reveal').forEach((el) => revObs.observe(el));

  /* ---------- count up ---------- */
  const countObs = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (!e.isIntersecting) return;
      const el = e.target; const to = +el.dataset.to; const dur = reduce ? 0 : 1600; const t0 = performance.now();
      const step = (t) => {
        const p = dur ? Math.min((t - t0) / dur, 1) : 1;
        el.textContent = Math.round(to * (1 - Math.pow(1 - p, 3)));
        if (p < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
      countObs.unobserve(el);
    });
  }, { threshold: 0.6 });
  $$('.count').forEach((el) => countObs.observe(el));

  /* ---------- pipeline ---------- */
  const pipe = $('#pipeline');
  if (pipe) {
    const steps = $$('.step', pipe);
    steps.forEach((s, i) => s.style.setProperty('--sd', `${i < 5 ? i * 0.18 : 2.6 + (i - 5) * 0.18}s`));
    const pipeObs = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (!e.isIntersecting) return;
        pipe.classList.add('is-on');
        pipeObs.disconnect();
        if (reduce) return;
        // then a highlight that walks the whole flow, forever
        let k = 0;
        setTimeout(() => setInterval(() => {
          steps.forEach((s) => s.classList.remove('is-pulse'));
          steps[k % steps.length].classList.add('is-pulse');
          k++;
        }, 900), 4200);
      });
    }, { threshold: 0.35 });
    pipeObs.observe(pipe);
  }

  /* ---------- timeline progress ---------- */
  const tl = $('#timeline');
  if (tl) {
    const fill = $('.timeline__fill', tl);
    const items = $$('.tl', tl);
    const update = () => {
      const r = tl.getBoundingClientRect();
      const mid = window.innerHeight * 0.6;
      const p = Math.max(0, Math.min(1, (mid - r.top) / r.height));
      fill.style.setProperty('--p', p.toFixed(3));
      items.forEach((it) => {
        const dot = it.getBoundingClientRect().top + 30;
        it.classList.toggle('is-passed', dot < mid);
      });
    };
    update();
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
  }

  /* ---------- spotlight cards ---------- */
  $$('.spot').forEach((card) => {
    card.addEventListener('pointermove', (ev) => {
      const r = card.getBoundingClientRect();
      card.style.setProperty('--mx', `${ev.clientX - r.left}px`);
      card.style.setProperty('--my', `${ev.clientY - r.top}px`);
    });
  });

  /* ---------- magnetic buttons ---------- */
  if (!reduce && window.matchMedia('(pointer: fine)').matches) {
    $$('.magnetic').forEach((b) => {
      b.addEventListener('pointermove', (ev) => {
        const r = b.getBoundingClientRect();
        const x = (ev.clientX - r.left - r.width / 2) * 0.18;
        const yy = (ev.clientY - r.top - r.height / 2) * 0.3;
        b.style.transform = `translate(${x}px, ${yy}px)`;
      });
      b.addEventListener('pointerleave', () => { b.style.transform = ''; });
    });
  }

  /* ---------- copy email ---------- */
  const copyBtn = $('#copyEmail');
  if (copyBtn) {
    const label = $('#copyLabel');
    copyBtn.addEventListener('click', async () => {
      const email = copyBtn.dataset.email;
      try {
        await navigator.clipboard.writeText(email);
        label.textContent = 'Copied to clipboard';
      } catch (err) {
        window.location.href = `mailto:${email}`;
      }
      setTimeout(() => { label.textContent = email; }, 2200);
    });
  }

  /* ---------- hero canvas: data flowing through a process grid ---------- */
  const cv = $('#flowCanvas');
  if (cv && !reduce) {
    const ctx = cv.getContext('2d');
    const GAP = 44;
    let w, h, cols, rows, pulses = [], dpr;
    const colors = ['63,208,201', '156,107,143', '234,223,231'];
    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = cv.clientWidth; h = cv.clientHeight;
      cv.width = w * dpr; cv.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      cols = Math.ceil(w / GAP) + 1; rows = Math.ceil(h / GAP) + 1;
    };
    const spawn = () => {
      const horizontal = Math.random() < 0.6;
      return {
        x: Math.floor(Math.random() * cols) * GAP,
        y: Math.floor(Math.random() * rows) * GAP,
        dx: horizontal ? (Math.random() < 0.5 ? 1 : -1) : 0,
        dy: horizontal ? 0 : (Math.random() < 0.5 ? 1 : -1),
        speed: 0.6 + Math.random() * 0.9,
        trail: [], life: 260 + Math.random() * 260,
        c: colors[Math.floor(Math.random() * colors.length)],
      };
    };
    const drawGrid = () => {
      ctx.fillStyle = 'rgba(234,223,231,0.07)';
      for (let i = 0; i < cols; i++) for (let j = 0; j < rows; j++) ctx.fillRect(i * GAP - 1, j * GAP - 1, 2, 2);
    };
    let visible = true;
    new IntersectionObserver((e) => { visible = e[0].isIntersecting; }).observe(cv);
    const frame = () => {
      requestAnimationFrame(frame);
      if (!visible) return;
      ctx.clearRect(0, 0, w, h);
      drawGrid();
      while (pulses.length < Math.max(8, Math.floor(w / 110))) pulses.push(spawn());
      pulses.forEach((p) => {
        p.x += p.dx * p.speed; p.y += p.dy * p.speed; p.life -= 1;
        p.trail.push([p.x, p.y]); if (p.trail.length > 46) p.trail.shift();
        // at grid intersections, sometimes turn (like a workflow branching)
        if (Math.abs(p.x % GAP) < p.speed && Math.abs(p.y % GAP) < p.speed && Math.random() < 0.22) {
          if (p.dx) { p.dy = Math.random() < 0.5 ? 1 : -1; p.dx = 0; } else { p.dx = Math.random() < 0.5 ? 1 : -1; p.dy = 0; }
          p.x = Math.round(p.x / GAP) * GAP; p.y = Math.round(p.y / GAP) * GAP;
        }
        const fade = Math.min(1, p.life / 60);
        for (let k = 1; k < p.trail.length; k++) {
          const a = (k / p.trail.length) * 0.55 * fade;
          ctx.strokeStyle = `rgba(${p.c},${a})`;
          ctx.lineWidth = 1.6;
          ctx.beginPath(); ctx.moveTo(p.trail[k - 1][0], p.trail[k - 1][1]); ctx.lineTo(p.trail[k][0], p.trail[k][1]); ctx.stroke();
        }
        ctx.fillStyle = `rgba(${p.c},${0.9 * fade})`;
        ctx.beginPath(); ctx.arc(p.x, p.y, 2.2, 0, Math.PI * 2); ctx.fill();
      });
      pulses = pulses.filter((p) => p.life > 0 && p.x > -GAP && p.x < w + GAP && p.y > -GAP && p.y < h + GAP);
    };
    resize();
    window.addEventListener('resize', resize);
    requestAnimationFrame(frame);
  }
})();
