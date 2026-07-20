// @ts-check
import { defineConfig, fontProviders } from 'astro/config';
import mdx from '@astrojs/mdx';
import { satteri } from '@astrojs/markdown-satteri';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';
import { arabicHeadingIds } from './src/lib/heading-ids.mjs';

// User site (MosaedH.github.io): served at the domain root, so no `base`.
// When switching to a custom domain later, change `site` below — nothing else.
export default defineConfig({
  site: 'https://mosaedh.github.io',

  // Astro 7 defaults to 'jsx' whitespace stripping, which removes newline-separated
  // spaces between inline elements — verified to eat the space after </time> in RTL
  // meta lines (NEW_PLAN Open Risk #2). `true` keeps the old collapse-to-one-space
  // behavior, which is safe for mixed Arabic/inline-element prose.
  compressHTML: true,

  integrations: [mdx(), sitemap()],

  vite: {
    // Tailwind v4 is wired through its Vite plugin; theme lives in src/styles/global.css.
    plugins: [tailwindcss()],
  },

  markdown: {
    // Same Sätteri pipeline as the default, extended with ASCII heading IDs:
    // Arabic headings are transliterated in-repo (src/lib/heading-ids.mjs) so
    // shared section links are readable and can never drift with a dependency
    // update. `headingAttributes` enables `## heading { #custom-id }` overrides.
    // shikiConfig/gfm/smartypants below still apply — Astro passes them through.
    processor: satteri({
      features: { headingAttributes: true },
      hastPlugins: [arabicHeadingIds],
    }),
    syntaxHighlight: 'shiki',
    shikiConfig: {
      // Dual themes: Shiki inlines colors at build time, so dark mode needs both
      // palettes emitted up front. The switch happens in global.css (.dark rule).
      themes: {
        light: 'github-light',
        dark: 'github-dark',
      },
    },
  },

  fonts: [
    {
      // Downloaded at build time and served from this site's own output — no CDN at runtime.
      provider: fontProviders.fontsource(),
      name: 'IBM Plex Sans Arabic',
      cssVariable: '--font-arabic',
      weights: [400, 500, 600, 700],
      subsets: ['arabic', 'latin'],
      fallbacks: ['Tahoma', 'sans-serif'],
      display: 'swap',
    },
    {
      provider: fontProviders.fontsource(),
      name: 'IBM Plex Mono',
      cssVariable: '--font-plex-mono',
      weights: [400, 600],
      subsets: ['latin'],
      fallbacks: ['monospace'],
      display: 'swap',
    },
  ],
});
