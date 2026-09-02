/* ==========================================================================
   TEACHCORE - NAVIGATION MODULE
   Handles accessible mobile drawer, ARIA attributes, keyboard ESC navigation,
   and active page link highlighting.
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initNavigation();
  highlightActiveLink();
});

function initNavigation() {
  const hamburgerBtn = document.querySelector('.hamburger-btn');
  const mobileOverlay = document.querySelector('.mobile-nav-overlay');
  const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');

  if (!hamburgerBtn || !mobileOverlay) return;

  function toggleMobileNav() {
    const isOpen = mobileOverlay.classList.contains('is-open');
    if (isOpen) {
      closeMobileNav();
    } else {
      openMobileNav();
    }
  }

  function openMobileNav() {
    mobileOverlay.classList.add('is-open');
    hamburgerBtn.classList.add('is-active');
    hamburgerBtn.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  }

  function closeMobileNav() {
    mobileOverlay.classList.remove('is-open');
    hamburgerBtn.classList.remove('is-active');
    hamburgerBtn.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  hamburgerBtn.addEventListener('click', toggleMobileNav);

  mobileNavLinks.forEach(link => {
    link.addEventListener('click', () => {
      closeMobileNav();
    });
  });

  // Close on Escape Key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && mobileOverlay.classList.contains('is-open')) {
      closeMobileNav();
    }
  });
}

function highlightActiveLink() {
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  const navLinks = document.querySelectorAll('.nav-link, .mobile-nav-link, .auth-state-container a, .mobile-nav-actions a');

  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPath || (currentPath === '' && href === 'index.html')) {
      link.classList.add('active');
      link.setAttribute('aria-current', 'page');
    } else {
      link.classList.remove('active');
      link.removeAttribute('aria-current');
    }
  });
}

window.highlightActiveLink = highlightActiveLink;
