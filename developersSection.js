/* ============================================================
   js/developersSection.js
   Dedicated final-section component for project credits.
   ============================================================ */

const developers = [
  {
    number: '01',
    name: 'Chandana Mali',
    role: 'Project Developer',
    github: 'https://github.com/chandanamali774-jpg',
    linkedin: 'https://www.linkedin.com/in/chandana-mali-6b69b532a?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app',
  },
  {
    number: '02',
    name: 'Tanvishaa Tummala',
    role: 'Project Developer',
    github: 'https://github.com/tanvishaareddy/Digital-Consciousness-Simulator',
    linkedin: 'https://www.linkedin.com/in/tanvishaa-tummala-123184318?utm_source=share_via&utm_content=profile&utm_medium=member_android',
  },
];

function renderDeveloperCard(developer) {
  return [
    '<article class="developer-card">',
    '  <div class="developer-card-top">',
    '    <div class="developer-index">' + developer.number + '</div>',
    '    <div class="developer-role">' + developer.role + '</div>',
    '  </div>',
    '  <h3 class="developer-name">' + developer.name + '</h3>',
    '  <p class="developer-copy">Crafting the simulator experience, interface flow, and final presentation layer.</p>',
    '  <div class="developer-links">',
    '    <a class="developer-link" href="' + developer.github + '" target="_blank" rel="noreferrer">GitHub</a>',
    '    <a class="developer-link" href="' + developer.linkedin + '" target="_blank" rel="noreferrer">LinkedIn</a>',
    '  </div>',
    '</article>',
  ].join('');
}

function initDevelopersSection() {
  const root = document.getElementById('developers-root');
  if (!root) return;

  root.innerHTML = [
    '<div class="section-header developers-header">',
    '  <div class="section-label">DEVELOPERS</div>',
    '  <div class="section-title">Built By</div>',
    '</div>',
    '<p class="developers-support">The Digital Consciousness Simulator was shaped by a focused team building the interface, atmosphere, and final interactive experience.</p>',
    '<div class="developers-grid">',
    developers.map(renderDeveloperCard).join(''),
    '</div>',
  ].join('');
}

initDevelopersSection();
