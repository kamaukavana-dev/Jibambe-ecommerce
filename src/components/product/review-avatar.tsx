import { avatarSpec } from '@/lib/avatar';

/**
 * Generated avatar for a reviewer. Pure inline SVG — deterministic from the
 * name (see lib/avatar), so it renders identically on the server and client
 * with no hydration mismatch and no network request. Decorative only: the
 * name is always shown as adjacent text, so the SVG is aria-hidden.
 */
export function ReviewAvatar({ name, className }: { name: string; className?: string }) {
  const { bg, initials } = avatarSpec(name);
  return (
    <svg viewBox="0 0 40 40" className={className} role="img" aria-hidden="true">
      <rect width="40" height="40" rx="20" fill={bg} />
      {/* Soft translucent blob gives the flat colour an illustrated feel. */}
      <circle cx="31" cy="9" r="15" fill="#ffffff" opacity="0.16" />
      <text
        x="20"
        y="21"
        textAnchor="middle"
        dominantBaseline="central"
        fontSize={initials.length > 1 ? 14 : 17}
        fontWeight="600"
        fill="#ffffff"
        fontFamily="var(--font-sans), system-ui, sans-serif"
      >
        {initials}
      </text>
    </svg>
  );
}
