/**
 * Shared layout for the Terms and Privacy pages: a readable single column with
 * a title, an "updated" line and consistent heading/paragraph styling. These
 * pages are template documents for a mock storefront — complete and formatted,
 * but not legal advice.
 */
export function LegalShell({
  title,
  updated,
  children,
}: {
  title: string;
  updated: string;
  children: React.ReactNode;
}) {
  return (
    <div className="container-page py-12 lg:py-16">
      <div className="mx-auto max-w-2xl">
        <h1 className="font-display text-3xl font-semibold text-ink sm:text-4xl">{title}</h1>
        <p className="mt-2 text-sm text-ink-subtle">Last updated: {updated}</p>
        <div className="legal-body mt-8 space-y-6 text-ink-muted">{children}</div>
      </div>
    </div>
  );
}

/** A numbered/plain section within a legal document. */
export function LegalSection({ heading, children }: { heading: string; children: React.ReactNode }) {
  return (
    <section className="space-y-2">
      <h2 className="font-display text-lg font-semibold text-ink">{heading}</h2>
      {children}
    </section>
  );
}
