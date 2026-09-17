<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from "vue";
import meAsciiRaw from "../../assets/markdown/Me.txt?raw";

interface Particle {
  char: string;
  origChar: string;
  col: number;
  row: number;
  homeX: number;
  homeY: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  baseBrightness: number;
  glitchTimer: number;
}

const canvasRef = ref<HTMLCanvasElement | null>(null);
const containerRef = ref<HTMLDivElement | null>(null);

let animationFrameId = 0;
let particles: Particle[] = [];
let currentCharW = 8;
let currentCharH = 12;
let resizeObserver: ResizeObserver | null = null;

const mousePos = ref<{ x: number; y: number; active: boolean }>({
  x: 0,
  y: 0,
  active: false,
});

let shockwaves: {
  x: number;
  y: number;
  radius: number;
  maxRadius: number;
  speed: number;
  intensity: number;
}[] = [];

const GLITCH_CHARS = [
  "0",
  "1",
  "#",
  "%",
  "*",
  "+",
  "$",
  "@",
  ":",
  "~",
  "░",
  "▒",
  "▓",
];

const asciiLines = computed(() => {
  return meAsciiRaw.replace(/\r\n/g, "\n").replace(/\n$/, "").split("\n");
});

function initParticles(width: number, height: number) {
  const lines = asciiLines.value;
  if (!lines.length || width <= 0 || height <= 0) return;

  const rows = lines.length;
  let maxLineLen = 0;
  for (let r = 0; r < rows; r++) {
    const len = lines[r]?.length ?? 0;
    if (len > maxLineLen) maxLineLen = len;
  }

  // Find non-whitespace bounds so the portrait expands full of the box
  let minCol = maxLineLen;
  let maxCol = 0;
  let minRow = rows;
  let maxRow = 0;

  for (let r = 0; r < rows; r++) {
    const line = lines[r] ?? "";
    for (let c = 0; c < line.length; c++) {
      const ch = line[c];
      if (ch && ch !== " ") {
        if (c < minCol) minCol = c;
        if (c > maxCol) maxCol = c;
        if (r < minRow) minRow = r;
        if (r > maxRow) maxRow = r;
      }
    }
  }

  if (minCol > maxCol) {
    minCol = 0;
    maxCol = maxLineLen - 1;
    minRow = 0;
    maxRow = rows - 1;
  }

  const activeCols = Math.max(1, maxCol - minCol + 1);
  const activeRows = Math.max(1, maxRow - minRow + 1);

  const charW = width / activeCols;
  const charH = height / activeRows;
  currentCharW = charW;
  currentCharH = charH;

  particles = [];

  const charDensityMap: Record<string, number> = {
    " ": 0,
    ".": 0.15,
    ":": 0.28,
    "-": 0.38,
    "=": 0.5,
    "+": 0.62,
    "*": 0.74,
    "#": 0.86,
    "%": 0.94,
    "@": 1.0,
  };

  for (let r = minRow; r <= maxRow; r++) {
    const line = lines[r] ?? "";
    for (let c = minCol; c <= maxCol; c++) {
      const ch = line[c] ?? " ";
      if (ch === " ") continue;

      const homeX = (c - minCol + 0.5) * charW;
      const homeY = (r - minRow + 0.5) * charH;
      const baseBrightness = charDensityMap[ch] ?? 0.5;

      particles.push({
        char: ch,
        origChar: ch,
        col: c,
        row: r,
        homeX,
        homeY,
        x: homeX,
        y: homeY,
        vx: 0,
        vy: 0,
        baseBrightness,
        glitchTimer: 0,
      });
    }
  }
}

function handleResize() {
  const canvas = canvasRef.value;
  const container = containerRef.value;
  if (!canvas || !container) return;

  const rect = container.getBoundingClientRect();
  if (rect.width <= 0 || rect.height <= 0) return;

  const dpr = window.devicePixelRatio || 1;

  canvas.width = rect.width * dpr;
  canvas.height = rect.height * dpr;

  const ctx = canvas.getContext("2d");
  if (ctx) ctx.scale(dpr, dpr);

  initParticles(rect.width, rect.height);
}

function onMouseMove(e: MouseEvent) {
  const canvas = canvasRef.value;
  if (!canvas) return;
  const rect = canvas.getBoundingClientRect();
  mousePos.value = {
    x: e.clientX - rect.left,
    y: e.clientY - rect.top,
    active: true,
  };
}

function onMouseLeave() {
  mousePos.value.active = false;
}

function onClick(e: MouseEvent) {
  const canvas = canvasRef.value;
  if (!canvas) return;
  const rect = canvas.getBoundingClientRect();
  const clickX = e.clientX - rect.left;
  const clickY = e.clientY - rect.top;

  shockwaves.push({
    x: clickX,
    y: clickY,
    radius: 0,
    maxRadius: Math.max(rect.width, rect.height) * 1.1,
    speed: 9,
    intensity: 1.0,
  });
}

function render(nowTimestamp = performance.now()) {
  const canvas = canvasRef.value;
  const container = containerRef.value;
  if (!canvas || !container) {
    animationFrameId = requestAnimationFrame(render);
    return;
  }

  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  const width = container.clientWidth;
  const height = container.clientHeight;

  // Solid dark terminal background
  ctx.fillStyle = "#08090d";
  ctx.fillRect(0, 0, width, height);

  // Dynamic gradient continuously shifting every second
  const elapsedSec = nowTimestamp / 1000;
  // Shifts 60 degrees of hue every second (full spectrum loop every 6 seconds)
  const baseHue = (elapsedSec * 60) % 360;
  const hue1 = baseHue;
  const hue2 = (baseHue + 75) % 360;
  const hue3 = (baseHue + 150) % 360;

  // Rotating angle across the portrait
  const angle = (elapsedSec * 0.6) % (Math.PI * 2);
  const cx = width * 0.5;
  const cy = height * 0.5;
  const rx = Math.cos(angle) * (width * 0.55);
  const ry = Math.sin(angle) * (height * 0.55);

  const charGradient = ctx.createLinearGradient(
    cx - rx,
    cy - ry,
    cx + rx,
    cy + ry,
  );
  charGradient.addColorStop(0, `hsl(${hue1}, 100%, 65%)`);
  charGradient.addColorStop(0.5, `hsl(${hue2}, 100%, 60%)`);
  charGradient.addColorStop(1, `hsl(${hue3}, 100%, 65%)`);

  const mx = mousePos.value.x;
  const my = mousePos.value.y;
  const isMouseActive = mousePos.value.active;

  // Update and draw shockwaves
  for (let i = shockwaves.length - 1; i >= 0; i--) {
    const sw = shockwaves[i]!;
    sw.radius += sw.speed;
    sw.intensity = Math.max(0, 1 - sw.radius / sw.maxRadius);

    ctx.save();
    ctx.strokeStyle = `hsl(${(hue1 + 40) % 360}, 100%, 70%)`;
    ctx.lineWidth = 2;
    ctx.globalAlpha = sw.intensity * 0.45;
    ctx.beginPath();
    ctx.arc(sw.x, sw.y, sw.radius, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();

    if (sw.radius >= sw.maxRadius) {
      shockwaves.splice(i, 1);
    }
  }

  // Draw radial flashlight glow at mouse
  if (isMouseActive) {
    const radGlow = ctx.createRadialGradient(mx, my, 10, mx, my, 150);
    radGlow.addColorStop(0, `hsla(${hue2}, 100%, 60%, 0.45)`);
    radGlow.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = radGlow;
    ctx.beginPath();
    ctx.arc(mx, my, 150, 0, Math.PI * 2);
    ctx.fill();
  }

  // Dynamic monospace font sized to expand and fill cells
  const fontSize = Math.max(
    8,
    Math.min(currentCharH * 1.15, currentCharW * 1.9),
  );
  ctx.font = `bold ${fontSize}px "JetBrains Mono", "Courier New", monospace`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillStyle = charGradient;

  const mouseRadius = 90;

  for (let i = 0; i < particles.length; i++) {
    const p = particles[i]!;

    // 1. Mouse repulsion physics
    if (isMouseActive) {
      const dx = p.x - mx;
      const dy = p.y - my;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < mouseRadius && dist > 0) {
        const force = (1 - dist / mouseRadius) * 4.5;
        p.vx += (dx / dist) * force;
        p.vy += (dy / dist) * force;

        // Glitch scramble near mouse
        if (Math.random() < 0.25) {
          p.char =
            GLITCH_CHARS[Math.floor(Math.random() * GLITCH_CHARS.length)]!;
          p.glitchTimer = 8;
        }
      }
    }

    // 2. Shockwave ripple effect
    for (const sw of shockwaves) {
      const dx = p.x - sw.x;
      const dy = p.y - sw.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const waveDist = Math.abs(dist - sw.radius);

      if (waveDist < 35) {
        const waveForce = (1 - waveDist / 35) * sw.intensity * 8;
        p.vx += (dx / (dist || 1)) * waveForce;
        p.vy += (dy / (dist || 1)) * waveForce;

        if (Math.random() < 0.3) {
          p.char =
            GLITCH_CHARS[Math.floor(Math.random() * GLITCH_CHARS.length)]!;
          p.glitchTimer = 15;
        }
      }
    }

    // 3. Spring physics back to home position
    const springK = 0.08;
    const friction = 0.82;

    p.vx += (p.homeX - p.x) * springK;
    p.vy += (p.homeY - p.y) * springK;

    p.vx *= friction;
    p.vy *= friction;

    p.x += p.vx;
    p.y += p.vy;

    // Reset glitch char after timer
    if (p.glitchTimer > 0) {
      p.glitchTimer--;
      if (p.glitchTimer === 0) {
        p.char = p.origChar;
      }
    }

    // 4. Dynamic lighting / luminance
    let lightBoost = 0;
    if (isMouseActive) {
      const dist = Math.hypot(p.x - mx, p.y - my);
      if (dist < 150) {
        lightBoost = Math.max(0, (1 - dist / 150) * 0.75);
      }
    }

    const alpha = Math.min(1.0, Math.max(0.18, p.baseBrightness + lightBoost));

    ctx.globalAlpha = alpha;
    ctx.fillText(p.char, p.x, p.y);
  }

  ctx.globalAlpha = 1.0;

  // Subtle CRT scanlines
  ctx.fillStyle = "rgba(0, 0, 0, 0.12)";
  for (let y = 0; y < height; y += 3) {
    ctx.fillRect(0, y, width, 1);
  }

  animationFrameId = requestAnimationFrame(render);
}

onMounted(() => {
  handleResize();
  window.addEventListener("resize", handleResize);

  if (containerRef.value) {
    resizeObserver = new ResizeObserver(() => {
      handleResize();
    });
    resizeObserver.observe(containerRef.value);
  }

  animationFrameId = requestAnimationFrame(render);
});

onBeforeUnmount(() => {
  window.removeEventListener("resize", handleResize);
  if (resizeObserver) {
    resizeObserver.disconnect();
  }
  cancelAnimationFrame(animationFrameId);
});
</script>

<template>
  <div
    ref="containerRef"
    class="relative w-full h-full min-h-120 overflow-hidden rounded-2xl bg-[#08090d] select-none shadow-[0_14px_35px_rgba(0,0,0,0.6)]"
  >
    <canvas
      ref="canvasRef"
      class="absolute inset-0 w-full h-full cursor-crosshair block"
      @mousemove="onMouseMove"
      @mouseleave="onMouseLeave"
      @click="onClick"
    ></canvas>
  </div>
</template>

<style scoped>
canvas {
  touch-action: none;
}
</style>
