<script setup lang="ts">
import ArrowIcon from "../ui/ArrowIcon.vue";

defineProps<{
  navigation: { label: string; href: string; count?: string }[];
  available: string;
  talkHref: string;
}>();
</script>

<template>
  <header
    class="flex items-center z-50 justify-between gap-4 px-4 pt-4 sm:px-7 sm:pt-6"
  >
    <!-- Availability badge -->
    <span class="pill">
      <span class="relative flex h-2 w-2">
        <span
          class="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-70"
        ></span>
        <span class="relative inline-flex h-2 w-2 rounded-full bg-emerald-500"></span>
      </span>
      <span class="hidden sm:inline">{{ available }}</span>
      <span class="sm:hidden">Available</span>
    </span>

    <!-- Center navigation -->
    <nav
      class="absolute left-1/2 hidden z-100 -translate-x-1/2 items-center gap-7 lg:flex"
      aria-label="Primary"
    >
      <a
        v-for="item in navigation"
        :key="item.href"
        :href="item.href"
        class="group text-[0.95rem] font-medium text-ink/80 transition hover:text-ink"
      >
        {{ item.label }}
        <sup
          v-if="item.count"
          class="ml-0.5 text-[0.62rem] font-semibold text-ink/35"
          >[{{ item.count }}]</sup
        >
      </a>
    </nav>

    <!-- CTA -->
    <a class="btn btn-dark py-2.5! px-4! text-sm" target="_blank" :href="talkHref">
      Let's Talk
      <ArrowIcon :size="15" />
    </a>
  </header>
</template>
