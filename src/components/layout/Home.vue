<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { loadPortfolio, type Portfolio } from "../../service/portfolio.service";
import SiteHeader from "./SiteHeader.vue";
import Hero from "../sections/Hero.vue";
import SelectedWork from "../sections/SelectedWork.vue";
import Services from "../sections/Services.vue";
import Experience from "../sections/Experience.vue";
import ContactCTA from "../sections/ContactCTA.vue";

const data = ref<Portfolio | null>(null);
const failed = ref(false);

onMounted(async () => {
  try {
    data.value = await loadPortfolio();
  } catch (e) {
    console.error(e);
    failed.value = true;
  }
});

const navigation = computed(() => {
  if (!data.value) return [];
  return [
    { label: "Work", href: "#work", count: String(data.value.projects.length) },
    { label: "Service", href: "#service", count: String(data.value.services.length) },
    {
      label: "Experience",
      href: "#experience",
      count: String(
        data.value.experiences.length + data.value.educations.length
      ),
    },
    { label: "Contact", href: "#contact" },
  ];
});

const location = computed(() =>
  data.value
    ? `${data.value.personal.location.city}, ${data.value.personal.location.country}`
    : ""
);

const year = new Date().getFullYear();
</script>

<template>
  <div class="min-h-screen overflow-x-hidden">
    <div class="mx-auto w-full px-3 py-3 sm:px-5 sm:py-5">
      <!-- Loading / error fallbacks -->
      <div
        v-if="!data && !failed"
        class="grid min-h-[70vh] place-items-center"
      >
        <div class="flex flex-col items-center gap-3 text-ink/50">
          <span
            class="h-7 w-7 animate-spin rounded-full border-2 border-ink/20 border-t-ink"
          ></span>
          <span class="text-sm">Loading portfolio…</span>
        </div>
      </div>

      <div
        v-else-if="failed"
        class="grid min-h-[70vh] place-items-center text-center"
      >
        <p class="text-ink/60">
          Couldn't load portfolio data. Please refresh the page.
        </p>
      </div>

      <div v-else-if="data" class="space-y-5 sm:space-y-6">
        <!-- Hero -->
        <section
          id="home"
          class="panel flex min-h-[calc(100vh-1.5rem)] flex-col overflow-hidden pb-2 sm:min-h-[calc(100vh-2.5rem)]"
          v-reveal:panel
        >
          <SiteHeader
            :navigation="navigation"
            :available="'Available for New Project'"
            :talk-href="`mailto:${data.personal.email}`"
          />
          <Hero
            :name="data.personal.name"
            :role="data.personal.label"
            :description="data.personal.summary"
            :email="data.personal.email"
            :profiles="data.personal.profiles"
            collaborate-href="#contact"
          />
        </section>

        <!-- Selected Work -->
        <section
          id="work"
          class="panel-soft overflow-hidden px-5 py-10 sm:px-10 sm:py-14"
          v-reveal:panel
        >
          <SelectedWork :projects="data.projects" />
        </section>

        <!-- Services -->
        <section
          id="service"
          class="panel overflow-hidden px-5 py-10 sm:px-10 sm:py-14"
          v-reveal:panel
        >
          <Services :services="data.services" />
        </section>

        <!-- Experience (dark) -->
        <section
          id="experience"
          class="panel-dark overflow-hidden px-5 py-10 sm:px-10 sm:py-14"
          v-reveal:panel
        >
          <Experience
            :experiences="data.experiences"
            :educations="data.educations"
          />
        </section>

        <!-- Contact -->
        <section
          id="contact"
          class="panel-soft overflow-hidden px-5 sm:px-10"
          v-reveal:panel
        >
          <ContactCTA
            :available="'Available for New Project'"
            :email="data.personal.email"
            :location="location"
          />
        </section>

        <!-- Footer -->
        <footer
          class="flex flex-col items-center justify-between gap-2 px-2 py-4 text-xs text-ink/50 sm:flex-row"
        >
          <span>© {{ year }} {{ data.personal.name }}</span>
          <span>Built with Vue · Designed clean &amp; minimal</span>
        </footer>
      </div>
    </div>
  </div>
</template>
