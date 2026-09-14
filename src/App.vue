<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from "vue";
import MainPage from "./pages/main/main.page.vue";
import ClientPage from "./pages/client/client.page.vue";
import AdminPage from "./pages/admin/admin.page.vue";
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
  <AdminPage v-else-if="route === '/admin'" />
  <MainPage v-else-if="route === '/main'" />
  <ClientPage v-else />
</template>
