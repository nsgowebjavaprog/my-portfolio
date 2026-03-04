/**
 * MAIN.JS
 * Preloader · Cursor · Nav · ScrollReveal
 * Counters · Hero entrance · Interactions
 */
document.addEventListener('DOMContentLoaded', () => {

  /* ════════════════════════
     PRELOADER
  ════════════════════════ */
  const preloader = document.getElementById('preloader');
  const preFill   = document.getElementById('preFill');
  const prePct    = document.getElementById('prePct');
  let pct = 0;
  const pTimer = setInterval(() => {
    pct += Math.random() * 18 + 5;
    if (pct >= 100) { pct = 100; clearInterval(pTimer); }
    preFill.style.width = pct + '%';
    prePct.textContent  = Math.floor(pct) + '%';
    if (pct >= 100) {
      setTimeout(() => {
        preloader.classList.add('hidden');
        document.body.style.overflow = '';
        triggerHeroReveal();
      }, 400);
    }
  }, 80);
  document.body.style.overflow = 'hidden';


  /* ════════════════════════
     CUSTOM CURSOR
  ════════════════════════ */
  const dot  = document.getElementById('cur-dot');
  const ring = document.getElementById('cur-ring');
  let dx = 0, dy = 0, rx = 0, ry = 0;

  document.addEventListener('mousemove', e => { dx = e.clientX; dy = e.clientY; });

  ;(function loopCursor() {
    dot.style.left  = dx + 'px';
    dot.style.top   = dy + 'px';
    rx += (dx - rx) * 0.12;
    ry += (dy - ry) * 0.12;
    ring.style.left = rx + 'px';
    ring.style.top  = ry + 'px';
    requestAnimationFrame(loopCursor);
  })();

  document.querySelectorAll('a, button, .proj-row, .ach-entry, .sk-card').forEach(el => {
    el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
    el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
  });

  document.addEventListener('mouseleave', () => {
    dot.style.opacity  = '0';
    ring.style.opacity = '0';
  });
  document.addEventListener('mouseenter', () => {
    dot.style.opacity  = '1';
    ring.style.opacity = '1';
  });


  /* ════════════════════════
     NAVBAR STUCK STATE
  ════════════════════════ */
  const nav = document.getElementById('site-nav');
  window.addEventListener('scroll', () => {
    nav.classList.toggle('stuck', window.scrollY > 60);
  });


  /* ════════════════════════
     ACTIVE NAV LINKS
  ════════════════════════ */
  const sections  = [...document.querySelectorAll('section[id]')];
  const navLinks  = [...document.querySelectorAll('.nav-menu a')];

  const secObserver = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        const id = e.target.id;
        navLinks.forEach(a => a.classList.toggle('active', a.getAttribute('href') === `#${id}`));
      }
    });
  }, { threshold: 0.4 });
  sections.forEach(s => secObserver.observe(s));


  /* ════════════════════════
     HERO ENTRANCE
  ════════════════════════ */
  function triggerHeroReveal() {
    document.querySelectorAll('[style*="animation"]').forEach(el => el.style.animationPlayState = 'running');
  }


  /* ════════════════════════
     SCROLL REVEAL
  ════════════════════════ */
  function addRevealClasses() {
    const targets = [
      '.about-title-col', '.about-body-col',
      '.sk-card', '.proj-row',
      '.tl-entry', '.ach-entry',
      '.contact-big', '.contact-panel',
      '.sec-title', '.sec-num',
    ];
    targets.forEach((sel, si) => {
      document.querySelectorAll(sel).forEach((el, i) => {
        el.classList.add('reveal');
        el.classList.add(`reveal-d${Math.min(i % 4, 3)}`);
      });
    });
  }
  addRevealClasses();

  const revealObs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('in');
        revealObs.unobserve(e.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  document.querySelectorAll('.reveal').forEach(el => revealObs.observe(el));


  /* ════════════════════════
     COUNTER ANIMATION
  ════════════════════════ */
  function animateNum(el, target, isDecimal) {
    const duration = 1800;
    const step = 16;
    const steps = duration / step;
    let cur = 0;
    const inc = target / steps;
    const timer = setInterval(() => {
      cur = Math.min(cur + inc, target);
      el.textContent = isDecimal ? cur.toFixed(2) : Math.floor(cur);
      if (cur >= target) clearInterval(timer);
    }, step);
  }

  const countObs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      const el = e.target;
      const target  = parseFloat(el.dataset.target);
      const decimal = el.dataset.decimal === 'true';
      const suffix  = el.dataset.suffix || '';
      animateNum(el, target, decimal);
      if (suffix) {
        const orig = el.textContent;
        const s = setInterval(() => {
          if (parseFloat(el.textContent) >= target) {
            el.textContent = (decimal ? target.toFixed(2) : target) + suffix;
            clearInterval(s);
          }
        }, 50);
      }
      countObs.unobserve(el);
    });
  }, { threshold: 0.6 });

  document.querySelectorAll('.sn[data-target]').forEach(el => countObs.observe(el));


  /* ════════════════════════
     HERO NAME HOVER GLITCH
  ════════════════════════ */
  const heroName = document.querySelector('.hero-name');
  if (heroName) {
    heroName.addEventListener('mouseenter', () => {
      heroName.style.transform = 'skewX(-1deg)';
      heroName.style.transition = 'transform .1s';
    });
    heroName.addEventListener('mouseleave', () => {
      heroName.style.transform = 'none';
    });
  }


  /* ════════════════════════
     CLICK RIPPLE
  ════════════════════════ */
  document.addEventListener('click', e => {
    const r = document.createElement('div');
    Object.assign(r.style, {
      position:     'fixed',
      left:         e.clientX + 'px',
      top:          e.clientY + 'px',
      width:        '6px',
      height:       '6px',
      background:   'rgba(255,255,255,0.35)',
      borderRadius: '50%',
      transform:    'translate(-50%,-50%) scale(0)',
      pointerEvents:'none',
      zIndex:       '9997',
      animation:    'ripple .65s ease-out forwards',
    });
    document.body.appendChild(r);
    setTimeout(() => r.remove(), 700);
  });

  const rippleCSS = document.createElement('style');
  rippleCSS.textContent = `@keyframes ripple{to{transform:translate(-50%,-50%) scale(45);opacity:0}}`;
  document.head.appendChild(rippleCSS);


  /* ════════════════════════
     SKILL CARDS HOVER STAGGER
  ════════════════════════ */
  document.querySelectorAll('.sk-card').forEach((card) => {
    const tags = card.querySelectorAll('.sk-tags span');
    card.addEventListener('mouseenter', () => {
      tags.forEach((tag, i) => {
        tag.style.transitionDelay = `${i * 35}ms`;
      });
    });
    card.addEventListener('mouseleave', () => {
      tags.forEach(tag => tag.style.transitionDelay = '0ms');
    });
  });


  /* ════════════════════════
     SMOOTH SCROLL OFFSET
  ════════════════════════ */
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const target = document.querySelector(a.getAttribute('href'));
      if (target) {
        e.preventDefault();
        const offset = 90;
        window.scrollTo({ top: target.offsetTop - offset, behavior: 'smooth' });
      }
    });
  });


  /* ════════════════════════
     SECTION BORDER HIGHLIGHT ON SCROLL
  ════════════════════════ */
  const borderObs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.style.borderTopColor = 'rgba(255,255,255,0.15)';
      } else {
        e.target.style.borderTopColor = '';
      }
    });
  }, { threshold: 0.2 });
  document.querySelectorAll('.section').forEach(s => borderObs.observe(s));

});
