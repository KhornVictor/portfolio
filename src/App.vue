<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from "vue";
import Home from "./components/layout/Home.vue";
import TerminalPage from "./components/layout/TerminalPage.vue";
import MacOSPage from "./components/layout/MacOSPage.vue";

// Tiny path-based switch — only a handful of pages, so a router is overkill.
const path = ref(window.location.pathname);
const onPop = () => (path.value = window.location.pathname);
onMounted(() => window.addEventListener("popstate", onPop));
onBeforeUnmount(() => window.removeEventListener("popstate", onPop));

const route = computed(() => path.value.replace(/\/+$/, "") || "/");
</script>

<template>
  <TerminalPage v-if="route === '/terminal'" />
  <MacOSPage v-else-if="route === '/macos'" />
  <Home v-else />
</template>
