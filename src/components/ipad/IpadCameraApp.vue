<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from "vue";

interface CapturedPhoto {
  id: number;
  url: string;
  timestamp: string;
  mode: string;
  filter: string;
}

const emit = defineEmits<{
  (e: "close"): void;
  (e: "cameraActive", active: boolean): void;
}>();

// -------------------------------------------------------------
// CAMERA HARDWARE & STREAM STATE
// -------------------------------------------------------------
const videoRef = ref<HTMLVideoElement | null>(null);
const simCanvasRef = ref<HTMLCanvasElement | null>(null);
const stream = ref<MediaStream | null>(null);
const hasPermission = ref<boolean | null>(null);
const facingMode = ref<"user" | "environment">("user");
const simulatedSceneActive = ref(false);

// -------------------------------------------------------------
// CAMERA CONTROLS & SETTINGS
// -------------------------------------------------------------
const activeMode = ref<"photo" | "video" | "portrait" | "square">("photo");
const modes = [
  { id: "video", label: "VIDEO" },
  { id: "photo", label: "PHOTO" },
  { id: "portrait", label: "PORTRAIT" },
  { id: "square", label: "SQUARE" },
] as const;

const activeFilter = ref("normal");
const filters = [
  { id: "normal", label: "Original", css: "none" },
  { id: "vivid", label: "Vivid", css: "contrast(1.25) saturate(1.4)" },
  { id: "mono", label: "Noir", css: "grayscale(1) contrast(1.45) brightness(0.95)" },
  { id: "cyber", label: "Cyberpunk", css: "hue-rotate(85deg) contrast(1.3) saturate(1.6)" },
  { id: "sepia", label: "Warm 90s", css: "sepia(0.7) contrast(1.15) brightness(0.95)" },
  { id: "cool", label: "Cinema", css: "hue-rotate(185deg) saturate(1.25) contrast(1.1)" },
];

const currentFilterCss = computed(() => {
  const found = filters.find((f) => f.id === activeFilter.value);
  return found ? found.css : "none";
});

const zoomLevel = ref<1 | 2>(1);
const flashMode = ref<"off" | "on">("off");
const timerSetting = ref<0 | 3 | 10>(0);
const timerCountdown = ref<number | null>(null);
const isCountingDown = ref(false);
let countdownInterval = 0;

const showGrid = ref(false);
const isFlashing = ref(false);
const showFilterTray = ref(false);

// -------------------------------------------------------------
// VIDEO RECORDING STATE
// -------------------------------------------------------------
const isRecording = ref(false);
const recordingSeconds = ref(0);
let recordingTimer = 0;

// -------------------------------------------------------------
// PHOTO ROLL / GALLERY STATE
// -------------------------------------------------------------
const capturedPhotos = ref<CapturedPhoto[]>([]);
const showGalleryModal = ref(false);
const selectedPhoto = ref<CapturedPhoto | null>(null);

// -------------------------------------------------------------
// TAP TO FOCUS
// -------------------------------------------------------------
const showFocusBox = ref(false);
const focusPos = ref({ x: 0, y: 0 });
let focusTimeout = 0;

function handleViewfinderClick(e: MouseEvent) {
  const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
  focusPos.value = {
    x: e.clientX - rect.left,
    y: e.clientY - rect.top,
  };
  showFocusBox.value = true;
  clearTimeout(focusTimeout);
  focusTimeout = window.setTimeout(() => {
    showFocusBox.value = false;
  }, 1500);
}

// -------------------------------------------------------------
// AUDIO: REALISTIC TWO-STAGE SHUTTER SOUND
// -------------------------------------------------------------
function playShutterSound() {
  try {
    const AudioContextClass =
      window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();

    // First click: mirror slap
    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();
    osc1.type = "sine";
    osc1.frequency.setValueAtTime(800, ctx.currentTime);
    osc1.frequency.exponentialRampToValueAtTime(120, ctx.currentTime + 0.05);
    gain1.gain.setValueAtTime(0.35, ctx.currentTime);
    gain1.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.05);
    osc1.connect(gain1);
    gain1.connect(ctx.destination);
    osc1.start();
    osc1.stop(ctx.currentTime + 0.06);

    // Second click: shutter curtain closure
    setTimeout(() => {
      try {
        const osc2 = ctx.createOscillator();
        const gain2 = ctx.createGain();
        osc2.type = "triangle";
        osc2.frequency.setValueAtTime(600, ctx.currentTime);
        osc2.frequency.exponentialRampToValueAtTime(90, ctx.currentTime + 0.06);
        gain2.gain.setValueAtTime(0.3, ctx.currentTime);
        gain2.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.06);
        osc2.connect(gain2);
        gain2.connect(ctx.destination);
        osc2.start();
        osc2.stop(ctx.currentTime + 0.07);
      } catch {}
    }, 80);
  } catch {}
}

// -------------------------------------------------------------
// WEBCAM INITIALIZATION & STREAM
// -------------------------------------------------------------
async function initCamera() {
  stopStream();
  simulatedSceneActive.value = false;

  try {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      throw new Error("getUserMedia not supported");
    }

    const mediaStream = await navigator.mediaDevices.getUserMedia({
      video: {
        facingMode: facingMode.value,
        width: { ideal: 1280 },
        height: { ideal: 720 },
      },
      audio: false,
    });

    stream.value = mediaStream;
    hasPermission.value = true;
    emit("cameraActive", true);

    if (videoRef.value) {
      videoRef.value.srcObject = mediaStream;
      videoRef.value.play().catch(() => {});
    }
  } catch (err) {
    hasPermission.value = false;
    simulatedSceneActive.value = true;
    emit("cameraActive", true);
    startSimulatedAnimation();
  }
}

function stopStream() {
  if (stream.value) {
    stream.value.getTracks().forEach((track) => track.stop());
    stream.value = null;
  }
  emit("cameraActive", false);
}

function flipCamera() {
  facingMode.value = facingMode.value === "user" ? "environment" : "user";
  initCamera();
}

// -------------------------------------------------------------
// SIMULATED CAMERA STUDIO ANIMATION (Fallback)
// -------------------------------------------------------------
let simAnimFrame = 0;
let simAngle = 0;

function startSimulatedAnimation() {
  cancelAnimationFrame(simAnimFrame);
  function render() {
    if (!simCanvasRef.value) return;
    const canvas = simCanvasRef.value;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.fillStyle = "#090d16";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Cyberpunk grid
    ctx.strokeStyle = "rgba(34, 211, 238, 0.15)";
    ctx.lineWidth = 1;
    const gridSpacing = 40;
    for (let x = 0; x < canvas.width; x += gridSpacing) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, canvas.height);
      ctx.stroke();
    }
    for (let y = 0; y < canvas.height; y += gridSpacing) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(canvas.width, y);
      ctx.stroke();
    }

    // Concentric scanner rings
    simAngle += 0.02;
    const cx = canvas.width / 2;
    const cy = canvas.height / 2;

    ctx.save();
    ctx.translate(cx, cy);

    ctx.strokeStyle = "rgba(168, 85, 247, 0.4)";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(0, 0, 110 + Math.sin(simAngle * 2) * 8, 0, Math.PI * 2);
    ctx.stroke();

    ctx.strokeStyle = "#22d3ee";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(0, 0, 80, simAngle, simAngle + Math.PI * 1.3);
    ctx.stroke();

    // Victor's Cyber Reticle
    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 14px monospace";
    ctx.textAlign = "center";
    ctx.fillText("VICTOR VISION // M4 CAMERA", 0, -10);

    ctx.font = "11px monospace";
    ctx.fillStyle = "#22d3ee";
    ctx.fillText("LIVE VIRTUAL STUDIO SENSOR", 0, 14);

    ctx.font = "10px monospace";
    ctx.fillStyle = "#a1a1aa";
    ctx.fillText("Ultra Retina XDR • 60 FPS • RAW", 0, 32);

    ctx.restore();

    simAnimFrame = requestAnimationFrame(render);
  }
  simAnimFrame = requestAnimationFrame(render);
}

// -------------------------------------------------------------
// SHUTTER & PHOTO CAPTURE
// -------------------------------------------------------------
function triggerShutter() {
  if (activeMode.value === "video") {
    toggleVideoRecording();
    return;
  }

  if (isCountingDown.value) return;

  if (timerSetting.value > 0) {
    isCountingDown.value = true;
    timerCountdown.value = timerSetting.value;

    clearInterval(countdownInterval);
    countdownInterval = window.setInterval(() => {
      if (timerCountdown.value !== null && timerCountdown.value > 1) {
        timerCountdown.value--;
      } else {
        clearInterval(countdownInterval);
        timerCountdown.value = null;
        isCountingDown.value = false;
        capturePhotoFrame();
      }
    }, 1000);
  } else {
    capturePhotoFrame();
  }
}

function capturePhotoFrame() {
  // Flash burst
  if (flashMode.value === "on") {
    isFlashing.value = true;
    setTimeout(() => {
      isFlashing.value = false;
    }, 280);
  }

  playShutterSound();

  const canvas = document.createElement("canvas");
  const targetW = videoRef.value?.videoWidth || 800;
  const targetH = videoRef.value?.videoHeight || 600;

  if (activeMode.value === "square") {
    const squareSize = Math.min(targetW, targetH);
    canvas.width = squareSize;
    canvas.height = squareSize;
  } else {
    canvas.width = targetW;
    canvas.height = targetH;
  }

  const ctx = canvas.getContext("2d");
  if (ctx) {
    if (currentFilterCss.value !== "none") {
      ctx.filter = currentFilterCss.value;
    }

    if (simulatedSceneActive.value && simCanvasRef.value) {
      ctx.drawImage(simCanvasRef.value, 0, 0, canvas.width, canvas.height);
    } else if (videoRef.value) {
      if (facingMode.value === "user") {
        ctx.translate(canvas.width, 0);
        ctx.scale(-1, 1);
      }

      if (activeMode.value === "square") {
        const squareSize = Math.min(targetW, targetH);
        const sx = (targetW - squareSize) / 2;
        const sy = (targetH - squareSize) / 2;
        ctx.drawImage(videoRef.value, sx, sy, squareSize, squareSize, 0, 0, squareSize, squareSize);
      } else {
        ctx.drawImage(videoRef.value, 0, 0, targetW, targetH);
      }
    }

    const photoUrl = canvas.toDataURL("image/png");
    const photo: CapturedPhoto = {
      id: Date.now(),
      url: photoUrl,
      timestamp: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      }),
      mode: activeMode.value.toUpperCase(),
      filter: activeFilter.value,
    };

    capturedPhotos.value.unshift(photo);
  }
}

// -------------------------------------------------------------
// VIDEO RECORDING TOGGLE
// -------------------------------------------------------------
function toggleVideoRecording() {
  if (isRecording.value) {
    // Stop recording
    isRecording.value = false;
    clearInterval(recordingTimer);
    capturePhotoFrame(); // capture representative thumbnail clip frame
  } else {
    // Start recording
    isRecording.value = true;
    recordingSeconds.value = 0;
    clearInterval(recordingTimer);
    recordingTimer = window.setInterval(() => {
      recordingSeconds.value++;
    }, 1000);
  }
}

const formattedRecordTime = computed(() => {
  const mins = Math.floor(recordingSeconds.value / 60)
    .toString()
    .padStart(2, "0");
  const secs = (recordingSeconds.value % 60).toString().padStart(2, "0");
  return `${mins}:${secs}`;
});

// -------------------------------------------------------------
// GALLERY MODAL ACTIONS
// -------------------------------------------------------------
function openGallery(photo?: CapturedPhoto) {
  selectedPhoto.value = photo || capturedPhotos.value[0] || null;
  showGalleryModal.value = true;
}

function downloadPhoto(photo: CapturedPhoto) {
  const a = document.createElement("a");
  a.href = photo.url;
  a.download = `ipad-pro-capture-${photo.id}.png`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

function deleteSelectedPhoto() {
  if (!selectedPhoto.value) return;
  const targetId = selectedPhoto.value.id;
  capturedPhotos.value = capturedPhotos.value.filter((p) => p.id !== targetId);
  selectedPhoto.value = capturedPhotos.value[0] || null;
  if (!selectedPhoto.value) {
    showGalleryModal.value = false;
  }
}

onMounted(() => {
  initCamera();
});

onUnmounted(() => {
  stopStream();
  cancelAnimationFrame(simAnimFrame);
  clearInterval(recordingTimer);
  clearInterval(countdownInterval);
  clearTimeout(focusTimeout);
});
</script>

<template>
  <div
    class="relative w-full h-full bg-black text-white flex flex-col justify-between overflow-hidden select-none"
  >
    <!-- Screen Flash Effect -->
    <div
      v-if="isFlashing"
      class="absolute inset-0 z-50 bg-white transition-opacity duration-200 pointer-events-none"
    ></div>

    <!-- Self-Timer Large Countdown Overlay -->
    <div
      v-if="isCountingDown && timerCountdown !== null"
      class="absolute inset-0 z-40 flex items-center justify-center pointer-events-none"
    >
      <span
        class="text-8xl sm:text-9xl font-extrabold text-white drop-shadow-[0_0_25px_rgba(0,0,0,0.9)] animate-ping"
      >
        {{ timerCountdown }}
      </span>
    </div>

    <!-- ========================================================= -->
    <!-- 1. TOP CONTROLS TOOLBAR -->
    <!-- ========================================================= -->
    <div
      class="relative z-30 h-11 px-4 bg-black/60 backdrop-blur-md flex items-center justify-between text-xs border-b border-white/10"
    >
      <!-- Left: Flash & Timer -->
      <div class="flex items-center gap-3">
        <!-- Flash button -->
        <button
          class="flex items-center gap-1 px-2 py-1 rounded-full transition-colors cursor-pointer"
          :class="flashMode === 'on' ? 'bg-amber-400 text-black font-bold' : 'text-white/80 hover:bg-white/15'"
          :title="flashMode === 'on' ? 'Flash: ON' : 'Flash: OFF'"
          @click="flashMode = flashMode === 'on' ? 'off' : 'on'"
        >
          <svg viewBox="0 0 24 24" class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2">
            <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
          </svg>
          <span class="text-[10px] font-mono uppercase">{{ flashMode }}</span>
        </button>

        <!-- Timer button -->
        <button
          class="flex items-center gap-1 px-2 py-1 rounded-full transition-colors cursor-pointer"
          :class="timerSetting > 0 ? 'bg-amber-400 text-black font-bold' : 'text-white/80 hover:bg-white/15'"
          :title="'Timer: ' + (timerSetting ? timerSetting + 's' : 'Off')"
          @click="timerSetting = timerSetting === 0 ? 3 : timerSetting === 3 ? 10 : 0"
        >
          <svg viewBox="0 0 24 24" class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10" />
            <polyline points="12 6 12 12 16 14" />
          </svg>
          <span class="text-[10px] font-mono">{{ timerSetting ? timerSetting + 's' : 'Off' }}</span>
        </button>

        <!-- Grid lines toggle -->
        <button
          class="p-1 rounded-full transition-colors cursor-pointer"
          :class="showGrid ? 'bg-white/30 text-cyan-300' : 'text-white/70 hover:bg-white/15'"
          title="Toggle Rule of Thirds Grid"
          @click="showGrid = !showGrid"
        >
          <svg viewBox="0 0 24 24" class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="8" y1="3" x2="8" y2="21" />
            <line x1="16" y1="3" x2="16" y2="21" />
            <line x1="3" y1="8" x2="21" y2="8" />
            <line x1="3" y1="16" x2="21" y2="16" />
          </svg>
        </button>
      </div>

      <!-- Center: Video Recording Indicator -->
      <div v-if="isRecording" class="flex items-center gap-2 bg-red-600/30 border border-red-500/50 px-3 py-0.5 rounded-full">
        <div class="w-2 h-2 rounded-full bg-red-500 animate-ping"></div>
        <span class="font-mono text-[11px] font-bold text-red-300 tracking-wider">
          REC {{ formattedRecordTime }}
        </span>
      </div>

      <!-- Right: Filters & Switch Mode -->
      <div class="flex items-center gap-2">
        <button
          class="p-1.5 rounded-full transition-colors cursor-pointer"
          :class="showFilterTray ? 'bg-cyan-500 text-black' : 'text-white/80 hover:bg-white/15'"
          title="Creative Photo Filters"
          @click="showFilterTray = !showFilterTray"
        >
          <svg viewBox="0 0 24 24" class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10" />
            <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" />
            <path d="M2 12h20" />
          </svg>
        </button>

        <!-- Simulated vs Live indicator button -->
        <button
          v-if="simulatedSceneActive"
          class="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40 hover:bg-amber-500/30 transition cursor-pointer"
          title="Webcam permission denied or unavailable. Click to retry webcam."
          @click="initCamera"
        >
          Virtual Mode (Retry)
        </button>
      </div>
    </div>

    <!-- ========================================================= -->
    <!-- 2. MAIN VIEWFINDER VIEW -->
    <!-- ========================================================= -->
    <div
      class="relative flex-1 w-full h-full overflow-hidden flex items-center justify-center bg-black cursor-crosshair"
      @click="handleViewfinderClick"
    >
      <!-- Live Video Stream -->
      <video
        v-show="!simulatedSceneActive"
        ref="videoRef"
        class="w-full h-full object-cover transition-all duration-300"
        :class="[
          facingMode === 'user' ? 'scale-x-[-1]' : '',
          activeMode === 'portrait' ? 'blur-[1.5px]' : '',
          activeMode === 'square' ? 'max-w-[400px] max-h-[400px] aspect-square rounded-2xl' : '',
        ]"
        :style="{
          filter: currentFilterCss,
          transform: `${facingMode === 'user' ? 'scaleX(-1)' : ''} scale(${zoomLevel})`,
        }"
        autoplay
        playsinline
        muted
      ></video>

      <!-- Simulated Canvas Studio (Fallback when no webcam) -->
      <canvas
        v-show="simulatedSceneActive"
        ref="simCanvasRef"
        width="800"
        height="500"
        class="w-full h-full object-cover transition-all duration-300"
        :class="[
          activeMode === 'square' ? 'max-w-[400px] max-h-[400px] aspect-square rounded-2xl' : '',
        ]"
        :style="{
          filter: currentFilterCss,
          transform: `scale(${zoomLevel})`,
        }"
      ></canvas>

      <!-- Rule of Thirds Grid Overlay -->
      <div
        v-if="showGrid"
        class="pointer-events-none absolute inset-0 grid grid-cols-3 grid-rows-3 border border-white/20"
      >
        <div class="border-r border-b border-white/20"></div>
        <div class="border-r border-b border-white/20"></div>
        <div class="border-b border-white/20"></div>
        <div class="border-r border-b border-white/20"></div>
        <div class="border-r border-b border-white/20"></div>
        <div class="border-b border-white/20"></div>
        <div class="border-r border-white/20"></div>
        <div class="border-r border-white/20"></div>
        <div></div>
      </div>

      <!-- Tap-To-Focus Yellow Box -->
      <div
        v-if="showFocusBox"
        class="pointer-events-none absolute w-16 h-16 border-2 border-amber-400 rounded-sm -translate-x-1/2 -translate-y-1/2 transition-all duration-150 animate-pulse"
        :style="{ left: `${focusPos.x}px`, top: `${focusPos.y}px` }"
      >
        <div class="absolute -top-4 right-0 text-[9px] font-mono text-amber-400">
          AF
        </div>
      </div>

      <!-- Zoom Level Badge / Switcher -->
      <div
        class="absolute bottom-3 right-3 z-30 flex items-center bg-black/60 backdrop-blur-md rounded-full border border-white/20 p-0.5 text-[10px] font-bold font-mono"
      >
        <button
          class="px-2 py-0.5 rounded-full transition cursor-pointer"
          :class="zoomLevel === 1 ? 'bg-amber-400 text-black' : 'text-white/80 hover:text-white'"
          @click.stop="zoomLevel = 1"
        >
          1x
        </button>
        <button
          class="px-2 py-0.5 rounded-full transition cursor-pointer"
          :class="zoomLevel === 2 ? 'bg-amber-400 text-black' : 'text-white/80 hover:text-white'"
          @click.stop="zoomLevel = 2"
        >
          2x
        </button>
      </div>

      <!-- Filter Tray Popup Strip -->
      <div
        v-if="showFilterTray"
        class="absolute top-3 inset-x-3 z-30 bg-slate-950/90 backdrop-blur-xl border border-white/20 rounded-2xl p-2.5 flex items-center justify-around gap-1.5 shadow-2xl overflow-x-auto"
      >
        <button
          v-for="flt in filters"
          :key="flt.id"
          class="flex flex-col items-center gap-1 p-1.5 rounded-xl transition cursor-pointer shrink-0"
          :class="activeFilter === flt.id ? 'bg-cyan-500/20 border border-cyan-400' : 'hover:bg-white/10 border border-transparent'"
          @click.stop="activeFilter = flt.id"
        >
          <div
            class="w-10 h-10 rounded-lg bg-linear-to-tr from-rose-500 via-purple-500 to-cyan-400 border border-white/30"
            :style="{ filter: flt.css }"
          ></div>
          <span class="text-[10px] font-semibold text-slate-200">{{ flt.label }}</span>
        </button>
      </div>
    </div>

    <!-- ========================================================= -->
    <!-- 3. BOTTOM SHUTTER & MODE CONTROLS -->
    <!-- ========================================================= -->
    <div class="relative z-30 bg-black/80 backdrop-blur-xl pb-3 pt-2 flex flex-col items-center border-t border-white/10">
      <!-- Mode Selection Slider -->
      <div class="flex items-center gap-5 sm:gap-7 mb-3 text-[11px] font-bold tracking-wider">
        <button
          v-for="m in modes"
          :key="m.id"
          class="transition-colors cursor-pointer uppercase"
          :class="activeMode === m.id ? 'text-amber-400 font-extrabold scale-105' : 'text-white/60 hover:text-white'"
          @click="activeMode = m.id"
        >
          {{ m.label }}
        </button>
      </div>

      <!-- Main Action Strip (Thumbnail Gallery, Shutter Button, Flip Camera) -->
      <div class="w-full px-8 flex items-center justify-between">
        <!-- Photo Roll / Thumbnail Preview -->
        <div class="w-12 h-12 flex items-center justify-center">
          <button
            v-if="capturedPhotos.length > 0"
            class="relative w-11 h-11 rounded-xl overflow-hidden border-2 border-white/80 shadow-md hover:scale-105 transition active:scale-95 cursor-pointer"
            title="Open Photos Gallery"
            @click="openGallery()"
          >
            <img
              :src="capturedPhotos[0]?.url"
              alt="Recent capture"
              class="w-full h-full object-cover"
            />
            <span
              class="absolute -top-1 -right-1 bg-cyan-400 text-black text-[9px] font-mono font-bold w-4 h-4 rounded-full flex items-center justify-center"
            >
              {{ capturedPhotos.length }}
            </span>
          </button>
          <div
            v-else
            class="w-10 h-10 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center opacity-40"
          >
            <svg viewBox="0 0 24 24" class="w-5 h-5 text-white" fill="none" stroke="currentColor" stroke-width="2">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
              <circle cx="8.5" cy="8.5" r="1.5" />
              <polyline points="21 15 16 10 5 21" />
            </svg>
          </div>
        </div>

        <!-- Shutter Button -->
        <button
          class="group relative w-16 sm:w-18 h-16 sm:h-18 rounded-full border-4 border-white p-1 flex items-center justify-center cursor-pointer transition-transform active:scale-90 hover:scale-105 shadow-xl"
          :title="activeMode === 'video' ? (isRecording ? 'Stop Recording' : 'Start Recording') : 'Take Photo'"
          @click="triggerShutter"
        >
          <div
            class="w-full h-full transition-all duration-200 shadow-inner"
            :class="[
              activeMode === 'video'
                ? isRecording
                  ? 'bg-red-600 rounded-md scale-60'
                  : 'bg-red-600 rounded-full'
                : 'bg-white rounded-full group-active:scale-90',
            ]"
          ></div>
        </button>

        <!-- Flip Front / Back Camera -->
        <div class="w-12 h-12 flex items-center justify-center">
          <button
            class="w-11 h-11 rounded-full bg-white/15 hover:bg-white/25 border border-white/20 flex items-center justify-center text-white transition active:scale-90 cursor-pointer"
            title="Flip Camera (Front / Back)"
            @click="flipCamera"
          >
            <svg viewBox="0 0 24 24" class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M21.5 2v6h-6" />
              <path d="M2.5 22v-6h6" />
              <path d="M2 11.5a10 10 0 0 1 18.8-4.3L21.5 8" />
              <path d="M22 12.5a10 10 0 0 1-18.8 4.2L2.5 16" />
            </svg>
          </button>
        </div>
      </div>
    </div>

    <!-- ========================================================= -->
    <!-- 4. IPADOS PHOTO GALLERY / LIGHTBOX MODAL -->
    <!-- ========================================================= -->
    <div
      v-if="showGalleryModal && selectedPhoto"
      class="absolute inset-0 z-50 bg-black/95 backdrop-blur-2xl flex flex-col justify-between p-4"
    >
      <!-- Top Bar -->
      <div class="flex items-center justify-between text-xs border-b border-white/10 pb-3">
        <div class="flex items-center gap-2">
          <span class="font-bold text-white tracking-wide">Photo Inspector</span>
          <span class="text-[10px] font-mono text-slate-400">{{ selectedPhoto.timestamp }}</span>
          <span class="px-1.5 py-0.2 rounded bg-cyan-400/20 text-cyan-300 font-mono text-[9px]">
            {{ selectedPhoto.mode }}
          </span>
        </div>
        <div class="flex items-center gap-2">
          <button
            class="px-3 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs transition cursor-pointer flex items-center gap-1.5"
            @click="downloadPhoto(selectedPhoto)"
          >
            <svg viewBox="0 0 24 24" class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
            Save Photo
          </button>
          <button
            class="px-2.5 py-1 rounded-lg bg-red-500/20 text-red-300 hover:bg-red-500/30 transition text-xs cursor-pointer"
            @click="deleteSelectedPhoto"
          >
            Delete
          </button>
          <button
            class="w-7 h-7 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center font-bold text-xs transition cursor-pointer"
            @click="showGalleryModal = false"
          >
            ✕
          </button>
        </div>
      </div>

      <!-- Main Photo View -->
      <div class="flex-1 flex items-center justify-center p-2 overflow-hidden">
        <img
          :src="selectedPhoto.url"
          alt="Full photo"
          class="max-w-full max-h-full object-contain rounded-xl shadow-2xl border border-white/20"
        />
      </div>

      <!-- Thumbnail Selector Strip -->
      <div class="flex items-center gap-2 overflow-x-auto py-2 border-t border-white/10 no-scrollbar">
        <div
          v-for="p in capturedPhotos"
          :key="p.id"
          class="w-12 h-12 shrink-0 rounded-lg overflow-hidden border-2 transition cursor-pointer"
          :class="selectedPhoto.id === p.id ? 'border-cyan-400 scale-105' : 'border-white/30 opacity-60 hover:opacity-100'"
          @click="selectedPhoto = p"
        >
          <img :src="p.url" class="w-full h-full object-cover" />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.no-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
.no-scrollbar::-webkit-scrollbar {
  display: none;
}
</style>
