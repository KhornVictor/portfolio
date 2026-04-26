<script setup lang="ts">
defineProps<{
  title: string;
  description: string;
  tags: string[];
}>();
</script>

<template>
  <article
    class="grid min-h-65 content-start gap-3.5 rounded-3xl border border-white/15 bg-white/5 p-5.5 shadow-[0_24px_80px_rgba(0,0,0,0.55),inset_0_1px_0_rgba(255,255,255,0.04)] backdrop-blur-[18px]"
  >
    <h3 class="text-[1.18rem] leading-[1.12]">{{ title }}</h3>
    <p class="text-white/70">{{ description }}</p>

    <div class="mt-auto flex flex-wrap gap-2.5 pt-2">
      <span
        v-for="tag in tags"
        :key="tag"
        class="inline-flex min-h-8.5 items-center rounded-[999px] border border-white/15 bg-white/3 px-3 text-[0.88rem] text-white/55"
        >{{ tag }}</span
      >
    </div>
  </article>
</template>
