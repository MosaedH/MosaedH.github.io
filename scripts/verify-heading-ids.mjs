// Golden tests for heading-ID stability (NEW_PLAN: shared links must never
// silently change). Run via `npm run verify:ids` — CI runs it before the build.
// If this fails after a change, published anchors WILL break: revert the change
// or consciously accept the breakage and update these expectations.
import { slugifyHeading } from '../src/lib/heading-ids.mjs';

const GOLDEN = [
  ['نطاق العمل (Scope)', 'ntaq-alaml-scope'],
  ['حوكمة الأمن السيبراني', 'hwkma-alamn-alsybrany'],
  ['الفرق بين Policy و Standard و Procedure', 'alfrq-byn-policy-w-standard-w-procedure'],
  ['معيار ISO/IEC 27001:2022', 'mayar-iso-iec-27001-2022'],
  ['إدارة المخاطر: الخطوات الأولى', 'idara-almkhatr-alkhtwat-alawla'],
  ['ضوابط ECC-2:2024', 'dwabt-ecc-2-2024'],
  ['اختبارات إضافية', 'akhtbarat-idafya'],
  ['Plain English Heading', 'plain-english-heading'],
  ['؟!٪', 'section'], // symbols-only must not produce an empty id
  ['أرقام عربية ١٢٣', 'arqam-arbya-123'],
];

let failed = 0;
for (const [input, expected] of GOLDEN) {
  const actual = slugifyHeading(input);
  if (actual !== expected) {
    failed++;
    console.error(`FAIL: ${JSON.stringify(input)}\n  expected: ${expected}\n  actual:   ${actual}`);
  }
}

if (failed) {
  console.error(`\n${failed} heading-ID golden test(s) failed — published anchors would change.`);
  process.exit(1);
}
console.log(`heading-ID golden tests: ${GOLDEN.length} passed.`);
