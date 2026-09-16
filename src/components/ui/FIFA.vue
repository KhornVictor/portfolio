<!-- CambodiaFIFA.vue -->
<script setup lang="ts">
interface PlayerCardProps {
  name?: string;
  birthDate?: string;
  height?: string;
  weight?: string;
  club?: string;
  countryCode?: string;
  playerImage?: string;
  flagImage?: string;
  position?: string;
}

withDefaults(defineProps<PlayerCardProps>(), {
  name: "SIENG CHANTHHEA",
  birthDate: "9-9-2002",
  height: "1,72 m",
  weight: "68 kg",
  club: "BOEUNG KET FC (CAM)",
  countryCode: "CAM",
  playerImage: "/me.png",
  flagImage: "https://flagcdn.com/w160/kh.png",
  position: "Defender",
});
</script>

<template>
  <div
    class="fifa-card group relative w-full h-full rounded-[18px] bg-linear-to-b from-[#164377] via-[#1a4f8b] to-[#0f3460] overflow-hidden select-none font-black shadow-[0_12px_28px_rgba(0,0,0,0.4)] border border-blue-400/20 transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_22px_45px_rgba(0,0,0,0.6),0_0_35px_rgba(26,79,139,0.55),0_0_15px_rgba(214,24,42,0.35)] cursor-pointer"
  >
    <!-- Prismatic Metallic Foil Sheen Sweep on Hover -->
    <div
      class="foil-sheen pointer-events-none absolute -inset-full top-0 block -skew-x-12 opacity-0 transition-all duration-1000 group-hover:translate-x-full group-hover:opacity-100 z-50"
    ></div>

    <!-- Subtle Angled Geometric Facets (FUT Special Card Texture) -->
    <div class="absolute inset-0 pointer-events-none opacity-15 overflow-hidden">
      <svg class="w-full h-full text-white" viewBox="0 0 200 300" preserveAspectRatio="none">
        <polygon points="0,0 200,60 200,90 0,30" fill="currentColor" opacity="0.4" />
        <polygon points="0,120 200,180 200,210 0,150" fill="currentColor" opacity="0.3" />
        <polygon points="0,240 200,290 200,300 0,270" fill="currentColor" opacity="0.5" />
      </svg>
    </div>

    <!-- Top-Right FIFA Trophy/Logo with Golden Aura on Hover -->
    <div
      class="trophy-badge absolute top-4 right-5.5 flex flex-col items-center z-30 transition-all duration-300 group-hover:scale-110"
    >
      <img
        src="https://png.pngtree.com/png-vector/20221115/ourmid/pngtree-football-world-cup-golden-trophy-png-image_6448593.png"
        alt="FIFA Trophy"
        class="w-20 h-20 object-contain drop-shadow-[0_4px_8px_rgba(0,0,0,0.3)] transition-all duration-300 group-hover:drop-shadow-[0_0_16px_rgba(255,215,0,0.75)]"
      />
      <span
        class="text-white text-[11px] tracking-widest mt-0.5 font-sans font-black transition-all duration-300 group-hover:text-yellow-300 group-hover:tracking-[3px]"
      >
        FIFA
      </span>
    </div>

    <!-- Stylized Giant Background Year '95' -->
    <div
      class="absolute top-3.75 left-2.5 flex text-[350px] leading-[0.8] font-black z-10 pointer-events-none select-none"
    >
      <span class="giant-num-1 text-[#0b2e59] duration-500 transition-all">9</span>
      <span class="giant-num-2 text-[#d6182a] -ml-5 duration-500 transition-all">5</span>
    </div>

    <!-- Cutout Player Image with 3D Pop-out on Hover -->
    <img
      src="/me.png"
      :alt="name"
      class="player-cutout absolute bottom-13 left-1/2 h-95 object-contain z-20 pointer-events-none transition-all duration-500 ease-out"
    />

    <!-- Vertical Nation Strip (CAM) -->
    <div
      class="absolute right-4.5 bottom-12 w-11 h-41.25 rounded-full flex flex-col items-center py-1.5 z-30"
    >
      <div
        class="flag-badge w-8.5 h-8.5 rounded-tl-2xl rounded-br-2xl border-2 border-white overflow-hidden flex items-center justify-center bg-white shrink-0 shadow-md transition-all duration-300 group-hover:scale-120 group-hover:rounded-tl-none group-hover:rounded-br-none group-hover:shadow-[0_0_15px_rgba(255,255,255,0.7)]"
      >
        <img
          :src="flagImage"
          alt="Cambodia Flag"
          class="w-full h-full object-cover"
        />
      </div>
      <span
        class="country-code [writing-mode:vertical-rl] [text-orientation:upright] text-white text-[30px] tracking-widest mt-2 font-black transition-all duration-300 group-hover:text-yellow-200 group-hover:drop-shadow-[0_0_10px_rgba(255,255,255,0.6)]"
      >
        {{ countryCode }}
      </span>
    </div>

    <!-- Bottom Player Info Overlay with Card Elevation -->
    <div
      class="bottom-overlay absolute bottom-3 left-3 right-3 flex flex-col gap-1.5 z-40 transition-all duration-300 group-hover:-translate-y-0.5"
    >
      <!-- Red Player Name Badge -->
      <div
        class="name-badge bg-[#ce1126] rounded-xl px-3 py-1.5 w-55 shadow-md border border-red-400/30 transition-all duration-300 group-hover:shadow-[0_8px_20px_rgba(206,17,38,0.55)] group-hover:bg-[#df152b]"
      >
        <h2
          class="m-0 text-white text-[14.5px] tracking-wide text-center truncate uppercase transition-all duration-300 group-hover:tracking-[1.5px]"
        >
          {{ name }}
        </h2>
        <div
          class="flex justify-center items-center gap-1.5 text-[#f7e6e6] text-[10px] font-sans font-bold mt-0.5"
        >
          <span>{{ birthDate }}</span>
          <span class="opacity-60">|</span>
          <span>{{ height }}</span>
          <span class="opacity-60">|</span>
          <span>{{ weight }}</span>
        </div>
      </div>

      <!-- Club and Position Badges -->
      <div class="flex items-center justify-between">
        <div
          class="club-badge bg-[#0b2545] text-slate-200 text-[10.5px] py-1 px-3 rounded-md w-46.25 text-center truncate border border-blue-400/20 shadow-xs transition-all duration-300 group-hover:border-blue-300/50 group-hover:text-white"
        >
          {{ club }}
        </div>
        <div
          class="position-badge bg-[#f7d117] rounded-full border border-black flex items-center px-1.5 py-0.5 gap-1 shrink-0 shadow-xs transition-all duration-300 group-hover:scale-110 group-hover:shadow-[0_0_14px_rgba(247,209,23,0.85)]"
        >
          <i class="fa-solid fa-shield-halved w-5 h-5 text-white drop-shadow-2xs"></i>
          <span
            class="text-[#d81e05] text-[10px] font-black tracking-wider leading-none"
          >
            {{ position }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Initial resting player position */
.player-cutout {
  transform: translate(-50%, 80px) scale(2.5);
}

/* Hover pop-out effect preserving centered alignment */
.fifa-card:hover .player-cutout {
  transform: translate(-50%, 62px) scale(2.68);
  filter: drop-shadow(0 16px 24px rgba(0, 0, 0, 0.7));
}

/* Giant background numbers glow */
.fifa-card:hover .giant-num-1 {
  transform: scale(1.06) translateY(-4px);
  color: #061e3d;
  text-shadow: 0 0 25px rgba(11, 46, 89, 0.6);
}

.fifa-card:hover .giant-num-2 {
  transform: scale(1.06) translateY(-4px);
  color: #ba1222;
  text-shadow: 0 0 25px rgba(214, 24, 42, 0.6);
}

/* Prismatic Metallic Foil Sheen */
.foil-sheen {
  background: linear-gradient(
    115deg,
    transparent 0%,
    rgba(255, 255, 255, 0.08) 20%,
    rgba(255, 215, 0, 0.3) 38%,
    rgba(255, 255, 255, 0.38) 50%,
    rgba(0, 210, 255, 0.28) 62%,
    transparent 100%
  );
  filter: contrast(125%) brightness(115%);
}
</style>
