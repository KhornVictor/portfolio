<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref } from "vue";
import ArrowIcon from "../ui/ArrowIcon.vue";
import BinaryGrid from "../ui/BinaryGrid.vue";
import EasterEggCard from "../ui/EasterEggCard.vue";
import { imageUrl } from "../../config/assets";
import { useTheme } from "../../composables/useTheme";

const { isDark } = useTheme();
// BinaryGrid takes an "r, g, b" triple; match the current ink colour.
const gridColor = computed(() => (isDark.value ? "242, 242, 244" : "13, 13, 15"));

const props = defineProps<{
  name: string;
  role: string;
  description: string;
  collaborateHref: string;
}>();

// Avatars cycled with a TikTok-style glitch transition.
const avatars = [1, 2, 3, 4, 5, 7, 8].map((n) =>
  imageUrl(`Profile/avatar${n}.png`),
);
const index = ref(0);
const glitch = ref(false);
const frame = ref<HTMLElement | null>(null);
const avatar = computed(() => avatars[index.value]);
const timeDuration = computed(() =>
  avatars.length < 2 ? 0 : 5000 + Math.random() * 1000,
);

let timer: ReturnType<typeof setInterval> | undefined;

async function goTo(step: 1 | -1) {
  if (avatars.length < 2) return;
  index.value = (index.value + step + avatars.length) % avatars.length;
  // Restart the glitch animation on every swap
  glitch.value = false;
  await nextTick();
  void frame.value?.offsetWidth; // force reflow so the animation replays
  glitch.value = true;
}

const nextAvatar = () => goTo(1);

function startTimer() {
  if (timer) clearInterval(timer);
  timer = setInterval(nextAvatar, timeDuration.value);
}

// Manual navigation: swap immediately and reset the auto-cycle countdown.
function onArrow(step: 1 | -1) {
  void goTo(step);
  startTimer();
}

onMounted(() => {
  if (avatars.length < 2) return;
  startTimer();
});

onBeforeUnmount(() => {
  if (timer) clearInterval(timer);
});

const PARALLAX_SHIFT = 18; // px of travel at the hero's edge
const PARALLAX_TILT = 6; // deg of rotation at the hero's edge
const root = ref<HTMLElement | null>(null);
const target = { x: 0, y: 0 };
const current = { x: 0, y: 0 };
let raf: number | undefined;
let parallaxEnabled = false;

function tick() {
  // Lerp toward the target for a smooth, slightly lagging follow.
  current.x += (target.x - current.x) * 0.12;
  current.y += (target.y - current.y) * 0.12;
  const el = frame.value;
  if (el) {
    el.style.setProperty("--px", `${(current.x * PARALLAX_SHIFT).toFixed(2)}px`);
    el.style.setProperty("--py", `${(current.y * PARALLAX_SHIFT).toFixed(2)}px`);
    el.style.setProperty("--rx", `${(-current.y * PARALLAX_TILT).toFixed(2)}deg`);
    el.style.setProperty("--ry", `${(current.x * PARALLAX_TILT).toFixed(2)}deg`);
  }
  const settled = Math.abs(target.x - current.x) < 0.001 && Math.abs(target.y - current.y) < 0.001;
  raf = settled ? undefined : requestAnimationFrame(tick);
}

function scheduleTick() {
  if (raf === undefined) raf = requestAnimationFrame(tick);
}

function onPointerMove(e: PointerEvent) {
  if (!parallaxEnabled || e.pointerType !== "mouse") return;
  const rect = root.value?.getBoundingClientRect();
  if (!rect) return;
  // Normalise the cursor to -1..1 across the hero, 0 at the center.
  target.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
  target.y = ((e.clientY - rect.top) / rect.height) * 2 - 1;
  scheduleTick();
}

function onPointerLeave() {
  target.x = 0;
  target.y = 0;
  scheduleTick();
}

onMounted(() => {
  // Skip on touch devices and for users who prefer reduced motion.
  parallaxEnabled =
    window.matchMedia("(hover: hover)").matches &&
    !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
});

onBeforeUnmount(() => {
  if (raf !== undefined) cancelAnimationFrame(raf);
});

const SECRET = "NITH";
const IDLE_RESET_MS = 30_000;
const typed = ref<string[]>([]);
const eggOpen = ref(false);
let idleTimer: ReturnType<typeof setTimeout> | undefined;

function onLetterClick(ch: string) {
  if (eggOpen.value || ch.trim() === "") return;
  typed.value = [...typed.value, ch.toUpperCase()].slice(-SECRET.length);

  if (idleTimer) clearTimeout(idleTimer);
  idleTimer = setTimeout(() => (typed.value = []), IDLE_RESET_MS);

  if (typed.value.join("") === SECRET) {
    typed.value = [];
    clearTimeout(idleTimer);
    eggOpen.value = true;
  }
}

onBeforeUnmount(() => {
  if (idleTimer) clearTimeout(idleTimer);
});

const nameParts = computed(() => {
  const bits = props.name.trim().split(/\s+/);
  return { first: bits[0] ?? "", rest: bits.slice(1).join(" ") };
});

// Split into individual characters for the staggered pop-in animation.
const firstLetters = computed(() => [...nameParts.value.first]);
const restLetters = computed(() =>
  nameParts.value.rest ? [...(" " + nameParts.value.rest)] : [],
);
</script>

<template>
  <div
    ref="root"
    class="relative flex w-full flex-1 flex-col px-4 py-4 sm:px-7 sm:py-6"
    @pointermove="onPointerMove"
    @pointerleave="onPointerLeave"
  >
    <!-- Binary grid background -->
    <BinaryGrid :color="gridColor" class="pointer-events-none absolute inset-0 z-0" />

    <!-- Giant name -->
    <h1
      class="display relative z-20 giant-name flex flex-col text-center text-[clamp(2.4rem,9vw,7.4rem)] leading-[0.9] sm:block"
      :aria-label="name"
    >
      <span class="text-outline" aria-hidden="true">
        <span
          v-for="(ch, i) in firstLetters"
          :key="'f' + i"
          class="letter cursor-pointer active:scale-100 hover:scale-120 transition-transform duration-300 ease-in-out hover:infinite hover:text-ink/10"
          :style="{ animationDelay: i * 45 + 'ms' }"
          @click="onLetterClick(ch)"
          >{{ ch === " " ? " " : ch }}</span
        >
      </span>
      <span v-if="restLetters.length" class="text-ink" aria-hidden="true">
        <span
          v-for="(ch, i) in restLetters"
          :key="'r' + i"
          class="letter cursor-pointer active:scale-110 hover:scale-120 transition-transform duration-300 ease-in-out hover:infinite hover:text-ink/80"
          :style="{ animationDelay: (firstLetters.length + i) * 45 + 'ms' }"
          @click="onLetterClick(ch)"
          >{{ ch === " " ? " " : ch }}</span
        >
      </span>
    </h1>

    <!-- Portrait -->
    <div
      class="relative 2xl:z-40 mt-[-3vw] flex flex-1 md:scale-150 avatar pointer-events-none pb-10 w-full items-center justify-center"
    >
      <div ref="frame" class="avatar-frame relative 2xl:w-130 xl:w-125 lg:w-117.5 w-105">
        <img
          :src="avatar"
          :alt="name"
          class="avatar-img relative w-full h-full select-none object-contain drop-shadow-[0_30px_50px_rgba(0,0,0,0.18)]"
          :class="{ 'is-glitching': glitch }"
          draggable="false"
        />
        <!-- soft fade so the photo melts into the panel -->
        <div
          class="pointer-events-none absolute inset-x-0 bottom-0 w-full z-20 h-24 bg-linear-to-t from-paper to-transparent"
        ></div>
      </div>
    </div>

    <EasterEggCard v-if="eggOpen" @close="eggOpen = false" />

    <!-- Prev / next avatar arrows, bottom-center. They sit in an invisible hover
         zone and only rise into view while the cursor is inside it. -->
    <div v-if="avatars.length > 1" class="avatar-arrow-zone">
      <button
        type="button"
        class="avatar-arrow"
        aria-label="Previous profile"
        @click="onArrow(-1)"
      >
        <i class="fa-solid fa-caret-left"></i>
      </button>
      <span class="avatar-count" aria-live="polite">
        {{ index + 1 }} / {{ avatars.length }}
      </span>
      <button
        type="button"
        class="avatar-arrow"
        aria-label="Next profile"
        @click="onArrow(1)"
      >
        <i class="fa-solid fa-caret-right"></i>
      </button>
    </div>

    <!-- Overlay: role/description card -->
    <div
      class="relative z-30 mt-2 flex flex-col items-stretch justify-between gap-6 sm:gap-8 md:absolute md:inset-x-8 md:bottom-1 md:mt-0 md:flex-row md:items-end lg:inset-x-12 lg:bottom-12"
    >
      <!-- Between sm and xl only the button shows; hovering/focusing the card expands the full content. -->
      <div
        class="group max-w-full md:max-w-sm lg:max-w-md rounded-2xl transition-[background-color,padding,box-shadow] hover:bg-paper xl:bg-paper hover:p-5 duration-300 border-0 xl:p-10 hover:shadow-2xl xl:shadow-[0px_0px_100px_rgba(0,0,0,0.1)] sm:max-xl:group-hover:bg-paper sm:max-xl:group-hover:p-10 sm:max-xl:group-hover:shadow-[0px_0px_100px_rgba(0,0,0,0.1)] sm:max-xl:group-focus-within:bg-paper sm:max-xl:group-focus-within:p-10 sm:max-xl:group-focus-within:shadow-[0px_0px_100px_rgba(0,0,0,0.1)]"
      >
        <div
          class="grid grid-rows-[1fr] transition-[grid-template-rows,opacity] duration-300 ease-out sm:max-xl:grid-rows-[0fr] sm:max-xl:opacity-0 sm:max-xl:group-hover:grid-rows-[1fr] sm:max-xl:group-hover:opacity-100 sm:max-xl:group-focus-within:grid-rows-[1fr] sm:max-xl:group-focus-within:opacity-100"
        >
          <div class="min-h-0 overflow-hidden">
            <h2
              class="display text-xl tracking-tight sm:text-[1.7rem] lg:text-[2rem]"
            >
              {{ role }}
            </h2>
            <p class="mt-2 text-sm leading-relaxed text-ink/60 sm:text-base">
              {{ description }}
            </p>
          </div>
        </div>
        <a
          class="btn btn-dark mt-5 sm:max-xl:mt-0 sm:max-xl:group-hover:mt-5 sm:max-xl:group-focus-within:mt-5 transition-[margin] duration-500"
          :href="collaborateHref"
        >
          Let's collaborate
          <ArrowIcon :size="16" />
        </a>
      </div>

    </div>
  </div>
</template>

<style scoped>
/* Staggered per-letter pop-in for the giant name */
.letter {
  display: inline-block;
  white-space: pre;
  animation: letter-pop 0.5s cubic-bezier(0.22, 1, 0.36, 1.4) both;
}

@keyframes letter-pop {
  0% {
    transform: scale(0.3) translateY(0.35em);
    opacity: 0;
  }
  60% {
    opacity: 1;
  }
  100% {
    transform: scale(1) translateY(0);
    opacity: 1;
  }
}

@media (prefers-reduced-motion: reduce) {
  .letter {
    animation: none;
  }
}

/* Slide + shrink the portrait on name hover to reveal the full name */
.avatar {
  transition: transform 0.4s ease-in-out;
  transform: translateY(10%);
}

.giant-name:hover ~ .avatar {
  transform: translateY(10%);
}

@media (prefers-reduced-motion: reduce) {
  .giant-name:hover ~ .avatar {
    transform: none;
  }
}

/* Prev / next avatar arrows */
/* Invisible hover zone: a strip along the bottom edge, centered horizontally. */
.avatar-arrow-zone {
  position: absolute;
  bottom: 0;
  left: 50%;
  z-index: 40;
  display: flex;
  align-items: flex-end;
  justify-content: center;
  gap: 0.75rem;
  width: clamp(12rem, 30vw, 20rem);
  height: clamp(5rem, 14vh, 8rem);
  padding-bottom: 1rem;
  transform: translateX(-50%);
}

@media (min-width: 640px) {
  .avatar-arrow-zone {
    padding-bottom: 1.5rem;
  }
}

/* Counter between the arrows, revealed together with them. */
.avatar-count {
  font-family: "JetBrains Mono", ui-monospace, monospace;
  font-size: 0.7rem;
  letter-spacing: 0.1em;
  color: color-mix(in srgb, var(--color-ink) 50%, transparent);
  opacity: 0;
  transform: translateY(1rem);
  transition:
    opacity 0.25s ease,
    transform 0.35s cubic-bezier(0.22, 1, 0.36, 1);
}

.avatar-arrow {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 2.75rem;
  height: 2.75rem;
  opacity: 0;
  pointer-events: none;
  /* Hidden state: tucked down below the edge; rises into place on hover. */
  transform: translateY(1rem);
  border-radius: 999px;
  background: var(--color-surface);
  border: 1px solid color-mix(in srgb, var(--color-ink) 8%, transparent);
  box-shadow: 0 6px 16px -8px rgba(var(--shadow-ink), 0.35);
  color: var(--color-ink);
  font-family: inherit;
  font-size: 1.25rem;
  font-weight: 600;
  line-height: 1;
  cursor: pointer;
  transition:
    transform 0.35s cubic-bezier(0.22, 1, 0.36, 1),
    box-shadow 0.25s ease,
    background 0.25s ease,
    opacity 0.25s ease;
}

/* Reveal only while the cursor is inside the zone (or a button is keyboard-focused):
   rise from the bottom edge while fading in. */
.avatar-arrow-zone:hover .avatar-arrow,
.avatar-arrow-zone:focus-within .avatar-arrow,
.avatar-arrow-zone:hover .avatar-count,
.avatar-arrow-zone:focus-within .avatar-count {
  opacity: 1;
  pointer-events: auto;
  transform: translateY(0);
}

/* No hover on touch devices: keep the arrows always visible there. */
@media (hover: none) {
  .avatar-arrow,
  .avatar-count {
    opacity: 1;
    pointer-events: auto;
    transform: none;
  }
}

@media (prefers-reduced-motion: reduce) {
  .avatar-arrow,
  .avatar-count {
    transition: opacity 0.2s ease;
    transform: none;
  }
}

.avatar-arrow:hover {
  transform: scale(1.08);
  box-shadow: 0 12px 24px -10px rgba(var(--shadow-ink), 0.45);
}

.avatar-arrow:active {
  transform: scale(0.96);
}

.avatar-arrow:focus-visible {
  outline: 2px solid var(--color-ink);
  outline-offset: 2px;
}

/* Mouse parallax (variables are written from the script on every frame) */
.avatar-frame {
  --px: 0px;
  --py: 0px;
  --rx: 0deg;
  --ry: 0deg;
  transform: perspective(1200px) translate3d(var(--px), var(--py), 0)
    rotateX(var(--rx)) rotateY(var(--ry));
  transform-style: preserve-3d;
  will-change: transform;
}

/* TikTok-style glitch transition between avatars */
.avatar-img.is-glitching {
  animation: tiktok-glitch 0.55s steps(2, end) 1;
}

@keyframes tiktok-glitch {
  0% {
    filter: drop-shadow(-6px 0 #000000) drop-shadow(6px 0 #ffffff);
    transform: translate3d(-6px, 0, 0) skewX(-4deg);
    clip-path: inset(0 0 62% 0);
    opacity: 0.9;
  }
  20% {
    filter: drop-shadow(9px 0 #000000) drop-shadow(-9px 0 #ffffff);
    transform: translate3d(8px, 0, 0) skewX(5deg);
    clip-path: inset(45% 0 18% 0);
  }
  40% {
    filter: drop-shadow(-11px 0 #000000) drop-shadow(11px 0 #ffffff);
    transform: translate3d(-5px, 0, 0) skewX(-3deg);
    clip-path: inset(70% 0 8% 0);
    opacity: 1;
  }
  60% {
    filter: drop-shadow(6px 0 #000000) drop-shadow(-6px 0 #ffffff);
    transform: translate3d(4px, 0, 0) skewX(2deg);
    clip-path: inset(15% 0 55% 0);
  }
  80% {
    filter: drop-shadow(-3px 0 #000000) drop-shadow(3px 0 #ffffff);
    transform: translate3d(-2px, 0, 0);
    clip-path: inset(0 0 0 0);
  }
  100% {
    filter: drop-shadow(0 30px 50px rgba(0, 0, 0, 0.18));
    transform: translate3d(0, 0, 0);
    clip-path: inset(0 0 0 0);
    opacity: 1;
  }
}

@media (prefers-reduced-motion: reduce) {
  .avatar-img.is-glitching {
    animation: none;
  }
}
</style>
