import type { Metadata } from 'next';
import { LegalShell, LegalSection } from '@/components/legal/legal-shell';

export const metadata: Metadata = {
  title: 'Terms & Conditions',
  description: 'The terms and conditions governing your use of Jibambe and any orders you place.',
};

export default function TermsPage() {
  return (
    <LegalShell title="Terms & Conditions" updated="1 July 2026">
      <p>
        These Terms &amp; Conditions govern your use of the Jibambe website and your purchase of
        products through it. By browsing the site or placing an order, you agree to these terms.
        Please read them carefully.
      </p>

      <LegalSection heading="1. Orders and acceptance">
        <p>
          Placing an order constitutes an offer to buy the selected products. An order is accepted
          once you receive an order confirmation. We reserve the right to decline or cancel an order
          — for example where an item is out of stock, incorrectly priced, or where we are unable to
          verify your details — and to refund any amount already paid.
        </p>
      </LegalSection>

      <LegalSection heading="2. Pricing and payment">
        <p>
          All prices are shown in Kenyan Shillings (KSh) and include VAT where applicable. We take
          care to price products accurately, but errors can occur; where a price is clearly
          incorrect we will contact you before dispatch. Payment is due at the time of ordering.
        </p>
      </LegalSection>

      <LegalSection heading="3. Delivery">
        <p>
          We deliver nationwide, typically within 2–4 business days. Delivery is free on orders over
          KSh 50,000; a flat delivery fee applies below that threshold, shown at checkout. Delivery
          timelines are estimates and may vary with location and courier availability.
        </p>
      </LegalSection>

      <LegalSection heading="4. Returns and refunds">
        <p>
          You may return most items within 7 days of delivery, provided they are unused and in their
          original packaging. Certain items — such as opened beauty products — may be excluded for
          hygiene reasons. Approved refunds are processed to the original payment method within a
          reasonable period.
        </p>
      </LegalSection>

      <LegalSection heading="5. Product information">
        <p>
          We aim to describe products and display images as accurately as possible. Minor variations
          in colour or packaging may occur, and specifications are provided by manufacturers and may
          change without notice.
        </p>
      </LegalSection>

      <LegalSection heading="6. Limitation of liability">
        <p>
          To the extent permitted by law, Jibambe is not liable for indirect or consequential loss
          arising from the use of the site or products purchased. Nothing in these terms limits
          liability that cannot be excluded under Kenyan law.
        </p>
      </LegalSection>

      <LegalSection heading="7. Changes to these terms">
        <p>
          We may update these terms from time to time. The version published on this page at the
          time you place an order is the version that applies to that order.
        </p>
      </LegalSection>

      <p className="text-sm text-ink-subtle">
        This document is a general template provided for information and does not constitute legal
        advice.
      </p>
    </LegalShell>
  );
}
