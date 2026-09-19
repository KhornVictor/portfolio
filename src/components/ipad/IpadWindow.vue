<script setup lang="ts">
import type { Skill } from "../../service/portfolio.service";
import type { OpenApp, WallpaperPhase, WindowSlot } from "./types";
import SkillAppView from "./SkillAppView.vue";
import IpadCameraApp from "./IpadCameraApp.vue";
import IpadGameApp from "./IpadGameApp.vue";

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
      <IpadGameApp
        v-else-if="
          app.name.toLowerCase() === 'arcade' ||
          app.name.toLowerCase() === 'game' ||
          (app.icon && app.icon.toLowerCase() === 'game') ||
          app.name.toLowerCase() === '2048' ||
          app.name.toLowerCase() === 'snake'
        "
        @close="emit('close')"
      />
      <SkillAppView
        v-else
        :skill="app"
        :all-skills="allSkills"
        @close="emit('close')"
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
