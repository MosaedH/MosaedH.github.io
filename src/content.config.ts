import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';
import { isTag, TAGS } from './data/tags';

// URLs come from entry ids, which derive from filenames — so filenames MUST be
// ASCII (e.g. policy-standard-procedure.md), never the Arabic title.
const blog = defineCollection({
  loader: glob({ base: './src/content/blog', pattern: '**/*.{md,mdx}' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    // Cover/thumbnail. A site-absolute path to an image in public/ (e.g.
    // /images/<slug>/cover.jpg), matching how images are referenced in post
    // bodies. Used as the post hero, the list thumbnail, and the OG image.
    image: z.string().startsWith('/').optional(),
    imageAlt: z.string().optional(),
    // Hide the hero image at the top of the post body while still using `image`
    // as the list thumbnail and social/OG card.
    hideHeroImage: z.boolean().default(false),
    tags: z
      .array(
        z.string().refine(isTag, (value) => ({
          message: `Unknown tag "${value}" — add it to src/data/tags.ts (known: ${Object.keys(TAGS).join(', ')})`,
        })),
      )
      .nonempty(),
    draft: z.boolean().default(false),
  }),
});

export const collections = { blog };
