import {
  ACESFilmicToneMapping,
  AdditiveBlending,
  AmbientLight,
  BufferAttribute,
  BufferGeometry,
  CatmullRomCurve3,
  Color,
  DirectionalLight,
  DoubleSide,
  Line,
  LineBasicMaterial,
  Mesh,
  MeshPhysicalMaterial,
  MeshStandardMaterial,
  PerspectiveCamera,
  PlaneGeometry,
  Points,
  PointsMaterial,
  Scene,
  SphereGeometry,
  SRGBColorSpace,
  TubeGeometry,
  Vector3,
  WebGLRenderer,
} from "three";

const root = document.documentElement;
const body = document.body;
const systemReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
let motionDisabled = systemReduced || localStorage.getItem("yven-motion") === "off";

function updatePointer(event: PointerEvent) {
  root.style.setProperty("--pointer-x", `${event.clientX}px`);
  root.style.setProperty("--pointer-y", `${event.clientY}px`);
}

function updateScroll() {
  const total = Math.max(document.documentElement.scrollHeight - window.innerHeight, 1);
  root.style.setProperty("--scroll-progress", `${Math.min(window.scrollY / total, 1)}`);
  document.querySelector("[data-header]")?.classList.toggle("is-scrolled", window.scrollY > 30);
}

function setupMotionToggle() {
  const button = document.querySelector<HTMLButtonElement>("[data-motion-toggle]");
  body.classList.toggle("motion-off", motionDisabled);
  button?.setAttribute("aria-pressed", String(motionDisabled));
  button?.addEventListener("click", () => {
    motionDisabled = !motionDisabled;
    body.classList.toggle("motion-off", motionDisabled);
    button.setAttribute("aria-pressed", String(motionDisabled));
    localStorage.setItem("yven-motion", motionDisabled ? "off" : "on");
    window.dispatchEvent(new CustomEvent("yven:motion", { detail: { disabled: motionDisabled } }));
  });
}

function setupReveal() {
  const items = [...document.querySelectorAll<HTMLElement>("[data-reveal]")];
  if (!items.length) return;
  if (systemReduced) {
    items.forEach((item) => item.classList.add("is-visible"));
    return;
  }
  const observer = new IntersectionObserver(
    (entries) => entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    }),
    { threshold: 0.12, rootMargin: "0px 0px -4%" }
  );
  items.forEach((item) => observer.observe(item));
}

function setupTilt() {
  if (systemReduced) return;
  document.querySelectorAll<HTMLElement>("[data-tilt]").forEach((frame) => {
    frame.addEventListener("pointermove", (event) => {
      if (motionDisabled) return;
      const rect = frame.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width;
      const y = (event.clientY - rect.top) / rect.height;
      frame.style.setProperty("--rx", `${(0.5 - y) * 4.5}deg`);
      frame.style.setProperty("--ry", `${(x - 0.5) * 5.5}deg`);
      frame.style.setProperty("--mx", `${x}`);
      frame.style.setProperty("--my", `${y}`);
    });
    frame.addEventListener("pointerleave", () => {
      frame.style.setProperty("--rx", "0deg");
      frame.style.setProperty("--ry", "0deg");
    });
  });
  document.querySelectorAll<HTMLElement>("[data-paper-tilt]").forEach((paper) => {
    paper.addEventListener("pointermove", (event) => {
      if (motionDisabled) return;
      const rect = paper.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width;
      const y = (event.clientY - rect.top) / rect.height;
      paper.style.setProperty("--prx", `${(0.5 - y) * 2.2}deg`);
      paper.style.setProperty("--pry", `${(x - 0.5) * 2.6}deg`);
    });
    paper.addEventListener("pointerleave", () => {
      paper.style.setProperty("--prx", "0deg");
      paper.style.setProperty("--pry", "0deg");
    });
  });
}

function setupMagnetic() {
  if (systemReduced) return;
  document.querySelectorAll<HTMLElement>(".magnetic").forEach((item) => {
    item.addEventListener("pointermove", (event) => {
      if (motionDisabled) return;
      const rect = item.getBoundingClientRect();
      const x = event.clientX - rect.left - rect.width / 2;
      const y = event.clientY - rect.top - rect.height / 2;
      item.style.transform = `translate(${x * 0.07}px, ${y * 0.11}px)`;
    });
    item.addEventListener("pointerleave", () => { item.style.transform = ""; });
  });
}

function setupProjectFilters() {
  const filters = [...document.querySelectorAll<HTMLButtonElement>("[data-filter]")];
  const search = document.querySelector<HTMLInputElement>("[data-project-search]");
  const cards = [...document.querySelectorAll<HTMLElement>("[data-project-card]")];
  if (!cards.length) return;
  let active = "all";
  const apply = () => {
    const query = search?.value.trim().toLowerCase() ?? "";
    cards.forEach((card) => {
      const text = [card.dataset.title, card.dataset.summary, card.dataset.stack, card.dataset.category].join(" ").toLowerCase();
      const visible = (active === "all" || card.dataset.category === active) && (!query || text.includes(query));
      card.classList.toggle("is-hidden", !visible);
    });
  };
  filters.forEach((filter) => filter.addEventListener("click", () => {
    active = filter.dataset.filter ?? "all";
    filters.forEach((item) => item.classList.toggle("is-active", item === filter));
    apply();
  }));
  search?.addEventListener("input", apply);
}

function setupCopy() {
  document.querySelectorAll<HTMLButtonElement>("[data-copy]").forEach((button) => {
    const label = button.textContent ?? "复制";
    button.addEventListener("click", async () => {
      try {
        await navigator.clipboard.writeText(button.dataset.copy ?? "");
        button.textContent = "已复制";
      } catch { button.textContent = "复制失败"; }
      window.setTimeout(() => { button.textContent = label; }, 1400);
    });
  });
}

function makeRouteCanvas(canvas: HTMLCanvasElement, palette: string[], density: number) {
  const scene = new Scene();
  const camera = new PerspectiveCamera(45, 1, 0.1, 100);
  const renderer = new WebGLRenderer({ canvas, alpha: true, antialias: true, powerPreference: "high-performance" });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1));
  renderer.outputColorSpace = SRGBColorSpace;
  renderer.toneMapping = ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;
  camera.position.z = 7;

  scene.add(new AmbientLight(0xfff5de, 1.75));
  const key = new DirectionalLight(0xfff0d0, 3.2);
  key.position.set(-4, 6, 7);
  scene.add(key);
  const rim = new DirectionalLight(0x8fb9aa, 2.4);
  rim.position.set(5, -2, 4);
  scene.add(rim);

  const paperGeometry = new PlaneGeometry(5.2, 3.25, 34, 22);
  const paperPosition = paperGeometry.getAttribute("position") as BufferAttribute;
  for (let index = 0; index < paperPosition.count; index += 1) {
    const x = paperPosition.getX(index);
    const y = paperPosition.getY(index);
    const edgeLift = Math.pow(Math.abs(x) / 2.6, 2) * 0.26;
    paperPosition.setZ(index, Math.sin(x * 1.15) * 0.12 + Math.cos(y * 1.8) * 0.045 + edgeLift);
  }
  paperGeometry.computeVertexNormals();
  const paper = new Mesh(paperGeometry, new MeshPhysicalMaterial({
    color: 0xeee4d0,
    roughness: 0.84,
    metalness: 0,
    clearcoat: 0.1,
    clearcoatRoughness: 0.72,
    side: DoubleSide,
    transparent: true,
    opacity: 0.5,
  }));
  paper.position.set(1.25, 0.08, -1.05);
  paper.rotation.set(-0.18, -0.38, -0.08);
  scene.add(paper);

  const curvePoints = Array.from({ length: 9 }, (_, index) => {
    const t = index / 8;
    return new Vector3(-3.7 + t * 7.4, Math.sin(t * 6.2 - 0.8) * 1.32, 0.35 + Math.cos(t * 7.4) * 0.3);
  });
  const routeCurve = new CatmullRomCurve3(curvePoints);
  const tube = new Mesh(
    new TubeGeometry(routeCurve, 120, 0.018, 7, false),
    new MeshStandardMaterial({ color: palette[0], roughness: 0.42, metalness: 0.5, transparent: true, opacity: 0.56 })
  );
  scene.add(tube);

  const nodeGeometry = new SphereGeometry(window.innerWidth < 720 ? 0.055 : 0.07, 18, 18);
  const nodeMaterial = new MeshStandardMaterial({ color: 0xb89a5e, roughness: 0.28, metalness: 0.86 });
  const nodeCount = window.innerWidth < 720 ? 6 : 14;
  const nodes: Mesh[] = [];
  for (let index = 0; index < nodeCount; index += 1) {
    const node = new Mesh(nodeGeometry, nodeMaterial);
    node.position.copy(routeCurve.getPoint(index / Math.max(nodeCount - 1, 1)));
    node.position.z += 0.06;
    nodes.push(node);
    scene.add(node);
  }

  const colors = palette.map((hex) => new Color(hex));
  const pointCount = window.innerWidth < 720 ? Math.round(density * 0.48) : density;
  const positions = new Float32Array(pointCount * 3);
  const particleColors = new Float32Array(pointCount * 3);
  const phases = new Float32Array(pointCount);

  for (let i = 0; i < pointCount; i += 1) {
    const t = i / Math.max(pointCount - 1, 1);
    const strand = i % 5;
    const spread = (strand - 2) * 0.045;
    const x = -3.8 + t * 7.6 + Math.sin(t * 9.2 + strand) * 0.22;
    const y = Math.sin(t * 6.1 - 0.8) * 1.35 + Math.cos(t * 13.4) * 0.19 + spread;
    const z = Math.cos(t * 8.4 + strand * 0.7) * 0.42;
    const i3 = i * 3;
    positions[i3] = x + (Math.random() - 0.5) * 0.09;
    positions[i3 + 1] = y + (Math.random() - 0.5) * 0.09;
    positions[i3 + 2] = z + (Math.random() - 0.5) * 0.14;
    const color = colors[(i + strand) % colors.length];
    particleColors[i3] = color.r;
    particleColors[i3 + 1] = color.g;
    particleColors[i3 + 2] = color.b;
    phases[i] = Math.random() * Math.PI * 2;
  }

  const geometry = new BufferGeometry();
  geometry.setAttribute("position", new BufferAttribute(positions, 3));
  geometry.setAttribute("color", new BufferAttribute(particleColors, 3));
  const particles = new Points(geometry, new PointsMaterial({
    size: window.innerWidth < 720 ? 0.026 : 0.022,
    transparent: true,
    opacity: 0.72,
    vertexColors: true,
    depthWrite: false,
    blending: AdditiveBlending,
  }));
  scene.add(particles);

  const routePoints = 160;
  const routePositions = new Float32Array(routePoints * 3);
  for (let i = 0; i < routePoints; i += 1) {
    const t = i / (routePoints - 1);
    const i3 = i * 3;
    routePositions[i3] = -3.8 + t * 7.6;
    routePositions[i3 + 1] = Math.sin(t * 6.1 - 0.8) * 1.35 + Math.cos(t * 13.4) * 0.19;
    routePositions[i3 + 2] = 0;
  }
  const routeGeometry = new BufferGeometry();
  routeGeometry.setAttribute("position", new BufferAttribute(routePositions, 3));
  const route = new Line(routeGeometry, new LineBasicMaterial({ color: palette[0], transparent: true, opacity: 0.18 }));
  scene.add(route);

  let width = 1;
  let height = 1;
  let frame = 0;
  let visible = true;
  let pointerX = 0;
  let pointerY = 0;
  let smoothX = 0;
  let smoothY = 0;
  const base = positions.slice();

  const resize = () => {
    const rect = canvas.getBoundingClientRect();
    width = Math.max(rect.width, 1);
    height = Math.max(rect.height, 1);
    renderer.setSize(width, height, false);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
  };

  const render = (time = 0) => {
    if (motionDisabled || !visible) { frame = 0; renderer.render(scene, camera); return; }
    smoothX += (pointerX - smoothX) * 0.035;
    smoothY += (pointerY - smoothY) * 0.035;
    const attr = geometry.getAttribute("position") as BufferAttribute;
    const array = attr.array as Float32Array;
    for (let i = 0; i < pointCount; i += 1) {
      const i3 = i * 3;
      array[i3 + 1] = base[i3 + 1] + Math.sin(time * 0.0007 + phases[i]) * 0.025;
    }
    attr.needsUpdate = true;
    scene.rotation.y = smoothX * 0.035 + Math.sin(time * 0.00016) * 0.035;
    scene.rotation.x = smoothY * -0.028;
    paper.rotation.z = -0.08 + Math.sin(time * 0.00024) * 0.018;
    nodes.forEach((node, index) => { node.scale.setScalar(1 + Math.sin(time * 0.0014 + index) * 0.12); });
    renderer.render(scene, camera);
    frame = window.requestAnimationFrame(render);
  };
  const start = () => { if (!frame && !motionDisabled) frame = window.requestAnimationFrame(render); };
  const stop = () => { if (frame) window.cancelAnimationFrame(frame); frame = 0; renderer.render(scene, camera); };

  canvas.addEventListener("pointermove", (event) => {
    const rect = canvas.getBoundingClientRect();
    pointerX = ((event.clientX - rect.left) / rect.width - 0.5) * 2;
    pointerY = ((event.clientY - rect.top) / rect.height - 0.5) * 2;
  });
  const observer = new IntersectionObserver((entries) => {
    visible = Boolean(entries[0]?.isIntersecting);
    if (visible) start(); else stop();
  }, { rootMargin: "120px" });
  observer.observe(canvas);
  window.addEventListener("resize", resize);
  window.addEventListener("yven:motion", (event) => {
    const disabled = (event as CustomEvent<{ disabled: boolean }>).detail.disabled;
    if (disabled) stop(); else start();
  });
  resize();
  renderer.render(scene, camera);
  start();
}

function setupCanvases() {
  const hero = document.querySelector<HTMLCanvasElement>("[data-hero-canvas]");
  const footer = document.querySelector<HTMLCanvasElement>("[data-footer-canvas]");
  if (hero) makeRouteCanvas(hero, ["#173a32", "#a58d5e", "#713b36", "#d7c69e"], 1600);
  if (footer) makeRouteCanvas(footer, ["#d9c8a1", "#9bb3aa", "#713b36"], 950);
}

setupMotionToggle();
setupReveal();
setupTilt();
setupMagnetic();
setupProjectFilters();
setupCopy();
setupCanvases();
updateScroll();
window.addEventListener("pointermove", updatePointer, { passive: true });
window.addEventListener("scroll", updateScroll, { passive: true });
