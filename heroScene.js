/* ============================================================
   js/heroScene.js
   Three.js hero canvas — wireframe core, orbiting module nodes,
   particle fields, and dynamic neural-path lines.

   Depends on:  Three.js r128 (loaded before this file)
   Exports (globals):
     scene, camera, renderer, core, coreMat, inner, innerMat,
     moduleNodes, moduleColors, starField, neuralDust, innerSparks,
     pathLines, createNeuralPath()
   ============================================================ */

// ── Scene setup ──────────────────────────────────────────────
const scene    = new THREE.Scene();
const camera   = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });

renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
document.getElementById('canvas-container').appendChild(renderer.domElement);
camera.position.z = 7;

// ── Central wireframe sphere ──────────────────────────────────
const coreMat = new THREE.MeshBasicMaterial({ color: 0x00f5ff, wireframe: true });
const core    = new THREE.Mesh(new THREE.SphereGeometry(1.1, 64, 64), coreMat);
scene.add(core);

const innerMat = new THREE.MeshBasicMaterial({ color: 0x003344, transparent: true, opacity: 0.6 });
const inner    = new THREE.Mesh(new THREE.SphereGeometry(0.9, 32, 32), innerMat);
scene.add(inner);

// ── Orbiting module nodes ─────────────────────────────────────
const moduleColors = [0x00f5ff, 0xff00ff, 0x00ff88, 0x7b00ff];

const moduleData = [
  { color: 0x00f5ff, radius: 3.2, speed: 0.6 },
  { color: 0xff00ff, radius: 3.8, speed: 0.4 },
  { color: 0x00ff88, radius: 2.8, speed: 0.8 },
  { color: 0x7b00ff, radius: 4.2, speed: 0.3 },
];

const moduleNodes = moduleData.map((m, i) => {
  const mesh = new THREE.Mesh(
    new THREE.SphereGeometry(0.22, 32, 32),
    new THREE.MeshBasicMaterial({ color: m.color })
  );
  // Small torus ring around each node
  mesh.add(new THREE.Mesh(
    new THREE.TorusGeometry(0.32, 0.03, 8, 32),
    new THREE.MeshBasicMaterial({ color: m.color, transparent: true, opacity: 0.5 })
  ));
  scene.add(mesh);

  // Faint orbit path ring
  const ring = new THREE.Mesh(
    new THREE.TorusGeometry(m.radius, 0.01, 2, 128),
    new THREE.MeshBasicMaterial({ color: m.color, transparent: true, opacity: 0.12 })
  );
  ring.rotation.x = Math.PI / 2 + (Math.random() - 0.5) * 0.4;
  scene.add(ring);

  return { mesh, ...m, angle: (i / moduleData.length) * Math.PI * 2, orbitY: (i - 1.5) * 0.5 };
});

// ── Particle fields ───────────────────────────────────────────
function makeParticles(count, color, spread, size) {
  const positions = new Float32Array(count * 3);
  for (let i = 0; i < count * 3; i++) positions[i] = (Math.random() - 0.5) * spread;
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  return new THREE.Points(geo, new THREE.PointsMaterial({ color, size, transparent: true, opacity: 0.6 }));
}

const starField   = makeParticles(1500, 0x00f5ff, 30, 0.04);
const neuralDust  = makeParticles(500,  0xff00ff, 10, 0.06);
const innerSparks = makeParticles(200,  0x00ff88, 5,  0.08);
scene.add(starField, neuralDust, innerSparks);

// ── Neural path lines ─────────────────────────────────────────
const pathLines = [];

/**
 * Draw a temporary curved line between two 3-D positions.
 * @param {THREE.Vector3} from
 * @param {THREE.Vector3} to
 * @param {number}        color  hex colour integer
 */
function createNeuralPath(from, to, color) {
  const points = [];
  for (let i = 0; i <= 20; i++) {
    const t = i / 20;
    points.push(new THREE.Vector3(
      from.x + (to.x - from.x) * t + Math.sin(t * Math.PI) * (Math.random() - 0.5) * 0.5,
      from.y + (to.y - from.y) * t + Math.cos(t * Math.PI) * (Math.random() - 0.5) * 0.5,
      from.z + (to.z - from.z) * t
    ));
  }
  const mat  = new THREE.LineBasicMaterial({ color, transparent: true, opacity: 0.5 });
  const line = new THREE.Line(new THREE.BufferGeometry().setFromPoints(points), mat);
  scene.add(line);
  pathLines.push({ line, mat, life: 1.0 });
}

// ── Window resize ─────────────────────────────────────────────
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
