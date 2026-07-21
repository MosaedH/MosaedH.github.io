// Central tag registry: ASCII slug (used in frontmatter and URLs) → Arabic display name.
// The content schema validates against these keys, so a typo in frontmatter fails the build
// instead of silently creating a new tag. Add a tag = add one line here.
export const TAGS = {
  policies: 'السياسات والمعايير',
  'risk-management': 'إدارة المخاطر',
  'nca-ecc': 'الضوابط الأساسية للأمن السيبراني (ECC)',
  'iso-27001': 'ISO 27001',
  'rendering-tests': 'اختبارات العرض',
  'test-test': 'اختبارات الاختبارات',
} as const;

export type TagSlug = keyof typeof TAGS;

export function isTag(value: string): value is TagSlug {
  return value in TAGS;
}
