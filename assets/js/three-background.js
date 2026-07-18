/**
 * DEVELOPER ARCHITECTURE NETWORK — Three.js Background
 * ======================================================
 * Premium, controlled background visualization:
 * - 28 nodes on desktop, 15 on tablet, disabled on mobile
 * - Soft connections (lines) between adjacent nodes
 * - Mouse proximity increases line opacity and repels nodes gently
 * - Ambient slowly-rotating wireframe sphere in bottom-right corner
 * - Clean cleanup on page unload / resize debouncing
 * - Pauses execution when tab is hidden
 * - DPR capped at 1.5 to preserve GPU cycles
 */
'use strict';

(function () {
  if (typeof THREE === 'undefined') return;

  const W = window.innerWidth;
  const H = window.innerHeight;
  const isMobile = W < 768;
  const isTablet = W < 1024;

  if (isMobile) return;

  // ─── Design Guidelines Limits ─────────────────────────
  const NODE_COUNT = isTablet ? 15 : 28;
  const CONN_DIST  = isTablet ? 140 : 170;
  const SPREAD_X   = isTablet ? 450 : 650;
  const SPREAD_Y   = isTablet ? 400 : 550;
  const DEPTH      = 150;

  // ─── Reduced Motion check ────────────────────────────
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ─── Setup Container ─────────────────────────────────
  const container = document.createElement('div');
  container.id = 'three-background';
  container.setAttribute('aria-hidden', 'true');
  document.body.prepend(container);

  const scene  = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(60, W / H, 0.1, 2000);
  camera.position.set(0, 0, 500);

  const renderer = new THREE.WebGLRenderer({ antialias: false, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
  renderer.setSize(W, H);
  renderer.setClearColor(0x050B18, 1);
  container.appendChild(renderer.domElement);

  // ─── Color palette: Restrained blue-purple ───────────
  const COLOR_BLUE   = new THREE.Color(0x4D8DFF);
  const COLOR_PURPLE = new THREE.Color(0x8057FF);
  const COLOR_CYAN   = new THREE.Color(0x27D9FF);
  const COLORS = [COLOR_BLUE, COLOR_BLUE, COLOR_CYAN, COLOR_PURPLE];

  // ─── Pointer Interaction (Pre-allocated, no GC) ──────
  const mouseNDC  = new THREE.Vector2(-9999, -9999);
  const mouseWld  = new THREE.Vector3();
  const _ray      = new THREE.Vector3();
  const _dir      = new THREE.Vector3();
  const camTarget = { x: 0, y: 0 };

  let mouseMoveTimeout;
  function onMouseMove(e) {
    clearTimeout(mouseMoveTimeout);
    mouseMoveTimeout = setTimeout(() => {
      mouseNDC.x =  (e.clientX / window.innerWidth)  * 2 - 1;
      mouseNDC.y = -(e.clientY / window.innerHeight) * 2 + 1;
      camTarget.x = (e.clientX - window.innerWidth  / 2) * 0.006;
      camTarget.y = (e.clientY - window.innerHeight / 2) * -0.004;

      // Project pointer to world coordinate system at Z=0
      _ray.set(mouseNDC.x, mouseNDC.y, 0.5).unproject(camera);
      _dir.copy(_ray).sub(camera.position).normalize();
      const t = -camera.position.z / _dir.z;
      mouseWld.copy(camera.position).addScaledVector(_dir, t);
    }, 12);
  }
  document.addEventListener('mousemove', onMouseMove, { passive: true });

  // ─── Node architecture ───────────────────────────────
  class Node {
    constructor() {
      // Biased slightly to margins to avoid blocking centered text
      const side = Math.random() > 0.5 ? 1 : -1;
      const marginOffset = (0.25 + Math.random() * 0.3) * SPREAD_X * side;
      this.bx = marginOffset;
      this.by = (Math.random() - 0.5) * SPREAD_Y;
      this.z  = (Math.random() - 0.5) * DEPTH;
      this.x  = this.bx;
      this.y  = this.by;
      this.phase = Math.random() * Math.PI * 2;
      this.speed = 0.12 + Math.random() * 0.18;
      this.r     = 1.5 + Math.random() * 2.2;
      this.color = COLORS[Math.floor(Math.random() * COLORS.length)].clone();
    }

    update(t) {
      // Extremely slow natural organic movement
      this.x = this.bx + Math.sin(t * this.speed * 0.3 + this.phase) * 16;
      this.y = this.by + Math.cos(t * this.speed * 0.2 + this.phase * 1.3) * 12;

      // Proximity pointer reaction
      if (mouseWld.x !== -9999) {
        const dx = this.x - mouseWld.x;
        const dy = this.y - mouseWld.y;
        const d2 = dx * dx + dy * dy;
        if (d2 < 12000 && d2 > 0) { // ~110px interaction radius
          const d = Math.sqrt(d2);
          const f = (110 - d) / 110 * 35;
          this.x += (dx / d) * f * 0.04;
          this.y += (dy / d) * f * 0.04;
        }
      }
    }
  }

  const nodes = Array.from({ length: NODE_COUNT }, () => new Node());

  // ─── Node spheres ────────────────────────────────────
  const nodeGeo    = new THREE.SphereGeometry(1, 5, 5);
  const nodeMeshes = nodes.map(n => {
    const mat  = new THREE.MeshBasicMaterial({
      color: n.color, transparent: true, opacity: 0.28
    });
    const mesh = new THREE.Mesh(nodeGeo, mat);
    mesh.scale.setScalar(n.r);
    mesh.position.set(n.x, n.y, n.z);
    scene.add(mesh);
    return mesh;
  });

  // ─── Connection lines ────────────────────────────────
  const MAX_LINES     = 180;
  const linePositions = new Float32Array(MAX_LINES * 6);
  const lineColors    = new Float32Array(MAX_LINES * 6);
  const lineGeo = new THREE.BufferGeometry();
  lineGeo.setAttribute('position', new THREE.BufferAttribute(linePositions, 3).setUsage(THREE.DynamicDrawUsage));
  lineGeo.setAttribute('color',    new THREE.BufferAttribute(lineColors,    3).setUsage(THREE.DynamicDrawUsage));
  const lineMat = new THREE.LineBasicMaterial({
    vertexColors: true,
    transparent:  true,
    opacity:      1,
    blending:     THREE.AdditiveBlending,
    depthTest:    false,
  });
  const lineSegments = new THREE.LineSegments(lineGeo, lineMat);
  scene.add(lineSegments);

  // ─── Ambient Bottom-Right Wireframe Sphere ────────────
  let backgroundSphere;
  let sphereGeo;
  let sphereMat;
  if (!isTablet) {
    sphereGeo = new THREE.IcosahedronGeometry(135, 2);
    sphereMat = new THREE.MeshBasicMaterial({
      color: COLOR_PURPLE,
      wireframe: true,
      transparent: true,
      opacity: 0.05,
      blending: THREE.AdditiveBlending,
      depthTest: false
    });
    backgroundSphere = new THREE.Mesh(sphereGeo, sphereMat);
    // Position bottom-right corner behind content
    backgroundSphere.position.set(SPREAD_X * 0.42, -SPREAD_Y * 0.4, -120);
    scene.add(backgroundSphere);
  }

  // ─── Main Animation States ────────────────────────────
  const clock = new THREE.Clock();
  let rafId;
  let isHidden = false;

  document.addEventListener('visibilitychange', () => {
    isHidden = document.hidden;
    if (!isHidden && !prefersReduced) {
      clock.start();
      loop();
    }
  });

  function loop() {
    if (isHidden || prefersReduced) return;
    rafId = requestAnimationFrame(loop);
    const t = clock.getElapsedTime();

    // Soft camera movement tracking pointer
    camera.position.x += (camTarget.x - camera.position.x) * 0.02;
    camera.position.y += (camTarget.y - camera.position.y) * 0.02;
    camera.lookAt(0, 0, 0);

    // Update node positions
    nodes.forEach((n, i) => {
      n.update(t);
      nodeMeshes[i].position.set(n.x, n.y, n.z);
      nodeMeshes[i].material.opacity = 0.20 + 0.08 * Math.sin(t * 0.7 + n.phase);
    });

    // Draw connection lines O(n2) but n=28, so 378 iterations max
    let lIdx = 0;
    for (let i = 0; i < nodes.length && lIdx < MAX_LINES; i++) {
      for (let j = i + 1; j < nodes.length && lIdx < MAX_LINES; j++) {
        const dx = nodes[i].x - nodes[j].x;
        const dy = nodes[i].y - nodes[j].y;
        const dz = nodes[i].z - nodes[j].z;
        const d  = Math.sqrt(dx * dx + dy * dy + dz * dz);
        if (d < CONN_DIST) {
          let alpha = (1 - d / CONN_DIST) * 0.08; // extremely subtle default

          // Proximity highlight
          const midX = (nodes[i].x + nodes[j].x) * 0.5;
          const midY = (nodes[i].y + nodes[j].y) * 0.5;
          const pm   = Math.hypot(midX - mouseWld.x, midY - mouseWld.y);
          if (pm < 140) {
            alpha += (1 - pm / 140) * 0.15;
          }

          const ci = nodes[i].color, cj = nodes[j].color;
          const b  = lIdx * 6;
          linePositions[b]   = nodes[i].x; linePositions[b+1] = nodes[i].y; linePositions[b+2] = nodes[i].z;
          linePositions[b+3] = nodes[j].x; linePositions[b+4] = nodes[j].y; linePositions[b+5] = nodes[j].z;
          lineColors[b]   = ci.r * alpha; lineColors[b+1] = ci.g * alpha; lineColors[b+2] = ci.b * alpha;
          lineColors[b+3] = cj.r * alpha; lineColors[b+4] = cj.g * alpha; lineColors[b+5] = cj.b * alpha;
          lIdx++;
        }
      }
    }
    lineGeo.setDrawRange(0, lIdx * 2);
    lineGeo.attributes.position.needsUpdate = true;
    lineGeo.attributes.color.needsUpdate    = true;

    // Rotate and tilt wireframe sphere
    if (backgroundSphere) {
      backgroundSphere.rotation.y = t * 0.015;
      backgroundSphere.rotation.x = t * 0.008 + camTarget.y * 0.05;
      backgroundSphere.rotation.z = camTarget.x * 0.05;
    }

    renderer.render(scene, camera);
  }

  if (prefersReduced) {
    // Single static frame render
    nodes.forEach((n, i) => { nodeMeshes[i].position.set(n.x, n.y, n.z); });
    renderer.render(scene, camera);
  } else {
    clock.start();
    loop();
  }

  // ─── Debounced Window Resize ─────────────────────────
  let resizeTimer;
  function onResize() {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      const nW = window.innerWidth, nH = window.innerHeight;
      camera.aspect = nW / nH;
      camera.updateProjectionMatrix();
      renderer.setSize(nW, nH);
    }, 150);
  }
  window.addEventListener('resize', onResize, { passive: true });

  // ─── Unload Cleanup ──────────────────────────────────
  window.addEventListener('beforeunload', () => {
    cancelAnimationFrame(rafId);
    document.removeEventListener('mousemove', onMouseMove);
    window.removeEventListener('resize', onResize);
    nodeGeo.dispose();
    nodes.forEach((_, i) => nodeMeshes[i].material.dispose());
    lineGeo.dispose();
    lineMat.dispose();
    if (backgroundSphere) {
      sphereGeo.dispose();
      sphereMat.dispose();
    }
    renderer.dispose();
    container.remove();
  });

})();
