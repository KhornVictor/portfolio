<template>
  <div 
    class="wanted-poster group relative inline-block w-full h-full p-4 rounded-[18px] bg-[#dfceb2] text-[#3b2c20] shadow-[0_10px_25px_rgba(0,0,0,0.4)] bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.25)_0%,rgba(139,115,85,0.35)_100%),radial-gradient(#bca586_1px,transparent_1px)] bg-size-[100%_100%,12px_12px] transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_22px_40px_rgba(0,0,0,0.55),0_0_20px_rgba(139,115,85,0.35)] overflow-hidden cursor-pointer select-none"
  >
    <!-- Parchment Sheen Sweep on Hover -->
    <div
      class="pointer-events-none absolute -inset-full top-0 block -skew-x-12 bg-linear-to-r from-transparent via-white/25 to-transparent opacity-0 transition-all duration-800 group-hover:translate-x-full group-hover:opacity-100 z-30"
    ></div>

    <div class="w-full rounded box-border flex flex-col items-center h-full p-4 px-5 border-[3px] border-[#3b2c20] transition-colors duration-300 group-hover:border-[#221810] relative z-10">
      <!-- Title -->
      <h1 class="m-0 mb-2.5 text-[2.8rem] tracking-[4px] text-center leading-none font-black scale-y-115 transform transition-all duration-300 group-hover:scale-y-125 group-hover:tracking-[6px] group-hover:text-[#20150d] drop-shadow-2xs">
        WANTED
      </h1>

      <!-- Image Frame -->
      <div class="box-border w-full h-full border-2 border-[#3b2c20] bg-[#f6efe2] overflow-hidden relative shadow-inner group-hover:border-[#221810] transition-colors duration-300">
        <img 
          :src="imageUrl" 
          :alt="name" 
          class="block object-cover w-full h-full transition-transform duration-500 ease-out group-hover:scale-108 group-hover:contrast-105" 
        />
        <!-- Subtle Vintage Dark Vignette on Photo Hover -->
        <div class="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_50%,rgba(40,25,15,0.3)_100%)] opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      </div>

      <!-- Status -->
      <p class="mt-3 mb-0.5 text-base tracking-[3px] font-bold text-center transition-all duration-300 group-hover:text-[#8f1d1d] group-hover:tracking-[4.5px]">
        DEAD OR ALIVE
      </p>

      <!-- Name -->
      <h2 class="m-0 text-[1.7rem] tracking-[2px] text-center whitespace-nowrap font-black scale-y-120 transform transition-transform duration-300 group-hover:scale-105">
        {{ name }}
      </h2>

      <!-- Bottom / Bounty section -->
      <div class="w-full mt-2.5">
        <div class="flex items-baseline justify-center gap-1 transition-transform duration-300 group-hover:scale-110">
          <span class="text-[1.7rem] font-bold transition-colors duration-300 text-[#3b2c20] group-hover:text-[#8f1d1d]">$</span>
          <span class="text-[2rem] font-black tracking-[1px] transition-colors duration-300 text-[#3b2c20] group-hover:text-[#8f1d1d] drop-shadow-2xs">{{ formattedBounty }}</span>
        </div>

        <!-- Footer / Marine disclaimer -->
        <div class="flex items-end justify-between mt-2">
          <p class="m-0 max-w-[65%] font-sans text-[0.50rem] leading-[1.2] font-bold tracking-[0.3px] opacity-85 group-hover:opacity-100 transition-opacity">
            KONO SAKUHIN WA FICTION DETHUNODE JITSUZAISURU JINBUTSU DANTAI<br />
            SONOTA NO SOSHIKI TO DOITSU NO MEISHOU GA GEKICHU NI TOUJOUSHITA<br />
            TOSHITEMO JITSUZAI NA MONOTOWA ISSAI KANKEI ARIMASEN.
          </p>
          <div class="text-[0.95rem] font-black tracking-[1px] transition-colors duration-300 group-hover:text-[#8f1d1d]">
            NITROGEN
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { formatBounty } from '../../types/poster';
import type { WantedPosterProps } from '../../types/poster';

const props = withDefaults(defineProps<WantedPosterProps>(), {
  imageUrl: 'https://placehold.co/400x300?text=Wanted+Photo',
  name: 'KHORN·VICTOR',
  bounty: 1,
});

const formattedBounty = computed(() => formatBounty(props.bounty));
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Rye&display=swap');

.wanted-poster {
  font-family: 'Rye', 'Playfair Display', serif;
  transform: translateZ(0);
}
</style>