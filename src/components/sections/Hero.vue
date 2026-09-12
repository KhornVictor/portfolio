<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref } from "vue";
import ArrowIcon from "../ui/ArrowIcon.vue";
import SocialIcon from "../ui/SocialIcon.vue";
import BinaryGrid from "../ui/BinaryGrid.vue";

const props = defineProps<{
  name: string;
  role: string;
  description: string;
  email: string;
  profiles: { network: string; url: string }[];
  collaborateHref: string;
}>();

// Avatars cycled with a TikTok-style glitch transition.
const base = import.meta.env.BASE_URL;
const avatars = [
  `${base}images/avatar1.png`,
  `${base}images/avatar2.png`,
  `${base}images/avatar3.png`,
  `${base}images/avatar4.png`,
  `${base}images/avatar5.png`,
  `${base}images/avatar7.png`,
  `${base}images/avatar8.png`,
];
const index = ref(0);
const glitch = ref(false);
const frame = ref<HTMLElement | null>(null);
const avatar = computed(() => avatars[index.value]);
const timeDuration = computed(() => (avatars.length < 2 ? 0 : 5000 + Math.random() * 1000));

let timer: ReturnType<typeof setInterval> | undefined;

async function nextAvatar() {
  if (avatars.length < 2) return;
  index.value = (index.value + 1) % avatars.length;
  // Restart the glitch animation on every swap
  glitch.value = false;
  await nextTick();
  void frame.value?.offsetWidth; // force reflow so the animation replays
  glitch.value = true;
}

onMounted(() => {
  // Only cycle when there's more than one image
  if (avatars.length < 2) return;
  timer = setInterval(nextAvatar, timeDuration.value);
});

onBeforeUnmount(() => {
  if (timer) clearInterval(timer);
});

const nameParts = computed(() => {
  const bits = props.name.trim().split(/\s+/);
  return { first: bits[0] ?? "", rest: bits.slice(1).join(" ") };
});

// Split into individual characters for the staggered pop-in animation.
const firstLetters = computed(() => [...nameParts.value.first]);
const restLetters = computed(() =>
  nameParts.value.rest ? [...(" " + nameParts.value.rest)] : [],
);

const socials = computed(() => [
  ...props.profiles.map((p) => ({ label: p.network, url: p.url })),
  { label: "Email", url: `mailto:${props.email}` },
]);
</script>

<template>
  <div
    class="relative flex w-full flex-1 flex-col px-4 py-4 sm:px-7 sm:py-6"
  >
    <!-- Binary grid background -->
    <BinaryGrid class="pointer-events-none absolute inset-0 z-0" />

    <!-- Giant name -->
    <h1
      class="display relative z-20 giant-name flex flex-col text-center text-[clamp(2.4rem,9vw,7.4rem)] leading-[0.9] sm:block"
      :aria-label="name"
    >
      <span class="text-outline" aria-hidden="true">
        <span
          v-for="(ch, i) in firstLetters"
          :key="'f' + i"
          class="letter hover:scale-120 transition-transform duration-300 ease-in-out hover:infinite hover:text-ink/10"
          :style="{ animationDelay: i * 45 + 'ms' }"
          >{{ ch === " " ? " " : ch }}</span
        >
      </span>
      <span v-if="restLetters.length" class="text-ink" aria-hidden="true">
        <span
          v-for="(ch, i) in restLetters"
          :key="'r' + i"
          class="letter hover:scale-120 transition-transform duration-300 ease-in-out hover:infinite hover:text-ink/80"
          :style="{ animationDelay: (firstLetters.length + i) * 45 + 'ms' }"
          >{{ ch === " " ? " " : ch }}</span
        >
      </span>
    </h1>

    <!-- Portrait -->
    <div
      class="relative 2xl:z-40 mt-[-3vw] flex flex-1 md:scale-150 avatar pointer-events-none pb-10 w-full items-center justify-center"
    >
      <div ref="frame" class="relative 2xl:w-130 xl:w-125 lg:w-117.5 w-105">
        <img
          :src="avatar"
          :alt="name"
          class="avatar-img relative w-full h-full select-none object-contain drop-shadow-[0_30px_50px_rgba(0,0,0,0.18)]"
          :class="{ 'is-glitching': glitch }"
          draggable="false"
          v-reveal="120"
        />
        <!-- soft fade so the photo melts into the panel -->
        <div
          class="pointer-events-none absolute inset-x-0 bottom-0 w-full z-20 h-24 bg-linear-to-t from-[#fbfbfc] to-transparent"
        ></div>
      </div>
    </div>

    <!-- Overlay: role/description (left) + socials (right) -->
    <div
      class="relative z-30 mt-2 flex flex-col items-stretch justify-between gap-6 sm:gap-8 md:absolute md:inset-x-8 md:bottom-1 md:mt-0 md:flex-row md:items-end lg:inset-x-12 lg:bottom-12"
    >
      <!-- Between sm and xl only the button shows; hovering/focusing the card expands the full content. -->
      <div
        class="group max-w-full md:max-w-sm lg:max-w-md rounded-2xl transition-[background-color,padding,box-shadow] hover:bg-[#fbfbfc] xl:bg-[#fbfbfc] hover:p-5 duration-300 border-0 xl:p-10 hover:shadow-2xl xl:shadow-[0px_0px_100px_rgba(0,0,0,0.1)] sm:max-xl:group-hover:bg-[#fbfbfc] sm:max-xl:group-hover:p-10 sm:max-xl:group-hover:shadow-[0px_0px_100px_rgba(0,0,0,0.1)] sm:max-xl:group-focus-within:bg-[#fbfbfc] sm:max-xl:group-focus-within:p-10 sm:max-xl:group-focus-within:shadow-[0px_0px_100px_rgba(0,0,0,0.1)]"
      >
        <div
          class="grid grid-rows-[1fr] transition-[grid-template-rows,opacity] duration-300 ease-out sm:max-xl:grid-rows-[0fr] sm:max-xl:opacity-0 sm:max-xl:group-hover:grid-rows-[1fr] sm:max-xl:group-hover:opacity-100 sm:max-xl:group-focus-within:grid-rows-[1fr] sm:max-xl:group-focus-within:opacity-100"
        >
          <div class="min-h-0 overflow-hidden">
            <h2
              class="display text-xl tracking-tight sm:text-[1.7rem] lg:text-[2rem]"
            >
              {{ role }}
            </h2>
            <p
              class="mt-2 text-sm leading-relaxed text-ink/60 sm:text-base"
            >
              {{ description }}
            </p>
          </div>
        </div>
        <a
          class="btn btn-dark mt-5 sm:max-xl:mt-0 sm:max-xl:group-hover:mt-5 sm:max-xl:group-focus-within:mt-5 transition-[margin] duration-500"
          :href="collaborateHref"
        >
          Let's collaborate
          <ArrowIcon :size="16" />
        </a>
      </div>

      <div
        class="md:flex flex-wrap gap-2.5 md:flex-col md:items-end hidden"
        aria-label="Social links"
        v-reveal="240"
      >
        <a
          v-for="s in socials"
          :key="s.label"
          class="pill social-icon duration-300 transition hover:-translate-y-0.5 hover:shadow-md"
          :href="s.url"
          :target="s.url.startsWith('mailto:') ? undefined : '_blank'"
          rel="noreferrer"
        >
          <SocialIcon :name="s.label" :size="16" />
          <span class="description duration-300">{{ s.label }}</span>
        </a>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Staggered per-letter pop-in for the giant name */
.letter {
  display: inline-block;
  white-space: pre;
  animation: letter-pop 0.5s cubic-bezier(0.22, 1, 0.36, 1.4) both;
}

@keyframes letter-pop {
  0% {
    transform: scale(0.3) translateY(0.35em);
    opacity: 0;
  }
  60% {
    opacity: 1;
  }
  100% {
    transform: scale(1) translateY(0);
    opacity: 1;
  }
}

@media (prefers-reduced-motion: reduce) {
  .letter {
    animation: none;
  }
}

.description {
  display: none;
  animation: pop-in 0.3s ease-in-out;
  transition: all 0.3s ease-in-out;
}

.social-icon:hover .description {
  display: inline;
}

/* Slide + shrink the portrait on name hover to reveal the full name */
.avatar {
  transition: transform 0.4s ease-in-out;
  transform: translateY(10%);
}

.giant-name:hover ~ .avatar {
  transform: translateY(10%);
}

@media (prefers-reduced-motion: reduce) {
  .giant-name:hover ~ .avatar {
    transform: none;
  }
}

@keyframes pop-in {
  0% {
    transform: scale(0.8);
    opacity: 0;
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}

/* TikTok-style glitch transition between avatars */
.avatar-img.is-glitching {
  animation: tiktok-glitch 0.55s steps(2, end) 1;
}

@keyframes tiktok-glitch {
  0% {
    filter: drop-shadow(-6px 0 #000000) drop-shadow(6px 0 #ffffff);
    transform: translate3d(-6px, 0, 0) skewX(-4deg);
    clip-path: inset(0 0 62% 0);
    opacity: 0.9;
  }
  20% {
    filter: drop-shadow(9px 0 #000000) drop-shadow(-9px 0 #ffffff);
    transform: translate3d(8px, 0, 0) skewX(5deg);
    clip-path: inset(45% 0 18% 0);
  }
  40% {
    filter: drop-shadow(-11px 0 #000000) drop-shadow(11px 0 #ffffff);
    transform: translate3d(-5px, 0, 0) skewX(-3deg);
    clip-path: inset(70% 0 8% 0);
    opacity: 1;
  }
  60% {
    filter: drop-shadow(6px 0 #000000) drop-shadow(-6px 0 #ffffff);
    transform: translate3d(4px, 0, 0) skewX(2deg);
    clip-path: inset(15% 0 55% 0);
  }
  80% {
    filter: drop-shadow(-3px 0 #000000) drop-shadow(3px 0 #ffffff);
    transform: translate3d(-2px, 0, 0);
    clip-path: inset(0 0 0 0);
  }
  100% {
    filter: drop-shadow(0 30px 50px rgba(0, 0, 0, 0.18));
    transform: translate3d(0, 0, 0);
    clip-path: inset(0 0 0 0);
    opacity: 1;
  }
}

@media (prefers-reduced-motion: reduce) {
  .avatar-img.is-glitching {
    animation: none;
  }
}
</style>
