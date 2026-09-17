<script setup lang="ts">
import { computed } from "vue";
import type { Portfolio } from "../../service/portfolio.service";
import { PROMPT_HOST, PROMPT_USER } from "../../pages/terminal/commands";

import archLogoText from "../../assets/markdown/Arch.txt?raw";
import appleLogoText from "../../assets/markdown/Apple.txt?raw";
import { APPLE_TONES } from "./theme/Apple.tone";

const props = withDefaults(
  defineProps<{ portfolio: Portfolio | null; variant?: "arch" | "mac" }>(),
  { variant: "arch" },
);

const LOGO = archLogoText.replace(/\r\n/g, "\n").replace(/\n$/, "").split("\n");
const SPLIT = 11;
const APPLE = appleLogoText.replace(/\r\n/g, "\n").replace(/\n$/, "").split("\n");

const title = computed(() => `${PROMPT_USER}@${PROMPT_HOST}`);

const rows = computed<{ label: string; value: string; href?: string }[]>(() => {
  const p = props.portfolio;
  const personal = p?.personal;
  const skillCount = p
    ? Array.isArray(p.skills)
      ? p.skills.length
      : Object.values(p.skills as Record<string, unknown[]>).reduce(
          (n, arr) => n + (Array.isArray(arr) ? arr.length : 0),
          0,
        )
    : 0;
  const res =
    typeof window !== "undefined"
      ? `${window.innerWidth}x${window.innerHeight}`
      : "—";

  if (props.variant === "mac") {
    return [
      { label: "OS", value: "macOS Portfolio Edition" },
      {
        label: "Host",
        value:
          personal?.website.replace(/^https?:\/\//, "") ?? "khornvictor.com",
        href: personal?.website,
      },
      { label: "Shell", value: "zsh 5.9" },
      { label: "Runtime", value: "Node.js" },
      { label: "Language", value: "TypeScript" },
      { label: "Frontend", value: "Vue / React" },
      { label: "Backend", value: "NestJS" },
      { label: "Database", value: "PostgreSQL / MySQL" },
      { label: "Cache", value: "Redis" },
      { label: "Tools", value: "Docker / Git" },
      { label: "Resolution", value: res },
      {
        label: "Location",
        value: personal
          ? `${personal.location.city}, ${personal.location.country}`
          : "Cambodia",
      },
    ];
  }

  return [
    { label: "OS", value: "Portfolio Linux x86_64 (Vue 3 + TypeScript)" },
    {
      label: "Host",
      value: personal?.website.replace(/^https?:\/\//, "") ?? "khornvictor.com",
      href: personal?.website,
    },
    { label: "Kernel", value: "vite 8 · tailwindcss 4" },
    { label: "Uptime", value: "always building" },
    {
      label: "Packages",
      value: p
        ? `${p.projects.length} projects, ${skillCount} skills, ${p.certificates.length} certs`
        : "loading…",
    },
    { label: "Shell", value: "portfolio-shell 1.0" },
    { label: "Resolution", value: res },
    { label: "Terminal", value: "web-terminal" },
    { label: "Theme", value: "dark [charcoal]" },
    { label: "CPU", value: personal?.label ?? "Full-Stack Developer" },
    { label: "GPU", value: "Backend · Database design · Clean architecture" },
    { label: "Memory", value: "Creativity 100% / 100%" },
    {
      label: "Location",
      value: personal
        ? `${personal.location.city}, ${personal.location.country}`
        : "Cambodia",
    },
  ];
});

const swatches = [
  "#0f1115",
  "#f87171",
  "#4ade80",
  "#fbbf24",
  "#60a5fa",
  "#c084fc",
  "#22d3ee",
  "#e5e7eb",
];
</script>

<template>
  <div class="flex flex-col gap-5 py-2 md:flex-row md:items-start md:gap-10">
    <!-- Logo -->
    <pre
      class="ff-logo m-0 shrink-0 overflow-x-auto text-[11px] leading-[1.15] sm:text-[12.5px] md:text-[13px]"
      aria-hidden="true"
    ><template v-if="variant === 'mac'"><span v-for="(l, i) in APPLE" :key="i" :style="{ color: APPLE_TONES[i] }">{{ l }}
</span></template><template v-else><span v-for="(l, i) in LOGO" :key="i" :class="i < SPLIT ? 'text-[#7dd3fc]' : 'text-[#22d3ee]'">{{ l }}
</span></template></pre>

    <!-- Info -->
    <div class="min-w-0 flex-1">
      <div class="whitespace-nowrap">
        <span class="text-[#4ade80] font-semibold">{{ title }}</span>
      </div>
      <div v-if="variant === 'mac'" class="text-white/70">
        {{ portfolio?.personal.name ?? "Khorn Victor" }} ·
        {{ portfolio?.personal.label ?? "Full-Stack Developer" }}
      </div>
      <div class="text-white/25">{{ "─".repeat(title.length + 6) }}</div>

      <div class="mt-1 grid grid-cols-[auto_1fr] gap-x-3 gap-y-px">
        <template v-for="r in rows" :key="r.label">
          <span class="text-[#22d3ee] font-semibold">{{ r.label }}</span>
          <span class="min-w-0 truncate text-white/85">
            <a
              v-if="r.href"
              :href="r.href"
              target="_blank"
              rel="noreferrer"
              class="text-[#c084fc] underline decoration-white/20 underline-offset-4 hover:decoration-[#c084fc]"
              >{{ r.value }}</a
            >
            <template v-else>{{ r.value }}</template>
          </span>
        </template>
      </div>

      <!-- Palette blocks -->
      <div class="mt-4 flex">
        <span
          v-for="c in swatches"
          :key="c"
          class="h-4 w-7 first:rounded-l-md last:rounded-r-md sm:w-8"
          :style="{ background: c }"
        ></span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.ff-logo {
  font-family: inherit;
  scrollbar-width: none;
}
.ff-logo::-webkit-scrollbar {
  display: none;
}
</style>
