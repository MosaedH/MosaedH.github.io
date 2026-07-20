import { READING_WPM } from '../consts';

// Word-count based (Arabic-aware): counts whitespace-separated tokens that contain
// at least one letter or digit, after stripping code and Markdown syntax. Character
// counts under-serve Arabic, whose words are short but information-dense.
export function readingTimeMinutes(markdown: string): number {
  const text = markdown
    .replace(/```[\s\S]*?```/g, ' ') // fenced code blocks
    .replace(/`[^`]*`/g, ' ') // inline code
    .replace(/!?\[([^\]]*)\]\([^)]*\)/g, '$1') // links/images → keep link text
    .replace(/^---[\s\S]*?---/, ' '); // any stray frontmatter
  const words = text.split(/\s+/).filter((token) => /[\p{L}\p{N}]/u.test(token));
  return Math.max(1, Math.round(words.length / READING_WPM));
}
