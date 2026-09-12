// User-tweakable desktop settings (System Settings app), persisted locally.
import { reactive, watch } from "vue";

export type Theme = "dark" | "light";
export type Wallpaper = "aurora" | "sonoma" | "graphite" | "sunset";
export type DockPosition = "bottom" | "left" | "right";

export interface Settings {
  theme: Theme;
  wallpaper: Wallpaper;
  dockPosition: DockPosition;
  reduceMotion: boolean;
  magnification: boolean;
}

export const wallpapers: { id: Wallpaper; name: string; css: string }[] = [
  {
    id: "aurora",
    name: "Aurora",
    css: "radial-gradient(60% 50% at 20% 20%, rgba(99,102,241,.55) 0%, transparent 60%), radial-gradient(50% 45% at 80% 30%, rgba(168,85,247,.45) 0%, transparent 60%), radial-gradient(60% 60% at 60% 90%, rgba(14,165,233,.35) 0%, transparent 65%), linear-gradient(160deg, #0b1020 0%, #101632 50%, #070a14 100%)",
  },
  {
    id: "sonoma",
    name: "Sonoma",
    css: "radial-gradient(70% 60% at 30% 10%, rgba(56,189,248,.35) 0%, transparent 60%), radial-gradient(60% 60% at 90% 80%, rgba(16,185,129,.30) 0%, transparent 60%), linear-gradient(180deg, #0a1628 0%, #0d2140 55%, #061020 100%)",
  },
  {
    id: "graphite",
    name: "Graphite",
    css: "radial-gradient(60% 50% at 25% 15%, rgba(255,255,255,.10) 0%, transparent 60%), radial-gradient(50% 50% at 85% 85%, rgba(255,255,255,.06) 0%, transparent 60%), linear-gradient(160deg, #1a1b1f 0%, #0f1013 60%, #08090b 100%)",
  },
  {
    id: "sunset",
    name: "Sunset",
    css: "radial-gradient(60% 50% at 20% 25%, rgba(251,146,60,.45) 0%, transparent 60%), radial-gradient(60% 50% at 80% 20%, rgba(244,63,94,.40) 0%, transparent 60%), radial-gradient(70% 60% at 50% 100%, rgba(139,92,246,.35) 0%, transparent 65%), linear-gradient(180deg, #160b1f 0%, #1d0f2a 50%, #0a0612 100%)",
  },
];

const KEY = "kv-desktop-settings";

const defaults: Settings = {
  theme: "dark",
  wallpaper: "aurora",
  dockPosition: "bottom",
  reduceMotion: false,
  magnification: true,
};

function load(): Settings {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? { ...defaults, ...JSON.parse(raw) } : { ...defaults };
  } catch {
    return { ...defaults };
  }
}

const settings = reactive<Settings>(load());

watch(
  settings,
  (s) => {
    try {
      localStorage.setItem(KEY, JSON.stringify(s));
    } catch {
      /* private mode etc. */
    }
  },
  { deep: true },
);

export function useSettings() {
  return settings;
}
