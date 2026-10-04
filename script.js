(function () {
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* Scroll reveal: children of [data-reveal] fade in one after another */
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('visible'); io.unobserve(e.target); } });
  }, { threshold: 0.12 });
  document.querySelectorAll('[data-reveal]').forEach((group) => {
    const dir = group.dataset.reveal;
    const items = group.matches('.contact-form, .contact-info, .section-head') ? [group] : [...group.children];
    items.forEach((el, i) => {
      el.classList.add('reveal', dir);
      el.style.transitionDelay = i * 0.15 + 's';
      io.observe(el);
    });
  });

  /* Counters */
  const cio = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (!e.isIntersecting) return;
      const el = e.target, end = parseInt(el.textContent, 10), t0 = performance.now();
      cio.unobserve(el);
      if (reduce) return;
      (function tick(now) {
        const p = Math.min((now - t0) / 1800, 1);
        el.textContent = Math.round(end * (1 - Math.pow(1 - p, 3)));
        if (p < 1) requestAnimationFrame(tick);
      })(t0);
    });
  }, { threshold: 0.6 });
  document.querySelectorAll('.stat strong').forEach((c) => cio.observe(c));

  /* Progress bar, hero parallax, back-to-top */
  const bar = Object.assign(document.createElement('div'), { id: 'progress' });
  const top = Object.assign(document.createElement('button'), { id: 'toTop', innerHTML: '&uarr;' });
  top.setAttribute('aria-label', 'Back to top');
  document.body.append(bar, top);
  top.onclick = () => scrollTo({ top: 0, behavior: 'smooth' });
  const hero = document.querySelector('.hero');
  let ticking = false;
  function onScroll() {
    const y = scrollY, max = document.documentElement.scrollHeight - innerHeight;
    bar.style.width = (max > 0 ? (y / max) * 100 : 0) + '%';
    top.classList.toggle('show', y > 600);
    if (!reduce && innerWidth > 992 && y < 900) hero.style.backgroundPosition = 'center ' + y * 0.3 + 'px';
    ticking = false;
  }
  addEventListener('scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(onScroll); } }, { passive: true });
  onScroll();

  /* Form: ripple + confirmation */
  const form = document.querySelector('.contact-form'), btn = form.querySelector('button');
  btn.addEventListener('click', (ev) => {
    const r = btn.getBoundingClientRect(), s = Math.max(r.width, r.height), dot = document.createElement('span');
    dot.className = 'ripple';
    dot.style.cssText = `width:${s}px;height:${s}px;left:${ev.clientX - r.left - s / 2}px;top:${ev.clientY - r.top - s / 2}px`;
    btn.appendChild(dot);
    setTimeout(() => dot.remove(), 600);
  });
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    btn.firstChild.textContent = 'Sent!';
    form.reset();
    setTimeout(() => { btn.firstChild.textContent = 'Submit'; }, 1500);
  });
})();
