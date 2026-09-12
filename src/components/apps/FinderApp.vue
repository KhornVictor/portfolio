<script setup lang="ts">
import { computed, onMounted, ref, watch } from "vue";
import { usePortfolio } from "../../desktop/usePortfolio";
import { useWindowManager } from "../../desktop/useWindowManager";
import type { WindowState } from "../../desktop/types";
import AppIcon from "../desktop/AppIcon.vue";

const props = defineProps<{ win: WindowState }>();
const wm = useWindowManager();
const portfolio = usePortfolio();

type Folder = "root" | "about" | "projects" | "experience" | "skills";
interface Item {
  id: string;
  name: string;
  icon: string;
  kind: string;
  size?: string;
  open: () => void;
}

const folderNames: Record<Folder, string> = {
  root: "Macintosh HD",
  about: "About Me",
  projects: "Projects",
  experience: "Experience",
  skills: "Skills",
};

const sidebar: { id: Folder | "resume" | "contact"; label: string; icon: string }[] = [
  { id: "about", label: "About Me", icon: "folder" },
  { id: "projects", label: "Projects", icon: "folder" },
  { id: "experience", label: "Experience", icon: "folder" },
  { id: "skills", label: "Skills", icon: "folder" },
  { id: "resume", label: "Resume", icon: "pdf" },
  { id: "contact", label: "Contact", icon: "file" },
];

const stack = ref<Folder[]>([toFolder(props.win.payload)]);
const forward = ref<Folder[]>([]);
const cwd = computed(() => stack.value[stack.value.length - 1]!);
const selected = ref<string | null>(null);
const query = ref("");
const view = ref<"grid" | "list">("grid");

function toFolder(p?: string): Folder {
  return p && p in folderNames ? (p as Folder) : "root";
}
function go(f: Folder) {
  if (cwd.value === f) return;
  stack.value.push(f);
  forward.value = [];
  selected.value = null;
}
function back() {
  if (stack.value.length > 1) forward.value.push(stack.value.pop()!);
}
function fwd() {
  const f = forward.value.pop();
  if (f) stack.value.push(f);
}
// Re-launching Finder from Go menu / desktop icon with a new payload.
watch(
  () => props.win.payload,
  (p) => go(toFolder(p)),
);

onMounted(() => (props.win.title = "Khorn Victor — Finder"));

const openDoc = (payload: string, title: string) => wm.open("textedit", payload, title);

const items = computed<Item[]>(() => {
  const pf = portfolio.value;
  switch (cwd.value) {
    case "root":
      return [
        { id: "about", name: "About Me", icon: "folder", kind: "Folder", open: () => go("about") },
        { id: "projects", name: "Projects", icon: "folder", kind: "Folder", open: () => go("projects") },
        { id: "experience", name: "Experience", icon: "folder", kind: "Folder", open: () => go("experience") },
        { id: "skills", name: "Skills", icon: "folder", kind: "Folder", open: () => go("skills") },
        { id: "resume", name: "Resume.pdf", icon: "pdf", kind: "PDF Document", size: "84 KB", open: () => openDoc("resume", "Resume.pdf") },
        { id: "contact", name: "Contact.txt", icon: "file", kind: "Plain Text", size: "1 KB", open: () => wm.open("mail") },
      ];
    case "about":
      return [
        { id: "readme", name: "README.md", icon: "file", kind: "Markdown", size: "3 KB", open: () => openDoc("about", "README.md") },
        { id: "interests", name: "Interests.txt", icon: "file", kind: "Plain Text", size: "1 KB", open: () => openDoc("interests", "Interests.txt") },
        { id: "photos", name: "Photos", icon: "photos", kind: "Application", open: () => wm.open("photos") },
        { id: "notes", name: "Notes", icon: "notes", kind: "Application", open: () => wm.open("notes", "about") },
      ];
    case "projects":
      return (pf?.projects ?? []).map((p, i) => ({
        id: `p${i}`,
        name: p.title,
        icon: "folder",
        kind: "Project",
        size: `${p.technologies.length} techs`,
        open: () => openDoc(`project:${i}`, `${p.title}.md`),
      }));
    case "experience":
      return [
        ...(pf?.experiences ?? []).map((e, i) => ({
          id: `e${i}`,
          name: `${e.company}.md`,
          icon: "file",
          kind: "Experience",
          size: e.end_date,
          open: () => openDoc(`experience:${i}`, `${e.company}.md`),
        })),
        ...(pf?.educations ?? []).map((e, i) => ({
          id: `ed${i}`,
          name: `${e.institution}.md`,
          icon: "file",
          kind: "Education",
          size: e.end_date,
          open: () => openDoc(`education:${i}`, `${e.institution}.md`),
        })),
      ];
    case "skills":
      return (["languages", "backend", "database", "devops"] as const).map((k) => ({
        id: k,
        name: `${k}.txt`,
        icon: "file",
        kind: "Plain Text",
        size: "1 KB",
        open: () => openDoc(`skills:${k}`, `${k}.txt`),
      }));
  }
});

const filtered = computed(() => {
  const q = query.value.trim().toLowerCase();
  return q ? items.value.filter((i) => i.name.toLowerCase().includes(q)) : items.value;
});

function onSidebar(id: (typeof sidebar)[number]["id"]) {
  if (id === "resume") openDoc("resume", "Resume.pdf");
  else if (id === "contact") wm.open("mail");
  else go(id);
}

const crumbs = computed(() => (cwd.value === "root" ? ["Macintosh HD"] : ["Macintosh HD", folderNames[cwd.value]]));
</script>

<template>
  <div class="flex h-full">
    <!-- Sidebar -->
    <aside class="hidden w-48 shrink-0 flex-col gap-0.5 overflow-y-auto border-r border-(--line) bg-(--sidebar-bg) p-3 text-[13px] sm:flex">
      <p class="mb-1 px-2 text-[11px] font-semibold text-(--muted)">Favorites</p>
      <button
        v-for="s in sidebar"
        :key="s.id"
        class="flex items-center gap-2 rounded-md px-2 py-1 text-left hover:bg-(--hover)"
        :class="{ 'bg-(--hover)': cwd === s.id }"
        @click="onSidebar(s.id)"
      >
        <AppIcon :name="s.icon" :size="18" />
        <span class="truncate">{{ s.label }}</span>
      </button>
      <p class="mt-4 mb-1 px-2 text-[11px] font-semibold text-(--muted)">Locations</p>
      <button class="flex items-center gap-2 rounded-md px-2 py-1 text-left hover:bg-(--hover)" :class="{ 'bg-(--hover)': cwd === 'root' }" @click="go('root')">
        <AppIcon name="hd" :size="18" />
        <span>Macintosh HD</span>
      </button>
      <button class="flex items-center gap-2 rounded-md px-2 py-1 text-left hover:bg-(--hover)" @click="wm.open('trash')">
        <AppIcon name="trash" :size="18" />
        <span>Trash</span>
      </button>
    </aside>

    <!-- Main -->
    <div class="flex min-w-0 flex-1 flex-col">
      <!-- Toolbar -->
      <div class="flex h-11 shrink-0 items-center gap-2 border-b border-(--line) px-3">
        <div class="flex items-center gap-1">
          <button class="tb" :disabled="stack.length < 2" aria-label="Back" @click="back">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="m15 18-6-6 6-6" /></svg>
          </button>
          <button class="tb" :disabled="!forward.length" aria-label="Forward" @click="fwd">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="m9 6 6 6-6 6" /></svg>
          </button>
        </div>
        <span class="truncate text-[13px] font-semibold">{{ folderNames[cwd] }}</span>
        <div class="ml-auto flex items-center gap-1">
          <button class="tb" :class="{ 'bg-(--hover)': view === 'grid' }" aria-label="Icon view" @click="view = 'grid'">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><rect x="3" y="3" width="8" height="8" rx="1.5" /><rect x="13" y="3" width="8" height="8" rx="1.5" /><rect x="3" y="13" width="8" height="8" rx="1.5" /><rect x="13" y="13" width="8" height="8" rx="1.5" /></svg>
          </button>
          <button class="tb" :class="{ 'bg-(--hover)': view === 'list' }" aria-label="List view" @click="view = 'list'">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><path d="M4 6h16M4 12h16M4 18h16" /></svg>
          </button>
          <label class="ml-2 flex items-center gap-1.5 rounded-md bg-(--input-bg) px-2 py-1 text-[12px] text-(--muted)">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" /></svg>
            <input v-model="query" type="search" placeholder="Search" class="w-20 bg-transparent text-(--win-fg) outline-none sm:w-32" />
          </label>
        </div>
      </div>

      <!-- Files -->
      <div class="min-h-0 flex-1 overflow-y-auto bg-(--content-bg) p-3" @click.self="selected = null">
        <div v-if="!items.length" class="grid h-full place-items-center text-sm text-(--muted)">Loading…</div>

        <div v-else-if="view === 'grid'" class="grid grid-cols-[repeat(auto-fill,minmax(96px,1fr))] gap-2">
          <button
            v-for="it in filtered"
            :key="it.id"
            class="flex flex-col items-center gap-1 rounded-lg p-2 text-center"
            :class="selected === it.id ? 'bg-(--hover)' : 'hover:bg-(--hover)/60'"
            @click.stop="selected = it.id"
            @dblclick.stop="it.open()"
            @keydown.enter="it.open()"
          >
            <AppIcon :name="it.icon" :size="56" />
            <span class="line-clamp-2 text-[12px] leading-tight" :class="{ 'rounded bg-(--accent) px-1 text-white': selected === it.id }">{{ it.name }}</span>
          </button>
        </div>

        <table v-else class="w-full text-left text-[13px]">
          <thead class="text-[11px] text-(--muted)">
            <tr><th class="px-2 py-1 font-medium">Name</th><th class="px-2 py-1 font-medium">Kind</th><th class="px-2 py-1 font-medium">Size</th></tr>
          </thead>
          <tbody>
            <tr
              v-for="it in filtered"
              :key="it.id"
              class="cursor-default rounded"
              :class="selected === it.id ? 'bg-(--accent) text-white' : 'even:bg-(--hover)/40 hover:bg-(--hover)'"
              @click.stop="selected = it.id"
              @dblclick.stop="it.open()"
            >
              <td class="flex items-center gap-2 px-2 py-1"><AppIcon :name="it.icon" :size="18" />{{ it.name }}</td>
              <td class="px-2 py-1 opacity-70">{{ it.kind }}</td>
              <td class="px-2 py-1 opacity-70">{{ it.size ?? "—" }}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Path bar -->
      <div class="flex h-7 shrink-0 items-center gap-1 border-t border-(--line) px-3 text-[11px] text-(--muted)">
        <template v-for="(c, i) in crumbs" :key="c">
          <span v-if="i" class="opacity-50">›</span>
          <span class="flex items-center gap-1"><AppIcon :name="i ? 'folder' : 'hd'" :size="12" />{{ c }}</span>
        </template>
        <span class="ml-auto">{{ filtered.length }} items</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.tb {
  display: grid;
  place-items: center;
  width: 28px;
  height: 24px;
  border-radius: 6px;
  color: var(--muted);
}
.tb:hover:not(:disabled) {
  background: var(--hover);
  color: var(--win-fg);
}
.tb:disabled {
  opacity: 0.35;
}
</style>
