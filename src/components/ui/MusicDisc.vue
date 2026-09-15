<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from "vue";
import { useMusicState } from "../../composables/useMusicState";

const props = withDefaults(
  defineProps<{ tracks: { title: string; url: string }[]; size?: number }>(),
  { size: 56 },
);

// Accepts watch?v=, youtu.be/, /embed/ and /shorts/ links, or a bare ID.
function videoIdOf(url: string): string | null {
  const s = url.trim();
  if (/^[\w-]{11}$/.test(s)) return s;
  const m =
    s.match(/[?&]v=([\w-]{11})/) ||
    s.match(/youtu\.be\/([\w-]{11})/) ||
    s.match(/\/(?:embed|shorts|v)\/([\w-]{11})/);
  return m ? m[1] : null;
}

// Only tracks with a recognisable YouTube link are playable.
const playlist = computed(() =>
  props.tracks
    .map((t) => ({ title: t.title, id: videoIdOf(t.url) }))
    .filter((t): t is { title: string; id: string } => t.id !== null),
);
const index = ref(0);
const track = computed(() => playlist.value[index.value] ?? null);
const videoId = computed(() => track.value?.id ?? null);

const host = ref<HTMLElement | null>(null);
const playing = ref(false);
// Broadcast play state so the hero's binary grid can dance along.
const shared = useMusicState();
watch(playing, (v) => (shared.playing.value = v));
watch(track, (t) => (shared.title.value = t?.title ?? ""), { immediate: true });
const NOTE_CYCLE_S = 2.4;
const NOTES = ["♪", "♫", "♩", "♬", "♪", "♫"].map((glyph, i, all) => {
  const dir = i % 2 ? -1 : 1;
  return {
    glyph,
    style: {
      "--dir": dir,
      "--drift": `${dir * (18 + 12 * (i % 3))}px`,
      animationDelay: `${(i * NOTE_CYCLE_S) / all.length}s`,
    },
  };
});
const loading = ref(false);
const error = ref("");
let player: YT.Player | null = null;
let pendingPlay = false;

// The IFrame API is a global script; load it once and resolve when ready.
let apiPromise: Promise<void> | null = null;
function loadApi(): Promise<void> {
  if (window.YT?.Player) return Promise.resolve();
  if (apiPromise) return apiPromise;
  apiPromise = new Promise((resolve, reject) => {
    const prev = window.onYouTubeIframeAPIReady;
    window.onYouTubeIframeAPIReady = () => {
      prev?.();
      resolve();
    };
    const s = document.createElement("script");
    s.src = "https://www.youtube.com/iframe_api";
    s.async = true;
    s.onerror = () => reject(new Error("Couldn't load the YouTube player."));
    document.head.appendChild(s);
  });
  return apiPromise;
}

async function ensurePlayer() {
  if (player || !host.value || !videoId.value) return;
  await loadApi();
  if (player || !host.value) return;
  player = new YT.Player(host.value, {
    videoId: videoId.value,
    width: 1,
    height: 1,
    playerVars: { controls: 0, disablekb: 1, rel: 0, playsinline: 1 },
    events: {
      onReady: () => {
        loading.value = false;
        if (pendingPlay) {
          pendingPlay = false;
          player?.playVideo();
        }
      },
      onStateChange: (e) => {
        playing.value = e.data === YT.PlayerState.PLAYING;
        if (e.data === YT.PlayerState.PLAYING) error.value = "";
        if (e.data === YT.PlayerState.ENDED) next();
      },
      onError: () => {
        loading.value = false;
        playing.value = false;
        error.value = `"${track.value?.title}" can't be played here.`;
        // Skip a broken track unless it's the only one.
        if (playlist.value.length > 1) next();
      },
    },
  });
}

// Jump to another track. If the player exists the new track starts right
// away; otherwise the first click on the disc will play it.
function skip(step: 1 | -1) {
  const n = playlist.value.length;
  if (!n) return;
  index.value = (index.value + step + n) % n;
  error.value = "";
  if (player && videoId.value) player.loadVideoById(videoId.value);
}
const next = () => skip(1);
const prev = () => skip(-1);

async function toggle() {
  if (!videoId.value) return;
  error.value = "";
  if (player) {
    playing.value ? player.pauseVideo() : player.playVideo();
    return;
  }
  // First click: create the player, then start as soon as it's ready. Doing
  // it from the click keeps the browser's autoplay policy happy.
  pendingPlay = true;
  loading.value = true;
  try {
    await ensurePlayer();
  } catch (e) {
    loading.value = false;
    pendingPlay = false;
    error.value = e instanceof Error ? e.message : String(e);
  }
}

// Warm up the API script so the first click starts quickly.
onMounted(() => {
  if (videoId.value) void loadApi().catch(() => {});
});

onBeforeUnmount(() => {
  player?.destroy();
  player = null;
  shared.playing.value = false;
});
</script>

<template>
  <!-- The dock is a generous hover zone: the prev/next buttons only fade in
       while the cursor is inside it (or one of them has keyboard focus). -->
  <div v-if="videoId" class="dock relative flex flex-col items-end gap-1">
    <div class="relative flex items-center gap-3">
      <button
        v-if="playlist.length > 1"
        type="button"
        class="skip"
        aria-label="Previous track"
        title="Previous track"
        @click="prev"
      >
        <i class="fa-solid fa-backward-step"></i>
      </button>

      <div class="relative">
        <!-- Floating notes (only while playing) -->
        <span
          v-for="(n, i) in NOTES"
          :key="i"
          v-show="playing"
          class="note"
          :style="n.style"
          aria-hidden="true"
          >{{ n.glyph }}</span
        >
        <button
          type="button"
          class="disc"
      :class="{ 'is-playing': playing, 'is-loading': loading }"
      :style="{ width: size + 'px', height: size + 'px' }"
          :aria-pressed="playing"
          :aria-label="(playing ? 'Pause: ' : 'Play: ') + track?.title"
          :title="(playing ? 'Pause: ' : 'Play: ') + track?.title"
          @click="toggle"
        >
          <span class="disc-grooves" aria-hidden="true"></span>
          <span class="disc-label" aria-hidden="true">
            <i v-if="loading" class="fa-solid fa-spinner fa-spin"></i>
            <i v-else-if="playing" class="fa-solid fa-pause"></i>
            <i v-else class="fa-solid fa-play"></i>
          </span>
        </button>
      </div>

      <button
        v-if="playlist.length > 1"
        type="button"
        class="skip"
        aria-label="Next track"
        title="Next track"
        @click="next"
      >
        <i class="fa-solid fa-forward-step"></i>
      </button>
    </div>

    <!-- Track name, revealed with the buttons -->
    <span class="track-name text-xs text-ink/60">{{ track?.title }}</span>
    <span v-if="error" class="max-w-60 text-right text-xs text-red-600">{{ error }}</span>
    <!-- Hidden YouTube player (audio only) -->
    <div class="player-host" aria-hidden="true">
      <div ref="host"></div>
    </div>
  </div>
</template>

<style scoped>
/* Pad the dock so the hover zone extends a little beyond the buttons. */
.dock {
  padding: 1.25rem 0 0.25rem 1.25rem;
}

/* Prev / next: hidden until the dock is hovered or a control is focused;
   they slide out from behind the disc. */
.skip {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 2.25rem;
  height: 2.25rem;
  border-radius: 999px;
  background: var(--color-surface);
  border: 1px solid color-mix(in srgb, var(--color-ink) 8%, transparent);
  box-shadow: 0 6px 16px -8px rgba(var(--shadow-ink), 0.35);
  color: var(--color-ink);
  font-size: 0.85rem;
  line-height: 1;
  cursor: pointer;
  opacity: 0;
  pointer-events: none;
  --slide: 1.25rem; /* toward the disc */
  transform: translateX(var(--slide)) scale(0.8);
  transition:
    opacity 0.25s ease,
    transform 0.35s cubic-bezier(0.22, 1, 0.36, 1),
    box-shadow 0.25s ease;
}

.skip + .relative + .skip,
.skip:last-child {
  --slide: -1.25rem;
}

.track-name {
  opacity: 0;
  transform: translateY(4px);
  transition:
    opacity 0.25s ease,
    transform 0.25s ease;
}

.dock:hover .skip,
.dock:focus-within .skip,
.dock:hover .track-name,
.dock:focus-within .track-name {
  opacity: 1;
  pointer-events: auto;
  transform: none;
}

.skip:hover {
  transform: scale(1.1);
  box-shadow: 0 12px 24px -10px rgba(var(--shadow-ink), 0.45);
}

.skip:active {
  transform: scale(0.95);
}

.skip:focus-visible {
  outline: 2px solid var(--color-ink);
  outline-offset: 2px;
}

/* No hover on touch devices: keep the controls always visible there. */
@media (hover: none) {
  .skip,
  .track-name {
    opacity: 1;
    pointer-events: auto;
    transform: none;
  }
}

.disc {
  position: relative;
  display: grid;
  place-items: center;
  border-radius: 999px;
  border: 1px solid color-mix(in srgb, var(--color-ink) 12%, transparent);
  background: radial-gradient(circle at 50% 50%, #2a2a2e 0 18%, #141416 19% 100%);
  box-shadow:
    0 10px 24px -12px rgba(var(--shadow-ink), 0.55),
    inset 0 1px 0 rgba(255, 255, 255, 0.08);
  color: var(--color-ink);
  cursor: pointer;
  transition:
    transform 0.3s ease,
    box-shadow 0.3s ease;
}

.disc:hover {
  transform: translateY(-2px) scale(1.04);
  box-shadow: 0 16px 30px -12px rgba(var(--shadow-ink), 0.6);
}

.disc:active {
  transform: scale(0.96);
}

.disc:focus-visible {
  outline: 2px solid var(--color-ink);
  outline-offset: 3px;
}

/* Concentric grooves; the whole ring spins while playing. */
.disc-grooves {
  position: absolute;
  inset: 3px;
  border-radius: 999px;
  background: repeating-radial-gradient(
    circle,
    rgba(255, 255, 255, 0.06) 0 1px,
    transparent 1px 4px
  );
  /* a light sheen so the rotation is visible */
  mask-image: conic-gradient(from 0deg, #000 0 30%, rgba(0, 0, 0, 0.35) 30% 55%, #000 55% 80%, rgba(0, 0, 0, 0.35) 80% 100%);
  animation: disc-spin 2.4s linear infinite;
  animation-play-state: paused;
}

/* The whole disc turns while playing; the grooves add a little extra spin
   so the label and rim move at slightly different speeds. */
.disc.is-playing {
  animation:
    disc-spin 3s linear infinite,
    disc-pulse 1.4s ease-in-out infinite;
}

.disc.is-playing:hover {
  /* keep hover lift without fighting the rotation */
  transform: none;
}

.disc.is-playing .disc-grooves {
  animation-play-state: running;
}

/* Center label */
.disc-label {
  position: relative;
  display: grid;
  place-items: center;
  width: 42%;
  height: 42%;
  border-radius: 999px;
  background: #ffffff;
  font-size: 0.8rem;
  line-height: 1;
  box-shadow: 0 0 0 3px #141416;
}

.disc-label i.fa-play {
  margin-left: 2px; /* optically center the triangle */
}

@keyframes disc-spin {
  to {
    transform: rotate(360deg);
  }
}

@keyframes disc-pulse {
  0%,
  100% {
    box-shadow: 0 0 0 0 color-mix(in srgb, var(--color-ink) 25%, transparent);
  }
  50% {
    box-shadow: 0 0 0 8px transparent;
  }
}

/* Notes rise out of the disc, drift sideways and fade, each on its own
   delay/direction so they don't march in a line. */
.note {
  position: absolute;
  left: 50%;
  top: 50%;
  z-index: 1;
  pointer-events: none;
  font-size: 1.1rem;
  line-height: 1;
  color: var(--color-ink);
  opacity: 0;
  /* --dir / --drift / animation-delay come from the inline style */
  animation: note-float 2.4s ease-out infinite;
}

@keyframes note-float {
  0% {
    transform: translate(-50%, -50%) translate(0, 0) rotate(0deg) scale(0.6);
    opacity: 0;
  }
  15% {
    opacity: 0.9;
  }
  100% {
    transform: translate(-50%, -50%) translate(var(--drift), -90px)
      rotate(calc(var(--dir) * 25deg)) scale(1.1);
    opacity: 0;
  }
}

@media (prefers-reduced-motion: reduce) {
  .skip,
  .track-name {
    transition: opacity 0.2s ease;
    transform: none;
  }
  .disc-grooves,
  .disc.is-playing,
  .note {
    animation: none;
  }
  .note {
    display: none;
  }
}

/* Keep the iframe in the document (YouTube pauses fully hidden players in
   some browsers) but make it invisible and non-interactive. */
.player-host {
  position: absolute;
  width: 1px;
  height: 1px;
  overflow: hidden;
  opacity: 0;
  pointer-events: none;
}
</style>
