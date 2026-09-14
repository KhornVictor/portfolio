<script setup lang="ts">
// /main — the full portfolio, read-only. Gated behind an access token
// (see access.service.ts): open /main?token=... from a link minted in /admin.
import { onMounted, ref } from "vue";
import Home from "../../components/layout/Home.vue";
import { resolveAccess, type AccessCheck } from "../../service/access.service";

const state = ref<"checking" | "ok" | "denied" | "error">("checking");
const check = ref<AccessCheck | null>(null);

onMounted(async () => {
  try {
    check.value = await resolveAccess();
    state.value = check.value.valid ? "ok" : "denied";
  } catch (e) {
    console.error(e);
    state.value = "error";
  }
});

const reasonText: Record<string, string> = {
  missing: "This page is private. You need a link.",
  expired: "This access link has expired. Ask for a new one.",
  invalid: "This access link isn't valid. Check that you copied the whole URL.",
};
</script>

<template>
  <Home v-if="state === 'ok'" view="main" />

  <div v-else class="grid min-h-screen place-items-center px-4">
    <p v-if="state === 'checking'" class="text-ink/50">Checking access…</p>

    <div v-else class="panel w-full max-w-md rounded-3xl p-8 text-center">
      <h1 class="display text-2xl">
        {{ state === "error" ? "Something went wrong" : "Access required" }}
      </h1>
      <p class="mt-3 text-sm leading-relaxed text-ink/60">
        <template v-if="state === 'error'">Couldn't verify your access link. Please try again later.</template>
        <template v-else>{{ reasonText[check && !check.valid ? check.reason : "missing"] }}</template>
      </p>
      <a href="/" class="btn btn-dark mt-6 justify-center">Back to site</a>
    </div>
  </div>
</template>
