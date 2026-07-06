<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from "vue";

/**
 * BinaryGrid — animated background of 0/1 glyphs.
 * Bits flip randomly on their own, and the cursor acts like a magnet:
 * nearby glyphs are pulled toward it, brighten, grow, and flip faster.
 */
const props = withDefaults(
  defineProps<{
    /** Glyph color as "r, g, b". */
    color?: string;
    /** Grid cell size in px (spacing between glyphs). */
    cell?: number;
    /** Radius of the cursor's influence in px. */
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

  for (let r = 0; r < rows; r++) {
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

      // Randomly flip the bit — faster near the cursor
      if (Math.random() < 0.004 + intensity * 0.06) bits[idx] ^= 1;

      const alpha = BASE_ALPHA + intensity * (MAX_ALPHA - BASE_ALPHA);
      const size = 13 + intensity * 5;
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
