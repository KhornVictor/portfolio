export const owner = {
  name: "Khorn Victor",
  role: "Full-Stack Developer",
  tagline: "Building modern web apps, backend systems and developer tools.",
  location: "Phnom Penh, Cambodia",
  email: "victorkhornkh@gmail.com",
  website: "https://www.khornvictor.com",
  github: "https://github.com/KhornVictor",
  linkedin: "https://www.linkedin.com/in/khorn-victor-794a6635a",
  machine: "Khorn's MacBook Pro",
};

export const skills = [
  "TypeScript",
  "JavaScript",
  "React",
  "Vue",
  "Node.js",
  "NestJS",
  "Prisma",
  "PostgreSQL",
  "Redis",
  "Docker",
  "Git",
  "Linux",
];

export const interests = [
  "Backend architecture",
  "Scalable systems",
  "Developer tools",
  "UI/UX",
  "Performance optimization",
  "Automation",
];

export interface Note {
  id: string;
  title: string;
  date: string;
  body: string[]; // paragraphs; lines starting with "- " render as bullets
}

export const notes: Note[] = [
  {
    id: "welcome",
    title: "Welcome",
    date: "2026-09-12",
    body: [
      `Hi, I'm ${owner.name}.`,
      "I enjoy building:",
      "- Scalable backend systems",
      "- Modern frontend interfaces",
      "- Developer tools",
      "- Automation systems",
      "- High-performance applications",
      "Poke around the desktop — every app opens a different part of my work.",
    ],
  },
  {
    id: "about",
    title: "About Me",
    date: "2026-09-10",
    body: [
      `I'm a ${owner.role.toLowerCase()} based in ${owner.location}, with a strong emphasis on backend engineering, robust database design and clean architecture.`,
      "I like structuring scalable systems, normalising data properly and automating the boring parts of a workflow.",
      "Currently: NestJS + Prisma on the server, Vue/React on the client, and a growing love for well-designed developer experiences.",
    ],
  },
  {
    id: "philosophy",
    title: "My Philosophy",
    date: "2026-08-28",
    body: [
      "- Boring technology, exciting products.",
      "- Data models first — the UI follows.",
      "- Write it so the next person (usually me) can read it.",
      "- Automate anything you have to do twice.",
      "- Ship, measure, refine.",
    ],
  },
  {
    id: "current",
    title: "Current Projects",
    date: "2026-09-05",
    body: [
      "- This portfolio: a macOS-style desktop built with Vue 3, TypeScript and Tailwind.",
      "- GitHub → Telegram notification bot for CI/CD events.",
      "- Modular NestJS backend with Prisma + MySQL.",
      "- Relational schema design for e-commerce & library systems (3NF/BCNF).",
    ],
  },
  {
    id: "goals",
    title: "Goals",
    date: "2026-09-01",
    body: [
      "- Contribute to an open-source backend project.",
      "- Go deeper on PostgreSQL performance and Redis patterns.",
      "- Ship a production app with Docker-based deployments end to end.",
      "- Keep learning: system design, observability, and DX.",
    ],
  },
  {
    id: "contact",
    title: "Contact",
    date: "2026-09-12",
    body: [
      `Email: ${owner.email}`,
      `GitHub: ${owner.github}`,
      `LinkedIn: ${owner.linkedin}`,
      `Website: ${owner.website}`,
      "Always happy to talk about software, collaboration or a good idea.",
    ],
  },
];

export interface CalendarEvent {
  /** Day of the current month (1–31). */
  day: number;
  title: string;
  color: string;
}

export const calendarEvents: CalendarEvent[] = [
  { day: 2, title: "Backend architecture review", color: "#60a5fa" },
  { day: 6, title: "Open-source contribution", color: "#4ade80" },
  { day: 12, title: "Building portfolio", color: "#c084fc" },
  { day: 18, title: "Learning: PostgreSQL internals", color: "#fbbf24" },
  { day: 24, title: "Project launch: NestJS API", color: "#f87171" },
  { day: 28, title: "Learning new technology", color: "#22d3ee" },
];

export const mail = {
  from: owner.name,
  to: "you@example.com",
  subject: "Let's build something together",
  preview: "Interested in collaborating, discussing software, or building…",
  body: [
    "Hi there,",
    "Interested in collaborating, discussing software, or building something interesting?",
    "I'm a full-stack developer who leans backend: NestJS, Prisma, PostgreSQL/MySQL, and a healthy respect for clean data models. I also enjoy crafting front-ends that feel good to use — this desktop is one of them.",
    "Reply to this email or reach me through any of the links below.",
    `— ${owner.name}`,
  ],
};

export const aboutMac = {
  system: "macOS Portfolio Edition",
  version: "26.0 (Build 2026.09)",
  processor: "Full-Stack Engineering",
  memory: "Unlimited Creativity",
  storage: "Projects / Experience / Ideas",
  graphics: "Clean Architecture GPU",
  serial: "KV-DEV-0001",
};

export interface Process {
  name: string;
  cpu: number;
  memory: number; // MB
  energy: number;
  network: number; // KB/s
  user: string;
}

export const processes: Process[] = [
  { name: "portfolio-ui", cpu: 18.4, memory: 412, energy: 7.2, network: 128, user: "khorn" },
  { name: "terminal-shell", cpu: 4.1, memory: 96, energy: 1.1, network: 4, user: "khorn" },
  { name: "creative-engine", cpu: 32.7, memory: 1204, energy: 12.8, network: 0, user: "khorn" },
  { name: "project-manager", cpu: 9.9, memory: 356, energy: 3.4, network: 62, user: "khorn" },
  { name: "developer-mode", cpu: 12.2, memory: 528, energy: 4.9, network: 18, user: "khorn" },
  { name: "coffee-daemon", cpu: 0.8, memory: 24, energy: 0.3, network: 0, user: "root" },
  { name: "windowserver", cpu: 6.3, memory: 288, energy: 2.6, network: 0, user: "_windowserver" },
];

export const stats = [
  { label: "Projects completed", value: 3, max: 5, color: "#60a5fa" },
  { label: "Technologies learned", value: 16, max: 20, color: "#4ade80" },
  { label: "Current focus: Backend", value: 82, max: 100, color: "#c084fc" },
  { label: "System uptime", value: 99, max: 100, color: "#fbbf24" },
];
