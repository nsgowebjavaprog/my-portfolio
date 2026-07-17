/* ============================================================
   THREE-BG.JS
   "Token Loom" — an ambient field of nodes and threads behind the
   hero, standing in for the two things this portfolio is about:
   a tokenizer breaking language into pieces, and a network
   stitching those pieces back into meaning.
   ============================================================ */
(function () {
  const canvas = document.getElementById('loom-canvas');
  if (!canvas || typeof THREE === 'undefined') return;

  const prefersReducedMotion = window.matchMedia(
    '(prefers-reduced-motion: reduce)'
  ).matches;

  const BRASS = 0xc89b3c;
  const BRASS_SOFT = 0xe3c878;
  const PAPER = 0xede8da;

  let width = window.innerWidth;
  let height = window.innerHeight;

  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true,
    alpha: true,
  });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.setSize(width, height);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 100);
  camera.position.set(0, 0, 18);

  const loom = new THREE.Group();
  scene.add(loom);

  /* ---------- Build the node field ---------- */
  const NODE_COUNT = width < 700 ? 90 : 170;
  const RADIUS_X = 14;
  const RADIUS_Y = 8;
  const RADIUS_Z = 8;

  const nodePositions = [];
  for (let i = 0; i < NODE_COUNT; i++) {
    nodePositions.push(
      new THREE.Vector3(
        (Math.random() - 0.5) * 2 * RADIUS_X,
        (Math.random() - 0.5) * 2 * RADIUS_Y,
        (Math.random() - 0.5) * 2 * RADIUS_Z
      )
    );
  }

  const pointsGeo = new THREE.BufferGeometry().setFromPoints(nodePositions);
  const pointsMat = new THREE.PointsMaterial({
    color: BRASS_SOFT,
    size: 0.09,
    transparent: true,
    opacity: 0.85,
    sizeAttenuation: true,
  });
  const points = new THREE.Points(pointsGeo, pointsMat);
  loom.add(points);

  /* ---------- Thread nearby nodes together ---------- */
  const MAX_LINK_DIST = 3.4;
  const MAX_LINKS = 260;
  const linkPositions = [];
  let linkCount = 0;

  outer: for (let i = 0; i < nodePositions.length; i++) {
    for (let j = i + 1; j < nodePositions.length; j++) {
      if (linkCount >= MAX_LINKS) break outer;
      const d = nodePositions[i].distanceTo(nodePositions[j]);
      if (d < MAX_LINK_DIST) {
        linkPositions.push(nodePositions[i], nodePositions[j]);
        linkCount++;
      }
    }
  }

  const linkGeo = new THREE.BufferGeometry().setFromPoints(linkPositions);
  const linkMat = new THREE.LineBasicMaterial({
    color: PAPER,
    transparent: true,
    opacity: 0.06,
  });
  const links = new THREE.LineSegments(linkGeo, linkMat);
  loom.add(links);

  /* ---------- A few brighter "focal" nodes ---------- */
  const focalGeo = new THREE.SphereGeometry(0.07, 12, 12);
  const focalMat = new THREE.MeshBasicMaterial({ color: BRASS });
  const focalCount = 6;
  const focals = [];
  for (let i = 0; i < focalCount; i++) {
    const mesh = new THREE.Mesh(focalGeo, focalMat);
    const base = nodePositions[Math.floor(Math.random() * nodePositions.length)];
    mesh.position.copy(base);
    loom.add(mesh);
    focals.push({ mesh, phase: Math.random() * Math.PI * 2 });
  }

  /* ---------- Interaction state ---------- */
  const pointer = { x: 0, y: 0 };
  const targetRotation = { x: 0, y: 0 };

  window.addEventListener('mousemove', (e) => {
    pointer.x = (e.clientX / window.innerWidth) * 2 - 1;
    pointer.y = (e.clientY / window.innerHeight) * 2 - 1;
  });

  window.addEventListener('resize', () => {
    width = window.innerWidth;
    height = window.innerHeight;
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height);
  });

  /* ---------- Scroll-linked drift ---------- */
  let scrollFactor = 0;
  window.addEventListener(
    'scroll',
    () => {
      const max = document.body.scrollHeight - window.innerHeight;
      scrollFactor = max > 0 ? window.scrollY / max : 0;
    },
    { passive: true }
  );

  /* ---------- Render loop ---------- */
  const clock = new THREE.Clock();

  function renderStaticFrame() {
    loom.rotation.set(0.15, -0.3, 0);
    renderer.render(scene, camera);
  }

  function animate() {
    requestAnimationFrame(animate);
    const t = clock.getElapsedTime();

    targetRotation.y += (pointer.x * 0.3 - targetRotation.y) * 0.02;
    targetRotation.x += (pointer.y * 0.15 - targetRotation.x) * 0.02;

    loom.rotation.y = targetRotation.y + t * 0.02 + scrollFactor * 0.6;
    loom.rotation.x = targetRotation.x + Math.sin(t * 0.1) * 0.04;

    focals.forEach((f, i) => {
      const pulse = 0.9 + Math.sin(t * 1.4 + f.phase) * 0.35;
      f.mesh.scale.setScalar(pulse);
    });

    renderer.render(scene, camera);
  }

  if (prefersReducedMotion) {
    renderStaticFrame();
  } else {
    animate();
  }
})();
