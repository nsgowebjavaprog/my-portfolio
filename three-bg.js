/**
 * THREE-BG.JS
 * Neural network particle system + geometric elements
 * Pure white lines & dots on black — high contrast
 */
(function () {
  const canvas = document.getElementById('three-canvas');
  const W = window.innerWidth;
  const H = window.innerHeight;

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: false });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(W, H);
  renderer.setClearColor(0x000000, 1);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(55, W / H, 0.1, 1000);
  camera.position.set(0, 0, 40);

  /* ── MOUSE ── */
  const mouse = { x: 0, y: 0, tx: 0, ty: 0 };
  window.addEventListener('mousemove', e => {
    mouse.tx = (e.clientX / window.innerWidth  - 0.5) * 2;
    mouse.ty = -(e.clientY / window.innerHeight - 0.5) * 2;
  });

  /* ── NODES (neural-net dots) ── */
  const NODE_COUNT = 120;
  const nodes = [];
  const nodePosArr = new Float32Array(NODE_COUNT * 3);

  for (let i = 0; i < NODE_COUNT; i++) {
    const node = {
      x: (Math.random() - 0.5) * 90,
      y: (Math.random() - 0.5) * 70,
      z: (Math.random() - 0.5) * 30,
      vx: (Math.random() - 0.5) * 0.04,
      vy: (Math.random() - 0.5) * 0.04,
      vz: (Math.random() - 0.5) * 0.02,
    };
    nodes.push(node);
    nodePosArr[i * 3]     = node.x;
    nodePosArr[i * 3 + 1] = node.y;
    nodePosArr[i * 3 + 2] = node.z;
  }

  const nodeGeo = new THREE.BufferGeometry();
  nodeGeo.setAttribute('position', new THREE.BufferAttribute(nodePosArr, 3));
  const nodeMat = new THREE.PointsMaterial({
    color: 0xffffff,
    size: 0.35,
    transparent: true,
    opacity: 0.9,
    sizeAttenuation: true,
  });
  const nodePoints = new THREE.Points(nodeGeo, nodeMat);
  scene.add(nodePoints);

  /* ── EDGES (connections between near nodes) ── */
  const EDGE_DIST = 22;
  const MAX_EDGES = 300;

  const edgePosArr = new Float32Array(MAX_EDGES * 2 * 3);
  const edgeAlpha  = new Float32Array(MAX_EDGES);

  const edgeGeo = new THREE.BufferGeometry();
  edgeGeo.setAttribute('position', new THREE.BufferAttribute(edgePosArr, 3));
  edgeGeo.setDrawRange(0, 0);

  const edgeMat = new THREE.LineSegments(
    edgeGeo,
    new THREE.LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.18, vertexColors: false })
  );
  scene.add(edgeMat);

  /* ── BACKGROUND STAR PARTICLES ── */
  const STAR_COUNT = 1200;
  const starPos = new Float32Array(STAR_COUNT * 3);
  for (let i = 0; i < STAR_COUNT; i++) {
    starPos[i * 3]     = (Math.random() - 0.5) * 200;
    starPos[i * 3 + 1] = (Math.random() - 0.5) * 200;
    starPos[i * 3 + 2] = (Math.random() - 0.5) * 80 - 20;
  }
  const starGeo = new THREE.BufferGeometry();
  starGeo.setAttribute('position', new THREE.BufferAttribute(starPos, 3));
  const starMat = new THREE.PointsMaterial({
    color: 0xffffff, size: 0.07, transparent: true, opacity: 0.45, sizeAttenuation: true,
  });
  scene.add(new THREE.Points(starGeo, starMat));

  /* ── WIREFRAME SPHERE ── */
  const sphMesh = new THREE.Mesh(
    new THREE.SphereGeometry(12, 24, 24),
    new THREE.MeshBasicMaterial({ color: 0xffffff, wireframe: true, transparent: true, opacity: 0.04 })
  );
  sphMesh.position.set(22, -4, -10);
  scene.add(sphMesh);

  /* ── SECOND SMALL SPHERE ── */
  const sph2 = new THREE.Mesh(
    new THREE.SphereGeometry(5, 16, 16),
    new THREE.MeshBasicMaterial({ color: 0xffffff, wireframe: true, transparent: true, opacity: 0.06 })
  );
  sph2.position.set(-24, 10, -15);
  scene.add(sph2);

  /* ── TORUS RING ── */
  const torusMesh = new THREE.Mesh(
    new THREE.TorusGeometry(7, 0.025, 8, 80),
    new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.07 })
  );
  torusMesh.position.set(-18, -8, -18);
  torusMesh.rotation.x = Math.PI * 0.35;
  scene.add(torusMesh);

  /* ── GRID ── */
  const grid = new THREE.GridHelper(180, 50, 0x1a1a1a, 0x1a1a1a);
  grid.position.y = -28;
  grid.material.transparent = true;
  grid.material.opacity = 0.6;
  scene.add(grid);

  /* ── SCROLL ── */
  let scrollY = 0;
  window.addEventListener('scroll', () => { scrollY = window.scrollY; });

  /* ── ANIMATION ── */
  let frame = 0;
  function animate() {
    requestAnimationFrame(animate);
    frame++;
    const t = frame * 0.005;

    /* smooth mouse */
    mouse.x += (mouse.tx - mouse.x) * 0.05;
    mouse.y += (mouse.ty - mouse.y) * 0.05;

    /* camera parallax */
    camera.position.x += (mouse.x * 4 - camera.position.x) * 0.025;
    camera.position.y += (mouse.y * 3 - camera.position.y) * 0.025;
    camera.position.z  = 40 + scrollY * 0.006;
    camera.lookAt(0, 0, 0);

    /* move nodes */
    let edgeCount = 0;
    for (let i = 0; i < NODE_COUNT; i++) {
      const n = nodes[i];
      n.x += n.vx; n.y += n.vy; n.z += n.vz;
      if (Math.abs(n.x) > 45) n.vx *= -1;
      if (Math.abs(n.y) > 35) n.vy *= -1;
      if (Math.abs(n.z) > 15) n.vz *= -1;
      nodePosArr[i * 3]     = n.x;
      nodePosArr[i * 3 + 1] = n.y;
      nodePosArr[i * 3 + 2] = n.z;
    }
    nodeGeo.attributes.position.needsUpdate = true;

    /* rebuild edges */
    for (let i = 0; i < NODE_COUNT && edgeCount < MAX_EDGES; i++) {
      for (let j = i + 1; j < NODE_COUNT && edgeCount < MAX_EDGES; j++) {
        const dx = nodes[i].x - nodes[j].x;
        const dy = nodes[i].y - nodes[j].y;
        const dz = nodes[i].z - nodes[j].z;
        const d  = Math.sqrt(dx*dx + dy*dy + dz*dz);
        if (d < EDGE_DIST) {
          const b = edgeCount * 6;
          edgePosArr[b]   = nodes[i].x; edgePosArr[b+1] = nodes[i].y; edgePosArr[b+2] = nodes[i].z;
          edgePosArr[b+3] = nodes[j].x; edgePosArr[b+4] = nodes[j].y; edgePosArr[b+5] = nodes[j].z;
          edgeCount++;
        }
      }
    }
    edgeGeo.attributes.position.needsUpdate = true;
    edgeGeo.setDrawRange(0, edgeCount * 2);

    /* rotations */
    nodePoints.rotation.y = t * 0.04;
    sphMesh.rotation.y    = t * 0.12;
    sphMesh.rotation.x    = t * 0.04;
    sph2.rotation.y       = -t * 0.18;
    sph2.rotation.z       = t * 0.08;
    torusMesh.rotation.z  = t * 0.1;
    torusMesh.rotation.y  = t * 0.05;

    /* breathing opacity */
    nodeMat.opacity = 0.7 + Math.sin(t * 0.8) * 0.15;
    edgeMat.material.opacity = 0.12 + Math.sin(t * 0.6) * 0.04;

    renderer.render(scene, camera);
  }
  animate();

  /* ── RESIZE ── */
  window.addEventListener('resize', () => {
    const W = window.innerWidth, H = window.innerHeight;
    camera.aspect = W / H;
    camera.updateProjectionMatrix();
    renderer.setSize(W, H);
  });
})();
