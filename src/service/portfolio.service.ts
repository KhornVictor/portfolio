// Loads the portfolio content from the static JSON files in /public/data.
// Everything is typed so the components get autocomplete + safety.

export interface Personal {
  name: string;
  label: string;
  email: string;
  phone: string;
  website: string;
  summary: string;
  location: { city: string; country: string };
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

const base = import.meta.env.BASE_URL || "/";

async function getJSON<T>(file: string): Promise<T> {
  const res = await fetch(`${base}data/${file}`);
  if (!res.ok) throw new Error(`Failed to load ${file} (${res.status})`);
  return res.json() as Promise<T>;
}

export async function loadPortfolio(): Promise<Portfolio> {
  const [
    personal,
    projects,
    skills,
    experiences,
    educations,
    certificates,
    interests,
    languages,
    services
  ] = await Promise.all([
    getJSON<Personal>("personal.json"),
    getJSON<Project[]>("projects.json"),
    getJSON<Skills>("skills.json"),
    getJSON<Experience[]>("experiences.json"),
    getJSON<Education[]>("educations.json"),
    getJSON<Certificate[]>("certificates.json"),
    getJSON<Interests>("interests.json"),
    getJSON<Language[]>("languages.json"),
    getJSON<Service[]>("services.json")
  ]);

  return {
    personal,
    projects,
    skills,
    experiences,
    educations,
    certificates,
    interests,
    languages,
    services
  };
}
