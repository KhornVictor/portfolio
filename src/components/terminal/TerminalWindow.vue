<script setup lang="ts">
import { nextTick, onMounted, ref } from "vue";
import type { Portfolio } from "../../service/portfolio.service";
import { PROMPT_HOST, PROMPT_USER, runCommand } from "../../terminal/commands";
import type { TerminalEntry } from "../../terminal/types";
import TerminalHeader from "./TerminalHeader.vue";
import TerminalInput from "./TerminalInput.vue";
import TerminalOutput from "./TerminalOutput.vue";

const props = defineProps<{ portfolio: Portfolio | null }>();
const emit = defineEmits<{ navigate: [to: string] }>();

const title = `${PROMPT_USER}@${PROMPT_HOST}: ~/terminal`;

let nextId = 0;
const entries = ref<TerminalEntry[]>([]);
const history = ref<string[]>([]);
const scroller = ref<HTMLElement | null>(null);
const input = ref<InstanceType<typeof TerminalInput> | null>(null);

function push(command: string | null, lines: TerminalEntry["lines"]) {
  entries.value.push({ id: nextId++, command, lines });
  scrollToBottom();
}

async function scrollToBottom() {
  await nextTick();
  const el = scroller.value;
  if (el) el.scrollTop = el.scrollHeight;
}

function execute(raw: string) {
  const cmd = raw.trim();
  if (!cmd) {
    push("", []);
    return;
  }
  history.value.push(cmd);

  const result = runCommand(cmd, {
    portfolio: props.portfolio,
    history: history.value,
  });

  if (result.action?.type === "clear") {
    entries.value = [];
    return;
  }
  push(cmd, result.lines);
  if (result.action?.type === "navigate") {
    const to = result.action.to;
    window.setTimeout(() => emit("navigate", to), 350);
  }
}

function clear() {
  entries.value = [];
}

function focusInput(e: MouseEvent) {
  // Don't steal focus from links or text selections inside the output.
  if ((e.target as HTMLElement).closest("a")) return;
  if (window.getSelection()?.toString()) return;
  input.value?.focus();
}

onMounted(() => {
  // Boot sequence: mimic the user having just run `fastfetch`.
  push("fastfetch", [{ kind: "fastfetch" }]);
  push(null, [
    {
      kind: "text",
      segments: [
        { text: "Welcome to the portfolio terminal. Type ", tone: "muted" },
        { text: "help", tone: "cmd" },
        { text: " to get started.", tone: "muted" },
      ],
    },
  ]);
  input.value?.focus();
});
</script>

<template>
  <div
    class="term-window flex w-full h-screen flex-col overflow-hidden border border-white/8 text-[13px] leading-normal text-white/85 sm:text-[13.5px]"
    @click="focusInput"
  >
    <TerminalHeader :title="title" @close="emit('navigate', '/')" />

    <div
      ref="scroller"
      class="term-body min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 py-4 sm:px-6 sm:py-5"
    >
      <TerminalOutput :entries="entries" :portfolio="portfolio" />
      <div class="mt-3">
        <TerminalInput ref="input" :history="history" @submit="execute" @clear="clear" />
      </div>
    </div>
  </div>
</template>

<style scoped>
.term-window {
  font-family: "JetBrains Mono", "Fira Code", ui-monospace, SFMono-Regular, Menlo,
    Consolas, monospace;
  font-variant-ligatures: none;
  background: rgba(16, 17, 21, 0.82);
  backdrop-filter: blur(18px) saturate(140%);
  -webkit-backdrop-filter: blur(18px) saturate(140%);
  box-shadow:
    0 40px 100px -30px rgba(0, 0, 0, 0.8),
    0 0 0 1px rgba(0, 0, 0, 0.4),
    0 0 60px -20px rgba(34, 211, 238, 0.18),
    inset 0 1px 0 rgba(255, 255, 255, 0.06);
  animation: window-in 0.55s cubic-bezier(0.2, 0.7, 0.2, 1) both;
}
@keyframes window-in {
  from {
    opacity: 0;
    transform: translateY(18px) scale(0.985);
  }
  to {
    opacity: 1;
    transform: none;
  }
}

.term-body {
  scrollbar-width: thin;
  scrollbar-color: rgba(255, 255, 255, 0.12) transparent;
}
.term-body::-webkit-scrollbar {
  width: 8px;
}
.term-body::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.12);
  border-radius: 999px;
}

@media (prefers-reduced-motion: reduce) {
  .term-window {
    animation: none;
  }
}
</style>
