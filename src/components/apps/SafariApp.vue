<script setup lang="ts">
import { computed, ref } from "vue";
import { owner, skills } from "../../data/portfolio";
import { usePortfolio } from "../../pages/desktop/usePortfolio";
import { useWindowManager } from "../../pages/desktop/useWindowManager";
import type { WindowState } from "../../pages/desktop/types";

defineProps<{ win: WindowState }>();
const portfolio = usePortfolio();
const wm = useWindowManager();

type Page = "home" | "projects" | "about";
const pages: Record<Page, { url: string; title: string }> = {
  home: { url: "khornvictor.com", title: "Khorn Victor — Portfolio" },
  projects: { url: "khornvictor.com/projects", title: "Projects — Khorn Victor" },
  about: { url: "khornvictor.com/about", title: "About — Khorn Victor" },
};

const history = ref<Page[]>(["home"]);
const cursor = ref(0);
const page = computed(() => history.value[cursor.value]!);
const loading = ref(false);

function navigate(p: Page) {
  history.value = history.value.slice(0, cursor.value + 1).concat(p);
  cursor.value = history.value.length - 1;
  pulse();
}
function back() {
  if (cursor.value > 0) (cursor.value--, pulse());
}
function fwd() {
  if (cursor.value < history.value.length - 1) (cursor.value++, pulse());
}
function pulse() {
  loading.value = true;
  window.setTimeout(() => (loading.value = false), 500);
}

const links = computed(() => [
  { label: "GitHub", href: owner.github },
  { label: "LinkedIn", href: owner.linkedin },
  { label: "Website", href: owner.website },
  ...(portfolio.value?.social
    .filter((p) => !p.url.startsWith("/") && !/github|linkedin/i.test(p.network))
    .map((p) => ({ label: p.network, href: p.url })) ?? []),
]);
</script>

<template>
  <div class="flex h-full flex-col">
    <!-- Toolbar -->
    <div class="flex h-11 shrink-0 items-center gap-2 border-b border-(--line) px-3">
      <button class="nav" :disabled="cursor === 0" aria-label="Back" @click="back">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="m15 18-6-6 6-6" /></svg>
      </button>
      <button class="nav" :disabled="cursor >= history.length - 1" aria-label="Forward" @click="fwd">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="m9 6 6 6-6 6" /></svg>
      </button>
      <div class="relative mx-auto flex h-7 w-full max-w-xl items-center justify-center gap-1.5 rounded-lg bg-(--input-bg) text-[12px] text-(--muted)">
        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><rect x="5" y="11" width="14" height="10" rx="2" /><path d="M8 11V7a4 4 0 0 1 8 0v4" /></svg>
        <span class="text-(--win-fg)">{{ pages[page].url }}</span>
        <button class="absolute right-2 opacity-60 hover:opacity-100" aria-label="Reload" @click="pulse">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 12a8 8 0 1 1-2.3-5.7M20 4v5h-5" /></svg>
        </button>
        <span v-if="loading" class="absolute inset-x-0 bottom-0 h-0.5 overflow-hidden rounded-full"><span class="load block h-full bg-(--accent)"></span></span>
      </div>
      <div class="w-14"></div>
    </div>
    <!-- Tab -->
    <div class="flex h-8 shrink-0 items-center border-b border-(--line) px-2 text-[12px]">
      <span class="flex items-center gap-2 rounded-md bg-(--hover) px-3 py-1">
        <span class="h-2.5 w-2.5 rounded-sm bg-(--accent)"></span>{{ pages[page].title }}
      </span>
    </div>

    <!-- Page -->
    <div class="site min-h-0 flex-1 overflow-y-auto" :class="{ 'opacity-60': loading }">
      <nav class="sticky top-0 z-10 flex items-center justify-between border-b border-black/5 bg-white/80 px-6 py-3 text-[13px] backdrop-blur">
        <button class="font-semibold" @click="navigate('home')">{{ owner.name }}</button>
        <div class="flex gap-4 text-black/60">
          <button :class="{ 'text-black': page === 'about' }" @click="navigate('about')">About</button>
          <button :class="{ 'text-black': page === 'projects' }" @click="navigate('projects')">Projects</button>
          <a :href="owner.github" target="_blank" rel="noreferrer">GitHub</a>
        </div>
      </nav>

      <!-- Home -->
      <div v-if="page === 'home'" class="mx-auto max-w-3xl px-6 py-10">
        <p class="text-[12px] font-medium tracking-wide text-black/50 uppercase">{{ owner.role }}</p>
        <h1 class="mt-2 text-4xl font-bold tracking-tight">Hi, I'm {{ owner.name }}.</h1>
        <p class="mt-4 max-w-xl text-[15px] leading-relaxed text-black/65">{{ portfolio?.personal.summary ?? owner.tagline }}</p>
        <div class="mt-6 flex flex-wrap gap-2">
          <a v-for="l in links" :key="l.label" :href="l.href" target="_blank" rel="noreferrer" class="rounded-full border border-black/10 bg-white px-3 py-1.5 text-[13px] hover:bg-black hover:text-white">{{ l.label }} ↗</a>
        </div>

        <h2 class="mt-12 text-lg font-semibold">Featured projects</h2>
        <div class="mt-4 grid gap-4 sm:grid-cols-2">
          <article v-for="(p, i) in portfolio?.projects ?? []" :key="i" class="rounded-2xl border border-black/8 bg-white p-5 shadow-sm">
            <h3 class="font-semibold">{{ p.title }}</h3>
            <p class="mt-1.5 line-clamp-3 text-[13px] leading-relaxed text-black/60">{{ p.description }}</p>
            <div class="mt-3 flex flex-wrap gap-1.5">
              <span v-for="t in p.technologies" :key="t" class="rounded-md bg-black/5 px-2 py-0.5 text-[11px]">{{ t }}</span>
            </div>
            <a v-if="p.github_url" :href="p.github_url" target="_blank" rel="noreferrer" class="mt-3 inline-block text-[13px] text-blue-600 hover:underline">View on GitHub →</a>
          </article>
        </div>

        <h2 class="mt-12 text-lg font-semibold">Technology stack</h2>
        <div class="mt-4 flex flex-wrap gap-2">
          <span v-for="s in skills" :key="s" class="rounded-lg border border-black/8 bg-white px-3 py-1.5 text-[13px]">{{ s }}</span>
        </div>

        <footer class="mt-14 flex items-center justify-between border-t border-black/8 pt-6 text-[12px] text-black/50">
          <span>© {{ new Date().getFullYear() }} {{ owner.name }}</span>
          <button class="hover:text-black" @click="wm.open('mail')">Contact →</button>
        </footer>
      </div>

      <!-- Projects -->
      <div v-else-if="page === 'projects'" class="mx-auto max-w-3xl px-6 py-10">
        <h1 class="text-3xl font-bold tracking-tight">Projects</h1>
        <div class="mt-6 space-y-4">
          <article v-for="(p, i) in portfolio?.projects ?? []" :key="i" class="rounded-2xl border border-black/8 bg-white p-6">
            <h3 class="text-lg font-semibold">{{ p.title }}</h3>
            <p class="mt-2 text-[14px] leading-relaxed text-black/65">{{ p.description }}</p>
            <ul class="mt-3 list-disc space-y-1 pl-5 text-[13px] text-black/65">
              <li v-for="h in p.highlights" :key="h">{{ h }}</li>
            </ul>
            <div class="mt-4 flex flex-wrap items-center gap-1.5">
              <span v-for="t in p.technologies" :key="t" class="rounded-md bg-black/5 px-2 py-0.5 text-[11px]">{{ t }}</span>
              <a v-if="p.github_url" :href="p.github_url" target="_blank" rel="noreferrer" class="ml-auto text-[13px] text-blue-600 hover:underline">GitHub ↗</a>
            </div>
          </article>
        </div>
      </div>

      <!-- About -->
      <div v-else class="mx-auto max-w-3xl px-6 py-10">
        <h1 class="text-3xl font-bold tracking-tight">About</h1>
        <p class="mt-4 text-[15px] leading-relaxed text-black/65">{{ portfolio?.personal.summary ?? owner.tagline }}</p>
        <h2 class="mt-8 text-lg font-semibold">Services</h2>
        <div class="mt-3 grid gap-3 sm:grid-cols-2">
          <div v-for="s in portfolio?.services ?? []" :key="s.title" class="rounded-xl border border-black/8 bg-white p-4">
            <h3 class="font-medium">{{ s.title }}</h3>
            <p class="mt-1 text-[13px] text-black/60">{{ s.description }}</p>
          </div>
        </div>
        <h2 class="mt-8 text-lg font-semibold">Contact</h2>
        <p class="mt-2 text-[14px] text-black/65">
          <a :href="`mailto:${owner.email}`" class="text-blue-600 hover:underline">{{ owner.email }}</a> · {{ owner.location }}
        </p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.nav {
  display: grid;
  place-items: center;
  width: 26px;
  height: 24px;
  border-radius: 6px;
  color: var(--muted);
}
.nav:hover:not(:disabled) {
  background: var(--hover);
}
.nav:disabled {
  opacity: 0.35;
}
.site {
  /* The "web page" is always light, like a real site in Safari. */
  background: #f5f5f7;
  color: #1d1d1f;
  color-scheme: light;
  transition: opacity 0.2s;
}
.load {
  animation: load 0.5s ease-out forwards;
}
@keyframes load {
  from { width: 0; }
  to { width: 100%; }
}
</style>
