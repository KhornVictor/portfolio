<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { notes } from "../../data/portfolio";
import type { WindowState } from "../../desktop/types";

const props = defineProps<{ win: WindowState }>();

const activeId = ref(notes.find((n) => n.id === props.win.payload)?.id ?? notes[0]!.id);
watch(
  () => props.win.payload,
  (p) => {
    if (p && notes.some((n) => n.id === p)) activeId.value = p;
  },
);
const note = computed(() => notes.find((n) => n.id === activeId.value) ?? notes[0]!);
const showList = ref(true); // mobile: toggle between list and note

const fmt = (d: string) => new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
const isUrl = (t: string) => /^(Email|GitHub|LinkedIn|Website):\s/.test(t);
const linkOf = (t: string) => {
  const v = t.split(/:\s/)[1] ?? "";
  return v.includes("@") ? `mailto:${v}` : v;
};
</script>

<template>
  <div class="flex h-full">
    <!-- Notes list -->
    <aside
      class="w-full shrink-0 flex-col border-r border-(--line) bg-(--sidebar-bg) sm:flex sm:w-60"
      :class="showList ? 'flex' : 'hidden'"
    >
      <div class="flex items-center justify-between px-4 pt-3 pb-2">
        <span class="text-[11px] font-semibold text-(--muted)">iCloud · Notes</span>
        <span class="text-[11px] text-(--muted)">{{ notes.length }}</span>
      </div>
      <div class="min-h-0 flex-1 overflow-y-auto px-2 pb-2">
        <button
          v-for="n in notes"
          :key="n.id"
          class="mb-0.5 block w-full rounded-lg px-3 py-2 text-left"
          :class="n.id === activeId ? 'bg-[#f7c948]/90 text-black' : 'hover:bg-(--hover)'"
          @click="activeId = n.id; showList = false"
        >
          <p class="truncate text-[13px] font-semibold">{{ n.title }}</p>
          <p class="truncate text-[12px] opacity-70"><span class="mr-2">{{ fmt(n.date) }}</span>{{ n.body[0] }}</p>
        </button>
      </div>
    </aside>

    <!-- Note body -->
    <article class="min-w-0 flex-1 flex-col overflow-y-auto sm:flex" :class="showList ? 'hidden' : 'flex'">
      <div class="flex items-center gap-2 px-5 pt-3 sm:hidden">
        <button class="text-[13px] text-[#f7c948]" @click="showList = true">‹ Notes</button>
      </div>
      <p class="mt-3 text-center text-[11px] text-(--muted)">{{ fmt(note.date) }}</p>
      <div class="px-6 pt-3 pb-8 sm:px-8">
        <h1 class="text-[22px] font-bold tracking-tight">{{ note.title }}</h1>
        <div class="mt-3 space-y-2 text-[14px] leading-relaxed">
          <template v-for="(line, i) in note.body" :key="i">
            <p v-if="line.startsWith('- ')" class="flex gap-2"><span class="opacity-50">•</span><span>{{ line.slice(2) }}</span></p>
            <p v-else-if="isUrl(line)">
              <span class="opacity-60">{{ line.split(/:\s/)[0] }}: </span>
              <a :href="linkOf(line)" target="_blank" rel="noreferrer" class="text-[#f7c948] underline decoration-[#f7c948]/40 underline-offset-2">{{ line.split(/:\s/)[1] }}</a>
            </p>
            <p v-else>{{ line }}</p>
          </template>
        </div>
      </div>
    </article>
  </div>
</template>
