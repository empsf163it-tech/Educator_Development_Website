/* ==========================================================================
   TEACHCORE - MAIN GLOBAL MODULE
   Handles global search dialog, toast notifications, smooth scrolling,
   and modal helpers.
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initSearchDialog();
  initGlobalModals();
});

/* Toast Notification Utility */
window.showToast = function(message, type = 'info') {
  let container = document.querySelector('.toast-container');
  if (!container) {
    container = document.createElement('div');
    container.className = 'toast-container';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.innerHTML = `
    <span>${escapeHTML(message)}</span>
    <button style="background:none; border:none; color:var(--text-muted); cursor:pointer; font-size:1.1rem;" onclick="this.parentElement.remove()">&times;</button>
  `;

  container.appendChild(toast);

  // Trigger animation
  setTimeout(() => toast.classList.add('is-show'), 50);

  // Auto remove
  setTimeout(() => {
    toast.classList.remove('is-show');
    setTimeout(() => toast.remove(), 400);
  }, 4000);
};

/* Global Search Modal Initialization */
function initSearchDialog() {
  const searchTriggers = document.querySelectorAll('.search-trigger, [data-open-search]');
  
  if (searchTriggers.length === 0) return;

  // Create search modal HTML if not present
  if (!document.getElementById('global-search-modal')) {
    const modalHTML = `
      <div id="global-search-modal" class="modal-backdrop" aria-hidden="true">
        <div class="modal-window" style="max-width: 600px;">
          <button class="modal-close-btn" aria-label="Close search modal">&times;</button>
          <div class="form-group" style="margin-bottom: 1.5rem;">
            <label class="form-label" for="global-search-input">Search TeachCore</label>
            <input type="text" id="global-search-input" class="form-control" placeholder="Search programs, workshops, research papers, guides..." autocomplete="off">
          </div>
          <div id="search-results-list" style="max-height: 320px; overflow-y: auto; display: flex; flex-direction: column; gap: 0.75rem;">
            <p style="font-size: 0.85rem; color: var(--text-muted); text-align: center;">Start typing to search programs, workshops, or academic publications.</p>
          </div>
        </div>
      </div>
    `;
    document.body.insertAdjacentHTML('beforeend', modalHTML);
  }

  const searchModal = document.getElementById('global-search-modal');
  const searchInput = document.getElementById('global-search-input');
  const resultsContainer = document.getElementById('search-results-list');
  const closeBtn = searchModal.querySelector('.modal-close-btn');

  function openSearch() {
    searchModal.classList.add('is-open');
    searchModal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    setTimeout(() => searchInput.focus(), 100);
  }

  function closeSearch() {
    searchModal.classList.remove('is-open');
    searchModal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  searchTriggers.forEach(btn => btn.addEventListener('click', openSearch));
  closeBtn.addEventListener('click', closeSearch);

  searchModal.addEventListener('click', (e) => {
    if (e.target === searchModal) closeSearch();
  });

  document.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
      e.preventDefault();
      openSearch();
    }
    if (e.key === 'Escape' && searchModal.classList.contains('is-open')) {
      closeSearch();
    }
  });

  // Mock search data
  const searchItems = [
    { title: 'Advanced Pedagogy & Teaching Methodologies', category: 'Program', link: 'programs.html' },
    { title: 'Academic Leadership & Department Governance', category: 'Program', link: 'programs.html' },
    { title: 'Mastering Modern Pedagogy Live Faculty Workshop', category: 'Workshop', link: 'workshops.html' },
    { title: 'AI Integration in Higher Education Curriculum', category: 'Workshop', link: 'workshops.html' },
    { title: 'The Framework for Modern Classroom Assessment', category: 'Resource', link: 'resources.html' },
    { title: 'Research Grant Writing & Scholarly Publishing', category: 'Resource', link: 'resources.html' },
    { title: 'Digital Education & Hybrid Course Architecture', category: 'Program', link: 'programs.html' }
  ];

  searchInput.addEventListener('input', (e) => {
    const query = e.target.value.toLowerCase().trim();
    if (!query) {
      resultsContainer.innerHTML = `<p style="font-size: 0.85rem; color: var(--text-muted); text-align: center;">Start typing to search programs, workshops, or academic publications.</p>`;
      return;
    }

    const matches = searchItems.filter(item => item.title.toLowerCase().includes(query) || item.category.toLowerCase().includes(query));
    if (matches.length === 0) {
      resultsContainer.innerHTML = `<p style="font-size: 0.85rem; color: var(--text-muted); text-align: center;">No matching records found for "${escapeHTML(query)}".</p>`;
    } else {
      resultsContainer.innerHTML = matches.map(item => `
        <a href="${item.link}" style="display: flex; justify-content: space-between; align-items: center; padding: 0.85rem 1rem; background: var(--bg-black-soft); border: 1px solid var(--border-gold); text-decoration: none;">
          <div>
            <span style="display: block; font-size: 0.95rem; font-weight: 600; color: var(--text-primary);">${escapeHTML(item.title)}</span>
            <span style="font-size: 0.75rem; color: var(--gold); text-transform: uppercase; letter-spacing: 0.08em;">${escapeHTML(item.category)}</span>
          </div>
          <span style="color: var(--gold); font-size: 1.1rem;">&rarr;</span>
        </a>
      `).join('');
    }
  });
}

function initGlobalModals() {
  document.addEventListener('click', (e) => {
    const trigger = e.target.closest('[data-modal-target]');
    if (trigger) {
      const targetId = trigger.getAttribute('data-modal-target');
      const targetModal = document.getElementById(targetId);
      if (targetModal) {
        targetModal.classList.add('is-open');
        document.body.style.overflow = 'hidden';
      }
    }

    const closeBtn = e.target.closest('.modal-close-btn') || e.target.closest('[data-modal-close]');
    if (closeBtn) {
      const parentModal = closeBtn.closest('.modal-backdrop');
      if (parentModal) {
        parentModal.classList.remove('is-open');
        document.body.style.overflow = '';
      }
    }
  });
}

function escapeHTML(str) {
  return str.replace(/[&<>'"]/g, 
    tag => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[tag] || tag)
  );
}
