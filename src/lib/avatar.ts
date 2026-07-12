/**
 * Deterministic, fully offline avatar generation for reviewer names. No runtime
 * API call (DiceBear or otherwise) — that would reintroduce the external runtime
 * dependency this project deliberately avoids. Instead a name is hashed to a
 * fixed palette entry, so the same reviewer always renders the same avatar
 * everywhere on the site. Backgrounds are all >= 4.5:1 against white text, so
 * the initials meet WCAG AA regardless of which colour a name lands on.
 */

/** Saturated, sufficiently-dark backgrounds — every one passes AA with #fff. */
const PALETTE = [
  '#0f766e', // teal-700
  '#b45309', // amber-700
  '#9f1239', // rose-800
  '#4338ca', // indigo-700
  '#15803d', // green-700
  '#7c3aed', // violet-600
  '#0369a1', // sky-700
  '#a21caf', // fuchsia-700
  '#c2410c', // orange-700
  '#1d4ed8', // blue-700
] as const;

/** Small, stable string hash (djb2-ish). Same input → same number, always. */
function hashName(name: string): number {
  let h = 0;
  for (let i = 0; i < name.length; i++) {
    h = (h << 5) - h + name.charCodeAt(i);
    h |= 0; // force 32-bit
  }
  return Math.abs(h);
}

/** One or two initials from a display name. */
export function avatarInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return '?';
  const first = parts[0] ?? '';
  const last = parts.length > 1 ? (parts[parts.length - 1] ?? '') : '';
  return (first.charAt(0) + last.charAt(0)).toUpperCase();
}

export interface AvatarSpec {
  /** Background fill (AA-safe with white text). */
  bg: string;
  initials: string;
}

export function avatarSpec(name: string): AvatarSpec {
  const bg = PALETTE[hashName(name) % PALETTE.length] ?? PALETTE[0];
  return { bg, initials: avatarInitials(name) };
}
