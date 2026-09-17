<script setup lang="ts">
import { computed, ref } from "vue";
import { useWindowManager } from "../../pages/desktop/useWindowManager";
import type { WindowState } from "../../pages/desktop/types";

const props = defineProps<{ win: WindowState; active: boolean }>();
const wm = useWindowManager();

const rect = computed(() => wm.frame(props.win));
const style = computed(() => ({
  transform: `translate(${rect.value.x}px, ${rect.value.y}px)`,
  width: rect.value.w + "px",
  height: rect.value.h + "px",
  zIndex: props.win.z,
}));

/* ---------- drag ---------- */
const dragging = ref(false);
function startDrag(e: PointerEvent) {
  if (props.win.maximized || wm.isMobile.value || e.button !== 0) return;
  if ((e.target as HTMLElement).closest("button")) return;
  e.preventDefault();
  wm.focus(props.win.id);
  const startX = e.clientX - props.win.x;
  const startY = e.clientY - props.win.y;
  dragging.value = true;
  const onMove = (ev: PointerEvent) => wm.move(props.win.id, ev.clientX - startX, ev.clientY - startY);
  const onUp = () => {
    dragging.value = false;
    window.removeEventListener("pointermove", onMove);
    window.removeEventListener("pointerup", onUp);
  };
  window.addEventListener("pointermove", onMove);
  window.addEventListener("pointerup", onUp);
}

/* ---------- resize ---------- */
type Edge = "e" | "s" | "se";
function startResize(e: PointerEvent, edge: Edge) {
  if (props.win.maximized || wm.isMobile.value) return;
  e.preventDefault();
  e.stopPropagation();
  wm.focus(props.win.id);
  const sx = e.clientX, sy = e.clientY, sw = props.win.w, sh = props.win.h;
  dragging.value = true;
  const onMove = (ev: PointerEvent) => {
    const w = edge === "s" ? sw : sw + (ev.clientX - sx);
    const h = edge === "e" ? sh : sh + (ev.clientY - sy);
    wm.resize(props.win.id, w, h);
  };
  const onUp = () => {
    dragging.value = false;
    window.removeEventListener("pointermove", onMove);
    window.removeEventListener("pointerup", onUp);
  };
  window.addEventListener("pointermove", onMove);
  window.addEventListener("pointerup", onUp);
}
</script>

<template>
  <section
    class="mac-window absolute top-0 left-0 flex flex-col overflow-hidden"
    :class="{
      'mac-window--active': active,
      'mac-window--max': win.maximized,
      'mac-window--moving': dragging,
    }"
    :style="style"
    role="dialog"
    :aria-label="win.title"
    @pointerdown="wm.focus(win.id)"
  >
    <!-- Title bar -->
    <header
      class="relative flex h-9.5 shrink-0 items-center px-3 select-none"
      :class="win.maximized || wm.isMobile.value ? '' : 'cursor-default'"
      @pointerdown="startDrag"
      @dblclick="wm.toggleMaximize(win.id)"
    >
      <div class="traffic group flex items-center gap-2">
        <button class="tl tl-close" aria-label="Close" @click.stop="wm.close(win.id)">
          <svg viewBox="0 0 12 12"><path d="M3.5 3.5l5 5m0-5l-5 5" /></svg>
        </button>
        <button class="tl tl-min" aria-label="Minimize" @click.stop="wm.minimize(win.id)">
          <svg viewBox="0 0 12 12"><path d="M3 6h6" /></svg>
        </button>
        <button class="tl tl-max" aria-label="Maximize" @click.stop="wm.toggleMaximize(win.id)">
          <svg viewBox="0 0 12 12"><path d="M3.5 8.5v-5h5M8.5 3.5l-5 5" /></svg>
        </button>
      </div>
      <div class="pointer-events-none absolute inset-x-0 truncate px-24 text-center text-[13px] font-medium text-(--win-title)">
        {{ win.title }}
      </div>
    </header>

    <!-- App content -->
    <div class="min-h-0 flex-1" :class="{ 'pointer-events-none': dragging }">
      <slot />
    </div>

    <!-- Resize handles -->
    <template v-if="!win.maximized && !wm.isMobile.value">
      <div class="absolute top-0 -right-1 h-full w-2 cursor-ew-resize" @pointerdown="startResize($event, 'e')"></div>
      <div class="absolute -bottom-1 left-0 h-2 w-full cursor-ns-resize" @pointerdown="startResize($event, 's')"></div>
      <div class="absolute -right-1 -bottom-1 h-4 w-4 cursor-nwse-resize" @pointerdown="startResize($event, 'se')"></div>
    </template>
  </section>
</template>

<style scoped>
.mac-window {
  border-radius: 12px;
  background: var(--win-bg);
  color: var(--win-fg);
  backdrop-filter: blur(28px) saturate(160%);
  -webkit-backdrop-filter: blur(28px) saturate(160%);
  box-shadow:
    0 0 0 1px var(--win-border),
    0 20px 60px -10px rgba(0, 0, 0, 0.55),
    0 2px 8px rgba(0, 0, 0, 0.25);
  transition:
    width 0.28s cubic-bezier(0.2, 0.7, 0.2, 1),
    height 0.28s cubic-bezier(0.2, 0.7, 0.2, 1),
    transform 0.28s cubic-bezier(0.2, 0.7, 0.2, 1),
    box-shadow 0.2s ease;
  will-change: transform;
}
.mac-window--active {
  box-shadow:
    0 0 0 1px var(--win-border-active),
    0 30px 80px -10px rgba(0, 0, 0, 0.65),
    0 4px 14px rgba(0, 0, 0, 0.3);
}
.mac-window--moving {
  transition: none;
}
.mac-window--max {
  border-radius: 0;
}
:global(.reduce-motion) .mac-window {
  transition: none;
}

header {
  background: var(--win-titlebar);
  border-bottom: 1px solid var(--win-divider);
}

/* Traffic lights */
.tl {
  width: 12px;
  height: 12px;
  border-radius: 999px;
  display: grid;
  place-items: center;
  box-shadow: inset 0 0 0 0.5px rgba(0, 0, 0, 0.2);
  cursor: default;
}
.tl svg {
  width: 8px;
  height: 8px;
  stroke: rgba(0, 0, 0, 0.55);
  stroke-width: 1.4;
  fill: none;
  stroke-linecap: round;
  opacity: 0;
  transition: opacity 0.12s ease;
}
.traffic:hover .tl svg {
  opacity: 1;
}
.tl-close { background: #ff5f57; }
.tl-min { background: #febc2e; }
.tl-max { background: #28c840; }
.mac-window:not(.mac-window--active) .tl {
  background: var(--tl-inactive);
}
</style>
