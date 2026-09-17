<script setup lang="ts">
// Terminal inside the macOS desktop. Reuses the /terminal command engine and
// output/input components; adds `open <app>` via the window manager.
import { nextTick, onMounted, ref } from "vue";
import { runCommand } from "../../pages/terminal/commands";
import type { TerminalEntry } from "../../pages/terminal/types";
import { resolveAppId } from "../../pages/desktop/apps";
import { usePortfolio } from "../../pages/desktop/usePortfolio";
import { useWindowManager } from "../../pages/desktop/useWindowManager";
import type { WindowState } from "../../pages/desktop/types";
import TerminalInput from "../terminal/TerminalInput.vue";
import TerminalOutput from "../terminal/TerminalOutput.vue";

const props = defineProps<{ win: WindowState }>();
const wm = useWindowManager();
const portfolio = usePortfolio();

let nextId = 0;
const entries = ref<TerminalEntry[]>([]);
const history = ref<string[]>([]);
const scroller = ref<HTMLElement | null>(null);
const input = ref<InstanceType<typeof TerminalInput> | null>(null);

function push(command: string | null, lines: TerminalEntry["lines"]) {
  entries.value.push({ id: nextId++, command, lines });
  nextTick(() => {
    if (scroller.value) scroller.value.scrollTop = scroller.value.scrollHeight;
  });
}

function openApp(name: string) {
  const id = resolveAppId(name);
  if (!id) return false;
  wm.open(id);
  return true;
}

function execute(raw: string) {
  const cmd = raw.trim();
  if (!cmd) return push("", []);
  history.value.push(cmd);
  const result = runCommand(cmd, { portfolio: portfolio.value, history: history.value, openApp });
  if (result.action?.type === "clear") return (entries.value = []);
  push(cmd, result.lines);
  if (result.action?.type === "navigate") {
    // "home"/"exit" inside the desktop just closes the window.
    window.setTimeout(() => wm.close(props.win.id), 300);
  }
}

function focus(e: MouseEvent) {
  if ((e.target as HTMLElement).closest("a")) return;
  if (window.getSelection()?.toString()) return;
  input.value?.focus();
}

onMounted(() => {
  props.win.title = "Terminal — khorn@portfolio";
  push("fastfetch", [{ kind: "fastfetch" }]);
  push(null, [
    {
      kind: "text",
      segments: [
        { text: "Type ", tone: "muted" },
        { text: "help", tone: "cmd" },
        { text: " for commands, or ", tone: "muted" },
        { text: "open finder", tone: "cmd" },
        { text: " to launch apps.", tone: "muted" },
      ],
    },
  ]);
  nextTick(() => input.value?.focus());
});
</script>

<template>
  <div
    ref="scroller"
    class="term h-full overflow-y-auto px-4 py-3 font-mono text-[12.5px] leading-[1.55] text-white/85 sm:text-[13px]"
    @click="focus"
  >
    <TerminalOutput :entries="entries" :portfolio="portfolio" shell="zsh" fastfetch="mac" />
    <div class="mt-2">
      <TerminalInput ref="input" :history="history" shell="zsh" @submit="execute" @clear="entries = []" />
    </div>
  </div>
</template>

<style scoped>
.term {
  font-family: "JetBrains Mono", "Fira Code", ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
  background: rgba(12, 12, 16, 0.72);
  scrollbar-width: thin;
  scrollbar-color: rgba(255, 255, 255, 0.15) transparent;
}
</style>
