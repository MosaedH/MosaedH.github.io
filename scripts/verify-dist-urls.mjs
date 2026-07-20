// Post-build URL verification (NEW_PLAN §7): prove the feed and sitemap emit
// correct absolute URLs on every build instead of assuming it. Run after
// `astro build`; exits non-zero on any violation.
import { readFile } from 'node:fs/promises';

const SITE = 'https://mosaedh.github.io/';
let failed = 0;

async function check(file, pattern) {
  let text;
  try {
    text = await readFile(new URL(`../dist/${file}`, import.meta.url), 'utf8');
  } catch {
    console.error(`FAIL: dist/${file} is missing`);
    failed++;
    return;
  }
  const urls = [...text.matchAll(pattern)].map((m) => m[1]);
  if (urls.length === 0) {
    console.error(`FAIL: dist/${file} contains no URLs to check`);
    failed++;
    return;
  }
  for (const url of urls) {
    if (!url.startsWith(SITE)) {
      console.error(`FAIL: dist/${file} has out-of-site URL: ${url}`);
      failed++;
    }
  }
  console.log(`dist/${file}: ${urls.length} URL(s) checked`);
}

await check('rss.xml', /<link>([^<]+)<\/link>/g);
await check('sitemap-index.xml', /<loc>([^<]+)<\/loc>/g);
await check('sitemap-0.xml', /<loc>([^<]+)<\/loc>/g);
await check('robots.txt', /Sitemap: (\S+)/g);

if (failed) {
  console.error(`\n${failed} URL check(s) failed.`);
  process.exit(1);
}
console.log('All dist URL checks passed.');
