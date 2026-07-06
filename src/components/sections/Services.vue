<script setup lang="ts">
import { ref } from "vue";
import SectionHeading from "../ui/SectionHeading.vue";
import ArrowIcon from "../ui/ArrowIcon.vue";

defineProps<{
  services: { title: string; description: string; tags: string[] }[];
}>();

const openIndex = ref(0);
function toggle(i: number) {
  openIndex.value = openIndex.value === i ? -1 : i;
}
</script>

<template>
  <SectionHeading watermark="Service" title="Service" />

  <div class="mt-6">
    <div
      v-for="(service, i) in services"
      :key="service.title"
      class="border-t border-black/10 last:border-b"
      v-reveal="i * 60"
    >
      <div
        class="my-2 overflow-hidden rounded-2xl transition-colors duration-300"
        :class="openIndex === i ? 'bg-ink text-white' : 'bg-transparent'"
      >
        <button
          type="button"
          class="flex w-full items-center justify-between gap-4 px-4 py-6 text-left sm:px-6"
          :aria-expanded="openIndex === i"
          @click="toggle(i)"
        >
          <span
            class="display text-[clamp(1.4rem,4.5vw,2.1rem)]"
            :class="openIndex === i ? 'text-white' : 'text-ink'"
          >
            {{ service.title }}
          </span>
          <span
            class="grid h-9 w-9 flex-none place-items-center rounded-full transition-transform duration-300"
            :class="
              openIndex === i
                ? 'rotate-90 bg-white/10 text-white'
                : 'text-ink/70'
            "
          >
            <ArrowIcon :size="18" />
          </span>
        </button>

        <div class="acc-body" :class="{ open: openIndex === i }">
          <div class="acc-inner">
            <div class="px-4 pb-7 sm:px-6">
              <p class="max-w-2xl text-sm leading-relaxed text-white/70">
                {{ service.description }}
              </p>
              <div class="mt-4 flex flex-wrap gap-2">
                <span
                  v-for="tag in service.tags"
                  :key="tag"
                  class="rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs text-white/80"
                  >{{ tag }}</span
                >
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
