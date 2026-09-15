<script setup lang="ts">
// Admin tab: mint share links for the private /main page.
// Laid out like a Postman request: pick the params, hit Send, read the
// response, copy the resulting URL.
import { computed, ref } from "vue";
import { createAccessLink, type AccessLink } from "../../service/admin.service";
import { buildAccessUrl } from "../../service/access.service";
import { env } from "../../config/env.config";

const API_URL = env.publicApiUrl;

const days = ref(7);
const path = ref("/main");
const sending = ref(false);
const error = ref("");
const result = ref<AccessLink | null>(null);
const copied = ref<"url" | "token" | null>(null);

// Previous links minted in this session, newest first.
const history = ref<(AccessLink & { url: string; createdAt: number })[]>([]);

const shareUrl = computed(() => (result.value ? buildAccessUrl(result.value.token, path.value) : ""));
const requestBody = computed(() => JSON.stringify({ days: days.value }, null, 2));
const responseBody = computed(() => (result.value ? JSON.stringify(result.value, null, 2) : ""));

const fmtDate = (ms: number) =>
  new Date(ms).toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short" });

async function send() {
  sending.value = true;
  error.value = "";
  copied.value = null;
  try {
    result.value = await createAccessLink(days.value);
    history.value.unshift({ ...result.value, url: shareUrl.value, createdAt: Date.now() });
  } catch (e) {
    error.value = (e as Error).message;
  } finally {
    sending.value = false;
  }
}

async function copy(text: string, what: "url" | "token") {
  try {
    await navigator.clipboard.writeText(text);
    copied.value = what;
    setTimeout(() => (copied.value = null), 1800);
  } catch {
    error.value = "Clipboard unavailable — select the text and copy it manually.";
  }
}

function selectAll(e: FocusEvent) {
  (e.target as HTMLInputElement).select();
}
</script>

<template>
  <div class="flex flex-col gap-6">

    <!-- Request -->
    <section class="rounded-2xl">
      <div class="flex flex-wrap items-center gap-2 border-b border-ink/5 p-3">
        <span class="rounded-md bg-amber-500/15 px-2 py-1 font-mono text-xs font-semibold text-amber-700 dark:text-amber-300">POST</span>
        <code class="min-w-0 flex-1 truncate font-mono text-sm text-ink/80">{{ API_URL }}/api/auth/access-link</code>
        <button type="button" class="btn btn-dark py-2! text-sm" :disabled="sending" @click="send">
          {{ sending ? "Sending…" : "Send" }}
        </button>
      </div>

      <div class="grid gap-4 p-4 sm:grid-cols-2">
        <label class="flex flex-col gap-1 text-sm">
          <span class="font-medium">Expires in (days)</span>
          <input
            v-model.number="days"
            type="number"
            min="1"
            max="90"
            class="rounded-xl border border-ink/10 bg-surface px-3 py-2 outline-none focus:border-ink"
          />
        </label>
        <label class="flex flex-col gap-1 text-sm">
          <span class="font-medium">Page</span>
          <input
            v-model="path"
            type="text"
            class="rounded-xl border border-ink/10 bg-surface px-3 py-2 font-mono outline-none focus:border-ink"
          />
        </label>

        <div class="sm:col-span-2">
          <p class="mb-1 text-xs font-medium uppercase tracking-wide text-ink/45">Body · JSON</p>
          <pre class="overflow-x-auto rounded-xl bg-ink p-3 font-mono text-xs leading-relaxed text-paper/90">{{ requestBody }}</pre>
        </div>
      </div>
    </section>

    <p v-if="error" class="rounded-xl bg-rose-500/10 px-4 py-3 text-sm text-rose-600">{{ error }}</p>

    <!-- Response -->
    <section v-if="result" class="">
      <div class="flex flex-wrap items-center gap-2 border-b border-ink/5 p-3">
        <span class="text-sm font-medium">Response</span>
        <span class="rounded-md bg-emerald-500/15 px-2 py-0.5 font-mono text-xs font-semibold text-emerald-700 dark:text-emerald-300">200 OK</span>
        <span class="ml-auto text-xs text-ink/50">expires {{ fmtDate(result.expiresAt) }}</span>
      </div>

      <div class="flex flex-col gap-4 p-4">
        <div>
          <div class="mb-1 flex items-center justify-between">
            <p class="text-xs font-medium uppercase tracking-wide text-ink/45">Share URL</p>
            <button type="button" class="text-xs text-ink/60 hover:text-ink" @click="copy(shareUrl, 'url')">
              {{ copied === "url" ? "Copied ✓" : "Copy" }}
            </button>
          </div>
          <input
            :value="shareUrl"
            readonly
            class="w-full rounded-xl border border-ink/10 bg-surface px-3 py-2 font-mono text-xs outline-none focus:border-ink"
            @focus="selectAll"
          />
        </div>

        <div>
          <div class="mb-1 flex items-center justify-between">
            <p class="text-xs font-medium uppercase tracking-wide text-ink/45">Body · JSON</p>
            <button type="button" class="text-xs text-ink/60 hover:text-ink" @click="copy(result.token, 'token')">
              {{ copied === "token" ? "Copied ✓" : "Copy token" }}
            </button>
          </div>
          <pre class="overflow-x-auto rounded-xl bg-ink p-3 font-mono text-xs leading-relaxed text-paper/90">{{ responseBody }}</pre>
        </div>
      </div>
    </section>

    <!-- Session history -->
    <section v-if="history.length > 1">
      <p class="mb-2 text-xs font-medium uppercase tracking-wide text-ink/45">Generated this session</p>
      <ul class="divide-y divide-ink/5 rounded-2xl border border-ink/8 bg-surface/60">
        <li v-for="h in history" :key="h.token" class="flex flex-wrap items-center gap-3 px-4 py-2.5 text-sm">
          <span class="text-ink/60">{{ fmtDate(h.createdAt) }}</span>
          <span class="text-xs text-ink/45">→ expires {{ fmtDate(h.expiresAt) }} ({{ h.days }}d)</span>
          <button type="button" class="ml-auto text-xs text-ink/60 hover:text-ink" @click="copy(h.url, 'url')">
            Copy URL
          </button>
        </li>
      </ul>
    </section>
  </div>
</template>
