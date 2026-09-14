// Where the portfolio images (avatars, OG cover) are served from.
// Set VITE_IMAGE_BASE to the Supabase Storage public URL of the "Portfolio"
// bucket (files live under Profile/ and Photo/); leave it empty to fall back
// to the local /public/images folder, which mirrors the same layout.
const IMAGE_BASE = (
  import.meta.env.VITE_IMAGE_BASE || `${import.meta.env.BASE_URL}images`
).replace(/\/$/, "");

export function imageUrl(file: string): string {
  return `${IMAGE_BASE}/${file.replace(/^\//, "")}`;
}
