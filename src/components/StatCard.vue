<script setup lang="ts">
defineProps<{
  value: string;
  label: string;
}>();
</script>

<template>
  <article
    class="grid gap-1.5 rounded-[18px] border border-white/15 bg-white/5 px-5 py-4.5 shadow-[0_24px_80px_rgba(0,0,0,0.55),inset_0_1px_0_rgba(255,255,255,0.04)] backdrop-blur-[18px]"
  >
    <strong class="text-[clamp(1.8rem,4vw,2.5rem)] leading-none">{{
      value
    }}</strong>
    <span class="text-[0.94rem] text-white/55">{{ label }}</span>
  </article>
</template>
