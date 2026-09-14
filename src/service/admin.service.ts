// Admin-only API: password login + CRUD on every portfolio section.
// The token is kept in localStorage so a refresh doesn't log the admin out.
import type { Portfolio } from "./portfolio.service";

export type SectionName = keyof Portfolio;
export type WithId<T> = T & { _id: string };

const API_URL = (import.meta.env.VITE_API_URL || "").replace(/\/$/, "");
const TOKEN_KEY = "portfolio.admin.token";

export function getToken(): string | null {
  try {
    return localStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
}

export function setToken(token: string | null) {
  try {
    token ? localStorage.setItem(TOKEN_KEY, token) : localStorage.removeItem(TOKEN_KEY);
  } catch {
    /* storage unavailable — session just won't persist */
  }
}

async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
  const token = getToken();
  const res = await fetch(`${API_URL}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(init.headers || {}),
    },
  });
  if (res.status === 401) setToken(null);
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error || `${init.method || "GET"} ${path} failed (${res.status})`);
  }
  return res.status === 204 ? (undefined as T) : (res.json() as Promise<T>);
}

export async function login(password: string) {
  const { token } = await request<{ token: string; expiresAt: number }>("/api/auth/login", {
    method: "POST",
    body: JSON.stringify({ password }),
  });
  setToken(token);
}

export function logout() {
  setToken(null);
}

export async function checkSession(): Promise<boolean> {
  if (!getToken()) return false;
  return request("/api/auth/me")
    .then(() => true)
    .catch(() => false);
}

export const admin = {
  list: <T>(section: SectionName) => request<T>(`/api/admin/${section}`),
  replaceSingle: <T>(section: SectionName, data: T) =>
    request<WithId<T>>(`/api/admin/${section}`, { method: "PUT", body: JSON.stringify(data) }),
  create: <T>(section: SectionName, data: T) =>
    request<WithId<T>>(`/api/admin/${section}`, { method: "POST", body: JSON.stringify(data) }),
  update: <T>(section: SectionName, id: string, data: T) =>
    request<WithId<T>>(`/api/admin/${section}/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  remove: (section: SectionName, id: string) =>
    request<void>(`/api/admin/${section}/${id}`, { method: "DELETE" }),
};
