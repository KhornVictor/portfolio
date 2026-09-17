<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from "vue";
import { beatAt, useMusicState } from "../../composables/useMusicState";

const props = withDefaults(
  defineProps<{
    color?: string;
    cell?: number;
    radius?: number;
  }>(),
  { color: "13, 13, 15", cell: 26, radius: 170 }
);

const canvas = ref<HTMLCanvasElement | null>(null);

let ctx: CanvasRenderingContext2D | null = null;
let raf = 0;
let ro: ResizeObserver | null = null;

// Grid state
let cols = 0;
let rows = 0;
let bits = new Uint8Array(0); // 0 or 1 per cell

// Cursor (raw + smoothed) in CSS pixels relative to the canvas
let mx = -9999;
let my = -9999;
let smx = -9999;
let smy = -9999;
let active = false;

const BASE_ALPHA = 0.05;
const MAX_ALPHA = 0.85;

// CAVA-style spectrum: every column of the grid is one frequency bar that
// rises from the bottom. `levels` holds the smoothed bar heights (0..1).
let levels = new Float32Array(0);
const BAR_ALPHA = 0.75; // brightness of cells inside a bar
const PEAK_ALPHA = 1; // the sinking peak marker on top of each bar

// Water ripples: concentric waves that propagate outward when clicking the grid.
interface Ripple {
  x: number;
  y: number;
  startTime: number;
  duration: number; // in seconds
  speed: number; // px / sec
  wavelength: number; // px
  sigma: number; // envelope width px
  amplitude: number; // px displacement
  // Precomputed values updated once per frame:
  age: number;
  decay: number;
  rFront: number;
  minR: number;
  maxR: number;
}

const ripples: Ripple[] = [];
const MAX_RIPPLES = 10;
let lastRippleTime = 0;
let lastRippleX = -9999;
let lastRippleY = -9999;

function addRipple(x: number, y: number) {
  const now = performance.now();
  // Prevent duplicate triggers for the same click event
  if (now - lastRippleTime < 30 && Math.hypot(x - lastRippleX, y - lastRippleY) < 10) {
    return;
  }
  lastRippleTime = now;
  lastRippleX = x;
  lastRippleY = y;

  if (ripples.length >= MAX_RIPPLES) {
    ripples.shift();
  }

  ripples.push({
    x,
    y,
    startTime: now,
    duration: 2.6,
    speed: 360,
    wavelength: 52,
    sigma: 56,
    amplitude: 18,
    age: 0,
    decay: 1,
    rFront: 0,
    minR: 0,
    maxR: 0,
  });
}

// The music disc plays through a YouTube iframe, whose audio is cross-origin
// and can't be analysed. While it plays we synthesise a plausible spectrum
// instead: a beat envelope shaped like a mix (strong lows, tapering highs)
// with per-column wobble, with a fast attack and gravity fall like CAVA.
const music = useMusicState();
let synthBars = new Float32Array(0);
let synthPeaks = new Float32Array(0);
let synthVel = new Float32Array(0);
let synthPhase = new Float32Array(0); // per-column wobble offset

function synthSample(out: Float32Array, now: number): boolean {
  const n = out.length;
  if (synthBars.length !== n) {
    synthBars = new Float32Array(n);
    synthPeaks = new Float32Array(n);
    synthVel = new Float32Array(n);
    synthPhase = Float32Array.from({ length: n }, () => Math.random() * Math.PI * 2);
  }
  const t = now / 1000;
  const { kick, snare, energy } = beatAt(now);
  // Calm tracks keep the bars low and lazy; wild ones slam them up.
  const gain = 0.6 + 0.4 * Math.min(energy, 2);

  for (let i = 0; i < n; i++) {
    const f = i / Math.max(n - 1, 1); // 0 = lows, 1 = highs
    const shape = 0.85 * (1 - f) * (1 - f) + 0.2; // mix-like spectral tilt
    const wobble = 0.5 + 0.5 * Math.sin(t * (1.7 + f * 2.3) + synthPhase[i]);
    const hit = kick * (1 - f * 0.6) + snare * (0.3 + f * 0.7);
    const level = Math.min(1, shape * gain * (0.18 + 0.32 * wobble + 0.6 * hit * energy));

    if (level >= synthBars[i]) {
      synthBars[i] = level;
      synthVel[i] = 0;
    } else {
      synthVel[i] += 0.06;
      synthBars[i] = Math.max(level, synthBars[i] - synthVel[i] * 0.1);
    }
    synthPeaks[i] =
      synthBars[i] >= synthPeaks[i] ? synthBars[i] : Math.max(synthBars[i], synthPeaks[i] - 0.015);
    out[i] = synthBars[i];
  }
  return true;
}

function resize() {
  const el = canvas.value;
  if (!el || !ctx) return;

  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  const w = el.clientWidth;
  const h = el.clientHeight;

  el.width = Math.round(w * dpr);
  el.height = Math.round(h * dpr);
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

  cols = Math.ceil(w / props.cell) + 1;
  rows = Math.ceil(h / props.cell) + 1;

  const next = new Uint8Array(cols * rows);
  for (let i = 0; i < next.length; i++) next[i] = Math.random() < 0.5 ? 1 : 0;
  bits = next;
  levels = new Float32Array(cols);
}

function frame() {
  const el = canvas.value;
  if (!el || !ctx) return;

  const w = el.clientWidth;
  const h = el.clientHeight;
  ctx.clearRect(0, 0, w, h);

  // Ease the cursor position for a smooth magnetic feel
  if (active) {
    smx += (mx - smx) * 0.18;
    smy += (my - smy) * 0.18;
  }

  const cell = props.cell;
  const radius = props.radius;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  // Synthesise fresh bar heights while the music disc is playing.
  const live =
    music.playing.value && music.visualizer.value && synthSample(levels, performance.now());

  // Update active water ripples
  const now = performance.now();
  for (let i = ripples.length - 1; i >= 0; i--) {
    const rip = ripples[i];
    const age = (now - rip.startTime) / 1000;
    if (age >= rip.duration) {
      ripples.splice(i, 1);
      continue;
    }
    rip.age = age;
    rip.decay = Math.pow(1 - age / rip.duration, 1.5);
    rip.rFront = rip.speed * age;
    rip.minR = Math.max(0, rip.rFront - rip.sigma * 2.8);
    rip.maxR = rip.rFront + rip.wavelength * 0.25;
  }
  const numRipples = ripples.length;

  for (let r = 0; r < rows; r++) {
    // Rows counted from the bottom, so bars grow upward like CAVA.
    const fromBottom = rows - 1 - r;
    for (let c = 0; c < cols; c++) {
      const idx = r * cols + c;
      const cx = c * cell + cell / 2;
      const cy = r * cell + cell / 2;

      // Distance to the (smoothed) cursor
      let intensity = 0;
      let ox = 0;
      let oy = 0;
      if (active) {
        const dx = smx - cx;
        const dy = smy - cy;
        const dist = Math.hypot(dx, dy);
        if (dist < radius) {
          const t = 1 - dist / radius;
          intensity = t * t; // ease-in falloff
          const pull = intensity * 10; // magnetic pull toward cursor
          if (dist > 0.001) {
            ox = (dx / dist) * pull;
            oy = (dy / dist) * pull;
          }
        }
      }

      // Water ripples displacement, crest lighting, and turbulence
      let rippleOx = 0;
      let rippleOy = 0;
      let maxRippleGlow = 0;
      let maxRippleDisturb = 0;

      if (numRipples > 0) {
        for (let i = 0; i < numRipples; i++) {
          const rip = ripples[i];
          const rx = cx - rip.x;
          const ry = cy - rip.y;
          const dist = Math.hypot(rx, ry);

          // Check if within wave packet or initial splash center
          if (dist < rip.minR || dist > rip.maxR) {
            if (rip.age < 0.25 && dist < 60) {
              const splash = (1 - rip.age / 0.25) * (1 - dist / 60);
              maxRippleGlow = Math.max(maxRippleGlow, splash * 0.85);
              maxRippleDisturb = Math.max(maxRippleDisturb, splash * 0.25);
            }
            continue;
          }

          const dr = dist - rip.rFront;
          const env = Math.exp(-(dr * dr) / (2 * rip.sigma * rip.sigma));
          const wave = Math.cos((dr / rip.wavelength) * Math.PI * 2) * env;
          const geom = Math.sqrt(60 / Math.max(dist, 60));
          const disp = wave * rip.amplitude * rip.decay * geom;

          if (dist > 0.001) {
            rippleOx += (rx / dist) * disp;
            rippleOy += (ry / dist) * disp;
          }

          const crest = Math.max(0, wave) * rip.decay * geom;
          if (crest > maxRippleGlow) maxRippleGlow = crest;

          const disturb = Math.abs(wave) * rip.decay * geom * 0.16;
          if (disturb > maxRippleDisturb) maxRippleDisturb = disturb;
        }
      }

      // Spectrum bar for this column: cells below the bar height light up,
      // the topmost lit cell (or the held peak) glows brightest.
      let bar = 0;
      if (live) {
        const height = levels[c] * rows;
        const peakRow = Math.round(synthPeaks[c] * rows);
        if (fromBottom < height) {
          // Brighter toward the top of the bar.
          bar = BAR_ALPHA * (0.45 + 0.55 * (fromBottom / Math.max(height, 1)));
        } else if (fromBottom === peakRow && peakRow > 0) {
          bar = PEAK_ALPHA;
        }
      }

      // Randomly flip the bit — faster near cursor, inside bar, or during water ripple turbulence
      if (Math.random() < 0.004 + intensity * 0.06 + bar * 0.15 + maxRippleDisturb) {
        bits[idx] ^= 1;
      }

      const glow = Math.max(intensity, bar, maxRippleGlow);
      const alpha = BASE_ALPHA + glow * (MAX_ALPHA - BASE_ALPHA);
      const size = 13 + glow * 5;
      ctx.font = `${size}px "JetBrains Mono", ui-monospace, monospace`;
      ctx.fillStyle = `rgba(${props.color}, ${alpha})`;
      ctx.fillText(bits[idx] ? "1" : "0", cx + ox + rippleOx, cy + oy + rippleOy);
    }
  }

  raf = requestAnimationFrame(frame);
}

function onMove(e: PointerEvent) {
  const el = canvas.value;
  if (!el) return;
  const rect = el.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;
  // Only treat as active while the pointer is over the hero area
  const inside = x >= 0 && y >= 0 && x <= rect.width && y <= rect.height;
  if (inside && !active) {
    smx = x;
    smy = y;
  }
  active = inside;
  mx = x;
  my = y;
}

function onLeave() {
  active = false;
}

function onPointerDown(e: PointerEvent) {
  if (e.button !== 0 && e.pointerType === "mouse") return;
  const target = e.target as HTMLElement | null;
  if (target && ["INPUT", "TEXTAREA", "SELECT"].includes(target.tagName)) return;

  const el = canvas.value;
  if (!el) return;
  const rect = el.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;

  if (x >= 0 && y >= 0 && x <= rect.width && y <= rect.height) {
    addRipple(x, y);
  }
}

function drawStatic() {
  // Reduced-motion: render a single quiet frame, no animation
  const el = canvas.value;
  if (!el || !ctx) return;
  ctx.clearRect(0, 0, el.clientWidth, el.clientHeight);
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.font = `13px "JetBrains Mono", ui-monospace, monospace`;
  ctx.fillStyle = `rgba(${props.color}, ${BASE_ALPHA})`;
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      ctx.fillText(
        bits[r * cols + c] ? "1" : "0",
        c * props.cell + props.cell / 2,
        r * props.cell + props.cell / 2
      );
    }
  }
}

onMounted(() => {
  const el = canvas.value;
  if (!el) return;
  ctx = el.getContext("2d");
  if (!ctx) return;

  const reduced = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  resize();

  ro = new ResizeObserver(() => {
    resize();
    if (reduced) drawStatic();
  });
  ro.observe(el);

  if (reduced) {
    drawStatic();
    return;
  }

  window.addEventListener("pointermove", onMove, { passive: true });
  window.addEventListener("pointerleave", onLeave);
  window.addEventListener("pointerdown", onPointerDown);
  raf = requestAnimationFrame(frame);
});

onBeforeUnmount(() => {
  cancelAnimationFrame(raf);
  ro?.disconnect();
  window.removeEventListener("pointermove", onMove);
  window.removeEventListener("pointerleave", onLeave);
  window.removeEventListener("pointerdown", onPointerDown);
});

defineExpose({
  triggerRipple: addRipple,
});
</script>

<template>
  <canvas
    ref="canvas"
    aria-hidden="true"
    class="block h-full w-full"
    @pointerdown="onPointerDown"
  ></canvas>
</template>
