import rss from '@astrojs/rss';
import { SITE_TITLE, SITE_DESCRIPTION } from '../consts';
import { getPublishedPosts } from '../utils/posts';
import { absoluteUrl } from '../utils/url';

export async function GET() {
  const posts = await getPublishedPosts();
  return rss({
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    // absoluteUrl() is the single source of absolute URLs (NEW_PLAN §7) — the
    // rss package does not know about site config on its own.
    site: absoluteUrl('/'),
    items: posts.map((post) => ({
      title: post.data.title,
      description: post.data.description,
      pubDate: post.data.pubDate,
      link: absoluteUrl(`/blog/${post.id}/`),
    })),
    customData: '<language>ar</language>',
  });
}
