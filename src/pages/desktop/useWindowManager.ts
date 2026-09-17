// Window manager state: a module-level singleton so every component (Dock,
// MenuBar, apps, the terminal's `open` command…) shares the same window list.

import { computed, reactive, ref, watch } from "vue";
import { appById } from "./apps";
import type { AppId, Rect, WindowState } from "./types";

const MENUBAR_H = 28;
const DOCK_H = 84;
const CASCADE = 28;

let nextId = 1;
let nextZ = 10;

const windows = ref<WindowState[]>([]);
/** The usable desktop area (set by Desktop.vue via ResizeObserver). */
const viewport = reactive({ width: 1280, height: 800 });
const isMobile = computed(() => viewport.width < 768);

/** Area windows may occupy — between the menu bar and the Dock. */
function workArea(): Rect {
  return {
    x: 0,
    y: MENUBAR_H,
    w: viewport.width,
    h: viewport.height - MENUBAR_H - (isMobile.value ? 72 : DOCK_H),
  };
}

// Phones: every window goes full-screen (and comes back when rotating/resizing).
watch(isMobile, (mobile) => {
  windows.value.forEach((w) => {
    if (mobile && !w.maximized) {
      w.restore = { x: w.x, y: w.y, w: w.w, h: w.h };
      w.maximized = true;
    } else if (!mobile && w.maximized && w.restore) {
      Object.assign(w, w.restore);
      w.maximized = false;
      w.restore = undefined;
    }
  });
});

const visible = computed(() => windows.value.filter((w) => !w.minimized && !w.closing));
const active = computed<WindowState | null>(() =>
  visible.value.reduce<WindowState | null>((top, w) => (!top || w.z > top.z ? w : top), null),
);
const activeApp = computed<AppId | null>(() => active.value?.app ?? null);

function byId(id: number) {
  return windows.value.find((w) => w.id === id);
}

function focus(id: number) {
  const w = byId(id);
  if (!w) return;
  w.minimized = false;
  if (active.value?.id !== id) w.z = nextZ++;
}

function open(app: AppId, payload?: string, title?: string): WindowState {
  const def = appById[app];
  if (def.single) {
    const existing = windows.value.find((w) => w.app === app);
    if (existing) {
      if (payload !== undefined) existing.payload = payload;
      if (title) existing.title = title;
      focus(existing.id);
      return existing;
    }
  }

  const area = workArea();
  const w = Math.min(def.width, area.w - 24);
  const h = Math.min(def.height, area.h - 24);
  const n = windows.value.length;
  const x = Math.max(12, Math.min(area.x + (area.w - w) / 2 + (n % 6) * CASCADE, area.w - w - 12));
  const y = Math.max(area.y + 8, Math.min(area.y + (area.h - h) / 2 + (n % 6) * CASCADE - 40, area.y + area.h - h - 8));

  const win: WindowState = {
    id: nextId++,
    app,
    title: title ?? def.name,
    x: Math.round(x),
    y: Math.round(y),
    w,
    h,
    z: nextZ++,
    minimized: false,
    maximized: isMobile.value,
    payload,
  };
  windows.value.push(win);
  return win;
}

const CLOSE_MS = 200;

function close(id: number) {
  const w = byId(id);
  if (!w || w.closing) return;
  w.closing = true;
  window.setTimeout(() => {
    windows.value = windows.value.filter((x) => x.id !== id);
  }, CLOSE_MS);
}

function closeApp(app: AppId) {
  windows.value.filter((w) => w.app === app).forEach((w) => close(w.id));
}

function minimize(id: number) {
  const w = byId(id);
  if (w) w.minimized = true;
}

function toggleMaximize(id: number) {
  const w = byId(id);
  if (!w) return;
  if (w.maximized) {
    if (w.restore) Object.assign(w, w.restore);
    w.maximized = false;
    w.restore = undefined;
  } else {
    w.restore = { x: w.x, y: w.y, w: w.w, h: w.h };
    w.maximized = true;
  }
  focus(id);
}

function move(id: number, x: number, y: number) {
  const w = byId(id);
  if (!w || w.maximized) return;
  const area = workArea();
  // Keep at least a grab-able strip of the title bar on screen.
  w.x = Math.max(-w.w + 80, Math.min(x, area.w - 80));
  w.y = Math.max(area.y, Math.min(y, area.y + area.h - 40));
}

function resize(id: number, width: number, height: number) {
  const w = byId(id);
  if (!w || w.maximized) return;
  w.w = Math.max(360, width);
  w.h = Math.max(240, height);
}

/** Bring every window of an app to front (or un-minimise them). */
function activate(app: AppId) {
  const wins = windows.value.filter((w) => w.app === app);
  if (!wins.length) return false;
  wins.forEach((w) => focus(w.id));
  return true;
}

function isOpen(app: AppId) {
  return windows.value.some((w) => w.app === app);
}

/** Geometry a window should render with (maximised = fill work area). */
function frame(w: WindowState): Rect {
  return w.maximized ? workArea() : { x: w.x, y: w.y, w: w.w, h: w.h };
}

export function useWindowManager() {
  return {
    windows,
    visible,
    active,
    activeApp,
    viewport,
    isMobile,
    workArea,
    frame,
    open,
    close,
    closeApp,
    minimize,
    toggleMaximize,
    focus,
    move,
    resize,
    activate,
    isOpen,
  };
}
