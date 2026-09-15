// Describes every editable portfolio section so the admin page can render
// forms generically. Field `key`s use dot paths for nested objects
// (e.g. "location.city"). Mirrors the Mongoose schemas in ../personal/src/models.
import type { SectionName } from "../../service/admin.service";

export type FieldType = "text" | "number" | "textarea" | "list";

export interface Field {
  key: string;
  label: string;
  type: FieldType;
  required?: boolean;
  hint?: string;
}

export interface SectionDef {
  name: SectionName;
  label: string;
  single: boolean;
  /** Field used as the item title in list sections. */
  titleKey?: string;
  fields: Field[];
}

export const SECTIONS: SectionDef[] = [
  {
    name: "personal",
    label: "Personal",
    single: true,
    fields: [
      { key: "name", label: "Name", type: "text", required: true },
      { key: "label", label: "Title / role", type: "text", required: true },
      { key: "email", label: "Email", type: "text", required: true },
      { key: "phone", label: "Phone", type: "text" },
      { key: "website", label: "Website", type: "text" },
      { key: "summary", label: "Summary", type: "textarea" },
      { key: "location.postalCode", label: "Postal code", type: "text" },
      { key: "location.city", label: "City", type: "text" },
      { key: "location.country", label: "Country", type: "text" },
      { key: "location.continent", label: "Continent", type: "text" },
    ],
  },
  {
    name: "social",
    label: "Social links",
    single: false,
    titleKey: "network",
    fields: [
      { key: "network", label: "Network", type: "text", required: true, hint: "GitHub, LinkedIn, Telegram…" },
      { key: "url", label: "URL", type: "text", required: true },
    ],
  },
  {
    name: "projects",
    label: "Projects",
    single: false,
    titleKey: "title",
    fields: [
      { key: "title", label: "Title", type: "text", required: true },
      { key: "description", label: "Description", type: "textarea" },
      { key: "technologies", label: "Technologies", type: "list" },
      { key: "highlights", label: "Highlights", type: "list" },
      { key: "github_url", label: "GitHub URL", type: "text" },
      { key: "live_url", label: "Live URL", type: "text" },
    ],
  },
  {
    name: "skills",
    label: "Skills",
    single: true,
    fields: [
      { key: "languages", label: "Languages", type: "list" },
      { key: "backend", label: "Backend", type: "list" },
      { key: "database_and_orms", label: "Databases & ORMs", type: "list" },
      { key: "devops_and_tools", label: "DevOps & tools", type: "list" },
    ],
  },
  {
    name: "experiences",
    label: "Experience",
    single: false,
    titleKey: "company",
    fields: [
      { key: "company", label: "Company", type: "text", required: true },
      { key: "position", label: "Position", type: "text", required: true },
      { key: "location", label: "Location", type: "text" },
      { key: "start_date", label: "Start date", type: "text" },
      { key: "end_date", label: "End date", type: "text" },
      { key: "description", label: "Description", type: "textarea" },
      { key: "highlights", label: "Highlights", type: "list" },
    ],
  },
  {
    name: "educations",
    label: "Education",
    single: false,
    titleKey: "institution",
    fields: [
      { key: "institution", label: "Institution", type: "text", required: true },
      { key: "degree", label: "Degree", type: "text", required: true },
      { key: "start_date", label: "Start date", type: "text" },
      { key: "end_date", label: "End date", type: "text" },
      { key: "courses", label: "Courses", type: "list" },
    ],
  },
  {
    name: "certificates",
    label: "Certificates",
    single: false,
    titleKey: "title",
    fields: [
      { key: "title", label: "Title", type: "text", required: true },
      { key: "issuer", label: "Issuer", type: "text" },
      { key: "date", label: "Date", type: "text" },
      { key: "url", label: "URL", type: "text" },
    ],
  },
  {
    name: "interests",
    label: "Interests",
    single: true,
    fields: [
      { key: "academic_and_tech", label: "Academic & tech", type: "list" },
      { key: "recreational", label: "Recreational", type: "list" },
    ],
  },
  {
    name: "languages",
    label: "Languages",
    single: false,
    titleKey: "language",
    fields: [
      { key: "language", label: "Language", type: "text", required: true },
      { key: "fluency", label: "Fluency", type: "text" },
    ],
  },
  {
    name: "services",
    label: "Services",
    single: false,
    titleKey: "title",
    fields: [
      { key: "title", label: "Title", type: "text", required: true },
      { key: "description", label: "Description", type: "textarea" },
      { key: "tags", label: "Tags", type: "list" },
    ],
  },
  {
    name: "music",
    label: "Music",
    single: false,
    titleKey: "title",
    fields: [
      { key: "title", label: "Title", type: "text", required: true },
      { key: "url", label: "YouTube URL", type: "text", required: true, hint: "watch, youtu.be, embed or shorts link" },
      { key: "bpm", label: "Tempo (BPM)", type: "number", hint: "e.g. 92 slow · 128 dance (default 112)" },
      { key: "energy", label: "Energy", type: "number", hint: "0.3 calm · 1 normal · 2 wild (default 1)" },
    ],
  },
];

// ---- dot-path helpers used by the form ----
export type Doc = Record<string, unknown>;

export function getPath(obj: Doc, path: string): unknown {
  return path.split(".").reduce<unknown>((o, k) => (o && typeof o === "object" ? (o as Doc)[k] : undefined), obj);
}

export function setPath(obj: Doc, path: string, value: unknown) {
  const keys = path.split(".");
  let cur: Doc = obj;
  for (const k of keys.slice(0, -1)) {
    if (typeof cur[k] !== "object" || cur[k] === null) cur[k] = {};
    cur = cur[k] as Doc;
  }
  cur[keys[keys.length - 1]!] = value;
}

/** Document -> flat form state (lists become one-item-per-line strings). */
export function toForm(def: SectionDef, doc: Doc | null): Record<string, string> {
  const form: Record<string, string> = {};
  for (const f of def.fields) {
    const v = doc ? getPath(doc, f.key) : undefined;
    form[f.key] = f.type === "list" ? (Array.isArray(v) ? v.join("\n") : "") : v == null ? "" : String(v);
  }
  return form;
}

/** Flat form state -> document ready to send to the API. */
export function fromForm(def: SectionDef, form: Record<string, string>): Doc {
  const doc: Doc = {};
  for (const f of def.fields) {
    const raw = form[f.key] ?? "";
    let value: unknown;
    if (f.type === "list") value = raw.split("\n").map((s) => s.trim()).filter(Boolean);
    else if (f.type === "number") value = raw.trim() === "" ? undefined : Number(raw);
    else value = raw.trim();
    if (value === undefined) continue; // blank number: let the schema default apply
    setPath(doc, f.key, value);
  }
  return doc;
}
