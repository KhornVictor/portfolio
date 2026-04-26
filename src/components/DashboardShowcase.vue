<script setup lang="ts">
const habits = [18, 42, 55, 78, 96];

const skills = [
  "Financial",
  "Learning",
  "Value Earning",
  "Video Editing",
  "Creativity",
];

const stats = [
  { value: "6", label: "Victories" },
  { value: "11", label: "Story Days" },
  { value: "18", label: "Boss Runs" },
  { value: "10", label: "Mastery" },
  { value: "20", label: "Discovery" },
];

const marketplace = [
  { name: "Core Energy", qty: 80, rank: "A" },
  { name: "Black Halo", qty: 36, rank: "B" },
  { name: "Pointive", qty: 56, rank: "S" },
  { name: "Oosi", qty: 65, rank: "A" },
];
</script>

<template>
  <article
    class="rounded-[30px] border border-[#cb82ff59] bg-[radial-gradient(circle_at_20%_0%,rgba(180,110,255,0.26),transparent_36%),radial-gradient(circle_at_86%_100%,rgba(145,94,255,0.24),transparent_32%),linear-gradient(180deg,#171027_0%,#100a1c_100%)] p-4.5 shadow-[0_32px_80px_rgba(31,10,57,0.68),inset_0_1px_0_rgba(255,255,255,0.14)]"
    aria-label="Purple dashboard template showcase"
  >
    <header
      class="flex flex-wrap items-center justify-between gap-2.5 rounded-[999px] border border-[#d8b2ff52] bg-[rgba(42,24,72,0.68)] p-3"
    >
      <p
        class="text-[0.94rem] font-bold uppercase tracking-[0.08em] text-[#f0dfff]"
      >
        Enhoas
      </p>
      <nav
        class="inline-flex items-center gap-4.5"
        aria-label="Dashboard sections"
      >
        <span class="text-[0.84rem] text-[#eed3ffcc]">Dashboard</span>
        <span class="text-[0.84rem] text-[#eed3ffcc]">Progress</span>
      </nav>
      <button
        type="button"
        class="min-h-8.5 rounded-[999px] border border-[#eed3ff66] bg-[#eed3ff24] px-3.5 text-[0.82rem] text-[#f9eeff]"
      >
        + Create
      </button>
    </header>

    <div
      class="mt-4 grid grid-cols-6 gap-3 max-[1080px]:grid-cols-2 max-[720px]:grid-cols-1"
    >
      <section
        class="col-span-3 rounded-[20px] border border-[#d5a4ff38] bg-[radial-gradient(circle_at_0%_0%,rgba(215,136,255,0.2),transparent_40%),linear-gradient(180deg,rgba(33,18,57,0.88),rgba(20,13,37,0.92))] p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.08),0_12px_30px_rgba(0,0,0,0.38)] max-[1080px]:col-span-1"
      >
        <h3 class="mb-3 text-[1.05rem] tracking-[-0.01em] text-[#f4e5ff]">
          Solo Leveling System
        </h3>
        <div
          class="grid grid-cols-[130px_1fr] items-center gap-4 max-[720px]:grid-cols-1"
        >
          <div
            class="grid aspect-square w-32.5 place-items-center rounded-full border border-[#e7bcff99] bg-[radial-gradient(circle_at_32%_25%,rgba(255,214,255,0.94),rgba(188,107,255,0.56)_40%,rgba(94,50,147,0.62)_72%),#22113e] text-[2rem] font-extrabold text-[#f8eeff] shadow-[0_0_30px_rgba(191,111,255,0.45),inset_0_0_22px_rgba(255,255,255,0.2)] max-[720px]:mx-auto"
          >
            VK
          </div>
          <ul>
            <li
              class="flex justify-between gap-3.5 border-b border-[#dcaeff1f] py-1.5 text-[#f2ddffdb]"
            >
              Aura
            </li>
            <li
              class="flex justify-between gap-3.5 border-b border-[#dcaeff1f] py-1.5 text-[#f2ddffdb]"
            >
              Prodigy
            </li>
            <li
              class="flex justify-between gap-3.5 border-b border-[#dcaeff1f] py-1.5 text-[#f2ddffdb]"
            >
              Portal
            </li>
            <li
              class="flex justify-between gap-3.5 border-b border-[#dcaeff1f] py-1.5 text-[#f2ddffdb]"
            >
              Pulse
            </li>
          </ul>
        </div>
        <div
          class="mt-3.5 grid gap-1.5"
          role="progressbar"
          aria-valuenow="72"
          aria-valuemin="0"
          aria-valuemax="100"
        >
          <span class="text-[0.82rem] text-[#f2dfff]">Mind Sync</span>
          <div
            class="h-2 w-full overflow-hidden rounded-[999px] bg-[#f5deff2e]"
          >
            <i
              class="block h-full w-[72%] bg-[linear-gradient(90deg,#d08cff,#f2b2ff)]"
            ></i>
          </div>
          <strong class="text-[0.82rem] text-[#f2dfff]">72%</strong>
        </div>
      </section>

      <section
        class="col-span-3 rounded-[20px] border border-[#d5a4ff38] bg-[radial-gradient(circle_at_0%_0%,rgba(215,136,255,0.2),transparent_40%),linear-gradient(180deg,rgba(33,18,57,0.88),rgba(20,13,37,0.92))] p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.08),0_12px_30px_rgba(0,0,0,0.38)] max-[1080px]:col-span-1"
      >
        <h3 class="mb-3 text-[1.05rem] tracking-[-0.01em] text-[#f4e5ff]">
          Habit Tracker
        </h3>
        <div
          class="grid h-32 grid-cols-5 items-end gap-2 pt-2.5"
          aria-hidden="true"
        >
          <span
            v-for="(value, index) in habits"
            :key="index"
            class="rounded-[8px_8px_4px_4px] bg-[linear-gradient(180deg,#ecacff,#9c55e5)] shadow-[0_0_18px_rgba(196,110,255,0.34)]"
            :style="{ height: `${value}%` }"
          ></span>
        </div>
        <div class="mt-2.5 flex justify-between">
          <p class="text-[0.82rem] text-[#f2dfff]">6.1% growth</p>
          <p class="text-[0.82rem] text-[#f2dfff]">0.31 avg score</p>
        </div>
      </section>

      <section
        class="col-span-2 rounded-[20px] border border-[#d5a4ff38] bg-[radial-gradient(circle_at_0%_0%,rgba(215,136,255,0.2),transparent_40%),linear-gradient(180deg,rgba(33,18,57,0.88),rgba(20,13,37,0.92))] p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.08),0_12px_30px_rgba(0,0,0,0.38)] max-[1080px]:col-span-1"
      >
        <h3 class="mb-3 text-[1.05rem] tracking-[-0.01em] text-[#f4e5ff]">
          Skill Tracker
        </h3>
        <ul>
          <li
            v-for="skill in skills"
            :key="skill"
            class="flex items-center justify-between gap-2.5 border-b border-[#deb1ff29] py-2"
          >
            <span class="text-[0.82rem] text-[#f2dfff]">{{ skill }}</span>
            <i
              class="inline-block h-1.25 w-[42%] rounded-[999px] bg-[linear-gradient(90deg,#c174ff,#f1b4ff)]"
            ></i>
          </li>
        </ul>
      </section>

      <section
        class="col-span-4 rounded-[20px] border border-[#d5a4ff38] bg-[radial-gradient(circle_at_0%_0%,rgba(215,136,255,0.2),transparent_40%),linear-gradient(180deg,rgba(33,18,57,0.88),rgba(20,13,37,0.92))] p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.08),0_12px_30px_rgba(0,0,0,0.38)] max-[1080px]:col-span-1"
      >
        <h3 class="mb-3 text-[1.05rem] tracking-[-0.01em] text-[#f4e5ff]">
          Progress Timeline
        </h3>
        <div
          class="grid grid-cols-5 gap-2.5 max-[1080px]:grid-cols-3 max-[720px]:grid-cols-1"
        >
          <article
            v-for="item in stats"
            :key="item.label"
            class="grid gap-1 rounded-[14px] border border-[#e5c1ff33] bg-[#42276770] p-2.5"
          >
            <strong class="text-base text-[#f9edff]">{{ item.value }}</strong>
            <span class="text-[0.72rem] text-[#f1deffbd]">{{
              item.label
            }}</span>
          </article>
        </div>
      </section>

      <section
        class="col-span-2 rounded-[20px] border border-[#d5a4ff38] bg-[radial-gradient(circle_at_0%_0%,rgba(215,136,255,0.2),transparent_40%),linear-gradient(180deg,rgba(33,18,57,0.88),rgba(20,13,37,0.92))] p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.08),0_12px_30px_rgba(0,0,0,0.38)] max-[1080px]:col-span-1"
      >
        <h3 class="mb-3 text-[1.05rem] tracking-[-0.01em] text-[#f4e5ff]">
          Goal Completion
        </h3>
        <div
          class="mx-auto grid aspect-square w-42.5 max-w-full place-items-center rounded-full border border-[#e8c0ff47] bg-[radial-gradient(closest-side,rgba(39,20,66,0.98)_70%,transparent_72%),conic-gradient(#e69fff_50%,rgba(255,255,255,0.16)_50%)] text-center shadow-[0_0_30px_rgba(193,105,255,0.28)]"
        >
          <strong class="text-base text-[#f8ecff]">XP 50%</strong>
          <span class="text-[0.74rem] text-[#f0dcffb3]">1224 / 2500</span>
        </div>
      </section>

      <section
        class="col-span-4 rounded-[20px] border border-[#d5a4ff38] bg-[radial-gradient(circle_at_0%_0%,rgba(215,136,255,0.2),transparent_40%),linear-gradient(180deg,rgba(33,18,57,0.88),rgba(20,13,37,0.92))] p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.08),0_12px_30px_rgba(0,0,0,0.38)] max-[1080px]:col-span-1"
      >
        <h3 class="mb-3 text-[1.05rem] tracking-[-0.01em] text-[#f4e5ff]">
          Mainquest Place
        </h3>
        <ul class="grid gap-2">
          <li
            v-for="item in marketplace"
            :key="item.name"
            class="grid grid-cols-[1fr_40px_30px] gap-2.5 rounded-xl border border-[#deb3ff33] bg-[#4d2e756b] px-3 py-2.5"
          >
            <span class="text-[0.82rem] text-[#f2dfff]">{{ item.name }}</span>
            <span class="text-[0.82rem] text-[#f2dfff]">{{ item.qty }}</span>
            <span class="text-[0.82rem] text-[#f2dfff]">{{ item.rank }}</span>
          </li>
        </ul>
      </section>
    </div>
  </article>
</template>
