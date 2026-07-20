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
