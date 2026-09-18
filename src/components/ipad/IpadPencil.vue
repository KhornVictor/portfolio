<script setup lang="ts">
import { onUnmounted, ref } from "vue";

const showToast = ref(false);
let toastTimer = 0;

function triggerPencilToast() {
  showToast.value = true;
  clearTimeout(toastTimer);
  toastTimer = window.setTimeout(() => {
    showToast.value = false;
  }, 3000);
}

onUnmounted(() => {
  clearTimeout(toastTimer);
});
</script>

<template>
  <!-- Apple Pencil Pro Magnet Bar -->
  <div
    class="relative z-30 group cursor-pointer -mb-1 flex flex-col items-center transition-transform hover:-translate-y-0.5"
    @click="triggerPencilToast"
  >
    <div
      class="w-48 sm:w-64 h-3.5 bg-linear-to-b from-[#f3f4f6] via-[#e5e7eb] to-[#d1d5db] rounded-full shadow-md border border-slate-300/80 flex items-center justify-between px-2.5"
    >
      <span
        class="text-[8px] font-mono text-slate-400 font-semibold tracking-wider"
      >
         Pencil Pro
      </span>
      <div
        class="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_6px_rgba(16,185,129,0.8)]"
      ></div>
    </div>
    <div class="w-40 h-1 bg-black/40 blur-xs rounded-full -mt-0.5"></div>
  </div>

  <!-- Apple Pencil Toast Notification -->
  <Transition name="toast">
    <div
      v-if="showToast"
      class="absolute top-8 z-50 bg-black/80 backdrop-blur-2xl border border-white/20 rounded-full px-4 py-1.5 shadow-2xl flex items-center gap-2.5 text-xs text-white"
    >
      <div
        class="w-4 h-4 rounded-full bg-slate-800 flex items-center justify-center"
      >
        <svg
          viewBox="0 0 24 24"
          class="w-3 h-3 text-white"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
        >
          <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z" />
        </svg>
      </div>
      <span class="font-semibold text-[11px] tracking-wide">
        Apple Pencil Pro
      </span>
      <span class="text-emerald-400 font-mono font-bold text-[11px]">100%</span>
    </div>
  </Transition>
</template>

<style scoped>
.toast-enter-active,
.toast-leave-active {
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.toast-enter-from,
.toast-leave-to {
  opacity: 0;
  transform: translateY(-10px) scale(0.95);
}
</style>
