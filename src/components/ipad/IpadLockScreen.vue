<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from "vue";

const props = defineProps<{
  wallpaperPhase: "auto" | "dawn" | "day" | "sunset" | "night";
}>();

const emit = defineEmits<{
  (e: "unlock"): void;
  (e: "openCamera"): void;
  (e: "changePhase", phase: "auto" | "dawn" | "day" | "sunset" | "night"): void;
}>();

const currentTime = ref("");
const currentDate = ref("");
let timer = 0;

function updateTime() {
  const now = new Date();
  currentTime.value = now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: false });
  currentDate.value = now.toLocaleDateString([], { weekday: "long", month: "long", day: "numeric" });
}

onMounted(() => {
  updateTime();
  timer = window.setInterval(updateTime, 1000);
});

onUnmounted(() => {
  clearInterval(timer);
});

const isUnlocking = ref(false);
const flashlightOn = ref(false);

function triggerUnlock() {
  if (isUnlocking.value) return;
  isUnlocking.value = true;
  setTimeout(() => {
    emit("unlock");
    isUnlocking.value = false;
  }, 400);
}

function triggerCamera() {
  if (isUnlocking.value) return;
  isUnlocking.value = true;
  setTimeout(() => {
    emit("openCamera");
    isUnlocking.value = false;
  }, 300);
}

const currentPhaseLabel = computed(() => {
  if (props.wallpaperPhase === "auto") {
    const h = new Date().getHours();
    if (h >= 5 && h < 9) return "Dawn (Auto)";
    if (h >= 9 && h < 17) return "Day (Auto)";
    if (h >= 17 && h < 20) return "Sunset (Auto)";
    return "Night (Auto)";
  }
  return props.wallpaperPhase.charAt(0).toUpperCase() + props.wallpaperPhase.slice(1);
});

function cyclePhase() {
  const phases: Array<"auto" | "dawn" | "day" | "sunset" | "night"> = ["auto", "dawn", "day", "sunset", "night"];
  const nextIdx = (phases.indexOf(props.wallpaperPhase) + 1) % phases.length;
  emit("changePhase", phases[nextIdx]!);
}
</script>

<template>
  <div
    class="absolute inset-0 w-full h-full z-40 flex flex-col justify-between p-4 sm:p-6 select-none cursor-pointer overflow-hidden transition-all duration-500"
    :class="{ 'opacity-0 scale-105 pointer-events-none': isUnlocking }"
    @click="triggerUnlock"
  >
    <!-- ========================================================= -->
    <!-- 1. LOCK SCREEN TOP STATUS BAR -->
    <!-- ========================================================= -->
    <div class="w-full flex items-center justify-between text-xs text-white drop-shadow-md z-10">
      <!-- Carrier -->
      <div class="flex items-center gap-2">
        <span class="font-semibold text-[11px] tracking-tight">Victor Pro</span>
        <svg viewBox="0 0 24 24" class="w-3.5 h-3.5 fill-current opacity-90">
          <path d="M12 18a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm-4.9-3.9a7 7 0 0 1 9.8 0l1.4-1.4a9 9 0 0 0-12.6 0l1.4 1.4zm-3.5-3.5a12 12 0 0 1 16.8 0l1.4-1.4a14 14 0 0 0-19.6 0l1.4 1.4z" />
        </svg>
      </div>

      <!-- Animated Padlock / Face ID Icon -->
      

      <!-- Right: Wallpaper time cycle badge & Battery -->
      <div class="flex items-center gap-2">
        <button
          class="px-2 py-0.5 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-md text-[10px] font-mono font-semibold transition cursor-pointer flex items-center gap-1"
          title="Click to cycle dynamic wallpaper time of day (macOS style)"
          @click.stop="cyclePhase"
        >
          <i class="fas fa-sync-alt"></i>
          <span>{{ currentPhaseLabel }}</span>
        </button>

        <div class="flex items-center gap-1">
          <span class="text-[10px] font-mono font-semibold">100%</span>
          <div class="w-5 h-2.5 rounded-sm border border-white p-0.5 flex items-center">
            <div class="w-full h-full bg-emerald-400 rounded-2xs"></div>
          </div>
        </div>
      </div>
    </div>

    <!-- ========================================================= -->
    <!-- 2. BIG CLOCK & DATE (iPadOS Lock Screen Typography) -->
    <!-- ========================================================= -->
    <div class="flex-1 flex flex-col items-center justify-start pt-6 sm:pt-10 z-10 text-white text-center">
      <!-- Date & Weather line -->
      <div class="flex items-center gap-2 text-xs sm:text-sm font-semibold tracking-wide text-white/90 drop-shadow-md">
        <span>{{ currentDate }}</span>
        <span class="opacity-60">•</span>
        <span class="flex items-center gap-1">☀️ 31°C</span>
      </div>

      <!-- Giant Clock -->
      <h1
        class="text-6xl sm:text-8xl md:text-9xl font-extrabold tracking-tight drop-shadow-[0_8px_24px_rgba(0,0,0,0.6)] text-white/95 leading-none my-1 sm:my-2 font-display select-none"
      >
        {{ currentTime }}
      </h1>
    </div>

    <!-- ========================================================= -->
    <!-- 3. BOTTOM ACTIONS & SWIPE UP HOME BAR -->
    <!-- ========================================================= -->
    <div class="w-full flex flex-col items-center z-10 space-y-3">
      <!-- Flashlight & Camera shortcut circles -->
      <div class="w-full flex items-center justify-between px-2 sm:px-4">
        <!-- Flashlight button -->
        <button
          class="w-10 h-10 rounded-full backdrop-blur-xl border border-white/20 flex items-center justify-center transition-all cursor-pointer shadow-lg active:scale-90"
          :class="flashlightOn ? 'bg-white text-black shadow-[0_0_20px_rgba(255,255,255,0.8)]' : 'bg-black/40 text-white'"
          @click.stop="flashlightOn = !flashlightOn"
        >
          <svg viewBox="0 0 24 24" class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M18 6V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v2" />
            <path d="M6 6l2 4v10a2 2 0 0 0 2 2h4a2 2 0 0 0 2-2V10l2-4" />
            <line x1="12" y1="12" x2="12" y2="12" />
          </svg>
        </button>

        <!-- Center unlock prompt -->
        <div class="flex flex-col items-center animate-bounce">
          <span class="text-[11px] font-semibold tracking-wider uppercase text-white/90 drop-shadow-md">
            {{ isUnlocking ? 'Unlocking...' : 'Click or Swipe to unlock' }}
          </span>
        </div>

        <!-- Camera button -->
        <button
          class="w-10 h-10 rounded-full bg-black/40 backdrop-blur-xl border border-white/20 text-white flex items-center justify-center transition-all cursor-pointer shadow-lg active:scale-90 hover:bg-white/20 hover:scale-105"
          title="Open Camera"
          @click.stop="triggerCamera"
        >
          <svg viewBox="0 0 24 24" class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
            <circle cx="12" cy="13" r="4" />
          </svg>
        </button>
      </div>

      <!-- Translucent Home Bar Pill -->
      <div
        class="w-36 sm:w-44 h-1.5 rounded-full bg-white/80 shadow-[0_2px_8px_rgba(0,0,0,0.5)] transition-all hover:bg-white hover:w-48"
      ></div>
    </div>
  </div>
</template>
