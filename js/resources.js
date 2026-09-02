/* ==========================================================================
   TEACHCORE - RESOURCES MODULE
   Handles academic library filtering, search, and PDF preview drawer.
   ========================================================================== */

const RESOURCES_DATA = [
  {
    id: 'r1',
    title: 'The Modern Classroom Pedagogy Framework (PDF)',
    category: 'Teaching Guides',
    author: 'TeachCore Research Faculty',
    type: 'Guide',
    pages: '42 Pages',
    desc: 'An authoritative whitepaper outlining active engagement protocols, peer learning structures, and cognitive retention tactics.'
  },
  {
    id: 'r2',
    title: 'Generative AI Policy & Integrity Guidelines for Higher Ed',
    category: 'Technology',
    author: 'Dr. Aris Thorne',
    type: 'Policy Whitepaper',
    pages: '28 Pages',
    desc: 'Institutional guidelines for establishing transparent policies on student generative AI usage and modern assessment validation.'
  },
  {
    id: 'r3',
    title: 'Rubric Engineering: Constructing Unbiased Diagnostic Rubrics',
    category: 'Assessment',
    author: 'Prof. Clara Sterling',
    type: 'Framework',
    pages: '18 Pages',
    desc: 'Step-by-step methodology for constructing clear, objective evaluation criteria across diverse academic disciplines.'
  },
  {
    id: 'r4',
    title: 'Faculty Mentorship & Peer Coaching Operational Manual',
    category: 'Leadership',
    author: 'Dr. Robert Sterling',
    type: 'Manual',
    pages: '56 Pages',
    desc: 'Comprehensive operational manual for establishing institutional peer coaching programs and new instructor onboarding.'
  },
  {
    id: 'r5',
    title: 'Blended Course Architecture & Hybrid Learning Blueprint',
    category: 'Pedagogy',
    author: 'Dr. Sarah Jenkins',
    type: 'Blueprint',
    pages: '34 Pages',
    desc: 'Architectural blueprint for organizing asynchronous modules, synchronous workshops, and digital discussion forums.'
  },
  {
    id: 'r6',
    title: 'Grant Writing & High-Impact Journal Publication Playbook',
    category: 'Research',
    author: 'Prof. Julian Thorne',
    type: 'Playbook',
    pages: '50 Pages',
    desc: 'Field-tested playbook for crafting competitive research proposals and managing manuscript peer reviews.'
  }
];

document.addEventListener('DOMContentLoaded', () => {
  if (document.getElementById('resources-grid')) {
    initResourcesPage();
  }
});

function initResourcesPage() {
  const container = document.getElementById('resources-grid');
  const searchInput = document.getElementById('resource-search');
  const filterBtns = document.querySelectorAll('[data-res-category]');

  let activeCategory = 'all';

  function renderResources() {
    const query = searchInput ? searchInput.value.toLowerCase().trim() : '';

    const filtered = RESOURCES_DATA.filter(item => {
      const matchCat = activeCategory === 'all' || item.category === activeCategory;
      const matchQuery = query === '' || item.title.toLowerCase().includes(query) || item.desc.toLowerCase().includes(query);
      return matchCat && matchQuery;
    });

    if (filtered.length === 0) {
      container.innerHTML = `
        <div style="grid-column: 1 / -1; text-align: center; padding: 4rem 1rem; border: 1px dashed var(--border-gold); background: var(--bg-graphite);">
          <h3 style="color: var(--gold-bright); margin-bottom: 0.5rem;">No Academic Resources Found</h3>
          <p style="color: var(--text-secondary);">Try refining your search keyword or selected category tag.</p>
        </div>
      `;
      return;
    }

    container.innerHTML = filtered.map(res => `
      <div class="editorial-card" style="display: flex; flex-direction: column; justify-content: space-between;">
        <div>
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
            <span class="badge badge-gold">${res.category}</span>
            <span style="font-size: 0.75rem; color: var(--gold-bright); font-weight: 600;">${res.pages}</span>
          </div>
          <h3 style="font-size: 1.5rem; margin-bottom: 0.75rem;">${res.title}</h3>
          <p style="font-size: 0.9rem; color: var(--text-secondary); margin-bottom: 1.5rem;">${res.desc}</p>
        </div>
        <div>
          <div style="font-size: 0.8rem; color: var(--text-muted); margin-bottom: 1.25rem;">
            <strong>Author:</strong> ${res.author}
          </div>
          <div style="display: flex; gap: 0.75rem;">
            <button type="button" class="btn btn-outline preview-resource-btn" data-title="${escapeHTML(res.title)}" data-desc="${escapeHTML(res.desc)}" style="flex: 1; padding: 0.6rem; font-size: 0.75rem;">Preview</button>
            <button type="button" class="btn btn-primary download-resource-btn" data-title="${escapeHTML(res.title)}" style="padding: 0.6rem 1rem; font-size: 0.75rem;">Download PDF</button>
          </div>
        </div>
      </div>
    `).join('');

    container.querySelectorAll('.preview-resource-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const title = btn.getAttribute('data-title');
        const desc = btn.getAttribute('data-desc');
        openPreviewModal(title, desc);
      });
    });

    container.querySelectorAll('.download-resource-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const title = btn.getAttribute('data-title');
        if (window.showToast) {
          window.showToast(`Downloading publication: "${title}"`, 'success');
        }
      });
    });
  }

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('btn-primary'));
      filterBtns.forEach(b => b.classList.add('btn-secondary'));
      btn.classList.remove('btn-secondary');
      btn.classList.add('btn-primary');

      activeCategory = btn.getAttribute('data-res-category');
      renderResources();
    });
  });

  if (searchInput) searchInput.addEventListener('input', renderResources);

  renderResources();
}

function openPreviewModal(title, desc) {
  let modal = document.getElementById('resource-preview-modal');
  if (!modal) {
    const modalHTML = `
      <div id="resource-preview-modal" class="modal-backdrop" aria-hidden="true">
        <div class="modal-window" style="max-width: 680px;">
          <button class="modal-close-btn">&times;</button>
          <span class="badge badge-gold" style="margin-bottom: 1rem;">Academic Publication</span>
          <h2 style="font-size: 2rem; margin-bottom: 1rem;" id="res-prev-title">Resource Title</h2>
          <p style="font-size: 1rem; color: var(--text-secondary); margin-bottom: 2rem;" id="res-prev-desc">Resource description...</p>
          <div style="background: var(--bg-black-soft); border: 1px solid var(--border-gold); padding: 2rem; text-align: center; margin-bottom: 2rem;">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--gold)" stroke-width="1.5" style="margin-bottom: 1rem;"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
            <h4 style="font-size: 1.2rem; color: var(--text-primary); margin-bottom: 0.5rem;">Document Executive Preview</h4>
            <p style="font-size: 0.85rem; color: var(--text-muted);">Full text restricted to registered TeachCore educators. Download full PDF for institutional distribution.</p>
          </div>
          <div style="display: flex; justify-content: flex-end; gap: 1rem;">
            <button type="button" class="btn btn-secondary" onclick="document.getElementById('resource-preview-modal').classList.remove('is-open'); document.body.style.overflow='';" >Close</button>
            <button type="button" class="btn btn-primary" onclick="if(window.showToast) window.showToast('Downloading full PDF document...', 'success'); document.getElementById('resource-preview-modal').classList.remove('is-open'); document.body.style.overflow='';" >Download Full PDF</button>
          </div>
        </div>
      </div>
    `;
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    modal = document.getElementById('resource-preview-modal');
    modal.querySelector('.modal-close-btn').addEventListener('click', () => {
      modal.classList.remove('is-open');
      document.body.style.overflow = '';
    });
  }

  modal.querySelector('#res-prev-title').textContent = title;
  modal.querySelector('#res-prev-desc').textContent = desc;
  modal.classList.add('is-open');
  document.body.style.overflow = 'hidden';
}

function escapeHTML(str) {
  return str.replace(/[&<>'"]/g, 
    tag => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[tag] || tag)
  );
}
