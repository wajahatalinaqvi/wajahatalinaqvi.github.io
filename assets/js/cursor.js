/**
 * cursor.js
 * Premium dual-layer cursor animation:
 *   · cursor-dot   — follows mouse instantly via left/top
 *   · cursor-ring  — trails behind with lerp smoothing
 *
 * State classes: is-hovering | is-clicking | is-text | is-hidden
 * Spark particles emitted on each click.
 * Automatically disabled on touch / reduced-motion devices.
 */

(function () {
  'use strict';

  /* ── Touch / pointer / reduced-motion check ──────────── */
  if (
    window.matchMedia('(pointer: coarse)').matches ||
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  ) return;

  /* ── Inject DOM elements ─────────────────────────────── */
  const dot  = document.createElement('div');
  const ring = document.createElement('div');
  dot.className  = 'cursor-dot  is-hidden';
  ring.className = 'cursor-ring is-hidden';
  document.body.appendChild(ring); // ring first so dot renders on top
  document.body.appendChild(dot);

  /* ── State ───────────────────────────────────────────── */
  let mouseX = -200, mouseY = -200;  // start off-screen
  let ringX  = -200, ringY  = -200;
  let visible  = false;
  let hovering = false;
  let clicking = false;
  let textMode = false;
  let rafId;

  /* ── Selectors for hover/text detection ─────────────── */
  const HOVER_SEL = [
    'a', 'button', '[role="button"]',
    'label', 'select', 'summary',
    '.navbar-link', '.skills-item', '.service-item',
    '.project-item', '.timeline-item', '.cv-download-btn',
    '.social-link', '.filter-select', '.select-item button',
    '.capability-chip', '.tech-badge',
    '.availability-badge', '.email-copy-btn', '.info_more-btn',
    '.form-btn', '[data-modal-close-btn]', '[data-overlay]',
    '[data-nav-link]', '[data-sidebar-btn]', '[data-select]',
    '[data-select-item]'
  ].join(', ');

  const TEXT_SEL = 'input, textarea, [contenteditable]';

  /* ── Position helpers — use left/top, CSS centres them ── */
  function moveDot(x, y) {
    dot.style.left = x + 'px';
    dot.style.top  = y + 'px';
  }
  function moveRing(x, y) {
    ring.style.left = x + 'px';
    ring.style.top  = y + 'px';
  }

  /* ── rAF loop — lerp ring to mouse ──────────────────── */
  const LERP = 0.13;

  function tick() {
    ringX += (mouseX - ringX) * LERP;
    ringY += (mouseY - ringY) * LERP;

    moveDot(mouseX, mouseY);
    moveRing(ringX, ringY);

    rafId = requestAnimationFrame(tick);
  }

  /* ── Visibility ──────────────────────────────────────── */
  function show() {
    if (visible) return;
    visible = true;
    dot.classList.remove('is-hidden');
    ring.classList.remove('is-hidden');
  }

  function hide() {
    if (!visible) return;
    visible = false;
    dot.classList.add('is-hidden');
    ring.classList.add('is-hidden');
  }

  /* ── Apply state classes ─────────────────────────────── */
  function applyState() {
    const hov  = hovering && !textMode && !clicking;
    const clk  = clicking;
    const txt  = textMode && !clicking;

    dot.classList.toggle('is-hovering', hov);
    ring.classList.toggle('is-hovering', hov);
    dot.classList.toggle('is-clicking', clk);
    ring.classList.toggle('is-clicking', clk);
    dot.classList.toggle('is-text', txt);
    ring.classList.toggle('is-text', txt);
  }

  /* ── Spark burst on click ────────────────────────────── */
  const SPARK_N = 8;
  const SPARK_COLORS = [
    'rgba(77,141,255,0.9)',
    'rgba(128,87,255,0.9)',
    'rgba(255,255,255,0.8)',
    'rgba(100,160,255,0.85)'
  ];

  function emitSparks(x, y) {
    for (let i = 0; i < SPARK_N; i++) {
      const s = document.createElement('div');
      s.className = 'cursor-spark';

      const angle = (Math.PI * 2 * i) / SPARK_N + (Math.random() - 0.5) * 1.0;
      const dist  = 20 + Math.random() * 28;
      const tx    = Math.cos(angle) * dist;
      const ty    = Math.sin(angle) * dist;
      const color = SPARK_COLORS[i % SPARK_COLORS.length];
      const size  = 3 + Math.random() * 4;

      s.style.cssText = `
        left: ${x}px;
        top: ${y}px;
        width: ${size}px;
        height: ${size}px;
        background: ${color};
        box-shadow: 0 0 5px ${color};
        --tx: ${tx}px;
        --ty: ${ty}px;
        animation-delay: ${(Math.random() * 0.06).toFixed(3)}s;
      `;

      document.body.appendChild(s);
      s.addEventListener('animationend', () => s.remove(), { once: true });
    }
  }

  /* ── Resolve hover / text state from element ─────────── */
  function resolveState(el) {
    if (!el) return;
    const newHov  = !!el.closest(HOVER_SEL);
    const newText = el.matches ? el.matches(TEXT_SEL) : false;

    if (newHov !== hovering || newText !== textMode) {
      hovering = newHov;
      textMode = newText;
      applyState();
    }
  }

  /* ── Mouse events ────────────────────────────────────── */
  document.addEventListener('mousemove', function (e) {
    // Snap ring on first appearance
    if (!visible) {
      ringX = e.clientX;
      ringY = e.clientY;
    }

    mouseX = e.clientX;
    mouseY = e.clientY;

    show();
    resolveState(document.elementFromPoint(mouseX, mouseY));
  }, { passive: true });

  document.addEventListener('mouseleave', hide);
  document.addEventListener('mouseenter', show);

  document.addEventListener('mousedown', function (e) {
    clicking = true;
    applyState();
    emitSparks(e.clientX, e.clientY);
  });

  document.addEventListener('mouseup', function () {
    clicking = false;
    applyState();
  });

  document.addEventListener('mouseover', function (e) {
    resolveState(e.target);
  }, { passive: true });

  /* ── Start the loop ──────────────────────────────────── */
  tick();

  /* ── Cleanup on page unload ──────────────────────────── */
  window.addEventListener('pagehide', () => cancelAnimationFrame(rafId));

})();
