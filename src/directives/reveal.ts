import type { Directive } from "vue";

/**
 * v-reveal — animates an element into view on scroll.
 *
 * Usage:
 *   <div v-reveal>            → default rise + fade
 *   <div v-reveal:panel>      → larger "stacked sheet" rise
 *   <div v-reveal="120">      → 120ms stagger delay
 *   <div v-reveal:panel="80"> → panel variant + delay
 */
export const vReveal: Directive<HTMLElement, number | undefined> = {
  mounted(el, binding) {
    const isPanel = binding.arg === "panel";
    el.classList.add(isPanel ? "reveal-panel" : "reveal");

    const delay = binding.value ?? 0;
    if (delay) el.style.transitionDelay = `${delay}ms`;

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            el.classList.add("reveal-in");
            io.unobserve(el);
          }
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -6% 0px" }
    );

    io.observe(el);
  },
};
