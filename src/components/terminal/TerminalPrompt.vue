<script setup lang="ts">
// The prompt prefix, shared by the input row and echoed commands.
// `bash` → khorn@portfolio:~$   `zsh` → khorn@portfolio ~ %
import { PROMPT_CWD, PROMPT_HOST, PROMPT_USER } from "../../terminal/commands";
withDefaults(defineProps<{ shell?: "bash" | "zsh" }>(), { shell: "bash" });
</script>

<template>
  <span class="whitespace-nowrap select-none">
    <span class="text-[#4ade80] font-semibold">{{ PROMPT_USER }}@{{ PROMPT_HOST }}</span
    ><template v-if="shell === 'zsh'">
      <span class="text-[#60a5fa] font-semibold">{{ PROMPT_CWD }}</span>
      <span class="text-white/60">%</span></template
    ><template v-else
      ><span class="text-white/60">:</span
      ><span class="text-[#60a5fa] font-semibold">{{ PROMPT_CWD }}</span
      ><span class="text-white/60">$</span></template
    >
  </span>
</template>
