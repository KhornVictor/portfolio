<script setup lang="ts">
defineProps<{
  watermark: string;
  title: string;
  dark?: boolean;
}>();
</script>

<template>
  <div class="relative">
    <!-- Faded oversized watermark -->
    <span
      class="watermark absolute -top-4 left-0 -z-0 text-[clamp(3.5rem,11vw,9rem)]"
      :class="dark ? 'watermark-light' : ''"
      aria-hidden="true"
      >{{ watermark }}</span
    >

    <div
      class="relative z-10 flex flex-wrap items-end justify-between gap-4 pt-6"
    >
      <h2
        class="display text-[clamp(1.7rem,4.2vw,2.6rem)]"
        :class="dark ? 'text-white' : 'text-ink'"
        v-reveal
      >
        <span :class="dark ? 'text-white/40' : 'text-ink/35'">/</span>{{ title }}
      </h2>
      <div v-reveal="80"><slot name="aside" /></div>
    </div>
  </div>
</template>
