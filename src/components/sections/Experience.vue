<script setup lang="ts">
import { computed } from "vue";
import type { Education, Experience } from "../../service/portfolio.service";
import SectionHeading from "../ui/SectionHeading.vue";

const props = defineProps<{
  experiences: Experience[];
  educations: Education[];
}>();

const MONTHS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

function fmt(value: string) {
  if (!value) return "";
  if (/present|now/i.test(value)) return "Now";
  const m = value.match(/^(\d{4})-(\d{2})$/);
  if (m) return `${MONTHS[Number(m[2]) - 1]} ${m[1]}`;
  return value; // already a bare year or free text
}

interface Row {
  title: string;
  subtitle: string;
  range: string;
  kind: string;
  startYear: number;
}

const rows = computed<Row[]>(() => {
  const exp: Row[] = props.experiences.map((e) => ({
    title: e.company,
    subtitle: e.position,
    range: `${fmt(e.start_date)} — ${fmt(e.end_date)}`,
    kind: "Work",
    startYear: Number(e.start_date.slice(0, 4)) || 0,
  }));
  const edu: Row[] = props.educations.map((e) => ({
    title: e.institution,
    subtitle: e.degree,
    range: `${fmt(e.start_date)} — ${fmt(e.end_date)}`,
    kind: "Study",
    startYear: Number(String(e.start_date).slice(0, 4)) || 0,
  }));
  return [...exp, ...edu].sort((a, b) => b.startYear - a.startYear);
});

const years = computed(() => {
  const starts = rows.value.map((r) => r.startYear).filter(Boolean);
  if (!starts.length) return 1;
  return Math.max(1, new Date().getFullYear() - Math.min(...starts));
});
</script>

<template>
  <SectionHeading watermark="Experience" title="Experience" dark>
    <template #aside>
      <span class="text-sm text-white/50">{{ years }}+ years journey</span>
    </template>
  </SectionHeading>

  <div class="mt-6">
    <div
      v-for="(row, i) in rows"
      :key="row.title + i"
      class="group flex items-center justify-between gap-4 border-t border-white/10 px-3 py-6 transition-colors duration-300 last:border-b hover:bg-white/[0.04]"
      v-reveal="i * 70"
    >
      <div class="transition-transform duration-300 group-hover:translate-x-1.5">
        <p class="text-lg font-semibold text-white">{{ row.title }}</p>
        <p class="mt-0.5 text-sm text-white/45">{{ row.subtitle }}</p>
      </div>
      <div class="flex flex-none items-center gap-3">
        <span
          class="hidden rounded-full border border-white/10 px-2.5 py-0.5 text-[0.62rem] uppercase tracking-wide text-white/40 sm:inline"
          >{{ row.kind }}</span
        >
        <span class="text-sm text-white/55">{{ row.range }}</span>
      </div>
    </div>
  </div>
</template>
