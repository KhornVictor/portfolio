<script setup lang="ts">
import { computed, ref } from "vue";
import { apps } from "../../desktop/apps";
import { useSettings } from "../../desktop/useSettings";
import { useWindowManager } from "../../desktop/useWindowManager";
import type { AppId } from "../../desktop/types";
import AppIcon from "./AppIcon.vue";

const wm = useWindowManager();
const settings = useSettings();

const dockApps = apps.filter((a) => a.dock);
const BASE = 50;
const MAX = 84;
const RANGE = 150;

const pointer = ref<number | null>(null); // cursor position along the dock's main axis
const vertical = computed(() => settings.dockPosition !== "bottom");

function onMove(e: MouseEvent) {
  if (!settings.magnification || settings.reduceMotion) return;
  pointer.value = vertical.value ? e.clientY : e.clientX;
}
function onLeave() {
  pointer.value = null;
}

/** Icon size for index i given the cursor position (Dock magnification). */
function sizeFor(el: HTMLElement | null): number {
  if (pointer.value === null || !el) return BASE;
  const r = el.getBoundingClientRect();
  const center = vertical.value ? r.top + r.height / 2 : r.left + r.width / 2;
  const d = Math.abs(pointer.value - center);
  if (d > RANGE) return BASE;
  const t = 1 - d / RANGE;
  return BASE + (MAX - BASE) * (t * t * (3 - 2 * t)); // smoothstep
}

const itemEls = ref<Record<string, HTMLElement | null>>({});
const sizes = computed(() => {
  // touching `pointer` makes this recompute on every move
  void pointer.value;
  return Object.fromEntries(dockApps.map((a) => [a.id, sizeFor(itemEls.value[a.id] ?? null)]));
});

function launch(id: AppId) {
  const win = wm.windows.value.find((w) => w.app === id);
  if (win && win.minimized) wm.focus(win.id);
  else if (win && wm.active.value?.id === win.id && !wm.isMobile.value) wm.minimize(win.id);
  else wm.open(id);
}

// Minimised windows appear at the right of the Dock like macOS.
const minimized = computed(() => wm.windows.value.filter((w) => w.minimized));
</script>

<template>
  <nav
    class="dock"
    :class="[`dock--${settings.dockPosition}`, { 'dock--vertical': vertical }]"
    aria-label="Dock"
    @mousemove="onMove"
    @mouseleave="onLeave"
  >
    <div class="dock-bar">
      <button
        v-for="app in dockApps"
        :key="app.id"
        :ref="(el) => (itemEls[app.id] = el as HTMLElement | null)"
        class="dock-item"
        :class="{ 'dock-item--open': wm.isOpen(app.id) }"
        :style="{ width: sizes[app.id] + 'px', height: sizes[app.id] + 'px' }"
        :aria-label="app.name"
        @click="launch(app.id)"
      >
        <span class="dock-tip">{{ app.name }}</span>
        <AppIcon :name="app.id" :size="sizes[app.id]! - 6" />
      </button>

      <template v-if="minimized.length">
        <span class="dock-sep"></span>
        <button
          v-for="w in minimized"
          :key="'min-' + w.id"
          class="dock-item dock-item--mini"
          :style="{ width: BASE + 'px', height: BASE + 'px' }"
          :aria-label="`Restore ${w.title}`"
          @click="wm.focus(w.id)"
        >
          <span class="dock-tip">{{ w.title }}</span>
          <AppIcon :name="w.app" :size="BASE - 14" />
        </button>
      </template>
    </div>
  </nav>
</template>

<style scoped>
.dock {
  position: absolute;
  z-index: 1000;
  display: flex;
  justify-content: center;
  pointer-events: none;
}
.dock--bottom {
  inset-inline: 0;
  bottom: 8px;
}
.dock--left,
.dock--right {
  inset-block: 0;
  align-items: center;
}
.dock--left {
  left: 8px;
}
.dock--right {
  right: 8px;
}

.dock-bar {
  pointer-events: auto;
  display: flex;
  align-items: flex-end;
  gap: 4px;
  padding: 6px 8px;
  border-radius: 20px;
  background: var(--dock-bg);
  border: 1px solid var(--dock-border);
  backdrop-filter: blur(24px) saturate(160%);
  -webkit-backdrop-filter: blur(24px) saturate(160%);
  box-shadow:
    0 12px 40px -10px rgba(0, 0, 0, 0.6),
    inset 0 1px 0 rgba(255, 255, 255, 0.08);
  max-width: calc(100vw - 24px);
  overflow: visible;
}
.dock--vertical .dock-bar {
  flex-direction: column;
  align-items: center;
  padding: 8px 6px;
}
.dock--left .dock-bar {
  align-items: flex-start;
}
.dock--right .dock-bar {
  align-items: flex-end;
}

.dock-item {
  position: relative;
  display: grid;
  place-items: center;
  border-radius: 12px;
  transition:
    width 0.12s ease-out,
    height 0.12s ease-out;
  cursor: default;
}
.dock-item:active :deep(svg) {
  filter: brightness(0.75);
}
/* running indicator */
.dock-item--open::after {
  content: "";
  position: absolute;
  width: 4px;
  height: 4px;
  border-radius: 999px;
  background: var(--dock-dot);
}
.dock--bottom .dock-item--open::after {
  bottom: -5px;
  left: 50%;
  translate: -50% 0;
}
.dock--left .dock-item--open::after {
  left: -5px;
  top: 50%;
  translate: 0 -50%;
}
.dock--right .dock-item--open::after {
  right: -5px;
  top: 50%;
  translate: 0 -50%;
}

.dock-sep {
  align-self: stretch;
  width: 1px;
  margin: 6px 4px;
  background: var(--dock-border);
}
.dock--vertical .dock-sep {
  width: auto;
  height: 1px;
  align-self: stretch;
}
.dock-item--mini :deep(svg) {
  opacity: 0.85;
}

/* Tooltip */
.dock-tip {
  position: absolute;
  bottom: calc(100% + 12px);
  left: 50%;
  translate: -50% 4px;
  padding: 4px 10px;
  border-radius: 8px;
  font-size: 12px;
  white-space: nowrap;
  background: var(--tip-bg);
  color: var(--tip-fg);
  border: 1px solid var(--dock-border);
  opacity: 0;
  pointer-events: none;
  transition:
    opacity 0.12s ease,
    translate 0.12s ease;
}
.dock-item:hover .dock-tip {
  opacity: 1;
  translate: -50% 0;
}
.dock--left .dock-tip {
  bottom: auto;
  left: calc(100% + 12px);
  top: 50%;
  translate: -4px -50%;
}
.dock--left .dock-item:hover .dock-tip {
  translate: 0 -50%;
}
.dock--right .dock-tip {
  bottom: auto;
  left: auto;
  right: calc(100% + 12px);
  top: 50%;
  translate: 4px -50%;
}
.dock--right .dock-item:hover .dock-tip {
  translate: 0 -50%;
}

@media (max-width: 767px) {
  .dock {
    inset-inline: 0;
    bottom: 6px;
    left: auto;
    right: auto;
    inset-block: auto;
    align-items: flex-end;
  }
  .dock-bar {
    flex-direction: row;
    align-items: flex-end;
    overflow-x: auto;
    scrollbar-width: none;
  }
  .dock-tip {
    display: none;
  }
}
</style>
