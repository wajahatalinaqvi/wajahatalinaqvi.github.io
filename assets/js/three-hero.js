/**
 * AVATAR TECH RING — Three.js Hero Halo
 * =====================================
 * Renders a single subtle rotating halo ring around the portrait:
 * - Single outer ring with slow rotation (~22 seconds per cycle)
 * - Restrained glow that breathes gently
 * - Pauses rendering when hidden or reduced-motion is preferred
 * - Clean cleanup on unload
 */
'use strict';

document.addEventListener('DOMContentLoaded', () => {
  if (typeof THREE === 'undefined') return;

  const avatarBox = document.querySelector('.avatar-box');
  if (!avatarBox) return;

  // Skip on mobile and reduced-motion users
  if (window.innerWidth < 768) return;
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Inject canvas wrapper
  const wrap = document.createElement('div');
  wrap.id = 'hero-three-canvas';
  wrap.style.cssText = `
    position: absolute; top: 50%; left: 50%;
    transform: translate(-50%, -50%);
    width: 200px; height: 200px;
    z-index: 0; pointer-events: none; overflow: visible;
  `;
  avatarBox.style.position = 'relative';
  avatarBox.style.overflow = 'visible';
  avatarBox.insertBefore(wrap, avatarBox.firstChild);

  const SIZE = 200;
  const scene  = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(52, 1, 0.1, 50);
  camera.position.z = 5.5;

  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
  renderer.setSize(SIZE, SIZE);
  renderer.setClearColor(0x000000, 0);
  wrap.appendChild(renderer.domElement);

  // ─── Single Clean Rotating Halo ──────────────────────
  const ringGeo = new THREE.TorusGeometry(2.0, 0.02, 6, 72);
  const ringMat = new THREE.MeshBasicMaterial({
    color: 0x4D8DFF,
    transparent: true,
    opacity: 0.38,
    blending: THREE.AdditiveBlending
  });
  const ring = new THREE.Mesh(ringGeo, ringMat);
  scene.add(ring);

  // ─── Animation States ────────────────────────────────
  const clock = new THREE.Clock();
  let rafId;
  let isHidden = false;

  document.addEventListener('visibilitychange', () => {
    isHidden = document.hidden;
    if (!isHidden && !prefersReduced) {
      clock.start();
      animate();
    }
  });

  function animate() {
    if (isHidden || prefersReduced) return;
    rafId = requestAnimationFrame(animate);
    const t = clock.getElapsedTime();

    // Rotate slow (~22 seconds per cycle)
    ring.rotation.z = t * 0.28;

    // Subtle breathing pulse
    ringMat.opacity = 0.28 + 0.12 * Math.sin(t * 0.8);

    renderer.render(scene, camera);
  }

  if (prefersReduced) {
    renderer.render(scene, camera);
  } else {
    clock.start();
    animate();
  }

  // ─── Cleanup ─────────────────────────────────────────
  window.addEventListener('beforeunload', () => {
    cancelAnimationFrame(rafId);
    ringGeo.dispose();
    ringMat.dispose();
    renderer.dispose();
    wrap.remove();
  });
});
