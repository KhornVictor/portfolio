<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from "vue";
import { loadPortfolio, type Portfolio } from "../../service/portfolio.service";
import { providePortfolio } from "../../desktop/usePortfolio";
import { useSettings, wallpapers } from "../../desktop/useSettings";
import { useWindowManager } from "../../desktop/useWindowManager";
import { owner } from "../../data/portfolio";
import MenuBar from "./MenuBar.vue";
import Dock from "./Dock.vue";
import DesktopIcon from "./DesktopIcon.vue";
import WindowManager from "./WindowManager.vue";
import ContextMenu, { type ContextItem } from "./ContextMenu.vue";
import ApplicationLauncher from "./ApplicationLauncher.vue";

const wm = useWindowManager();
const settings = useSettings();

/* ---------- data ---------- */
const portfolio = ref<Portfolio | null>(null);
providePortfolio(portfolio);

/* ---------- viewport tracking ---------- */
const root = ref<HTMLElement | null>(null);
let ro: ResizeObserver | undefined;
onMounted(async () => {
  document.title = `${owner.machine} — ${owner.name}`;
  const measure = () => {
    wm.viewport.width = root.value?.clientWidth ?? window.innerWidth;
    wm.viewport.height = root.value?.clientHeight ?? window.innerHeight;
  };
  measure();
  ro = new ResizeObserver(measure);
  if (root.value) ro.observe(root.value);
  window.addEventListener("keydown", onKey);

  try {
    portfolio.value = await loadPortfolio();
  } catch (e) {
    console.error(e);
  }
  // Feels like a freshly logged-in Mac: Finder is already open.
  if (!wm.isMobile.value) window.setTimeout(() => wm.open("finder"), 350);
});
onBeforeUnmount(() => {
  ro?.disconnect();
  window.removeEventListener("keydown", onKey);
});

/* ---------- desktop icons ---------- */
const icons = [
  { id: "hd", icon: "hd", label: "Macintosh HD", open: () => wm.open("finder", "root") },
  { id: "about", icon: "folder", label: "About Me", open: () => wm.open("finder", "about") },
  { id: "projects", icon: "folder", label: "Projects", open: () => wm.open("finder", "projects") },
  { id: "resume", icon: "pdf", label: "Resume.pdf", open: () => wm.open("textedit", "resume", "Resume.pdf") },
  { id: "contact", icon: "file", label: "Contact.txt", open: () => wm.open("mail") },
  { id: "terminal", icon: "terminal", label: "Terminal", open: () => wm.open("terminal") },
];
const selected = ref<string | null>(null);

/* ---------- context menu ---------- */
const ctx = ref<{ x: number; y: number } | null>(null);
const ctxItems = computed<ContextItem[]>(() => [
  { label: "New Folder", disabled: true },
  { sep: true },
  { label: "Open Terminal Here", action: () => wm.open("terminal") },
  { label: "Open Finder", action: () => wm.open("finder") },
  { sep: true },
  { label: "Change Wallpaper…", action: () => wm.open("settings", "appearance") },
  { label: settings.theme === "dark" ? "Use Light Appearance" : "Use Dark Appearance", action: () => (settings.theme = settings.theme === "dark" ? "light" : "dark") },
  { sep: true },
  { label: "About This Mac", action: () => wm.open("settings", "about") },
]);
function onContext(e: MouseEvent) {
  if (wm.isMobile.value) return;
  e.preventDefault();
  ctx.value = { x: e.clientX, y: e.clientY };
}
function onDesktopClick() {
  ctx.value = null;
  selected.value = null;
}

/* ---------- launcher / spotlight ---------- */
const launcher = ref(false);

/* ---------- power states ---------- */
const power = ref<"sleep" | "restart" | "shutdown" | null>(null);
function onPower(mode: "sleep" | "restart" | "shutdown") {
  power.value = mode;
  if (mode === "restart") window.setTimeout(() => window.location.reload(), 1400);
}

/* ---------- keyboard shortcuts ---------- */
function onKey(e: KeyboardEvent) {
  const mod = e.metaKey || e.ctrlKey;
  if (e.key === "Escape") {
    ctx.value = null;
    launcher.value = false;
    if (power.value === "sleep") power.value = null;
    return;
  }
  if (mod && e.key === " ") {
    e.preventDefault();
    launcher.value = !launcher.value;
  } else if (mod && e.key.toLowerCase() === "w" && wm.active.value) {
    e.preventDefault();
    wm.close(wm.active.value.id);
  } else if (mod && e.key.toLowerCase() === "m" && wm.active.value) {
    e.preventDefault();
    wm.minimize(wm.active.value.id);
  }
}

const wallpaper = computed(() => wallpapers.find((w) => w.id === settings.wallpaper)?.css ?? wallpapers[0]!.css);
</script>

<template>
  <div
    ref="root"
    class="desktop-root fixed inset-0 overflow-hidden"
    :class="[`theme-${settings.theme}`, { 'reduce-motion': settings.reduceMotion }]"
    :style="{ backgroundImage: wallpaper }"
    @contextmenu="onContext"
    @click="onDesktopClick"
  >
    <!-- subtle grain so the gradient doesn't band -->
    <div class="grain pointer-events-none absolute inset-0"></div>

    <MenuBar @power="onPower" @search="launcher = true" />

    <!-- Desktop icons (hidden on phones — the launcher takes over) -->
    <div v-if="!wm.isMobile.value" class="absolute top-10 right-4 flex flex-col items-end gap-2">
      <DesktopIcon
        v-for="ic in icons"
        :key="ic.id"
        :icon="ic.icon"
        :label="ic.label"
        :selected="selected === ic.id"
        @select="selected = ic.id"
        @open="ic.open()"
      />
    </div>
    <ApplicationLauncher v-else-if="!wm.visible.value.length" class="top-8" />

    <WindowManager />

    <Dock />

    <ApplicationLauncher v-if="launcher" overlay @close="launcher = false" />

    <ContextMenu v-if="ctx" :x="ctx.x" :y="ctx.y" :items="ctxItems" @close="ctx = null" />

    <!-- Sleep / restart / shutdown overlay -->
    <Transition name="fade">
      <div
        v-if="power"
        class="absolute inset-0 z-5000 grid place-items-center bg-black text-white"
        @click="power === 'sleep' && (power = null)"
      >
        <div v-if="power === 'restart'" class="flex flex-col items-center gap-6">
          <svg width="56" height="56" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M16.4 12.6c0-2.4 2-3.6 2.1-3.7-1.1-1.7-2.9-1.9-3.5-1.9-1.5-.2-2.9.9-3.7.9-.8 0-1.9-.9-3.2-.8-1.6 0-3.1 1-4 2.4-1.7 3-.4 7.3 1.2 9.7.8 1.2 1.8 2.5 3 2.4 1.2 0 1.7-.8 3.2-.8s1.9.8 3.2.8c1.3 0 2.2-1.2 3-2.4.9-1.4 1.3-2.7 1.3-2.8 0 0-2.6-1-2.6-3.8zM14 5.4c.7-.8 1.1-1.9 1-3-1 0-2.1.7-2.8 1.5-.6.7-1.2 1.9-1 2.9 1.1.1 2.2-.5 2.8-1.4z" /></svg>
          <div class="h-1 w-40 overflow-hidden rounded-full bg-white/20"><div class="boot h-full bg-white"></div></div>
        </div>
        <button v-else-if="power === 'shutdown'" class="flex flex-col items-center gap-3 text-white/70 hover:text-white" @click.stop="power = null">
          <span class="grid h-16 w-16 place-items-center rounded-full border border-white/30">
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M12 3v9M6.3 6.3a8 8 0 1 0 11.4 0" /></svg>
          </span>
          <span class="text-sm">Press to turn on</span>
        </button>
        <span v-else class="text-sm text-white/40">Click anywhere to wake</span>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
.desktop-root {
  font-family: "Inter", ui-sans-serif, system-ui, -apple-system, "Segoe UI", sans-serif;
  background-color: #0b1020;
  background-size: cover;
  transition: background-image 0.4s ease;
  /* ---- dark palette ---- */
  --win-bg: rgba(30, 31, 36, 0.78);
  --win-fg: #f2f3f5;
  --win-title: rgba(255, 255, 255, 0.72);
  --win-titlebar: rgba(255, 255, 255, 0.04);
  --win-divider: rgba(255, 255, 255, 0.08);
  --win-border: rgba(255, 255, 255, 0.12);
  --win-border-active: rgba(255, 255, 255, 0.22);
  --tl-inactive: rgba(255, 255, 255, 0.22);
  --sidebar-bg: rgba(255, 255, 255, 0.04);
  --content-bg: rgba(0, 0, 0, 0.18);
  --card-bg: rgba(255, 255, 255, 0.06);
  --line: rgba(255, 255, 255, 0.08);
  --muted: rgba(255, 255, 255, 0.55);
  --accent: #3b82f6;
  --hover: rgba(255, 255, 255, 0.07);
  --dock-bg: rgba(40, 40, 46, 0.55);
  --dock-border: rgba(255, 255, 255, 0.14);
  --dock-dot: rgba(255, 255, 255, 0.75);
  --tip-bg: rgba(40, 40, 46, 0.9);
  --tip-fg: #fff;
  --mb-bg: rgba(20, 20, 26, 0.45);
  --mb-fg: rgba(255, 255, 255, 0.92);
  --mb-hover: rgba(255, 255, 255, 0.14);
  --menu-bg: rgba(40, 40, 46, 0.85);
  --menu-border: rgba(255, 255, 255, 0.12);
  --menu-fg: #f2f3f5;
  --input-bg: rgba(255, 255, 255, 0.08);
  color-scheme: dark;
}
.theme-light {
  --win-bg: rgba(244, 244, 247, 0.86);
  --win-fg: #1d1d1f;
  --win-title: rgba(0, 0, 0, 0.7);
  --win-titlebar: rgba(255, 255, 255, 0.35);
  --win-divider: rgba(0, 0, 0, 0.08);
  --win-border: rgba(0, 0, 0, 0.12);
  --win-border-active: rgba(0, 0, 0, 0.2);
  --tl-inactive: rgba(0, 0, 0, 0.16);
  --sidebar-bg: rgba(0, 0, 0, 0.03);
  --content-bg: rgba(255, 255, 255, 0.55);
  --card-bg: rgba(255, 255, 255, 0.75);
  --line: rgba(0, 0, 0, 0.08);
  --muted: rgba(0, 0, 0, 0.55);
  --hover: rgba(0, 0, 0, 0.05);
  --dock-bg: rgba(255, 255, 255, 0.45);
  --dock-border: rgba(255, 255, 255, 0.5);
  --dock-dot: rgba(0, 0, 0, 0.6);
  --tip-bg: rgba(255, 255, 255, 0.92);
  --tip-fg: #1d1d1f;
  --mb-bg: rgba(255, 255, 255, 0.35);
  --mb-fg: rgba(0, 0, 0, 0.85);
  --mb-hover: rgba(0, 0, 0, 0.08);
  --menu-bg: rgba(245, 245, 248, 0.9);
  --menu-border: rgba(0, 0, 0, 0.1);
  --menu-fg: #1d1d1f;
  --input-bg: rgba(0, 0, 0, 0.05);
  color-scheme: light;
}
.reduce-motion * {
  transition-duration: 0.01s !important;
  animation-duration: 0.01s !important;
}

.grain {
  opacity: 0.35;
  background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='120' height='120'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.06 0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>");
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.4s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
.boot {
  animation: boot 1.3s ease-in-out forwards;
}
@keyframes boot {
  from {
    width: 0;
  }
  to {
    width: 100%;
  }
}
</style>
