<script setup lang="ts">
import { onMounted, onUnmounted, ref } from "vue";
import SkillIcon from "./SkillIcon.vue";

const emit = defineEmits<{
  (e: "close"): void;
}>();

// -------------------------------------------------------------
// GAME NAVIGATION & SOUND
// -------------------------------------------------------------
type GameType = "2048" | "snake" | "match";
const activeGame = ref<GameType>("2048");

const isMuted = ref(
  typeof localStorage !== "undefined"
    ? localStorage.getItem("ipad_game_muted") === "true"
    : false,
);

function toggleMute() {
  isMuted.value = !isMuted.value;
  try {
    localStorage.setItem("ipad_game_muted", String(isMuted.value));
  } catch {}
}

let audioCtx: AudioContext | null = null;
function getAudioCtx() {
  if (isMuted.value) return null;
  if (!audioCtx && typeof window !== "undefined") {
    const AudioContextClass =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext })
        .webkitAudioContext;
    if (AudioContextClass) audioCtx = new AudioContextClass();
  }
  if (audioCtx && audioCtx.state === "suspended") {
    audioCtx.resume();
  }
  return audioCtx;
}

function playTone(freq: number, duration: number, type: OscillatorType = "sine", gainVal = 0.08) {
  const ctx = getAudioCtx();
  if (!ctx) return;
  try {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, ctx.currentTime);
    gain.gain.setValueAtTime(gainVal, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + duration);
  } catch {}
}

function sfxMove() {
  playTone(400, 0.06, "triangle", 0.05);
}

function sfxMerge() {
  playTone(520, 0.07, "sine", 0.08);
  setTimeout(() => playTone(680, 0.1, "sine", 0.08), 50);
}

function sfxEat() {
  playTone(587, 0.08, "square", 0.06);
  setTimeout(() => playTone(880, 0.12, "square", 0.06), 40);
}

function sfxCrash() {
  playTone(180, 0.15, "sawtooth", 0.08);
  setTimeout(() => playTone(120, 0.25, "sawtooth", 0.08), 80);
}

function sfxWin() {
  const notes = [523.25, 659.25, 783.99, 1046.5];
  notes.forEach((f, i) => {
    setTimeout(() => playTone(f, 0.18, "sine", 0.09), i * 90);
  });
}

// =============================================================
// GAME 1: 2048 (DEVELOPER TECH EDITION & NUMBERS)
// =============================================================
const techMode = ref(true);
const board2048 = ref<number[][]>([
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
]);
const score2048 = ref(0);
const bestScore2048 = ref(
  typeof localStorage !== "undefined"
    ? parseInt(localStorage.getItem("best_2048") || "0")
    : 0,
);
const isGameOver2048 = ref(false);
const hasWon2048 = ref(false);
const prevBoard2048 = ref<number[][] | null>(null);
const prevScore2048 = ref(0);

const techTiles: Record<number, { name: string; icon?: string; bg: string; text: string }> = {
  2: { name: "HTML5", icon: "html", bg: "from-orange-500 to-amber-600", text: "text-white" },
  4: { name: "CSS3", icon: "css", bg: "from-blue-500 to-indigo-600", text: "text-white" },
  8: { name: "JS", icon: "javascript", bg: "from-yellow-400 to-amber-500", text: "text-slate-950 font-bold" },
  16: { name: "TS", icon: "typescript", bg: "from-sky-500 to-blue-700", text: "text-white font-bold" },
  32: { name: "Vue", icon: "vue", bg: "from-emerald-500 to-teal-700", text: "text-white font-bold" },
  64: { name: "React", icon: "react", bg: "from-cyan-400 to-blue-600", text: "text-white font-bold" },
  128: { name: "Node", icon: "node", bg: "from-green-600 to-emerald-800", text: "text-white font-bold" },
  256: { name: "NestJS", icon: "nest", bg: "from-red-500 to-rose-700", text: "text-white font-bold" },
  512: { name: "Postgres", icon: "postgresql", bg: "from-indigo-600 to-purple-800", text: "text-white font-bold" },
  1024: { name: "Docker", icon: "docker", bg: "from-sky-400 to-blue-700", text: "text-white font-bold" },
  2048: { name: "Victor", icon: "settings", bg: "from-amber-400 via-rose-500 to-purple-600", text: "text-white font-extrabold" },
};

function init2048() {
  board2048.value = [
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ];
  score2048.value = 0;
  isGameOver2048.value = false;
  hasWon2048.value = false;
  prevBoard2048.value = null;
  spawnTile2048();
  spawnTile2048();
}

function spawnTile2048() {
  const empty: Array<{ r: number; c: number }> = [];
  for (let r = 0; r < 4; r++) {
    for (let c = 0; c < 4; c++) {
      if (board2048.value[r][c] === 0) empty.push({ r, c });
    }
  }
  if (empty.length === 0) return;
  const { r, c } = empty[Math.floor(Math.random() * empty.length)];
  board2048.value[r][c] = Math.random() < 0.9 ? 2 : 4;
}

function undo2048() {
  if (!prevBoard2048.value) return;
  board2048.value = prevBoard2048.value.map((r) => [...r]);
  score2048.value = prevScore2048.value;
  prevBoard2048.value = null;
  isGameOver2048.value = false;
}

function move2048(direction: "left" | "right" | "up" | "down") {
  if (isGameOver2048.value) return;

  const currentCopy = board2048.value.map((r) => [...r]);
  const currentScore = score2048.value;

  let moved = false;
  let scoreGained = 0;
  let merged = false;

  const rotate = (grid: number[][]) => {
    const res: number[][] = [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];
    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 4; c++) {
        res[c][3 - r] = grid[r][c];
      }
    }
    return res;
  };

  let grid = board2048.value.map((r) => [...r]);
  const rotTimes = direction === "left" ? 0 : direction === "up" ? 3 : direction === "right" ? 2 : 1;

  for (let i = 0; i < rotTimes; i++) grid = rotate(grid);

  // Slide left
  for (let r = 0; r < 4; r++) {
    const row = grid[r].filter((v) => v !== 0);
    const newRow: number[] = [];
    for (let i = 0; i < row.length; i++) {
      if (i < row.length - 1 && row[i] === row[i + 1]) {
        const val = row[i] * 2;
        newRow.push(val);
        scoreGained += val;
        merged = true;
        if (val === 2048) hasWon2048.value = true;
        i++;
      } else {
        newRow.push(row[i]);
      }
    }
    while (newRow.length < 4) newRow.push(0);

    for (let c = 0; c < 4; c++) {
      if (grid[r][c] !== newRow[c]) moved = true;
      grid[r][c] = newRow[c];
    }
  }

  // Rotate back
  const rotBack = (4 - rotTimes) % 4;
  for (let i = 0; i < rotBack; i++) grid = rotate(grid);

  if (moved) {
    prevBoard2048.value = currentCopy;
    prevScore2048.value = currentScore;
    board2048.value = grid;
    score2048.value += scoreGained;

    if (score2048.value > bestScore2048.value) {
      bestScore2048.value = score2048.value;
      try {
        localStorage.setItem("best_2048", String(bestScore2048.value));
      } catch {}
    }

    if (merged) sfxMerge();
    else sfxMove();

    spawnTile2048();

    if (checkGameOver2048()) {
      isGameOver2048.value = true;
      sfxCrash();
    }
  }
}

function checkGameOver2048(): boolean {
  for (let r = 0; r < 4; r++) {
    for (let c = 0; c < 4; c++) {
      if (board2048.value[r][c] === 0) return false;
      if (c < 3 && board2048.value[r][c] === board2048.value[r][c + 1]) return false;
      if (r < 3 && board2048.value[r][c] === board2048.value[r + 1][c]) return false;
    }
  }
  return true;
}

// =============================================================
// GAME 2: RETRO SNAKE (NEON ARCADE)
// =============================================================
const GRID_SIZE = 18;
type Point = { x: number; y: number };
const snake = ref<Point[]>([
  { x: 8, y: 9 },
  { x: 7, y: 9 },
  { x: 6, y: 9 },
]);
const snakeDir = ref<"UP" | "DOWN" | "LEFT" | "RIGHT">("RIGHT");
let nextSnakeDir: "UP" | "DOWN" | "LEFT" | "RIGHT" = "RIGHT";

const food = ref<Point>({ x: 13, y: 9 });
const foodKind = ref<"coffee" | "bug" | "energy">("coffee");
const snakeScore = ref(0);
const bestSnakeScore = ref(
  typeof localStorage !== "undefined"
    ? parseInt(localStorage.getItem("best_snake") || "0")
    : 0,
);
const isGameOverSnake = ref(false);
const isPausedSnake = ref(false);
const snakeSpeed = ref<"chill" | "normal" | "blitz">("normal");

let snakeTimer: number | null = null;

function getSnakeInterval() {
  if (snakeSpeed.value === "chill") return 160;
  if (snakeSpeed.value === "blitz") return 75;
  return 110;
}

function initSnake() {
  if (snakeTimer) clearInterval(snakeTimer);
  snake.value = [
    { x: 8, y: 9 },
    { x: 7, y: 9 },
    { x: 6, y: 9 },
  ];
  snakeDir.value = "RIGHT";
  nextSnakeDir = "RIGHT";
  snakeScore.value = 0;
  isGameOverSnake.value = false;
  isPausedSnake.value = false;
  spawnFood();
  startSnakeLoop();
}

function spawnFood() {
  const kinds: Array<"coffee" | "bug" | "energy"> = ["coffee", "bug", "energy"];
  foodKind.value = kinds[Math.floor(Math.random() * kinds.length)];
  let pt: Point;
  let occupied = true;
  while (occupied) {
    pt = {
      x: Math.floor(Math.random() * GRID_SIZE),
      y: Math.floor(Math.random() * GRID_SIZE),
    };
    occupied = snake.value.some((s) => s.x === pt.x && s.y === pt.y);
    if (!occupied) food.value = pt;
  }
}

function startSnakeLoop() {
  if (snakeTimer) clearInterval(snakeTimer);
  snakeTimer = window.setInterval(tickSnake, getSnakeInterval());
}

function tickSnake() {
  if (isGameOverSnake.value || isPausedSnake.value) return;

  snakeDir.value = nextSnakeDir;
  const head = { ...snake.value[0] };

  if (snakeDir.value === "UP") head.y--;
  else if (snakeDir.value === "DOWN") head.y++;
  else if (snakeDir.value === "LEFT") head.x--;
  else if (snakeDir.value === "RIGHT") head.x++;

  // Wall collisions (wrapped edges for iPad fluidity)
  if (head.x < 0) head.x = GRID_SIZE - 1;
  else if (head.x >= GRID_SIZE) head.x = 0;
  if (head.y < 0) head.y = GRID_SIZE - 1;
  else if (head.y >= GRID_SIZE) head.y = 0;

  // Self collision
  if (snake.value.some((seg) => seg.x === head.x && seg.y === head.y)) {
    isGameOverSnake.value = true;
    sfxCrash();
    if (snakeTimer) clearInterval(snakeTimer);
    return;
  }

  snake.value.unshift(head);

  // Eating food
  if (head.x === food.value.x && head.y === food.value.y) {
    sfxEat();
    const pts = foodKind.value === "energy" ? 30 : foodKind.value === "bug" ? 20 : 10;
    snakeScore.value += pts;
    if (snakeScore.value > bestSnakeScore.value) {
      bestSnakeScore.value = snakeScore.value;
      try {
        localStorage.setItem("best_snake", String(bestSnakeScore.value));
      } catch {}
    }
    spawnFood();
  } else {
    snake.value.pop();
  }
}

function changeSnakeDir(newDir: "UP" | "DOWN" | "LEFT" | "RIGHT") {
  if (
    (newDir === "UP" && snakeDir.value === "DOWN") ||
    (newDir === "DOWN" && snakeDir.value === "UP") ||
    (newDir === "LEFT" && snakeDir.value === "RIGHT") ||
    (newDir === "RIGHT" && snakeDir.value === "LEFT")
  ) {
    return;
  }
  nextSnakeDir = newDir;
  sfxMove();
}

// =============================================================
// GAME 3: TECH MEMORY MATCH
// =============================================================
interface MatchCard {
  id: number;
  tech: string;
  name: string;
  isFlipped: boolean;
  isMatched: boolean;
}

const matchCards = ref<MatchCard[]>([]);
const flippedIndexes = ref<number[]>([]);
const matchMoves = ref(0);
const matchPairsFound = ref(0);
const matchStartTime = ref<number>(0);
const matchTimerSec = ref(0);
let matchTimerInterval: number | null = null;
const isWonMatch = ref(false);

const TECH_PAIRS = [
  { tech: "vue", name: "Vue.js" },
  { tech: "react", name: "React" },
  { tech: "nest", name: "NestJS" },
  { tech: "typescript", name: "TypeScript" },
  { tech: "docker", name: "Docker" },
  { tech: "node", name: "Node.js" },
  { tech: "redis", name: "Redis" },
  { tech: "postgresql", name: "PostgreSQL" },
];

function initMatch() {
  if (matchTimerInterval) clearInterval(matchTimerInterval);
  flippedIndexes.value = [];
  matchMoves.value = 0;
  matchPairsFound.value = 0;
  matchTimerSec.value = 0;
  isWonMatch.value = false;

  const raw: Array<{ tech: string; name: string }> = [];
  TECH_PAIRS.forEach((item) => {
    raw.push({ ...item }, { ...item });
  });

  // Shuffle
  for (let i = raw.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [raw[i], raw[j]] = [raw[j], raw[i]];
  }

  matchCards.value = raw.map((item, idx) => ({
    id: idx,
    tech: item.tech,
    name: item.name,
    isFlipped: false,
    isMatched: false,
  }));

  matchStartTime.value = Date.now();
  matchTimerInterval = window.setInterval(() => {
    if (!isWonMatch.value) {
      matchTimerSec.value = Math.floor((Date.now() - matchStartTime.value) / 1000);
    }
  }, 1000);
}

function flipCard(idx: number) {
  const card = matchCards.value[idx];
  if (card.isMatched || card.isFlipped || flippedIndexes.value.length >= 2) return;

  card.isFlipped = true;
  flippedIndexes.value.push(idx);
  sfxMove();

  if (flippedIndexes.value.length === 2) {
    matchMoves.value++;
    const [firstIdx, secondIdx] = flippedIndexes.value;
    const card1 = matchCards.value[firstIdx];
    const card2 = matchCards.value[secondIdx];

    if (card1.tech === card2.tech) {
      setTimeout(() => {
        card1.isMatched = true;
        card2.isMatched = true;
        flippedIndexes.value = [];
        matchPairsFound.value++;
        sfxMerge();

        if (matchPairsFound.value === TECH_PAIRS.length) {
          isWonMatch.value = true;
          sfxWin();
          if (matchTimerInterval) clearInterval(matchTimerInterval);
        }
      }, 350);
    } else {
      setTimeout(() => {
        card1.isFlipped = false;
        card2.isFlipped = false;
        flippedIndexes.value = [];
      }, 850);
    }
  }
}

// =============================================================
// KEYBOARD & SWIPE GESTURES
// =============================================================
function handleKeydown(e: KeyboardEvent) {
  if (activeGame.value === "2048") {
    if (["ArrowUp", "KeyW"].includes(e.code)) {
      e.preventDefault();
      move2048("up");
    } else if (["ArrowDown", "KeyS"].includes(e.code)) {
      e.preventDefault();
      move2048("down");
    } else if (["ArrowLeft", "KeyA"].includes(e.code)) {
      e.preventDefault();
      move2048("left");
    } else if (["ArrowRight", "KeyD"].includes(e.code)) {
      e.preventDefault();
      move2048("right");
    }
  } else if (activeGame.value === "snake") {
    if (["ArrowUp", "KeyW"].includes(e.code)) {
      e.preventDefault();
      changeSnakeDir("UP");
    } else if (["ArrowDown", "KeyS"].includes(e.code)) {
      e.preventDefault();
      changeSnakeDir("DOWN");
    } else if (["ArrowLeft", "KeyA"].includes(e.code)) {
      e.preventDefault();
      changeSnakeDir("LEFT");
    } else if (["ArrowRight", "KeyD"].includes(e.code)) {
      e.preventDefault();
      changeSnakeDir("RIGHT");
    } else if (e.code === "Space") {
      e.preventDefault();
      isPausedSnake.value = !isPausedSnake.value;
    }
  }
}

let touchStartX = 0;
let touchStartY = 0;

function handleTouchStart(e: TouchEvent) {
  touchStartX = e.touches[0].clientX;
  touchStartY = e.touches[0].clientY;
}

function handleTouchEnd(e: TouchEvent) {
  const dx = e.changedTouches[0].clientX - touchStartX;
  const dy = e.changedTouches[0].clientY - touchStartY;
  const absDx = Math.abs(dx);
  const absDy = Math.abs(dy);

  if (Math.max(absDx, absDy) < 25) return;

  if (activeGame.value === "2048") {
    if (absDx > absDy) {
      move2048(dx > 0 ? "right" : "left");
    } else {
      move2048(dy > 0 ? "down" : "up");
    }
  } else if (activeGame.value === "snake") {
    if (absDx > absDy) {
      changeSnakeDir(dx > 0 ? "RIGHT" : "LEFT");
    } else {
      changeSnakeDir(dy > 0 ? "DOWN" : "UP");
    }
  }
}

onMounted(() => {
  init2048();
  initSnake();
  initMatch();
  window.addEventListener("keydown", handleKeydown);
});

onUnmounted(() => {
  window.removeEventListener("keydown", handleKeydown);
  if (snakeTimer) clearInterval(snakeTimer);
  if (matchTimerInterval) clearInterval(matchTimerInterval);
});
</script>

<template>
  <div
    class="w-full h-full flex flex-col bg-slate-950 text-slate-100 select-none overflow-hidden font-sans"
    @touchstart="handleTouchStart"
    @touchend="handleTouchEnd"
  >
    <!-- TOP IPADOS SUBHEADER BAR -->
    <div
      class="h-11 px-3.5 bg-slate-900/90 border-b border-white/10 flex items-center justify-between text-xs backdrop-blur-md shrink-0 gap-2 select-none"
    >
      <!-- Left: Back Button & App Title -->
      <div class="flex items-center gap-2.5 shrink-0">
        <button
          type="button"
          class="w-7 h-7 rounded-full bg-cyan-500/20 hover:bg-cyan-500/35 active:scale-90 text-cyan-300 hover:text-cyan-100 border border-cyan-500/35 flex items-center justify-center transition-all cursor-pointer shadow-sm group"
          title="Back to Home Screen"
          aria-label="Back"
          @click="emit('close')"
        >
          <svg
            viewBox="0 0 24 24"
            class="w-4 h-4 transition-transform group-hover:-translate-x-0.5"
            fill="none"
            stroke="currentColor"
            stroke-width="2.5"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>

        <div class="flex items-center gap-1.5">
          <span class="text-base">🕹️</span>
          <span class="font-extrabold text-sm tracking-wide bg-linear-to-r from-pink-400 via-rose-400 to-amber-300 bg-clip-text text-transparent hidden sm:inline">
            Apple Arcade
          </span>
        </div>
      </div>

      <!-- Center: Game Selectors -->
      <div
        class="flex items-center bg-slate-950/80 p-0.5 rounded-xl border border-white/10 shadow-inner gap-0.5 text-[11px] font-medium"
      >
        <button
          class="px-2.5 py-1 rounded-lg transition-all flex items-center gap-1 cursor-pointer"
          :class="
            activeGame === '2048'
              ? 'bg-rose-500 text-white font-bold shadow-sm'
              : 'text-slate-400 hover:text-white'
          "
          @click="activeGame = '2048'"
        >
          <span>🔢</span>
          <span>2048</span>
        </button>

        <button
          class="px-2.5 py-1 rounded-lg transition-all flex items-center gap-1 cursor-pointer"
          :class="
            activeGame === 'snake'
              ? 'bg-emerald-500 text-slate-950 font-bold shadow-sm'
              : 'text-slate-400 hover:text-white'
          "
          @click="activeGame = 'snake'"
        >
          <span>🐍</span>
          <span>Snake</span>
        </button>

        <button
          class="px-2.5 py-1 rounded-lg transition-all flex items-center gap-1 cursor-pointer"
          :class="
            activeGame === 'match'
              ? 'bg-purple-500 text-white font-bold shadow-sm'
              : 'text-slate-400 hover:text-white'
          "
          @click="activeGame = 'match'"
        >
          <span>🃏</span>
          <span>Match</span>
        </button>
      </div>

      <!-- Right: Sound Toggle & Quick Reset -->
      <div class="flex items-center gap-1.5 shrink-0">
        <button
          class="w-7 h-7 rounded-lg bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white flex items-center justify-center text-xs transition cursor-pointer"
          :title="isMuted ? 'Unmute Sound FX' : 'Mute Sound FX'"
          @click="toggleMute"
        >
          <span>{{ isMuted ? "🔇" : "🔊" }}</span>
        </button>
      </div>
    </div>

    <!-- MAIN GAME CANVAS & PLAYGROUND -->
    <div class="flex-1 w-full h-full overflow-y-auto p-3 sm:p-4 flex flex-col items-center justify-center">
      <!-- ======================================================= -->
      <!-- 1. 2048 DEV EDITION -->
      <!-- ======================================================= -->
      <div
        v-if="activeGame === '2048'"
        class="w-full max-w-sm flex flex-col items-center gap-3 animate-fade-in"
      >
        <!-- Top Score Bar -->
        <div class="w-full flex items-center justify-between gap-2">
          <div class="flex items-center gap-1.5">
            <button
              class="px-2.5 py-1 rounded-lg border text-[11px] font-semibold transition cursor-pointer"
              :class="
                techMode
                  ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40'
                  : 'bg-white/5 text-slate-400 border-white/10'
              "
              @click="techMode = !techMode"
            >
              {{ techMode ? "⚡ Dev Mode" : "🔢 2048 Mode" }}
            </button>
            <button
              v-if="prevBoard2048"
              class="px-2 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-[11px] text-slate-300 transition cursor-pointer"
              title="Undo 1 step"
              @click="undo2048"
            >
              ↩ Undo
            </button>
          </div>

          <div class="flex items-center gap-2">
            <div class="bg-slate-900 border border-white/10 px-2.5 py-1 rounded-lg text-center min-w-14">
              <div class="text-[9px] uppercase tracking-wider text-slate-400 font-bold">Score</div>
              <div class="text-xs font-mono font-bold text-cyan-400">{{ score2048 }}</div>
            </div>
            <div class="bg-slate-900 border border-white/10 px-2.5 py-1 rounded-lg text-center min-w-14">
              <div class="text-[9px] uppercase tracking-wider text-slate-400 font-bold">Best</div>
              <div class="text-xs font-mono font-bold text-amber-400">{{ bestScore2048 }}</div>
            </div>
            <button
              class="w-7 h-7 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-bold flex items-center justify-center transition cursor-pointer shadow-sm"
              title="Restart 2048"
              @click="init2048"
            >
              ↻
            </button>
          </div>
        </div>

        <!-- 2048 Board -->
        <div class="relative w-72 sm:w-84 h-72 sm:h-84 p-2 bg-slate-900/90 rounded-2xl border-2 border-white/15 shadow-2xl grid grid-cols-4 grid-rows-4 gap-2">
          <template v-for="(row, rIdx) in board2048" :key="rIdx">
            <div
              v-for="(val, cIdx) in row"
              :key="`${rIdx}-${cIdx}`"
              class="relative rounded-xl flex flex-col items-center justify-center transition-all duration-150 select-none shadow-sm overflow-hidden"
              :class="[
                val === 0
                  ? 'bg-slate-950/60 border border-white/5'
                  : `bg-linear-to-br ${techTiles[val]?.bg || 'from-purple-600 to-indigo-800'} ${techTiles[val]?.text || 'text-white'} shadow-md`,
              ]"
            >
              <template v-if="val > 0">
                <template v-if="techMode && techTiles[val]">
                  <SkillIcon
                    v-if="techTiles[val].icon"
                    :name="techTiles[val].name"
                    :icon="techTiles[val].icon"
                    :size="26"
                  />
                  <span class="text-[10px] sm:text-[11px] font-extrabold tracking-tight mt-0.5 truncate px-1">
                    {{ techTiles[val].name }}
                  </span>
                </template>
                <span
                  v-else
                  class="font-mono font-extrabold"
                  :class="val >= 1024 ? 'text-sm sm:text-base' : val >= 128 ? 'text-base sm:text-lg' : 'text-lg sm:text-xl'"
                >
                  {{ val }}
                </span>
              </template>
            </div>
          </template>

          <!-- Game Over Overlay -->
          <div
            v-if="isGameOver2048"
            class="absolute inset-0 bg-slate-950/90 backdrop-blur-md rounded-2xl flex flex-col items-center justify-center p-4 gap-3 text-center animate-fade-in z-20"
          >
            <div class="text-3xl">💀</div>
            <h3 class="text-base font-extrabold text-rose-400">Game Over!</h3>
            <p class="text-xs text-slate-300">Final Score: <strong class="text-cyan-400">{{ score2048 }}</strong></p>
            <button
              class="px-4 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs transition cursor-pointer shadow-lg active:scale-95"
              @click="init2048"
            >
              Try Again
            </button>
          </div>

          <!-- Victory Overlay -->
          <div
            v-if="hasWon2048 && !isGameOver2048"
            class="absolute inset-0 bg-amber-950/90 backdrop-blur-md rounded-2xl flex flex-col items-center justify-center p-4 gap-2 text-center animate-fade-in z-20"
          >
            <div class="text-3xl">🏆</div>
            <h3 class="text-base font-extrabold text-amber-300">Senior Architect!</h3>
            <p class="text-xs text-amber-100">You reached 2048 / Master level!</p>
            <div class="flex gap-2 pt-1">
              <button
                class="px-3 py-1 rounded-lg bg-white/20 hover:bg-white/30 text-white text-xs font-semibold cursor-pointer"
                @click="hasWon2048 = false"
              >
                Keep Playing
              </button>
              <button
                class="px-3 py-1 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold cursor-pointer"
                @click="init2048"
              >
                New Game
              </button>
            </div>
          </div>
        </div>

        <!-- Touch Controls D-Pad for Tablet -->
        <div class="flex flex-col items-center gap-1 pt-1 sm:hidden">
          <button
            class="w-10 h-9 rounded-lg bg-white/10 active:bg-white/30 flex items-center justify-center text-sm font-bold cursor-pointer"
            @click="move2048('up')"
          >
            ▲
          </button>
          <div class="flex gap-4">
            <button
              class="w-10 h-9 rounded-lg bg-white/10 active:bg-white/30 flex items-center justify-center text-sm font-bold cursor-pointer"
              @click="move2048('left')"
            >
              ◀
            </button>
            <button
              class="w-10 h-9 rounded-lg bg-white/10 active:bg-white/30 flex items-center justify-center text-sm font-bold cursor-pointer"
              @click="move2048('down')"
            >
              ▼
            </button>
            <button
              class="w-10 h-9 rounded-lg bg-white/10 active:bg-white/30 flex items-center justify-center text-sm font-bold cursor-pointer"
              @click="move2048('right')"
            >
              ▶
            </button>
          </div>
        </div>
        <p class="text-[10px] text-slate-400 hidden sm:block">
          Use <strong>Arrow Keys</strong> or <strong>Swipe</strong> to merge tiles.
        </p>
      </div>

      <!-- ======================================================= -->
      <!-- 2. RETRO SNAKE ARCADE -->
      <!-- ======================================================= -->
      <div
        v-else-if="activeGame === 'snake'"
        class="w-full max-w-sm flex flex-col items-center gap-3 animate-fade-in"
      >
        <!-- Top Score Bar -->
        <div class="w-full flex items-center justify-between gap-2">
          <div class="flex items-center gap-1.5">
            <button
              class="px-2 py-1 rounded-lg border text-[10px] font-mono transition cursor-pointer"
              :class="snakeSpeed === 'chill' ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40' : 'bg-white/5 text-slate-400 border-white/10'"
              @click="snakeSpeed = 'chill'; startSnakeLoop()"
            >
              Chill
            </button>
            <button
              class="px-2 py-1 rounded-lg border text-[10px] font-mono transition cursor-pointer"
              :class="snakeSpeed === 'normal' ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40' : 'bg-white/5 text-slate-400 border-white/10'"
              @click="snakeSpeed = 'normal'; startSnakeLoop()"
            >
              Normal
            </button>
            <button
              class="px-2 py-1 rounded-lg border text-[10px] font-mono transition cursor-pointer"
              :class="snakeSpeed === 'blitz' ? 'bg-rose-500/20 text-rose-300 border-rose-500/40' : 'bg-white/5 text-slate-400 border-white/10'"
              @click="snakeSpeed = 'blitz'; startSnakeLoop()"
            >
              Blitz
            </button>
          </div>

          <div class="flex items-center gap-2">
            <div class="bg-slate-900 border border-white/10 px-2.5 py-1 rounded-lg text-center min-w-14">
              <div class="text-[9px] uppercase tracking-wider text-slate-400 font-bold">Score</div>
              <div class="text-xs font-mono font-bold text-emerald-400">{{ snakeScore }}</div>
            </div>
            <div class="bg-slate-900 border border-white/10 px-2.5 py-1 rounded-lg text-center min-w-14">
              <div class="text-[9px] uppercase tracking-wider text-slate-400 font-bold">Best</div>
              <div class="text-xs font-mono font-bold text-amber-400">{{ bestSnakeScore }}</div>
            </div>
            <button
              class="w-7 h-7 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold flex items-center justify-center transition cursor-pointer shadow-sm"
              title="Restart Snake"
              @click="initSnake"
            >
              ↻
            </button>
          </div>
        </div>

        <!-- Snake Board -->
        <div class="relative w-72 sm:w-84 h-72 sm:h-84 p-1.5 bg-slate-950 rounded-2xl border-2 border-emerald-500/40 shadow-[0_0_20px_rgba(16,185,129,0.15)] grid grid-cols-18 grid-rows-18 gap-0.5 overflow-hidden">
          <div
            v-for="y in GRID_SIZE"
            :key="`row-${y}`"
            class="contents"
          >
            <div
              v-for="x in GRID_SIZE"
              :key="`cell-${x - 1}-${y - 1}`"
              class="w-full h-full rounded-[2px] transition-colors duration-75 flex items-center justify-center"
              :class="[
                snake[0]?.x === x - 1 && snake[0]?.y === y - 1
                  ? 'bg-cyan-300 shadow-[0_0_8px_#22d3ee] z-10'
                  : snake.some((s) => s.x === x - 1 && s.y === y - 1)
                  ? 'bg-emerald-400 shadow-[0_0_4px_#34d399]'
                  : food.x === x - 1 && food.y === y - 1
                  ? foodKind === 'energy'
                    ? 'bg-amber-400 animate-ping'
                    : foodKind === 'bug'
                    ? 'bg-rose-500 animate-pulse'
                    : 'bg-amber-300 animate-bounce'
                  : 'bg-slate-900/35',
              ]"
            >
              <span
                v-if="food.x === x - 1 && food.y === y - 1"
                class="text-[9px] pointer-events-none"
              >
                {{ foodKind === "coffee" ? "☕" : foodKind === "bug" ? "🐛" : "⚡" }}
              </span>
            </div>
          </div>

          <!-- Snake Game Over Overlay -->
          <div
            v-if="isGameOverSnake"
            class="absolute inset-0 bg-slate-950/90 backdrop-blur-md flex flex-col items-center justify-center p-4 gap-2 text-center animate-fade-in z-20"
          >
            <div class="text-3xl">💥</div>
            <h3 class="text-base font-extrabold text-rose-400">Snake Crashed!</h3>
            <p class="text-xs text-slate-300">Final Score: <strong class="text-emerald-400">{{ snakeScore }}</strong></p>
            <button
              class="mt-1 px-4 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition cursor-pointer shadow-lg active:scale-95"
              @click="initSnake"
            >
              Play Again
            </button>
          </div>
        </div>

        <!-- Touch Controls D-Pad -->
        <div class="flex flex-col items-center gap-1 pt-1">
          <button
            class="w-12 h-9 rounded-xl bg-emerald-500/20 active:bg-emerald-500/40 border border-emerald-500/30 text-emerald-300 flex items-center justify-center text-sm font-bold cursor-pointer transition shadow-sm"
            @click="changeSnakeDir('UP')"
          >
            ▲
          </button>
          <div class="flex gap-4">
            <button
              class="w-12 h-9 rounded-xl bg-emerald-500/20 active:bg-emerald-500/40 border border-emerald-500/30 text-emerald-300 flex items-center justify-center text-sm font-bold cursor-pointer transition shadow-sm"
              @click="changeSnakeDir('LEFT')"
            >
              ◀
            </button>
            <button
              class="w-12 h-9 rounded-xl bg-emerald-500/20 active:bg-emerald-500/40 border border-emerald-500/30 text-emerald-300 flex items-center justify-center text-sm font-bold cursor-pointer transition shadow-sm"
              @click="changeSnakeDir('DOWN')"
            >
              ▼
            </button>
            <button
              class="w-12 h-9 rounded-xl bg-emerald-500/20 active:bg-emerald-500/40 border border-emerald-500/30 text-emerald-300 flex items-center justify-center text-sm font-bold cursor-pointer transition shadow-sm"
              @click="changeSnakeDir('RIGHT')"
            >
              ▶
            </button>
          </div>
        </div>
      </div>

      <!-- ======================================================= -->
      <!-- 3. TECH MEMORY MATCH -->
      <!-- ======================================================= -->
      <div
        v-else-if="activeGame === 'match'"
        class="w-full max-w-sm flex flex-col items-center gap-3 animate-fade-in"
      >
        <!-- Top Status Bar -->
        <div class="w-full flex items-center justify-between gap-2">
          <div class="flex items-center gap-2">
            <div class="bg-slate-900 border border-white/10 px-2.5 py-1 rounded-lg text-center">
              <div class="text-[9px] uppercase tracking-wider text-slate-400 font-bold">Moves</div>
              <div class="text-xs font-mono font-bold text-purple-300">{{ matchMoves }}</div>
            </div>
            <div class="bg-slate-900 border border-white/10 px-2.5 py-1 rounded-lg text-center">
              <div class="text-[9px] uppercase tracking-wider text-slate-400 font-bold">Time</div>
              <div class="text-xs font-mono font-bold text-cyan-300">{{ matchTimerSec }}s</div>
            </div>
            <div class="bg-slate-900 border border-white/10 px-2.5 py-1 rounded-lg text-center">
              <div class="text-[9px] uppercase tracking-wider text-slate-400 font-bold">Pairs</div>
              <div class="text-xs font-mono font-bold text-emerald-300">{{ matchPairsFound }}/8</div>
            </div>
          </div>

          <button
            class="w-7 h-7 rounded-lg bg-purple-600 hover:bg-purple-500 text-white font-bold flex items-center justify-center transition cursor-pointer shadow-sm"
            title="Restart Match"
            @click="initMatch"
          >
            ↻
          </button>
        </div>

        <!-- 4x4 Cards Grid -->
        <div class="relative w-72 sm:w-84 h-72 sm:h-84 p-2.5 bg-slate-900/90 rounded-2xl border-2 border-purple-500/30 shadow-2xl grid grid-cols-4 grid-rows-4 gap-2">
          <div
            v-for="(card, idx) in matchCards"
            :key="card.id"
            class="relative rounded-xl flex flex-col items-center justify-center cursor-pointer transition-all duration-200 select-none shadow-sm perspective-1000"
            :class="[
              card.isMatched
                ? 'bg-emerald-500/20 border border-emerald-500/40 opacity-70 scale-95'
                : card.isFlipped
                ? 'bg-slate-800 border-2 border-purple-400 shadow-md scale-105'
                : 'bg-linear-to-br from-purple-700 to-indigo-900 border border-white/15 hover:border-purple-400/60 hover:-translate-y-0.5 active:scale-95',
            ]"
            @click="flipCard(idx)"
          >
            <!-- Card Front (Revealed) -->
            <div
              v-if="card.isFlipped || card.isMatched"
              class="w-full h-full flex flex-col items-center justify-center p-1"
            >
              <SkillIcon :name="card.name" :icon="card.tech" :size="32" />
              <span class="text-[9px] font-bold text-slate-200 truncate mt-0.5 max-w-14 text-center">
                {{ card.name }}
              </span>
            </div>

            <!-- Card Back (Hidden) -->
            <div
              v-else
              class="flex flex-col items-center justify-center"
            >
              <span class="text-xl opacity-70">💎</span>
            </div>
          </div>

          <!-- Victory Overlay -->
          <div
            v-if="isWonMatch"
            class="absolute inset-0 bg-slate-950/95 backdrop-blur-md rounded-2xl flex flex-col items-center justify-center p-4 gap-2 text-center animate-fade-in z-20"
          >
            <div class="text-3xl">🎉</div>
            <h3 class="text-base font-extrabold text-purple-300">Memory Master!</h3>
            <p class="text-xs text-slate-300">
              Completed in <strong>{{ matchMoves }}</strong> moves (<strong class="text-cyan-400">{{ matchTimerSec }}s</strong>)!
            </p>
            <div class="text-lg">⭐⭐⭐</div>
            <button
              class="mt-1 px-4 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs transition cursor-pointer shadow-lg active:scale-95"
              @click="initMatch"
            >
              Play Again
            </button>
          </div>
        </div>
        <p class="text-[10px] text-slate-400">Flip cards to match all 8 technology pairs!</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.perspective-1000 {
  perspective: 1000px;
}
.animate-fade-in {
  animation: fadeIn 0.25s ease-out;
}
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(6px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
