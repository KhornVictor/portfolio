<script setup lang="ts">
defineProps<{
  currentTime: string;
  currentDate: string;
  hasActiveApp: boolean;
  currentPage: number;
  totalPages: number;
  isJiggleMode: boolean;
}>();

const emit = defineEmits<{
  (e: "toggleJiggle"): void;
  (e: "finishJiggle"): void;
  (e: "lock"): void;
}>();
</script>

<template>
  <div
    class="relative z-40 h-7 sm:h-8 px-5 sm:px-6 flex items-center justify-between text-[11px] font-semibold tracking-wide text-white/90 drop-shadow-sm select-none"
  >
    <!-- Left: Time & Date -->
    <div class="flex items-center gap-2">
      <span class="font-bold tracking-tight">{{ currentTime }}</span>
      <span class="text-white/60 font-medium text-[10px] hidden sm:inline">
        {{ currentDate }}
      </span>
    </div>

    <!-- Center: Page / Section Indicator -->
    

    <!-- Right: Wi-Fi, 5G, Lock & Battery -->
    <div class="flex items-center gap-2 sm:gap-2.5">
      <!-- Reorder / Jiggle toggle button -->
      
      <span class="text-[10px] font-mono tracking-tighter">5G</span>

      <svg viewBox="0 0 24 24" class="w-3.5 h-3.5" fill="currentColor">
        <path
          d="M12 18a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm-4.9-3.9a7 7 0 0 1 9.8 0l1.4-1.4a9 9 0 0 0-12.6 0l1.4 1.4zm-3.5-3.5a12 12 0 0 1 16.8 0l1.4-1.4a14 14 0 0 0-19.6 0l1.4 1.4z"
        />
      </svg>

      <div class="flex items-center gap-1">
        <span class="text-[10px] font-mono">100%</span>
        <div
          class="w-5 h-2.5 rounded-sm border border-white/80 p-0.5 flex items-center"
        >
          <div class="w-full h-full bg-emerald-400 rounded-2xs"></div>
        </div>
      </div>
    </div>
  </div>
</template>
