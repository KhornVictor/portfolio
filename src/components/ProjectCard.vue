<script setup lang="ts">
defineProps<{
  name: string;
  type: string;
  summary: string;
}>();
</script>

<template>
  <article
    class="relative grid min-h-65 content-start gap-3.5 overflow-hidden rounded-3xl border border-white/15 bg-white/5 p-5.5 shadow-[0_24px_80px_rgba(0,0,0,0.55),inset_0_1px_0_rgba(255,255,255,0.04)] backdrop-blur-[18px]"
  >
    <div
      aria-hidden="true"
      class="pointer-events-none absolute bottom-[-40%] right-[-20%] h-55 w-55 rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.12),transparent_70%)]"
    ></div>
    <p class="text-[0.86rem] uppercase tracking-[0.14em] text-white/55">
      {{ type }}
    </p>
    <h3 class="text-[1.18rem] leading-[1.12]">{{ name }}</h3>
    <p class="text-white/70">{{ summary }}</p>
    <a
      href="#contact"
      class="mt-auto inline-flex min-h-11.5 w-fit items-center justify-center rounded-[999px] border border-white/20 bg-white/10 px-4.5 font-semibold text-white transition hover:-translate-y-px focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/85"
      >Discuss project</a
    >
  </article>
</template>
