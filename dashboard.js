/* ============================================================
   js/dashboard.js
   Live system-health metrics panel and uptime / clock display.

   Requires: metrics object declared in thoughtEngine.js (or
   whichever file loads first — metrics is a shared global).
   ============================================================ */

/**
 * Shared metrics object. Other modules may also read/write these values
 * (e.g. heroLoop.js spikes load when changing mode).
 */
const metrics = {
  load:       45,
  neural:     62,
  memory:     38,
  creativity: 55,
};

/**
 * Advance each metric by a small random walk, clamp to [min, max],
 * then push the new values into the DOM.
 * Called on a repeating interval (see bottom of this file).
 */
function updateDashboard() {
  // Random-walk each metric within its bounds
  metrics.load       = Math.max(20, Math.min(95, metrics.load       + (Math.random() - 0.5) * 4));
  metrics.neural     = Math.max(20, Math.min(95, metrics.neural     + (Math.random() - 0.5) * 5));
  metrics.memory     = Math.max(15, Math.min(90, metrics.memory     + (Math.random() - 0.5) * 3));
  metrics.creativity = Math.max(10, Math.min(95, metrics.creativity + (Math.random() - 0.5) * 6));

  // Bar widths
  document.getElementById('bar-load').style.width    = metrics.load       + '%';
  document.getElementById('bar-neural').style.width  = metrics.neural     + '%';
  document.getElementById('bar-mem').style.width     = metrics.memory     + '%';
  document.getElementById('bar-creat').style.width   = metrics.creativity + '%';

  // Numeric readouts
  document.getElementById('load-val').textContent    = Math.round(metrics.load)       + '%';
  document.getElementById('neural-val').textContent  = Math.round(metrics.neural)     + '%';
  document.getElementById('mem-val').textContent     = Math.round(metrics.memory)     + '%';
  document.getElementById('creat-val').textContent   = Math.round(metrics.creativity) + '%';

  // Uptime counter (seconds since page load)
  const elapsed = Math.floor((Date.now() - startTime) / 1000);
  document.getElementById('uptime').textContent =
    elapsed < 60 ? elapsed + 's' : Math.floor(elapsed / 60) + 'm ' + (elapsed % 60) + 's';

  // System clock in header
  document.getElementById('system-time').textContent =
    'SYS TIME: ' + new Date().toLocaleTimeString('en', { hour12: false });
}

// Tick every 800 ms
setInterval(updateDashboard, 800);
