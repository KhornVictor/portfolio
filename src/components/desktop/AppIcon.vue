<script setup lang="ts">
// Original, simplified macOS-style app icons drawn as inline SVG.
// `name` accepts an AppId or one of: folder, file, pdf, hd.
import { computed } from "vue";

const props = withDefaults(defineProps<{ name: string; size?: number }>(), { size: 48 });

// Calendar shows today's date like the real app.
const today = new Date();
const dayNum = today.getDate();
const monthName = today.toLocaleString("en-US", { month: "short" }).toUpperCase();

const uid = computed(() => `ic-${props.name}`);
</script>

<template>
  <svg :width="size" :height="size" viewBox="0 0 64 64" aria-hidden="true" class="drop-shadow-[0_2px_4px_rgba(0,0,0,.35)]">
    <defs>
      <linearGradient :id="uid + '-blue'" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#5fb2ff" /><stop offset="1" stop-color="#1c6ff0" /></linearGradient>
      <linearGradient :id="uid + '-dark'" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#3a3d45" /><stop offset="1" stop-color="#141519" /></linearGradient>
      <linearGradient :id="uid + '-grey'" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#9ea3ad" /><stop offset="1" stop-color="#5d626c" /></linearGradient>
      <linearGradient :id="uid + '-yellow'" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffe484" /><stop offset="1" stop-color="#f7c948" /></linearGradient>
      <linearGradient :id="uid + '-white'" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffffff" /><stop offset="1" stop-color="#e6e8ec" /></linearGradient>
      <linearGradient :id="uid + '-folder'" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#7cc7ff" /><stop offset="1" stop-color="#3f9cf5" /></linearGradient>
    </defs>

    <!-- Finder -->
    <g v-if="name === 'finder'">
      <rect x="4" y="4" width="56" height="56" rx="14" :fill="`url(#${uid}-blue)`" />
      <path d="M32 4h28v56H32c-4-8-6-17-6-28s2-20 6-28z" fill="#ffffff" opacity=".92" />
      <path d="M32 4h28v56H32" fill="none" />
      <path d="M18 24v8M46 24v8" stroke="#1c3d7a" stroke-width="3" stroke-linecap="round" />
      <path d="M18 44c6 6 22 6 28 0" stroke="#1c3d7a" stroke-width="3" fill="none" stroke-linecap="round" />
    </g>

    <!-- Safari -->
    <g v-else-if="name === 'safari'">
      <rect x="4" y="4" width="56" height="56" rx="14" :fill="`url(#${uid}-white)`" />
      <circle cx="32" cy="32" r="22" fill="#1b8bf5" />
      <circle cx="32" cy="32" r="20" fill="none" stroke="#fff" stroke-width="1" stroke-dasharray="1 4.2" />
      <path d="M44 20 36 36l-16 8 8-16z" fill="#fff" />
      <path d="M44 20 36 36l-4-4z" fill="#ff3b30" />
    </g>

    <!-- Terminal -->
    <g v-else-if="name === 'terminal'">
      <rect x="4" y="4" width="56" height="56" rx="14" :fill="`url(#${uid}-dark)`" />
      <rect x="4.75" y="4.75" width="54.5" height="54.5" rx="13.5" fill="none" stroke="#fff" stroke-opacity=".15" stroke-width="1.5" />
      <path d="M16 20l10 10-10 10" stroke="#fff" stroke-width="4" fill="none" stroke-linecap="round" stroke-linejoin="round" />
      <path d="M30 42h16" stroke="#fff" stroke-width="4" stroke-linecap="round" />
    </g>

    <!-- Mail -->
    <g v-else-if="name === 'mail'">
      <rect x="4" y="4" width="56" height="56" rx="14" :fill="`url(#${uid}-blue)`" />
      <rect x="13" y="19" width="38" height="27" rx="4" fill="#fff" />
      <path d="M13 23l19 13 19-13" stroke="#1c6ff0" stroke-width="2.5" fill="none" />
    </g>

    <!-- Notes -->
    <g v-else-if="name === 'notes'">
      <rect x="4" y="4" width="56" height="56" rx="14" :fill="`url(#${uid}-white)`" />
      <rect x="4" y="4" width="56" height="18" rx="14" :fill="`url(#${uid}-yellow)`" />
      <rect x="4" y="14" width="56" height="8" :fill="`url(#${uid}-yellow)`" />
      <g stroke="#b7bcc6" stroke-width="2.5" stroke-linecap="round"><path d="M14 32h36M14 41h36M14 50h24" /></g>
      <g fill="#9aa0ab"><circle cx="18" cy="13" r="2" /><circle cx="26" cy="13" r="2" /><circle cx="34" cy="13" r="2" /><circle cx="42" cy="13" r="2" /></g>
    </g>

    <!-- Photos -->
    <g v-else-if="name === 'photos'">
      <rect x="4" y="4" width="56" height="56" rx="14" :fill="`url(#${uid}-white)`" />
      <g transform="translate(32 32)">
        <ellipse rx="7" ry="15" transform="rotate(0)" fill="#ff6b3d" opacity=".85" />
        <ellipse rx="7" ry="15" transform="rotate(45)" fill="#ffc531" opacity=".85" />
        <ellipse rx="7" ry="15" transform="rotate(90)" fill="#7ed957" opacity=".85" />
        <ellipse rx="7" ry="15" transform="rotate(135)" fill="#33c7ff" opacity=".85" />
        <ellipse rx="7" ry="15" transform="rotate(180)" fill="#5b7bff" opacity=".85" />
        <ellipse rx="7" ry="15" transform="rotate(225)" fill="#c15bff" opacity=".85" />
        <ellipse rx="7" ry="15" transform="rotate(270)" fill="#ff4f8b" opacity=".85" />
        <ellipse rx="7" ry="15" transform="rotate(315)" fill="#ff8c42" opacity=".85" />
      </g>
    </g>

    <!-- Calendar -->
    <g v-else-if="name === 'calendar'">
      <rect x="4" y="4" width="56" height="56" rx="14" :fill="`url(#${uid}-white)`" />
      <path d="M4 18V18C4 10.3 10.3 4 18 4h28c7.7 0 14 6.3 14 14v4H4z" fill="#ff3b30" />
      <text x="32" y="17" text-anchor="middle" font-size="9" font-weight="700" fill="#fff" font-family="Inter, system-ui, sans-serif">{{ monthName }}</text>
      <text x="32" y="50" text-anchor="middle" font-size="30" font-weight="500" fill="#1d1d1f" font-family="Inter, system-ui, sans-serif">{{ dayNum }}</text>
    </g>

    <!-- System Settings -->
    <g v-else-if="name === 'settings'">
      <rect x="4" y="4" width="56" height="56" rx="14" :fill="`url(#${uid}-grey)`" />
      <g transform="translate(32 32)" fill="#e9ebef">
        <path d="M-3-24h6l1 5 4 2 5-3 4 4-3 5 2 4 5 1v6l-5 1-2 4 3 5-4 4-5-3-4 2-1 5h-6l-1-5-4-2-5 3-4-4 3-5-2-4-5-1v-6l5-1 2-4-3-5 4-4 5 3 4-2z" />
        <circle r="8" fill="#5d626c" />
        <circle r="4.5" fill="#e9ebef" />
      </g>
    </g>

    <!-- Activity Monitor -->
    <g v-else-if="name === 'activity'">
      <rect x="4" y="4" width="56" height="56" rx="14" :fill="`url(#${uid}-dark)`" />
      <circle cx="32" cy="32" r="19" fill="none" stroke="#fff" stroke-opacity=".25" stroke-width="3" />
      <path d="M12 32h8l4-10 6 20 6-16 4 6h12" stroke="#34c759" stroke-width="3" fill="none" stroke-linecap="round" stroke-linejoin="round" />
    </g>

    <!-- Trash -->
    <g v-else-if="name === 'trash'">
      <path d="M18 20h28l-3 34c-.2 2-1.8 3-3.5 3h-15c-1.7 0-3.3-1-3.5-3z" :fill="`url(#${uid}-grey)`" />
      <rect x="14" y="14" width="36" height="6" rx="3" fill="#c9cdd6" />
      <rect x="26" y="9" width="12" height="5" rx="2" fill="#c9cdd6" />
      <g stroke="#3f434b" stroke-opacity=".5" stroke-width="2" stroke-linecap="round"><path d="M26 26v24M32 26v24M38 26v24" /></g>
    </g>

    <!-- TextEdit -->
    <g v-else-if="name === 'textedit'">
      <rect x="4" y="4" width="56" height="56" rx="14" :fill="`url(#${uid}-white)`" />
      <g stroke="#8b909a" stroke-width="2.5" stroke-linecap="round"><path d="M16 20h32M16 28h32M16 36h24M16 44h28" /></g>
      <path d="M40 44l10-10 4 4-10 10h-4z" fill="#ffb340" />
    </g>

    <!-- Folder -->
    <g v-else-if="name === 'folder'">
      <path d="M6 16c0-2.2 1.8-4 4-4h14l5 5h25c2.2 0 4 1.8 4 4v28c0 2.2-1.8 4-4 4H10c-2.2 0-4-1.8-4-4z" fill="#3b8fe8" />
      <path d="M6 24h52v25c0 2.2-1.8 4-4 4H10c-2.2 0-4-1.8-4-4z" :fill="`url(#${uid}-folder)`" />
    </g>

    <!-- Generic document -->
    <g v-else-if="name === 'file' || name === 'pdf'">
      <path d="M16 6h22l12 12v38c0 1.7-1.3 3-3 3H16c-1.7 0-3-1.3-3-3V9c0-1.7 1.3-3 3-3z" :fill="`url(#${uid}-white)`" stroke="#c4c8d0" />
      <path d="M38 6v12h12" fill="#d5d9e0" />
      <g v-if="name === 'pdf'"><rect x="19" y="36" width="26" height="14" rx="3" fill="#e5484d" /><text x="32" y="46.5" text-anchor="middle" font-size="9" font-weight="700" fill="#fff" font-family="Inter, system-ui, sans-serif">PDF</text></g>
      <g v-else stroke="#b7bcc6" stroke-width="2" stroke-linecap="round"><path d="M20 30h24M20 37h24M20 44h16" /></g>
    </g>

    <!-- Macintosh HD -->
    <g v-else-if="name === 'hd'">
      <rect x="6" y="20" width="52" height="26" rx="4" :fill="`url(#${uid}-grey)`" />
      <rect x="6" y="20" width="52" height="8" rx="4" fill="#fff" opacity=".2" />
      <circle cx="48" cy="38" r="2" fill="#34c759" />
    </g>

    <g v-else><rect x="4" y="4" width="56" height="56" rx="14" :fill="`url(#${uid}-grey)`" /></g>
  </svg>
</template>
