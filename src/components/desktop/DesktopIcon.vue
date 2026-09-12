<script setup lang="ts">
import AppIcon from "./AppIcon.vue";

defineProps<{ icon: string; label: string; selected?: boolean }>();
const emit = defineEmits<{ open: []; select: [] }>();
</script>

<template>
  <button
    class="desktop-icon group flex w-21 flex-col items-center gap-1 rounded-lg p-1.5 text-center select-none"
    :class="{ 'desktop-icon--selected': selected }"
    @click.stop="emit('select')"
    @dblclick.stop="emit('open')"
    @keydown.enter="emit('open')"
  >
    <span class="icon-wrap grid place-items-center rounded-md p-0.5">
      <AppIcon :name="icon" :size="52" />
    </span>
    <span class="label max-w-full truncate rounded px-1.5 text-[12px] leading-[1.3] font-medium text-white [text-shadow:0_1px_2px_rgba(0,0,0,.8)]">
      {{ label }}
    </span>
  </button>
</template>

<style scoped>
.desktop-icon:focus-visible {
  outline: none;
}
.desktop-icon--selected .icon-wrap,
.desktop-icon:focus-visible .icon-wrap {
  background: rgba(255, 255, 255, 0.18);
  outline: 1px solid rgba(255, 255, 255, 0.25);
}
.desktop-icon--selected .label,
.desktop-icon:focus-visible .label {
  background: #2f7cf6;
  text-shadow: none;
}
</style>
