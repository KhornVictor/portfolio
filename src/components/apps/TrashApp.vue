<script setup lang="ts">
import type { WindowState } from "../../pages/desktop/types";
import AppIcon from "../desktop/AppIcon.vue";

defineProps<{ win: WindowState }>();
</script>

<template>
  <div class="flex h-full">
    <aside class="hidden w-40 shrink-0 border-r border-(--line) bg-(--sidebar-bg) p-3 text-[13px] sm:block">
      <p class="mb-1 px-2 text-[11px] font-semibold text-(--muted)">Locations</p>
      <div class="flex items-center gap-2 rounded-md bg-(--hover) px-2 py-1"><AppIcon name="trash" :size="18" />Trash</div>
    </aside>
    <div class="flex min-w-0 flex-1 flex-col">
      <div class="flex h-11 shrink-0 items-center justify-between border-b border-(--line) px-4 text-[13px] font-semibold">
        Trash
        <button class="rounded-md border border-(--line) px-2.5 py-1 text-[12px] font-normal text-(--muted)" disabled>Empty</button>
      </div>
      <div class="grid flex-1 place-items-center bg-(--content-bg) text-center">
        <div>
          <AppIcon name="trash" :size="72" class="mx-auto opacity-60" />
          <p class="mt-3 text-[15px] font-semibold">Trash is empty</p>
          <p class="mt-1 text-[12px] text-(--muted)">No bugs left behind. 🧹</p>
        </div>
      </div>
      <div class="flex h-7 shrink-0 items-center border-t border-(--line) px-3 text-[11px] text-(--muted)">0 items, 0 bytes</div>
    </div>
  </div>
</template>
