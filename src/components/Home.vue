<script setup lang="ts">
import SiteHeader from "./SiteHeader.vue";
import SectionHeading from "./SectionHeading.vue";
import ServiceCard from "./ServiceCard.vue";
import SkillGroup from "./SkillGroup.vue";
import StatCard from "./StatCard.vue";
import ProjectCard from "./ProjectCard.vue";
import DashboardShowcase from "./DashboardShowcase.vue";

const navigation = [
  { label: "Home", href: "#home" },
  { label: "Services", href: "#services" },
  { label: "About", href: "#about" },
  { label: "Skills", href: "#skills" },
  { label: "Projects", href: "#projects" },
];

const services = [
  {
    title: "UI/UX Website Design",
    description:
      "Intentional, conversion-focused layouts with a strong visual hierarchy and clear user journeys.",
    tags: ["Modern layouts", "Responsive design"],
  },
  {
    title: "Frontend Development",
    description:
      "Clean Vue components, responsive interactions, and maintainable code built for growth.",
    tags: ["Vue components", "Clean HTML/CSS"],
  },
  {
    title: "Performance & Polish",
    description:
      "Fast-loading interfaces, accessible patterns, and motion that supports the experience.",
    tags: ["Speed optimization", "Accessibility"],
  },
  {
    title: "WordPress Implementation",
    description:
      "Flexible site builds and custom sections for content-driven sites that still feel premium.",
    tags: ["Theme setup", "Easy management"],
  },
];

const approach = [
  "Understand users and define the page story before styling anything.",
  "Create clean sections that scale across desktop, tablet, and mobile.",
  "Refine spacing, contrast, and motion until the interface feels deliberate.",
];

const stats = [
  { value: "02+", label: "Years of experience" },
  { value: "15+", label: "Projects completed" },
  { value: "05+", label: "Clients served" },
];

const skillGroups = [
  {
    title: "Core Skills",
    items: [
      "UI/UX layout",
      "Frontend Dev",
      "Responsive Web Design",
      "Component-based Design",
    ],
  },
  {
    title: "Frontend Tech",
    items: ["HTML", "CSS", "JavaScript", "Vue", "TypeScript"],
  },
  {
    title: "Design Tools",
    items: ["Figma", "Photoshop", "Illustrator"],
  },
  {
    title: "Tools & Interaction",
    items: ["GitHub", "Netlify", "GSAP", "UI interactions"],
  },
];

const projects = [
  {
    name: "Astra Studio",
    type: "Brand + portfolio site",
    summary:
      "A cinematic single-page portfolio with bold typography and smooth reveal sections.",
  },
  {
    name: "Pulse Commerce",
    type: "Landing page system",
    summary:
      "A modular sales page built to support campaign launches and product storytelling.",
  },
  {
    name: "Northwind UI",
    type: "Dashboard concept",
    summary:
      "A clean analytics layout focused on clarity, density control, and readable hierarchy.",
  },
];
</script>

<template>
  <div
    class="min-h-screen bg-[radial-gradient(circle_at_20%_10%,rgba(255,255,255,0.08),transparent_28%),radial-gradient(circle_at_80%_20%,rgba(255,255,255,0.05),transparent_22%),linear-gradient(180deg,#090909_0%,#070707_100%)] text-white/95"
  >
    <div
      class="mx-auto w-[min(1180px,calc(100%-32px))] pb-14 pt-6 max-[720px]:w-[min(1180px,calc(100%-20px))] max-[720px]:pt-4"
    >
      <SiteHeader :navigation="navigation" />

      <main id="home" class="grid gap-8.5 pt-8.5">
        <section
          class="grid items-center gap-6 pt-9 max-[1080px]:pt-6 lg:grid-cols-[minmax(0,1.15fr)_minmax(300px,0.85fr)]"
        >
          <div class="grid max-w-160 gap-5">
            <p class="text-[0.92rem] uppercase tracking-[0.18em] text-white/55">
              I am Khorn Victor
            </p>
            <h1>
              <span
                class="block text-[clamp(3.2rem,9vw,6.8rem)] leading-[0.92] tracking-[-0.06em]"
                >Front-End</span
              >
              <span
                class="block text-[clamp(3.2rem,9vw,6.8rem)] leading-[0.92] tracking-[-0.06em] text-white/90"
                >Developer & Designer</span
              >
            </h1>
            <p class="max-w-140 text-[1.05rem] text-white/70">
              I build thoughtful, responsive interfaces with clean structure,
              strong spacing, and smooth interactions that feel premium on every
              screen.
            </p>

            <div class="mt-1.5 flex flex-wrap gap-3">
              <a
                class="inline-flex min-h-11.5 items-center justify-center rounded-[999px] border border-white/20 bg-white px-4.5 font-semibold text-[#050505] shadow-[0_12px_30px_rgba(255,255,255,0.08)] transition hover:-translate-y-px focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-white/85"
                href="#projects"
                >View Projects</a
              >
              <a
                class="inline-flex min-h-11.5 items-center justify-center rounded-[999px] border border-white/20 bg-white/10 px-4.5 font-semibold text-white transition hover:-translate-y-px focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-white/85"
                href="#contact"
                >Let&apos;s Talk</a
              >
            </div>

            <div class="flex items-center gap-3.5" aria-label="Social links">
              <a
                class="inline-flex h-9.5 w-9.5 items-center justify-center rounded-full border border-white/15 bg-white/3 text-[0.82rem] font-bold transition hover:-translate-y-px focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-white/85"
                href="https://www.linkedin.com"
                target="_blank"
                rel="noreferrer"
                >in</a
              >
              <a
                class="inline-flex h-9.5 w-9.5 items-center justify-center rounded-full border border-white/15 bg-white/3 text-[0.82rem] font-bold transition hover:-translate-y-px focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-white/85"
                href="https://github.com"
                target="_blank"
                rel="noreferrer"
                >GH</a
              >
              <a
                class="inline-flex h-9.5 w-9.5 items-center justify-center rounded-full border border-white/15 bg-white/3 text-[0.82rem] font-bold transition hover:-translate-y-px focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-white/85"
                href="mailto:hello@example.com"
                >@</a
              >
            </div>
          </div>

          <div
            class="relative grid min-h-130 place-items-center max-[1080px]:min-h-115 max-[720px]:min-h-90"
            aria-hidden="true"
          >
            <div
              class="relative aspect-[1/1.05] w-full max-w-115 overflow-hidden rounded-[36px] border border-white/15 bg-[radial-gradient(circle_at_50%_22%,rgba(255,255,255,0.14),transparent_35%),linear-gradient(180deg,rgba(255,255,255,0.06),rgba(255,255,255,0.02))] shadow-[0_24px_80px_rgba(0,0,0,0.55),inset_0_1px_0_rgba(255,255,255,0.04)]"
            >
              <div
                class="absolute inset-[14%_11%] rounded-full border border-white/10 animate-pulse"
              ></div>
              <div
                class="absolute inset-[22%_18%] rounded-full border border-white/10"
              ></div>
              <div
                class="absolute left-1/2 top-1/2 grid h-190 w-190 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border border-white/20 bg-[linear-gradient(180deg,rgba(255,255,255,0.17),rgba(255,255,255,0.06))] text-5xl font-extrabold tracking-[0.08em] text-white/95 shadow-[inset_0_1px_0_rgba(255,255,255,0.1)] max-[720px]:h-150 max-[720px]:w-150 max-[720px]:text-[2.4rem]"
              >
                VK
              </div>
              <div
                class="absolute left-1/2 top-5 -translate-x-1/2 rounded-[999px] border border-white/15 bg-black/60 px-3.5 py-2 text-[0.85rem] text-white/70 backdrop-blur-sm"
              >
                Creative UI
              </div>
              <div
                class="absolute bottom-27 left-4.5 rounded-[999px] border border-white/15 bg-black/60 px-3.5 py-2 text-[0.85rem] text-white/70 backdrop-blur-sm"
              >
                Responsive systems
              </div>
              <div
                class="absolute bottom-17.5 right-4.5 rounded-[999px] border border-white/15 bg-black/60 px-3.5 py-2 text-[0.85rem] text-white/70 backdrop-blur-sm"
              >
                Clean code
              </div>
            </div>
          </div>
        </section>

        <section id="services" class="grid gap-5.5 py-4.5">
          <SectionHeading
            eyebrow="Services"
            title="Designing clean, scalable, responsive websites"
            description="A modular portfolio should make each capability easy to scan, so the page reads like a strong pitch rather than a wall of text."
          />

          <div
            class="grid gap-4.5 grid-cols-4 max-[1080px]:grid-cols-2 max-[720px]:grid-cols-1"
          >
            <ServiceCard
              v-for="service in services"
              :key="service.title"
              :title="service.title"
              :description="service.description"
              :tags="service.tags"
            />
          </div>
        </section>

        <section id="about" class="grid gap-4.5 py-4.5">
          <SectionHeading
            eyebrow="About Me"
            title="I turn ideas into polished digital experiences"
            description="My approach is to keep the structure simple, the visuals intentional, and the interactions light enough to feel fast."
          />

          <div class="grid gap-5">
            <p class="mx-auto max-w-212.5 text-center text-white/70">
              I focus on front-end work that balances craft and usability. The
              goal is not just to make a page look good, but to make it easy to
              navigate, easy to trust, and easy to extend later.
            </p>

            <div
              class="grid gap-3.5 grid-cols-3 max-[1080px]:grid-cols-2 max-[720px]:grid-cols-1"
              aria-label="Approach"
            >
              <div
                v-for="(item, index) in approach"
                :key="item"
                class="flex items-center gap-3.5 rounded-[18px] border border-white/15 bg-white/5 px-4.5 py-4"
              >
                <span
                  class="inline-flex h-8 w-8 flex-none items-center justify-center rounded-[10px] border border-white/20 bg-white/10 text-[0.8rem] font-bold"
                  >{{ String(index + 1).padStart(2, "0") }}</span
                >
                <p class="text-white">{{ item }}</p>
              </div>
            </div>

            <div
              class="grid gap-3.5 grid-cols-3 max-[1080px]:grid-cols-2 max-[720px]:grid-cols-1"
            >
              <StatCard
                v-for="stat in stats"
                :key="stat.label"
                :value="stat.value"
                :label="stat.label"
              />
            </div>
          </div>
        </section>

        <section id="skills" class="grid gap-5.5 py-4.5">
          <SectionHeading
            eyebrow="Skills"
            title="Crafting seamless UI/UX and clean code"
            description="The skill blocks stay compact so the page feels designed, not crowded."
          />

          <div
            class="grid gap-4.5 grid-cols-4 max-[1080px]:grid-cols-2 max-[720px]:grid-cols-1"
          >
            <SkillGroup
              v-for="group in skillGroups"
              :key="group.title"
              :title="group.title"
              :items="group.items"
            />
          </div>
        </section>

        <section id="projects" class="grid gap-5.5 py-4.5">
          <SectionHeading
            eyebrow="Projects"
            title="Selected work built around clarity and atmosphere"
            description="Add your real projects here later, but keep the structure consistent so the portfolio grows without a redesign."
          />

          <DashboardShowcase />

          <div
            class="grid gap-4.5 grid-cols-3 max-[1080px]:grid-cols-2 max-[720px]:grid-cols-1"
          >
            <ProjectCard
              v-for="project in projects"
              :key="project.name"
              v-bind="project"
            />
          </div>
        </section>

        <section
          id="contact"
          class="flex items-center justify-between gap-6 rounded-[28px] border border-white/15 bg-white/5 p-7.5 shadow-[0_24px_80px_rgba(0,0,0,0.55),inset_0_1px_0_rgba(255,255,255,0.04)] backdrop-blur-[18px] max-[1080px]:grid max-[1080px]:grid-cols-1 max-[720px]:p-5"
        >
          <div>
            <p class="text-[0.92rem] uppercase tracking-[0.18em] text-white/55">
              Contact
            </p>
            <h2
              class="text-[clamp(1.9rem,4vw,3.25rem)] leading-[1.04] tracking-[-0.04em]"
            >
              Let&apos;s build something clean and memorable.
            </h2>
            <p class="mt-2.5 max-w-155 text-white/70">
              If you want, I can tailor this layout with your real name, links,
              projects, and a proper download button for your CV.
            </p>
          </div>

          <a
            class="inline-flex min-h-11.5 items-center justify-center rounded-[999px] border border-white/20 bg-white px-4.5 font-semibold text-[#050505] shadow-[0_12px_30px_rgba(255,255,255,0.08)] transition hover:-translate-y-px focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-white/85"
            href="mailto:hello@example.com"
            >Send Email</a
          >
        </section>
      </main>
    </div>
  </div>
</template>
