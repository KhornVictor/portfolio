<script setup lang="ts">
export interface PokemonCardProps {
  name?: string;
  stage?: string;
  hp?: number | string;
  energyType?: "lightning" | "fire" | "water" | "grass" | "psychic";
  species?: string;
  height?: string;
  weight?: string;
  image?: string;
  attack1Name?: string;
  attack1Cost?: string[];
  attack1Damage?: string | number;
  attack1Desc?: string;
  attack2Name?: string;
  attack2Cost?: string[];
  attack2Damage?: string | number;
  attack2Desc?: string;
  weakness?: string;
  resistance?: string;
  retreatCost?: number;
  flavorText?: string;
  cardNumber?: string;
  illustrator?: string;
}

withDefaults(defineProps<PokemonCardProps>(), {
  name: "VICTOR",
  stage: "BASIC",
  hp: 120,
  energyType: "lightning",
  species: "Full-Stack Pokémon",
  height: "1.79 m",
  weight: "75 kg",
  image: "/pokemon-victor-transparent.png",
  attack1Name: "Clean Architecture",
  attack1Cost: () => ["lightning"],
  attack1Damage: "40+",
  attack1Desc:
    "Flip a coin. If heads, this attack does 30 more damage and patches all system bugs.",
  attack2Name: "Thunder Deploy",
  attack2Cost: () => ["lightning", "lightning", "colorless"],
  attack2Damage: "110",
  attack2Desc:
    "Discards 1 Energy card in order to deploy instantly to production. The Defending Pokémon is now Paralyzed.",
  weakness: "fighting",
  resistance: "metal",
  retreatCost: 2,
  flavorText:
    "A gifted developer discovered in Phnom Penh. When charged with coffee, its compilation speed and problem-solving power increase exponentially.",
  cardNumber: "025/102 ★",
  illustrator: "Khorn Victor",
});
</script>

<template>
  <div
    class="pokemon-card group relative w-full h-full min-h-130 rounded-[18px] p-2.5 sm:p-3 overflow-hidden select-none flex flex-col justify-between shadow-[0_14px_30px_rgba(0,0,0,0.4)] border-2 border-[#caa432] bg-[#f8cf28] transition-all duration-300"
  >
    <!-- Prismatic Rainbow Holographic Foil Sheen Effect -->
    <div
      class="holo-sheen pointer-events-none absolute -inset-full top-0 block -skew-x-12 opacity-0 transition-all duration-1000 group-hover:translate-x-full group-hover:opacity-100 z-30"
    ></div>

    <!-- Inner Card Bezel / Container -->
    <div
      class="relative w-full h-full rounded-xl p-2 flex flex-col justify-between overflow-hidden bg-linear-to-b from-[#fce976] via-[#f9dc4d] to-[#eab725] border border-[#a47d1a]/50 shadow-inner"
    >
      <!-- Stylized Background Lightning Watermark Pattern -->
      <div class="absolute inset-0 pointer-events-none opacity-10 overflow-hidden">
        <svg class="w-full h-full text-yellow-900" viewBox="0 0 100 100" preserveAspectRatio="none">
          <path d="M0,20 L30,0 L20,40 L50,30 L10,100 L25,50 L5,60 Z" fill="currentColor" />
          <path d="M60,10 L90,0 L80,35 L100,25 L65,80 L75,45 L55,55 Z" fill="currentColor" />
        </svg>
      </div>

      <!-- Top Header Row: Stage, Name, HP, and Energy Type -->
      <div class="relative z-10 flex items-center justify-between px-1 pb-1">
        <!-- Stage & Name -->
        <div class="flex items-baseline gap-1.5">
          <span
            class="text-[9px] sm:text-[10px] font-black uppercase italic text-yellow-950 px-1 py-0.2 bg-yellow-300/80 rounded border border-yellow-700/40 tracking-wider shadow-2xs"
          >
            {{ stage }}
          </span>
          <h1
            class="m-0 text-slate-900 font-black text-[17px] sm:text-[20px] tracking-wide uppercase drop-shadow-2xs leading-none"
          >
            {{ name }}
          </h1>
        </div>

        <!-- HP and Energy Symbol -->
        <div class="flex items-center gap-1.5">
          <div class="flex items-baseline gap-0.5">
            <span class="text-[9px] font-black text-red-700 font-sans leading-none">HP</span>
            <span class="text-[17px] sm:text-[19px] font-black text-red-700 leading-none">
              {{ hp }}
            </span>
          </div>

          <!-- Electric Energy Badge -->
          <div
            class="w-6 h-6 sm:w-6.5 sm:h-6.5 rounded-full bg-linear-to-tr from-[#f39c12] to-[#f1c40f] p-0.5 border border-yellow-800/60 shadow-xs flex items-center justify-center shrink-0"
            title="Lightning Energy"
          >
            <!-- Lightning Bolt SVG -->
            <svg class="w-3.5 h-3.5 text-yellow-950 fill-current drop-shadow-2xs" viewBox="0 0 24 24">
              <path d="M13 2L3 14h7v8l11-13h-8z" />
            </svg>
          </div>
        </div>
      </div>

      <!-- Illustration Frame Window (Holographic Arena) -->
      <div class="relative z-10 my-0.5">
        <div
          class="relative w-full h-120 rounded-lg overflow-hidden border-[3px] border-[#9c7827] shadow-[inset_0_2px_6px_rgba(0,0,0,0.4),0_2px_4px_rgba(0,0,0,0.15)] bg-linear-to-b from-[#1b3a6b] via-[#22579e] to-[#4084d6]"
        >
          <!-- Sunburst / Electric Radial Rays -->
          <div
            class="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,rgba(255,230,100,0.6)_0%,rgba(34,87,158,0)_70%)] pointer-events-none"
          ></div>

          <!-- Lightning Bolt Graphic Elements in Background -->
          <div class="absolute inset-0 pointer-events-none opacity-40 mix-blend-screen">
            <svg class="w-full h-full text-yellow-200" viewBox="0 0 200 150">
              <path
                d="M20,10 L35,60 L25,65 L55,120 L35,80 L48,75 Z"
                fill="currentColor"
                class="animate-pulse"
              />
              <path
                d="M170,20 L150,70 L160,75 L135,130 L150,90 L140,85 Z"
                fill="currentColor"
                class="animate-pulse"
              />
            </svg>
          </div>

          <!-- Holo Foil Sparkles Overlay inside Illustration -->
          <div
            class="absolute inset-0 pointer-events-none opacity-25 group-hover:opacity-45 transition-opacity duration-500 bg-[radial-gradient(#fff_1.5px,transparent_1.5px)] bg-size-[14px_14px]"
          ></div>

          <!-- Character Illustration: Victor Cutout -->
          <img
            :src="image"
            :alt="name"
            class="relative z-10 scale-150 w-full h-full object-contain object-bottom filter drop-shadow-[0_8px_12px_rgba(0,0,0,0.5)] transform transition-transform duration-500 group-hover:scale-140 group-hover:-translate-y-1"
          />

          <!-- Holo Glint Line on Card Window -->
          <div
            class="pointer-events-none absolute inset-0 bg-linear-to-tr from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"
          ></div>
        </div>

        <!-- Pokédex Sub-strip Bar -->
        <div
          class="w-[94%] mx-auto -mt-1.5 relative z-20 py-0.5 px-2 bg-linear-to-r from-[#d8ae35] via-[#f7e07a] to-[#d8ae35] rounded-full border border-[#8a681c] shadow-xs flex items-center justify-center text-center"
        >
          <span class="text-[8.5px] sm:text-[9px] font-bold italic text-yellow-950 font-serif leading-none tracking-tight">
            NO. 025 {{ species }} HT: {{ height }} WT: {{ weight }}
          </span>
        </div>
      </div>

      <!-- Attacks & Abilities Container -->
      <div class="relative z-10 flex-1 flex flex-col justify-center gap-1.5 my-1 px-1">
        <!-- Attack 1: Clean Architecture -->
        <div class="flex flex-col border-b border-yellow-700/25 pb-1">
          <div class="flex items-center justify-between">
            <!-- Energy Cost + Attack Name -->
            <div class="flex items-center gap-1.5">
              <div class="flex items-center gap-0.5">
                <span
                  v-for="(idx) in attack1Cost"
                  :key="idx"
                  class="w-4 h-4 rounded-full bg-linear-to-tr from-[#f39c12] to-[#f1c40f] border border-yellow-800/60 flex items-center justify-center shadow-2xs shrink-0"
                >
                  <svg class="w-2.5 h-2.5 text-yellow-950 fill-current" viewBox="0 0 24 24">
                    <path d="M13 2L3 14h7v8l11-13h-8z" />
                  </svg>
                </span>
              </div>
              <h2 class="m-0 text-slate-950 font-black text-xs sm:text-[13px] tracking-wide">
                {{ attack1Name }}
              </h2>
            </div>
            <!-- Damage -->
            <span class="text-slate-950 font-black text-sm sm:text-base leading-none">
              {{ attack1Damage }}
            </span>
          </div>
          <!-- Attack Description -->
          <p class="m-0 text-[9px] sm:text-[10px] text-yellow-950/90 leading-tight mt-0.5">
            {{ attack1Desc }}
          </p>
        </div>

        <!-- Attack 2: Thunder Deploy -->
        <div class="flex flex-col">
          <div class="flex items-center justify-between">
            <!-- Energy Cost + Attack Name -->
            <div class="flex items-center gap-1.5">
              <div class="flex items-center gap-0.5">
                <span
                  v-for="(cost, idx) in attack2Cost"
                  :key="idx"
                  class="w-4 h-4 rounded-full border flex items-center justify-center shadow-2xs shrink-0"
                  :class="
                    cost === 'lightning'
                      ? 'bg-linear-to-tr from-[#f39c12] to-[#f1c40f] border-yellow-800/60'
                      : 'bg-linear-to-tr from-slate-200 to-slate-100 border-slate-400'
                  "
                >
                  <svg
                    v-if="cost === 'lightning'"
                    class="w-2.5 h-2.5 text-yellow-950 fill-current"
                    viewBox="0 0 24 24"
                  >
                    <path d="M13 2L3 14h7v8l11-13h-8z" />
                  </svg>
                  <span v-else class="text-[7px] text-slate-700 font-black">⚪</span>
                </span>
              </div>
              <h2 class="m-0 text-slate-950 font-black text-xs sm:text-[13px] tracking-wide">
                {{ attack2Name }}
              </h2>
            </div>
            <!-- Damage -->
            <span class="text-slate-950 font-black text-sm sm:text-base leading-none">
              {{ attack2Damage }}
            </span>
          </div>
          <!-- Attack Description -->
          <p class="m-0 text-[9px] sm:text-[10px] text-yellow-950/90 leading-tight mt-0.5">
            {{ attack2Desc }}
          </p>
        </div>
      </div>

      <!-- Bottom Card Stats: Weakness, Resistance, Retreat Cost -->
      <div
        class="relative z-10 border-t border-b border-yellow-700/35 py-0.5 px-2 flex items-center justify-between text-[8px] sm:text-[9px] font-bold text-yellow-950"
      >
        <!-- Weakness -->
        <div class="flex items-center gap-1">
          <span>weakness</span>
          <span
            class="w-3.5 h-3.5 rounded-full bg-amber-700 text-white flex items-center justify-center text-[7px]"
            title="Fighting"
          >
            🥋
          </span>
          <span class="text-[7.5px] font-black">×2</span>
        </div>

        <!-- Resistance -->
        <div class="flex items-center gap-1">
          <span>resistance</span>
          <span
            class="w-3.5 h-3.5 rounded-full bg-slate-400 text-slate-900 flex items-center justify-center text-[7px]"
            title="Metal"
          >
            ⚙️
          </span>
          <span class="text-[7.5px] font-black">-20</span>
        </div>

        <!-- Retreat Cost -->
        <div class="flex items-center gap-1">
          <span>retreat cost</span>
          <div class="flex items-center gap-0.5">
            <span
              v-for="i in retreatCost"
              :key="i"
              class="w-3 h-3 rounded-full bg-slate-200 border border-slate-400 flex items-center justify-center text-[6px]"
            >
              ⚪
            </span>
          </div>
        </div>
      </div>

      <!-- Pokédex Lore Flavor Text Box -->
      <div
        class="relative z-10 my-1 px-2 py-1 bg-yellow-100/60 rounded border border-yellow-700/25"
      >
        <p class="m-0 text-[8px] sm:text-[8.5px] italic text-yellow-950 font-serif leading-tight">
          {{ flavorText }}
        </p>
      </div>

      <!-- Card Footer: Illustrator, Set ID, Copyright, and Holo Star Stamp -->
      <div
        class="relative z-10 flex items-center justify-between px-1 text-[7.5px] sm:text-[8px] font-semibold text-yellow-950/80"
      >
        <div class="flex items-center gap-1.5">
          <!-- 1st Edition Stamp -->
          <span
            class="font-black px-1 py-0.2 bg-amber-900 text-yellow-300 rounded text-[6.5px] tracking-wider uppercase border border-yellow-400"
          >
            1st Edition
          </span>
          <span>Illus. {{ illustrator }}</span>
        </div>

        <div class="flex items-center gap-1 font-mono">
          <span>{{ cardNumber }}</span>
          <!-- Holo Rare Star Icon -->
          <span class="text-amber-600 font-black text-[9px] drop-shadow-2xs">★</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.pokemon-card {
  box-shadow:
    0 14px 28px rgba(0, 0, 0, 0.35),
    0 0 16px rgba(243, 156, 18, 0.25);
}

.pokemon-card:hover {
  transform: translateY(-4px) scale(1.01);
  box-shadow:
    0 20px 40px rgba(0, 0, 0, 0.45),
    0 0 28px rgba(243, 156, 18, 0.55);
}

/* Prismatic Holo Foil Sheen */
.holo-sheen {
  background: linear-gradient(
    115deg,
    transparent 0%,
    rgba(255, 255, 255, 0.15) 20%,
    rgba(255, 0, 128, 0.3) 38%,
    rgba(0, 255, 255, 0.3) 50%,
    rgba(255, 230, 0, 0.3) 62%,
    rgba(255, 255, 255, 0.2) 75%,
    transparent 100%
  );
  filter: contrast(130%) brightness(110%);
}
</style>
