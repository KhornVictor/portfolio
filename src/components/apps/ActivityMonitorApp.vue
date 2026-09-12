<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from "vue";
import { processes as base, stats } from "../../data/portfolio";
import type { WindowState } from "../../desktop/types";

defineProps<{ win: WindowState }>();

type Tab = "cpu" | "memory" | "energy" | "network";
const tab = ref<Tab>("cpu");
const tabs: { id: Tab; label: string; unit: string }[] = [
  { id: "cpu", label: "CPU", unit: "%" },
  { id: "memory", label: "Memory", unit: "MB" },
  { id: "energy", label: "Energy", unit: "" },
  { id: "network", label: "Network", unit: "KB/s" },
];

// Jitter the numbers a little so the monitor feels alive.
const procs = ref(base.map((p) => ({ ...p })));
const history = ref<number[]>(Array.from({ length: 40 }, () => 30 + Math.random() * 20));
let timer: number | undefined;
onMounted(() => {
  timer = window.setInterval(() => {
    procs.value = procs.value.map((p, i) => {
      const b = base[i]!;
      const j = (v: number, amt: number) => Math.max(0, v + (Math.random() - 0.5) * amt);
      return { ...p, cpu: +j(b.cpu, 6).toFixed(1), memory: Math.round(j(b.memory, 40)), energy: +j(b.energy, 1.5).toFixed(1), network: Math.round(j(b.network, 30)) };
    });
    const total = procs.value.reduce((n, p) => n + p.cpu, 0);
    history.value = [...history.value.slice(1), Math.min(100, total)];
  }, 1200);
});
onBeforeUnmount(() => clearInterval(timer));

const sorted = computed(() => [...procs.value].sort((a, b) => b[tab.value] - a[tab.value]));
const total = computed(() => procs.value.reduce((n, p) => n + p[tab.value], 0));
const max = computed(() => Math.max(...procs.value.map((p) => p[tab.value]), 1));
const unit = computed(() => tabs.find((t) => t.id === tab.value)!.unit);

const path = computed(() => {
  const w = 300, h = 60;
  return history.value
    .map((v, i) => `${i === 0 ? "M" : "L"}${(i / (history.value.length - 1)) * w},${h - (v / 100) * h}`)
    .join(" ");
});
const uptime = ref("0d 00:00");
onMounted(() => {
  const start = new Date(2025, 5, 1).getTime();
  const tick = () => {
    const s = Math.floor((Date.now() - start) / 1000);
    uptime.value = `${Math.floor(s / 86400)}d ${String(Math.floor((s % 86400) / 3600)).padStart(2, "0")}:${String(Math.floor((s % 3600) / 60)).padStart(2, "0")}`;
  };
  tick();
  window.setInterval(tick, 30000);
});
</script>

<template>
  <div class="flex h-full flex-col">
    <div class="flex h-11 shrink-0 items-center justify-center gap-1 border-b border-(--line) px-3 text-[12px]">
      <button v-for="t in tabs" :key="t.id" class="rounded-md px-3 py-1" :class="tab === t.id ? 'bg-(--hover) font-semibold' : 'text-(--muted) hover:bg-(--hover)/60'" @click="tab = t.id">{{ t.label }}</button>
    </div>

    <div class="min-h-0 flex-1 overflow-y-auto">
      <table class="w-full text-left text-[12.5px]">
        <thead class="sticky top-0 bg-(--win-bg) text-[11px] text-(--muted) backdrop-blur">
          <tr>
            <th class="px-4 py-1.5 font-medium">Process Name</th>
            <th class="w-40 px-2 py-1.5 font-medium">{{ tabs.find((t) => t.id === tab)!.label }} {{ unit }}</th>
            <th class="hidden px-2 py-1.5 font-medium sm:table-cell">User</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="p in sorted" :key="p.name" class="even:bg-(--hover)/40">
            <td class="px-4 py-1.5 font-medium">{{ p.name }}</td>
            <td class="px-2 py-1.5">
              <div class="flex items-center gap-2">
                <span class="h-1.5 w-20 overflow-hidden rounded-full bg-(--hover)"><span class="block h-full rounded-full bg-(--accent) transition-all duration-700" :style="{ width: (p[tab] / max) * 100 + '%' }"></span></span>
                <span class="tabular-nums">{{ p[tab] }}</span>
              </div>
            </td>
            <td class="hidden px-2 py-1.5 text-(--muted) sm:table-cell">{{ p.user }}</td>
          </tr>
        </tbody>
      </table>

      <!-- Portfolio stats -->
      <div class="grid gap-4 p-4 sm:grid-cols-2">
        <div class="rounded-xl border border-(--line) bg-(--card-bg) p-4">
          <p class="mb-2 text-[12px] font-semibold">{{ tabs.find((t) => t.id === tab)!.label }} Load <span class="ml-1 font-normal text-(--muted)">{{ total.toFixed(tab === 'cpu' || tab === 'energy' ? 1 : 0) }} {{ unit }}</span></p>
          <svg viewBox="0 0 300 60" class="h-16 w-full" preserveAspectRatio="none" aria-hidden="true">
            <path :d="path + ' L300,60 L0,60 Z'" fill="var(--accent)" fill-opacity=".15" />
            <path :d="path" fill="none" stroke="var(--accent)" stroke-width="1.5" />
          </svg>
          <p class="mt-2 text-[11px] text-(--muted)">Uptime: {{ uptime }} · Threads: 42 · Processes: {{ procs.length }}</p>
        </div>
        <div class="rounded-xl border border-(--line) bg-(--card-bg) p-4">
          <p class="mb-3 text-[12px] font-semibold">Portfolio</p>
          <div v-for="s in stats" :key="s.label" class="mb-2.5">
            <div class="mb-1 flex justify-between text-[11.5px]"><span>{{ s.label }}</span><span class="text-(--muted)">{{ s.value }}/{{ s.max }}</span></div>
            <div class="h-1.5 overflow-hidden rounded-full bg-(--hover)"><div class="h-full rounded-full" :style="{ width: (s.value / s.max) * 100 + '%', background: s.color }"></div></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
