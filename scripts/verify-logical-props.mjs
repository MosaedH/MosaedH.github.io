// RTL audit (NEW_PLAN §2): physical direction utilities are banned — logical
// properties only (ms-/me-/ps-/pe-/start-/end-/text-start/border-s/border-e).
// Scans src/ for Tailwind physical classes and physical CSS properties.
import { readdir, readFile } from 'node:fs/promises';
import { join } from 'node:path';

const ROOT = new URL('../src/', import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1');

// Tailwind physical utilities (with optional variant prefixes like lg: or dark:).
const CLASS_PATTERN =
  /class(?:Name)?=["'{][^"'}]*?(?<![\w-])(?:-?(?:ml|mr|pl|pr|left|right)-|text-left|text-right|border-l(?:-|\b)|border-r(?:-|\b)|rounded-l(?:-|\b)|rounded-r(?:-|\b))/g;
// Physical CSS in style blocks/files.
const CSS_PATTERN =
  /(?<![-\w])(?:margin-left|margin-right|padding-left|padding-right|border-left|border-right|(?<!inset-inline-)(?<!\w-)left|(?<!inset-inline-)(?<!\w-)right)\s*:/g;

async function* walk(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) yield* walk(path);
    else if (/\.(astro|css|html|jsx|tsx|mdx?)$/.test(entry.name)) yield path;
  }
}

let failed = 0;
for await (const file of walk(ROOT)) {
  const text = await readFile(file, 'utf8');
  for (const [lineNo, line] of text.split('\n').entries()) {
    if (CLASS_PATTERN.test(line) || CSS_PATTERN.test(line)) {
      console.error(
        `FAIL ${file}:${lineNo + 1}: physical direction property/class:\n  ${line.trim()}`,
      );
      failed++;
    }
    CLASS_PATTERN.lastIndex = 0;
    CSS_PATTERN.lastIndex = 0;
  }
}

if (failed) {
  console.error(
    `\n${failed} physical-direction violation(s) — use logical properties (ms-/me-/ps-/pe-/start-/end-).`,
  );
  process.exit(1);
}
console.log('Logical-properties audit passed: no physical direction classes in src/.');
