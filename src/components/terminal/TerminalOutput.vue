<script setup lang="ts">
import type { Portfolio } from "../../service/portfolio.service";
import type { TerminalEntry, Tone } from "../../terminal/types";
import FastfetchDisplay from "./FastfetchDisplay.vue";
import TerminalPrompt from "./TerminalPrompt.vue";

withDefaults(
  defineProps<{
    entries: TerminalEntry[];
    portfolio: Portfolio | null;
    shell?: "bash" | "zsh";
    fastfetch?: "arch" | "mac";
  }>(),
  { shell: "bash", fastfetch: "arch" },
);

const toneClass: Record<Tone, string> = {
  default: "text-white/85",
  muted: "text-white/40",
  cmd: "text-[#4ade80]",
  label: "text-[#22d3ee]",
  value: "text-white/85",
  link: "text-[#c084fc] underline decoration-white/20 underline-offset-4 hover:decoration-[#c084fc]",
  error: "text-[#f87171]",
  heading: "text-[#fbbf24] font-semibold",
  accent: "text-[#60a5fa]",
  success: "text-[#4ade80]",
  warn: "text-[#fbbf24]",
  purple: "text-[#c084fc]",
};
</script>

<template>
  <div class="space-y-3">
    <div v-for="entry in entries" :key="entry.id" class="entry">
      <!-- Echoed command -->
      <div v-if="entry.command !== null" class="flex flex-wrap gap-x-2">
        <TerminalPrompt :shell="shell" />
        <span class="text-white">{{ entry.command }}</span>
      </div>

      <!-- Output -->
      <div v-if="entry.lines.length" class="mt-1">
        <template v-for="(l, i) in entry.lines" :key="i">
          <FastfetchDisplay v-if="l.kind === 'fastfetch'" :portfolio="portfolio" :variant="fastfetch" />
          <div v-else-if="l.kind === 'blank'" class="h-[1.4em]"></div>
          <div v-else class="whitespace-pre-wrap wrap-break-word">
            <template v-for="(seg, j) in l.segments" :key="j">
              <a
                v-if="seg.href"
                :href="seg.href"
                :target="/^https?:/.test(seg.href) ? '_blank' : undefined"
                rel="noreferrer"
                :class="toneClass[seg.tone ?? 'link']"
                >{{ seg.text }}</a
              >
              <span v-else :class="toneClass[seg.tone ?? 'default']">{{ seg.text }}</span>
            </template>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<style scoped>
.entry {
  animation: entry-in 0.28s ease-out both;
}
@keyframes entry-in {
  from {
    opacity: 0;
    transform: translateY(4px);
  }
  to {
    opacity: 1;
    transform: none;
  }
}
@media (prefers-reduced-motion: reduce) {
  .entry {
    animation: none;
  }
}
</style>
