(function () {
  const email = 'pavankrishnaer@gmail.com';

  function isHomePage() {
    const path = window.location.pathname.split('/').pop();
    return path === '' || path === 'index.html';
  }

  function sectionHref(id) {
    return isHomePage() ? `#${id}` : `index.html#${id}`;
  }

  function ensureCursor() {
    if (!document.getElementById('cur')) {
      document.body.insertAdjacentHTML('afterbegin', '<div id="cur"></div><div id="cur-ring"></div>');
    }
  }

  function renderNav() {
    const target = document.getElementById('site-nav');
    if (!target) return;

    const logoHref = isHomePage() ? '#' : 'index.html';
    const logoAction = isHomePage() ? ' data-scroll-home="true"' : '';

    target.innerHTML = `
      <nav>
        <a href="${logoHref}" class="nav-logo"${logoAction}>pavankrishna<span>.dev</span></a>
        <ul class="nav-links" id="navLinks">
          <li><a href="${sectionHref('about')}">About</a></li>
          <li><a href="${sectionHref('projects')}">Projects</a></li>
          <li><a href="${sectionHref('skills')}">Skills</a></li>
          <li><a href="${sectionHref('certs')}">Certifications</a></li>
          <li><a href="${sectionHref('education')}">Education</a></li>
          <li><a href="${sectionHref('contact')}">Contact</a></li>
        </ul>
        <div class="nav-right">
          <a href="#" class="nav-cta" data-hire-open="true">Hire Me</a>
          <button class="theme-toggle" id="themeToggle" title="Toggle dark mode" aria-label="Toggle dark mode">🌙</button>
          <button class="nav-menu-toggle" id="navMenuToggle" type="button" aria-label="Open navigation menu" aria-controls="navLinks" aria-expanded="false">
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>
      </nav>
    `;
  }

  function renderFooter() {
    const target = document.getElementById('site-footer');
    if (!target) return;

    target.innerHTML = `
      <footer>
        <span>© 2026 Pavankrishna Ellore Ramesh</span>
        <span class="last-updated">Last updated: June 2026</span>
        <div class="foot-links">
          <a href="impressum.html">Impressum</a>
          <a href="privacy.html">Privacy</a>
        </div>
      </footer>
    `;
  }

  function renderHireModal() {
    if (document.getElementById('hireModal')) return;

    document.body.insertAdjacentHTML('beforeend', `
      <div id="hireModal" class="modal-overlay" role="dialog" aria-modal="true" aria-labelledby="modalTitle">
        <div class="modal-box">
          <button class="modal-close" type="button" data-hire-close="true" aria-label="Close contact options">✕</button>
          <div class="modal-icon">👋</div>
          <h2 class="modal-title" id="modalTitle">Let's work together</h2>
          <p class="modal-sub">Choose how you'd like to reach out. I respond within 24 hours.</p>
          <div class="modal-options">
            <button class="modal-option" type="button" data-copy-modal-email="true">
              <div class="modal-opt-icon">@</div>
              <div class="modal-opt-body">
                <div class="modal-opt-label">Email me directly</div>
                <div class="modal-opt-val" id="modalEmailText">${email}</div>
              </div>
              <div class="modal-opt-action" id="modalCopyHint">Click to copy</div>
            </button>
            <a href="https://www.linkedin.com/in/pavankrishnaer/" target="_blank" rel="noopener noreferrer" class="modal-option">
              <div class="modal-opt-icon">in</div>
              <div class="modal-opt-body">
                <div class="modal-opt-label">Connect on LinkedIn</div>
                <div class="modal-opt-val">linkedin.com/in/pavankrishnaer</div>
              </div>
              <div class="modal-opt-action">Open →</div>
            </a>
            <a href="pavankrishna-cv.pdf" download="Pavankrishna_Ellore_Ramesh_AWS_Cloud_Engineer_CV.pdf" class="modal-option">
              <div class="modal-opt-icon">CV</div>
              <div class="modal-opt-body">
                <div class="modal-opt-label">Download my CV</div>
                <div class="modal-opt-val">PDF, always up to date</div>
              </div>
              <div class="modal-opt-action">Download →</div>
            </a>
          </div>
          <div class="modal-avail">
            <span class="a-dot a-green"></span>
            <span>Available for full-time AWS roles &amp; freelance projects</span>
          </div>
        </div>
      </div>
    `);
  }

  function getFocusable(modal) {
    return Array.from(modal.querySelectorAll(
      'a[href], button:not([disabled]), input, textarea, select, [tabindex]:not([tabindex="-1"])'
    ));
  }

  async function copyText(text) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch {
      const el = document.createElement('input');
      el.value = text;
      document.body.appendChild(el);
      el.select();
      document.execCommand('copy');
      document.body.removeChild(el);
      return true;
    }
  }

  window.copyText = copyText;

  window.copyEmail = async function copyEmail() {
    await copyText(email);
    const hint = document.getElementById('emailCopyHint');
    if (!hint) return;
    hint.textContent = '✓ Copied!';
    hint.style.cssText = 'background:#e8f5ee;border-color:#86efac;color:#1d8348;';
    setTimeout(() => {
      hint.textContent = 'Click to copy';
      hint.style.cssText = '';
    }, 2000);
  };

  window.copyEmailFromModal = async function copyEmailFromModal() {
    await copyText(email);
    const hint = document.getElementById('modalCopyHint');
    if (!hint) return;
    hint.textContent = '✓ Copied!';
    hint.style.cssText = 'color:#1d8348;font-weight:700;';
    setTimeout(() => {
      hint.textContent = 'Click to copy';
      hint.style.cssText = '';
    }, 2000);
  };

  let lastFocus = null;

  window.openHireModal = function openHireModal() {
    lastFocus = document.activeElement;
    const modal = document.getElementById('hireModal');
    if (!modal) return;
    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
    const closeBtn = modal.querySelector('.modal-close');
    setTimeout(() => closeBtn && closeBtn.focus(), 50);
  };

  window.closeHireModal = function closeHireModal() {
    const modal = document.getElementById('hireModal');
    if (!modal) return;
    modal.classList.remove('open');
    document.body.style.overflow = '';
    if (lastFocus) lastFocus.focus();
  };

  window.closeModal = function closeModal(event) {
    if (event.target === document.getElementById('hireModal')) {
      window.closeHireModal();
    }
  };

  function initThemeToggle() {
    const themeToggle = document.getElementById('themeToggle');
    const html = document.documentElement;
    if (!themeToggle) return;

    themeToggle.textContent = html.getAttribute('data-theme') === 'dark' ? '☀️' : '🌙';
    themeToggle.addEventListener('click', () => {
      const next = html.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      html.setAttribute('data-theme', next);
      localStorage.setItem('theme', next);
      themeToggle.textContent = next === 'dark' ? '☀️' : '🌙';
    });
  }

  function initCursor() {
    const cur = document.getElementById('cur');
    const ring = document.getElementById('cur-ring');
    if (!cur || !ring || !window.matchMedia('(pointer: fine)').matches) return;

    let mx = 0;
    let my = 0;
    let rx = 0;
    let ry = 0;

    document.addEventListener('mousemove', event => {
      mx = event.clientX;
      my = event.clientY;
      cur.style.transform = `translate(${mx - 4}px, ${my - 4}px)`;
    });

    (function loop() {
      if (!document.hidden) {
        rx += (mx - rx) * 0.1;
        ry += (my - ry) * 0.1;
        ring.style.transform = `translate(${rx - 14}px, ${ry - 14}px)`;
      }
      requestAnimationFrame(loop);
    })();

    document.querySelectorAll('a, button, .aws-card, .proj-card, .cert-card').forEach(el => {
      el.addEventListener('mouseenter', () => {
        cur.classList.add('big');
        ring.classList.add('big');
      });
      el.addEventListener('mouseleave', () => {
        cur.classList.remove('big');
        ring.classList.remove('big');
      });
    });
  }

  function initModalEvents() {
    const modal = document.getElementById('hireModal');
    if (!modal) return;

    document.querySelectorAll('[data-hire-open]').forEach(el => {
      el.addEventListener('click', event => {
        event.preventDefault();
        window.openHireModal();
      });
    });

    document.querySelectorAll('[data-hire-close]').forEach(el => {
      el.addEventListener('click', window.closeHireModal);
    });

    modal.addEventListener('click', window.closeModal);

    const copyModalEmail = document.querySelector('[data-copy-modal-email]');
    if (copyModalEmail) {
      copyModalEmail.addEventListener('click', window.copyEmailFromModal);
    }

    document.addEventListener('keydown', event => {
      if (!modal.classList.contains('open')) return;

      if (event.key === 'Escape') {
        window.closeHireModal();
        return;
      }

      if (event.key !== 'Tab') return;

      const focusable = getFocusable(modal);
      if (!focusable.length) {
        event.preventDefault();
        return;
      }

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    });
  }

  function initHomeLogo() {
    document.querySelectorAll('[data-scroll-home]').forEach(el => {
      el.addEventListener('click', event => {
        event.preventDefault();
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
    });
  }

  function initMobileNav() {
    const toggle = document.getElementById('navMenuToggle');
    const links = document.querySelector('.nav-links');
    if (!toggle || !links) return;

    links.id = 'navLinks';

    function closeMenu() {
      links.classList.remove('open');
      toggle.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
      toggle.setAttribute('aria-label', 'Open navigation menu');
    }

    function toggleMenu() {
      const isOpen = links.classList.toggle('open');
      toggle.classList.toggle('open', isOpen);
      toggle.setAttribute('aria-expanded', String(isOpen));
      toggle.setAttribute('aria-label', isOpen ? 'Close navigation menu' : 'Open navigation menu');
    }

    toggle.addEventListener('click', toggleMenu);
    links.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
    window.addEventListener('resize', () => {
      if (window.innerWidth > 600) closeMenu();
    });
    document.addEventListener('keydown', event => {
      if (event.key === 'Escape') closeMenu();
    });
  }

  function initActiveNav() {
    if (!isHomePage()) return;

    const sectionIds = ['about', 'projects', 'skills', 'certs', 'education', 'contact'];
    const sections = sectionIds
      .map(id => document.getElementById(id))
      .filter(Boolean);
    const navLinks = new Map(
      sectionIds.map(id => [id, document.querySelector(`.nav-links a[href="#${id}"]`)])
    );

    if (!sections.length) return;

    let activeId = '';
    let ticking = false;

    function setActive(id) {
      if (id === activeId) return;
      activeId = id;

      navLinks.forEach((link, linkId) => {
        if (!link) return;
        const isActive = linkId === id;
        link.classList.toggle('active', isActive);
        if (isActive) {
          link.setAttribute('aria-current', 'location');
        } else {
          link.removeAttribute('aria-current');
        }
      });
    }

    function updateActive() {
      ticking = false;
      const scrollPosition = window.scrollY + 140;
      let currentId = '';

      sections.forEach(section => {
        if (section.offsetTop <= scrollPosition) {
          currentId = section.id;
        }
      });

      const nearBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2;
      if (nearBottom && document.getElementById('contact')) {
        currentId = 'contact';
      }

      setActive(currentId);
    }

    function requestUpdate() {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(updateActive);
    }

    window.addEventListener('scroll', requestUpdate, { passive: true });
    window.addEventListener('resize', requestUpdate);
    window.addEventListener('hashchange', requestUpdate);
    updateActive();
  }

  function isTransitionLink(link) {
    const rawHref = link.getAttribute('href');
    if (!rawHref || rawHref.startsWith('#')) return false;
    if (link.target || link.hasAttribute('download')) return false;
    if (link.hasAttribute('data-hire-open') || link.hasAttribute('data-hire-close')) return false;
    if (link.hasAttribute('onclick')) return false;

    const url = new URL(rawHref, window.location.href);
    if (url.protocol !== window.location.protocol || url.host !== window.location.host) return false;
    if (url.protocol === 'mailto:' || url.protocol === 'tel:') return false;

    const currentPath = window.location.pathname || '/';
    const samePage = url.pathname === currentPath && url.search === window.location.search;
    return !(samePage && url.hash);
  }

  function initPageTransitions() {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduceMotion || 'startViewTransition' in document) return;

    document.addEventListener('click', event => {
      const link = event.target.closest('a[href]');
      if (!link || !isTransitionLink(link)) return;

      event.preventDefault();
      document.body.classList.add('page-exit');
      window.setTimeout(() => {
        window.location.href = link.href;
      }, 180);
    });
  }

  ensureCursor();
  renderNav();
  renderFooter();
  renderHireModal();
  initThemeToggle();
  initCursor();
  initModalEvents();
  initHomeLogo();
  initMobileNav();
  initActiveNav();
  initPageTransitions();
})();
