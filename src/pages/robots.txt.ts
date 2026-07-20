import type { APIRoute } from 'astro';
import { absoluteUrl } from '../utils/url';

// Generated (not a static file in public/) so the sitemap URL always follows
// the `site` config — one edit for the future custom-domain switch.
export const GET: APIRoute = () =>
  new Response(
    ['User-agent: *', 'Allow: /', '', `Sitemap: ${absoluteUrl('/sitemap-index.xml')}`, ''].join(
      '\n',
    ),
    { headers: { 'Content-Type': 'text/plain; charset=utf-8' } },
  );
