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
import type { Skill } from "../service/portfolio.service";

export const defaultSkills: Skill[] = [
  {
    name: "NestJS",
    icon: "nest",
    tag: ["Backend", "TypeScript", "Architecture"],
    url: "https://nestjs.com",
    iframe: "https://nestjs.com/",
    description: "Progressive Node.js framework for building efficient, reliable, and scalable enterprise server-side applications using TypeScript.",
    skillLevel: 0.95,
  },
  {
    name: "NodeJS",
    icon: "nodejs",
    tag: ["Backend", "Runtime", "JavaScript"],
    url: "https://nodejs.org",
    iframe: "https://nodejs.org/",
    description: "Asynchronous event-driven JavaScript runtime built on Chrome's V8 engine for scalable network applications.",
    skillLevel: 0.92,
  },
  {
    name: "ExpressJS",
    icon: "express",
    tag: ["Backend", "Framework"],
    url: "https://expressjs.com",
    iframe: "https://expressjs.com/",
    description: "Fast, unopinionated, minimalist web framework for Node.js routing and middleware pipelines.",
    skillLevel: 0.9,
  },
  {
    name: "TypeScript",
    icon: "typescript",
    tag: ["Language", "Frontend", "Backend"],
    url: "https://www.typescriptlang.org",
    iframe: "https://www.typescriptlang.org/",
    description: "Strongly typed programming language that builds on JavaScript, giving you better tooling and compile-time error checking.",
    skillLevel: 0.92,
  },
  {
    name: "JavaScript",
    icon: "javascript",
    tag: ["Language", "Frontend", "Backend"],
    url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript",
    iframe: "https://developer.mozilla.org/en-US/docs/Web/JavaScript",
    description: "Core language of the web, powering modern asynchronous, dynamic, and full-stack software development.",
    skillLevel: 0.95,
  },
  {
    name: "Python",
    icon: "python",
    tag: ["Backend", "Language", "Automation"],
    url: "https://www.python.org",
    iframe: "https://www.python.org/",
    description: "High-level, versatile programming language used for backend microservices, automation scripts, and data processing.",
    skillLevel: 0.85,
  },
  {
    name: "Go",
    icon: "go",
    tag: ["Backend", "Language", "Systems"],
    url: "https://go.dev",
    iframe: "https://go.dev/",
    description: "Statically typed, compiled programming language designed by Google for building high-concurrency network services.",
    skillLevel: 0.82,
  },
  {
    name: "React",
    icon: "react",
    tag: ["Frontend", "UI", "Library"],
    url: "https://react.dev",
    iframe: "https://react.dev/",
    description: "Declarative component-based library for building interactive user interfaces with reusable state hooks.",
    skillLevel: 0.88,
  },
  {
    name: "Vue",
    icon: "vue",
    tag: ["Frontend", "Framework"],
    url: "https://vuejs.org",
    iframe: "https://vuejs.org/",
    description: "Progressive JavaScript framework featuring reactive data-binding, Composition API, and Single-File Components.",
    skillLevel: 0.92,
  },
  {
    name: "NextJS",
    icon: "nextjs",
    tag: ["Frontend", "Full-Stack", "SSR"],
    url: "https://nextjs.org",
    iframe: "https://nextjs.org/",
    description: "React framework for the Web, enabling server-side rendering (SSR), static site generation (SSG), and edge routing.",
    skillLevel: 0.86,
  },
  {
    name: "Tailwind",
    icon: "tailwind",
    tag: ["Frontend", "CSS", "Design"],
    url: "https://tailwindcss.com",
    iframe: "https://tailwindcss.com/",
    description: "Utility-first CSS framework for rapidly crafting modern, responsive, and adaptive user interfaces.",
    skillLevel: 0.95,
  },
  {
    name: "HTML5",
    icon: "html",
    tag: ["Frontend", "Markup"],
    url: "https://developer.mozilla.org/en-US/docs/Web/HTML",
    iframe: "https://developer.mozilla.org/en-US/docs/Web/HTML",
    description: "Standard semantic markup language for structuring documents, accessibility, and canvas elements on the Web.",
    skillLevel: 0.95,
  },
  {
    name: "CSS3",
    icon: "css",
    tag: ["Frontend", "Styling"],
    url: "https://developer.mozilla.org/en-US/docs/Web/CSS",
    iframe: "https://developer.mozilla.org/en-US/docs/Web/CSS",
    description: "Style sheet language used for presentation, fluid layout systems, keyframe animations, and responsive media queries.",
    skillLevel: 0.92,
  },
  {
    name: "SASS",
    icon: "sass",
    tag: ["Frontend", "Styling", "Preprocessor"],
    url: "https://sass-lang.com",
    iframe: "https://sass-lang.com/",
    description: "CSS preprocessor extension providing nested rules, mixins, variables, and modular stylesheet architectures.",
    skillLevel: 0.88,
  },
  {
    name: "Vite",
    icon: "vite",
    tag: ["Frontend", "Tooling", "Build"],
    url: "https://vite.dev",
    iframe: "https://vite.dev/",
    description: "Next-generation frontend tooling offering lightning-fast Hot Module Replacement (HMR) and optimized production builds.",
    skillLevel: 0.92,
  },
  {
    name: "GraphQL",
    icon: "graphql",
    tag: ["Backend", "API", "Query Language"],
    url: "https://graphql.org",
    iframe: "https://graphql.org/",
    description: "Query language and server-side runtime for APIs that lets clients request exactly the data they need and nothing more.",
    skillLevel: 0.85,
  },
  {
    name: "REST API",
    icon: "api",
    tag: ["Backend", "Architecture"],
    url: "https://restfulapi.net",
    iframe: "https://restfulapi.net/",
    description: "Stateless architectural style for designing networked web APIs with predictable HTTP verbs and resource URIs.",
    skillLevel: 0.95,
  },
  {
    name: "Prisma",
    icon: "prisma",
    tag: ["Database", "ORM", "Backend"],
    url: "https://www.prisma.io",
    iframe: "https://www.prisma.io/",
    description: "Next-generation TypeScript ORM providing type-safe database queries, automated migrations, and schema modeling.",
    skillLevel: 0.92,
  },
  {
    name: "PostgreSQL",
    icon: "postgresql",
    tag: ["Database", "SQL", "Relational"],
    url: "https://www.postgresql.org",
    iframe: "https://www.postgresql.org/",
    description: "Powerful, open-source object-relational database system with strong ACID compliance and advanced indexing.",
    skillLevel: 0.9,
  },
  {
    name: "MySQL",
    icon: "mysql",
    tag: ["Database", "SQL", "Relational"],
    url: "https://www.mysql.com",
    iframe: "https://www.mysql.com/",
    description: "Widely-used relational database management system optimized for high-read performance and transaction safety.",
    skillLevel: 0.88,
  },
  {
    name: "MongoDB",
    icon: "mongodb",
    tag: ["Database", "NoSQL", "Document"],
    url: "https://www.mongodb.com",
    iframe: "https://www.mongodb.com/",
    description: "Document-oriented NoSQL database providing flexible JSON-like BSON storage, sharding, and high availability.",
    skillLevel: 0.88,
  },
  {
    name: "Redis",
    icon: "redis",
    tag: ["Database", "In-Memory", "Cache"],
    url: "https://redis.io",
    iframe: "https://redis.io/",
    description: "In-memory data structure store used as a distributed cache, message broker (Pub/Sub), and fast session store.",
    skillLevel: 0.86,
  },
  {
    name: "SQLite",
    icon: "sqlite",
    tag: ["Database", "Embedded", "SQL"],
    url: "https://www.sqlite.org",
    iframe: "https://www.sqlite.org/",
    description: "Self-contained, serverless, zero-configuration embedded SQL database engine for local data persistence and testing.",
    skillLevel: 0.86,
  },
  {
    name: "Elasticsearch",
    icon: "elasticsearch",
    tag: ["Database", "Search", "Distributed"],
    url: "https://www.elastic.co",
    iframe: "https://www.elastic.co/",
    description: "Distributed, JSON-based search and analytics engine built on Apache Lucene for full-text search and log analytics.",
    skillLevel: 0.8,
  },
  {
    name: "Docker",
    icon: "docker",
    tag: ["DevOps", "Containers"],
    url: "https://www.docker.com",
    iframe: "https://www.docker.com/",
    description: "Platform for containerizing applications into standardized, lightweight, and portable runtime units.",
    skillLevel: 0.88,
  },
  {
    name: "Kubernetes",
    icon: "kubernetes",
    tag: ["DevOps", "Orchestration"],
    url: "https://kubernetes.io",
    iframe: "https://kubernetes.io/",
    description: "Automated container orchestration system for automating application deployment, scaling, and operational management.",
    skillLevel: 0.8,
  },
  {
    name: "Linux",
    icon: "linux",
    tag: ["DevOps", "OS", "System"],
    url: "https://www.kernel.org",
    iframe: "https://www.kernel.org/",
    description: "Unix-like open-source operating system kernel powering cloud production servers, containers, and CLI tools.",
    skillLevel: 0.88,
  },
  {
    name: "Nginx",
    icon: "nginx",
    tag: ["DevOps", "Networking", "Web Server"],
    url: "https://nginx.org",
    iframe: "https://nginx.org/",
    description: "High-performance HTTP server, reverse proxy, and load balancer designed for high-concurrency traffic routing.",
    skillLevel: 0.85,
  },
  {
    name: "Git",
    icon: "git",
    tag: ["DevOps", "Version Control"],
    url: "https://git-scm.com",
    iframe: "https://git-scm.com/",
    description: "Distributed version control system tracking source code history, branching, and team collaboration workflows.",
    skillLevel: 0.92,
  },
  {
    name: "GitHub",
    icon: "github",
    tag: ["DevOps", "Cloud", "Collaboration"],
    url: "https://github.com",
    iframe: "https://github.com/",
    description: "Cloud-based hosting service for software development and version control using Git, Actions, and CI/CD workflows.",
    skillLevel: 0.9,
  },
  // Overflow to Page 2:
  {
    name: "CI/CD",
    icon: "cicd",
    tag: ["DevOps", "Automation"],
    url: "https://about.gitlab.com/topics/ci-cd/",
    iframe: "https://about.gitlab.com/topics/ci-cd/",
    description: "Continuous Integration and Continuous Deployment methodologies automating build, test, and release delivery cycles.",
    skillLevel: 0.86,
  },
  {
    name: "AWS",
    icon: "aws",
    tag: ["Cloud", "DevOps", "Infrastructure"],
    url: "https://aws.amazon.com",
    iframe: "https://aws.amazon.com/",
    description: "Comprehensive on-demand cloud computing platform providing EC2 compute, S3 storage, RDS, and serverless Lambda.",
    skillLevel: 0.8,
  },
  {
    name: "Cloudflare",
    icon: "cloudflare",
    tag: ["Cloud", "CDN", "Security"],
    url: "https://www.cloudflare.com",
    iframe: "https://www.cloudflare.com/",
    description: "Global content delivery network (CDN), DDoS mitigation, edge workers, and DNS management platform.",
    skillLevel: 0.85,
  },
  {
    name: "Kafka",
    icon: "kafka",
    tag: ["Backend", "Streaming", "Distributed"],
    url: "https://kafka.apache.org",
    iframe: "https://kafka.apache.org/",
    description: "Distributed event store and stream-processing platform for high-throughput, low-latency real-time data pipelines.",
    skillLevel: 0.78,
  },
  {
    name: "RabbitMQ",
    icon: "rabbitmq",
    tag: ["Backend", "Message Broker"],
    url: "https://www.rabbitmq.com",
    iframe: "https://www.rabbitmq.com/",
    description: "Reliable open-source message broker implementing AMQP for asynchronous task queues and decoupled microservices.",
    skillLevel: 0.82,
  },
  {
    name: "WebSockets",
    icon: "websocket",
    tag: ["Backend", "Realtime", "Networking"],
    url: "https://developer.mozilla.org/en-US/docs/Web/API/WebSockets_API",
    iframe: "https://developer.mozilla.org/en-US/docs/Web/API/WebSockets_API",
    description: "Bidirectional, full-duplex communication protocol over a single TCP connection for low-latency live interactive apps.",
    skillLevel: 0.88,
  },
];

export const skills: string[] = defaultSkills.map((s) => s.name);

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
