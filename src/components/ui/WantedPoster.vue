<template>
  <div 
    class="inline-block w-full h-full p-4 rounded bg-[#dfceb2] text-[#3b2c20] shadow-[0_10px_25px_rgba(0,0,0,0.4)] font-['Rye','Playfair_Display',serif] bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.25)_0%,rgba(139,115,85,0.35)_100%),radial-gradient(#bca586_1px,transparent_1px)] bg-size-[100%_100%,12px_12px]"
  >
    <div class="w-full rounded box-border flex flex-col items-center h-full p-4 px-5 border-[3px] border-[#3b2c20]">
      <!-- Title -->
      <h1 class="m-0 mb-2.5 text-[2.8rem] tracking-[4px] text-center leading-none font-black scale-y-115 transform">
        WANTED
      </h1>

      <!-- Image Frame -->
      <div class="box-border w-full h-full border-2 border-[#3b2c20] bg-[#f6efe2] overflow-hidden">
        <img 
          :src="imageUrl" 
          :alt="name" 
          class="block object-cover w-full h-full" 
        />
      </div>

      <!-- Status -->
      <p class="mt-3 mb-0.5 text-base tracking-[3px] font-bold text-center">
        DEAD OR ALIVE
      </p>

      <!-- Name -->
      <h2 class="m-0 text-[1.7rem] tracking-[2px] text-center whitespace-nowrap font-black scale-y-120 transform">
        {{ name }}
      </h2>

      <!-- Bottom / Bounty section -->
      <div class="w-full mt-2.5">
        <div class="flex items-baseline justify-center gap-1">
          <span class="text-[1.7rem] font-bold">$</span>
          <span class="text-[2rem] font-black tracking-[1px]">{{ formattedBounty }}</span>
        </div>

        <!-- Footer / Marine disclaimer -->
        <div class="flex items-end justify-between mt-2">
          <p class="m-0 max-w-[65%] font-sans text-[0.50rem] leading-[1.2] font-bold tracking-[0.3px]">
            KONO SAKUHIN WA FICTION DETHUNODE JITSUZAISURU JINBUTSU DANTAI<br />
            SONOTA NO SOSHIKI TO DOITSU NO MEISHOU GA GEKICHU NI TOUJOUSHITA<br />
            TOSHITEMO JITSUZAI NA MONOTOWA ISSAI KANKEI ARIMASEN.
          </p>
          <div class="text-[0.95rem] font-black tracking-[1px]">
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