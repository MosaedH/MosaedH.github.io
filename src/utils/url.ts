// The only way absolute URLs are built (RSS, canonical, Open Graph, JSON-LD).
// Centralized so the future custom-domain switch is just the `site` change in
// astro.config.mjs — no link rot anywhere.
export function absoluteUrl(path: string = '/'): string {
  const site = import.meta.env.SITE;
  if (!site) throw new Error('`site` must be set in astro.config.mjs');
  const normalized = path.startsWith('/') ? path : `/${path}`;
  return new URL(normalized, site).href;
}
