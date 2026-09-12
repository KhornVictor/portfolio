<script setup lang="ts">
// Desktop right-click menu. Positioned at the pointer, clamped to the viewport.
import { computed } from "vue";

export interface ContextItem {
  label?: string;
  action?: () => void;
  disabled?: boolean;
  sep?: boolean;
}

const props = defineProps<{ x: number; y: number; items: ContextItem[] }>();
const emit = defineEmits<{ close: [] }>();

const style = computed(() => ({
  left: Math.min(props.x, window.innerWidth - 230) + "px",
  top: Math.min(props.y, window.innerHeight - 40 - props.items.length * 28) + "px",
}));

function run(item: ContextItem) {
  if (item.disabled || item.sep) return;
  item.action?.();
  emit("close");
}
</script>

<template>
  <div class="ctx" :style="style" role="menu" @contextmenu.prevent>
    <template v-for="(item, i) in items" :key="i">
      <div v-if="item.sep" class="ctx-sep"></div>
      <button v-else class="ctx-item" role="menuitem" :disabled="item.disabled" @click="run(item)">
        {{ item.label }}
      </button>
    </template>
  </div>
</template>

<style scoped>
.ctx {
  position: fixed;
  z-index: 3000;
  min-width: 210px;
  padding: 5px;
  border-radius: 10px;
  background: var(--menu-bg);
  border: 1px solid var(--menu-border);
  color: var(--menu-fg);
  box-shadow: 0 16px 40px -8px rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(30px) saturate(180%);
  -webkit-backdrop-filter: blur(30px) saturate(180%);
  animation: ctx-in 0.1s ease-out;
  font-size: 13px;
}
@keyframes ctx-in {
  from {
    opacity: 0;
    scale: 0.97;
  }
}
.ctx-item {
  display: block;
  width: 100%;
  text-align: left;
  padding: 4px 10px;
  border-radius: 6px;
}
.ctx-item:hover:not(:disabled) {
  background: #2f7cf6;
  color: #fff;
}
.ctx-item:disabled {
  opacity: 0.4;
}
.ctx-sep {
  height: 1px;
  margin: 5px 8px;
  background: var(--menu-border);
}
</style>
