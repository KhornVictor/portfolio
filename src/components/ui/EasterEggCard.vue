<script setup lang="ts">
// Modal shown when the "NITH" easter egg is triggered on the hero name.
// 1. Asks the API to email a 6-digit PIN to the site owner.
// 2. Takes the PIN, verifies it, and redirects to /main with a 1-hour token.
import { computed, nextTick, onBeforeUnmount, onMounted, ref } from "vue";
import {
  buildAccessUrl,
  requestEasterEggPin,
  verifyEasterEggPin,
  type EasterEggChallenge,
} from "../../service/access.service";

const emit = defineEmits<{ close: [] }>();

const PIN_LENGTH = 6;
const state = ref<"sending" | "enter" | "verifying" | "done" | "failed">("sending");
const challenge = ref<EasterEggChallenge | null>(null);
const digits = ref<string[]>(Array(PIN_LENGTH).fill(""));
const inputs = ref<HTMLInputElement[]>([]);
const error = ref("");
const remaining = ref(0); // seconds until the PIN expires
let countdown: ReturnType<typeof setInterval> | undefined;

const pin = computed(() => digits.value.join(""));
const canSubmit = computed(() => pin.value.length === PIN_LENGTH && state.value === "enter");
const mmss = computed(() => {
  const m = Math.floor(remaining.value / 60);
  const s = remaining.value % 60;
  return `${m}:${String(s).padStart(2, "0")}`;
});

async function requestPin() {
  state.value = "sending";
  error.value = "";
  digits.value = Array(PIN_LENGTH).fill("");
  try {
    challenge.value = await requestEasterEggPin();
    state.value = "enter";
    startCountdown(challenge.value.expiresAt);
    await nextTick();
    inputs.value[0]?.focus();
  } catch (e) {
    error.value = (e as Error).message;
    state.value = "failed";
  }
}

function startCountdown(expiresAt: number) {
  if (countdown) clearInterval(countdown);
  const tick = () => {
    remaining.value = Math.max(0, Math.round((expiresAt - Date.now()) / 1000));
    if (remaining.value === 0 && state.value === "enter") {
      clearInterval(countdown);
      error.value = "PIN expired. Request a new one.";
      state.value = "failed";
    }
  };
  tick();
  countdown = setInterval(tick, 1000);
}

// ---- 6-box PIN input ----
// Writes `value` starting at box `i`, so typing one digit and pasting six
// share the same path.
function fill(i: number, value: string) {
  const clean = value.replace(/\D/g, "");
  if (!clean) {
    digits.value[i] = "";
    return;
  }
  [...clean].slice(0, PIN_LENGTH - i).forEach((d, k) => (digits.value[i + k] = d));
  inputs.value[Math.min(i + clean.length, PIN_LENGTH - 1)]?.focus();
  if (pin.value.length === PIN_LENGTH) void submit();
}

const onInput = (i: number, e: Event) => fill(i, (e.target as HTMLInputElement).value);
const onPaste = (e: ClipboardEvent) => fill(0, e.clipboardData?.getData("text") ?? "");

function onKeydown(i: number, e: KeyboardEvent) {
  if (e.key === "Backspace" && !digits.value[i] && i > 0) {
    digits.value[i - 1] = "";
    inputs.value[i - 1]?.focus();
  } else if (e.key === "ArrowLeft" && i > 0) {
    inputs.value[i - 1]?.focus();
  } else if (e.key === "ArrowRight" && i < PIN_LENGTH - 1) {
    inputs.value[i + 1]?.focus();
  } else if (e.key === "Enter") {
    void submit();
  }
}

async function submit() {
  if (!canSubmit.value || !challenge.value) return;
  state.value = "verifying";
  error.value = "";
  try {
    const { token } = await verifyEasterEggPin(challenge.value.challengeId, pin.value);
    state.value = "done";
    if (countdown) clearInterval(countdown);
    window.location.href = buildAccessUrl(token, "/main");
  } catch (e) {
    error.value = (e as Error).message;
    // "Request a new one" errors are terminal for this challenge.
    state.value = /request a new/i.test(error.value) ? "failed" : "enter";
    digits.value = Array(PIN_LENGTH).fill("");
    await nextTick();
    inputs.value[0]?.focus();
  }
}

function onEsc(e: KeyboardEvent) {
  if (e.key === "Escape") emit("close");
}

onMounted(() => {
  window.addEventListener("keydown", onEsc);
  void requestPin();
});
onBeforeUnmount(() => {
  window.removeEventListener("keydown", onEsc);
  if (countdown) clearInterval(countdown);
});
</script>

<template>
  <div
    class="fixed inset-0 z-100 grid place-items-center bg-ink/40 p-4 backdrop-blur-sm"
    role="dialog"
    aria-modal="true"
    aria-labelledby="egg-title"
    @click.self="emit('close')"
  >
    <div class="egg-card panel w-full max-w-sm rounded-3xl p-8 text-center">
      <p class="font-mono text-xs uppercase tracking-[0.3em] text-ink/40">Secret door</p>
      <h2 id="egg-title" class="display mt-2 text-2xl">You found it</h2>

      <!-- Sending -->
      <p v-if="state === 'sending'" class="mt-6 text-sm text-ink/60">Sending a PIN to the owner's inbox…</p>

      <!-- Enter / verifying -->
      <template v-else-if="state === 'enter' || state === 'verifying'">
        <p class="mt-3 text-sm leading-relaxed text-ink/60">
          A 6-digit PIN was emailed to the site owner. Enter it below.
        </p>

        <div class="mt-6 flex justify-center gap-2" @paste.prevent="onPaste">
          <input
            v-for="(d, i) in digits"
            :key="i"
            :ref="(el) => { if (el) inputs[i] = el as HTMLInputElement }"
            :value="d"
            type="text"
            inputmode="numeric"
            autocomplete="one-time-code"
            maxlength="6"
            :disabled="state === 'verifying'"
            :aria-label="`PIN digit ${i + 1}`"
            class="pin-box h-12 w-10 rounded-xl border border-black/10 bg-white text-center font-mono text-xl outline-none transition focus:border-ink focus:ring-2 focus:ring-ink/15 disabled:opacity-50 sm:h-14 sm:w-11"
            @input="onInput(i, $event)"
            @keydown="onKeydown(i, $event)"
            @focus="($event.target as HTMLInputElement).select()"
          />
        </div>

        <p v-if="error" class="mt-3 text-sm text-rose-600">{{ error }}</p>
        <p class="mt-3 text-xs text-ink/45">Expires in {{ mmss }}</p>

        <button
          type="button"
          class="btn btn-dark mt-6 w-full justify-center"
          :disabled="!canSubmit"
          @click="submit"
        >
          {{ state === "verifying" ? "Checking…" : "Unlock" }}
        </button>
      </template>

      <!-- Done -->
      <p v-else-if="state === 'done'" class="mt-6 text-sm text-emerald-600">Unlocked — taking you in…</p>

      <!-- Failed -->
      <template v-else>
        <p class="mt-6 text-sm text-rose-600">{{ error }}</p>
        <button type="button" class="btn btn-dark mt-6 w-full justify-center" @click="requestPin">
          Send a new PIN
        </button>
      </template>

      <button type="button" class="mt-4 text-xs text-ink/45 hover:text-ink" @click="emit('close')">Close</button>
    </div>
  </div>
</template>

<style scoped>
.egg-card {
  animation: egg-pop 0.35s cubic-bezier(0.22, 1, 0.36, 1) both;
}

@keyframes egg-pop {
  from {
    transform: scale(0.92) translateY(12px);
    opacity: 0;
  }
  to {
    transform: scale(1) translateY(0);
    opacity: 1;
  }
}

@media (prefers-reduced-motion: reduce) {
  .egg-card {
    animation: none;
  }
}
</style>
