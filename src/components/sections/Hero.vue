<script setup lang="ts">
import { computed } from "vue";
import ArrowIcon from "../ui/ArrowIcon.vue";
import SocialIcon from "../ui/SocialIcon.vue";

const props = defineProps<{
  name: string;
  role: string;
  description: string;
  email: string;
  profiles: { network: string; url: string }[];
  collaborateHref: string;
}>();

const avatar = `${import.meta.env.BASE_URL}images/avatar.png`;

const nameParts = computed(() => {
  const bits = props.name.trim().split(/\s+/);
  return { first: bits[0] ?? "", rest: bits.slice(1).join(" ") };
});

const socials = computed(() => [
  ...props.profiles.map((p) => ({ label: p.network, url: p.url })),
  { label: "Email", url: `mailto:${props.email}` },
]);
</script>

<template>
  <div class="relative px-4 pb-0 pt-6 sm:px-8">
    <!-- Giant name -->
    <h1
      class="display relative z-20 flex flex-col text-center text-[clamp(2.4rem,9vw,7.4rem)] leading-[0.9] sm:block"
      v-reveal
    >
      <span class="text-outline">{{ nameParts.first }}</span>
      <span v-if="nameParts.rest" class="text-ink"> {{ nameParts.rest }}</span>
    </h1>

    <!-- Portrait -->
    <div class="relative z-10 mt-[-3vw] flex justify-center">
      <div class="relative w-[min(78%,420px)]">
        <img
          :src="avatar"
          :alt="name"
          class="relative z-10 w-full select-none object-contain grayscale filter-[grayscale(1)_contrast(1.02)] drop-shadow-[0_30px_50px_rgba(0,0,0,0.18)]"
          draggable="false"
          v-reveal="120"
        />
        <!-- soft fade so the photo melts into the panel -->
        <div
          class="pointer-events-none absolute inset-x-0 bottom-0 z-20 h-24 bg-linear-to-t from-[#fbfbfc] to-transparent"
        ></div>
      </div>
    </div>

    <!-- Overlay: role/description (left) + socials (right) -->
    <div
      class="relative z-30 mt-2 flex flex-col items-stretch justify-between gap-8 pb-10 md:absolute md:inset-x-8 md:bottom-10 md:mt-0 md:flex-row md:items-end"
    >
      <div class="max-w-full md:max-w-sm" v-reveal="180">
        <h2 class="display text-xl tracking-tight sm:text-[1.7rem]">
          {{ role }}
        </h2>
        <p class="mt-2 text-sm leading-relaxed text-ink/60">
          {{ description }}
        </p>
        <a class="btn btn-dark mt-5" :href="collaborateHref">
          Let's collaborate
          <ArrowIcon :size="16" />
        </a>
      </div>

      <div
        class="flex flex-wrap gap-2.5 md:flex-col md:items-end"
        aria-label="Social links"
        v-reveal="240"
      >
        <a
          v-for="s in socials"
          :key="s.label"
          class="pill transition hover:-translate-y-0.5 hover:shadow-md"
          :href="s.url"
          :target="s.url.startsWith('mailto:') ? undefined : '_blank'"
          rel="noreferrer"
        >
          <SocialIcon :name="s.label" :size="16" />
          <span>{{ s.label }}</span>
        </a>
      </div>
    </div>
  </div>
</template>
