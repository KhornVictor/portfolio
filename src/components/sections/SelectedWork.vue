<script setup lang="ts">
import { computed, ref, onMounted, onUnmounted } from "vue";
import type { Project } from "../../service/portfolio.service";
import SectionHeading from "../ui/SectionHeading.vue";
import ProjectCard from "../ui/ProjectCard.vue";
import ArrowIcon from "../ui/ArrowIcon.vue";
import WantedPoster from "../ui/WantedPoster.vue";
import FIFA from "../ui/FIFA.vue";
import ITC from "../ui/ITC.vue";
import Pokemon from "../ui/Pokemon.vue";

const props = defineProps<{ projects: Project[]; hideSource?: boolean }>();

// A project that ships (has a link) is a "Real Project"; the rest are studies.
function categoryOf(p: Project) {
  return p.github_url || p.live_url ? "Real Project" : "Exploration";
}

const filters = ["All", "Real Project", "Exploration"] as const;
const active = ref<(typeof filters)[number]>("All");

const visible = computed(() =>
  props.projects
    .map((project, index) => ({
      project,
      index,
      category: categoryOf(project),
    }))
    .filter((p) => active.value === "All" || p.category === active.value),
);

const currentIndex = ref(0);
const totalElements = 4;

let timer = 0;

onMounted(() => {
  timer = setInterval(() => {
    currentIndex.value = (currentIndex.value + 1) % totalElements;
  }, 5000);
});

onUnmounted(() => {
  clearInterval(timer);
});
</script>

<template>
  <SectionHeading watermark="Portfolio" title="Selected Work" />

  <div class="w-full h-full flex gap-6 py-10">
    <div
      class="relative w-1/3 z-10 flex flex-col items-center justify-between gap-4 overflow-y-scroll no-scrollbar rounded-2xl border border-ink/10 bg-surface/60"
    >
      <Transition name="slide" mode="out-in">
        <WantedPoster
          v-if="currentIndex === 0"
          image-url="https://avatars.githubusercontent.com/u/112184074?v=4"
          name="KHORN·VICTOR"
          :bounty="100"
        />
        <FIFA
          v-else-if="currentIndex === 1"
          name="KHORN VICTOR"
          flag-image="https://upload.wikimedia.org/wikipedia/commons/8/83/Flag_of_Cambodia.svg"
          club="PRIME FC"
          birth-date="06-01-2006"
          height="1.79 m"
          weight="75 kg"
          player-image="/assets/chanthhea-cutout.png"
        />
        <ITC
          v-else-if="currentIndex === 2"
          name="KHORN VICTOR"
          khmer-name="ឃន វ៉ិចទ័រ"
          student-id="e20230078"
          department="ដឺប៉ាតឺម៉ង់ព័ត៌មានវិទ្យាសាស្ត្រ និងទំនាក់ទំនង"
          photo-url="/itc-student.png"
        />
        <Pokemon
          v-else-if="currentIndex === 3"
          name="KHORN VICTOR"
          :hp="120000"
          species="Full-Stack Pokémon"
          height="1.79 m"
          weight="75 kg"
          image="/pokemon-victor-transparent.png"
        />
      </Transition>

      <div
        :key="currentIndex"
        class="absolute bottom-0 left-0 h-1.5 bg-white/70 progress-bar"
      ></div>
    </div>
    <div
      class="w-2/3 z-10 flex flex-col items-center justify-between gap-4 overflow-y-scroll no-scrollbar rounded-2xl border border-ink/10 bg-surface/60 p-6"
    >
      <div class="flex w-full items-center justify-between gap-4">
        <div class="flex flex-wrap items-center gap-1">
          <button
            v-for="f in filters"
            :key="f"
            type="button"
            class="rounded-full px-4 py-2 text-sm font-medium transition"
            :class="
              active === f
                ? 'bg-ink text-paper'
                : 'text-ink/55 hover:bg-ink/5 hover:text-ink'
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
      <div>
        <div class="mt-8 grid gap-x-6 gap-y-10 sm:grid-cols-3">
          <ProjectCard
            v-for="item in visible"
            :key="item.project.title"
            :project="item.project"
            :index="item.index"
            :category="item.category"
            :hide-source="hideSource"
          />
          <ProjectCard
            v-for="item in visible"
            :key="item.project.title"
            :project="item.project"
            :index="item.index"
            :category="item.category"
            :hide-source="hideSource"
          />
          <ProjectCard
            v-for="item in visible"
            :key="item.project.title"
            :project="item.project"
            :index="item.index"
            :category="item.category"
            :hide-source="hideSource"
          />
          <ProjectCard
            v-for="item in visible"
            :key="item.project.title"
            :project="item.project"
            :index="item.index"
            :category="item.category"
            :hide-source="hideSource"
          />
        </div>
      </div>
    </div>

    <!-- Cards -->
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

.slide-enter-active,
.slide-leave-active {
  transition: all 0.4s ease-in-out;
}

.slide-enter-from {
  opacity: 0;
  transform: translateX(100%);
}

.slide-leave-to {
  opacity: 0;
  transform: translateX(-100%);
}

.progress-bar {
  animation: loadProgress 5s linear forwards;
}

@keyframes loadProgress {
  0% {
    width: 0%;
  }
  100% {
    width: 100%;
  }
}
</style>
