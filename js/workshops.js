/* ==========================================================================
   TEACHCORE - WORKSHOPS & EVENTS MODULE
   Handles event tab navigation, category filtering, and seat reservation logic.
   ========================================================================== */

const WORKSHOPS_DATA = [
  {
    id: 'w1',
    type: 'upcoming',
    title: 'Mastering Modern Pedagogy: Cognitive Architecture & Active Learning',
    speaker: 'Dr. Elena Martin',
    speakerRole: 'Education Researcher & Cognitive Scientist',
    date: 'September 18, 2026',
    time: '6:00 PM - 8:00 PM EST',
    seatsLeft: 14,
    category: 'Workshops',
    desc: 'An intensive live masterclass unpacking cognitive load theory, attention retention, and active learning strategies for university lecture halls.'
  },
  {
    id: 'w2',
    type: 'upcoming',
    title: 'Generative AI Integration in Higher Education Curriculum',
    speaker: 'Prof. Marcus Vance',
    speakerRole: 'Director of Academic Innovation',
    date: 'October 05, 2026',
    time: '4:00 PM - 6:30 PM EST',
    seatsLeft: 8,
    category: 'Seminars',
    desc: 'Explore policy development, assignment redesign, and ethical AI utilization in undergraduate and postgraduate coursework.'
  },
  {
    id: 'w3',
    type: 'this-month',
    title: 'Institutional Governance & Academic Strategic Leadership',
    speaker: 'Dr. Julian Thorne',
    speakerRole: 'Executive Dean of Faculty',
    date: 'September 28, 2026',
    time: '2:00 PM - 5:00 PM EST',
    seatsLeft: 5,
    category: 'Faculty Development',
    desc: 'Executive seminar for academic department heads on policy formulation, faculty retention, and strategic planning.'
  },
  {
    id: 'w4',
    type: 'past',
    title: 'Rubric Engineering & Unbiased Academic Assessment',
    speaker: 'Prof. Clara Sterling',
    speakerRole: 'Assessment & Evaluation Chair',
    date: 'August 14, 2026',
    time: 'Recorded Masterclass',
    seatsLeft: 0,
    category: 'Masterclasses',
    desc: 'Designing standardized rubrics that minimize evaluator bias and provide actionable diagnostic feedback to students.'
  }
];

document.addEventListener('DOMContentLoaded', () => {
  if (document.getElementById('workshops-container')) {
    initWorkshopsPage();
  }
});

function initWorkshopsPage() {
  const container = document.getElementById('workshops-container');
  const tabs = document.querySelectorAll('[data-event-tab]');

  let currentTab = 'upcoming';

  function renderEvents() {
    const filtered = WORKSHOPS_DATA.filter(evt => {
      if (currentTab === 'all') return true;
      return evt.type === currentTab || (currentTab === 'upcoming' && evt.type === 'this-month');
    });

    if (filtered.length === 0) {
      container.innerHTML = `
        <div style="grid-column: 1 / -1; text-align: center; padding: 4rem 1rem; border: 1px dashed var(--border-gold); background: var(--bg-graphite);">
          <h3 style="color: var(--gold-bright); margin-bottom: 0.5rem;">No Events Scheduled Under This Category</h3>
          <p style="color: var(--text-secondary);">Check back soon for new faculty workshops and academic masterclasses.</p>
        </div>
      `;
      return;
    }

    container.innerHTML = filtered.map(evt => `
      <div class="editorial-card workshop-card">
        <div>
          <div class="workshop-card-header">
            <span class="badge badge-gold">${evt.category}</span>
            <span style="font-size: 0.85rem; color: var(--gold); font-weight: 600;">${evt.date} &bull; ${evt.time}</span>
          </div>
          <h3 style="font-size: 1.85rem; margin-bottom: 0.75rem;">${evt.title}</h3>
          <p style="font-size: 0.95rem; color: var(--text-secondary); margin-bottom: 1.25rem;">${evt.desc}</p>
          <div style="font-size: 0.85rem; color: var(--text-muted);">
            <strong>Featured Keynote:</strong> ${evt.speaker} (${evt.speakerRole})
          </div>
        </div>
        <div class="workshop-card-action">
          ${evt.seatsLeft > 0 ? `
            <span style="font-size: 0.85rem; color: var(--gold-bright); font-weight: 600;">Only ${evt.seatsLeft} Executive Seats Remaining</span>
            <button type="button" class="btn btn-primary reserve-seat-btn" data-title="${escapeHTML(evt.title)}" style="width: 100%;">Reserve Your Seat</button>
          ` : `
            <span style="font-size: 0.85rem; color: var(--text-muted); font-weight: 600;">Registration Closed / Recorded</span>
            <button type="button" class="btn btn-outline" style="width: 100%; opacity: 0.7;" onclick="if(window.showToast) window.showToast('Accessing archived lecture recording...', 'info');">View On-Demand</button>
          `}
        </div>
      </div>
    `).join('');

    container.querySelectorAll('.reserve-seat-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const title = btn.getAttribute('data-title');
        openReservationModal(title);
      });
    });
  }

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('btn-primary'));
      tabs.forEach(t => t.classList.add('btn-secondary'));
      tab.classList.remove('btn-secondary');
      tab.classList.add('btn-primary');

      currentTab = tab.getAttribute('data-event-tab');
      renderEvents();
    });
  });

  renderEvents();
}

function openReservationModal(eventTitle) {
  let modal = document.getElementById('reservation-modal');
  if (!modal) {
    const modalHTML = `
      <div id="reservation-modal" class="modal-backdrop" aria-hidden="true">
        <div class="modal-window" style="max-width: 580px;">
          <button class="modal-close-btn">&times;</button>
          <h2 style="font-size: 2rem; margin-bottom: 0.5rem;" id="res-event-title">Reserve Executive Seat</h2>
          <p style="font-size: 0.9rem; color: var(--text-secondary); margin-bottom: 1.5rem;">Fill out your academic credentials to reserve your seat in this live workshop.</p>
          <form id="reservation-form">
            <div class="form-group">
              <label class="form-label" for="res-name">Full Name</label>
              <input type="text" id="res-name" class="form-control" required placeholder="Dr. Jane Doe">
            </div>
            <div class="form-group">
              <label class="form-label" for="res-email">Academic Email</label>
              <input type="email" id="res-email" class="form-control" required placeholder="j.doe@university.edu">
            </div>
            <div class="form-group">
              <label class="form-label" for="res-institution">Institution / School</label>
              <input type="text" id="res-institution" class="form-control" required placeholder="Harvard University / Department of Pedagogy">
            </div>
            <button type="submit" class="btn btn-primary" style="width: 100%; margin-top: 1rem;">Confirm Seat Reservation</button>
          </form>
        </div>
      </div>
    `;
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    modal = document.getElementById('reservation-modal');
    modal.querySelector('.modal-close-btn').addEventListener('click', () => {
      modal.classList.remove('is-open');
      document.body.style.overflow = '';
    });

    modal.querySelector('#reservation-form').addEventListener('submit', (e) => {
      e.preventDefault();
      modal.classList.remove('is-open');
      document.body.style.overflow = '';
      if (window.showToast) {
        window.showToast('Seat reserved successfully! Check your inbox for access link.', 'success');
      }
    });
  }

  modal.querySelector('#res-event-title').textContent = `Seat Reservation: ${eventTitle}`;
  modal.classList.add('is-open');
  document.body.style.overflow = 'hidden';
}

function escapeHTML(str) {
  return str.replace(/[&<>'"]/g, 
    tag => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[tag] || tag)
  );
}
