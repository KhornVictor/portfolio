<script setup lang="ts">
import { onMounted, ref } from "vue";
import { loadPortfolio, type Portfolio } from "../../service/portfolio.service";
import TerminalWindow from "../terminal/TerminalWindow.vue";

const data = ref<Portfolio | null>(null);

onMounted(async () => {
  document.title = "khorn@portfolio: ~/terminal";
  try {
    data.value = await loadPortfolio();
  } catch (e) {
    console.error(e);
  }
});

function navigate(to: string) {
  window.location.assign(to);
}
</script>

<template>
  <!-- Dark "desktop" the terminal sits on -->
  <div class="desktop fixed inset-0 overflow-hidden">
    <div class="desktop-glow pointer-events-none absolute inset-0"></div>

    <main
      class="relative flex h-full w-screen items-center justify-center"
    >
      <TerminalWindow :portfolio="data" class="flex-1" @navigate="navigate" />
    </main>
  </div>
</template>

<style scoped>
.desktop {
  background-color: #0b0c0f;
  background-image:
    radial-gradient(
      80% 60% at 20% 10%,
      rgba(34, 211, 238, 0.07) 0%,
      transparent 60%
    ),
    radial-gradient(
      70% 60% at 85% 90%,
      rgba(192, 132, 252, 0.07) 0%,
      transparent 60%
    ),
    linear-gradient(180deg, #101217 0%, #0a0b0e 100%);
}
.desktop-glow {
  background-image: radial-gradient(
    rgba(255, 255, 255, 0.035) 1px,
    transparent 1px
  );
  background-size: 22px 22px;
  mask-image: radial-gradient(70% 70% at 50% 50%, #000 30%, transparent 100%);
  -webkit-mask-image: radial-gradient(
    70% 70% at 50% 50%,
    #000 30%,
    transparent 100%
  );
}
</style>
