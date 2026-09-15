<script setup lang="ts">
import ArrowIcon from "../ui/ArrowIcon.vue";
import { useTheme } from "../../composables/useTheme";

const { isDark, toggle: toggleTheme } = useTheme();

defineProps<{
  navigation: { label: string; href: string; count?: string }[];
  available: string;
  talkHref: string;
}>();

const openVision = () => {
  window.open("https://www.youtube.com/watch?v=dQw4w9WgXcQ", "_blank");
};
</script>

<template>
  <!-- `relative` so the z-index actually applies and the header stays above
       the hero's name / portrait layers. -->
  <header
    class="relative z-50 flex items-center justify-between gap-4 px-4 py-4 sm:px-7 sm:py-6"
  >
    <!-- Availability badge -->
    <span class="">
      <div
        class="p-1 bg-green-500/70 rounded-full inline-flex items-center shadow-2xl justify-center mr-2"
      >
        <img src="/favicon.png" class="h-7 w-7" alt="" />
      </div>
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
    <div class="flex items-center gap-4">
      <button
        type="button"
        class="icon-btn theme-toggle text-xl"
        :aria-label="isDark ? 'Switch to light mode' : 'Switch to dark mode'"
        :title="isDark ? 'Light mode' : 'Dark mode'"
        :aria-pressed="isDark"
        @click="toggleTheme"
      >
        <i class="fa-solid" :class="isDark ? 'fa-sun' : 'fa-moon'"></i>
      </button>
      <button
        type="button"
        class="icon-btn hoverRotate text-xl"
        aria-label="Settings"
        title="Settings"
        @click="openVision"
      >
        <i class="fa-solid fa-gear"></i>
      </button>
      <button
        type="button"
        class="icon-btn text-xl"
        aria-label="Vision"
        title="Vision"
        @click="openVision"
      >
        <i class="fa-solid fa-eye"></i>
      </button>
      <a
        class="btn btn-dark py-2.5! px-4! text-sm"
        target="_blank"
        rel="noreferrer"
        :href="talkHref"
      >
        Let's Talk
        <ArrowIcon :size="15" />
      </a>
    </div>
  </header>
</template>

<style scoped>
.icon-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 2.25rem;
  height: 2.25rem;
  border-radius: 999px;
  color: var(--color-ink);
  cursor: pointer;
  transition:
    background 0.2s ease,
    transform 0.2s ease;
}

.hoverRotate{
  transition: transform 0.2s ease;
}

.hoverRotate:hover {
  transition: transform 0.2s ease;
  transform: rotate(20deg);
}

.icon-btn:hover {
  background: color-mix(in srgb, var(--color-ink) 6%, transparent);
  transform: translateY(-1px);
}

.icon-btn:focus-visible {
  outline: 2px solid var(--color-ink);
  outline-offset: 2px;
}

/* Little spin when the theme icon swaps */
.theme-toggle i {
  animation: theme-pop 0.35s cubic-bezier(0.22, 1, 0.36, 1);
}

@keyframes theme-pop {
  from {
    transform: rotate(-90deg) scale(0.6);
    opacity: 0;
  }
  to {
    transform: rotate(0) scale(1);
    opacity: 1;
  }
}

@media (prefers-reduced-motion: reduce) {
  .theme-toggle i {
    animation: none;
  }
}
</style>
