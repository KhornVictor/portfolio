<script setup lang="ts">
import { computed } from "vue";
import type { Personal, Social } from "../../service/portfolio.service";
import SocialIcon from "../ui/SocialIcon.vue";

const props = defineProps<{
  personal?: Personal;
  socials?: Social[];
  navigation?: { label: string; href: string; count?: string }[];
}>();

const year = new Date().getFullYear();

function scrollToTop() {
  window.scrollTo({ top: 0, behavior: "smooth" });
}

const techStack = [
  {
    name: "Vue 3",
    category: "Frontend Framework",
    url: "https://vuejs.org",
  },
  {
    name: "TypeScript",
    category: "Type Safety",
    url: "https://www.typescriptlang.org",
  },
  {
    name: "Tailwind CSS v4",
    category: "Styling & Design System",
    url: "https://tailwindcss.com",
  },
  {
    name: "Vite",
    category: "Next-Gen Tooling",
    url: "https://vite.dev",
  },
  {
    name: "Express & Node.js",
    category: "REST API Backend",
    url: "https://expressjs.com",
  },
  {
    name: "MongoDB Atlas",
    category: "Cloud Document DB",
    url: "https://www.mongodb.com/atlas",
  },
  {
    name: "Supabase",
    category: "Asset Storage",
    url: "https://supabase.com",
  },
];

// Interactive modes & special pages
const interactiveModes = [
  {
    name: "macOS Desktop Experience",
    icon: "fa-brands fa-apple",
    href: "/macos",
    desc: "Interactive desktop OS simulation",
  },
  {
    name: "Cyber Terminal CLI",
    icon: "fa-solid fa-terminal",
    href: "/terminal",
    desc: "Command-line terminal shell",
  },
  {
    name: "Full Portfolio Showcase",
    icon: "fa-solid fa-layer-group",
    href: "/main",
    desc: "Complete uncapped showcase",
  },
  {
    name: "Admin Console",
    icon: "fa-solid fa-shield-halved",
    href: "/admin",
    desc: "CMS portfolio dashboard",
  },
];

const fallbackSocials = [
  { network: "GitHub", url: "https://github.com/KhornVictor" },
  {
    network: "LinkedIn",
    url: "https://www.linkedin.com/in/khorn-victor-794a6635a",
  },
  { network: "Telegram", url: "https://t.me/KhornVictor" },
];

const displaySocials = computed(() => {
  if (props.socials && props.socials.length) return props.socials;
  return fallbackSocials;
});
</script>

<template>
  <footer
    class=" border border-ink/10 bg-surface/70 backdrop-blur-xl p-6 sm:p-10 lg:p-12 text-ink shadow-[0_12px_40px_-15px_rgba(0,0,0,0.08)] transition-colors"
  >
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-10 pb-10 border-b border-ink/10">
      <div class="lg:col-span-2 flex flex-col justify-between gap-5">
        <div class="space-y-3">
          <div class="flex items-center gap-3">
            <img
              src="/favicon.png"
              alt="Logo"
              class="w-7 h-7 rounded-lg border border-ink/15 p-0.5 object-contain bg-white dark:bg-zinc-900"
            />
            <div>
              <h3 class="font-bold text-base tracking-tight text-ink">
                {{ personal?.name || "Khorn Victor" }}
              </h3>
              <p class="text-xs text-ink/60 font-mono">
                {{ personal?.label || "Junior Full-Stack Developer" }}
              </p>
            </div>
          </div>

          <!-- Description -->
          <p class="text-xs sm:text-sm text-ink/70 leading-relaxed max-w-sm">
            {{
              personal?.summary ||
              "Specialized in scalable backend architectures, clean code, Node.js, NestJS, and modern frontend interfaces."
            }}
          </p>
        </div>

        <!-- Availability Badge & Quick Contact -->
        <div class="space-y-3 pt-1">
          <div class="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-medium">
            <span class="relative flex h-2 w-2">
              <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span class="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span>Available for new projects &amp; full-time roles</span>
          </div>

          <div class="flex items-center gap-3 text-xs">
            <a
              href="#contact"
              class="inline-flex items-center gap-1.5 font-semibold text-ink hover:text-primary transition-colors"
            >
              <span>Let's collaborate</span>
              <span>→</span>
            </a>
            <span class="text-ink/30">•</span>
            <a
              :href="personal?.email ? `mailto:${personal.email}` : 'mailto:victorkhornkh@gmail.com'"
              class="text-ink/60 hover:text-ink transition-colors font-mono"
            >
              {{ personal?.email || "victorkhornkh@gmail.com" }}
            </a>
          </div>
        </div>
      </div>

      <!-- Col 2: Navigation Sitemap -->
      <div class="space-y-3">
        <h4 class="text-xs font-bold uppercase tracking-wider text-ink/45 font-mono">
          Navigation
        </h4>
        <ul class="space-y-2 text-xs sm:text-sm">
          <li>
            <a href="#home" class="text-ink/70 hover:text-ink transition-colors flex items-center gap-1.5">
              <span>Overview</span>
            </a>
          </li>
          <li>
            <a href="#work" class="text-ink/70 hover:text-ink transition-colors flex items-center gap-1.5">
              <span>Selected Work</span>
            </a>
          </li>
          <li>
            <a href="#skills" class="text-ink/70 hover:text-ink transition-colors flex items-center gap-1.5">
              <span>Skills &amp; Technologies</span>
            </a>
          </li>
          <li>
            <a href="#service" class="text-ink/70 hover:text-ink transition-colors flex items-center gap-1.5">
              <span>Services</span>
            </a>
          </li>
          <li>
            <a href="#experience" class="text-ink/70 hover:text-ink transition-colors flex items-center gap-1.5">
              <span>Experience &amp; Education</span>
            </a>
          </li>
          <li>
            <a href="#contact" class="text-ink/70 hover:text-ink transition-colors flex items-center gap-1.5">
              <span>Get in Touch</span>
            </a>
          </li>
        </ul>
      </div>

      <!-- Col 3: Interactive Experiences -->
      <div class="space-y-3">
        <h4 class="text-xs font-bold uppercase tracking-wider text-ink/45 font-mono">
          Experiences
        </h4>
        <ul class="space-y-2.5 text-xs sm:text-sm">
          <li v-for="mode in interactiveModes" :key="mode.href">
            <a
              :href="mode.href"
              class="group flex flex-col text-ink/70 hover:text-ink transition-colors"
            >
              <span class="flex items-center gap-1.5 font-medium group-hover:text-primary transition-colors">
                <i :class="mode.icon" class="text-[12px] opacity-75"></i>
                <span>{{ mode.name }}</span>
              </span>
              <span class="text-[11px] text-ink/40 font-mono pl-4">
                {{ mode.desc }}
              </span>
            </a>
          </li>
        </ul>
      </div>

      <!-- Col 4: Architecture & Tech References -->
      <div class="space-y-3">
        <h4 class="text-xs font-bold uppercase tracking-wider text-ink/45 font-mono">
          Tech Stack
        </h4>
        <ul class="space-y-2 text-xs">
          <li v-for="tech in techStack" :key="tech.name">
            <a
              :href="tech.url"
              target="_blank"
              rel="noreferrer"
              class="group flex items-center justify-between text-ink/70 hover:text-ink transition-colors"
            >
              <span class="font-medium group-hover:text-primary transition-colors">
                {{ tech.name }}
              </span>
              <span class="text-[10px] text-ink/40 font-mono">
                {{ tech.category }}
              </span>
            </a>
          </li>
        </ul>
      </div>
    </div>

    <!-- Middle Strip: System Status & Connect -->
    <div class="py-6 flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-ink/10 text-xs">
      <!-- Status Indicator -->
      <div class="flex flex-wrap items-center gap-4 text-ink/60">
        <div class="flex items-center gap-2">
          <span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span class="font-mono">API Status: Operational</span>
        </div>
        <span class="hidden sm:inline text-ink/20">|</span>
        <div class="flex items-center gap-1.5 font-mono text-ink/50">
          <i class="fa-solid fa-database text-[10px]"></i>
          <span>MongoDB Atlas Connected</span>
        </div>
        <span class="hidden sm:inline text-ink/20">|</span>
        <div class="flex items-center gap-1.5 font-mono text-ink/50">
          <i class="fa-solid fa-location-dot text-[10px]"></i>
          <span>Phnom Penh, KH (UTC+7)</span>
        </div>
      </div>

      <!-- Social Network Links -->
      <div class="flex items-center gap-2">
        <a
          v-for="s in displaySocials"
          :key="s.network"
          :href="s.url"
          target="_blank"
          rel="noreferrer"
          class="w-8 h-8 rounded-full border border-ink/10 bg-surface flex items-center justify-center text-ink/70 hover:text-ink hover:border-ink/30 hover:scale-105 transition-all shadow-2xs"
          :title="s.network"
          :aria-label="s.network"
        >
          <SocialIcon :name="s.network" :size="14" />
        </a>
      </div>
    </div>

    <!-- Bottom Bar: Copyright & Back to Top -->
    <div class="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-ink/50">
      <div class="flex flex-wrap items-center gap-2 text-center sm:text-left">
        <span>© {{ year }} {{ personal?.name || "Khorn Victor" }}. All rights reserved.</span>
        <span class="hidden sm:inline text-ink/20">•</span>
        <span>Designed with clean &amp; minimal Apple-inspired aesthetics.</span>
      </div>

      <button
        type="button"
        class="inline-flex items-center gap-1.5 font-mono font-medium text-ink/70 hover:text-ink hover:-translate-y-0.5 transition-all cursor-pointer select-none"
        @click="scrollToTop"
      >
        <span>Back to Top</span>
        <i class="fa-solid fa-arrow-up text-[11px]"></i>
      </button>
    </div>
  </footer>
</template>
