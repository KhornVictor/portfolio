<script setup lang="ts">
import { computed, ref } from "vue";
import type { Skill } from "../../service/portfolio.service";
import { defaultSkills } from "../../data/portfolio";
import SectionHeading from "../ui/SectionHeading.vue";
import Meascii from "../ui/Meascii.vue";

const props = defineProps<{
  skills?: Skill[];
}>();

const allSkills = computed<Skill[]>(() => {
  if (props.skills && Array.isArray(props.skills) && props.skills.length > 0) {
    return props.skills;
  }
  return defaultSkills;
});

const activeTag = ref<string>("All");
const failedIcons = ref<Record<string, boolean>>({});

const availableTags = computed(() => {
  const tagsSet = new Set<string>();
  for (const s of allSkills.value) {
    if (s.tag && Array.isArray(s.tag)) {
      for (const t of s.tag) {
        if (t) tagsSet.add(t);
      }
    }
  }
  return ["All", ...Array.from(tagsSet)];
});

const visibleSkills = computed(() => {
  return allSkills.value.filter((s) => {
    return (
      activeTag.value === "All" ||
      (s.tag &&
        s.tag.some((t) => t.toLowerCase() === activeTag.value.toLowerCase()))
    );
  });
});

function handleIconError(name: string) {
  failedIcons.value[name] = true;
}
</script>

<template>
  <SectionHeading watermark="TECHNOLOGY" title="SKILLS" />

  <div class="w-full h-full flex flex-row-reverse gap-6 py-8">
    <div
      class="relative w-1/3 z-10 h-full min-h-125 overflow-hidden rounded-2xl border border-ink/10 bg-surface/60 flex flex-col"
    >
      <Meascii />
    </div>
    <div
      class="w-2/3 z-10 flex flex-col justify-between gap-6 overflow-y-scroll no-scrollbar rounded-2xl border border-ink/10 bg-surface/60 p-6 sm:p-8"
    >
      <div
        class="flex flex-wrap items-center justify-between gap-4 pb-3 border-b border-ink/5"
      >
        <div class="flex flex-wrap items-center gap-2">
          <button
            v-for="tag in availableTags"
            :key="tag"
            type="button"
            class="rounded-full px-4 py-1.5 text-xs font-semibold tracking-wide transition-all cursor-pointer select-none"
            :class="
              activeTag === tag
                ? 'bg-slate-900 text-white shadow-sm dark:bg-white dark:text-slate-900 scale-105'
                : 'text-slate-600 hover:bg-slate-200/60 hover:text-slate-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-100'
            "
            @click="activeTag = tag"
          >
            {{ tag }}
            <span class="ml-1 text-[10px] opacity-75 font-mono">
              {{
                tag === "All"
                  ? allSkills.length
                  : allSkills.filter((s) => s.tag?.includes(tag)).length
              }}
            </span>
          </button>
        </div>
      </div>
      <div class="flex-1 overflow-y-auto no-scrollbar py-2">
        <div
          class="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-7 gap-y-7 gap-x-3 sm:gap-x-5 place-items-center"
        >
          <div
            v-for="skill in visibleSkills"
            :key="skill.name"
            class="group flex flex-col items-center cursor-pointer select-none"
            :title="skill.name + ' (' + (skill.tag?.join(', ') || 'Tech') + ')'"
          >
            <div class="relative">
              <div
                class="absolute inset-0 rounded-[22%] opacity-0 group-hover:opacity-100 blur-lg bg-black/10 dark:bg-white/15 transition-opacity duration-300 pointer-events-none"
              ></div>

              <div
                class="relative w-16 h-16 sm:w-18 sm:h-18 lg:w-20 lg:h-20 rounded-[22%] flex items-center justify-center p-3.5 transition-all duration-300 ease-out group-hover:scale-110 group-hover:-translate-y-1.5 group-hover:shadow-xl dark:group-hover:shadow-black/80 group-active:scale-95 overflow-hidden bg-linear-to-b from-white via-white/95 to-slate-100/90 border border-black/10 shadow-[0_8px_18px_-4px_rgba(0,0,0,0.12),0_2px_4px_-1px_rgba(0,0,0,0.06),inset_0_1.5px_1px_rgba(255,255,255,1),inset_0_-1px_1px_rgba(0,0,0,0.05)] dark:bg-linear-to-b dark:from-zinc-800/95 dark:via-zinc-800/80 dark:to-zinc-900/95 dark:border-white/15 dark:shadow-[0_10px_22px_-4px_rgba(0,0,0,0.6),inset_0_1.5px_1px_rgba(255,255,255,0.25),inset_0_-1px_1px_rgba(0,0,0,0.5)]"
              >
                <div
                  class="pointer-events-none absolute inset-x-0 top-0 h-1/2 bg-linear-to-b from-white/70 via-white/20 to-transparent dark:from-white/20 dark:via-white/5"
                ></div>
                <div
                  class="pointer-events-none absolute -top-1/2 -left-1/2 w-full h-full bg-white/25 dark:bg-white/10 rotate-45 transform origin-bottom-right"
                ></div>
                <img
                  v-if="!failedIcons[skill.name]"
                  :src="skill.icon"
                  :alt="skill.name"
                  class="w-full h-full object-contain relative z-10 drop-shadow-[0_2px_5px_rgba(0,0,0,0.15)] dark:drop-shadow-[0_2px_8px_rgba(0,0,0,0.6)] group-hover:scale-110 transition-transform duration-300"
                  loading="lazy"
                  @error="handleIconError(skill.name)"
                />
                <span
                  v-else
                  class="text-slate-800 dark:text-white font-extrabold text-sm sm:text-base tracking-wider relative z-10"
                >
                  {{ skill.name.slice(0, 2).toUpperCase() }}
                </span>
              </div>
            </div>
            <span
              class="mt-2 text-xs sm:text-[13px] font-semibold tracking-tight text-center truncate text-slate-700 dark:text-slate-200 group-hover:text-primary dark:group-hover:text-cyan-400 transition-colors duration-200 max-w-21.25 sm:max-w-26.25"
            >
              {{ skill.name }}
            </span>
            <span
              v-if="skill.tag && skill.tag.length > 1"
              class="text-[9.5px] font-mono -mt-0.5 truncate text-slate-400 dark:text-zinc-500 max-w-21.25 sm:max-w-26.25"
            >
              +{{ skill.tag.length - 1 }} more
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.no-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

.no-scrollbar::-webkit-scrollbar {
  display: none;
}
</style>
