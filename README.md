# mosaedh.github.io — Arabic GRC blog

Personal technical blog: Arabic-first, RTL, fully static. Built with Astro 7, Tailwind CSS v4, and the Sätteri Markdown pipeline; deployed to GitHub Pages via GitHub Actions.

## Running locally

Requires Node ≥ 22.12 (pinned in [`.nvmrc`](.nvmrc); CI uses the same file).

```sh
npm install
npm run dev        # http://localhost:4321 — drafts ARE visible here
npm run build      # production build to dist/ — drafts excluded
npm run preview    # serve the production build locally
```

Verification scripts (all run in CI too):

| Script                            | What it proves                                                                 |
| --------------------------------- | ------------------------------------------------------------------------------ |
| `npm run verify:ids`              | Heading-ID transliteration is stable (golden tests — see below)                |
| `npm run verify:rtl`              | No physical direction classes (`ml-`, `pl-`, `text-left`…) in `src/`           |
| `npm run verify:dist`             | RSS, sitemap, and robots.txt URLs are absolute and on-site (run after a build) |
| `npm run lint` / `npm run format` | ESLint / Prettier                                                              |

## Adding a new post

Create `src/content/blog/<ascii-filename>.md`. **The filename is the URL slug** (`my-post.md` → `/blog/my-post/`) — ASCII only, never the Arabic title.

```markdown
---
title: 'العنوان بالعربية'
description: 'وصف من سطر أو سطرين — يظهر في نتائج البحث وبطاقات المشاركة.'
pubDate: 2026-07-20
tags: ['policies'] # ASCII slugs from src/data/tags.ts — unknown tags fail the build
draft: true # remove (or set false) to publish
---

النص هنا…
```

- `updatedDate: 2026-08-01` (optional) shows an "آخر تحديث" line.
- Drafts (`draft: true`) are visible in `npm run dev`, excluded from production builds, RSS, and the sitemap. To include drafts in a local build for checking: `SHOW_DRAFTS=1 npm run build` (PowerShell: `$env:SHOW_DRAFTS='1'; npm run build`).
- The permanent draft `bidi-rendering-test.md` is a rendering test fixture — re-check it after any font or CSS change, and never publish it.

## Heading IDs and shareable section links

Arabic headings automatically get **readable ASCII anchor IDs** via an in-repo transliteration table ([`src/lib/heading-ids.mjs`](src/lib/heading-ids.mjs)) — e.g. `## حوكمة الأمن السيبراني` → `#hwkma-alamn-alsybrany`. Duplicate headings on a page get `-2`, `-3` suffixes.

**To control the ID of a heading you plan to share, set it manually** with a heading attribute — note the syntax: a space after the opening brace, `#` immediately before the ID, and a space before the closing brace:

```markdown
## ماذا يعني النطاق عمليًا؟ { #scope-definition }
```

That heading's anchor becomes `/blog/cybersecurity-policy-scope/#scope-definition` (this exact example is live in that post). The manual ID always wins over the generated one, and the `{ … }` part never appears in the rendered heading.

**Stability warning:** shared links depend on generated IDs forever. Do not "improve" the transliteration table for already-published headings — `npm run verify:ids` (golden tests in [`scripts/verify-heading-ids.mjs`](scripts/verify-heading-ids.mjs)) fails CI if a known ID would change. Fix individual slugs with `{ #custom-id }` instead.

## Adding a tag

One line in [`src/data/tags.ts`](src/data/tags.ts): ASCII slug (used in frontmatter and in `/tags/<slug>/` URLs) → Arabic display name.

```ts
'incident-response': 'الاستجابة للحوادث',
```

The content schema validates frontmatter tags against this registry, so a typo fails the build instead of silently creating a new tag.

## How deployment works

Push to `main` → [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml) builds and deploys via the official Pages actions (`configure-pages` → `upload-pages-artifact` → `deploy-pages`).

- **One-time setup:** repo **Settings → Pages → Source = "GitHub Actions"** (not "Deploy from a branch").
- The repo must keep the name `MosaedH.github.io` — as a GitHub _user site_ it serves at the domain root with no base path; renaming the repo silently changes the site URL.
- CI runs `verify:ids` before the build and `verify:dist` after it, so a broken feed/sitemap URL fails the deploy instead of shipping.
- No `.nojekyll` file is needed: Actions-based Pages deployments never run Jekyll. Don't add one.
- Fonts are downloaded from Fontsource **at build time** and self-hosted in the output — the deployed site makes no CDN requests.

## Analytics (GoatCounter)

Cookieless pageview collection via [GoatCounter](https://mos.goatcounter.com), configured in the `ANALYTICS` block of [`src/consts.ts`](src/consts.ts).

- The collection script loads `async` and unbundled from `gc.zgo.at`, so it stays off the critical rendering path (verified: Lighthouse performance unchanged at 98).
- **It only loads in production builds.** `npm run dev` and local previews never hit GoatCounter, so local browsing can't pollute real stats.
- No cookies, no consent banner needed.

**Two-phase rollout.** `showViewCounts` is currently **`false`**: data is collected, but visitors see no numbers. While it's false, [`ViewCount.astro`](src/components/ViewCount.astro) renders nothing at all — no markup, no JS, no request.

Phase 2, when the archive has enough traffic to be worth showing:

1. In the GoatCounter dashboard, enable **"Allow public access to counts"** (without this the counter API returns 403 and counts silently never appear).
2. Set `showViewCounts: true` in [`src/consts.ts`](src/consts.ts).

Per-post counts are then fetched client-side from `https://mos.goatcounter.com/counter/<path>.json` and rendered in the post meta line. Failures are silent by design — a dead analytics endpoint must never surface an error mid-article. This path is untested until step 1 is done, since the API returns 403 while counts are private.

## Switching to a custom domain (later)

1. In [`astro.config.mjs`](astro.config.mjs), change `site` to `https://yourdomain.com` — the only code edit; every absolute URL (canonical, OG, RSS, sitemap, robots) flows through it.
2. Repo **Settings → Pages → Custom domain** → enter the domain (GitHub creates the CNAME record association).
3. At your DNS provider:
   - Apex (`yourdomain.com`): four `A` records → `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153` (verify current values against [GitHub's Pages DNS docs](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/managing-a-custom-domain-for-your-github-pages-site) — they can change).
   - `www`: `CNAME` → `mosaedh.github.io`.
4. Back in Settings → Pages: wait for the DNS check, then enable **Enforce HTTPS**.

## Where to change things

| What                                              | Where                                                                                                         |
| ------------------------------------------------- | ------------------------------------------------------------------------------------------------------------- |
| Accent color                                      | `@theme` block in [`src/styles/global.css`](src/styles/global.css) (`--color-accent`, `--color-accent-light`) |
| Fonts (family/weights)                            | `fonts` array in [`astro.config.mjs`](astro.config.mjs)                                                       |
| Site title / description / author / reading speed | [`src/consts.ts`](src/consts.ts)                                                                              |
| Social-share image                                | Replace [`public/og-default.png`](public/og-default.png) (1200×630, keep the name)                            |
| Shiki code themes                                 | `markdown.shikiConfig.themes` in [`astro.config.mjs`](astro.config.mjs)                                       |

## Future: search

Search is deliberately absent (three posts don't need it, and client-side search libraries handle Arabic poorly). When the archive grows past ~15–20 posts, add [Pagefind](https://pagefind.app/): it indexes `dist/` after the build (`npx pagefind --site dist` as a post-build step), lazy-loads only matching index fragments, and handles Arabic segmentation properly. No structural prep is required now.
