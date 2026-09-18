<script setup lang="ts">
import { computed, onUnmounted, ref, watch } from "vue";
import type { Skill } from "../../service/portfolio.service";
import SkillIcon from "./SkillIcon.vue";

const props = defineProps<{
  skills: Skill[];
  currentPage: number;
  isJiggleMode: boolean;
}>();

const emit = defineEmits<{
  (e: "openApp", skill: Skill): void;
  (e: "update:currentPage", page: number): void;
  (e: "update:isJiggleMode", val: boolean): void;
  (e: "update:skills", skills: Skill[]): void;
}>();

const APPS_PER_PAGE = 30;
const homeRef = ref<HTMLElement | null>(null);

const totalPages = computed(() =>
  Math.max(1, Math.ceil(props.skills.length / APPS_PER_PAGE)),
);

const pagedSkills = computed(() => {
  const pages: Skill[][] = [];
  for (let i = 0; i < props.skills.length; i += APPS_PER_PAGE) {
    pages.push(props.skills.slice(i, i + APPS_PER_PAGE));
  }
  return pages.length > 0 ? pages : [[]];
});

function goToPage(page: number) {
  if (page >= 0 && page < totalPages.value) {
    emit("update:currentPage", page);
  }
}

watch(totalPages, (count) => {
  if (props.currentPage >= count) {
    emit("update:currentPage", Math.max(0, count - 1));
  }
});

// -------------------------------------------------------------
// SWIPING BETWEEN PAGES
// -------------------------------------------------------------
let swipeStartX = 0;
let swipeStartY = 0;
let isSwiping = false;

function onHomeSwipeStart(e: MouseEvent | TouchEvent) {
  if (isDraggingIcon.value) return;
  swipeStartX = "touches" in e ? e.touches[0].clientX : e.clientX;
  swipeStartY = "touches" in e ? e.touches[0].clientY : e.clientY;
  isSwiping = true;
}

function onHomeSwipeEnd(e: MouseEvent | TouchEvent) {
  if (!isSwiping || isDraggingIcon.value) return;
  isSwiping = false;
  const clientX =
    "changedTouches" in e
      ? e.changedTouches[0].clientX
      : (e as MouseEvent).clientX;
  const clientY =
    "changedTouches" in e
      ? e.changedTouches[0].clientY
      : (e as MouseEvent).clientY;

  const dx = clientX - swipeStartX;
  const dy = clientY - swipeStartY;

  if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy)) {
    if (dx < 0 && props.currentPage < totalPages.value - 1) {
      goToPage(props.currentPage + 1);
    } else if (dx > 0 && props.currentPage > 0) {
      goToPage(props.currentPage - 1);
    }
  }
}

// -------------------------------------------------------------
// DRAGGING APP ICONS TO REORDER & MOVE ACROSS SCREENS
// -------------------------------------------------------------
const isDraggingIcon = ref(false);
const draggedGlobalIndex = ref<number | null>(null);
const dropHoverGlobalIndex = ref<number | null>(null);
const iconPointerPos = ref({ x: 0, y: 0 });
let iconStartPos = { x: 0, y: 0 };
const draggedSkillItem = ref<Skill | null>(null);
let edgePageFlipTimer: number | null = null;

function startIconDrag(
  e: MouseEvent | TouchEvent,
  skill: Skill,
  pageIdx: number,
  itemIdx: number,
) {
  const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
  const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;

  const globalIdx = pageIdx * APPS_PER_PAGE + itemIdx;

  iconStartPos = { x: clientX, y: clientY };
  draggedSkillItem.value = skill;
  draggedGlobalIndex.value = globalIdx;
  dropHoverGlobalIndex.value = globalIdx;
  iconPointerPos.value = { x: clientX, y: clientY };

  window.addEventListener("mousemove", onIconMouseMove);
  window.addEventListener("mouseup", onIconMouseUp);
  window.addEventListener("touchmove", onIconMouseMove, { passive: false });
  window.addEventListener("touchend", onIconMouseUp);
}

function onIconMouseMove(e: MouseEvent | TouchEvent) {
  const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
  const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;

  const dist = Math.hypot(clientX - iconStartPos.x, clientY - iconStartPos.y);
  if (dist > 6) {
    isDraggingIcon.value = true;
    if ("touches" in e) e.preventDefault();
  }

  iconPointerPos.value = { x: clientX, y: clientY };

  if (isDraggingIcon.value) {
    // Check if dragging near screen edge to flip page
    if (homeRef.value) {
      const rect = homeRef.value.getBoundingClientRect();
      const relX = (clientX - rect.left) / rect.width;

      if (relX > 0.92 && props.currentPage < totalPages.value - 1) {
        if (!edgePageFlipTimer) {
          edgePageFlipTimer = window.setTimeout(() => {
            goToPage(props.currentPage + 1);
            edgePageFlipTimer = null;
          }, 450);
        }
      } else if (relX < 0.08 && props.currentPage > 0) {
        if (!edgePageFlipTimer) {
          edgePageFlipTimer = window.setTimeout(() => {
            goToPage(props.currentPage - 1);
            edgePageFlipTimer = null;
          }, 450);
        }
      } else {
        if (edgePageFlipTimer) {
          clearTimeout(edgePageFlipTimer);
          edgePageFlipTimer = null;
        }
      }
    }

    // Check hovered icon slot to change position
    const elements = document.elementsFromPoint(clientX, clientY);
    for (const el of elements) {
      const gIdxStr = el.getAttribute("data-global-index");
      if (gIdxStr !== null) {
        const targetGlobalIdx = parseInt(gIdxStr, 10);
        if (
          !isNaN(targetGlobalIdx) &&
          targetGlobalIdx !== dropHoverGlobalIndex.value
        ) {
          dropHoverGlobalIndex.value = targetGlobalIdx;

          // Reorder the skills list so position changes
          if (
            draggedGlobalIndex.value !== null &&
            draggedGlobalIndex.value !== targetGlobalIdx
          ) {
            const list = [...props.skills];
            const [item] = list.splice(draggedGlobalIndex.value, 1);
            if (item) {
              list.splice(targetGlobalIdx, 0, item);
              draggedGlobalIndex.value = targetGlobalIdx;
              emit("update:skills", list);
            }
          }
        }
        break;
      }
    }
  }
}

function onIconMouseUp() {
  if (edgePageFlipTimer) {
    clearTimeout(edgePageFlipTimer);
    edgePageFlipTimer = null;
  }
  window.removeEventListener("mousemove", onIconMouseMove);
  window.removeEventListener("mouseup", onIconMouseUp);
  window.removeEventListener("touchmove", onIconMouseMove);
  window.removeEventListener("touchend", onIconMouseUp);

  if (!isDraggingIcon.value && draggedSkillItem.value) {
    emit("openApp", draggedSkillItem.value);
  }

  isDraggingIcon.value = false;
  draggedGlobalIndex.value = null;
  dropHoverGlobalIndex.value = null;
  draggedSkillItem.value = null;
}

onUnmounted(() => {
  if (edgePageFlipTimer) {
    clearTimeout(edgePageFlipTimer);
  }
  window.removeEventListener("mousemove", onIconMouseMove);
  window.removeEventListener("mouseup", onIconMouseUp);
  window.removeEventListener("touchmove", onIconMouseMove);
  window.removeEventListener("touchend", onIconMouseUp);
});
</script>

<template>
  <div
    ref="homeRef"
    class="relative flex-1 w-full h-full overflow-hidden flex flex-col justify-between select-none"
  >
    <!-- Paged Grid Screens -->
    <div
      class="flex-1 w-full h-full flex transition-transform duration-350 ease-out cursor-default"
      :style="{ transform: `translateX(-${currentPage * 100}%)` }"
      @mousedown="onHomeSwipeStart"
      @touchstart="onHomeSwipeStart"
      @mouseup="onHomeSwipeEnd"
      @touchend="onHomeSwipeEnd"
    >
      <div
        v-for="(pageApps, pIdx) in pagedSkills"
        :key="pIdx"
        class="w-full h-full shrink-0 p-2 sm:p-4 flex flex-col justify-center items-center overflow-hidden"
      >
        <div
          class="w-full max-w-4xl grid grid-cols-5 sm:grid-cols-6 gap-y-2 sm:gap-y-3.5 gap-x-2 sm:gap-x-4 place-items-center"
        >
          <div
            v-for="(skill, idx) in pageApps"
            :key="skill.name"
            :data-global-index="pIdx * APPS_PER_PAGE + idx"
            class="group relative flex flex-col items-center cursor-grab active:cursor-grabbing select-none transition-transform duration-200"
            :class="[
              isJiggleMode
                ? 'animate-jiggle'
                : 'hover:-translate-y-1 active:scale-95',
              draggedGlobalIndex === pIdx * APPS_PER_PAGE + idx && isDraggingIcon
                ? 'opacity-30 scale-95 border-2 border-dashed border-cyan-400 rounded-2xl p-1'
                : '',
            ]"
            @mousedown="startIconDrag($event, skill, pIdx, idx)"
            @touchstart="startIconDrag($event, skill, pIdx, idx)"
          >
            <!-- Minus badge in Jiggle Mode -->
            <div
              v-if="isJiggleMode"
              class="absolute -top-1 -left-1 w-4 h-4 rounded-full bg-slate-800 border border-white/40 text-white flex items-center justify-center text-[10px] font-bold z-20 shadow-sm"
            >
              -
            </div>

            <!-- Application Icon -->
            <div class="relative pointer-events-none">
              <SkillIcon
                :name="skill.name"
                :icon="skill.icon"
                :size="44"
                class="group-hover:shadow-[0_8px_20px_rgba(0,0,0,0.5)] transition-shadow duration-300"
              />
            </div>

            <!-- Application Title -->
            <span
              class="mt-1 text-[10px] sm:text-[11px] font-medium text-white/95 text-center truncate max-w-15.5 drop-shadow-sm group-hover:text-cyan-300 transition-colors pointer-events-none"
            >
              {{ skill.name }}
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- Page Indicator Dots -->
    <div
      v-if="totalPages > 1"
      class="flex items-center justify-center py-1 z-30 select-none"
    >
      <div
        class="px-2.5 py-1 rounded-full bg-black/40 backdrop-blur-xl border border-white/15 flex items-center gap-1.5 shadow-md"
      >
        <button
          v-for="p in totalPages"
          :key="p"
          class="h-1.5 rounded-full transition-all duration-300 cursor-pointer"
          :class="
            currentPage === p - 1
              ? 'w-5 bg-white shadow-[0_0_8px_rgba(255,255,255,0.9)]'
              : 'w-1.5 bg-white/40 hover:bg-white/70 hover:scale-125'
          "
          :title="'Go to Screen ' + p"
          @click="goToPage(p - 1)"
        ></button>
      </div>
    </div>

    <!-- Drag Ghost under cursor -->
    <div
      v-if="isDraggingIcon && draggedSkillItem"
      class="fixed pointer-events-none z-50 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center select-none scale-110 rotate-2"
      :style="{
        left: iconPointerPos.x + 'px',
        top: iconPointerPos.y + 'px',
      }"
    >
      <div
        class="shadow-[0_20px_40px_rgba(0,0,0,0.8)] rounded-2xl bg-black/40 backdrop-blur-md p-1 border border-cyan-400"
      >
        <SkillIcon
          :name="draggedSkillItem.name"
          :icon="draggedSkillItem.icon"
          :size="48"
        />
      </div>
      <span
        class="mt-1 text-xs font-bold text-cyan-300 drop-shadow-md bg-slate-900/90 px-2 py-0.5 rounded-full border border-white/20"
      >
        {{ draggedSkillItem.name }}
      </span>
    </div>
  </div>
</template>

<style scoped>
/* iPadOS Jiggle Animation */
@keyframes jiggle {
  0% {
    transform: rotate(-1.2deg);
  }
  50% {
    transform: rotate(1.4deg);
  }
  100% {
    transform: rotate(-1deg);
  }
}

.animate-jiggle {
  animation: jiggle 0.22s infinite ease-in-out alternate;
}

.animate-jiggle:nth-child(2n) {
  animation-duration: 0.26s;
  animation-direction: alternate-reverse;
}

.animate-jiggle:nth-child(3n) {
  animation-duration: 0.24s;
}
</style>
