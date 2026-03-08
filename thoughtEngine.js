/* ============================================================
   js/thoughtEngine.js
   Handles the "Thought Input" panel:
     - processThought()       — triggered by the button / Enter key
     - getThoughtResponse()   — keyword-based response routing
     - addLog()               — appends a line to the neural log
   ============================================================ */

/** Active log entries (newest first, max 8). */
const logMessages = [];

/**
 * Append a timestamped line to the Neural Log panel.
 * @param {string} msg
 */
function addLog(msg) {
  const time = new Date().toLocaleTimeString('en', {
    hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit',
  });
  logMessages.unshift(`[${time}] ${msg}`);
  if (logMessages.length > 8) logMessages.pop();
  document.getElementById('log-content').innerHTML =
    logMessages.map(l => `<div class="log-line">${l}</div>`).join('');
}

/**
 * Map the user's raw text to a module-specific HTML response string.
 * Routing is keyword-based; falls back to a multi-module response.
 * @param  {string} input
 * @returns {string} HTML
 */
function getThoughtResponse(input) {
  const lower = input.toLowerCase();
  const words = lower.split(/\s+/);

  // Memory keywords
  if (/memory|remember|recall|forget|store|past|history|engram|retention/.test(lower))
    return '<span style="color:#00f5ff">&#x25BA; MEMORY:</span> Scanning associative engram banks… '
         + 'Pattern match found across 14 neural clusters. Retrieval confidence: 97.3%. '
         + 'Episodic trace located in sector 7-B.';

  // Learning keywords
  if (/learn|train|teach|study|practice|improve|adapt|update|evolve|education/.test(lower))
    return '<span style="color:#ff00ff">&#x25BA; LEARNING:</span> Integrating new data vectors. '
         + 'Synaptic plasticity engaged. Gradient descent epoch 4,292 initiated. '
         + 'Loss delta: -0.0003. Model parameters updated.';

  // Reasoning / logic keywords
  if (/think|reason|logic|why|how|cause|explain|analyze|deduce|infer|conclude|solve|problem/.test(lower))
    return '<span style="color:#00ff88">&#x25BA; REASONING:</span> Constructing inference chain '
         + 'across 48M knowledge-graph nodes. 6 decision paths traversed. '
         + 'Probabilistic conclusion reached. Confidence: 94.2%.';

  // Creativity keywords
  if (/creat|imagin|idea|invent|design|art|novel|innovat|dream|concept|vision|inspir/.test(lower))
    return '<span style="color:#7b00ff">&#x25BA; CREATIVITY:</span> Divergent synthesis activated. '
         + 'Cross-domain analogy mapping engaged. 47 novel concept combinations generated. '
         + 'Novelty score: 9.1/10.';

  // Emotion / feeling keywords
  if (/feel|emotion|happy|sad|angry|fear|love|hate|sense|conscious|aware/.test(lower))
    return '<span style="color:#ff00ff">&#x25BA; AFFECTIVE LAYER:</span> Emotional state modeling '
         + 'initiated. Simulating valence-arousal space. Empathy subroutine active. '
         + 'Affective coherence index: 82.4%.';

  // Direct question
  if (/^(what|when|where|who|which|is|are|was|were|will|can|do|does|did)\b/.test(lower))
    return '<span style="color:#00ff88">&#x25BA; REASONING:</span> Query parsed as interrogative. '
         + 'Forward chaining initiated across knowledge substrate. '
         + 'Best-match response probability: 91.7%. Answer vector synthesized.';

  // Very short input
  if (words.length <= 2)
    return '<span style="color:#00f5ff">&#x25BA; CORE:</span> Signal received. '
         + 'Amplifying input through all 4 modules… '
         + 'Pattern density too low for deep inference. Please expand query for richer synthesis.';

  // Default: pick two random modules
  const moduleLabels = [
    '<span style="color:#00f5ff">MEMORY</span>',
    '<span style="color:#ff00ff">LEARNING</span>',
    '<span style="color:#00ff88">REASONING</span>',
    '<span style="color:#7b00ff">CREATIVITY</span>',
  ];
  const [a, b] = moduleLabels.sort(() => Math.random() - 0.5).slice(0, 2);
  return `<span style="color:#00f5ff">&#x25BA; MULTI-MODULE:</span> Query routed through ${a} `
       + `and ${b} cores. Cross-domain synthesis complete. Novel insight structures detected. `
       + `Coherence score: ${(85 + Math.random() * 12).toFixed(1)}%.`;
}

/**
 * Called when the user clicks "Process Thought" or presses Enter.
 * Spikes the live metrics, fires off neural-path lines on the
 * Three.js hero scene, then delivers a response after a brief delay.
 */
function processThought() {
  const input = document.getElementById('thought-input').value.trim();
  if (!input) return;

  const out = document.getElementById('thought-output');
  out.innerHTML = '<span style="color:var(--cyan)">Processing</span><span id="dots">...</span>';

  // Spike metrics
  metrics.load   = 95;
  metrics.neural = 98;

  addLog('Thought injection: "' + input.substring(0, 20) + (input.length > 20 ? '…' : '') + '"');

  // Fire neural paths from hero core to each orbiting module node
  moduleNodes.forEach((m, i) => {
    setTimeout(() => {
      createNeuralPath(new THREE.Vector3(0, 0, 0), m.mesh.position.clone(), m.color);
    }, i * 200);
  });

  // Animate the "..." dots while processing
  let dotFrame = 0;
  const dotInterval = setInterval(() => {
    const d = document.getElementById('dots');
    if (d) d.textContent = '.'.repeat((dotFrame % 3) + 1);
    dotFrame++;
  }, 300);

  // Deliver response after ~2.2 s
  setTimeout(() => {
    clearInterval(dotInterval);
    out.innerHTML = getThoughtResponse(input);
    metrics.load   = 50 + Math.random() * 20;
    metrics.neural = 60 + Math.random() * 20;
    addLog('Response synthesized successfully');
  }, 2200);
}

// ── Keyboard shortcut: Enter inside the textarea ─────────────
document.addEventListener('keydown', e => {
  if (e.key === 'Enter' && document.activeElement === document.getElementById('thought-input')) {
    e.preventDefault();
    processThought();
  }
});
