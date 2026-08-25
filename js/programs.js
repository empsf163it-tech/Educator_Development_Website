/* ==========================================================================
   TEACHCORE - PROGRAMS MODULE
   Handles interactive multi-criteria filtering, search, and detail modal.
   ========================================================================== */

const PROGRAMS_DATA = [
  {
    id: 'p1',
    num: '01',
    title: 'Advanced Teaching Methodologies & Instructional Design',
    category: 'Teaching Practice',
    duration: '8 Weeks',
    level: 'Advanced',
    format: 'Hybrid',
    instructor: 'Dr. Marcus Vance, Chair of Pedagogy',
    desc: 'Master evidence-based instructional strategies, active learning architectures, and modern curriculum design tailored for higher education faculty.',
    curriculum: ['Cognitive Load Optimization', 'Active Learning Design', 'Peer Instruction Protocols', 'Inclusive Pedagogy Frameworks']
  },
  {
    id: 'p2',
    num: '02',
    title: 'Academic Leadership & Department Governance',
    category: 'Academic Leadership',
    duration: '12 Weeks',
    level: 'Executive',
    format: 'Online',
    instructor: 'Prof. Julian Thorne, Former University Provost',
    desc: 'Executive development for department heads, deans, and academic chairs focused on strategic institutional vision, faculty mentoring, and crisis management.',
    curriculum: ['Strategic Governance', 'Faculty Retention & Growth', 'Budgeting & Resource Allocation', 'Academic Ethics & Policy']
  },
  {
    id: 'p3',
    num: '03',
    title: 'Digital Education & Blended Course Architecture',
    category: 'Digital Education',
    duration: '6 Weeks',
    level: 'Foundational',
    format: 'Online',
    instructor: 'Dr. Sarah Jenkins, EdTech Strategist',
    desc: 'Transform traditional course material into highly engaging digital learning environments utilizing LMS frameworks, asynchronous media, and interactive tools.',
    curriculum: ['Blended Learning Models', 'Asynchronous Media Production', 'Digital Engagement Analytics', 'LMS Architecture']
  },
  {
    id: 'p4',
    num: '04',
    title: 'Scholarly Research & Publication Mastery',
    category: 'Research',
    duration: '10 Weeks',
    level: 'Advanced',
    format: 'Hybrid',
    instructor: 'Dr. Aris Thorne, Senior Research Fellow',
    desc: 'Comprehensive guidance on empirical research design, high-impact journal submissions, peer-review management, and interdisciplinary collaboration.',
    curriculum: ['Grant Writing Protocols', 'Peer Review Navigation', 'Quantitative & Qualitative Methods', 'Research Dissemination']
  },
  {
    id: 'p5',
    num: '05',
    title: 'Authentic Assessment & Evaluation Design',
    category: 'Assessment',
    duration: '4 Weeks',
    level: 'Foundational',
    format: 'Online',
    instructor: 'Prof. Clara Sterling, Assessment Specialist',
    desc: 'Develop rigorous, unbiased evaluation instruments, rubrics, and diagnostic feedback mechanisms that measure true student mastery.',
    curriculum: ['Rubric Construction', 'Diagnostic vs Summative Assessment', 'Unbiased Evaluation Models', 'Feedback Loop Optimization']
  },
  {
    id: 'p6',
    num: '06',
    title: 'Faculty Development & Mentorship Excellence',
    category: 'Faculty Development',
    duration: '8 Weeks',
    level: 'Executive',
    format: 'On-Site',
    instructor: 'Dr. Robert Sterling, Academic Director',
    desc: 'Equip senior faculty members with structured coaching frameworks to mentor junior educators, foster research culture, and elevate teaching standards.',
    curriculum: ['Peer Coaching Frameworks', 'Constructive Feedback Delivery', 'Mentorship Program Design', 'Institutional Culture Building']
  }
];

document.addEventListener('DOMContentLoaded', () => {
  if (document.getElementById('programs-grid')) {
    initProgramsPage();
  }
});

function initProgramsPage() {
  const container = document.getElementById('programs-grid');
  const categorySelect = document.getElementById('filter-category');
  const levelSelect = document.getElementById('filter-level');
  const formatSelect = document.getElementById('filter-format');
  const searchInput = document.getElementById('filter-search');

  function renderPrograms() {
    const selectedCategory = categorySelect ? categorySelect.value : 'all';
    const selectedLevel = levelSelect ? levelSelect.value : 'all';
    const selectedFormat = formatSelect ? formatSelect.value : 'all';
    const query = searchInput ? searchInput.value.toLowerCase().trim() : '';

    const filtered = PROGRAMS_DATA.filter(item => {
      const matchCat = selectedCategory === 'all' || item.category === selectedCategory;
      const matchLevel = selectedLevel === 'all' || item.level === selectedLevel;
      const matchFormat = selectedFormat === 'all' || item.format === selectedFormat;
      const matchSearch = query === '' || item.title.toLowerCase().includes(query) || item.desc.toLowerCase().includes(query);
      return matchCat && matchLevel && matchFormat && matchSearch;
    });

    if (filtered.length === 0) {
      container.innerHTML = `
        <div style="grid-column: 1 / -1; text-align: center; padding: 4rem 1rem; border: 1px dashed var(--border-gold); background: var(--bg-graphite);">
          <h3 style="color: var(--gold-bright); margin-bottom: 0.5rem;">No Programs Match Your Criteria</h3>
          <p style="color: var(--text-secondary);">Try adjusting your filter preferences or search query.</p>
        </div>
      `;
      return;
    }

    container.innerHTML = filtered.map(prog => `
      <div class="editorial-card" data-program-id="${prog.id}">
        <div>
          <div class="card-num">${prog.num}</div>
          <span class="badge badge-gold" style="margin-bottom: 0.85rem;">${prog.category}</span>
          <h3 class="card-title">${prog.title}</h3>
          <div class="card-meta">
            <span><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg> ${prog.duration}</span>
            <span><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg> ${prog.level}</span>
            <span><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect><line x1="8" y1="21" x2="16" y2="21"></line><line x1="12" y1="17" x2="12" y2="21"></line></svg> ${prog.format}</span>
          </div>
          <p class="card-desc">${prog.desc}</p>
        </div>
        <div>
          <p style="font-size: 0.85rem; color: var(--gold-bright); margin-bottom: 1.25rem;"><strong>Lead Instructor:</strong> ${prog.instructor}</p>
          <button type="button" class="btn btn-outline view-program-detail" data-id="${prog.id}" style="width: 100%;">View Curriculum & Detail &rarr;</button>
        </div>
      </div>
    `).join('');

    // Attach click events for modal
    container.querySelectorAll('.view-program-detail').forEach(btn => {
      btn.addEventListener('click', () => {
        const progId = btn.getAttribute('data-id');
        openProgramModal(progId);
      });
    });
  }

  // Event Listeners
  if (categorySelect) categorySelect.addEventListener('change', renderPrograms);
  if (levelSelect) levelSelect.addEventListener('change', renderPrograms);
  if (formatSelect) formatSelect.addEventListener('change', renderPrograms);
  if (searchInput) searchInput.addEventListener('input', renderPrograms);

  renderPrograms();
}

function openProgramModal(progId) {
  const prog = PROGRAMS_DATA.find(p => p.id === progId);
  if (!prog) return;

  let modal = document.getElementById('program-detail-modal');
  if (!modal) {
    const modalHTML = `
      <div id="program-detail-modal" class="modal-backdrop" aria-hidden="true">
        <div class="modal-window" style="max-width: 720px;">
          <button class="modal-close-btn">&times;</button>
          <div id="program-modal-content"></div>
        </div>
      </div>
    `;
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    modal = document.getElementById('program-detail-modal');
    modal.querySelector('.modal-close-btn').addEventListener('click', () => {
      modal.classList.remove('is-open');
      document.body.style.overflow = '';
    });
  }

  const contentContainer = modal.querySelector('#program-modal-content');
  contentContainer.innerHTML = `
    <span class="badge badge-gold" style="margin-bottom: 1rem;">${prog.category}</span>
    <h2 style="font-size: 2.2rem; margin-bottom: 1rem;">${prog.title}</h2>
    <div style="display: flex; gap: 1.5rem; font-size: 0.9rem; color: var(--gold-bright); border-bottom: 1px solid var(--border-gold); padding-bottom: 1rem; margin-bottom: 1.5rem;">
      <span><strong>Duration:</strong> ${prog.duration}</span>
      <span><strong>Level:</strong> ${prog.level}</span>
      <span><strong>Format:</strong> ${prog.format}</span>
    </div>
    <p style="font-size: 1.05rem; margin-bottom: 1.5rem; color: var(--text-secondary);">${prog.desc}</p>
    
    <h4 style="font-family: var(--font-sans); text-transform: uppercase; letter-spacing: 0.1em; color: var(--gold); font-size: 0.9rem; margin-bottom: 0.85rem;">Core Curriculum Modules</h4>
    <ul style="list-style: none; display: flex; flex-direction: column; gap: 0.75rem; margin-bottom: 2rem;">
      ${prog.curriculum.map(c => `
        <li style="display: flex; align-items: center; gap: 0.75rem; background: var(--bg-black-soft); padding: 0.75rem 1rem; border: 1px solid var(--border-gold);">
          <span style="color: var(--gold); font-weight: bold;">&#10003;</span>
          <span style="font-size: 0.95rem; color: var(--text-primary);">${c}</span>
        </li>
      `).join('')}
    </ul>

    <div style="display: flex; gap: 1rem; justify-content: flex-end;">
      <button type="button" class="btn btn-secondary" onclick="document.getElementById('program-detail-modal').classList.remove('is-open'); document.body.style.overflow='';" >Close</button>
      <button type="button" class="btn btn-primary" onclick="handleEnrollClick('${prog.title}')">Enroll In Program</button>
    </div>
  `;

  modal.classList.add('is-open');
  document.body.style.overflow = 'hidden';
}

window.handleEnrollClick = function(title) {
  const modal = document.getElementById('program-detail-modal');
  if (modal) modal.classList.remove('is-open');
  document.body.style.overflow = '';
  if (window.showToast) {
    window.showToast(`Enrollment request submitted for "${title}". Confirmation email sent!`, 'success');
  }
};
