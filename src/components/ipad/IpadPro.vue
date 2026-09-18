<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, watch } from "vue";
import type { Skill } from "../../service/portfolio.service";
import DynamicWallpaper from "./DynamicWallpaper.vue";
import IpadLockScreen from "./IpadLockScreen.vue";
import IpadPencil from "./IpadPencil.vue";
import IpadStatusBar from "./IpadStatusBar.vue";
import IpadHomeScreen from "./IpadHomeScreen.vue";
import IpadWindow from "./IpadWindow.vue";
import IpadDock from "./IpadDock.vue";
import IpadHomeBar from "./IpadHomeBar.vue";
import { useIpadWindowManager } from "./useIpadWindowManager";
import type { WallpaperPhase } from "./types";

export type {
  OpenApp,
  WindowState,
  WallpaperPhase,
  WindowSlot,
  SnapPosition,
} from "./types";

const props = defineProps<{
  skills: Skill[];
}>();

// -------------------------------------------------------------
// LOCK SCREEN & WALLPAPER STATE
// -------------------------------------------------------------
const isLocked = ref(true);
const wallpaperPhase = ref<WallpaperPhase>("auto");

function unlock() {
  isLocked.value = false;
}

function lock() {
  isLocked.value = true;
  wm.openMultitaskingMenu.value = null;
}

// -------------------------------------------------------------
// CLOCK & STATUS BAR
// -------------------------------------------------------------
const currentTime = ref("");
const currentDate = ref("");
let timer = 0;

function updateTime() {
  const now = new Date();
  currentTime.value = now.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
  currentDate.value = now.toLocaleDateString([], {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
}

// -------------------------------------------------------------
// HOME SCREEN PAGINATION & SKILLS
// -------------------------------------------------------------
const currentPage = ref(0);
const isJiggleMode = ref(false);
const skillList = ref<Skill[]>([]);

watch(
  () => props.skills,
  (newSkills) => {
    if (newSkills && newSkills.length > 0) {
      skillList.value = [...newSkills];
    }
  },
  { immediate: true },
);

const totalPages = computed(() =>
  Math.max(1, Math.ceil(skillList.value.length / 30)),
);

// -------------------------------------------------------------
// MULTITASKING & WINDOW MANAGER
// -------------------------------------------------------------
const screenRef = ref<HTMLElement | null>(null);
const wm = useIpadWindowManager(screenRef);

const activeAppNames = computed(() =>
  [wm.primaryApp.value?.name, wm.secondaryApp.value?.name].filter(
    (name): name is string => Boolean(name),
  ),
);

// -------------------------------------------------------------
// CAMERA STATE & LAUNCHER
// -------------------------------------------------------------
const isCameraActive = ref(false);

function openCameraApp() {
  if (isLocked.value) unlock();
  wm.openApp({ name: "Camera", icon: "camera", tag: ["System"] });
}

watch(wm.activeApp, (app) => {
  if (!app || app.name.toLowerCase() !== "camera") {
    isCameraActive.value = false;
  }
});

// -------------------------------------------------------------
// KEYBOARD NAVIGATION
// -------------------------------------------------------------
function handleKeydown(e: KeyboardEvent) {
  if (e.key === "Escape") {
    if (wm.openMultitaskingMenu.value) {
      wm.openMultitaskingMenu.value = null;
    } else if (isJiggleMode.value) {
      isJiggleMode.value = false;
    } else if (wm.activeApp.value) {
      wm.closeApp("all");
    } else if (!isLocked.value) {
      lock();
    } else {
      unlock();
    }
  } else if (!wm.activeApp.value && !isLocked.value) {
    if (e.key === "ArrowRight" && currentPage.value < totalPages.value - 1) {
      currentPage.value++;
    } else if (e.key === "ArrowLeft" && currentPage.value > 0) {
      currentPage.value--;
    }
  }
}

onMounted(() => {
  updateTime();
  timer = window.setInterval(updateTime, 1000);
  window.addEventListener("keydown", handleKeydown);
});

onUnmounted(() => {
  clearInterval(timer);
  window.removeEventListener("keydown", handleKeydown);
});
</script>

<template>
  <div
    class="relative w-full h-full flex flex-col items-center justify-center p-1 sm:p-3 select-none"
  >
    <!-- 1. Apple Pencil Pro Magnet & Toast -->
    <IpadPencil />

    <!-- 2. Real iPad Pro Hardware Frame -->
    <div
      class="relative w-full max-w-5xl h-full max-h-160 lg:max-h-170 rounded-[34px] sm:rounded-[44px] p-2.5 sm:p-4 bg-linear-to-b from-[#3a3d42] via-[#24262b] to-[#16171a] shadow-[0_25px_60px_-15px_rgba(0,0,0,0.75),0_0_0_1.5px_rgba(255,255,255,0.18),inset_0_1px_1px_rgba(255,255,255,0.3)] flex flex-col overflow-hidden"
    >
      <!-- Hardware Sleep / Lock Button -->
      <button
        class="absolute top-0 right-12 sm:right-16 h-1 sm:h-1.5 w-10 sm:w-14 rounded-b-sm bg-linear-to-r from-[#24262b] via-[#474a52] to-[#24262b] border-b border-x border-white/20 shadow-sm hover:brightness-150 active:translate-y-0.5 transition cursor-pointer z-50"
        :title="
          isLocked ? 'Click to wake / unlock iPad' : 'Click to lock iPad screen'
        "
        @click="isLocked ? unlock() : lock()"
      ></button>

      <!-- Top Bezel: TrueDepth Camera & Privacy Indicator Sensor -->
      <div
        class="absolute top-1 sm:top-1.5 left-1/2 -translate-x-1/2 flex items-center gap-2 z-40 cursor-pointer"
        title="TrueDepth Camera - Click to open Camera"
        @click="openCameraApp"
      >
        <div
          class="w-2 sm:w-2.5 h-2 sm:h-2.5 rounded-full bg-[#050608] border border-white/10 flex items-center justify-center transition-transform hover:scale-110 active:scale-95"
        >
          <div
            class="w-1 h-1 rounded-full bg-[#1b253b] shadow-[0_0_2px_#3b82f6]"
          ></div>
        </div>
        <!-- Green Privacy LED when camera is active -->
        <div
          class="w-1.5 h-1.5 rounded-full transition-all duration-300"
          :class="isCameraActive ? 'bg-emerald-400 shadow-[0_0_6px_#34d399]' : 'bg-[#0a0c10] opacity-80'"
          :title="isCameraActive ? 'Camera is active' : 'TrueDepth sensor'"
        ></div>
      </div>

      <!-- Speakers -->
      <div
        class="absolute left-1 top-1/2 -translate-y-1/2 flex flex-col gap-1 opacity-40"
      >
        <div class="w-1 h-3 rounded-full bg-white/20"></div>
        <div class="w-1 h-3 rounded-full bg-white/20"></div>
      </div>
      <div
        class="absolute right-1 top-1/2 -translate-y-1/2 flex flex-col gap-1 opacity-40"
      >
        <div class="w-1 h-3 rounded-full bg-white/20"></div>
        <div class="w-1 h-3 rounded-full bg-white/20"></div>
      </div>

      <!-- 3. iPadOS Screen Display -->
      <div
        class="relative flex-1 w-full h-full rounded-[28px] sm:rounded-4xl overflow-hidden flex flex-col shadow-inner"
      >
        <!-- Dynamic Wallpaper -->
        <DynamicWallpaper :force-phase="wallpaperPhase" />

        <!-- Glass reflection diagonal -->
        <div
          class="pointer-events-none absolute inset-0 bg-linear-to-tr from-transparent via-white/5 to-white/10 opacity-60 z-30"
        ></div>

        <!-- Lock Screen -->
        <Transition name="lock-fade">
          <IpadLockScreen
            v-if="isLocked"
            :wallpaper-phase="wallpaperPhase"
            @unlock="unlock"
            @open-camera="openCameraApp"
            @change-phase="(p) => (wallpaperPhase = p)"
          />
        </Transition>

        <!-- Unlocked iPadOS Interface -->
        <div
          v-if="!isLocked"
          ref="screenRef"
          class="relative flex-1 w-full h-full flex flex-col overflow-hidden animate-fade-in"
        >
          <!-- 3A. Status Bar -->
          <IpadStatusBar
            :current-time="currentTime"
            :current-date="currentDate"
            :has-active-app="Boolean(wm.activeApp.value)"
            :current-page="currentPage"
            :total-pages="totalPages"
            :is-jiggle-mode="isJiggleMode"
            @toggle-jiggle="isJiggleMode = !isJiggleMode"
            @finish-jiggle="isJiggleMode = false"
            @lock="lock"
          />

          <!-- 3B. Screen Content Area -->
          <div
            class="relative flex-1 w-full h-full overflow-hidden flex flex-col"
          >
            <!-- Home Screen (App Grid) -->
            <IpadHomeScreen
              v-if="!wm.activeApp.value"
              v-model:skills="skillList"
              v-model:current-page="currentPage"
              v-model:is-jiggle-mode="isJiggleMode"
              @open-app="(app) => wm.openApp(app)"
            />

            <!-- Full Screen Application Area (Real iPadOS style) -->
            <div
              v-else
              class="relative flex-1 w-full h-full overflow-hidden flex flex-col sm:flex-row animate-fade-in"
            >
              <!-- Primary Application (Full Screen or Split Left) -->
              <div
                v-if="wm.primaryApp.value"
                class="relative h-full flex flex-col overflow-hidden transition-all duration-300"
                :class="
                  wm.secondaryApp.value
                    ? 'w-full sm:w-1/2 border-r border-white/10'
                    : 'w-full flex-1'
                "
              >
                <IpadWindow
                  :app="wm.primaryApp.value"
                  slot-name="primary"
                  :is-split-view="Boolean(wm.secondaryApp.value)"
                  :is-menu-open="wm.openMultitaskingMenu.value === 'primary'"
                  :all-skills="skillList"
                  @toggle-menu="wm.toggleMultitaskingMenu('primary')"
                  @close="wm.closeApp('primary')"
                  @open-skill="(name) => wm.openApp({ name }, 'primary')"
                  @change-phase="(p) => (wallpaperPhase = p)"
                  @lock="lock"
                  @camera-active="(act) => (isCameraActive = act)"
                />
              </div>

              <!-- Secondary Application (Split Right) -->
              <div
                v-if="wm.secondaryApp.value"
                class="relative h-full flex flex-col overflow-hidden transition-all duration-300 w-full sm:w-1/2"
              >
                <IpadWindow
                  :app="wm.secondaryApp.value"
                  slot-name="secondary"
                  :is-split-view="true"
                  :is-menu-open="wm.openMultitaskingMenu.value === 'secondary'"
                  :all-skills="skillList"
                  @toggle-menu="wm.toggleMultitaskingMenu('secondary')"
                  @close="wm.closeApp('secondary')"
                  @open-skill="(name) => wm.openApp({ name }, 'secondary')"
                  @change-phase="(p) => (wallpaperPhase = p)"
                  @lock="lock"
                  @camera-active="(act) => (isCameraActive = act)"
                />
              </div>
            </div>

            <!-- 3C. Floating Dock: Hidden when app is open, slides in on Home Screen -->
            <Transition name="dock-slide">
              <IpadDock
                v-if="!wm.activeApp.value"
                :dock-apps="wm.dockApps.value"
                :recent-apps="wm.recentApps.value"
                :active-app-names="activeAppNames"
                @open-app="(app) => wm.openApp(app)"
              />
            </Transition>

            <!-- 3D. Bottom Home Bar -->
            <IpadHomeBar @click-home="wm.closeApp('all')" />
          </div>
        </div>
      </div>
    </div>

    <!-- 4. Realistic Desk Perspective Shadow Under iPad -->
    <div
      class="w-[85%] max-w-4xl h-5 bg-black/60 blur-xl rounded-full -mt-2 pointer-events-none"
    ></div>
  </div>
</template>

<style scoped>
.lock-fade-enter-active,
.lock-fade-leave-active {
  transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1);
}

.lock-fade-enter-from {
  opacity: 0;
  transform: scale(0.96);
}

.lock-fade-leave-to {
  opacity: 0;
  transform: translateY(-40px) scale(1.04);
}

.animate-fade-in {
  animation: fadeIn 0.4s ease-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: scale(0.98);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

/* Floating Dock slide transition */
.dock-slide-enter-active,
.dock-slide-leave-active {
  transition: all 0.35s cubic-bezier(0.16, 1, 0.3, 1);
}

.dock-slide-enter-from,
.dock-slide-leave-to {
  opacity: 0;
  transform: translateY(65px) scale(0.96);
}
</style>
