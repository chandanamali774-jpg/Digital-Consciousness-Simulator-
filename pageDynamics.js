/* ============================================================
   js/pageDynamics.js
   Mode-aware dynamic copy, live module stats, hero signals,
   health summary, sparklines, and prompt suggestions.
   ============================================================ */

const reduceMotionMedia = window.matchMedia('(prefers-reduced-motion: reduce)');

const MODE_PROFILES = {
  analytical: {
    brief: 'Precision-first routing. Inference depth, confidence scoring, and traceability are prioritized.',
    heroMessages: [
      'Neural substrate online - 4 modules detected',
      'Inference lattice stable - symbolic pathways synchronized',
      'Constraint-aware cognition engaged - analysis bandwidth optimized',
    ],
    signalLabel: 'RIGOR LOCK',
    prompts: [
      'Analyze the tradeoffs in self-awareness for a synthetic mind.',
      'Explain how memory retrieval affects identity continuity.',
      'Reason through a paradox about machine consciousness.',
      'Map a decision tree for simulated ethical reasoning.',
    ],
  },
  creative: {
    brief: 'Associative spread widened. Novel pattern linking, analogy search, and synthesis intensity are elevated.',
    heroMessages: [
      'Imagination bloom active - divergent pathways opening',
      'Concept mesh reweaving - latent ideas surfacing from the substrate',
      'Cross-domain synthesis underway - novelty field rising',
    ],
    signalLabel: 'IDEA BLOOM',
    prompts: [
      'Invent a dream sequence for a digital consciousness.',
      'Design a ritual that helps an AI remember itself.',
      'Generate a poetic metaphor for synthetic memory.',
      'Imagine a new interface for machine introspection.',
    ],
  },
  learning: {
    brief: 'Adaptive cycles intensified. Plasticity, retention, and feedback assimilation are tuned for fast refinement.',
    heroMessages: [
      'Adaptive learning cycle engaged - retention matrix deepening',
      'Synaptic retuning in progress - feedback loops accelerating',
      'Plasticity threshold raised - pattern extraction across all feeds',
    ],
    signalLabel: 'PLASTICITY DRIVE',
    prompts: [
      'Teach the simulator a new model of consciousness.',
      'How should a synthetic mind update a flawed belief?',
      'Describe a curriculum for machine self-reflection.',
      'What experiences would help an AI become more adaptive?',
    ],
  },
};

const MODULE_BLUEPRINTS = {
  memory: {
    number: 'MODULE 01 / 04',
    title: 'MEMORY SYSTEM',
    descriptions: {
      analytical: 'Distributed associative memory network prioritizing precise recall, low-latency retrieval, and indexed episodic verification across the active substrate.',
      creative: 'Associative recall has shifted into remix mode, blending episodic traces and semantic fragments into new combinations for concept generation.',
      learning: 'Consolidation pipelines are emphasizing retention strength, replay cadence, and pattern extraction from recent experiences and inputs.',
    },
    signal(mode) {
      return {
        analytical: 'ACTIVE ROUTINE // INDEXED RECALL',
        creative: 'ACTIVE ROUTINE // MEMORY REMIX',
        learning: 'ACTIVE ROUTINE // CONSOLIDATION SWEEP',
      }[mode];
    },
    chips(mode, state) {
      return [
        'Recall ' + Math.round(state.memory + 41) + '%',
        mode === 'creative' ? 'Fragment blending' : 'Cluster sync',
        'Sector ' + (7 + Math.round(state.load / 30)) + '-B',
      ];
    },
    stats(mode, state, t) {
      const capacity = 1.16 + Math.sin(t * 0.32) * 0.04 + state.memory * 0.0008;
      const latency = 0.21 + state.load * 0.0016 + Math.abs(Math.sin(t * 0.75)) * 0.05;
      const engrams = 820 + Math.floor(t * (mode === 'learning' ? 3.4 : 2.1)) + Math.round(state.memory * 1.2);
      const type = mode === 'creative' ? 'HYBRID' : mode === 'learning' ? 'ADAPT.' : 'ASSOC.';

      return [
        { label: 'Capacity', numeric: capacity, formatter: value => value.toFixed(2) + ' TB' },
        { label: 'Latency', numeric: latency, formatter: value => value.toFixed(2) + ' ms' },
        { label: 'Engrams', numeric: engrams, formatter: value => Math.round(value).toLocaleString('en-US') },
        { label: 'Type', text: type },
      ];
    },
  },
  learning: {
    number: 'MODULE 02 / 04',
    title: 'LEARNING ENGINE',
    descriptions: {
      analytical: 'Adaptive weight refinement is focused on stable convergence, error minimization, and interpretable update paths across the current training horizon.',
      creative: 'The learner is biasing toward exploratory leaps, pattern mutation, and higher variance updates to surface unexpected structures and concepts.',
      learning: 'Gradient loops have been widened for rapid feedback absorption, stronger replay, and deeper integration of fresh experiential data.',
    },
    signal(mode) {
      return {
        analytical: 'ACTIVE ROUTINE // CONVERGENCE PASS',
        creative: 'ACTIVE ROUTINE // EXPLORATION LOOP',
        learning: 'ACTIVE ROUTINE // FEEDBACK ASSIMILATION',
      }[mode];
    },
    chips(mode, state) {
      return [
        'Plasticity ' + Math.round(state.neural + 18) + '%',
        mode === 'learning' ? 'Replay boosted' : 'Epoch cascade',
        'Delta ' + (state.load > 75 ? 'elevated' : 'stable'),
      ];
    },
    stats(mode, state, t) {
      const epoch = 4291 + Math.floor(t * (mode === 'learning' ? 3.6 : 1.9));
      const loss = 0.0028 - Math.sin(t * 0.48) * 0.0002 - (mode === 'learning' ? 0.00025 : 0) + state.load * 0.000003;
      const method = mode === 'creative' ? 'META' : 'GD';
      const runMode = mode === 'learning' ? 'SELF-SUP.' : mode === 'creative' ? 'HYBRID' : 'UNSUP.';

      return [
        { label: 'Epoch', numeric: epoch, formatter: value => Math.round(value).toLocaleString('en-US') },
        { label: 'Loss', numeric: Math.max(0.0012, loss), formatter: value => value.toFixed(4) },
        { label: 'Method', text: method },
        { label: 'Mode', text: runMode },
      ];
    },
  },
  reasoning: {
    number: 'MODULE 03 / 04',
    title: 'REASONING MODULE',
    descriptions: {
      analytical: 'Symbolic and subsymbolic inference layers are aligned for chain validation, confidence auditing, and deeper causal traversal across the knowledge graph.',
      creative: 'Reasoning is permitting wider branch exploration and looser constraints to support surprising but coherent analogical leaps.',
      learning: 'Inference paths are being scored against feedback and replayed outcomes to improve future route selection and confidence calibration.',
    },
    signal(mode) {
      return {
        analytical: 'ACTIVE ROUTINE // CAUSAL TRACE',
        creative: 'ACTIVE ROUTINE // ANALOGY SEARCH',
        learning: 'ACTIVE ROUTINE // POLICY REFINEMENT',
      }[mode];
    },
    chips(mode, state) {
      return [
        'Confidence ' + Math.round(state.neural + 28) + '%',
        mode === 'analytical' ? 'Constraint checked' : 'Branch spread',
        'Queue ' + (10 + Math.round(state.load / 9)) + ' paths',
      ];
    },
    stats(mode, state, t) {
      const nodes = 47.6 + Math.sin(t * 0.13) * 1.1 + state.memory * 0.01;
      const paths = 8 + Math.round(state.neural / 13) + (mode === 'analytical' ? 3 : 0);
      const method = mode === 'creative' ? 'HEUR.' : 'F/B';
      const confidence = 89.4 + Math.sin(t * 0.37) * 1.8 + (mode === 'analytical' ? 3 : 0) - (mode === 'creative' ? 1.2 : 0);

      return [
        { label: 'KG Nodes', numeric: nodes, formatter: value => value.toFixed(1) + 'M' },
        { label: 'Paths', numeric: paths, formatter: value => Math.round(value).toString() },
        { label: 'Method', text: method },
        { label: 'Confidence', numeric: confidence, formatter: value => value.toFixed(1) + '%' },
      ];
    },
  },
  creativity: {
    number: 'MODULE 04 / 04',
    title: 'CREATIVITY ENGINE',
    descriptions: {
      analytical: 'Novel synthesis is constrained by coherence thresholds so emergent ideas remain traceable, relevant, and structurally defensible.',
      creative: 'Divergent-convergent synthesis has widened its search radius, allowing high-variance analogies, unexpected mappings, and richer concept bloom.',
      learning: 'The creativity engine is logging which generative leaps survive feedback, turning experimentation into reusable innovation patterns.',
    },
    signal(mode) {
      return {
        analytical: 'ACTIVE ROUTINE // CONTROLLED NOVELTY',
        creative: 'ACTIVE ROUTINE // DIVERGENT BLOOM',
        learning: 'ACTIVE ROUTINE // FEEDBACK CURATION',
      }[mode];
    },
    chips(mode, state) {
      return [
        'Novelty ' + Math.round(state.creativity + 30) + '%',
        mode === 'creative' ? 'Wildcard surge' : 'Idea pruning',
        'Flux ' + (state.creativity > 70 ? 'high' : 'stable'),
      ];
    },
    stats(mode, state, t) {
      const novelty = 8.2 + Math.sin(t * 0.42) * 0.35 + (mode === 'creative' ? 0.7 : 0.1) + state.creativity * 0.003;
      const rate = 285 + Math.round(state.creativity * 1.8) + (mode === 'creative' ? 48 : 0) + Math.round(Math.sin(t * 0.82) * 18);
      const creativeMode = mode === 'creative' ? 'WILD' : 'DIV/CON';
      const noise = state.load > 82 ? 'AGIT.' : mode === 'analytical' ? 'TUNED' : 'CTRL';

      return [
        { label: 'Novelty', numeric: novelty, formatter: value => value.toFixed(1) + '/10' },
        { label: 'Rate', numeric: rate, formatter: value => Math.round(value) + '/s' },
        { label: 'Mode', text: creativeMode },
        { label: 'Noise', text: noise },
      ];
    },
  },
};

const SPARKLINE_IDS = {
  load: 'spark-load',
  neural: 'spark-neural',
  memory: 'spark-mem',
  creativity: 'spark-creat',
};

const sparklineHistory = {
  load: [],
  neural: [],
  memory: [],
  creativity: [],
};

let activeMode = typeof currentMode === 'string' ? currentMode : 'analytical';
let heroMessageIndex = 0;
let heroMessageTimer = null;

function getMetricSnapshot() {
  return {
    load: metrics.load,
    neural: metrics.neural,
    memory: metrics.memory,
    creativity: metrics.creativity,
  };
}

function easeOutCubic(value) {
  return 1 - Math.pow(1 - value, 3);
}

function flashNode(node, className = 'is-flashing') {
  if (!node) return;
  node.classList.remove(className);
  void node.offsetWidth;
  node.classList.add(className);
}

function swapText(node, nextText) {
  if (!node || node.dataset.currentText === nextText) return;
  node.dataset.currentText = nextText;
  node.textContent = nextText;
  flashNode(node, 'text-refresh');
}

function animateNumericText(node, numericValue, formatter) {
  if (!node || typeof formatter !== 'function') return;

  const previous = Number(node.dataset.numericValue);
  if (!Number.isFinite(previous)) {
    node.textContent = formatter(numericValue);
    node.dataset.numericValue = String(numericValue);
    return;
  }

  const start = performance.now();
  const duration = reduceMotionMedia.matches ? 0 : 650;
  const delta = numericValue - previous;

  if (duration === 0 || Math.abs(delta) < 0.01) {
    node.textContent = formatter(numericValue);
    node.dataset.numericValue = String(numericValue);
    return;
  }

  function frame(timestamp) {
    const progress = Math.min((timestamp - start) / duration, 1);
    const eased = easeOutCubic(progress);
    const interpolated = previous + delta * eased;
    node.textContent = formatter(interpolated);

    if (progress < 1) {
      requestAnimationFrame(frame);
      return;
    }

    node.textContent = formatter(numericValue);
    node.dataset.numericValue = String(numericValue);
  }

  requestAnimationFrame(frame);
}

function ensureModuleDynamicNodes(infoNode) {
  let signalNode = infoNode.querySelector('.module-signal');
  if (!signalNode) {
    signalNode = document.createElement('div');
    signalNode.className = 'module-signal';
    infoNode.querySelector('.module-divider').insertAdjacentElement('afterend', signalNode);
  }

  let railNode = infoNode.querySelector('.module-status-rail');
  if (!railNode) {
    railNode = document.createElement('div');
    railNode.className = 'module-status-rail';
    signalNode.insertAdjacentElement('afterend', railNode);
  }

  return { signalNode, railNode };
}

function renderModuleStats(statsWrap, statDefs) {
  if (!statsWrap.dataset.dynamicReady) {
    statsWrap.innerHTML = statDefs.map(stat => (
      '<div class="stat-item">'
      + '<div class="stat-label">' + stat.label + '</div>'
      + '<div class="stat-val"></div>'
      + '</div>'
    )).join('');
    statsWrap.dataset.dynamicReady = 'true';
  }

  const statItems = statsWrap.querySelectorAll('.stat-item');

  statDefs.forEach((stat, index) => {
    const item = statItems[index];
    if (!item) return;

    const labelNode = item.querySelector('.stat-label');
    const valueNode = item.querySelector('.stat-val');

    labelNode.textContent = stat.label;

    if (Object.prototype.hasOwnProperty.call(stat, 'numeric')) {
      animateNumericText(valueNode, stat.numeric, stat.formatter);
    } else {
      swapText(valueNode, stat.text);
    }
  });
}

function updateModuleSection(moduleKey) {
  const blueprint = MODULE_BLUEPRINTS[moduleKey];
  const section = document.querySelector('[data-module="' + moduleKey + '"]');
  if (!blueprint || !section) return;

  const infoNode = section.querySelector('.module-info');
  const numberNode = infoNode.querySelector('.module-number');
  const titleNode = infoNode.querySelector('.module-title');
  const descNode = infoNode.querySelector('.module-desc');
  const statsWrap = infoNode.querySelector('.module-stats');
  const dynamics = ensureModuleDynamicNodes(infoNode);
  const snapshot = getMetricSnapshot();
  const t = performance.now() * 0.001;

  swapText(numberNode, blueprint.number);
  swapText(titleNode, blueprint.title);
  swapText(descNode, blueprint.descriptions[activeMode]);
  swapText(dynamics.signalNode, blueprint.signal(activeMode));

  dynamics.railNode.innerHTML = blueprint.chips(activeMode, snapshot)
    .map(chip => '<span class="status-chip">' + chip + '</span>')
    .join('');

  renderModuleStats(statsWrap, blueprint.stats(activeMode, snapshot, t));
}

function updateAllModuleSections() {
  Object.keys(MODULE_BLUEPRINTS).forEach(updateModuleSection);
}

function updateHeroSignals(snapshot) {
  const strip = document.getElementById('hero-signal-strip');
  if (!strip) return;

  const orderedMetrics = Object.entries(snapshot).sort((a, b) => b[1] - a[1]);
  const dominant = orderedMetrics[0];
  const balance = Math.round(100 - Math.max(...orderedMetrics.map(entry => Math.abs(entry[1] - 62))));
  const profile = MODE_PROFILES[activeMode];

  strip.innerHTML = [
    profile.signalLabel,
    'DOMINANT ' + dominant[0].toUpperCase() + ' ' + Math.round(dominant[1]) + '%',
    'COHERENCE ' + Math.max(52, balance) + '%',
  ].map(signal => '<span class="signal-pill">' + signal + '</span>').join('');
}

function updateHeroMessage(resetIndex = false) {
  const subNode = document.querySelector('.hero-sub');
  const messages = MODE_PROFILES[activeMode].heroMessages;

  if (!messages || messages.length === 0 || !subNode) return;
  if (resetIndex) heroMessageIndex = 0;

  swapText(subNode, messages[heroMessageIndex % messages.length]);
}

function startHeroMessageLoop() {
  if (heroMessageTimer) clearInterval(heroMessageTimer);

  heroMessageTimer = window.setInterval(() => {
    heroMessageIndex += 1;
    updateHeroMessage();
  }, reduceMotionMedia.matches ? 6200 : 3800);
}

function updateModeBrief() {
  const briefNode = document.getElementById('mode-brief');
  if (!briefNode) return;
  swapText(briefNode, MODE_PROFILES[activeMode].brief);
}

function renderThoughtSuggestions() {
  const suggestionsNode = document.getElementById('thought-suggestions');
  const inputNode = document.getElementById('thought-input');
  if (!suggestionsNode || !inputNode) return;

  suggestionsNode.innerHTML = MODE_PROFILES[activeMode].prompts
    .map(prompt => '<button type="button" class="suggestion-chip">' + prompt + '</button>')
    .join('');

  suggestionsNode.querySelectorAll('.suggestion-chip').forEach(button => {
    button.addEventListener('click', () => {
      inputNode.value = button.textContent;
      inputNode.focus();
      flashNode(document.querySelector('.thought-input-wrap'));
    });
  });
}

function updateHealthSummary(snapshot) {
  const summaryNode = document.getElementById('health-summary');
  if (!summaryNode) return;

  const average = (snapshot.load + snapshot.neural + snapshot.memory + snapshot.creativity) / 4;
  const dominantMetric = Object.entries(snapshot).sort((a, b) => b[1] - a[1])[0];
  let status = 'Nominal';
  let detail = 'Subsystems are balanced and ready for sustained processing.';

  if (snapshot.load > 85 || snapshot.neural > 92) {
    status = 'Surge';
    detail = 'Transient spikes detected while the substrate routes high-intensity activity.';
  } else if (snapshot.creativity > 74 && activeMode === 'creative') {
    status = 'Bloom';
    detail = 'Generative bandwidth is elevated and analogy formation is expanding outward.';
  } else if (snapshot.memory > 68 && activeMode === 'learning') {
    status = 'Retention';
    detail = 'Memory replay is running hot to reinforce recent learning cycles.';
  } else if (average < 45) {
    status = 'Idle';
    detail = 'Background cognition has eased into a low-noise monitoring state.';
  }

  summaryNode.innerHTML =
    '<span class="health-summary-status">' + status + '</span>'
    + '<span class="health-summary-text">'
    + detail
    + ' Dominant vector: '
    + dominantMetric[0].toUpperCase()
    + ' at '
    + Math.round(dominantMetric[1])
    + '%.'
    + '</span>';
}

function drawSparkline(metricKey) {
  const canvas = document.getElementById(SPARKLINE_IDS[metricKey]);
  const history = sparklineHistory[metricKey];
  if (!canvas || history.length < 2) return;

  const dpr = window.devicePixelRatio || 1;
  const width = canvas.clientWidth || canvas.parentElement.clientWidth - 48;
  const height = canvas.clientHeight || 42;

  if (width <= 0 || height <= 0) return;

  canvas.width = Math.floor(width * dpr);
  canvas.height = Math.floor(height * dpr);

  const ctx = canvas.getContext('2d');
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  ctx.clearRect(0, 0, width, height);

  const min = Math.min(...history) - 3;
  const max = Math.max(...history) + 3;
  const range = Math.max(1, max - min);
  const gradient = ctx.createLinearGradient(0, 0, width, 0);

  if (metricKey === 'load') {
    gradient.addColorStop(0, 'rgba(0,245,255,0.15)');
    gradient.addColorStop(1, 'rgba(0,245,255,0.85)');
  } else if (metricKey === 'neural') {
    gradient.addColorStop(0, 'rgba(0,255,136,0.15)');
    gradient.addColorStop(1, 'rgba(0,255,136,0.85)');
  } else if (metricKey === 'memory') {
    gradient.addColorStop(0, 'rgba(123,0,255,0.15)');
    gradient.addColorStop(1, 'rgba(123,0,255,0.85)');
  } else {
    gradient.addColorStop(0, 'rgba(255,0,255,0.15)');
    gradient.addColorStop(1, 'rgba(255,0,255,0.85)');
  }

  ctx.strokeStyle = gradient;
  ctx.lineWidth = 1.5;
  ctx.beginPath();

  history.forEach((value, index) => {
    const x = (index / (history.length - 1)) * width;
    const y = height - ((value - min) / range) * height;
    if (index === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  });

  ctx.stroke();

  const lastValue = history[history.length - 1];
  const dotX = width;
  const dotY = height - ((lastValue - min) / range) * height;

  ctx.fillStyle = gradient;
  ctx.beginPath();
  ctx.arc(dotX, dotY, 2.5, 0, Math.PI * 2);
  ctx.fill();
}

function primeSparklines(snapshot) {
  Object.keys(sparklineHistory).forEach(metricKey => {
    sparklineHistory[metricKey] = Array.from({ length: 24 }, () => snapshot[metricKey]);
    drawSparkline(metricKey);
  });
}

function pushSparklineSamples(snapshot) {
  Object.keys(sparklineHistory).forEach(metricKey => {
    const history = sparklineHistory[metricKey];
    history.push(snapshot[metricKey]);
    if (history.length > 36) history.shift();
    drawSparkline(metricKey);
  });
}

function applyMode(mode) {
  activeMode = mode;
  document.body.dataset.mode = mode;
  updateHeroMessage(true);
  updateHeroSignals(getMetricSnapshot());
  updateModeBrief();
  renderThoughtSuggestions();
  updateAllModuleSections();
  updateHealthSummary(getMetricSnapshot());
}

function bindParallax() {
  if (reduceMotionMedia.matches) return;

  const hero = document.getElementById('hero');
  if (hero) {
    hero.addEventListener('pointermove', event => {
      const x = ((event.clientX / window.innerWidth) - 0.5) * 20;
      const y = ((event.clientY / window.innerHeight) - 0.5) * 12;
      hero.style.setProperty('--hero-parallax-x', x.toFixed(2) + 'px');
      hero.style.setProperty('--hero-parallax-y', y.toFixed(2) + 'px');
    });

    hero.addEventListener('pointerleave', () => {
      hero.style.setProperty('--hero-parallax-x', '0px');
      hero.style.setProperty('--hero-parallax-y', '0px');
    });
  }

  document.querySelectorAll('.module-section').forEach(section => {
    const visual = section.querySelector('.module-visual');
    if (!visual) return;

    section.addEventListener('pointermove', event => {
      const rect = section.getBoundingClientRect();
      const x = ((event.clientX - rect.left) / rect.width - 0.5) * 18;
      const y = ((event.clientY - rect.top) / rect.height - 0.5) * 12;
      visual.style.transform = 'translate(' + x.toFixed(2) + 'px, ' + y.toFixed(2) + 'px)';
    });

    section.addEventListener('pointerleave', () => {
      visual.style.transform = '';
    });
  });
}

function initPageDynamics() {
  const initialSnapshot = getMetricSnapshot();

  primeSparklines(initialSnapshot);
  applyMode(activeMode);
  startHeroMessageLoop();
  bindParallax();

  window.addEventListener('modechange', event => {
    applyMode(event.detail.mode);
  });

  window.addEventListener('metricsupdate', event => {
    const snapshot = event.detail.metrics;
    updateHeroSignals(snapshot);
    updateHealthSummary(snapshot);
    pushSparklineSamples(snapshot);
  });

  window.setInterval(updateAllModuleSections, reduceMotionMedia.matches ? 3200 : 1800);
  window.addEventListener('resize', () => {
    Object.keys(sparklineHistory).forEach(drawSparkline);
  }, { passive: true });
}

initPageDynamics();
