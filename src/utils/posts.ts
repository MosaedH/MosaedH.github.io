import { getCollection, type CollectionEntry } from 'astro:content';

// Drafts are visible in `astro dev` (so test fixtures like the bidi post can be
// checked) and in a build run with SHOW_DRAFTS=1. Production builds exclude them,
// which also keeps them out of the sitemap since the pages are never generated.
const showDrafts = import.meta.env.DEV || process.env.SHOW_DRAFTS === '1';

// The only sanctioned way to query posts. Raw getCollection('blog') anywhere else
// is a bug: it would bypass the draft filter on one of the five surfaces that
// list posts (home, /blog, tag pages, related posts, RSS).
export async function getPublishedPosts(): Promise<CollectionEntry<'blog'>[]> {
  const posts = await getCollection('blog', ({ data }) => showDrafts || !data.draft);
  return posts.sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf());
}
