<script setup lang="ts">
import { computed } from "vue";

const props = withDefaults(
  defineProps<{
    name: string;
    icon?: string;
    size?: number;
    showBadge?: boolean;
    badgeText?: string;
  }>(),
  {
    size: 48,
    showBadge: false,
    badgeText: "",
  }
);

const normalized = computed(() =>
  (props.icon || props.name || "").toLowerCase().replace(/[\s._-]/g, "")
);
</script>

<template>
  <div
    class="relative flex items-center justify-center select-none"
    :style="{ width: `${size}px`, height: `${size}px` }"
  >
    <!-- Custom URL icon if valid image URL -->
    <img
      v-if="icon && (icon.startsWith('http') || icon.startsWith('data:') || icon.startsWith('/'))"
      :src="icon"
      :alt="name"
      class="w-full h-full object-contain rounded-[22%]"
      loading="lazy"
    />

    <!-- NestJS -->
    <div
      v-else-if="normalized.includes('nest')"
      class="w-full h-full rounded-[22%] flex items-center justify-center shadow-md overflow-hidden bg-linear-to-br from-[#e0234e] via-[#ea2859] to-[#800f28] p-[16%]"
    >
      <svg viewBox="0 0 256 256" class="w-full h-full drop-shadow-sm" fill="none">
        <path
          d="M172.9 83.2c-5.8-12-16.7-20.9-30-24.7-6.2-1.8-12.7-2.3-19.1-1.4 7.6 5.8 13.5 13.6 16.9 22.7 6.4 17.3 3.6 36.8-7.3 51.6-13.8 18.7-36.2 28.5-59.2 26 12 10.9 28.1 16.7 44.4 15.9 19.3-1 37-10.8 47.9-26.7 13.9-20.3 15-46.7 6.4-63.4z"
          fill="#fff"
        />
        <path
          d="M109.8 45.4c-18.4 2.8-34.9 13.5-44.5 29.3-11.7 19.4-12.9 44-3.1 64.6 7.6 16 21.4 28 38.2 33.3-6.9-7.8-11.2-17.7-12.3-28.1-1.8-17.4 5.3-34.7 18.7-46.1 17-14.5 40.5-18.9 61.4-11.5-12.8-19.2-34.4-32-58.4-41.5z"
          fill="#fff"
          opacity="0.95"
        />
        <path
          d="M192.4 133.2c-2.3-8.8-7.4-16.6-14.5-22.3 2.8 8.1 3 17 0.6 25.3-4.5 15.4-16.5 27.2-31.8 31.4 14.8 1.9 29.7-3.2 40.2-13.8 4.2-4.3 7.3-9.5 8.9-15.1 1.4-5.1 1.5-10.5 0.6-15.5z"
          fill="#fff"
        />
      </svg>
    </div>

    <!-- NodeJS -->
    <div
      v-else-if="normalized.includes('node')"
      class="w-full h-full rounded-[22%] flex items-center justify-center shadow-md overflow-hidden bg-linear-to-br from-[#339933] via-[#2d832d] to-[#164b16] p-[16%]"
    >
      <svg viewBox="0 0 256 256" class="w-full h-full" fill="none">
        <path
          d="M128 24l95 55v110l-95 55-95-55V79l95-55z"
          stroke="#fff"
          stroke-width="14"
          stroke-linejoin="round"
        />
        <path
          d="M128 65l60 35v70l-60 35-60-35v-70l60-35z"
          fill="#fff"
        />
        <path
          d="M128 100l30 18v34l-30 18-30-18v-34l30-18z"
          fill="#339933"
        />
      </svg>
    </div>

    <!-- ExpressJS -->
    <div
      v-else-if="normalized.includes('express')"
      class="w-full h-full rounded-[22%] flex items-center justify-center shadow-md overflow-hidden bg-linear-to-br from-[#27272a] via-[#18181b] to-[#09090b] border border-white/10 p-[16%]"
    >
      <div class="flex flex-col items-center justify-center">
        <span class="text-white font-extrabold text-lg sm:text-xl tracking-tighter italic font-mono">ex</span>
        <span class="text-[9px] uppercase tracking-widest text-zinc-400 font-bold -mt-1">press</span>
      </div>
    </div>

    <!-- MongoDB -->
    <div
      v-else-if="normalized.includes('mongo')"
      class="w-full h-full rounded-[22%] flex items-center justify-center shadow-md overflow-hidden bg-linear-to-br from-[#0c2e21] via-[#092218] to-[#04110c] border border-emerald-500/20 p-[16%]"
    >
      <svg viewBox="0 0 256 256" class="w-full h-full" fill="none">
        <path
          d="M130.5 16c-3.1 5.3-7.5 13.9-11.8 22.8-15.5 31.8-38.2 81.3-34.9 123.4 3.2 41.2 30.6 68.3 43.7 77.8 1.4-5.2 2.6-11.5 2.6-11.5s0.6-200.2 0.4-212.5z"
          fill="#13AA52"
        />
        <path
          d="M130.5 16c3.1 5.3 7.5 13.9 11.8 22.8 15.5 31.8 38.2 81.3 34.9 123.4-3.2 41.2-30.6 68.3-43.7 77.8-1.4-5.2-2.6-11.5-2.6-11.5s-0.6-200.2-0.4-212.5z"
          fill="#00ED64"
        />
        <path
          d="M130.5 228.5c-0.2 3.1-0.9 9.3-2.5 11.5-1.6-2.2-2.3-8.4-2.5-11.5l2.5-16.5 2.5 16.5z"
          fill="#FFEAA5"
        />
      </svg>
    </div>

    <!-- PostgreSQL -->
    <div
      v-else-if="normalized.includes('postgres') || normalized.includes('psql')"
      class="w-full h-full rounded-[22%] flex items-center justify-center shadow-md overflow-hidden bg-linear-to-br from-[#336791] via-[#275375] to-[#1a384f] p-[16%]"
    >
      <svg viewBox="0 0 256 256" class="w-full h-full" fill="none">
        <path
          d="M128 32c-53 0-96 43-96 96s43 96 96 96 96-43 96-96-43-96-96-96z"
          fill="#fff"
          opacity="0.15"
        />
        <path
          d="M128 62c-36.4 0-66 29.6-66 66 0 17.5 6.8 33.4 18 45.2l12-14.2c-7.5-8.2-12-19.1-12-31 0-26.5 21.5-48 48-48s48 21.5 48 48c0 11.9-4.5 22.8-12 31l12 14.2c11.2-11.8 18-27.7 18-45.2 0-36.4-29.6-66-66-66z"
          fill="#fff"
        />
        <circle cx="108" cy="112" r="8" fill="#fff" />
        <circle cx="148" cy="112" r="8" fill="#fff" />
        <path
          d="M128 132v38m-16-16l16 16 16-16"
          stroke="#fff"
          stroke-width="10"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </svg>
    </div>

    <!-- MySQL -->
    <div
      v-else-if="normalized.includes('mysql')"
      class="w-full h-full rounded-[22%] flex items-center justify-center shadow-md overflow-hidden bg-linear-to-br from-[#00758F] via-[#005a6e] to-[#003845] p-[16%]"
    >
      <svg viewBox="0 0 256 256" class="w-full h-full" fill="none">
        <path
          d="M208 140c-12-35-42-65-80-72-46-8-90 18-102 62-4 15-3 32 3 46 8-22 24-40 46-48 25-9 53-6 75 8 18 11 32 28 39 48 12-12 18-27 19-44z"
          fill="#F29111"
        />
        <path
          d="M124 100c-26 0-48 18-54 44 14-8 30-12 47-11 20 1 39 10 52 25 2-20-13-44-38-54-2-2-5-4-7-4z"
          fill="#fff"
        />
        <circle cx="92" cy="120" r="5" fill="#00758F" />
      </svg>
    </div>

    <!-- Redis -->
    <div
      v-else-if="normalized.includes('redis')"
      class="w-full h-full rounded-[22%] flex items-center justify-center shadow-md overflow-hidden bg-linear-to-br from-[#D82C20] via-[#c2241a] to-[#7f130c] p-[16%]"
    >
      <svg viewBox="0 0 256 256" class="w-full h-full" fill="none">
        <path
          d="M128 32l90 45-90 45-90-45 90-45z"
          fill="#fff"
        />
        <path
          d="M38 98l90 45v68l-90-45V98z"
          fill="#fff"
          opacity="0.8"
        />
        <path
          d="M218 98l-90 45v68l90-45V98z"
          fill="#fff"
          opacity="0.9"
        />
        <path
          d="M128 85l35-18-35-18-35 18 35 18z"
          fill="#D82C20"
        />
      </svg>
    </div>

    <!-- Docker -->
    <div
      v-else-if="normalized.includes('docker')"
      class="w-full h-full rounded-[22%] flex items-center justify-center shadow-md overflow-hidden bg-linear-to-br from-[#0db7ed] via-[#0288d1] to-[#01579b] p-[16%]"
    >
      <svg viewBox="0 0 256 256" class="w-full h-full" fill="none">
        <rect x="70" y="100" width="22" height="22" rx="3" fill="#fff" />
        <rect x="98" y="100" width="22" height="22" rx="3" fill="#fff" />
        <rect x="126" y="100" width="22" height="22" rx="3" fill="#fff" />
        <rect x="98" y="72" width="22" height="22" rx="3" fill="#fff" />
        <rect x="126" y="72" width="22" height="22" rx="3" fill="#fff" />
        <rect x="154" y="100" width="22" height="22" rx="3" fill="#fff" />
        <path
          d="M234 135c-4-2-12-3-18 0-4 2-8 7-10 11-14-9-32-11-48-9-5 1-10 3-14 5H40c-8 0-16 6-16 14 0 35 28 64 64 64h78c38 0 70-30 72-68 4-5 8-10 8-16-4 0-8-1-12-1z"
          fill="#fff"
        />
        <circle cx="70" cy="165" r="5" fill="#0288d1" />
      </svg>
    </div>

    <!-- Kubernetes -->
    <div
      v-else-if="normalized.includes('kube') || normalized.includes('k8s')"
      class="w-full h-full rounded-[22%] flex items-center justify-center shadow-md overflow-hidden bg-linear-to-br from-[#326CE5] via-[#2454b8] to-[#123175] p-[16%]"
    >
      <svg viewBox="0 0 256 256" class="w-full h-full" fill="none">
        <circle cx="128" cy="128" r="76" stroke="#fff" stroke-width="14" fill="none" />
        <circle cx="128" cy="128" r="24" fill="#fff" />
        <!-- 7 spokes -->
        <g stroke="#fff" stroke-width="12" stroke-linecap="round">
          <line x1="128" y1="128" x2="128" y2="40" />
          <line x1="128" y1="128" x2="206" y2="80" />
          <line x1="128" y1="128" x2="214" y2="168" />
          <line x1="128" y1="128" x2="164" y2="218" />
          <line x1="128" y1="128" x2="92" y2="218" />
          <line x1="128" y1="128" x2="42" y2="168" />
          <line x1="128" y1="128" x2="50" y2="80" />
        </g>
      </svg>
    </div>

    <!-- TypeScript / JavaScript -->
    <div
      v-else-if="normalized.includes('typescript') || normalized === 'ts'"
      class="w-full h-full rounded-[22%] flex items-center justify-center shadow-md overflow-hidden bg-linear-to-br from-[#3178c6] via-[#235a96] to-[#183c66] p-[16%]"
    >
      <span class="text-white font-extrabold text-2xl tracking-tight font-mono">TS</span>
    </div>

    <div
      v-else-if="normalized.includes('javascript') || normalized === 'js'"
      class="w-full h-full rounded-[22%] flex items-center justify-center shadow-md overflow-hidden bg-linear-to-br from-[#f7df1e] via-[#e5cf17] to-[#b3a10e] p-[16%]"
    >
      <span class="text-black font-extrabold text-2xl tracking-tight font-mono">JS</span>
    </div>

    <!-- Vue -->
    <div
      v-else-if="normalized.includes('vue')"
      class="w-full h-full rounded-[22%] flex items-center justify-center shadow-md overflow-hidden bg-linear-to-br from-[#42b883] via-[#35495e] to-[#202e3b] p-[16%]"
    >
      <svg viewBox="0 0 256 256" class="w-full h-full" fill="none">
        <polygon points="128,210 240,40 185,40 128,140 71,40 16,40" fill="#42b883" />
        <polygon points="128,210 185,40 148,40 128,105 108,40 71,40" fill="#35495e" />
      </svg>
    </div>

    <!-- React -->
    <div
      v-else-if="normalized.includes('react')"
      class="w-full h-full rounded-[22%] flex items-center justify-center shadow-md overflow-hidden bg-linear-to-br from-[#20232a] via-[#16181d] to-[#0e0f12] border border-cyan-500/30 p-[16%]"
    >
      <svg viewBox="0 0 256 256" class="w-full h-full">
        <circle cx="128" cy="128" r="22" fill="#61dafb" />
        <g stroke="#61dafb" stroke-width="12" fill="none">
          <ellipse cx="128" cy="128" rx="88" ry="34" />
          <ellipse cx="128" cy="128" rx="88" ry="34" transform="rotate(60 128 128)" />
          <ellipse cx="128" cy="128" rx="88" ry="34" transform="rotate(120 128 128)" />
        </g>
      </svg>
    </div>

    <!-- Safari / Web -->
    <div
      v-else-if="normalized.includes('safari')"
      class="w-full h-full rounded-[22%] flex items-center justify-center shadow-md overflow-hidden bg-linear-to-b from-white to-slate-200 p-[12%]"
    >
      <svg viewBox="0 0 64 64" class="w-full h-full">
        <circle cx="32" cy="32" r="24" fill="#007aff" />
        <circle cx="32" cy="32" r="22" fill="none" stroke="#fff" stroke-width="1" stroke-dasharray="1 3.5" />
        <polygon points="46,18 36,36 18,46 28,28" fill="#ffffff" />
        <polygon points="46,18 36,36 32,32" fill="#ff3b30" />
      </svg>
    </div>

    <!-- Terminal -->
    <div
      v-else-if="normalized.includes('terminal')"
      class="w-full h-full rounded-[22%] flex items-center justify-center shadow-md overflow-hidden bg-linear-to-br from-[#2a2d34] to-[#121316] border border-white/15 p-[18%]"
    >
      <svg viewBox="0 0 64 64" class="w-full h-full">
        <path d="M14 20l12 12-12 12" stroke="#4cd964" stroke-width="5" fill="none" stroke-linecap="round" stroke-linejoin="round" />
        <line x1="32" y1="44" x2="48" y2="44" stroke="#4cd964" stroke-width="5" stroke-linecap="round" />
      </svg>
    </div>

    <!-- Notes -->
    <div
      v-else-if="normalized.includes('note')"
      class="w-full h-full rounded-[22%] flex items-center justify-center shadow-md overflow-hidden bg-linear-to-b from-[#fff7d6] to-[#fef0b3] border border-amber-300/40 p-[16%]"
    >
      <svg viewBox="0 0 64 64" class="w-full h-full">
        <rect x="8" y="8" width="48" height="12" rx="4" fill="#f7c948" />
        <line x1="14" y1="28" x2="48" y2="28" stroke="#a0a5b0" stroke-width="3" stroke-linecap="round" />
        <line x1="14" y1="38" x2="48" y2="38" stroke="#a0a5b0" stroke-width="3" stroke-linecap="round" />
        <line x1="14" y1="48" x2="36" y2="48" stroke="#a0a5b0" stroke-width="3" stroke-linecap="round" />
      </svg>
    </div>

    <!-- Settings -->
    <div
      v-else-if="normalized.includes('setting')"
      class="w-full h-full rounded-[22%] flex items-center justify-center shadow-md overflow-hidden bg-linear-to-br from-[#8e959e] via-[#636871] to-[#454950] p-[16%]"
    >
      <svg viewBox="0 0 64 64" class="w-full h-full" fill="#f0f2f5">
        <circle cx="32" cy="32" r="9" fill="#454950" />
        <circle cx="32" cy="32" r="5" fill="#f0f2f5" />
        <path
          d="M32 10l3 4 5-1 1 5 5 1-1 5 4 3-3 4 2 5-5 2-1 5-5-2-4 3 1-5-5-1 1-5-4-3 3-4-2-5 5-2z"
          opacity="0.9"
        />
      </svg>
    </div>
    <!-- Camera -->
    <div
      v-else-if="normalized.includes('camera')"
      class="w-full h-full rounded-[22%] flex items-center justify-center shadow-md overflow-hidden bg-linear-to-b from-[#6b7280] via-[#374151] to-[#1f2937] p-[16%]"
    >
      <svg viewBox="0 0 64 64" class="w-full h-full">
        <path
          d="M12 22h8l3-5h18l3 5h8a6 6 0 0 1 6 6v22a6 6 0 0 1-6 6H12a6 6 0 0 1-6-6V28a6 6 0 0 1 6-6z"
          fill="#9ca3af"
        />
        <circle cx="32" cy="38" r="14" fill="#111827" stroke="#e5e7eb" stroke-width="2" />
        <circle cx="32" cy="38" r="10" fill="#1f2937" />
        <circle cx="32" cy="38" r="6" fill="#030712" />
        <circle cx="34" cy="36" r="2" fill="#60a5fa" opacity="0.8" />
        <circle cx="48" cy="27" r="2.5" fill="#fbbf24" />
      </svg>
    </div>

    <!-- Arcade / Games -->
    <div
      v-else-if="normalized.includes('game') || normalized.includes('arcade') || normalized.includes('2048') || normalized.includes('snake')"
      class="w-full h-full rounded-[22%] flex items-center justify-center shadow-md overflow-hidden bg-linear-to-br from-[#ff2a5f] via-[#e60067] to-[#7928ca] p-[16%]"
    >
      <svg viewBox="0 0 64 64" class="w-full h-full drop-shadow-md">
        <!-- Gamepad Body -->
        <path
          d="M16 20h32c9 0 14 7 12 18-2 9-8 14-14 14-4 0-6-3-12-3s-8 3-12 3c-6 0-12-5-14-14-2-11 3-18 12-18z"
          fill="#ffffff"
        />
        <!-- D-Pad -->
        <rect x="19" y="30" width="4" height="12" rx="1.5" fill="#2d3748" />
        <rect x="15" y="34" width="12" height="4" rx="1.5" fill="#2d3748" />
        <circle cx="21" cy="36" r="1" fill="#4a5568" />
        <!-- Action Buttons (ABXY) -->
        <circle cx="45" cy="32" r="2.2" fill="#e53e3e" />
        <circle cx="41" cy="36" r="2.2" fill="#ecc94b" />
        <circle cx="49" cy="36" r="2.2" fill="#3182ce" />
        <circle cx="45" cy="40" r="2.2" fill="#38a169" />
        <!-- Middle Buttons -->
        <rect x="29" y="35" width="2.5" height="1.5" rx="0.7" fill="#a0aec0" />
        <rect x="32.5" y="35" width="2.5" height="1.5" rx="0.7" fill="#a0aec0" />
      </svg>
    </div>


    <!-- Victor Vision / ASCII Cam -->

    <!-- General / Dynamic Fallback -->
    <div
      v-else
      class="w-full h-full rounded-[22%] flex items-center justify-center shadow-md overflow-hidden bg-linear-to-br from-indigo-500 via-purple-600 to-pink-500 p-[14%]"
    >
      <span class="text-white font-extrabold text-base sm:text-lg tracking-wider font-mono drop-shadow">
        {{ name.slice(0, 2).toUpperCase() }}
      </span>
    </div>

    <!-- Glossy reflection overlay -->
    <div
      class="pointer-events-none absolute inset-0 rounded-[22%] bg-linear-to-b from-white/35 via-white/5 to-transparent"
    ></div>

    <!-- Notification badge -->
    <div
      v-if="showBadge || badgeText"
      class="absolute -top-1 -right-1 min-w-4 h-4 px-1 rounded-full bg-red-500 text-white text-[9px] font-bold flex items-center justify-center shadow-md border border-white/50"
    >
      {{ badgeText || '1' }}
    </div>
  </div>
</template>
