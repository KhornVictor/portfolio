<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from "vue";
import { appById } from "../../pages/desktop/apps";
import { useSettings } from "../../pages/desktop/useSettings";
import { useWindowManager } from "../../pages/desktop/useWindowManager";
import { owner } from "../../data/portfolio";

const emit = defineEmits<{ power: [mode: "sleep" | "restart" | "shutdown"]; search: [] }>();
const wm = useWindowManager();
const settings = useSettings();

const appName = computed(() => (wm.activeApp.value ? appById[wm.activeApp.value].name : "Finder"));

/* ---------- clock ---------- */
const now = ref(new Date());
let timer: number | undefined;
onMounted(() => (timer = window.setInterval(() => (now.value = new Date()), 1000)));
onBeforeUnmount(() => clearInterval(timer));
const dateText = computed(() =>
  now.value.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" }),
);
const timeText = computed(() =>
  now.value.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" }),
);

/* ---------- menus ---------- */
type MenuItem = { label: string; action?: () => void; disabled?: boolean; sep?: false } | { sep: true };
const openMenu = ref<string | null>(null);

const menus = computed<Record<string, MenuItem[]>>(() => ({
  apple: [
    { label: "About This Mac", action: () => wm.open("settings", "about") },
    { sep: true },
    { label: "System Settings…", action: () => wm.open("settings") },
    { label: "App Store…", disabled: true },
    { sep: true },
    { label: "Sleep", action: () => emit("power", "sleep") },
    { label: "Restart…", action: () => emit("power", "restart") },
    { label: "Shut Down…", action: () => emit("power", "shutdown") },
    { sep: true },
    { label: `Log Out ${owner.name.split(" ")[0]}…`, action: () => window.location.assign("/") },
  ],
  File: [
    { label: "New Finder Window", action: () => wm.open("finder") },
    { label: "New Terminal", action: () => wm.open("terminal") },
    { label: "New Note", action: () => wm.open("notes") },
    { sep: true },
    { label: "Close Window", action: () => wm.active.value && wm.close(wm.active.value.id), disabled: !wm.active.value },
  ],
  Edit: [
    { label: "Undo", disabled: true },
    { label: "Redo", disabled: true },
    { sep: true },
    { label: "Cut", disabled: true },
    { label: "Copy", disabled: true },
    { label: "Paste", disabled: true },
    { label: "Select All", disabled: true },
  ],
  View: [
    { label: "as Icons", disabled: true },
    { label: "as List", disabled: true },
    { sep: true },
    { label: settings.theme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode", action: () => (settings.theme = settings.theme === "dark" ? "light" : "dark") },
    { label: "Change Wallpaper…", action: () => wm.open("settings", "appearance") },
  ],
  Go: [
    { label: "About Me", action: () => wm.open("finder", "about") },
    { label: "Projects", action: () => wm.open("finder", "projects") },
    { label: "Experience", action: () => wm.open("finder", "experience") },
    { label: "Skills", action: () => wm.open("finder", "skills") },
    { sep: true },
    { label: "Back to portfolio", action: () => window.location.assign("/") },
  ],
  Window: [
    { label: "Minimize", action: () => wm.active.value && wm.minimize(wm.active.value.id), disabled: !wm.active.value },
    { label: "Zoom", action: () => wm.active.value && wm.toggleMaximize(wm.active.value.id), disabled: !wm.active.value },
    { sep: true },
    ...wm.windows.value.map((w) => ({ label: w.title, action: () => wm.focus(w.id) })),
  ],
  Help: [
    { label: "Open Terminal and type `help`", action: () => wm.open("terminal") },
    { label: "GitHub", action: () => window.open(owner.github, "_blank") },
    { label: "LinkedIn", action: () => window.open(owner.linkedin, "_blank") },
  ],
}));

function toggle(name: string) {
  openMenu.value = openMenu.value === name ? null : name;
}
function hover(name: string) {
  if (openMenu.value) openMenu.value = name;
}
function run(item: MenuItem) {
  if ("sep" in item && item.sep) return;
  if (item.disabled) return;
  openMenu.value = null;
  item.action?.();
}
function closeAll() {
  openMenu.value = null;
}
onMounted(() => window.addEventListener("pointerdown", onOutside));
onBeforeUnmount(() => window.removeEventListener("pointerdown", onOutside));
function onOutside(e: PointerEvent) {
  if (!(e.target as HTMLElement).closest(".menubar")) {
    closeAll();
    control.value = false;
  }
}

const control = ref(false);
</script>

<template>
  <header class="menubar" @keydown.esc="closeAll">
    <!-- Left -->
    <div class="flex h-full items-center">
      <button class="mb-item px-3" :class="{ 'mb-item--open': openMenu === 'apple' }" aria-label="Apple menu" @click="toggle('apple')" @mouseenter="hover('apple')">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M16.4 12.6c0-2.4 2-3.6 2.1-3.7-1.1-1.7-2.9-1.9-3.5-1.9-1.5-.2-2.9.9-3.7.9-.8 0-1.9-.9-3.2-.8-1.6 0-3.1 1-4 2.4-1.7 3-.4 7.3 1.2 9.7.8 1.2 1.8 2.5 3 2.4 1.2 0 1.7-.8 3.2-.8s1.9.8 3.2.8c1.3 0 2.2-1.2 3-2.4.9-1.4 1.3-2.7 1.3-2.8 0 0-2.6-1-2.6-3.8zM14 5.4c.7-.8 1.1-1.9 1-3-1 0-2.1.7-2.8 1.5-.6.7-1.2 1.9-1 2.9 1.1.1 2.2-.5 2.8-1.4z" />
        </svg>
        <div v-if="openMenu === 'apple'" class="mb-menu">
          <template v-for="(item, i) in menus.apple" :key="i">
            <div v-if="'sep' in item && item.sep" class="mb-sep"></div>
            <button v-else class="mb-menu-item" :disabled="item.disabled" @click.stop="run(item)">{{ item.label }}</button>
          </template>
        </div>
      </button>

      <button class="mb-item px-2.5 font-bold" :class="{ 'mb-item--open': openMenu === 'app' }" @click="toggle('app')" @mouseenter="hover('app')">
        {{ appName }}
        <div v-if="openMenu === 'app'" class="mb-menu">
          <button class="mb-menu-item" @click.stop="run({ label: '', action: () => wm.open('settings', 'about') })">About {{ appName }}</button>
          <div class="mb-sep"></div>
          <button class="mb-menu-item" :disabled="!wm.active.value" @click.stop="run({ label: '', action: () => wm.active.value && wm.minimize(wm.active.value.id) })">Hide {{ appName }}</button>
          <button class="mb-menu-item" :disabled="!wm.activeApp.value" @click.stop="run({ label: '', action: () => wm.activeApp.value && wm.closeApp(wm.activeApp.value) })">Quit {{ appName }}</button>
        </div>
      </button>

      <button
        v-for="name in ['File', 'Edit', 'View', 'Go', 'Window', 'Help']"
        :key="name"
        class="mb-item hidden px-2.5 md:block"
        :class="{ 'mb-item--open': openMenu === name }"
        @click="toggle(name)"
        @mouseenter="hover(name)"
      >
        {{ name }}
        <div v-if="openMenu === name" class="mb-menu">
          <template v-for="(item, i) in menus[name]" :key="i">
            <div v-if="'sep' in item && item.sep" class="mb-sep"></div>
            <button v-else class="mb-menu-item" :disabled="item.disabled" @click.stop="run(item)">{{ item.label }}</button>
          </template>
        </div>
      </button>
    </div>

    <!-- Right -->
    <div class="flex h-full items-center gap-1">
      <!-- Wi-Fi -->
      <span class="mb-item px-1.5" title="Wi-Fi: khorn-net">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M2.5 8.5a15 15 0 0 1 19 0M6 12.5a10 10 0 0 1 12 0M9.5 16.5a5 5 0 0 1 5 0" /><circle cx="12" cy="20" r="1" fill="currentColor" /></svg>
      </span>
      <!-- Battery -->
      <span class="mb-item gap-1 px-1.5" title="Battery: 100%">
        <span class="hidden text-[11px] sm:inline">100%</span>
        <svg width="26" height="14" viewBox="0 0 26 14" aria-hidden="true"><rect x="1" y="1.5" width="21" height="11" rx="3" fill="none" stroke="currentColor" stroke-opacity=".6" /><rect x="2.5" y="3" width="18" height="8" rx="2" fill="currentColor" /><path d="M23.5 5v4a2 2 0 0 0 0-4z" fill="currentColor" fill-opacity=".6" /></svg>
      </span>
      <!-- Search -->
      <button class="mb-item px-1.5" aria-label="Spotlight search" @click="emit('search')">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" aria-hidden="true"><circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" /></svg>
      </button>
      <!-- Control Center -->
      <button class="mb-item px-1.5" :class="{ 'mb-item--open': control }" aria-label="Control Center" @click="control = !control">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M4 7h16M4 17h16" /><circle cx="9" cy="7" r="2.5" fill="currentColor" /><circle cx="15" cy="17" r="2.5" fill="currentColor" /></svg>
        <div v-if="control" class="mb-menu mb-menu--right w-64 p-3" @click.stop>
          <div class="grid grid-cols-2 gap-2 text-left text-[12px]">
            <div class="cc-tile"><span class="cc-dot bg-blue-500"></span>Wi-Fi<br /><span class="opacity-60">khorn-net</span></div>
            <div class="cc-tile"><span class="cc-dot bg-blue-500"></span>Bluetooth<br /><span class="opacity-60">On</span></div>
            <button class="cc-tile col-span-2 flex items-center justify-between" @click="settings.theme = settings.theme === 'dark' ? 'light' : 'dark'">
              <span>Dark Mode</span>
              <span class="cc-switch" :class="{ on: settings.theme === 'dark' }"></span>
            </button>
            <button class="cc-tile col-span-2 flex items-center justify-between" @click="settings.reduceMotion = !settings.reduceMotion">
              <span>Reduce Motion</span>
              <span class="cc-switch" :class="{ on: settings.reduceMotion }"></span>
            </button>
          </div>
        </div>
      </button>
      <span class="mb-item hidden px-1.5 sm:inline">{{ dateText }}</span>
      <span class="mb-item px-1.5 pr-3">{{ timeText }}</span>
    </div>
  </header>
</template>

<style scoped>
.menubar {
  position: absolute;
  inset-inline: 0;
  top: 0;
  z-index: 2000;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-left: 4px;
  font-size: 13px;
  color: var(--mb-fg);
  background: var(--mb-bg);
  backdrop-filter: blur(30px) saturate(180%);
  -webkit-backdrop-filter: blur(30px) saturate(180%);
  user-select: none;
}
.mb-item {
  position: relative;
  display: inline-flex;
  align-items: center;
  height: 22px;
  border-radius: 5px;
  white-space: nowrap;
}
button.mb-item:hover,
.mb-item--open {
  background: var(--mb-hover);
}
.mb-menu {
  position: absolute;
  top: calc(100% + 4px);
  left: 0;
  min-width: 220px;
  padding: 5px;
  border-radius: 10px;
  background: var(--menu-bg);
  border: 1px solid var(--menu-border);
  box-shadow: 0 16px 40px -8px rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(30px) saturate(180%);
  -webkit-backdrop-filter: blur(30px) saturate(180%);
  color: var(--menu-fg);
  font-weight: 400;
  text-align: left;
  z-index: 10;
  animation: menu-in 0.12s ease-out;
}
.mb-menu--right {
  left: auto;
  right: 0;
}
@keyframes menu-in {
  from {
    opacity: 0;
    translate: 0 -4px;
  }
}
.mb-menu-item {
  display: block;
  width: 100%;
  text-align: left;
  padding: 4px 10px;
  border-radius: 6px;
  font-size: 13px;
}
.mb-menu-item:hover:not(:disabled) {
  background: #2f7cf6;
  color: #fff;
}
.mb-menu-item:disabled {
  opacity: 0.4;
}
.mb-sep {
  height: 1px;
  margin: 5px 8px;
  background: var(--menu-border);
}

.cc-tile {
  padding: 8px 10px;
  border-radius: 10px;
  background: var(--mb-hover);
  line-height: 1.3;
}
.cc-dot {
  display: inline-block;
  width: 8px;
  height: 8px;
  border-radius: 999px;
  margin-right: 6px;
}
.cc-switch {
  width: 30px;
  height: 18px;
  border-radius: 999px;
  background: rgba(120, 120, 128, 0.5);
  position: relative;
  transition: background 0.2s;
}
.cc-switch::after {
  content: "";
  position: absolute;
  top: 2px;
  left: 2px;
  width: 14px;
  height: 14px;
  border-radius: 999px;
  background: #fff;
  transition: translate 0.2s;
}
.cc-switch.on {
  background: #34c759;
}
.cc-switch.on::after {
  translate: 12px 0;
}
</style>
