import { env } from "../config/env.config";

export interface Personal {
  name: string;
  label: string;
  email: string;
  phone: string;
  website: string;
  summary: string;
  location: { postalCode?: string; city: string; country: string; continent: string };
}

export interface Social {
  network: string;
  url: string;
}

export interface Project {
  title: string;
  description: string;
  technologies: string[];
  highlights: string[];
  github_url: string;
  live_url: string;
}

export interface Skill {
  _id?: string;
  name: string;
  icon: string;
  tag: string[];
  url?: string;
  website?: string;
}

export type Skills = Skill[];

export interface Experience {
  company: string;
  position: string;
  location: string;
  start_date: string;
  end_date: string;
  description: string;
  highlights: string[];
}

export interface Education {
  institution: string;
  degree: string;
  start_date: string;
  end_date: string;
  courses: string[];
}

export interface Certificate {
  title: string;
  issuer: string;
  date: string;
  url: string;
}

export interface Interests {
  academic_and_tech: string[];
  recreational: string[];
}

export interface Language {
  language: string;
  fluency: string;
}

/** A track for the hero music disc; `url` is any YouTube link or video ID. */
export interface Music {
  title: string;
  url: string;
  /** Tempo in BPM (default 112) — the dance follows this. */
  bpm?: number;
  /** Movement intensity, 0.3 = calm … 2 = wild (default 1). */
  energy?: number;
}

/** Uploaded image. `profile` photos cycle in the hero; `gallery` is general. */
export interface Photo {
  url: string;
  path: string;
  kind: "profile" | "gallery";
  caption?: string;
}

export interface Service {
  title: string;
  description: string;
  tags: string[];
}

export interface Portfolio {
  personal: Personal;
  social: Social[];
  projects: Project[];
  skills: Skill[];
  experiences: Experience[];
  educations: Education[];
  certificates: Certificate[];
  interests: Interests;
  languages: Language[];
  services: Service[];
  music: Music[];
  photos: Photo[];
}

// In dev the Vite proxy forwards /api -> http://localhost:5000 (vite.config.ts).
// In production set VITE_API_URL to the deployed backend, e.g. https://api.example.com
const API_URL = env.apiUrl;

async function getJSON<T>(path: string): Promise<T> {
  const res = await fetch(`${API_URL}${path}`);
  if (!res.ok) throw new Error(`Failed to load ${path} (${res.status})`);
  return res.json() as Promise<T>;
}

export function loadPortfolio(): Promise<Portfolio> {
  return getJSON<Portfolio>("/api/portfolio");
}

// Fetch a single section, e.g. getSection("projects")
export function getSection<K extends keyof Portfolio>(section: K): Promise<Portfolio[K]> {
  return getJSON<Portfolio[K]>(`/api/portfolio/${section}`);
}
