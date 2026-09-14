// Access links for the private /main page.
// The admin mints a token (default 7 days); visitors open /main?token=...
// The token is verified against the API, then kept in localStorage so the
// visitor can keep browsing /main until it expires without re-pasting the URL.

const API_URL = (import.meta.env.VITE_API_URL || "").replace(/\/$/, "");
const ACCESS_KEY = "portfolio.access.token";
export const TOKEN_PARAM = "token";

export type AccessCheck = { valid: true; expiresAt: number } | { valid: false; reason: "invalid" | "expired" | "missing"; expiresAt?: number };

export function getStoredAccessToken(): string | null {
  try {
    return localStorage.getItem(ACCESS_KEY);
  } catch {
    return null;
  }
}

export function setStoredAccessToken(token: string | null) {
  try {
    token ? localStorage.setItem(ACCESS_KEY, token) : localStorage.removeItem(ACCESS_KEY);
  } catch {
    /* storage unavailable — the visitor just has to keep the tokenised URL */
  }
}

/** Token from `?token=` in the current URL, if any. */
export function tokenFromUrl(): string | null {
  return new URLSearchParams(window.location.search).get(TOKEN_PARAM);
}

/** Drop `?token=` from the address bar so it isn't shared by accident. */
export function stripTokenFromUrl() {
  const url = new URL(window.location.href);
  if (!url.searchParams.has(TOKEN_PARAM)) return;
  url.searchParams.delete(TOKEN_PARAM);
  history.replaceState(history.state, "", url.pathname + url.search + url.hash);
}

export async function verifyAccessToken(token: string): Promise<AccessCheck> {
  const res = await fetch(`${API_URL}/api/auth/access?${TOKEN_PARAM}=${encodeURIComponent(token)}`);
  if (!res.ok) throw new Error(`Access check failed (${res.status})`);
  return res.json();
}

/**
 * Resolve access for the current visit: prefer the token in the URL, then the
 * stored one. A valid token is persisted; an invalid stored one is cleared.
 */
export async function resolveAccess(): Promise<AccessCheck> {
  const fromUrl = tokenFromUrl();
  const token = fromUrl ?? getStoredAccessToken();
  if (!token) return { valid: false, reason: "missing" };

  const check = await verifyAccessToken(token);
  if (check.valid) {
    setStoredAccessToken(token);
    if (fromUrl) stripTokenFromUrl();
  } else if (!fromUrl) {
    setStoredAccessToken(null);
  }
  return check;
}

/** Build the shareable URL for a given token (origin of the current site). */
export function buildAccessUrl(token: string, path = "/main"): string {
  const url = new URL(path, window.location.origin);
  url.searchParams.set(TOKEN_PARAM, token);
  return url.toString();
}
