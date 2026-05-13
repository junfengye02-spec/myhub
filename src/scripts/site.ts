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

function setupHeroGlow() {
  const title = document.querySelector<HTMLElement>("[data-hero-glow]");
  if (!title || reduceMotion) return;

  const onMove = (event: PointerEvent) => {
    const rect = title.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * 100;
    const y = ((event.clientY - rect.top) / rect.height) * 100;
    title.style.setProperty("--glow-x", `${x}%`);
    title.style.setProperty("--glow-y", `${y}%`);
  };

  const hero = title.closest(".lab-hero") ?? document;
  hero.addEventListener("pointermove", onMove as EventListener, { passive: true } as AddEventListenerOptions);
}

function setupTerminal() {
  const terminal = document.querySelector<HTMLElement>("[data-terminal]");
  if (!terminal) return;

  const lines = Array.from(terminal.querySelectorAll<HTMLElement>("[data-term-line]"));
  const caret = terminal.querySelector<HTMLElement>("[data-term-caret]");
  if (!lines.length) return;

  const originalText = lines.map((line) => {
    const textEl = line.querySelector<HTMLElement>("[data-term-text]");
    return textEl?.textContent ?? "";
  });

  lines.forEach((line) => {
    const textEl = line.querySelector<HTMLElement>("[data-term-text]");
    if (textEl) textEl.textContent = "";
  });

  if (reduceMotion) {
    lines.forEach((line, i) => {
      const textEl = line.querySelector<HTMLElement>("[data-term-text]");
      if (textEl) textEl.textContent = originalText[i];
      line.classList.add("is-on");
    });
    return;
  }

  const moveCaretTo = (line: HTMLElement) => {
    if (!caret) return;
    const textEl = line.querySelector<HTMLElement>("[data-term-text]");
    if (!textEl) return;
    const rect = textEl.getBoundingClientRect();
    const hostRect = terminal.getBoundingClientRect();
    caret.style.transform = `translate(${rect.right - hostRect.left + 2}px, ${rect.top - hostRect.top}px)`;
  };

  async function typeLine(line: HTMLElement, text: string, speed: number) {
    line.classList.add("is-on");
    const textEl = line.querySelector<HTMLElement>("[data-term-text]");
    if (!textEl) return;
    for (let i = 0; i < text.length; i += 1) {
      textEl.textContent = text.slice(0, i + 1);
      moveCaretTo(line);
      await new Promise((r) => setTimeout(r, speed + Math.random() * 18));
    }
  }

  async function runCycle() {
    for (let i = 0; i < lines.length; i += 1) {
      const line = lines[i];
      const isCmd = line.classList.contains("term-cmd");
      await typeLine(line, originalText[i], isCmd ? 24 : 8);
      await new Promise((r) => setTimeout(r, isCmd ? 360 : 520));
    }
    await new Promise((r) => setTimeout(r, 1800));
    lines.forEach((line) => {
      line.classList.remove("is-on");
      const textEl = line.querySelector<HTMLElement>("[data-term-text]");
      if (textEl) textEl.textContent = "";
    });
    runCycle();
  }

  const start = () => {
    window.setTimeout(runCycle, 420);
  };

  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          start();
          io.disconnect();
        }
      });
    });
    io.observe(terminal);
  } else {
    start();
  }
}

function animateCount(target: HTMLElement, to: number, duration = 1400) {
  if (reduceMotion) {
    target.textContent = String(to);
    return;
  }
  const start = performance.now();
  const ease = (t: number) => 1 - Math.pow(1 - t, 3);
  const tick = (now: number) => {
    const elapsed = Math.min(1, (now - start) / duration);
    const value = Math.round(to * ease(elapsed));
    target.textContent = String(value);
    if (elapsed < 1) window.requestAnimationFrame(tick);
    else target.textContent = String(to);
  };
  window.requestAnimationFrame(tick);
}

function setupCountUp() {
  const targets = document.querySelectorAll<HTMLElement>("[data-countup]");
  targets.forEach((el) => {
    const raw = el.dataset.countup;
    if (!raw) return;
    const value = parseInt(raw, 10);
    if (Number.isNaN(value)) return;
    el.textContent = "0";
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animateCount(el, value);
          io.disconnect();
        }
      });
    }, { threshold: 0.4 });
    io.observe(el);
  });
}

function setupConstellation() {
  const host = document.querySelector<HTMLElement>("[data-constellation]");
  if (!host) return;

  const nodes = Array.from(host.querySelectorAll<HTMLElement>(".constellation-node"));
  const numbers = Array.from(host.querySelectorAll<HTMLElement>("[data-countup-num]"));

  const reveal = () => {
    nodes.forEach((node) => {
      const delay = Number(node.dataset.nodeDelay ?? 0);
      window.setTimeout(() => {
        host.classList.add("is-visible");
      }, delay);
    });
    host.classList.add("is-visible");
    numbers.forEach((num, i) => {
      const val = parseInt(num.dataset.countupNum ?? "0", 10);
      if (Number.isNaN(val)) return;
      window.setTimeout(() => animateCount(num, val, 1300 + i * 80), 320 + i * 90);
    });
  };

  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          reveal();
          io.disconnect();
        }
      });
    }, { threshold: 0.2 });
    io.observe(host);
  } else {
    reveal();
  }
}

function setupTimelineRail() {
  const list = document.querySelector<HTMLElement>("[data-timeline]");
  const rail = list?.querySelector<HTMLElement>("[data-timeline-rail] i");
  if (!list || !rail) return;

  const update = () => {
    const rect = list.getBoundingClientRect();
    const viewportH = window.innerHeight;
    const total = rect.height;
    const travelled = Math.min(
      total,
      Math.max(0, viewportH * 0.62 - rect.top)
    );
    const progress = total > 0 ? (travelled / total) * 100 : 0;
    rail.style.setProperty("--rail", `${Math.min(100, Math.max(0, progress))}%`);
  };

  update();
  window.addEventListener("scroll", update, { passive: true });
  window.addEventListener("resize", update);
}

function setupStripGlow() {
  if (reduceMotion) return;
  document.querySelectorAll<HTMLElement>(".lab-strip div").forEach((cell) => {
    cell.addEventListener("pointermove", (event) => {
      const rect = cell.getBoundingClientRect();
      cell.style.setProperty("--fx", `${((event.clientX - rect.left) / rect.width) * 100}%`);
      cell.style.setProperty("--fy", `${((event.clientY - rect.top) / rect.height) * 100}%`);
    });
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
setupHeroGlow();
setupTerminal();
setupCountUp();
setupConstellation();
setupTimelineRail();
setupStripGlow();
updateScrollMeter();
rotateType();
