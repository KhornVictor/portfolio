<script setup lang="ts">
import { ref } from "vue";
import type { WindowState } from "../../pages/desktop/types";
import { imageUrl } from "../../config/assets";

defineProps<{ win: WindowState }>();

const photos = [1, 2, 3, 4, 5, 6, 7, 8].map((n) => ({
  src: imageUrl(`Profile/avatar${n}.png`),
  title: `Portrait ${n}`,
}));
const open = ref<number | null>(null);
</script>

<template>
  <div class="flex h-full">
    <aside class="hidden w-40 shrink-0 border-r border-(--line) bg-(--sidebar-bg) p-3 text-[13px] sm:block">
      <div class="rounded-md bg-(--hover) px-2 py-1">Library</div>
      <div class="px-2 py-1 text-(--muted)">Favorites</div>
      <div class="px-2 py-1 text-(--muted)">Recents</div>
      <p class="mt-3 mb-1 px-2 text-[11px] font-semibold text-(--muted)">Albums</p>
      <div class="px-2 py-1 text-(--muted)">Portraits</div>
    </aside>
    <div class="relative min-w-0 flex-1 overflow-y-auto p-4">
      <p class="mb-3 text-[13px] font-semibold">Library <span class="font-normal text-(--muted)">· {{ photos.length }} photos</span></p>
      <div class="grid grid-cols-3 gap-1.5 sm:grid-cols-4">
        <button v-for="(p, i) in photos" :key="p.src" class="aspect-square overflow-hidden rounded-md bg-(--hover)" @click="open = i">
          <img :src="p.src" :alt="p.title" class="h-full w-full object-cover transition hover:scale-105" loading="lazy" />
        </button>
      </div>

      <div v-if="open !== null" class="absolute inset-0 grid place-items-center bg-black/85 p-6" @click="open = null">
        <img :src="photos[open]!.src" :alt="photos[open]!.title" class="max-h-full max-w-full rounded-lg object-contain" />
        <button class="absolute top-3 right-3 rounded-full bg-white/15 px-2.5 py-1 text-[12px] text-white" @click.stop="open = null">Done</button>
      </div>
    </div>
  </div>
</template>
