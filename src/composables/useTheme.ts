// Light / dark theme. The choice is stored in localStorage and applied as a
// `.dark` class on <html> (index.html applies it before first paint so the
// page never flashes light). With no stored choice we follow the OS setting
// and keep following it until the user picks one.
import { computed, ref } from "vue";

export type Theme = "light" | "dark";
const STORAGE_KEY = "theme";

const media = window.matchMedia("(prefers-color-scheme: dark)");

function stored(): Theme | null {
  try {
    const v = localStorage.getItem(STORAGE_KEY);
    return v === "light" || v === "dark" ? v : null;
  } catch {
    return null;
  }
}

const theme = ref<Theme>(stored() ?? (media.matches ? "dark" : "light"));

function apply(t: Theme) {
  const root = document.documentElement;
  root.classList.toggle("dark", t === "dark");
  root.style.colorScheme = t;
}
apply(theme.value);

// Follow the OS until the user makes an explicit choice.
media.addEventListener("change", (e) => {
  if (!stored()) {
    theme.value = e.matches ? "dark" : "light";
    apply(theme.value);
  }
});

export function useTheme() {
  const isDark = computed(() => theme.value === "dark");

  function set(t: Theme) {
    // Briefly enable colour transitions so the swap fades instead of snapping.
    const root = document.documentElement;
    root.classList.add("theme-transition");
    theme.value = t;
    apply(t);
    window.setTimeout(() => root.classList.remove("theme-transition"), 400);
    try {
      localStorage.setItem(STORAGE_KEY, t);
    } catch {
      // Private mode etc. — the choice just won't persist.
    }
  }

  const toggle = () => set(isDark.value ? "light" : "dark");

  return { theme, isDark, set, toggle };
}
