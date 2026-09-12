<script setup lang="ts">
// Launchpad / Spotlight-style overlay. On phones it replaces the desktop icons;
// on desktop it's opened from the menu bar search icon (⌘ Space).
import { computed, onMounted, ref } from "vue";
import { apps } from "../../desktop/apps";
import { useWindowManager } from "../../desktop/useWindowManager";
import type { AppId } from "../../desktop/types";
import AppIcon from "./AppIcon.vue";

const props = defineProps<{ overlay?: boolean }>();
const emit = defineEmits<{ close: [] }>();
const wm = useWindowManager();

const query = ref("");
const input = ref<HTMLInputElement | null>(null);
const list = computed(() =>
  apps.filter((a) => a.dock && a.name.toLowerCase().includes(query.value.trim().toLowerCase())),
);

function launch(id: AppId) {
  wm.open(id);
  emit("close");
}

onMounted(() => {
  if (props.overlay) input.value?.focus();
});
</script>

<template>
  <div
    class="launcher"
    :class="{ 'launcher--overlay': overlay }"
    @click.self="emit('close')"
    @keydown.esc="emit('close')"
  >
    <div class="mx-auto w-full max-w-3xl px-5 pt-6">
      <div class="search mb-8">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" aria-hidden="true"><circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" /></svg>
        <input
          ref="input"
          v-model="query"
          type="search"
          placeholder="Search"
          aria-label="Search applications"
          @keydown.enter="list[0] && launch(list[0].id)"
        />
      </div>

      <div class="grid grid-cols-4 gap-x-2 gap-y-6 sm:grid-cols-5 md:grid-cols-6">
        <button
          v-for="app in list"
          :key="app.id"
          class="flex flex-col items-center gap-2 rounded-xl p-2 text-[12px] text-white transition active:scale-95"
          @click="launch(app.id)"
        >
          <AppIcon :name="app.id" :size="60" />
          <span class="[text-shadow:0_1px_2px_rgba(0,0,0,.6)]">{{ app.name }}</span>
        </button>
      </div>
      <p v-if="!list.length" class="text-center text-sm text-white/60">No results for “{{ query }}”</p>
    </div>
  </div>
</template>

<style scoped>
.launcher {
  position: absolute;
  inset: 0;
  overflow-y: auto;
  padding-bottom: 110px;
}
.launcher--overlay {
  z-index: 1500;
  background: rgba(10, 12, 20, 0.55);
  backdrop-filter: blur(24px) saturate(140%);
  -webkit-backdrop-filter: blur(24px) saturate(140%);
  animation: fade 0.15s ease-out;
}
@keyframes fade {
  from {
    opacity: 0;
  }
}
.search {
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 0 auto;
  max-width: 320px;
  padding: 6px 12px;
  border-radius: 10px;
  color: rgba(255, 255, 255, 0.7);
  background: rgba(255, 255, 255, 0.12);
  border: 1px solid rgba(255, 255, 255, 0.18);
}
.search input {
  flex: 1;
  background: transparent;
  outline: none;
  color: #fff;
  font-size: 14px;
}
.search input::placeholder {
  color: rgba(255, 255, 255, 0.5);
}
</style>
