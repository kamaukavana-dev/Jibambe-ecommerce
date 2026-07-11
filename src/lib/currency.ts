/**
 * Currency formatting for Kenyan Shillings. All prices in the catalog are
 * integers (whole shillings), so we never render sub-unit precision.
 */

const kshFormatter = new Intl.NumberFormat('en-KE', {
  style: 'currency',
  currency: 'KES',
  currencyDisplay: 'code', // "KES 1,234" — avoids the ambiguous KSh/₧ glyph
  maximumFractionDigits: 0,
});

/** Format a whole-shilling amount, e.g. 145999 -> "KSh 145,999". */
export function formatKsh(amount: number): string {
  // Intl gives "KES 145,999" (a narrow no-break space); we swap the code
  // for the local "KSh" abbreviation and normalise the separator to a plain
  // space so the output is deterministic across ICU versions.
  return kshFormatter
    .format(Math.round(amount))
    .replace('KES', 'KSh')
    .replace(/[  ]/g, ' ');
}

/** Discount percentage from a compare-at price, rounded to a whole number. */
export function discountPercent(price: number, compareAtPrice?: number): number | null {
  if (!compareAtPrice || compareAtPrice <= price) return null;
  return Math.round(((compareAtPrice - price) / compareAtPrice) * 100);
}
