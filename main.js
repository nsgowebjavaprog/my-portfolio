/* ============================================================
   MAIN.JS
   Scroll reveals, nav behavior, small quality-of-life details.
   No frameworks — plain DOM APIs only.
   ============================================================ */
(function () {
  'use strict';

  /* ---------- Scroll-triggered reveals ---------- */
  const revealEls = document.querySelectorAll('.reveal');

  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry, i) => {
          if (entry.isIntersecting) {
            const el = entry.target;
            const delay = (i % 4) * 60;
            setTimeout(() => el.classList.add('is-visible'), delay);
            io.unobserve(el);
          }
        });
      },
      { threshold: 0.15, rootMargin: '0px 0px -8% 0px' }
    );
    revealEls.forEach((el) => io.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add('is-visible'));
  }

  /* ---------- Nav: shrink / solidify on scroll ---------- */
  const nav = document.getElementById('nav');
  let lastY = window.scrollY;

  window.addEventListener(
    'scroll',
    () => {
      const y = window.scrollY;
      if (y > 40) {
        nav.style.background =
          'linear-gradient(to bottom, rgba(11,14,20,0.92), rgba(11,14,20,0.7))';
        nav.style.borderBottom = '1px solid rgba(237,232,218,0.08)';
      } else {
        nav.style.background =
          'linear-gradient(to bottom, rgba(11,14,20,0.85), rgba(11,14,20,0))';
        nav.style.borderBottom = 'none';
      }
      lastY = y;
    },
    { passive: true }
  );

  /* ---------- Smooth in-page anchor scrolling ---------- */
  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener('click', (e) => {
      const id = link.getAttribute('href');
      if (id.length < 2) return;
      const target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });

  /* ---------- Placeholder-link notice ----------
     LeetCode / GitHub / LinkedIn URLs were not present on the
     source resume. They're wired up as data-fill targets so
     they're easy to find and swap for the real profile links. */
  document.querySelectorAll('[data-fill]').forEach((el) => {
    el.addEventListener('click', (e) => {
      if (el.getAttribute('href') === '#') {
        e.preventDefault();
        console.info(
          `[portfolio] Add the real ${el.dataset.fill} URL to this link's href.`
        );
      }
    });
  });
})();
