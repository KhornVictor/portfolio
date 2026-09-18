<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from "vue";

const props = withDefaults(
  defineProps<{
    forcePhase?: "auto" | "dawn" | "day" | "sunset" | "night";
    interactive?: boolean;
  }>(),
  {
    forcePhase: "auto",
    interactive: false,
  }
);

const emit = defineEmits<{
  (e: "phaseChange", phase: "dawn" | "day" | "sunset" | "night"): void;
}>();

const currentHour = ref(new Date().getHours());
let clockInterval = 0;

function updateClock() {
  currentHour.value = new Date().getHours();
}

onMounted(() => {
  updateClock();
  clockInterval = window.setInterval(updateClock, 30000);
});

onUnmounted(() => {
  clearInterval(clockInterval);
});

const activePhase = computed<"dawn" | "day" | "sunset" | "night">(() => {
  if (props.forcePhase && props.forcePhase !== "auto") {
    return props.forcePhase;
  }
  const h = currentHour.value;
  if (h >= 5 && h < 9) return "dawn";
  if (h >= 9 && h < 17) return "day";
  if (h >= 17 && h < 20) return "sunset";
  return "night";
});

// Procedural stars for night mode
const stars = Array.from({ length: 48 }, (_, i) => ({
  id: i,
  x: ((i * 37 + 13) % 96) + 2,
  y: ((i * 53 + 7) % 52) + 3,
  size: (i % 3 === 0 ? 2 : 1.2),
  opacity: 0.35 + ((i % 5) * 0.15),
  delay: (i % 7) * 0.4,
}));
</script>

<template>
  <div class="absolute inset-0 w-full h-full overflow-hidden select-none pointer-events-none transition-all duration-1000">
    <!-- ========================================================= -->
    <!-- 1. SKY GRADIENT (Transitions smoothly by time of day) -->
    <!-- ========================================================= -->
    <div
      class="absolute inset-0 transition-all duration-1000"
      :class="{
        'bg-linear-to-b from-[#1b1938] via-[#4c2d58] via-50% to-[#f39c6b]': activePhase === 'dawn',
        'bg-linear-to-b from-[#1a64ca] via-[#3b8eed] via-55% to-[#d7efff]': activePhase === 'day',
        'bg-linear-to-b from-[#1c1335] via-[#5c1c44] via-45% to-[#f59e42]': activePhase === 'sunset',
        'bg-linear-to-b from-[#030611] via-[#091024] via-55% to-[#17244a]': activePhase === 'night',
      }"
    ></div>

    <!-- ========================================================= -->
    <!-- 2. CELESTIAL BODIES (Sun / Moon) -->
    <!-- ========================================================= -->
    <!-- Dawn Sun (Low left, gentle gold) -->
    <div
      v-if="activePhase === 'dawn'"
      class="absolute left-[20%] bottom-[38%] w-24 h-24 rounded-full bg-amber-100/90 shadow-[0_0_80px_35px_rgba(253,224,140,0.65)] transition-all duration-1000 pointer-events-none"
    ></div>

    <!-- Day Sun (High center-right, brilliant radiant) -->
    <div
      v-else-if="activePhase === 'day'"
      class="absolute right-[32%] top-[12%] w-20 h-20 rounded-full bg-amber-50 shadow-[0_0_90px_45px_rgba(255,255,255,0.85),0_0_140px_70px_rgba(253,224,71,0.45)] transition-all duration-1000 pointer-events-none"
    ></div>

    <!-- Sunset Sun (Low right, deep golden-orange) -->
    <div
      v-else-if="activePhase === 'sunset'"
      class="absolute right-[22%] bottom-[34%] w-26 h-26 rounded-full bg-orange-200/95 shadow-[0_0_90px_40px_rgba(249,115,22,0.7),0_0_150px_70px_rgba(239,68,68,0.35)] transition-all duration-1000 pointer-events-none"
    ></div>

    <!-- Night Moon & Stars -->
    <template v-else>
      <!-- Twinkling stars -->
      <div
        v-for="s in stars"
        :key="s.id"
        class="absolute rounded-full bg-white animate-pulse"
        :style="{
          left: `${s.x}%`,
          top: `${s.y}%`,
          width: `${s.size}px`,
          height: `${s.size}px`,
          opacity: s.opacity,
          animationDelay: `${s.delay}s`,
          animationDuration: '3s',
        }"
      ></div>

      <!-- Crescent Moon -->
      <div
        class="absolute right-[24%] top-[14%] w-16 h-16 rounded-full shadow-[0_0_45px_15px_rgba(255,255,255,0.3)] pointer-events-none"
      >
        <svg viewBox="0 0 100 100" class="w-full h-full drop-shadow-[0_0_12px_rgba(255,255,255,0.7)]">
          <path
            d="M50 15 A35 35 0 1 0 85 75 A42 42 0 0 1 50 15 Z"
            fill="#f8fafc"
          />
        </svg>
      </div>
    </template>

    <!-- ========================================================= -->
    <!-- 3. SCENIC MOUNTAIN RIDGES (macOS Style Dynamic Landscape) -->
    <!-- ========================================================= -->
    <svg
      viewBox="0 0 1440 600"
      preserveAspectRatio="none"
      class="absolute bottom-0 w-full h-[55%] pointer-events-none transition-all duration-1000"
    >
      <!-- Layer 1: Distant Mountain Range -->
      <path
        d="M0 320 L120 280 L280 340 L450 250 L620 310 L780 230 L960 300 L1140 240 L1320 290 L1440 270 L1440 600 L0 600 Z"
        :fill="
          activePhase === 'dawn'
            ? '#5a2e54'
            : activePhase === 'day'
            ? '#528ec9'
            : activePhase === 'sunset'
            ? '#611f3d'
            : '#0b1428'
        "
        class="transition-colors duration-1000 opacity-80"
      />

      <!-- Layer 2: Mid-Range Jagged Ridge -->
      <path
        d="M0 380 L180 310 L340 370 L520 290 L710 360 L890 280 L1080 350 L1260 310 L1440 360 L1440 600 L0 600 Z"
        :fill="
          activePhase === 'dawn'
            ? '#3e1d44'
            : activePhase === 'day'
            ? '#336ba8'
            : activePhase === 'sunset'
            ? '#441430'
            : '#070e1c'
        "
        class="transition-colors duration-1000 opacity-90"
      />

      <!-- Valley Mist Gradient -->
      <rect
        x="0"
        y="350"
        width="1440"
        height="80"
        :fill="
          activePhase === 'dawn'
            ? 'url(#mist-dawn)'
            : activePhase === 'day'
            ? 'url(#mist-day)'
            : activePhase === 'sunset'
            ? 'url(#mist-sunset)'
            : 'url(#mist-night)'
        "
        opacity="0.5"
      />

      <!-- Layer 3: Foreground Rolling Hills -->
      <path
        d="M0 450 Q240 390 480 430 T960 410 T1440 440 L1440 600 L0 600 Z"
        :fill="
          activePhase === 'dawn'
            ? '#25102d'
            : activePhase === 'day'
            ? '#1c4a78'
            : activePhase === 'sunset'
            ? '#290b20'
            : '#040710'
        "
        class="transition-colors duration-1000"
      />

      <!-- Layer 4: Close Front Silhouette Edge -->
      <path
        d="M0 520 Q320 480 680 510 T1440 490 L1440 600 L0 600 Z"
        :fill="
          activePhase === 'dawn'
            ? '#17071c'
            : activePhase === 'day'
            ? '#113354'
            : activePhase === 'sunset'
            ? '#190414'
            : '#020308'
        "
        class="transition-colors duration-1000"
      />

      <defs>
        <linearGradient id="mist-dawn" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#f8a268" stop-opacity="0.35" />
          <stop offset="100%" stop-color="#f8a268" stop-opacity="0" />
        </linearGradient>
        <linearGradient id="mist-day" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#ffffff" stop-opacity="0.3" />
          <stop offset="100%" stop-color="#ffffff" stop-opacity="0" />
        </linearGradient>
        <linearGradient id="mist-sunset" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#f97316" stop-opacity="0.4" />
          <stop offset="100%" stop-color="#f97316" stop-opacity="0" />
        </linearGradient>
        <linearGradient id="mist-night" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#38bdf8" stop-opacity="0.15" />
          <stop offset="100%" stop-color="#38bdf8" stop-opacity="0" />
        </linearGradient>
      </defs>
    </svg>

    <!-- Subtle vignette shadow overlay -->
    <div
      class="absolute inset-0 bg-radial from-transparent via-transparent to-black/30 pointer-events-none"
    ></div>
  </div>
</template>
