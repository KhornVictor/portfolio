<script setup lang="ts">
import { computed, ref } from "vue";
import SocialIcon from "../ui/SocialIcon.vue";

const props = defineProps<{
  socials: { network: string; url: string }[];
  email?: string;
}>();

const items = computed(() => [
  ...props.socials.map((p) => ({ label: p.network, url: p.url })),
  ...(props.email ? [{ label: "Email", url: `mailto:${props.email}` }] : []),
]);

// The track is rendered twice so the marquee can loop without a visible seam.
const loops = [0, 1];

// macOS Dock magnification: icons near the cursor grow, with a cosine
// falloff to their neighbours. `scales` is indexed by the icon's position in
// the whole track (both loop copies).
const MAGNIFY = 1.6;
const RANGE = 140; // px either side of the cursor that feels the effect
const track = ref<HTMLElement | null>(null);
const scales = ref<number[]>([]);

function onMove(e: MouseEvent) {
  const el = track.value;
  if (!el) return;
  const next: number[] = [];
  el.querySelectorAll<HTMLElement>(".dock-item").forEach((icon) => {
    const r = icon.getBoundingClientRect();
    const d = Math.abs(e.clientX - (r.left + r.width / 2));
    const t = d >= RANGE ? 0 : (1 + Math.cos((Math.PI * d) / RANGE)) / 2;
    next.push(1 + (MAGNIFY - 1) * t);
  });
  scales.value = next;
}

function reset() {
  scales.value = [];
}

const scaleAt = (loop: number, i: number) => scales.value[loop * items.value.length + i] ?? 1;
</script>

<template>
  <div
    class="marquee relative flex items-center bg-ink gap-4 py-4 sm:py-5"
    aria-label="Social links"
  >
    <div class="marquee-viewport flex-1">
      <div
        ref="track"
        class="marquee-track flex w-max items-end gap-3"
        @mousemove="onMove"
        @mouseleave="reset"
      >
        <div
          v-for="loop in loops"
          :key="loop"
          class="flex flex-none items-end gap-3 z-50"
          :aria-hidden="loop === 1"
        >
          <a
            v-for="(s, i) in items"
            :key="loop + s.label"
            class="dock-item relative flex flex-col items-center justify-center px-10 text-paper/50 hover:text-paper rounded-full z-50"
            :style="{ '--s': scaleAt(loop, i) }"
            :href="s.url"
            :target="/^(mailto:|\/)/.test(s.url) ? undefined : '_blank'"
            rel="noreferrer"
            :tabindex="loop === 1 ? -1 : undefined"
            :aria-label="s.label"
          >
            <SocialIcon :name="s.label" :size="50" />
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Dock items grow from their bottom edge so they rise up like the macOS
   Dock; --s is written from the script on every mouse move. */
.dock-item {
  --s: 1;
  transform: scale(var(--s));
  transform-origin: center bottom;
  transition:
    transform 0.12s ease-out,
    color 0.2s ease;
  /* push neighbours apart as the icon grows */
  margin-inline: calc((var(--s) - 1) * 14px);
}

/* Tooltip above the icon, counter-scaled so it stays the same size. */
.dock-tip {
  position: absolute;
  bottom: calc(100% + 0.4rem);
  left: 50%;
  padding: 0.3rem 0.6rem;
  border-radius: 0.5rem;
  background: var(--color-paper);
  color: var(--color-ink);
  font-size: 0.72rem;
  font-weight: 600;
  letter-spacing: 0.02em;
  white-space: nowrap;
  opacity: 0;
  pointer-events: none;
  transform: translate(-50%, 6px) scale(calc(1 / var(--s)));
  transform-origin: center bottom;
  transition:
    opacity 0.15s ease,
    transform 0.15s ease;
}

.dock-tip::after {
  content: "";
  position: absolute;
  top: 100%;
  left: 50%;
  border: 5px solid transparent;
  border-top-color: var(--color-paper);
  transform: translateX(-50%);
}

.dock-item:hover .dock-tip,
.dock-item:focus-visible .dock-tip {
  opacity: 1;
  transform: translate(-50%, 0) scale(calc(1 / var(--s)));
}

.dock-item:focus-visible {
  outline: 2px solid var(--color-paper);
  outline-offset: 4px;
}

/* Fade the strip out at both edges. The mask clips to the padding box, so
   the viewport is given headroom (padding pulled back with a negative margin)
   for magnified icons and tooltips to float above the black bar. */
.marquee-viewport {
  --headroom: 6rem;
  padding-top: var(--headroom);
  margin-top: calc(-1 * var(--headroom));
  mask-image: linear-gradient(
    90deg,
    transparent,
    #000 8%,
    #000 92%,
    transparent
  );
}

/* Both copies of the list are laid side by side; sliding by half the track
   width lands exactly on the second copy, so the loop is seamless. */
.marquee-track {
  animation: marquee-scroll 28s linear infinite;
}

.marquee:hover .marquee-track,
.marquee:focus-within .marquee-track {
  animation-play-state: paused;
}

@keyframes marquee-scroll {
  from {
    transform: translateX(0);
  }
  to {
    transform: translateX(calc(-50% - 0.375rem)); /* half width + half the gap */
  }
}

@media (prefers-reduced-motion: reduce) {
  .dock-item,
  .dock-tip {
    transition: none;
  }
  .marquee-track {
    animation: none;
    flex-wrap: wrap;
    width: 100%;
  }
  .marquee-track > [aria-hidden="true"] {
    display: none;
  }
}
</style>
