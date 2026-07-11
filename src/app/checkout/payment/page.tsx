import { CheckoutGuard } from '@/components/checkout/checkout-guard';
import { PaymentForm } from '@/components/checkout/payment-form';
import { CheckoutSummary } from '@/components/checkout/checkout-summary';

export default function PaymentPage() {
  return (
    <CheckoutGuard requireShipping>
      <div className="grid gap-10 lg:grid-cols-[1fr_20rem]">
        <PaymentForm />
        <CheckoutSummary />
      </div>
    </CheckoutGuard>
  );
}
