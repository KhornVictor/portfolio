<script setup lang="ts">
import { computed, ref, watch } from "vue";
import type { Skill } from "../../service/portfolio.service";
import SkillIcon from "./SkillIcon.vue";
import { getSkillWebsite } from "./skillWebsites";

const props = defineProps<{
  skill:
    | Skill
    | {
        name: string;
        icon?: string;
        tag?: string[];
        url?: string;
        website?: string;
      };
  allSkills: Skill[];
}>();

defineEmits<{
  (e: "openSkill", skillName: string): void;
  (e: "changeWallpaper", wallpaper: string): void;
  (e: "changePhase", phase: "auto" | "dawn" | "day" | "sunset" | "night"): void;
  (e: "lock"): void;
}>();

const activeTab = ref<"website" | "overview" | "architecture">("website");
const normalized = computed(() =>
  (props.skill.icon || props.skill.name || "")
    .toLowerCase()
    .replace(/[\s._-]/g, ""),
);

const websiteUrl = ref(getSkillWebsite(props.skill));
const inputUrl = ref(websiteUrl.value);
const iframeKey = ref(0);
const iframeLoading = ref(true);
const showEmbedNotice = ref(true);

watch(
  () => props.skill,
  (newSkill) => {
    const url = getSkillWebsite(newSkill);
    websiteUrl.value = url;
    inputUrl.value = url;
    iframeKey.value++;
    iframeLoading.value = true;
    showEmbedNotice.value = true;
  },
  { immediate: true },
);

function reloadIframe() {
  iframeKey.value++;
  iframeLoading.value = true;
}

function handleNavigate() {
  let target = inputUrl.value.trim();
  if (!target) return;
  if (!target.startsWith("http://") && !target.startsWith("https://")) {
    target = "https://" + target;
  }
  websiteUrl.value = target;
  inputUrl.value = target;
  iframeKey.value++;
  iframeLoading.value = true;
}

function onIframeLoaded() {
  iframeLoading.value = false;
}

// -------------------------------------------------------------
// NESTJS APP STATE
// -------------------------------------------------------------
const nestEndpoints = [
  { method: "GET", path: "/api/v1/skills", label: "List all skills" },
  { method: "GET", path: "/api/v1/skills/backend", label: "Filter backend" },
  { method: "POST", path: "/api/v1/projects/deploy", label: "Trigger deploy" },
  { method: "GET", path: "/health", label: "Health check" },
];
const selectedNestEndpoint = ref(nestEndpoints[0]!);
const nestLoading = ref(false);
const nestResponse = ref<{ status: number; time: string; body: any }>({
  status: 200,
  time: "14ms",
  body: {
    statusCode: 200,
    message: "Success",
    data: {
      framework: "NestJS v10",
      architecture: "Modular & Dependency Injection",
      runtime: "Node.js 20 LTS",
      endpointsCount: 14,
      author: "Khorn Victor",
    },
  },
});

function sendNestRequest() {
  nestLoading.value = true;
  setTimeout(() => {
    nestLoading.value = false;
    if (selectedNestEndpoint.value.path === "/api/v1/skills") {
      nestResponse.value = {
        status: 200,
        time: `${Math.floor(Math.random() * 8 + 10)}ms`,
        body: {
          statusCode: 200,
          total: props.allSkills.length,
          skills: props.allSkills.map((s) => ({ name: s.name, tags: s.tag })),
        },
      };
    } else if (selectedNestEndpoint.value.path === "/health") {
      nestResponse.value = {
        status: 200,
        time: "4ms",
        body: {
          status: "ok",
          info: { database: { status: "up" }, redis: { status: "up" } },
        },
      };
    } else if (selectedNestEndpoint.value.path.includes("deploy")) {
      nestResponse.value = {
        status: 201,
        time: "82ms",
        body: {
          status: "initiated",
          message: "Deployment initiated successfully",
          deploymentId: "dep_99428x",
          target: "Kubernetes Cluster",
        },
      };
    } else {
      nestResponse.value = {
        status: 200,
        time: "11ms",
        body: { category: "backend", items: ["NestJS", "NodeJS", "ExpressJS"] },
      };
    }
  }, 350);
}

// -------------------------------------------------------------
// NODEJS BENCHMARK STATE
// -------------------------------------------------------------
const nodeBenchmarkRunning = ref(false);
const nodeReqPerSec = ref(24850);
const nodeLatency = ref(0.85);
const nodeMemory = ref(44.2);

function runNodeBenchmark() {
  nodeBenchmarkRunning.value = true;
  let count = 0;
  const interval = setInterval(() => {
    count++;
    nodeReqPerSec.value = Math.floor(22000 + Math.random() * 6000);
    nodeLatency.value = +(0.7 + Math.random() * 0.4).toFixed(2);
    nodeMemory.value = +(42 + Math.random() * 5).toFixed(1);
    if (count > 8) {
      clearInterval(interval);
      nodeBenchmarkRunning.value = false;
    }
  }, 250);
}

// -------------------------------------------------------------
// EXPRESS PIPELINE STATE
// -------------------------------------------------------------
const expressMiddlewares = ref([
  { id: "cors", name: "cors()", active: true, latency: "0.2ms" },
  { id: "helmet", name: "helmet()", active: true, latency: "0.4ms" },
  { id: "rateLimit", name: "rateLimiter()", active: true, latency: "0.3ms" },
  { id: "auth", name: "authGuard()", active: true, latency: "1.1ms" },
  { id: "handler", name: "skillRouter()", active: true, latency: "1.8ms" },
]);
const expressRunning = ref(false);
const expressStep = ref(-1);

function testExpressPipeline() {
  expressRunning.value = true;
  expressStep.value = 0;
  const timer = setInterval(() => {
    expressStep.value++;
    if (expressStep.value >= expressMiddlewares.value.length) {
      clearInterval(timer);
      setTimeout(() => {
        expressRunning.value = false;
        expressStep.value = -1;
      }, 500);
    }
  }, 300);
}

// -------------------------------------------------------------
// SQL / POSTGRES / MYSQL STATE
// -------------------------------------------------------------
const sqlPresets = [
  "SELECT * FROM skills ORDER BY name ASC;",
  "SELECT name, tag, proficiency FROM developer_skills WHERE 'Backend' = ANY(tag);",
  "SELECT category, count(*) AS total FROM tech_stack GROUP BY category;",
];
const currentSql = ref(sqlPresets[0]!);
const sqlExecutionTime = ref("1.24 ms");
const sqlRows = ref<any[]>([
  {
    id: 1,
    name: "NestJS",
    category: "Backend",
    proficiency: "95%",
    status: "Production",
  },
  {
    id: 2,
    name: "NodeJS",
    category: "Backend",
    proficiency: "98%",
    status: "Production",
  },
  {
    id: 3,
    name: "PostgreSQL",
    category: "Database",
    proficiency: "94%",
    status: "Production",
  },
  {
    id: 4,
    name: "Redis",
    category: "Database",
    proficiency: "92%",
    status: "Production",
  },
  {
    id: 5,
    name: "Docker",
    category: "DevOps",
    proficiency: "90%",
    status: "Production",
  },
  {
    id: 6,
    name: "Kubernetes",
    category: "DevOps",
    proficiency: "85%",
    status: "Production",
  },
]);

function runSqlQuery(query?: string) {
  if (query) currentSql.value = query;
  sqlExecutionTime.value = (Math.random() * 1.5 + 0.8).toFixed(2) + " ms";
}

// -------------------------------------------------------------
// REDIS STATE
// -------------------------------------------------------------
const redisCommandInput = ref("");
const redisLogs = ref<Array<{ type: "cmd" | "res"; text: string }>>([
  { type: "cmd", text: "PING" },
  { type: "res", text: "PONG" },
  { type: "cmd", text: 'SET user:current "Khorn Victor" EX 3600' },
  { type: "res", text: "OK" },
  { type: "cmd", text: "GET user:current" },
  { type: "res", text: '"Khorn Victor"' },
]);

function execRedisCommand(cmd?: string) {
  const c = (cmd || redisCommandInput.value).trim();
  if (!c) return;
  redisLogs.value.push({ type: "cmd", text: c });
  redisCommandInput.value = "";

  const upper = c.toUpperCase();
  if (upper === "PING") {
    redisLogs.value.push({ type: "res", text: "PONG" });
  } else if (upper.startsWith("GET")) {
    redisLogs.value.push({
      type: "res",
      text: '"Khorn Victor (Full-Stack Engineer)"',
    });
  } else if (upper.startsWith("SET")) {
    redisLogs.value.push({ type: "res", text: "OK" });
  } else if (upper.startsWith("KEYS")) {
    redisLogs.value.push({
      type: "res",
      text: '1) "cache:portfolio:skills"\n2) "session:user:victor"\n3) "rate_limit:ip_127.0.0.1"',
    });
  } else if (upper.startsWith("INFO")) {
    redisLogs.value.push({
      type: "res",
      text: "# Memory\nused_memory_human: 1.84M\nconnected_clients: 12\nuptime_in_days: 42",
    });
  } else {
    redisLogs.value.push({ type: "res", text: `(integer) 1` });
  }
}

// -------------------------------------------------------------
// DOCKER STATE
// -------------------------------------------------------------
const containers = ref([
  {
    id: "c1",
    name: "portfolio-api",
    image: "node:20-alpine",
    port: "5000:5000",
    status: "Running",
    cpu: "1.2%",
    mem: "46 MB",
  },
  {
    id: "c2",
    name: "postgres-db",
    image: "postgres:16",
    port: "5432:5432",
    status: "Running",
    cpu: "0.6%",
    mem: "84 MB",
  },
  {
    id: "c3",
    name: "redis-cache",
    image: "redis:7-alpine",
    port: "6379:6379",
    status: "Running",
    cpu: "0.2%",
    mem: "14 MB",
  },
  {
    id: "c4",
    name: "traefik-proxy",
    image: "traefik:v3.0",
    port: "80:80, 443:443",
    status: "Running",
    cpu: "0.4%",
    mem: "22 MB",
  },
]);

function toggleContainer(c: (typeof containers.value)[0]) {
  if (c.status === "Running") {
    c.status = "Exited";
    c.cpu = "0.0%";
    c.mem = "0 MB";
  } else {
    c.status = "Running";
    c.cpu = "0.8%";
    c.mem = "38 MB";
  }
}

// -------------------------------------------------------------
// KUBERNETES STATE
// -------------------------------------------------------------
const replicas = ref(3);
const pods = computed(() => {
  const list = [];
  for (let i = 1; i <= replicas.value; i++) {
    list.push({
      name: `portfolio-backend-${i}`,
      node: `node-sg-${(i % 2) + 1}`,
      restarts: 0,
      age: "14d",
      status: "Running",
    });
  }
  return list;
});

// -------------------------------------------------------------
// TERMINAL APP STATE
// -------------------------------------------------------------
const terminalHistory = ref<Array<{ type: "cmd" | "res"; text: string }>>([
  {
    type: "res",
    text: "iPadOS Terminal v18.2 (aarch64-apple-darwin)\nType 'help' to list available commands.",
  },
  { type: "cmd", text: "whoami" },
  { type: "res", text: "khorn-victor (Full-Stack Engineer)" },
]);
const termInput = ref("");

function handleTermSubmit() {
  const val = termInput.value.trim();
  if (!val) return;
  terminalHistory.value.push({ type: "cmd", text: val });
  termInput.value = "";

  const cmd = val.toLowerCase();
  if (cmd === "help") {
    terminalHistory.value.push({
      type: "res",
      text: "Available commands: skills, whoami, contact, specs, clear",
    });
  } else if (cmd === "skills") {
    terminalHistory.value.push({
      type: "res",
      text: props.allSkills
        .map((s) => `- ${s.name} [${s.tag?.join(", ")}]`)
        .join("\n"),
    });
  } else if (cmd === "contact") {
    terminalHistory.value.push({
      type: "res",
      text: "Email: victorkhornkh@gmail.com\nGitHub: github.com/KhornVictor\nLinkedIn: linkedin.com/in/khorn-victor-794a6635a",
    });
  } else if (cmd === "specs") {
    terminalHistory.value.push({
      type: "res",
      text: "iPad Pro 13-inch (M4)\nApple M4 10-core CPU, 10-core GPU\n16GB Unified Memory, Ultra Retina XDR OLED",
    });
  } else if (cmd === "clear") {
    terminalHistory.value = [];
  } else {
    terminalHistory.value.push({
      type: "res",
      text: `zsh: command not found: ${val}. Type 'help' for commands.`,
    });
  }
}
</script>

<template>
  <div
    class="w-full h-full flex flex-col bg-slate-900 text-slate-100 select-none overflow-hidden"
  >
    <!-- App Subheader / Safari Toolbar -->
    <div
      class="h-10 px-3 bg-slate-950/90 border-b border-white/10 flex items-center justify-between text-xs backdrop-blur-md shrink-0 gap-2"
    >
      <div class="flex items-center gap-2 shrink-0">
        <SkillIcon :name="skill.name" :icon="skill.icon" :size="20" />
        <span class="font-bold text-slate-200 tracking-wide hidden sm:inline">{{
          skill.name
        }}</span>
      </div>

      <!-- Center: Safari Address Pill when on Website tab -->
      <div
        v-if="activeTab === 'website'"
        class="flex-1 max-w-sm sm:max-w-md mx-2 h-7 px-2.5 rounded-full bg-slate-900 border border-white/15 flex items-center gap-1.5 text-[11px] text-slate-300"
      >
        <span class="text-[10px] text-emerald-400">🔒</span>
        <input
          v-model="inputUrl"
          class="flex-1 bg-transparent border-0 outline-none text-slate-200 font-mono text-[10px] sm:text-[11px] truncate"
          placeholder="https://..."
          @keydown.enter="handleNavigate"
        />
        <button
          class="p-0.5 text-slate-400 hover:text-white transition cursor-pointer"
          title="Reload page"
          @click="reloadIframe"
        >
          <svg
            viewBox="0 0 24 24"
            class="w-3 h-3"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
          >
            <path d="M23 4v6h-6M1 20v-6h6" />
            <path
              d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"
            />
          </svg>
        </button>
        <a
          :href="websiteUrl"
          target="_blank"
          rel="noopener noreferrer"
          class="p-0.5 text-slate-400 hover:text-cyan-300 transition"
          title="Open in external browser tab"
        >
          <svg
            viewBox="0 0 24 24"
            class="w-3 h-3"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
          >
            <path
              d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"
            />
            <polyline points="15 3 21 3 21 9" />
            <line x1="10" y1="14" x2="21" y2="3" />
          </svg>
        </a>
      </div>

      <!-- Right: Tab Switchers -->
      <div class="flex items-center gap-1 shrink-0">
        <button
          class="px-2 py-1 rounded-md transition-colors text-[10px] sm:text-[11px] font-medium flex items-center gap-1 cursor-pointer"
          :class="
            activeTab === 'website'
              ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-bold'
              : 'text-slate-400 hover:text-white'
          "
          @click="activeTab = 'website'"
        >
          <span>🌐</span>
          <span>Web</span>
        </button>
        <button
          class="px-2 py-1 rounded-md transition-colors text-[10px] sm:text-[11px] font-medium flex items-center gap-1 cursor-pointer"
          :class="
            activeTab === 'overview'
              ? 'bg-white/20 text-white font-bold'
              : 'text-slate-400 hover:text-white'
          "
          @click="activeTab = 'overview'"
        >
          <span>⚡</span>
          <span class="hidden sm:inline">Playground</span>
        </button>
        <button
          class="px-2 py-1 rounded-md transition-colors text-[10px] sm:text-[11px] font-medium flex items-center gap-1 cursor-pointer"
          :class="
            activeTab === 'architecture'
              ? 'bg-white/20 text-white font-bold'
              : 'text-slate-400 hover:text-white'
          "
          @click="activeTab = 'architecture'"
        >
          <span>📐</span>
          <span class="hidden sm:inline">Arch</span>
        </button>
      </div>
    </div>

    <!-- ========================================================= -->
    <!-- 1. LIVE IFRAME WEB APP (When activeTab === 'website') -->
    <!-- ========================================================= -->
    <div
      v-if="activeTab === 'website'"
      class="relative flex-1 w-full h-full flex flex-col bg-white overflow-hidden"
    >
      <!-- Loading bar -->
      <div
        v-if="iframeLoading"
        class="h-0.5 w-full bg-slate-900 overflow-hidden shrink-0"
      >
        <div class="h-full bg-cyan-400 animate-pulse w-full"></div>
      </div>

      <iframe
        ref="iframeRef"
        :key="iframeKey"
        :src="websiteUrl"
        class="w-full h-full flex-1 border-0 bg-white"
        sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-downloads allow-modals"
        allow="
          accelerometer;
          autoplay;
          clipboard-write;
          encrypted-media;
          gyroscope;
          picture-in-picture;
          web-share;
        "
        loading="lazy"
        @load="onIframeLoaded"
      ></iframe>

      <!-- Friendly notice -->
      <div
        v-if="showEmbedNotice"
        class="absolute bottom-2 left-1/2 -translate-x-1/2 z-20 px-3 py-1.5 rounded-full bg-slate-950/90 backdrop-blur-md border border-white/20 shadow-xl flex items-center gap-2 text-xs text-white select-none pointer-events-auto"
      >
        <span class="text-[10px] text-slate-300">
          Showing <strong>{{ skill.name }}</strong> official web app
        </span>
        <a
          :href="websiteUrl"
          target="_blank"
          rel="noopener noreferrer"
          class="text-cyan-400 font-semibold text-[10px] underline hover:text-cyan-300"
        >
          Open New Tab ↗
        </a>
        <button
          class="text-white/60 hover:text-white text-[10px] ml-1 cursor-pointer"
          title="Dismiss"
          @click="showEmbedNotice = false"
        >
          ✕
        </button>
      </div>
    </div>

    <!-- App Body Area (For Overview & Architecture) -->
    <div v-else class="flex-1 overflow-y-auto p-4 sm:p-5 no-scrollbar">
      <!-- ========================================================= -->
      <!-- ARCHITECTURE VIEW (When activeTab === 'architecture') -->
      <!-- ========================================================= -->
      <div v-if="activeTab === 'architecture'" class="space-y-4">
        <!-- NestJS Architecture -->
        <div v-if="normalized.includes('nest')" class="space-y-3 text-xs">
          <div
            class="bg-slate-950/70 border border-white/10 p-4 rounded-xl space-y-2"
          >
            <h4 class="font-bold text-white text-sm">
              Enterprise NestJS Clean Architecture
            </h4>
            <p class="text-slate-300 leading-relaxed">
              Structured around modular Domain-Driven Design (DDD), enforcing
              strict boundary separation between transport controllers, business
              service layers, and database access persistence.
            </p>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div
              class="bg-slate-950/50 border border-white/10 p-3 rounded-xl space-y-1.5 font-mono text-[11px]"
            >
              <div class="text-emerald-400 font-bold">
                Dependency Injection Pattern:
              </div>
              <pre class="text-slate-300 whitespace-pre-wrap leading-relaxed">
@Injectable()
export class SkillsService {
  constructor(
    @Inject(CACHE_MANAGER) private cache: Cache,
    private readonly prisma: PrismaService,
  ) {}
}</pre
              >
            </div>
            <div
              class="bg-slate-950/50 border border-white/10 p-3 rounded-xl space-y-1.5 font-mono text-[11px]"
            >
              <div class="text-cyan-400 font-bold">
                Guard & Validation Pipeline:
              </div>
              <pre class="text-slate-300 whitespace-pre-wrap leading-relaxed">
@UseGuards(JwtAuthGuard, RolesGuard)
@UsePipes(new ValidationPipe({ whitelist: true }))
@Post('deploy')
async deploy(@Body() dto: DeployDto) {}</pre
              >
            </div>
          </div>
        </div>

        <!-- Node.js Architecture -->
        <div v-else-if="normalized.includes('node')" class="space-y-3 text-xs">
          <div
            class="bg-slate-950/70 border border-white/10 p-4 rounded-xl space-y-2"
          >
            <h4 class="font-bold text-white text-sm">
              Node.js Libuv Asynchronous I/O Pipeline
            </h4>
            <p class="text-slate-300 leading-relaxed">
              Leveraging non-blocking event-driven concurrency, streaming
              pipelines for low memory footprint, and cluster-based worker pools
              for multicore CPU utilization.
            </p>
          </div>
          <div
            class="bg-slate-950/50 border border-white/10 p-3.5 rounded-xl font-mono text-[11px] text-slate-300 space-y-2"
          >
            <div class="text-emerald-400 font-bold">
              Event Loop Execution Phases:
            </div>
            <div
              class="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-[10px]"
            >
              <div class="bg-white/5 p-2 rounded border border-white/10">
                1. Timers (setTimeout)
              </div>
              <div class="bg-white/5 p-2 rounded border border-white/10">
                2. Pending Callbacks
              </div>
              <div class="bg-white/5 p-2 rounded border border-white/10">
                3. Poll (I/O events)
              </div>
              <div class="bg-white/5 p-2 rounded border border-white/10">
                4. Check (setImmediate)
              </div>
            </div>
          </div>
        </div>

        <!-- PostgreSQL / MySQL Architecture -->
        <div
          v-else-if="
            normalized.includes('postgres') ||
            normalized.includes('mysql') ||
            normalized.includes('sql')
          "
          class="space-y-3 text-xs"
        >
          <div
            class="bg-slate-950/70 border border-white/10 p-4 rounded-xl space-y-2"
          >
            <h4 class="font-bold text-white text-sm">
              Relational Integrity & Query Optimization
            </h4>
            <p class="text-slate-300 leading-relaxed">
              ACID compliant transactional schemas, composite B-Tree indexes,
              partitioned audit logs, and connection pooling managed via
              PgBouncer / Prisma client.
            </p>
          </div>
          <div class="grid grid-cols-3 gap-2 text-center font-mono">
            <div class="bg-slate-950/50 border border-white/10 p-3 rounded-lg">
              <div class="text-blue-400 font-bold text-base">ACID</div>
              <div class="text-[10px] text-slate-400 mt-1">
                Full Transaction Isolation
              </div>
            </div>
            <div class="bg-slate-950/50 border border-white/10 p-3 rounded-lg">
              <div class="text-emerald-400 font-bold text-base">B-Tree</div>
              <div class="text-[10px] text-slate-400 mt-1">
                Optimized Index Lookups
              </div>
            </div>
            <div class="bg-slate-950/50 border border-white/10 p-3 rounded-lg">
              <div class="text-purple-400 font-bold text-base">Pooling</div>
              <div class="text-[10px] text-slate-400 mt-1">
                PgBouncer Connection Reuse
              </div>
            </div>
          </div>
        </div>

        <!-- Redis Architecture -->
        <div v-else-if="normalized.includes('redis')" class="space-y-3 text-xs">
          <div
            class="bg-slate-950/70 border border-white/10 p-4 rounded-xl space-y-2"
          >
            <h4 class="font-bold text-white text-sm">
              In-Memory Cache & Pub/Sub Architecture
            </h4>
            <p class="text-slate-300 leading-relaxed">
              Sub-millisecond latency cache layer implementing the Cache-Aside
              pattern, sliding-window rate limiting, and Redis Pub/Sub for
              distributed websocket synchronizations.
            </p>
          </div>
        </div>

        <!-- Docker Architecture -->
        <div
          v-else-if="normalized.includes('docker')"
          class="space-y-3 text-xs"
        >
          <div
            class="bg-slate-950/70 border border-white/10 p-4 rounded-xl space-y-2"
          >
            <h4 class="font-bold text-white text-sm">
              Multi-Stage OCI Containerization
            </h4>
            <p class="text-slate-300 leading-relaxed">
              Stripping all build dependencies, compilers, and source files
              using multi-stage builds, generating ultra-lightweight, hardened
              Alpine/Distroless runner images under 60MB.
            </p>
          </div>
        </div>

        <!-- Kubernetes Architecture -->
        <div
          v-else-if="normalized.includes('kube') || normalized.includes('k8s')"
          class="space-y-3 text-xs"
        >
          <div
            class="bg-slate-950/70 border border-white/10 p-4 rounded-xl space-y-2"
          >
            <h4 class="font-bold text-white text-sm">
              Cloud-Native Kubernetes Cluster Topology
            </h4>
            <p class="text-slate-300 leading-relaxed">
              TLS Ingress controller terminating SSL, routing traffic into
              ClusterIP services, fronting multi-replica Pod Deployments with
              Horizontal Pod Autoscalers (HPA) and rolling zero-downtime
              updates.
            </p>
          </div>
        </div>

        <!-- Default Architecture View -->
        <div v-else class="space-y-3 text-xs">
          <div
            class="bg-slate-950/70 border border-white/10 p-4 rounded-xl space-y-2"
          >
            <h4 class="font-bold text-white text-sm">
              {{ skill.name }} Architectural Overview
            </h4>
            <p class="text-slate-300 leading-relaxed">
              Seamlessly integrated within Victor's scalable backend and cloud
              infrastructure stack, focusing on performance, maintainability,
              and enterprise-grade code structure.
            </p>
          </div>
        </div>
      </div>

      <!-- ========================================================= -->
      <!-- OVERVIEW / INTERACTIVE APPS (When activeTab === 'overview') -->
      <!-- ========================================================= -->
      <div v-else>
        <!-- 1. NESTJS APP -->
        <div v-if="normalized.includes('nest')" class="space-y-4">
          <!-- Request builder -->
          <div
            class="bg-slate-950/60 rounded-xl border border-white/10 p-3.5 space-y-3"
          >
            <div class="flex items-center justify-between">
              <span
                class="text-xs font-semibold text-slate-300 flex items-center gap-1.5"
              >
                <span
                  class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"
                ></span>
                Interactive REST Controller Tester
              </span>
              <span class="text-[10px] font-mono text-slate-400"
                >@Controller('api/v1')</span
              >
            </div>

            <div class="flex flex-col sm:flex-row gap-2">
              <div
                class="flex-1 flex items-center bg-slate-900 border border-white/15 rounded-lg px-2.5 py-1.5 text-xs font-mono"
              >
                <span
                  class="font-bold mr-2 text-[11px]"
                  :class="
                    selectedNestEndpoint.method === 'GET'
                      ? 'text-emerald-400'
                      : 'text-cyan-400'
                  "
                >
                  {{ selectedNestEndpoint.method }}
                </span>
                <span class="text-slate-300 flex-1 truncate">{{
                  selectedNestEndpoint.path
                }}</span>
              </div>
              <button
                class="px-4 py-1.5 rounded-lg bg-red-600 hover:bg-red-500 text-white text-xs font-bold transition-all shadow-md flex items-center justify-center gap-1.5 cursor-pointer active:scale-95"
                :disabled="nestLoading"
                @click="sendNestRequest"
              >
                <svg
                  v-if="nestLoading"
                  class="animate-spin h-3.5 w-3.5"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <circle
                    class="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    stroke-width="4"
                  ></circle>
                  <path
                    class="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v8H4z"
                  ></path>
                </svg>
                <span>{{ nestLoading ? "Executing..." : "Send Request" }}</span>
              </button>
            </div>

            <!-- Quick endpoint selectors -->
            <div class="flex flex-wrap gap-1.5 pt-1">
              <button
                v-for="ep in nestEndpoints"
                :key="ep.path"
                class="px-2 py-1 rounded-md text-[10px] font-mono transition-colors border cursor-pointer"
                :class="
                  selectedNestEndpoint.path === ep.path
                    ? 'bg-red-500/20 text-red-300 border-red-500/40'
                    : 'bg-white/5 text-slate-400 border-white/5 hover:bg-white/10'
                "
                @click="selectedNestEndpoint = ep"
              >
                {{ ep.method }} {{ ep.path }}
              </button>
            </div>
          </div>

          <!-- Response output -->
          <div
            class="bg-slate-950/90 rounded-xl border border-white/10 p-3.5 space-y-2"
          >
            <div
              class="flex items-center justify-between text-xs pb-2 border-b border-white/10"
            >
              <div class="flex items-center gap-2">
                <span
                  class="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono text-[11px] font-bold"
                >
                  {{ nestResponse.status }} OK
                </span>
                <span class="text-slate-400 text-[11px] font-mono"
                  >Response Time: {{ nestResponse.time }}</span
                >
              </div>
              <span class="text-[10px] text-slate-500 font-mono"
                >application/json</span
              >
            </div>

            <pre
              class="text-[11px] font-mono text-emerald-300/90 overflow-x-auto p-2 bg-black/40 rounded-lg max-h-48 leading-relaxed"
              >{{ JSON.stringify(nestResponse.body, null, 2) }}</pre
            >
          </div>

          <!-- Nest architectural highlights -->
          <div class="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
            <div class="bg-slate-950/40 border border-white/5 p-2.5 rounded-lg">
              <div class="text-slate-400 text-[10px]">Architecture</div>
              <div class="font-semibold text-slate-200 mt-0.5">
                Dependency Injection
              </div>
            </div>
            <div class="bg-slate-950/40 border border-white/5 p-2.5 rounded-lg">
              <div class="text-slate-400 text-[10px]">Security</div>
              <div class="font-semibold text-slate-200 mt-0.5">
                Guards & Interceptors
              </div>
            </div>
            <div
              class="bg-slate-950/40 border border-white/5 p-2.5 rounded-lg col-span-2 sm:col-span-1"
            >
              <div class="text-slate-400 text-[10px]">Scalability</div>
              <div class="font-semibold text-slate-200 mt-0.5">
                Microservices & Redis
              </div>
            </div>
          </div>
        </div>

        <!-- 2. NODEJS APP -->
        <div v-else-if="normalized.includes('node')" class="space-y-4">
          <!-- V8 Metrics Card -->
          <div class="grid grid-cols-3 gap-3">
            <div class="bg-slate-950/60 border border-white/10 rounded-xl p-3">
              <span class="text-[10px] text-slate-400 uppercase font-mono"
                >Throughput</span
              >
              <div
                class="text-lg font-extrabold text-emerald-400 font-mono mt-0.5"
              >
                {{ nodeReqPerSec.toLocaleString() }}
                <span class="text-[10px] font-normal text-slate-400"
                  >req/s</span
                >
              </div>
            </div>
            <div class="bg-slate-950/60 border border-white/10 rounded-xl p-3">
              <span class="text-[10px] text-slate-400 uppercase font-mono"
                >Loop Delay</span
              >
              <div
                class="text-lg font-extrabold text-cyan-400 font-mono mt-0.5"
              >
                {{ nodeLatency }}
                <span class="text-[10px] font-normal text-slate-400">ms</span>
              </div>
            </div>
            <div class="bg-slate-950/60 border border-white/10 rounded-xl p-3">
              <span class="text-[10px] text-slate-400 uppercase font-mono"
                >Heap Used</span
              >
              <div
                class="text-lg font-extrabold text-amber-400 font-mono mt-0.5"
              >
                {{ nodeMemory }}
                <span class="text-[10px] font-normal text-slate-400">MB</span>
              </div>
            </div>
          </div>

          <!-- Benchmark trigger -->
          <div
            class="bg-slate-950/80 border border-white/10 rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3"
          >
            <div>
              <div class="text-xs font-bold text-slate-200">
                Interactive Event-Loop Benchmark
              </div>
              <div class="text-[11px] text-slate-400">
                Stress tests the Node.js V8 non-blocking asynchronous pipeline
              </div>
            </div>
            <button
              class="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all shadow-md active:scale-95 cursor-pointer whitespace-nowrap"
              :disabled="nodeBenchmarkRunning"
              @click="runNodeBenchmark"
            >
              {{
                nodeBenchmarkRunning
                  ? "Benchmarking Cluster..."
                  : "Run Benchmark"
              }}
            </button>
          </div>

          <!-- Node code snippet -->
          <div
            class="bg-slate-950 rounded-xl border border-white/10 p-3 font-mono text-[11px] text-slate-300"
          >
            <div
              class="text-slate-500 pb-2 text-[10px] border-b border-white/10"
            >
              // Asynchronous Cluster Worker Pool
            </div>
            <pre class="pt-2 text-emerald-300/80 leading-relaxed">
import cluster from 'node:cluster';
import http from 'node:http';
import { availableParallelism } from 'node:os';

if (cluster.isPrimary) {
  for (let i = 0; i < availableParallelism(); i++) cluster.fork();
} else {
  http.createServer((req, res) => res.end('HTTP/1.1 200 OK')).listen(5000);
}</pre
            >
          </div>
        </div>

        <!-- 3. EXPRESSJS APP -->
        <div v-else-if="normalized.includes('express')" class="space-y-4">
          <div
            class="bg-slate-950/60 border border-white/10 rounded-xl p-3.5 space-y-3"
          >
            <div class="flex items-center justify-between">
              <span class="text-xs font-semibold text-slate-200"
                >Middleware Pipeline Execution Chain</span
              >
              <button
                class="px-3 py-1 bg-white/10 hover:bg-white/20 text-white rounded-md text-[11px] font-bold transition cursor-pointer"
                :disabled="expressRunning"
                @click="testExpressPipeline"
              >
                {{
                  expressRunning
                    ? "Processing Request..."
                    : "Trigger Pipeline Test"
                }}
              </button>
            </div>

            <!-- Pipeline stages -->
            <div class="space-y-2 pt-2">
              <div
                v-for="(mw, idx) in expressMiddlewares"
                :key="mw.id"
                class="flex items-center justify-between px-3 py-2 rounded-lg border text-xs font-mono transition-all"
                :class="
                  expressStep === idx
                    ? 'bg-cyan-500/20 border-cyan-400 text-cyan-200 scale-[1.01] shadow-md'
                    : 'bg-slate-900/60 border-white/10 text-slate-300'
                "
              >
                <div class="flex items-center gap-2">
                  <span class="text-[10px] text-slate-500">{{ idx + 1 }}.</span>
                  <span class="font-bold">{{ mw.name }}</span>
                  <span
                    v-if="expressStep === idx"
                    class="px-1.5 py-0.5 rounded bg-cyan-400 text-black text-[9px] font-bold animate-pulse"
                  >
                    EXECUTING
                  </span>
                </div>
                <div class="flex items-center gap-3">
                  <span class="text-[11px] text-slate-400">{{
                    mw.latency
                  }}</span>
                  <span
                    class="w-2 h-2 rounded-full"
                    :class="mw.active ? 'bg-emerald-400' : 'bg-slate-600'"
                  ></span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 4. POSTGRESQL / MYSQL APP -->
        <div
          v-else-if="
            normalized.includes('postgres') ||
            normalized.includes('mysql') ||
            normalized.includes('sql')
          "
          class="space-y-4"
        >
          <!-- SQL Query Bar -->
          <div
            class="bg-slate-950/70 border border-white/10 rounded-xl p-3 space-y-2"
          >
            <div class="flex items-center justify-between text-xs">
              <span
                class="font-semibold text-slate-200 flex items-center gap-1.5"
              >
                <span class="w-2 h-2 rounded-full bg-blue-400"></span>
                SQL Studio Console
              </span>
              <span class="text-[10px] font-mono text-slate-400"
                >Execution: {{ sqlExecutionTime }}</span
              >
            </div>

            <div class="flex gap-2">
              <input
                v-model="currentSql"
                type="text"
                class="flex-1 bg-slate-900 border border-white/15 rounded-lg px-3 py-1.5 text-xs font-mono text-cyan-300 focus:outline-none focus:border-cyan-400"
                @keydown.enter="runSqlQuery()"
              />
              <button
                class="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-bold transition shadow active:scale-95 cursor-pointer"
                @click="runSqlQuery()"
              >
                Run Query
              </button>
            </div>

            <div class="flex flex-wrap gap-1 pt-1">
              <button
                v-for="q in sqlPresets"
                :key="q"
                class="text-[10px] font-mono px-2 py-0.5 rounded bg-white/5 hover:bg-white/10 text-slate-400 transition truncate max-w-full cursor-pointer"
                @click="runSqlQuery(q)"
              >
                {{ q }}
              </button>
            </div>
          </div>

          <!-- Query Results Table -->
          <div
            class="bg-slate-950 rounded-xl border border-white/10 overflow-hidden"
          >
            <div class="overflow-x-auto">
              <table class="w-full text-left text-xs font-mono">
                <thead
                  class="bg-slate-900/80 border-b border-white/10 text-slate-400"
                >
                  <tr>
                    <th class="p-2.5">id</th>
                    <th class="p-2.5">name</th>
                    <th class="p-2.5">category</th>
                    <th class="p-2.5">proficiency</th>
                    <th class="p-2.5">status</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-white/5 text-slate-300">
                  <tr
                    v-for="row in sqlRows"
                    :key="row.id"
                    class="hover:bg-white/5"
                  >
                    <td class="p-2.5 text-slate-500">{{ row.id }}</td>
                    <td class="p-2.5 font-semibold text-white">
                      {{ row.name }}
                    </td>
                    <td class="p-2.5 text-slate-400">{{ row.category }}</td>
                    <td class="p-2.5 text-emerald-400">
                      {{ row.proficiency }}
                    </td>
                    <td class="p-2.5">
                      <span
                        class="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-[10px]"
                      >
                        {{ row.status }}
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <!-- 5. REDIS APP -->
        <div v-else-if="normalized.includes('redis')" class="space-y-4">
          <!-- Redis Quick Stats -->
          <div class="grid grid-cols-3 gap-2 text-xs">
            <div
              class="bg-slate-950/60 border border-white/10 p-2.5 rounded-lg"
            >
              <span class="text-[10px] text-slate-400">Cache Hit Rate</span>
              <div
                class="text-base font-extrabold text-red-400 font-mono mt-0.5"
              >
                99.4%
              </div>
            </div>
            <div
              class="bg-slate-950/60 border border-white/10 p-2.5 rounded-lg"
            >
              <span class="text-[10px] text-slate-400">Ops / Second</span>
              <div class="text-base font-extrabold text-white font-mono mt-0.5">
                14,200
              </div>
            </div>
            <div
              class="bg-slate-950/60 border border-white/10 p-2.5 rounded-lg"
            >
              <span class="text-[10px] text-slate-400">Memory Used</span>
              <div
                class="text-base font-extrabold text-amber-400 font-mono mt-0.5"
              >
                1.84 MB
              </div>
            </div>
          </div>

          <!-- Redis CLI -->
          <div
            class="bg-black/90 border border-red-500/20 rounded-xl p-3 font-mono text-xs space-y-2"
          >
            <div
              class="flex items-center justify-between pb-2 border-b border-white/10 text-[11px] text-slate-400"
            >
              <span>redis-cli 127.0.0.1:6379</span>
              <span class="text-red-400 font-bold">STANDALONE</span>
            </div>

            <div class="space-y-1.5 max-h-44 overflow-y-auto pr-1">
              <div
                v-for="(item, idx) in redisLogs"
                :key="idx"
                class="leading-relaxed"
              >
                <span v-if="item.type === 'cmd'" class="text-red-400 font-bold"
                  >> {{ item.text }}</span
                >
                <pre v-else class="text-emerald-400 whitespace-pre-wrap pl-3">{{
                  item.text
                }}</pre>
              </div>
            </div>

            <div class="flex gap-2 pt-2 border-t border-white/10">
              <input
                v-model="redisCommandInput"
                type="text"
                placeholder="e.g. GET user:current, PING, KEYS *"
                class="flex-1 bg-slate-900 border border-white/15 rounded px-2 py-1 text-xs text-slate-100 focus:outline-none focus:border-red-400"
                @keydown.enter="execRedisCommand()"
              />
              <button
                class="px-3 py-1 bg-red-600 hover:bg-red-500 text-white rounded text-xs font-bold transition cursor-pointer"
                @click="execRedisCommand()"
              >
                Exec
              </button>
            </div>

            <!-- Fast action buttons -->
            <div class="flex flex-wrap gap-1 pt-1">
              <button
                v-for="cmd in ['PING', 'GET user:current', 'KEYS *', 'INFO']"
                :key="cmd"
                class="px-2 py-0.5 rounded bg-white/5 hover:bg-white/10 text-[10px] text-slate-400 transition cursor-pointer"
                @click="execRedisCommand(cmd)"
              >
                {{ cmd }}
              </button>
            </div>
          </div>
        </div>

        <!-- 6. DOCKER APP -->
        <div v-else-if="normalized.includes('docker')" class="space-y-4">
          <div class="flex items-center justify-between">
            <span class="text-xs font-bold text-slate-200"
              >Active Docker Containers</span
            >
            <span class="text-[11px] font-mono text-emerald-400"
              >Docker Engine 25.0 (Active)</span
            >
          </div>

          <div class="space-y-2">
            <div
              v-for="c in containers"
              :key="c.id"
              class="bg-slate-950/70 border border-white/10 rounded-xl p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
            >
              <div class="flex items-center gap-3">
                <div
                  class="w-3 h-3 rounded-full shrink-0"
                  :class="
                    c.status === 'Running'
                      ? 'bg-emerald-400 animate-pulse'
                      : 'bg-slate-600'
                  "
                ></div>
                <div>
                  <div class="font-bold text-white font-mono">{{ c.name }}</div>
                  <div class="text-[10px] text-slate-400 font-mono">
                    {{ c.image }} | Ports: {{ c.port }}
                  </div>
                </div>
              </div>

              <div class="flex items-center gap-4">
                <div class="text-[11px] font-mono text-right hidden sm:block">
                  <div class="text-slate-400">
                    CPU: <span class="text-white">{{ c.cpu }}</span>
                  </div>
                  <div class="text-slate-400">
                    MEM: <span class="text-white">{{ c.mem }}</span>
                  </div>
                </div>
                <button
                  class="px-3 py-1 rounded text-xs font-bold transition cursor-pointer"
                  :class="
                    c.status === 'Running'
                      ? 'bg-red-500/20 text-red-300 hover:bg-red-500/30'
                      : 'bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30'
                  "
                  @click="toggleContainer(c)"
                >
                  {{ c.status === "Running" ? "Stop" : "Start" }}
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- 7. KUBERNETES APP -->
        <div
          v-else-if="normalized.includes('kube') || normalized.includes('k8s')"
          class="space-y-4"
        >
          <!-- Scale deployment control -->
          <div
            class="bg-slate-950/70 border border-white/10 rounded-xl p-3.5 flex items-center justify-between"
          >
            <div>
              <div class="text-xs font-bold text-slate-200">
                Scale Deployment Replicas
              </div>
              <div class="text-[11px] text-slate-400">
                Dynamic replica management on k8s cluster
              </div>
            </div>
            <div class="flex items-center gap-2">
              <button
                class="w-7 h-7 rounded bg-white/10 hover:bg-white/20 text-white font-bold flex items-center justify-center cursor-pointer"
                :disabled="replicas <= 1"
                @click="replicas--"
              >
                -
              </button>
              <span class="w-6 text-center font-mono font-bold text-blue-400">{{
                replicas
              }}</span>
              <button
                class="w-7 h-7 rounded bg-white/10 hover:bg-white/20 text-white font-bold flex items-center justify-center cursor-pointer"
                :disabled="replicas >= 6"
                @click="replicas++"
              >
                +
              </button>
            </div>
          </div>

          <!-- Pods List -->
          <div class="space-y-2">
            <div
              v-for="pod in pods"
              :key="pod.name"
              class="bg-slate-950/50 border border-blue-500/20 rounded-lg p-2.5 flex items-center justify-between text-xs font-mono"
            >
              <div class="flex items-center gap-2">
                <span
                  class="w-2 h-2 rounded-full bg-blue-400 animate-pulse"
                ></span>
                <span class="text-white">{{ pod.name }}</span>
              </div>
              <div class="flex items-center gap-3 text-[11px] text-slate-400">
                <span>{{ pod.node }}</span>
                <span
                  class="px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-[10px]"
                >
                  {{ pod.status }}
                </span>
              </div>
            </div>
          </div>
        </div>

        <!-- 8. MONGODB APP -->
        <div v-else-if="normalized.includes('mongo')" class="space-y-4">
          <div
            class="bg-slate-950/70 border border-white/10 rounded-xl p-3 text-xs space-y-2"
          >
            <div class="flex items-center justify-between">
              <span class="font-bold text-emerald-400"
                >Collection: portfolio.skills</span
              >
              <span class="text-[10px] font-mono text-slate-400"
                >Database: production</span
              >
            </div>

            <pre
              class="bg-black/50 p-3 rounded-lg text-emerald-300 font-mono text-[11px] leading-relaxed max-h-56 overflow-y-auto"
            >
{
  "_id": ObjectId("64f8a912e4b0c78a9910d2"),
  "developer": "Khorn Victor",
  "specialization": "Full-Stack Backend Architecture",
  "skills": [
    { "name": "MongoDB", "type": "NoSQL Document Store", "experience": "Advanced" },
    { "name": "NestJS", "type": "Enterprise Backend", "status": "Active" },
    { "name": "Redis", "type": "In-Memory Cache", "latency": "<1ms" }
  ],
  "cluster": "Atlas ReplicaSet (M30)",
  "region": "ap-southeast-1"
}</pre
            >
          </div>
        </div>

        <!-- 9. SAFARI BROWSER APP -->
        <div
          v-else-if="normalized.includes('safari')"
          class="space-y-4 text-xs"
        >
          <!-- Safari address bar -->
          <div
            class="bg-slate-950/90 border border-white/15 rounded-xl p-2.5 flex items-center justify-between gap-2 shadow-md"
          >
            <div class="flex items-center gap-1.5 text-slate-400">
              <button class="p-1 rounded hover:bg-white/10 transition">
                ‹
              </button>
              <button class="p-1 rounded hover:bg-white/10 transition">
                ›
              </button>
            </div>
            <div
              class="flex-1 max-w-md bg-slate-900 border border-white/10 rounded-lg px-3 py-1 flex items-center justify-center gap-1.5 text-[11px] text-slate-300 font-mono"
            >
              <svg
                viewBox="0 0 24 24"
                class="w-3 h-3 text-slate-400"
                fill="currentColor"
              >
                <path
                  d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z"
                />
              </svg>
              <span>github.com/KhornVictor</span>
            </div>
            <button
              class="p-1 rounded hover:bg-white/10 transition text-slate-400"
            >
              ↻
            </button>
          </div>

          <!-- Bookmarks / Links card -->
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <a
              href="https://github.com/KhornVictor"
              target="_blank"
              rel="noopener noreferrer"
              class="bg-slate-950/60 border border-white/10 hover:border-cyan-400/50 p-4 rounded-xl flex items-center gap-3 transition-all hover:scale-[1.02] cursor-pointer"
            >
              <div
                class="w-10 h-10 rounded-lg bg-zinc-800 flex items-center justify-center text-white font-bold"
              >
                GH
              </div>
              <div>
                <div class="font-bold text-white text-sm">GitHub Profile</div>
                <div class="text-[11px] text-slate-400">
                  Explore Victor's repositories & code
                </div>
              </div>
            </a>

            <a
              href="https://www.linkedin.com/in/khorn-victor-794a6635a"
              target="_blank"
              rel="noopener noreferrer"
              class="bg-slate-950/60 border border-white/10 hover:border-blue-400/50 p-4 rounded-xl flex items-center gap-3 transition-all hover:scale-[1.02] cursor-pointer"
            >
              <div
                class="w-10 h-10 rounded-lg bg-[#0077b5] flex items-center justify-center text-white font-bold"
              >
                IN
              </div>
              <div>
                <div class="font-bold text-white text-sm">LinkedIn</div>
                <div class="text-[11px] text-slate-400">
                  Connect with Khorn Victor professionally
                </div>
              </div>
            </a>
          </div>
        </div>

        <!-- 10. TERMINAL APP -->
        <div
          v-else-if="normalized.includes('terminal')"
          class="space-y-3 font-mono text-xs h-full flex flex-col"
        >
          <div
            class="flex-1 bg-black/95 p-3 rounded-xl border border-white/10 overflow-y-auto space-y-2 min-h-55"
          >
            <div v-for="(log, idx) in terminalHistory" :key="idx">
              <div
                v-if="log.type === 'cmd'"
                class="text-emerald-400 font-bold flex gap-1.5"
              >
                <span class="text-blue-400">victor@ipad-pro:~$</span>
                <span>{{ log.text }}</span>
              </div>
              <pre
                v-else
                class="text-slate-300 whitespace-pre-wrap pl-3 text-[11px] leading-relaxed"
                >{{ log.text }}</pre
              >
            </div>
          </div>

          <div
            class="flex items-center gap-2 bg-slate-950 border border-white/15 rounded-lg px-3 py-1.5"
          >
            <span class="text-emerald-400 font-bold">$</span>
            <input
              v-model="termInput"
              type="text"
              placeholder="Type 'help', 'skills', 'contact'..."
              class="flex-1 bg-transparent text-slate-100 text-xs focus:outline-none"
              @keydown.enter="handleTermSubmit"
            />
          </div>
        </div>

        <!-- 11. NOTES APP -->
        <div v-else-if="normalized.includes('note')" class="space-y-3">
          <div
            class="bg-amber-100/10 border border-amber-300/30 rounded-xl p-4 text-slate-200 text-xs space-y-2"
          >
            <h3 class="font-bold text-amber-300 text-sm">
              Engineering Philosophy & Notes
            </h3>
            <p class="text-slate-300 leading-relaxed">
              "Software engineering isn't just about writing code; it's about
              architecting maintainable, fault-tolerant, and performant
              distributed systems."
            </p>
            <ul class="list-disc list-inside space-y-1 text-slate-300 pt-2">
              <li>
                Strict separation of concerns via modular services & clean
                architecture.
              </li>
              <li>
                Zero-downtime deployment pipelines with Docker and Kubernetes.
              </li>
              <li>
                Sub-millisecond latency caching strategies utilizing Redis.
              </li>
              <li>
                Type-safety from client to database (TypeScript, NestJS,
                Prisma/PostgreSQL).
              </li>
            </ul>
          </div>
        </div>

        <!-- 13. SETTINGS APP -->
        <div
          v-else-if="normalized.includes('setting')"
          class="space-y-4 text-xs"
        >
          <div
            class="bg-slate-950/70 border border-white/10 rounded-xl p-3.5 space-y-3"
          >
            <h4 class="font-bold text-slate-200">Device Specifications</h4>
            <div class="space-y-1.5 text-slate-400 font-mono text-[11px]">
              <div class="flex justify-between">
                <span>Model:</span
                ><span class="text-white">iPad Pro 13-inch (M4)</span>
              </div>
              <div class="flex justify-between">
                <span>Processor:</span
                ><span class="text-white"
                  >Apple M4 (10-Core CPU, 10-Core GPU)</span
                >
              </div>
              <div class="flex justify-between">
                <span>Unified Memory:</span
                ><span class="text-white">16 GB</span>
              </div>
              <div class="flex justify-between">
                <span>Display:</span
                ><span class="text-white">Ultra Retina XDR Tandem OLED</span>
              </div>
              <div class="flex justify-between">
                <span>iPadOS Version:</span><span class="text-white">18.2</span>
              </div>
            </div>
          </div>

          <div
            class="bg-slate-950/70 border border-white/10 rounded-xl p-3.5 space-y-3"
          >
            <div class="flex items-center justify-between">
              <h4 class="font-bold text-slate-200">
                macOS Dynamic Wallpaper (Day / Night)
              </h4>
              <span class="text-[10px] text-cyan-400 font-mono"
                >Real-time Cycle</span
              >
            </div>
            <p class="text-[11px] text-slate-400 leading-relaxed">
              The wallpaper changes scenery automatically according to the time
              of day, matching macOS dynamic landscape behavior.
            </p>
            <div class="grid grid-cols-2 sm:grid-cols-5 gap-2 pt-1">
              <button
                class="px-2 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-[11px] font-mono font-semibold text-white transition flex flex-col items-center gap-1 cursor-pointer"
                @click="$emit('changePhase', 'auto')"
              >
                <span>🕒</span>
                <span>Auto</span>
              </button>
              <button
                class="px-2 py-1.5 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-[11px] font-mono font-semibold text-amber-300 transition flex flex-col items-center gap-1 cursor-pointer"
                @click="$emit('changePhase', 'dawn')"
              >
                <span>🌅</span>
                <span>Dawn</span>
              </button>
              <button
                class="px-2 py-1.5 rounded-lg bg-blue-500/20 hover:bg-blue-500/30 text-[11px] font-mono font-semibold text-blue-300 transition flex flex-col items-center gap-1 cursor-pointer"
                @click="$emit('changePhase', 'day')"
              >
                <span>☀️</span>
                <span>Day</span>
              </button>
              <button
                class="px-2 py-1.5 rounded-lg bg-orange-500/20 hover:bg-orange-500/30 text-[11px] font-mono font-semibold text-orange-300 transition flex flex-col items-center gap-1 cursor-pointer"
                @click="$emit('changePhase', 'sunset')"
              >
                <span>🌇</span>
                <span>Sunset</span>
              </button>
              <button
                class="px-2 py-1.5 rounded-lg bg-indigo-500/20 hover:bg-indigo-500/30 text-[11px] font-mono font-semibold text-indigo-300 transition flex flex-col items-center gap-1 cursor-pointer"
                @click="$emit('changePhase', 'night')"
              >
                <span>🌙</span>
                <span>Night</span>
              </button>
            </div>
          </div>

          <div
            class="bg-slate-950/70 border border-white/10 rounded-xl p-3.5 flex items-center justify-between"
          >
            <div>
              <h4 class="font-bold text-slate-200">Security & Lock Screen</h4>
              <p class="text-[11px] text-slate-400">
                Lock the iPad and return to the Lock Screen
              </p>
            </div>
            <button
              class="px-3.5 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer"
              @click="$emit('lock')"
            >
              <span>🔒</span>
              <span>Lock iPad</span>
            </button>
          </div>
        </div>

        <!-- 14. DYNAMIC / GENERAL SKILL FALLBACK -->
        <div v-else class="space-y-4">
          <div
            class="bg-slate-950/70 border border-white/10 rounded-xl p-4 space-y-3"
          >
            <div class="flex items-center gap-3">
              <SkillIcon :name="skill.name" :icon="skill.icon" :size="42" />
              <div>
                <h3 class="text-base font-bold text-white">{{ skill.name }}</h3>
                <p class="text-xs text-slate-400">
                  Categorized in:
                  {{ skill.tag?.join(", ") || "Full-Stack Technology" }}
                </p>
              </div>
            </div>

            <div class="pt-2 border-t border-white/10 space-y-2 text-xs">
              <div class="flex justify-between text-slate-400">
                <span>Proficiency & Experience:</span>
                <span class="text-emerald-400 font-bold"
                  >Advanced / Production-tested</span
                >
              </div>
              <div class="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                <div
                  class="h-full bg-linear-to-r from-cyan-500 to-emerald-400 rounded-full w-[92%]"
                ></div>
              </div>
            </div>
          </div>

          <div
            class="bg-slate-950/50 border border-white/5 rounded-xl p-3.5 text-xs text-slate-300"
          >
            <div class="font-semibold text-slate-200 mb-1">
              Production Applications:
            </div>
            <p class="leading-relaxed text-slate-400">
              Utilized across multiple full-stack production systems, backend
              microservices, and high-performance client applications.
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.no-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
.no-scrollbar::-webkit-scrollbar {
  display: none;
}
</style>
