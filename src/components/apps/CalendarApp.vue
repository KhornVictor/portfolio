<script setup lang="ts">
import { computed, ref } from "vue";
import { calendarEvents } from "../../data/portfolio";
import type { WindowState } from "../../desktop/types";

defineProps<{ win: WindowState }>();

const today = new Date();
const view = ref(new Date(today.getFullYear(), today.getMonth(), 1));
const selectedDay = ref<number | null>(today.getDate());

const monthLabel = computed(() => view.value.toLocaleDateString("en-US", { month: "long", year: "numeric" }));
const isCurrentMonth = computed(() => view.value.getMonth() === today.getMonth() && view.value.getFullYear() === today.getFullYear());

const cells = computed(() => {
  const first = view.value.getDay();
  const days = new Date(view.value.getFullYear(), view.value.getMonth() + 1, 0).getDate();
  const out: (number | null)[] = Array(first).fill(null);
  for (let d = 1; d <= days; d++) out.push(d);
  while (out.length % 7) out.push(null);
  return out;
});

// Events are defined by day-of-month so they show in whatever month is current.
const eventsFor = (d: number | null) => (d ? calendarEvents.filter((e) => e.day === d) : []);
const selectedEvents = computed(() => eventsFor(selectedDay.value));

function shift(n: number) {
  view.value = new Date(view.value.getFullYear(), view.value.getMonth() + n, 1);
  selectedDay.value = null;
}
function goToday() {
  view.value = new Date(today.getFullYear(), today.getMonth(), 1);
  selectedDay.value = today.getDate();
}
const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
</script>

<template>
  <div class="flex h-full flex-col">
    <div class="flex h-11 shrink-0 items-center gap-2 border-b border-(--line) px-4">
      <h1 class="text-[16px] font-bold">{{ monthLabel }}</h1>
      <div class="ml-auto flex items-center gap-1 text-[12px]">
        <button class="nav" aria-label="Previous month" @click="shift(-1)">‹</button>
        <button class="rounded-md px-2 py-0.5 hover:bg-(--hover)" @click="goToday">Today</button>
        <button class="nav" aria-label="Next month" @click="shift(1)">›</button>
      </div>
    </div>

    <div class="flex min-h-0 flex-1 flex-col md:flex-row">
      <div class="flex min-h-0 flex-1 flex-col">
        <div class="grid grid-cols-7 border-b border-(--line) text-center text-[11px] font-medium text-(--muted)">
          <span v-for="d in weekdays" :key="d" class="py-1.5">{{ d }}</span>
        </div>
        <div class="grid flex-1 auto-rows-fr grid-cols-7">
          <button
            v-for="(d, i) in cells"
            :key="i"
            class="flex flex-col items-start gap-0.5 border-r border-b border-(--line) p-1.5 text-left text-[12px]"
            :class="[d ? 'hover:bg-(--hover)/60' : 'opacity-0', selectedDay === d ? 'bg-(--hover)' : '']"
            :disabled="!d"
            @click="selectedDay = d"
          >
            <span class="grid h-6 w-6 place-items-center rounded-full" :class="isCurrentMonth && d === today.getDate() ? 'bg-red-500 font-semibold text-white' : ''">{{ d }}</span>
            <span v-for="e in eventsFor(d).slice(0, 2)" :key="e.title" class="hidden w-full truncate rounded px-1 text-[10.5px] text-white sm:block" :style="{ background: e.color }">{{ e.title }}</span>
            <span v-if="eventsFor(d).length" class="flex gap-0.5 sm:hidden"><span v-for="e in eventsFor(d)" :key="e.title" class="h-1.5 w-1.5 rounded-full" :style="{ background: e.color }"></span></span>
          </button>
        </div>
      </div>

      <aside class="max-h-48 shrink-0 overflow-y-auto border-t border-(--line) bg-(--sidebar-bg) p-4 md:max-h-none md:w-60 md:border-t-0 md:border-l">
        <p class="text-[11px] font-semibold text-(--muted) uppercase">{{ selectedDay ? `${monthLabel.split(" ")[0]} ${selectedDay}` : "Select a day" }}</p>
        <div v-if="selectedEvents.length" class="mt-2 space-y-2">
          <div v-for="e in selectedEvents" :key="e.title" class="rounded-lg border-l-4 bg-(--card-bg) px-3 py-2 text-[13px]" :style="{ borderColor: e.color }">
            {{ e.title }}
            <p class="text-[11px] text-(--muted)">All day</p>
          </div>
        </div>
        <p v-else class="mt-2 text-[13px] text-(--muted)">No events.</p>

        <p class="mt-5 text-[11px] font-semibold text-(--muted) uppercase">This month</p>
        <ul class="mt-2 space-y-1.5 text-[12.5px]">
          <li v-for="e in calendarEvents" :key="e.title" class="flex items-center gap-2"><span class="h-2 w-2 shrink-0 rounded-full" :style="{ background: e.color }"></span><span class="w-5 text-(--muted) tabular-nums">{{ e.day }}</span><span class="truncate">{{ e.title }}</span></li>
        </ul>
      </aside>
    </div>
  </div>
</template>

<style scoped>
.nav {
  width: 24px;
  height: 22px;
  border-radius: 6px;
  font-size: 16px;
  line-height: 1;
}
.nav:hover {
  background: var(--hover);
}
</style>
