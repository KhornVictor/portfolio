<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from "vue";
import { useMusicState } from "../../composables/useMusicState";

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

// The music disc plays through a YouTube iframe, whose audio is cross-origin
// and can't be analysed. While it plays we synthesise a plausible spectrum
// instead: a beat envelope shaped like a mix (strong lows, tapering highs)
// with per-column wobble, with a fast attack and gravity fall like CAVA.
const music = useMusicState();
const SYNTH_BPM = 112;
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
  const beatLen = 60 / SYNTH_BPM;
  const beatPos = (t % beatLen) / beatLen; // 0 at the kick, 1 just before the next
  const kick = Math.pow(1 - beatPos, 4); // sharp hit, fast decay
  const bar4 = (t % (beatLen * 4)) / (beatLen * 4);
  const snare = bar4 > 0.5 ? Math.pow(1 - (bar4 - 0.5) * 2, 6) : 0; // on beat 3

  for (let i = 0; i < n; i++) {
    const f = i / Math.max(n - 1, 1); // 0 = lows, 1 = highs
    const shape = 0.85 * (1 - f) * (1 - f) + 0.2; // mix-like spectral tilt
    const wobble = 0.5 + 0.5 * Math.sin(t * (1.7 + f * 2.3) + synthPhase[i]);
    const hit = kick * (1 - f * 0.6) + snare * (0.3 + f * 0.7);
    const level = Math.min(1, shape * (0.18 + 0.32 * wobble + 0.6 * hit));

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
  const live = music.playing.value && synthSample(levels, performance.now());

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

      // Randomly flip the bit — faster near the cursor and inside a bar
      if (Math.random() < 0.004 + intensity * 0.06 + bar * 0.15) bits[idx] ^= 1;

      const glow = Math.max(intensity, bar);
      const alpha = BASE_ALPHA + glow * (MAX_ALPHA - BASE_ALPHA);
      const size = 13 + glow * 5;
      ctx.font = `${size}px "JetBrains Mono", ui-monospace, monospace`;
      ctx.fillStyle = `rgba(${props.color}, ${alpha})`;
      ctx.fillText(bits[idx] ? "1" : "0", cx + ox, cy + oy);
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
  raf = requestAnimationFrame(frame);
});

onBeforeUnmount(() => {
  cancelAnimationFrame(raf);
  ro?.disconnect();
  window.removeEventListener("pointermove", onMove);
  window.removeEventListener("pointerleave", onLeave);
});
</script>

<template>
  <canvas ref="canvas" aria-hidden="true" class="block h-full w-full"></canvas>
</template>
