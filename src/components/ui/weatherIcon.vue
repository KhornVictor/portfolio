<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from "vue";
import {
  describe,
  fetchWeather,
  iconFor,
  PHNOM_PENH,
  type Weather,
} from "../../service/weather.service";

const props = withDefaults(defineProps<{ hours?: number }>(), { hours: 8 });

const weather = ref<Weather | null>(null);
const error = ref("");
const open = ref(false);
const root = ref<HTMLElement | null>(null);

const REFRESH_MS = 15 * 60 * 1000;
let refresh: ReturnType<typeof setInterval> | undefined;

async function load() {
  try {
    weather.value = await fetchWeather(PHNOM_PENH);
    error.value = "";
  } catch (e) {
    error.value = e instanceof Error ? e.message : String(e);
  }
}

const cur = computed(() => weather.value?.current ?? null);
const icon = computed(() =>
  cur.value ? iconFor(cur.value.code, cur.value.isDay) : "fa-solid fa-cloud",
);
const temp = (n: number) => `${Math.round(n)}°C`;

const fmtHour = (d: Date) =>
  d.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit", hour12: false });
const fmtDay = (d: Date, i: number) =>
  i === 0 ? "Today" : d.toLocaleDateString("en-US", { month: "long", day: "numeric" });

// ---- hourly chart ----
const hours = computed(() => weather.value?.hourly.slice(0, props.hours) ?? []);
const CHART_W = 100; // viewBox units; the SVG stretches to the card width
const CHART_H = 36;
const chart = computed(() => {
  const hs = hours.value;
  if (hs.length < 2) return { points: "", xs: [] as number[], ys: [] as number[] };
  const temps = hs.map((h) => h.temp);
  const min = Math.min(...temps);
  const max = Math.max(...temps);
  const span = Math.max(max - min, 1);
  const step = CHART_W / (hs.length - 1);
  const xs = hs.map((_, i) => i * step);
  const ys = temps.map((t) => 6 + (1 - (t - min) / span) * (CHART_H - 12));
  return { points: xs.map((x, i) => `${x},${ys[i]}`).join(" "), xs, ys };
});
// Columns are centred on their point on the line.
const colStyle = (i: number) => ({
  left: `${(i / Math.max(hours.value.length - 1, 1)) * 100}%`,
});

function toggle() {
  open.value = !open.value;
  if (open.value && !weather.value) void load();
}

function onDocClick(e: MouseEvent) {
  if (open.value && root.value && !root.value.contains(e.target as Node)) open.value = false;
}
function onKey(e: KeyboardEvent) {
  if (e.key === "Escape") open.value = false;
}

onMounted(() => {
  void load();
  refresh = setInterval(load, REFRESH_MS);
  document.addEventListener("click", onDocClick);
  document.addEventListener("keydown", onKey);
});
onBeforeUnmount(() => {
  if (refresh) clearInterval(refresh);
  document.removeEventListener("click", onDocClick);
  document.removeEventListener("keydown", onKey);
});
</script>

<template>
  <div ref="root" class="relative">
    <!-- Tray button: icon reflects the current sky, label shows the temperature -->
    <button
      type="button"
      class="tray-btn weather-btn"
      :class="{ 'is-open': open }"
      :aria-expanded="open"
      :aria-label="cur ? `Weather: ${describe(cur.code)}, ${temp(cur.temp)}` : 'Weather'"
      :title="cur ? `${describe(cur.code)} · ${temp(cur.temp)}` : 'Weather'"
      @click="toggle"
    >
      <i :class="icon"></i>
      <span v-if="cur" class="weather-temp">{{ temp(cur.temp) }}</span>
    </button>

    <!-- Card -->
    <transition name="weather-pop">
      <div v-if="open" class="weather-card" role="dialog" aria-label="Weather">
        <p v-if="error && !weather" class="px-4 py-6 text-center text-xs opacity-70">
          {{ error }}
        </p>
        <p v-else-if="!weather" class="px-4 py-6 text-center text-xs opacity-60">Loading…</p>

        <template v-else-if="cur">
          <!-- Current -->
          <div class="w-section text-center">
            <p class="w-title">{{ weather.place }} {{ temp(cur.temp) }}</p>
            <p class="w-line">
              Feels like {{ temp(cur.feelsLike) }} - {{ describe(cur.code) }} - Humidity
              {{ cur.humidity }}%
            </p>
            <p class="w-line">
              Pressure {{ cur.pressure.toFixed(1) }} mb - Visibility
              {{ cur.visibilityKm.toFixed(1) }} km - Cloud {{ cur.cloud }}%
            </p>
            <p class="w-line">Rain chance {{ cur.rainChance }}% - Snow chance {{ cur.snowChance }}%</p>
          </div>

          <!-- Daily -->
          <div class="grid grid-cols-3 gap-2">
            <div v-for="(d, i) in weather.daily" :key="i" class="w-section w-day">
              <div>
                <p class="w-day-name">{{ fmtDay(d.date, i) }}</p>
                <p class="w-line">Min: {{ temp(d.min) }}</p>
                <p class="w-line">Max: {{ temp(d.max) }}</p>
              </div>
              <i :class="iconFor(d.code, true)" class="w-day-icon"></i>
            </div>
          </div>

          <!-- Hourly chart -->
          <div class="w-chart">
            <div class="w-plot">
              <svg
                class="w-line-svg"
                :viewBox="`0 0 ${CHART_W} ${CHART_H}`"
                preserveAspectRatio="none"
                aria-hidden="true"
              >
                <polyline :points="chart.points" />
                <line
                  v-if="chart.xs.length"
                  :x1="chart.xs[0]"
                  :y1="chart.ys[0]"
                  :x2="chart.xs[0]"
                  :y2="CHART_H"
                  class="w-now"
                />
              </svg>
              <div v-for="(h, i) in hours" :key="i" class="w-col" :style="colStyle(i)">
                <span
                  class="w-col-temp"
                  :style="{ top: `calc(${(chart.ys[i] ?? 0) / CHART_H} * var(--line-h) - 1.15rem)` }"
                >
                  {{ temp(h.temp) }}
                </span>
                <div class="w-col-foot">
                  <i :class="iconFor(h.code, h.isDay)"></i>
                  <span>{{ h.windKmh.toFixed(1) }} km/h</span>
                  <span>{{ i === 0 ? "Now" : fmtHour(h.time) }}</span>
                </div>
              </div>
            </div>
          </div>
        </template>
      </div>
    </transition>
  </div>
</template>

<style scoped>
.weather-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.4rem;
  height: 1.7rem;
  padding: 0 0.45rem;
  border-radius: 0.45rem;
  color: color-mix(in srgb, var(--color-ink) 78%, transparent);
  font-size: 0.8rem;
  line-height: 1;
  cursor: pointer;
  transition:
    background 0.18s ease,
    color 0.18s ease;
}

.weather-btn:hover {
  background: color-mix(in srgb, var(--color-ink) 10%, transparent);
  color: var(--color-ink);
}

.weather-btn:focus-visible {
  outline: 2px solid var(--color-ink);
  outline-offset: 1px;
}

.weather-btn.is-open {
  background: color-mix(in srgb, var(--color-ink) 12%, transparent);
  color: var(--color-ink);
}

.weather-temp {
  font-size: 0.74rem;
}

.weather-card {
  position: absolute;
  right: 0;
  top: calc(100% + 0.7rem);
  z-index: 60;
  width: min(34rem, calc(100vw - 2rem));
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
  padding: 0.6rem;
  border-radius: 0.9rem;
  font-family: "JetBrains Mono", ui-monospace, SFMono-Regular, Menlo, monospace;
  color: color-mix(in srgb, var(--color-ink) 88%, transparent);
  background: color-mix(in srgb, var(--color-paper) 88%, transparent);
  border: 1px solid color-mix(in srgb, var(--color-ink) 10%, transparent);
  box-shadow: 0 24px 60px -20px rgba(var(--shadow-ink), 0.55);
  backdrop-filter: blur(22px) saturate(1.6);
  -webkit-backdrop-filter: blur(22px) saturate(1.6);
  transform-origin: top right;
}

.w-section {
  padding: 0.8rem 0.9rem;
  border-radius: 0.7rem;
  background: color-mix(in srgb, var(--color-ink) 5%, transparent);
  border: 1px solid color-mix(in srgb, var(--color-ink) 8%, transparent);
}

.w-title {
  font-size: 1.35rem;
  font-weight: 600;
  letter-spacing: 0.02em;
  margin-bottom: 0.4rem;
}

.w-line {
  font-size: 0.72rem;
  line-height: 1.5;
  color: color-mix(in srgb, var(--color-ink) 72%, transparent);
}

.w-day {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
}

.w-day-name {
  font-size: 0.78rem;
  font-weight: 600;
  margin-bottom: 0.15rem;
}

.w-day-icon {
  font-size: 1.8rem;
  color: color-mix(in srgb, var(--color-ink) 85%, transparent);
}

.w-chart {
  --line-h: 3.6rem;
  position: relative;
  height: 10rem;
  border-radius: 0.7rem;
  background: color-mix(in srgb, var(--color-ink) 5%, transparent);
  border: 1px solid color-mix(in srgb, var(--color-ink) 8%, transparent);
  overflow: hidden;
}

.w-plot {
  position: absolute;
  inset: 1.6rem 7% 0 7%;
}

.w-line-svg {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: var(--line-h);
}

.w-line-svg polyline {
  fill: none;
  stroke: var(--color-ink);
  stroke-width: 2px;
  vector-effect: non-scaling-stroke;
}

.w-now {
  stroke: color-mix(in srgb, var(--color-ink) 45%, transparent);
  stroke-width: 1px;
  stroke-dasharray: 2 2;
  vector-effect: non-scaling-stroke;
}

.w-col {
  position: absolute;
  top: 0;
  bottom: 0;
  width: 5.5rem;
  transform: translateX(-50%);
  text-align: center;
  font-size: 0.68rem;
}

.w-col-temp {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  white-space: nowrap;
  color: color-mix(in srgb, var(--color-ink) 95%, transparent);
}

.w-col-foot {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0.6rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.25rem;
  color: color-mix(in srgb, var(--color-ink) 85%, transparent);
}

.w-col-foot i {
  font-size: 1.1rem;
  margin-bottom: 0.15rem;
}

/* Pop in/out */
.weather-pop-enter-active,
.weather-pop-leave-active {
  transition:
    opacity 0.2s ease,
    transform 0.25s cubic-bezier(0.22, 1, 0.36, 1);
}

.weather-pop-enter-from,
.weather-pop-leave-to {
  opacity: 0;
  transform: translateY(-6px) scale(0.98);
}

@media (max-width: 640px) {
  .w-col:nth-child(n + 8) {
    display: none; /* fewer hourly columns on narrow screens */
  }
}

@media (prefers-reduced-motion: reduce) {
  .weather-pop-enter-active,
  .weather-pop-leave-active {
    transition: none;
  }
}
</style>
