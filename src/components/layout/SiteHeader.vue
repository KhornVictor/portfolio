<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from "vue";
import { useTheme } from "../../composables/useTheme";
import { useMusicState } from "../../composables/useMusicState";
import WeatherIcon from "../ui/weatherIcon.vue";

const props = defineProps<{
  navigation: { label: string; href: string; count?: string }[];
  title: string;
  socials: { network: string; url: string }[];
  talkHref: string;
}>();

const { isDark, toggle: toggleTheme } = useTheme();
const music = useMusicState();

// Live clock, "Tue, 15 Sep 14:16"
const now = ref(new Date());
let clock: ReturnType<typeof setInterval> | undefined;
const time = computed(() => {
  const d = now.value;
  const day = d.toLocaleDateString("en-GB", { weekday: "short" });
  const date = d.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
  });
  const hm = d.toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
  return `${day}, ${date} ${hm}`;
});

// Nav entries get a glyph so they read like tray icons.
const NAV_ICONS: Record<string, string> = {
  work: "fa-solid fa-chart-simple",
  service: "fa-solid fa-terminal",
  experience: "fa-solid fa-briefcase",
  contact: "fa-solid fa-paper-plane",
};
const nav = computed(() =>
  props.navigation.map((n) => ({
    ...n,
    icon: NAV_ICONS[n.label.toLowerCase()] ?? "fa-solid fa-circle-dot",
  })),
);

const locale = navigator.language || "en-US";

const fullscreen = ref(false);
function toggleFullscreen() {
  if (document.fullscreenElement) void document.exitFullscreen();
  else void document.documentElement.requestFullscreen?.();
}

function closeWindow() {
  window.close();
}

const onFsChange = () => (fullscreen.value = !!document.fullscreenElement);

const hidden = ref(false);
const isHoveredNearTop = ref(false);
const isHeaderHovered = ref(false);
let hoverLeaveTimeout: ReturnType<typeof setTimeout> | undefined;

const isHidden = computed(() => {
  if (isHoveredNearTop.value || isHeaderHovered.value) return false;
  return hidden.value;
});

let lastY = window.scrollY;
let ticking = false;
const SLACK = 8;
function onScroll() {
  if (ticking) return;
  ticking = true;
  requestAnimationFrame(() => {
    const y = window.scrollY;
    const dy = y - lastY;
    if (y < 80) hidden.value = false;
    else if (dy > SLACK) hidden.value = true;
    else if (dy < -SLACK) hidden.value = false;
    if (Math.abs(dy) > SLACK) lastY = y;
    ticking = false;
  });
}

function onMouseMove(e: MouseEvent) {
  // Reveal when cursor is within top 32px of the viewport
  if (e.clientY <= 32) {
    if (hoverLeaveTimeout) clearTimeout(hoverLeaveTimeout);
    isHoveredNearTop.value = true;
  } else if (!isHeaderHovered.value && isHoveredNearTop.value && e.clientY > 80) {
    if (hoverLeaveTimeout) clearTimeout(hoverLeaveTimeout);
    hoverLeaveTimeout = setTimeout(() => {
      isHoveredNearTop.value = false;
    }, 100);
  }
}

function onHeaderEnter() {
  if (hoverLeaveTimeout) clearTimeout(hoverLeaveTimeout);
  isHeaderHovered.value = true;
}

function onHeaderLeave(e: MouseEvent) {
  isHeaderHovered.value = false;
  if (e.clientY > 32) {
    if (hoverLeaveTimeout) clearTimeout(hoverLeaveTimeout);
    hoverLeaveTimeout = setTimeout(() => {
      isHoveredNearTop.value = false;
    }, 200);
  }
}

const openVision = () => {
  window.open("https://www.youtube.com/watch?v=dQw4w9WgXcQ", "_blank");
};

onMounted(() => {
  clock = setInterval(() => (now.value = new Date()), 1000);
  document.addEventListener("fullscreenchange", onFsChange);
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("mousemove", onMouseMove, { passive: true });
});
onBeforeUnmount(() => {
  if (clock) clearInterval(clock);
  if (hoverLeaveTimeout) clearTimeout(hoverLeaveTimeout);
  document.removeEventListener("fullscreenchange", onFsChange);
  window.removeEventListener("scroll", onScroll);
  window.removeEventListener("mousemove", onMouseMove);
});
</script>

<template>
  <!-- Invisible hover trigger zone at the very top of the screen -->
  <div
    class="fixed inset-x-0 top-0 h-4 z-40 pointer-events-auto"
    aria-hidden="true"
    @mouseenter="isHoveredNearTop = true"
    @mousemove="isHoveredNearTop = true"
  ></div>

  <header
    class="bar fixed inset-x-3 top-3 z-50 flex items-center gap-3 px-3 sm:inset-x-4 sm:top-4 sm:px-4"
    :class="{ 'is-hidden': isHidden }"
    @mouseenter="onHeaderEnter"
    @mouseleave="onHeaderLeave"
  >
    <div class="flex min-w-0 items-center gap-2.5">
      <button
        type="button"
        class="tray-btn hoverRotate"
        aria-label="Settings"
        title="Settings"
        @click="openVision"
      >
        <i class="fa-solid fa-gear"></i>
      </button>
      <img src="/favicon.png" class="h-4 w-4 shrink-0" alt="" />
      <span class="win-title truncate">{{ title }}</span>
    </div>

    <!-- Center: clock + nav tray (absolutely centered so it ignores side widths) -->
    <div
      class="absolute left-1/2 hidden -translate-x-1/2 items-center gap-5 md:flex"
    >
      <time class="clock" :datetime="now.toISOString()">{{ time }}</time>
      <nav class="flex items-center gap-1" aria-label="Primary">
        <a
          v-for="item in nav"
          :key="item.href"
          :href="item.href"
          class="tray-btn"
          :title="item.count ? `${item.label} [${item.count}]` : item.label"
          :aria-label="item.label"
        >
          <i :class="item.icon"></i>
        </a>
      </nav>
    </div>

    <div class="ml-auto flex items-center gap-2 sm:gap-3">
      <!-- Now playing (only while the disc is spinning) -->
      <span
        v-if="music.playing.value"
        class="now-playing hidden items-center gap-2 lg:flex"
      >
        <span class="eq" aria-hidden="true"><i></i><i></i><i></i></span>
        <span class="max-w-52 truncate">{{ music.title.value }}</span>
      </span>

      <button
        type="button"
        class="tray-btn cava-toggle"
        :class="{ 'is-on': music.visualizer.value }"
        :aria-label="music.visualizer.value ? 'Disable music visualizer' : 'Enable music visualizer'"
        :title="music.visualizer.value ? 'Visualizer: on' : 'Visualizer: off'"
        :aria-pressed="music.visualizer.value"
        @click="music.toggleVisualizer()"
      >
        <i class="fa-solid fa-square-binary"></i>
      </button>

      <!-- Weather (Phnom Penh): icon follows the sky, click for the card -->
      <WeatherIcon />

      <button
        type="button"
        class="tray-btn theme-toggle"
        :aria-label="isDark ? 'Switch to light mode' : 'Switch to dark mode'"
        :title="isDark ? 'Light mode' : 'Dark mode'"
        :aria-pressed="isDark"
        @click="toggleTheme"
      >
        <i class="fa-solid" :class="isDark ? 'fa-sun' : 'fa-moon'"></i>
      </button>

      <button
        type="button"
        class="tray-btn"
        aria-label="Vision"
        title="Vision"
        @click="openVision"
      >
        <i class="fa-solid fa-eye"></i>
      </button>

      <span class="locale hidden sm:inline">{{ locale }}</span>

      <button
        type="button"
        class="tray-btn hidden sm:inline-flex"
        :aria-label="fullscreen ? 'Exit fullscreen' : 'Fullscreen'"
        :title="fullscreen ? 'Exit fullscreen' : 'Fullscreen'"
        @click="toggleFullscreen"
      >
        <i
          class="fa-solid"
          :class="fullscreen ? 'fa-compress' : 'fa-expand'"
        ></i>
      </button>

      <button
        class="tray-btn power"
        target="_blank"
        rel="noreferrer"
        @click="closeWindow"
        title="Let's talk"
        aria-label="Let's talk"
      >
        <i class="fa-solid fa-power-off"></i>
      </button>
    </div>
  </header>
</template>

<style scoped>
.bar {
  height: 2.5rem;
  border-radius: 0.9rem;
  font-family: "JetBrains Mono", ui-monospace, SFMono-Regular, Menlo, monospace;
  font-size: 0.78rem;
  color: color-mix(in srgb, var(--color-ink) 82%, transparent);
  background: color-mix(in srgb, var(--color-paper) 58%, transparent);
  border: 1px solid color-mix(in srgb, var(--color-surface) 70%, transparent);
  box-shadow:
    0 18px 40px -18px rgba(var(--shadow-ink), 0.45),
    0 1px 2px rgba(var(--shadow-ink), 0.08),
    inset 0 1px 0 var(--panel-edge);
  backdrop-filter: blur(22px) saturate(1.8);
  -webkit-backdrop-filter: blur(22px) saturate(1.8);
  transition:
    transform 0.45s cubic-bezier(0.22, 1, 0.36, 1),
    opacity 0.3s ease;
}

/* Slide up out of view (past its own top offset) when scrolling down. */
.bar.is-hidden {
  transform: translateY(calc(-100% - 1.5rem));
  opacity: 0;
  pointer-events: none;
}

.win-title {
  color: color-mix(in srgb, var(--color-ink) 72%, transparent);
  letter-spacing: 0.01em;
}

.clock {
  color: color-mix(in srgb, var(--color-ink) 85%, transparent);
  white-space: nowrap;
}

.locale {
  color: color-mix(in srgb, var(--color-ink) 70%, transparent);
}

/* Small square tray buttons */
.tray-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 1.7rem;
  height: 1.7rem;
  border-radius: 0.45rem;
  color: color-mix(in srgb, var(--color-ink) 78%, transparent);
  font-size: 0.8rem;
  line-height: 1;
  text-decoration: none;
  cursor: pointer;
  transition:
    background 0.18s ease,
    color 0.18s ease,
    transform 0.18s ease;
}

.tray-btn:hover {
  background: color-mix(in srgb, var(--color-ink) 10%, transparent);
  color: var(--color-ink);
}

.tray-btn:focus-visible {
  outline: 2px solid var(--color-ink);
  outline-offset: 1px;
}

.power {
  color: #e5484d;
}

.power:hover {
  background: rgba(229, 72, 77, 0.16);
  color: #ff6b70;
}

.hoverRotate:hover {
  transform: rotate(20deg);
}

.cava-toggle {
  color: color-mix(in srgb, var(--color-ink) 40%, transparent);
}

.cava-toggle.is-on {
  background: color-mix(in srgb, var(--color-ink) 12%, transparent);
  color: var(--color-ink);
}

.now-playing {
  color: color-mix(in srgb, var(--color-ink) 82%, transparent);
}

.eq {
  display: inline-flex;
  align-items: flex-end;
  gap: 2px;
  height: 0.75rem;
}

.eq i {
  display: block;
  width: 2px;
  height: 100%;
  background: currentColor;
  border-radius: 1px;
  transform-origin: bottom;
  animation: eq-bounce 0.9s ease-in-out infinite;
}

.eq i:nth-child(2) {
  animation-delay: -0.3s;
}

.eq i:nth-child(3) {
  animation-delay: -0.6s;
}

@keyframes eq-bounce {
  0%,
  100% {
    transform: scaleY(0.3);
  }
  50% {
    transform: scaleY(1);
  }
}

/* Little spin when the theme icon swaps */
.theme-toggle i {
  animation: theme-pop 0.35s cubic-bezier(0.22, 1, 0.36, 1);
}

@keyframes theme-pop {
  from {
    transform: rotate(-90deg) scale(0.6);
    opacity: 0;
  }
  to {
    transform: rotate(0) scale(1);
    opacity: 1;
  }
}

@media (prefers-reduced-motion: reduce) {
  .bar {
    transition: opacity 0.2s ease;
  }
  .bar.is-hidden {
    transform: none;
  }
  .theme-toggle i,
  .eq i {
    animation: none;
  }
}
</style>
