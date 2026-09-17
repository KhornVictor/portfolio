import type { Portfolio } from "../../service/portfolio.service";
import { interests, owner, skills } from "../../data/portfolio";

export interface DocBlock {
  type: "h1" | "h2" | "p" | "ul" | "kv";
  text?: string;
  items?: string[];
  pairs?: [string, string][];
}

export interface Document {
  title: string;
  blocks: DocBlock[];
}

const h1 = (text: string): DocBlock => ({ type: "h1", text });
const h2 = (text: string): DocBlock => ({ type: "h2", text });
const p = (text: string): DocBlock => ({ type: "p", text });
const ul = (items: string[]): DocBlock => ({ type: "ul", items });
const kv = (pairs: [string, string][]): DocBlock => ({ type: "kv", pairs });

export function buildDocument(payload: string | undefined, pf: Portfolio | null): Document {
  const [kind, arg] = (payload ?? "").split(":");
  const idx = Number(arg);

  switch (kind) {
    case "resume": {
      const blocks: DocBlock[] = [
        h1(pf?.personal.name ?? owner.name),
        p(pf?.personal.label ?? owner.role),
        kv([
          ["Email", pf?.personal.email ?? owner.email],
          ["Website", pf?.personal.website ?? owner.website],
          ["Location", pf ? `${pf.personal.location.city}, ${pf.personal.location.country}` : owner.location],
        ]),
        h2("Summary"),
        p(pf?.personal.summary ?? owner.tagline),
        h2("Skills"),
        ul(
          pf
            ? Array.isArray(pf.skills)
              ? pf.skills.map((s) => s.name)
              : [
                  ...((pf.skills as any).languages || []),
                  ...((pf.skills as any).backend || []),
                  ...((pf.skills as any).database_and_orms || []),
                  ...((pf.skills as any).devops_and_tools || []),
                ]
            : skills,
        ),
      ];
      if (pf?.experiences.length) {
        blocks.push(h2("Experience"));
        pf.experiences.forEach((e) => {
          blocks.push(p(`${e.position} — ${e.company} (${e.start_date} → ${e.end_date})`), ul(e.highlights));
        });
      }
      if (pf?.educations.length) {
        blocks.push(h2("Education"));
        pf.educations.forEach((e) => blocks.push(p(`${e.degree} — ${e.institution} (${e.start_date} → ${e.end_date})`)));
      }
      if (pf?.certificates.length) {
        blocks.push(h2("Certificates"), ul(pf.certificates.map((c) => `${c.title} — ${c.issuer} (${c.date})`)));
      }
      return { title: "Resume.pdf", blocks };
    }

    case "about":
      return {
        title: "README.md",
        blocks: [
          h1(`Hi, I'm ${pf?.personal.name ?? owner.name} 👋`),
          p(pf?.personal.summary ?? owner.tagline),
          h2("What I do"),
          ul(pf?.services.map((s) => `${s.title} — ${s.description}`) ?? interests),
          h2("Interests"),
          ul(interests),
        ],
      };

    case "interests":
      return {
        title: "Interests.txt",
        blocks: [
          h1("Interests"),
          h2("Engineering"),
          ul(interests),
          h2("Academic & Tech"),
          ul(pf?.interests.academic_and_tech ?? []),
          h2("Recreational"),
          ul(pf?.interests.recreational ?? []),
        ],
      };

    case "project": {
      const pr = pf?.projects[idx];
      if (!pr) return { title: "Project", blocks: [p("Loading…")] };
      return {
        title: `${pr.title}.md`,
        blocks: [
          h1(pr.title),
          p(pr.description),
          h2("Highlights"),
          ul(pr.highlights),
          h2("Stack"),
          ul(pr.technologies),
          kv([
            ...(pr.github_url ? ([["GitHub", pr.github_url]] as [string, string][]) : []),
            ...(pr.live_url ? ([["Live", pr.live_url]] as [string, string][]) : []),
          ]),
        ],
      };
    }

    case "experience": {
      const e = pf?.experiences[idx];
      if (!e) return { title: "Experience", blocks: [p("Loading…")] };
      return {
        title: `${e.company}.md`,
        blocks: [
          h1(e.position),
          p(`${e.company} · ${e.location} · ${e.start_date} → ${e.end_date}`),
          p(e.description),
          h2("Highlights"),
          ul(e.highlights),
        ],
      };
    }

    case "education": {
      const e = pf?.educations[idx];
      if (!e) return { title: "Education", blocks: [p("Loading…")] };
      return {
        title: `${e.institution}.md`,
        blocks: [h1(e.degree), p(`${e.institution} · ${e.start_date} → ${e.end_date}`), h2("Courses"), ul(e.courses)],
      };
    }

    case "skills": {
      let groups: Record<string, string[]> = {};
      if (pf && Array.isArray(pf.skills)) {
        for (const item of pf.skills) {
          const tags = item.tag?.length ? item.tag : ["General"];
          for (const t of tags) {
            const key = t.toLowerCase();
            if (!groups[key]) groups[key] = [];
            groups[key].push(item.name);
          }
        }
      } else if (pf && pf.skills) {
        const leg = pf.skills as any;
        groups = {
          languages: leg.languages || [],
          backend: leg.backend || [],
          database: leg.database_and_orms || [],
          devops: leg.devops_and_tools || [],
        };
      } else {
        groups = { all: skills };
      }
      const key = arg && groups[arg] ? arg : Object.keys(groups)[0] || "all";
      return {
        title: `${key}.txt`,
        blocks: [h1(key[0]!.toUpperCase() + key.slice(1)), ul(groups[key] || [])],
      };
    }

    default:
      return {
        title: "Untitled.txt",
        blocks: [h1("Untitled"), p("Nothing to see here — try double-clicking a file in Finder.")],
      };
  }
}
