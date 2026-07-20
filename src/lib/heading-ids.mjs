// Arabic → ASCII heading IDs for Sätteri.
//
// STABILITY CONTRACT: shared section links depend on these IDs forever. The
// transliteration table lives in this repo precisely so no dependency update can
// change an ID. Do not "improve" mappings for headings that are already
// published — fix individual slugs with `{ #custom-id }` in the Markdown instead.
// scripts/verify-heading-ids.mjs locks known outputs and runs in CI.

// Simplified journalistic romanization. Vowel-less Arabic cannot round-trip
// perfectly; the goal is readable + deterministic, not phonetically exact.
const ARABIC_MAP = {
  ا: 'a',
  أ: 'a',
  إ: 'i',
  آ: 'a',
  ٱ: 'a',
  ب: 'b',
  ت: 't',
  ث: 'th',
  ج: 'j',
  ح: 'h',
  خ: 'kh',
  د: 'd',
  ذ: 'dh',
  ر: 'r',
  ز: 'z',
  س: 's',
  ش: 'sh',
  ص: 's',
  ض: 'd',
  ط: 't',
  ظ: 'z',
  ع: 'a',
  غ: 'gh',
  ف: 'f',
  ق: 'q',
  ك: 'k',
  ل: 'l',
  م: 'm',
  ن: 'n',
  ه: 'h',
  و: 'w',
  ي: 'y',
  ى: 'a',
  ة: 'a',
  ء: '',
  ئ: 'y',
  ؤ: 'w',
  '٠': '0',
  '١': '1',
  '٢': '2',
  '٣': '3',
  '٤': '4',
  '٥': '5',
  '٦': '6',
  '٧': '7',
  '٨': '8',
  '٩': '9',
  // Persian-variant letters that show up in loanwords
  پ: 'p',
  چ: 'ch',
  ژ: 'zh',
  گ: 'g',
  ک: 'k',
  ی: 'y',
};

// Tashkeel (fathatan…sukun), superscript alef, tatweel: presentation only.
const STRIP = /[ً-ْٰـ]/g;

export function slugifyHeading(text) {
  let out = '';
  for (const ch of text.normalize('NFC').replace(STRIP, '')) {
    if (/[a-zA-Z0-9]/.test(ch)) out += ch;
    else if (ch in ARABIC_MAP) out += ARABIC_MAP[ch];
    else out += ' ';
  }
  const slug = out.trim().toLowerCase().replace(/\s+/g, '-');
  // Never empty: an emoji-only or symbol-only heading still gets an anchor.
  return slug || 'section';
}

// Factory form (fresh closure per document) so the collision counter resets
// between pages. Runs before Astro's built-in heading-ids plugin, which keeps
// pre-existing ids and reports them into `astro.headings` (TOC stays in sync).
export function arabicHeadingIds() {
  const used = new Map();
  const dedupe = (slug) => {
    const n = used.get(slug) ?? 0;
    used.set(slug, n + 1);
    return n === 0 ? slug : `${slug}-${n + 1}`;
  };
  return {
    name: 'arabic-heading-ids',
    element: {
      filter: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'],
      visit(node, ctx) {
        const existing = node.properties?.id;
        if (typeof existing === 'string') {
          // Explicit { #custom-id } always wins; record it so a later generated
          // slug cannot collide with it.
          used.set(existing, (used.get(existing) ?? 0) + 1);
          return;
        }
        ctx.setProperty(node, 'id', dedupe(slugifyHeading(ctx.textContent(node))));
      },
    },
  };
}
