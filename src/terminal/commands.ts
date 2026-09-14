// Terminal command parser + registry. Pure TypeScript: no DOM, no Vue.
// The UI hands us the raw input string and paints whatever we return.

import type { Portfolio } from "../service/portfolio.service";
import type { CommandResult, Segment, TerminalLine, Tone } from "./types";

export const PROMPT_USER = "khorn";
export const PROMPT_HOST = "portfolio";
export const PROMPT_CWD = "~";

/* ---------- tiny line builders ---------- */
const s = (text: string, tone?: Tone, href?: string): Segment => ({
  text,
  tone,
  href,
});
const line = (...segments: Segment[]): TerminalLine => ({
  kind: "text",
  segments,
});
const plain = (text: string, tone: Tone = "default"): TerminalLine =>
  line(s(text, tone));
const blank = (): TerminalLine => ({ kind: "blank" });
const heading = (text: string): TerminalLine => line(s(text, "heading"));
const list = (items: string[], indent = "  "): TerminalLine[] =>
  items.map((i) => line(s(indent), s("•", "muted"), s(" " + i, "value")));
const pad = (text: string, width: number) => text.padEnd(width, " ");

/** Formats a `label   value` row, optionally as a link. */
function row(
  label: string,
  value: string,
  href?: string,
  width = 12,
): TerminalLine {
  return line(
    s(pad(label, width), "label"),
    s(value, href ? "link" : "value", href),
  );
}

/** Soft word-wrap so long paragraphs stay readable in the terminal. */
function wrap(text: string, width: number): string[] {
  const out: string[] = [];
  let cur = "";
  for (const word of text.split(/\s+/)) {
    if ((cur + " " + word).trim().length > width) {
      out.push(cur.trim());
      cur = word;
    } else cur += " " + word;
  }
  if (cur.trim()) out.push(cur.trim());
  return out;
}

/* ---------- command registry ---------- */
export interface CommandContext {
  portfolio: Portfolio | null;
  history: string[];
  /** Host hook (e.g. the macOS desktop) that can launch an app by name. */
  openApp?: (name: string) => boolean;
}

interface CommandDef {
  description: string;
  /** Hidden commands still run but are left out of `help`. */
  hidden?: boolean;
  run: (ctx: CommandContext, args: string[]) => CommandResult;
}

const notLoaded: CommandResult = {
  lines: [
    plain("Portfolio data is still loading — try again in a moment.", "warn"),
  ],
};

const fastfetch: CommandDef = {
  description: "Display system information",
  run: () => ({ lines: [{ kind: "fastfetch" }] }),
};

const commands: Record<string, CommandDef> = {
  help: {
    description: "Show this list of commands",
    run: () => ({
      lines: [
        heading("Available commands:"),
        ...Object.entries(commands)
          .filter(([, c]) => !c.hidden)
          .map(([name, c]) =>
            line(s("  " + pad(name, 12), "cmd"), s(c.description, "muted")),
          ),
        blank(),
        line(
          s("Tip: ", "muted"),
          s("↑/↓", "accent"),
          s(" cycles history, ", "muted"),
          s("Ctrl+L", "accent"),
          s(" clears the screen.", "muted"),
        ),
      ],
    }),
  },

  about: {
    description: "Learn more about me",
    run: ({ portfolio }) => {
      if (!portfolio) return notLoaded;
      const p = portfolio.personal;
      return {
        lines: [
          heading(`${p.name} — ${p.label}`),
          blank(),
          ...wrap(p.summary, 72).map((t) => plain(t)),
          blank(),
          row("Location", `${p.location.city}, ${p.location.country}`),
          row("Website", p.website, p.website),
          row("Email", p.email, `mailto:${p.email}`),
        ],
      };
    },
  },

  skills: {
    description: "Display technical skills",
    run: ({ portfolio }) => {
      if (!portfolio) return notLoaded;
      const k = portfolio.skills;
      return {
        lines: [
          heading("Languages:"),
          ...list(k.languages),
          blank(),
          heading("Backend:"),
          ...list(k.backend),
          blank(),
          heading("Database & ORMs:"),
          ...list(k.database_and_orms),
          blank(),
          heading("DevOps & Tools:"),
          ...list(k.devops_and_tools),
        ],
      };
    },
  },

  projects: {
    description: "View my projects",
    run: ({ portfolio }) => {
      if (!portfolio) return notLoaded;
      const lines: TerminalLine[] = [];
      portfolio.projects.forEach((pr, i) => {
        if (i) lines.push(blank());
        lines.push(line(s(`${i + 1}. `, "muted"), s(pr.title, "heading")));
        wrap(pr.description, 70).forEach((t) => lines.push(plain("   " + t)));
        lines.push(
          line(s("   stack  ", "label"), s(pr.technologies.join(", "), "purple")),
        );
        if (pr.github_url)
          lines.push(
            line(s("   github ", "label"), s(pr.github_url, "link", pr.github_url)),
          );
        if (pr.live_url)
          lines.push(
            line(s("   live   ", "label"), s(pr.live_url, "link", pr.live_url)),
          );
      });
      return { lines };
    },
  },

  experience: {
    description: "Show my experience",
    run: ({ portfolio }) => {
      if (!portfolio) return notLoaded;
      const lines: TerminalLine[] = [];
      portfolio.experiences.forEach((e, i) => {
        if (i) lines.push(blank());
        lines.push(
          line(s(e.position, "heading"), s(" @ ", "muted"), s(e.company, "accent")),
        );
        lines.push(
          line(
            s(`${e.start_date} → ${e.end_date}`, "muted"),
            s("  ·  ", "muted"),
            s(e.location, "muted"),
          ),
        );
        wrap(e.description, 70).forEach((t) => lines.push(plain(t)));
        e.highlights.forEach((h) =>
          wrap(h, 66).forEach((t, j) =>
            lines.push(line(s(j ? "    " : "  - ", "muted"), s(t, "value"))),
          ),
        );
      });
      if (portfolio.educations.length) {
        lines.push(blank(), heading("Education:"));
        portfolio.educations.forEach((ed) =>
          lines.push(
            line(
              s("  " + ed.degree, "value"),
              s(" — ", "muted"),
              s(ed.institution, "accent"),
              s(`  (${ed.start_date} → ${ed.end_date})`, "muted"),
            ),
          ),
        );
      }
      return { lines };
    },
  },

  contact: {
    description: "Show contact information",
    run: ({ portfolio }) => {
      if (!portfolio) return notLoaded;
      const p = portfolio.personal;
      return {
        lines: [
          heading("Let's build something together."),
          blank(),
          row("Email", p.email, `mailto:${p.email}`),
          row("Phone", p.phone, `tel:${p.phone.replace(/\s+/g, "")}`),
          row("Website", p.website, p.website),
          row("Location", `${p.location.city}, ${p.location.country}`),
        ],
      };
    },
  },

  social: {
    description: "Display social links",
    run: ({ portfolio }) => {
      if (!portfolio) return notLoaded;
      return {
        lines: portfolio.social
          .filter((pr) => !pr.url.startsWith("/"))
          .map((pr) => row(pr.network, pr.url, pr.url)),
      };
    },
  },

  fastfetch,
  neofetch: { ...fastfetch, description: "Alias of fastfetch", hidden: true },

  ls: {
    description: "List available sections",
    run: () => ({
      lines: [
        line(
          ...["about", "skills", "projects", "experience", "contact", "social"].flatMap(
            (d) => [s(d + "/", "cmd"), s("  ")],
          ),
          s("README.md", "value"),
        ),
      ],
    }),
  },

  pwd: {
    description: "Show current directory",
    run: () => ({ lines: [plain(`/home/${PROMPT_USER}/${PROMPT_HOST}`)] }),
  },
  whoami: {
    description: "Print the current user",
    run: () => ({ lines: [plain(PROMPT_USER)] }),
  },
  date: {
    description: "Print the current date",
    run: () => ({ lines: [plain(new Date().toString())] }),
  },
  echo: {
    description: "Echo arguments",
    hidden: true,
    run: (_, args) => ({ lines: [plain(args.join(" "))] }),
  },
  history: {
    description: "Show command history",
    hidden: true,
    run: ({ history }) => ({
      lines: history.length
        ? history.map((h, i) =>
            line(s(String(i + 1).padStart(4) + "  ", "muted"), s(h, "cmd")),
          )
        : [plain("No history yet.", "muted")],
    }),
  },
  cat: {
    description: "Read a file",
    hidden: true,
    run: (ctx, args) => {
      if (/readme/i.test(args[0] ?? "")) return commands.about!.run(ctx, []);
      return {
        lines: [
          line(
            s("cat: ", "error"),
            s(`${args[0] ?? ""}: No such file or directory`, "error"),
          ),
        ],
      };
    },
  },
  open: {
    description: "Open an app, e.g. `open finder`",
    run: ({ openApp }, args) => {
      const target = args[0]?.toLowerCase();
      if (!target)
        return { lines: [plain("usage: open <finder|safari|notes|mail|settings|calendar|activity|photos>", "muted")] };
      if (!openApp)
        return { lines: [plain("open: no desktop session — visit /macos to launch apps.", "error")] };
      return openApp(target)
        ? { lines: [line(s("Opening ", "muted"), s(target, "accent"), s("…", "muted"))] }
        : { lines: [line(s("open: ", "error"), s(`unable to find application named '${target}'`, "error"))] };
    },
  },
  clear: {
    description: "Clear terminal",
    run: () => ({ lines: [], action: { type: "clear" } }),
  },
  home: {
    description: "Go back to the main portfolio",
    run: () => ({
      lines: [plain("Leaving terminal…", "muted")],
      action: { type: "navigate", to: "/" },
    }),
  },
  exit: {
    description: "Alias of home",
    hidden: true,
    run: (ctx) => commands.home!.run(ctx, []),
  },
  sudo: {
    description: "Try it",
    hidden: true,
    run: () => ({
      lines: [
        plain(
          `${PROMPT_USER} is not in the sudoers file. This incident will be reported.`,
          "error",
        ),
      ],
    }),
  },
};

/** Section commands that also map to routes; only navigated to if the route exists. */
const routeFor: Record<string, string> = {
  about: "/about",
  projects: "/projects",
  contact: "/contact",
};
const existingRoutes = new Set<string>(["/", "/terminal", "/macos"]);

/* ---------- public API ---------- */
export function commandNames(): string[] {
  return Object.keys(commands).filter((n) => !commands[n]!.hidden);
}

export function runCommand(input: string, ctx: CommandContext): CommandResult {
  const [rawName = "", ...args] = input.trim().split(/\s+/);
  if (!rawName) return { lines: [] };

  const name = rawName.toLowerCase();
  const cmd = commands[name];
  if (!cmd) {
    return {
      lines: [
        line(s("command not found: ", "error"), s(rawName, "error")),
        line(
          s("Type ", "muted"),
          s('"help"', "cmd"),
          s(" to see available commands.", "muted"),
        ),
      ],
    };
  }

  // Route exists → navigate instead of dumping the content in the terminal.
  const route = routeFor[name];
  if (route && existingRoutes.has(route)) {
    return { lines: [], action: { type: "navigate", to: route } };
  }
  return cmd.run(ctx, args);
}
