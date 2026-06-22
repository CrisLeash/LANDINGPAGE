/* SACRIX — interaktivni hero canvas (Faza 2)
 *
 * Lagani vanilla particle sustav: čestice u brand-cyan boji (#92F6F0, ista
 * kao kuglica u logu) lebde po teal pozadini i reagiraju na kursor/dodir.
 * Bez biblioteka (bez Three.js/GSAP). Canvas je fiksni pozadinski sloj
 * (z-index:-1, pointer-events:none) pa NE dira logo ni njegovu animaciju.
 *
 * A11y/perf: prefers-reduced-motion → statičan prikaz bez petlje;
 * rAF se pauzira kad tab nije vidljiv; DPR skaliranje za retina ekrane.
 */
(function () {
  const canvas = document.getElementById('hero-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const CYAN = '#92F6F0';
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  let width = 0;
  let height = 0;
  let dpr = 1;
  let particles = [];
  let rafId = null;

  // Pointer (kursor ili dodir). active=false → nema odbijanja.
  const pointer = { x: 0, y: 0, active: false };
  const REPEL_RADIUS = 130;
  const LINK_DIST = 120;

  function particleCount() {
    // Skaliraj s površinom, ali drži skromno (čitljivost + perf, i na mobitelu).
    const target = Math.round((width * height) / 22000);
    return Math.max(24, Math.min(70, target));
  }

  function makeParticle() {
    return {
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.35,
      vy: (Math.random() - 0.5) * 0.35,
      r: 1 + Math.random() * 2,
    };
  }

  function resize() {
    dpr = Math.min(window.devicePixelRatio || 1, 2); // cap DPR radi performansi
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = Math.floor(width * dpr);
    canvas.height = Math.floor(height * dpr);
    canvas.style.width = width + 'px';
    canvas.style.height = height + 'px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    particles = [];
    const n = particleCount();
    for (let i = 0; i < n; i++) particles.push(makeParticle());
  }

  function step() {
    for (const p of particles) {
      // Odbijanje od kursora.
      if (pointer.active) {
        const dx = p.x - pointer.x;
        const dy = p.y - pointer.y;
        const dist = Math.hypot(dx, dy);
        if (dist > 0 && dist < REPEL_RADIUS) {
          const force = (REPEL_RADIUS - dist) / REPEL_RADIUS;
          p.vx += (dx / dist) * force * 0.6;
          p.vy += (dy / dist) * force * 0.6;
        }
      }

      p.x += p.vx;
      p.y += p.vy;

      // Blago trenje da se brzine smire nakon "guranja".
      p.vx *= 0.96;
      p.vy *= 0.96;

      // Lagani drift da nikad ne stanu skroz.
      p.vx += (Math.random() - 0.5) * 0.02;
      p.vy += (Math.random() - 0.5) * 0.02;

      // Omotaj rubove.
      if (p.x < -10) p.x = width + 10;
      else if (p.x > width + 10) p.x = -10;
      if (p.y < -10) p.y = height + 10;
      else if (p.y > height + 10) p.y = -10;
    }
  }

  function draw() {
    ctx.clearRect(0, 0, width, height);

    // Suptilne veze između bliskih čestica ("constellation").
    ctx.strokeStyle = CYAN;
    ctx.lineWidth = 1;
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const a = particles[i];
        const b = particles[j];
        const d = Math.hypot(a.x - b.x, a.y - b.y);
        if (d < LINK_DIST) {
          ctx.globalAlpha = (1 - d / LINK_DIST) * 0.12;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
        }
      }
    }

    // Čestice.
    ctx.globalAlpha = 0.5;
    ctx.fillStyle = CYAN;
    for (const p of particles) {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;
  }

  function loop() {
    step();
    draw();
    rafId = requestAnimationFrame(loop);
  }

  function start() {
    if (rafId == null) rafId = requestAnimationFrame(loop);
  }

  function stop() {
    if (rafId != null) {
      cancelAnimationFrame(rafId);
      rafId = null;
    }
  }

  // ── Eventi ──
  window.addEventListener('resize', () => {
    resize();
    if (reduceMotion) draw(); // statičan re-render na novu veličinu
  });

  if (!reduceMotion) {
    window.addEventListener('mousemove', (e) => {
      pointer.x = e.clientX;
      pointer.y = e.clientY;
      pointer.active = true;
    });
    window.addEventListener('mouseout', () => { pointer.active = false; });

    window.addEventListener('touchmove', (e) => {
      if (e.touches.length) {
        pointer.x = e.touches[0].clientX;
        pointer.y = e.touches[0].clientY;
        pointer.active = true;
      }
    }, { passive: true });
    window.addEventListener('touchend', () => { pointer.active = false; });

    // Pauziraj kad tab nije vidljiv (perf/baterija).
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) stop();
      else start();
    });
  }

  // ── Init ──
  resize();
  if (reduceMotion) {
    draw(); // jedan statičan kadar, bez animacije
  } else {
    start();
  }
})();
