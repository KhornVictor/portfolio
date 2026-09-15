<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from "vue";
import SocialIcon from "./SocialIcon.vue";

const props = withDefaults(
  defineProps<{
    socials: { network: string; url: string }[];
    email?: string;
    /** Base icon size in px. */
    size?: number;
    /** How much the hovered icon grows (1.6 = 160%). */
    magnify?: number;
  }>(),
  { size: 44, magnify: 1.7 },
);

const items = computed(() => [
  ...props.socials.map((p) => ({ label: p.network, url: p.url })),
  ...(props.email ? [{ label: "Email", url: `mailto:${props.email}` }] : []),
]);

const dock = ref<HTMLElement | null>(null);
const open = ref(false);
// Per-item scale (1 = rest); driven by the cursor's distance to each icon.
const scales = ref<number[]>([]);

const RANGE = 110; // px around the cursor that feels the magnification

function onMove(e: MouseEvent) {
  const el = dock.value;
  if (!el) return;
  const icons = el.querySelectorAll<HTMLElement>(".dock-item");
  const next: number[] = [];
  icons.forEach((icon) => {
    const r = icon.getBoundingClientRect();
    const cy = r.top + r.height / 2;
    const d = Math.abs(e.clientY - cy);
    // Cosine falloff: full magnification at the icon, 1 at RANGE and beyond.
    const t = d >= RANGE ? 0 : (1 + Math.cos((Math.PI * d) / RANGE)) / 2;
    next.push(1 + (props.magnify - 1) * t);
  });
  scales.value = next;
}

function reset() {
  scales.value = [];
}

const ZONE = 0.15;
const MIN_ZONE = 96;
const hovering = ref(false); // pointer is over the dock itself
let closeTimer: ReturnType<typeof setTimeout> | undefined;

function onWindowMove(e: MouseEvent) {
  const zone = Math.max(MIN_ZONE, window.innerWidth * ZONE);
  const inZone = window.innerWidth - e.clientX <= zone;
  if (inZone || hovering.value) {
    if (closeTimer) clearTimeout(closeTimer);
    closeTimer = undefined;
    open.value = true;
  } else if (open.value && !closeTimer) {
    // Small grace period so a quick wobble past the zone doesn't slam it shut.
    closeTimer = setTimeout(() => {
      open.value = false;
      closeTimer = undefined;
    }, 150);
  }
}

function onEnter() {
  hovering.value = true;
}

function onLeave() {
  hovering.value = false;
  reset();
}

onMounted(() => {
  window.addEventListener("mousemove", onWindowMove, { passive: true });
});
onBeforeUnmount(() => {
  window.removeEventListener("mousemove", onWindowMove);
  if (closeTimer) clearTimeout(closeTimer);
});
</script>

<template>
  <div
    v-if="items.length"
    class="dock-wrap"
    :class="{ 'is-open': open }"
    @mouseenter="onEnter"
    @mouseleave="onLeave"
    @touchstart.passive="open = true"
  >
    <nav
      ref="dock"
      class="dock"
      aria-label="Social links"
      @mousemove="onMove"
      @mouseleave="reset"
      @focusin="open = true"
      @focusout="open = false"
    >
      <a
        v-for="(s, i) in items"
        :key="s.label"
        class="dock-item"
        :href="s.url"
        :target="/^(mailto:|\/)/.test(s.url) ? undefined : '_blank'"
        rel="noreferrer"
        :aria-label="s.label"
        :style="{
          '--s': scales[i] ?? 1,
          width: size + 'px',
          height: size + 'px',
        }"
      >
        <span class="dock-tile">
          <SocialIcon :name="s.label" :size="Math.round(size * 0.5)" />
        </span>
        <!-- macOS-style tooltip to the left of the icon -->
        <span class="dock-tip" role="tooltip">{{ s.label }}</span>
      </a>
    </nav>
  </div>
</template>

<style scoped>
/* Wrapper: pinned to the right edge, vertically centered. Slid off-screen at
   rest; the padding on the left keeps the dock open while the cursor moves
   between the edge strip and the icons. */
.dock-wrap {
  position: fixed;
  right: 0;
  top: 50%;
  z-index: 60;
  padding: 1rem 0.75rem 1rem 1.5rem;
  transform: translate(calc(100% - 6px), -50%);
  transition: transform 0.45s cubic-bezier(0.22, 1, 0.36, 1);
}

.dock-wrap.is-open {
  transform: translate(0, -50%);
}

/* The glassy dock tray */
.dock {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  padding: 0.6rem;
  border-radius: 1.4rem;
  background: color-mix(in srgb, var(--color-paper) 60%, transparent);
  border: 1px solid color-mix(in srgb, var(--color-surface) 70%, transparent);
  box-shadow:
    0 20px 50px -20px rgba(var(--shadow-ink), 0.45),
    0 2px 6px rgba(var(--shadow-ink), 0.06),
    inset 0 1px 0 var(--panel-edge);
  backdrop-filter: blur(18px) saturate(1.4);
  -webkit-backdrop-filter: blur(18px) saturate(1.4);
}

/* Each item scales from its right edge so the dock grows toward the page,
   like the macOS Dock grows away from the screen edge. */
.dock-item {
  --s: 1;
  position: relative;
  display: grid;
  place-items: center;
  color: var(--color-ink);
  text-decoration: none;
  transform: scale(var(--s));
  transform-origin: right center;
  transition: transform 0.12s ease-out;
  /* reserve the extra height the magnified icon will take so neighbours spread */
  margin-block: calc((var(--s) - 1) * 12px);
}

.dock-tile {
  display: grid;
  place-items: center;
  width: 100%;
  height: 100%;
  border-radius: 28%;
  background: var(--color-surface);
  border: 1px solid color-mix(in srgb, var(--color-ink) 8%, transparent);
  box-shadow:
    0 8px 18px -10px rgba(var(--shadow-ink), 0.5),
    inset 0 1px 0 var(--panel-edge);
  transition: background 0.2s ease;
}

.dock-item:hover .dock-tile,
.dock-item:focus-visible .dock-tile {
  background: var(--color-ink);
  color: var(--color-paper);
}

.dock-item:focus-visible {
  outline: 2px solid var(--color-ink);
  outline-offset: 3px;
  border-radius: 28%;
}

/* Tooltip: floats to the left of the icon, counter-scaled so it doesn't
   grow with the magnification. */
.dock-tip {
  position: absolute;
  right: calc(100% + 0.9rem);
  top: 50%;
  padding: 0.3rem 0.6rem;
  border-radius: 0.5rem;
  background: var(--color-ink);
  color: var(--color-paper);
  font-size: 0.72rem;
  font-weight: 600;
  letter-spacing: 0.02em;
  white-space: nowrap;
  opacity: 0;
  pointer-events: none;
  transform: translate(6px, -50%) scale(calc(1 / var(--s)));
  transform-origin: right center;
  transition:
    opacity 0.15s ease,
    transform 0.15s ease;
}

.dock-tip::after {
  content: "";
  position: absolute;
  left: 100%;
  top: 50%;
  border: 5px solid transparent;
  border-left-color: var(--color-ink);
  transform: translateY(-50%);
}

.dock-item:hover .dock-tip,
.dock-item:focus-visible .dock-tip {
  opacity: 1;
  transform: translate(0, -50%) scale(calc(1 / var(--s)));
}

/* Touch devices have no hover: keep the dock tucked in but always reachable
   by a small visible handle. */
@media (hover: none) {
  .dock-wrap {
    transform: translate(calc(100% - 14px), -50%);
  }
  .dock-wrap.is-open {
    transform: translate(0, -50%);
  }
}

@media (prefers-reduced-motion: reduce) {
  .dock-wrap,
  .dock-item,
  .dock-tip {
    transition: none;
  }
}
</style>
