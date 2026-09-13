// Loads the portfolio content from the Express API (see ../../personal).
// Everything is typed so the components get autocomplete + safety.

export interface Personal {
  name: string;
  label: string;
  email: string;
  phone: string;
  website: string;
  summary: string;
  location: { postalCode?: string; city: string; country: string; continent: string };
  profiles: { network: string; url: string }[];
}

export interface Project {
  title: string;
  description: string;
  technologies: string[];
  highlights: string[];
  github_url: string;
  live_url: string;
}

export interface Skills {
  languages: string[];
  backend: string[];
  database_and_orms: string[];
  devops_and_tools: string[];
}

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

export interface Service {
  title: string;
  description: string;
  tags: string[];
}

export interface Portfolio {
  personal: Personal;
  projects: Project[];
  skills: Skills;
  experiences: Experience[];
  educations: Education[];
  certificates: Certificate[];
  interests: Interests;
  languages: Language[];
  services: Service[];
}

// In dev the Vite proxy forwards /api -> http://localhost:5000 (vite.config.ts).
// In production set VITE_API_URL to the deployed backend, e.g. https://api.example.com
const API_URL = (import.meta.env.VITE_API_URL || "").replace(/\/$/, "");

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
