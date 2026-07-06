<script setup lang="ts">
import { computed } from "vue";
import type { Project } from "../../service/portfolio.service";
import ArrowIcon from "./ArrowIcon.vue";

const props = defineProps<{
  project: Project;
  index: number;
  category: string;
}>();

// Deterministic accent per card, echoing the colourful thumbnails in the demo.
const accents = ["16,185,129", "99,102,241", "244,114,182", "245,158,11"];
const accent = computed(() => accents[props.index % accents.length]);

const link = computed(() => props.project.live_url || props.project.github_url || "");
const initials = computed(() =>
  props.project.title
    .replace(/[^a-zA-Z0-9 ]/g, " ")
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase()
);
</script>

<template>
  <component
    :is="link ? 'a' : 'div'"
    :href="link || undefined"
    :target="link ? '_blank' : undefined"
    rel="noreferrer"
    class="group block"
    v-reveal="(index % 2) * 90"
  >
    <!-- Cover -->
    <div
      class="relative aspect-4/3 overflow-hidden rounded-2xl border border-black/5"
      :style="{
        background: `radial-gradient(120% 120% at 15% 0%, rgba(${accent},0.28), rgba(0,0,0,0) 55%), linear-gradient(160deg,#1a1a1e 0%,#0e0e10 100%)`,
      }"
    >
      <!-- dotted grid texture -->
      <div
        class="absolute inset-0 opacity-[0.5]"
        style="
          background-image: radial-gradient(
            rgba(255, 255, 255, 0.08) 1px,
            transparent 1px
          );
          background-size: 22px 22px;
        "
      ></div>

      <!-- category tag -->
      <span
        class="absolute left-3 top-3 z-10 rounded-full bg-white/90 px-3 py-1 text-[0.62rem] font-semibold uppercase tracking-wide text-ink"
        >{{ category }}</span
      >

      <!-- hover arrow -->
      <span
        class="absolute right-3 top-3 z-10 grid h-9 w-9 place-items-center rounded-full bg-white text-ink opacity-0 transition duration-300 group-hover:opacity-100 group-hover:rotate-6"
      >
        <ArrowIcon :size="16" />
      </span>

      <!-- ghost initials -->
      <span
        class="display absolute -bottom-3 right-3 text-[6rem] leading-none text-white/6"
        aria-hidden="true"
        >{{ initials }}</span
      >

      <!-- tech chips -->
      <div class="absolute inset-x-3 bottom-3 z-10 flex flex-wrap gap-1.5">
        <span
          v-for="tech in project.technologies.slice(0, 4)"
          :key="tech"
          class="rounded-md border border-white/10 bg-white/5 px-2 py-1 font-mono text-[0.62rem] text-white/75 backdrop-blur-sm"
          >{{ tech }}</span
        >
      </div>
    </div>

    <!-- Meta -->
    <h3 class="mt-4 text-lg font-semibold leading-snug text-ink">
      {{ project.title }}
    </h3>
    <p class="mt-1.5 line-clamp-2 text-sm text-ink/55">
      {{ project.description }}
    </p>
    <div class="mt-3 flex flex-wrap gap-2">
      <span
        v-for="tech in project.technologies.slice(0, 3)"
        :key="tech"
        class="rounded-full border border-black/8 bg-black/3 px-3 py-1 text-xs text-ink/65"
        >{{ tech }}</span
      >
    </div>
  </component>
</template>
