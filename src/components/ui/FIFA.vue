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
    class="card relative w-full h-full rounded-[18px] bg-[#1a4f8b] hover:bg-[#123c6b] duration-300 overflow-hidden select-none font-black shadow-[0_12px_28px_rgba(0,0,0,0.4)]"
  >
    <!-- Top-Right FIFA Trophy/Logo -->
    <div class="absolute top-4 right-5.5 flex flex-col items-center z-30">
      <img
        src="https://png.pngtree.com/png-vector/20221115/ourmid/pngtree-football-world-cup-golden-trophy-png-image_6448593.png"
        alt="FIFA Trophy"
        class="w-20 h-20 object-contain"
      />
      <span class="text-white text-[11px] tracking-widest mt-0.5">FIFA</span>
    </div>

    <!-- Stylized Background Year '26' -->
    <div
      class="absolute top-3.75 left-2.5 flex text-[350px] leading-[0.8] font-black z-10"
    >
      <span class="text-[#0b2e59] giant-number duration-300">9</span>
      <span class="text-[#d6182a] giant-number -ml-5 duration-300">5</span>
    </div>

    <!-- Cutout Player Image -->
    <img
      src="/me.png"
      :alt="name"
      class="profile-card absolute bottom-13 left-1/2 scale-250 -translate-x-1/2 translate-y-20 h-95 object-contain z-20 pointer-events-none"
    />

    <!-- Vertical Nation Strip (CAM) -->
    <div
      class="absolute right-4.5 bottom-12 w-11 h-41.25 rounded-full flex flex-col items-center py-1.5 z-30"
    >
      <div
        class="w-8.5 h-8.5 rounded-tl-2xl hover:rounded-tl-none hover:rounded-br-none duration-300 hover:scale-125 rounded-br-2xl border-2 border-white overflow-hidden flex items-center justify-center bg-white shrink-0"
      >
        <img
          :src="flagImage"
          alt="Cambodia Flag"
          class="w-full h-full object-cover"
        />
      </div>
      <span
        class="[writing-mode:vertical-rl] [text-orientation:upright] text-white text-[30px] tracking-widest mt-2 font-black"
      >
        {{ countryCode }}
      </span>
    </div>

    <!-- Bottom Player Info Overlay -->
    <div class="absolute bottom-3 left-3 right-3 flex flex-col gap-1.5 z-40">
      <div class="bg-[#ce1126] rounded-xl px-3 py-1.5 w-55 shadow-md">
        <h2
          class="m-0 text-white text-[14.5px] tracking-wide text-center truncate uppercase"
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

      <div class="flex items-center justify-between">
        <div
          class="bg-[#0b2545] text-slate-200 text-[10.5px] py-1 px-3 rounded-md w-46.25 text-center truncate"
        >
          {{ club }}
        </div>
        <div
          class="bg-[#f7d117] rounded-full border border-black flex items-center px-1.5 py-0.5 gap-1 shrink-0"
        >
          <i class="fa-solid fa-shield-halved w-5 h-5 text-white"></i>
          <span
            class="text-[#d81e05] text-[10px] font-black tracking-wider leading-none"
            >{{ position }}</span
          >
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.card:hover .profile-card {
  transform: translateY(20px) scale(1.2);
  transition: transform 0.3s ease-in-out;
}

.card:hover .giant-number {
  transform: scale(1.05);
  color: #0e233e;
  transition: transform 0.3s ease-in-out;
}
</style>
