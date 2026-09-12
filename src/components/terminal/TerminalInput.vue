<script setup lang="ts">
import { ref, watch } from "vue";
import TerminalPrompt from "./TerminalPrompt.vue";

const props = withDefaults(
  defineProps<{ history: string[]; disabled?: boolean; shell?: "bash" | "zsh" }>(),
  { shell: "bash" },
);
const emit = defineEmits<{ submit: [value: string]; clear: [] }>();

const value = ref("");
const input = ref<HTMLInputElement | null>(null);
const focused = ref(false);

// -1 = editing a fresh line; otherwise an index into history (newest last).
const cursor = ref(-1);
const draft = ref("");
watch(
  () => props.history.length,
  () => (cursor.value = -1),
);

function focus() {
  input.value?.focus({ preventScroll: true });
}
defineExpose({ focus });

function onKeydown(e: KeyboardEvent) {
  if (e.key === "Enter") {
    e.preventDefault();
    emit("submit", value.value);
    value.value = "";
    cursor.value = -1;
    return;
  }
  if (e.key === "l" && e.ctrlKey) {
    e.preventDefault();
    emit("clear");
    return;
  }
  if (e.key === "c" && e.ctrlKey) {
    // ^C abandons the current line, like a real shell.
    e.preventDefault();
    value.value = "";
    cursor.value = -1;
    return;
  }

  const h = props.history;
  if (e.key === "ArrowUp") {
    e.preventDefault();
    if (!h.length) return;
    if (cursor.value === -1) draft.value = value.value;
    cursor.value = cursor.value === -1 ? h.length - 1 : Math.max(0, cursor.value - 1);
    value.value = h[cursor.value] ?? "";
  } else if (e.key === "ArrowDown") {
    e.preventDefault();
    if (cursor.value === -1) return;
    cursor.value = cursor.value + 1 >= h.length ? -1 : cursor.value + 1;
    value.value = cursor.value === -1 ? draft.value : (h[cursor.value] ?? "");
  }
}
</script>

<template>
  <div class="flex flex-wrap items-start gap-x-2" @click="focus">
    <TerminalPrompt :shell="shell" />
    <div class="relative min-w-[8ch] flex-1">
      <!-- Mirrored text + block cursor; the real input sits invisibly on top. -->
      <span class="whitespace-pre-wrap break-all text-white" aria-hidden="true">{{ value }}</span
      ><span
        class="cursor"
        :class="{ 'cursor--blink': focused, 'cursor--idle': !focused }"
        aria-hidden="true"
      ></span>
      <input
        ref="input"
        v-model="value"
        type="text"
        class="absolute inset-0 h-full w-full cursor-text bg-transparent text-transparent caret-transparent outline-none"
        autocomplete="off"
        autocapitalize="off"
        autocorrect="off"
        spellcheck="false"
        enterkeyhint="send"
        aria-label="Terminal command input"
        :disabled="disabled"
        @keydown="onKeydown"
        @focus="focused = true"
        @blur="focused = false"
      />
    </div>
  </div>
</template>

<style scoped>
.cursor {
  display: inline-block;
  width: 0.6em;
  height: 1.15em;
  margin-left: 1px;
  vertical-align: text-bottom;
  background: #e5e7eb;
  border-radius: 1px;
}
.cursor--idle {
  background: transparent;
  box-shadow: inset 0 0 0 1px rgba(229, 231, 235, 0.6);
}
.cursor--blink {
  animation: blink 1.1s steps(1, end) infinite;
}
@keyframes blink {
  50% {
    opacity: 0;
  }
}
</style>
