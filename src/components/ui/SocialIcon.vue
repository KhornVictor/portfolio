<script setup lang="ts">
// Font Awesome glyph for a social network, keyed by (case-insensitive) name.
// The kit is loaded in index.html; brand icons come from the `fa-brands` set.
import { computed } from "vue";

const props = withDefaults(defineProps<{ name: string; size?: number }>(), {
  size: 18,
});

const ICONS: [RegExp, string][] = [
  [/github/i, "fa-brands fa-github"],
  [/linkedin/i, "fa-brands fa-linkedin-in"],
  [/facebook/i, "fa-brands fa-facebook-f"],
  [/instagram/i, "fa-brands fa-instagram"],
  [/telegram/i, "fa-brands fa-telegram"],
  [/twitter/i, "fa-brands fa-twitter"],
  [/^x$/i, "fa-brands fa-x-twitter"],
  [/youtube/i, "fa-brands fa-youtube"],
  [/tiktok/i, "fa-brands fa-tiktok"],
  [/discord/i, "fa-brands fa-discord"],
  [/whatsapp/i, "fa-brands fa-whatsapp"],
  [/threads/i, "fa-brands fa-threads"],
  [/reddit/i, "fa-brands fa-reddit-alien"],
  [/medium/i, "fa-brands fa-medium"],
  [/dev\.to|devto/i, "fa-brands fa-dev"],
  [/stack ?overflow/i, "fa-brands fa-stack-overflow"],
  [/gitlab/i, "fa-brands fa-gitlab"],
  [/dribbble/i, "fa-brands fa-dribbble"],
  [/behance/i, "fa-brands fa-behance"],
  [/mail|email/i, "fa-solid fa-envelope"],
  [/mac|apple/i, "fa-brands fa-apple"],
  [/terminal|console/i, "fa-solid fa-terminal"],
];

const iconClass = computed(
  () =>
    ICONS.find(([re]) => re.test(props.name.trim()))?.[1] ??
    "fa-solid fa-globe", // fallback: website
);
</script>

<template>
  <i
    :class="iconClass"
    :style="{ fontSize: size + 'px', width: size + 'px', height: size + 'px' }"
    class="inline-flex items-center justify-center leading-none"
    aria-hidden="true"
  ></i>
</template>
