// =========================================================
// MAJOR EXCHANGES — script principal
// =========================================================

// Menu mobile
document.addEventListener('DOMContentLoaded', () => {
  const burger = document.querySelector('.nav-burger');
  const links = document.querySelector('.nav-links');
  if (burger && links) {
    burger.addEventListener('click', () => {
      const isOpen = links.classList.toggle('open');
      burger.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
      burger.setAttribute('aria-label', isOpen ? 'Fermer le menu' : 'Ouvrir le menu');
    });
  }

  // Fermer au clic sur un lien
  document.querySelectorAll('.nav-links a').forEach(a => {
    a.addEventListener('click', () => {
      links?.classList.remove('open');
      if (burger) {
        burger.setAttribute('aria-expanded', 'false');
        burger.setAttribute('aria-label', 'Ouvrir le menu');
      }
    });
  });

  // Reveal on scroll — IntersectionObserver
  const reveals = document.querySelectorAll('.reveal');
  if (reveals.length && 'IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('in');
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -80px 0px' });
    reveals.forEach(el => io.observe(el));
  } else {
    reveals.forEach(el => el.classList.add('in'));
  }

  // Nav shrink on scroll
  const nav = document.querySelector('.nav');
  if (nav) {
    let lastY = window.scrollY;
    window.addEventListener('scroll', () => {
      const y = window.scrollY;
      if (y > 40) nav.style.padding = '14px var(--gutter)';
      else nav.style.padding = '20px var(--gutter)';
      lastY = y;
    }, { passive: true });
  }

  // Make formStatus an ARIA live region so screen readers announce results
  const statusElInit = document.getElementById('formStatus');
  if (statusElInit) {
    statusElInit.setAttribute('role', 'status');
    statusElInit.setAttribute('aria-live', 'polite');
    statusElInit.setAttribute('aria-atomic', 'true');
  }

  // Formspree handler — affiche un feedback sans quitter la page
  const form = document.getElementById('contactForm');
  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const statusEl = document.getElementById('formStatus');
      const submitBtn = form.querySelector('button[type="submit"]');
      const originalBtnHTML = submitBtn.innerHTML;

      // Garde-fou si l'ID Formspree n'a pas été configuré
      if (form.action.includes('YOUR_FORM_ID')) {
        statusEl.style.display = 'block';
        statusEl.style.background = 'rgba(194, 87, 46, 0.15)';
        statusEl.style.color = 'var(--rust-soft)';
        statusEl.textContent = '⚠ Formulaire non configuré : remplace YOUR_FORM_ID dans contact.html';
        return;
      }

      submitBtn.disabled = true;
      submitBtn.innerHTML = 'Envoi en cours...';

      try {
        const data = new FormData(form);
        const res = await fetch(form.action, {
          method: 'POST',
          body: data,
          headers: { 'Accept': 'application/json' }
        });

        if (res.ok) {
          statusEl.style.display = 'block';
          statusEl.style.background = 'rgba(122, 139, 111, 0.2)';
          statusEl.style.color = 'var(--sage)';
          statusEl.textContent = '✓ Merci, votre message est bien arrivé. Nous revenons vers vous sous 48 heures.';
          form.reset();
        } else {
          throw new Error('HTTP ' + res.status);
        }
      } catch (err) {
        statusEl.style.display = 'block';
        statusEl.style.background = 'rgba(194, 87, 46, 0.15)';
        statusEl.style.color = 'var(--rust-soft)';
        statusEl.textContent = '✗ Informations demandées à finaliser. Merci de compléter le formulaire ou d\'écrire directement à contact@major-exchanges.com';
      } finally {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalBtnHTML;
      }
    });
  }
});
