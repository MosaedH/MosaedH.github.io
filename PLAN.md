GitHub username: MosaedH

Repository name: blog

Site URL will be: https://mosaedh.github.io/blog

Set `site` and `base` in astro.config.mjs accordingly.

Build a personal technical blog using **Astro**, deployed to **GitHub Pages** via GitHub Actions. Arabic-first, right-to-left, static output only.

## Context

- Author: a Cybersecurity GRC specialist based in Riyadh

- Topics: NCA ECC, SAMA CSF, ISO 27001, PDPL, risk management, security policy writing

- Audience: Arabic-speaking security and compliance practitioners in the Gulf

- Posts are written in Arabic with English technical terms inline — e.g. "نطاق العمل (Scope)"

Work in stages. Show me the plan and any ambiguous decisions before scaffolding, and wait for my confirmation.

## 1. Stack

- Latest stable **Astro**, TypeScript enabled, npm

- **Tailwind CSS**

- `@astrojs/mdx`, `@astrojs/sitemap`, `@astrojs/rss`

- **Content Collections** with a Zod schema

- Fully static output — no backend, no database

- Node version pinned in `.nvmrc`

- Ask before adding any dependency not listed here

## 2. RTL and Arabic typography — the part that usually breaks

- `<html lang="ar" dir="rtl">` in the base layout

- Use Tailwind **logical properties** only: `ms-`, `me-`, `ps-`, `pe-`, `start-`, `end-`, `text-start`, `border-s`, `border-e`. Never `ml-`, `mr-`, `pl-`, `pr-`, `left-`, `right-`. Audit the whole codebase for this before you finish.

- Arabic font: **IBM Plex Sans Arabic**, self-hosted in `public/fonts/`, weights 400/500/600/700, `font-display: swap`. Do not use a CDN.

- Code font: any monospace, self-hosted. Force `dir="ltr"` on every `<pre>`, `<code>`, and terminal block — including code spans inside RTL paragraphs.

- Body line-height minimum 1.8 for Arabic; generous paragraph spacing.

- Mixed Arabic/English sentences must not produce bidi ordering bugs. Test this explicitly.

- Digits: Western (0-9), enforced consistently.

- Tables must render correctly in RTL — column order, borders, alignment, and horizontal scroll on mobile.

## 3. Content model

Posts in `src/content/blog/` as `.md` / `.mdx`. Schema in `src/content/config.ts`:

| Field | Type | Notes |

|---|---|---|

| `title` | string | required |

| `description` | string | required — used for SEO and social cards |

| `pubDate` | date | required |

| `updatedDate` | date | optional |

| `tags` | string[] | required |

| `draft` | boolean | default `false` |

| `slug` | string | **required, ASCII only** — never derived from the Arabic title |

Drafts must be excluded from production builds, the sitemap, and the RSS feed.

Reading time calculated by **word count** (Arabic-aware), not character count.

## 4. Pages

| Route | Content |

|---|---|

| `/` | Short intro + latest 5 posts |

| `/blog` | All posts, newest first |

| `/blog/[slug]` | Post + reading time + table of contents + related posts |

| `/tags` | Tag index with counts |

| `/tags/[tag]` | Posts for that tag |

| `/about` | Placeholder I'll fill in |

| `/rss.xml` | RSS feed |

| `/404` | Custom not-found page |

## 5. Features

- Auto table of contents from headings, sticky on large screens

- Reading progress bar

- Dark mode toggle — respects `prefers-color-scheme`, persists in `localStorage`, **no flash of wrong theme on load**

- Syntax highlighting via Shiki

- Simple client-side search (Fuse.js) across title, description, and tags

- Full SEO: per-page title/description, Open Graph, Twitter cards, canonical URLs

- JSON-LD: `BlogPosting` per post, `Person` for the site

- Auto `sitemap.xml` and `robots.txt`

- Minimal client-side JS overall

## 6. Design

Minimal and text-first — a reading site, not a portfolio.

- Single restrained accent color, defined in one place

- Measure around 65-75 characters, tuned by eye for Arabic

- Mobile-first, fully responsive

- No animation libraries

- Accessibility: semantic HTML, correct heading hierarchy, skip-to-content link, visible focus states, WCAG AA contrast in both themes

## 7. GitHub Pages deployment

This is the part I care most about getting right.

- `.github/workflows/deploy.yml` — build and deploy on push to `main`

- Use the official `actions/configure-pages`, `actions/upload-pages-artifact`, `actions/deploy-pages`

- Set `site` and `base` correctly in `astro.config.mjs` for a **project page** (`username.github.io/repo`) — all internal links, asset paths, and the RSS feed must respect `base`

- I will buy a custom domain later. Make that switch a **one-line change**: include a commented `CNAME` placeholder and document the exact DNS records (A records / CNAME) needed, plus what to change in `astro.config.mjs` and in the repo settings.

- Document how to enable Pages in the repo settings (source = GitHub Actions)

## 8. Quality

- Prettier + ESLint with the Astro plugin

- `npm run dev`, `npm run build`, `npm run preview` all working

- `astro.config.mjs` clean and commented

- Lighthouse target: 95+ on Performance, Accessibility, Best Practices, SEO

- Run the build yourself and fix any errors before telling me you're done

## 9. Seed content

Three real Arabic posts (no Lorem Ipsum) so I can verify rendering. Each should stress different formatting:

1. **الفرق بين Policy و Standard و Procedure** — headings, lists, blockquotes, bold/italic

2. **كيف تحدد نطاق سياسة الأمن السيبراني** — a wide table, heavy inline English terms

3. **تطبيق ضوابط الأمن السيبراني بفريق صغير** — fenced code blocks (bash + yaml), inline code, numbered procedure

## 10. README

In English, covering:

- Running locally

- Adding a new post (copy-paste frontmatter template)

- Adding a tag

- How deployment works

- Switching to a custom domain — exact steps and DNS records

- Where to change the accent color, fonts, and site metadata

## Order of work

1. Plan + confirm

2. Scaffold + base layout

3. **RTL and typography — verify this is correct before moving on**

4. Content collections + schema

5. Pages and routing

6. Features (TOC, dark mode, search, progress bar)

7. SEO + structured data

8. GitHub Actions workflow

9. Seed content

10. README + final build check

Tell me briefly what changed and what to check after each stage.
