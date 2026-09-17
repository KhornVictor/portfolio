<script setup lang="ts">
import { ref, watch } from "vue";
import { aboutMac, owner } from "../../data/portfolio";
import { useSettings, wallpapers, type DockPosition } from "../../pages/desktop/useSettings";
import type { WindowState } from "../../pages/desktop/types";

const props = defineProps<{ win: WindowState }>();
const settings = useSettings();

type Pane = "appearance" | "dock" | "network" | "developer" | "about";
const panes: { id: Pane; label: string; color: string }[] = [
  { id: "appearance", label: "Appearance", color: "#1d1d1f" },
  { id: "dock", label: "Desktop & Dock", color: "#2f7cf6" },
  { id: "network", label: "Network", color: "#2f7cf6" },
  { id: "developer", label: "Developer", color: "#8e8e93" },
  { id: "about", label: "About This Mac", color: "#8e8e93" },
];
const valid = (p?: string): p is Pane => !!p && panes.some((x) => x.id === p);
const pane = ref<Pane>(valid(props.win.payload) ? props.win.payload : "appearance");
watch(
  () => props.win.payload,
  (p) => valid(p) && (pane.value = p),
);

const dockPositions: DockPosition[] = ["left", "bottom", "right"];
</script>

<template>
  <div class="flex h-full">
    <aside class="w-14 shrink-0 overflow-y-auto border-r border-(--line) bg-(--sidebar-bg) p-2 sm:w-52">
      <div class="mb-3 hidden items-center gap-2 px-2 sm:flex">
        <span class="grid h-9 w-9 place-items-center rounded-full bg-linear-to-b from-slate-400 to-slate-600 text-[13px] font-bold text-white">{{ owner.name.split(" ").map((s) => s[0]).join("") }}</span>
        <div class="min-w-0">
          <p class="truncate text-[13px] font-semibold">{{ owner.name }}</p>
          <p class="truncate text-[11px] text-(--muted)">Apple Account</p>
        </div>
      </div>
      <button
        v-for="p in panes"
        :key="p.id"
        class="mb-0.5 flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-[13px]"
        :class="pane === p.id ? 'bg-(--accent) text-white' : 'hover:bg-(--hover)'"
        :title="p.label"
        @click="pane = p.id"
      >
        <span class="grid h-6 w-6 shrink-0 place-items-center rounded-md text-white" :style="{ background: p.color }">
          <svg v-if="p.id === 'appearance'" width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2a10 10 0 1 0 0 20V2z" /><circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" stroke-width="2" /></svg>
          <svg v-else-if="p.id === 'dock'" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="12" rx="2" /><path d="M7 20h10" /></svg>
          <svg v-else-if="p.id === 'network'" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="9" /><path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18" /></svg>
          <svg v-else-if="p.id === 'developer'" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><path d="m8 8-4 4 4 4M16 8l4 4-4 4M14 5l-4 14" /></svg>
          <svg v-else width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M16.4 12.6c0-2.4 2-3.6 2.1-3.7-1.1-1.7-2.9-1.9-3.5-1.9-1.5-.2-2.9.9-3.7.9-.8 0-1.9-.9-3.2-.8-1.6 0-3.1 1-4 2.4-1.7 3-.4 7.3 1.2 9.7.8 1.2 1.8 2.5 3 2.4 1.2 0 1.7-.8 3.2-.8s1.9.8 3.2.8c1.3 0 2.2-1.2 3-2.4.9-1.4 1.3-2.7 1.3-2.8 0 0-2.6-1-2.6-3.8z" /></svg>
        </span>
        <span class="hidden truncate sm:inline">{{ p.label }}</span>
      </button>
    </aside>

    <div class="min-w-0 flex-1 overflow-y-auto p-5 sm:p-7">
      <h1 class="mb-5 text-[20px] font-bold">{{ panes.find((p) => p.id === pane)?.label }}</h1>

      <!-- Appearance -->
      <template v-if="pane === 'appearance'">
        <section class="card">
          <p class="card-title">Appearance</p>
          <div class="flex gap-3">
            <button v-for="t in (['light', 'dark'] as const)" :key="t" class="flex flex-col items-center gap-1.5 text-[12px]" @click="settings.theme = t">
              <span class="h-14 w-22 rounded-lg border-2" :class="[t === 'dark' ? 'bg-[#1e1f24]' : 'bg-[#f4f4f7]', settings.theme === t ? 'border-(--accent)' : 'border-transparent']">
                <span class="mt-2 ml-2 block h-2 w-10 rounded" :class="t === 'dark' ? 'bg-white/20' : 'bg-black/15'"></span>
                <span class="mt-1 ml-2 block h-2 w-6 rounded" :class="t === 'dark' ? 'bg-white/20' : 'bg-black/15'"></span>
              </span>
              <span class="capitalize">{{ t }}</span>
            </button>
          </div>
        </section>
        <section class="card">
          <p class="card-title">Wallpaper</p>
          <div class="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <button v-for="w in wallpapers" :key="w.id" class="flex flex-col items-center gap-1.5 text-[12px]" @click="settings.wallpaper = w.id">
              <span class="h-16 w-full rounded-lg border-2" :class="settings.wallpaper === w.id ? 'border-(--accent)' : 'border-transparent'" :style="{ backgroundImage: w.css, backgroundSize: 'cover' }"></span>
              {{ w.name }}
            </button>
          </div>
        </section>
        <section class="card">
          <label class="row">
            <span>Reduce motion</span>
            <input v-model="settings.reduceMotion" type="checkbox" class="switch" />
          </label>
        </section>
      </template>

      <!-- Dock -->
      <template v-else-if="pane === 'dock'">
        <section class="card">
          <p class="card-title">Dock</p>
          <div class="row">
            <span>Position on screen</span>
            <div class="flex overflow-hidden rounded-md border border-(--line) text-[12px]">
              <button v-for="d in dockPositions" :key="d" class="px-3 py-1 capitalize" :class="settings.dockPosition === d ? 'bg-(--accent) text-white' : 'hover:bg-(--hover)'" @click="settings.dockPosition = d">{{ d }}</button>
            </div>
          </div>
          <label class="row">
            <span>Magnification</span>
            <input v-model="settings.magnification" type="checkbox" class="switch" />
          </label>
        </section>
      </template>

      <!-- Network -->
      <template v-else-if="pane === 'network'">
        <section class="card">
          <div class="row"><span class="flex items-center gap-2"><span class="h-2 w-2 rounded-full bg-green-500"></span>Wi-Fi</span><span class="text-(--muted)">khorn-net · Connected</span></div>
          <div class="row"><span>GitHub</span><a :href="owner.github" target="_blank" rel="noreferrer" class="text-(--accent) hover:underline">{{ owner.github.replace("https://", "") }}</a></div>
          <div class="row"><span>LinkedIn</span><a :href="owner.linkedin" target="_blank" rel="noreferrer" class="text-(--accent) hover:underline">linkedin.com/in/khorn-victor</a></div>
          <div class="row"><span>Website</span><a :href="owner.website" target="_blank" rel="noreferrer" class="text-(--accent) hover:underline">{{ owner.website.replace("https://", "") }}</a></div>
          <div class="row"><span>Email</span><a :href="`mailto:${owner.email}`" class="text-(--accent) hover:underline">{{ owner.email }}</a></div>
        </section>
      </template>

      <!-- Developer -->
      <template v-else-if="pane === 'developer'">
        <section class="card">
          <p class="card-title">Environment</p>
          <div class="row"><span>Framework</span><span class="text-(--muted)">Vue 3 · TypeScript</span></div>
          <div class="row"><span>Bundler</span><span class="text-(--muted)">Vite 8</span></div>
          <div class="row"><span>Styling</span><span class="text-(--muted)">Tailwind CSS 4</span></div>
          <div class="row"><span>Dependencies added</span><span class="text-(--muted)">0</span></div>
          <div class="row"><span>Source</span><a :href="owner.github" target="_blank" rel="noreferrer" class="text-(--accent) hover:underline">GitHub</a></div>
        </section>
      </template>

      <!-- About -->
      <template v-else>
        <div class="flex flex-col items-center gap-4 py-2 text-center sm:flex-row sm:text-left">
          <span class="grid h-24 w-40 place-items-center rounded-xl bg-linear-to-br from-slate-700 to-slate-900 shadow-lg">
            <span class="h-16 w-32 rounded-md" :style="{ backgroundImage: wallpapers[0]!.css, backgroundSize: 'cover' }"></span>
          </span>
          <div>
            <h2 class="text-[22px] font-bold">{{ owner.name }}</h2>
            <p class="text-(--muted)">Developer Portfolio</p>
          </div>
        </div>
        <section class="card mt-5">
          <div class="row"><span>System</span><span class="text-(--muted)">{{ aboutMac.system }}</span></div>
          <div class="row"><span>Version</span><span class="text-(--muted)">{{ aboutMac.version }}</span></div>
          <div class="row"><span>Processor</span><span class="text-(--muted)">{{ aboutMac.processor }}</span></div>
          <div class="row"><span>Memory</span><span class="text-(--muted)">{{ aboutMac.memory }}</span></div>
          <div class="row"><span>Storage</span><span class="text-(--muted)">{{ aboutMac.storage }}</span></div>
          <div class="row"><span>Graphics</span><span class="text-(--muted)">{{ aboutMac.graphics }}</span></div>
          <div class="row"><span>Serial number</span><span class="text-(--muted)">{{ aboutMac.serial }}</span></div>
        </section>
      </template>
    </div>
  </div>
</template>

<style scoped>
.card {
  margin-bottom: 16px;
  padding: 6px 14px;
  border-radius: 12px;
  background: var(--card-bg);
  border: 1px solid var(--line);
}
.card-title {
  padding: 8px 0 10px;
  font-size: 13px;
  font-weight: 600;
}
.row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 10px 0;
  font-size: 13px;
}
.row + .row {
  border-top: 1px solid var(--line);
}
.switch {
  appearance: none;
  width: 34px;
  height: 20px;
  border-radius: 999px;
  background: rgba(120, 120, 128, 0.4);
  position: relative;
  transition: background 0.2s;
  cursor: pointer;
}
.switch::after {
  content: "";
  position: absolute;
  top: 2px;
  left: 2px;
  width: 16px;
  height: 16px;
  border-radius: 999px;
  background: #fff;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
  transition: translate 0.2s;
}
.switch:checked {
  background: #34c759;
}
.switch:checked::after {
  translate: 14px 0;
}
</style>
