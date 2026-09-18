<script setup lang="ts">
import type { Skill } from "../../service/portfolio.service";
import type { OpenApp, WallpaperPhase, WindowSlot } from "./types";
import SkillIcon from "./SkillIcon.vue";
import SkillAppView from "./SkillAppView.vue";
import IpadCameraApp from "./IpadCameraApp.vue";

defineProps<{
  app: OpenApp;
  slotName?: WindowSlot;
  isSplitView?: boolean;
  isMenuOpen: boolean;
  allSkills: Skill[];
}>();

const emit = defineEmits<{
  (e: "toggleMenu"): void;
  (e: "close"): void;
  (e: "openSkill", skillName: string): void;
  (e: "changePhase", phase: WallpaperPhase): void;
  (e: "lock"): void;
  (e: "cameraActive", active: boolean): void;
}>();
</script>

<template>
  <div
    class="relative w-full h-full flex flex-col overflow-hidden bg-slate-900/98 backdrop-blur-2xl"
  >
    <!-- TOP IPADOS HEADER BAR -->
    <div
      class="relative h-9 px-3.5 bg-slate-950/85 border-b border-white/10 flex items-center justify-between text-white select-none shrink-0 z-30"
    >
      <!-- Left: App Icon & Name -->
      <div class="flex items-center gap-2 truncate">
        <SkillIcon :name="app.name" :icon="app.icon" :size="18" />
        <span class="font-bold text-xs tracking-wide text-slate-100 truncate">
          {{ app.name }}
        </span>
        <span
          v-if="app.tag && app.tag[0]"
          class="text-[9px] px-1.5 py-0.2 rounded-full bg-white/10 text-cyan-300 font-mono hidden sm:inline"
        >
          {{ app.tag[0] }}
        </span>
      </div>

      <!-- Center: Authentic iPadOS 3-Dot Multitasking Capsule -->
      <div
        class="absolute left-1/2 -translate-x-1/2 top-1.5 flex items-center justify-center cursor-pointer group"
        title="iPadOS Multitasking Options"
        @click.stop="emit('toggleMenu')"
      >
        <div
          class="px-3 py-1 rounded-full bg-white/15 hover:bg-white/30 border border-white/20 transition-all flex items-center gap-1 shadow-sm group-hover:scale-105"
          :class="{ 'bg-white/30 ring-2 ring-cyan-400': isMenuOpen }"
        >
          <span class="w-1 h-1 rounded-full bg-white"></span>
          <span class="w-1 h-1 rounded-full bg-white"></span>
          <span class="w-1 h-1 rounded-full bg-white"></span>
        </div>

        <!-- iPadOS Multitasking Popover -->
        <Transition name="menu-pop">
          <div
            v-if="isMenuOpen"
            class="absolute top-8 left-1/2 -translate-x-1/2 z-50 w-52 bg-slate-900/98 backdrop-blur-2xl border border-white/20 rounded-2xl p-2 shadow-[0_20px_50px_rgba(0,0,0,0.85)] flex flex-col gap-1 text-white text-xs select-none"
            @click.stop
          >
            <div
              class="text-[10px] font-bold text-white/50 px-2 py-0.5 uppercase tracking-wider"
            >
              iPadOS Multitasking
            </div>
            <div
              class="px-2.5 py-1.5 rounded-xl bg-white/10 flex items-center gap-2 text-cyan-300"
            >
              <span class="text-xs">⛶</span>
              <div class="font-medium text-xs">
                {{ isSplitView ? "Split View Active" : "Full Screen Active" }}
              </div>
            </div>
            <button
              class="flex items-center gap-2 px-2.5 py-1.5 rounded-xl hover:bg-red-500/20 text-red-300 hover:text-red-200 transition text-left cursor-pointer border-t border-white/10 mt-1"
              @click="emit('close')"
            >
              <span class="text-xs">✕</span>
              <div class="font-medium text-xs">Close App (Return to Home)</div>
            </button>
          </div>
        </Transition>
      </div>

      <!-- Right: Close Button -->
      <div class="flex items-center gap-1.5">
        <button
          class="w-6 h-6 rounded-full bg-white/10 hover:bg-red-500/80 text-white/80 hover:text-white flex items-center justify-center text-xs font-bold transition cursor-pointer"
          title="Close App"
          @click.stop="emit('close')"
        >
          ✕
        </button>
      </div>
    </div>

    <!-- App Content View (Takes Full Screen Space) -->
    <div class="flex-1 w-full h-full overflow-hidden">
      <IpadCameraApp
        v-if="
          app.name.toLowerCase() === 'camera' ||
          (app.icon && app.icon.toLowerCase() === 'camera')
        "
        @close="emit('close')"
        @camera-active="(active) => emit('cameraActive', active)"
      />
      <SkillAppView
        v-else
        :skill="app"
        :all-skills="allSkills"
        @open-skill="(name) => emit('openSkill', name)"
        @change-phase="(p) => emit('changePhase', p)"
        @lock="emit('lock')"
      />
    </div>
  </div>
</template>

<style scoped>
/* Multitasking popover transition */
.menu-pop-enter-active,
.menu-pop-leave-active {
  transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
}

.menu-pop-enter-from,
.menu-pop-leave-to {
  opacity: 0;
  transform: translate(-50%, -8px) scale(0.95);
}
</style>
