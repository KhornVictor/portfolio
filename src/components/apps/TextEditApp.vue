<script setup lang="ts">
import { computed } from "vue";
import { buildDocument } from "../../pages/desktop/documents";
import { usePortfolio } from "../../pages/desktop/usePortfolio";
import type { WindowState } from "../../pages/desktop/types";

const props = defineProps<{ win: WindowState }>();
const portfolio = usePortfolio();
const doc = computed(() => buildDocument(props.win.payload, portfolio.value));

const isUrl = (v: string) => /^https?:\/\//.test(v);
</script>

<template>
  <div class="flex h-full flex-col">
    <!-- ruler-ish toolbar -->
    <div class="flex h-9 shrink-0 items-center gap-2 border-b border-(--line) px-4 text-[12px] text-(--muted)">
      <span class="rounded bg-(--hover) px-2 py-0.5">Helvetica</span>
      <span class="rounded bg-(--hover) px-2 py-0.5">13</span>
      <span class="ml-auto">{{ doc.title }}</span>
    </div>

    <article class="prose-doc min-h-0 flex-1 overflow-y-auto px-8 py-6 sm:px-12">
      <template v-for="(b, i) in doc.blocks" :key="i">
        <h1 v-if="b.type === 'h1'" class="mb-3 text-[26px] leading-tight font-bold tracking-tight">{{ b.text }}</h1>
        <h2 v-else-if="b.type === 'h2'" class="mt-6 mb-2 text-[15px] font-semibold text-(--muted) uppercase tracking-wide">{{ b.text }}</h2>
        <p v-else-if="b.type === 'p'" class="my-2 text-[14px] leading-relaxed">{{ b.text }}</p>
        <ul v-else-if="b.type === 'ul'" class="my-2 list-disc space-y-1 pl-5 text-[14px] leading-relaxed">
          <li v-for="(it, j) in b.items" :key="j">{{ it }}</li>
        </ul>
        <dl v-else-if="b.type === 'kv'" class="my-3 grid grid-cols-[auto_1fr] gap-x-6 gap-y-1 text-[14px]">
          <template v-for="([k, v], j) in b.pairs" :key="j">
            <dt class="text-(--muted)">{{ k }}</dt>
            <dd>
              <a v-if="isUrl(v)" :href="v" target="_blank" rel="noreferrer" class="text-(--accent) hover:underline">{{ v }}</a>
              <template v-else>{{ v }}</template>
            </dd>
          </template>
        </dl>
      </template>
    </article>
  </div>
</template>
