<script setup lang="ts">
defineProps<{
  eyebrow: string;
  title: string;
  description: string;
}>();
</script>

<template>
  <div class="mx-auto grid max-w-190 gap-2.5 text-center">
    <p class="text-[0.92rem] uppercase tracking-[0.18em] text-white/55">
      {{ eyebrow }}
    </p>
    <h2
      class="text-[clamp(1.9rem,4vw,3.25rem)] leading-[1.04] tracking-[-0.04em]"
    >
      {{ title }}
    </h2>
    <p class="text-white/70">{{ description }}</p>
  </div>
</template>
