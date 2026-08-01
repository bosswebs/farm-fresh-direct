export const SITE_URL = "https://deacomart.com";

const DEFAULT_OG_IMAGE = "/images/SLIDER6.jpeg";

export function absoluteUrl(path: string): string {
  if (/^https?:\/\//i.test(path)) return path;
  return `${SITE_URL}${path.startsWith("/") ? "" : "/"}${path}`;
}

// data: URIs can never be fetched by link-preview crawlers (WhatsApp, Facebook, etc.) —
// only real http(s) image URLs work, so we fall back to a static branded image instead.
export function socialImageUrl(candidate: string | null | undefined): string {
  if (candidate && /^https?:\/\//i.test(candidate)) return candidate;
  return absoluteUrl(DEFAULT_OG_IMAGE);
}
