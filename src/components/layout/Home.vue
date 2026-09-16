<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { loadPortfolio, type Portfolio } from "../../service/portfolio.service";
import SiteHeader from "./SiteHeader.vue";
import Hero from "../sections/Hero.vue";
import MusicDisc from "../ui/MusicDisc.vue";
import SocialDock from "../ui/SocialDock.vue";
import SocialMediaCarousel from "../sections/socialMediaCarousel.vue";
import SelectedWork from "../sections/SelectedWork.vue";
import Services from "../sections/Services.vue";
import Experience from "../sections/Experience.vue";
import ContactCTA from "../sections/ContactCTA.vue";
// import FigmaCursor from "../ui/FigmaCursor.vue";

// "main" shows everything; "client" is the trimmed public view (no phone,
// no experience/education, no social links, no source-code links).
const props = withDefaults(defineProps<{ view?: "main" | "client" }>(), { view: "main" });
const isClient = computed(() => props.view === "client");

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
    {
      label: "Service",
      href: "#service",
      count: String(data.value.services.length),
    },
    ...(isClient.value
      ? []
      : [
          {
            label: "Experience",
            href: "#experience",
            count: String(
              data.value.experiences.length + data.value.educations.length,
            ),
          },
        ]),
    { label: "Contact", href: "#contact" },
  ];
});

const socials = computed(() => (isClient.value ? [] : data.value?.social ?? []));
const profilePhotos = computed(() =>
  (data.value?.photos ?? []).filter((p) => p.kind === "profile").map((p) => p.url),
);
const talkHref = computed(
  () =>
    socials.value.find((p) => p.network === "Telegram")?.url ||
    (data.value ? `mailto:${data.value.personal.email}` : "#"),
);

const location = computed(() =>
  data.value
    ? `${data.value.personal.location.postalCode ? `${data.value.personal.location.postalCode} ` : ''}${data.value.personal.location.city}, ${data.value.personal.location.country} (${data.value.personal.location.continent})`
    : "",
);

const year = new Date().getFullYear();
</script>

<template>
  <div class="min-h-screen overflow-x-hidden">
    <div class="mx-auto w-full">
      <!-- Loading skeleton -->
      <div
        v-if="!data && !failed"
        class="space-y-5 sm:space-y-6"
        aria-busy="true"
        aria-label="Loading portfolio"
      >
        <!-- Hero panel skeleton -->
        <section
          class="panel flex flex-col overflow-hidden pb-2"
        >
          <!-- Header row -->
          <div
            class="flex items-center justify-between gap-3 px-5 py-5 sm:px-10"
          >
            <div class="skeleton h-8 w-32 rounded-lg"></div>
            <div class="hidden items-center gap-3 sm:flex">
              <div class="skeleton h-4 w-14 rounded"></div>
              <div class="skeleton h-4 w-16 rounded"></div>
              <div class="skeleton h-4 w-20 rounded"></div>
              <div class="skeleton h-4 w-16 rounded"></div>
            </div>
            <div class="skeleton h-9 w-24 rounded-full"></div>
          </div>

          <!-- Hero body -->
          <div
            class="flex flex-1 flex-col justify-center gap-6 px-5 py-10 sm:px-10"
          >
            <div class="skeleton h-5 w-40 rounded-full"></div>
            <div class="space-y-4">
              <div class="skeleton h-12 w-3/4 rounded-xl sm:h-16"></div>
              <div class="skeleton h-12 w-1/2 rounded-xl sm:h-16"></div>
            </div>
            <div class="space-y-2">
              <div class="skeleton h-4 w-full max-w-xl rounded"></div>
              <div class="skeleton h-4 w-5/6 max-w-xl rounded"></div>
              <div class="skeleton h-4 w-2/3 max-w-xl rounded"></div>
            </div>
            <div class="flex flex-wrap gap-3">
              <div class="skeleton h-11 w-40 rounded-full"></div>
              <div class="skeleton h-11 w-32 rounded-full"></div>
            </div>
          </div>
        </section>

        <!-- Section panel skeletons -->
        <section
          v-for="n in 2"
          :key="n"
          class="panel-soft overflow-hidden px-5 py-10 sm:px-10 sm:py-14"
        >
          <div class="skeleton mb-8 h-8 w-48 rounded-lg"></div>
          <div class="grid gap-5 sm:grid-cols-2">
            <div v-for="i in 4" :key="i" class="space-y-3">
              <div class="skeleton h-40 w-full rounded-xl"></div>
              <div class="skeleton h-5 w-2/3 rounded"></div>
              <div class="skeleton h-4 w-full rounded"></div>
              <div class="skeleton h-4 w-4/5 rounded"></div>
            </div>
          </div>
        </section>
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
          class="panel relative flex flex-col overflow-hidden pb-2 pt-14 h-screen sm:pt-16"
        >
          <SiteHeader
            :navigation="navigation"
            :title="`${data.personal.name} | ${data.personal.label} in ${data.personal.location.city}`"
            :socials="socials"
            :talk-href="talkHref"
          />
          <Hero
            :avatars="profilePhotos"
            :name="data.personal.name"
            :role="data.personal.label"
            :description="data.personal.summary"
            collaborate-href="#contact"
          />

          <!-- Music disc: plays the tracks saved in the portfolio -->
          <div
            v-if="data.music?.length"
            class="absolute bottom-5 right-5 z-40"
          >
            <MusicDisc :tracks="data.music" :size="60" />
          </div>
        </section>

        <!-- Social media marquee -->
        <section
          v-if="socials.length"
          class="panel relative z-10"
          aria-label="Social media"
        >
          <SocialMediaCarousel :socials="socials" :email="data.personal.email" />
        </section>

        <section
          id="work"
          class="panel-soft h-screen overflow-hidden px-5 py-10 sm:px-10 sm:py-14"
        >
          <SelectedWork :projects="data.projects" :hide-source="isClient" />
        </section>

        <!-- Services -->
        <section
          id="service"
          class="panel overflow-hidden px-5 py-10 sm:px-10 sm:py-14"
        >
          <Services :services="data.services" />
        </section>

        <!-- Experience (dark) -->
        <section
          v-if="!isClient"
          id="experience"
          class="panel-dark overflow-hidden px-5 py-10 sm:px-10 sm:py-14"
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
        >
          <ContactCTA
            :available="'Available for New Project'"
            :email="data.personal.email"
            :location="location"
            :phone="isClient ? undefined : data.personal.phone"
          />
        </section>

        <!-- macOS-style social dock: slides in from the right edge on hover -->
        <SocialDock :socials="socials" :email="data.personal.email" />

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

<style scoped>
.skeleton {
  position: relative;
  overflow: hidden;
  background-color: color-mix(in srgb, var(--color-ink) 8%, transparent);
}

.skeleton::after {
  content: "";
  position: absolute;
  inset: 0;
  transform: translateX(-100%);
  background: linear-gradient(
    90deg,
    transparent,
    color-mix(in srgb, var(--color-ink) 6%, transparent),
    transparent
  );
  animation: skeleton-shimmer 1.4s ease-in-out infinite;
}

@keyframes skeleton-shimmer {
  100% {
    transform: translateX(100%);
  }
}

@media (prefers-reduced-motion: reduce) {
  .skeleton::after {
    animation: none;
  }
}
</style>
