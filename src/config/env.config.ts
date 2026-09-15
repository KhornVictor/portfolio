
const raw = import.meta.env;

function url(value: string | undefined): string {
  return (value ?? "").trim().replace(/\/+$/, "");
}

function isAbsoluteUrl(value: string): boolean {
  return /^https?:\/\//i.test(value);
}
const apiUrl = url(raw.VITE_API_URL);

const imageBase = url(raw.VITE_IMAGE_BASE) || url(`${raw.BASE_URL}images`);

export const env = Object.freeze({
  mode: raw.MODE,
  isDev: raw.DEV,
  isProd: raw.PROD,
  baseUrl: raw.BASE_URL,
  apiUrl,
  publicApiUrl: apiUrl || (typeof window !== "undefined" ? window.location.origin : ""),
  imageBase,
});

export type Env = typeof env;

const problems: string[] = [];

if (env.apiUrl && !isAbsoluteUrl(env.apiUrl)) {
  problems.push(`VITE_API_URL must be an absolute http(s) URL, got "${env.apiUrl}"`);
}
if (raw.VITE_IMAGE_BASE && !isAbsoluteUrl(env.imageBase)) {
  problems.push(`VITE_IMAGE_BASE must be an absolute http(s) URL, got "${env.imageBase}"`);
}
if (env.isProd && !env.apiUrl) {
  problems.push("VITE_API_URL is required in production (no dev proxy is available)");
}

if (problems.length) {
  const message = `Invalid environment configuration:\n - ${problems.join("\n - ")}`;
  if (env.isProd) throw new Error(message);
  console.warn(message);
}
