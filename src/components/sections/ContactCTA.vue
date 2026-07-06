<script setup lang="ts">
import ArrowIcon from "../ui/ArrowIcon.vue";

defineProps<{ available: string; phone: string; email: string; location: string }>();
</script>

<template>
  <div class="flex flex-col items-center px-4 py-14 text-center sm:py-20">
    <span class="pill" v-reveal>
      <span class="relative flex h-2 w-2">
        <span
          class="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-70"
        ></span>
        <span class="relative inline-flex h-2 w-2 rounded-full bg-emerald-500"></span>
      </span>
      {{ available }}
    </span>

    <h2
      class="display mt-6 text-[clamp(2rem,7vw,4.2rem)] text-ink"
      v-reveal="60"
    >
      Have a project in mind?
    </h2>

    <p class="mt-4 max-w-xl text-ink/55" v-reveal="120">
      Together, we can create something clear and impactful. Let's collaborate to
      bring your ideas to life with clean architecture and reliable systems.
    </p>

    <div class="mt-6 flex flex-wrap justify-center gap-3" v-reveal="180">
      <a class="btn btn-light mt-8" :href="`tel:${phone}`" v-reveal="180">
        {{ phone }}
        <ArrowIcon :size="16" />
      </a>
  
      <a class="btn btn-dark mt-8" :href="`mailto:${email}`" v-reveal="180">
        Contact Me
        <ArrowIcon :size="16" />
      </a>
    </div>

    <p class="mt-6 text-xs uppercase tracking-widest text-ink/35" v-reveal="220">
      {{ email }} · {{ location }}
    </p>
  </div>
</template>
