<script setup lang="ts">
// /admin — password-protected editor for every portfolio section.
import { computed, onMounted, ref, watch } from "vue";
import { admin, checkSession, login, logout, type WithId } from "../../service/admin.service";
import { SECTIONS, getPath, type Doc, type SectionDef } from "./sections";
import RecordForm from "./RecordForm.vue";
import AccessLinks from "./AccessLinks.vue";

type Item = WithId<Doc>;

// ---- auth ----
const authed = ref<boolean | null>(null); // null = checking
const password = ref("");
const loginError = ref("");
const loggingIn = ref(false);

onMounted(async () => {
  authed.value = await checkSession();
});

async function onLogin() {
  loggingIn.value = true;
  loginError.value = "";
  try {
    await login(password.value);
    password.value = "";
    authed.value = true;
  } catch (e) {
    loginError.value = (e as Error).message;
  } finally {
    loggingIn.value = false;
  }
}

function onLogout() {
  logout();
  authed.value = false;
}

// ---- section state ----
// Tools live next to the data sections in the sidebar but don't hit the CRUD API.
const TOOLS = [{ name: "access-links", label: "Access links" }] as const;
type ToolName = (typeof TOOLS)[number]["name"];
const activeTool = ref<ToolName | null>(null);

const active = ref<SectionDef>(SECTIONS[0]!);
const loading = ref(false);
const saving = ref(false);
const error = ref("");
const notice = ref("");

const single = ref<Item | null>(null); // single-doc sections
const items = ref<Item[]>([]); // list sections
const editing = ref<Item | null>(null); // item being edited (list sections)
const adding = ref(false);

const title = (item: Item) => String(getPath(item, active.value.titleKey ?? "title") ?? "(untitled)");

async function load() {
  loading.value = true;
  error.value = "";
  editing.value = null;
  adding.value = false;
  try {
    if (active.value.single) {
      single.value = await admin.list<Item | null>(active.value.name);
    } else {
      items.value = await admin.list<Item[]>(active.value.name);
    }
  } catch (e) {
    handleError(e);
  } finally {
    loading.value = false;
  }
}

watch(authed, (ok) => ok && load());
watch(active, load);

function handleError(e: unknown) {
  const msg = (e as Error).message;
  if (/unauthorized/i.test(msg)) authed.value = false;
  error.value = msg;
}

function flash(msg: string) {
  notice.value = msg;
  setTimeout(() => (notice.value = ""), 2500);
}

async function run(action: () => Promise<void>, ok: string) {
  saving.value = true;
  error.value = "";
  try {
    await action();
    flash(ok);
  } catch (e) {
    handleError(e);
  } finally {
    saving.value = false;
  }
}

const saveSingle = (doc: Doc) =>
  run(async () => {
    single.value = await admin.replaceSingle<Doc>(active.value.name, doc);
  }, "Saved");

const createItem = (doc: Doc) =>
  run(async () => {
    const created = await admin.create<Doc>(active.value.name, doc);
    items.value.push(created);
    adding.value = false;
  }, "Added");

const updateItem = (doc: Doc) =>
  run(async () => {
    const id = editing.value!._id;
    const updated = await admin.update<Doc>(active.value.name, id, doc);
    items.value = items.value.map((it) => (it._id === id ? updated : it));
    editing.value = null;
  }, "Updated");

const removeItem = (item: Item) =>
  run(async () => {
    await admin.remove(active.value.name, item._id);
    items.value = items.value.filter((it) => it._id !== item._id);
    if (editing.value?._id === item._id) editing.value = null;
  }, "Deleted");

const pendingDelete = ref<Item | null>(null);

const heading = computed(
  () => (activeTool.value && TOOLS.find((t) => t.name === activeTool.value)?.label) || active.value.label,
);
</script>

<template>
  <div class="min-h-screen px-4 py-6 sm:px-8">
    <!-- Checking stored session -->
    <div v-if="authed === null" class="grid min-h-[60vh] place-items-center text-ink/50">
      Checking session…
    </div>

    <!-- Login -->
    <div v-else-if="!authed" class="grid min-h-[80vh] place-items-center">
      <form class="panel w-full max-w-sm rounded-3xl p-8 flex flex-col" @submit.prevent="onLogin">
        <h1 class="display text-2xl">Admin</h1>
        <input
          v-model="password"
          type="password"
          autocomplete="current-password"
          placeholder="Password"
          required
          class="mt-6 w-full rounded-xl border border-ink/10 bg-surface px-3 py-2.5 outline-none focus:border-ink"
        />
        <p v-if="loginError" class="mt-2 text-sm text-rose-600">{{ loginError }}</p>
        <button type="submit" class="btn btn-dark mt-4 w-full justify-center" :disabled="loggingIn">
          {{ loggingIn ? "Signing in…" : "Sign in" }}
        </button>
        <a href="/" class="mt-4 block text-center text-xs text-ink/45 hover:text-ink"><i class="fas fa-arrow-left"></i>Back to site</a>
      </form>
    </div>

    <!-- Editor -->
    <!-- On lg+ both cards fill the viewport minus the page py-6 (3rem); main scrolls inside. -->
    <div v-else class="mx-auto grid max-w-full gap-6 lg:h-[calc(100vh-3rem)] lg:grid-cols-[220px_1fr]">
      <aside class="panel flex flex-col overflow-y-auto rounded-3xl p-4">
        <div class="mb-3 flex items-center justify-between px-2">
          <span class="display text-lg">Admin</span>
          <button type="button" class="text-xs text-ink/50 hover:text-ink" @click="onLogout">Sign out</button>
        </div>
        <nav class="flex flex-row flex-wrap gap-1 lg:flex-col">
          <button
            v-for="s in SECTIONS"
            :key="s.name"
            type="button"
            class="rounded-full px-3 py-2 text-left text-sm font-medium transition lg:rounded-xl"
            :class="!activeTool && active.name === s.name ? 'bg-ink text-paper' : 'text-ink/60 hover:bg-ink/5 hover:text-ink'"
            @click="active = s; activeTool = null"
          >
            {{ s.label }}
          </button>
        </nav>
        <p class="mt-4 mb-1 px-2 text-[0.65rem] font-medium uppercase tracking-wide text-ink/40">Tools</p>
        <nav class="flex flex-row flex-wrap gap-1 lg:flex-col">
          <button
            v-for="t in TOOLS"
            :key="t.name"
            type="button"
            class="rounded-full px-3 py-2 text-left text-sm font-medium transition lg:rounded-xl"
            :class="activeTool === t.name ? 'bg-ink text-paper' : 'text-ink/60 hover:bg-ink/5 hover:text-ink'"
            @click="activeTool = t.name"
          >
            {{ t.label }}
          </button>
        </nav>
        <div class="mt-4 flex flex-col gap-1 border-t border-ink/5 px-2 pt-3 text-xs text-ink/45">
          <a href="/main" target="_blank" class="hover:text-ink">View /main ↗</a>
          <a href="/client" target="_blank" class="hover:text-ink">View /client ↗</a>
        </div>
      </aside>

      <main class="panel min-h-0 overflow-y-auto rounded-3xl p-5 sm:p-8">
        <div class="mb-6 flex flex-wrap items-center justify-between gap-3">
          <h1 class="display text-2xl">{{ heading }}</h1>
          <div class="flex items-center gap-3">
            <span v-if="notice" class="text-sm text-emerald-600">{{ notice }}</span>
            <button
              v-if="!activeTool && !active.single && !adding"
              type="button"
              class="btn btn-dark py-2! text-sm"
              @click="adding = true; editing = null"
            >
              + Add
            </button>
          </div>
        </div>

        <p v-if="error && !activeTool" class="mb-4 rounded-xl bg-rose-500/10 px-4 py-3 text-sm text-rose-600">{{ error }}</p>

        <!-- Tools -->
        <AccessLinks v-if="activeTool === 'access-links'" />

        <p v-else-if="loading" class="text-sm text-ink/50">Loading…</p>

        <!-- Single-document sections -->
        <RecordForm
          v-else-if="active.single"
          :def="active"
          :doc="single"
          :saving="saving"
          @submit="saveSingle"
        />

        <!-- List sections -->
        <template v-else>
          <div v-if="adding" class="mb-8 rounded-2xl border border-ink/8 bg-surface/60 p-5">
            <h2 class="mb-4 font-semibold">New {{ active.label.replace(/s$/, "").toLowerCase() }}</h2>
            <RecordForm :def="active" :doc="{}" :saving="saving" submit-label="Add" @submit="createItem" @cancel="adding = false" />
          </div>

          <p v-if="!items.length && !adding" class="text-sm text-ink/50">Nothing here yet.</p>

          <ul class="divide-y divide-ink/5">
            <li v-for="item in items" :key="item._id" class="py-3">
              <div class="flex items-center justify-between gap-3">
                <span class="font-medium">{{ title(item) }}</span>
                <div class="flex shrink-0 gap-2 text-sm">
                  <button
                    type="button"
                    class="rounded-full px-3 py-1 text-ink/60 hover:bg-ink/5 hover:text-ink"
                    @click="editing = editing?._id === item._id ? null : item; adding = false"
                  >
                    {{ editing?._id === item._id ? "Close" : "Edit" }}
                  </button>
                  <button
                    v-if="pendingDelete?._id !== item._id"
                    type="button"
                    class="rounded-full px-3 py-1 text-rose-600 hover:bg-rose-500/10"
                    @click="pendingDelete = item"
                  >
                    Delete
                  </button>
                  <template v-else>
                    <button type="button" class="rounded-full bg-rose-600 px-3 py-1 text-white" :disabled="saving" @click="removeItem(item); pendingDelete = null">
                      Confirm
                    </button>
                    <button type="button" class="rounded-full px-3 py-1 text-ink/60 hover:bg-ink/5" @click="pendingDelete = null">
                      Cancel
                    </button>
                  </template>
                </div>
              </div>
              <div v-if="editing?._id === item._id" class="mt-4 rounded-2xl border border-ink/8 bg-surface/60 p-5">
                <RecordForm :def="active" :doc="editing" :saving="saving" @submit="updateItem" @cancel="editing = null" />
              </div>
            </li>
          </ul>
        </template>
      </main>
    </div>
  </div>
</template>
