import type { CollectionEntry } from 'astro:content';

// Most shared tags wins; ties broken by newest pubDate; max 3 (NEW_PLAN §4).
export function getRelatedPosts(
  current: CollectionEntry<'blog'>,
  all: CollectionEntry<'blog'>[],
  max = 3,
): CollectionEntry<'blog'>[] {
  return all
    .filter((post) => post.id !== current.id)
    .map((post) => ({
      post,
      shared: post.data.tags.filter((tag) => current.data.tags.includes(tag)).length,
    }))
    .filter(({ shared }) => shared > 0)
    .sort(
      (a, b) =>
        b.shared - a.shared || b.post.data.pubDate.valueOf() - a.post.data.pubDate.valueOf(),
    )
    .slice(0, max)
    .map(({ post }) => post);
}
