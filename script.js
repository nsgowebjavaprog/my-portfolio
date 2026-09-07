document.addEventListener('DOMContentLoaded', () => {

  /* ---------------------------------------------------
     Mobile nav toggle
  --------------------------------------------------- */
  const navToggle = document.getElementById('navToggle');
  const pipelineNav = document.getElementById('pipelineNav');

  if (navToggle && pipelineNav) {
    navToggle.addEventListener('click', () => {
      const isOpen = pipelineNav.classList.toggle('is-open');
      navToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });

    // close nav after tapping a link (mobile)
    pipelineNav.querySelectorAll('.pipeline__link').forEach(link => {
      link.addEventListener('click', () => {
        pipelineNav.classList.remove('is-open');
        navToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  /* ---------------------------------------------------
     Active-stage highlighting as the user scrolls
  --------------------------------------------------- */
  const sections = document.querySelectorAll('main .section');
  const navLinks = document.querySelectorAll('.pipeline__link');

  const linkFor = (id) => document.querySelector(`.pipeline__link[href="#${id}"]`);

  if ('IntersectionObserver' in window && sections.length) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const activeLink = linkFor(entry.target.id);
          if (!activeLink) return;
          navLinks.forEach(l => l.classList.remove('is-active'));
          activeLink.classList.add('is-active');
        }
      });
    }, { rootMargin: '-40% 0px -50% 0px', threshold: 0 });

    sections.forEach(section => observer.observe(section));
  }

  /* ---------------------------------------------------
     FAQ accordion
  --------------------------------------------------- */
  const faqButtons = document.querySelectorAll('.faq-item__q');

  faqButtons.forEach(btn => {
    const answer = btn.nextElementSibling;

    btn.addEventListener('click', () => {
      const isExpanded = btn.getAttribute('aria-expanded') === 'true';

      // close all other answers (single-open accordion)
      faqButtons.forEach(other => {
        if (other !== btn) {
          other.setAttribute('aria-expanded', 'false');
          other.nextElementSibling.style.maxHeight = null;
        }
      });

      if (isExpanded) {
        btn.setAttribute('aria-expanded', 'false');
        answer.style.maxHeight = null;
      } else {
        btn.setAttribute('aria-expanded', 'true');
        answer.style.maxHeight = answer.scrollHeight + 'px';
      }
    });
  });

  /* ---------------------------------------------------
     Certificate lightbox
  --------------------------------------------------- */
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxCaption = document.getElementById('lightboxCaption');
  const lightboxClose = document.getElementById('lightboxClose');
  const certCards = document.querySelectorAll('.cert-card');

  function openLightbox(src, caption) {
    lightboxImg.src = src;
    lightboxImg.alt = caption;
    lightboxCaption.textContent = caption;
    lightbox.classList.add('is-open');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    lightbox.classList.remove('is-open');
    lightboxImg.src = '';
    document.body.style.overflow = '';
  }

  certCards.forEach(card => {
    card.addEventListener('click', () => {
      openLightbox(card.dataset.img, card.dataset.caption || '');
    });
  });

  lightboxClose.addEventListener('click', closeLightbox);
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && lightbox.classList.contains('is-open')) closeLightbox();
  });

  /* ---------------------------------------------------
     Footer year / status line — small live touch
  --------------------------------------------------- */
  const footerEnd = document.querySelector('.footer__end');
  if (footerEnd) {
    const year = new Date().getFullYear();
    footerEnd.textContent = `status: build passing · page rendered ${year}`;
  }

});
