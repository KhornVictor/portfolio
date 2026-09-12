<script setup lang="ts">
defineProps<{ title: string }>();
const emit = defineEmits<{ close: [] }>();
</script>

<template>
  <div
    class="relative flex h-11 shrink-0 items-center border-b border-white/6 bg-white/3 px-4 select-none"
  >
    <!-- Back to portfolio -->
    <a
      href="/"
      class="back-btn relative z-10 inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-[12px] text-white/55 transition hover:bg-white/8 hover:text-white"
      aria-label="Back to portfolio"
      title="Back to portfolio"
      @click.prevent="emit('close')"
    >
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
        <path d="M19 12H5m7-7-7 7 7 7" />
      </svg>
    </a>

    <!-- Title -->
    <div
      class="pointer-events-none absolute inset-x-0 flex items-center justify-center gap-2 text-[12px] text-white/50"
    >
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
        <path d="M4 17l6-5-6-5M12 19h8" />
      </svg>
      <span class="truncate">{{ title }}</span>
    </div>

    
  </div>
</template>

<style scoped>
.back-btn:focus-visible {
  outline: 2px solid rgba(255, 255, 255, 0.5);
  outline-offset: 2px;
}
</style>
