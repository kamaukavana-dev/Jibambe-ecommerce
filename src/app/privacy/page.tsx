import type { Metadata } from 'next';
import { LegalShell, LegalSection } from '@/components/legal/legal-shell';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description:
    'How Jibambe handles the information you share with us, including cookies and browser storage.',
};

export default function PrivacyPage() {
  return (
    <LegalShell title="Privacy Policy" updated="1 July 2026">
      <p>
        This Privacy Policy explains what information Jibambe collects when you use our website, how
        we use it, and the choices you have. We keep this deliberately plain.
      </p>

      <LegalSection heading="1. Information we collect">
        <p>
          When you place an order or contact us, we collect the details you provide — such as your
          name, delivery address, phone number and email. We do not ask for more than we need to
          fulfil your order and support you.
        </p>
      </LegalSection>

      <LegalSection heading="2. Cookies and browser storage">
        <p>
          This site uses your browser’s local storage to remember your cart and wishlist between
          visits, and session storage to hold your progress while you check out. This information
          stays on your device, is not shared with third parties, and you can clear it at any time
          through your browser settings. Clearing it will empty your saved cart and wishlist.
        </p>
      </LegalSection>

      <LegalSection heading="3. How we use your information">
        <p>
          We use the information you provide to process and deliver your orders, respond to your
          enquiries, and keep you updated about your purchases. We do not sell your personal
          information.
        </p>
      </LegalSection>

      <LegalSection heading="4. Payment information">
        <p>
          We do not process or store payment card details on this site. Any payment information you
          enter is used only to complete the transaction and is not retained by us.
        </p>
      </LegalSection>

      <LegalSection heading="5. Data retention">
        <p>
          We keep order-related information only for as long as necessary to provide our service and
          meet our record-keeping obligations, after which it is removed or anonymised.
        </p>
      </LegalSection>

      <LegalSection heading="6. Your choices">
        <p>
          You can ask us what information we hold about you, request a correction, or ask us to
          delete it. To make a request or ask a privacy question, contact us at{' '}
          <a
            href="mailto:kamaukavana@gmail.com"
            className="font-medium text-accent underline-offset-2 hover:underline"
          >
            kamaukavana@gmail.com
          </a>
          .
        </p>
      </LegalSection>

      <p className="text-sm text-ink-subtle">
        This document is a general template provided for information and does not constitute legal
        advice.
      </p>
    </LegalShell>
  );
}
