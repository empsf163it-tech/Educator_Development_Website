/* ==========================================================================
   TEACHCORE - AUTHENTICATION MODULE
   Frontend simulation using localStorage, role selection, validation,
   password visibility toggle, and header state management.
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initAuthUI();
  initAuthForms();
  initPasswordToggles();
});

function getStoredUser() {
  try {
    const raw = localStorage.getItem('teachcore_user');
    return raw ? JSON.parse(raw) : null;
  } catch (e) {
    return null;
  }
}

function initAuthUI() {
  const user = getStoredUser();
  const navActions = document.querySelector('.nav-actions');

  if (!navActions) return;

  const authContainer = navActions.querySelector('.auth-state-container') || document.createElement('div');
  authContainer.className = 'auth-state-container';
  authContainer.style.display = 'flex';
  authContainer.style.alignItems = 'center';
  authContainer.style.gap = '1rem';

  if (user) {
    authContainer.innerHTML = `
      <div class="user-badge" title="${user.email}">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
        <span>${escapeHTML(user.name.split(' ')[0])}</span>
      </div>
      <button type="button" id="logout-btn" class="btn btn-outline" style="padding: 0.4rem 0.8rem; font-size: 0.75rem;">Logout</button>
    `;
    const logoutBtn = authContainer.querySelector('#logout-btn');
    if (logoutBtn) {
      logoutBtn.addEventListener('click', () => {
        localStorage.removeItem('teachcore_user');
        if (window.showToast) window.showToast('Successfully logged out.', 'info');
        setTimeout(() => {
          window.location.href = 'index.html';
        }, 800);
      });
    }
  } else {
    // If on normal page (has header)
    authContainer.innerHTML = `
      <a href="login.html" class="nav-auth-link">Login</a>
      <a href="signup.html" class="btn btn-primary" style="padding: 0.55rem 1.25rem; font-size: 0.8rem;">Join TeachCore</a>
    `;
  }

  const existingLinks = navActions.querySelectorAll('.nav-auth-link, .btn-primary:not(#global-cta)');
  existingLinks.forEach(el => {
    if (!el.closest('.auth-state-container')) el.style.display = 'none';
  });

  if (!navActions.contains(authContainer)) {
    navActions.appendChild(authContainer);
  }
}

function initAuthForms() {
  const loginForm = document.getElementById('login-form');
  const signupForm = document.getElementById('signup-form');

  if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const email = loginForm.querySelector('#email').value.trim();
      const password = loginForm.querySelector('#password').value.trim();

      if (!email || !password) {
        if (window.showToast) window.showToast('Please enter both email and password.', 'error');
        return;
      }

      // Simulate Authentication
      const user = {
        name: email.split('@')[0].replace('.', ' '),
        email: email,
        role: 'Educator',
        token: 'tc_token_' + Date.now()
      };

      localStorage.setItem('teachcore_user', JSON.stringify(user));
      if (window.showToast) window.showToast('Welcome back to TeachCore!', 'success');

      setTimeout(() => {
        window.location.href = 'index.html';
      }, 1000);
    });
  }

  if (signupForm) {
    signupForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const fullName = signupForm.querySelector('#full-name').value.trim();
      const email = signupForm.querySelector('#email').value.trim();
      const password = signupForm.querySelector('#password').value.trim();
      const confirmPassword = signupForm.querySelector('#confirm-password').value.trim();
      const role = signupForm.querySelector('#role').value;

      if (!fullName || !email || !password || !role) {
        if (window.showToast) window.showToast('Please fill out all required fields.', 'error');
        return;
      }

      if (password !== confirmPassword) {
        if (window.showToast) window.showToast('Passwords do not match.', 'error');
        return;
      }

      const user = {
        name: fullName,
        email: email,
        role: role,
        token: 'tc_token_' + Date.now()
      };

      localStorage.setItem('teachcore_user', JSON.stringify(user));
      if (window.showToast) window.showToast('Account created successfully! Welcome to TeachCore.', 'success');

      setTimeout(() => {
        window.location.href = 'index.html';
      }, 1000);
    });
  }
}

function initPasswordToggles() {
  const toggleBtns = document.querySelectorAll('.password-toggle-btn');
  toggleBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const input = btn.previousElementSibling || btn.parentElement.querySelector('input[type="password"], input[type="text"]');
      if (input) {
        const type = input.getAttribute('type') === 'password' ? 'text' : 'password';
        input.setAttribute('type', type);
        btn.querySelector('svg').style.opacity = type === 'text' ? '0.5' : '1';
      }
    });
  });
}

function escapeHTML(str) {
  return str.replace(/[&<>'"]/g, 
    tag => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[tag] || tag)
  );
}
