/* ============================================================
   js/moduleAnimations.js
   Canvas 2-D background animations for the four module sections.

   Each function is self-contained; call them after the DOM is ready.
   - initMemoryCanvas()    → #canvas-memory
   - initLearningCanvas()  → #canvas-learning
   - initReasoningCanvas() → #canvas-reasoning
   - initCreativityCanvas()→ #canvas-creativity
   ============================================================ */

/* ── MEMORY ───────────────────────────────────────────────────
   Theme: Hexagonal memory grid with propagating recall pulses.
   Lit cells reveal hex addresses; data-stream lines sweep across.
   ──────────────────────────────────────────────────────────── */
function initMemoryCanvas() {
  const canvas = document.getElementById('canvas-memory');
  const ctx    = canvas.getContext('2d');
  let w, h, hexes = [];

  function resize() {
    w = canvas.width  = canvas.offsetWidth;
    h = canvas.height = canvas.offsetHeight;
    hexes = [];

    const size = 38;
    const rows = Math.ceil(h / (size * 1.7))  + 2;
    const cols = Math.ceil(w / (size * 1.73)) + 2;

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        hexes.push({
          x:         c * size * 1.73 + (r % 2) * size * 0.865,
          y:         r * size * 1.5,
          size,
          baseAlpha: 0.03 + Math.random() * 0.06,
          lit:       false,
          litTime:   -99,
          addr:      '0x' + Math.floor(Math.random() * 0xFFFF)
                           .toString(16).toUpperCase().padStart(4, '0'),
        });
      }
    }
  }

  /** Draw a flat-top hexagon path centred at (x, y). */
  function hexPath(x, y, s) {
    ctx.beginPath();
    for (let i = 0; i < 6; i++) {
      const a = (Math.PI / 180) * (60 * i - 30);
      i === 0
        ? ctx.moveTo(x + s * Math.cos(a), y + s * Math.sin(a))
        : ctx.lineTo(x + s * Math.cos(a), y + s * Math.sin(a));
    }
    ctx.closePath();
  }

  let t = 0, lastPulse = 0;

  function draw() {
    t += 0.009;
    ctx.clearRect(0, 0, w, h);

    // Radial ambient glow
    const grd = ctx.createRadialGradient(w * 0.35, h * 0.5, 0, w * 0.35, h * 0.5, w * 0.55);
    grd.addColorStop(0, 'rgba(0,245,255,0.05)');
    grd.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = grd;
    ctx.fillRect(0, 0, w, h);

    // Trigger a recall pulse roughly every 1.2 s
    if (t - lastPulse > 1.2) {
      lastPulse = t;
      const origin = hexes[Math.floor(Math.random() * hexes.length)];
      if (origin) {
        origin.lit     = true;
        origin.litTime = t;
        hexes.forEach(hx => {
          const dx = hx.x - origin.x, dy = hx.y - origin.y;
          const d  = Math.sqrt(dx * dx + dy * dy);
          if (d < 180 && d > 1) {
            setTimeout(() => { hx.lit = true; hx.litTime = t + d * 0.004; }, d * 2.5);
          }
        });
      }
    }

    // Render hexagons
    hexes.forEach(hx => {
      const age = t - hx.litTime;
      const la  = hx.lit ? Math.max(0, 0.7 - age * 0.45) : 0;
      if (hx.lit && la <= 0) hx.lit = false;

      hexPath(hx.x, hx.y, hx.size - 2);
      ctx.strokeStyle = `rgba(0,245,255,${hx.baseAlpha + la * 0.75})`;
      ctx.lineWidth   = la > 0.3 ? 1.5 : 0.5;
      ctx.stroke();

      if (la > 0.35) {
        hexPath(hx.x, hx.y, hx.size - 2);
        ctx.fillStyle = `rgba(0,245,255,${la * 0.07})`;
        ctx.fill();
        // Memory address label
        ctx.fillStyle  = `rgba(0,245,255,${la * 0.65})`;
        ctx.font       = '7px monospace';
        ctx.textAlign  = 'center';
        ctx.fillText(hx.addr, hx.x, hx.y + 3);
      }
    });

    // Sweeping dashed data-stream lines
    for (let i = 0; i < 4; i++) {
      const y  = ((t * 30 * (i + 1) * 0.35) % h);
      const sg = ctx.createLinearGradient(0, 0, w, 0);
      sg.addColorStop(0,   'rgba(0,245,255,0)');
      sg.addColorStop(0.3, 'rgba(0,245,255,0.12)');
      sg.addColorStop(0.7, 'rgba(0,245,255,0.12)');
      sg.addColorStop(1,   'rgba(0,245,255,0)');
      ctx.strokeStyle = sg;
      ctx.lineWidth   = 0.5;
      ctx.setLineDash([3, 14]);
      ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke();
      ctx.setLineDash([]);
    }

    // Floating address tokens
    for (let i = 0; i < 3; i++) {
      const lx = ((Math.sin(t * 0.3 + i * 2.1) + 1) / 2) * w;
      const ly = ((Math.cos(t * 0.2 + i * 1.7) + 1) / 2) * h;
      ctx.fillStyle = `rgba(0,245,255,${0.06 + Math.sin(t + i) * 0.04})`;
      ctx.font      = '8px monospace';
      ctx.textAlign = 'center';
      ctx.fillText('MEM[' + ((i * 0x100 + Math.floor(t * 10)) % 256).toString(16).toUpperCase() + ']', lx, ly);
    }

    requestAnimationFrame(draw);
  }

  resize();
  draw();
  window.addEventListener('resize', resize);
}


/* ── LEARNING ─────────────────────────────────────────────────
   Theme: Multi-layer neural network with animated forward-pass
   wave. Activation dots travel along edges; loss curve shown in
   the bottom-left corner.
   ──────────────────────────────────────────────────────────── */
function initLearningCanvas() {
  const canvas = document.getElementById('canvas-learning');
  const ctx    = canvas.getContext('2d');
  let w, h, nodes = [], edges = [];

  function resize() {
    w = canvas.width  = canvas.offsetWidth;
    h = canvas.height = canvas.offsetHeight;
    nodes = [];
    edges = [];

    const layers = [3, 5, 6, 5, 3];
    const lx = layers.map((_, i) => w * 0.08 + i * (w * 0.84) / (layers.length - 1));

    layers.forEach((cnt, li) => {
      for (let ni = 0; ni < cnt; ni++) {
        nodes.push({
          x:     lx[li],
          y:     h / 2 + (ni - (cnt - 1) / 2) * (h * 0.13),
          layer: li,
          act:   0,
          actT:  -99,
        });
      }
    });

    // Connect every node to every node in the next layer
    nodes.forEach((n, i) => {
      nodes.forEach((m, j) => {
        if (m.layer === n.layer + 1)
          edges.push({ fi: i, ti: j, pulseT: -99, pulsing: false });
      });
    });
  }

  let t = 0, waveLayer = 0, waveTime = 0;

  function triggerForwardPass() {
    waveLayer = 0;
    waveTime  = t;
    nodes.filter(n => n.layer === 0).forEach(n => { n.act = 1; n.actT = t; });
  }

  function draw() {
    t += 0.013;
    ctx.clearRect(0, 0, w, h);

    // Ambient magenta glow
    const grd = ctx.createRadialGradient(w * 0.5, h * 0.5, 0, w * 0.5, h * 0.5, w * 0.5);
    grd.addColorStop(0, 'rgba(255,0,255,0.035)');
    grd.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = grd;
    ctx.fillRect(0, 0, w, h);

    // Advance the wave to the next layer
    if (t - waveTime > 0.55 && waveLayer < 4) {
      waveLayer++;
      waveTime = t;
      nodes.filter(n => n.layer === waveLayer).forEach(n => { n.act = 1; n.actT = t; });
      edges.filter(e => nodes[e.fi].layer === waveLayer - 1).forEach(e => {
        e.pulsing = true;
        e.pulseT  = t;
      });
    }
    if (t - waveTime > 0.55 && waveLayer >= 4) setTimeout(triggerForwardPass, 700);

    // Edges + travelling dots
    edges.forEach(e => {
      const fn  = nodes[e.fi], tn = nodes[e.ti];
      const age = t - e.pulseT;
      const pa  = e.pulsing ? Math.max(0, 0.8 - age * 0.6) : 0;

      ctx.strokeStyle = `rgba(255,0,255,${0.05 + pa * 0.28})`;
      ctx.lineWidth   = 0.5 + pa * 0.8;
      ctx.beginPath();
      ctx.moveTo(fn.x, fn.y);
      ctx.lineTo(tn.x, tn.y);
      ctx.stroke();

      if (e.pulsing && age < 1.0) {
        const prog = Math.min(age / 0.55, 1);
        const px   = fn.x + (tn.x - fn.x) * prog;
        const py   = fn.y + (tn.y - fn.y) * prog;
        ctx.beginPath();
        ctx.arc(px, py, 2.5, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,0,255,${0.9 - age * 0.7})`;
        ctx.fill();
      }
    });

    // Nodes with glow
    nodes.forEach(n => {
      const age  = t - n.actT;
      const glow = n.act ? Math.min(1, age * 3.5) * Math.max(0, 1 - age * 0.7) : 0;

      if (glow > 0) {
        const rg = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, 22);
        rg.addColorStop(0, `rgba(255,0,255,${glow * 0.3})`);
        rg.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.fillStyle = rg;
        ctx.beginPath(); ctx.arc(n.x, n.y, 22, 0, Math.PI * 2); ctx.fill();
      }

      ctx.beginPath();
      ctx.arc(n.x, n.y, 5 + glow * 4, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(255,0,255,${0.25 + glow * 0.75})`;
      ctx.lineWidth   = 1.5;
      ctx.stroke();
      ctx.fillStyle   = `rgba(255,0,255,${0.04 + glow * 0.18})`;
      ctx.fill();
    });

    // Loss curve (bottom-left)
    ctx.strokeStyle = 'rgba(255,0,255,0.25)';
    ctx.lineWidth   = 1.2;
    ctx.beginPath();
    for (let x = 0; x < 130; x++) {
      const ly = h - 35 - Math.exp(-x * 0.038) * 55 + Math.sin(x * 0.25 + t * 2) * 2.5;
      x === 0 ? ctx.moveTo(18 + x, ly) : ctx.lineTo(18 + x, ly);
    }
    ctx.stroke();

    ctx.fillStyle = 'rgba(255,255,255,0.25)';
    ctx.font      = '8px monospace';
    ctx.textAlign = 'left';
    ctx.fillText('LOSS', 20, h - 98);

    ctx.fillStyle = 'rgba(255,0,255,0.3)';
    ctx.font      = '10px monospace';
    ctx.textAlign = 'right';
    ctx.fillText('EPOCH:' + (4291 + Math.floor(t * 2)), w - 20, h - 20);

    requestAnimationFrame(draw);
  }

  resize();
  triggerForwardPass();
  draw();
  window.addEventListener('resize', resize);
}


/* ── REASONING ────────────────────────────────────────────────
   Theme: Animated decision tree with truth-value propagation.
   Nodes light up sequentially with confidence scores; binary
   rain cascades on the right edge.
   ──────────────────────────────────────────────────────────── */
function initReasoningCanvas() {
  const canvas = document.getElementById('canvas-reasoning');
  const ctx    = canvas.getContext('2d');
  let w, h, tree = [];

  function buildTree() {
    tree = [];

    function addNode(x, y, depth) {
      const node = {
        x, y, depth,
        act:   false,
        actT:  -99,
        lbl:   depth === 0 ? 'ROOT' : (Math.random() > 0.5 ? 'TRUE' : 'FALSE'),
        conf:  (70 + Math.random() * 28).toFixed(0),
      };
      tree.push(node);
      if (depth < 4) {
        const spread     = (h * 0.28) / (depth + 1);
        const childCount = depth < 2 ? 2 : (Math.random() > 0.35 ? 2 : 1);
        for (let i = 0; i < childCount; i++) {
          addNode(x + w * 0.18, y + (i - (childCount - 1) / 2) * spread, depth + 1);
        }
      }
    }

    addNode(w * 0.1, h * 0.5, 0);
  }

  function resize() {
    w = canvas.width  = canvas.offsetWidth;
    h = canvas.height = canvas.offsetHeight;
    buildTree();
  }

  let t = 0;

  /** Recursively activate a node and schedule its children. */
  function activate(idx, delay) {
    setTimeout(() => {
      if (!tree[idx]) return;
      tree[idx].act  = true;
      tree[idx].actT = t;
      tree.forEach((n, j) => {
        if (n.depth === tree[idx].depth + 1) {
          const dy = Math.abs(n.y - tree[idx].y);
          if (dy < h * 0.32 / (tree[idx].depth + 1) + 15)
            activate(j, 380 + Math.random() * 250);
        }
      });
    }, delay);
  }

  /** Reset the tree and start a fresh propagation. */
  function triggerReasoning() {
    tree.forEach(n => { n.act = false; n.actT = -99; });
    activate(0, 0);
    setTimeout(triggerReasoning, 5000);
  }

  // Binary-rain columns
  const rainCols = [];

  function initRain() {
    rainCols.length = 0;
    for (let i = 0; i < 12; i++) {
      rainCols.push({ x: w * 0.72 + i * (w * 0.028), y: Math.random() * h, speed: 1.5 + Math.random() * 2 });
    }
  }

  function draw() {
    t += 0.01;
    ctx.clearRect(0, 0, w, h);

    // Ambient green glow
    const grd = ctx.createRadialGradient(w * 0.45, h * 0.5, 0, w * 0.45, h * 0.5, w * 0.5);
    grd.addColorStop(0, 'rgba(0,255,136,0.03)');
    grd.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = grd;
    ctx.fillRect(0, 0, w, h);

    // Binary rain
    ctx.font = '11px monospace';
    rainCols.forEach(rc => {
      rc.y += rc.speed;
      if (rc.y > h) rc.y = 0;
      for (let j = 0; j < 18; j++) {
        const cy    = rc.y - j * 18;
        const alpha = Math.max(0, 0.18 - j * 0.01);
        if (cy > 0 && cy < h) {
          ctx.fillStyle = `rgba(0,255,136,${alpha})`;
          ctx.fillText(Math.random() > 0.5 ? '1' : '0', rc.x, cy);
        }
      }
    });

    // Tree edges with bezier curves
    for (let i = 1; i < tree.length; i++) {
      let parent = null, minDist = Infinity;
      tree.forEach(p => {
        if (p.depth === tree[i].depth - 1) {
          const d = Math.abs(p.y - tree[i].y);
          if (d < minDist) { minDist = d; parent = p; }
        }
      });
      if (!parent) continue;

      const age = t - tree[i].actT;
      const al  = tree[i].act ? Math.min(0.7, age * 2.5) : 0.07;
      const cpx = (parent.x + tree[i].x) / 2;

      ctx.strokeStyle = `rgba(0,255,136,${al})`;
      ctx.lineWidth   = al > 0.3 ? 1.5 : 0.6;
      ctx.setLineDash(tree[i].act ? [] : [3, 7]);
      ctx.beginPath();
      ctx.moveTo(parent.x, parent.y);
      ctx.bezierCurveTo(cpx, parent.y, cpx, tree[i].y, tree[i].x, tree[i].y);
      ctx.stroke();
      ctx.setLineDash([]);

      // Travelling pulse dot
      if (tree[i].act && age < 0.5) {
        const prog = age / 0.5;
        const px   = parent.x + (tree[i].x - parent.x) * prog;
        const py   = parent.y + (tree[i].y - parent.y) * prog;
        ctx.beginPath(); ctx.arc(px, py, 3, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(0,255,136,${0.9 - age})`;
        ctx.fill();
      }
    }

    // Tree nodes
    tree.forEach(n => {
      const age  = t - n.actT;
      const glow = n.act ? Math.min(1, age * 3) * Math.max(0, 1 - age * 0.5) : 0;

      if (glow > 0) {
        const rg = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, 24);
        rg.addColorStop(0, `rgba(0,255,136,${glow * 0.28})`);
        rg.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.fillStyle = rg;
        ctx.beginPath(); ctx.arc(n.x, n.y, 24, 0, Math.PI * 2); ctx.fill();
      }

      ctx.beginPath(); ctx.arc(n.x, n.y, 7, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(0,255,136,${0.2 + glow * 0.8})`;
      ctx.lineWidth   = glow > 0.5 ? 2 : 1;
      ctx.stroke();
      ctx.fillStyle   = `rgba(0,255,136,${0.04 + glow * 0.15})`;
      ctx.fill();

      if (glow > 0.25) {
        ctx.fillStyle  = `rgba(0,255,136,${glow * 0.7})`;
        ctx.font       = '9px monospace';
        ctx.textAlign  = 'center';
        ctx.fillText(n.lbl, n.x, n.y - 15);
        ctx.fillStyle  = `rgba(0,255,136,${glow * 0.4})`;
        ctx.font       = '7px monospace';
        ctx.fillText(n.conf + '%', n.x, n.y + 20);
      }
    });

    requestAnimationFrame(draw);
  }

  resize();
  setTimeout(triggerReasoning, 200);
  draw();
  window.addEventListener('resize', () => { resize(); initRain(); });
  initRain();
}


/* ── CREATIVITY ───────────────────────────────────────────────
   Theme: Blooming idea tendrils exploding from random points,
   floating concept-word tokens, rotating kaleidoscope rings,
   and stochastic noise sparks.
   ──────────────────────────────────────────────────────────── */
function initCreativityCanvas() {
  const canvas = document.getElementById('canvas-creativity');
  const ctx    = canvas.getContext('2d');
  let w, h, ideas = [], floaters = [];

  const PALETTE  = [[123,0,255],[180,0,255],[255,0,200],[220,80,255],[100,0,200]];
  const CONCEPTS = ['IDEA','NOVEL','SYNTH','CREATE','SPARK','INVENT','DREAM','BLEND','MORPH','FUSE','IMAGINE','CONCEPT'];

  function resize() {
    w = canvas.width  = canvas.offsetWidth;
    h = canvas.height = canvas.offsetHeight;

    floaters = Array.from({ length: 10 }, () => ({
      word:  CONCEPTS[Math.floor(Math.random() * CONCEPTS.length)],
      x:     Math.random() * w,
      y:     Math.random() * h,
      vx:    (Math.random() - 0.5) * 0.35,
      vy:    (Math.random() - 0.5) * 0.35,
      alpha: 0.04 + Math.random() * 0.09,
      size:  9 + Math.floor(Math.random() * 9),
    }));
  }

  /** Spawn a new idea burst at a random canvas position. */
  function spawnIdea() {
    const cx  = w * (0.25 + Math.random() * 0.5);
    const cy  = h * (0.2  + Math.random() * 0.6);
    const cnt = 7 + Math.floor(Math.random() * 9);
    const tnd = [];

    for (let i = 0; i < cnt; i++) {
      tnd.push({
        angle: (i / cnt) * Math.PI * 2 + Math.random() * 0.5,
        len:   70 + Math.random() * 130,
        col:   PALETTE[Math.floor(Math.random() * PALETTE.length)],
        curve: (Math.random() - 0.5) * 1.4,
      });
    }

    ideas.push({ cx, cy, tnd, born: performance.now(), life: 2800 + Math.random() * 1800 });
  }

  let kAngle = 0, lastSpawn = 0;

  function draw(ts) {
    ctx.clearRect(0, 0, w, h);

    // Cosmic purple ambient
    const grd = ctx.createRadialGradient(w * 0.5, h * 0.5, 0, w * 0.5, h * 0.5, w * 0.6);
    grd.addColorStop(0, 'rgba(50,0,90,0.07)');
    grd.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = grd;
    ctx.fillRect(0, 0, w, h);

    // Rotating kaleidoscope rings
    kAngle += 0.003;
    for (let r = 0; r < 4; r++) {
      const rad  = 60 + r * 55;
      const segs = 6 + r * 2;
      ctx.strokeStyle = `rgba(123,0,255,${0.04 + r * 0.01})`;
      ctx.lineWidth   = 0.5;
      ctx.beginPath(); ctx.arc(w * 0.5, h * 0.5, rad, 0, Math.PI * 2); ctx.stroke();

      for (let s = 0; s < segs; s++) {
        const a = kAngle * (r % 2 ? 1 : -1) + s * (Math.PI * 2 / segs);
        const x = w * 0.5 + Math.cos(a) * rad;
        const y = h * 0.5 + Math.sin(a) * rad;
        ctx.beginPath(); ctx.arc(x, y, 2, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(180,0,255,0.12)';
        ctx.fill();
      }
    }

    // Spawn a new idea burst every ~600 ms
    if (ts - lastSpawn > 600) { spawnIdea(); lastSpawn = ts; }
    if (ideas.length > 12) ideas.shift();

    // Draw idea tendrils
    ideas.forEach(idea => {
      const age  = ts - idea.born;
      const prog = Math.min(age / idea.life, 1);
      const fade = prog < 0.55 ? 1 : 1 - (prog - 0.55) / 0.45;

      idea.tnd.forEach(td => {
        const tp = Math.min(age / (idea.life * 0.45), 1);
        const el = td.len * tp;

        ctx.beginPath();
        let first = true;
        for (let s = 0; s <= 20; s++) {
          const p    = s / 20;
          const dist = el * p;
          const ca   = td.angle + td.curve * p;
          const px   = idea.cx + Math.cos(ca) * dist;
          const py   = idea.cy + Math.sin(ca) * dist;
          if (first) { ctx.moveTo(px, py); first = false; } else ctx.lineTo(px, py);
        }
        const [r, g, b] = td.col;
        ctx.strokeStyle = `rgba(${r},${g},${b},${fade * 0.5})`;
        ctx.lineWidth   = (1 - prog) * 1.8 + 0.3;
        ctx.stroke();

        // Glow dot at tendril tip
        if (tp < 0.98) {
          const ea = td.angle + td.curve;
          const px = idea.cx + Math.cos(ea) * el;
          const py = idea.cy + Math.sin(ea) * el;
          ctx.beginPath(); ctx.arc(px, py, 2.5, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${r},${g},${b},${fade * 0.85})`;
          ctx.fill();
        }
      });

      // Central burst glow
      const br = ctx.createRadialGradient(idea.cx, idea.cy, 0, idea.cx, idea.cy, 18);
      br.addColorStop(0, `rgba(200,100,255,${fade * 0.35})`);
      br.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = br;
      ctx.beginPath(); ctx.arc(idea.cx, idea.cy, 18, 0, Math.PI * 2); ctx.fill();
    });

    // Floating concept words
    floaters.forEach(f => {
      f.x += f.vx; f.y += f.vy;
      if (f.x < 0 || f.x > w) f.vx *= -1;
      if (f.y < 0 || f.y > h) f.vy *= -1;
      ctx.fillStyle  = `rgba(160,0,255,${f.alpha})`;
      ctx.font       = `${f.size}px monospace`;
      ctx.textAlign  = 'center';
      ctx.fillText(f.word, f.x, f.y);
    });

    // Stochastic noise sparks
    for (let i = 0; i < 5; i++) {
      const pc = PALETTE[Math.floor(Math.random() * PALETTE.length)];
      ctx.beginPath();
      ctx.arc(Math.random() * w, Math.random() * h, Math.random() * 1.8, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${pc.join(',')},0.3)`;
      ctx.fill();
    }

    requestAnimationFrame(draw);
  }

  resize();
  draw(0);
  window.addEventListener('resize', resize);
}
