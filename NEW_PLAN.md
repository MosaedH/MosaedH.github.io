GitHub username: MosaedH

Repository name: **MosaedH.github.io** _(changed: renamed from `blog` — this makes it a GitHub Pages **user site**, served at the domain root with no `base` path. This eliminates the `/blog/blog/` double path and the entire class of base-path bugs in RSS, sitemap, asset URLs, and the 404 page.)_

Site URL will be: https://mosaedh.github.io

Set `site: "https://mosaedh.github.io"` in astro.config.mjs. Do **not** set `base` — it defaults to `/`. _(changed: user site needs no base)_

## Decisions Required _(new section)_

**None outstanding.** All five original decision points are resolved; recorded here so a fresh engineer knows they are settled, not overlooked:

1. **Repo/URL structure:** user site `MosaedH.github.io` (decided) — no `base`, post URLs are `mosaedh.github.io/blog/post-slug`.
2. **Tags:** central registry `src/data/tags.ts` mapping ASCII slug → Arabic display name (decided). Frontmatter uses ASCII slugs; schema validates against the registry so a typo can't silently fork a tag.
3. **Search:** cut from v1 (decided). Pagefind documented in the README as the future path.
4. **OG image:** one static default (1200×630), no per-post generation (decided).
5. **Reading speed:** **140 wpm** (decided) — Arabic reads slower than English at the same word count.

Build a personal technical blog using **Astro**, deployed to **GitHub Pages** via GitHub Actions. Arabic-first, right-to-left, static output only.

## Context

- Author: a Cybersecurity GRC specialist based in Riyadh
- Topics: NCA ECC, SAMA CSF, ISO 27001, PDPL, risk management, security policy writing
- Audience: Arabic-speaking security and compliance practitioners in the Gulf
- Posts are written in Arabic with English technical terms inline — e.g. "نطاق العمل (Scope)"

Work in stages. Show me the plan and any ambiguous decisions before scaffolding, and wait for my confirmation.

## 1. Stack

- **Astro 7** (latest stable, currently 7.1.x), TypeScript enabled, npm _(changed: pinned the major version — the plan's APIs are version-specific; "latest stable" written against Astro 4/5-era APIs is what caused most of the original plan's rot)_
- **Tailwind CSS v4** via the **`@tailwindcss/vite`** plugin and `@import "tailwindcss"` in `src/styles/global.css` _(changed: the `@astrojs/tailwind` integration is deprecated; v4 has no `tailwind.config.js` — theme customization happens in CSS via `@theme`)_
- `@astrojs/mdx`, `@astrojs/sitemap`; `@astrojs/rss` as a plain dependency used in the feed endpoint _(changed: rss is not an integration and must not be added to `integrations` — it's imported in the endpoint file only)_
- **Markdown pipeline: Astro 7's default (Sätteri) with `syntaxHighlight: 'shiki'`.** Do **not** add `@astrojs/markdown-remark` or any remark/rehype plugin unless a need survives stages 3–6; this plan is written to need none _(changed: Astro 7 replaced remark/rehype as the default processor; the old plugin recipes for reading time and tables no longer apply — see §3 and §2)_
- **Content collections** via the Content Layer API: config in **`src/content.config.ts`** with the built-in `glob()` loader and a Zod schema _(changed: `src/content/config.ts` is the legacy API location, removed in Astro 6)_
- **Fonts: Astro's stable Fonts API** (see §2) _(changed: replaces manual `public/fonts/` self-hosting)_
- Fully static output — no backend, no database
- Node **22 LTS** pinned in `.nvmrc` (use 24 LTS if Astro 7's support matrix allows — verify at implementation); CI reads `node-version-file: .nvmrc` so local and CI can't drift _(changed: Astro 6+ requires Node ≥22.12; an 18/20 pin fails the build)_
- Ask before adding any dependency not listed here

## 2. RTL and Arabic typography — the part that usually breaks

- `<html lang="ar" dir="rtl">` in the base layout
- Use Tailwind **logical properties** only: `ms-`, `me-`, `ps-`, `pe-`, `start-`, `end-`, `text-start`, `border-s`, `border-e`. Never `ml-`, `mr-`, `pl-`, `pr-`, `left-`, `right-`. Audit the whole codebase for this before finishing (grep for the physical-property class prefixes as a scripted check, not just by eye). _(unchanged in substance; all these utilities exist in Tailwind v4 — added the scripted grep so the audit is mechanical)_
- Arabic font: **IBM Plex Sans Arabic**, weights 400/500/600/700, `font-display: swap`, via the **Astro Fonts API** (stable since Astro 6) with the Fontsource provider — Astro downloads the files at build time and serves them from the site's own build output, so nothing is fetched from a CDN at runtime, and it generates preload links plus size-adjusted fallback font metrics automatically (this is what keeps CLS near zero and protects the Lighthouse target). **Verify at implementation time that Fontsource actually ships all four weights of this family — do not assume it**; if any weight is missing, use the fallback in Open Risks. _(changed: replaces hand-managed files in `public/fonts/` — the original plan never said where the files would come from; `public/` files are also unfingerprinted and need hand-written `@font-face` and preloads, each a breakage point)_
- **IBM Plex Sans Arabic has no italic.** Style `<em>` in Arabic prose as weight/color, not synthesized oblique, which browsers render badly for Arabic script. _(new: consequence of the actual font's weight/style inventory)_
- Code font: any monospace with an OFL license (IBM Plex Mono keeps the family consistent), also via the Fonts API. Force LTR on all code: block-level `pre { direction: ltr; text-align: start; }` and inline `code { direction: ltr; unicode-bidi: isolate; }` _(changed: `dir="ltr"` attributes alone don't fix punctuation reordering around inline code inside RTL sentences — `unicode-bidi: isolate` is the load-bearing rule)_
- **Shiki dual themes**: configure `themes: { light, dark }` in the Shiki options plus the one CSS rule that switches them, so code blocks follow the dark-mode toggle. _(new: Shiki inlines colors at build time; without this, dark mode ships light-themed code blocks — the most common dark-mode bug in Astro blogs)_
- Body line-height minimum 1.8 for Arabic; generous paragraph spacing.
- Mixed Arabic/English sentences must not produce bidi ordering bugs. Test this explicitly — seed post 2 (§9) is the test fixture: inline English terms, inline code, parenthesized terms like "(Scope)", and numeric ranges like 2023–2025, verified in rendered output.
- Digits: Western (0-9), enforced consistently.
- Tables must render correctly in RTL — column order, borders, alignment, and horizontal scroll on mobile. Implement the scroll purely in CSS on `table` (block layout + `overflow-x: auto`), not with a Markdown plugin. _(changed: the usual rehype wrapper-div plugin belongs to the removed pipeline; CSS achieves it with zero dependencies)_
- **Heading anchor IDs for Arabic headings must be verified in stage 3**: confirm what Sätteri's native heading-ID generation produces for Arabic text (e.g. "نطاق العمل (Scope)") and that TOC anchor links resolve. If IDs come out empty or Latin-only, decide between explicit `{#custom-id}` heading IDs in content or a small pipeline customization — do not defer this to the TOC stage. _(new: the TOC in §5 silently depends on this working)_

## 3. Content model

Posts in `src/content/blog/` as `.md` / `.mdx`. Collection defined in **`src/content.config.ts`** with the `glob()` loader _(changed: current API — legacy `src/content/config.ts` was removed in Astro 6)_. Schema:

| Field         | Type     | Notes                                                                                                                                    |
| ------------- | -------- | ---------------------------------------------------------------------------------------------------------------------------------------- |
| `title`       | string   | required                                                                                                                                 |
| `description` | string   | required — used for SEO and social cards                                                                                                 |
| `pubDate`     | date     | required                                                                                                                                 |
| `updatedDate` | date     | optional                                                                                                                                 |
| `tags`        | string[] | required — ASCII tag slugs validated against the tag registry `src/data/tags.ts` _(changed: adds validation so a typo can't fork a tag)_ |
| `draft`       | boolean  | default `false`                                                                                                                          |

_(changed: the `slug` schema field is removed. In the current API, entry URLs come from the entry `id`, which derives from the filename; a frontmatter `slug` is a special override consumed by the glob loader, not schema data. The requirement it encoded — ASCII slugs, never derived from the Arabic title — is met by naming the files in ASCII, e.g. `policy-standard-procedure.md`. Enforce that with a filename check at build; no schema field needed.)_

- Rendering an entry uses `render(entry)` imported from `astro:content`; entry access via `entry.id` and `entry.data` _(changed: `entry.render()` and `entry.slug` are legacy API, removed in Astro 6)_
- **Drafts: one `getPublishedPosts()` helper in `src/utils/` wraps `getCollection('blog')` with the draft filter (and pubDate sort). Every consumer — home, /blog, tag pages, related posts, RSS — uses it; raw `getCollection('blog')` is banned outside that file.** The sitemap is covered automatically because draft pages are never generated. _(changed: the original said "excluded from production builds, sitemap, RSS" without a mechanism — five call sites each doing their own filtering is how one surface leaks a draft)_
- Reading time by **Arabic-aware word count** at **140 wpm** _(changed: 140, not a generic English-prose figure — Arabic reads slower at the same word count)_, computed in a plain utility from `entry.body` (the raw Markdown source, available on every glob-loaded entry): strip Markdown/code-fence syntax, split on whitespace, count tokens containing letters. _(changed: the classic remark-plugin recipe belongs to the removed pipeline; computing from `entry.body` needs no plugin at all and works identically under Sätteri)_

## 4. Pages

| Route         | Content                                                                                                                                                                                                                                |
| ------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `/`           | Short intro + latest 5 posts                                                                                                                                                                                                           |
| `/blog`       | All posts, newest first                                                                                                                                                                                                                |
| `/blog/[id]`  | Post + reading time + table of contents + related posts _(changed: `[slug]` → `[id]` to match the current collections API)_                                                                                                            |
| `/tags`       | Tag index with counts                                                                                                                                                                                                                  |
| `/tags/[tag]` | Posts for that tag — `[tag]` is the ASCII slug; page heading shows the Arabic display name _(changed: consequence of the tag registry)_                                                                                                |
| `/about`      | Placeholder I'll fill in                                                                                                                                                                                                               |
| `/rss.xml`    | RSS feed                                                                                                                                                                                                                               |
| `/404`        | Custom not-found page — its asset and nav links must be root-absolute (`/...`), never relative, since GitHub Pages serves it at arbitrary missing paths _(changed: added the constraint; relative links on a 404 break at deep paths)_ |

- Related posts = most shared tags, ties broken by newest `pubDate`, max 3, drafts excluded via the helper. _(new: the original never specified the algorithm)_
- All page URLs get self-referencing canonical URLs via the `absoluteUrl()` helper (§7).

## 5. Features

- Auto table of contents from the `headings` returned by `render(entry)`, sticky on large screens using logical inset properties (depends on the Arabic heading-ID verification in §2)
- Reading progress bar — a few lines of vanilla JS, no library
- Dark mode toggle — respects `prefers-color-scheme`, persists in `localStorage`, no flash of wrong theme on load (inline `is:inline` script in `<head>` that sets the class before first paint). In Tailwind v4 the class strategy is declared with `@custom-variant dark` in CSS — there is no `darkMode` config option anymore. Shiki dual-theme wiring per §2. _(changed: v4 mechanics + the Shiki dependency the original missed)_
- Syntax highlighting via Shiki (Sätteri supports it; Prism is not supported — Shiki is the only option, which is fine as it was the plan anyway)
- _(changed: **client-side search is removed from v1.** Fuse.js contradicted the minimal-JS goal — library + full-content JSON index shipped to every visitor — is pointless at 3 posts where `/blog` and `/tags` are the search, and does no Arabic normalization: no matching across diacritics, alef variants, or ة/ه, so it would feel broken to exactly this audience. Future path when the archive warrants it: **Pagefind** — indexes the built HTML post-build, lazy-loads only matched index fragments, handles Arabic segmentation properly. Listed under Open Risks as a revisit trigger, and in the README as the documented upgrade.)_
- Full SEO: per-page title/description, Open Graph (including `og:locale` = `ar`), Twitter cards, canonical URLs — all absolute URLs via `absoluteUrl()`
- **One static default OG image** (1200×630) used site-wide; per-post generated OG images are explicitly out of scope at this size _(new: the original had social cards but no image)_
- JSON-LD: `BlogPosting` per post, `Person` for the site — all URLs via `absoluteUrl()`
- Auto sitemap via `@astrojs/sitemap` (note: the generated file is **`sitemap-index.xml`**) and a `robots.txt` whose `Sitemap:` line is the full absolute URL: `https://mosaedh.github.io/sitemap-index.xml` _(changed: original said `sitemap.xml`)_
- RSS `<language>` channel element set to `ar` _(new)_
- Minimal client-side JS overall: theme toggle + progress bar + TOC scroll-state only, each vanilla and a few hundred bytes

## 6. Design

Minimal and text-first — a reading site, not a portfolio.

- Single restrained accent color, defined in one place — the `@theme` block in `src/styles/global.css` _(changed: Tailwind v4 has no `tailwind.config.js`; CSS `@theme` is the v4 "one place")_
- Measure around 65-75 characters, tuned by eye for Arabic
- Mobile-first, fully responsive
- No animation libraries
- Accessibility: semantic HTML, correct heading hierarchy, skip-to-content link, visible focus states, WCAG AA contrast in both themes — including the Shiki light and dark theme token colors against their backgrounds _(changed: extended AA check to code blocks, which fail silently otherwise)_

## 7. GitHub Pages deployment

This is the part to get right.

- Repo is **`MosaedH.github.io`** — a GitHub Pages **user site** served at the domain root. No `base` config, no path-prefix handling anywhere. _(changed: repo renamed from `blog`; every base-path workaround the project-site setup required is deleted from this plan)_
- `.github/workflows/deploy.yml` — build and deploy on push to `main`, using the official `actions/configure-pages`, `actions/upload-pages-artifact`, `actions/deploy-pages`; `actions/setup-node` with `node-version-file: .nvmrc` and npm caching
- `site: "https://mosaedh.github.io"` in astro.config.mjs
- **One `absoluteUrl(path)` helper** in `src/utils/`: joins `Astro.site`/`import.meta.env.SITE` + path with slash normalization. It is the only way absolute URLs are constructed — RSS item links, canonical URLs, OG URLs, JSON-LD. _(changed from the original plan: kept even though the base problem is gone — it centralizes absolute-URL construction so the custom-domain switch later is a single config edit with no link rot, and it keeps the four absolute-URL consumers from drifting apart)_
- Internal links use plain root-absolute paths (`/blog/…`, `/tags/…`) — valid now and after the custom-domain switch _(changed: the `BASE_URL`/`link()` helper machinery from the project-site version is no longer needed)_
- **Post-build verification step (scripted, run in CI after build):** grep `dist/rss.xml` and `dist/sitemap-index.xml` and confirm every URL starts with `https://mosaedh.github.io/`. _(new: proves the feed and sitemap emit correct absolute URLs on every build instead of assuming it)_
- No `.nojekyll` needed: deployments via the Pages artifact actions never run Jekyll. Documented in the README so nobody adds it as cargo cult. _(new)_
- Custom domain later: an honestly-scoped **documented 5-minute switch**, not "one line" _(changed: it is never literally one line)_ — README documents exactly: change `site` to the domain in astro.config.mjs (the only code edit, since all absolute URLs flow through `absoluteUrl()`); add the custom domain in repo Settings → Pages; DNS records (4 × A records for apex to GitHub Pages IPs + `www` CNAME to `mosaedh.github.io`, exact values in README); enforce HTTPS once the cert issues.
- Document how to enable Pages in the repo settings (source = GitHub Actions)

## 8. Quality

- Prettier with `prettier-plugin-astro`; **ESLint 9 flat config** (`eslint.config.js`) with `eslint-plugin-astro` _(changed: pinned to the flat-config world so the tooling matches current majors)_
- `npm run dev`, `npm run build`, `npm run preview` all working — final checks (Lighthouse, URL verification) run against **`npm run preview`**, the production build, not the dev server _(changed: base-specific preview caveat dropped with the base itself)_
- The logical-properties audit (§2) and the URL verification grep (§7) run as scripted checks before "done"
- `astro.config.mjs` clean and commented
- Lighthouse target: 95+ on Performance, Accessibility, Best Practices, SEO — measured against the **preview build**, both themes
- Note for seed content and layouts: Astro 7's Rust compiler is strict — all non-void HTML elements need closing tags; hand-written HTML in MDX that the old compiler silently fixed now fails the build _(new)_
- Run the build yourself and fix any errors before reporting done

## 9. Seed content

Three real Arabic posts (no Lorem Ipsum) so rendering can be verified. Each stresses different formatting:

1. **الفرق بين Policy و Standard و Procedure** — headings, lists, blockquotes, bold/italic (italic here doubles as the test for the no-italic `<em>` styling from §2)
2. **كيف تحدد نطاق سياسة الأمن السيبراني** — a wide table (the RTL + mobile-scroll test), heavy inline English terms, parenthesized terms like "(Scope)", numeric ranges — this is the designated bidi test fixture from §2
3. **تطبيق ضوابط الأمن السيبراني بفريق صغير** — fenced code blocks (bash + yaml — tests Shiki dual themes and LTR blocks), inline code inside Arabic sentences (tests `unicode-bidi: isolate`), numbered procedure

ASCII filenames (these are the URLs): `policy-standard-procedure.md`, `cybersecurity-policy-scope.md`, `implementing-controls-small-team.md` _(changed: filenames are now load-bearing — they replace the removed `slug` field)_

## 10. README

In English, covering:

- Running locally (including required Node version / `.nvmrc`)
- Adding a new post — copy-paste frontmatter template, **plus the rule that the filename is the URL slug and must be ASCII** _(changed: consequence of the slug-field removal)_
- Adding a tag — one entry in the tag registry (ASCII slug + Arabic display name) _(changed: consequence of the tag registry)_
- How deployment works — including why there's no `.nojekyll`, why the repo must keep the `MosaedH.github.io` name for the user site, and how the post-build URL checks work _(changed: added the repo-name constraint — renaming the repo silently changes the site URL)_
- Switching to a custom domain — exact steps, exact DNS records, exact config edits (per §7)
- Where to change the accent color (`@theme` in `global.css`), fonts (Fonts API config in `astro.config.mjs`), and site metadata (one `src/consts.ts`) _(changed: locations updated to the v4/Fonts-API world; added a single metadata constants file so "site title/description/author" has one home)_
- Future search: how to add Pagefind when the archive grows _(new)_

## Order of work

1. Plan + confirm (this file; Decisions Required answered)
2. Scaffold + base layout (config, fonts, Tailwind v4 wiring, `consts.ts`, helpers: `absoluteUrl`, `getPublishedPosts`) _(changed: helpers exist before anything consumes them, so no absolute URL or post query is ever hand-rolled in a page)_
3. **RTL and typography — verify before moving on**, including the Arabic heading-ID check and the bidi/inline-code rendering test _(changed: heading-ID verification pulled forward from the TOC stage, where discovering it fails would force rework)_
4. Content collections + schema (+ tag registry)
5. Pages and routing
6. Features (TOC, dark mode incl. Shiki dual theme, progress bar) _(changed: search removed)_
7. SEO + structured data (all through `absoluteUrl()`)
8. GitHub Actions workflow + post-build URL verification script (RSS/sitemap absolute URLs)
9. Seed content
10. README + final build check (scripted audits + Lighthouse on preview)

Tell me briefly what changed and what to check after each stage.

## Open Risks _(new section)_

1. **Sätteri heading-ID generation for Arabic.** Unverified until stage 3. If Arabic headings produce empty/Latin-only IDs, fallback is explicit `{#id}` syntax in content (low effort, slightly more authoring friction) or a pipeline customization (more moving parts). Checked at stage 3 by design.
2. **Astro 7 whitespace stripping (`compressHTML: 'jsx'` default).** JSX-style whitespace collapsing could eat spaces between Arabic text and adjacent inline elements (`<code>`, links). Test with seed posts 2–3; escape hatch is `compressHTML: true` (old behavior) in config.
3. **Sätteri + MDX maturity.** The native pipeline is one major version old. If an MDX edge case in the seed posts misrenders, the documented fallback is `@astrojs/markdown-remark` (restores the unified pipeline at the cost of build speed) — a config change, not a rewrite.
4. **Fonts API + Fontsource availability of IBM Plex Sans Arabic.** Do not assume Fontsource ships all four weights (400/500/600/700) — verify at implementation time, before any layout work depends on them. If a weight is missing or Arabic subsetting is poor, fallback is the local-files provider of the same Fonts API with files from the IBM Plex GitHub releases (OFL) — same config surface, manual download step.
5. **GitHub Pages IP/DNS drift.** The A-record IPs documented for the custom-domain switch can change; README links the authoritative GitHub docs page rather than treating the hardcoded values as permanent.
6. **Search demand.** If the archive grows past ~15–20 posts, revisit Pagefind (§5). No structural prep needed now — it indexes built HTML.
7. **Repo rename side effects.** Renaming `blog` → `MosaedH.github.io` must happen before Pages is first enabled; any existing clones/remotes need their URLs updated, and the site URL is coupled to the repo name until a custom domain takes over. One-time, but easy to trip on. _(replaces the former sitemap-under-`base` risk, which no longer exists on a user site)_
