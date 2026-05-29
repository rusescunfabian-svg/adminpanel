/* ═══════════════════════════════════════════════
   LIVE IMPIANTI S.r.l. – Main Script
   ═══════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {

  // ─── Navbar scroll behavior ───
  const navbar = document.getElementById('navbar');
  function handleScroll() {
    navbar.classList.toggle('scrolled', window.scrollY > 60);
  }
  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();

  // ─── Hero stat count-up ───
  const countEls = document.querySelectorAll('[data-countup]');
  if (countEls.length) {
    const runCountUp = (el) => {
      const target = Number(el.dataset.target || 0);
      const suffix = el.dataset.suffix || '';
      const duration = 1200;
      const start = performance.now();

      const tick = (now) => {
        const progress = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        const value = Math.round(target * eased);
        el.textContent = `${value}${suffix}`;
        if (progress < 1) requestAnimationFrame(tick);
      };

      requestAnimationFrame(tick);
    };

    const countObserver = new IntersectionObserver((entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          runCountUp(entry.target);
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.6 });

    countEls.forEach((el) => countObserver.observe(el));
  }

  // ─── Mobile burger menu ───
  const burgerBtn = document.getElementById('burgerBtn');
  const navLinks = document.getElementById('navLinks');

  burgerBtn.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('open');
    burgerBtn.setAttribute('aria-expanded', isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  // Close menu on link click
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
      burgerBtn.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    });
  });

  // ─── Accordion / Projects ───
  const accItems = document.querySelectorAll('.acc-item');

  accItems.forEach(item => {
    const header = item.querySelector('.acc-header');
    const body = item.querySelector('.acc-body');

    header.addEventListener('click', () => {
      const isActive = item.classList.contains('active');

      // Close all
      accItems.forEach(i => {
        i.classList.remove('active');
        i.querySelector('.acc-header').setAttribute('aria-expanded', 'false');
      });

      // Open clicked (toggle)
      if (!isActive) {
        item.classList.add('active');
        header.setAttribute('aria-expanded', 'true');

        // Smooth scroll to item if needed
        setTimeout(() => {
          const rect = item.getBoundingClientRect();
          const navH = navbar.offsetHeight + 16;
          if (rect.top < navH) {
            window.scrollBy({ top: rect.top - navH, behavior: 'smooth' });
          }
        }, 100);
      }
    });
  });

  // ─── Contact form ───
  const form = document.getElementById('contactForm');
  const successMsg = document.getElementById('formSuccess');

  if (form) {
    form.addEventListener('submit', e => {
      e.preventDefault();

      const nome = form.nome.value.trim();
      const email = form.email.value.trim();
      const messaggio = form.messaggio.value.trim();
      const privacy = form.privacy.checked;

      // Basic validation
      let valid = true;
      [form.nome, form.email, form.messaggio].forEach(field => {
        field.style.borderColor = '';
      });

      if (!nome) { form.nome.style.borderColor = '#e74c3c'; valid = false; }
      if (!email || !email.includes('@')) { form.email.style.borderColor = '#e74c3c'; valid = false; }
      if (!messaggio) { form.messaggio.style.borderColor = '#e74c3c'; valid = false; }
      if (!privacy) {
        form.privacy.parentElement.style.outline = '2px solid #e74c3c';
        form.privacy.parentElement.style.borderRadius = '4px';
        valid = false;
      } else {
        form.privacy.parentElement.style.outline = '';
      }

      if (!valid) return;

      // Simulate send
      const submitBtn = form.querySelector('[type="submit"]');
      submitBtn.textContent = 'Invio in corso…';
      submitBtn.disabled = true;

      setTimeout(() => {
        form.reset();
        submitBtn.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:18px;height:18px"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg> Invia richiesta`;
        submitBtn.disabled = false;
        successMsg.classList.add('visible');
        setTimeout(() => successMsg.classList.remove('visible'), 5000);
      }, 1200);
    });
  }

  // ─── Fade-in on scroll (Intersection Observer) ───
  const fadeSelector =
    '.service-card, .acc-item, .contact-item, .why-us__content, .stat, .proj-card';
  let fadeObserver;

  function setupFadeIn() {
    const fadeEls = document.querySelectorAll(fadeSelector);
    fadeEls.forEach((el) => {
      if (el.dataset.fadeReady) return;
      el.dataset.fadeReady = '1';
      el.classList.add('fade-in');
      const siblings = el.parentElement?.querySelectorAll('.proj-card') || [];
      const i = siblings.length ? Array.from(siblings).indexOf(el) : 0;
      const delay = i % 3;
      if (delay === 1) el.classList.add('fade-in-delay-1');
      if (delay === 2) el.classList.add('fade-in-delay-2');
      fadeObserver.observe(el);
    });
  }

  fadeObserver = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          fadeObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
  );

  setupFadeIn();
  document.addEventListener('progetti:home-rendered', setupFadeIn);

  // ─── Smooth scroll for anchor links ───
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      const navH = navbar.offsetHeight + 8;
      const top = target.getBoundingClientRect().top + window.scrollY - navH;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });

  // ─── Active nav link highlight ───
  const sections = document.querySelectorAll('section[id]');
  const navAnchors = document.querySelectorAll('.navbar__links a');

  const sectionObserver = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute('id');
          navAnchors.forEach(a => {
            a.style.fontWeight = a.getAttribute('href') === `#${id}` ? '700' : '500';
          });
        }
      });
    },
    { rootMargin: '-50% 0px -50% 0px' }
  );

  sections.forEach(s => sectionObserver.observe(s));

});
