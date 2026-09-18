<script setup lang="ts">
import type { OpenApp } from "./types";
import SkillIcon from "./SkillIcon.vue";

defineProps<{
  dockApps: OpenApp[];
  recentApps: OpenApp[];
  activeAppNames: string[];
}>();

const emit = defineEmits<{
  (e: "openApp", app: OpenApp): void;
}>();
</script>

<template>
  <div
    class="w-full flex justify-center pb-1.5 z-30 pointer-events-auto transition-all duration-300"
  >
    <div
      class="h-13 sm:h-15 px-3 sm:px-4 rounded-3xl bg-white/20 dark:bg-black/50 backdrop-blur-2xl border border-white/25 shadow-2xl flex items-center gap-2 sm:gap-3 transition-all"
    >
      <!-- Pinned System Apps in Dock -->
      <div
        v-for="dockApp in dockApps"
        :key="dockApp.name"
        class="group relative flex flex-col items-center cursor-pointer transition-transform hover:-translate-y-1 active:scale-95"
        :title="dockApp.name"
        @click="emit('openApp', dockApp)"
      >
        <SkillIcon :name="dockApp.name" :icon="dockApp.icon" :size="40" />
        <span
          v-if="activeAppNames.includes(dockApp.name)"
          class="w-1 h-1 rounded-full bg-white mt-0.5 shadow-sm"
        ></span>
      </div>

      <!-- Divider -->
      <div class="w-px h-8 bg-white/20 mx-1"></div>

      <!-- Running / Recent App -->
      <div
        v-if="recentApps[0]"
        class="group relative flex flex-col items-center cursor-pointer transition-transform hover:-translate-y-1 active:scale-95"
        :title="'Running: ' + recentApps[0].name"
        @click="emit('openApp', recentApps[0])"
      >
        <SkillIcon
          :name="recentApps[0].name"
          :icon="recentApps[0].icon"
          :size="40"
        />
        <span
          class="w-1 h-1 rounded-full bg-cyan-400 mt-0.5 shadow-[0_0_4px_#22d3ee]"
        ></span>
      </div>
    </div>
  </div>
</template>
