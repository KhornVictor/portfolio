<script setup lang="ts">
// Admin → Photos: upload and remove images. Two tabs — profile pictures
// (the hero's cycling portrait) and general gallery pictures. Files go to
// Supabase Storage through the API; the list lives in the `photos` section.
import { computed, onMounted, ref } from "vue";
import { photos as api, type AdminPhoto, type PhotoKind } from "../../service/admin.service";

const TABS: { kind: PhotoKind; label: string; hint: string }[] = [
  { kind: "profile", label: "Profile pictures", hint: "Shown in the hero and cycled with the glitch effect. PNG with a transparent background looks best." },
  { kind: "gallery", label: "Gallery", hint: "General pictures." },
];

const kind = ref<PhotoKind>("profile");
const all = ref<AdminPhoto[]>([]);
const loading = ref(false);
const error = ref("");
const notice = ref("");
const uploading = ref<{ name: string; done: boolean; error?: string }[]>([]);
const pendingDelete = ref<AdminPhoto | null>(null);
const busyId = ref<string | null>(null);
const dragging = ref(false);
const fileInput = ref<HTMLInputElement | null>(null);

const list = computed(() => all.value.filter((p) => p.kind === kind.value));
const tab = computed(() => TABS.find((t) => t.kind === kind.value)!);

async function load() {
  loading.value = true;
  error.value = "";
  try {
    all.value = await api.list();
  } catch (e) {
    error.value = (e as Error).message;
  } finally {
    loading.value = false;
  }
}

function flash(msg: string) {
  notice.value = msg;
  setTimeout(() => (notice.value = ""), 2500);
}

async function addFiles(files: FileList | File[]) {
  const imgs = [...files].filter((f) => f.type.startsWith("image/"));
  if (!imgs.length) return;
  error.value = "";
  uploading.value = imgs.map((f) => ({ name: f.name, done: false }));
  await Promise.all(
    imgs.map(async (file, i) => {
      try {
        const created = await api.upload(file, kind.value);
        all.value.push(created);
      } catch (e) {
        uploading.value[i]!.error = (e as Error).message;
      } finally {
        uploading.value[i]!.done = true;
      }
    }),
  );
  const failed = uploading.value.filter((u) => u.error);
  if (failed.length) error.value = failed.map((f) => `${f.name}: ${f.error}`).join("\n");
  else flash(imgs.length === 1 ? "Uploaded" : `Uploaded ${imgs.length} photos`);
  uploading.value = [];
  if (fileInput.value) fileInput.value.value = "";
}

function onPick(e: Event) {
  const input = e.target as HTMLInputElement;
  if (input.files) void addFiles(input.files);
}

function onDrop(e: DragEvent) {
  dragging.value = false;
  if (e.dataTransfer?.files) void addFiles(e.dataTransfer.files);
}

async function remove(p: AdminPhoto) {
  busyId.value = p._id;
  error.value = "";
  try {
    await api.remove(p._id);
    all.value = all.value.filter((x) => x._id !== p._id);
    flash("Deleted");
  } catch (e) {
    error.value = (e as Error).message;
  } finally {
    busyId.value = null;
    pendingDelete.value = null;
  }
}

// Move a picture between the two tabs without re-uploading.
async function move(p: AdminPhoto, to: PhotoKind) {
  busyId.value = p._id;
  error.value = "";
  try {
    const updated = await api.update(p._id, { kind: to });
    all.value = all.value.map((x) => (x._id === p._id ? updated : x));
    flash(`Moved to ${TABS.find((t) => t.kind === to)!.label.toLowerCase()}`);
  } catch (e) {
    error.value = (e as Error).message;
  } finally {
    busyId.value = null;
  }
}

const other = (k: PhotoKind): PhotoKind => (k === "profile" ? "gallery" : "profile");

onMounted(load);
</script>

<template>
  <div class="flex flex-col gap-6">
    <!-- Tabs -->
    <div class="flex flex-wrap items-center justify-between gap-3">
      <div class="flex gap-1">
        <button
          v-for="t in TABS"
          :key="t.kind"
          type="button"
          class="rounded-full px-4 py-2 text-sm font-medium transition"
          :class="kind === t.kind ? 'bg-ink text-paper' : 'text-ink/55 hover:bg-ink/5 hover:text-ink'"
          @click="kind = t.kind; pendingDelete = null"
        >
          {{ t.label }}
          <span class="ml-1 text-[0.65rem] opacity-60">{{ all.filter((p) => p.kind === t.kind).length }}</span>
        </button>
      </div>
      <span v-if="notice" class="text-sm text-emerald-600">{{ notice }}</span>
    </div>

    <p v-if="error" class="whitespace-pre-line rounded-xl bg-rose-500/10 px-4 py-3 text-sm text-rose-600">{{ error }}</p>

    <!-- Drop zone -->
    <label
      class="drop flex cursor-pointer flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed px-6 py-10 text-center transition"
      :class="dragging ? 'border-ink bg-ink/5' : 'border-ink/15 hover:border-ink/40 hover:bg-ink/3'"
      @dragover.prevent="dragging = true"
      @dragleave="dragging = false"
      @drop.prevent="onDrop"
    >
      <i class="fa-solid fa-cloud-arrow-up text-2xl text-ink/50"></i>
      <span class="text-sm font-medium">Drop images here or click to choose</span>
      <span class="text-xs text-ink/50">{{ tab.hint }} PNG, JPG, WebP, GIF, AVIF · up to 8 MB each.</span>
      <input ref="fileInput" type="file" accept="image/*" multiple class="sr-only" @change="onPick" />
    </label>

    <!-- In-flight uploads -->
    <ul v-if="uploading.length" class="flex flex-col gap-1 text-xs text-ink/60">
      <li v-for="u in uploading" :key="u.name" class="flex items-center gap-2">
        <i class="fa-solid" :class="u.done ? (u.error ? 'fa-circle-xmark text-rose-500' : 'fa-circle-check text-emerald-500') : 'fa-spinner fa-spin'"></i>
        {{ u.name }}
      </li>
    </ul>

    <!-- Grid -->
    <p v-if="loading" class="text-sm text-ink/50">Loading…</p>
    <p v-else-if="!list.length" class="text-sm text-ink/50">No {{ tab.label.toLowerCase() }} yet.</p>
    <ul v-else class="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
      <li
        v-for="p in list"
        :key="p._id"
        class="group relative overflow-hidden rounded-2xl border border-ink/8 bg-surface/60"
        :class="{ 'opacity-50': busyId === p._id }"
      >
        <div class="checker aspect-square">
          <img :src="p.url" :alt="p.caption || ''" class="h-full w-full object-contain" loading="lazy" />
        </div>

        <!-- Hover actions -->
        <div
          class="absolute inset-x-0 bottom-0 flex items-center justify-between gap-2 bg-linear-to-t from-black/70 to-transparent p-2 opacity-0 transition group-focus-within:opacity-100 group-hover:opacity-100"
        >
          <template v-if="pendingDelete?._id === p._id">
            <span class="text-xs text-white">Delete?</span>
            <span class="flex gap-1">
              <button type="button" class="rounded-full bg-rose-600 px-3 py-1 text-xs text-white" :disabled="busyId === p._id" @click="remove(p)">Yes</button>
              <button type="button" class="rounded-full bg-white/20 px-3 py-1 text-xs text-white" @click="pendingDelete = null">No</button>
            </span>
          </template>
          <template v-else>
            <button
              type="button"
              class="rounded-full bg-white/20 px-3 py-1 text-xs text-white hover:bg-white/35"
              :title="`Move to ${other(p.kind)}`"
              :disabled="busyId === p._id"
              @click="move(p, other(p.kind))"
            >
              <i class="fa-solid fa-arrow-right-arrow-left mr-1"></i>{{ other(p.kind) }}
            </button>
            <button
              type="button"
              class="rounded-full bg-rose-600/90 px-3 py-1 text-xs text-white hover:bg-rose-600"
              aria-label="Delete photo"
              :disabled="busyId === p._id"
              @click="pendingDelete = p"
            >
              <i class="fa-solid fa-trash"></i>
            </button>
          </template>
        </div>
      </li>
    </ul>
  </div>
</template>

<style scoped>
/* Checkerboard behind transparent PNGs so the cut-out is visible */
.checker {
  background-color: var(--color-surface);
  background-image:
    linear-gradient(45deg, color-mix(in srgb, var(--color-ink) 6%, transparent) 25%, transparent 25%),
    linear-gradient(-45deg, color-mix(in srgb, var(--color-ink) 6%, transparent) 25%, transparent 25%),
    linear-gradient(45deg, transparent 75%, color-mix(in srgb, var(--color-ink) 6%, transparent) 75%),
    linear-gradient(-45deg, transparent 75%, color-mix(in srgb, var(--color-ink) 6%, transparent) 75%);
  background-size: 16px 16px;
  background-position: 0 0, 0 8px, 8px -8px, -8px 0;
}
</style>
