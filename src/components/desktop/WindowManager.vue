<script setup lang="ts">
// Renders every open window and mounts the right app inside it.
import type { Component } from "vue";
import { useWindowManager } from "../../desktop/useWindowManager";
import type { AppId } from "../../desktop/types";
import Window from "./Window.vue";
import FinderApp from "../apps/FinderApp.vue";
import TerminalApp from "../apps/TerminalApp.vue";
import SafariApp from "../apps/SafariApp.vue";
import NotesApp from "../apps/NotesApp.vue";
import SettingsApp from "../apps/SettingsApp.vue";
import ActivityMonitorApp from "../apps/ActivityMonitorApp.vue";
import MailApp from "../apps/MailApp.vue";
import CalendarApp from "../apps/CalendarApp.vue";
import TrashApp from "../apps/TrashApp.vue";
import PhotosApp from "../apps/PhotosApp.vue";
import TextEditApp from "../apps/TextEditApp.vue";

const wm = useWindowManager();

const components: Record<AppId, Component> = {
  finder: FinderApp,
  terminal: TerminalApp,
  safari: SafariApp,
  notes: NotesApp,
  settings: SettingsApp,
  activity: ActivityMonitorApp,
  mail: MailApp,
  calendar: CalendarApp,
  trash: TrashApp,
  photos: PhotosApp,
  textedit: TextEditApp,
};
</script>

<template>
  <div class="pointer-events-none absolute inset-0">
    <template v-for="win in wm.windows.value" :key="win.id">
      <Transition name="win" :css="true">
        <Window
          v-if="!win.minimized && !win.closing"
          :win="win"
          :active="wm.active.value?.id === win.id"
          class="pointer-events-auto"
        >
          <component :is="components[win.app]" :win="win" />
        </Window>
      </Transition>
    </template>
  </div>
</template>

<style>
/* Open: gentle scale up. Close/minimise: shrink toward the Dock. */
.win-enter-active {
  transition:
    opacity 0.22s ease-out,
    scale 0.22s cubic-bezier(0.2, 0.7, 0.2, 1);
}
.win-leave-active {
  transition:
    opacity 0.2s ease-in,
    scale 0.2s ease-in,
    translate 0.2s ease-in;
  pointer-events: none !important;
}
.win-enter-from {
  opacity: 0;
  scale: 0.94;
}
.win-leave-to {
  opacity: 0;
  scale: 0.7;
  translate: 0 40vh;
}
.reduce-motion .win-enter-active,
.reduce-motion .win-leave-active {
  transition-duration: 0.01s;
}
</style>
