<script setup lang="ts">
defineProps<{
  navigation: Array<{ label: string; href: string }>;
}>();
</script>

<template>
  <header
    class="sticky top-4 z-20 flex flex-wrap items-center justify-between gap-4 rounded-[999px] border border-white/15 bg-[rgba(10,10,12,0.72)] px-3 py-2 shadow-[0_24px_80px_rgba(0,0,0,0.55),inset_0_1px_0_rgba(255,255,255,0.04)] backdrop-blur-[18px]"
  >
    <a
      class="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-white/5 text-[0.82rem] font-bold tracking-[0.12em]"
      href="#home"
      aria-label="Home"
      >VK</a
    >

    <nav
      class="inline-flex flex-wrap items-center justify-center gap-2 rounded-[999px] border border-white/15 bg-white/3 p-1.75 max-[720px]:order-3 max-[720px]:w-full max-[720px]:justify-between"
      aria-label="Primary"
    >
      <a
        v-for="item in navigation"
        :key="item.label"
        :href="item.href"
        class="rounded-[999px] px-3.5 py-2 text-[0.95rem] text-white/70 transition hover:-translate-y-px hover:bg-white/10 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/85"
        >{{ item.label }}</a
      >
    </nav>

    <a
      class="rounded-[999px] border border-white/20 bg-white/10 px-3.5 py-2 text-[0.95rem] text-white transition hover:-translate-y-px focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/85"
      href="#contact"
      >Let&apos;s Talk</a
    >
  </header>
</template>
