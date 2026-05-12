import {
  AdditiveBlending,
  AmbientLight,
  BufferAttribute,
  BufferGeometry,
  Color,
  DirectionalLight,
  Group,
  IcosahedronGeometry,
  Mesh,
  MeshBasicMaterial,
  MeshPhysicalMaterial,
  PerspectiveCamera,
  Points,
  PointsMaterial,
  Scene,
  TorusGeometry,
  Vector2,
  WebGLRenderer,
} from "three";
import { siteContent } from "../data/siteContent";

const root = document.documentElement;
const body = document.body;
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const typeWords = [...siteContent.hero.typeWords];
let typeIndex = 0;
let charIndex = typeWords[0].length;
let deleting = false;

function updatePointer(event: PointerEvent) {
  root.style.setProperty("--pointer-x", `${event.clientX}px`);
  root.style.setProperty("--pointer-y", `${event.clientY}px`);
}

function updateScrollMeter() {
  const total = document.documentElement.scrollHeight - window.innerHeight;
  const progress = total > 0 ? (window.scrollY / total) * 100 : 0;
  root.style.setProperty("--scroll", `${Math.min(progress, 100)}%`);
}

function rotateType() {
  const target = document.querySelector<HTMLElement>("[data-typewriter]");
  if (!target || reduceMotion) return;

  const word = typeWords[typeIndex];
  target.textContent = word.slice(0, charIndex);

  if (!deleting && charIndex < word.length) {
    charIndex += 1;
    window.setTimeout(rotateType, 86);
    return;
  }

  if (!deleting && charIndex === word.length) {
    deleting = true;
    window.setTimeout(rotateType, 1200);
    return;
  }

  if (deleting && charIndex > 0) {
    charIndex -= 1;
    window.setTimeout(rotateType, 34);
    return;
  }

  deleting = false;
  typeIndex = (typeIndex + 1) % typeWords.length;
  window.setTimeout(rotateType, 240);
}

function setupTheme() {
  const saved = localStorage.getItem("yven-theme");
  body.classList.toggle("theme-night", saved === "night");
  body.classList.toggle("theme-day", saved !== "night");

  document.querySelectorAll("[data-theme-toggle]").forEach((button) => {
    button.addEventListener("click", () => {
      const isNight = body.classList.toggle("theme-night");
      body.classList.toggle("theme-day", !isNight);
      localStorage.setItem("yven-theme", isNight ? "night" : "day");
    });
  });
}

function setupReveal() {
  const items = document.querySelectorAll<HTMLElement>("[data-reveal]");
  if (!items.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );

  items.forEach((item) => observer.observe(item));
}

function setupTilt() {
  if (reduceMotion) return;

  document.querySelectorAll<HTMLElement>("[data-tilt]").forEach((card) => {
    card.addEventListener("pointermove", (event) => {
      const rect = card.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width - 0.5;
      const y = (event.clientY - rect.top) / rect.height - 0.5;
      card.style.setProperty("--rx", `${y * -7}deg`);
      card.style.setProperty("--ry", `${x * 7}deg`);
      card.style.setProperty("--mx", `${(event.clientX - rect.left) / rect.width}`);
      card.style.setProperty("--my", `${(event.clientY - rect.top) / rect.height}`);
    });

    card.addEventListener("pointerleave", () => {
      card.style.setProperty("--rx", "0deg");
      card.style.setProperty("--ry", "0deg");
    });
  });
}

function setupMagneticButtons() {
  if (reduceMotion) return;

  document.querySelectorAll<HTMLElement>(".magnetic").forEach((item) => {
    item.addEventListener("pointermove", (event) => {
      const rect = item.getBoundingClientRect();
      const x = event.clientX - rect.left - rect.width / 2;
      const y = event.clientY - rect.top - rect.height / 2;
      item.style.transform = `translate(${x * 0.08}px, ${y * 0.16}px)`;
    });

    item.addEventListener("pointerleave", () => {
      item.style.transform = "";
    });
  });
}

function setupTeleport() {
  document.querySelectorAll<HTMLAnchorElement>("[data-teleport]").forEach((link) => {
    link.addEventListener("click", (event) => {
      const href = link.getAttribute("href");
      if (!href || href.startsWith("#") || reduceMotion) return;

      event.preventDefault();
      body.classList.add("is-warping");
      window.setTimeout(() => {
        window.location.href = href;
      }, 420);
    });
  });
}

function setupCopy() {
  document.querySelectorAll<HTMLButtonElement>("[data-copy]").forEach((button) => {
    const original = button.textContent ?? "";
    button.addEventListener("click", async () => {
      try {
        await navigator.clipboard.writeText(button.dataset.copy ?? "");
        button.textContent = "已复制";
      } catch {
        button.textContent = "复制失败";
      }

      window.setTimeout(() => {
        button.textContent = original;
      }, 1500);
    });
  });
}

function setupCommandPalette() {
  const palette = document.querySelector<HTMLElement>("[data-command-palette]");
  const input = document.querySelector<HTMLInputElement>("[data-command-input]");
  const items = Array.from(document.querySelectorAll<HTMLAnchorElement>("[data-command-item]"));
  if (!palette || !input || !items.length) return;

  const open = () => {
    palette.classList.add("is-open");
    palette.setAttribute("aria-hidden", "false");
    window.setTimeout(() => input.focus(), 30);
  };

  const close = () => {
    palette.classList.remove("is-open");
    palette.setAttribute("aria-hidden", "true");
    input.value = "";
    items.forEach((item) => item.classList.remove("is-hidden"));
  };

  document.querySelectorAll("[data-command-open]").forEach((button) => {
    button.addEventListener("click", open);
  });

  document.querySelectorAll("[data-command-close]").forEach((button) => {
    button.addEventListener("click", close);
  });

  input.addEventListener("input", () => {
    const query = input.value.trim().toLowerCase();
    items.forEach((item) => {
      item.classList.toggle("is-hidden", !item.textContent?.toLowerCase().includes(query));
    });
  });

  window.addEventListener("keydown", (event) => {
    if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
      event.preventDefault();
      open();
    }
    if (event.key === "Escape") close();
  });
}

function setupProjectBrowser() {
  const filters = Array.from(document.querySelectorAll<HTMLButtonElement>("[data-filter]"));
  const search = document.querySelector<HTMLInputElement>("[data-project-search]");
  const cards = Array.from(document.querySelectorAll<HTMLElement>("[data-project-card]"));
  const inspector = document.querySelector<HTMLElement>("[data-project-inspector]");
  if (!cards.length) return;

  let activeFilter = "all";

  const apply = () => {
    const query = search?.value.trim().toLowerCase() ?? "";
    cards.forEach((card) => {
      const haystack = [
        card.dataset.title,
        card.dataset.summary,
        card.dataset.stack,
        card.dataset.category,
      ]
        .join(" ")
        .toLowerCase();
      const filterMatch = activeFilter === "all" || card.dataset.category === activeFilter;
      const searchMatch = !query || haystack.includes(query);
      card.classList.toggle("is-hidden", !(filterMatch && searchMatch));
    });
  };

  filters.forEach((filter) => {
    filter.addEventListener("click", () => {
      activeFilter = filter.dataset.filter ?? "all";
      filters.forEach((item) => item.classList.remove("is-active"));
      filter.classList.add("is-active");
      apply();
    });
  });

  search?.addEventListener("input", apply);

  if (inspector) {
    cards.forEach((card) => {
      card.addEventListener("pointerenter", () => {
        inspector.innerHTML = `
          <span>项目预览</span>
          <h3>${card.dataset.title ?? "项目"}</h3>
          <p>${card.dataset.summary ?? ""}</p>
          <small>${card.dataset.stack ?? ""}</small>
        `;
      });
    });
  }
}

function setupHeroScene() {
  if (reduceMotion) return;

  document.querySelectorAll<HTMLCanvasElement>("[data-hero-webgl]").forEach((canvas) => {
    const rect = () => canvas.getBoundingClientRect();
    let width = Math.max(rect().width, 1);
    let height = Math.max(rect().height, 1);
    const pointer = new Vector2(0, 0);
    const target = new Vector2(0, 0);
    const scene = new Scene();
    const camera = new PerspectiveCamera(52, width / height, 0.1, 100);
    const renderer = new WebGLRenderer({
      alpha: true,
      antialias: true,
      canvas,
      powerPreference: "high-performance",
      preserveDrawingBuffer: true,
    });
    const group = new Group();
    const isSubtle = canvas.classList.contains("subtle");
    const particleCount = window.innerWidth < 720 ? 260 : isSubtle ? 420 : 760;
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    const palette = [
      new Color("#58c6ad"),
      new Color("#e49ab4"),
      new Color("#78aee8"),
      new Color("#e7d77b"),
      new Color("#a99bed"),
    ];

    for (let i = 0; i < particleCount; i += 1) {
      const radius = 1.4 + Math.random() * 2.6;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const i3 = i * 3;
      positions[i3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[i3 + 2] = radius * Math.cos(phi);
      const color = palette[i % palette.length];
      colors[i3] = color.r;
      colors[i3 + 1] = color.g;
      colors[i3 + 2] = color.b;
    }

    const particleGeometry = new BufferGeometry();
    particleGeometry.setAttribute("position", new BufferAttribute(positions, 3));
    particleGeometry.setAttribute("color", new BufferAttribute(colors, 3));
    const particles = new Points(
      particleGeometry,
      new PointsMaterial({
        color: "#ffffff",
        size: window.innerWidth < 720 ? 0.032 : 0.022,
        transparent: true,
        opacity: isSubtle ? 0.34 : 0.56,
        vertexColors: true,
        depthWrite: false,
        blending: AdditiveBlending,
      })
    );

    const core = new Mesh(
      new IcosahedronGeometry(1.1, 4),
      new MeshPhysicalMaterial({
        color: "#e7fff7",
        emissive: "#58c6ad",
        emissiveIntensity: 0.12,
        metalness: 0.05,
        roughness: 0.24,
        transmission: 0.18,
        transparent: true,
        opacity: isSubtle ? 0.18 : 0.32,
        wireframe: false,
      })
    );

    const rings = new Group();
    ["#58c6ad", "#e49ab4", "#78aee8"].forEach((color, index) => {
      const ring = new Mesh(
        new TorusGeometry(1.68 + index * 0.38, 0.006, 12, 180),
        new MeshBasicMaterial({ color, transparent: true, opacity: isSubtle ? 0.15 : 0.26 })
      );
      ring.rotation.x = Math.PI / 2.5 + index * 0.18;
      ring.rotation.y = index * 0.5;
      rings.add(ring);
    });

    group.add(particles, core, rings);
    scene.add(group);
    scene.add(new AmbientLight("#ffffff", 1.6));
    const light = new DirectionalLight("#ffffff", 2.4);
    light.position.set(2, 4, 5);
    scene.add(light);

    camera.position.set(0, 0, 5.6);

    function resize() {
      width = Math.max(rect().width, 1);
      height = Math.max(rect().height, 1);
      renderer.setSize(width, height, false);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.75));
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
    }

    function animate(time = 0) {
      const scroll = window.scrollY / Math.max(window.innerHeight, 1);
      pointer.lerp(target, 0.055);
      group.rotation.y = time * 0.00008 + pointer.x * 0.22 + scroll * 0.08;
      group.rotation.x = Math.sin(time * 0.00012) * 0.16 + pointer.y * 0.12;
      rings.rotation.z = time * 0.00018;
      core.rotation.x = time * 0.00016;
      core.rotation.y = time * 0.00022;
      renderer.render(scene, camera);
      window.requestAnimationFrame(animate);
    }

    canvas.addEventListener("pointermove", (event) => {
      const bounds = canvas.getBoundingClientRect();
      target.x = ((event.clientX - bounds.left) / bounds.width - 0.5) * 2;
      target.y = -((event.clientY - bounds.top) / bounds.height - 0.5) * 2;
    });

    resize();
    animate();
    window.addEventListener("resize", resize);
  });
}

window.addEventListener("pointermove", updatePointer);
window.addEventListener("scroll", updateScrollMeter, { passive: true });
window.addEventListener("resize", updateScrollMeter);

setupTheme();
setupReveal();
setupTilt();
setupMagneticButtons();
setupTeleport();
setupCopy();
setupCommandPalette();
setupProjectBrowser();
setupHeroScene();
updateScrollMeter();
rotateType();
