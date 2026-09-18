<script setup lang="ts">
import { computed } from "vue";
import type { Skill } from "../../service/portfolio.service";
import { defaultSkills } from "../../data/portfolio";
import SectionHeading from "../ui/SectionHeading.vue";
import Meascii from "../ui/Meascii.vue";
import IpadPro from "../ipad/IpadPro.vue";

const props = defineProps<{
  skills?: Skill[];
}>();

const allSkills = computed<Skill[]>(() => {
  if (props.skills && Array.isArray(props.skills) && props.skills.length > 0) {
    return props.skills;
  }
  return defaultSkills;
});
</script>

<template>
  <div class="w-full h-full flex flex-col justify-between overflow-hidden">
    <SectionHeading watermark="TECHNOLOGY" title="SKILLS" />

    <div class="w-full flex-1 min-h-0 flex flex-col lg:flex-row-reverse gap-6 py-4 sm:py-6 overflow-hidden">
      <!-- 1/3: Victor ASCII art in its original dedicated container -->
      <div
        class="relative w-full lg:w-1/3 z-10 h-full min-h-[300px] overflow-hidden rounded-2xl border border-ink/10 bg-surface/60 flex flex-col"
      >
        <Meascii />
      </div>

      <!-- 2/3: Functional iPad Pro with the skills as apps -->
      <div
        class="relative w-full lg:w-2/3 z-10 h-full flex items-center justify-center overflow-hidden"
      >
        <IpadPro :skills="allSkills" />
      </div>
    </div>
  </div>
</template>
