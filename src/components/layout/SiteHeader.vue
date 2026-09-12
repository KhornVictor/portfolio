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
    class="flex items-center z-50 justify-between gap-4 px-4 py-4 sm:px-7 sm:py-6"
  >
    <!-- Availability badge -->
    <span class="pill">
      <div
        class="p-1 bg-green-700 rounded-full inline-flex items-center justify-center mr-2"
      >
        <img src="/favicon.png" class="h-4 w-4" alt="" />
      </div>
      <span>
        {{ available }}
      </span>
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
    <a
      class="btn btn-dark py-2.5! px-4! text-sm"
      target="_blank"
      :href="talkHref"
    >
      Let's Talk
      <ArrowIcon :size="15" />
    </a>
  </header>
</template>
