<script setup lang="ts">
import { computed, ref } from "vue";
import type { Project } from "../../service/portfolio.service";
import SectionHeading from "../ui/SectionHeading.vue";
import ProjectCard from "../ui/ProjectCard.vue";
import ArrowIcon from "../ui/ArrowIcon.vue";

const props = defineProps<{ projects: Project[] }>();

// A project that ships (has a link) is a "Real Project"; the rest are studies.
function categoryOf(p: Project) {
  return p.github_url || p.live_url ? "Real Project" : "Exploration";
}

const filters = ["All", "Real Project", "Exploration"] as const;
const active = ref<(typeof filters)[number]>("All");

const visible = computed(() =>
  props.projects
    .map((project, index) => ({ project, index, category: categoryOf(project) }))
    .filter((p) => active.value === "All" || p.category === active.value)
);
</script>

<template>
  <SectionHeading watermark="Portfolio" title="Selected Work" />

  <!-- Filter row -->
  <div
    class="relative z-10 mt-6 flex flex-wrap items-center justify-between gap-4"
    v-reveal
  >
    <div class="flex flex-wrap items-center gap-1">
      <button
        v-for="f in filters"
        :key="f"
        type="button"
        class="rounded-full px-4 py-2 text-sm font-medium transition"
        :class="
          active === f
            ? 'bg-ink text-white'
            : 'text-ink/55 hover:bg-black/5 hover:text-ink'
        "
        @click="active = f"
      >
        {{ f }}
      </button>
    </div>

    <a class="btn btn-light py-2.5! text-sm" href="#contact">
      View All Work
      <ArrowIcon :size="15" />
    </a>
  </div>

  <!-- Cards -->
  <div class="mt-8 grid gap-x-6 gap-y-10 sm:grid-cols-2">
    <ProjectCard
      v-for="item in visible"
      :key="item.project.title"
      :project="item.project"
      :index="item.index"
      :category="item.category"
    />
  </div>
</template>
