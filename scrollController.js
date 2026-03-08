/* ============================================================
   js/scrollController.js
   Scroll-driven interactions:
     - Updates the top progress bar
     - Triggers .visible on module content as sections enter view
     - Highlights the matching nav dot for the current section
     - Handles nav-dot click-to-scroll
   ============================================================ */

// Elements that fade/slide in when their parent section scrolls into view
const SCROLL_REVEAL_ITEMS = [
  { id: 'mc-memory',     triggerEl: 'section-memory'     },
  { id: 'mc-learning',   triggerEl: 'section-learning'   },
  { id: 'mc-reasoning',  triggerEl: 'section-reasoning'  },
  { id: 'mc-creativity', triggerEl: 'section-creativity' },
  { id: 'hc',            triggerEl: 'section-health'     },
  { id: 'tc',            triggerEl: 'section-thought'    },
  { id: 'lw',            triggerEl: 'section-log'        },
];

// IDs in top-to-bottom order — used to match which nav dot is active
const SECTION_IDS = [
  'hero',
  'section-modes',
  'section-memory',
  'section-learning',
  'section-reasoning',
  'section-creativity',
  'section-health',
  'section-thought',
];

const modesContent = document.querySelector('.modes-content');

/**
 * Main scroll handler. Runs on every scroll event (passive).
 */
function onScroll() {
  const scrollTop = window.scrollY;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;

  // ── Progress bar ──────────────────────────────────────────
  document.getElementById('progress-bar').style.width =
    (scrollTop / docHeight * 100) + '%';

  // ── Scroll-reveal items ───────────────────────────────────
  SCROLL_REVEAL_ITEMS.forEach(item => {
    const el      = document.getElementById(item.id);
    const trigger = document.getElementById(item.triggerEl);
    if (!el || !trigger) return;
    if (trigger.getBoundingClientRect().top < window.innerHeight * 0.75)
      el.classList.add('visible');
  });

  // Mode section fade-in
  const modesEl = document.getElementById('section-modes');
  if (modesEl && modesEl.getBoundingClientRect().top < window.innerHeight * 0.75)
    modesContent.classList.add('visible');

  // ── Active nav dot ────────────────────────────────────────
  const dots = document.querySelectorAll('.nav-dot');
  SECTION_IDS.forEach((id, i) => {
    const el = document.getElementById(id);
    if (!el) return;
    const rect = el.getBoundingClientRect();
    // Section occupies the vertical mid-point of the viewport
    if (rect.top <= window.innerHeight / 2 && rect.bottom >= window.innerHeight / 2) {
      dots.forEach(d => d.classList.remove('active'));
      dots[i].classList.add('active');
    }
  });
}

// ── Nav dot click → smooth-scroll to section ─────────────────
document.querySelectorAll('.nav-dot').forEach(dot => {
  dot.addEventListener('click', () => {
    const target = document.getElementById(dot.dataset.target);
    if (target) target.scrollIntoView({ behavior: 'smooth' });
  });
});

// ── Bind and fire once on load ────────────────────────────────
window.addEventListener('scroll', onScroll, { passive: true });
onScroll();
