// Site-wide metadata: the single place to change titles, author, and constants.
export const SITE_TITLE = 'مدونة مساعد';
export const SITE_DESCRIPTION =
  'مدونة تقنية عن حوكمة الأمن السيبراني والمخاطر والالتزام (GRC) في الخليج';
export const AUTHOR = 'Mosaed H';

// Arabic reads slower than English at the same word count.
export const READING_WPM = 140;

// Google Search Console ownership token. Rendered as a meta tag in <head> on
// every page; Google checks the homepage. Safe to be public — it only proves
// ownership, it grants no access.
export const GOOGLE_SITE_VERIFICATION = '1pl2NCWifQj9xTB-NIEYzKabf082VnkMmCGnZL94_H4';

// Analytics: GoatCounter, self-hosted-free and cookieless.
export const ANALYTICS = {
  // Pageview collection endpoint (from the GoatCounter dashboard).
  endpoint: 'https://mos.goatcounter.com/count',

  // Phase 2 switch. While false, visitors see no numbers anywhere and zero
  // count-fetching JS ships — collection still runs. Flip to true once enough
  // data has accumulated to be worth showing.
  showViewCounts: false,

  // Origin of the public counter API that phase 2 reads per-post counts from.
  // Requires "Allow public access to counts" enabled in GoatCounter settings.
  countsOrigin: 'https://mos.goatcounter.com',
} as const;
