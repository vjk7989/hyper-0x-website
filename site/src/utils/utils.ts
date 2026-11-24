import { LOCALE_INFO, type MarketingLocale } from '@utils/locale';

/** Format a date for display in the given marketing locale, e.g. "Sep 20, 2026". */
function formatDate(date: Date, locale: MarketingLocale): string {
  return new Date(date).toLocaleDateString(LOCALE_INFO[locale].intl, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

/** Capitalize the first letter. */
function capitalize(str: string): string {
  if (typeof str !== 'string' || str.length === 0) {
    return str;
  }
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * Slug for a heading's `id`, derived from the heading's own text so the anchor
 * survives a sibling being added or reordered (CLAUDE.md section 9.5). Section 5.4
 * requires every heading to be deep-linkable, and `seo.heading.anchors` checks it.
 */
function headingSlug(text: string): string {
  return String(text)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export { formatDate, capitalize, headingSlug };
