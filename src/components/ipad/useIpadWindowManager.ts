import { computed, onUnmounted, ref, type Ref } from "vue";
import type { OpenApp, SnapPosition, WindowSlot, WindowState } from "./types";

export function useIpadWindowManager(screenRef?: Ref<HTMLElement | null>) {
  const primaryApp = ref<OpenApp | null>(null);
  const secondaryApp = ref<OpenApp | null>(null);
  const activeApp = computed(() => primaryApp.value || secondaryApp.value || null);
  const recentApps = ref<OpenApp[]>([]);

  const primaryWindow = ref<WindowState>({
    x: 24,
    y: 12,
    width: 620,
    height: 440,
    isMaximized: false,
    zIndex: 20,
  });

  const secondaryWindow = ref<WindowState>({
    x: 140,
    y: 40,
    width: 580,
    height: 420,
    isMaximized: false,
    zIndex: 25,
  });

  const openMultitaskingMenu = ref<WindowSlot | null>(null);

  const dockApps = ref<OpenApp[]>([
    { name: "Camera", icon: "camera", tag: ["System"] },
    { name: "Safari", icon: "safari", tag: ["Web"] },
    { name: "Terminal", icon: "terminal", tag: ["System"] },
    { name: "Notes", icon: "notes", tag: ["System"] },
    { name: "Settings", icon: "settings", tag: ["System"] },
  ]);

  function recordRecentApp(app: OpenApp) {
    if (!recentApps.value.some((a) => a.name === app.name)) {
      recentApps.value.unshift(app);
      if (recentApps.value.length > 5) recentApps.value.pop();
    }
  }

  function openApp(app: OpenApp, slot: WindowSlot = "primary") {
    openMultitaskingMenu.value = null;
    recordRecentApp(app);

    if (slot === "secondary") {
      secondaryApp.value = app;
      secondaryWindow.value.zIndex = 30;
      primaryWindow.value.zIndex = 20;
    } else {
      primaryApp.value = app;
      primaryWindow.value.zIndex = 30;
      secondaryWindow.value.zIndex = 20;
    }
  }

  function closeApp(slot: WindowSlot | "all" = "all") {
    openMultitaskingMenu.value = null;
    if (slot === "secondary") {
      secondaryApp.value = null;
    } else if (slot === "primary") {
      if (secondaryApp.value) {
        primaryApp.value = secondaryApp.value;
        primaryWindow.value = { ...secondaryWindow.value };
        secondaryApp.value = null;
      } else {
        primaryApp.value = null;
      }
    } else {
      primaryApp.value = null;
      secondaryApp.value = null;
    }
  }

  function bringToFront(slot: WindowSlot) {
    if (slot === "primary") {
      primaryWindow.value.zIndex = 30;
      secondaryWindow.value.zIndex = 20;
    } else {
      secondaryWindow.value.zIndex = 30;
      primaryWindow.value.zIndex = 20;
    }
  }

  function toggleMultitaskingMenu(slot: WindowSlot) {
    openMultitaskingMenu.value =
      openMultitaskingMenu.value === slot ? null : slot;
  }

  // -------------------------------------------------------------
  // WINDOW DRAG TO MOVE
  // -------------------------------------------------------------
  const isDraggingWindow = ref(false);
  const isResizingWindow = ref(false);
  const activeWindowDragSlot = ref<WindowSlot | null>(null);
  let windowDragStart = { x: 0, y: 0, initialX: 0, initialY: 0 };
  let windowResizeStart = { x: 0, y: 0, initialW: 0, initialH: 0 };

  function startWindowDrag(e: MouseEvent | TouchEvent, slot: WindowSlot) {
    bringToFront(slot);
    activeWindowDragSlot.value = slot;
    const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
    const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;

    const win = slot === "primary" ? primaryWindow.value : secondaryWindow.value;

    if (win.isMaximized) {
      win.isMaximized = false;
      win.width = 620;
      win.height = 440;
      win.x = Math.max(10, clientX - 300);
      win.y = Math.max(10, clientY - 15);
    }

    windowDragStart = {
      x: clientX,
      y: clientY,
      initialX: win.x,
      initialY: win.y,
    };

    isDraggingWindow.value = true;

    window.addEventListener("mousemove", onWindowMouseMove);
    window.addEventListener("mouseup", onWindowMouseUp);
    window.addEventListener("touchmove", onWindowMouseMove, { passive: false });
    window.addEventListener("touchend", onWindowMouseUp);
  }

  function onWindowMouseMove(e: MouseEvent | TouchEvent) {
    if (!isDraggingWindow.value || !activeWindowDragSlot.value) return;
    if ("touches" in e) e.preventDefault();

    const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
    const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;

    const dx = clientX - windowDragStart.x;
    const dy = clientY - windowDragStart.y;

    const win =
      activeWindowDragSlot.value === "primary"
        ? primaryWindow.value
        : secondaryWindow.value;

    const screenRect = screenRef?.value?.getBoundingClientRect();
    const maxW = screenRect ? screenRect.width : 850;
    const maxH = screenRect ? screenRect.height : 550;

    win.x = Math.max(8, Math.min(maxW - 120, windowDragStart.initialX + dx));
    win.y = Math.max(6, Math.min(maxH - 70, windowDragStart.initialY + dy));
  }

  function onWindowMouseUp() {
    isDraggingWindow.value = false;
    activeWindowDragSlot.value = null;
    window.removeEventListener("mousemove", onWindowMouseMove);
    window.removeEventListener("mouseup", onWindowMouseUp);
    window.removeEventListener("touchmove", onWindowMouseMove);
    window.removeEventListener("touchend", onWindowMouseUp);
  }

  // -------------------------------------------------------------
  // WINDOW RESIZE
  // -------------------------------------------------------------
  function startWindowResize(e: MouseEvent | TouchEvent, slot: WindowSlot) {
    if ("touches" in e) e.preventDefault();
    bringToFront(slot);
    activeWindowDragSlot.value = slot;
    isResizingWindow.value = true;

    const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
    const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;

    const win = slot === "primary" ? primaryWindow.value : secondaryWindow.value;

    windowResizeStart = {
      x: clientX,
      y: clientY,
      initialW: win.width,
      initialH: win.height,
    };

    window.addEventListener("mousemove", onWindowResizeMove);
    window.addEventListener("mouseup", onWindowResizeUp);
    window.addEventListener("touchmove", onWindowResizeMove, { passive: false });
    window.addEventListener("touchend", onWindowResizeUp);
  }

  function onWindowResizeMove(e: MouseEvent | TouchEvent) {
    if (!isResizingWindow.value || !activeWindowDragSlot.value) return;
    if ("touches" in e) e.preventDefault();

    const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
    const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;

    const dx = clientX - windowResizeStart.x;
    const dy = clientY - windowResizeStart.y;

    const win =
      activeWindowDragSlot.value === "primary"
        ? primaryWindow.value
        : secondaryWindow.value;

    const screenRect = screenRef?.value?.getBoundingClientRect();
    const maxW = screenRect ? screenRect.width - win.x - 8 : 800;
    const maxH = screenRect ? screenRect.height - win.y - 8 : 500;

    win.width = Math.max(320, Math.min(maxW, windowResizeStart.initialW + dx));
    win.height = Math.max(240, Math.min(maxH, windowResizeStart.initialH + dy));
  }

  function onWindowResizeUp() {
    isResizingWindow.value = false;
    activeWindowDragSlot.value = null;
    window.removeEventListener("mousemove", onWindowResizeMove);
    window.removeEventListener("mouseup", onWindowResizeUp);
    window.removeEventListener("touchmove", onWindowResizeMove);
    window.removeEventListener("touchend", onWindowResizeUp);
  }

  // -------------------------------------------------------------
  // WINDOW SNAP PRESETS
  // -------------------------------------------------------------
  function snapPosition(slot: WindowSlot, pos: SnapPosition) {
    openMultitaskingMenu.value = null;
    const win = slot === "primary" ? primaryWindow.value : secondaryWindow.value;
    const screenRect = screenRef?.value?.getBoundingClientRect();
    const totalW = screenRect ? screenRect.width : 850;
    const totalH = screenRect ? screenRect.height : 550;

    if (pos === "maximize") {
      win.isMaximized = !win.isMaximized;
    } else if (pos === "left") {
      win.isMaximized = false;
      win.x = 8;
      win.y = 8;
      win.width = Math.round(totalW * 0.49);
      win.height = totalH - 16;
    } else if (pos === "right") {
      win.isMaximized = false;
      win.x = Math.round(totalW * 0.505);
      win.y = 8;
      win.width = Math.round(totalW * 0.49);
      win.height = totalH - 16;
    } else if (pos === "center") {
      win.isMaximized = false;
      win.width = Math.min(620, totalW - 40);
      win.height = Math.min(450, totalH - 40);
      win.x = Math.round((totalW - win.width) / 2);
      win.y = Math.round((totalH - win.height) / 2);
    }
  }

  onUnmounted(() => {
    window.removeEventListener("mousemove", onWindowMouseMove);
    window.removeEventListener("mouseup", onWindowMouseUp);
    window.removeEventListener("touchmove", onWindowMouseMove);
    window.removeEventListener("touchend", onWindowMouseUp);
    window.removeEventListener("mousemove", onWindowResizeMove);
    window.removeEventListener("mouseup", onWindowResizeUp);
    window.removeEventListener("touchmove", onWindowResizeMove);
    window.removeEventListener("touchend", onWindowResizeUp);
  });

  return {
    primaryApp,
    secondaryApp,
    activeApp,
    recentApps,
    dockApps,
    primaryWindow,
    secondaryWindow,
    openMultitaskingMenu,
    isDraggingWindow,
    isResizingWindow,
    activeWindowDragSlot,
    openApp,
    closeApp,
    bringToFront,
    toggleMultitaskingMenu,
    startWindowDrag,
    startWindowResize,
    snapPosition,
  };
}
