<script setup lang="ts">
export interface ITCCardProps {
  name?: string;
  khmerName?: string;
  studentId?: string;
  department?: string;
  institutionKh?: string;
  institutionEn?: string;
  photoUrl?: string;
  logoUrl?: string;
  campusBgUrl?: string;
  academicYear?: string;
  promotion?: string;
}

withDefaults(defineProps<ITCCardProps>(), {
  name: "KHORN VICTOR",
  khmerName: "ឃន វ៉ិចទ័រ",
  studentId: "e20230078",
  department: "ដឺប៉ាតឺម៉ង់ព័ត៌មានវិទ្យាសាស្ត្រ និងទំនាក់ទំនង",
  institutionKh: "វិទ្យាស្ថានបច្ចេកវិទ្យាកម្ពុជា",
  institutionEn: "Institut de Technologie du Cambodge",
  photoUrl: "/itc-student.png",
  logoUrl: "/itc-logo-hd.png",
  campusBgUrl: "/itc-campus-watermark-clean.png",
  academicYear: "2023 - 2028",
  promotion: "PROMOTION 43",
});
</script>

<template>
  <div
    class="itc-card group relative w-full h-full min-h-130 rounded-[18px] bg-white overflow-hidden select-none flex flex-col justify-between shadow-[0_12px_28px_rgba(0,0,0,0.35)] border border-slate-200/90 duration-300"
  >
    <div
      class="pointer-events-none absolute -inset-full top-0 block -skew-x-12 bg-linear-to-r from-transparent via-white/35 to-transparent opacity-0 transition-all duration-1000 group-hover:translate-x-full group-hover:opacity-100 z-30"
    ></div>
    <div class="absolute inset-0 z-0 overflow-hidden pointer-events-none">
      <img
        :src="campusBgUrl"
        alt="ITC Campus"
        class="absolute inset-x-0 bottom-0 w-full h-[76%] object-cover object-bottom opacity-25 filter contrast-125 saturate-75 mix-blend-multiply transition-transform duration-700 group-hover:scale-105"
      />
      <div
        class="absolute inset-0 bg-linear-to-b from-white via-white/60 to-blue-50/40"
      ></div>
    </div>

    <div class="pt-2 flex justify-center items-center relative z-10">
      <div
        class="w-12 h-1.5 rounded-full bg-slate-200/80 border border-slate-300/60 shadow-inner"
      ></div>
    </div>
    <div class="px-4 py-2 flex items-center gap-3 relative z-10">
      <div class="relative shrink-0">
        <img
          :src="logoUrl"
          alt="ITC Logo"
          class="w-14 h-14 sm:w-16 sm:h-16 object-contain filter drop-shadow-[0_2px_4px_rgba(0,78,146,0.2)] transition-transform duration-300 group-hover:rotate-6"
        />
      </div>
      <div class="flex flex-col justify-center min-w-0">
        <h1
          class="khmer-moul text-[#004e92] text-[13px] sm:text-[15.5px] leading-tight tracking-wide drop-shadow-2xs"
        >
          {{ institutionKh }}
        </h1>
        <p
          class="text-[#004e92] font-sans font-semibold text-[10px] sm:text-[11.5px] leading-tight tracking-tight mt-0.5"
        >
          {{ institutionEn }}
        </p>
      </div>
    </div>
    <div
      class="w-full bg-linear-to-r from-[#003e7a] via-[#004e92] to-[#003e7a] py-1.5 px-4 shadow-sm relative z-10 flex items-center justify-center border-y border-[#00386e]"
    >
      <span
        class="khmer-text text-white font-bold text-xs sm:text-[13.5px] tracking-wider text-center drop-shadow-xs"
      >
        {{ department }}
      </span>
    </div>
    <div
      class="py-1.5 px-4 text-center relative z-10 bg-white/70 backdrop-blur-[1px]"
    >
      <span class="khmer-text text-slate-600 text-xs sm:text-[13px] font-medium">
        អត្តលេខនិស្សិត/ID :
      </span>
      <span
        class="text-slate-900 text-xs sm:text-[13px] font-bold tracking-wider font-mono ml-1"
      >
        {{ studentId }}
      </span>
    </div>
    <div
      class="flex-1 flex flex-col items-center justify-center relative z-10 py-2 px-4"
    >
      <div
        class="relative p-1 bg-white rounded-md shadow-[0_8px_22px_rgba(0,0,0,0.18)] border border-slate-200/80 transition-all duration-300 group-hover:scale-105 group-hover:shadow-[0_12px_28px_rgba(0,78,146,0.3)]"
      >
        <div
          class="w-48 h-60 rounded overflow-hidden bg-sky-500 relative"
        >
          <img
            :src="photoUrl"
            :alt="name"
            class="w-full h-full object-cover object-top block"
          />
         
        </div>
      </div>

      <!-- Student Name Section -->
      <div class="mt-3 flex flex-col items-center text-center">
        <!-- Khmer Name -->
        <h2
          class="khmer-moul m-0 text-slate-900 text-lg sm:text-[22px] leading-tight tracking-wide drop-shadow-2xs"
        >
          {{ khmerName }}
        </h2>
        <!-- English Name -->
        <h3
          class="m-0 mt-0.5 text-slate-800 font-sans font-black text-sm sm:text-base tracking-[2px] uppercase"
        >
          {{ name }}
        </h3>
      </div>
    </div>

    <!-- Card Footer: Metadata, RFID icon, and Official Barcode -->
    <div
      class="relative z-10 px-4 pb-3 pt-1 flex flex-col gap-1.5 bg-white/85 backdrop-blur-xs"
    >
      <!-- Realistic ID Card Barcode Strip -->
      <div
        class="w-full flex flex-col items-center justify-center bg-white py-1 px-3 rounded shadow-2xs"
      >
        <!-- Barcode Pattern Lines -->
        <div class="flex items-center justify-center gap-0.5 w-full h-5 overflow-hidden">
          <span class="w-0.5 h-full bg-slate-800"></span>
          <span class="w-px h-full bg-slate-800"></span>
          <span class="w-0.75 h-full bg-slate-800"></span>
          <span class="w-px h-full bg-slate-800"></span>
          <span class="w-0.5 h-full bg-slate-800"></span>
          <span class="w-1 h-full bg-slate-800"></span>
          <span class="w-px h-full bg-slate-800"></span>
          <span class="w-0.5 h-full bg-slate-800"></span>
          <span class="w-0.75 h-full bg-slate-800"></span>
          <span class="w-px h-full bg-slate-800"></span>
          <span class="w-0.5 h-full bg-slate-800"></span>
          <span class="w-px h-full bg-slate-800"></span>
          <span class="w-0.75 h-full bg-slate-800"></span>
          <span class="w-0.5 h-full bg-slate-800"></span>
          <span class="w-px h-full bg-slate-800"></span>
          <span class="w-0.75 h-full bg-slate-800"></span>
          <span class="w-px h-full bg-slate-800"></span>
          <span class="w-0.5 h-full bg-slate-800"></span>
          <span class="w-1 h-full bg-slate-800"></span>
          <span class="w-px h-full bg-slate-800"></span>
          <span class="w-0.5 h-full bg-slate-800"></span>
          <span class="w-0.75 h-full bg-slate-800"></span>
          <span class="w-px h-full bg-slate-800"></span>
          <span class="w-0.5 h-full bg-slate-800"></span>
          <span class="w-px h-full bg-slate-800"></span>
          <span class="w-0.75 h-full bg-slate-800"></span>
          <span class="w-0.5 h-full bg-slate-800"></span>
          <span class="w-px h-full bg-slate-800"></span>
          <span class="w-0.75 h-full bg-slate-800"></span>
          <span class="w-px h-full bg-slate-800"></span>
          <span class="w-0.5 h-full bg-slate-800"></span>
          <span class="w-1 h-full bg-slate-800"></span>
          <span class="w-px h-full bg-slate-800"></span>
          <span class="w-0.5 h-full bg-slate-800"></span>
          <span class="w-0.75 h-full bg-slate-800"></span>
          <span class="w-px h-full bg-slate-800"></span>
          <span class="w-0.5 h-full bg-slate-800"></span>
        </div>
        <span
          class="text-[16px] font-mono tracking-[3px] text-slate-600 mt-0.5 leading-none"
        >
          {{ studentId }}
        </span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.khmer-moul {
  font-family: "Moul", "Khmer OS Muol", "Khmer OS Muol Light", serif;
  font-weight: 700;
}

.khmer-text {
  font-family: "Kantumruy Pro", "Battambang", "Khmer OS Battambang", "Khmer OS",
    sans-serif;
}

.itc-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 16px 36px rgba(0, 78, 146, 0.25);
}
</style>
