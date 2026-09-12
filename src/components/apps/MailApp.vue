<script setup lang="ts">
import { ref } from "vue";
import { mail, owner } from "../../data/portfolio";
import type { WindowState } from "../../desktop/types";

defineProps<{ win: WindowState }>();
const showList = ref(true);
const initials = owner.name.split(" ").map((s) => s[0]).join("");
const today = new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
</script>

<template>
  <div class="flex h-full">
    <!-- Mailboxes -->
    <aside class="hidden w-40 shrink-0 border-r border-(--line) bg-(--sidebar-bg) p-3 text-[13px] md:block">
      <p class="mb-1 px-2 text-[11px] font-semibold text-(--muted)">Favorites</p>
      <div class="flex items-center justify-between rounded-md bg-(--hover) px-2 py-1"><span>📥 Inbox</span><span class="text-[11px] text-(--muted)">1</span></div>
      <div class="px-2 py-1 text-(--muted)">📤 Sent</div>
      <div class="px-2 py-1 text-(--muted)">📝 Drafts</div>
      <div class="px-2 py-1 text-(--muted)">🗑️ Trash</div>
    </aside>

    <!-- Message list -->
    <div class="w-full shrink-0 flex-col border-r border-(--line) sm:flex sm:w-64" :class="showList ? 'flex' : 'hidden'">
      <div class="border-b border-(--line) px-3 py-2 text-[13px] font-semibold">Inbox</div>
      <button class="m-1.5 rounded-lg bg-(--accent) px-3 py-2 text-left text-white" @click="showList = false">
        <div class="flex items-center justify-between text-[13px] font-semibold"><span>{{ mail.from }}</span><span class="text-[11px] font-normal opacity-80">Today</span></div>
        <p class="text-[12.5px]">{{ mail.subject }}</p>
        <p class="truncate text-[12px] opacity-80">{{ mail.preview }}</p>
      </button>
    </div>

    <!-- Message -->
    <div class="min-w-0 flex-1 flex-col sm:flex" :class="showList ? 'hidden' : 'flex'">
      <div class="flex items-center gap-3 border-b border-(--line) px-5 py-3">
        <button class="text-[13px] text-(--accent) sm:hidden" @click="showList = true">‹ Inbox</button>
        <span class="grid h-9 w-9 place-items-center rounded-full bg-linear-to-b from-blue-400 to-blue-600 text-[12px] font-bold text-white">{{ initials }}</span>
        <div class="min-w-0">
          <p class="truncate text-[13px] font-semibold">{{ mail.from }} <span class="font-normal text-(--muted)">&lt;{{ owner.email }}&gt;</span></p>
          <p class="truncate text-[12px] text-(--muted)">To: {{ mail.to }} · {{ today }}</p>
        </div>
      </div>
      <div class="min-h-0 flex-1 overflow-y-auto px-5 py-4 sm:px-8">
        <h1 class="text-[18px] font-semibold">{{ mail.subject }}</h1>
        <div class="mt-4 space-y-3 text-[14px] leading-relaxed">
          <p v-for="(p, i) in mail.body" :key="i">{{ p }}</p>
        </div>
        <div class="mt-6 flex flex-wrap gap-2">
          <a :href="`mailto:${owner.email}?subject=${encodeURIComponent('Hello from your macOS portfolio')}`" class="rounded-lg bg-(--accent) px-4 py-2 text-[13px] font-medium text-white hover:brightness-110">Send Email</a>
          <a :href="owner.github" target="_blank" rel="noreferrer" class="rounded-lg border border-(--line) bg-(--card-bg) px-4 py-2 text-[13px] font-medium hover:bg-(--hover)">GitHub</a>
          <a :href="owner.linkedin" target="_blank" rel="noreferrer" class="rounded-lg border border-(--line) bg-(--card-bg) px-4 py-2 text-[13px] font-medium hover:bg-(--hover)">LinkedIn</a>
        </div>
      </div>
    </div>
  </div>
</template>
