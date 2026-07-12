import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About Us',
  description:
    'Jibambe is a Nairobi-based online store bringing genuine electronics, computing, fashion, home, beauty and fitness products to shoppers across Kenya.',
};

export default function AboutPage() {
  return (
    <div className="container-page py-12 lg:py-16">
      <div className="mx-auto max-w-2xl">
        <p className="text-sm font-semibold uppercase tracking-wide text-accent">Our story</p>
        <h1 className="mt-2 font-display text-3xl font-semibold text-ink sm:text-4xl">
          Shopping in Kenya, done right
        </h1>

        <div className="mt-8 space-y-5 text-ink-muted">
          <p>
            Jibambe started with a simple frustration: finding genuine products online in Kenya was
            harder than it should be. Too often you were left guessing whether what turned up would
            match what was promised — if it turned up at all.
          </p>
          <p>
            We built Jibambe to change that. From our base in Nairobi, we bring electronics,
            computing, fashion, home essentials, beauty and fitness gear together under one roof —
            every item checked, every price shown honestly in Kenyan Shillings, and delivery you can
            count on right across the country.
          </p>

          <h2 className="pt-4 font-display text-xl font-semibold text-ink">What we stand for</h2>
          <ul className="space-y-3">
            <li>
              <span className="font-medium text-ink">Genuine goods.</span> Every product is verified
              authentic before it reaches you. No counterfeits, no surprises.
            </li>
            <li>
              <span className="font-medium text-ink">Fair prices.</span> Clear pricing in KSh with
              VAT included — the number you see is the number you pay.
            </li>
            <li>
              <span className="font-medium text-ink">Reliable delivery.</span> Nationwide shipping in
              2–4 business days, with free delivery on orders over KSh 50,000.
            </li>
            <li>
              <span className="font-medium text-ink">People first.</span> A support team you can
              actually reach, Monday to Saturday.
            </li>
          </ul>

          <p className="pt-4">
            The name says it: <em>jibambe</em> — treat yourself, and do it well. Whether you’re
            upgrading your phone, kitting out a new home or gearing up for the season, we want the
            whole thing to feel effortless, from the first tap to the moment it’s in your hands.
          </p>
          <p className="font-medium text-ink">Karibu Jibambe.</p>
        </div>
      </div>
    </div>
  );
}
