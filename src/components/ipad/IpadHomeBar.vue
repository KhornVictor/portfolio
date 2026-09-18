<script setup lang="ts">
const emit = defineEmits<{
  (e: "clickHome"): void;
}>();
</script>

<template>
  <div
    class="h-4 sm:h-5 w-full flex items-center justify-center cursor-pointer group pb-1 z-40"
    title="Click Home Bar to return to Home Screen"
    @click="emit('clickHome')"
  >
    <div
      class="w-32 sm:w-40 h-1 sm:h-1.5 rounded-full bg-white/60 group-hover:bg-white group-hover:w-44 transition-all shadow-md"
    ></div>
  </div>
</template>
