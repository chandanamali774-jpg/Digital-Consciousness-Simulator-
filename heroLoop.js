/* ============================================================
   js/heroLoop.js
   Animation loop for the Three.js hero scene and mode switching.

   Depends on:  heroScene.js (globals already declared)
   ============================================================ */

let currentMode = 'analytical';
const startTime = Date.now();

const modeSettings = {
  analytical: { coreColor: 0x00f5ff, particleColor: 0x00f5ff, speed: 1.0, label: 'ANALYTICAL' },
  creative:   { coreColor: 0xff00ff, particleColor: 0x7b00ff, speed: 1.5, label: 'CREATIVE'   },
  learning:   { coreColor: 0x00ff88, particleColor: 0x00ff88, speed: 0.7, label: 'LEARNING'   },
};

/**
 * Switch the cognitive processing mode.
 * Called by the mode-selector buttons in the HTML.
 * @param {string} mode  'analytical' | 'creative' | 'learning'
 * @param {HTMLElement} btn  The clicked button element
 */
function setMode(mode, btn) {
  currentMode = mode;
  const s = modeSettings[mode];

  coreMat.color.setHex(s.coreColor);
  starField.material.color.setHex(s.particleColor);
  document.body.dataset.mode = mode;
  document.getElementById('mode-display').textContent = 'MODE: ' + s.label;

  document.querySelectorAll('.mode-btn').forEach(b => b.classList.remove('active'));
  if (btn) btn.classList.add('active');

  addLog('Mode switched to ' + s.label);
  window.dispatchEvent(new CustomEvent('modechange', { detail: { mode, label: s.label } }));

  // Temporary spike in load / neural metrics
  metrics.load   = 80 + Math.random() * 15;
  metrics.neural = 85 + Math.random() * 10;
  setTimeout(() => { metrics.load = 40 + Math.random() * 30; }, 2000);
}

// ── Main render loop ─────────────────────────────────────────
let heroFrame = 0;

function heroAnimate() {
  requestAnimationFrame(heroAnimate);
  heroFrame++;

  const t         = Date.now() * 0.001;
  const modeSpeed = modeSettings[currentMode].speed;

  // Rotate wireframe core
  core.rotation.x += 0.004 * modeSpeed;
  core.rotation.y += 0.006 * modeSpeed;

  // Orbit module nodes
  moduleNodes.forEach(m => {
    m.angle += m.speed * 0.004 * modeSpeed;
    m.mesh.position.x = Math.cos(m.angle) * m.radius;
    m.mesh.position.y = Math.sin(m.angle * 0.5) * 1.5 + m.orbitY;
    m.mesh.position.z = Math.sin(m.angle) * m.radius * 0.4;
    m.mesh.rotation.x += 0.02;
    m.mesh.rotation.y += 0.03;
  });

  // Pulse inner sphere
  const pulse = 1 + Math.sin(t * 2) * 0.05;
  inner.scale.set(pulse, pulse, pulse);
  inner.material.opacity = 0.4 + Math.sin(t * 3) * 0.2;

  // Drift particle clouds
  starField.rotation.y   += 0.0005;
  neuralDust.rotation.x  += 0.001;
  innerSparks.rotation.z += 0.002;

  // Fade out expired neural path lines
  for (let i = pathLines.length - 1; i >= 0; i--) {
    pathLines[i].life         -= 0.015;
    pathLines[i].mat.opacity   = pathLines[i].life * 0.5;
    if (pathLines[i].life <= 0) {
      scene.remove(pathLines[i].line);
      pathLines.splice(i, 1);
    }
  }

  // Periodically spark random inter-module connections
  if (heroFrame % 120 === 0) {
    const a = Math.floor(Math.random() * moduleNodes.length);
    const b = Math.floor(Math.random() * moduleNodes.length);
    if (a !== b) {
      createNeuralPath(
        moduleNodes[a].mesh.position.clone(),
        moduleNodes[b].mesh.position.clone(),
        moduleColors[a]
      );
    }
  }

  renderer.render(scene, camera);
}

document.body.dataset.mode = currentMode;

heroAnimate();
