import { CheckoutGuard } from '@/components/checkout/checkout-guard';
import { ShippingForm } from '@/components/checkout/shipping-form';
import { CheckoutSummary } from '@/components/checkout/checkout-summary';

export default function ShippingPage() {
  return (
    <CheckoutGuard>
      <div className="grid gap-10 lg:grid-cols-[1fr_20rem]">
        <ShippingForm />
        <CheckoutSummary />
      </div>
    </CheckoutGuard>
  );
}
